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


export const isJourneyComplete = (
  state
) => {
  const completedDays =
    state.completedDays || [];

  return (
    completedDays.includes(6) ||
    (
      state.currentDay === 6 &&
      state.dayComplete
    )
  );
};


export const getAssessmentStatus = (
  state
) => {
  const decisions =
    (state.decisions || [])
      .length;

  const completedDays =
    (state.completedDays || [])
      .length;

  const complete =
    isJourneyComplete(
      state
    );


  if (complete) {
    return {
      id:
        "complete",

      label:
        "Final Assessment",

      title:
        "Assessment Complete",

      description:
        "The entrepreneur has completed the full simulation journey. Business outcomes and capability findings can now be treated as final for this simulation run.",

      isFinal: true,

      tone:
        "complete",
    };
  }


  if (decisions === 0) {
    return {
      id:
        "not-started",

      label:
        "Assessment Pending",

      title:
        "Assessment in Progress",

      description:
        "There is not enough behavioural evidence yet to assess this entrepreneur. Complete simulation decisions to begin building the development profile.",

      isFinal: false,

      tone:
        "pending",
    };
  }


  if (completedDays <= 2) {
    return {
      id:
        "early",

      label:
        "Early Evidence",

      title:
        "Early Assessment Evidence",

      description:
        "IIMS has started observing decision patterns, but it is too early to draw a final conclusion about business capability or likely business outcome.",

      isFinal: false,

      tone:
        "early",
    };
  }


  return {
    id:
      "provisional",

    label:
      "Provisional Assessment",

    title:
      "Provisional Business Position",

    description:
      "Enough evidence exists to identify emerging strengths and development priorities, but the final business outcome can still change.",

    isFinal: false,

    tone:
      "provisional",
  };
};


export const getEvidenceReadiness = (
  state
) => {
  const decisions =
    (state.decisions || [])
      .length;

  const reflections =
    (state.reflections || [])
      .length;

  const completedDays =
    (state.completedDays || [])
      .length;

  const conversations =
    (state.activityLog || [])
      .filter(
        (item) =>
          item.type ===
          "CONVERSATION"
      )
      .length;

  const tasks =
    (state.completedTasks || [])
      .length;


  let score = 0;

  score +=
    Math.min(
      decisions,
      6
    ) * 8;

  score +=
    Math.min(
      completedDays,
      6
    ) * 6;

  score +=
    Math.min(
      reflections,
      6
    ) * 3;

  score +=
    Math.min(
      conversations,
      3
    ) * 3;

  score +=
    Math.min(
      tasks,
      8
    ) * 1;


  return clamp(
    Math.round(score),
    0,
    100
  );
};


export const getMvpReadiness = (
  state
) => {
  const assessment =
    getAssessmentStatus(
      state
    );

  const evidenceReadiness =
    getEvidenceReadiness(
      state
    );


  return {
    assessment,

    evidenceReadiness,

    simulationProgress:
      clamp(
        Math.round(
          (
            (
              state.completedDays ||
              []
            ).length /
            6
          ) *
            100
        ),
        0,
        100
      ),

    reportReady:
      assessment.isFinal,

    advisorReady:
      (
        state.decisions || []
      ).length >= 3,

    impactReady:
      (
        state.decisions || []
      ).length >= 1,
  };
};
