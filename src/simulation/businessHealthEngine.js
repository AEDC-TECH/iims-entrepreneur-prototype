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


export const calculateBusinessHealth = (
  business = {}
) => {
  const profitability =
    getProfitabilityScore(
      business
    );


  const liquidity =
    getLiquidityScore(
      business
    );


  const debt =
    getDebtScore(
      business
    );


  const risk =
    clamp(
      100 -
      Number(
        business.risk ||
        0
      )
    );


  const customers =
    clamp(
      business.customerSatisfaction ??
      50
    );


  const people =
    clamp(
      business.employeeMorale ??
      business.morale ??
      50
    );


  return Math.round(
    clamp(
      profitability * 0.25 +
      liquidity * 0.20 +
      debt * 0.20 +
      risk * 0.15 +
      customers * 0.10 +
      people * 0.10
    )
  );
};
