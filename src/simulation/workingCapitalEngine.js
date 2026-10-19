const clamp = (
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


const money = (
  value
) =>
  Math.round(
    Number(value || 0) *
      100
  ) / 100;


const WORKING_CAPITAL_REQUIREMENT =
  80000;


const REQUIREMENT_BREAKDOWN = [
  {
    id: "equipment",
    label:
      "Critical equipment repair",
    amount: 45000,
  },

  {
    id: "supplier",
    label:
      "Urgent supplier payment",
    amount: 20000,
  },

  {
    id: "recovery",
    label:
      "Overtime and recovery support",
    amount: 15000,
  },
];


const calculateLoanPayment = (
  principal,
  annualRate,
  termMonths
) => {
  const amount =
    Math.max(
      0,
      Number(principal || 0)
    );

  const months =
    Math.max(
      1,
      Number(termMonths || 1)
    );

  const monthlyRate =
    Math.max(
      0,
      Number(annualRate || 0)
    ) /
    100 /
    12;


  if (monthlyRate <= 0) {
    return money(
      amount /
      months
    );
  }


  return money(
    amount *
      (
        monthlyRate *
        Math.pow(
          1 + monthlyRate,
          months
        )
      ) /
      (
        Math.pow(
          1 + monthlyRate,
          months
        ) -
        1
      )
  );
};


const getShortTermRate = (
  state
) => {
  const risk =
    Number(
      state?.business?.risk ||
        0
    );


  const missedPayments =
    (
      state?.financing
        ?.creditEvents ||
      []
    ).filter(
      (event) =>
        event.type ===
        "MISSED_PAYMENT"
    ).length;


  let premium = 0;


  if (risk >= 70) {
    premium += 5;
  } else if (
    risk >= 50
  ) {
    premium += 3;
  } else if (
    risk >= 35
  ) {
    premium += 1;
  }


  premium +=
    Math.min(
      4,
      missedPayments *
        1.5
    );


  return money(
    clamp(
      19 + premium,
      19,
      29
    )
  );
};


const getShortTermLoanTerms = (
  state,
  recoveryFunding
) => {
  const fundingAmount =
    Math.max(
      0,
      Number(
        recoveryFunding || 0
      )
    );


  if (
    fundingAmount <= 0
  ) {
    return null;
  }


  /*
   * The fee is financed into the facility.
   *
   * That means the entrepreneur still gets
   * the full recovery funding required, but
   * the fee becomes part of what the company
   * ultimately owes.
   */
  const initiationFee =
    money(
      Math.max(
        750,
        fundingAmount *
          0.01875
      )
    );


  const principal =
    money(
      fundingAmount +
        initiationFee
    );


  const annualInterestRate =
    getShortTermRate(
      state
    );


  const termMonths = 6;


  const monthlyPayment =
    calculateLoanPayment(
      principal,
      annualInterestRate,
      termMonths
    );


  const totalRepayable =
    money(
      monthlyPayment *
      termMonths
    );


  const totalInterest =
    money(
      Math.max(
        0,
        totalRepayable -
          principal
      )
    );


  const firstMonthInterest =
    money(
      principal *
      annualInterestRate /
      100 /
      12
    );


  return {
    recoveryFunding:
      fundingAmount,

    initiationFee,

    principal,

    annualInterestRate,

    termMonths,

    monthlyPayment,

    totalRepayable,

    totalInterest,

    firstMonthInterest,
  };
};


export const getWorkingCapitalCrisis = (
  state
) => {
  const business =
    state?.business || {};


  const operations =
    state?.operations || {
      capacity: 100,
      equipmentHealth: 100,
      deliveryPerformance: 100,
      backlog: 0,
    };


  const cash =
    Math.max(
      0,
      Number(
        business.cash || 0
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
    monthlyExpenses *
    1.5;


  const cashAboveReserve =
    Math.max(
      0,
      cash -
        minimumCashReserve
    );


  const existingMonthlyDebtService =
    (
      state?.financing
        ?.loans ||
      []
    )
      .filter(
        (loan) =>
          loan.status ===
            "active" ||
          loan.status ===
            "delinquent"
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
      );


  return {
    active:
      Number(
        state?.currentDay
      ) === 9,

    resolved:
      state
        ?.workingCapitalCrisis
        ?.resolved === true,

    existingDecision:
      state
        ?.workingCapitalCrisis ||
      null,

    requiredAmount:
      WORKING_CAPITAL_REQUIREMENT,

    breakdown:
      REQUIREMENT_BREAKDOWN,

    cash,

    monthlyExpenses,

    minimumCashReserve,

    cashAboveReserve,

    existingMonthlyDebtService,

    operations: {
      capacity:
        Number(
          operations.capacity ??
            100
        ),

      equipmentHealth:
        Number(
          operations.equipmentHealth ??
            100
        ),

      deliveryPerformance:
        Number(
          operations.deliveryPerformance ??
            100
        ),

      backlog:
        Number(
          operations.backlog ||
            0
        ),
    },
  };
};


export const previewWorkingCapitalDecision = (
  state,
  choice,
  cashContribution = 30000
) => {
  const crisis =
    getWorkingCapitalCrisis(
      state
    );


  const {
    requiredAmount,
    cash,
    monthlyExpenses,
    minimumCashReserve,
    existingMonthlyDebtService,
  } = crisis;


  if (
    !crisis.active
  ) {
    return {
      valid: false,

      reason:
        "The working-capital crisis is not active in this business period.",
    };
  }


  if (
    crisis.resolved
  ) {
    return {
      valid: false,

      reason:
        "This working-capital decision has already been completed.",
    };
  }


  if (
    choice === "CASH"
  ) {
    if (
      cash <
      requiredAmount
    ) {
      return {
        valid: false,

        choice,

        reason:
          "The company does not currently have enough cash to fund the full recovery cost.",

        ...crisis,
      };
    }


    const cashAfter =
      money(
        cash -
          requiredAmount
      );


    const cashCoverAfter =
      monthlyExpenses > 0
        ? cashAfter /
          monthlyExpenses
        : 99;


    return {
      valid: true,

      choice,

      ...crisis,

      cashContribution:
        requiredAmount,

      financeAmount: 0,

      cashAfter,

      debtAdded: 0,

      newMonthlyPayment: 0,

      cashCoverAfter,

      belowReserve:
        cashAfter <
        minimumCashReserve,

      dangerousLiquidity:
        cashCoverAfter <
        0.5,

      explanation:
        "The business pays for the full recovery from its own cash. This avoids new debt, but reduces liquidity immediately.",
    };
  }


  if (
    choice ===
    "SHORT_TERM"
  ) {
    const loanTerms =
      getShortTermLoanTerms(
        state,
        requiredAmount
      );


    return {
      valid: true,

      choice,

      ...crisis,

      cashContribution: 0,

      financeAmount:
        requiredAmount,

      cashAfter:
        cash,

      debtAdded:
        loanTerms.principal,

      newMonthlyPayment:
        loanTerms.monthlyPayment,

      totalMonthlyDebtService:
        money(
          existingMonthlyDebtService +
            loanTerms.monthlyPayment
        ),

      loanTerms,

      explanation:
        "The short-term facility protects today's cash position, but creates a new six-month repayment obligation.",
    };
  }


  if (
    choice ===
    "BLENDED"
  ) {
    const contribution =
      money(
        Math.max(
          0,
          Number(
            cashContribution ||
              0
          )
        )
      );


    if (
      contribution <
      5000
    ) {
      return {
        valid: false,

        choice,

        reason:
          "Use at least R5,000 of company cash for the blended funding option.",

        ...crisis,
      };
    }


    if (
      contribution >
      cash
    ) {
      return {
        valid: false,

        choice,

        reason:
          "The selected cash contribution is greater than available company cash.",

        ...crisis,
      };
    }


    if (
      contribution >=
      requiredAmount
    ) {
      return {
        valid: false,

        choice,

        reason:
          "This contribution would fund the full recovery from cash. Choose Use Company Cash instead.",

        ...crisis,
      };
    }


    const financeAmount =
      money(
        requiredAmount -
          contribution
      );


    if (
      financeAmount <
      10000
    ) {
      return {
        valid: false,

        choice,

        reason:
          "The short-term finance portion must be at least R10,000.",

        ...crisis,
      };
    }


    const loanTerms =
      getShortTermLoanTerms(
        state,
        financeAmount
      );


    const cashAfter =
      money(
        cash -
          contribution
      );


    const cashCoverAfter =
      monthlyExpenses > 0
        ? cashAfter /
          monthlyExpenses
        : 99;


    return {
      valid: true,

      choice,

      ...crisis,

      cashContribution:
        contribution,

      financeAmount,

      cashAfter,

      cashCoverAfter,

      debtAdded:
        loanTerms.principal,

      newMonthlyPayment:
        loanTerms.monthlyPayment,

      totalMonthlyDebtService:
        money(
          existingMonthlyDebtService +
            loanTerms.monthlyPayment
        ),

      belowReserve:
        cashAfter <
        minimumCashReserve,

      loanTerms,

      explanation:
        "The business uses part of its own cash and finances the remaining recovery requirement. This shares the pressure between today's liquidity and future repayments.",
    };
  }


  if (
    choice === "DELAY"
  ) {
    return {
      valid: true,

      choice,

      ...crisis,

      cashContribution: 0,

      financeAmount: 0,

      cashAfter:
        cash,

      debtAdded: 0,

      newMonthlyPayment: 0,

      explanation:
        "The business preserves cash and avoids new borrowing today, but the operational problem remains unresolved and is expected to damage capacity, delivery and customer performance.",
    };
  }


  return {
    valid: false,

    reason:
      "Choose how management will fund the urgent recovery requirement.",

    ...crisis,
  };
};


const updateRecoveryOperations = (
  operations = {}
) => ({
  capacity:
    clamp(
      Number(
        operations.capacity ??
          100
      ) + 18,
      0,
      100
    ),

  equipmentHealth:
    clamp(
      Number(
        operations
          .equipmentHealth ??
          100
      ) + 25,
      0,
      100
    ),

  deliveryPerformance:
    clamp(
      Number(
        operations
          .deliveryPerformance ??
          100
      ) + 15,
      0,
      100
    ),

  backlog:
    Math.max(
      0,
      Number(
        operations.backlog ||
          0
      ) -
        30000
    ),
});


const updateDelayedOperations = (
  operations = {}
) => ({
  capacity:
    clamp(
      Number(
        operations.capacity ??
          100
      ) - 10,
      0,
      100
    ),

  equipmentHealth:
    clamp(
      Number(
        operations
          .equipmentHealth ??
          100
      ) - 8,
      0,
      100
    ),

  deliveryPerformance:
    clamp(
      Number(
        operations
          .deliveryPerformance ??
          100
      ) - 12,
      0,
      100
    ),

  backlog:
    Math.max(
      0,
      Number(
        operations.backlog ||
          0
      ) +
        40000
    ),
});


const buildShortTermLoan = (
  state,
  terms,
  choice
) => {
  if (!terms) {
    return null;
  }


  const now =
    Date.now();


  return {
    id:
      `working-capital-loan-${now}`,

    lender:
      "Short-Term Working Capital Facility",

    purpose:
      "Urgent operational recovery",

    type:
      "WORKING_CAPITAL",

    source:
      "MONTH_9_CRISIS",

    fundingStrategy:
      choice,

    originalPrincipal:
      terms.principal,

    principal:
      terms.principal,

    outstandingBalance:
      terms.principal,

    annualInterestRate:
      terms.annualInterestRate,

    monthlyPayment:
      terms.monthlyPayment,

    termMonths:
      terms.termMonths,

    remainingMonths:
      terms.termMonths,

    initiationFee:
      terms.initiationFee,

    recoveryFunding:
      terms.recoveryFunding,

    status:
      "active",

    arrearsInterest: 0,

    arrearsPrincipal: 0,

    payments: [],

    originatedDay:
      state.currentDay,

    originatedAt:
      new Date()
        .toISOString(),

    /*
     * It was originated in Month 9.
     * The first interactive repayment is due
     * when Month 10 opens.
     */
    lastPaymentDecisionDay:
      state.currentDay,

    currentMonthlyInterestContribution:
      terms.firstMonthInterest,
  };
};


export const applyWorkingCapitalDecision = (
  state,
  {
    choice,
    cashContribution = 30000,
  }
) => {
  const preview =
    previewWorkingCapitalDecision(
      state,
      choice,
      cashContribution
    );


  if (
    !preview.valid
  ) {
    return {
      applied: false,

      state,

      reason:
        preview.reason,

      preview,
    };
  }


  const business =
    state.business || {};


  const financing =
    state.financing || {};


  let cash =
    Number(
      business.cash || 0
    );


  let debt =
    Number(
      business.debt || 0
    );


  let liabilities =
    Number(
      business.liabilities || 0
    );


  let expenses =
    Number(
      business.expenses || 0
    );


  let revenue =
    Number(
      business.revenue || 0
    );


  let risk =
    Number(
      business.risk || 0
    );


  let customerSatisfaction =
    Number(
      business.customerSatisfaction ||
        0
    );


  let employeeMorale =
    Number(
      business.employeeMorale ||
        0
    );


  let operations =
    state.operations || {};


  let newLoan = null;


  let newBusinessIssues = [
    ...(
      state.businessIssues ||
      []
    ),
  ];


  if (
    choice === "CASH"
  ) {
    cash =
      preview.cashAfter;


    if (
      preview.cashCoverAfter <
      0.5
    ) {
      risk += 7;
    } else if (
      preview.cashCoverAfter <
      1
    ) {
      risk += 4;
    } else if (
      preview.cashCoverAfter <
      1.5
    ) {
      risk += 1;
    } else {
      risk -= 2;
    }


    customerSatisfaction +=
      2;


    operations =
      updateRecoveryOperations(
        operations
      );
  }


  if (
    choice ===
    "SHORT_TERM" ||
    choice ===
    "BLENDED"
  ) {
    newLoan =
      buildShortTermLoan(
        state,
        preview.loanTerms,
        choice
      );


    cash =
      preview.cashAfter;


    debt +=
      preview.loanTerms
        .principal;


    liabilities +=
      preview.loanTerms
        .principal;


    expenses +=
      preview.loanTerms
        .firstMonthInterest;


    risk +=
      choice ===
      "SHORT_TERM"
        ? 3
        : 1;


    customerSatisfaction +=
      2;


    operations =
      updateRecoveryOperations(
        operations
      );
  }


  if (
    choice === "DELAY"
  ) {
    revenue -=
      20000;


    customerSatisfaction -=
      6;


    employeeMorale -=
      4;


    risk +=
      10;


    operations =
      updateDelayedOperations(
        operations
      );


    /*
     * The cost of doing nothing now follows
     * the company into the next month.
     *
     * Completing the Month 10 expansion-
     * readiness task can resolve this issue
     * through the existing issue recovery
     * mechanism.
     */
    newBusinessIssues.push({
      id:
        `working-capital-delay-${Date.now()}`,

      key:
        "operational-capacity-pressure",

      sourceTaskId:
        "task-month10-expansion-readiness",

      type:
        "OPERATIONS",

      severity:
        "CRITICAL",

      status:
        "OPEN",

      openedDay:
        state.currentDay,

      ageMonths: 0,

      totalFinancialImpact: 0,

      title:
        "Operational recovery funding was delayed",

      description:
        "Management delayed the urgent recovery expenditure. Equipment, capacity and delivery performance remain under pressure and the backlog continues to grow.",

      monthlyBusinessEffects: {
        revenue: -12000,
        customerSatisfaction:
          -2,
        employeeMorale: -2,
        risk: 3,
      },

      monthlyOperationsEffects: {
        capacity: -3,
        deliveryPerformance:
          -4,
        backlog: 15000,
      },

      resolutionNote:
        "Management must stabilise operating capacity before pursuing further expansion.",

      createdAt:
        new Date()
          .toISOString(),
    });
  }


  risk =
    clamp(
      risk,
      0,
      100
    );


  customerSatisfaction =
    clamp(
      customerSatisfaction,
      0,
      100
    );


  employeeMorale =
    clamp(
      employeeMorale,
      0,
      100
    );


  const choiceTitles = {
    CASH:
      "Used company cash",

    SHORT_TERM:
      "Used short-term working-capital finance",

    BLENDED:
      "Used blended cash and short-term finance",

    DELAY:
      "Delayed the recovery expenditure",
  };


  const decisionRecord = {
    resolved: true,

    day:
      state.currentDay,

    requiredAmount:
      preview.requiredAmount,

    choice,

    title:
      choiceTitles[
        choice
      ],

    cashContribution:
      preview.cashContribution ||
      0,

    financeAmount:
      preview.financeAmount ||
      0,

    debtAdded:
      preview.debtAdded ||
      0,

    cashBefore:
      preview.cash,

    cashAfter:
      cash,

    monthlyDebtServiceBefore:
      preview
        .existingMonthlyDebtService,

    newMonthlyPayment:
      preview.newMonthlyPayment ||
      0,

    loanId:
      newLoan?.id ||
      null,

    loanTerms:
      preview.loanTerms ||
      null,

    explanation:
      preview.explanation,

    createdAt:
      new Date()
        .toISOString(),
  };


  const nextLoans = [
    ...(
      financing.loans ||
      []
    ),
  ];


  if (newLoan) {
    nextLoans.push(
      newLoan
    );
  }


  const creditEvents = [
    ...(
      financing.creditEvents ||
      []
    ),
  ];


  if (newLoan) {
    creditEvents.push({
      id:
        `working-capital-credit-${Date.now()}`,

      type:
        "SHORT_TERM_LOAN_APPROVED",

      day:
        state.currentDay,

      loanId:
        newLoan.id,

      amount:
        newLoan.originalPrincipal,

      recoveryFunding:
        newLoan.recoveryFunding,

      createdAt:
        new Date()
          .toISOString(),
    });
  }


  const nextState = {
    ...state,

    business: {
      ...business,

      cash:
        money(cash),

      debt:
        money(debt),

      liabilities:
        money(
          liabilities
        ),

      expenses:
        money(expenses),

      revenue:
        money(revenue),

      risk,

      customerSatisfaction,

      employeeMorale,
    },

    operations,

    businessIssues:
      newBusinessIssues,

    workingCapitalCrisis:
      decisionRecord,

    financing: {
      ...financing,

      loans:
        nextLoans,

      creditEvents,
    },

    activityLog: [
      ...(
        state.activityLog ||
        []
      ),

      {
        id:
          `working-capital-decision-${Date.now()}`,

        type:
          "WORKING_CAPITAL_DECISION",

        day:
          state.currentDay,

        title:
          choiceTitles[
            choice
          ],

        amount:
          preview.requiredAmount,

        description:
          preview.explanation,

        createdAt:
          new Date()
            .toISOString(),
      },
    ],
  };


  return {
    applied: true,

    state:
      nextState,

    preview,

    decision:
      decisionRecord,
  };
};
