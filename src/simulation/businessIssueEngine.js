const clamp = (
  value,
  min,
  max
) =>
  Math.min(
    max,
    Math.max(
      min,
      value
    )
  );


const applyEffects = (
  business,
  effects = {}
) => {
  const next = {
    ...business,
  };

  Object.entries(
    effects
  ).forEach(
    ([key, value]) => {
      if (
        typeof value !== "number"
      ) {
        return;
      }

      next[key] =
        Number(
          next[key] || 0
        ) + value;
    }
  );

  next.cash =
    Math.max(
      0,
      next.cash || 0
    );

  next.revenue =
    Math.max(
      0,
      next.revenue || 0
    );

  next.expenses =
    Math.max(
      0,
      next.expenses || 0
    );

  next.debt =
    Math.max(
      0,
      next.debt || 0
    );

  next.liabilities =
    Math.max(
      0,
      next.liabilities || 0
    );

  next.receivables =
    Math.max(
      0,
      next.receivables || 0
    );

  next.customers =
    Math.max(
      0,
      next.customers || 0
    );

  next.employees =
    Math.max(
      0,
      next.employees || 0
    );

  next.risk =
    clamp(
      next.risk || 0,
      0,
      100
    );

  next.customerSatisfaction =
    clamp(
      next.customerSatisfaction ||
        0,
      0,
      100
    );

  next.employeeMorale =
    clamp(
      next.employeeMorale || 0,
      0,
      100
    );

  return next;
};


const updateOperations = (
  operations,
  effects = {}
) => {
  const current = {
    capacity: 100,
    equipmentHealth: 100,
    deliveryPerformance: 100,
    backlog: 0,
    ...operations,
  };

  return {
    capacity:
      clamp(
        current.capacity +
          Number(
            effects.capacity ||
              0
          ),
        0,
        100
      ),

    equipmentHealth:
      clamp(
        current.equipmentHealth +
          Number(
            effects.equipmentHealth ||
              0
          ),
        0,
        100
      ),

    deliveryPerformance:
      clamp(
        current.deliveryPerformance +
          Number(
            effects.deliveryPerformance ||
              0
          ),
        0,
        100
      ),

    backlog:
      Math.max(
        0,
        current.backlog +
          Number(
            effects.backlog ||
              0
          )
      ),
  };
};


const issueDefinitions = {
  "operational-capacity-pressure": {
    type: "OPERATIONS",

    severity: "CRITICAL",

    title:
      "Operational capacity under pressure",

    description:
      "The business continued growing without properly addressing whether people and systems could support the workload.",

    initialOperationsEffects: {
      capacity: -8,
      deliveryPerformance: -5,
    },

    monthlyBusinessEffects: {
      revenue: -8000,
      expenses: 4000,
      employeeMorale: -2,
      customerSatisfaction: -2,
      risk: 3,
    },

    monthlyOperationsEffects: {
      capacity: -3,
      deliveryPerformance: -3,
      backlog: 12000,
    },

    escalationMessage:
      "Unresolved capacity pressure is creating delays, overtime and delivery problems.",
  },


  "customer-contract-risk": {
    type: "CUSTOMERS",

    severity: "CRITICAL",

    title:
      "Major customer profitability risk",

    description:
      "Management did not properly review the economics of an important customer relationship.",

    initialOperationsEffects: {
      deliveryPerformance: -2,
    },

    monthlyBusinessEffects: {
      revenue: -7000,
      customerSatisfaction: -3,
      risk: 3,
    },

    monthlyOperationsEffects: {
      backlog: 5000,
    },

    escalationMessage:
      "The unresolved customer issue is continuing to absorb resources without clear commercial value.",
  },


  "equipment-disruption": {
    type: "OPERATIONS",

    severity: "CRITICAL",

    title:
      "Equipment failure remains unresolved",

    description:
      "Critical operational equipment has not been fully restored, reducing the company's ability to meet normal delivery targets.",

    initialOperationsEffects: {
      capacity: -35,
      equipmentHealth: -45,
      deliveryPerformance: -20,
      backlog: 30000,
    },

    monthlyBusinessEffects: {
      revenue: -20000,
      expenses: 8000,
      employeeMorale: -3,
      customerSatisfaction: -4,
      risk: 5,
    },

    monthlyOperationsEffects: {
      capacity: -5,
      equipmentHealth: -6,
      deliveryPerformance: -4,
      backlog: 20000,
    },

    escalationMessage:
      "The unresolved equipment problem is reducing output, increasing backlog and placing employees under pressure.",
  },


  "emergency-cash-blindspot": {
    type: "FINANCE",

    severity: "CRITICAL",

    title:
      "Emergency cash position was not assessed",

    description:
      "Management entered an operational crisis without properly understanding how much cash could safely be committed.",

    initialOperationsEffects: {},

    monthlyBusinessEffects: {
      cash: -6000,
      risk: 4,
    },

    monthlyOperationsEffects: {},

    escalationMessage:
      "Weak emergency cash planning is reducing the company's ability to respond to operational problems.",
  },


  "expansion-readiness-gap": {
    type: "STRATEGY",

    severity: "CRITICAL",

    title:
      "Expansion readiness was not properly assessed",

    description:
      "Management considered further growth without fully checking whether finance, people and operations could support it.",

    initialOperationsEffects: {
      capacity: -5,
      deliveryPerformance: -4,
    },

    monthlyBusinessEffects: {
      expenses: 6000,
      employeeMorale: -2,
      customerSatisfaction: -2,
      risk: 4,
    },

    monthlyOperationsEffects: {
      capacity: -2,
      backlog: 10000,
    },

    escalationMessage:
      "Growth pressure is exposing weaknesses that should have been identified before expansion.",
  },


  "financial-control-gap": {
    type: "FINANCE",

    severity: "CRITICAL",

    title:
      "Financial position was not properly reviewed",

    description:
      "The business entered year-end without a complete review of cash, debt, receivables and liabilities.",

    initialOperationsEffects: {},

    monthlyBusinessEffects: {
      cash: -5000,
      expenses: 3000,
      risk: 4,
    },

    monthlyOperationsEffects: {},

    escalationMessage:
      "Weak financial control is reducing management's ability to make informed cash and funding decisions.",
  },


  "year-end-review-gap": {
    type: "STRATEGY",

    severity: "CRITICAL",

    title:
      "Year-end business review was not completed",

    description:
      "Management finished the year without fully reviewing what improved, what deteriorated and what remains unresolved.",

    initialOperationsEffects: {},

    monthlyBusinessEffects: {
      risk: 3,
    },

    monthlyOperationsEffects: {},

    escalationMessage:
      "Unresolved management issues are carrying into the next planning period.",
  },
};


const taskIssueMap = {
  "task-month7-capacity":
    "operational-capacity-pressure",

  "task-month8-key-customer":
    "customer-contract-risk",

  "task-month9-continuity":
    "equipment-disruption",

  "task-month9-emergency-cash":
    "emergency-cash-blindspot",

  "task-month10-expansion-readiness":
    "expansion-readiness-gap",

  "task-month11-financial-review":
    "financial-control-gap",

  "task-month12-year-review":
    "year-end-review-gap",
};


export const getIssueForTask = (
  task
) => {
  if (
    !task ||
    task.priority !==
      "CRITICAL"
  ) {
    return null;
  }

  const issueKey =
    taskIssueMap[
      task.id
    ];

  if (!issueKey) {
    return null;
  }

  return {
    key: issueKey,
    ...issueDefinitions[
      issueKey
    ],
  };
};


export const createIssueFromTask = (
  state,
  task
) => {
  const definition =
    getIssueForTask(
      task
    );

  if (!definition) {
    return state;
  }

  const existing =
    (
      state.businessIssues ||
      []
    ).find(
      (issue) =>
        issue.key ===
          definition.key &&
        issue.status ===
          "OPEN"
    );

  if (existing) {
    return state;
  }

  const issue = {
    id:
      `${definition.key}-${Date.now()}`,

    key:
      definition.key,

    sourceTaskId:
      task.id,

    type:
      definition.type,

    severity:
      definition.severity,

    status:
      "OPEN",

    title:
      definition.title,

    description:
      definition.description,

    openedDay:
      state.currentDay,

    ageMonths: 0,

    totalFinancialImpact: 0,

    monthlyBusinessEffects:
      definition.monthlyBusinessEffects ||
      {},

    monthlyOperationsEffects:
      definition.monthlyOperationsEffects ||
      {},

    escalationMessage:
      definition.escalationMessage,

    createdAt:
      new Date().toISOString(),
  };

  return {
    ...state,

    operations:
      updateOperations(
        state.operations,
        definition
          .initialOperationsEffects ||
          {}
      ),

    businessIssues: [
      ...(
        state.businessIssues ||
        []
      ),
      issue,
    ],

    activityLog: [
      ...(
        state.activityLog ||
        []
      ),

      {
        id:
          `issue-opened-${Date.now()}`,

        type:
          "BUSINESS_ISSUE_OPENED",

        day:
          state.currentDay,

        issueId:
          issue.id,

        title:
          issue.title,

        description:
          `A critical task was not resolved: ${task.title}`,

        createdAt:
          new Date().toISOString(),
      },
    ],
  };
};


export const processOpenBusinessIssues = (
  state
) => {
  const openIssues =
    (
      state.businessIssues ||
      []
    ).filter(
      (issue) =>
        issue.status ===
        "OPEN"
    );

  if (
    openIssues.length ===
    0
  ) {
    return {
      ...state,
      recentIssueImpacts: [],
    };
  }

  let business = {
    ...state.business,
  };

  let operations = {
    capacity: 100,
    equipmentHealth: 100,
    deliveryPerformance: 100,
    backlog: 0,
    ...state.operations,
  };

  const impacts = [];

  const updatedIssues =
    (
      state.businessIssues ||
      []
    ).map(
      (issue) => {
        if (
          issue.status !==
          "OPEN"
        ) {
          return issue;
        }

        business =
          applyEffects(
            business,
            issue
              .monthlyBusinessEffects ||
              {}
          );

        operations =
          updateOperations(
            operations,
            issue
              .monthlyOperationsEffects ||
              {}
          );

        const financialImpact =
          Math.abs(
            Number(
              issue
                .monthlyBusinessEffects
                ?.revenue ||
                0
            )
          ) +
          Math.abs(
            Number(
              issue
                .monthlyBusinessEffects
                ?.expenses ||
                0
            )
          );

        impacts.push({
          issueId:
            issue.id,

          key:
            issue.key,

          title:
            issue.title,

          severity:
            issue.severity,

          message:
            issue.escalationMessage,

          ageMonths:
            issue.ageMonths +
            1,

          businessEffects:
            issue
              .monthlyBusinessEffects ||
              {},

          operationsEffects:
            issue
              .monthlyOperationsEffects ||
              {},
        });

        return {
          ...issue,

          ageMonths:
            issue.ageMonths +
            1,

          totalFinancialImpact:
            Number(
              issue
                .totalFinancialImpact ||
                0
            ) +
            financialImpact,

          lastAppliedDay:
            state.currentDay,
        };
      }
    );

  return {
    ...state,

    business,

    operations,

    businessIssues:
      updatedIssues,

    recentIssueImpacts:
      impacts,

    activityLog: [
      ...(
        state.activityLog ||
        []
      ),

      ...impacts.map(
        (impact) => ({
          id:
            `issue-impact-${impact.issueId}-${Date.now()}-${Math.random()}`,

          type:
            "BUSINESS_ISSUE_IMPACT",

          day:
            state.currentDay,

          issueId:
            impact.issueId,

          title:
            impact.title,

          description:
            impact.message,

          createdAt:
            new Date().toISOString(),
        })
      ),
    ],
  };
};


export const resolveBusinessIssue = (
  state,
  issueId,
  resolution = {}
) => {
  const issue =
    (
      state.businessIssues ||
      []
    ).find(
      (item) =>
        item.id ===
        issueId
    );

  if (
    !issue ||
    issue.status !== "OPEN"
  ) {
    return state;
  }

  let business =
    applyEffects(
      state.business,
      resolution.businessEffects ||
        {}
    );

  let operations =
    updateOperations(
      state.operations,
      resolution.operationsEffects ||
        {}
    );

  const resolvedAt =
    new Date().toISOString();

  return {
    ...state,

    business,

    operations,

    businessIssues:
      (
        state.businessIssues ||
        []
      ).map(
        (item) =>
          item.id === issueId
            ? {
                ...item,
                status:
                  "RESOLVED",
                resolvedDay:
                  state.currentDay,
                resolution:
                  resolution.title ||
                  "Resolved",
                resolvedAt,
              }
            : item
      ),

    activityLog: [
      ...(
        state.activityLog ||
        []
      ),

      {
        id:
          `issue-resolved-${Date.now()}`,

        type:
          "BUSINESS_ISSUE_RESOLVED",

        day:
          state.currentDay,

        issueId,

        title:
          issue.title,

        description:
          resolution.title ||
          "Business issue resolved",

        createdAt:
          resolvedAt,
      },
    ],
  };
};


export const getBusinessIssueSummary = (
  state
) => {
  const all =
    state.businessIssues ||
    [];

  const open =
    all.filter(
      (item) =>
        item.status ===
        "OPEN"
    );

  const critical =
    open.filter(
      (item) =>
        item.severity ===
        "CRITICAL"
    );

  return {
    total: all.length,

    open: open.length,

    resolved:
      all.length -
      open.length,

    critical:
      critical.length,

    oldestOpenMonths:
      open.length
        ? Math.max(
            ...open.map(
              (item) =>
                item.ageMonths ||
                0
            )
          )
        : 0,

    issues: all,
  };
};


// ==========================================================
// RESOLVE PERSISTENT ISSUE WHEN POSTPONED TASK IS FINALLY DONE
// ==========================================================

const getTaskIssueResolution = (
  issue
) => {
  const age =
    Math.max(
      0,
      Number(
        issue?.ageMonths || 0
      )
    );


  if (
    issue?.key ===
    "equipment-disruption"
  ) {
    /*
     * Delayed maintenance becomes more expensive.
     *
     * Immediate repair:
     * approximately R30,000
     *
     * Every additional month unresolved:
     * +R10,000
     */
    const repairCost =
      30000 +
      age * 10000;

    return {
      title:
        `Equipment repaired after ${age} month${
          age === 1 ? "" : "s"
        } of disruption`,

      businessEffects: {
        cash: -repairCost,
        expenses: repairCost,
        customerSatisfaction: 4,
        employeeMorale: 3,
        risk: -8,
      },

      operationsEffects: {
        capacity: 30,
        equipmentHealth: 40,
        deliveryPerformance: 18,
        backlog: -25000,
      },
    };
  }


  if (
    issue?.key ===
    "operational-capacity-pressure"
  ) {
    return {
      title:
        "Capacity pressure addressed",

      businessEffects: {
        expenses:
          4000 +
          age * 2000,

        employeeMorale: 4,
        risk: -5,
      },

      operationsEffects: {
        capacity: 10,
        deliveryPerformance: 7,
        backlog: -12000,
      },
    };
  }


  if (
    issue?.key ===
    "customer-contract-risk"
  ) {
    return {
      title:
        "Customer contract reviewed",

      businessEffects: {
        customerSatisfaction: 4,
        risk: -4,
      },

      operationsEffects: {
        deliveryPerformance: 3,
        backlog: -5000,
      },
    };
  }


  if (
    issue?.key ===
    "emergency-cash-blindspot"
  ) {
    return {
      title:
        "Emergency cash position reviewed",

      businessEffects: {
        risk: -5,
      },

      operationsEffects: {},
    };
  }


  if (
    issue?.key ===
    "expansion-readiness-gap"
  ) {
    return {
      title:
        "Expansion readiness reassessed",

      businessEffects: {
        employeeMorale: 2,
        customerSatisfaction: 2,
        risk: -5,
      },

      operationsEffects: {
        capacity: 6,
        deliveryPerformance: 5,
        backlog: -10000,
      },
    };
  }


  if (
    issue?.key ===
    "financial-control-gap"
  ) {
    return {
      title:
        "Financial controls reviewed",

      businessEffects: {
        risk: -6,
      },

      operationsEffects: {},
    };
  }


  if (
    issue?.key ===
    "year-end-review-gap"
  ) {
    return {
      title:
        "Year-end management review completed",

      businessEffects: {
        risk: -4,
      },

      operationsEffects: {},
    };
  }


  return {
    title:
      "Business issue resolved",

    businessEffects: {
      risk: -3,
    },

    operationsEffects: {},
  };
};


export const resolveIssueForTask = (
  state,
  task
) => {
  if (!task) {
    return state;
  }

  const issue =
    (
      state.businessIssues ||
      []
    ).find(
      (item) =>
        item.status ===
          "OPEN" &&
        item.sourceTaskId ===
          task.id
    );


  if (!issue) {
    return state;
  }


  const resolution =
    getTaskIssueResolution(
      issue
    );


  return resolveBusinessIssue(
    state,
    issue.id,
    resolution
  );
};
