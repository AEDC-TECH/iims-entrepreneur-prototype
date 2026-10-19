const BASE_TASKS = {
  1: [
    {
      id: "task-day1-cash-check",

      title:
        "Review available cash before accepting expansion",

      category: "FINANCE",

      priority: "IMPORTANT",

      dueDay: 1,

      description:
        "Check whether the business has enough cash to support additional staff, equipment and operating costs.",

      completeEffects: {
        risk: -2,
      },

      postponeEffects: {
        risk: 2,
      },

      learning:
        "Good growth decisions begin with understanding the cash required before new revenue is collected.",
    },

    {
      id: "task-day1-team-capacity",

      title:
        "Check current team capacity",

      category: "PEOPLE",

      priority: "NORMAL",

      dueDay: 1,

      description:
        "Review whether the existing team can absorb more work without damaging service quality.",

      completeEffects: {
        employeeMorale: 1,
        risk: -1,
      },

      postponeEffects: {
        employeeMorale: -1,
      },

      learning:
        "Capacity planning helps prevent growth from creating operational pressure.",
    },
  ],

  2: [
    {
      id: "task-day2-payroll",

      title:
        "Confirm payroll cash availability",

      category: "FINANCE",

      priority: "CRITICAL",

      dueDay: 2,

      description:
        "Make sure enough available cash remains for salaries even though a customer payment has been delayed.",

      completeEffects: {
        risk: -3,
        employeeMorale: 2,
      },

      postponeEffects: {
        risk: 5,
        employeeMorale: -4,
      },

      learning:
        "Payroll is a cash obligation, not an accounting profit calculation.",
    },

    {
      id: "task-day2-debtors",

      title:
        "Follow up overdue customer invoice",

      category: "CUSTOMERS",

      priority: "IMPORTANT",

      dueDay: 2,

      description:
        "Contact the customer and confirm when the outstanding invoice will be paid.",

      completeEffects: {
        receivables: -10000,
        cash: 10000,
        risk: -2,
      },

      postponeEffects: {
        risk: 2,
      },

      learning:
        "Active collections reduce the amount of revenue trapped in unpaid invoices.",
    },
  ],

  3: [
    {
      id: "task-day3-retention",

      title:
        "Prepare for employee retention discussion",

      category: "PEOPLE",

      priority: "IMPORTANT",

      dueDay: 3,

      description:
        "Review the employee's contribution, salary affordability and replacement risk before the meeting.",

      completeEffects: {
        employeeMorale: 2,
        risk: -2,
      },

      postponeEffects: {
        employeeMorale: -3,
        risk: 2,
      },

      learning:
        "People decisions improve when the business considers both capability and affordability.",
    },
  ],

  4: [
    {
      id: "task-day4-margin",

      title:
        "Recalculate profit margin after supplier increase",

      category: "FINANCE",

      priority: "CRITICAL",

      dueDay: 4,

      description:
        "Determine how the supplier increase affects monthly profit before deciding whether to change pricing.",

      completeEffects: {
        pricing: 0,
        risk: -3,
      },

      postponeEffects: {
        risk: 4,
      },

      learning:
        "Pricing should respond to changes in cost and margin, not only competitor behaviour.",
    },

    {
      id: "task-day4-customers",

      title:
        "Identify price-sensitive customers",

      category: "CUSTOMERS",

      priority: "NORMAL",

      dueDay: 4,

      description:
        "Identify which customers may react strongly if prices increase.",

      completeEffects: {
        customerSatisfaction: 1,
      },

      postponeEffects: {},
      learning:
        "Not every customer responds to price changes in the same way.",
    },
  ],

  5: [
    {
      id: "task-day5-funding",

      title:
        "Compare funding options",

      category: "FUNDING",

      priority: "CRITICAL",

      dueDay: 5,

      description:
        "Compare debt repayments, ownership dilution, liquidity impact and future flexibility before financing the investment.",

      completeEffects: {
        risk: -4,
      },

      postponeEffects: {
        risk: 5,
      },

      learning:
        "Funding decisions should compare the full cost of money, not only how much capital becomes available.",
    },
  ],

  6: [
    {
      id: "task-day6-competition",

      title:
        "Review why customers choose your company",

      category: "STRATEGY",

      priority: "IMPORTANT",

      dueDay: 6,

      description:
        "Identify your strongest competitive advantages before responding to the competitor's lower prices.",

      completeEffects: {
        customerSatisfaction: 2,
        risk: -2,
      },

      postponeEffects: {
        risk: 2,
      },

      learning:
        "Competitive strategy should begin with understanding why customers value the business.",
    },
  ],

  // =========================================================
  // MONTH 7 — GROWTH PRESSURE
  // =========================================================

  7: [
    {
      id: "task-month7-capacity",

      title:
        "Review whether the business can handle current growth",

      category: "OPERATIONS",

      priority: "CRITICAL",

      dueDay: 7,

      description:
        "Compare customer demand, employee capacity and available cash before committing to more growth.",

      completeEffects: {
        risk: -4,
      },

      postponeEffects: {
        risk: 5,
        employeeMorale: -2,
      },

      learning:
        "Growth should be supported by enough people, systems and cash to deliver what customers were promised.",
    },

    {
      id: "task-month7-team-pressure",

      title:
        "Check employee workload and overtime pressure",

      category: "PEOPLE",

      priority: "IMPORTANT",

      dueDay: 7,

      description:
        "Review whether increased business activity is creating unsustainable pressure on employees.",

      completeEffects: {
        employeeMorale: 3,
        risk: -2,
      },

      postponeEffects: {
        employeeMorale: -4,
        risk: 2,
      },

      learning:
        "Rapid growth can damage a business when employees are overloaded for too long.",
    },
  ],


  // =========================================================
  // MONTH 8 — CUSTOMER & MARKET PRESSURE
  // =========================================================

  8: [
    {
      id: "task-month8-key-customer",

      title:
        "Review profitability of the major customer contract",

      category: "CUSTOMERS",

      priority: "CRITICAL",

      dueDay: 8,

      description:
        "Check how much revenue, cost and profit the customer contributes before negotiating the contract.",

      completeEffects: {
        risk: -3,
      },

      postponeEffects: {
        risk: 4,
      },

      learning:
        "A large customer is not automatically a good customer if the contract produces weak margins or excessive risk.",
    },

    {
      id: "task-month8-market-position",

      title:
        "Review why customers choose the business",

      category: "STRATEGY",

      priority: "IMPORTANT",

      dueDay: 8,

      description:
        "Identify whether customers value price, service, quality, specialisation, convenience or relationships most.",

      completeEffects: {
        customerSatisfaction: 2,
        risk: -2,
      },

      postponeEffects: {
        risk: 2,
      },

      learning:
        "Businesses defend customers more effectively when they understand what customers actually value.",
    },
  ],


  // =========================================================
  // MONTH 9 — OPERATIONAL CRISIS
  // =========================================================

  9: [
    {
      id: "task-month9-continuity",

      title:
        "Prepare an operational recovery plan",

      category: "OPERATIONS",

      priority: "CRITICAL",

      dueDay: 9,

      description:
        "Identify how customer commitments will continue while the equipment problem is being resolved.",

      completeEffects: {
        risk: -5,
        customerSatisfaction: 2,
      },

      postponeEffects: {
        risk: 7,
        customerSatisfaction: -3,
      },

      learning:
        "Business continuity planning helps a company continue serving customers when normal operations fail.",
    },

    {
      id: "task-month9-emergency-cash",

      title:
        "Check available emergency cash",

      category: "FINANCE",

      priority: "CRITICAL",

      dueDay: 9,

      description:
        "Review how much cash the company can safely use to resolve the operational disruption without creating a second financial crisis.",

      completeEffects: {
        risk: -3,
      },

      postponeEffects: {
        risk: 5,
      },

      learning:
        "Emergency decisions should consider both the immediate problem and the liquidity needed to keep the rest of the business operating.",
    },
  ],


  // =========================================================
  // MONTH 10 — EXPANSION DECISION
  // =========================================================

  10: [
    {
      id: "task-month10-expansion-readiness",

      title:
        "Complete an expansion readiness check",

      category: "STRATEGY",

      priority: "CRITICAL",

      dueDay: 10,

      description:
        "Review cash, debt, profitability, customers, employees and operational capacity before committing to another market.",

      completeEffects: {
        risk: -5,
      },

      postponeEffects: {
        risk: 6,
      },

      learning:
        "An attractive market opportunity can still be the wrong decision when the existing business is not ready to support it.",
    },

    {
      id: "task-month10-working-capital",

      title:
        "Estimate expansion working-capital needs",

      category: "FINANCE",

      priority: "IMPORTANT",

      dueDay: 10,

      description:
        "Estimate the additional cash required for salaries, suppliers and operations before new expansion revenue is collected.",

      completeEffects: {
        risk: -3,
      },

      postponeEffects: {
        risk: 4,
      },

      learning:
        "Expansion usually requires cash before the additional revenue arrives.",
    },
  ],


  // =========================================================
  // MONTH 11 — FINANCIAL PERFORMANCE
  // =========================================================

  11: [
    {
      id: "task-month11-financial-review",

      title:
        "Review the full financial position",

      category: "FINANCE",

      priority: "CRITICAL",

      dueDay: 11,

      description:
        "Review cash, revenue, profit, unpaid invoices, debt, assets and liabilities before making the year-end financial decision.",

      completeEffects: {
        risk: -5,
      },

      postponeEffects: {
        risk: 6,
      },

      learning:
        "No single financial number explains the health of a business. Strong decisions use the full financial picture.",
    },

    {
      id: "task-month11-debt-review",

      title:
        "Review debt and loan repayments",

      category: "FUNDING",

      priority: "IMPORTANT",

      dueDay: 11,

      description:
        "Check outstanding loan balances, monthly repayments and whether excess cash could safely reduce debt.",

      completeEffects: {
        risk: -3,
      },

      postponeEffects: {
        risk: 3,
      },

      learning:
        "Debt should be managed together with liquidity. Paying debt faster is useful only when the business keeps enough operating cash.",
    },

    {
      id: "task-month11-receivables",

      title:
        "Review outstanding customer invoices",

      category: "CUSTOMERS",

      priority: "IMPORTANT",

      dueDay: 11,

      description:
        "Identify customers who still owe money and prioritise collections before year-end.",

      completeEffects: {
        receivables: -10000,
        cash: 10000,
        risk: -2,
      },

      postponeEffects: {
        risk: 2,
      },

      learning:
        "Sales do not improve liquidity until the customer actually pays.",
    },
  ],


  // =========================================================
  // MONTH 12 — YEAR-END STRATEGY & REVIEW
  // =========================================================

  12: [
    {
      id: "task-month12-year-review",

      title:
        "Complete the year-end business review",

      category: "STRATEGY",

      priority: "CRITICAL",

      dueDay: 12,

      description:
        "Review what happened to revenue, cash, debt, customers, employees and business risk across the full simulated year.",

      completeEffects: {
        risk: -4,
      },

      postponeEffects: {
        risk: 5,
      },

      learning:
        "Year-end review helps entrepreneurs separate activity from progress and decide what the business should improve next.",
    },

    {
      id: "task-month12-next-year",

      title:
        "Set priorities for the next business year",

      category: "STRATEGY",

      priority: "IMPORTANT",

      dueDay: 12,

      description:
        "Choose the most important priorities for the next year based on the condition of the business you created.",

      completeEffects: {
        risk: -3,
      },

      postponeEffects: {
        risk: 2,
      },

      learning:
        "Strategy is not a list of everything a business could do. It is deciding what matters most with limited resources.",
    },
  ],
};


const hasDecision = (
  state,
  decisionId
) =>
  state.decisions.some(
    (item) =>
      item.decisionId ===
      decisionId
  );


const getDynamicTasks = (
  day,
  state
) => {
  const tasks = [];

  if (
    day >= 2 &&
    hasDecision(
      state,
      "growth-hire"
    )
  ) {
    tasks.push({
      id:
        `task-new-employees-${day}`,

      title:
        "Complete new employee onboarding",

      category: "PEOPLE",

      priority: "IMPORTANT",

      dueDay: day,

      description:
        "Confirm contracts, responsibilities and operational onboarding for the employees hired during expansion.",

      completeEffects: {
        employeeMorale: 2,
        risk: -2,
      },

      postponeEffects: {
        employeeMorale: -3,
        risk: 2,
      },

      learning:
        "Hiring creates operational responsibilities beyond simply adding salaries.",
    });
  }


  if (
    day >= 3 &&
    hasDecision(
      state,
      "cash-short-term-loan"
    )
  ) {
    tasks.push({
      id:
        `task-loan-payment-${day}`,

      title:
        "Review upcoming loan repayment",

      category: "FUNDING",

      priority: "CRITICAL",

      dueDay: day,

      description:
        "Confirm that upcoming cash flow can support the loan repayment without affecting essential operations.",

      completeEffects: {
        risk: -2,
      },

      postponeEffects: {
        risk: 5,
      },

      learning:
        "Debt creates recurring commitments that must be planned before repayment dates arrive.",
    });
  }


  if (
    day >= 5 &&
    hasDecision(
      state,
      "pricing-absorb"
    )
  ) {
    tasks.push({
      id:
        `task-margin-review-${day}`,

      title:
        "Review shrinking operating margin",

      category: "FINANCE",

      priority: "CRITICAL",

      dueDay: day,

      description:
        "Reassess whether the business can continue absorbing higher supplier costs.",

      completeEffects: {
        risk: -3,
      },

      postponeEffects: {
        risk: 5,
      },

      learning:
        "Repeatedly absorbing cost increases can make profitable revenue unprofitable.",
    });
  }


  if (
    day >= 6 &&
    hasDecision(
      state,
      "fund-equity"
    )
  ) {
    tasks.push({
      id:
        `task-investor-update-${day}`,

      title:
        "Prepare investor performance update",

      category: "OWNERSHIP",

      priority: "IMPORTANT",

      dueDay: day,

      description:
        "Prepare a short update explaining financial performance, strategy and current business risks to the new shareholder.",

      completeEffects: {
        risk: -2,
      },

      postponeEffects: {
        risk: 2,
      },

      learning:
        "Equity funding creates accountability to shareholders as well as access to capital.",
    });
  }


  return tasks;
};


export const getTasksForDay = (
  day,
  state
) => {
  const completedIds =
    new Set(
      (state.completedTasks || [])
        .map(
          (item) => item.taskId
        )
    );

  const postponedIds =
    new Set(
      (state.postponedTasks || [])
        .filter(
          (item) =>
            item.resolved !== true
        )
        .map(
          (item) => item.taskId
        )
    );


  const todayTasks = [
    ...(BASE_TASKS[day] || []),

    ...getDynamicTasks(
      day,
      state
    ),
  ];


  const carriedTasks =
    (state.postponedTasks || [])
      .filter(
        (item) =>
          !item.resolved &&
          item.nextDay <= day
      )
      .map((item) => ({
        ...item.task,

        id:
          item.taskId,

        priority:
          item.task.priority ===
          "NORMAL"
            ? "IMPORTANT"
            : "CRITICAL",

        carriedOver: true,
      }));


  return [
    ...todayTasks,
    ...carriedTasks,
  ].filter(
    (task) =>
      !completedIds.has(task.id) &&
      !postponedIds.has(task.id)
  );
};


export const hasUnresolvedCriticalTasks = (
  day,
  state
) => {
  return getTasksForDay(
    day,
    state
  ).some(
    (task) =>
      task.priority ===
      "CRITICAL"
  );
};


export const getTaskSummary = (
  day,
  state
) => {
  const tasks =
    getTasksForDay(
      day,
      state
    );

  return {
    total: tasks.length,

    critical:
      tasks.filter(
        (task) =>
          task.priority ===
          "CRITICAL"
      ).length,

    important:
      tasks.filter(
        (task) =>
          task.priority ===
          "IMPORTANT"
      ).length,

    normal:
      tasks.filter(
        (task) =>
          task.priority ===
          "NORMAL"
      ).length,
  };
};
