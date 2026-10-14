const clamp = (
  value,
  min,
  max
) =>
  Math.min(
    max,
    Math.max(
      min,
      value
    )
  );


export const CHARACTER_LIBRARY = {
  sipho: {
    id: "sipho",

    name:
      "Sipho Dlamini",

    role:
      "Senior Developer",

    organisation:
      "Ubuntu Digital Solutions",

    type:
      "EMPLOYEE",

    initials:
      "SD",

    baseTrust: 65,

    baseSentiment: 70,

    personality:
      "Committed but ambitious",

    motivation:
      "Career growth, recognition and meaningful responsibility",

    bio:
      "Sipho is one of the company's most experienced employees and has become increasingly important as the business grows.",
  },


  nalediCustomer: {
    id:
      "nalediCustomer",

    name:
      "Naledi Khumalo",

    role:
      "Operations Director",

    organisation:
      "Mokoena Retail Group",

    type:
      "CUSTOMER",

    initials:
      "NK",

    baseTrust: 72,

    baseSentiment: 74,

    personality:
      "Professional and demanding",

    motivation:
      "Reliable delivery, value for money and responsive service",

    bio:
      "Naledi manages one of Ubuntu Digital Solutions' important customer relationships.",
  },


  bankManager: {
    id:
      "bankManager",

    name:
      "David Naidoo",

    role:
      "Business Banking Manager",

    organisation:
      "Ubuntu Commercial Bank",

    type:
      "LENDER",

    initials:
      "DN",

    baseTrust: 60,

    baseSentiment: 60,

    personality:
      "Analytical and risk-conscious",

    motivation:
      "Repayment reliability, transparency and financial discipline",

    bio:
      "David assesses the company's borrowing capacity and monitors repayment risk.",
  },


  investor: {
    id:
      "investor",

    name:
      "Zanele Maseko",

    role:
      "Investment Partner",

    organisation:
      "Imbokodo Growth Capital",

    type:
      "INVESTOR",

    initials:
      "ZM",

    baseTrust: 62,

    baseSentiment: 64,

    personality:
      "Strategic and performance-driven",

    motivation:
      "Growth, governance and long-term enterprise value",

    bio:
      "Zanele may become an external shareholder if the founder chooses equity funding.",
  },


  supplier: {
    id:
      "supplier",

    name:
      "Peter Jacobs",

    role:
      "Account Manager",

    organisation:
      "TechSource Supplies",

    type:
      "SUPPLIER",

    initials:
      "PJ",

    baseTrust: 68,

    baseSentiment: 68,

    personality:
      "Commercial but relationship-focused",

    motivation:
      "Predictable orders, timely payment and long-term business",

    bio:
      "Peter manages a supplier relationship that affects the company's pricing and operating costs.",
  },
};


const createCharacterState = (
  character
) => ({
  ...character,

  trust:
    character.baseTrust,

  sentiment:
    character.baseSentiment,

  relationshipStatus:
    "Neutral",

  memories: [],

  lastInteractionDay:
    null,

  active: true,
});


export const ensureCharacters = (
  state
) => {
  const existing =
    state.relationships ||
    {
      characters: {},
      interactions: [],
    };

  const characters = {
    ...existing.characters,
  };


  Object.values(
    CHARACTER_LIBRARY
  ).forEach(
    (character) => {
      if (
        !characters[
          character.id
        ]
      ) {
        characters[
          character.id
        ] =
          createCharacterState(
            character
          );
      }
    }
  );


  return {
    ...state,

    relationships: {
      ...existing,
      characters,
    },
  };
};


const getRelationshipStatus = (
  trust
) => {
  if (trust >= 85) {
    return "Highly Trusted";
  }

  if (trust >= 70) {
    return "Strong";
  }

  if (trust >= 50) {
    return "Stable";
  }

  if (trust >= 30) {
    return "Strained";
  }

  return "At Risk";
};


export const updateRelationship = (
  state,
  {
    characterId,
    trustChange = 0,
    sentimentChange = 0,
    memory,
    interactionType =
      "DECISION",
  }
) => {
  const prepared =
    ensureCharacters(state);

  const character =
    prepared.relationships
      .characters[
      characterId
    ];


  if (!character) {
    return prepared;
  }


  const trust =
    clamp(
      character.trust +
        trustChange,
      0,
      100
    );

  const sentiment =
    clamp(
      character.sentiment +
        sentimentChange,
      0,
      100
    );


  const memoryRecord = {
    id:
      `memory-${characterId}-${Date.now()}`,

    day:
      prepared.currentDay,

    text:
      memory,

    trustChange,

    sentimentChange,

    createdAt:
      new Date().toISOString(),
  };


  const updatedCharacter = {
    ...character,

    trust,

    sentiment,

    relationshipStatus:
      getRelationshipStatus(
        trust
      ),

    memories: [
      ...character.memories,
      memoryRecord,
    ],

    lastInteractionDay:
      prepared.currentDay,
  };


  const interaction = {
    id:
      `interaction-${Date.now()}`,

    characterId,

    characterName:
      character.name,

    type:
      interactionType,

    day:
      prepared.currentDay,

    memory,

    trustChange,

    sentimentChange,

    createdAt:
      new Date().toISOString(),
  };


  return {
    ...prepared,

    relationships: {
      ...prepared.relationships,

      characters: {
        ...prepared
          .relationships
          .characters,

        [characterId]:
          updatedCharacter,
      },

      interactions: [
        ...prepared
          .relationships
          .interactions,

        interaction,
      ],
    },

    lastRelationshipOutcome: {
      characterId,

      characterName:
        character.name,

      memory,

      trust,

      trustChange,

      sentimentChange,
    },
  };
};


export const getCharacter = (
  state,
  characterId
) => {
  const prepared =
    ensureCharacters(state);

  return (
    prepared.relationships
      .characters[
      characterId
    ] || null
  );
};


export const getRelationshipDashboard = (
  state
) => {
  const prepared =
    ensureCharacters(state);

  const characters =
    Object.values(
      prepared.relationships
        .characters
    );


  const activeCharacters =
    characters.filter(
      (character) =>
        character.active
    );


  const averageTrust =
    activeCharacters.length
      ? Math.round(
          activeCharacters.reduce(
            (
              total,
              character
            ) =>
              total +
              character.trust,
            0
          ) /
            activeCharacters.length
        )
      : 0;


  const strongest =
    [...activeCharacters]
      .sort(
        (a, b) =>
          b.trust -
          a.trust
      )[0];


  const weakest =
    [...activeCharacters]
      .sort(
        (a, b) =>
          a.trust -
          b.trust
      )[0];


  return {
    characters:
      activeCharacters,

    averageTrust,

    strongest,

    weakest,

    interactions:
      [
        ...prepared
          .relationships
          .interactions,
      ].reverse(),
  };
};
