import {
  calculateBusinessHealth,
  calculateProfit,
  getFinancialDashboard,
} from "./engine";

const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, value));

const hasDecision = (state, decisionId) =>
  state.decisions.some(
    (decision) =>
      decision.decisionId === decisionId
  );


// =========================================================
// BUSINESS ALERTS
// =========================================================

export const getBusinessAlerts = (state) => {
  const business = state.business;

  const financial =
    getFinancialDashboard(state);

  const profit =
    calculateProfit(business);

  const alerts = [];


  // -------------------------------------------------------
  // CASH
  // -------------------------------------------------------

  if (business.cash < 0) {
    alerts.push({
      id: "cash-negative",

      severity: "critical",

      title:
        "Your business has run out of available cash",

      message:
        "The company is currently operating with a negative cash position. Immediate action is required to protect payroll, suppliers and other obligations.",

      action:
        "Prioritise collections, reduce non-essential spending and review short-term funding options.",
    });
  } else if (
    financial.cashCoverage < 0.5
  ) {
    alerts.push({
      id: "cash-critical",

      severity: "critical",

      title:
        "Cash reserves are critically low",

      message:
        `Available cash currently covers only ${financial.cashCoverage.toFixed(
          1
        )} months of operating expenses.`,

      action:
        "Protect cash immediately and avoid unnecessary commitments.",
    });
  } else if (
    financial.cashCoverage < 1
  ) {
    alerts.push({
      id: "cash-watch",

      severity: "warning",

      title:
        "Cash reserves need attention",

      message:
        "The company has less than one month of current operating expenses available in cash.",

      action:
        "Review customer collections, upcoming expenses and working-capital requirements.",
    });
  }


  // -------------------------------------------------------
  // PROFITABILITY
  // -------------------------------------------------------

  if (profit < 0) {
    alerts.push({
      id: "loss-making",

      severity: "critical",

      title:
        "The business is currently loss-making",

      message:
        `Monthly expenses are exceeding revenue by ${Math.abs(
          profit
        ).toLocaleString(
          "en-ZA"
        )} rand.`,

      action:
        "Review pricing, expenses and revenue-generating activity.",
    });
  } else if (
    financial.profitMargin < 8
  ) {
    alerts.push({
      id: "margin-pressure",

      severity: "warning",

      title:
        "Profit margin is becoming thin",

      message:
        `The current operating margin is approximately ${financial.profitMargin.toFixed(
          1
        )}%.`,

      action:
        "Review supplier costs, pricing and operating efficiency.",
    });
  }


  // -------------------------------------------------------
  // DEBT
  // -------------------------------------------------------

  if (
    financial.debtToAssets >= 75
  ) {
    alerts.push({
      id: "debt-critical",

      severity: "critical",

      title:
        "Debt is becoming a major financial risk",

      message:
        "Debt is now very high relative to the company's asset base.",

      action:
        "Avoid unnecessary borrowing and review repayment capacity.",
    });
  } else if (
    financial.debtToAssets >= 50
  ) {
    alerts.push({
      id: "debt-watch",

      severity: "warning",

      title:
        "Debt levels are increasing",

      message:
        `Debt is approximately ${financial.debtToAssets.toFixed(
          1
        )}% of current assets.`,

      action:
        "Future funding decisions should consider existing repayment obligations.",
    });
  }


  // -------------------------------------------------------
  // CUSTOMER COLLECTIONS
  // -------------------------------------------------------

  if (
    financial.receivableExposure >= 50
  ) {
    alerts.push({
      id: "receivable-risk",

      severity: "warning",

      title:
        "Too much revenue is tied up in unpaid invoices",

      message:
        "A significant amount of earned revenue has not yet converted into cash.",

      action:
        "Improve payment terms, deposits and customer collection processes.",
    });
  }


  // -------------------------------------------------------
  // EMPLOYEE MORALE
  // -------------------------------------------------------

  if (
    business.employeeMorale < 40
  ) {
    alerts.push({
      id: "morale-critical",

      severity: "critical",

      title:
        "Employee morale is dangerously low",

      message:
        "Low morale may affect productivity, retention and customer service.",

      action:
        "Review workload, leadership, communication and employee support.",
    });
  } else if (
    business.employeeMorale < 60
  ) {
    alerts.push({
      id: "morale-watch",

      severity: "warning",

      title:
        "Employee morale is weakening",

      message:
        "The team may be experiencing pressure or dissatisfaction.",

      action:
        "Investigate workload, recognition and employee concerns.",
    });
  }


  // -------------------------------------------------------
  // CUSTOMER SATISFACTION
  // -------------------------------------------------------

  if (
    business.customerSatisfaction <
    45
  ) {
    alerts.push({
      id: "customer-critical",

      severity: "critical",

      title:
        "Customer relationships are at risk",

      message:
        "Customer satisfaction has fallen to a level that may threaten retention and future revenue.",

      action:
        "Review service quality, pricing changes and customer communication.",
    });
  }


  // -------------------------------------------------------
  // OWNERSHIP
  // -------------------------------------------------------

  if (
    business.founderOwnership <= 70
  ) {
    alerts.push({
      id: "ownership-watch",

      severity: "info",

      title:
        "Founder ownership has reduced",

      message:
        `The founder currently owns ${business.founderOwnership}% of the company.`,

      action:
        "Consider how future equity funding could affect control and long-term ownership.",
    });
  }


  // -------------------------------------------------------
  // POSITIVE BUSINESS SIGNALS
  // -------------------------------------------------------

  const health =
    calculateBusinessHealth(
      business
    );

  if (
    health >= 85 &&
    profit > 0 &&
    financial.cashCoverage >= 1
  ) {
    alerts.push({
      id: "healthy-business",

      severity: "positive",

      title:
        "The business is currently financially resilient",

      message:
        "Cash, profitability and overall business health are currently in a strong position.",

      action:
        "Continue monitoring growth carefully and avoid unnecessary financial pressure.",
    });
  }


  // -------------------------------------------------------
  // DECISION-SPECIFIC ALERTS
  // -------------------------------------------------------

  if (
    hasDecision(
      state,
      "fund-bank"
    )
  ) {
    alerts.push({
      id: "bank-loan-reminder",

      severity: "info",

      title:
        "Your expansion loan remains part of the business",

      message:
        "The company preserved ownership by using debt, but repayments will continue affecting future cash flow.",

      action:
        "Monitor debt-service affordability as the business grows.",
    });
  }

  if (
    hasDecision(
      state,
      "fund-equity"
    )
  ) {
    alerts.push({
      id: "equity-reminder",

      severity: "info",

      title:
        "You now have an external shareholder",

      message:
        "The company avoided new loan repayments, but the investor now participates in company ownership and future value.",

      action:
        "Consider investor expectations when making major strategic decisions.",
    });
  }


  const severityOrder = {
    critical: 0,
    warning: 1,
    positive: 2,
    info: 3,
  };

  return alerts.sort(
    (a, b) =>
      severityOrder[a.severity] -
      severityOrder[b.severity]
  );
};


// =========================================================
// BUSINESS OBJECTIVES
// =========================================================

export const getBusinessObjectives = (
  state
) => {
  const business = state.business;

  const financial =
    getFinancialDashboard(state);

  const profit =
    calculateProfit(business);

  const currentDay =
    Math.min(state.currentDay, 6);

  const objectives = [
    {
      id: "stay-profitable",

      title:
        "Keep the company profitable",

      description:
        "Monthly revenue should remain above monthly expenses.",

      progress:
        profit > 0 ? 100 : 0,

      completed:
        profit > 0,
    },

    {
      id: "cash-buffer",

      title:
        "Build at least one month of cash cover",

      description:
        "Maintain enough available cash to cover one month of current operating expenses.",

      progress: clamp(
        financial.cashCoverage * 100,
        0,
        100
      ),

      completed:
        financial.cashCoverage >= 1,
    },

    {
      id: "customer-health",

      title:
        "Protect customer relationships",

      description:
        "Keep customer satisfaction above 65%.",

      progress: clamp(
        (business.customerSatisfaction /
          65) *
          100,
        0,
        100
      ),

      completed:
        business.customerSatisfaction >=
        65,
    },

    {
      id: "team-health",

      title:
        "Maintain a healthy team",

      description:
        "Keep employee morale above 65%.",

      progress: clamp(
        (business.employeeMorale /
          65) *
          100,
        0,
        100
      ),

      completed:
        business.employeeMorale >= 65,
    },
  ];


  if (currentDay >= 5) {
    objectives.push({
      id: "manage-debt",

      title:
        "Keep debt manageable",

      description:
        "Keep debt below 70% of the company's asset base.",

      progress: clamp(
        100 -
          financial.debtToAssets,
        0,
        100
      ),

      completed:
        financial.debtToAssets < 70,
    });
  }


  return objectives;
};


// =========================================================
// ACHIEVEMENTS
// =========================================================

export const getAchievements = (
  state
) => {
  const financial =
    getFinancialDashboard(state);

  const profit =
    calculateProfit(
      state.business
    );

  const unlocked = [];


  if (
    state.decisions.length >= 1
  ) {
    unlocked.push({
      id: "first-decision",

      title:
        "Business Owner",

      description:
        "Made your first major business decision.",

      icon: "01",
    });
  }


  if (
    state.reflections.length >= 3
  ) {
    unlocked.push({
      id: "reflective-founder",

      title:
        "Reflective Founder",

      description:
        "Completed three business decision reflections.",

      icon: "03",
    });
  }


  if (
    state.business.revenue >
    state.baseline.revenue
  ) {
    unlocked.push({
      id: "growth",

      title:
        "Growth Builder",

      description:
        "Increased monthly business revenue.",

      icon: "↑",
    });
  }


  if (
    financial.cashCoverage >= 1
  ) {
    unlocked.push({
      id: "cash-reserve",

      title:
        "Cash Protector",

      description:
        "Maintained at least one month of operating cash cover.",

      icon: "R",
    });
  }


  if (
    profit > 0 &&
    state.currentDay >= 4
  ) {
    unlocked.push({
      id: "profitable",

      title:
        "Still Profitable",

      description:
        "Kept the company profitable through multiple business pressures.",

      icon: "+",
    });
  }


  if (
    state.business.customerSatisfaction >=
    80
  ) {
    unlocked.push({
      id: "customer",

      title:
        "Customer Champion",

      description:
        "Built very strong customer satisfaction.",

      icon: "★",
    });
  }


  if (
    state.business.employeeMorale >=
    80
  ) {
    unlocked.push({
      id: "people",

      title:
        "People Leader",

      description:
        "Built very strong employee morale.",

      icon: "P",
    });
  }


  if (
    state.business.founderOwnership <
    100
  ) {
    unlocked.push({
      id: "investor",

      title:
        "Investor Ready",

      description:
        "Experienced the ownership impact of equity investment.",

      icon: "%",
    });
  }


  if (
    (state.recoveryActions || [])
      .length >= 1
  ) {
    unlocked.push({
      id: "recovery-founder",

      title:
        "Recovery Founder",

      description:
        "Took action to stabilise the business during financial pressure.",

      icon: "R",
    });
  }


  if (
    (state.recoveryActions || [])
      .length >= 3
  ) {
    unlocked.push({
      id: "turnaround",

      title:
        "Turnaround Manager",

      description:
        "Used multiple recovery strategies to improve business resilience.",

      icon: "T",
    });
  }


  return unlocked;
};


// =========================================================
// RECOVERY STATE
// =========================================================

export const getRecoveryState = (
  state
) => {
  const business = state.business;

  const financial =
    getFinancialDashboard(state);

  const profit =
    calculateProfit(business);

  const health =
    calculateBusinessHealth(
      business
    );

  let level = "normal";

  let title =
    "Business operating normally";

  let message =
    "No immediate recovery intervention is required.";

  const actions = [];


  if (
    business.cash < 0 ||
    financial.cashCoverage < 0.25 ||
    health < 30
  ) {
    level = "crisis";

    title =
      "Business Recovery Mode";

    message =
      "The company is experiencing severe financial pressure and needs immediate stabilisation.";

    actions.push(
      "Protect essential cash obligations first.",
      "Collect outstanding customer invoices aggressively.",
      "Freeze non-essential expenditure.",
      "Review debt repayments and funding obligations.",
      "Identify expenses that can be reduced without destroying core operations."
    );
  } else if (
    profit < 0 ||
    financial.cashCoverage < 0.6 ||
    health < 50
  ) {
    level = "warning";

    title =
      "Business Stabilisation Required";

    message =
      "The company remains operational, but financial pressure is increasing.";

    actions.push(
      "Review pricing and profitability.",
      "Improve customer collections.",
      "Reduce avoidable expenses.",
      "Delay non-essential expansion.",
      "Protect sufficient working capital."
    );
  }


  return {
    level,
    title,
    message,
    actions,
  };
};
