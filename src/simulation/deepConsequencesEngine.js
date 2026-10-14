const clamp = (
  value,
  min,
  max
) =>
  Math.min(
    max,
    Math.max(min, value)
  );


const getProfit = (business) =>
  business.revenue -
  business.expenses;


const getRunway = (business) =>
  business.expenses > 0
    ? business.cash /
      business.expenses
    : 0;


const getDebtRatio = (
  business
) =>
  business.assets > 0
    ? (business.debt /
        business.assets) *
      100
    : 0;


const hasDecision = (
  state,
  id
) =>
  (state.decisions || [])
    .some(
      (decision) =>
        decision.decisionId ===
        id
    );


const hasAnyDecision = (
  state,
  ids
) =>
  ids.some(
    (id) =>
      hasDecision(
        state,
        id
      )
  );


const hashString = (text) => {
  let hash = 0;

  for (
    let index = 0;
    index < text.length;
    index += 1
  ) {
    hash =
      (hash << 5) -
      hash +
      text.charCodeAt(index);

    hash |= 0;
  }

  return Math.abs(hash);
};


const seededNumber = (
  seedText
) => {
  const seed =
    hashString(seedText);

  const result =
    Math.sin(seed) *
    10000;

  return (
    result -
    Math.floor(result)
  );
};


const wasApplied = (
  state,
  consequenceId
) =>
  (state.deepConsequences || [])
    .some(
      (item) =>
        item.consequenceId ===
        consequenceId
    );


// =========================================================
// ADAPTIVE DIFFICULTY
// =========================================================

export const getSimulationDifficulty = (
  state
) => {
  const b =
    state.business;

  const profit =
    getProfit(b);

  const runway =
    getRunway(b);

  let strength = 50;

  if (profit > 0) {
    strength += 12;
  } else {
    strength -= 16;
  }

  if (runway >= 1.5) {
    strength += 14;
  } else if (runway < 0.75) {
    strength -= 16;
  }

  strength +=
    (b.employeeMorale - 50) *
    0.12;

  strength +=
    (b.customerSatisfaction - 50) *
    0.12;

  strength -=
    Math.max(
      0,
      b.risk - 50
    ) *
    0.22;

  strength =
    clamp(
      Math.round(strength),
      0,
      100
    );


  let level =
    "Standard";

  let description =
    "The simulation is applying normal operating pressure.";

  let pressureMultiplier = 1;


  if (strength >= 78) {
    level =
      "Executive";

    pressureMultiplier =
      1.25;

    description =
      "The business is performing strongly, so IIMS is introducing more demanding strategic pressure instead of making the journey easier.";
  } else if (strength <= 35) {
    level =
      "Recovery";

    pressureMultiplier =
      0.8;

    description =
      "The company is distressed. Challenges remain serious, but the simulation will favour recoverable pressure rather than stacking unrealistic failure events.";
  }


  return {
    strength,
    level,
    pressureMultiplier,
    description,
  };
};


// =========================================================
// COMPOUND CONSEQUENCES
// Earlier choices interact with one another.
// =========================================================

const getCompoundCandidates = (
  state
) => {
  const b =
    state.business;

  const candidates = [];


  // Growth + weak collections
  if (
    state.currentDay >= 4 &&
    b.revenue >
      state.baseline.revenue &&
    b.receivables >
      b.revenue * 0.45
  ) {
    candidates.push({
      id:
        "growth-without-cash",

      type:
        "COMPOUND_RISK",

      priority: 92,

      title:
        "Growth is consuming working capital",

      message:
        "Revenue has increased, but too much of that revenue is still sitting in unpaid invoices.",

      why:
        "Growth and weak collections are combining into a cash-flow problem.",

      effects: {
        cash: -18000,
        risk: 5,
      },

      lesson:
        "Growth can make a business less liquid when customers pay after expenses have already been incurred.",
    });
  }


  // Hiring + strong morale
  if (
    state.currentDay >= 4 &&
    b.employees >
      state.baseline.employees &&
    b.employeeMorale >= 78
  ) {
    candidates.push({
      id:
        "team-capacity-compounds",

      type:
        "COMPOUND_POSITIVE",

      priority: 70,

      title:
        "Your team investment is beginning to compound",

      message:
        "Additional capacity and healthy morale are improving execution across the company.",

      why:
        "You expanded the team without allowing morale to collapse.",

      effects: {
        revenue: 12000,
        customerSatisfaction: 3,
        risk: -2,
      },

      lesson:
        "People investment creates value when capacity and morale improve together.",
    });
  }


  // Debt + low profit
  if (
    state.currentDay >= 5 &&
    b.debt >
      state.baseline.debt *
        1.4 &&
    getProfit(b) <
      20000
  ) {
    candidates.push({
      id:
        "debt-profit-squeeze",

      type:
        "COMPOUND_RISK",

      priority: 96,

      title:
        "Debt repayments are squeezing operating flexibility",

      message:
        "Borrowing has increased while monthly profit remains too thin to make the repayment burden comfortable.",

      why:
        "Higher leverage and weak profit are interacting.",

      effects: {
        cash: -22000,
        expenses: 6000,
        risk: 6,
      },

      lesson:
        "Debt becomes most dangerous when earnings fail to grow alongside repayment commitments.",
    });
  }


  // Strong customers + strong service
  if (
    state.currentDay >= 5 &&
    b.customerSatisfaction >=
      82 &&
    b.risk < 60
  ) {
    candidates.push({
      id:
        "trust-compounds",

      type:
        "COMPOUND_POSITIVE",

      priority: 74,

      title:
        "Customer trust is generating commercial momentum",

      message:
        "Strong service and reliable execution are making existing customers more valuable.",

      why:
        "Customer trust remained high while operational risk stayed controlled.",

      effects: {
        revenue: 15000,
        customers: 1,
        customerSatisfaction: 2,
      },

      lesson:
        "Customer trust can compound into retention, referrals and stronger revenue quality.",
    });
  }


  // Price cutting + cost pressure
  if (
    state.currentDay >= 5 &&
    hasAnyDecision(
      state,
      [
        "competition-match",
        "pricing-absorb",
      ]
    ) &&
    b.expenses >
      state.baseline.expenses *
        1.15
  ) {
    candidates.push({
      id:
        "margin-trap",

      type:
        "COMPOUND_RISK",

      priority: 88,

      title:
        "The business has entered a margin trap",

      message:
        "Costs increased while management protected customers from enough of those increases that profit is now under pressure.",

      why:
        "Pricing and cost decisions are compounding against profitability.",

      effects: {
        revenue: -5000,
        risk: 5,
      },

      lesson:
        "A business cannot indefinitely protect both price and margin when its underlying cost base rises.",
    });
  }


  // Strong cash + low risk
  if (
    state.currentDay >= 5 &&
    getRunway(b) >= 1.8 &&
    b.risk <= 45 &&
    getProfit(b) > 0
  ) {
    candidates.push({
      id:
        "resilience-optionality",

      type:
        "COMPOUND_POSITIVE",

      priority: 65,

      title:
        "Financial resilience is creating strategic options",

      message:
        "Strong cash reserves and controlled risk mean the company can act from choice rather than desperation.",

      why:
        "Liquidity, profitability and risk discipline are reinforcing each other.",

      effects: {
        risk: -3,
        customerSatisfaction: 1,
        employeeMorale: 1,
      },

      lesson:
        "Financial resilience creates strategic freedom, not just safety.",
    });
  }


  // Equity investor pressure
  if (
    state.currentDay >= 6 &&
    b.founderOwnership < 100
  ) {
    candidates.push({
      id:
        "ownership-accountability",

      type:
        "COMPOUND_NEUTRAL",

      priority: 72,

      title:
        "External ownership is changing decision-making",

      message:
        "The founder now has access to external capital, but major strategic choices require greater accountability and explanation.",

      why:
        "Equity funding changed ownership, not only the bank balance.",

      effects: {
        risk: -1,
        expenses: 3000,
      },

      lesson:
        "Investors bring capital, scrutiny, governance and additional voices into future decisions.",
    });
  }


  return candidates;
};


// =========================================================
// RARE WORLD SHOCKS
// =========================================================

const RARE_SHOCKS = [
  {
    id:
      "economic-slowdown",

    type:
      "WORLD_SHOCK",

    title:
      "A sudden slowdown hits customer spending",

    message:
      "Several businesses in the market have delayed discretionary technology spending.",

    baseChance: 0.11,

    effects: {
      revenue: -18000,
      customerSatisfaction: -1,
      risk: 5,
    },

    lesson:
      "A healthy company still operates inside an economy it cannot control.",
  },

  {
    id:
      "large-referral",

    type:
      "WORLD_OPPORTUNITY",

    title:
      "A major referral arrives unexpectedly",

    message:
      "A satisfied business owner has recommended Ubuntu Digital Solutions to a larger organisation.",

    baseChance: 0.09,

    requires: (
      state
    ) =>
      state.business
        .customerSatisfaction >=
      72,

    effects: {
      revenue: 25000,
      customers: 1,
      risk: 2,
    },

    lesson:
      "Strong reputation can create opportunities that management did not directly purchase.",
  },

  {
    id:
      "cyber-service-disruption",

    type:
      "WORLD_SHOCK",

    title:
      "A technology disruption interrupts operations",

    message:
      "A third-party service outage causes temporary delivery delays across the company.",

    baseChance: 0.07,

    effects: {
      customerSatisfaction: -4,
      cash: -10000,
      risk: 5,
    },

    lesson:
      "Operational resilience includes dependency on suppliers and technology outside the business.",
  },

  {
    id:
      "industry-award",

    type:
      "WORLD_OPPORTUNITY",

    title:
      "The business receives unexpected industry recognition",

    message:
      "A local enterprise network recognises the company's growth and customer service.",

    baseChance: 0.06,

    requires: (
      state
    ) =>
      state.business
        .customerSatisfaction >=
        78 &&
      state.business.risk < 60,

    effects: {
      customerSatisfaction: 3,
      revenue: 10000,
      risk: -1,
    },

    lesson:
      "Reputation is an intangible business asset that can improve commercial opportunity.",
  },
];


const getRareShock = (
  state,
  difficulty
) => {
  if (
    state.currentDay < 4
  ) {
    return null;
  }


  const available =
    RARE_SHOCKS.filter(
      (shock) =>
        !shock.requires ||
        shock.requires(state)
    );


  if (!available.length) {
    return null;
  }


  const daySeed =
    `${state.simulationSeed}-shock-${state.currentDay}`;


  const eventIndex =
    Math.floor(
      seededNumber(
        `${daySeed}-index`
      ) *
        available.length
    );


  const shock =
    available[eventIndex];


  const adjustedChance =
    clamp(
      shock.baseChance *
        difficulty.pressureMultiplier,
      0.03,
      0.22
    );


  const roll =
    seededNumber(
      `${daySeed}-chance`
    );


  return roll <= adjustedChance
    ? shock
    : null;
};


// =========================================================
// PICK TODAY'S DEEP CONSEQUENCE
// =========================================================

export const getDeepConsequence = (
  state
) => {
  if (
    state.currentDay < 4
  ) {
    return null;
  }


  const alreadyToday =
    (state.deepConsequences || [])
      .some(
        (item) =>
          item.day ===
          state.currentDay
      );


  if (alreadyToday) {
    return null;
  }


  const difficulty =
    getSimulationDifficulty(
      state
    );


  const compounds =
    getCompoundCandidates(
      state
    )
      .filter(
        (candidate) =>
          !wasApplied(
            state,
            candidate.id
          )
      )
      .sort(
        (a, b) =>
          b.priority -
          a.priority
      );


  const shock =
    getRareShock(
      state,
      difficulty
    );


  // Strong compound consequences are more important
  // than random shocks because they teach causality.
  if (
    compounds.length &&
    compounds[0].priority >= 85
  ) {
    return {
      ...compounds[0],

      difficulty:
        difficulty.level,
    };
  }


  if (
    shock &&
    !wasApplied(
      state,
      shock.id
    )
  ) {
    return {
      ...shock,

      priority: 80,

      why:
        "This was an external event. Your earlier decisions did not directly cause it, but they determine how well the company can absorb it.",

      difficulty:
        difficulty.level,
    };
  }


  if (compounds.length) {
    return {
      ...compounds[0],

      difficulty:
        difficulty.level,
    };
  }


  return null;
};


// =========================================================
// FINAL ENDINGS
// =========================================================

export const getSimulationEnding = (
  state
) => {
  const b =
    state.business;

  const currentProfit =
    getProfit(b);

  const runway =
    getRunway(b);

  const debt =
    getDebtRatio(b);


  let score = 50;

  score +=
    currentProfit > 0
      ? 15
      : -20;

  score +=
    clamp(
      runway * 8,
      -10,
      20
    );

  score +=
    (b.employeeMorale - 50) *
    0.14;

  score +=
    (b.customerSatisfaction - 50) *
    0.16;

  score -=
    Math.max(
      0,
      b.risk - 50
    ) *
    0.25;

  score -=
    Math.max(
      0,
      debt - 55
    ) *
    0.15;

  score =
    clamp(
      Math.round(score),
      0,
      100
    );


  if (
    currentProfit < 0 &&
    runway < 0.7
  ) {
    return {
      id:
        "distressed",

      title:
        "Distressed Business",

      tone:
        "danger",

      score,

      headline:
        "The business reached the end of the period under serious financial pressure.",

      message:
        "The company still exists, but management must stabilise cash, profitability and risk before pursuing further growth.",

      nextChapter:
        "Turnaround & Recovery",
    };
  }


  if (
    (state.recoveryActions || [])
      .length > 0 &&
    currentProfit >= 0 &&
    runway >= 0.9
  ) {
    return {
      id:
        "turnaround",

      title:
        "Turnaround Business",

      tone:
        "warning",

      score,

      headline:
        "The company experienced pressure and successfully began stabilising itself.",

      message:
        "The entrepreneur demonstrated the ability to recognise deterioration and take corrective action.",

      nextChapter:
        "Controlled Recovery",
    };
  }


  if (
    b.founderOwnership < 100 &&
    currentProfit > 0
  ) {
    return {
      id:
        "investor-backed",

      title:
        "Investor-Backed Growth Business",

      tone:
        "info",

      score,

      headline:
        "The company used external ownership to accelerate its development.",

      message:
        "The business has more resources and greater governance expectations than when the journey began.",

      nextChapter:
        "Governance & Scale",
    };
  }


  if (
    b.revenue >
      state.baseline.revenue *
        1.25 &&
    currentProfit > 0 &&
    b.risk < 65
  ) {
    return {
      id:
        "high-growth",

      title:
        "High-Growth Business",

      tone:
        "positive",

      score,

      headline:
        "The company achieved significant growth without losing control of its fundamentals.",

      message:
        "The next challenge is turning momentum into repeatable and sustainable scale.",

      nextChapter:
        "Scale & Expansion",
    };
  }


  if (
    score >= 85 &&
    b.customerSatisfaction >=
      75 &&
    b.employeeMorale >= 70
  ) {
    return {
      id:
        "exceptional",

      title:
        "Exceptional Business",

      tone:
        "gold",

      score,

      headline:
        "The entrepreneur created a strong, resilient and trusted company.",

      message:
        "Financial performance, people health, customer trust and risk management are all working together.",

      nextChapter:
        "Strategic Leadership",
    };
  }


  if (
    score >= 65
  ) {
    return {
      id:
        "stable",

      title:
        "Stable & Sustainable Business",

      tone:
        "positive",

      score,

      headline:
        "The company finished the period on a healthy operating foundation.",

      message:
        "The business has enough balance to continue developing without an immediate survival crisis.",

      nextChapter:
        "Sustainable Growth",
    };
  }


  return {
    id:
      "survival",

    title:
      "Survival Business",

    tone:
      "warning",

    score,

    headline:
      "The company made it through the period, but important weaknesses remain.",

    message:
      "The entrepreneur now has clear evidence of which capabilities require attention before the next stage of growth.",

    nextChapter:
      "Strengthen the Core",
  };
};


// =========================================================
// REPLAY INSIGHTS
// =========================================================

export const getReplayInsights = (
  state
) => {
  const ending =
    getSimulationEnding(
      state
    );

  const b =
    state.business;

  const baseline =
    state.baseline;


  const changes = [
    {
      label:
        "Revenue",

      before:
        baseline.revenue,

      after:
        b.revenue,

      change:
        b.revenue -
        baseline.revenue,
    },

    {
      label:
        "Cash",

      before:
        baseline.cash,

      after:
        b.cash,

      change:
        b.cash -
        baseline.cash,
    },

    {
      label:
        "Debt",

      before:
        baseline.debt,

      after:
        b.debt,

      change:
        b.debt -
        baseline.debt,
    },

    {
      label:
        "Customers",

      before:
        baseline.customers,

      after:
        b.customers,

      change:
        b.customers -
        baseline.customers,
    },

    {
      label:
        "Employees",

      before:
        baseline.employees,

      after:
        b.employees,

      change:
        b.employees -
        baseline.employees,
    },
  ];


  return {
    ending,

    seed:
      state.simulationSeed,

    decisions:
      (state.decisions || [])
        .length,

    conversations:
      (state.activityLog || [])
        .filter(
          (item) =>
            item.type ===
            "CONVERSATION"
        )
        .length,

    unexpectedEvents:
      (state.businessEvents || [])
        .filter(
          (event) =>
            event.status ===
            "resolved"
        )
        .length,

    relationshipCallbacks:
      (state.activityLog || [])
        .filter(
          (item) =>
            item.type ===
            "RELATIONSHIP_EVENT"
        )
        .length,

    deepConsequences:
      (state.deepConsequences || [])
        .length,

    changes,
  };
};
