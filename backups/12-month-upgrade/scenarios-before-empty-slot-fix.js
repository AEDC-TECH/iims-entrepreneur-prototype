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
          "Apply for bank finance",

        description:
          "Ask the bank to finance the R300,000 investment. Approval, interest rate and repayment terms will depend on the company's financial position and IIMS Business Credit Profile.",

        immediateEffects: {},

        skillEffects: {
          fundingDecisions: 4,
          financialPlanning: 4,
          riskManagement: 2,
        },

        outcome: {
          headline:
            "You assessed debt before committing to it",

          explanation:
            "The bank evaluates affordability, business creditworthiness, existing debt and the requested loan term before making an offer.",

          lesson:
            "A loan should be judged by repayment capacity, interest cost and business return — not only by the cash received.",
        },

        delayedConsequences: [],
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
  },,

  // =========================================================
  // MONTH 7 — GROWTH PRESSURE
  // =========================================================

  {
    id: "growth-capacity-pressure",
    day: 7,
    month: "July",
    theme: "Growth Pressure",

    sender: "Operations Team",
    senderType: "OPERATIONS",
    priority: "URGENT",

    subject:
      "Growth is beginning to stretch delivery capacity",

    message:
      "Sales activity has increased, but the existing team is struggling to maintain the same level of service. Delays and overtime are becoming more common.",

    context: {
      title:
        "Growth can create pressure before it creates stability",

      text:
        "The company now needs to decide whether to increase capacity, improve efficiency or slow growth before service quality begins to suffer.",
    },

    decisions: [
      {
        id: "growth-pressure-hire",

        title:
          "Hire two additional employees",

        description:
          "Increase permanent capacity so the company can support the higher workload.",

        immediateEffects: {
          cash: -30000,
          expenses: 22000,
          employees: 2,
          customerSatisfaction: 4,
          risk: -2,
        },

        skillEffects: {
          peopleManagement: 7,
          growthStrategy: 6,
          financialPlanning: 3,
        },

        outcome: {
          headline:
            "You invested in capacity",

          explanation:
            "The business can handle more work, but payroll commitments increase immediately.",

          lesson:
            "Hiring can support growth, but permanent costs should be matched by sustainable revenue.",
        },

        delayedConsequences: [
          {
            dueDay: 9,

            title:
              "New employees require management attention",

            description:
              "The larger team creates additional supervision and training requirements.",

            effects: {
              expenses: 5000,
              risk: 1,
            },
          },
        ],
      },

      {
        id: "growth-pressure-automate",

        title:
          "Automate part of the workflow",

        description:
          "Invest in systems and process improvements instead of immediately increasing headcount.",

        immediateEffects: {
          cash: -50000,
          assets: 50000,
          expenses: -5000,
          risk: -3,
        },

        skillEffects: {
          growthStrategy: 7,
          financialPlanning: 6,
          riskManagement: 5,
        },

        outcome: {
          headline:
            "You improved operating efficiency",

          explanation:
            "The company spent cash now to reduce pressure and operating inefficiency later.",

          lesson:
            "Technology investment can increase capacity without creating the same long-term payroll burden.",
        },

        delayedConsequences: [],
      },

      {
        id: "growth-pressure-slow",

        title:
          "Slow new sales temporarily",

        description:
          "Protect service quality while the existing operation catches up.",

        immediateEffects: {
          revenue: -15000,
          customerSatisfaction: 5,
          risk: -6,
        },

        skillEffects: {
          riskManagement: 8,
          customerManagement: 5,
          growthStrategy: 3,
        },

        outcome: {
          headline:
            "You protected the quality of existing operations",

          explanation:
            "Growth slowed, but customers experienced fewer service failures.",

          lesson:
            "Sometimes controlling growth protects long-term business value.",
        },

        delayedConsequences: [],
      },

      {
        id: "growth-pressure-push",

        title:
          "Keep pushing for maximum sales",

        description:
          "Continue selling aggressively and expect the current team to cope.",

        immediateEffects: {
          revenue: 40000,
          cash: 15000,
          employeeMorale: -6,
          customerSatisfaction: -6,
          risk: 10,
        },

        skillEffects: {
          growthStrategy: -3,
          peopleManagement: -5,
          riskManagement: -4,
        },

        outcome: {
          headline:
            "Revenue increased, but operational pressure worsened",

          explanation:
            "The company gained more business without solving the capacity problem.",

          lesson:
            "Growth without capacity can damage employees and customers at the same time.",
        },

        delayedConsequences: [
          {
            dueDay: 9,

            title:
              "Service complaints are increasing",

            description:
              "Operational pressure has started affecting customer experience.",

            effects: {
              customers: -1,
              customerSatisfaction: -5,
              risk: 5,
            },
          },
        ],
      },
    ],
  },


  // =========================================================
  // MONTH 8 — CUSTOMER & MARKET PRESSURE
  // =========================================================

  {
    id: "customer-contract-pressure",
    day: 8,
    month: "August",
    theme: "Customer & Market Pressure",

    sender: "Key Account Manager",
    senderType: "SALES",
    priority: "IMPORTANT",

    subject:
      "Major customer is reviewing its contract",

    message:
      "One of the company's largest customers has requested a contract review after receiving a cheaper offer from a competitor.",

    context: {
      title:
        "Not every customer should be retained at any cost",

      text:
        "The customer contributes meaningful revenue, but heavy discounting could reduce profitability. Management must decide whether to compete on price, service, commitment or customer quality.",
    },

    decisions: [
      {
        id: "customer-retain-discount",

        title:
          "Offer a significant discount",

        description:
          "Reduce the customer's price to protect the contract.",

        immediateEffects: {
          revenue: -20000,
          customerSatisfaction: 7,
          risk: 3,
        },

        skillEffects: {
          customerManagement: 4,
          pricing: -4,
          financialPlanning: -2,
        },

        outcome: {
          headline:
            "The customer stayed, but the contract became less profitable",

          explanation:
            "Revenue was protected, but the business accepted weaker margins.",

          lesson:
            "Retaining a customer is only valuable if the relationship remains economically sustainable.",
        },

        delayedConsequences: [],
      },

      {
        id: "customer-retain-value",

        title:
          "Improve value without cutting price",

        description:
          "Offer better service standards, reporting and account management instead of a discount.",

        immediateEffects: {
          cash: -18000,
          expenses: 6000,
          customerSatisfaction: 8,
          risk: -3,
        },

        skillEffects: {
          customerManagement: 8,
          pricing: 6,
          growthStrategy: 5,
        },

        outcome: {
          headline:
            "You defended the relationship through value",

          explanation:
            "The business strengthened the customer experience without starting another price war.",

          lesson:
            "Strong customer relationships can reduce price sensitivity.",
        },

        delayedConsequences: [],
      },

      {
        id: "customer-long-contract",

        title:
          "Negotiate a longer-term contract",

        description:
          "Offer moderate concessions in exchange for greater contract certainty.",

        immediateEffects: {
          revenue: -5000,
          cash: 20000,
          customerSatisfaction: 5,
          risk: -5,
        },

        skillEffects: {
          customerManagement: 7,
          financialPlanning: 6,
          pricing: 4,
        },

        outcome: {
          headline:
            "You traded some margin for greater certainty",

          explanation:
            "The customer committed for longer, improving revenue visibility.",

          lesson:
            "Commercial negotiations can trade price for stability, volume or commitment.",
        },

        delayedConsequences: [],
      },

      {
        id: "customer-let-go",

        title:
          "Let the customer leave",

        description:
          "Refuse an unprofitable contract and focus on stronger customers.",

        immediateEffects: {
          customers: -1,
          revenue: -35000,
          expenses: -12000,
          risk: -2,
        },

        skillEffects: {
          financialPlanning: 7,
          pricing: 7,
          riskManagement: 5,
        },

        outcome: {
          headline:
            "You chose profitability over revenue volume",

          explanation:
            "The company lost a customer but avoided operating an unattractive contract.",

          lesson:
            "Revenue growth is not useful when the underlying customer relationship destroys value.",
        },

        delayedConsequences: [],
      },
    ],
  },


  // =========================================================
  // MONTH 9 — OPERATIONAL CRISIS
  // =========================================================

  {
    id: "operational-disruption",
    day: 9,
    month: "September",
    theme: "Operational Crisis",

    sender: "Operations Manager",
    senderType: "OPERATIONS",
    priority: "CRITICAL",

    subject:
      "Critical equipment failure is disrupting operations",

    message:
      "A major piece of equipment has failed unexpectedly. Delivery capacity is reduced and customer commitments are at risk.",

    context: {
      title:
        "Businesses are tested when something goes wrong",

      text:
        "Management must decide how much cash to commit, how quickly to restore operations and how much risk the business can carry.",
    },

    decisions: [
      {
        id: "crisis-replace",

        title:
          "Replace the equipment immediately",

        description:
          "Spend heavily now to restore full operating capacity.",

        immediateEffects: {
          cash: -90000,
          assets: 90000,
          customerSatisfaction: 5,
          risk: -7,
        },

        skillEffects: {
          riskManagement: 8,
          financialPlanning: 5,
          customerManagement: 4,
        },

        outcome: {
          headline:
            "Operations recovered quickly",

          explanation:
            "The company protected customers but used a significant amount of cash.",

          lesson:
            "Operational resilience often requires financial capacity before a crisis occurs.",
        },

        delayedConsequences: [],
      },

      {
        id: "crisis-repair",

        title:
          "Repair the equipment",

        description:
          "Choose the cheaper repair option even though some downtime will continue.",

        immediateEffects: {
          cash: -35000,
          customerSatisfaction: -2,
          risk: 1,
        },

        skillEffects: {
          financialPlanning: 6,
          riskManagement: 5,
        },

        outcome: {
          headline:
            "You balanced cash preservation with recovery",

          explanation:
            "The business accepted some disruption to avoid a much larger cash outflow.",

          lesson:
            "The cheapest immediate decision is not always wrong if the remaining risk is understood.",
        },

        delayedConsequences: [
          {
            dueDay: 11,

            title:
              "Repaired equipment requires additional maintenance",

            description:
              "The earlier repair reduced the immediate cost but created another maintenance expense.",

            effects: {
              cash: -12000,
              expenses: 12000,
            },
          },
        ],
      },

      {
        id: "crisis-outsource",

        title:
          "Outsource work temporarily",

        description:
          "Use an external provider while the company resolves the equipment problem.",

        immediateEffects: {
          expenses: 28000,
          customerSatisfaction: 3,
          risk: -3,
        },

        skillEffects: {
          riskManagement: 7,
          customerManagement: 5,
          financialPlanning: 4,
        },

        outcome: {
          headline:
            "Customer delivery continued through temporary support",

          explanation:
            "Margins weakened temporarily, but customer commitments were protected.",

          lesson:
            "Outsourcing can transfer operational risk, although it usually comes at a cost.",
        },

        delayedConsequences: [],
      },

      {
        id: "crisis-delay",

        title:
          "Delay action and conserve cash",

        description:
          "Keep operating at reduced capacity and avoid immediate spending.",

        immediateEffects: {
          cash: 0,
          revenue: -30000,
          customerSatisfaction: -10,
          risk: 12,
        },

        skillEffects: {
          riskManagement: -6,
          customerManagement: -5,
          financialPlanning: 1,
        },

        outcome: {
          headline:
            "Cash was protected, but the operational problem became a customer problem",

          explanation:
            "The business avoided spending money immediately, but service disruption continued.",

          lesson:
            "Preserving cash can become expensive when unresolved problems damage revenue and trust.",
        },

        delayedConsequences: [
          {
            dueDay: 10,

            title:
              "Customer cancellation follows unresolved disruption",

            description:
              "A customer leaves after repeated service failures.",

            effects: {
              customers: -1,
              revenue: -25000,
              risk: 5,
            },
          },
        ],
      },
    ],
  },


  // =========================================================
  // MONTH 10 — EXPANSION DECISION
  // =========================================================

  {
    id: "expansion-opportunity",
    day: 10,
    month: "October",
    theme: "Expansion Decision",

    sender: "Business Development Team",
    senderType: "SALES",
    priority: "OPPORTUNITY",

    subject:
      "Opportunity to enter a new market",

    message:
      "A new market opportunity could increase annual revenue significantly, but expansion will require additional cash, management attention and operating capacity.",

    context: {
      title:
        "Being offered growth does not mean the business is ready for it",

      text:
        "Management must consider cash reserves, debt, profitability, team capacity and existing customer commitments before expanding.",
    },

    decisions: [
      {
        id: "expansion-full",

        title:
          "Expand immediately",

        description:
          "Commit significant capital and enter the new market aggressively.",

        immediateEffects: {
          cash: -120000,
          assets: 70000,
          revenue: 70000,
          expenses: 30000,
          customers: 4,
          employees: 2,
          risk: 9,
        },

        skillEffects: {
          growthStrategy: 7,
          financialPlanning: 2,
          riskManagement: 1,
        },

        outcome: {
          headline:
            "You chose aggressive expansion",

          explanation:
            "The company gained new growth potential while taking on substantial financial and operational pressure.",

          lesson:
            "Expansion can create value, but only when the existing business can support the additional commitments.",
        },

        delayedConsequences: [
          {
            dueDay: 11,

            title:
              "Expansion creates additional working-capital requirements",

            description:
              "The larger operation needs more cash for salaries, suppliers and customer delivery.",

            effects: {
              cash: -25000,
              expenses: 10000,
              risk: 4,
            },
          },
        ],
      },

      {
        id: "expansion-pilot",

        title:
          "Run a smaller pilot first",

        description:
          "Test the new market before committing to full expansion.",

        immediateEffects: {
          cash: -45000,
          revenue: 25000,
          customers: 2,
          risk: -1,
        },

        skillEffects: {
          growthStrategy: 8,
          riskManagement: 8,
          financialPlanning: 6,
        },

        outcome: {
          headline:
            "You tested the opportunity before scaling",

          explanation:
            "The company gained market information while limiting its financial exposure.",

          lesson:
            "Pilots allow businesses to learn before making irreversible commitments.",
        },

        delayedConsequences: [],
      },

      {
        id: "expansion-partner",

        title:
          "Enter through a partner",

        description:
          "Share revenue with another business to reduce the cost and risk of expansion.",

        immediateEffects: {
          revenue: 30000,
          expenses: 9000,
          customers: 2,
          risk: -4,
        },

        skillEffects: {
          growthStrategy: 7,
          riskManagement: 6,
          customerManagement: 4,
        },

        outcome: {
          headline:
            "You expanded with less capital exposure",

          explanation:
            "The partnership reduced both potential profit and execution risk.",

          lesson:
            "Partnerships can make opportunities possible when internal capacity is limited.",
        },

        delayedConsequences: [],
      },

      {
        id: "expansion-decline",

        title:
          "Decline the expansion for now",

        description:
          "Strengthen the current business before entering another market.",

        immediateEffects: {
          risk: -7,
          customerSatisfaction: 2,
        },

        skillEffects: {
          riskManagement: 8,
          financialPlanning: 5,
          growthStrategy: 3,
        },

        outcome: {
          headline:
            "You prioritised business resilience",

          explanation:
            "The company gave up immediate growth in order to strengthen its existing operation.",

          lesson:
            "Saying no to expansion can be a strategic decision rather than a lack of ambition.",
        },

        delayedConsequences: [],
      },
    ],
  },


  // =========================================================
  // MONTH 11 — FINANCIAL PERFORMANCE
  // =========================================================

  {
    id: "financial-year-review",
    day: 11,
    month: "November",
    theme: "Financial Performance",

    sender: "Naledi - Finance Advisor",
    senderType: "ADVISOR",
    priority: "IMPORTANT",

    subject:
      "Year-end financial position needs attention",

    message:
      "The company is approaching year-end. Management must decide how to use available cash while considering debt, unpaid invoices, operating reserves and future investment.",

    context: {
      title:
        "Strong businesses decide deliberately where cash should go",

      text:
        "Available cash can be used to reduce debt, strengthen reserves, invest in the business or support growth. The best decision depends on the company's financial position.",
    },

    decisions: [
      {
        id: "financial-reduce-debt",

        title:
          "Reduce outstanding debt",

        description:
          "Use part of available cash to lower debt before year-end.",

        immediateEffects: {
          cash: -50000,
          debt: -50000,
          liabilities: -50000,
          risk: -6,
        },

        skillEffects: {
          fundingDecisions: 8,
          financialPlanning: 7,
          riskManagement: 6,
        },

        outcome: {
          headline:
            "You strengthened the balance sheet",

          explanation:
            "Debt fell, although the business now has less cash available for other opportunities.",

          lesson:
            "Debt reduction improves solvency but must be balanced against liquidity needs.",
        },

        delayedConsequences: [],
      },

      {
        id: "financial-build-reserve",

        title:
          "Protect a larger cash reserve",

        description:
          "Keep cash available to protect the business against future uncertainty.",

        immediateEffects: {
          risk: -5,
        },

        skillEffects: {
          cashFlow: 8,
          financialPlanning: 8,
          riskManagement: 7,
        },

        outcome: {
          headline:
            "You strengthened liquidity",

          explanation:
            "The company retained financial flexibility instead of committing cash elsewhere.",

          lesson:
            "Cash reserves give a business time and options when conditions change.",
        },

        delayedConsequences: [],
      },

      {
        id: "financial-collect",

        title:
          "Focus aggressively on collecting unpaid invoices",

        description:
          "Prioritise customer collections before committing more capital.",

        immediateEffects: {
          receivables: -30000,
          cash: 30000,
          risk: -4,
        },

        skillEffects: {
          cashFlow: 8,
          customerManagement: 4,
          financialPlanning: 6,
        },

        outcome: {
          headline:
            "You converted accounting revenue into usable cash",

          explanation:
            "Outstanding invoices fell and the business improved its liquidity.",

          lesson:
            "Revenue only supports operations once customers actually pay.",
        },

        delayedConsequences: [],
      },

      {
        id: "financial-reinvest",

        title:
          "Reinvest in growth",

        description:
          "Use available capital for marketing, systems and future revenue growth.",

        immediateEffects: {
          cash: -60000,
          expenses: 15000,
          revenue: 30000,
          customers: 2,
          risk: 4,
        },

        skillEffects: {
          growthStrategy: 6,
          financialPlanning: 4,
          riskManagement: 2,
        },

        outcome: {
          headline:
            "You chose future growth over immediate financial protection",

          explanation:
            "The company invested cash in expanding future earning potential.",

          lesson:
            "Reinvestment can increase future value, but the business must still preserve enough liquidity.",
        },

        delayedConsequences: [],
      },
    ],
  },


  // =========================================================
  // MONTH 12 — YEAR-END STRATEGY & REVIEW
  // =========================================================

  {
    id: "year-end-strategy",
    day: 12,
    month: "December",
    theme: "Year-End Strategy & Review",

    sender: "IIMS Business Review",
    senderType: "IIMS",
    priority: "IMPORTANT",

    subject:
      "Your first business year is coming to an end",

    message:
      "You have managed the business through twelve simulated months of growth, cash-flow pressure, people decisions, funding, competition and operational challenges.",

    context: {
      title:
        "What should the next year of the business look like?",

      text:
        "The final strategic decision should reflect the financial strength, customer position, team capability and risk profile created by your decisions throughout the year.",
    },

    decisions: [
      {
        id: "year-end-scale",

        title:
          "Prepare for another year of growth",

        description:
          "Set a more ambitious growth strategy for the next business year.",

        immediateEffects: {
          cash: -30000,
          revenue: 25000,
          customers: 2,
          risk: 4,
        },

        skillEffects: {
          growthStrategy: 8,
          financialPlanning: 5,
          riskManagement: 3,
        },

        outcome: {
          headline:
            "You ended the year preparing for growth",

          explanation:
            "The company will enter the next year with a more ambitious commercial strategy.",

          lesson:
            "Growth should be a deliberate strategic choice supported by financial and operational capacity.",
        },

        delayedConsequences: [],
      },

      {
        id: "year-end-resilience",

        title:
          "Strengthen the business before growing further",

        description:
          "Focus the next period on cash reserves, operations and risk reduction.",

        immediateEffects: {
          expenses: -8000,
          risk: -8,
        },

        skillEffects: {
          financialPlanning: 8,
          riskManagement: 8,
          cashFlow: 6,
        },

        outcome: {
          headline:
            "You ended the year prioritising resilience",

          explanation:
            "The company chose stability and financial strength before another major expansion cycle.",

          lesson:
            "Sustainable businesses balance ambition with resilience.",
        },

        delayedConsequences: [],
      },

      {
        id: "year-end-customers",

        title:
          "Build the next year around customers",

        description:
          "Prioritise retention, customer experience and stronger commercial relationships.",

        immediateEffects: {
          cash: -15000,
          customerSatisfaction: 8,
          customers: 1,
          risk: -3,
        },

        skillEffects: {
          customerManagement: 9,
          growthStrategy: 5,
          pricing: 3,
        },

        outcome: {
          headline:
            "You chose customer value as the foundation of the next year",

          explanation:
            "The company will focus on stronger relationships rather than growth at any cost.",

          lesson:
            "Long-term growth is often built on customers who trust and value the business.",
        },

        delayedConsequences: [],
      },

      {
        id: "year-end-turnaround",

        title:
          "Enter the next year with a turnaround plan",

        description:
          "Reduce unnecessary cost, protect cash and address the weakest areas of the business.",

        immediateEffects: {
          expenses: -18000,
          cash: 12000,
          risk: -10,
        },

        skillEffects: {
          financialPlanning: 9,
          riskManagement: 8,
          cashFlow: 7,
        },

        outcome: {
          headline:
            "You chose to repair the business before chasing new growth",

          explanation:
            "Management is entering the next year with a stronger focus on financial discipline and operational recovery.",

          lesson:
            "Recognising when a business needs a turnaround is an important entrepreneurial skill.",
        },

        delayedConsequences: [],
      },
    ],
  },

];
