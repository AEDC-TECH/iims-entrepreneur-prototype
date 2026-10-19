const DAY_MS = 24 * 60 * 60 * 1000;

const STAGES = [
  {
    day: 1,
    month: "January",
    title: "Growth Opportunity",
    focus: "Growth",
  },

  {
    day: 2,
    month: "February",
    title: "Cash-Flow Pressure",
    focus: "Cash Flow",
  },

  {
    day: 3,
    month: "March",
    title: "People Management",
    focus: "People",
  },

  {
    day: 4,
    month: "April",
    title: "Pricing & Supplier Pressure",
    focus: "Pricing",
  },

  {
    day: 5,
    month: "May",
    title: "Funding & Ownership",
    focus: "Funding",
  },

  {
    day: 6,
    month: "June",
    title: "Competition & Strategy",
    focus: "Strategy",
  },

  {
    day: 7,
    month: "July",
    title: "Growth Pressure",
    focus: "Operations & Growth",
  },

  {
    day: 8,
    month: "August",
    title: "Customer & Market Pressure",
    focus: "Customers & Market",
  },

  {
    day: 9,
    month: "September",
    title: "Operational Crisis",
    focus: "Operations & Resilience",
  },

  {
    day: 10,
    month: "October",
    title: "Expansion Decision",
    focus: "Expansion",
  },

  {
    day: 11,
    month: "November",
    title: "Financial Performance",
    focus: "Financial Management",
  },

  {
    day: 12,
    month: "December",
    title: "Year-End Strategy & Review",
    focus: "Strategy & Review",
  },
];


export const getSimulationMode = () =>
  import.meta.env
    .VITE_SIMULATION_MODE ||
  "demo";


const startOfDay = (value) => {
  const date = new Date(value);

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};


export const getUnlockDate = (
  startedAt,
  stageDay
) => {
  const start =
    startOfDay(startedAt);

  return new Date(
    start.getTime() +
      (stageDay - 1) * DAY_MS
  );
};


export const formatUnlockDate = (
  date
) =>
  new Intl.DateTimeFormat(
    "en-ZA",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    }
  ).format(date);


export const isStageUnlocked = (
  state,
  stageDay
) => {
  if (
    getSimulationMode() ===
    "demo"
  ) {
    return true;
  }

  const unlockDate =
    getUnlockDate(
      state.startedAt,
      stageDay
    );

  const today =
    startOfDay(new Date());

  return today >= unlockDate;
};


export const getHoursUntilUnlock = (
  state,
  stageDay
) => {
  if (
    isStageUnlocked(
      state,
      stageDay
    )
  ) {
    return 0;
  }

  const unlockDate =
    getUnlockDate(
      state.startedAt,
      stageDay
    );

  const difference =
    unlockDate.getTime() -
    Date.now();

  return Math.max(
    0,
    Math.ceil(
      difference /
        (60 * 60 * 1000)
    )
  );
};


export const getJourneyStages = (
  state
) => {
  const completed =
    new Set(
      state.completedDays || []
    );

  return STAGES.map(
    (stage) => {
      const unlocked =
        isStageUnlocked(
          state,
          stage.day
        );

      const isCurrent =
        stage.day ===
        state.currentDay;

      const isCompleted =
        completed.has(
          stage.day
        ) ||
        stage.day <
          state.currentDay;

      const unlockDate =
        getUnlockDate(
          state.startedAt,
          stage.day
        );

      let status = "locked";

      if (isCompleted) {
        status = "completed";
      } else if (isCurrent) {
        status = unlocked
          ? "current"
          : "locked";
      } else if (unlocked) {
        status = "available";
      }

      return {
        ...stage,

        status,

        unlocked,

        isCurrent,

        isCompleted,

        unlockDate,

        unlockLabel:
          formatUnlockDate(
            unlockDate
          ),

        hoursUntilUnlock:
          getHoursUntilUnlock(
            state,
            stage.day
          ),
      };
    }
  );
};


export const getJourneyProgress = (
  state
) => {
  const stages =
    getJourneyStages(state);

  const completed =
    stages.filter(
      (stage) =>
        stage.isCompleted
    ).length;

  return {
    completed,

    total: stages.length,

    percent:
      Math.round(
        (completed /
          stages.length) *
          100
      ),

    stages,
  };
};
