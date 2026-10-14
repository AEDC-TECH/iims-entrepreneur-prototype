export const STORAGE_KEY =
  "iims-business-survival-state-v9";

const createSimulationSeed = () =>
  `${Date.now()}-${Math.floor(
    Math.random() * 1000000
  )}`;

export const createInitialState = () => {
  const startingBusiness = {
    name: "Ubuntu Digital Solutions",

    cash: 150000,
    revenue: 180000,
    expenses: 142000,

    assets: 420000,
    liabilities: 160000,
    debt: 160000,

    receivables: 95000,

    employees: 6,
    customers: 14,

    founderOwnership: 100,

    customerSatisfaction: 74,
    employeeMorale: 72,
    risk: 38,
  };

  return {
    version: 9,

    simulationSeed:
      createSimulationSeed(),

    startedAt:
      new Date().toISOString(),

    currentDay: 1,

    dayComplete: false,

    completedDays: [],

    baseline: {
      ...startingBusiness,
    },

    business: {
      ...startingBusiness,
    },

    skills: {
      cashFlow: 50,
      financialPlanning: 50,
      peopleManagement: 50,
      customerManagement: 50,
      pricing: 50,
      riskManagement: 50,
      fundingDecisions: 50,
      growthStrategy: 50,
    },

    relationships: {
      characters: {},
      interactions: [],
    },

    financing: {
      loans: [],
      creditEvents: [],
      applications: [],
      lastLoanOffer: null,
    },

    decisions: [],

    reflections: [],

    recoveryActions: [],

    businessTasks: [],

    completedTasks: [],

    postponedTasks: [],

    businessEvents: [],

    deepConsequences: [],

    activityLog: [],

    delayedConsequences: [],

    lastOutcome: null,

    recentDelayedConsequences: [],

    lastRecoveryOutcome: null,

    lastTaskOutcome: null,

    lastEventOutcome: null,

    lastRelationshipOutcome: null,

    lastRelationshipEvent: null,

    lastConversationOutcome: null,

    lastDeepConsequence: null,
  };
};
