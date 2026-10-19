export const getRelationshipEvents = (
  state
) => {
  const characters =
    state.relationships
      ?.characters || {};

  const events = [];


  const employee =
    characters.sipho;

  if (
    employee &&
    state.currentDay >= 5 &&
    employee.trust >= 80
  ) {
    events.push({
      id:
        "sipho-project-rescue",

      characterId:
        "sipho",

      type:
        "POSITIVE",

      title:
        "Sipho steps up during a difficult project",

      message:
        "Because of the trust built earlier, Sipho voluntarily takes responsibility for an urgent customer problem.",

      effect: {
        customerSatisfaction: 4,
        employeeMorale: 2,
        risk: -3,
      },

      explanation:
        "Earlier people-management decisions strengthened employee commitment.",
    });
  }


  if (
    employee &&
    state.currentDay >= 5 &&
    employee.trust < 35
  ) {
    events.push({
      id:
        "sipho-resignation",

      characterId:
        "sipho",

      type:
        "RISK",

      title:
        "Sipho submits his resignation",

      message:
        "The relationship has deteriorated and the employee no longer sees a future with the company.",

      effect: {
        employees: -1,
        employeeMorale: -8,
        risk: 7,
      },

      explanation:
        "Repeated relationship damage created a delayed people consequence.",
    });
  }


  const customer =
    characters.nalediCustomer;

  if (
    customer &&
    state.currentDay >= 5 &&
    customer.trust >= 82
  ) {
    events.push({
      id:
        "customer-referral-memory",

      characterId:
        "nalediCustomer",

      type:
        "POSITIVE",

      title:
        "Naledi refers another company",

      message:
        "The customer relationship has become strong enough for Naledi to recommend your company to another business.",

      effect: {
        customers: 1,
        revenue: 15000,
      },

      explanation:
        "Strong customer trust created a commercial opportunity.",
    });
  }


  if (
    customer &&
    state.currentDay >= 5 &&
    customer.trust < 38
  ) {
    events.push({
      id:
        "customer-cancels-memory",

      characterId:
        "nalediCustomer",

      type:
        "RISK",

      title:
        "Naledi decides not to renew the contract",

      message:
        "Earlier relationship problems have accumulated and the customer has decided to leave.",

      effect: {
        customers: -1,
        revenue: -18000,
        customerSatisfaction: -5,
      },

      explanation:
        "Customer trust deteriorated over several earlier decisions.",
    });
  }


  const bank =
    characters.bankManager;

  if (
    bank &&
    state.currentDay >= 6 &&
    bank.trust >= 75
  ) {
    events.push({
      id:
        "bank-flexible-terms",

      characterId:
        "bankManager",

      type:
        "POSITIVE",

      title:
        "The bank offers improved repayment terms",

      message:
        "David's confidence in management has improved enough for him to offer more flexible repayment terms.",

      effect: {
        expenses: -5000,
        risk: -3,
      },

      explanation:
        "Financial discipline improved lender confidence.",
    });
  }


  const supplier =
    characters.supplier;

  if (
    supplier &&
    state.currentDay >= 6 &&
    supplier.trust >= 75
  ) {
    events.push({
      id:
        "supplier-better-terms",

      characterId:
        "supplier",

      type:
        "POSITIVE",

      title:
        "Supplier offers extended payment terms",

      message:
        "Peter offers the company additional time to pay because the commercial relationship has remained strong.",

      effect: {
        cash: 15000,
        risk: -2,
      },

      explanation:
        "Supplier trust created additional working-capital flexibility.",
    });
  }


  return events;
};
