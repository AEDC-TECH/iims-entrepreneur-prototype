const getWeakestSkills = (skills) => {
  const labels = {
    cashFlow: "Cash Flow",
    financialPlanning: "Financial Planning",
    peopleManagement: "People Management",
    customerManagement: "Customer Management",
    pricing: "Pricing",
    riskManagement: "Risk Management",
    fundingDecisions: "Funding Decisions",
    growthStrategy: "Growth Strategy",
  };

  return Object.entries(skills)
    .map(([key, value]) => ({
      key,
      label: labels[key] || key,
      value,
    }))
    .sort((a, b) => a.value - b.value);
};


const TOPIC_LIBRARY = {
  cashFlow: {
    title: "Working Capital & Cash Flow",
    category: "Finance",
    description:
      "Learn how cash moves through the business, how customer payment delays affect operations, and how to protect liquidity.",
    why:
      "A profitable business can still fail if it runs out of cash.",
  },

  financialPlanning: {
    title: "Financial Planning & Forecasting",
    category: "Finance",
    description:
      "Understand budgets, future commitments, expense planning and the financial impact of growth decisions.",
    why:
      "Business decisions become safer when future cash and costs are planned before commitments are made.",
  },

  peopleManagement: {
    title: "Employee Management & Retention",
    category: "People",
    description:
      "Learn how workload, incentives, salaries, morale and employee retention affect business performance.",
    why:
      "People decisions affect both operational capability and recurring business costs.",
  },

  customerManagement: {
    title: "Customer Relationships & Collections",
    category: "Customers",
    description:
      "Learn how to protect customer relationships while also managing credit terms, collections and service expectations.",
    why:
      "Strong customer relationships must still support sustainable cash flow and profit.",
  },

  pricing: {
    title: "Pricing for Profit",
    category: "Strategy",
    description:
      "Understand margins, supplier costs, customer value and how to avoid competing only on price.",
    why:
      "Revenue growth is not useful if the business sells work at weak or negative margins.",
  },

  riskManagement: {
    title: "Business Risk Management",
    category: "Risk",
    description:
      "Learn how to identify, assess and respond to financial, operational and market risks.",
    why:
      "Entrepreneurs cannot remove all risk, but they can understand and manage it deliberately.",
  },

  fundingDecisions: {
    title: "Funding, Debt & Equity",
    category: "Funding",
    description:
      "Compare loans, equity, internal cash and blended funding strategies.",
    why:
      "Every source of money has a cost — repayment, ownership, risk or lost flexibility.",
  },

  growthStrategy: {
    title: "Sustainable Business Growth",
    category: "Growth",
    description:
      "Learn how to scale revenue while protecting capacity, cash flow, margins and business resilience.",
    why:
      "Growth is valuable only when the business can financially and operationally support it.",
  },
};


const PROFILE_GUIDANCE = {
  balanced: {
    headline:
      "Your decision style is relatively balanced.",
    message:
      "You consider several business dimensions before committing. The next learning priority is strengthening the areas where your scores remain weakest.",
    challenge:
      "Under pressure, decide which business objective matters most instead of trying to protect everything equally.",
  },

  growth: {
    headline:
      "You naturally look for growth opportunities.",
    message:
      "Your growth mindset can create strong opportunities, but expansion should be matched by working capital, capacity and financial planning.",
    challenge:
      "Before the next growth decision, ask: how much cash must the business spend before the new revenue is actually collected?",
  },

  cash: {
    headline:
      "You consistently protect liquidity.",
    message:
      "Strong cash discipline can help a business survive difficult periods. The next challenge is making sure caution does not prevent worthwhile investment and growth.",
    challenge:
      "Identify one opportunity where controlled risk could create meaningful long-term value.",
  },

  people: {
    headline:
      "You place strong value on people and capability.",
    message:
      "Employee investment can strengthen delivery and retention, but people-related costs must remain sustainable.",
    challenge:
      "Before increasing recurring people costs, compare the cost with the measurable business value created.",
  },

  customer: {
    headline:
      "You consistently protect customer relationships.",
    message:
      "Customer loyalty is valuable, but the business still needs strong pricing, payment terms and profitable relationships.",
    challenge:
      "Ask whether every customer relationship is financially healthy for the business.",
  },

  risk: {
    headline:
      "You are comfortable making bold decisions.",
    message:
      "High risk tolerance can create opportunity, but repeated aggressive commitments can compound unexpectedly.",
    challenge:
      "Before the next major commitment, identify the worst realistic outcome and how the business would recover.",
  },

  debt: {
    headline:
      "You are comfortable using external finance.",
    message:
      "Debt can unlock opportunities, but repayment obligations continue even when revenue weakens.",
    challenge:
      "Before using more debt, calculate how existing repayments affect future monthly cash flow.",
  },
};


export const getLearningRecommendations = (
  state,
  profile
) => {
  const weakestSkills =
    getWeakestSkills(state.skills);

  const recommendations =
    weakestSkills
      .slice(0, 3)
      .map((skill, index) => ({
        id: `learning-${skill.key}`,

        priority:
          index === 0
            ? "High"
            : index === 1
              ? "Medium"
              : "Recommended",

        skillKey:
          skill.key,

        currentScore:
          skill.value,

        ...TOPIC_LIBRARY[skill.key],
      }));


  const guidance =
    PROFILE_GUIDANCE[
      profile.primary.id
    ] ||
    PROFILE_GUIDANCE.balanced;


  return {
    profileGuidance: guidance,

    recommendations,

    weakestSkill:
      weakestSkills[0],

    strongestSkill:
      [...weakestSkills]
        .reverse()[0],
  };
};


export const getAdvisorConversation = (
  state,
  profile,
  learning
) => {
  const decisions =
    state.decisions.length;

  const reflections =
    state.reflections.length;

  const recoveryActions =
    (state.recoveryActions || [])
      .length;

  const prompts = [];


  prompts.push({
    id: "profile",

    title:
      "Decision pattern",

    question:
      `Your current profile is "${profile.primary.title}". Does that description feel accurate to how you normally run your business?`,

    purpose:
      "Help the advisor compare simulation behaviour with real-world behaviour.",
  });


  if (learning.weakestSkill) {
    prompts.push({
      id: "weakest",

      title:
        "Development priority",

      question:
        `Your lowest current learning area is ${learning.weakestSkill.label}. Where do you experience this challenge in your real business?`,

      purpose:
        "Connect the simulation result to a real business problem.",
    });
  }


  if (
    profile.primary.id === "growth"
  ) {
    prompts.push({
      id: "growth",

      title:
        "Growth discussion",

      question:
        "When you accept new business, how do you estimate the cash required before the customer starts paying?",

      purpose:
        "Test working-capital awareness before further expansion.",
    });
  }


  if (
    profile.primary.id === "debt"
  ) {
    prompts.push({
      id: "debt",

      title:
        "Funding discussion",

      question:
        "How do you decide whether future cash flow can support a new repayment before taking a loan?",

      purpose:
        "Improve debt-service and funding discipline.",
    });
  }


  if (
    profile.primary.id ===
    "customer"
  ) {
    prompts.push({
      id: "customer",

      title:
        "Customer profitability",

      question:
        "Which of your customers are valuable because they are profitable, and which are simply high-revenue customers?",

      purpose:
        "Help distinguish revenue from profitable customer relationships.",
    });
  }


  if (
    profile.primary.id ===
    "people"
  ) {
    prompts.push({
      id: "people",

      title:
        "People investment",

      question:
        "How do you measure whether salary increases, hiring or staff development create enough business value?",

      purpose:
        "Connect people decisions with financial sustainability.",
    });
  }


  if (
    recoveryActions > 0
  ) {
    prompts.push({
      id: "recovery",

      title:
        "Recovery reflection",

      question:
        "Which warning signs could you have noticed earlier before the business needed recovery action?",

      purpose:
        "Turn recovery experience into preventative learning.",
    });
  }


  return {
    decisions,
    reflections,
    recoveryActions,
    prompts: prompts.slice(0, 5),
  };
};
