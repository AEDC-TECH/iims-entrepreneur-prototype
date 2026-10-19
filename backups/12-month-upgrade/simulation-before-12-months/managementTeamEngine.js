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


const getCashCoverage = (
  business
) =>
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


const getBaseContext = (
  state
) => {
  const business =
    state.business;

  const profit =
    getProfit(business);

  const cashCoverage =
    getCashCoverage(
      business
    );

  const debtRatio =
    getDebtRatio(
      business
    );

  return {
    business,
    profit,
    cashCoverage,
    debtRatio,
  };
};


const getCFOAdvice = (
  state
) => {
  const {
    business,
    profit,
    cashCoverage,
    debtRatio,
  } = getBaseContext(state);

  let stance = "balanced";
  let confidence = 72;

  let headline =
    "The finances are manageable, but every commitment should be measured.";

  let advice =
    "Protect cash, understand the cost of each decision and avoid commitments that the business cannot support.";

  let warning =
    "Watch cash flow and future obligations.";

  if (profit < 0) {
    stance = "cautious";
    confidence = 92;

    headline =
      "We are losing money. Financial stability must come first.";

    advice =
      "Before taking on more commitments, identify how this decision will improve margin or reduce pressure.";

    warning =
      "Growth while loss-making can make the problem larger.";
  } else if (
    cashCoverage < 0.75
  ) {
    stance = "cautious";
    confidence = 88;

    headline =
      "Our cash buffer is becoming too thin.";

    advice =
      "Prioritise liquidity. A good opportunity can still become dangerous if cash leaves before revenue arrives.";

    warning =
      "The company may struggle to absorb an unexpected expense.";
  } else if (
    debtRatio > 65
  ) {
    stance = "cautious";
    confidence = 86;

    headline =
      "Debt is becoming a major strategic constraint.";

    advice =
      "Avoid relying on additional debt unless the expected return clearly supports future repayments.";

    warning =
      "Future cash flow is becoming committed to lenders.";
  } else if (
    cashCoverage >= 1.5 &&
    profit > 0
  ) {
    stance = "supportive";
    confidence = 80;

    headline =
      "We have financial room to consider a calculated investment.";

    advice =
      "The business can take controlled risk, provided the expected return and downside are understood.";

    warning =
      "Do not confuse available cash with unlimited capacity.";
  }

  return {
    id: "cfo",
    name: "Naledi Mokoena",
    role: "Chief Financial Officer",
    shortRole: "CFO",

    initials: "NM",

    department:
      "Finance",

    stance,
    confidence,

    headline,
    advice,
    warning,

    focus:
      "Cash, profitability, debt and financial sustainability",

    metric: {
      label:
        "Cash Coverage",

      value:
        `${cashCoverage.toFixed(
          1
        )} months`,
    },
  };
};


const getOperationsAdvice = (
  state
) => {
  const business =
    state.business;

  const employeeLoad =
    business.customers /
    Math.max(
      business.employees,
      1
    );

  let stance =
    "balanced";

  let confidence = 70;

  let headline =
    "The company can operate, but execution capacity matters.";

  let advice =
    "Consider whether systems, employees and processes can support the decision after it is made.";

  let warning =
    "A strategy that cannot be executed becomes an operational problem.";

  if (
    employeeLoad >= 3
  ) {
    stance = "cautious";
    confidence = 88;

    headline =
      "Operational capacity is becoming stretched.";

    advice =
      "Before adding more work, strengthen delivery capacity or simplify existing operations.";

    warning =
      "More customers could reduce service quality if the team cannot absorb the workload.";
  } else if (
    business.risk >= 70
  ) {
    stance = "cautious";
    confidence = 85;

    headline =
      "Too many operational risks are active at the same time.";

    advice =
      "Stabilise the operation before introducing another major change.";

    warning =
      "Multiple small problems can combine into a serious business interruption.";
  } else if (
    business.employees >= 8 &&
    business.risk < 50
  ) {
    stance = "supportive";
    confidence = 78;

    headline =
      "The operation has enough structure to support controlled growth.";

    advice =
      "We can move forward, but responsibilities and delivery standards must remain clear.";

    warning =
      "Capacity should still be monitored after expansion.";
  }

  return {
    id: "operations",

    name:
      "Thabo Nkosi",

    role:
      "Operations Lead",

    shortRole:
      "Operations",

    initials: "TN",

    department:
      "Operations",

    stance,
    confidence,

    headline,
    advice,
    warning,

    focus:
      "Capacity, execution, quality and operational risk",

    metric: {
      label:
        "Customers / Employee",

      value:
        employeeLoad.toFixed(
          1
        ),
    },
  };
};


const getPeopleAdvice = (
  state
) => {
  const business =
    state.business;

  let stance =
    "balanced";

  let confidence = 70;

  let headline =
    "The team can support the company when people pressure is managed.";

  let advice =
    "Consider how this decision changes workload, morale, accountability and employee development.";

  let warning =
    "People costs and people capacity both matter.";

  if (
    business.employeeMorale <
    55
  ) {
    stance = "cautious";
    confidence = 93;

    headline =
      "The team is showing clear signs of pressure.";

    advice =
      "Address morale and workload before asking employees to carry another major change.";

    warning =
      "Ignoring people pressure can lead to poor performance, absence or employee loss.";
  } else if (
    business.employeeMorale >=
    80
  ) {
    stance = "supportive";
    confidence = 82;

    headline =
      "The team currently has strong confidence.";

    advice =
      "This is a good time to involve employees in the next stage of growth and give them clear ownership.";

    warning =
      "Strong morale can fall quickly if growth creates unmanaged workload.";
  } else if (
    business.employees <= 5 &&
    business.customers >= 15
  ) {
    stance = "cautious";
    confidence = 84;

    headline =
      "The company may be relying on too few people.";

    advice =
      "Think carefully about capacity and succession before increasing customer commitments.";

    warning =
      "A small team creates concentration risk when key employees are unavailable.";
  }

  return {
    id: "people",

    name:
      "Lerato Molefe",

    role:
      "People & Culture Lead",

    shortRole:
      "People",

    initials: "LM",

    department:
      "People",

    stance,
    confidence,

    headline,
    advice,
    warning,

    focus:
      "Morale, capability, workload and employee sustainability",

    metric: {
      label:
        "Team Morale",

      value:
        `${Math.round(
          business.employeeMorale
        )}%`,
    },
  };
};


const getSalesAdvice = (
  state
) => {
  const business =
    state.business;

  let stance =
    "balanced";

  let confidence = 72;

  let headline =
    "The market opportunity should be viewed through customer value.";

  let advice =
    "Consider whether the decision strengthens customer relationships, differentiation and profitable revenue.";

  let warning =
    "Revenue that destroys margin or service quality is not healthy growth.";

  if (
    business.customerSatisfaction >=
    80
  ) {
    stance = "supportive";
    confidence = 88;

    headline =
      "Customers currently trust us. That creates room to grow.";

    advice =
      "Use the strong customer relationship to pursue opportunities without competing only on price.";

    warning =
      "Protect service quality as the customer base expands.";
  } else if (
    business.customerSatisfaction <
    55
  ) {
    stance = "cautious";
    confidence = 91;

    headline =
      "Customer trust needs attention before aggressive growth.";

    advice =
      "Fix the customer experience first. Growth will amplify service problems if they remain unresolved.";

    warning =
      "New sales cannot compensate indefinitely for unhappy existing customers.";
  } else if (
    business.customers >
    state.baseline.customers
  ) {
    stance = "supportive";
    confidence = 76;

    headline =
      "The market is responding to the company.";

    advice =
      "There is positive commercial momentum. Focus on converting that momentum into profitable long-term customers.";

    warning =
      "Track acquisition quality, not customer numbers alone.";
  }

  return {
    id: "sales",

    name:
      "Amina Patel",

    role:
      "Sales & Customer Lead",

    shortRole:
      "Sales",

    initials: "AP",

    department:
      "Commercial",

    stance,
    confidence,

    headline,
    advice,
    warning,

    focus:
      "Customers, revenue, market position and commercial opportunity",

    metric: {
      label:
        "Customer Trust",

      value:
        `${Math.round(
          business.customerSatisfaction
        )}%`,
    },
  };
};


const getAdvisorAdvice = (
  state,
  profile
) => {
  const business =
    state.business;

  let stance =
    "balanced";

  let confidence = 90;

  let headline =
    "There may be more than one defensible answer.";

  let advice =
    "Choose the option you can explain, manage and learn from. Your reasoning matters as much as the immediate result.";

  let warning =
    "Do not follow one advisor automatically. Compare the trade-offs.";

  if (
    business.risk >= 75
  ) {
    stance = "cautious";

    headline =
      "The business is carrying significant accumulated risk.";

    advice =
      "Ask which current risks must be reduced before another strategic commitment is added.";
  } else if (
    profile?.primary?.id ===
    "growth"
  ) {
    headline =
      "Your natural instinct is to pursue growth.";

    advice =
      "Challenge yourself to test the cash, capacity and downside before choosing the growth option.";
  } else if (
    profile?.primary?.id ===
    "cash"
  ) {
    headline =
      "Your instinct is to protect liquidity.";

    advice =
      "Consider whether excessive caution could cause the company to miss a manageable growth opportunity.";
  } else if (
    profile?.primary?.id ===
    "people"
  ) {
    headline =
      "You naturally place strong weight on people.";

    advice =
      "Keep that strength, but test whether the financial return can support the people investment.";
  } else if (
    profile?.primary?.id ===
    "risk"
  ) {
    headline =
      "You are comfortable operating with uncertainty.";

    advice =
      "Before committing, define the point at which you would stop, recover or change strategy.";
  }

  return {
    id: "advisor",

    name:
      "YAEI Business Advisor",

    role:
      "Entrepreneur Development Advisor",

    shortRole:
      "YAEI Advisor",

    initials:
      "YA",

    department:
      "Advisory",

    stance,
    confidence,

    headline,
    advice,
    warning,

    focus:
      "Reflection, trade-offs and entrepreneur development",

    metric: {
      label:
        "Business Risk",

      value:
        `${Math.round(
          business.risk
        )}%`,
    },
  };
};


const getScenarioView = (
  scenario,
  advisor,
  state
) => {
  if (!scenario) {
    return advisor;
  }

  const day =
    scenario.day ||
    state.currentDay;

  const additions = {
    cfo: {
      1:
        "For this growth opportunity, calculate how long cash leaves the company before the new customer begins paying.",

      2:
        "The central question is liquidity. Revenue already earned is not useful until the cash is actually collected.",

      4:
        "The supplier increase should be translated into a new gross and operating margin before pricing is changed.",

      5:
        "Compare the total economic cost of debt, equity and self-funding — not only the R300,000 received.",
    },

    operations: {
      1:
        "If the contract is accepted, who will actually deliver the additional work and what happens if implementation is slower than expected?",

      3:
        "A people decision today can change delivery capacity tomorrow.",

      4:
        "Changing suppliers can create quality and delivery risk even when the new price looks attractive.",

      6:
        "Competitor pressure should not cause the operation to promise service levels it cannot consistently deliver.",
    },

    people: {
      1:
        "Growth may require new employees, but hiring too early creates fixed cost before the new revenue is secure.",

      3:
        "Retention is not only about salary. Development, recognition, workload and future opportunity also matter.",

      6:
        "A price war can create pressure on employees if the business tries to deliver more for less.",
    },

    sales: {
      1:
        "This opportunity could open a valuable customer relationship, but the payment terms are as important as the contract value.",

      2:
        "How we collect the overdue invoice could protect or damage the customer relationship.",

      4:
        "Customers may accept higher prices when the value proposition is clear.",

      6:
        "Do not assume the cheapest competitor automatically wins. Understand what customers actually value.",
    },

    advisor: {
      1:
        "Growth decisions reveal whether an entrepreneur thinks only about revenue or about the whole business system.",

      2:
        "Cash-flow pressure is where many healthy-looking businesses become vulnerable.",

      3:
        "There is rarely one universally correct people decision. Context and affordability matter.",

      4:
        "Pricing exposes how well an entrepreneur understands value, cost and customer behaviour.",

      5:
        "Funding changes the future of the company, not only today's bank balance.",

      6:
        "Competitive strategy is ultimately a choice about what kind of business you want to become.",
    },
  };

  const scenarioInsight =
    additions[
      advisor.id
    ]?.[day];

  return {
    ...advisor,

    scenarioInsight:
      scenarioInsight ||
      "Consider this decision from your area of responsibility before management commits.",
  };
};


export const getManagementTeam = (
  state,
  scenario,
  profile
) => {
  const rawTeam = [
    getCFOAdvice(state),
    getOperationsAdvice(
      state
    ),
    getPeopleAdvice(state),
    getSalesAdvice(state),
    getAdvisorAdvice(
      state,
      profile
    ),
  ];

  const team =
    rawTeam.map(
      (advisor) =>
        getScenarioView(
          scenario,
          advisor,
          state
        )
    );


  const supportive =
    team.filter(
      (member) =>
        member.stance ===
        "supportive"
    ).length;

  const cautious =
    team.filter(
      (member) =>
        member.stance ===
        "cautious"
    ).length;

  const balanced =
    team.length -
    supportive -
    cautious;


  let roomMood =
    "Mixed views";

  if (
    supportive >= 4
  ) {
    roomMood =
      "Mostly supportive";
  } else if (
    cautious >= 4
  ) {
    roomMood =
      "Strong caution";
  } else if (
    supportive >
    cautious + 1
  ) {
    roomMood =
      "Leaning forward";
  } else if (
    cautious >
    supportive + 1
  ) {
    roomMood =
      "Leaning cautious";
  }


  const averageConfidence =
    Math.round(
      team.reduce(
        (sum, item) =>
          sum +
          item.confidence,
        0
      ) / team.length
    );


  return {
    team,

    consensus: {
      supportive,
      cautious,
      balanced,

      roomMood,

      averageConfidence:
        clamp(
          averageConfidence,
          0,
          100
        ),
    },
  };
};
