export const recoveryActions = [
  {
    id: "recover-collections",

    title:
      "Accelerate customer collections",

    category: "CASH",

    description:
      "Contact overdue customers, negotiate immediate partial payments and tighten collection follow-up.",

    immediateEffects: {
      cash: 45000,
      receivables: -45000,
      customerSatisfaction: -2,
      risk: -5,
    },

    skillEffects: {
      cashFlow: 6,
      customerManagement: 3,
      riskManagement: 3,
    },

    outcome: {
      headline:
        "Cash collections improved",

      explanation:
        "The company converted some outstanding invoices into actual cash. Customer pressure increased slightly, but liquidity improved.",

      lesson:
        "Revenue only becomes useful for paying expenses once customers actually pay.",
    },
  },

  {
    id: "recover-cut-costs",

    title:
      "Reduce non-essential operating costs",

    category: "COST",

    description:
      "Pause selected subscriptions, travel, discretionary spending and low-priority expenses.",

    immediateEffects: {
      expenses: -18000,
      employeeMorale: -3,
      risk: -4,
    },

    skillEffects: {
      financialPlanning: 6,
      cashFlow: 4,
      riskManagement: 4,
    },

    outcome: {
      headline:
        "Monthly expenses reduced",

      explanation:
        "The company lowered recurring costs and improved short-term resilience, although some employees may feel the operational pressure.",

      lesson:
        "Cost reduction can protect cash, but cuts should avoid damaging the capabilities needed to generate revenue.",
    },
  },

  {
    id: "recover-restructure-debt",

    title:
      "Negotiate debt restructuring",

    category: "DEBT",

    description:
      "Ask lenders to extend repayment terms and reduce short-term monthly pressure.",

    immediateEffects: {
      expenses: -9000,
      cash: -5000,
      risk: -3,
    },

    skillEffects: {
      fundingDecisions: 6,
      financialPlanning: 5,
      riskManagement: 5,
    },

    outcome: {
      headline:
        "Debt repayments became more manageable",

      explanation:
        "The company reduced immediate repayment pressure, but the debt still exists and may remain outstanding for longer.",

      lesson:
        "Restructuring debt can improve short-term cash flow without eliminating the underlying obligation.",
    },
  },

  {
    id: "recover-sell-asset",

    title:
      "Sell a non-essential asset",

    category: "ASSET",

    description:
      "Sell equipment that is not essential to current operations to raise emergency cash.",

    immediateEffects: {
      cash: 70000,
      assets: -70000,
      risk: -4,
    },

    skillEffects: {
      cashFlow: 4,
      riskManagement: 4,
      financialPlanning: 3,
    },

    outcome: {
      headline:
        "You converted an asset into cash",

      explanation:
        "Liquidity improved immediately, but the company's total asset base became smaller.",

      lesson:
        "Asset sales can provide emergency liquidity, but the long-term operational value of the asset must be considered.",
    },
  },

  {
    id: "recover-price-review",

    title:
      "Review pricing and margins",

    category: "PRICING",

    description:
      "Increase selected prices and stop accepting work that does not provide enough margin.",

    immediateEffects: {
      revenue: 18000,
      customerSatisfaction: -4,
      risk: -2,
    },

    skillEffects: {
      pricing: 7,
      financialPlanning: 5,
      customerManagement: 1,
    },

    outcome: {
      headline:
        "Pricing discipline improved",

      explanation:
        "The company is earning more from the work it keeps, although some customers may resist the new pricing.",

      lesson:
        "More revenue is not always better if the work produces weak or negative margins.",
    },
  },

  {
    id: "recover-freeze-hiring",

    title:
      "Freeze new hiring",

    category: "PEOPLE",

    description:
      "Pause recruitment and redistribute workload while the company stabilises.",

    immediateEffects: {
      expenses: -12000,
      employeeMorale: -5,
      risk: -2,
    },

    skillEffects: {
      peopleManagement: 2,
      financialPlanning: 4,
      riskManagement: 3,
    },

    outcome: {
      headline:
        "Payroll growth was contained",

      explanation:
        "The company avoided additional salary commitments, but the existing team may experience more workload pressure.",

      lesson:
        "Hiring freezes can protect cash, but workforce capacity must still match business demand.",
    },
  },
];

export const getRecoveryActions = () =>
  recoveryActions;
