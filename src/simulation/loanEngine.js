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


// ============================================================
// INTERACTIVE LOAN PAYMENT DECISIONS
// ============================================================
//
// Loan repayments must be understood and actively managed by
// the entrepreneur instead of happening invisibly.
//
// Supported actions:
// FULL
// PARTIAL
// RESTRUCTURE
// MISS
// ============================================================


const loanDecisionClamp = (
  value,
  min,
  max
) =>
  Math.min(
    max,
    Math.max(
      min,
      Number(value || 0)
    )
  );


const calculateRestructuredPayment = (
  principal,
  annualRate,
  months
) => {
  const balance =
    Math.max(
      0,
      Number(principal || 0)
    );

  const term =
    Math.max(
      1,
      Number(months || 1)
    );

  const monthlyRate =
    Math.max(
      0,
      Number(annualRate || 0)
    ) /
    100 /
    12;


  if (monthlyRate === 0) {
    return money(
      balance /
      term
    );
  }


  return money(
    balance *
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
      )
  );
};


export const getLoanPaymentsDue = (
  state
) => {
  const currentDay =
    Number(
      state?.currentDay || 0
    );


  return (
    state?.financing?.loans ||
    []
  ).filter(
    (loan) =>
      (
        loan.status === "active" ||
        loan.status === "delinquent"
      ) &&
      Number(
        loan.outstandingBalance ||
          0
      ) > 0.01 &&
      loan.lastPaymentDecisionDay !==
        currentDay
  );
};


export const getLoanPaymentPreview = (
  state,
  loanId
) => {
  const loan =
    (
      state?.financing?.loans ||
      []
    ).find(
      (item) =>
        item.id === loanId
    );


  if (!loan) {
    return null;
  }


  const balance =
    Math.max(
      0,
      Number(
        loan.outstandingBalance ||
          0
      )
    );


  const annualInterestRate =
    Math.max(
      0,
      Number(
        loan.annualInterestRate ||
          0
      )
    );


  const monthlyRate =
    annualInterestRate /
    100 /
    12;


  const interest =
    money(
      balance *
      monthlyRate
    );


  const scheduledInstallment =
    money(
      Math.min(
        Number(
          loan.monthlyPayment ||
            0
        ),
        balance +
          interest
      )
    );


  const scheduledPrincipal =
    money(
      Math.max(
        0,
        scheduledInstallment -
          interest
      )
    );


  const arrearsInterest =
    Math.max(
      0,
      Number(
        loan.arrearsInterest ||
          0
      )
    );


  const arrearsPrincipal =
    Math.max(
      0,
      Number(
        loan.arrearsPrincipal ||
          0
      )
    );


  const arrears =
    money(
      arrearsInterest +
      arrearsPrincipal
    );


  const totalDue =
    money(
      scheduledInstallment +
      arrears
    );


  const cash =
    Math.max(
      0,
      Number(
        state?.business?.cash ||
          0
      )
    );


  return {
    loan,

    balance,

    annualInterestRate,

    monthlyRate,

    scheduledInstallment,

    interest,

    scheduledPrincipal,

    arrearsInterest,

    arrearsPrincipal,

    arrears,

    totalDue,

    cash,

    canPayFull:
      cash >= totalDue,

    balanceAfterScheduledPayment:
      money(
        Math.max(
          0,
          balance -
            scheduledPrincipal -
            arrearsPrincipal
        )
      ),
  };
};


const allocateLoanPayment = (
  preview,
  requestedAmount
) => {
  let available =
    Math.max(
      0,
      Number(
        requestedAmount ||
          0
      )
    );


  const arrearsInterestPaid =
    money(
      Math.min(
        available,
        preview.arrearsInterest
      )
    );

  available -=
    arrearsInterestPaid;


  const currentInterestPaid =
    money(
      Math.min(
        available,
        preview.interest
      )
    );

  available -=
    currentInterestPaid;


  const arrearsPrincipalPaid =
    money(
      Math.min(
        available,
        preview.arrearsPrincipal
      )
    );

  available -=
    arrearsPrincipalPaid;


  const currentPrincipalPaid =
    money(
      Math.min(
        available,
        preview.scheduledPrincipal
      )
    );


  const principalPaid =
    money(
      arrearsPrincipalPaid +
      currentPrincipalPaid
    );


  const interestPaid =
    money(
      arrearsInterestPaid +
      currentInterestPaid
    );


  const unpaidArrearsInterest =
    money(
      Math.max(
        0,
        preview.arrearsInterest -
          arrearsInterestPaid
      )
    );


  const unpaidCurrentInterest =
    money(
      Math.max(
        0,
        preview.interest -
          currentInterestPaid
      )
    );


  const unpaidArrearsPrincipal =
    money(
      Math.max(
        0,
        preview.arrearsPrincipal -
          arrearsPrincipalPaid
      )
    );


  const unpaidCurrentPrincipal =
    money(
      Math.max(
        0,
        preview.scheduledPrincipal -
          currentPrincipalPaid
      )
    );


  const newArrearsInterest =
    money(
      unpaidArrearsInterest +
      unpaidCurrentInterest
    );


  const newArrearsPrincipal =
    money(
      unpaidArrearsPrincipal +
      unpaidCurrentPrincipal
    );


  const newArrears =
    money(
      newArrearsInterest +
      newArrearsPrincipal
    );


  const newBalance =
    money(
      Math.max(
        0,
        preview.balance -
          principalPaid
      )
    );


  const currentInstallmentSatisfied =
    unpaidCurrentInterest <=
      0.01 &&
    unpaidCurrentPrincipal <=
      0.01;


  return {
    amountPaid:
      money(
        requestedAmount
      ),

    interestPaid,

    principalPaid,

    arrearsInterestPaid,

    arrearsPrincipalPaid,

    currentInterestPaid,

    currentPrincipalPaid,

    newArrearsInterest,

    newArrearsPrincipal,

    newArrears,

    newBalance,

    currentInstallmentSatisfied,
  };
};


export const previewLoanPaymentDecision = (
  state,
  loanId,
  action,
  requestedAmount = 0
) => {
  const preview =
    getLoanPaymentPreview(
      state,
      loanId
    );


  if (!preview) {
    return {
      valid: false,

      reason:
        "Loan account not found.",
    };
  }


  const cash =
    preview.cash;


  if (action === "FULL") {
    if (
      cash <
      preview.totalDue
    ) {
      return {
        valid: false,

        reason:
          "The business does not have enough cash to pay the full amount due.",

        ...preview,
      };
    }


    const allocation =
      allocateLoanPayment(
        preview,
        preview.totalDue
      );


    return {
      valid: true,

      action,

      ...preview,

      ...allocation,

      cashAfter:
        money(
          cash -
            preview.totalDue
        ),

      balanceAfter:
        allocation.newBalance,

      arrearsAfter: 0,
    };
  }


  if (action === "PARTIAL") {
    const amount =
      money(
        Math.max(
          0,
          Number(
            requestedAmount ||
              0
          )
        )
      );


    if (amount <= 0) {
      return {
        valid: false,

        reason:
          "Enter the amount the business can pay.",

        ...preview,
      };
    }


    if (amount > cash) {
      return {
        valid: false,

        reason:
          "The partial payment is greater than the cash currently available.",

        ...preview,
      };
    }


    if (
      amount >=
      preview.totalDue
    ) {
      return {
        valid: false,

        reason:
          "This amount can cover the full payment. Choose Pay Full Instalment instead.",

        ...preview,
      };
    }


    const allocation =
      allocateLoanPayment(
        preview,
        amount
      );


    return {
      valid: true,

      action,

      ...preview,

      ...allocation,

      cashAfter:
        money(
          cash -
            amount
        ),

      balanceAfter:
        allocation.newBalance,

      arrearsAfter:
        allocation.newArrears,
    };
  }


  if (action === "MISS") {
    const allocation =
      allocateLoanPayment(
        preview,
        0
      );


    return {
      valid: true,

      action,

      ...preview,

      ...allocation,

      amountPaid: 0,

      cashAfter:
        cash,

      balanceAfter:
        preview.balance,

      arrearsAfter:
        allocation.newArrears,
    };
  }


  if (
    action === "RESTRUCTURE"
  ) {
    /*
     * The unpaid interest is capitalised.
     *
     * The entrepreneur gets lower immediate
     * monthly pressure, but repayment is
     * stretched over a longer period.
     */
    const capitalisedInterest =
      money(
        preview.arrearsInterest +
        preview.interest
      );


    const restructuredBalance =
      money(
        preview.balance +
        capitalisedInterest
      );


    const oldRemainingMonths =
      Math.max(
        1,
        Number(
          preview.loan
            .remainingMonths ||
            1
        )
      );


    const newRemainingMonths =
      oldRemainingMonths +
      12;


    const newMonthlyPayment =
      calculateRestructuredPayment(
        restructuredBalance,
        preview.annualInterestRate,
        newRemainingMonths
      );


    const currentSchedule =
      simulateRemainingLoan({
        balance:
          preview.balance,

        annualInterestRate:
          preview.annualInterestRate,

        monthlyPayment:
          preview.loan
            .monthlyPayment,
      });


    const restructuredSchedule =
      simulateRemainingLoan({
        balance:
          restructuredBalance,

        annualInterestRate:
          preview.annualInterestRate,

        monthlyPayment:
          newMonthlyPayment,
      });


    return {
      valid: true,

      action,

      ...preview,

      amountPaid: 0,

      cashAfter:
        cash,

      capitalisedInterest,

      balanceAfter:
        restructuredBalance,

      arrearsAfter: 0,

      oldRemainingMonths,

      newRemainingMonths,

      oldMonthlyPayment:
        preview.loan
          .monthlyPayment,

      newMonthlyPayment,

      estimatedFutureInterestBefore:
        currentSchedule.totalInterest,

      estimatedFutureInterestAfter:
        restructuredSchedule.totalInterest,

      estimatedAdditionalInterest:
        Math.max(
          0,
          restructuredSchedule.totalInterest -
            currentSchedule.totalInterest
        ),
    };
  }


  return {
    valid: false,

    reason:
      "Choose how the business will handle this loan payment.",
  };
};


export const applyLoanPaymentDecision = (
  state,
  {
    loanId,
    action,
    amount = 0,
  }
) => {
  const decision =
    previewLoanPaymentDecision(
      state,
      loanId,
      action,
      amount
    );


  if (!decision.valid) {
    return {
      state,

      applied: false,

      reason:
        decision.reason,

      decision,
    };
  }


  const financing =
    state.financing || {};


  const business =
    state.business || {};


  const currentDay =
    state.currentDay;


  let cash =
    Number(
      business.cash ||
        0
    );


  let debt =
    Number(
      business.debt ||
        0
    );


  let liabilities =
    Number(
      business.liabilities ||
        0
    );


  let expenses =
    Number(
      business.expenses ||
        0
    );


  let risk =
    Number(
      business.risk ||
        0
    );


  const creditEvents = [
    ...(
      financing.creditEvents ||
      []
    ),
  ];


  const loans =
    (
      financing.loans ||
      []
    ).map(
      (loan) => {
        if (
          loan.id !== loanId
        ) {
          return loan;
        }


        const oldInterestContribution =
          Number(
            loan.currentMonthlyInterestContribution ||
              0
          );


        if (
          action ===
          "RESTRUCTURE"
        ) {
          const newBalance =
            decision.balanceAfter;


          const nextInterest =
            money(
              newBalance *
                (
                  decision.annualInterestRate /
                  100 /
                  12
                )
            );


          debt =
            money(
              debt +
                decision.capitalisedInterest
            );


          liabilities =
            money(
              liabilities +
                decision.capitalisedInterest
            );


          expenses =
            money(
              expenses -
                oldInterestContribution +
                decision.interest
            );


          risk =
            loanDecisionClamp(
              risk + 2,
              0,
              100
            );


          creditEvents.push({
            id:
              `credit-restructure-${Date.now()}-${loan.id}`,

            type:
              "LOAN_RESTRUCTURED",

            loanId:
              loan.id,

            day:
              currentDay,

            oldMonthlyPayment:
              loan.monthlyPayment,

            newMonthlyPayment:
              decision.newMonthlyPayment,

            createdAt:
              new Date()
                .toISOString(),
          });


          return {
            ...loan,

            outstandingBalance:
              newBalance,

            monthlyPayment:
              decision.newMonthlyPayment,

            remainingMonths:
              decision.newRemainingMonths,

            arrearsInterest: 0,

            arrearsPrincipal: 0,

            status:
              "active",

            restructures:
              Number(
                loan.restructures ||
                  0
              ) + 1,

            lastPaymentDecisionDay:
              currentDay,

            currentMonthlyInterestContribution:
              nextInterest,

            payments: [
              ...(
                loan.payments ||
                []
              ),

              {
                id:
                  `payment-restructure-${Date.now()}`,

                type:
                  "RESTRUCTURE",

                status:
                  "restructured",

                day:
                  currentDay,

                amount: 0,

                interest:
                  decision.interest,

                principal: 0,

                capitalisedInterest:
                  decision.capitalisedInterest,

                balanceAfter:
                  newBalance,

                createdAt:
                  new Date()
                    .toISOString(),
              },
            ],
          };
        }


        const amountPaid =
          action === "FULL"
            ? decision.totalDue
            : action ===
                "PARTIAL"
              ? decision.amountPaid
              : 0;


        cash =
          money(
            Math.max(
              0,
              cash -
                amountPaid
            )
          );


        debt =
          money(
            Math.max(
              0,
              debt -
                decision.principalPaid
            )
          );


        liabilities =
          money(
            Math.max(
              0,
              liabilities -
                decision.principalPaid
            )
          );


        const newBalance =
          decision.balanceAfter;


        const nextInterest =
          money(
            newBalance *
              (
                decision.annualInterestRate /
                100 /
                12
              )
          );


        expenses =
          money(
            expenses -
              oldInterestContribution +
              nextInterest
          );


        const remainingMonths =
          decision.currentInstallmentSatisfied
            ? Math.max(
                0,
                Number(
                  loan.remainingMonths ||
                    0
                ) - 1
              )
            : Number(
                loan.remainingMonths ||
                  0
              );


        const arrearsAfter =
          decision.arrearsAfter;


        let status =
          arrearsAfter >
          0.01
            ? "delinquent"
            : newBalance <=
                0.01
              ? "paid"
              : "active";


        let eventType =
          "ON_TIME_PAYMENT";


        let paymentStatus =
          "paid";


        if (
          action ===
          "PARTIAL"
        ) {
          risk =
            loanDecisionClamp(
              risk + 3,
              0,
              100
            );

          eventType =
            "PARTIAL_PAYMENT";

          paymentStatus =
            "partial";
        }


        if (
          action ===
          "MISS"
        ) {
          risk =
            loanDecisionClamp(
              risk + 7,
              0,
              100
            );

          eventType =
            "MISSED_PAYMENT";

          paymentStatus =
            "missed";

          status =
            "delinquent";
        }


        if (
          action ===
          "FULL"
        ) {
          risk =
            loanDecisionClamp(
              risk - 1,
              0,
              100
            );
        }


        creditEvents.push({
          id:
            `credit-payment-${Date.now()}-${loan.id}`,

          type:
            eventType,

          loanId:
            loan.id,

          day:
            currentDay,

          amount:
            amountPaid,

          principal:
            decision.principalPaid,

          interest:
            decision.interestPaid,

          arrearsAfter,

          createdAt:
            new Date()
              .toISOString(),
        });


        return {
          ...loan,

          outstandingBalance:
            newBalance,

          remainingMonths,

          arrearsInterest:
            decision.newArrearsInterest,

          arrearsPrincipal:
            decision.newArrearsPrincipal,

          status,

          lastPaymentDecisionDay:
            currentDay,

          currentMonthlyInterestContribution:
            nextInterest,

          payments: [
            ...(
              loan.payments ||
              []
            ),

            {
              id:
                `payment-decision-${Date.now()}`,

              type:
                "SCHEDULED_PAYMENT_DECISION",

              action,

              status:
                paymentStatus,

              day:
                currentDay,

              scheduledAmount:
                decision.scheduledInstallment,

              amount:
                amountPaid,

              interest:
                decision.interestPaid,

              principal:
                decision.principalPaid,

              arrearsAfter,

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


  const actionLabel =
    action === "FULL"
      ? "Full loan instalment paid"
      : action ===
          "PARTIAL"
        ? "Partial loan payment made"
        : action ===
            "RESTRUCTURE"
          ? "Loan repayment restructured"
          : "Loan payment missed";


  const nextState = {
    ...state,

    business: {
      ...business,

      cash,

      debt,

      liabilities,

      expenses,

      risk,
    },

    financing: {
      ...financing,

      loans,

      creditEvents,
    },

    activityLog: [
      ...(
        state.activityLog ||
        []
      ),

      {
        id:
          `loan-payment-decision-${Date.now()}`,

        type:
          "LOAN_PAYMENT_DECISION",

        day:
          currentDay,

        title:
          actionLabel,

        loanId,

        action,

        amount:
          decision.amountPaid ||
          0,

        description:
          action ===
          "RESTRUCTURE"
            ? `The loan was extended to ${decision.newRemainingMonths} remaining months with a new monthly payment of R${Math.round(
                decision.newMonthlyPayment
              ).toLocaleString(
                "en-ZA"
              )}.`
            : `Management chose ${action.toLowerCase()} payment treatment for the loan obligation.`,

        createdAt:
          new Date()
            .toISOString(),
      },
    ],
  };


  return {
    state:
      nextState,

    applied: true,

    decision,
  };
};


// ============================================================
// STRATEGIC DEBT REDUCTION
// ============================================================
//
// Used by the Month 11 financial review.
//
// Unlike the normal extra-payment helper, this function does
// NOT block a payment simply because it goes below the
// recommended cash reserve.
//
// That is deliberate:
//
// the entrepreneur is allowed to make an aggressive/risky
// repayment and experience the consequences.
//
// It keeps:
// - cash
// - aggregate debt
// - liabilities
// - real loan balances
// - remaining loan term
// - repayment history
//
// synchronized.
// ============================================================


export const previewStrategicDebtReduction = (
  state,
  requestedAmount
) => {
  const business =
    state?.business || {};


  const amount =
    Math.max(
      0,
      Number(
        requestedAmount || 0
      )
    );


  const cash =
    Math.max(
      0,
      Number(
        business.cash || 0
      )
    );


  const debt =
    Math.max(
      0,
      Number(
        business.debt || 0
      )
    );


  const liabilities =
    Math.max(
      0,
      Number(
        business.liabilities || 0
      )
    );


  const monthlyExpenses =
    Math.max(
      0,
      Number(
        business.expenses || 0
      )
    );


  const minimumCashReserve =
    monthlyExpenses * 1.5;


  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return {
      valid: false,

      reason:
        "Enter a debt repayment amount greater than zero.",
    };
  }


  if (debt <= 0) {
    return {
      valid: false,

      reason:
        "The business currently has no outstanding debt.",
    };
  }


  if (amount > cash) {
    return {
      valid: false,

      reason:
        "The repayment amount is greater than available company cash.",
    };
  }


  if (amount > debt) {
    return {
      valid: false,

      reason:
        "The repayment amount is greater than the company's outstanding debt.",
    };
  }


  /*
   * If more than one real loan exists,
   * prioritise:
   *
   * 1. delinquent loans;
   * 2. higher-interest loans.
   *
   * The allocation is returned to the UI /
   * decision outcome so this is never hidden
   * from the entrepreneur.
   */
  const activeLoans =
    (
      state?.financing?.loans ||
      []
    )
      .filter(
        (loan) =>
          (
            loan.status ===
              "active" ||
            loan.status ===
              "delinquent"
          ) &&
          Number(
            loan.outstandingBalance ||
              0
          ) > 0.01
      )
      .sort(
        (a, b) => {
          if (
            a.status ===
              "delinquent" &&
            b.status !==
              "delinquent"
          ) {
            return -1;
          }

          if (
            b.status ===
              "delinquent" &&
            a.status !==
              "delinquent"
          ) {
            return 1;
          }

          return (
            Number(
              b.annualInterestRate ||
                0
            ) -
            Number(
              a.annualInterestRate ||
                0
            )
          );
        }
      );


  let remainingPayment =
    amount;


  let loanPrincipalApplied = 0;

  let estimatedInterestSaved = 0;

  let estimatedMonthsSaved = 0;


  const allocations = [];


  activeLoans.forEach(
    (loan) => {
      if (
        remainingPayment <= 0
      ) {
        return;
      }


      const openingBalance =
        Math.max(
          0,
          Number(
            loan.outstandingBalance ||
              0
          )
        );


      const applied =
        Math.min(
          remainingPayment,
          openingBalance
        );


      if (applied <= 0) {
        return;
      }


      const newBalance =
        Math.max(
          0,
          openingBalance -
            applied
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


      const interestSaved =
        Math.max(
          0,
          normalSchedule.totalInterest -
            newSchedule.totalInterest
        );


      const monthsSaved =
        Math.max(
          0,
          normalSchedule.months -
            newSchedule.months
        );


      allocations.push({
        loanId:
          loan.id,

        lender:
          loan.lender ||
          "Business Loan",

        annualInterestRate:
          Number(
            loan.annualInterestRate ||
              0
          ),

        openingBalance,

        payment:
          applied,

        newBalance,

        oldRemainingMonths:
          normalSchedule.months,

        newRemainingMonths:
          newSchedule.months,

        monthsSaved,

        estimatedInterestSaved:
          interestSaved,
      });


      loanPrincipalApplied +=
        applied;


      estimatedInterestSaved +=
        interestSaved;


      estimatedMonthsSaved =
        Math.max(
          estimatedMonthsSaved,
          monthsSaved
        );


      remainingPayment -=
        applied;
    }
  );


  /*
   * Any remaining amount applies to other
   * aggregate business debt that is not
   * represented by one of the loan accounts.
   */
  const genericDebtPayment =
    Math.max(
      0,
      remainingPayment
    );


  const cashAfter =
    Math.max(
      0,
      cash -
        amount
    );


  const debtAfter =
    Math.max(
      0,
      debt -
        amount
    );


  const liabilitiesAfter =
    Math.max(
      0,
      liabilities -
        Math.min(
          amount,
          liabilities
        )
    );


  const cashCoverAfter =
    monthlyExpenses > 0
      ? cashAfter /
        monthlyExpenses
      : 99;


  return {
    valid: true,

    amount,

    cashBefore:
      cash,

    cashAfter,

    debtBefore:
      debt,

    debtAfter,

    liabilitiesBefore:
      liabilities,

    liabilitiesAfter,

    monthlyExpenses,

    minimumCashReserve,

    cashCoverAfter,

    belowRecommendedReserve:
      cashAfter <
      minimumCashReserve,

    dangerousLiquidity:
      monthlyExpenses > 0 &&
      cashCoverAfter < 0.5,

    loanPrincipalApplied,

    genericDebtPayment,

    allocations,

    estimatedInterestSaved,

    estimatedMonthsSaved,
  };
};


export const applyStrategicDebtReduction = (
  state,
  requestedAmount
) => {
  const impact =
    previewStrategicDebtReduction(
      state,
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


  const allocationMap =
    new Map(
      impact.allocations.map(
        (allocation) => [
          allocation.loanId,
          allocation,
        ]
      )
    );


  const loans =
    (
      state.financing?.loans ||
      []
    ).map(
      (loan) => {
        const allocation =
          allocationMap.get(
            loan.id
          );


        if (!allocation) {
          return loan;
        }


        const newBalance =
          allocation.newBalance;


        const nextMonthlyInterest =
          newBalance *
          (
            Number(
              loan.annualInterestRate ||
                0
            ) /
            100 /
            12
          );


        return {
          ...loan,

          outstandingBalance:
            newBalance,

          remainingMonths:
            allocation
              .newRemainingMonths,

          currentMonthlyInterestContribution:
            money(
              nextMonthlyInterest
            ),

          status:
            newBalance <= 0.01
              ? "paid"
              : "active",

          payments: [
            ...(
              loan.payments ||
              []
            ),

            {
              id:
                `strategic-debt-${Date.now()}-${loan.id}`,

              type:
                "STRATEGIC_PRINCIPAL_PAYMENT",

              status:
                "paid",

              day:
                state.currentDay,

              amount:
                allocation.payment,

              principal:
                allocation.payment,

              interest: 0,

              openingBalance:
                allocation.openingBalance,

              balanceAfter:
                allocation.newBalance,

              estimatedInterestSaved:
                allocation
                  .estimatedInterestSaved,

              estimatedMonthsSaved:
                allocation
                  .monthsSaved,

              createdAt:
                new Date()
                  .toISOString(),
            },
          ],
        };
      }
    );


  const nextState = {
    ...state,

    business: {
      ...state.business,

      cash:
        impact.cashAfter,

      debt:
        impact.debtAfter,

      liabilities:
        impact.liabilitiesAfter,
    },

    financing: {
      ...(
        state.financing ||
        {}
      ),

      loans,

      creditEvents: [
        ...(
          state.financing
            ?.creditEvents ||
          []
        ),

        {
          id:
            `credit-strategic-debt-${Date.now()}`,

          type:
            "STRATEGIC_DEBT_REDUCTION",

          day:
            state.currentDay,

          amount:
            impact.amount,

          loanPrincipalApplied:
            impact.loanPrincipalApplied,

          genericDebtPayment:
            impact.genericDebtPayment,

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
          `activity-strategic-debt-${Date.now()}`,

        type:
          "STRATEGIC_DEBT_REDUCTION",

        day:
          state.currentDay,

        amount:
          impact.amount,

        title:
          "Strategic debt repayment",

        description:
          `Management used R${Math.round(
            impact.amount
          ).toLocaleString(
            "en-ZA"
          )} of company cash to reduce outstanding debt.`,

        createdAt:
          new Date()
            .toISOString(),
      },
    ],
  };


  return {
    state:
      nextState,

    applied: true,

    impact,
  };
};
