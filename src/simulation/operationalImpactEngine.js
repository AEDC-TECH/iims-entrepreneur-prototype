const clamp = (
  value,
  minimum = 0,
  maximum = 100
) =>
  Math.max(
    minimum,
    Math.min(
      maximum,
      Number(value || 0)
    )
  );


const money = (
  value
) =>
  Math.max(
    0,
    Math.round(
      Number(value || 0)
    )
  );


const ensureOperations = (
  state
) => ({
  capacity:
    clamp(
      state?.operations?.capacity ??
      100
    ),

  equipmentHealth:
    clamp(
      state
        ?.operations
        ?.equipmentHealth ??
      100
    ),

  deliveryPerformance:
    clamp(
      state
        ?.operations
        ?.deliveryPerformance ??
      100
    ),

  backlog:
    money(
      state?.operations?.backlog ??
      0
    ),
});


const addIssue = (
  state,
  issue
) => {
  const existing =
    state.businessIssues ||
    [];


  const alreadyOpen =
    existing.some(
      (item) =>
        item.id ===
          issue.id &&
        !item.resolved &&
        String(
          item.status ||
          "open"
        ).toLowerCase() !==
          "resolved"
    );


  if (alreadyOpen) {
    return state;
  }


  return {
    ...state,

    businessIssues: [
      ...existing,

      {
        ...issue,

        status:
          "open",

        resolved:
          false,

        openedDay:
          state.currentDay,

        createdAt:
          new Date()
            .toISOString(),
      },
    ],
  };
};


const resolveIssue = (
  state,
  issueId
) => ({
  ...state,

  businessIssues:
    (
      state.businessIssues ||
      []
    ).map(
      (issue) =>
        issue.id === issueId
          ? {
              ...issue,

              status:
                "resolved",

              resolved:
                true,

              resolvedDay:
                state.currentDay,

              resolvedAt:
                new Date()
                  .toISOString(),
            }
          : issue
    ),
});


const applyOperations = (
  state,
  effects = {},
  reason = ""
) => {
  const operations =
    ensureOperations(
      state
    );


  const next = {
    capacity:
      clamp(
        operations.capacity +
        Number(
          effects.capacity ||
          0
        )
      ),

    equipmentHealth:
      clamp(
        operations
          .equipmentHealth +
        Number(
          effects.equipmentHealth ||
          0
        )
      ),

    deliveryPerformance:
      clamp(
        operations
          .deliveryPerformance +
        Number(
          effects.deliveryPerformance ||
          0
        )
      ),

    backlog:
      money(
        operations.backlog +
        Number(
          effects.backlog ||
          0
        )
      ),
  };


  const impact = {
    id:
      `operations-impact-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,

    day:
      state.currentDay,

    reason,

    before:
      operations,

    after:
      next,

    effects: {
      ...effects,
    },

    createdAt:
      new Date()
        .toISOString(),
  };


  return {
    ...state,

    operations:
      next,

    recentIssueImpacts: [
      impact,

      ...(
        state.recentIssueImpacts ||
        []
      ),
    ].slice(
      0,
      8
    ),
  };
};


/* =========================================================
   BUSINESS DECISIONS
========================================================= */

export const applyDecisionOperationalImpact = (
  state,
  scenario,
  decision
) => {
  if (
    !state ||
    !decision
  ) {
    return state;
  }


  let nextState =
    state;


  const id =
    String(
      decision.id ||
      ""
    );


  const day =
    Number(
      scenario?.day ||
      state.currentDay ||
      0
    );


  const effects =
    decision.immediateEffects ||
    {};


  /*
   * MONTH 5 — AUTOMATION / EQUIPMENT INVESTMENT
   *
   * All full-investment funding methods buy the
   * same underlying equipment, so operations
   * should improve regardless of whether the
   * entrepreneur chose debt, equity or cash.
   */
  if (
    [
      "fund-bank",
      "fund-equity",
      "fund-self",
    ].includes(
      id
    )
  ) {
    nextState =
      applyOperations(
        nextState,
        {
          capacity:
            10,

          equipmentHealth:
            12,

          deliveryPerformance:
            6,

          backlog:
            -15000,
        },
        "Automation and upgraded equipment increased operating capability."
      );
  }


  if (
    id ===
    "fund-phase"
  ) {
    nextState =
      applyOperations(
        nextState,
        {
          capacity:
            5,

          equipmentHealth:
            6,

          deliveryPerformance:
            3,

          backlog:
            -7000,
        },
        "Phased automation produced a smaller immediate operational improvement."
      );
  }


  /*
   * GENERIC GROWTH PRESSURE
   *
   * Large increases in customers/revenue create
   * work before the operation necessarily has the
   * capacity to deliver it.
   */
  if (
    day >= 7 &&
    (
      Number(
        effects.customers ||
        0
      ) >= 3 ||
      Number(
        effects.revenue ||
        0
      ) >= 50000
    )
  ) {
    const newEmployees =
      Math.max(
        0,
        Number(
          effects.employees ||
          0
        )
      );


    const staffingProtection =
      Math.min(
        10,
        newEmployees * 4
      );


    nextState =
      applyOperations(
        nextState,
        {
          capacity:
            -Math.max(
              3,
              11 -
              staffingProtection
            ),

          deliveryPerformance:
            -Math.max(
              2,
              7 -
              Math.round(
                staffingProtection /
                2
              )
            ),

          backlog:
            Math.max(
              10000,
              Math.round(
                Math.max(
                  0,
                  Number(
                    effects.revenue ||
                    0
                  )
                ) *
                0.30
              )
            ),
        },
        "Growth increased customer demand faster than the existing operation could absorb it."
      );
  }


  /*
   * MONTH 10 — EXPANSION
   */
  if (
    id ===
    "expansion-full"
  ) {
    const operations =
      ensureOperations(
        nextState
      );


    if (
      operations.capacity <
        85 ||
      operations.deliveryPerformance <
        85
    ) {
      nextState =
        applyOperations(
          nextState,
          {
            capacity:
              -12,

            deliveryPerformance:
              -10,

            backlog:
              45000,
          },
          "Aggressive expansion placed additional load on an operation that was not fully ready."
        );


      nextState =
        addIssue(
          nextState,
          {
            id:
              "expansion-capacity-overload",

            title:
              "Expansion is exceeding operating capacity",

            severity:
              "critical",

            category:
              "OPERATIONS",

            description:
              "The business expanded while existing operating capacity and delivery performance were already under pressure.",

            monthlyEffects: {
              capacity:
                -3,

              deliveryPerformance:
                -3,

              backlog:
                15000,
            },
          }
        );
    }
  }


  /*
   * Hiring creates some operational relief.
   */
  if (
    Number(
      effects.employees ||
      0
    ) >= 2
  ) {
    nextState =
      applyOperations(
        nextState,
        {
          capacity:
            Math.min(
              8,
              Number(
                effects.employees
              ) *
              3
            ),

          deliveryPerformance:
            3,
        },
        "Additional employees increased delivery capacity."
      );
  }


  return nextState;
};


/* =========================================================
   BUSINESS TASKS
========================================================= */

export const applyTaskOperationalImpact = (
  state,
  task,
  action
) => {
  if (
    !state ||
    !task
  ) {
    return state;
  }


  let nextState =
    state;


  const id =
    String(
      task.id ||
      ""
    );


  const completed =
    action ===
    "complete";


  /* MONTH 7 — CAPACITY REVIEW */

  if (
    id ===
    "task-month7-capacity"
  ) {
    if (completed) {
      nextState =
        applyOperations(
          nextState,
          {
            capacity:
              5,

            deliveryPerformance:
              3,

            backlog:
              -10000,
          },
          "Management reviewed growth capacity and corrected pressure early."
        );


      nextState =
        resolveIssue(
          nextState,
          "operational-capacity-pressure"
        );
    } else {
      nextState =
        applyOperations(
          nextState,
          {
            capacity:
              -10,

            deliveryPerformance:
              -5,

            backlog:
              25000,
          },
          "Management postponed the capacity review while demand continued growing."
        );


      nextState =
        addIssue(
          nextState,
          {
            id:
              "operational-capacity-pressure",

            title:
              "Demand is exceeding operating capacity",

            severity:
              "critical",

            category:
              "OPERATIONS",

            description:
              "Growth has placed more work on the business than its current people and systems can comfortably deliver.",

            monthlyEffects: {
              capacity:
                -3,

              deliveryPerformance:
                -3,

              backlog:
                12000,
            },
          }
        );
    }
  }


  /* MONTH 7 — EMPLOYEE PRESSURE */

  if (
    id ===
    "task-month7-team-pressure"
  ) {
    nextState =
      applyOperations(
        nextState,
        completed
          ? {
              capacity:
                3,

              deliveryPerformance:
                2,
            }
          : {
              capacity:
                -5,

              deliveryPerformance:
                -4,

              backlog:
                12000,
            },
        completed
          ? "Management addressed workload and overtime pressure."
          : "Employee overload began reducing operating performance."
      );
  }


  /* MONTH 9 — BUSINESS CONTINUITY */

  if (
    id ===
    "task-month9-continuity"
  ) {
    if (completed) {
      nextState =
        applyOperations(
          nextState,
          {
            capacity:
              8,

            deliveryPerformance:
              10,

            backlog:
              -20000,
          },
          "A continuity plan protected customer delivery during the operational disruption."
        );


      nextState =
        resolveIssue(
          nextState,
          "equipment-disruption"
        );
    } else {
      nextState =
        applyOperations(
          nextState,
          {
            capacity:
              -12,

            equipmentHealth:
              -15,

            deliveryPerformance:
              -12,

            backlog:
              35000,
          },
          "The operational disruption continued without a continuity plan."
        );


      nextState =
        addIssue(
          nextState,
          {
            id:
              "equipment-disruption",

            title:
              "Equipment failure is disrupting customer delivery",

            severity:
              "critical",

            category:
              "OPERATIONS",

            description:
              "The equipment problem has not been contained and is now affecting capacity, delivery and unfinished work.",

            monthlyEffects: {
              equipmentHealth:
                -4,

              capacity:
                -4,

              deliveryPerformance:
                -5,

              backlog:
                18000,
            },
          }
        );
    }
  }


  /* MONTH 9 — EMERGENCY CASH */

  if (
    id ===
    "task-month9-emergency-cash"
  ) {
    if (completed) {
      nextState =
        applyOperations(
          nextState,
          {
            equipmentHealth:
              3,
          },
          "Management identified funding capacity for the operational recovery."
        );
    } else {
      nextState =
        addIssue(
          nextState,
          {
            id:
              "emergency-cash-blindspot",

            title:
              "Operational recovery has no confirmed funding plan",

            severity:
              "critical",

            category:
              "FINANCE",

            description:
              "Management has not established how much cash can safely be committed to the operational crisis.",

            monthlyEffects: {
              equipmentHealth:
                -2,

              capacity:
                -2,
            },
          }
        );
    }
  }


  /* MONTH 10 — EXPANSION READINESS */

  if (
    id ===
    "task-month10-expansion-readiness"
  ) {
    if (completed) {
      nextState =
        applyOperations(
          nextState,
          {
            capacity:
              3,

            deliveryPerformance:
              3,
          },
          "Management completed an operating-capacity review before expansion."
        );


      nextState =
        resolveIssue(
          nextState,
          "expansion-capacity-overload"
        );


      nextState =
        resolveIssue(
          nextState,
          "expansion-readiness-gap"
        );
    } else {
      nextState =
        addIssue(
          nextState,
          {
            id:
              "expansion-readiness-gap",

            title:
              "Expansion readiness has not been verified",

            severity:
              "critical",

            category:
              "STRATEGY",

            description:
              "Management is considering further growth without confirming whether the current operation can support it.",

            monthlyEffects: {
              capacity:
                -3,

              deliveryPerformance:
                -2,

              backlog:
                10000,
            },
          }
        );
    }
  }


  return nextState;
};


/* =========================================================
   MONTH-TO-MONTH CARRYOVER
========================================================= */

export const applyOperationalCarryover = (
  state
) => {
  let nextState =
    state;


  const issues =
    (
      nextState.businessIssues ||
      []
    ).filter(
      (issue) =>
        !issue.resolved &&
        String(
          issue.status ||
          "open"
        ).toLowerCase() !==
          "resolved"
    );


  issues.forEach(
    (issue) => {
      if (
        issue.monthlyEffects
      ) {
        nextState =
          applyOperations(
            nextState,
            issue.monthlyEffects,
            `${issue.title} continued affecting the business.`
          );
      }
    }
  );


  /*
   * Natural backlog pressure:
   * a large backlog gradually damages delivery.
   */
  const operations =
    ensureOperations(
      nextState
    );


  if (
    operations.backlog >=
    100000
  ) {
    nextState =
      applyOperations(
        nextState,
        {
          capacity:
            -3,

          deliveryPerformance:
            -6,
        },
        "A large backlog is creating sustained delivery pressure."
      );
  }


  return nextState;
};
