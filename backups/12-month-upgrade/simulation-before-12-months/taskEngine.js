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
