import {
  applyDecisionOperationalImpact,
  applyTaskOperationalImpact,
  applyOperationalCarryover,
} from "./operationalImpactEngine";

import {
  ensureCharacters,
  updateRelationship,
} from "./relationshipEngine";

import {
  getDecisionRelationshipEffects,
} from "./relationshipConsequences";

import {
  createInitialState,
  STORAGE_KEY,
} from "./initialState";

import {
  createIssueFromTask,
  processOpenBusinessIssues,
  resolveIssueForTask,
} from "./businessIssueEngine";

const clamp = (value, min, max) => {
  return Math.min(max, Math.max(min, value));
};

const BUSINESS_PERCENT_FIELDS = new Set([
  "customerSatisfaction",
  "employeeMorale",
  "risk",
]);

const SKILL_FIELDS = new Set([
  "cashFlow",
  "financialPlanning",
  "peopleManagement",
  "customerManagement",
  "pricing",
  "riskManagement",
  "fundingDecisions",
  "growthStrategy",
]);

const applyNumericEffects = (
  source,
  effects = {}
) => {
  const updated = { ...source };

  Object.entries(effects).forEach(
    ([key, change]) => {
      const current = Number(
        updated[key] ?? 0
      );

      const nextValue =
        current + Number(change);

      updated[key] =
        BUSINESS_PERCENT_FIELDS.has(key)
          ? clamp(nextValue, 0, 100)
          : nextValue;
    }
  );

  // Financial values that cannot logically become negative.
  if (
    typeof updated.receivables === "number"
  ) {
    updated.receivables =
      Math.max(
        0,
        updated.receivables
      );
  }


  return updated;
};

const applySkillEffects = (
  skills,
  effects = {}
) => {
  const updated = { ...skills };

  Object.entries(effects).forEach(
    ([key, change]) => {
      if (!SKILL_FIELDS.has(key)) return;

      const current = Number(
        updated[key] ?? 50
      );

      updated[key] = clamp(
        current + Number(change),
        0,
        100
      );
    }
  );

  return updated;
};

export const saveSimulation = (state) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
};

export const loadSimulation = () => {
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return createInitialState();
    }

    const parsed = JSON.parse(stored);

    if (
      !parsed ||
      parsed.version !== 9
    ) {
      return createInitialState();
    }

    return parsed;
  } catch (error) {
    console.error(
      "Unable to load simulation:",
      error
    );

    return createInitialState();
  }
};

export const resetSimulation = () => {
  const fresh = createInitialState();

  saveSimulation(fresh);

  return fresh;
};

export const makeDecision = (
  state,
  scenario,
  decision
) => {
  if (state.dayComplete) {
    return state;
  }

  const businessAfterDecision =
    applyNumericEffects(
      state.business,
      decision.immediateEffects
    );

  const skillsAfterDecision =
    applySkillEffects(
      state.skills,
      decision.skillEffects
    );

  const scheduledConsequences = [
    ...state.delayedConsequences,

    ...(decision.delayedConsequences || []).map(
      (item) => ({
        ...item,
        sourceScenarioId: scenario.id,
        sourceDecisionId: decision.id,
        resolved: false,
      })
    ),
  ];

  const decisionRecord = {
    id: `${scenario.id}-${Date.now()}`,

    scenarioId: scenario.id,

    scenarioDay: scenario.day,

    month: scenario.month,

    theme: scenario.theme,

    decisionId: decision.id,

    decisionTitle: decision.title,

    decisionDescription:
      decision.description,

    madeAt: new Date().toISOString(),

    outcomeHeadline:
      decision.outcome.headline,

    outcomeExplanation:
      decision.outcome.explanation,

    lesson: decision.outcome.lesson,

    immediateEffects:
      decision.immediateEffects,

    skillEffects:
      decision.skillEffects,
  };

  let nextState = {
    ...state,

    business: businessAfterDecision,

    skills: skillsAfterDecision,

    decisions: [
      ...state.decisions,
      decisionRecord,
    ],

    delayedConsequences:
      scheduledConsequences,

    activityLog: [
      ...state.activityLog,

      {
        id: `activity-${Date.now()}`,

        type: "DECISION",

        day: scenario.day,

        title: decision.title,

        description:
          decision.outcome.headline,

        createdAt:
          new Date().toISOString(),
      },
    ],

    dayComplete: true,

    lastOutcome: {
      scenarioId: scenario.id,

      decisionId: decision.id,

      headline:
        decision.outcome.headline,

      explanation:
        decision.outcome.explanation,

      lesson:
        decision.outcome.lesson,

      immediateEffects:
        decision.immediateEffects,

      skillEffects:
        decision.skillEffects,
    },
  };

  nextState =
    ensureCharacters(
      nextState
    );

  const relationshipEffects =
    getDecisionRelationshipEffects(
      decision.id
    );

  relationshipEffects.forEach(
    (effect) => {
      nextState =
        updateRelationship(
          nextState,
          effect
        );
    }
  );

  nextState =
    applyDecisionOperationalImpact(
      nextState,
      scenario,
      decision
    );


  return nextState;
};

export const saveReflection = (
  state,
  reflection
) => {
  const existing =
    state.reflections.find(
      (item) =>
        item.day === state.currentDay
    );

  const record = {
    id:
      existing?.id ||
      `reflection-${Date.now()}`,

    day: state.currentDay,

    reason: reflection.reason,

    confidence: Number(
      reflection.confidence
    ),

    text:
      reflection.text.trim(),

    createdAt:
      existing?.createdAt ||
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),
  };

  return {
    ...state,

    reflections: existing
      ? state.reflections.map(
          (item) =>
            item.day ===
            state.currentDay
              ? record
              : item
        )
      : [
          ...state.reflections,
          record,
        ],
  };
};

export const hasReflectionForCurrentDay = (
  state
) => {
  return state.reflections.some(
    (item) =>
      item.day === state.currentDay
  );
};

const resolveConsequencesForDay = (
  state,
  nextDay
) => {
  let updatedBusiness = {
    ...state.business,
  };

  const resolvedNow = [];

  const updatedQueue =
    state.delayedConsequences.map(
      (item) => {
        if (
          !item.resolved &&
          item.dueDay <= nextDay
        ) {
          updatedBusiness =
            applyNumericEffects(
              updatedBusiness,
              item.effects
            );

          resolvedNow.push(item);

          return {
            ...item,

            resolved: true,

            resolvedAt:
              new Date().toISOString(),
          };
        }

        return item;
      }
    );

  return {
    updatedBusiness,
    updatedQueue,
    resolvedNow,
  };
};

const simulationMode = () => {
  return (
    import.meta.env
      .VITE_SIMULATION_MODE ||
    "demo"
  );
};

export const canAdvanceToDay = (
  state,
  nextDay
) => {
  if (
    simulationMode() === "demo"
  ) {
    return true;
  }

  const started =
    new Date(state.startedAt);

  const startDate = new Date(
    started.getFullYear(),
    started.getMonth(),
    started.getDate()
  );

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const elapsedDays =
    Math.floor(
      (today - startDate) /
        86400000
    ) + 1;

  return elapsedDays >= nextDay;
};

const advanceDayBase = (
  state
) => {
  if (!state.dayComplete) {
    return {
      state,

      blocked: true,

      reason:
        "Complete today's business decision first.",
    };
  }

  if (
    !hasReflectionForCurrentDay(
      state
    )
  ) {
    return {
      state,

      blocked: true,

      reason:
        "Complete today's reflection before continuing.",
    };
  }

  const nextDay =
    state.currentDay + 1;

  if (
    !canAdvanceToDay(
      state,
      nextDay
    )
  ) {
    return {
      state,

      blocked: true,

      reason:
        "The next business stage opens tomorrow.",
    };
  }

  const {
    updatedBusiness,
    updatedQueue,
    resolvedNow,
  } = resolveConsequencesForDay(
    state,
    nextDay
  );

  return {
    blocked: false,

    reason: null,

    state: {
      ...state,

      currentDay: nextDay,

      business:
        updatedBusiness,

      delayedConsequences:
        updatedQueue,

      recentDelayedConsequences:
        resolvedNow,

      completedDays:
        state.completedDays.includes(
          state.currentDay
        )
          ? state.completedDays
          : [
              ...state.completedDays,
              state.currentDay,
            ],

      dayComplete: false,

      lastOutcome: null,
    },
  };
};







export const applyDeepConsequence = (
  state,
  consequence
) => {
  if (!consequence) {
    return state;
  }


  const alreadyApplied =
    (state.deepConsequences || [])
      .some(
        (item) =>
          item.consequenceId ===
          consequence.id
      );


  if (alreadyApplied) {
    return state;
  }


  const businessAfter =
    applyNumericEffects(
      state.business,
      consequence.effects ||
        {}
    );


  const record = {
    id:
      `deep-${Date.now()}`,

    consequenceId:
      consequence.id,

    day:
      state.currentDay,

    type:
      consequence.type,

    title:
      consequence.title,

    message:
      consequence.message,

    why:
      consequence.why,

    lesson:
      consequence.lesson,

    effects:
      consequence.effects ||
      {},

    difficulty:
      consequence.difficulty,

    createdAt:
      new Date().toISOString(),
  };


  return {
    ...state,

    business:
      businessAfter,

    deepConsequences: [
      ...(state.deepConsequences || []),
      record,
    ],

    lastDeepConsequence:
      record,

    activityLog: [
      ...(state.activityLog || []),

      {
        id:
          `deep-activity-${Date.now()}`,

        type:
          "DEEP_CONSEQUENCE",

        day:
          state.currentDay,

        title:
          consequence.title,

        description:
          consequence.lesson,

        consequenceId:
          consequence.id,

        createdAt:
          new Date().toISOString(),
      },
    ],
  };
};


export const applyConversationOutcome = (
  state,
  conversation,
  session
) => {
  if (
    !conversation ||
    !session ||
    !session.completed
  ) {
    return state;
  }


  const alreadyApplied =
    (state.activityLog || [])
      .some(
        (item) =>
          item.type ===
            "CONVERSATION" &&
          item.conversationId ===
            conversation.id &&
          item.day ===
            state.currentDay
      );


  if (alreadyApplied) {
    return state;
  }


  let nextState = {
    ...state,

    business:
      applyNumericEffects(
        state.business,
        session.businessEffects ||
          {}
      ),

    activityLog: [
      ...(state.activityLog || []),

      {
        id:
          `conversation-${Date.now()}`,

        type:
          "CONVERSATION",

        conversationId:
          conversation.id,

        characterId:
          conversation.characterId,

        day:
          state.currentDay,

        title:
          conversation.title,

        description:
          session.outcome
            ?.headline ||
          "Conversation completed.",

        createdAt:
          new Date().toISOString(),
      },
    ],

    lastConversationOutcome: {
      conversationId:
        conversation.id,

      characterId:
        conversation.characterId,

      title:
        conversation.title,

      trustChange:
        session.trustChange,

      sentimentChange:
        session.sentimentChange,

      businessEffects:
        session.businessEffects,

      outcome:
        session.outcome,

      messages:
        session.messages,

      day:
        state.currentDay,
    },
  };


  nextState =
    updateRelationship(
      nextState,
      {
        characterId:
          conversation.characterId,

        trustChange:
          session.trustChange,

        sentimentChange:
          session.sentimentChange,

        interactionType:
          "CONVERSATION",

        memory:
          `${conversation.title}: ${
            session.outcome
              ?.headline ||
            "Conversation completed."
          }`,
      }
    );


  return nextState;
};


export const applyRelationshipEvent = (
  state,
  event
) => {
  if (!event) {
    return state;
  }

  const alreadyApplied =
    (state.activityLog || [])
      .some(
        (item) =>
          item.type ===
            "RELATIONSHIP_EVENT" &&
          item.relationshipEventId ===
            event.id
      );

  if (alreadyApplied) {
    return state;
  }

  const businessAfterEvent =
    applyNumericEffects(
      state.business,
      event.effect || {}
    );

  const character =
    state.relationships
      ?.characters
      ?.[event.characterId];

  const characterName =
    character?.name ||
    "Business relationship";

  return {
    ...state,

    business:
      businessAfterEvent,

    lastRelationshipEvent: {
      id:
        event.id,

      characterId:
        event.characterId,

      characterName,

      type:
        event.type,

      title:
        event.title,

      message:
        event.message,

      explanation:
        event.explanation,

      effect:
        event.effect || {},

      day:
        state.currentDay,

      occurredAt:
        new Date().toISOString(),
    },

    activityLog: [
      ...(state.activityLog || []),

      {
        id:
          `relationship-event-${Date.now()}`,

        type:
          "RELATIONSHIP_EVENT",

        relationshipEventId:
          event.id,

        characterId:
          event.characterId,

        day:
          state.currentDay,

        title:
          event.title,

        description:
          event.explanation,

        createdAt:
          new Date().toISOString(),
      },
    ],
  };
};


export const registerBusinessEvent = (
  state,
  event
) => {
  const alreadyExists =
    (state.businessEvents || [])
      .some(
        (item) =>
          item.day ===
          event.day
      );

  if (alreadyExists) {
    return state;
  }

  return {
    ...state,

    businessEvents: [
      ...(state.businessEvents || []),
      event,
    ],
  };
};


export const resolveBusinessEvent = (
  state,
  event,
  option
) => {
  if (
    !event ||
    !option ||
    event.status === "resolved"
  ) {
    return state;
  }

  const businessAfterEvent =
    applyNumericEffects(
      state.business,
      option.effects || {}
    );

  const skillsAfterEvent =
    applySkillEffects(
      state.skills,
      option.skillEffects || {}
    );

  const resolvedEvent = {
    ...event,

    status: "resolved",

    selectedOptionId:
      option.id,

    selectedOptionTitle:
      option.title,

    outcome:
      option.outcome,

    resolvedAt:
      new Date().toISOString(),
  };

  return {
    ...state,

    business:
      businessAfterEvent,

    skills:
      skillsAfterEvent,

    businessEvents:
      (state.businessEvents || [])
        .map(
          (item) =>
            item.recordId ===
            event.recordId
              ? resolvedEvent
              : item
        ),

    lastEventOutcome: {
      eventTitle:
        event.title,

      optionTitle:
        option.title,

      ...option.outcome,

      effects:
        option.effects || {},
    },

    activityLog: [
      ...state.activityLog,

      {
        id:
          `event-activity-${Date.now()}`,

        type:
          "BUSINESS_EVENT",

        day:
          state.currentDay,

        title:
          event.title,

        description:
          option.outcome.headline,

        createdAt:
          new Date().toISOString(),
      },
    ],
  };
};


const completeBusinessTaskBase = (
  state,
  task
) => {
  const businessAfterTask =
    applyNumericEffects(
      state.business,
      task.completeEffects || {}
    );

  const completedRecord = {
    id:
      `task-complete-${Date.now()}`,

    taskId:
      task.id,

    title:
      task.title,

    category:
      task.category,

    day:
      state.currentDay,

    learning:
      task.learning,

    completedAt:
      new Date().toISOString(),
  };

  const updatedPostponedTasks =
    (state.postponedTasks || [])
      .map((item) =>
        item.taskId === task.id
          ? {
              ...item,
              resolved: true,
            }
          : item
      );

  return {
    ...state,

    business:
      businessAfterTask,

    completedTasks: [
      ...(state.completedTasks || []),
      completedRecord,
    ],

    postponedTasks:
      updatedPostponedTasks,

    lastTaskOutcome: {
      type: "completed",

      title:
        task.title,

      headline:
        "Task completed",

      explanation:
        task.learning,
    },

    activityLog: [
      ...state.activityLog,

      {
        id:
          `task-activity-${Date.now()}`,

        type:
          "TASK_COMPLETED",

        day:
          state.currentDay,

        title:
          task.title,

        description:
          task.learning,

        createdAt:
          new Date().toISOString(),
      },
    ],
  };
};


const postponeBusinessTaskBase = (
  state,
  task
) => {
  const businessAfterTask =
    applyNumericEffects(
      state.business,
      task.postponeEffects || {}
    );

  const existing =
    (state.postponedTasks || [])
      .find(
        (item) =>
          item.taskId === task.id &&
          !item.resolved
      );

  const nextDay =
    state.currentDay + 1;

  const record = existing
    ? {
        ...existing,

        nextDay,

        timesPostponed:
          existing.timesPostponed + 1,

        task: {
          ...task,

          priority: "CRITICAL",
        },
      }
    : {
        id:
          `task-postpone-${Date.now()}`,

        taskId:
          task.id,

        task: {
          ...task,
        },

        firstDay:
          state.currentDay,

        nextDay,

        timesPostponed: 1,

        resolved: false,
      };

  const postponedTasks =
    existing
      ? state.postponedTasks.map(
          (item) =>
            item.id === existing.id
              ? record
              : item
        )
      : [
          ...(state.postponedTasks || []),
          record,
        ];

  return {
    ...state,

    business:
      businessAfterTask,

    postponedTasks,

    lastTaskOutcome: {
      type: "postponed",

      title:
        task.title,

      headline:
        "Task postponed",

      explanation:
        "The task will return with greater urgency on the next business day.",
    },

    activityLog: [
      ...state.activityLog,

      {
        id:
          `task-postpone-activity-${Date.now()}`,

        type:
          "TASK_POSTPONED",

        day:
          state.currentDay,

        title:
          task.title,

        description:
          "Task postponed to a later business day.",

        createdAt:
          new Date().toISOString(),
      },
    ],
  };
};


export const applyRecoveryAction = (
  state,
  recoveryAction
) => {
  if (!recoveryAction) {
    return state;
  }

  const businessAfterRecovery =
    applyNumericEffects(
      state.business,
      recoveryAction.immediateEffects
    );

  const skillsAfterRecovery =
    applySkillEffects(
      state.skills,
      recoveryAction.skillEffects
    );

  const record = {
    id: `${recoveryAction.id}-${Date.now()}`,

    actionId:
      recoveryAction.id,

    title:
      recoveryAction.title,

    category:
      recoveryAction.category,

    description:
      recoveryAction.description,

    effects:
      recoveryAction.immediateEffects,

    outcome:
      recoveryAction.outcome,

    day:
      state.currentDay,

    createdAt:
      new Date().toISOString(),
  };

  return {
    ...state,

    business:
      businessAfterRecovery,

    skills:
      skillsAfterRecovery,

    recoveryActions: [
      ...(state.recoveryActions || []),
      record,
    ],

    lastRecoveryOutcome: {
      ...recoveryAction.outcome,

      effects:
        recoveryAction.immediateEffects,

      actionId:
        recoveryAction.id,
    },

    activityLog: [
      ...state.activityLog,

      {
        id:
          `recovery-${Date.now()}`,

        type:
          "RECOVERY_ACTION",

        day:
          state.currentDay,

        title:
          recoveryAction.title,

        description:
          recoveryAction.outcome.headline,

        createdAt:
          new Date().toISOString(),
      },
    ],
  };
};

export const calculateProfit = (
  business
) => {
  return (
    business.revenue -
    business.expenses
  );
};

export const calculateNetAssetPosition = (
  business
) => {
  return (
    business.assets -
    business.liabilities
  );
};

export const calculateBusinessHealth = (
  business
) => {
  let score = 50;

  const profit =
    calculateProfit(business);

  if (
    business.cash >
    business.expenses
  ) {
    score += 12;
  }

  if (
    business.cash <
    business.expenses * 0.5
  ) {
    score -= 12;
  }

  if (profit > 0) {
    score += 10;
  }

  if (profit < 0) {
    score -= 15;
  }

  if (business.risk < 40) {
    score += 8;
  }

  if (business.risk > 70) {
    score -= 12;
  }

  if (
    business.employeeMorale > 70
  ) {
    score += 5;
  }

  if (
    business.employeeMorale < 40
  ) {
    score -= 7;
  }

  if (
    business.customerSatisfaction >
    70
  ) {
    score += 5;
  }

  if (
    business.customerSatisfaction <
    40
  ) {
    score -= 7;
  }

  return clamp(score, 0, 100);
};

export const getFinancialDashboard = (
  state
) => {
  const business =
    state.business;

  const profit =
    calculateProfit(business);

  const netAssets =
    calculateNetAssetPosition(
      business
    );

  const cashCoverage =
    business.expenses > 0
      ? business.cash /
        business.expenses
      : 0;

  const profitMargin =
    business.revenue > 0
      ? (profit /
          business.revenue) *
        100
      : 0;

  const debtToAssets =
    business.assets > 0
      ? (business.debt /
          business.assets) *
        100
      : 0;

  const receivableExposure =
    business.revenue > 0
      ? (business.receivables /
          business.revenue) *
        100
      : 0;

  let cashStatus = "Healthy";

  if (cashCoverage < 0.5) {
    cashStatus = "Critical";
  } else if (
    cashCoverage < 1
  ) {
    cashStatus = "Watch";
  }

  let debtStatus = "Manageable";

  if (debtToAssets > 70) {
    debtStatus = "High";
  } else if (
    debtToAssets > 45
  ) {
    debtStatus = "Watch";
  }

  return {
    profit,

    netAssets,

    cashCoverage,

    profitMargin,

    debtToAssets,

    receivableExposure,

    cashStatus,

    debtStatus,

    estimatedCashMonths:
      business.expenses > 0
        ? business.cash /
          business.expenses
        : 0,
  };
};

const percentageChange = (
  current,
  baseline
) => {
  if (!baseline) return 0;

  return (
    ((current - baseline) /
      Math.abs(baseline)) *
    100
  );
};

export const getQuarterReview = (
  state
) => {
  const current =
    state.business;

  const baseline =
    state.baseline;

  const finance =
    getFinancialDashboard(state);

  const changes = {
    cash: percentageChange(
      current.cash,
      baseline.cash
    ),

    revenue: percentageChange(
      current.revenue,
      baseline.revenue
    ),

    expenses: percentageChange(
      current.expenses,
      baseline.expenses
    ),

    debt: percentageChange(
      current.debt,
      baseline.debt
    ),
  };

  let headline =
    "The business remained relatively stable.";

  if (
    changes.revenue > 10 &&
    changes.debt > 20
  ) {
    headline =
      "The business grew, but growth increased financial pressure.";
  } else if (
    changes.revenue > 10 &&
    changes.debt <= 10
  ) {
    headline =
      "The business achieved growth without heavily increasing debt.";
  } else if (
    changes.cash < -20
  ) {
    headline =
      "Cash weakened significantly during the quarter.";
  }

  const risks = [];

  if (
    finance.cashCoverage < 1
  ) {
    risks.push(
      "Cash is below one month of current operating expenses."
    );
  }

  if (
    finance.debtToAssets > 45
  ) {
    risks.push(
      "Debt is becoming significant relative to the company's asset base."
    );
  }

  if (
    finance.receivableExposure >
    40
  ) {
    risks.push(
      "A large amount of revenue remains tied up in unpaid customer invoices."
    );
  }

  if (
    current.risk > 60
  ) {
    risks.push(
      "Overall business risk is elevated."
    );
  }

  if (!risks.length) {
    risks.push(
      "No major financial warning has been triggered yet."
    );
  }

  return {
    headline,
    changes,
    risks,
    finance,
  };
};

export const getAdvisorInsights = (
  state
) => {
  const skillLabels = {
    cashFlow: "Cash Flow",
    financialPlanning:
      "Financial Planning",
    peopleManagement:
      "People Management",
    customerManagement:
      "Customer Management",
    pricing: "Pricing",
    riskManagement:
      "Risk Management",
    fundingDecisions:
      "Funding Decisions",
    growthStrategy:
      "Growth Strategy",
  };

  const ranked =
    Object.entries(state.skills)
      .map(([key, value]) => ({
        key,
        label:
          skillLabels[key] || key,
        value,
      }))
      .sort(
        (a, b) =>
          a.value - b.value
      );

  const developmentAreas =
    ranked.slice(0, 3);

  const strengths = [
    ...ranked,
  ]
    .reverse()
    .slice(0, 3);

  const finance =
    getFinancialDashboard(state);

  const highRiskDecisions =
    state.decisions.filter(
      (decision) =>
        Number(
          decision.immediateEffects
            ?.risk || 0
        ) > 4
    ).length;

  const debtDecisions =
    state.decisions.filter(
      (decision) =>
        Number(
          decision.immediateEffects
            ?.debt || 0
        ) > 0
    ).length;

  const growthDecisions =
    state.decisions.filter(
      (decision) =>
        Number(
          decision.immediateEffects
            ?.revenue || 0
        ) > 0
    ).length;

  let behaviourSummary =
    "More simulation history is needed before a clear behavioural pattern can be identified.";

  if (
    debtDecisions >= 1 &&
    finance.debtToAssets > 45
  ) {
    behaviourSummary =
      "The entrepreneur has used financing while the debt burden is becoming more significant. Advisory discussion should focus on repayment capacity and alternative funding strategies.";
  } else if (
    highRiskDecisions >= 2
  ) {
    behaviourSummary =
      "The entrepreneur appears comfortable accepting higher levels of business risk. Advisory support should explore how risks are assessed before commitments are made.";
  } else if (
    growthDecisions >= 2
  ) {
    behaviourSummary =
      "The entrepreneur appears strongly growth-oriented. Advisory support should focus on balancing expansion with working capital, capacity and financial resilience.";
  } else if (
    state.decisions.length >= 2
  ) {
    behaviourSummary =
      "The entrepreneur appears relatively balanced so far. Later scenarios should test behaviour under greater financial pressure.";
  }

  const confidenceValues =
    state.reflections
      .map((item) =>
        Number(
          item.confidence
        )
      )
      .filter(
        Number.isFinite
      );

  const averageConfidence =
    confidenceValues.length
      ? Math.round(
          (confidenceValues.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
            confidenceValues.length) *
            10
        ) / 10
      : null;

  return {
    developmentAreas,

    strengths,

    behaviourSummary,

    averageConfidence,

    decisionsReviewed:
      state.decisions.length,

    reflectionsReviewed:
      state.reflections.length,
  };
};



// ==========================================================
// PERSISTENT BUSINESS ISSUE INTEGRATION
// ==========================================================


/*
 * Complete the normal task first.
 *
 * If this task was previously postponed
 * and created an open business issue,
 * completing it now resolves that issue.
 */
export const completeBusinessTask = (
  state,
  task
) => {
  const nextState =
    completeBusinessTaskBase(
      state,
      task
    );

  return resolveIssueForTask(
    nextState,
    task
  );
};


/*
 * Preserve all existing postponement behaviour.
 *
 * Then, when the postponed task is mapped
 * as a persistent CRITICAL business issue,
 * open that issue in the company.
 */
export const postponeBusinessTask = (
  state,
  task
) => {
  const nextState =
    postponeBusinessTaskBase(
      state,
      task
    );

  return createIssueFromTask(
    nextState,
    task
  );
};


/*
 * Preserve the original month advancement
 * logic first.
 *
 * Once the next month has opened,
 * every unresolved issue applies its
 * continuing monthly business impact.
 */
export const advanceDay = (
  state
) => {
  const result =
    advanceDayBase(
      state
    );


  if (
    result.blocked ||
    !result.state
  ) {
    return result;
  }


  /*
   * currentDay 13 is the finished screen,
   * not another simulated operating month.
   *
   * Do not apply an extra January-style
   * consequence after December.
   */
  if (
    result.state.currentDay >
    12
  ) {
    return result;
  }


  const stateAfterIssues =
    processOpenBusinessIssues(
      result.state
    );


  return {
    ...result,

    state:
      stateAfterIssues,
  };
};
