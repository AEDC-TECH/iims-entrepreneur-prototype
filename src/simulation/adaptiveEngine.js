const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, value));

const PROFILE_TYPES = {
  BALANCED: {
    id: "balanced",
    title: "Balanced Operator",
    shortTitle: "Balanced",
    description:
      "You tend to consider several parts of the business before making major commitments.",
  },

  GROWTH: {
    id: "growth",
    title: "Growth Driver",
    shortTitle: "Growth-focused",
    description:
      "You frequently prioritise expansion, revenue growth and new opportunities.",
  },

  CASH: {
    id: "cash",
    title: "Cash Guardian",
    shortTitle: "Cash-disciplined",
    description:
      "You place strong emphasis on liquidity, collections and protecting working capital.",
  },

  PEOPLE: {
    id: "people",
    title: "People Builder",
    shortTitle: "People-focused",
    description:
      "You place strong emphasis on employees, capability and team stability.",
  },

  CUSTOMER: {
    id: "customer",
    title: "Customer Champion",
    shortTitle: "Customer-focused",
    description:
      "You frequently protect relationships, service quality and customer retention.",
  },

  RISK: {
    id: "risk",
    title: "Bold Risk Taker",
    shortTitle: "High-risk",
    description:
      "You are comfortable making aggressive decisions when you see a potential opportunity.",
  },

  DEBT: {
    id: "debt",
    title: "Leveraged Growth Manager",
    shortTitle: "Debt-reliant",
    description:
      "You have used borrowing as an important tool for solving problems or financing growth.",
  },
};


const scoreDecision = (
  score,
  decision
) => {
  const effects =
    decision.immediateEffects || {};

  const skills =
    decision.skillEffects || {};

  if (
    Number(effects.revenue || 0) > 0
  ) {
    score.growth += 4;
  }

  if (
    Number(skills.growthStrategy || 0) > 0
  ) {
    score.growth +=
      Number(
        skills.growthStrategy
      );
  }


  if (
    Number(effects.cash || 0) > 0
  ) {
    score.cash += 3;
  }

  if (
    Number(effects.receivables || 0) < 0
  ) {
    score.cash += 5;
  }

  if (
    Number(skills.cashFlow || 0) > 0
  ) {
    score.cash +=
      Number(skills.cashFlow);
  }


  if (
    Number(
      effects.employeeMorale || 0
    ) > 0
  ) {
    score.people += 5;
  }

  if (
    Number(
      skills.peopleManagement || 0
    ) > 0
  ) {
    score.people +=
      Number(
        skills.peopleManagement
      );
  }


  if (
    Number(
      effects.customerSatisfaction ||
        0
    ) > 0
  ) {
    score.customer += 5;
  }

  if (
    Number(
      skills.customerManagement || 0
    ) > 0
  ) {
    score.customer +=
      Number(
        skills.customerManagement
      );
  }


  if (
    Number(effects.risk || 0) >= 5
  ) {
    score.risk +=
      Number(effects.risk);
  }


  if (
    Number(effects.debt || 0) > 0
  ) {
    score.debt += 10;
  }

  if (
    Number(
      skills.fundingDecisions || 0
    ) > 0
  ) {
    score.debt += 1;
  }
};


export const getEntrepreneurProfile = (
  state
) => {
  const score = {
    growth: 0,
    cash: 0,
    people: 0,
    customer: 0,
    risk: 0,
    debt: 0,
  };

  state.decisions.forEach(
    (decision) =>
      scoreDecision(
        score,
        decision
      )
  );


  // Skills also influence the profile,
  // but decisions remain more important.
  score.growth += Math.max(
    0,
    state.skills.growthStrategy -
      50
  );

  score.cash += Math.max(
    0,
    state.skills.cashFlow - 50
  );

  score.people += Math.max(
    0,
    state.skills.peopleManagement -
      50
  );

  score.customer += Math.max(
    0,
    state.skills.customerManagement -
      50
  );

  score.risk += Math.max(
    0,
    state.business.risk - 50
  );


  const ranked =
    Object.entries(score)
      .map(([id, value]) => ({
        id,
        value,
      }))
      .sort(
        (a, b) =>
          b.value - a.value
      );


  if (
    state.decisions.length < 2
  ) {
    return {
      primary:
        PROFILE_TYPES.BALANCED,

      secondary: null,

      scores: score,

      confidence: 25,

      traits: [
        "Still developing",
        "Not enough history yet",
      ],

      strengths: [
        "Open decision profile",
      ],

      watchouts: [
        "Complete more business stages to reveal a stronger pattern.",
      ],

      explanation:
        "IIMS is still learning how you approach business decisions.",
    };
  }


  const highest = ranked[0];

  const second = ranked[1];

  const spread =
    highest.value -
    second.value;


  let primary =
    PROFILE_TYPES.BALANCED;


  if (
    spread <= 3 &&
    state.decisions.length >= 3
  ) {
    primary =
      PROFILE_TYPES.BALANCED;
  } else {
    primary =
      {
        growth:
          PROFILE_TYPES.GROWTH,

        cash:
          PROFILE_TYPES.CASH,

        people:
          PROFILE_TYPES.PEOPLE,

        customer:
          PROFILE_TYPES.CUSTOMER,

        risk:
          PROFILE_TYPES.RISK,

        debt:
          PROFILE_TYPES.DEBT,
      }[highest.id] ||
      PROFILE_TYPES.BALANCED;
  }


  const secondary =
    {
      growth:
        PROFILE_TYPES.GROWTH,

      cash:
        PROFILE_TYPES.CASH,

      people:
        PROFILE_TYPES.PEOPLE,

      customer:
        PROFILE_TYPES.CUSTOMER,

      risk:
        PROFILE_TYPES.RISK,

      debt:
        PROFILE_TYPES.DEBT,
    }[second.id] || null;


  const traits = [];

  if (score.growth >= 12) {
    traits.push(
      "Opportunity seeking"
    );
  }

  if (score.cash >= 12) {
    traits.push(
      "Cash conscious"
    );
  }

  if (score.people >= 10) {
    traits.push(
      "People oriented"
    );
  }

  if (score.customer >= 10) {
    traits.push(
      "Customer oriented"
    );
  }

  if (score.risk >= 10) {
    traits.push(
      "Comfortable with risk"
    );
  }

  if (score.debt >= 12) {
    traits.push(
      "Uses leverage"
    );
  }


  const strengths = [];

  const watchouts = [];


  switch (primary.id) {
    case "growth":
      strengths.push(
        "Comfortable pursuing expansion",
        "Recognises revenue opportunities"
      );

      watchouts.push(
        "Growth can consume cash before it produces returns.",
        "Capacity and debt should grow more slowly than revenue."
      );
      break;


    case "cash":
      strengths.push(
        "Protects liquidity",
        "Pays attention to working capital"
      );

      watchouts.push(
        "Excessive caution can cause the business to miss valuable opportunities."
      );
      break;


    case "people":
      strengths.push(
        "Values employee capability",
        "Understands retention risk"
      );

      watchouts.push(
        "People investments still need to remain financially sustainable."
      );
      break;


    case "customer":
      strengths.push(
        "Values long-term relationships",
        "Protects customer experience"
      );

      watchouts.push(
        "Customer satisfaction should not come at the expense of weak margins or unpaid invoices."
      );
      break;


    case "risk":
      strengths.push(
        "Acts decisively",
        "Comfortable operating under uncertainty"
      );

      watchouts.push(
        "Aggressive decisions can create hidden financial obligations."
      );
      break;


    case "debt":
      strengths.push(
        "Understands that funding can unlock opportunity",
        "Willing to use external capital"
      );

      watchouts.push(
        "Repayments continue even when revenue weakens.",
        "Future funding decisions should consider existing leverage."
      );
      break;


    default:
      strengths.push(
        "Considers multiple business dimensions",
        "Does not rely heavily on one decision style"
      );

      watchouts.push(
        "Balanced decision-making still requires clear priorities when pressure increases."
      );
  }


  const total =
    Object.values(score).reduce(
      (sum, value) =>
        sum + value,
      0
    );

  const confidence =
    total > 0
      ? clamp(
          Math.round(
            (highest.value /
              total) *
              180
          ),
          35,
          95
        )
      : 35;


  return {
    primary,
    secondary,
    scores: score,
    confidence,
    traits:
      traits.length > 0
        ? traits
        : [
            "Balanced decision style",
          ],
    strengths,
    watchouts,
    explanation:
      primary.description,
  };
};


// =========================================================
// ADAPTIVE SCENARIO ENGINE
// =========================================================

const createCashGuardianOption = () => ({
  id:
    "adaptive-supplier-terms",

  title:
    "Negotiate 60-day supplier terms",

  description:
    "Keep the supplier but negotiate more time to pay instead of accepting the full cash impact immediately.",

  immediateEffects: {
    cash: 15000,
    expenses: 9000,
    risk: -2,
  },

  skillEffects: {
    cashFlow: 7,
    financialPlanning: 5,
    riskManagement: 3,
  },

  outcome: {
    headline:
      "You protected short-term cash",

    explanation:
      "The supplier still receives the agreed price, but the business has more time before cash leaves the company.",

    lesson:
      "Payment terms can be just as important as price when managing working capital.",
  },

  delayedConsequences: [
    {
      dueDay: 5,

      title:
        "Supplier payment is approaching",

      description:
        "The longer payment period protected cash earlier, but the obligation has not disappeared.",

      effects: {
        cash: -15000,
      },
    },
  ],
});


const createBlendedFundingOption = () => ({
  id:
    "adaptive-blended-funding",

  title:
    "Use blended funding",

  description:
    "Combine a smaller bank loan with a small equity investment instead of relying completely on one source.",

  immediateEffects: {
    cash: 300000,
    debt: 100000,
    liabilities: 100000,
    assets: 300000,
    founderOwnership: -5,
    expenses: 7000,
    risk: 2,
  },

  skillEffects: {
    fundingDecisions: 8,
    financialPlanning: 7,
    riskManagement: 6,
  },

  outcome: {
    headline:
      "You spread the funding risk",

    explanation:
      "The company receives the required investment while limiting both debt repayments and ownership dilution.",

    lesson:
      "Funding strategies can combine debt, equity and internal cash rather than relying on one source.",
  },

  delayedConsequences: [
    {
      dueDay: 6,

      title:
        "Blended funding obligations begin",

      description:
        "The company now needs to manage both loan repayments and shareholder expectations.",

      effects: {
        cash: -7000,
        risk: 1,
      },
    },
  ],
});


const createReserveFirstOption = () => ({
  id:
    "adaptive-build-reserves",

  title:
    "Delay expansion and build reserves first",

  description:
    "Postpone the full R300,000 investment while strengthening cash reserves and financial capacity.",

  immediateEffects: {
    risk: -7,
  },

  skillEffects: {
    cashFlow: 6,
    financialPlanning: 7,
    fundingDecisions: 4,
  },

  outcome: {
    headline:
      "You chose financial readiness before expansion",

    explanation:
      "The company delays some growth benefits, but avoids committing to a major investment before its finances are ready.",

    lesson:
      "Sometimes the best funding decision is to wait until the business has stronger financial capacity.",
  },

  delayedConsequences: [],
});


const createCustomerLoyaltyOption = () => ({
  id:
    "adaptive-loyalty-programme",

  title:
    "Launch a customer loyalty programme",

  description:
    "Keep pricing stable while rewarding long-term customers with service benefits and retention incentives.",

  immediateEffects: {
    cash: -15000,
    expenses: 6000,
    revenue: 10000,
    customerSatisfaction: 10,
    risk: -2,
  },

  skillEffects: {
    customerManagement: 8,
    pricing: 4,
    growthStrategy: 4,
  },

  outcome: {
    headline:
      "You strengthened customer loyalty",

    explanation:
      "The company invested in customer retention instead of entering a direct price war.",

    lesson:
      "Retention strategies can protect revenue without permanently reducing prices.",
  },

  delayedConsequences: [],
});


const createPremiumBundleOption = () => ({
  id:
    "adaptive-premium-bundle",

  title:
    "Launch a premium service bundle",

  description:
    "Respond to low-cost competitors by offering additional value at a higher service level.",

  immediateEffects: {
    revenue: 25000,
    cash: -12000,
    expenses: 7000,
    customerSatisfaction: 4,
    risk: 2,
  },

  skillEffects: {
    growthStrategy: 8,
    pricing: 6,
    customerManagement: 4,
  },

  outcome: {
    headline:
      "You competed through value rather than price",

    explanation:
      "The business created a premium offer for customers who value service, support and reliability.",

    lesson:
      "Differentiation can reduce dependence on price competition.",
  },

  delayedConsequences: [],
});


export const getAdaptiveScenario = (
  baseScenario,
  state,
  profile
) => {
  if (!baseScenario) {
    return null;
  }

  const scenario = {
    ...baseScenario,

    context: {
      ...baseScenario.context,
    },

    decisions:
      baseScenario.decisions.map(
        (decision) => ({
          ...decision,
        })
      ),

    adaptivePath: null,
  };


  if (
    baseScenario.day === 4 &&
    profile.primary.id ===
      "cash"
  ) {
    scenario.decisions.push(
      createCashGuardianOption()
    );

    scenario.adaptivePath = {
      title:
        "Cash Guardian opportunity",

      message:
        "Because you have consistently protected liquidity, IIMS has introduced an additional supplier-payment strategy.",
    };
  }


  if (
    baseScenario.day === 5 &&
    [
      "debt",
      "risk",
    ].includes(
      profile.primary.id
    )
  ) {
    scenario.decisions.push(
      createBlendedFundingOption()
    );

    scenario.adaptivePath = {
      title:
        "Funding strategy challenge",

      message:
        "Your previous decisions show a willingness to use external capital. A blended funding option is now available.",
    };
  }


  if (
    baseScenario.day === 5 &&
    profile.primary.id ===
      "cash"
  ) {
    scenario.decisions.push(
      createReserveFirstOption()
    );

    scenario.adaptivePath = {
      title:
        "Cash discipline pathway",

      message:
        "Your strong liquidity focus has unlocked the option to delay expansion and strengthen reserves first.",
    };
  }


  if (
    baseScenario.day === 6 &&
    profile.primary.id ===
      "customer"
  ) {
    scenario.decisions.push(
      createCustomerLoyaltyOption()
    );

    scenario.adaptivePath = {
      title:
        "Customer Champion pathway",

      message:
        "Because you have consistently protected customer relationships, IIMS has unlocked a loyalty-based response to competition.",
    };
  }


  if (
    baseScenario.day === 6 &&
    profile.primary.id ===
      "growth"
  ) {
    scenario.decisions.push(
      createPremiumBundleOption()
    );

    scenario.adaptivePath = {
      title:
        "Growth Driver pathway",

      message:
        "Your growth-oriented decision pattern has unlocked a premium expansion strategy.",
    };
  }


  return scenario;
};
