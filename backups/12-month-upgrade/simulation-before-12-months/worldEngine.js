const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, value));


const hasDecision = (
  state,
  decisionId
) =>
  state.decisions.some(
    (decision) =>
      decision.decisionId ===
      decisionId
  );


export const getBusinessWorld = (
  state
) => {
  const b = state.business;

  const profit =
    b.revenue - b.expenses;

  const cashCoverage =
    b.expenses > 0
      ? b.cash / b.expenses
      : 0;


  // =====================================================
  // REPUTATION
  // =====================================================

  let reputation =
    50;

  reputation +=
    (b.customerSatisfaction - 50) *
    0.45;

  reputation +=
    (b.employeeMorale - 50) *
    0.18;

  reputation -=
    Math.max(
      0,
      b.risk - 50
    ) *
    0.15;

  if (profit > 0) {
    reputation += 4;
  }

  if (
    hasDecision(
      state,
      "competition-value"
    )
  ) {
    reputation += 7;
  }

  if (
    hasDecision(
      state,
      "competition-match"
    )
  ) {
    reputation -= 3;
  }

  reputation =
    Math.round(
      clamp(
        reputation,
        0,
        100
      )
    );


  // =====================================================
  // MOMENTUM
  // =====================================================

  let momentum = 50;

  if (
    b.revenue >
    state.baseline.revenue
  ) {
    momentum += 15;
  }

  if (profit > 0) {
    momentum += 10;
  }

  if (
    b.customers >
    state.baseline.customers
  ) {
    momentum += 8;
  }

  if (
    b.employeeMorale >= 70
  ) {
    momentum += 6;
  }

  if (
    b.risk >= 70
  ) {
    momentum -= 15;
  }

  if (profit < 0) {
    momentum -= 20;
  }

  momentum =
    Math.round(
      clamp(
        momentum,
        0,
        100
      )
    );


  // =====================================================
  // FINANCIAL RESILIENCE
  // =====================================================

  let resilience = 50;

  resilience +=
    Math.min(
      25,
      cashCoverage * 15
    );

  if (profit > 0) {
    resilience += 10;
  }

  if (
    b.debt >
    b.assets * 0.6
  ) {
    resilience -= 20;
  }

  if (
    b.receivables >
    b.revenue * 0.5
  ) {
    resilience -= 10;
  }

  resilience =
    Math.round(
      clamp(
        resilience,
        0,
        100
      )
    );


  // =====================================================
  // COMPANY MOOD
  // =====================================================

  let companyMood =
    "Focused";

  if (
    momentum >= 75 &&
    b.employeeMorale >= 70
  ) {
    companyMood =
      "Energised";
  } else if (
    b.employeeMorale < 50
  ) {
    companyMood =
      "Under Pressure";
  } else if (
    profit < 0
  ) {
    companyMood =
      "Concerned";
  } else if (
    reputation >= 80
  ) {
    companyMood =
      "Confident";
  }


  // =====================================================
  // STORY FEED
  // =====================================================

  const feed = [];


  feed.push({
    id: "world-stage",

    type: "IIMS",

    title:
      `Business journey reached Day ${Math.min(
        state.currentDay,
        6
      )}`,

    message:
      `${state.decisions.length} major business decisions have now shaped the company.`,

    time:
      "IIMS Business Intelligence",
  });


  if (
    b.revenue >
    state.baseline.revenue
  ) {
    feed.push({
      id: "world-growth",

      type: "MARKET",

      title:
        "Ubuntu Digital Solutions is growing",

      message:
        `Monthly revenue has increased from R${Math.round(
          state.baseline.revenue
        ).toLocaleString(
          "en-ZA"
        )} to R${Math.round(
          b.revenue
        ).toLocaleString(
          "en-ZA"
        )}.`,

      time:
        "Business Update",
    });
  }


  if (profit < 0) {
    feed.push({
      id: "world-loss",

      type: "FINANCE",

      title:
        "Leadership team raises profitability concern",

      message:
        `The company is currently losing approximately R${Math.abs(
          Math.round(profit)
        ).toLocaleString(
          "en-ZA"
        )} per month.`,

      time:
        "Finance Team",
    });
  }


  if (
    b.employeeMorale >= 80
  ) {
    feed.push({
      id: "world-team-positive",

      type: "PEOPLE",

      title:
        "Team confidence is rising",

      message:
        "Employees are responding positively to recent leadership decisions and workplace conditions.",

      time:
        "People Pulse",
    });
  } else if (
    b.employeeMorale < 55
  ) {
    feed.push({
      id: "world-team-pressure",

      type: "PEOPLE",

      title:
        "Employees are feeling the pressure",

      message:
        "Workload and recent business decisions are beginning to affect team confidence.",

      time:
        "People Pulse",
    });
  }


  if (
    b.customerSatisfaction >= 80
  ) {
    feed.push({
      id: "world-customers-positive",

      type: "CUSTOMER",

      title:
        "Customer trust is strengthening",

      message:
        "Customers are responding positively to the company's service and relationship management.",

      time:
        "Customer Pulse",
    });
  } else if (
    b.customerSatisfaction < 55
  ) {
    feed.push({
      id: "world-customers-warning",

      type: "CUSTOMER",

      title:
        "Customer trust is weakening",

      message:
        "Some customer relationships are showing signs of strain.",

      time:
        "Customer Pulse",
    });
  }


  if (
    b.debt >
    state.baseline.debt *
      1.5
  ) {
    feed.push({
      id: "world-debt",

      type: "BANK",

      title:
        "Lenders are watching leverage closely",

      message:
        `Debt has increased to R${Math.round(
          b.debt
        ).toLocaleString(
          "en-ZA"
        )}. Future borrowing may require stronger financial justification.`,

      time:
        "Funding Environment",
    });
  }


  if (
    b.founderOwnership < 100
  ) {
    feed.push({
      id: "world-investor",

      type: "INVESTOR",

      title:
        "External shareholder now part of the business",

      message:
        `Founder ownership currently stands at ${b.founderOwnership}%. Strategic decisions now affect more than one owner.`,

      time:
        "Ownership Update",
    });
  }


  if (
    (state.recoveryActions || [])
      .length > 0
  ) {
    feed.push({
      id: "world-recovery",

      type: "RECOVERY",

      title:
        "Management has started a turnaround",

      message:
        `${state.recoveryActions.length} recovery action${
          state.recoveryActions.length ===
          1
            ? ""
            : "s"
        } have been used to stabilise the company.`,

      time:
        "Management Update",
    });
  }


  if (
    (state.businessEvents || [])
      .filter(
        (event) =>
          event.status ===
          "resolved"
      ).length > 0
  ) {
    feed.push({
      id: "world-events",

      type: "WORLD",

      title:
        "The business has survived unexpected events",

      message:
        `${state.businessEvents.filter(
          (event) =>
            event.status ===
            "resolved"
        ).length} unexpected business event${
          state.businessEvents.filter(
            (event) =>
              event.status ===
              "resolved"
          ).length === 1
            ? ""
            : "s"
        } have been handled.`,

      time:
        "Business Environment",
    });
  }


  // =====================================================
  // VOICES
  // =====================================================

  const voices = [];


  if (
    b.employeeMorale >= 70
  ) {
    voices.push({
      source:
        "Operations Team",

      quote:
        "The company is moving quickly, but the team still feels involved in the journey.",

      sentiment:
        "positive",
    });
  } else {
    voices.push({
      source:
        "Operations Team",

      quote:
        "We need clearer priorities. The business is changing faster than the team can comfortably absorb.",

      sentiment:
        "warning",
    });
  }


  if (
    b.customerSatisfaction >= 70
  ) {
    voices.push({
      source:
        "Long-term Customer",

      quote:
        "Ubuntu Digital Solutions understands our business and responds when we need support.",

      sentiment:
        "positive",
    });
  } else {
    voices.push({
      source:
        "Customer Feedback",

      quote:
        "We need to understand what value we are receiving and whether service levels will improve.",

      sentiment:
        "warning",
    });
  }


  if (
    resilience >= 70
  ) {
    voices.push({
      source:
        "Finance Advisor",

      quote:
        "The company has enough financial breathing room to think strategically rather than react to every problem.",

      sentiment:
        "positive",
    });
  } else {
    voices.push({
      source:
        "Finance Advisor",

      quote:
        "The company needs to protect cash and commitments before taking on more pressure.",

      sentiment:
        "warning",
    });
  }


  // =====================================================
  // MILESTONES
  // =====================================================

  const milestones = [];


  if (
    b.revenue >= 200000
  ) {
    milestones.push({
      id: "200k-revenue",

      title:
        "R200k Monthly Revenue",

      description:
        "The business crossed R200,000 in simulated monthly revenue.",
    });
  }


  if (
    b.cash >= 250000
  ) {
    milestones.push({
      id: "cash-quarter",

      title:
        "Strong Cash Position",

      description:
        "Available cash crossed R250,000.",
    });
  }


  if (
    reputation >= 80
  ) {
    milestones.push({
      id: "trusted-business",

      title:
        "Trusted Business",

      description:
        "Business reputation reached 80%.",
    });
  }


  if (
    state.decisions.length >= 6
  ) {
    milestones.push({
      id: "six-decisions",

      title:
        "Six Leadership Decisions",

      description:
        "Completed the full first-half leadership journey.",
    });
  }


  if (
    (state.recoveryActions || [])
      .length >= 1
  ) {
    milestones.push({
      id: "turnaround-started",

      title:
        "Turnaround Experience",

      description:
        "Experienced and responded to business distress.",
    });
  }


  return {
    reputation,
    momentum,
    resilience,

    teamConfidence:
      Math.round(
        b.employeeMorale
      ),

    customerTrust:
      Math.round(
        b.customerSatisfaction
      ),

    companyMood,

    feed: feed.slice(0, 8),

    voices,

    milestones,
  };
};
