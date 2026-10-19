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


const formatMoney = (
  value
) =>
  new Intl.NumberFormat(
    "en-ZA",
    {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0,
    }
  ).format(
    Number(value || 0)
  );


const mergeEffects = (
  original = {},
  additional = {}
) => {
  const result = {
    ...original,
  };

  Object.entries(
    additional
  ).forEach(
    ([key, value]) => {
      result[key] =
        Number(
          result[key] || 0
        ) +
        Number(
          value || 0
        );
    }
  );

  return result;
};


const getOperations = (
  state
) => ({
  capacity:
    clamp(
      state.operations
        ?.capacity ?? 100,
      0,
      100
    ),

  equipmentHealth:
    clamp(
      state.operations
        ?.equipmentHealth ?? 100,
      0,
      100
    ),

  deliveryPerformance:
    clamp(
      state.operations
        ?.deliveryPerformance ?? 100,
      0,
      100
    ),

  backlog:
    Math.max(
      0,
      Number(
        state.operations
          ?.backlog || 0
      )
    ),
});


const getOpenCriticalIssues = (
  state
) =>
  (
    state.businessIssues ||
    []
  ).filter(
    (issue) =>
      issue.status ===
        "OPEN" &&
      issue.severity ===
        "CRITICAL"
  );


export const getOperationalPressure = (
  state
) => {
  const operations =
    getOperations(
      state
    );

  const criticalIssues =
    getOpenCriticalIssues(
      state
    );


  let level =
    "HEALTHY";


  if (
    operations.capacity < 60 ||
    operations.deliveryPerformance <
      60 ||
    criticalIssues.length >= 2
  ) {
    level = "CRITICAL";
  } else if (
    operations.capacity < 75 ||
    operations.deliveryPerformance <
      75 ||
    criticalIssues.length >= 1
  ) {
    level = "CONSTRAINED";
  } else if (
    operations.capacity < 90 ||
    operations.deliveryPerformance <
      90 ||
    operations.backlog > 0
  ) {
    level = "PRESSURED";
  }


  return {
    level,

    operations,

    criticalIssues,

    issueCount:
      criticalIssues.length,

    isHealthy:
      level === "HEALTHY",
  };
};


const getOperationalWarning = (
  state
) => {
  const pressure =
    getOperationalPressure(
      state
    );

  if (
    pressure.isHealthy
  ) {
    return null;
  }

  const {
    operations,
    criticalIssues,
    level,
  } = pressure;


  const title =
    level === "CRITICAL"
      ? "Critical operating constraint"
      : level ===
          "CONSTRAINED"
        ? "Operating capacity is constrained"
        : "Operations are under pressure";


  const text =
    `The company is currently operating at ${Math.round(
      operations.capacity
    )}% capacity with ${Math.round(
      operations.deliveryPerformance
    )}% delivery performance and ${formatMoney(
      operations.backlog
    )} of work backlog. ` +
    (
      criticalIssues.length > 0
        ? `${criticalIssues.length} critical business issue${
            criticalIssues.length ===
            1
              ? " remains"
              : "s remain"
          } unresolved. `
        : ""
    ) +
    "Decisions in this period will be affected by the condition of the business you created in earlier months.";


  return {
    level,
    title,
    text,
  };
};


const getExpansionPenalty = (
  level,
  decisionId
) => {
  const penalties = {
    HEALTHY: {
      "expansion-full": {
        business: {},
        operations: {},
      },

      "expansion-pilot": {
        business: {},
        operations: {},
      },

      "expansion-partner": {
        business: {},
        operations: {},
      },

      "expansion-decline": {
        business: {},
        operations: {},
      },
    },


    PRESSURED: {
      "expansion-full": {
        business: {
          revenue: -10000,
          expenses: 10000,
          employeeMorale: -2,
          customerSatisfaction: -2,
          risk: 4,
        },

        operations: {
          capacity: -5,
          deliveryPerformance: -5,
          backlog: 20000,
        },
      },

      "expansion-pilot": {
        business: {
          revenue: -3000,
          expenses: 3000,
          risk: 1,
        },

        operations: {
          capacity: -1,
          deliveryPerformance: -1,
          backlog: 5000,
        },
      },

      "expansion-partner": {
        business: {
          expenses: 3000,
          risk: 1,
        },

        operations: {
          deliveryPerformance: -1,
          backlog: 3000,
        },
      },

      "expansion-decline": {
        business: {
          risk: -2,
        },

        operations: {},
      },
    },


    CONSTRAINED: {
      "expansion-full": {
        business: {
          revenue: -25000,
          expenses: 20000,
          employeeMorale: -6,
          customerSatisfaction: -7,
          risk: 12,
        },

        operations: {
          capacity: -10,
          deliveryPerformance: -12,
          backlog: 50000,
        },
      },

      "expansion-pilot": {
        business: {
          revenue: -8000,
          expenses: 8000,
          employeeMorale: -2,
          customerSatisfaction: -2,
          risk: 5,
        },

        operations: {
          capacity: -3,
          deliveryPerformance: -3,
          backlog: 15000,
        },
      },

      "expansion-partner": {
        business: {
          revenue: -5000,
          expenses: 5000,
          customerSatisfaction: -1,
          risk: 2,
        },

        operations: {
          capacity: -1,
          deliveryPerformance: -2,
          backlog: 8000,
        },
      },

      "expansion-decline": {
        business: {
          risk: -3,
        },

        operations: {},
      },
    },


    CRITICAL: {
      "expansion-full": {
        business: {
          revenue: -45000,
          expenses: 30000,
          customers: -2,
          employeeMorale: -10,
          customerSatisfaction: -12,
          risk: 20,
        },

        operations: {
          capacity: -15,
          equipmentHealth: -4,
          deliveryPerformance: -18,
          backlog: 80000,
        },
      },

      "expansion-pilot": {
        business: {
          revenue: -15000,
          expenses: 15000,
          employeeMorale: -4,
          customerSatisfaction: -5,
          risk: 10,
        },

        operations: {
          capacity: -6,
          deliveryPerformance: -7,
          backlog: 30000,
        },
      },

      "expansion-partner": {
        business: {
          revenue: -10000,
          expenses: 9000,
          employeeMorale: -2,
          customerSatisfaction: -3,
          risk: 6,
        },

        operations: {
          capacity: -2,
          deliveryPerformance: -4,
          backlog: 15000,
        },
      },

      "expansion-decline": {
        business: {
          risk: -5,
        },

        operations: {},
      },
    },
  };


  return (
    penalties[
      level
    ]?.[
      decisionId
    ] || {
      business: {},
      operations: {},
    }
  );
};


const getExpansionExplanation = (
  decision,
  pressure
) => {
  if (
    pressure.isHealthy
  ) {
    return (
      decision.outcome
        ?.explanation ||
      ""
    );
  }


  const capacity =
    Math.round(
      pressure.operations
        .capacity
    );


  if (
    decision.id ===
    "expansion-full"
  ) {
    return (
      `You committed to aggressive expansion while the existing company was operating at only ${capacity}% capacity. ` +
      "The additional demand increased pressure on employees, delivery performance and the existing backlog."
    );
  }


  if (
    decision.id ===
    "expansion-pilot"
  ) {
    return (
      `You tested the opportunity while the business was operating at ${capacity}% capacity. ` +
      "The smaller commitment limited the damage, although existing operational pressure still reduced the benefit of the pilot."
    );
  }


  if (
    decision.id ===
    "expansion-partner"
  ) {
    return (
      `You used a partner because internal capacity was only ${capacity}%. ` +
      "Sharing delivery reduced the strain on the company, although the existing operation still remained under pressure."
    );
  }


  if (
    decision.id ===
    "expansion-decline"
  ) {
    return (
      `You declined expansion while the company was operating at ${capacity}% capacity. ` +
      "This protected the existing operation from additional demand and gave management room to address unresolved problems."
    );
  }


  return (
    decision.outcome
      ?.explanation ||
    ""
  );
};


const adaptExpansionScenario = (
  scenario,
  state
) => {
  const pressure =
    getOperationalPressure(
      state
    );

  const warning =
    getOperationalWarning(
      state
    );


  if (
    pressure.isHealthy
  ) {
    return {
      ...scenario,

      operationalWarning:
        null,
    };
  }


  const decisions =
    scenario.decisions.map(
      (decision) => {
        const penalty =
          getExpansionPenalty(
            pressure.level,
            decision.id
          );


        return {
          ...decision,

          description:
            decision.id ===
            "expansion-full"
              ? `${decision.description} Your current operating capacity is only ${Math.round(
                  pressure.operations
                    .capacity
                )}%, so aggressive growth carries additional execution risk.`
              : decision.description,

          immediateEffects:
            mergeEffects(
              decision
                .immediateEffects ||
                {},
              penalty.business
            ),

          operationsEffects: {
            ...(
              decision
                .operationsEffects ||
              {}
            ),
            ...penalty.operations,
          },

          outcome: {
            ...decision.outcome,

            explanation:
              getExpansionExplanation(
                decision,
                pressure
              ),
          },
        };
      }
    );


  return {
    ...scenario,

    priority:
      pressure.level ===
      "CRITICAL"
        ? "CRITICAL"
        : scenario.priority,

    subject:
      pressure.level ===
      "CRITICAL"
        ? "Expansion opportunity arrives while operations are critically constrained"
        : scenario.subject,

    message:
      `${warning.text} ${scenario.message}`,

    context: {
      ...scenario.context,

      title:
        warning.title,

      text:
        `${warning.text} ${scenario.context?.text || ""}`,
    },

    operationalWarning:
      warning,

    decisions,
  };
};


const adaptLaterScenario = (
  scenario,
  state
) => {
  const warning =
    getOperationalWarning(
      state
    );

  if (!warning) {
    return {
      ...scenario,

      operationalWarning:
        null,
    };
  }


  return {
    ...scenario,

    message:
      `${warning.text} ${scenario.message || ""}`,

    context: {
      ...(scenario.context || {}),

      title:
        warning.title,

      text:
        `${warning.text} ${scenario.context?.text || ""}`,
    },

    operationalWarning:
      warning,
  };
};


export const adaptScenarioForOperations = (
  scenario,
  state
) => {
  if (!scenario) {
    return scenario;
  }


  if (
    scenario.id ===
    "expansion-opportunity"
  ) {
    return adaptExpansionScenario(
      scenario,
      state
    );
  }


  /*
   * November and December should remember
   * unresolved operational problems even
   * when the main scenario is financial or
   * strategic.
   */
  if (
    Number(
      scenario.day
    ) >= 11
  ) {
    return adaptLaterScenario(
      scenario,
      state
    );
  }


  return scenario;
};


// ==========================================================
// APPLY OPERATING EFFECTS FROM A DECISION
// ==========================================================

export const applyDecisionOperationsEffects = (
  state,
  decision
) => {
  const effects =
    decision
      ?.operationsEffects ||
    {};


  if (
    Object.keys(
      effects
    ).length === 0
  ) {
    return state;
  }


  const before = {
    capacity:
      state.operations
        ?.capacity ?? 100,

    equipmentHealth:
      state.operations
        ?.equipmentHealth ?? 100,

    deliveryPerformance:
      state.operations
        ?.deliveryPerformance ?? 100,

    backlog:
      state.operations
        ?.backlog ?? 0,
  };


  const after = {
    capacity:
      clamp(
        before.capacity +
          Number(
            effects.capacity ||
              0
          ),
        0,
        100
      ),

    equipmentHealth:
      clamp(
        before.equipmentHealth +
          Number(
            effects.equipmentHealth ||
              0
          ),
        0,
        100
      ),

    deliveryPerformance:
      clamp(
        before.deliveryPerformance +
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
        Number(
          before.backlog || 0
        ) +
          Number(
            effects.backlog ||
              0
          )
      ),
  };


  return {
    ...state,

    operations:
      after,

    activityLog: [
      ...(
        state.activityLog ||
        []
      ),

      {
        id:
          `operations-decision-${Date.now()}`,

        type:
          "OPERATIONAL_DECISION_IMPACT",

        day:
          state.currentDay,

        decisionId:
          decision.id,

        title:
          decision.title,

        description:
          `This decision changed operating capacity from ${Math.round(
            before.capacity
          )}% to ${Math.round(
            after.capacity
          )}% and backlog from ${formatMoney(
            before.backlog
          )} to ${formatMoney(
            after.backlog
          )}.`,

        operationsBefore:
          before,

        operationsAfter:
          after,

        createdAt:
          new Date().toISOString(),
      },
    ],
  };
};
