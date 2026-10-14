const clamp = (
  value,
  min,
  max
) =>
  Math.min(
    max,
    Math.max(min, value)
  );


const hashString = (value) => {
  let hash = 0;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash =
      (hash << 5) -
      hash +
      value.charCodeAt(index);

    hash |= 0;
  }

  return Math.abs(hash);
};


const seededNumber = (
  seed
) => {
  const value =
    Math.sin(seed) *
    10000;

  return (
    value -
    Math.floor(value)
  );
};


const getEventSeed = (
  state
) => {
  return hashString(
    `${state.startedAt}-${state.currentDay}`
  );
};


const EVENTS = [
  {
    id: "customer-referral",

    type: "OPPORTUNITY",

    title:
      "A customer has referred a new client",

    message:
      "One of your existing customers has recommended Ubuntu Digital Solutions to another business that may need your services.",

    baseWeight: 10,

    getWeight: (state) => {
      const satisfaction =
        state.business
          .customerSatisfaction;

      return (
        10 +
        Math.max(
          0,
          satisfaction - 65
        ) *
          1.5
      );
    },

    probabilityReason:
      (state) =>
        `Customer satisfaction is currently ${state.business.customerSatisfaction}%. Strong customer relationships increase the likelihood of referrals.`,

    options: [
      {
        id:
          "referral-pursue",

        title:
          "Pursue the opportunity",

        description:
          "Allocate time and resources to convert the referral into a customer.",

        effects: {
          cash: -8000,
          revenue: 18000,
          customers: 1,
          risk: 2,
        },

        skillEffects: {
          growthStrategy: 4,
          customerManagement: 3,
        },

        outcome: {
          headline:
            "The referral became a growth opportunity",

          explanation:
            "The company invested some resources and gained additional recurring revenue.",

          lesson:
            "Strong customer relationships can create new business opportunities through referrals.",
        },
      },

      {
        id:
          "referral-delay",

        title:
          "Delay the opportunity",

        description:
          "Focus on existing operations before pursuing another customer.",

        effects: {
          risk: -1,
        },

        skillEffects: {
          riskManagement: 2,
        },

        outcome: {
          headline:
            "You protected operational capacity",

          explanation:
            "The company avoided taking on more work while current obligations remain important.",

          lesson:
            "Not every opportunity must be accepted immediately.",
        },
      },
    ],
  },


  {
    id:
      "employee-absence",

    type: "RISK",

    title:
      "A key employee is unexpectedly absent",

    message:
      "A key team member is unavailable during an important delivery period.",

    baseWeight: 8,

    getWeight: (state) => {
      const morale =
        state.business
          .employeeMorale;

      return (
        8 +
        Math.max(
          0,
          70 - morale
        ) *
          1.7
      );
    },

    probabilityReason:
      (state) =>
        `Employee morale is currently ${state.business.employeeMorale}%. Lower morale and higher workload can increase operational people risk.`,

    options: [
      {
        id:
          "absence-overtime",

        title:
          "Use overtime",

        description:
          "Ask the current team to cover the missing employee's work.",

        effects: {
          expenses: 6000,
          employeeMorale: -5,
          risk: 2,
        },

        skillEffects: {
          peopleManagement: 1,
          riskManagement: 1,
        },

        outcome: {
          headline:
            "Delivery continued, but team pressure increased",

          explanation:
            "The work was covered, but overtime increased both cost and pressure on the remaining team.",

          lesson:
            "Operational continuity sometimes creates hidden people and cost consequences.",
        },
      },

      {
        id:
          "absence-contractor",

        title:
          "Bring in temporary support",

        description:
          "Use a contractor to protect the team and maintain delivery.",

        effects: {
          cash: -10000,
          expenses: 4000,
          risk: -2,
        },

        skillEffects: {
          peopleManagement: 4,
          riskManagement: 4,
        },

        outcome: {
          headline:
            "Temporary capacity protected delivery",

          explanation:
            "The company spent additional cash but reduced pressure on the existing team.",

          lesson:
            "Flexible capacity can reduce operational risk during short-term disruptions.",
        },
      },
    ],
  },


  {
    id:
      "equipment-failure",

    type: "RISK",

    title:
      "Critical equipment has failed",

    message:
      "A piece of operational equipment has failed unexpectedly and is affecting service delivery.",

    baseWeight: 10,

    getWeight: (state) =>
      10 +
      Math.max(
        0,
        state.business.risk -
          45
      ),

    probabilityReason:
      (state) =>
        `Overall business risk is currently ${state.business.risk}%. Higher operational risk increases the chance that disruptions become harder to absorb.`,

    options: [
      {
        id:
          "equipment-repair",

        title:
          "Repair immediately",

        description:
          "Spend cash now to restore normal operations.",

        effects: {
          cash: -18000,
          risk: -5,
        },

        skillEffects: {
          riskManagement: 5,
          financialPlanning: 2,
        },

        outcome: {
          headline:
            "Operations were restored quickly",

          explanation:
            "The repair reduced available cash, but service disruption was limited.",

          lesson:
            "Emergency reserves allow businesses to respond to unexpected operational costs.",
        },
      },

      {
        id:
          "equipment-delay",

        title:
          "Delay the repair",

        description:
          "Protect cash and operate with reduced capacity for now.",

        effects: {
          customerSatisfaction: -5,
          risk: 6,
        },

        skillEffects: {
          cashFlow: 2,
          riskManagement: -3,
        },

        outcome: {
          headline:
            "Cash was protected, but operational risk increased",

          explanation:
            "The company avoided the immediate repair cost but service quality became more vulnerable.",

          lesson:
            "Delaying expenditure can preserve cash while creating other business risks.",
        },
      },
    ],
  },


  {
    id:
      "customer-cancellation",

    type: "RISK",

    title:
      "A customer is considering cancelling",

    message:
      "A customer has raised concerns about service value and is considering moving to another provider.",

    baseWeight: 7,

    getWeight: (state) => {
      const satisfaction =
        state.business
          .customerSatisfaction;

      return (
        7 +
        Math.max(
          0,
          65 - satisfaction
        ) *
          2
      );
    },

    probabilityReason:
      (state) =>
        `Customer satisfaction is currently ${state.business.customerSatisfaction}%. Lower satisfaction increases customer-retention risk.`,

    options: [
      {
        id:
          "customer-save",

        title:
          "Meet the customer and resolve the problem",

        description:
          "Invest time and service resources in protecting the relationship.",

        effects: {
          cash: -7000,
          customerSatisfaction: 8,
          risk: -4,
        },

        skillEffects: {
          customerManagement: 7,
        },

        outcome: {
          headline:
            "The relationship was stabilised",

          explanation:
            "The company invested resources to address the customer's concerns.",

          lesson:
            "Customer retention often depends on responding before dissatisfaction becomes cancellation.",
        },
      },

      {
        id:
          "customer-let-go",

        title:
          "Allow the customer to leave",

        description:
          "Avoid additional retention costs and focus on other customers.",

        effects: {
          customers: -1,
          revenue: -15000,
          risk: 3,
        },

        skillEffects: {
          financialPlanning: 2,
          customerManagement: -2,
        },

        outcome: {
          headline:
            "The company lost recurring revenue",

          explanation:
            "The customer left and monthly revenue declined.",

          lesson:
            "Sometimes unprofitable relationships should end, but losing recurring revenue still affects the business.",
        },
      },
    ],
  },


  {
    id:
      "supplier-discount",

    type: "OPPORTUNITY",

    title:
      "A supplier offers a limited discount",

    message:
      "A supplier has offered reduced pricing if the company commits to purchasing additional stock now.",

    baseWeight: 9,

    getWeight: (state) => {
      const cashCover =
        state.business.expenses >
        0
          ? state.business.cash /
            state.business
              .expenses
          : 0;

      return (
        9 +
        Math.min(
          20,
          cashCover * 5
        )
      );
    },

    probabilityReason:
      (state) =>
        `The business currently has R${Math.round(state.business.cash).toLocaleString("en-ZA")} in cash. Stronger liquidity gives the company more flexibility to take advantage of supplier opportunities.`,

    options: [
      {
        id:
          "discount-buy",

        title:
          "Buy at the discounted price",

        description:
          "Use some available cash now to reduce future supplier costs.",

        effects: {
          cash: -30000,
          expenses: -7000,
          risk: 1,
        },

        skillEffects: {
          cashFlow: 4,
          pricing: 4,
          financialPlanning: 3,
        },

        outcome: {
          headline:
            "You traded cash today for lower future costs",

          explanation:
            "Available cash declined, but recurring supplier costs improved.",

          lesson:
            "Liquidity can give a business bargaining power and access to cost-saving opportunities.",
        },
      },

      {
        id:
          "discount-decline",

        title:
          "Protect cash instead",

        description:
          "Decline the offer and preserve liquidity.",

        effects: {
          risk: -1,
        },

        skillEffects: {
          cashFlow: 3,
          riskManagement: 2,
        },

        outcome: {
          headline:
            "You kept financial flexibility",

          explanation:
            "The business missed the discount but preserved cash for other needs.",

          lesson:
            "A discount is not automatically valuable if it consumes cash the business may need elsewhere.",
        },
      },
    ],
  },


  {
    id:
      "no-major-event",

    type: "STABLE",

    title:
      "A relatively normal operating day",

    message:
      "No major unexpected disruption or opportunity occurred today. The business can focus on its planned work.",

    baseWeight: 18,

    getWeight: () => 18,

    probabilityReason:
      () =>
        "Not every business day contains a major surprise. Operational consistency is also part of running a company.",

    options: [
      {
        id:
          "normal-review",

        title:
          "Use the time to review operations",

        description:
          "Use the calmer period to review cash, customers, people and upcoming obligations.",

        effects: {
          risk: -2,
        },

        skillEffects: {
          financialPlanning: 2,
          riskManagement: 2,
        },

        outcome: {
          headline:
            "You used a quiet period productively",

          explanation:
            "The business used available management time to review future risks and commitments.",

          lesson:
            "Strong businesses use calm periods to prepare before pressure returns.",
        },
      },
    ],
  },
];


export const generateBusinessEvent = (
  state
) => {
  const existing =
    (state.businessEvents || [])
      .find(
        (item) =>
          item.day ===
          state.currentDay
      );

  if (existing) {
    return existing;
  }


  const weighted =
    EVENTS.map((event) => ({
      event,

      weight: clamp(
        Number(
          event.getWeight(state)
        ) || event.baseWeight,
        1,
        100
      ),
    }));


  const totalWeight =
    weighted.reduce(
      (sum, item) =>
        sum + item.weight,
      0
    );


  const seed =
    getEventSeed(state);

  const roll =
    seededNumber(seed) *
    totalWeight;


  let cursor = 0;

  let selected =
    weighted[
      weighted.length - 1
    ].event;


  for (
    const item of weighted
  ) {
    cursor += item.weight;

    if (roll <= cursor) {
      selected =
        item.event;

      break;
    }
  }


  return {
    recordId:
      `event-${state.currentDay}-${seed}`,

    eventId:
      selected.id,

    day:
      state.currentDay,

    type:
      selected.type,

    title:
      selected.title,

    message:
      selected.message,

    probabilityReason:
      selected.probabilityReason(
        state
      ),

    options:
      selected.options,

    status: "pending",

    generatedAt:
      new Date().toISOString(),
  };
};


export const getCurrentBusinessEvent = (
  state
) =>
  (state.businessEvents || [])
    .find(
      (item) =>
        item.day ===
        state.currentDay
    ) || null;


export const getEventHistory = (
  state
) =>
  (state.businessEvents || [])
    .filter(
      (item) =>
        item.status ===
        "resolved"
    );
