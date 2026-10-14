export const CONVERSATIONS = {
  customerPayment: {
    id: "customer-payment",
    day: 2,
    characterId: "nalediCustomer",

    title:
      "Payment Negotiation",

    subtitle:
      "Naledi has requested additional time to settle an outstanding invoice.",

    opening: {
      speaker: "Naledi Khumalo",

      text:
        "I want to be transparent with you. We are experiencing temporary cash-flow pressure and need another 30 days to settle your invoice.",
    },

    steps: {
      opening: {
        responses: [
          {
            id: "customer-hard",

            text:
              "We cannot accept that. The invoice needs to be paid immediately.",

            tone: "Firm",

            trustChange: -7,
            sentimentChange: -8,

            next: "hardReply",
          },

          {
            id: "customer-negotiate",

            text:
              "I understand the situation. Could you pay 50% now and the balance in 30 days?",

            tone: "Collaborative",

            trustChange: 5,
            sentimentChange: 5,

            next: "negotiateReply",
          },

          {
            id: "customer-accept",

            text:
              "No problem. We can give you the full 30 days.",

            tone: "Supportive",

            trustChange: 7,
            sentimentChange: 8,

            next: "acceptReply",
          },

          {
            id: "customer-understand",

            text:
              "Before we agree, help me understand what caused the delay.",

            tone: "Curious",

            trustChange: 4,
            sentimentChange: 4,

            next: "understandReply",
          },
        ],
      },


      hardReply: {
        speaker:
          "Naledi Khumalo",

        text:
          "I understand that you also have obligations, but an immediate payment may not be possible. If we cannot find flexibility, this may affect the relationship.",

        responses: [
          {
            id: "hard-compromise",

            text:
              "Let's compromise. Pay 60% now and the rest within 30 days.",

            tone:
              "Problem-solving",

            trustChange: 4,
            sentimentChange: 4,

            businessEffects: {
              cash: 57000,
              receivables: -57000,
              risk: -3,
            },

            outcome: {
              headline:
                "You reached a workable compromise.",

              lesson:
                "Firm negotiation can still protect a relationship when both sides share the burden.",
            },
          },

          {
            id: "hard-demand",

            text:
              "We need the full amount. Our own obligations cannot wait.",

            tone: "Hardline",

            trustChange: -10,
            sentimentChange: -12,

            businessEffects: {
              cash: 95000,
              receivables: -95000,
              customerSatisfaction: -7,
              risk: -2,
            },

            outcome: {
              headline:
                "You protected cash, but damaged the relationship.",

              lesson:
                "Strong collection action can improve liquidity while creating customer-retention risk.",
            },
          },
        ],
      },


      negotiateReply: {
        speaker:
          "Naledi Khumalo",

        text:
          "That sounds more manageable. We can make a partial payment this week and settle the rest next month.",

        responses: [
          {
            id: "negotiate-confirm",

            text:
              "Agreed. Let's document those dates and keep each other updated.",

            tone:
              "Professional",

            trustChange: 7,
            sentimentChange: 6,

            businessEffects: {
              cash: 47500,
              receivables: -47500,
              risk: -4,
              customerSatisfaction: 2,
            },

            outcome: {
              headline:
                "You protected cash flow and customer trust.",

              lesson:
                "Structured payment agreements can balance liquidity and relationship management.",
            },
          },

          {
            id: "negotiate-discount",

            text:
              "If you settle 70% now, I can offer a small discount on the balance.",

            tone:
              "Commercial",

            trustChange: 4,
            sentimentChange: 4,

            businessEffects: {
              cash: 66500,
              receivables: -70000,
              revenue: -3500,
              risk: -4,
            },

            outcome: {
              headline:
                "You accelerated collections at a small commercial cost.",

              lesson:
                "Sometimes giving up a small amount of revenue can materially improve liquidity.",
            },
          },
        ],
      },


      acceptReply: {
        speaker:
          "Naledi Khumalo",

        text:
          "Thank you. That flexibility really helps us. We value the relationship.",

        responses: [
          {
            id: "accept-confirm",

            text:
              "Let's stay in close communication and confirm the payment date in writing.",

            tone: "Supportive",

            trustChange: 8,
            sentimentChange: 9,

            businessEffects: {
              risk: 3,
              customerSatisfaction: 5,
            },

            outcome: {
              headline:
                "Customer trust improved significantly.",

              lesson:
                "Relationship flexibility can create goodwill, but delayed cash still creates financial risk.",
            },
          },
        ],
      },


      understandReply: {
        speaker:
          "Naledi Khumalo",

        text:
          "One of our own large customers paid us late. The underlying business is fine, but it created a temporary working-capital gap.",

        responses: [
          {
            id: "understand-plan",

            text:
              "Thanks for explaining. Let's agree on 40% now, 30% in two weeks, and the balance at month-end.",

            tone:
              "Structured",

            trustChange: 8,
            sentimentChange: 7,

            businessEffects: {
              cash: 38000,
              receivables: -38000,
              risk: -3,
              customerSatisfaction: 3,
            },

            outcome: {
              headline:
                "You used information to design a better agreement.",

              lesson:
                "Good negotiation starts with understanding the other party's actual constraint.",
            },
          },
        ],
      },
    },
  },


  employeeRetention: {
    id: "employee-retention",
    day: 3,
    characterId: "sipho",

    title:
      "Employee Retention Conversation",

    subtitle:
      "Sipho wants to discuss his future with the company.",

    opening: {
      speaker:
        "Sipho Dlamini",

      text:
        "I enjoy working here, but I have been approached by another company. They are offering more money and a clearer career path.",
    },

    steps: {
      opening: {
        responses: [
          {
            id: "sipho-listen",

            text:
              "I appreciate you telling me. What matters most to you besides salary?",

            tone: "Curious",

            trustChange: 8,
            sentimentChange: 7,

            next: "listenReply",
          },

          {
            id: "sipho-money",

            text:
              "Tell me what salary they offered. Maybe we can match it.",

            tone: "Transactional",

            trustChange: 2,
            sentimentChange: 2,

            next: "moneyReply",
          },

          {
            id: "sipho-pressure",

            text:
              "We have all been working hard. I need commitment from the team right now.",

            tone: "Defensive",

            trustChange: -9,
            sentimentChange: -11,

            next: "pressureReply",
          },
        ],
      },


      listenReply: {
        speaker:
          "Sipho Dlamini",

        text:
          "I want to grow. I have been doing more senior work, but I don't know what my future here looks like.",

        responses: [
          {
            id: "sipho-development",

            text:
              "Let's create a development plan, give you more responsibility, and review compensation after clear milestones.",

            tone:
              "Development-focused",

            trustChange: 12,
            sentimentChange: 12,

            businessEffects: {
              expenses: 3000,
              employeeMorale: 7,
              risk: -4,
            },

            outcome: {
              headline:
                "Sipho sees a future in the company.",

              lesson:
                "Retention is often about growth, recognition and opportunity — not salary alone.",
            },
          },

          {
            id: "sipho-promotion",

            text:
              "I want you to step into a team-lead role immediately, with an increase in salary.",

            tone:
              "Decisive",

            trustChange: 14,
            sentimentChange: 14,

            businessEffects: {
              expenses: 9000,
              employeeMorale: 8,
              risk: -3,
            },

            outcome: {
              headline:
                "You retained a key employee through promotion.",

              lesson:
                "Promotions can strengthen commitment but create permanent cost and role expectations.",
            },
          },
        ],
      },


      moneyReply: {
        speaker:
          "Sipho Dlamini",

        text:
          "They are offering about 18% more. But to be honest, I also want to know whether I can grow here.",

        responses: [
          {
            id: "sipho-match",

            text:
              "I can approve a 15% increase now and we will review your role in six months.",

            tone: "Commercial",

            trustChange: 8,
            sentimentChange: 9,

            businessEffects: {
              expenses: 11000,
              employeeMorale: 6,
            },

            outcome: {
              headline:
                "Sipho stayed, but salary cost increased.",

              lesson:
                "Salary can solve an immediate retention risk, but may not solve long-term development needs.",
            },
          },

          {
            id: "sipho-bonus-path",

            text:
              "I cannot match that permanently today. I can offer a retention bonus and formal development milestones.",

            tone:
              "Balanced",

            trustChange: 9,
            sentimentChange: 8,

            businessEffects: {
              cash: -12000,
              employeeMorale: 6,
              risk: -2,
            },

            outcome: {
              headline:
                "You balanced affordability with retention.",

              lesson:
                "Flexible reward structures can reduce permanent cost while recognising employee value.",
            },
          },
        ],
      },


      pressureReply: {
        speaker:
          "Sipho Dlamini",

        text:
          "I have been committed. That's why I wanted to speak to you directly before making a decision.",

        responses: [
          {
            id: "sipho-recover",

            text:
              "You're right. I responded defensively. Let's talk properly about what you need to stay.",

            tone:
              "Accountable",

            trustChange: 8,
            sentimentChange: 7,

            businessEffects: {
              employeeMorale: 3,
              risk: -1,
            },

            outcome: {
              headline:
                "You recovered from a poor opening response.",

              lesson:
                "Leadership credibility can improve when a founder acknowledges a poor response and corrects it.",
            },
          },

          {
            id: "sipho-let-go",

            text:
              "If the other opportunity is better for you, I understand.",

            tone:
              "Detached",

            trustChange: -20,
            sentimentChange: -24,

            businessEffects: {
              employees: -1,
              employeeMorale: -8,
              risk: 7,
            },

            outcome: {
              headline:
                "Sipho decided to leave.",

              lesson:
                "Allowing key people to leave can protect payroll cost while creating capability and continuity risk.",
            },
          },
        ],
      },
    },
  },


  supplierNegotiation: {
    id:
      "supplier-negotiation",

    day: 4,

    characterId:
      "supplier",

    title:
      "Supplier Negotiation",

    subtitle:
      "Peter has informed you that supplier prices will increase by 12%.",

    opening: {
      speaker:
        "Peter Jacobs",

      text:
        "Our input costs have increased and we need to apply a 12% price increase from next month.",
    },

    steps: {
      opening: {
        responses: [
          {
            id:
              "supplier-volume",

            text:
              "We value the relationship. What can you offer if we commit to higher monthly volumes?",

            tone:
              "Commercial",

            trustChange: 6,
            sentimentChange: 5,

            next:
              "volumeReply",
          },

          {
            id:
              "supplier-threat",

            text:
              "Twelve percent is too high. We will move to another supplier if you cannot reduce it.",

            tone:
              "Aggressive",

            trustChange: -10,
            sentimentChange: -10,

            next:
              "threatReply",
          },

          {
            id:
              "supplier-understand",

            text:
              "Can you show me what is driving the increase before we decide?",

            tone:
              "Analytical",

            trustChange: 5,
            sentimentChange: 4,

            next:
              "understandSupplierReply",
          },
        ],
      },


      volumeReply: {
        speaker:
          "Peter Jacobs",

        text:
          "If you commit to a six-month volume agreement, I can reduce the increase to 5%.",

        responses: [
          {
            id:
              "supplier-agree-volume",

            text:
              "Let's agree, but I want quarterly reviews built into the contract.",

            tone:
              "Strategic",

            trustChange: 9,
            sentimentChange: 8,

            businessEffects: {
              expenses: 7000,
              risk: -3,
            },

            outcome: {
              headline:
                "You negotiated a lower increase and protected the relationship.",

              lesson:
                "Volume commitments can improve pricing but reduce flexibility.",
            },
          },
        ],
      },


      threatReply: {
        speaker:
          "Peter Jacobs",

        text:
          "I understand, but we cannot continue on the current price. If you move, I need to know before the next order cycle.",

        responses: [
          {
            id:
              "supplier-switch-final",

            text:
              "Understood. We will move future orders elsewhere.",

            tone:
              "Firm",

            trustChange: -20,
            sentimentChange: -22,

            businessEffects: {
              expenses: -5000,
              risk: 6,
            },

            outcome: {
              headline:
                "You reduced cost but ended a supplier relationship.",

              lesson:
                "Lower prices can introduce switching, quality and continuity risk.",
            },
          },

          {
            id:
              "supplier-backtrack",

            text:
              "Let's not rush. Can we look at a phased increase instead?",

            tone:
              "Repairing",

            trustChange: 4,
            sentimentChange: 4,

            businessEffects: {
              expenses: 9000,
              risk: -2,
            },

            outcome: {
              headline:
                "You recovered the relationship and negotiated a phased increase.",

              lesson:
                "Negotiations can recover after tension if both parties return to problem-solving.",
            },
          },
        ],
      },


      understandSupplierReply: {
        speaker:
          "Peter Jacobs",

        text:
          "Freight and imported component costs account for most of the change. We can reduce the impact if you accept longer lead times.",

        responses: [
          {
            id:
              "supplier-leadtime",

            text:
              "We can accept slightly longer lead times in exchange for a smaller price increase.",

            tone:
              "Trade-off",

            trustChange: 8,
            sentimentChange: 7,

            businessEffects: {
              expenses: 6000,
              risk: 1,
            },

            outcome: {
              headline:
                "You traded speed for lower cost.",

              lesson:
                "Strong negotiation often means trading variables instead of arguing about one number.",
            },
          },
        ],
      },
    },
  },
};


export const getConversationForDay = (
  day
) => {
  return (
    Object.values(
      CONVERSATIONS
    ).find(
      (conversation) =>
        conversation.day === day
    ) || null
  );
};


export const startConversation = (
  conversation
) => {
  if (!conversation) {
    return null;
  }

  return {
    conversationId:
      conversation.id,

    characterId:
      conversation.characterId,

    currentStep:
      "opening",

    messages: [
      {
        id:
          `msg-opening-${Date.now()}`,

        speaker:
          conversation.opening
            .speaker,

        text:
          conversation.opening
            .text,

        type:
          "character",
      },
    ],

    trustChange: 0,

    sentimentChange: 0,

    businessEffects: {},

    completed: false,

    outcome: null,
  };
};


const mergeEffects = (
  current,
  incoming
) => {
  const result = {
    ...current,
  };

  Object.entries(
    incoming || {}
  ).forEach(
    ([key, value]) => {
      result[key] =
        (result[key] || 0) +
        value;
    }
  );

  return result;
};


export const chooseConversationResponse = (
  conversation,
  session,
  response
) => {
  if (
    !conversation ||
    !session ||
    !response ||
    session.completed
  ) {
    return session;
  }


  const userMessage = {
    id:
      `msg-user-${Date.now()}`,

    speaker:
      "You",

    text:
      response.text,

    tone:
      response.tone,

    type:
      "entrepreneur",
  };


  let messages = [
    ...session.messages,
    userMessage,
  ];


  let trustChange =
    session.trustChange +
    (response.trustChange ||
      0);


  let sentimentChange =
    session.sentimentChange +
    (response.sentimentChange ||
      0);


  let businessEffects =
    mergeEffects(
      session.businessEffects,
      response.businessEffects
    );


  if (response.outcome) {
    return {
      ...session,

      messages,

      trustChange,
      sentimentChange,
      businessEffects,

      completed: true,

      outcome:
        response.outcome,
    };
  }


  const nextStep =
    conversation.steps[
      response.next
    ];


  if (!nextStep) {
    return {
      ...session,

      messages,

      trustChange,
      sentimentChange,
      businessEffects,

      completed: true,

      outcome: {
        headline:
          "Conversation completed.",

        lesson:
          "Communication choices affect business relationships.",
      },
    };
  }


  messages = [
    ...messages,

    {
      id:
        `msg-character-${Date.now()}`,

      speaker:
        nextStep.speaker,

      text:
        nextStep.text,

      type:
        "character",
    },
  ];


  return {
    ...session,

    currentStep:
      response.next,

    messages,

    trustChange,
    sentimentChange,
    businessEffects,
  };
};


export const getCurrentResponses = (
  conversation,
  session
) => {
  if (
    !conversation ||
    !session ||
    session.completed
  ) {
    return [];
  }

  return (
    conversation.steps[
      session.currentStep
    ]?.responses || []
  );
};
