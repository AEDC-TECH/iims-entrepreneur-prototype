const clamp = (
  value,
  min,
  max
) =>
  Math.min(
    max,
    Math.max(min, value)
  );


const calculateProfit = (
  business
) =>
  business.revenue -
  business.expenses;


const getCashRunway = (
  business
) =>
  business.expenses > 0
    ? business.cash /
      business.expenses
    : 0;


const buildAlerts = (
  state,
  world,
  taskSummary,
  currentEvent
) => {
  const alerts = [];

  const business =
    state.business;

  const profit =
    calculateProfit(
      business
    );

  const runway =
    getCashRunway(
      business
    );


  if (profit < 0) {
    alerts.push({
      id: "loss",

      level: "critical",

      title:
        "Business is currently loss-making",

      message:
        `Monthly expenses exceed revenue by approximately R${Math.abs(
          Math.round(profit)
        ).toLocaleString(
          "en-ZA"
        )}.`,

      action:
        "Review Finance",
    });
  }


  if (runway < 0.75) {
    alerts.push({
      id: "cash",

      level: "critical",

      title:
        "Cash runway is under pressure",

      message:
        `Available cash currently covers approximately ${runway.toFixed(
          1
        )} months of operating expenses.`,

      action:
        "Protect Cash",
    });
  } else if (
    runway < 1.25
  ) {
    alerts.push({
      id: "cash-watch",

      level: "warning",

      title:
        "Cash buffer needs monitoring",

      message:
        `The company has approximately ${runway.toFixed(
          1
        )} months of operating cash available.`,

      action:
        "Monitor",
    });
  }


  if (
    business.employeeMorale <
    55
  ) {
    alerts.push({
      id: "people",

      level: "warning",

      title:
        "Team confidence is weakening",

      message:
        `Employee morale is currently ${Math.round(
          business.employeeMorale
        )}%.`,

      action:
        "Review People",
    });
  }


  if (
    business.customerSatisfaction <
    55
  ) {
    alerts.push({
      id: "customers",

      level: "warning",

      title:
        "Customer trust is at risk",

      message:
        `Customer satisfaction has fallen to ${Math.round(
          business.customerSatisfaction
        )}%.`,

      action:
        "Review Customers",
    });
  }


  if (
    business.risk >= 70
  ) {
    alerts.push({
      id: "risk",

      level: "critical",

      title:
        "Business risk is elevated",

      message:
        `Overall risk is currently ${Math.round(
          business.risk
        )}%. Multiple pressures may be active at the same time.`,

      action:
        "Reduce Risk",
    });
  }


  if (
    taskSummary?.critical >
    0
  ) {
    alerts.push({
      id: "tasks",

      level: "warning",

      title:
        `${taskSummary.critical} critical task${
          taskSummary.critical ===
          1
            ? ""
            : "s"
        } need attention`,

      message:
        "Critical operational work must be completed before the business day can close.",

      action:
        "Open Tasks",
    });
  }


  if (
    currentEvent &&
    currentEvent.status !==
      "resolved"
  ) {
    alerts.push({
      id: "event",

      level:
        currentEvent.type ===
        "RISK"
          ? "warning"
          : "info",

      title:
        "Unexpected event requires a response",

      message:
        currentEvent.title,

      action:
        "Respond",
    });
  }


  if (
    world.reputation >= 80
  ) {
    alerts.push({
      id: "reputation",

      level: "positive",

      title:
        "Business reputation is strong",

      message:
        `Reputation has reached ${world.reputation}%. This can support future opportunities.`,

      action:
        "Build On It",
    });
  }


  return alerts.slice(
    0,
    6
  );
};


const getCEOFocus = (
  state,
  world,
  managementTeam
) => {
  const business =
    state.business;

  const profit =
    calculateProfit(
      business
    );

  const runway =
    getCashRunway(
      business
    );


  if (profit < 0) {
    return {
      type: "financial",

      label:
        "CEO PRIORITY",

      title:
        "Restore profitable operations",

      message:
        "Revenue growth should not distract from the fact that the company is currently spending more than it earns.",

      question:
        "Which cost, price or revenue decision would most improve monthly profit without damaging the business?",
    };
  }


  if (runway < 1) {
    return {
      type: "cash",

      label:
        "CEO PRIORITY",

      title:
        "Protect liquidity",

      message:
        "The company does not have a comfortable cash buffer. New commitments should be tested against near-term cash needs.",

      question:
        "What could cause cash to leave the business before the next major customer payment arrives?",
    };
  }


  if (
    business.employeeMorale <
    55
  ) {
    return {
      type: "people",

      label:
        "CEO PRIORITY",

      title:
        "Stabilise the team",

      message:
        "Employee pressure can become an operational problem even when the financial numbers still look acceptable.",

      question:
        "What is creating the most pressure for employees right now?",
    };
  }


  if (
    business.customerSatisfaction <
    60
  ) {
    return {
      type: "customer",

      label:
        "CEO PRIORITY",

      title:
        "Rebuild customer trust",

      message:
        "Growth becomes harder when existing customers are losing confidence.",

      question:
        "Which recent decision may have weakened the customer experience?",
    };
  }


  if (
    world.momentum >= 75 &&
    world.resilience >= 65
  ) {
    return {
      type: "growth",

      label:
        "CEO OPPORTUNITY",

      title:
        "The business may be ready for controlled growth",

      message:
        "Momentum and financial resilience are both healthy enough to consider the next strategic move.",

      question:
        "Which opportunity creates the most long-term value without creating unnecessary fixed cost?",
    };
  }


  if (
    managementTeam?.consensus
      ?.cautious >
    managementTeam?.consensus
      ?.supportive
  ) {
    return {
      type: "leadership",

      label:
        "CEO PRIORITY",

      title:
        "Understand why your leadership team is cautious",

      message:
        "Several members of the management team currently see meaningful downside risk.",

      question:
        "Which concern would be most damaging if the cautious advisors are correct?",
    };
  }


  return {
    type: "balanced",

    label:
      "CEO PRIORITY",

    title:
      "Keep the business balanced",

    message:
      "The company is operating without a dominant crisis. Focus on making the next decision deliberately.",

    question:
      "What is the most important outcome you want from the next business decision?",
  };
};


const getBusinessHealth = (
  state,
  world
) => {
  const business =
    state.business;

  const profit =
    calculateProfit(
      business
    );

  const runway =
    getCashRunway(
      business
    );


  let score = 50;


  score +=
    profit >= 0
      ? 12
      : -18;


  score += clamp(
    runway * 9,
    -10,
    18
  );


  score +=
    (business.customerSatisfaction -
      50) *
    0.18;


  score +=
    (business.employeeMorale -
      50) *
    0.16;


  score +=
    (world.reputation - 50) *
    0.12;


  score -=
    Math.max(
      0,
      business.risk - 50
    ) *
    0.24;


  return Math.round(
    clamp(
      score,
      0,
      100
    )
  );
};


export const getCommandCentre = ({
  state,
  world,
  taskSummary,
  currentTasks,
  currentEvent,
  managementTeam,
  scenario,
}) => {
  const business =
    state.business;

  const profit =
    calculateProfit(
      business
    );

  const runway =
    getCashRunway(
      business
    );

  const health =
    getBusinessHealth(
      state,
      world
    );


  const alerts =
    buildAlerts(
      state,
      world,
      taskSummary,
      currentEvent
    );


  const focus =
    getCEOFocus(
      state,
      world,
      managementTeam
    );


  const urgentTasks =
    (currentTasks || [])
      .filter(
        (task) =>
          task.priority ===
            "CRITICAL" ||
          task.priority ===
            "IMPORTANT"
      )
      .slice(0, 4);


  const latestMilestones =
    [...world.milestones]
      .slice(-4)
      .reverse();


  return {
    health,

    profit,

    runway,

    alerts,

    focus,

    urgentTasks,

    latestMilestones,

    nextDecision: {
      title:
        scenario?.title ||
        scenario?.context?.title ||
        "Business Decision",

      context:
        typeof scenario?.context ===
        "string"
          ? scenario.context
          : scenario?.context?.text ||
            scenario?.context?.description ||
            "A new business decision is waiting for your attention.",

      day:
        state.currentDay,
    },

    managementSignal: {
      mood:
        managementTeam
          ?.consensus
          ?.roomMood ||
        "Mixed views",

      supportive:
        managementTeam
          ?.consensus
          ?.supportive || 0,

      cautious:
        managementTeam
          ?.consensus
          ?.cautious || 0,

      balanced:
        managementTeam
          ?.consensus
          ?.balanced || 0,
    },

    metrics: {
      cash:
        business.cash,

      profit,

      runway,

      reputation:
        world.reputation,

      momentum:
        world.momentum,

      resilience:
        world.resilience,

      customers:
        business.customerSatisfaction,

      team:
        business.employeeMorale,

      risk:
        business.risk,
    },
  };
};
