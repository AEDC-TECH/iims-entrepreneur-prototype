const clamp = (
  value,
  min,
  max
) =>
  Math.min(
    max,
    Math.max(min, value)
  );


const money = (
  value
) =>
  Math.round(
    Number(value || 0) * 100
  ) / 100;


const getProfit = (
  business
) =>
  Number(
    business.revenue || 0
  ) -
  Number(
    business.expenses || 0
  );


const getTrackedLoanBalance = (
  state
) =>
  (
    state.financing?.loans ||
    []
  )
    .filter(
      (loan) =>
        loan.status === "active" ||
        loan.status === "delinquent"
    )
    .reduce(
      (sum, loan) =>
        sum +
        Number(
          loan.outstandingBalance ||
          0
        ),
      0
    );


export const calculateMonthlyPayment = ({
  principal,
  annualInterestRate,
  termMonths,
}) => {
  const amount =
    Number(principal || 0);

  const months =
    Number(termMonths || 0);

  const annualRate =
    Number(
      annualInterestRate || 0
    );


  if (
    amount <= 0 ||
    months <= 0
  ) {
    return 0;
  }


  const monthlyRate =
    annualRate /
    100 /
    12;


  if (monthlyRate === 0) {
    return money(
      amount / months
    );
  }


  const payment =
    amount *
    monthlyRate /
    (
      1 -
      Math.pow(
        1 + monthlyRate,
        -months
      )
    );


  return money(payment);
};


const calculatePrincipalFromPayment = ({
  monthlyPayment,
  annualInterestRate,
  termMonths,
}) => {
  const payment =
    Number(
      monthlyPayment || 0
    );

  const months =
    Number(termMonths || 0);

  const monthlyRate =
    Number(
      annualInterestRate || 0
    ) /
    100 /
    12;


  if (
    payment <= 0 ||
    months <= 0
  ) {
    return 0;
  }


  if (monthlyRate === 0) {
    return money(
      payment * months
    );
  }


  return money(
    payment *
    (
      1 -
      Math.pow(
        1 + monthlyRate,
        -months
      )
    ) /
    monthlyRate
  );
};


export const getExistingMonthlyDebtService = (
  state
) => {
  const trackedLoans =
    state.financing?.loans ||
    [];


  const trackedPayment =
    trackedLoans
      .filter(
        (loan) =>
          loan.status ===
            "active" ||
          loan.status ===
            "delinquent"
      )
      .reduce(
        (sum, loan) =>
          sum +
          Number(
            loan.monthlyPayment ||
            0
          ),
        0
      );


  /*
   * Some of the original simulation debt existed
   * before the loan engine was introduced.
   *
   * We estimate a payment on this untracked debt
   * so it still affects affordability.
   */
  const totalDebt =
    Number(
      state.business.debt ||
      0
    );


  const trackedBalance =
    getTrackedLoanBalance(
      state
    );


  const legacyDebt =
    Math.max(
      0,
      totalDebt -
      trackedBalance
    );


  const estimatedLegacyPayment =
    calculateMonthlyPayment({
      principal:
        legacyDebt,

      annualInterestRate:
        12,

      termMonths:
        36,
    });


  return money(
    trackedPayment +
    estimatedLegacyPayment
  );
};


export const calculateCreditProfile = (
  state
) => {
  const business =
    state.business;


  const revenue =
    Number(
      business.revenue || 0
    );

  const expenses =
    Number(
      business.expenses || 0
    );

  const cash =
    Number(
      business.cash || 0
    );

  const debt =
    Number(
      business.debt || 0
    );

  const assets =
    Number(
      business.assets || 0
    );

  const receivables =
    Math.max(
      0,
      Number(
        business.receivables || 0
      )
    );


  const profit =
    revenue - expenses;


  const margin =
    revenue > 0
      ? profit / revenue
      : 0;


  const runway =
    expenses > 0
      ? cash / expenses
      : 0;


  const debtToAssets =
    assets > 0
      ? debt / assets
      : 1;


  const receivablesRatio =
    revenue > 0
      ? receivables / revenue
      : 1;


  const events =
    state.financing
      ?.creditEvents || [];


  const missedPayments =
    events.filter(
      (event) =>
        event.type ===
        "MISSED_PAYMENT"
    ).length;


  const latePayments =
    events.filter(
      (event) =>
        event.type ===
        "LATE_PAYMENT"
    ).length;


  const onTimePayments =
    events.filter(
      (event) =>
        event.type ===
        "ON_TIME_PAYMENT"
    ).length;


  // -----------------------------------------------
  // PAYMENT HISTORY
  // -----------------------------------------------

  let paymentHistory = 72;

  paymentHistory +=
    Math.min(
      onTimePayments * 3,
      20
    );

  paymentHistory -=
    missedPayments * 18;

  paymentHistory -=
    latePayments * 8;


  // -----------------------------------------------
  // CASH FLOW
  // -----------------------------------------------

  let cashFlow = 50;

  if (profit > 0) {
    cashFlow += 15;
  } else {
    cashFlow -= 25;
  }

  cashFlow +=
    clamp(
      margin * 100,
      -20,
      25
    );


  // -----------------------------------------------
  // DEBT BURDEN
  // -----------------------------------------------

  const debtBurden =
    clamp(
      100 -
      debtToAssets * 100,
      0,
      100
    );


  // -----------------------------------------------
  // LIQUIDITY
  // -----------------------------------------------

  const liquidity =
    clamp(
      runway * 45,
      0,
      100
    );


  // -----------------------------------------------
  // PROFITABILITY
  // -----------------------------------------------

  const profitability =
    clamp(
      50 +
      margin * 120,
      0,
      100
    );


  // -----------------------------------------------
  // FINANCIAL DISCIPLINE
  // -----------------------------------------------

  let discipline = 75;

  discipline -=
    clamp(
      receivablesRatio *
        35,
      0,
      25
    );

  discipline -=
    clamp(
      (
        Number(
          business.risk || 0
        ) -
        40
      ) *
        0.4,
      0,
      25
    );


  paymentHistory =
    clamp(
      paymentHistory,
      0,
      100
    );

  cashFlow =
    clamp(
      cashFlow,
      0,
      100
    );

  discipline =
    clamp(
      discipline,
      0,
      100
    );


  const score =
    Math.round(
      paymentHistory * 0.25 +
      cashFlow * 0.20 +
      debtBurden * 0.20 +
      liquidity * 0.15 +
      profitability * 0.10 +
      discipline * 0.10
    );


  let band =
    "Weak";

  if (score >= 85) {
    band = "Excellent";
  } else if (score >= 75) {
    band = "Strong";
  } else if (score >= 65) {
    band = "Good";
  } else if (score >= 55) {
    band = "Fair";
  }


  return {
    score:
      clamp(
        score,
        0,
        100
      ),

    band,

    components: {
      paymentHistory:
        Math.round(
          paymentHistory
        ),

      cashFlow:
        Math.round(
          cashFlow
        ),

      debtBurden:
        Math.round(
          debtBurden
        ),

      liquidity:
        Math.round(
          liquidity
        ),

      profitability:
        Math.round(
          profitability
        ),

      financialDiscipline:
        Math.round(
          discipline
        ),
    },

    metrics: {
      profit:
        money(profit),

      profitMargin:
        margin * 100,

      cashRunway:
        runway,

      debtToAssets:
        debtToAssets *
        100,

      missedPayments,

      latePayments,

      onTimePayments,
    },
  };
};


const interestRateFromScore = (
  score
) => {
  if (score >= 85) {
    return 10.5;
  }

  if (score >= 75) {
    return 12.5;
  }

  if (score >= 65) {
    return 15;
  }

  if (score >= 55) {
    return 18;
  }

  return 22.5;
};


export const calculateLoanOffer = (
  state,
  application
) => {
  const requestedAmount =
    Math.max(
      0,
      Number(
        application.amount ||
        0
      )
    );


  const termMonths =
    clamp(
      Number(
        application.termMonths ||
        36
      ),
      6,
      84
    );


  const profile =
    calculateCreditProfile(
      state
    );


  const interestRate =
    interestRateFromScore(
      profile.score
    );


  const initiationFee =
    money(
      requestedAmount *
      0.015
    );


  const requestedPayment =
    calculateMonthlyPayment({
      principal:
        requestedAmount,

      annualInterestRate:
        interestRate,

      termMonths,
    });


  const monthlyProfit =
    Math.max(
      0,
      getProfit(
        state.business
      )
    );


  const existingDebtService =
    getExistingMonthlyDebtService(
      state
    );


  /*
   * Target minimum debt-service coverage:
   * 1.30x
   *
   * Available debt service therefore equals:
   *
   * operating profit / 1.30
   * minus current loan commitments.
   */
  const affordableNewPayment =
    Math.max(
      0,
      monthlyProfit /
        1.3 -
        existingDebtService
    );


  const affordabilityPrincipal =
    calculatePrincipalFromPayment({
      monthlyPayment:
        affordableNewPayment,

      annualInterestRate:
        interestRate,

      termMonths,
    });


  const assets =
    Math.max(
      Number(
        state.business.assets ||
        0
      ),
      1
    );


  /*
   * We stop total debt from exceeding
   * approximately 85% of assets for a
   * normal approval.
   */
  const maximumDebtByAssets =
    assets * 0.85;


  const debtCapacity =
    Math.max(
      0,
      maximumDebtByAssets -
      Number(
        state.business.debt ||
        0
      )
    );


  const maximumAffordableAmount =
    money(
      Math.max(
        0,
        Math.min(
          affordabilityPrincipal,
          debtCapacity
        )
      )
    );


  let status =
    "DECLINED";


  let approvedAmount = 0;


  let reason =
    "The business does not currently demonstrate enough repayment capacity for this loan.";


  if (
    requestedAmount <= 0
  ) {
    reason =
      "Enter a valid loan amount.";
  } else if (
    profile.score < 45
  ) {
    reason =
      "The simulated business credit profile is currently too weak for approval.";
  } else if (
    monthlyProfit <= 0
  ) {
    reason =
      "The business is not currently generating positive monthly operating profit.";
  } else if (
    requestedPayment <=
      affordableNewPayment &&
    requestedAmount <=
      debtCapacity
  ) {
    status =
      "APPROVED";

    approvedAmount =
      requestedAmount;

    reason =
      "The requested loan fits within the business's current simulated repayment capacity.";
  } else if (
    maximumAffordableAmount >=
      Math.max(
        50000,
        requestedAmount *
          0.25
      )
  ) {
    status =
      "PARTIAL";

    approvedAmount =
      Math.min(
        requestedAmount,
        maximumAffordableAmount
      );

    reason =
      "The full request is above the business's current repayment capacity, but a smaller facility may be affordable.";
  }


  const approvedPayment =
    approvedAmount > 0
      ? calculateMonthlyPayment({
          principal:
            approvedAmount,

          annualInterestRate:
            interestRate,

          termMonths,
        })
      : 0;


  const totalRepayment =
    money(
      approvedPayment *
      termMonths
    );


  const totalInterest =
    money(
      Math.max(
        0,
        totalRepayment -
        approvedAmount
      )
    );


  const projectedDebtService =
    money(
      existingDebtService +
      approvedPayment
    );


  const projectedDscr =
    projectedDebtService > 0
      ? monthlyProfit /
        projectedDebtService
      : 0;


  const projectedDebt =
    Number(
      state.business.debt ||
      0
    ) +
    approvedAmount;


  const projectedDebtToAssets =
    assets > 0
      ? (
          projectedDebt /
          assets
        ) *
        100
      : 0;


  return {
    id:
      `loan-offer-${Date.now()}`,

    application: {
      requestedAmount:
        money(
          requestedAmount
        ),

      termMonths,

      purpose:
        application.purpose ||
        "Working capital",
    },

    creditProfile:
      profile,

    status,

    reason,

    interestRate,

    initiationFee:
      approvedAmount > 0
        ? money(
            approvedAmount *
            0.015
          )
        : initiationFee,

    approvedAmount:
      money(
        approvedAmount
      ),

    monthlyPayment:
      approvedPayment,

    totalInterest,

    totalRepayment,

    existingDebtService,

    projectedDebtService,

    projectedDscr,

    projectedDebt:
      money(
        projectedDebt
      ),

    projectedDebtToAssets,

    affordability: {
      monthlyProfit:
        money(
          monthlyProfit
        ),

      maximumAffordablePayment:
        money(
          affordableNewPayment
        ),

      maximumAffordableAmount:
        money(
          maximumAffordableAmount
        ),
    },

    createdAt:
      new Date()
        .toISOString(),
  };
};


export const acceptLoanOffer = (
  state,
  offer
) => {
  if (
    !offer ||
    ![
      "APPROVED",
      "PARTIAL",
    ].includes(
      offer.status
    ) ||
    offer.approvedAmount <= 0
  ) {
    return state;
  }


  const financing =
    state.financing || {
      loans: [],
      creditEvents: [],
      applications: [],
      lastLoanOffer: null,
    };


  const principal =
    offer.approvedAmount;


  const monthlyRate =
    offer.interestRate /
    100 /
    12;


  const firstMonthInterest =
    money(
      principal *
      monthlyRate
    );


  const loan = {
    id:
      `business-loan-${Date.now()}`,

    lender:
      "Ubuntu Commercial Bank",

    purpose:
      offer.application
        .purpose,

    originalPrincipal:
      principal,

    outstandingBalance:
      principal,

    annualInterestRate:
      offer.interestRate,

    termMonths:
      offer.application
        .termMonths,

    remainingMonths:
      offer.application
        .termMonths,

    monthlyPayment:
      offer.monthlyPayment,

    totalInterestProjected:
      offer.totalInterest,

    totalRepaymentProjected:
      offer.totalRepayment,

    initiationFee:
      offer.initiationFee,

    currentMonthlyInterestContribution:
      firstMonthInterest,

    status:
      "active",

    payments: [],

    originatedAt:
      new Date()
        .toISOString(),
  };


  return {
    ...state,

    business: {
      ...state.business,

      cash:
        money(
          Number(
            state.business.cash ||
            0
          ) +
          principal -
          offer.initiationFee
        ),

      debt:
        money(
          Number(
            state.business.debt ||
            0
          ) +
          principal
        ),

      liabilities:
        money(
          Number(
            state.business.liabilities ||
            0
          ) +
          principal
        ),

      expenses:
        money(
          Number(
            state.business.expenses ||
            0
          ) +
          firstMonthInterest
        ),
    },

    financing: {
      ...financing,

      loans: [
        ...(financing.loans ||
          []),
        loan,
      ],

      applications: [
        ...(financing.applications ||
          []),

        {
          ...offer.application,

          result:
            offer.status,

          approvedAmount:
            offer.approvedAmount,

          interestRate:
            offer.interestRate,

          createdAt:
            offer.createdAt,
        },
      ],

      creditEvents: [
        ...(financing.creditEvents ||
          []),

        {
          id:
            `credit-event-${Date.now()}`,

          type:
            "LOAN_APPROVED",

          loanId:
            loan.id,

          amount:
            principal,

          createdAt:
            new Date()
              .toISOString(),
        },
      ],

      lastLoanOffer:
        offer,
    },

    activityLog: [
      ...(state.activityLog ||
        []),

      {
        id:
          `loan-activity-${Date.now()}`,

        type:
          "LOAN_ORIGINATED",

        day:
          state.currentDay,

        title:
          "Business loan accepted",

        description:
          `${offer.application.termMonths}-month loan accepted at ${offer.interestRate}% annual interest.`,

        createdAt:
          new Date()
            .toISOString(),
      },
    ],
  };
};


export const processLoanPayments = (
  state
) => {
  const financing =
    state.financing;


  if (
    !financing?.loans?.length
  ) {
    return state;
  }


  let cash =
    Number(
      state.business.cash ||
      0
    );

  let debt =
    Number(
      state.business.debt ||
      0
    );

  let liabilities =
    Number(
      state.business.liabilities ||
      0
    );

  let expenses =
    Number(
      state.business.expenses ||
      0
    );


  const creditEvents = [
    ...(financing.creditEvents ||
      []),
  ];


  const updatedLoans =
    financing.loans.map(
      (loan) => {
        if (
          loan.status !==
            "active" &&
          loan.status !==
            "delinquent"
        ) {
          return loan;
        }


        if (
          loan.outstandingBalance <=
          0
        ) {
          return {
            ...loan,

            status:
              "paid",
          };
        }


        const monthlyRate =
          loan.annualInterestRate /
          100 /
          12;


        const interest =
          money(
            loan.outstandingBalance *
            monthlyRate
          );


        const scheduledPayment =
          money(
            Math.min(
              loan.monthlyPayment,
              loan.outstandingBalance +
                interest
            )
          );


        if (
          cash <
          scheduledPayment
        ) {
          creditEvents.push({
            id:
              `credit-event-${Date.now()}-${loan.id}`,

            type:
              "MISSED_PAYMENT",

            loanId:
              loan.id,

            amount:
              scheduledPayment,

            createdAt:
              new Date()
                .toISOString(),
          });


          return {
            ...loan,

            status:
              "delinquent",

            payments: [
              ...(loan.payments ||
                []),

              {
                id:
                  `payment-${Date.now()}`,

                status:
                  "missed",

                amount:
                  scheduledPayment,

                interest,

                principal: 0,

                createdAt:
                  new Date()
                    .toISOString(),
              },
            ],
          };
        }


        const principalPaid =
          money(
            Math.max(
              0,
              scheduledPayment -
                interest
            )
          );


        const newBalance =
          money(
            Math.max(
              0,
              loan.outstandingBalance -
                principalPaid
            )
          );


        cash =
          money(
            cash -
            scheduledPayment
          );


        debt =
          money(
            Math.max(
              0,
              debt -
                principalPaid
            )
          );


        liabilities =
          money(
            Math.max(
              0,
              liabilities -
                principalPaid
            )
          );


        const nextInterest =
          money(
            newBalance *
            monthlyRate
          );


        /*
         * Expenses represent the current monthly
         * operating picture, so replace the previous
         * interest contribution with the new one.
         */
        expenses =
          money(
            expenses -
            Number(
              loan.currentMonthlyInterestContribution ||
              0
            ) +
            nextInterest
          );


        creditEvents.push({
          id:
            `credit-event-${Date.now()}-${loan.id}`,

          type:
            "ON_TIME_PAYMENT",

          loanId:
            loan.id,

          amount:
            scheduledPayment,

          principal:
            principalPaid,

          interest,

          createdAt:
            new Date()
              .toISOString(),
        });


        return {
          ...loan,

          outstandingBalance:
            newBalance,

          remainingMonths:
            Math.max(
              0,
              loan.remainingMonths -
                1
            ),

          currentMonthlyInterestContribution:
            nextInterest,

          status:
            newBalance <= 0
              ? "paid"
              : "active",

          payments: [
            ...(loan.payments ||
              []),

            {
              id:
                `payment-${Date.now()}`,

              status:
                "paid",

              amount:
                scheduledPayment,

              principal:
                principalPaid,

              interest,

              balanceAfter:
                newBalance,

              createdAt:
                new Date()
                  .toISOString(),
            },
          ],
        };
      }
    );


  return {
    ...state,

    business: {
      ...state.business,

      cash,

      debt,

      liabilities,

      expenses,
    },

    financing: {
      ...financing,

      loans:
        updatedLoans,

      creditEvents,
    },
  };
};


export const getLoanPortfolio = (
  state
) => {
  const loans =
    state.financing?.loans ||
    [];


  const activeLoans =
    loans.filter(
      (loan) =>
        loan.status ===
          "active" ||
        loan.status ===
          "delinquent"
    );


  return {
    loans,

    activeLoans,

    totalOutstanding:
      money(
        activeLoans.reduce(
          (sum, loan) =>
            sum +
            Number(
              loan.outstandingBalance ||
              0
            ),
          0
        )
      ),

    monthlyDebtService:
      money(
        getExistingMonthlyDebtService(
          state
        )
      ),

    creditProfile:
      calculateCreditProfile(
        state
      ),
  };
};


// ============================================================
// EXTRA LOAN REPAYMENTS
// Allows an entrepreneur to voluntarily reduce a loan when
// the business has sufficient cash reserves.
// ============================================================

const simulateRemainingLoan = ({
  balance,
  annualInterestRate,
  monthlyPayment,
}) => {
  let remainingBalance =
    Math.max(0, Number(balance) || 0);

  const payment =
    Math.max(
      0,
      Number(monthlyPayment) || 0
    );

  const monthlyRate =
    Math.max(
      0,
      Number(annualInterestRate) || 0
    ) /
    100 /
    12;

  let months = 0;
  let totalInterest = 0;

  // Safety guard against impossible/infinite schedules.
  while (
    remainingBalance > 0.01 &&
    months < 600
  ) {
    const interest =
      remainingBalance *
      monthlyRate;

    const principal =
      Math.min(
        remainingBalance,
        Math.max(
          0,
          payment - interest
        )
      );

    // Payment is too small to reduce principal.
    if (principal <= 0) {
      return {
        months: 600,
        totalInterest:
          totalInterest +
          interest,
        sustainable: false,
      };
    }

    totalInterest +=
      interest;

    remainingBalance -=
      principal;

    months += 1;
  }

  return {
    months,
    totalInterest,
    sustainable: true,
  };
};


export const getExtraLoanPaymentCapacity = (
  state,
  loanId
) => {
  const business =
    state?.business || {};

  const loan =
    (
      state?.financing?.loans ||
      []
    ).find(
      (item) =>
        item.id === loanId &&
        item.status === "active"
    );

  if (!loan) {
    return {
      eligible: false,
      reason:
        "No active loan was found.",
      maximumExtraPayment: 0,
      minimumCashReserve: 0,
      availableCashAboveReserve: 0,
    };
  }

  const cash =
    Math.max(
      0,
      Number(business.cash) || 0
    );

  const monthlyExpenses =
    Math.max(
      0,
      Number(business.expenses) || 0
    );

  // Keep at least 1.5 months of operating expenses.
  const minimumCashReserve =
    monthlyExpenses * 1.5;

  const availableCashAboveReserve =
    Math.max(
      0,
      cash -
        minimumCashReserve
    );

  const outstandingBalance =
    Math.max(
      0,
      Number(
        loan.outstandingBalance
      ) || 0
    );

  const maximumExtraPayment =
    Math.min(
      availableCashAboveReserve,
      outstandingBalance
    );

  return {
    eligible:
      maximumExtraPayment >=
      1000,

    reason:
      maximumExtraPayment >=
      1000
        ? "The business has enough cash above its recommended operating reserve to consider an extra loan payment."
        : "Build a stronger cash reserve before making an extra loan payment.",

    minimumCashReserve,
    availableCashAboveReserve,
    maximumExtraPayment,
    loan,
  };
};


export const calculateExtraLoanPaymentImpact = (
  state,
  loanId,
  requestedAmount
) => {
  const capacity =
    getExtraLoanPaymentCapacity(
      state,
      loanId
    );

  const loan =
    capacity.loan;

  if (!loan) {
    return {
      valid: false,
      reason:
        "Active loan not found.",
    };
  }

  const amount =
    Math.max(
      0,
      Number(
        requestedAmount
      ) || 0
    );

  if (amount < 1000) {
    return {
      valid: false,
      reason:
        "Enter an extra payment of at least R1,000.",
    };
  }

  if (
    amount >
    capacity.maximumExtraPayment
  ) {
    return {
      valid: false,
      reason:
        "This payment would reduce the business cash reserve too far.",
      ...capacity,
    };
  }

  const openingBalance =
    Math.max(
      0,
      Number(
        loan.outstandingBalance
      ) || 0
    );

  const extraPayment =
    Math.min(
      amount,
      openingBalance
    );

  const newBalance =
    Math.max(
      0,
      openingBalance -
        extraPayment
    );

  const normalSchedule =
    simulateRemainingLoan({
      balance:
        openingBalance,
      annualInterestRate:
        loan.annualInterestRate,
      monthlyPayment:
        loan.monthlyPayment,
    });

  const newSchedule =
    simulateRemainingLoan({
      balance:
        newBalance,
      annualInterestRate:
        loan.annualInterestRate,
      monthlyPayment:
        loan.monthlyPayment,
    });

  const cashBefore =
    Math.max(
      0,
      Number(
        state?.business?.cash
      ) || 0
    );

  const cashAfter =
    Math.max(
      0,
      cashBefore -
        extraPayment
    );

  return {
    valid: true,

    loanId:
      loan.id,

    loanName:
      loan.lender ||
      "Business Loan",

    openingBalance,
    extraPayment,
    newBalance,

    cashBefore,
    cashAfter,

    minimumCashReserve:
      capacity.minimumCashReserve,

    normalRemainingMonths:
      normalSchedule.months,

    newRemainingMonths:
      newSchedule.months,

    monthsSaved:
      Math.max(
        0,
        normalSchedule.months -
          newSchedule.months
      ),

    normalRemainingInterest:
      normalSchedule.totalInterest,

    newRemainingInterest:
      newSchedule.totalInterest,

    estimatedInterestSaved:
      Math.max(
        0,
        normalSchedule.totalInterest -
          newSchedule.totalInterest
      ),
  };
};


export const applyExtraLoanPayment = (
  state,
  loanId,
  requestedAmount
) => {
  const impact =
    calculateExtraLoanPaymentImpact(
      state,
      loanId,
      requestedAmount
    );

  if (!impact.valid) {
    return {
      state,
      applied: false,
      reason:
        impact.reason,
      impact,
    };
  }

  const loans =
    (
      state.financing?.loans ||
      []
    ).map(
      (loan) => {
        if (
          loan.id !== loanId
        ) {
          return loan;
        }

        const previousPayments =
          loan.payments || [];

        const extraPaymentRecord = {
          id:
            `extra-${Date.now()}`,

          type:
            "EXTRA_PAYMENT",

          day:
            state.currentDay,

          amount:
            impact.extraPayment,

          principal:
            impact.extraPayment,

          interest: 0,

          openingBalance:
            impact.openingBalance,

          closingBalance:
            impact.newBalance,

          createdAt:
            new Date()
              .toISOString(),
        };

        return {
          ...loan,

          outstandingBalance:
            impact.newBalance,

          remainingMonths:
            impact.newRemainingMonths,

          status:
            impact.newBalance <=
            0.01
              ? "paid"
              : "active",

          payments: [
            ...previousPayments,
            extraPaymentRecord,
          ],
        };
      }
    );

  const business =
    state.business || {};

  const nextState = {
    ...state,

    business: {
      ...business,

      cash:
        Math.max(
          0,
          (Number(
            business.cash
          ) || 0) -
            impact.extraPayment
        ),

      debt:
        Math.max(
          0,
          (Number(
            business.debt
          ) || 0) -
            impact.extraPayment
        ),

      liabilities:
        Math.max(
          0,
          (Number(
            business.liabilities
          ) || 0) -
            impact.extraPayment
        ),
    },

    financing: {
      ...(state.financing || {}),
      loans,

      creditEvents: [
        ...(
          state.financing
            ?.creditEvents ||
          []
        ),
        {
          id:
            `credit-extra-${Date.now()}`,

          type:
            "EXTRA_LOAN_PAYMENT",

          day:
            state.currentDay,

          amount:
            impact.extraPayment,

          loanId,

          createdAt:
            new Date()
              .toISOString(),
        },
      ],
    },

    activityLog: [
      ...(
        state.activityLog ||
        []
      ),
      {
        id:
          `activity-extra-loan-${Date.now()}`,

        type:
          "EXTRA_LOAN_PAYMENT",

        day:
          state.currentDay,

        amount:
          impact.extraPayment,

        loanId,

        message:
          `Extra loan payment of R${Math.round(
            impact.extraPayment
          ).toLocaleString(
            "en-ZA"
          )} made.`,

        createdAt:
          new Date()
            .toISOString(),
      },
    ],
  };

  return {
    state: nextState,
    applied: true,
    impact,
  };
};
