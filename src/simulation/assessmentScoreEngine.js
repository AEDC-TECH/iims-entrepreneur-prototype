import {
  calculateBusinessHealth,
} from "./businessHealthEngine";

const clamp = (
  value,
  minimum = 0,
  maximum = 100
) =>
  Math.max(
    minimum,
    Math.min(
      maximum,
      Number(value || 0)
    )
  );


const average = (
  values
) => {
  const valid =
    values.filter(
      (value) =>
        Number.isFinite(
          Number(value)
        )
    );


  if (!valid.length) {
    return 0;
  }


  return (
    valid.reduce(
      (
        total,
        value
      ) =>
        total +
        Number(value),
      0
    ) /
    valid.length
  );
};


const uniqueCount = (
  items
) =>
  new Set(
    (items || [])
      .map(
        (item) =>
          typeof item ===
          "string"
            ? item
            : (
                item?.id ||
                item?.taskId ||
                JSON.stringify(item)
              )
      )
  ).size;


/* =========================================================
   CAPABILITY SCORE
   ---------------------------------------------------------
   Skills begin around 50 and move according to decisions.
   Completion itself adds NOTHING here.
========================================================= */

const getCapabilityScore = (
  state
) => {
  const skills =
    state?.skills ||
    {};


  const values = [
    skills.cashFlow,
    skills.financialPlanning,
    skills.peopleManagement,
    skills.customerManagement,
    skills.pricing,
    skills.riskManagement,
    skills.fundingDecisions,
    skills.growthStrategy,
  ].map(
    (value) =>
      clamp(
        value ?? 50
      )
  );


  return Math.round(
    average(values)
  );
};


/* =========================================================
   PROFITABILITY
========================================================= */

const getProfitabilityScore = (
  business
) => {
  const revenue =
    Number(
      business?.revenue ||
      0
    );

  const expenses =
    Number(
      business?.expenses ||
      0
    );


  if (revenue <= 0) {
    return 0;
  }


  const margin =
    (
      revenue -
      expenses
    ) /
    revenue;


  if (margin >= 0.20) {
    return 100;
  }

  if (margin >= 0.10) {
    return 85;
  }

  if (margin >= 0.05) {
    return 75;
  }

  if (margin >= 0) {
    return 60;
  }

  if (margin >= -0.10) {
    return 40;
  }

  if (margin >= -0.25) {
    return 20;
  }


  return 5;
};


/* =========================================================
   LIQUIDITY
========================================================= */

const getLiquidityScore = (
  business
) => {
  const cash =
    Number(
      business?.cash ||
      0
    );

  const expenses =
    Math.max(
      1,
      Number(
        business?.expenses ||
        0
      )
    );


  if (cash < 0) {
    return 0;
  }


  const monthsCover =
    cash /
    expenses;


  if (monthsCover >= 2) {
    return 100;
  }

  if (monthsCover >= 1.5) {
    return 90;
  }

  if (monthsCover >= 1) {
    return 75;
  }

  if (monthsCover >= 0.5) {
    return 50;
  }

  if (monthsCover > 0) {
    return 30;
  }


  return 10;
};


/* =========================================================
   DEBT HEALTH
========================================================= */

const getDebtScore = (
  business
) => {
  const debt =
    Math.max(
      0,
      Number(
        business?.debt ||
        0
      )
    );


  if (debt === 0) {
    return 100;
  }


  const assets =
    Math.max(
      1,
      Number(
        business?.assets ||
        0
      )
    );


  const revenue =
    Math.max(
      1,
      Number(
        business?.revenue ||
        0
      )
    );


  const leverage =
    debt /
    assets;


  const debtToRevenue =
    debt /
    revenue;


  let leverageScore = 0;


  if (leverage <= 0.25) {
    leverageScore = 100;
  } else if (leverage <= 0.40) {
    leverageScore = 85;
  } else if (leverage <= 0.60) {
    leverageScore = 65;
  } else if (leverage <= 0.80) {
    leverageScore = 40;
  } else if (leverage <= 1) {
    leverageScore = 20;
  } else {
    leverageScore = 5;
  }


  let revenueScore = 0;


  if (debtToRevenue <= 0.5) {
    revenueScore = 100;
  } else if (debtToRevenue <= 1) {
    revenueScore = 80;
  } else if (debtToRevenue <= 1.5) {
    revenueScore = 55;
  } else if (debtToRevenue <= 2.5) {
    revenueScore = 30;
  } else {
    revenueScore = 10;
  }


  return Math.round(
    (
      leverageScore +
      revenueScore
    ) /
    2
  );
};


/* =========================================================
   BUSINESS HEALTH
========================================================= */

const getBusinessHealthScore = (
  state
) =>
  calculateBusinessHealth(
    state?.business ||
    {}
  );


/* =========================================================
   CREDIT DISCIPLINE
========================================================= */

const getCreditDiscipline = (
  state
) => {
  const creditEvents =
    state
      ?.financing
      ?.creditEvents ||
    [];


  const missedFromCredit =
    creditEvents.filter(
      (event) =>
        String(
          event?.type ||
          ""
        )
          .toUpperCase()
          .includes(
            "MISSED"
          )
    ).length;


  const partialFromCredit =
    creditEvents.filter(
      (event) =>
        String(
          event?.type ||
          ""
        )
          .toUpperCase()
          .includes(
            "PARTIAL"
          )
    ).length;


  const loans =
    state
      ?.financing
      ?.loans ||
    [];


  let missedFromLoans = 0;
  let partialFromLoans = 0;


  loans.forEach(
    (loan) => {
      const history = [
        ...(loan.payments || []),
        ...(loan.paymentHistory || []),
      ];


      history.forEach(
        (payment) => {
          const value =
            String(
              payment?.status ||
              payment?.decision ||
              payment?.type ||
              ""
            ).toUpperCase();


          if (
            value.includes(
              "MISS"
            )
          ) {
            missedFromLoans += 1;
          }


          if (
            value.includes(
              "PARTIAL"
            )
          ) {
            partialFromLoans += 1;
          }
        }
      );
    }
  );


  /*
   * The same missed payment may exist in both
   * loan history and credit events, so use MAX,
   * not the sum.
   */
  const missed =
    Math.max(
      missedFromCredit,
      missedFromLoans
    );


  const partial =
    Math.max(
      partialFromCredit,
      partialFromLoans
    );


  return {
    missed,
    partial,

    score:
      clamp(
        100 -
        missed * 25 -
        partial * 8
      ),
  };
};


/* =========================================================
   TASK / MANAGEMENT DISCIPLINE
========================================================= */

const getTaskDiscipline = (
  state
) => {
  const completed =
    uniqueCount(
      state?.completedTasks
    );


  const postponed =
    uniqueCount(
      state?.postponedTasks
    );


  const total =
    completed +
    postponed;


  if (!total) {
    return 70;
  }


  return Math.round(
    clamp(
      (
        completed /
        total
      ) *
      100
    )
  );
};


/* =========================================================
   ISSUE MANAGEMENT
========================================================= */

const getIssueDiscipline = (
  state
) => {
  const issues =
    state?.businessIssues ||
    [];


  if (!issues.length) {
    return 85;
  }


  const unresolved =
    issues.filter(
      (issue) => {
        const status =
          String(
            issue?.status ||
            ""
          ).toLowerCase();


        return !(
          issue?.resolved ===
            true ||
          status ===
            "resolved" ||
          status ===
            "closed"
        );
      }
    ).length;


  return clamp(
    100 -
    unresolved * 18
  );
};


/* =========================================================
   OPERATIONS DISCIPLINE
========================================================= */

const getOperationsScore = (
  state
) => {
  const operations =
    state?.operations;


  if (!operations) {
    return 70;
  }


  const capacity =
    clamp(
      operations.capacity ??
      70
    );


  const equipment =
    clamp(
      operations.equipmentHealth ??
      70
    );


  const delivery =
    clamp(
      operations.deliveryPerformance ??
      70
    );


  const backlogScore =
    clamp(
      100 -
      Number(
        operations.backlog ||
        0
      ) *
      8
    );


  return Math.round(
    average([
      capacity,
      equipment,
      delivery,
      backlogScore,
    ])
  );
};


/* =========================================================
   MANAGEMENT DISCIPLINE
========================================================= */

const getManagementDisciplineScore = (
  state
) => {
  const task =
    getTaskDiscipline(
      state
    );


  const credit =
    getCreditDiscipline(
      state
    );


  const issues =
    getIssueDiscipline(
      state
    );


  const operations =
    getOperationsScore(
      state
    );


  const score =
    task * 0.35 +
    credit.score * 0.35 +
    issues * 0.15 +
    operations * 0.15;


  return {
    score:
      Math.round(
        clamp(score)
      ),

    taskScore:
      task,

    creditScore:
      credit.score,

    issueScore:
      issues,

    operationsScore:
      operations,

    missedPayments:
      credit.missed,

    partialPayments:
      credit.partial,
  };
};


/* =========================================================
   RESULT BAND
========================================================= */

const getScoreBand = (
  score
) => {
  if (score >= 85) {
    return {
      band:
        "EXCELLENT",

      message:
        "You demonstrated strong business judgement across the simulation and finished with a well-managed overall performance.",
    };
  }


  if (score >= 75) {
    return {
      band:
        "VERY GOOD",

      message:
        "You demonstrated good business judgement and handled most major management challenges effectively.",
    };
  }


  if (score >= 60) {
    return {
      band:
        "COMPETENT",

      message:
        "You achieved the IIMS pass standard. Your decisions demonstrated sufficient practical business judgement, with some areas still available for development.",
    };
  }


  if (score >= 50) {
    return {
      band:
        "DEVELOPING",

      message:
        "You completed the full business journey, but your decisions did not yet meet the IIMS pass standard. Review the development areas identified in your results.",
    };
  }


  if (score >= 35) {
    return {
      band:
        "SIGNIFICANT DEVELOPMENT REQUIRED",

      message:
        "You completed the simulation, but several decisions exposed significant gaps in financial, operational or management judgement.",
    };
  }


  return {
    band:
      "HIGH DEVELOPMENT NEED",

    message:
      "The simulation identified major development needs. Use the detailed results and recommended learning support before attempting the journey again.",
  };
};


/* =========================================================
   FINAL IIMS SCORE
   ---------------------------------------------------------
   COMPLETION = eligibility to receive final result.
   COMPLETION DOES NOT ADD POINTS.

   45% Entrepreneur Capability
   40% Business Health
   15% Management Discipline
========================================================= */

export const getFinalAssessmentScore = (
  state
) => {
  const capabilityScore =
    getCapabilityScore(
      state
    );


  const businessHealthScore =
    getBusinessHealthScore(
      state
    );


  const management =
    getManagementDisciplineScore(
      state
    );


  const overallScore =
    Math.round(
      clamp(
        capabilityScore *
          0.45 +
        businessHealthScore *
          0.40 +
        management.score *
          0.15
      )
    );


  const passMark =
    60;


  const passed =
    overallScore >=
    passMark;


  const result =
    getScoreBand(
      overallScore
    );


  return {
    overallScore,

    passMark,

    passed,

    band:
      result.band,

    message:
      result.message,

    capabilityScore,

    businessHealthScore,

    managementDisciplineScore:
      management.score,

    management,

    /*
     * Completion is reported separately.
     * It does not influence the score.
     */
    monthsCompleted:
      uniqueCount(
        state?.completedDays
      ),

    journeyCompleted:
      uniqueCount(
        state?.completedDays
      ) >= 12 ||
      Number(
        state?.currentDay ||
        0
      ) > 12,
  };
};
