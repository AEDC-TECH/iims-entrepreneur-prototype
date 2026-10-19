const money = (value) =>
  new Intl.NumberFormat(
    "en-ZA",
    {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0,
    }
  ).format(
    Number(value || 0)
  );


const makeOption = (
  value,
  label
) => ({
  value,
  label,
});


export const getDecisionReflectionContext = ({
  simulation,
  currentScenario,
  selectedDecisionId,
}) => {
  const currentDay =
    Number(
      simulation?.currentDay ||
      0
    );


  const options = [];


  const add = (
    value,
    label
  ) => {
    if (
      !label ||
      options.some(
        (item) =>
          item.value === value ||
          item.label === label
      )
    ) {
      return;
    }


    options.push(
      makeOption(
        value,
        label
      )
    );
  };


  // ========================================================
  // FIND THE DECISION ACTUALLY MADE
  // ========================================================

  const committedDecision =
    [
      ...(
        simulation?.decisions ||
        []
      ),
    ]
      .reverse()
      .find(
        (item) =>
          Number(
            item.day
          ) === currentDay
      );


  const selectedDecision =
    currentScenario
      ?.decisions
      ?.find(
        (item) =>
          item.id ===
          selectedDecisionId
      );


  const decision =
    committedDecision ||
    selectedDecision ||
    null;


  // ========================================================
  // MONTH 9 — WORKING CAPITAL CRISIS
  // Uses the ACTUAL values recorded by the transaction.
  // ========================================================

  const workingCapital =
    simulation
      ?.workingCapitalCrisis;


  if (
    workingCapital
      ?.resolved === true &&
    Number(
      workingCapital.day
    ) === currentDay
  ) {
    const required =
      Number(
        workingCapital
          .requiredAmount ||
        0
      );


    const cashUsed =
      Number(
        workingCapital
          .cashContribution ||
        0
      );


    const financeAmount =
      Number(
        workingCapital
          .financeAmount ||
        0
      );


    const cashBefore =
      Number(
        workingCapital
          .cashBefore ||
        0
      );


    const cashAfter =
      Number(
        workingCapital
          .cashAfter ||
        0
      );


    const monthlyPayment =
      Number(
        workingCapital
          .newMonthlyPayment ||
        0
      );


    const loanTerms =
      workingCapital
        .loanTerms;


    const choice =
      workingCapital.choice;


    // ------------------------------------------------------
    // FULL SHORT-TERM FINANCE
    // ------------------------------------------------------

    if (
      choice ===
      "SHORT_TERM"
    ) {
      add(
        "protect-operating-cash",

        `I wanted to protect operating cash instead of using ${money(
          required
        )} immediately`
      );


      add(
        "spread-recovery-cost",

        `I wanted to solve the ${money(
          required
        )} operational problem now and spread the cost over ${
          loanTerms?.termMonths ||
          6
        } months`
      );


      if (
        monthlyPayment >
        0
      ) {
        add(
          "afford-repayment",

          `I believed the business could afford the new repayment of ${money(
            monthlyPayment
          )} per month`
        );
      }


      if (
        Number(
          loanTerms
            ?.totalInterest ||
          0
        ) > 0
      ) {
        add(
          "accept-interest",

          `I accepted approximately ${money(
            loanTerms.totalInterest
          )} in projected interest because protecting operating cash was more important`
        );
      }


      add(
        "keep-cash-available",

        `I wanted to keep the company's ${money(
          cashBefore
        )} cash available for salaries, suppliers and other operating costs`
      );
    }


    // ------------------------------------------------------
    // FULL CASH PAYMENT
    // ------------------------------------------------------

    if (
      choice === "CASH"
    ) {
      add(
        "avoid-borrowing",

        `I wanted to avoid borrowing and use ${money(
          required
        )} of company cash instead`
      );


      add(
        "cash-was-enough",

        `I believed the business could pay the ${money(
          required
        )} recovery cost and still operate with ${money(
          cashAfter
        )} remaining`
      );


      add(
        "avoid-monthly-payment",

        `I preferred paying ${money(
          required
        )} now rather than creating another monthly loan repayment`
      );


      add(
        "avoid-interest",

        `I wanted to avoid paying interest on the ${money(
          required
        )} recovery requirement`
      );


      add(
        "accept-cash-reduction",

        `I accepted reducing company cash from ${money(
          cashBefore
        )} to ${money(
          cashAfter
        )} because restoring operations was more important`
      );
    }


    // ------------------------------------------------------
    // BLENDED CASH + FINANCE
    // ------------------------------------------------------

    if (
      choice ===
      "BLENDED"
    ) {
      add(
        "split-funding",

        `I wanted to use ${money(
          cashUsed
        )} of company cash and finance the remaining ${money(
          financeAmount
        )}`
      );


      add(
        "protect-part-of-cash",

        `I wanted to contribute to the recovery while still keeping ${money(
          cashAfter
        )} available in the business`
      );


      if (
        monthlyPayment >
        0
      ) {
        add(
          "smaller-repayment",

          `I believed the ${money(
            monthlyPayment
          )} monthly repayment was more manageable than financing the full ${money(
            required
          )}`
        );
      }


      add(
        "borrow-less",

        `I wanted to borrow only ${money(
          financeAmount
        )} instead of financing the full ${money(
          required
        )}`
      );


      add(
        "balance-cash-and-debt",

        `I wanted to balance using ${money(
          cashUsed
        )} today with protecting enough cash for normal operations`
      );
    }


    // ------------------------------------------------------
    // DELAY
    // ------------------------------------------------------

    if (
      choice === "DELAY"
    ) {
      add(
        "avoid-spending-now",

        `I wanted to avoid spending ${money(
          required
        )} immediately`
      );


      add(
        "avoid-loan",

        `I did not want the business to borrow money for the ${money(
          required
        )} recovery requirement`
      );


      add(
        "protect-current-cash",

        `I wanted to keep the company's ${money(
          cashBefore
        )} available for other business obligations`
      );


      add(
        "believed-delay-possible",

        `I believed the business could temporarily manage without committing the full ${money(
          required
        )} immediately`
      );


      add(
        "accept-operational-risk",

        "I accepted the risk of lower capacity, a larger backlog and delayed deliveries because protecting cash was more important"
      );
    }


    return {
      decision: {
        title:
          workingCapital.title ||
          "Working-capital decision",

        description:
          workingCapital
            .explanation ||
          "",
      },

      options: [
        ...options.slice(
          0,
          6
        ),

        makeOption(
          "other",
          "Other — I had a different reason"
        ),
      ],
    };
  }


  // ========================================================
  // MONTH 11 — ACTUAL STRATEGIC DEBT REPAYMENT
  // ========================================================

  const strategicDebtPayment =
    [
      ...(
        simulation?.activityLog ||
        []
      ),
    ]
      .reverse()
      .find(
        (item) =>
          item.type ===
            "STRATEGIC_DEBT_REDUCTION" &&
          Number(
            item.day
          ) === currentDay
      );


  if (
    strategicDebtPayment
  ) {
    const repayment =
      Number(
        strategicDebtPayment
          .amount ||
        0
      );


    const cashAfter =
      Number(
        simulation
          ?.business
          ?.cash ||
        0
      );


    const debtAfter =
      Number(
        simulation
          ?.business
          ?.debt ||
        0
      );


    add(
      "reduce-real-debt",

      `I wanted to use ${money(
        repayment
      )} to reduce the company's outstanding debt`
    );


    add(
      "reduce-future-interest",

      `I believed repaying ${money(
        repayment
      )} now would reduce future interest and debt pressure`
    );


    add(
      "cash-remains-sufficient",

      `I believed the business could repay ${money(
        repayment
      )} and still operate with ${money(
        cashAfter
      )} remaining in cash`
    );


    add(
      "improve-debt-position",

      `I wanted to reduce total outstanding debt to approximately ${money(
        debtAfter
      )}`
    );


    add(
      "accept-liquidity-tradeoff",

      `I accepted using ${money(
        repayment
      )} of company liquidity because reducing debt was more important`
    );


    return {
      decision:
        decision || {
          title:
            "Strategic debt repayment",
        },

      options: [
        ...options,

        makeOption(
          "other",
          "Other — I had a different reason"
        ),
      ],
    };
  }


  // ========================================================
  // NORMAL SCENARIO DECISIONS
  // ========================================================

  if (decision) {
    const title =
      String(
        decision.title ||
        decision.description ||
        "this decision"
      );


    const searchable =
      `${decision.id || ""} ${title} ${
        decision.description ||
        ""
      }`
        .toLowerCase();


    const effects =
      decision.immediateEffects ||
      decision.effects ||
      {};


    const cashEffect =
      Number(
        effects.cash || 0
      );


    const debtEffect =
      Number(
        effects.debt || 0
      );


    const revenueEffect =
      Number(
        effects.revenue || 0
      );


    const expenseEffect =
      Number(
        effects.expenses || 0
      );


    if (
      cashEffect < 0
    ) {
      add(
        "actual-cash-cost",

        `I believed the expected business benefit justified using ${money(
          Math.abs(
            cashEffect
          )
        )} of company cash`
      );
    }


    if (
      debtEffect > 0
    ) {
      add(
        "actual-new-debt",

        `I believed taking on ${money(
          debtEffect
        )} of additional debt was manageable`
      );
    }


    if (
      revenueEffect > 0
    ) {
      add(
        "actual-revenue-gain",

        `I expected this decision to improve revenue by approximately ${money(
          revenueEffect
        )}`
      );
    }


    if (
      expenseEffect > 0
    ) {
      add(
        "actual-extra-cost",

        `I accepted approximately ${money(
          expenseEffect
        )} in additional costs because I expected a stronger business outcome`
      );
    }


    // ------------------------------------------------------
    // BANK FINANCE
    // ------------------------------------------------------

    if (
      searchable.includes(
        "loan"
      ) ||
      searchable.includes(
        "bank"
      ) ||
      searchable.includes(
        "finance"
      ) ||
      searchable.includes(
        "borrow"
      )
    ) {
      const offer =
        simulation
          ?.financing
          ?.lastLoanOffer;


      const approved =
        Number(
          offer?.approvedAmount ||
          0
        );


      const repayment =
        Number(
          offer?.monthlyPayment ||
          0
        );


      const interest =
        Number(
          offer?.totalInterest ||
          0
        );


      if (
        approved > 0
      ) {
        add(
          "loan-amount-reason",

          `I wanted access to ${money(
            approved
          )} without using the same amount of existing company cash`
        );
      }


      if (
        repayment > 0
      ) {
        add(
          "loan-repayment-reason",

          `I believed the business could afford the repayment of ${money(
            repayment
          )} per month`
        );
      }


      if (
        interest > 0
      ) {
        add(
          "loan-interest-reason",

          `I accepted approximately ${money(
            interest
          )} in projected interest because I expected the investment to create greater value`
        );
      }
    }


    // ------------------------------------------------------
    // DELAY
    // ------------------------------------------------------

    if (
      searchable.includes(
        "delay"
      ) ||
      searchable.includes(
        "postpone"
      ) ||
      searchable.includes(
        "wait"
      )
    ) {
      add(
        "delay-cash",

        "I wanted to preserve company cash instead of committing money immediately"
      );


      add(
        "delay-consequences",

        "I believed the business could manage the consequences of waiting"
      );
    }


    // ------------------------------------------------------
    // OPERATIONS
    // ------------------------------------------------------

    if (
      searchable.includes(
        "equipment"
      ) ||
      searchable.includes(
        "repair"
      ) ||
      searchable.includes(
        "capacity"
      ) ||
      searchable.includes(
        "operation"
      )
    ) {
      add(
        "restore-capacity",

        "I wanted to restore operating capacity before the problem became more expensive"
      );


      add(
        "protect-delivery",

        "I wanted to prevent further delivery delays and backlog growth"
      );
    }


    // ------------------------------------------------------
    // CUSTOMER
    // ------------------------------------------------------

    if (
      searchable.includes(
        "customer"
      ) ||
      searchable.includes(
        "client"
      )
    ) {
      add(
        "protect-customer",

        "I wanted to protect the customer relationship and the future revenue attached to it"
      );
    }


    // ------------------------------------------------------
    // PEOPLE
    // ------------------------------------------------------

    if (
      searchable.includes(
        "employee"
      ) ||
      searchable.includes(
        "staff"
      ) ||
      searchable.includes(
        "team"
      )
    ) {
      add(
        "protect-team",

        "I wanted to protect employee performance, morale and business capability"
      );
    }


    // ------------------------------------------------------
    // FALLBACK REASONS
    // ------------------------------------------------------

    if (
      options.length < 4
    ) {
      add(
        "long-term-outcome",

        `I believed "${title}" offered the strongest long-term outcome for the business`
      );


      add(
        "accepted-tradeoff",

        `I understood the risks of "${title}" but believed the benefits were greater`
      );


      add(
        "business-position",

        `Based on the company's financial position, I believed "${title}" was the most responsible decision`
      );
    }


    return {
      decision,

      options: [
        ...options.slice(
          0,
          6
        ),

        makeOption(
          "other",
          "Other — I had a different reason"
        ),
      ],
    };
  }


  // ========================================================
  // ONLY USED IF NO DECISION CAN BE IDENTIFIED
  // ========================================================

  return {
    decision: null,

    options: [
      makeOption(
        "protect-financial-position",
        "I wanted to protect the company's financial position"
      ),

      makeOption(
        "reduce-risk",
        "I wanted to reduce the risk facing the business"
      ),

      makeOption(
        "long-term",
        "I believed this offered the strongest long-term outcome"
      ),

      makeOption(
        "other",
        "Other — I had a different reason"
      ),
    ],
  };
};
