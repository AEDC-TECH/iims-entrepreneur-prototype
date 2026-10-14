const clamp = (
  value,
  min,
  max
) =>
  Math.min(
    max,
    Math.max(min, value)
  );


const profit = (
  business
) =>
  business.revenue -
  business.expenses;


const cashCoverage = (
  business
) =>
  business.expenses > 0
    ? business.cash /
      business.expenses
    : 0;


const debtRatio = (
  business
) =>
  business.assets > 0
    ? (business.debt /
        business.assets) *
      100
    : 0;


const hasDecision = (
  state,
  decisionId
) =>
  (state.decisions || [])
    .some(
      (decision) =>
        decision.decisionId ===
        decisionId
    );


export const getBusinessPath = (
  state
) => {
  const b = state.business;

  const currentProfit =
    profit(b);

  const runway =
    cashCoverage(b);

  const leverage =
    debtRatio(b);


  const scores = {
    cashPressure: 0,
    expansion: 0,
    peoplePressure: 0,
    customerOpportunity: 0,
    investorGovernance: 0,
    debtPressure: 0,
    balanced: 25,
  };


  // ==============================================
  // CASH PRESSURE
  // ==============================================

  if (runway < 1) {
    scores.cashPressure += 45;
  }

  if (currentProfit < 0) {
    scores.cashPressure += 35;
  }

  if (
    b.receivables >
    b.revenue * 0.45
  ) {
    scores.cashPressure += 20;
  }

  if (b.risk >= 65) {
    scores.cashPressure += 15;
  }


  // ==============================================
  // EXPANSION
  // ==============================================

  if (runway >= 1.5) {
    scores.expansion += 25;
  }

  if (currentProfit > 25000) {
    scores.expansion += 20;
  }

  if (
    b.revenue >
    state.baseline.revenue *
      1.1
  ) {
    scores.expansion += 20;
  }

  if (
    b.customerSatisfaction >=
    75
  ) {
    scores.expansion += 20;
  }

  if (b.risk < 55) {
    scores.expansion += 10;
  }


  // ==============================================
  // PEOPLE PRESSURE
  // ==============================================

  if (
    b.employeeMorale < 55
  ) {
    scores.peoplePressure +=
      50;
  }

  if (
    b.customers /
      Math.max(
        b.employees,
        1
      ) >
    2.8
  ) {
    scores.peoplePressure +=
      25;
  }

  const sipho =
    state.relationships
      ?.characters
      ?.sipho;

  if (
    sipho &&
    sipho.trust < 45
  ) {
    scores.peoplePressure +=
      35;
  }


  // ==============================================
  // CUSTOMER OPPORTUNITY
  // ==============================================

  if (
    b.customerSatisfaction >=
    80
  ) {
    scores.customerOpportunity +=
      40;
  }

  const customer =
    state.relationships
      ?.characters
      ?.nalediCustomer;

  if (
    customer &&
    customer.trust >= 80
  ) {
    scores.customerOpportunity +=
      30;
  }

  if (
    b.customers >
    state.baseline.customers
  ) {
    scores.customerOpportunity +=
      15;
  }

  if (
    b.revenue >=
    state.baseline.revenue
  ) {
    scores.customerOpportunity +=
      10;
  }


  // ==============================================
  // INVESTOR GOVERNANCE
  // ==============================================

  if (
    b.founderOwnership < 100
  ) {
    scores.investorGovernance +=
      45;
  }

  if (
    hasDecision(
      state,
      "fund-equity"
    )
  ) {
    scores.investorGovernance +=
      35;
  }

  const investor =
    state.relationships
      ?.characters
      ?.investor;

  if (
    investor &&
    investor.trust >= 70
  ) {
    scores.investorGovernance +=
      10;
  }


  // ==============================================
  // DEBT PRESSURE
  // ==============================================

  if (leverage >= 65) {
    scores.debtPressure += 45;
  }

  if (
    b.debt >
    state.baseline.debt * 1.5
  ) {
    scores.debtPressure += 30;
  }

  if (
    hasDecision(
      state,
      "fund-bank"
    )
  ) {
    scores.debtPressure += 20;
  }

  if (currentProfit < 20000) {
    scores.debtPressure += 15;
  }


  // ==============================================
  // BALANCED
  // ==============================================

  if (
    currentProfit > 0 &&
    runway >= 1 &&
    b.risk < 65 &&
    b.employeeMorale >= 60 &&
    b.customerSatisfaction >= 60
  ) {
    scores.balanced += 40;
  }


  const ordered =
    Object.entries(scores)
      .sort(
        (a, b) =>
          b[1] - a[1]
      );


  const [
    primaryKey,
    primaryScore,
  ] = ordered[0];


  const [
    secondaryKey,
    secondaryScore,
  ] = ordered[1];


  const paths = {
    cashPressure: {
      id:
        "cash-pressure",

      title:
        "Cash Under Pressure",

      shortTitle:
        "Cash Pressure",

      description:
        "The company has grown or committed resources faster than its available liquidity can comfortably support.",

      theme:
        "Financial survival",

      tone:
        "danger",
    },

    expansion: {
      id:
        "expansion",

      title:
        "Ready for Expansion",

      shortTitle:
        "Expansion",

      description:
        "Strong operating performance has created room for the company to consider a larger strategic move.",

      theme:
        "Growth",

      tone:
        "positive",
    },

    peoplePressure: {
      id:
        "people-pressure",

      title:
        "People Under Pressure",

      shortTitle:
        "People Risk",

      description:
        "The business is placing increasing pressure on its people and key talent relationships.",

      theme:
        "Leadership",

      tone:
        "warning",
    },

    customerOpportunity: {
      id:
        "customer-opportunity",

      title:
        "Customer-Led Growth",

      shortTitle:
        "Customer Growth",

      description:
        "Strong customer trust is creating opportunities that did not exist at the start of the journey.",

      theme:
        "Commercial growth",

      tone:
        "positive",
    },

    investorGovernance: {
      id:
        "investor-governance",

      title:
        "Investor-Backed Business",

      shortTitle:
        "Investor Path",

      description:
        "External capital has changed the company's ownership structure and created new governance expectations.",

      theme:
        "Ownership",

      tone:
        "info",
    },

    debtPressure: {
      id:
        "debt-pressure",

      title:
        "Leveraged Growth",

      shortTitle:
        "Debt Pressure",

      description:
        "Debt helped fund the business, but repayment commitments are becoming strategically important.",

      theme:
        "Funding",

      tone:
        "danger",
    },

    balanced: {
      id:
        "balanced",

      title:
        "Balanced Operator",

      shortTitle:
        "Balanced",

      description:
        "The company has maintained a relatively balanced position across finance, people, customers and risk.",

      theme:
        "Strategy",

      tone:
        "neutral",
    },
  };


  const primary =
    paths[primaryKey];

  const secondary =
    paths[secondaryKey];


  return {
    primary: {
      ...primary,

      score:
        clamp(
          Math.round(
            primaryScore
          ),
          0,
          100
        ),
    },

    secondary: {
      ...secondary,

      score:
        clamp(
          Math.round(
            secondaryScore
          ),
          0,
          100
        ),
    },

    scores,

    metrics: {
      profit:
        currentProfit,

      cashCoverage:
        runway,

      debtRatio:
        leverage,

      morale:
        b.employeeMorale,

      customerTrust:
        b.customerSatisfaction,

      risk:
        b.risk,

      ownership:
        b.founderOwnership,
    },
  };
};


// ==========================================================
// DAY 6 BRANCHING SCENARIOS
// ==========================================================

const BRANCH_SCENARIOS = {
  "cash-pressure": {
    id:
      "branch-cash-pressure",

    day: 6,

    month:
      "June",

    theme:
      "Business Survival",

    title:
      "Working Capital Crisis",

    context: {
      title:
        "The business is running short of financial breathing room.",

      text:
        "Payroll, supplier commitments and customer delivery obligations are approaching at the same time. The company has opportunities, but available cash is becoming dangerously important.",
    },

    decisions: [
      {
        id:
          "branch-cash-collections",

        title:
          "Launch an aggressive collections drive",

        description:
          "Contact major debtors and negotiate immediate or accelerated payment.",

        immediateEffects: {
          cash: 70000,
          receivables: -70000,
          customerSatisfaction: -4,
          risk: -8,
        },

        skillEffects: {
          cashFlow: 8,
          customerManagement: 2,
          riskManagement: 5,
        },

        outcome: {
          headline:
            "Liquidity improved quickly.",

          explanation:
            "The company converted outstanding invoices into cash, although some customers felt pressured.",

          lesson:
            "Receivables are only useful when they become cash.",
        },
      },

      {
        id:
          "branch-cash-cut",

        title:
          "Reduce operating costs immediately",

        description:
          "Freeze discretionary spending and reduce non-essential operating commitments.",

        immediateEffects: {
          expenses: -25000,
          employeeMorale: -6,
          risk: -5,
        },

        skillEffects: {
          financialPlanning: 7,
          riskManagement: 4,
        },

        outcome: {
          headline:
            "Monthly pressure reduced.",

          explanation:
            "The business improved its cost base but the team felt the impact of the cuts.",

          lesson:
            "Cost reduction can protect survival but may create operational and people consequences.",
        },
      },

      {
        id:
          "branch-cash-finance",

        title:
          "Secure emergency working-capital finance",

        description:
          "Use short-term borrowing to create breathing room.",

        immediateEffects: {
          cash: 140000,
          debt: 140000,
          liabilities: 140000,
          expenses: 9000,
          risk: 6,
        },

        skillEffects: {
          fundingDecisions: 6,
          cashFlow: 4,
        },

        outcome: {
          headline:
            "The immediate cash crisis was delayed.",

          explanation:
            "Additional funding restored liquidity but increased future repayment pressure.",

          lesson:
            "Borrowing solves a liquidity problem only if future cash flow can support repayment.",
        },
      },
    ],
  },


  expansion: {
    id:
      "branch-expansion",

    day: 6,

    month:
      "June",

    theme:
      "Strategic Growth",

    title:
      "National Expansion Opportunity",

    context: {
      title:
        "A larger market is now within reach.",

      text:
        "A potential partner wants Ubuntu Digital Solutions to expand into another province. The opportunity could materially increase revenue, but it will require capacity, cash and stronger management systems.",
    },

    decisions: [
      {
        id:
          "branch-expand-fast",

        title:
          "Expand immediately",

        description:
          "Commit resources now and pursue rapid market entry.",

        immediateEffects: {
          cash: -120000,
          revenue: 75000,
          expenses: 42000,
          employees: 3,
          customers: 5,
          risk: 12,
        },

        skillEffects: {
          growthStrategy: 8,
          riskManagement: 2,
        },

        outcome: {
          headline:
            "The company accelerated into a new market.",

          explanation:
            "Revenue and market reach improved, but financial and execution pressure increased.",

          lesson:
            "Growth multiplies both opportunity and operational complexity.",
        },
      },

      {
        id:
          "branch-expand-pilot",

        title:
          "Run a controlled market pilot",

        description:
          "Test the new market with limited resources before committing fully.",

        immediateEffects: {
          cash: -45000,
          revenue: 30000,
          expenses: 14000,
          customers: 2,
          risk: 2,
        },

        skillEffects: {
          growthStrategy: 7,
          financialPlanning: 6,
          riskManagement: 6,
        },

        outcome: {
          headline:
            "The company tested growth before scaling.",

          explanation:
            "The pilot reduced downside risk while still creating new commercial information.",

          lesson:
            "Pilots can turn uncertainty into evidence before major investment.",
        },
      },

      {
        id:
          "branch-expand-wait",

        title:
          "Strengthen the core business first",

        description:
          "Delay geographic expansion and improve systems, cash and management depth.",

        immediateEffects: {
          cash: 20000,
          employeeMorale: 4,
          risk: -7,
        },

        skillEffects: {
          financialPlanning: 7,
          riskManagement: 7,
        },

        outcome: {
          headline:
            "The business chose resilience over speed.",

          explanation:
            "Expansion was delayed, but organisational readiness improved.",

          lesson:
            "A good opportunity can still arrive before a company is ready to execute it.",
        },
      },
    ],
  },


  "people-pressure": {
    id:
      "branch-people-pressure",

    day: 6,

    month:
      "June",

    theme:
      "Leadership",

    title:
      "Leadership & Retention Crisis",

    context: {
      title:
        "The business is beginning to depend too heavily on a tired team.",

      text:
        "Workload has increased and key employees are questioning whether the company's growth is sustainable. Service delivery could deteriorate if leadership does not respond.",
    },

    decisions: [
      {
        id:
          "branch-people-invest",

        title:
          "Invest in team capacity and development",

        description:
          "Add capacity, formalise development plans and reduce pressure on key employees.",

        immediateEffects: {
          cash: -55000,
          expenses: 18000,
          employees: 2,
          employeeMorale: 14,
          risk: -8,
        },

        skillEffects: {
          peopleManagement: 10,
          riskManagement: 5,
        },

        outcome: {
          headline:
            "The organisation became less dependent on exhausted individuals.",

          explanation:
            "The company increased cost but strengthened capacity and morale.",

          lesson:
            "People investment is often a capacity decision, not simply an HR expense.",
        },
      },

      {
        id:
          "branch-people-incentive",

        title:
          "Introduce performance incentives",

        description:
          "Use targeted bonuses rather than adding permanent headcount immediately.",

        immediateEffects: {
          cash: -25000,
          employeeMorale: 8,
          expenses: 4000,
          risk: -3,
        },

        skillEffects: {
          peopleManagement: 7,
          financialPlanning: 4,
        },

        outcome: {
          headline:
            "The team received short-term recognition.",

          explanation:
            "Morale improved, although the underlying workload challenge still requires monitoring.",

          lesson:
            "Incentives can improve motivation without necessarily solving capacity constraints.",
        },
      },

      {
        id:
          "branch-people-push",

        title:
          "Push through the pressure",

        description:
          "Ask the existing team to maintain current performance until revenue becomes more predictable.",

        immediateEffects: {
          cash: 10000,
          employeeMorale: -12,
          risk: 10,
        },

        skillEffects: {
          cashFlow: 3,
          peopleManagement: -5,
        },

        outcome: {
          headline:
            "Cash was protected, but people risk increased sharply.",

          explanation:
            "The company avoided new cost while placing more pressure on existing employees.",

          lesson:
            "Short-term cost protection can create expensive retention and capability problems later.",
        },
      },
    ],
  },


  "customer-opportunity": {
    id:
      "branch-customer-opportunity",

    day: 6,

    month:
      "June",

    theme:
      "Enterprise Growth",

    title:
      "Enterprise Client Opportunity",

    context: {
      title:
        "Strong customer trust has opened a major commercial door.",

      text:
        "Naledi has introduced the company to a larger enterprise that could significantly increase monthly revenue. The prospective client expects stronger service guarantees and professional account management.",
    },

    decisions: [
      {
        id:
          "branch-enterprise-accept",

        title:
          "Pursue the enterprise contract",

        description:
          "Invest in delivery capacity and account management to win the client.",

        immediateEffects: {
          cash: -65000,
          revenue: 85000,
          expenses: 28000,
          customers: 1,
          employees: 1,
          risk: 7,
        },

        skillEffects: {
          customerManagement: 8,
          growthStrategy: 8,
        },

        outcome: {
          headline:
            "The company entered a larger customer segment.",

          explanation:
            "Revenue potential increased materially, along with service expectations.",

          lesson:
            "Moving upmarket changes both opportunity and the standard at which the company must operate.",
        },
      },

      {
        id:
          "branch-enterprise-partner",

        title:
          "Deliver through a strategic partner",

        description:
          "Share the opportunity with another provider to reduce execution risk.",

        immediateEffects: {
          revenue: 40000,
          expenses: 12000,
          customerSatisfaction: 3,
          risk: -2,
        },

        skillEffects: {
          growthStrategy: 7,
          customerManagement: 5,
          riskManagement: 6,
        },

        outcome: {
          headline:
            "The company accessed enterprise revenue with reduced execution exposure.",

          explanation:
            "The partnership reduced upside but also limited operational pressure.",

          lesson:
            "Partnerships can trade some margin for capability and risk reduction.",
        },
      },

      {
        id:
          "branch-enterprise-decline",

        title:
          "Decline until the company is ready",

        description:
          "Protect existing customers and avoid overextending service capacity.",

        immediateEffects: {
          customerSatisfaction: 2,
          risk: -6,
        },

        skillEffects: {
          riskManagement: 7,
          customerManagement: 3,
        },

        outcome: {
          headline:
            "The company protected service quality.",

          explanation:
            "A major opportunity was declined because capability mattered more than headline revenue.",

          lesson:
            "Strategic discipline sometimes means saying no to attractive revenue.",
        },
      },
    ],
  },


  "investor-governance": {
    id:
      "branch-investor-governance",

    day: 6,

    month:
      "June",

    theme:
      "Governance",

    title:
      "Investor Board Meeting",

    context: {
      title:
        "Zanele wants evidence that the investment is creating enterprise value.",

      text:
        "The investor has called the first formal strategic review. She wants clarity on performance, risk, growth priorities and how management intends to use the remaining capital.",
    },

    decisions: [
      {
        id:
          "branch-investor-growth",

        title:
          "Present an aggressive growth plan",

        description:
          "Commit to faster expansion and larger revenue targets.",

        immediateEffects: {
          cash: -80000,
          revenue: 65000,
          expenses: 25000,
          risk: 10,
        },

        skillEffects: {
          growthStrategy: 8,
          fundingDecisions: 5,
        },

        outcome: {
          headline:
            "The investor backed an ambitious growth agenda.",

          explanation:
            "Growth expectations increased together with execution pressure.",

          lesson:
            "External investment can accelerate ambition and accountability at the same time.",
        },
      },

      {
        id:
          "branch-investor-discipline",

        title:
          "Commit to disciplined profitability",

        description:
          "Prioritise sustainable margins, cash reserves and governance before further expansion.",

        immediateEffects: {
          expenses: -12000,
          cash: 25000,
          risk: -8,
        },

        skillEffects: {
          financialPlanning: 8,
          fundingDecisions: 7,
          riskManagement: 6,
        },

        outcome: {
          headline:
            "The board supported a more disciplined operating plan.",

          explanation:
            "Growth slowed, but financial resilience and governance improved.",

          lesson:
            "Investors do not always want maximum growth; credible capital discipline also creates value.",
        },
      },

      {
        id:
          "branch-investor-buyback",

        title:
          "Begin planning to restore founder ownership",

        description:
          "Use future profits to gradually buy back investor equity.",

        immediateEffects: {
          cash: -35000,
          founderOwnership: 3,
          risk: 2,
        },

        skillEffects: {
          fundingDecisions: 8,
          financialPlanning: 5,
        },

        outcome: {
          headline:
            "The founder started rebuilding ownership.",

          explanation:
            "Control improved slightly, but cash available for operations declined.",

          lesson:
            "Ownership decisions compete with other uses of capital.",
        },
      },
    ],
  },


  "debt-pressure": {
    id:
      "branch-debt-pressure",

    day: 6,

    month:
      "June",

    theme:
      "Debt Management",

    title:
      "Bank Covenant Review",

    context: {
      title:
        "The bank wants stronger evidence that the company can service its debt.",

      text:
        "David has requested updated financial information after leverage increased. The bank is not calling the facility yet, but future flexibility may depend on management's response.",
    },

    decisions: [
      {
        id:
          "branch-debt-repay",

        title:
          "Make an early debt repayment",

        description:
          "Use available cash to reduce leverage and strengthen lender confidence.",

        immediateEffects: {
          cash: -70000,
          debt: -70000,
          liabilities: -70000,
          risk: -8,
        },

        skillEffects: {
          fundingDecisions: 8,
          riskManagement: 7,
        },

        outcome: {
          headline:
            "Leverage fell and lender confidence improved.",

          explanation:
            "The company sacrificed liquidity to reduce debt exposure.",

          lesson:
            "Debt reduction strengthens solvency but can weaken short-term cash reserves.",
        },
      },

      {
        id:
          "branch-debt-restructure",

        title:
          "Negotiate longer repayment terms",

        description:
          "Ask the bank to restructure repayments around expected business cash flow.",

        immediateEffects: {
          expenses: -6000,
          cash: 15000,
          risk: -3,
        },

        skillEffects: {
          fundingDecisions: 8,
          cashFlow: 6,
        },

        outcome: {
          headline:
            "Repayment pressure became more manageable.",

          explanation:
            "The company preserved liquidity by spreading commitments over a longer period.",

          lesson:
            "Debt management is not only about how much is owed, but when cash must leave the business.",
        },
      },

      {
        id:
          "branch-debt-grow",

        title:
          "Grow revenue faster instead",

        description:
          "Keep the debt structure and focus management attention on expanding the income base.",

        immediateEffects: {
          cash: -30000,
          revenue: 45000,
          expenses: 18000,
          risk: 8,
        },

        skillEffects: {
          growthStrategy: 6,
          fundingDecisions: 4,
        },

        outcome: {
          headline:
            "The company chose growth as the path out of leverage pressure.",

          explanation:
            "Revenue potential improved, but the underlying debt remained.",

          lesson:
            "Growing into debt can work, but failure to achieve expected revenue can worsen the problem.",
        },
      },
    ],
  },


  balanced: {
    id:
      "branch-balanced",

    day: 6,

    month:
      "June",

    theme:
      "Strategy",

    title:
      "The Founder’s Strategic Choice",

    context: {
      title:
        "The business is stable enough to choose what it wants to become next.",

      text:
        "There is no immediate crisis. The founder can now decide whether the next chapter should prioritise growth, resilience, people capability or customer value.",
    },

    decisions: [
      {
        id:
          "branch-balanced-growth",

        title:
          "Prioritise growth",

        description:
          "Invest in sales, capacity and market expansion.",

        immediateEffects: {
          cash: -60000,
          revenue: 50000,
          expenses: 21000,
          customers: 3,
          risk: 6,
        },

        skillEffects: {
          growthStrategy: 8,
        },

        outcome: {
          headline:
            "The company entered a more ambitious growth phase.",

          explanation:
            "Commercial upside increased alongside operational pressure.",

          lesson:
            "Strategy is ultimately a choice about where limited resources should go.",
        },
      },

      {
        id:
          "branch-balanced-resilience",

        title:
          "Build resilience",

        description:
          "Strengthen cash reserves, systems and risk controls.",

        immediateEffects: {
          cash: 30000,
          expenses: -8000,
          risk: -10,
        },

        skillEffects: {
          financialPlanning: 8,
          riskManagement: 8,
        },

        outcome: {
          headline:
            "The business became harder to destabilise.",

          explanation:
            "Management prioritised resilience over faster expansion.",

          lesson:
            "Resilience creates options when the environment becomes uncertain.",
        },
      },

      {
        id:
          "branch-balanced-people",

        title:
          "Build leadership capacity",

        description:
          "Invest in managers, employee development and organisational depth.",

        immediateEffects: {
          cash: -40000,
          expenses: 12000,
          employeeMorale: 12,
          risk: -4,
        },

        skillEffects: {
          peopleManagement: 9,
          growthStrategy: 4,
        },

        outcome: {
          headline:
            "The company invested in becoming less founder-dependent.",

          explanation:
            "People cost increased, but organisational depth improved.",

          lesson:
            "Scaling a company often requires scaling leadership before scaling revenue.",
        },
      },
    ],
  },
};


export const getBranchingScenario = (
  state,
  fallbackScenario
) => {
  if (
    state.currentDay !== 6
  ) {
    return fallbackScenario;
  }

  const path =
    getBusinessPath(state);

  return (
    BRANCH_SCENARIOS[
      path.primary.id
    ] ||
    fallbackScenario
  );
};
