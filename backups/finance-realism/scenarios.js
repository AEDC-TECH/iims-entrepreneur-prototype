export const scenarios = [
  // =========================================================
  // DAY 1 — GROWTH
  // =========================================================

  {
    id: "growth-contract",
    day: 1,
    month: "January",
    theme: "Growth Opportunity",

    sender: "Mokoena Retail Group",
    senderType: "CUSTOMER",
    priority: "OPPORTUNITY",

    subject: "Major contract expansion",

    message:
      "We would like Ubuntu Digital Solutions to take over additional support services across our branches. The contract will add R50,000 per month to your revenue, but we need you operational within two weeks.",

    context: {
      title: "Before you decide",

      text:
        "Growth can increase revenue, but additional work may require employees, equipment and working capital before the customer starts paying.",
    },

    decisions: [
      {
        id: "growth-hire",

        title:
          "Accept and hire 2 employees",

        description:
          "Take the full contract immediately and employ two additional people.",

        immediateEffects: {
          revenue: 50000,
          expenses: 36000,
          cash: -15000,
          employees: 2,
          customers: 1,
          risk: 6,
        },

        skillEffects: {
          growthStrategy: 4,
          cashFlow: 1,
          riskManagement: -1,
        },

        outcome: {
          headline:
            "You chose aggressive growth",

          explanation:
            "Revenue increased, but your fixed monthly costs also increased. The company must now carry those salaries every month whether the customer pays on time or not.",

          lesson:
            "Growth must be financed. Revenue growth does not automatically mean healthy cash flow.",
        },

        delayedConsequences: [
          {
            dueDay: 2,

            title:
              "Growth required more cash than expected",

            description:
              "Onboarding, equipment and service-delivery costs created additional cash pressure.",

            effects: {
              cash: -25000,
              risk: 5,
            },
          },
        ],
      },

      {
        id: "growth-deposit",

        title:
          "Negotiate a 30% upfront deposit",

        description:
          "Accept the contract but require cash before increasing capacity.",

        immediateEffects: {
          revenue: 50000,
          cash: 30000,
          expenses: 24000,
          employees: 1,
          customers: 1,
          customerSatisfaction: -1,
          risk: -3,
        },

        skillEffects: {
          cashFlow: 7,
          financialPlanning: 5,
          growthStrategy: 5,
          riskManagement: 5,
        },

        outcome: {
          headline:
            "You protected working capital",

          explanation:
            "The deposit gives the company cash before major delivery costs are incurred.",

          lesson:
            "Deposits and milestone payments can reduce the amount of company cash required to finance customer work.",
        },

        delayedConsequences: [],
      },

      {
        id: "growth-contractors",

        title:
          "Use contractors first",

        description:
          "Accept the opportunity while keeping staffing more flexible.",

        immediateEffects: {
          revenue: 50000,
          expenses: 32000,
          cash: -8000,
          customers: 1,
          risk: 2,
        },

        skillEffects: {
          growthStrategy: 5,
          financialPlanning: 3,
          riskManagement: 3,
        },

        outcome: {
          headline:
            "You chose flexible capacity",

          explanation:
            "Contractors cost money, but the company avoids immediately increasing permanent salary commitments.",

          lesson:
            "Flexible capacity can reduce fixed-cost risk while demand is still uncertain.",
        },

        delayedConsequences: [],
      },

      {
        id: "growth-decline",

        title:
          "Decline the contract",

        description:
          "Protect the current business and avoid the additional commitment.",

        immediateEffects: {
          customerSatisfaction: -4,
          risk: -6,
        },

        skillEffects: {
          riskManagement: 3,
          growthStrategy: -2,
        },

        outcome: {
          headline:
            "You protected the current business",

          explanation:
            "The company avoided additional pressure, but it also gave up a meaningful growth opportunity.",

          lesson:
            "Avoiding risk can protect the company, but excessive caution can limit growth.",
        },

        delayedConsequences: [],
      },
    ],
  },

  // =========================================================
  // DAY 2 — CASH FLOW
  // =========================================================

  {
    id: "cashflow-delay",
    day: 2,
    month: "February",
    theme: "Cash-Flow Pressure",

    sender: "Thabo - Mokoena Retail",
    senderType: "CUSTOMER",
    priority: "URGENT",

    subject:
      "Payment delayed by 30–45 days",

    message:
      "Unfortunately our finance department will not be able to settle the outstanding R80,000 invoice this month. We expect payment within the next 30 to 45 days.",

    context: {
      title: "Your obligations",

      text:
        "Payroll, rent and suppliers still need to be paid even when customers delay payment. Profit and cash are not the same thing.",
    },

    decisions: [
      {
        id: "cash-request-half",

        title:
          "Request 50% immediately",

        description:
          "Negotiate R40,000 now and allow the balance to be paid later.",

        immediateEffects: {
          cash: 40000,
          receivables: -40000,
          customerSatisfaction: -1,
          risk: -4,
        },

        skillEffects: {
          cashFlow: 7,
          financialPlanning: 5,
          customerManagement: 4,
          riskManagement: 4,
        },

        outcome: {
          headline:
            "You improved immediate liquidity",

          explanation:
            "The company recovered part of its invoice while preserving the relationship.",

          lesson:
            "Partial-payment arrangements can balance cash protection and customer relationships.",
        },

        delayedConsequences: [],
      },

      {
        id: "cash-accept-delay",

        title:
          "Accept the delay",

        description:
          "Keep the customer happy and wait for the full payment.",

        immediateEffects: {
          customerSatisfaction: 4,
          risk: 7,
        },

        skillEffects: {
          customerManagement: 3,
          cashFlow: -4,
          riskManagement: -3,
        },

        outcome: {
          headline:
            "Customer goodwill improved, but cash risk increased",

          explanation:
            "The customer appreciates the flexibility, but your expenses still need to be paid.",

          lesson:
            "Businesses need to protect both customer relationships and their own liquidity.",
        },

        delayedConsequences: [
          {
            dueDay: 3,

            title:
              "The invoice is still outstanding",

            description:
              "Expenses continued while the customer payment remained unpaid.",

            effects: {
              cash: -30000,
              risk: 8,
            },
          },
        ],
      },

      {
        id: "cash-short-term-loan",

        title:
          "Use short-term finance",

        description:
          "Borrow R80,000 while waiting for the customer payment.",

        immediateEffects: {
          cash: 80000,
          debt: 80000,
          liabilities: 80000,
          expenses: 8750,
          risk: 5,
        },

        skillEffects: {
          fundingDecisions: 3,
          cashFlow: 2,
          financialPlanning: -1,
        },

        outcome: {
          headline:
            "You solved today's problem with debt",

          explanation:
            "Liquidity improved, but the business now carries additional repayments and interest.",

          lesson:
            "Debt can solve timing problems, but future cash flow must support the repayments.",
        },

        delayedConsequences: [
          {
            dueDay: 3,

            title:
              "Loan repayment becomes due",

            description:
              "The working-capital loan requires its first repayment.",

            effects: {
              cash: -8750,
            },
          },
        ],
      },

      {
        id: "cash-suspend",

        title:
          "Suspend service until payment",

        description:
          "Stop further exposure until the customer settles the invoice.",

        immediateEffects: {
          customerSatisfaction: -12,
          risk: -3,
        },

        skillEffects: {
          cashFlow: 4,
          riskManagement: 2,
          customerManagement: -3,
        },

        outcome: {
          headline:
            "You protected cash but strained the relationship",

          explanation:
            "The company stops providing unpaid work, but a valuable customer relationship may suffer.",

          lesson:
            "Credit-control decisions involve both financial protection and commercial consequences.",
        },

        delayedConsequences: [],
      },
    ],
  },

  // =========================================================
  // DAY 3 — PEOPLE MANAGEMENT
  // =========================================================

  {
    id: "employee-retention",
    day: 3,
    month: "March",
    theme: "People Management",

    sender: "Lerato - Operations Manager",
    senderType: "EMPLOYEE",
    priority: "IMPORTANT",

    subject:
      "Request for salary review",

    message:
      "I have received interest from another company. I enjoy working here, but I would like to discuss my salary and future growth. I need to make a decision soon.",

    context: {
      title:
        "People are also business assets",

      text:
        "Losing an experienced employee can reduce productivity and create recruitment costs. Increasing salary, however, creates a recurring expense.",
    },

    decisions: [
      {
        id: "people-raise",

        title:
          "Give a 10% salary increase",

        description:
          "Increase the salary immediately to improve retention.",

        immediateEffects: {
          expenses: 3500,
          employeeMorale: 9,
          risk: -4,
        },

        skillEffects: {
          peopleManagement: 5,
          financialPlanning: 1,
        },

        outcome: {
          headline:
            "You prioritised retention",

          explanation:
            "Morale improves and the risk of losing operational knowledge falls, but the salary increase becomes a recurring cost.",

          lesson:
            "Employee-retention decisions must balance capability and long-term affordability.",
        },

        delayedConsequences: [],
      },

      {
        id: "people-performance-bonus",

        title:
          "Offer a performance-linked bonus",

        description:
          "Keep base salary stable but reward measurable performance.",

        immediateEffects: {
          expenses: 1500,
          employeeMorale: 6,
          risk: -3,
        },

        skillEffects: {
          peopleManagement: 7,
          financialPlanning: 4,
          riskManagement: 3,
        },

        outcome: {
          headline:
            "You linked reward to performance",

          explanation:
            "The employee receives a growth opportunity while the company avoids immediately increasing all fixed salary costs.",

          lesson:
            "Well-designed incentives can align employee reward with business performance.",
        },

        delayedConsequences: [],
      },

      {
        id: "people-development",

        title:
          "Offer development and review salary later",

        description:
          "Provide leadership development and conduct a salary review in three months.",

        immediateEffects: {
          cash: -5000,
          employeeMorale: 4,
          risk: 1,
        },

        skillEffects: {
          peopleManagement: 5,
          financialPlanning: 3,
        },

        outcome: {
          headline:
            "You invested in development",

          explanation:
            "Professional development may strengthen loyalty, although it may not fully address compensation concerns.",

          lesson:
            "Career growth can improve retention, but it does not always replace competitive compensation.",
        },

        delayedConsequences: [],
      },

      {
        id: "people-let-go",

        title:
          "Let the employee leave",

        description:
          "Avoid the increase and recruit a replacement later.",

        immediateEffects: {
          employees: -1,
          employeeMorale: -10,
          cash: -12000,
          risk: 10,
        },

        skillEffects: {
          peopleManagement: -6,
          riskManagement: -2,
        },

        outcome: {
          headline:
            "You protected salary costs but lost capability",

          explanation:
            "The company now faces recruitment costs, productivity loss and lower team morale.",

          lesson:
            "Replacing experienced employees can cost significantly more than their salary alone.",
        },

        delayedConsequences: [],
      },
    ],
  },

  // =========================================================
  // DAY 4 — PRICING
  // =========================================================

  {
    id: "supplier-price-increase",
    day: 4,
    month: "April",
    theme: "Pricing & Supplier Pressure",

    sender: "TechSource Suppliers",
    senderType: "SUPPLIER",
    priority: "URGENT",

    subject:
      "Supplier prices increasing by 12%",

    message:
      "Due to higher import and logistics costs, our service and equipment pricing will increase by 12% from next month.",

    context: {
      title:
        "Your margins are under pressure",

      text:
        "If your input costs rise while your selling prices remain unchanged, your profit margin decreases. But increasing customer prices can also affect demand and customer satisfaction.",
    },

    decisions: [
      {
        id: "pricing-absorb",

        title:
          "Absorb the full increase",

        description:
          "Keep customer prices unchanged and carry the supplier increase yourself.",

        immediateEffects: {
          expenses: 17000,
          customerSatisfaction: 3,
          risk: 6,
        },

        skillEffects: {
          pricing: -5,
          financialPlanning: -3,
          customerManagement: 3,
        },

        outcome: {
          headline:
            "Customers are protected, but your margins shrink",

          explanation:
            "Customers experience no price increase, but the company now carries significantly higher monthly costs.",

          lesson:
            "Protecting customers from price increases can strengthen relationships, but continuously absorbing cost increases can destroy profitability.",
        },

        delayedConsequences: [
          {
            dueDay: 5,

            title:
              "Margin pressure is becoming visible",

            description:
              "The supplier increase is now affecting operating profitability.",

            effects: {
              risk: 5,
            },
          },
        ],
      },

      {
        id: "pricing-raise",

        title:
          "Increase customer prices by 8%",

        description:
          "Pass most of the cost increase to customers.",

        immediateEffects: {
          revenue: 14000,
          expenses: 17000,
          customerSatisfaction: -6,
          risk: 1,
        },

        skillEffects: {
          pricing: 6,
          financialPlanning: 4,
          customerManagement: -1,
        },

        outcome: {
          headline:
            "You protected more of your margin",

          explanation:
            "The price increase helps offset supplier costs, but some customers may question the higher charges.",

          lesson:
            "Pricing decisions must consider cost, margin, customer value and willingness to pay.",
        },

        delayedConsequences: [
          {
            dueDay: 6,

            title:
              "Some customers are questioning the new pricing",

            description:
              "The company protected margin, but customer sensitivity to price has increased.",

            effects: {
              customerSatisfaction: -3,
            },
          },
        ],
      },

      {
        id: "pricing-negotiate",

        title:
          "Negotiate a volume discount",

        description:
          "Commit to higher purchase volumes in exchange for a smaller supplier increase.",

        immediateEffects: {
          cash: -20000,
          expenses: 7000,
          risk: 2,
        },

        skillEffects: {
          pricing: 7,
          financialPlanning: 4,
          riskManagement: 3,
        },

        outcome: {
          headline:
            "You reduced the cost increase through negotiation",

          explanation:
            "The supplier agreed to better pricing, but the company had to commit more cash to purchasing volume.",

          lesson:
            "Supplier negotiations can protect margins, but bulk commitments can increase working-capital requirements.",
        },

        delayedConsequences: [],
      },

      {
        id: "pricing-switch",

        title:
          "Switch to a cheaper supplier",

        description:
          "Move to an alternative supplier offering lower prices.",

        immediateEffects: {
          expenses: -5000,
          cash: -10000,
          risk: 9,
        },

        skillEffects: {
          pricing: 4,
          riskManagement: -3,
        },

        outcome: {
          headline:
            "You reduced cost but introduced supplier risk",

          explanation:
            "The alternative supplier is cheaper, but the company has not yet established its reliability or service quality.",

          lesson:
            "The cheapest supplier is not always the lowest-risk supplier.",
        },

        delayedConsequences: [
          {
            dueDay: 6,

            title:
              "New supplier delivery is running late",

            description:
              "Lower prices came with weaker delivery reliability.",

            effects: {
              risk: 8,
              customerSatisfaction: -4,
            },
          },
        ],
      },
    ],
  },

  // =========================================================
  // DAY 5 — FUNDING & OWNERSHIP
  // =========================================================

  {
    id: "funding-expansion",
    day: 5,
    month: "May",
    theme: "Funding & Ownership",

    sender: "Naledi - Finance Advisor",
    senderType: "ADVISOR",
    priority: "OPPORTUNITY",

    subject:
      "R300,000 automation investment opportunity",

    message:
      "The business could invest R300,000 in automation and upgraded equipment. The investment may improve delivery capacity and reduce future operating pressure.",

    context: {
      title:
        "How will you finance the investment?",

      text:
        "The same investment can be financed through debt, equity, internal cash or gradual implementation. Each funding method has different consequences for cash flow, risk and ownership.",
    },

    decisions: [
      {
        id: "fund-bank",

        title:
          "Take a R300,000 bank loan",

        description:
          "Keep 100% ownership and finance the investment with debt.",

        immediateEffects: {
          cash: 300000,
          debt: 300000,
          liabilities: 300000,
          assets: 300000,
          expenses: 18000,
          risk: 8,
        },

        skillEffects: {
          fundingDecisions: 4,
          financialPlanning: 2,
          riskManagement: -2,
        },

        outcome: {
          headline:
            "You preserved ownership but increased debt",

          explanation:
            "The company receives the full investment capital and the founder keeps ownership, but monthly repayments and financial leverage increase.",

          lesson:
            "Debt preserves equity, but the business must generate enough cash to service repayments.",
        },

        delayedConsequences: [
          {
            dueDay: 6,

            title:
              "New expansion loan repayment is due",

            description:
              "The automation investment now requires regular debt servicing.",

            effects: {
              cash: -18000,
            },
          },
        ],
      },

      {
        id: "fund-equity",

        title:
          "Accept R300,000 for 15% equity",

        description:
          "Bring in an investor and give up 15% ownership instead of creating new debt.",

        immediateEffects: {
          cash: 300000,
          assets: 300000,
          founderOwnership: -15,
          risk: -2,
        },

        skillEffects: {
          fundingDecisions: 7,
          financialPlanning: 5,
          riskManagement: 3,
        },

        outcome: {
          headline:
            "You gained capital without loan repayments",

          explanation:
            "The company has new cash without additional debt, but your founder ownership falls from 100% to 85%. The investor now shares in future value and may expect influence over major decisions.",

          lesson:
            "Equity funding does not require repayment like a loan, but ownership and future upside are shared.",
        },

        delayedConsequences: [
          {
            dueDay: 6,

            title:
              "Investor requests a strategic review",

            description:
              "The new shareholder wants visibility into growth plans and financial performance.",

            effects: {
              risk: 1,
            },
          },
        ],
      },

      {
        id: "fund-self",

        title:
          "Fund the investment from company cash",

        description:
          "Avoid debt and ownership dilution by using internal cash.",

        immediateEffects: {
          cash: -300000,
          assets: 300000,
          risk: 10,
        },

        skillEffects: {
          fundingDecisions: 2,
          financialPlanning: -4,
          cashFlow: -6,
        },

        outcome: {
          headline:
            "You avoided debt but drained liquidity",

          explanation:
            "Ownership remains unchanged and there are no loan repayments, but the business has committed a large amount of its available cash.",

          lesson:
            "Using your own cash avoids financing costs, but a business still needs enough liquidity to survive normal operations.",
        },

        delayedConsequences: [],
      },

      {
        id: "fund-phase",

        title:
          "Implement the investment in phases",

        description:
          "Spend R100,000 now and delay the rest until the company has more financial capacity.",

        immediateEffects: {
          cash: -100000,
          assets: 100000,
          risk: -3,
        },

        skillEffects: {
          fundingDecisions: 6,
          financialPlanning: 6,
          riskManagement: 5,
        },

        outcome: {
          headline:
            "You chose controlled expansion",

          explanation:
            "The company begins improving capacity without committing the entire R300,000 immediately.",

          lesson:
            "Phased investment can protect liquidity, although benefits may arrive more slowly.",
        },

        delayedConsequences: [],
      },
    ],
  },

  // =========================================================
  // DAY 6 — COMPETITION
  // =========================================================

  {
    id: "competition-price-war",
    day: 6,
    month: "June",
    theme: "Competition & Strategy",

    sender: "Sales Team",
    senderType: "SALES",
    priority: "URGENT",

    subject:
      "Competitor has reduced prices by 15%",

    message:
      "A major competitor has launched a campaign offering similar services at prices approximately 15% below ours. Two customers have already asked whether we will match the offer.",

    context: {
      title:
        "Competing only on price can be dangerous",

      text:
        "Lower prices may protect customers in the short term, but price wars can destroy margins. Businesses can also compete through quality, service, specialisation, innovation and customer relationships.",
    },

    decisions: [
      {
        id: "competition-match",

        title:
          "Match the competitor's prices",

        description:
          "Reduce prices aggressively to defend customers.",

        immediateEffects: {
          revenue: -30000,
          customerSatisfaction: 6,
          risk: 7,
        },

        skillEffects: {
          pricing: -3,
          customerManagement: 3,
          growthStrategy: -1,
        },

        outcome: {
          headline:
            "You protected customers but damaged margin",

          explanation:
            "Customers appreciate the lower prices, but the business now earns less revenue while many operating costs remain unchanged.",

          lesson:
            "Competing only on price can protect market share while weakening profitability.",
        },

        delayedConsequences: [],
      },

      {
        id: "competition-value",

        title:
          "Keep prices and improve customer value",

        description:
          "Invest in service quality, support and customer experience instead of cutting prices.",

        immediateEffects: {
          cash: -25000,
          expenses: 8000,
          customerSatisfaction: 8,
          risk: -2,
        },

        skillEffects: {
          customerManagement: 7,
          growthStrategy: 6,
          pricing: 5,
        },

        outcome: {
          headline:
            "You chose differentiation over a price war",

          explanation:
            "The company invests in stronger service and customer experience instead of trying to become the cheapest provider.",

          lesson:
            "Businesses can compete on value, trust, specialisation and service rather than price alone.",
        },

        delayedConsequences: [],
      },

      {
        id: "competition-niche",

        title:
          "Focus on a specialised market niche",

        description:
          "Target customers who need higher-value specialised services.",

        immediateEffects: {
          revenue: 15000,
          cash: -15000,
          customers: -2,
          risk: 1,
        },

        skillEffects: {
          growthStrategy: 8,
          pricing: 6,
          riskManagement: 3,
        },

        outcome: {
          headline:
            "You chose strategic specialisation",

          explanation:
            "The business may serve fewer customers, but those customers value specialised capability and may be less price-sensitive.",

          lesson:
            "A clear market position can reduce the need to compete purely on price.",
        },

        delayedConsequences: [],
      },

      {
        id: "competition-ignore",

        title:
          "Make no changes",

        description:
          "Assume existing customers will remain loyal.",

        immediateEffects: {
          customers: -3,
          revenue: -25000,
          customerSatisfaction: -8,
          risk: 7,
        },

        skillEffects: {
          customerManagement: -4,
          growthStrategy: -4,
          riskManagement: -3,
        },

        outcome: {
          headline:
            "The market moved while the company stood still",

          explanation:
            "Some customers remained loyal, but others moved to competitors because the company did not respond to changing market conditions.",

          lesson:
            "Ignoring competition is also a strategic decision — and it can have consequences.",
        },

        delayedConsequences: [],
      },
    ],
  },
];
