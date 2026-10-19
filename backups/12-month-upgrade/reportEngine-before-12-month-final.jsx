import {
  getReplayInsights,
  getSimulationEnding,
} from "./deepConsequencesEngine";

import {
  getBusinessPath,
} from "./storylineEngine";

import {
  getEntrepreneurProfile,
} from "./adaptiveEngine";

import {
  getAssessmentStatus,
  getEvidenceReadiness,
  isJourneyComplete,
} from "./finalizationEngine";


const SKILL_LABELS = {
  cashFlow:
    "Cash-Flow Management",

  financialPlanning:
    "Financial Planning",

  peopleManagement:
    "People Leadership",

  customerManagement:
    "Customer Management",

  pricing:
    "Pricing Strategy",

  riskManagement:
    "Risk Management",

  fundingDecisions:
    "Funding Decisions",

  growthStrategy:
    "Growth Strategy",
};


const formatSkill = (
  key
) =>
  SKILL_LABELS[key] ||
  key;


const clamp = (
  value,
  min,
  max
) =>
  Math.min(
    max,
    Math.max(min, value)
  );


const getProfit = (
  business
) =>
  business.revenue -
  business.expenses;


const calculateSkillChange = (
  state,
  key
) => {
  const current =
    state.skills?.[key] ?? 50;

  return current - 50;
};


const getRankedSkills = (
  state
) =>
  Object.entries(
    state.skills || {}
  )
    .map(
      ([key, value]) => ({
        key,

        label:
          formatSkill(key),

        value:
          Math.round(value),

        change:
          calculateSkillChange(
            state,
            key
          ),
      })
    )
    .sort(
      (a, b) =>
        b.value - a.value
    );


const getDecisionPattern = (
  state
) => {
  const decisions =
    state.decisions || [];

  const decisionIds =
    decisions.map(
      (item) =>
        item.decisionId
    );


  let growth = 0;
  let caution = 0;
  let people = 0;
  let customer = 0;
  let finance = 0;


  decisionIds.forEach(
    (id) => {
      if (
        id.includes(
          "growth"
        ) ||
        id.includes(
          "expand"
        ) ||
        id.includes(
          "competition"
        )
      ) {
        growth += 1;
      }


      if (
        id.includes(
          "phase"
        ) ||
        id.includes(
          "pilot"
        ) ||
        id.includes(
          "self"
        ) ||
        id.includes(
          "resilience"
        )
      ) {
        caution += 1;
      }


      if (
        id.includes(
          "people"
        ) ||
        id.includes(
          "sipho"
        ) ||
        id.includes(
          "employee"
        )
      ) {
        people += 1;
      }


      if (
        id.includes(
          "customer"
        ) ||
        id.includes(
          "enterprise"
        ) ||
        id.includes(
          "cash-request"
        )
      ) {
        customer += 1;
      }


      if (
        id.includes(
          "fund"
        ) ||
        id.includes(
          "debt"
        ) ||
        id.includes(
          "cash"
        )
      ) {
        finance += 1;
      }
    }
  );


  const ranked = [
    {
      key: "growth",
      value: growth,
    },

    {
      key: "caution",
      value: caution,
    },

    {
      key: "people",
      value: people,
    },

    {
      key: "customer",
      value: customer,
    },

    {
      key: "finance",
      value: finance,
    },
  ]
    .sort(
      (a, b) =>
        b.value - a.value
    );


  return {
    primary:
      ranked[0]?.key ||
      "balanced",

    scores: {
      growth,
      caution,
      people,
      customer,
      finance,
    },
  };
};


const getBehaviourSummary = (
  state,
  strongestSkill,
  weakestSkill
) => {
  const pattern =
    getDecisionPattern(
      state
    );

  const summaries = {
    growth:
      "You frequently looked for ways to grow the business and capture opportunity. Your next development challenge is ensuring that growth remains supported by cash, capacity and risk controls.",

    caution:
      "You showed a preference for protecting the business before making larger commitments. This supports resilience, although excessive caution can sometimes limit growth opportunities.",

    people:
      "You repeatedly considered employee capability and morale in your decisions. This leadership strength should now be connected to stronger financial and performance management.",

    customer:
      "You demonstrated strong awareness of customer relationships and commercial trust. Your challenge is protecting customer value without weakening pricing discipline or cash flow.",

    finance:
      "Your decisions frequently focused on cash, funding and financial survival. The next step is using that financial discipline to support confident strategic growth.",

    balanced:
      "You demonstrated a relatively balanced management style across finance, people, customers and growth.",
  };


  return {
    pattern:
      pattern.primary,

    text:
      summaries[
        pattern.primary
      ] ||
      summaries.balanced,

    strongestStatement:
      `${strongestSkill.label} emerged as your strongest demonstrated capability.`,

    developmentStatement:
      `${weakestSkill.label} is currently the clearest development opportunity.`,
  };
};


const getAdvisorRecommendation = (
  weakestSkill
) => {
  const recommendations = {
    cashFlow: {
      intervention:
        "Working Capital & Cash-Flow Coaching",

      focus:
        "Collections, payment timing, cash runway and the difference between revenue and available cash.",

      question:
        "What would you change in the business if revenue was growing but the company was still running out of cash?",
    },

    financialPlanning: {
      intervention:
        "Financial Planning Session",

      focus:
        "Budgeting, scenario planning, financial forecasting and understanding the cost of strategic decisions.",

      question:
        "Which three financial numbers would you monitor weekly if this were your real business?",
    },

    peopleManagement: {
      intervention:
        "People Leadership & Retention Coaching",

      focus:
        "Employee development, performance management, retention, capacity and leadership communication.",

      question:
        "How would you retain a key employee if you could not simply solve the problem with salary?",
    },

    customerManagement: {
      intervention:
        "Customer Strategy & Relationship Management",

      focus:
        "Customer value, negotiation, retention, service quality and commercial boundaries.",

      question:
        "How can you protect an important customer relationship without allowing that customer to damage your cash flow?",
    },

    pricing: {
      intervention:
        "Pricing & Margin Strategy",

      focus:
        "Cost changes, margins, customer willingness to pay and value-based pricing.",

      question:
        "How would you know whether your price is too low, rather than simply attractive to customers?",
    },

    riskManagement: {
      intervention:
        "Business Risk & Resilience Session",

      focus:
        "Operational risk, concentration risk, financial buffers, dependencies and contingency planning.",

      question:
        "Which single event could hurt this business most, and what would you put in place before it happens?",
    },

    fundingDecisions: {
      intervention:
        "Funding Readiness & Capital Strategy",

      focus:
        "Debt, equity, founder ownership, repayment capacity and the cost of capital.",

      question:
        "When is giving away equity more sensible than taking debt, and when is it not?",
    },

    growthStrategy: {
      intervention:
        "Growth & Scale Readiness",

      focus:
        "Expansion timing, capacity, market validation and sustainable scale.",

      question:
        "What evidence would you require before committing this business to its next major expansion?",
    },
  };


  return (
    recommendations[
      weakestSkill.key
    ] || {
      intervention:
        "General Business Advisory",

      focus:
        "Business fundamentals and strategic decision-making.",

      question:
        "Which decision from the simulation would you make differently now, and why?",
    }
  );
};


const getRelationshipSummary = (
  state
) => {
  const characters =
    Object.values(
      state.relationships
        ?.characters || {}
    );


  const ranked =
    characters
      .map(
        (character) => ({
          id:
            character.id,

          name:
            character.name,

          role:
            character.role,

          trust:
            Math.round(
              character.trust ?? 50
            ),

          sentiment:
            Math.round(
              character.sentiment ??
                50
            ),

          memories:
            (
              character.memories ||
              []
            ).length,
        })
      )
      .sort(
        (a, b) =>
          b.trust - a.trust
      );


  return {
    strongest:
      ranked[0] || null,

    weakest:
      ranked[
        ranked.length - 1
      ] || null,

    relationships:
      ranked,
  };
};


const getBusinessChanges = (
  state
) => {
  const before =
    state.baseline;

  const after =
    state.business;


  const metric = (
    key,
    label
  ) => ({
    key,

    label,

    before:
      before[key],

    after:
      after[key],

    change:
      after[key] -
      before[key],
  });


  return [
    metric(
      "cash",
      "Cash"
    ),

    metric(
      "revenue",
      "Revenue"
    ),

    metric(
      "expenses",
      "Expenses"
    ),

    metric(
      "debt",
      "Debt"
    ),

    metric(
      "customers",
      "Customers"
    ),

    metric(
      "employees",
      "Employees"
    ),

    metric(
      "employeeMorale",
      "Employee Morale"
    ),

    metric(
      "customerSatisfaction",
      "Customer Trust"
    ),

    metric(
      "risk",
      "Business Risk"
    ),
  ];
};


const getEvidence = (
  state
) => {
  const activity =
    state.activityLog || [];


  return {
    strategicDecisions:
      (
        state.decisions || []
      ).length,

    reflections:
      (
        state.reflections || []
      ).length,

    conversations:
      activity.filter(
        (item) =>
          item.type ===
          "CONVERSATION"
      ).length,

    relationshipCallbacks:
      activity.filter(
        (item) =>
          item.type ===
          "RELATIONSHIP_EVENT"
      ).length,

    deepConsequences:
      (
        state.deepConsequences ||
        []
      ).length,

    recoveryActions:
      (
        state.recoveryActions ||
        []
      ).length,

    completedTasks:
      (
        state.completedTasks ||
        []
      ).length,

    businessEvents:
      activity.filter(
        (item) =>
          item.type ===
          "BUSINESS_EVENT"
      ).length,

    completedDays:
      (
        state.completedDays ||
        []
      ).length,
  };
};


const getCapabilityScore = (
  state
) => {
  const values =
    Object.values(
      state.skills || {}
    );

  if (!values.length) {
    return 50;
  }


  return clamp(
    Math.round(
      values.reduce(
        (sum, value) =>
          sum + value,
        0
      ) /
        values.length
    ),
    0,
    100
  );
};


const getEngagementScore = (
  state
) => {
  const evidence =
    getEvidence(state);


  let score = 0;

  score +=
    evidence.strategicDecisions *
    8;

  score +=
    evidence.reflections *
    6;

  score +=
    evidence.conversations *
    7;

  score +=
    evidence.completedTasks *
    3;

  score +=
    evidence.relationshipCallbacks *
    4;

  score +=
    evidence.deepConsequences *
    4;


  return clamp(
    score,
    0,
    100
  );
};


export const getPerformanceReport = (
  state
) => {
  const skills =
    getRankedSkills(
      state
    );


  const strongestSkill =
    skills[0];


  const weakestSkill =
    skills[
      skills.length - 1
    ];


  const finalEnding =
    getSimulationEnding(
      state
    );

  const assessmentStatus =
    getAssessmentStatus(
      state
    );

  const evidenceReadiness =
    getEvidenceReadiness(
      state
    );

  const journeyComplete =
    isJourneyComplete(
      state
    );


  const ending =
    journeyComplete
      ? finalEnding
      : {
          id:
            assessmentStatus.id,

          title:
            assessmentStatus.title,

          tone:
            assessmentStatus.tone,

          score:
            evidenceReadiness,

          headline:
            assessmentStatus.description,

          message:
            journeyComplete
              ? finalEnding.message
              : "Continue the simulation to generate stronger behavioural and business evidence.",

          nextChapter:
            journeyComplete
              ? finalEnding.nextChapter
              : "Continue Simulation",
        };


  const replay =
    getReplayInsights(
      state
    );


  const businessPath =
    getBusinessPath(
      state
    );


  const entrepreneurProfile =
    getEntrepreneurProfile(
      state
    );


  const behaviour =
    getBehaviourSummary(
      state,
      strongestSkill,
      weakestSkill
    );


  const advisor =
    getAdvisorRecommendation(
      weakestSkill
    );


  const relationships =
    getRelationshipSummary(
      state
    );


  const evidence =
    getEvidence(
      state
    );


  const capabilityScore =
    getCapabilityScore(
      state
    );


  const engagementScore =
    getEngagementScore(
      state
    );


  const profitBefore =
    getProfit(
      state.baseline
    );


  const profitAfter =
    getProfit(
      state.business
    );


  return {
    generatedAt:
      new Date().toISOString(),

    simulationSeed:
      state.simulationSeed,

    entrepreneur: {
      profile:
        entrepreneurProfile,

      strongestSkill,

      weakestSkill,

      skills,

      behaviour,

      capabilityScore,

      engagementScore,
    },

    assessment: {
      status:
        assessmentStatus,

      evidenceReadiness,

      journeyComplete,

      finalEnding,
    },

    business: {
      ending,

      finalEnding,

      path:
        businessPath,

      changes:
        getBusinessChanges(
          state
        ),

      profitBefore,

      profitAfter,

      profitChange:
        profitAfter -
        profitBefore,
    },

    relationships,

    advisor: {
      recommendation:
        advisor,

      suggestedPriority:
        weakestSkill.label,

      strongestCapability:
        strongestSkill.label,

      conversationPrompt:
        advisor.question,
    },

    impact: {
      evidence,

      replay,

      capabilityScore,

      engagementScore,

      completionRate:
        clamp(
          Math.round(
            (
              evidence.completedDays /
              6
            ) *
              100
          ),
          0,
          100
        ),
    },
  };
};
