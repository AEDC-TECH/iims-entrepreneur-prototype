const baseMessages = {
  1: [
    {
      id: "day1-main",
      type: "CUSTOMER",
      sender: "Mokoena Retail Group",
      subject: "Major contract expansion",
      preview:
        "We want Ubuntu Digital Solutions to take over additional services...",
      priority: "OPPORTUNITY",
      time: "08:15",
      linkedScenario: true,
    },

    {
      id: "day1-accountant",
      type: "ACCOUNTANT",
      sender: "Naledi - Accountant",
      subject: "Cash reserve reminder",
      preview:
        "Expansion may require cash before the customer starts paying.",
      priority: "INFO",
      time: "09:05",
      linkedScenario: false,
      body:
        "Growth often requires working capital before additional revenue is collected. Consider staffing, equipment and supplier costs.",
    },
  ],

  2: [
    {
      id: "day2-main",
      type: "CUSTOMER",
      sender: "Thabo - Mokoena Retail",
      subject: "Payment delayed",
      preview:
        "Our finance department cannot settle the R80,000 invoice this month...",
      priority: "URGENT",
      time: "08:07",
      linkedScenario: true,
    },

    {
      id: "day2-payroll",
      type: "FINANCE",
      sender: "Payroll",
      subject: "Salary run due Friday",
      preview:
        "Ensure enough cash remains available for payroll.",
      priority: "URGENT",
      time: "08:45",
      linkedScenario: false,
      body:
        "Payroll must still be paid even when customer collections are delayed.",
    },
  ],

  3: [
    {
      id: "day3-main",
      type: "EMPLOYEE",
      sender: "Lerato - Operations Manager",
      subject: "Request for salary review",
      preview:
        "I have received interest from another company...",
      priority: "IMPORTANT",
      time: "08:30",
      linkedScenario: true,
    },

    {
      id: "day3-team",
      type: "EMPLOYEE",
      sender: "Operations Team",
      subject: "Team pressure increasing",
      preview:
        "Workload has increased during recent growth.",
      priority: "IMPORTANT",
      time: "10:15",
      linkedScenario: false,
      body:
        "Several team members are reporting increased workload and fatigue.",
    },
  ],

  4: [
    {
      id: "day4-main",
      type: "SUPPLIER",
      sender: "TechSource Suppliers",
      subject: "Prices increasing by 12%",
      preview:
        "Higher import and logistics costs will affect pricing next month...",
      priority: "URGENT",
      time: "08:05",
      linkedScenario: true,
    },

    {
      id: "day4-sales",
      type: "SALES",
      sender: "Sales Team",
      subject: "Customers remain price sensitive",
      preview:
        "Several customers have recently asked for discounts.",
      priority: "INFO",
      time: "09:40",
      linkedScenario: false,
      body:
        "Some customers have become more price sensitive. Any increase should be communicated carefully and linked to value.",
    },

    {
      id: "day4-finance",
      type: "FINANCE",
      sender: "Naledi - Accountant",
      subject: "Margin warning",
      preview:
        "Supplier increases will reduce profit if selling prices remain unchanged.",
      priority: "IMPORTANT",
      time: "11:20",
      linkedScenario: false,
      body:
        "If input costs rise while customer prices stay unchanged, gross and operating margins will weaken.",
    },
  ],

  5: [
    {
      id: "day5-main",
      type: "ADVISOR",
      sender: "Naledi - Finance Advisor",
      subject: "R300,000 automation opportunity",
      preview:
        "The business could improve capacity through equipment and automation...",
      priority: "OPPORTUNITY",
      time: "08:10",
      linkedScenario: true,
    },

    {
      id: "day5-bank",
      type: "BANK",
      sender: "Business Banking",
      subject: "Expansion finance available",
      preview:
        "A R300,000 expansion facility may be available.",
      priority: "OFFER",
      time: "09:25",
      linkedScenario: false,
      body:
        "The facility would allow the company to retain ownership, but regular repayments and interest would increase fixed financial obligations.",
    },

    {
      id: "day5-investor",
      type: "INVESTOR",
      sender: "Ubuntu Growth Capital",
      subject: "Equity investment interest",
      preview:
        "We may invest R300,000 in exchange for 15% ownership.",
      priority: "OFFER",
      time: "10:40",
      linkedScenario: false,
      body:
        "Equity funding does not create loan repayments, but the investor would become a shareholder and participate in future company value.",
    },
  ],

  6: [
    {
      id: "day6-main",
      type: "SALES",
      sender: "Sales Team",
      subject: "Competitor cuts prices by 15%",
      preview:
        "Two customers have asked whether we will match the competitor...",
      priority: "URGENT",
      time: "08:20",
      linkedScenario: true,
    },

    {
      id: "day6-customer",
      type: "CUSTOMER",
      sender: "Long-term Customer",
      subject: "Why should we stay?",
      preview:
        "A competitor has offered us lower pricing.",
      priority: "IMPORTANT",
      time: "09:30",
      linkedScenario: false,
      body:
        "We value your service, but another provider has offered lower pricing. We need to understand what additional value we receive by staying.",
    },

    {
      id: "day6-marketing",
      type: "ADVISOR",
      sender: "Marketing Advisor",
      subject: "Competing on value",
      preview:
        "Price is only one reason customers choose a supplier.",
      priority: "INFO",
      time: "11:15",
      linkedScenario: false,
      body:
        "Customer experience, reliability, specialist knowledge, trust and service quality can all create competitive differentiation.",
    },
  ],
};

const hasDecision = (
  state,
  decisionId
) =>
  state.decisions.some(
    (decision) =>
      decision.decisionId ===
      decisionId
  );

const dynamicMessages = (
  day,
  state
) => {
  const messages = [];

  if (
    day >= 2 &&
    hasDecision(
      state,
      "growth-hire"
    )
  ) {
    messages.push({
      id: `growth-payroll-${day}`,
      type: "HR",
      sender: "HR & Payroll",
      subject:
        "New employees entered payroll",
      preview:
        "The growth decision has increased recurring salary costs.",
      priority: "IMPORTANT",
      time: "07:30",
      linkedScenario: false,
      body:
        "The employees hired for the new contract are now part of the company's recurring salary obligations.",
    });
  }

  if (
    day >= 3 &&
    hasDecision(
      state,
      "cash-short-term-loan"
    )
  ) {
    messages.push({
      id: `cash-loan-${day}`,
      type: "BANK",
      sender: "Business Banking",
      subject:
        "Working-capital loan repayment",
      preview:
        "Your earlier funding decision continues affecting cash.",
      priority: "URGENT",
      time: "07:35",
      linkedScenario: false,
      body:
        "The short-term loan helped solve a liquidity problem, but repayments now reduce cash available for other activities.",
    });
  }

  if (
    day >= 5 &&
    hasDecision(
      state,
      "pricing-absorb"
    )
  ) {
    messages.push({
      id: `margin-pressure-${day}`,
      type: "FINANCE",
      sender: "Naledi - Accountant",
      subject:
        "Operating margin has weakened",
      preview:
        "Absorbing supplier costs is reducing profitability.",
      priority: "URGENT",
      time: "07:50",
      linkedScenario: false,
      body:
        "The business protected customers from the supplier price increase, but the additional cost is now reducing operating margin.",
    });
  }

  if (
    day >= 6 &&
    hasDecision(
      state,
      "pricing-raise"
    )
  ) {
    messages.push({
      id: `pricing-feedback-${day}`,
      type: "CUSTOMER",
      sender: "Customer Success",
      subject:
        "Customers questioning price increase",
      preview:
        "Several customers want justification for the new prices.",
      priority: "IMPORTANT",
      time: "07:45",
      linkedScenario: false,
      body:
        "The pricing increase protected some margin, but customers now expect a clear explanation of the value they receive.",
    });
  }

  if (
    day >= 6 &&
    hasDecision(
      state,
      "fund-bank"
    )
  ) {
    messages.push({
      id: `expansion-loan-${day}`,
      type: "BANK",
      sender: "Business Banking",
      subject:
        "Expansion loan repayment active",
      preview:
        "The R300,000 expansion facility has entered repayment.",
      priority: "URGENT",
      time: "07:15",
      linkedScenario: false,
      body:
        "The company retained founder ownership, but debt servicing now places additional pressure on monthly cash flow.",
    });
  }

  if (
    day >= 6 &&
    hasDecision(
      state,
      "fund-equity"
    )
  ) {
    messages.push({
      id: `investor-review-${day}`,
      type: "INVESTOR",
      sender: "Ubuntu Growth Capital",
      subject:
        "Investor strategic review",
      preview:
        "Your new shareholder wants to discuss company performance.",
      priority: "IMPORTANT",
      time: "07:20",
      linkedScenario: false,
      body:
        "The investor does not require loan repayments, but now owns part of the business and expects information about strategy and performance.",
    });
  }

  return messages;
};

export const getMessagesForDay = (
  day,
  state
) => [
  ...(baseMessages[day] || []),
  ...dynamicMessages(
    day,
    state
  ),
];
