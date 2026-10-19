export const getDecisionRelationshipEffects = (
  decisionId
) => {
  const map = {
    "growth-hire": [
      {
        characterId:
          "sipho",

        trustChange: 5,

        sentimentChange: 4,

        memory:
          "The founder invested in additional staff instead of forcing the existing team to absorb all the growth.",
      },
    ],


    "growth-contractors": [
      {
        characterId:
          "sipho",

        trustChange: 2,

        sentimentChange: 1,

        memory:
          "The founder used temporary capacity to protect the existing team's workload.",
      },
    ],


    "cash-request-payment": [
      {
        characterId:
          "nalediCustomer",

        trustChange: -2,

        sentimentChange: -2,

        memory:
          "The company pushed for faster payment during a cash-flow problem.",
      },
    ],


    "cash-accept-delay": [
      {
        characterId:
          "nalediCustomer",

        trustChange: 5,

        sentimentChange: 6,

        memory:
          "The founder gave the customer additional payment flexibility during a difficult period.",
      },

      {
        characterId:
          "bankManager",

        trustChange: -3,

        sentimentChange: -2,

        memory:
          "The company accepted slower customer payment even though its own liquidity was under pressure.",
      },
    ],


    "cash-short-term-loan": [
      {
        characterId:
          "bankManager",

        trustChange: 4,

        sentimentChange: 2,

        memory:
          "The founder used bank finance to manage a short-term cash-flow gap.",
      },
    ],


    "people-raise": [
      {
        characterId:
          "sipho",

        trustChange: 10,

        sentimentChange: 12,

        memory:
          "The founder approved a salary increase in response to the employee's retention concerns.",
      },
    ],


    "people-bonus": [
      {
        characterId:
          "sipho",

        trustChange: 7,

        sentimentChange: 8,

        memory:
          "The founder recognised performance using a bonus rather than permanently increasing fixed salary cost.",
      },
    ],


    "people-development": [
      {
        characterId:
          "sipho",

        trustChange: 9,

        sentimentChange: 10,

        memory:
          "The founder invested in development and created a future review plan instead of responding only with money.",
      },
    ],


    "people-leave": [
      {
        characterId:
          "sipho",

        trustChange: -30,

        sentimentChange: -35,

        memory:
          "The founder allowed the employee to leave rather than improving the retention offer.",
      },
    ],


    "pricing-negotiate": [
      {
        characterId:
          "supplier",

        trustChange: 5,

        sentimentChange: 4,

        memory:
          "The company negotiated for better supplier terms instead of immediately switching suppliers.",
      },
    ],


    "pricing-switch": [
      {
        characterId:
          "supplier",

        trustChange: -18,

        sentimentChange: -20,

        memory:
          "The company moved business to a cheaper supplier.",
      },
    ],


    "fund-bank": [
      {
        characterId:
          "bankManager",

        trustChange: 8,

        sentimentChange: 4,

        memory:
          "The founder selected bank debt to fund expansion.",
      },
    ],


    "fund-equity": [
      {
        characterId:
          "investor",

        trustChange: 15,

        sentimentChange: 12,

        memory:
          "The founder brought Zanele into the company as an external shareholder.",
      },
    ],


    "fund-self": [
      {
        characterId:
          "investor",

        trustChange: -2,

        sentimentChange: -1,

        memory:
          "The founder chose to preserve full ownership instead of accepting an investor.",
      },
    ],


    "competition-value": [
      {
        characterId:
          "nalediCustomer",

        trustChange: 9,

        sentimentChange: 8,

        memory:
          "The company responded to competition by improving customer value instead of cutting prices aggressively.",
      },
    ],


    "competition-match": [
      {
        characterId:
          "nalediCustomer",

        trustChange: 1,

        sentimentChange: 2,

        memory:
          "The company reduced prices to match competitors.",
      },

      {
        characterId:
          "bankManager",

        trustChange: -4,

        sentimentChange: -3,

        memory:
          "The business responded to competition by sacrificing margin.",
      },
    ],
  };


  return (
    map[decisionId] ||
    []
  );
};
