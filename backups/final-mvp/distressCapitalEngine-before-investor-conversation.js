const money = (value) =>
  Math.round(
    Number(value || 0) * 100
  ) / 100;


const clamp = (
  value,
  minimum,
  maximum
) =>
  Math.max(
    minimum,
    Math.min(
      maximum,
      Number(value || 0)
    )
  );


const roundTo5000 = (
  value
) =>
  Math.max(
    5000,
    Math.round(
      Number(value || 0) /
      5000
    ) * 5000
  );


const normaliseStatus = (
  value
) =>
  String(
    value || ""
  ).toLowerCase();


const activeLoan = (
  loan
) =>
  [
    "active",
    "delinquent",
  ].includes(
    normaliseStatus(
      loan?.status
    )
  ) &&
  Number(
    loan?.outstandingBalance ||
    0
  ) > 0;


const getActiveLoans = (
  state
) =>
  (
    state?.financing?.loans ||
    []
  ).filter(
    activeLoan
  );


const calculateMonthlyDebtService = (
  loans
) =>
  money(
    loans
      .filter(
        activeLoan
      )
      .reduce(
        (
          total,
          loan
        ) =>
          total +
          Number(
            loan.monthlyPayment ||
            0
          ),
        0
      )
  );


const calculateMissedPayments = (
  state
) => {
    const creditMisses =
      (
        state
          ?.financing
          ?.creditEvents ||
        []
      ).filter(
        (event) =>
          String(
            event?.type ||
            ""
          ).toUpperCase() ===
          "MISSED_PAYMENT"
      ).length;


    const loanMisses =
      getActiveLoans(
        state
      ).reduce(
        (
          total,
          loan
        ) =>
          total +
          (
            loan.payments ||
            []
          ).filter(
            (payment) =>
              normaliseStatus(
                payment?.status
              ) ===
              "missed"
          ).length,
        0
      );


    return Math.max(
      creditMisses,
      loanMisses
    );
  };


const calculatePayment = (
  balance,
  annualRate,
  months
) => {
    const principal =
      Math.max(
        0,
        Number(
          balance || 0
        )
      );


    const term =
      Math.max(
        1,
        Number(
          months || 1
        )
      );


    const monthlyRate =
      Math.max(
        0,
        Number(
          annualRate || 0
        ) /
        100 /
        12
      );


    if (
      monthlyRate === 0
    ) {
      return money(
        principal /
        term
      );
    }


    const payment =
      principal *
      (
        monthlyRate *
        Math.pow(
          1 + monthlyRate,
          term
        )
      ) /
      (
        Math.pow(
          1 + monthlyRate,
          term
        ) -
        1
      );


    return money(
      payment
    );
  };


const applyDebtPaydown = (
  loans,
  requestedAmount
) => {
    let remaining =
      Math.max(
        0,
        Number(
          requestedAmount ||
          0
        )
      );


    let actualPaydown = 0;


    /*
     * Delinquent loans first.
     * Then loans with the largest monthly
     * repayment pressure.
     */
    const rankedIds =
      [...loans]
        .filter(
          activeLoan
        )
        .sort(
          (
            left,
            right
          ) => {
            const leftLate =
              normaliseStatus(
                left.status
              ) ===
              "delinquent"
                ? 1
                : 0;

            const rightLate =
              normaliseStatus(
                right.status
              ) ===
              "delinquent"
                ? 1
                : 0;


            if (
              leftLate !==
              rightLate
            ) {
              return (
                rightLate -
                leftLate
              );
            }


            return (
              Number(
                right.monthlyPayment ||
                0
              ) -
              Number(
                left.monthlyPayment ||
                0
              )
            );
          }
        )
        .map(
          (loan) =>
            loan.id
        );


    let updatedLoans =
      loans.map(
        (loan) => ({
          ...loan,
        })
      );


    for (
      const loanId
      of rankedIds
    ) {
      if (
        remaining <= 0
      ) {
        break;
      }


      updatedLoans =
        updatedLoans.map(
          (loan) => {
            if (
              loan.id !==
              loanId
            ) {
              return loan;
            }


            const balance =
              Number(
                loan.outstandingBalance ||
                0
              );


            const payment =
              Math.min(
                balance,
                remaining
              );


            const newBalance =
              money(
                balance -
                payment
              );


            remaining =
              money(
                remaining -
                payment
              );


            actualPaydown =
              money(
                actualPaydown +
                payment
              );


            return {
              ...loan,

              outstandingBalance:
                newBalance,

              status:
                newBalance <= 0
                  ? "paid"
                  : loan.status,

              currentMonthlyInterestContribution:
                newBalance <= 0
                  ? 0
                  : money(
                      newBalance *
                      (
                        Number(
                          loan.annualInterestRate ||
                          0
                        ) /
                        100 /
                        12
                      )
                    ),

              rescuePaydowns: [
                ...(
                  loan.rescuePaydowns ||
                  []
                ),

                {
                  amount:
                    payment,

                  createdAt:
                    new Date()
                      .toISOString(),
                },
              ],
            };
          }
        );
    }


    return {
      loans:
        updatedLoans,

      actualPaydown:
        money(
          actualPaydown
        ),
    };
  };


const restructureLoans = (
  loans
) =>
  loans.map(
    (loan) => {
      if (
        !activeLoan(
          loan
        )
      ) {
        return loan;
      }


      const balance =
        Number(
          loan.outstandingBalance ||
          0
        );


      const newTerm =
        Math.max(
          1,
          Number(
            loan.remainingMonths ||
            1
          ) +
          12
        );


      return {
        ...loan,

        remainingMonths:
          newTerm,

        monthlyPayment:
          calculatePayment(
            balance,
            loan.annualInterestRate,
            newTerm
          ),

        restructured:
          true,

        restructuringEvents: [
          ...(
            loan
              .restructuringEvents ||
            []
          ),

          {
            type:
              "DISTRESS_RESTRUCTURE",

            addedMonths:
              12,

            createdAt:
              new Date()
                .toISOString(),
          },
        ],
      };
    }
  );


const previewOffer = (
  state,
  offer
) => {
    const business =
      state.business ||
      {};


    const originalLoans =
      state.financing
        ?.loans ||
      [];


    const paydownResult =
      applyDebtPaydown(
        originalLoans,
        offer.debtPaydown
      );


    let previewLoans =
      paydownResult.loans;


    if (
      offer.restructure
    ) {
      previewLoans =
        restructureLoans(
          previewLoans
        );
    }


    const founderBefore =
      Number(
        business.founderOwnership ??
        100
      );


    const founderAfter =
      offer.equitySold > 0
        ? money(
            founderBefore *
            (
              1 -
              (
                offer.equitySold /
                100
              )
            )
          )
        : founderBefore;


    const cashBefore =
      Number(
        business.cash ||
        0
      );


    const workingCapital =
      Math.max(
        0,
        offer.investmentAmount -
        paydownResult.actualPaydown
      );


    return {
      ...offer,

      actualDebtPaydown:
        paydownResult
          .actualPaydown,

      workingCapital:
        money(
          workingCapital
        ),

      cashBefore:
        money(
          cashBefore
        ),

      cashAfter:
        money(
          cashBefore +
          workingCapital
        ),

      debtBefore:
        money(
          business.debt ||
          0
        ),

      debtAfter:
        money(
          Math.max(
            0,
            Number(
              business.debt ||
              0
            ) -
            paydownResult
              .actualPaydown
          )
        ),

      founderBefore,
      founderAfter,

      monthlyDebtServiceBefore:
        calculateMonthlyDebtService(
          originalLoans
        ),

      monthlyDebtServiceAfter:
        calculateMonthlyDebtService(
          previewLoans
        ),

      previewLoans,
    };
  };


const buildOffers = (
  state,
  critical
) => {
    const business =
      state.business ||
      {};


    const debt =
      Math.max(
        0,
        Number(
          business.debt ||
          0
        )
      );


    const cash =
      Number(
        business.cash ||
        0
      );


    const operatingLoss =
      Math.max(
        0,
        Number(
          business.expenses ||
          0
        ) -
        Number(
          business.revenue ||
          0
        )
      );


    const activeLoans =
      getActiveLoans(
        state
      );


    const debtService =
      calculateMonthlyDebtService(
        activeLoans
      );


    const rescueGap =
      Math.max(
        0,
        -cash
      ) +
      (
        operatingLoss *
        2
      ) +
      (
        debtService *
        2
      );


    const minorityInvestment =
      clamp(
        roundTo5000(
          Math.max(
            180000,
            rescueGap
          )
        ),
        150000,
        325000
      );


    const structuredInvestment =
      clamp(
        roundTo5000(
          Math.max(
            150000,
            rescueGap *
            0.8
          )
        ),
        140000,
        275000
      );


    const controlInvestment =
      clamp(
        roundTo5000(
          Math.max(
            300000,
            rescueGap +
            (
              debt *
              0.25
            )
          )
        ),
        275000,
        500000
      );


    return [
      previewOffer(
        state,
        {
          id:
            "minority-rescue",

          type:
            "EQUITY_RESCUE",

          title:
            "Accept minority rescue investment",

          investor:
            "Strategic Growth Partners",

          investmentAmount:
            minorityInvestment,

          debtPaydown:
            Math.min(
              debt,
              roundTo5000(
                minorityInvestment *
                0.5
              )
            ),

          equitySold:
            critical
              ? 40
              : 35,

          restructure:
            false,

          governance:
            "One board seat and approval rights over major new borrowing.",

          description:
            "The investor injects capital, part of the money is used to reduce debt and the balance becomes working capital.",

          riskEffect:
            -18,
        }
      ),


      previewOffer(
        state,
        {
          id:
            "structured-rescue",

          type:
            "EQUITY_AND_RESTRUCTURE",

          title:
            "Accept investor capital and restructure the remaining debt",

          investor:
            "Turnaround Capital Fund",

          investmentAmount:
            structuredInvestment,

          debtPaydown:
            Math.min(
              debt,
              roundTo5000(
                structuredInvestment *
                0.35
              )
            ),

          equitySold:
            30,

          restructure:
            true,

          governance:
            "Board observer rights. Existing lenders extend remaining loan terms by 12 months.",

          description:
            "Less debt is repaid immediately, but the remaining loans are stretched over a longer period to reduce monthly pressure.",

          riskEffect:
            -14,
        }
      ),


      previewOffer(
        state,
        {
          id:
            "control-rescue",

          type:
            "CONTROL_RESCUE",

          title:
            "Sell control to a rescue investor",

          investor:
            "Ubuntu Recovery Holdings",

          investmentAmount:
            controlInvestment,

          debtPaydown:
            Math.min(
              debt,
              roundTo5000(
                controlInvestment *
                0.6
              )
            ),

          equitySold:
            55,

          restructure:
            false,

          governance:
            "The rescue investor obtains majority control and appoints the board chair.",

          description:
            "This provides the strongest immediate balance-sheet repair, but the founder no longer controls the company.",

          riskEffect:
            -25,
        }
      ),


      {
        id:
          "reject-rescue",

        type:
          "NO_RESCUE",

        title:
          "Reject external rescue capital",

        investor:
          null,

        investmentAmount:
          0,

        debtPaydown:
          0,

        actualDebtPaydown:
          0,

        workingCapital:
          0,

        equitySold:
          0,

        restructure:
          false,

        governance:
          "Founder keeps the current ownership position.",

        description:
          "Keep ownership and attempt to turn the company around without new external capital. The current liquidity and debt problems remain.",

        riskEffect:
          12,

        founderBefore:
          Number(
            business.founderOwnership ??
            100
          ),

        founderAfter:
          Number(
            business.founderOwnership ??
            100
          ),

        cashBefore:
          money(
            cash
          ),

        cashAfter:
          money(
            cash
          ),

        debtBefore:
          money(
            debt
          ),

        debtAfter:
          money(
            debt
          ),

        monthlyDebtServiceBefore:
          debtService,

        monthlyDebtServiceAfter:
          debtService,
      },
    ];
  };


export const getDistressCapitalState = (
  state
) => {
    const business =
      state?.business ||
      {};


    const currentDay =
      Number(
        state?.currentDay ||
        0
      );


    const cash =
      Number(
        business.cash ||
        0
      );


    const revenue =
      Number(
        business.revenue ||
        0
      );


    const expenses =
      Number(
        business.expenses ||
        0
      );


    const profit =
      revenue -
      expenses;


    const debt =
      Number(
        business.debt ||
        0
      );


    const assets =
      Number(
        business.assets ||
        0
      );


    const customers =
      Number(
        business.customers ||
        0
      );


    const risk =
      Number(
        business.risk ||
        0
      );


    const loans =
      getActiveLoans(
        state
      );


    const monthlyDebtService =
      calculateMonthlyDebtService(
        loans
      );


    const missedPayments =
      calculateMissedPayments(
        state
      );


    const debtServiceRatio =
      revenue > 0
        ? monthlyDebtService /
          revenue
        : monthlyDebtService >
          0
          ? 1
          : 0;


    const cashCrisis =
      cash <= 0;


    const operatingLoss =
      profit < 0;


    const debtServicePressure =
      debtServiceRatio >=
      0.15;


    const creditDamage =
      missedPayments >= 1;


    const debtPressure =
      debt >
      Math.max(
        revenue * 1.5,
        assets * 0.65
      );


    const riskPressure =
      risk >= 65;


    let score = 0;


    if (cashCrisis) {
      score += 2;
    }

    if (operatingLoss) {
      score += 2;
    }

    if (debtServicePressure) {
      score += 2;
    }

    if (creditDamage) {
      score += 2;
    }

    if (debtPressure) {
      score += 1;
    }

    if (riskPressure) {
      score += 1;
    }


    const resolvedThisPeriod =
      Boolean(
        state
          ?.distressCapital
          ?.resolved
      ) &&
      Number(
        state
          ?.distressCapital
          ?.resolvedDay
      ) ===
      currentDay;


    const active =
      !resolvedThisPeriod &&
      currentDay >= 6 &&
      (
        (
          cashCrisis &&
          operatingLoss &&
          (
            debtServicePressure ||
            creditDamage
          )
        ) ||
        score >= 6
      );


    const critical =
      active &&
      (
        score >= 8 ||
        (
          cashCrisis &&
          operatingLoss &&
          missedPayments >= 2
        )
      );


    let investabilityScore =
      0;


    if (
      revenue >= 60000
    ) {
      investabilityScore += 1;
    }


    if (
      assets >= 100000
    ) {
      investabilityScore += 1;
    }


    if (
      customers >= 5
    ) {
      investabilityScore += 1;
    }


    if (
      debt > 0
    ) {
      investabilityScore += 1;
    }


    const investorAvailable =
      active &&
      investabilityScore >= 2;


    return {
      active,
      critical,
      score,

      level:
        critical
          ? "CRITICAL"
          : active
            ? "DISTRESSED"
            : "NORMAL",

      investorAvailable,

      investabilityScore,

      metrics: {
        cash:
          money(
            cash
          ),

        revenue:
          money(
            revenue
          ),

        expenses:
          money(
            expenses
          ),

        profit:
          money(
            profit
          ),

        debt:
          money(
            debt
          ),

        monthlyDebtService,

        debtServiceRatio:
          money(
            debtServiceRatio *
            100
          ),

        missedPayments,

        founderOwnership:
          Number(
            business.founderOwnership ??
            100
          ),
      },

      reasons: [
        cashCrisis
          ? "The company has no usable cash buffer."
          : null,

        operatingLoss
          ? "Normal operations are currently loss-making."
          : null,

        debtServicePressure
          ? "Debt repayments consume a dangerous share of monthly revenue."
          : null,

        creditDamage
          ? `${missedPayments} scheduled loan payment${
              missedPayments === 1
                ? " has"
                : "s have"
            } already been missed.`
          : null,

        debtPressure
          ? "The company's debt burden is high relative to its current operating scale."
          : null,
      ].filter(Boolean),

      offers:
        investorAvailable
          ? buildOffers(
              state,
              critical
            )
          : [],

      resolvedThisPeriod,

      latestDecision:
        state
          ?.distressCapital ||
        null,
    };
  };


export const applyDistressCapitalDecision = (
  state,
  optionId
) => {
    const distress =
      getDistressCapitalState(
        state
      );


    if (
      !distress.active
    ) {
      return {
        applied:
          false,

        reason:
          "The business is not currently in structural financial distress.",

        state,
      };
    }


    const offer =
      distress.offers.find(
        (item) =>
          item.id ===
          optionId
      );


    if (!offer) {
      return {
        applied:
          false,

        reason:
          "Choose a valid structural rescue option.",

        state,
      };
    }


    const business =
      state.business ||
      {};


    const timestamp =
      new Date()
        .toISOString();


    if (
      offer.type ===
      "NO_RESCUE"
    ) {
      const nextState = {
        ...state,

        business: {
          ...business,

          risk:
            clamp(
              Number(
                business.risk ||
                0
              ) +
              offer.riskEffect,
              0,
              100
            ),

          customerSatisfaction:
            clamp(
              Number(
                business.customerSatisfaction ||
                50
              ) -
              4,
              0,
              100
            ),

          morale:
            clamp(
              Number(
                business.morale ||
                50
              ) -
              5,
              0,
              100
            ),
        },

        distressCapital: {
          resolved:
            true,

          resolvedDay:
            state.currentDay,

          optionId:
            offer.id,

          type:
            offer.type,

          title:
            offer.title,

          investmentAmount:
            0,

          equitySold:
            0,

          founderOwnershipBefore:
            offer.founderBefore,

          founderOwnershipAfter:
            offer.founderAfter,

          outcome:
            "External rescue capital was rejected. The company keeps its ownership structure, but the financial distress remains.",

          createdAt:
            timestamp,
        },

        activityLog: [
          ...(
            state.activityLog ||
            []
          ),

          {
            id:
              `distress-capital-${Date.now()}`,

            type:
              "DISTRESS_CAPITAL_DECISION",

            day:
              state.currentDay,

            optionId:
              offer.id,

            title:
              offer.title,

            createdAt:
              timestamp,
          },
        ],
      };


      return {
        applied:
          true,

        state:
          nextState,

        offer,
      };
    }


    const originalLoans =
      state.financing
        ?.loans ||
      [];


    const oldInterest =
      originalLoans.reduce(
        (
          total,
          loan
        ) =>
          total +
          Number(
            loan
              .currentMonthlyInterestContribution ||
            0
          ),
        0
      );


    const paydownResult =
      applyDebtPaydown(
        originalLoans,
        offer.debtPaydown
      );


    let updatedLoans =
      paydownResult.loans;


    if (
      offer.restructure
    ) {
      updatedLoans =
        restructureLoans(
          updatedLoans
        );
    }


    const newInterest =
      updatedLoans.reduce(
        (
          total,
          loan
        ) =>
          total +
          Number(
            loan
              .currentMonthlyInterestContribution ||
            0
          ),
        0
      );


    const actualDebtPaydown =
      paydownResult
        .actualPaydown;


    const workingCapital =
      money(
        offer.investmentAmount -
        actualDebtPaydown
      );


    const founderBefore =
      Number(
        business.founderOwnership ??
        100
      );


    const founderAfter =
      money(
        founderBefore *
        (
          1 -
          (
            offer.equitySold /
            100
          )
        )
      );


    const nextState = {
      ...state,

      business: {
        ...business,

        cash:
          money(
            Number(
              business.cash ||
              0
            ) +
            workingCapital
          ),

        debt:
          money(
            Math.max(
              0,
              Number(
                business.debt ||
                0
              ) -
              actualDebtPaydown
            )
          ),

        liabilities:
          money(
            Math.max(
              0,
              Number(
                business.liabilities ||
                0
              ) -
              actualDebtPaydown
            )
          ),

        assets:
          money(
            Number(
              business.assets ||
              0
            ) +
            workingCapital
          ),

        expenses:
          money(
            Math.max(
              0,
              Number(
                business.expenses ||
                0
              ) -
              oldInterest +
              newInterest
            )
          ),

        founderOwnership:
          founderAfter,

        risk:
          clamp(
            Number(
              business.risk ||
              0
            ) +
            offer.riskEffect,
            0,
            100
          ),

        morale:
          clamp(
            Number(
              business.morale ||
              50
            ) +
            4,
            0,
            100
          ),
      },

      financing: {
        ...(
          state.financing ||
          {}
        ),

        loans:
          updatedLoans,

        equityEvents: [
          ...(
            state
              .financing
              ?.equityEvents ||
            []
          ),

          {
            id:
              `equity-rescue-${Date.now()}`,

            type:
              offer.type,

            investor:
              offer.investor,

            investmentAmount:
              offer.investmentAmount,

            equitySold:
              offer.equitySold,

            founderOwnershipBefore:
              founderBefore,

            founderOwnershipAfter:
              founderAfter,

            governance:
              offer.governance,

            createdAt:
              timestamp,
          },
        ],
      },

      distressCapital: {
        resolved:
          true,

        resolvedDay:
          state.currentDay,

        optionId:
          offer.id,

        type:
          offer.type,

        title:
          offer.title,

        investor:
          offer.investor,

        investmentAmount:
          offer.investmentAmount,

        debtPaydown:
          actualDebtPaydown,

        workingCapital,

        equitySold:
          offer.equitySold,

        founderOwnershipBefore:
          founderBefore,

        founderOwnershipAfter:
          founderAfter,

        monthlyDebtServiceBefore:
          offer.monthlyDebtServiceBefore,

        monthlyDebtServiceAfter:
          calculateMonthlyDebtService(
            updatedLoans
          ),

        governance:
          offer.governance,

        restructured:
          offer.restructure,

        outcome:
          `${offer.investor} injected capital into the company. Ownership and control changed as part of the rescue.`,

        createdAt:
          timestamp,
      },

      activityLog: [
        ...(
          state.activityLog ||
          []
        ),

        {
          id:
            `distress-capital-${Date.now()}`,

          type:
            "DISTRESS_CAPITAL_DECISION",

          day:
            state.currentDay,

          optionId:
            offer.id,

          title:
            offer.title,

          investor:
            offer.investor,

          investmentAmount:
            offer.investmentAmount,

          equitySold:
            offer.equitySold,

          createdAt:
            timestamp,
        },
      ],
    };


    return {
      applied:
        true,

      state:
        nextState,

      offer,
    };
  };
