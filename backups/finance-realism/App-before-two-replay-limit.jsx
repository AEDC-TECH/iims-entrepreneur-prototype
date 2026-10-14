import {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./App.css";
import "./iims-theme.css";

import { scenarios } from "./simulation/scenarios";

import {
  getMessagesForDay,
} from "./simulation/businessMessages";

import {
  getRecoveryActions,
} from "./simulation/recoveryActions";

import {
  getAdaptiveScenario,
  getEntrepreneurProfile,
} from "./simulation/adaptiveEngine";

import {
  getAdvisorConversation,
  getLearningRecommendations,
} from "./simulation/learningEngine";

import {
  getTaskSummary,
  getTasksForDay,
  hasUnresolvedCriticalTasks,
} from "./simulation/taskEngine";

import {
  getJourneyProgress,
  getSimulationMode,
  isStageUnlocked,
} from "./simulation/journeyEngine";

import {
  generateBusinessEvent,
  getCurrentBusinessEvent,
} from "./simulation/eventEngine";

import {
  getBusinessWorld,
} from "./simulation/worldEngine";

import {
  getManagementTeam,
} from "./simulation/managementTeamEngine";

import {
  getCommandCentre,
} from "./simulation/commandCentreEngine";

import {
  getRelationshipDashboard,
} from "./simulation/relationshipEngine";

import {
  getRelationshipEvents,
} from "./simulation/relationshipEvents";

import {
  chooseConversationResponse,
  getConversationForDay,
  getCurrentResponses,
  startConversation,
} from "./simulation/conversationEngine";

import {
  getBranchingScenario,
  getBusinessPath,
} from "./simulation/storylineEngine";

import {
  getDeepConsequence,
  getReplayInsights,
  getSimulationDifficulty,
  getSimulationEnding,
} from "./simulation/deepConsequencesEngine";

import {
  getPerformanceReport,
} from "./simulation/reportEngine";

import {
  getMvpReadiness,
} from "./simulation/finalizationEngine";

import {
  getAchievements,
  getBusinessAlerts,
  getBusinessObjectives,
  getRecoveryState,
} from "./simulation/businessIntelligence";

import {
  advanceDay,
  applyRelationshipEvent,
  applyDeepConsequence,
  applyConversationOutcome,
  completeBusinessTask,
  postponeBusinessTask,
  registerBusinessEvent,
  resolveBusinessEvent,
  applyRecoveryAction,
  calculateBusinessHealth,
  calculateNetAssetPosition,
  calculateProfit,
  getAdvisorInsights,
  getFinancialDashboard,
  getQuarterReview,
  hasReflectionForCurrentDay,
  loadSimulation,
  makeDecision,
  resetSimulation,
  saveReflection,
  saveSimulation,
} from "./simulation/engine";

const MAX_MVP_DAY = 6;

const formatCurrency = (value) =>
  new Intl.NumberFormat(
    "en-ZA",
    {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0,
    }
  ).format(value);

const formatPercent = (value) =>
  `${Math.round(value * 10) / 10}%`;

const effectLabelMap = {
  cash: "Cash",
  revenue: "Revenue",
  expenses: "Expenses",
  assets: "Assets",
  liabilities: "Liabilities",
  debt: "Debt",
  receivables:
    "Outstanding invoices",
  employees: "Employees",
  customers: "Customers",
  customerSatisfaction:
    "Customer satisfaction",
  employeeMorale:
    "Employee morale",
  risk: "Business risk",
  founderOwnership: "Founder ownership",
};

const skillLabelMap = {
  cashFlow: "Cash Flow",
  financialPlanning:
    "Financial Planning",
  peopleManagement:
    "People Management",
  customerManagement:
    "Customer Management",
  pricing: "Pricing",
  riskManagement:
    "Risk Management",
  fundingDecisions:
    "Funding Decisions",
  growthStrategy:
    "Growth Strategy",
};

const reflectionReasons = [
  "I wanted to protect cash flow",
  "I wanted the business to grow",
  "I wanted to reduce risk",
  "I wanted to protect the customer relationship",
  "I wanted to protect employees",
  "I wanted to avoid additional debt",
  "I believed it offered the best long-term outcome",
  "Other",
];


import {
  acceptLoanOffer,
  calculateLoanOffer,
  getLoanPortfolio,
  processLoanPayments,
} from "./simulation/loanEngine";


function App() {
  const [
    simulation,
    setSimulation,
  ] = useState(
    () => loadSimulation()
  );

  const [
    activeView,
    setActiveView,
  ] = useState("business");

  const [
    loanApplicationOpen,
    setLoanApplicationOpen,
  ] = useState(false);

  const [
    loanAmount,
    setLoanAmount,
  ] = useState(300000);

  const [
    loanTermMonths,
    setLoanTermMonths,
  ] = useState(36);

  const [
    loanPurpose,
    setLoanPurpose,
  ] = useState(
    "Automation & equipment"
  );

  const [
    loanOffer,
    setLoanOffer,
  ] = useState(null);

  const [
    loanNotice,
    setLoanNotice,
  ] = useState("");

  const [
    selectedDecisionId,
    setSelectedDecisionId,
  ] = useState(null);

  const [
    selectedMessage,
    setSelectedMessage,
  ] = useState(null);

  const [
    reflectionReason,
    setReflectionReason,
  ] = useState("");

  const [
    reflectionConfidence,
    setReflectionConfidence,
  ] = useState(3);

  const [
    reflectionText,
    setReflectionText,
  ] = useState("");

  const [notice, setNotice] =
    useState("");

  const [
    selectedRecoveryActionId,
    setSelectedRecoveryActionId,
  ] = useState(null);

  const [
    recoveryNotice,
    setRecoveryNotice,
  ] = useState("");

  const [
    selectedTaskId,
    setSelectedTaskId,
  ] = useState(null);

  const [
    taskNotice,
    setTaskNotice,
  ] = useState("");

  const [
    selectedEventOptionId,
    setSelectedEventOptionId,
  ] = useState(null);

  const [
    eventNotice,
    setEventNotice,
  ] = useState("");

  const [
    conversationSession,
    setConversationSession,
  ] = useState(null);

  const [
    conversationNotice,
    setConversationNotice,
  ] = useState("");

  useEffect(() => {
    saveSimulation(simulation);
  }, [simulation]);


  const relationshipEvents =
    useMemo(
      () =>
        getRelationshipEvents(
          simulation
        ),
      [simulation]
    );

  const currentConversation =
    useMemo(
      () =>
        getConversationForDay(
          simulation.currentDay
        ),
      [simulation.currentDay]
    );

  const conversationResponses =
    useMemo(
      () =>
        getCurrentResponses(
          currentConversation,
          conversationSession
        ),
      [
        currentConversation,
        conversationSession,
      ]
    );

  const conversationCompletedToday =
    useMemo(
      () =>
        currentConversation
          ? (simulation.activityLog || [])
              .some(
                (item) =>
                  item.type ===
                    "CONVERSATION" &&
                  item.conversationId ===
                    currentConversation.id &&
                  item.day ===
                    simulation.currentDay
              )
          : false,
      [
        simulation.activityLog,
        simulation.currentDay,
        currentConversation,
      ]
    );

  useEffect(() => {
    setConversationSession(
      null
    );

    setConversationNotice(
      ""
    );
  }, [
    simulation.currentDay,
    currentConversation?.id,
  ]);

  useEffect(() => {
    if (
      simulation.currentDay < 5
    ) {
      return;
    }

    const alreadyTriggeredToday =
      (simulation.activityLog || [])
        .some(
          (item) =>
            item.type ===
              "RELATIONSHIP_EVENT" &&
            item.day ===
              simulation.currentDay
        );

    if (
      alreadyTriggeredToday
    ) {
      return;
    }

    const processedIds =
      new Set(
        (simulation.activityLog || [])
          .filter(
            (item) =>
              item.type ===
              "RELATIONSHIP_EVENT"
          )
          .map(
            (item) =>
              item.relationshipEventId
          )
      );

    const nextRelationshipEvent =
      relationshipEvents.find(
        (event) =>
          !processedIds.has(
            event.id
          )
      );

    if (
      !nextRelationshipEvent
    ) {
      return;
    }

    setSimulation(
      applyRelationshipEvent(
        simulation,
        nextRelationshipEvent
      )
    );
  }, [
    simulation.currentDay,
    relationshipEvents,
  ]);


  useEffect(() => {
    const existing =
      getCurrentBusinessEvent(
        simulation
      );

    if (existing) {
      return;
    }

    if (
      simulation.currentDay >
      MAX_MVP_DAY
    ) {
      return;
    }

    const event =
      generateBusinessEvent(
        simulation
      );

    setSimulation(
      registerBusinessEvent(
        simulation,
        event
      )
    );
  }, [
    simulation.currentDay,
  ]);

  const financial =
    useMemo(
      () =>
        getFinancialDashboard(
          simulation
        ),
      [simulation]
    );

  const entrepreneurProfile =
    useMemo(
      () =>
        getEntrepreneurProfile(
          simulation
        ),
      [simulation]
    );

  const learningRecommendations =
    useMemo(
      () =>
        getLearningRecommendations(
          simulation,
          entrepreneurProfile
        ),
      [
        simulation,
        entrepreneurProfile,
      ]
    );

  const advisorConversation =
    useMemo(
      () =>
        getAdvisorConversation(
          simulation,
          entrepreneurProfile,
          learningRecommendations
        ),
      [
        simulation,
        entrepreneurProfile,
        learningRecommendations,
      ]
    );

  const baseScenario =
    scenarios.find(
      (scenario) =>
        scenario.day ===
        simulation.currentDay
    );

  const adaptiveScenario =
    useMemo(
      () =>
        getAdaptiveScenario(
          baseScenario,
          simulation,
          entrepreneurProfile
        ),
      [
        baseScenario,
        simulation,
        entrepreneurProfile,
      ]
    );

  const currentScenario =
    useMemo(
      () =>
        getBranchingScenario(
          simulation,
          adaptiveScenario
        ),
      [
        simulation,
        adaptiveScenario,
      ]
    );

  const businessPath =
    useMemo(
      () =>
        getBusinessPath(
          simulation
        ),
      [simulation]
    );

  const simulationDifficulty =
    useMemo(
      () =>
        getSimulationDifficulty(
          simulation
        ),
      [simulation]
    );

  const simulationEnding =
    useMemo(
      () =>
        getSimulationEnding(
          simulation
        ),
      [simulation]
    );

  const replayInsights =
    useMemo(
      () =>
        getReplayInsights(
          simulation
        ),
      [simulation]
    );

  const performanceReport =
    useMemo(
      () =>
        getPerformanceReport(
          simulation
        ),
      [simulation]
    );

  const mvpReadiness =
    useMemo(
      () =>
        getMvpReadiness(
          simulation
        ),
      [simulation]
    );

  const deepConsequence =
    useMemo(
      () =>
        getDeepConsequence(
          simulation
        ),
      [simulation]
    );

  const messages = useMemo(
    () =>
      getMessagesForDay(
        simulation.currentDay,
        simulation
      ),
    [
      simulation.currentDay,
      simulation.decisions,
      simulation,
    ]
  );

  const advisor =
    useMemo(
      () =>
        getAdvisorInsights(
          simulation
        ),
      [simulation]
    );

  const quarterReview =
    useMemo(
      () =>
        getQuarterReview(
          simulation
        ),
      [simulation]
    );

  const reflectionCompleted =
    hasReflectionForCurrentDay(
      simulation
    );

  const businessAlerts =
    useMemo(
      () =>
        getBusinessAlerts(
          simulation
        ),
      [simulation]
    );

  const businessObjectives =
    useMemo(
      () =>
        getBusinessObjectives(
          simulation
        ),
      [simulation]
    );

  const achievements =
    useMemo(
      () =>
        getAchievements(
          simulation
        ),
      [simulation]
    );

  const recoveryState =
    useMemo(
      () =>
        getRecoveryState(
          simulation
        ),
      [simulation]
    );

  const availableRecoveryActions =
    useMemo(
      () =>
        getRecoveryActions(),
      []
    );

  const currentTasks =
    useMemo(
      () =>
        getTasksForDay(
          simulation.currentDay,
          simulation
        ),
      [
        simulation.currentDay,
        simulation,
      ]
    );

  const taskSummary =
    useMemo(
      () =>
        getTaskSummary(
          simulation.currentDay,
          simulation
        ),
      [
        simulation.currentDay,
        simulation,
      ]
    );

  const journeyProgress =
    useMemo(
      () =>
        getJourneyProgress(
          simulation
        ),
      [simulation]
    );

  const currentBusinessEvent =
    useMemo(
      () =>
        getCurrentBusinessEvent(
          simulation
        ),
      [simulation]
    );

  const businessWorld =
    useMemo(
      () =>
        getBusinessWorld(
          simulation
        ),
      [simulation]
    );

  const managementTeam =
    useMemo(
      () =>
        getManagementTeam(
          simulation,
          currentScenario,
          entrepreneurProfile
        ),
      [
        simulation,
        currentScenario,
        entrepreneurProfile,
      ]
    );

  const commandCentre =
    useMemo(
      () =>
        getCommandCentre({
          state: simulation,
          world:
            businessWorld,
          taskSummary,
          currentTasks,
          currentEvent:
            currentBusinessEvent,
          managementTeam,
          scenario:
            currentScenario,
        }),
      [
        simulation,
        businessWorld,
        taskSummary,
        currentTasks,
        currentBusinessEvent,
        managementTeam,
        currentScenario,
      ]
    );

  const relationshipDashboard =
    useMemo(
      () =>
        getRelationshipDashboard(
          simulation
        ),
      [simulation]
    );


  const loanPortfolio =
    useMemo(
      () =>
        getLoanPortfolio(
          simulation
        ),
      [simulation]
    );


  const simulationMode =
    getSimulationMode();

  const isFinished =
    simulation.currentDay >
    MAX_MVP_DAY;

  const handleDecision = () => {
    if (
      !selectedDecisionId ||
      !currentScenario
    ) {
      setNotice(
        "Choose a business decision first."
      );
      return;
    }

    const decision =
      currentScenario.decisions.find(
        (item) =>
          item.id ===
          selectedDecisionId
      );

    if (
      decision?.id ===
      "fund-bank"
    ) {
      setLoanAmount(300000);
      setLoanTermMonths(36);

      setLoanPurpose(
        "Automation & equipment"
      );

      setLoanOffer(null);
      setLoanNotice("");

      setLoanApplicationOpen(
        true
      );

      setActiveView(
        "finance"
      );



      return;
    }


    const currentScrollPosition =
      window.scrollY;

    const next =
      makeDecision(
        simulation,
        currentScenario,
        decision
      );

    setSimulation(next);
    setNotice("");

    /*
     * Confirming a decision changes the content
     * underneath the entrepreneur. Preserve their
     * current reading position instead of jumping
     * them elsewhere on the page.
     */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top:
            currentScrollPosition,
          left: 0,
          behavior: "auto",
        });
      });
    });
  };


  const handleGenerateLoanOffer = () => {
    const amount =
      Number(loanAmount);

    const term =
      Number(
        loanTermMonths
      );


    if (
      !Number.isFinite(amount) ||
      amount < 10000
    ) {
      setLoanNotice(
        "Enter a loan amount of at least R10,000."
      );

      return;
    }


    if (
      ![
        12,
        24,
        36,
        48,
        60,
      ].includes(term)
    ) {
      setLoanNotice(
        "Choose a valid repayment period."
      );

      return;
    }


    const offer =
      calculateLoanOffer(
        simulation,
        {
          amount,

          termMonths:
            term,

          purpose:
            loanPurpose,
        }
      );


    setLoanOffer(
      offer
    );

    setLoanNotice("");
  };


  const handleAcceptLoanOffer = () => {
    if (
      !loanOffer ||
      ![
        "APPROVED",
        "PARTIAL",
      ].includes(
        loanOffer.status
      )
    ) {
      setLoanNotice(
        "There is no approved loan offer to accept."
      );

      return;
    }


    const bankDecision =
      currentScenario?.decisions
        ?.find(
          (item) =>
            item.id ===
            "fund-bank"
        );


    if (!bankDecision) {
      setLoanNotice(
        "The bank-finance decision is no longer available."
      );

      return;
    }


    /*
     * First create the actual loan account.
     */
    let nextState =
      acceptLoanOffer(
        simulation,
        loanOffer
      );


    /*
     * The borrowed cash is immediately used for
     * the approved investment.
     *
     * This avoids treating borrowed cash itself
     * as profit or free money.
     */
    const investmentAmount =
      loanOffer.approvedAmount;


    const recordedDecision = {
      ...bankDecision,

      immediateEffects: {
        cash:
          -investmentAmount,

        assets:
          investmentAmount,

        risk:
          loanOffer.projectedDscr <
          1.3
            ? 8
            : 3,
      },

      delayedConsequences: [],

      outcome: {
        headline:
          `Bank finance accepted at ${loanOffer.interestRate}% interest`,

        explanation:
          `The business borrowed ${formatCurrency(
            investmentAmount
          )} over ${
            loanOffer.application
              .termMonths
          } months. The estimated monthly repayment is ${formatCurrency(
            loanOffer.monthlyPayment
          )}, with projected total interest of ${formatCurrency(
            loanOffer.totalInterest
          )}.`,

        lesson:
          "Borrowing creates immediate purchasing power, but the real cost includes interest, fees and future monthly repayments.",
      },
    };


    nextState =
      makeDecision(
        nextState,
        currentScenario,
        recordedDecision
      );


    setSimulation(
      nextState
    );

    setLoanApplicationOpen(
      false
    );

    setLoanOffer(null);

    setLoanNotice("");

    setActiveView(
      "business"
    );
  };


  const handleCancelLoanApplication = () => {
    setLoanApplicationOpen(
      false
    );

    setLoanOffer(null);

    setLoanNotice("");

    setActiveView(
      "business"
    );
  };


  const handleReflection = () => {
    if (!reflectionReason) {
      setNotice(
        "Select the main reason behind your decision."
      );
      return;
    }

    setSimulation(
      saveReflection(
        simulation,
        {
          reason:
            reflectionReason,
          confidence:
            reflectionConfidence,
          text:
            reflectionText,
        }
      )
    );

    setNotice("");
  };






  useEffect(() => {
    if (
      simulation.currentDay < 4 ||
      !deepConsequence
    ) {
      return;
    }


    const alreadyToday =
      (simulation.deepConsequences || [])
        .some(
          (item) =>
            item.day ===
            simulation.currentDay
        );


    if (alreadyToday) {
      return;
    }


    setSimulation(
      applyDeepConsequence(
        simulation,
        deepConsequence
      )
    );
  }, [
    simulation.currentDay,
    deepConsequence,
  ]);


  const handleStartConversation = () => {
    if (!currentConversation) {
      return;
    }

    setConversationSession(
      startConversation(
        currentConversation
      )
    );

    setConversationNotice("");
  };


  const handleConversationResponse = (
    response
  ) => {
    if (
      !currentConversation ||
      !conversationSession
    ) {
      return;
    }

    const nextSession =
      chooseConversationResponse(
        currentConversation,
        conversationSession,
        response
      );

    setConversationSession(
      nextSession
    );

    setConversationNotice("");
  };


  const handleCompleteConversation = () => {
    if (
      !currentConversation ||
      !conversationSession ||
      !conversationSession.completed
    ) {
      setConversationNotice(
        "Complete the conversation before closing it."
      );

      return;
    }

    setSimulation(
      applyConversationOutcome(
        simulation,
        currentConversation,
        conversationSession
      )
    );

    setConversationSession(
      null
    );

    setConversationNotice("");
  };


  const handleBusinessEvent = () => {
    if (
      !currentBusinessEvent
    ) {
      return;
    }

    if (
      !selectedEventOptionId
    ) {
      setEventNotice(
        "Choose how you want to respond to this business event."
      );

      return;
    }

    const option =
      currentBusinessEvent.options.find(
        (item) =>
          item.id ===
          selectedEventOptionId
      );

    if (!option) {
      return;
    }

    setSimulation(
      resolveBusinessEvent(
        simulation,
        currentBusinessEvent,
        option
      )
    );

    setSelectedEventOptionId(
      null
    );

    setEventNotice("");
  };


  const handleCompleteTask = () => {
    if (!selectedTaskId) {
      setTaskNotice(
        "Choose a business task first."
      );

      return;
    }

    const task =
      currentTasks.find(
        (item) =>
          item.id ===
          selectedTaskId
      );

    if (!task) {
      return;
    }

    setSimulation(
      completeBusinessTask(
        simulation,
        task
      )
    );

    setSelectedTaskId(null);

    setTaskNotice("");
  };


  const handlePostponeTask = () => {
    if (!selectedTaskId) {
      setTaskNotice(
        "Choose a business task first."
      );

      return;
    }

    const task =
      currentTasks.find(
        (item) =>
          item.id ===
          selectedTaskId
      );

    if (!task) {
      return;
    }

    if (
      task.priority === "CRITICAL"
    ) {
      setTaskNotice(
        "Critical tasks cannot be postponed again. Complete the task before continuing."
      );

      return;
    }

    setSimulation(
      postponeBusinessTask(
        simulation,
        task
      )
    );

    setSelectedTaskId(null);

    setTaskNotice("");
  };


  const handleRecoveryAction = () => {
    if (!selectedRecoveryActionId) {
      setRecoveryNotice(
        "Choose a recovery action first."
      );

      return;
    }

    const selected =
      availableRecoveryActions.find(
        (action) =>
          action.id ===
          selectedRecoveryActionId
      );

    if (!selected) {
      return;
    }

    const alreadyUsed =
      (simulation.recoveryActions || [])
        .some(
          (action) =>
            action.actionId ===
            selected.id
        );

    if (alreadyUsed) {
      setRecoveryNotice(
        "You have already used this recovery action in the current simulation."
      );

      return;
    }

    setSimulation(
      applyRecoveryAction(
        simulation,
        selected
      )
    );

    setSelectedRecoveryActionId(
      null
    );

    setRecoveryNotice("");
  };


  const handleNextDay = () => {
    if (
      currentBusinessEvent &&
      currentBusinessEvent.status !==
        "resolved"
    ) {
      setNotice(
        "An unexpected business event still needs your response before you can close this business stage."
      );

      return;
    }

    const nextStageDay =
      simulation.currentDay + 1;

    if (
      nextStageDay <= MAX_MVP_DAY &&
      !isStageUnlocked(
        simulation,
        nextStageDay
      )
    ) {
      setNotice(
        "Your next business stage has not opened yet. IIMS intentionally spaces the journey so you have time to reflect on today's decisions and outcomes."
      );

      return;
    }

    if (
      hasUnresolvedCriticalTasks(
        simulation.currentDay,
        simulation
      )
    ) {
      setNotice(
        "You still have a critical business task that must be completed before ending this business day."
      );

      return;
    }

    const recoveryTakenToday =
      (simulation.recoveryActions || []).some(
        (item) =>
          item.day === simulation.currentDay
      );

    if (
      simulation.currentDay === MAX_MVP_DAY &&
      recoveryState.level !== "normal" &&
      !recoveryTakenToday
    ) {
      setNotice(
        "Your business is under financial pressure. Complete at least one recovery action before closing this business period."
      );

      return;
    }

    const result =
      advanceDay(simulation);

    if (result.blocked) {
      setNotice(result.reason);
      return;
    }

    const nextState =
      simulation.currentDay <
        MAX_MVP_DAY
        ? processLoanPayments(
            result.state
          )
        : result.state;


    setSimulation(
      nextState
    );

    setSelectedDecisionId(null);
    setSelectedMessage(null);
    setReflectionReason("");
    setReflectionConfidence(3);
    setReflectionText("");
    setNotice("");
    setActiveView("business");

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleReset = () => {
    const confirmed =
      window.confirm(
        "Restart the full simulation?"
      );

    if (!confirmed) return;

    setSimulation(
      resetSimulation()
    );

    setActiveView("business");
    setSelectedDecisionId(null);
    setSelectedMessage(null);
    setReflectionReason("");
    setReflectionText("");
    setReflectionConfidence(3);
    setNotice("");
  };

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeView}
        setActiveView={
          setActiveView
        }
        decisions={
          simulation.decisions.length
        }
      />

      <main className="main-content">
        <Topbar
          simulation={simulation}
          handleReset={
            handleReset
          }
        />

        <BusinessMetrics
          simulation={
            simulation
          }
          financial={
            financial
          }
        />

        {simulation
          .recentDelayedConsequences
          .length > 0 && (
          <DelayedConsequences
            items={
              simulation
                .recentDelayedConsequences
            }
          />
        )}

        {activeView ===
          "business" && (
          <BusinessView
            simulation={
              simulation
            }
            currentScenario={
              currentScenario
            }
            messages={messages}
            selectedDecisionId={
              selectedDecisionId
            }
            setSelectedDecisionId={
              setSelectedDecisionId
            }
            selectedMessage={
              selectedMessage
            }
            setSelectedMessage={
              setSelectedMessage
            }
            handleDecision={
              handleDecision
            }
            reflectionReason={
              reflectionReason
            }
            setReflectionReason={
              setReflectionReason
            }
            reflectionConfidence={
              reflectionConfidence
            }
            setReflectionConfidence={
              setReflectionConfidence
            }
            reflectionText={
              reflectionText
            }
            setReflectionText={
              setReflectionText
            }
            reflectionCompleted={
              reflectionCompleted
            }
            handleReflection={
              handleReflection
            }
            handleNextDay={
              handleNextDay
            }
            notice={notice}
            isFinished={
              isFinished
            }
            quarterReview={
              quarterReview
            }
            businessAlerts={
              businessAlerts
            }
            businessObjectives={
              businessObjectives
            }
            achievements={
              achievements
            }
            recoveryState={
              recoveryState
            }
            availableRecoveryActions={
              availableRecoveryActions
            }
            selectedRecoveryActionId={
              selectedRecoveryActionId
            }
            setSelectedRecoveryActionId={
              setSelectedRecoveryActionId
            }
            handleRecoveryAction={
              handleRecoveryAction
            }
            recoveryNotice={
              recoveryNotice
            }
            currentTasks={
              currentTasks
            }
            taskSummary={
              taskSummary
            }
            selectedTaskId={
              selectedTaskId
            }
            setSelectedTaskId={
              setSelectedTaskId
            }
            handleCompleteTask={
              handleCompleteTask
            }
            handlePostponeTask={
              handlePostponeTask
            }
            taskNotice={
              taskNotice
            }
            journeyProgress={
              journeyProgress
            }
            simulationMode={
              simulationMode
            }
            managementTeam={
              managementTeam
            }
            businessPath={
              businessPath
            }
            simulationDifficulty={
              simulationDifficulty
            }
            lastDeepConsequence={
              simulation.lastDeepConsequence
            }
            simulationEnding={
              simulationEnding
            }
            lastRelationshipEvent={
              simulation.lastRelationshipEvent
            }
            currentConversation={
              currentConversation
            }
            conversationSession={
              conversationSession
            }
            conversationResponses={
              conversationResponses
            }
            conversationCompletedToday={
              conversationCompletedToday
            }
            handleStartConversation={
              handleStartConversation
            }
            handleConversationResponse={
              handleConversationResponse
            }
            handleCompleteConversation={
              handleCompleteConversation
            }
            conversationNotice={
              conversationNotice
            }
            currentBusinessEvent={
              currentBusinessEvent
            }
            selectedEventOptionId={
              selectedEventOptionId
            }
            setSelectedEventOptionId={
              setSelectedEventOptionId
            }
            handleBusinessEvent={
              handleBusinessEvent
            }
            eventNotice={
              eventNotice
            }
            handleReset={
              handleReset
            }
                      setActiveView={
              setActiveView
            }
/>
        )}

        {activeView ===
          "inbox" && (
          <InboxView
            messages={messages}
            currentScenario={
              currentScenario
            }
            selectedMessage={
              selectedMessage
            }
            setSelectedMessage={
              setSelectedMessage
            }
            setActiveView={
              setActiveView
            }
          />
        )}

        {activeView ===
          "finance" && (
          <FinanceView
            simulation={
              simulation
            }
            financial={
              financial
            }
            loanPortfolio={
              loanPortfolio
            }
            loanApplicationOpen={
              loanApplicationOpen
            }
            loanAmount={
              loanAmount
            }
            setLoanAmount={
              setLoanAmount
            }
            loanTermMonths={
              loanTermMonths
            }
            setLoanTermMonths={
              setLoanTermMonths
            }
            loanPurpose={
              loanPurpose
            }
            setLoanPurpose={
              setLoanPurpose
            }
            loanOffer={
              loanOffer
            }
            loanNotice={
              loanNotice
            }
            handleGenerateLoanOffer={
              handleGenerateLoanOffer
            }
            handleAcceptLoanOffer={
              handleAcceptLoanOffer
            }
            handleCancelLoanApplication={
              handleCancelLoanApplication
            }
          />
        )}

        {activeView ===
          "command" && (
          <CommandCentreView
            commandCentre={
              commandCentre
            }
            simulation={
              simulation
            }
            setActiveView={
              setActiveView
            }
          />
        )}

        {activeView ===
          "world" && (
          <BusinessWorldView
            world={
              businessWorld
            }
            simulation={
              simulation
            }
          />
        )}

        {activeView ===
          "team" && (
          <ManagementTeamView
            managementTeam={
              managementTeam
            }
            simulation={
              simulation
            }
            scenario={
              currentScenario
            }
          />
        )}

        {activeView ===
          "relationships" && (
          <RelationshipsView
            dashboard={
              relationshipDashboard
            }
          />
        )}

        {activeView ===
          "reports" && (
          <PerformanceReportView
            report={
              performanceReport
            }
            simulation={
              simulation
            }
            readiness={
              mvpReadiness
            }
          />
        )}

        {activeView ===
          "progress" && (
          <ProgressView
            simulation={
              simulation
            }
          />
        )}

        {activeView ===
          "advisor" && (
          <AdvisorView
            simulation={
              simulation
            }
            advisor={advisor}
            financial={
              financial
            }
            entrepreneurProfile={
              entrepreneurProfile
            }
            learningRecommendations={
              learningRecommendations
            }
            advisorConversation={
              advisorConversation
            }
          />
        )}
      </main>
    </div>
  );
}

function Sidebar({
  activeView,
  setActiveView,
  decisions,
}) {
  const items = [
    ["business", "Business"],
    ["inbox", "Inbox"],
    ["command", "Command Centre"],
    ["finance", "Finance"],
    ["world", "Business World"],
    ["team", "Management Team"],
    ["relationships", "Relationships"],
    ["reports", "Reports"],
    ["progress", "Progress"],
    ["advisor", "Advisor"],
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          I
        </div>

        <div>
          <strong>IIMS</strong>
          <span>
            Business Simulation Lab
          </span>
        </div>
      </div>

      <nav className="side-nav">
        {items.map(
          ([id, label]) => (
            <button
              key={id}
              className={`nav-item ${
                activeView === id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveView(id)
              }
            >
              <span>{label}</span>

              {id ===
                "progress" && (
                <small>
                  {decisions}
                </small>
              )}
            </button>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        <span>MVP ALPHA 20</span>
        <small>
          IIMS experiential learning
        </small>
      </div>
    </aside>
  );
}

function Topbar({
  simulation,
  handleReset,
}) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">
          BUSINESS SURVIVAL
          SIMULATOR
        </p>

        <h1>
          {
            simulation.business
              .name
          }
        </h1>

        <p>
          Your decisions continue
          shaping this company.
        </p>
      </div>

      <div className="topbar-actions">
        <div className="day-indicator">
          <span>
            Current stage
          </span>

          <strong>
            Day{" "}
            {Math.min(
              simulation.currentDay,
              MAX_MVP_DAY
            )}{" "}
            / {MAX_MVP_DAY}
          </strong>
        </div>

        <button
          className="ghost-button"
          onClick={handleReset}
        >
          Restart
        </button>
      </div>
    </header>
  );
}

function BusinessMetrics({
  simulation,
  financial,
}) {
  const business =
    simulation.business;

  const health =
    calculateBusinessHealth(
      business
    );

  return (
    <>
      <section className="dashboard-grid">
        <article className="health-card">
          <p className="card-label">
            BUSINESS HEALTH
          </p>

          <strong className="health-score">
            {health}%
          </strong>

          <div className="health-meter">
            <span
              style={{
                width: `${health}%`,
              }}
            />
          </div>

          <small>
            Educational simulation
            indicator.
          </small>
        </article>

        <Metric
          label="Cash Available"
          value={formatCurrency(
            business.cash
          )}
          detail={
            financial.cashStatus
          }
        />

        <Metric
          label="Monthly Revenue"
          value={formatCurrency(
            business.revenue
          )}
          detail="Current recurring revenue"
        />

        <Metric
          label="Monthly Profit"
          value={formatCurrency(
            financial.profit
          )}
          detail={`${formatPercent(
            financial.profitMargin
          )} margin`}
          negative={
            financial.profit < 0
          }
        />
      </section>

      <section className="secondary-metrics">
        <SecondaryMetric
          label="Expenses"
          value={formatCurrency(
            business.expenses
          )}
        />

        <SecondaryMetric
          label="Debt"
          value={formatCurrency(
            business.debt
          )}
        />

        <SecondaryMetric
          label="Outstanding invoices"
          value={formatCurrency(
            business.receivables
          )}
        />

        <SecondaryMetric
          label="Employees"
          value={business.employees}
        />

        <SecondaryMetric
          label="Customers"
          value={business.customers}
        />

        <SecondaryMetric
          label="Net asset position"
          value={formatCurrency(
            financial.netAssets
          )}
        />

        <SecondaryMetric
          label="Founder ownership"
          value={`${business.founderOwnership}%`}
        />
      </section>
    </>
  );
}

function BusinessView(props) {
  const {
    simulation,
    currentScenario,
    messages,
    selectedDecisionId,
    setSelectedDecisionId,
    selectedMessage,
    setSelectedMessage,
    handleDecision,
    reflectionReason,
    setReflectionReason,
    reflectionConfidence,
    setReflectionConfidence,
    reflectionText,
    setReflectionText,
    reflectionCompleted,
    handleReflection,
    handleNextDay,
    notice,
    isFinished,
    quarterReview,
    businessAlerts,
    businessObjectives,
    achievements,
    recoveryState,
    availableRecoveryActions,
    selectedRecoveryActionId,
    setSelectedRecoveryActionId,
    handleRecoveryAction,
    recoveryNotice,
    currentTasks,
    taskSummary,
    selectedTaskId,
    setSelectedTaskId,
    handleCompleteTask,
    handlePostponeTask,
    taskNotice,
    journeyProgress,
    simulationMode,
    managementTeam,
    businessPath,
    simulationDifficulty,
    lastDeepConsequence,
    simulationEnding,
    lastRelationshipEvent,
    currentConversation,
    conversationSession,
    conversationResponses,
    conversationCompletedToday,
    handleStartConversation,
    handleConversationResponse,
    handleCompleteConversation,
    conversationNotice,
    setActiveView,
    currentBusinessEvent,
    selectedEventOptionId,
    setSelectedEventOptionId,
    handleBusinessEvent,
    eventNotice,
    handleReset,
  } = props;

  const recoveryTakenToday =
    (simulation.recoveryActions || [])
      .some(
        (item) =>
          item.day ===
          simulation.currentDay
      );

  const needsRecoveryBeforeFinish =
    simulation.currentDay ===
      MAX_MVP_DAY &&
    recoveryState.level !==
      "normal" &&
    !recoveryTakenToday;


  if (isFinished) {
    return (
      <QuarterReview
        simulation={
          simulation
        }
        review={
          quarterReview
        }
        handleReset={
          handleReset
        }
        setActiveView={
          setActiveView
        }
      />
    );
  }

  if (!currentScenario) {
    return null;
  }

  return (
    <>


      <section className="simulation-layout">
      <div className="workspace">
        <JourneyCalendar
          progress={
            journeyProgress
          }
          mode={
            simulationMode
          }
        />

        <BusinessIntelligencePanel
          alerts={
            businessAlerts
          }
          objectives={
            businessObjectives
          }
          achievements={
            achievements
          }
          recoveryState={
            recoveryState
          }
          recoveryActions={
            availableRecoveryActions
          }
          selectedRecoveryActionId={
            selectedRecoveryActionId
          }
          setSelectedRecoveryActionId={
            setSelectedRecoveryActionId
          }
          handleRecoveryAction={
            handleRecoveryAction
          }
          recoveryNotice={
            recoveryNotice
          }
          recoveryHistory={
            simulation.recoveryActions || []
          }
          lastRecoveryOutcome={
            simulation.lastRecoveryOutcome || null
          }
        />

        {currentBusinessEvent && (
          <DynamicBusinessEvent
            event={
              currentBusinessEvent
            }
            selectedOptionId={
              selectedEventOptionId
            }
            setSelectedOptionId={
              setSelectedEventOptionId
            }
            handleEvent={
              handleBusinessEvent
            }
            eventNotice={
              eventNotice
            }
            lastEventOutcome={
              simulation.lastEventOutcome
            }
          />
        )}

        <StorylinePathCard
          path={
            businessPath
          }
          currentDay={
            simulation.currentDay
          }
        />

        {lastDeepConsequence &&
          lastDeepConsequence.day ===
            simulation.currentDay && (
          <DeepConsequenceCard
            consequence={
              lastDeepConsequence
            }
            difficulty={
              simulationDifficulty
            }
          />
        )}

        {lastRelationshipEvent &&
          lastRelationshipEvent.day ===
            simulation.currentDay && (
          <RelationshipCallbackCard
            event={
              lastRelationshipEvent
            }
            setActiveView={
              setActiveView
            }
          />
        )}

        <BusinessTaskCentre
          tasks={currentTasks}
          summary={taskSummary}
          selectedTaskId={
            selectedTaskId
          }
          setSelectedTaskId={
            setSelectedTaskId
          }
          handleCompleteTask={
            handleCompleteTask
          }
          handlePostponeTask={
            handlePostponeTask
          }
          taskNotice={
            taskNotice
          }
          lastTaskOutcome={
            simulation.lastTaskOutcome
          }
        />

        {currentConversation &&
          currentConversation.day ===
            simulation.currentDay && (
          <ConversationCentre
            conversation={
              currentConversation
            }
            session={
              conversationSession
            }
            responses={
              conversationResponses
            }
            completedToday={
              conversationCompletedToday
            }
            handleStart={
              handleStartConversation
            }
            handleResponse={
              handleConversationResponse
            }
            handleComplete={
              handleCompleteConversation
            }
            notice={
              conversationNotice
            }
          />
        )}

        <ManagementMeetingPreview
          managementTeam={
            managementTeam
          }
          setActiveView={
            setActiveView
          }
        />


        <InboxPreview
          messages={messages}
          selectedMessage={
            selectedMessage
          }
          setSelectedMessage={
            setSelectedMessage
          }
        />

        <article className="scenario-panel">
          <div className="section-heading">
            <div>
              <p className="card-label">
                TODAY'S MAIN DECISION
              </p>

              <h2>
                {
                  currentScenario.month
                }{" "}
                ·{" "}
                {
                  currentScenario.theme
                }
              </h2>
            </div>

            <span
              className={`priority priority-${(
                currentScenario.priority ||
                "normal"
              ).toLowerCase()}`}
            >
              {
                currentScenario.priority ||
                "Normal"
              }
            </span>
          </div>

          <GuidedBusinessPanel
            simulation={
              simulation
            }
            businessObjectives={
              businessObjectives
            }
          />

          <MessageCard
            scenario={
              currentScenario
            }
          />

          <article className="context-card">
            <strong>
              {
                currentScenario.context
                  .title
              }
            </strong>

            <p>
              {
                currentScenario.context
                  .text
              }
            </p>
          </article>

          {currentScenario.adaptivePath && (
            <article className="adaptive-path-card">
              <div className="adaptive-path-badge">
                ADAPTIVE PATH
              </div>

              <div>
                <strong>
                  {
                    currentScenario
                      .adaptivePath
                      .title
                  }
                </strong>

                <p>
                  {
                    currentScenario
                      .adaptivePath
                      .message
                  }
                </p>
              </div>
            </article>
          )}

          {!simulation.dayComplete ? (
            <>
              <div className="decision-heading">
                <p className="card-label">
                  YOUR DECISION
                </p>

                <h3>
                  What do you want to
                  do?
                </h3>

                <p>
                  Think about both the
                  immediate problem and
                  the future health of
                  the business.
                </p>
              </div>

              <div className="decision-list">
                {currentScenario.decisions.map(
                  (decision) => (
                    <button
                      key={
                        decision.id
                      }
                      className={`decision-option ${
                        selectedDecisionId ===
                        decision.id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedDecisionId(
                          decision.id
                        )
                      }
                    >
                      <span className="decision-radio">
                        {selectedDecisionId ===
                        decision.id
                          ? "✓"
                          : ""}
                      </span>

                      <span>
                        <strong>
                          {
                            decision.title
                          }
                        </strong>

                        <small>
                          {
                            decision.description
                          }
                        </small>
                      </span>
                    </button>
                  )
                )}
              </div>

              {notice && (
                <p className="notice">
                  {notice}
                </p>
              )}

              <button
                className="primary-button"
                onClick={
                  handleDecision
                }
              >
                Confirm My Decision
              </button>
            </>
          ) : (
            <>
              <OutcomePanel
                outcome={
                  simulation.lastOutcome
                }
              />

              <ReflectionPanel
                completed={
                  reflectionCompleted
                }
                reason={
                  reflectionReason
                }
                setReason={
                  setReflectionReason
                }
                confidence={
                  reflectionConfidence
                }
                setConfidence={
                  setReflectionConfidence
                }
                text={
                  reflectionText
                }
                setText={
                  setReflectionText
                }
                handleSave={
                  handleReflection
                }
              />

              {notice && (
                <p className="notice">
                  {notice}
                </p>
              )}

              {needsRecoveryBeforeFinish ? (
                <div className="recovery-required-action">
                  <div className="recovery-required-copy">
                    <strong>
                      Your business needs attention before you finish.
                    </strong>

                    <p>
                      Choose one recovery action to help stabilise the business,
                      then return here to complete your first-half review.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                      const recoverySection =
                        document.getElementById(
                          "recovery-actions"
                        );

                      if (recoverySection) {
                        recoverySection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                  >
                    View Recovery Actions
                  </button>
                </div>
              ) : (
                <button
                  className="primary-button"
                  onClick={
                    handleNextDay
                  }
                >
                  {simulation.currentDay ===
                  MAX_MVP_DAY
                    ? "Review My First Half"
                    : "Continue Business Journey"}
                </button>
              )}
            </>
          )}
        </article>
      </div>

      <aside className="insight-column">



      </aside>
    </section>
    </>
  );
}

function InboxPreview({
  messages,
  selectedMessage,
  setSelectedMessage,
}) {
  return (
    <article className="inbox-preview">
      <p className="card-label">
        BUSINESS INBOX
      </p>

      <h2>
        {messages.length} updates
        need your attention
      </h2>

      <div className="inbox-preview-list">
        {messages.map(
          (message) => (
            <button
              key={message.id}
              className="inbox-preview-item"
              onClick={() =>
                setSelectedMessage(
                  message
                )
              }
            >
              <div>
                <strong>
                  {message.sender}
                </strong>

                <span>
                  {message.time}
                </span>
              </div>

              <h4>
                {message.subject}
              </h4>

              <p>
                {message.preview}
              </p>
            </button>
          )
        )}
      </div>

      {selectedMessage &&
        !selectedMessage.linkedScenario && (
          <InboxMessageReader
            message={
              selectedMessage
            }
            onClose={() =>
              setSelectedMessage(
                null
              )
            }
          />
        )}
    </article>
  );
}

function InboxView({
  messages,
  currentScenario,
  selectedMessage,
  setSelectedMessage,
  setActiveView,
}) {
  const active =
    selectedMessage ||
    messages[0];

  return (
    <section className="page-panel">
      <p className="card-label">
        BUSINESS COMMUNICATIONS
      </p>

      <h2>Business Inbox</h2>

      <div className="inbox-layout">
        <div className="full-inbox-list">
          {messages.map(
            (message) => (
              <button
                key={message.id}
                className={`full-inbox-item ${
                  active?.id ===
                  message.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedMessage(
                    message
                  )
                }
              >
                <div>
                  <strong>
                    {
                      message.sender
                    }
                  </strong>

                  <span>
                    {message.time}
                  </span>
                </div>

                <h4>
                  {
                    message.subject
                  }
                </h4>

                <p>
                  {
                    message.preview
                  }
                </p>
              </button>
            )
          )}
        </div>

        <article className="mail-reader">
          {active && (
            <>
              <span className="mail-type">
                {active.type}
              </span>

              <h3>
                {active.subject}
              </h3>

              <p>
                From{" "}
                <strong>
                  {active.sender}
                </strong>
              </p>

              <div className="mail-reader-body">
                <p>
                  {active.linkedScenario
                    ? currentScenario
                        ?.message
                    : active.body}
                </p>
              </div>

              {active.linkedScenario && (
                <button
                  className="primary-button"
                  onClick={() =>
                    setActiveView(
                      "business"
                    )
                  }
                >
                  Review Decision
                </button>
              )}
            </>
          )}
        </article>
      </div>
    </section>
  );
}

function FinanceView({
  simulation,
  financial,
  loanPortfolio,
  loanApplicationOpen,
  loanAmount,
  setLoanAmount,
  loanTermMonths,
  setLoanTermMonths,
  loanPurpose,
  setLoanPurpose,
  loanOffer,
  loanNotice,
  handleGenerateLoanOffer,
  handleAcceptLoanOffer,
  handleCancelLoanApplication,
}) {
  const business =
    simulation.business;

  const profit =
    calculateProfit(business);

  const cashCoveragePercent =
    Math.min(
      100,
      financial.cashCoverage * 60
    );

  const debtHealth =
    Math.max(
      0,
      100 - financial.debtToAssets
    );

  const collectionHealth =
    Math.max(
      0,
      100 -
        financial.receivableExposure
    );

  return (
    <section className="finance-v2">
      <div className="finance-v2-header">
        <div>
          <p className="card-label">
            BUSINESS FINANCE CENTRE
          </p>

          <h2>
            Understand what your
            numbers are telling you
          </h2>

          <p>
            See the financial position
            of your simulated business
            and learn what each number
            means before making your
            next decision.
          </p>
        </div>

        <div className="finance-v2-period">
          <span>
            CURRENT STAGE
          </span>

          <strong>
            Day{" "}
            {Math.min(
              simulation.currentDay,
              MAX_MVP_DAY
            )}{" "}
            / {MAX_MVP_DAY}
          </strong>
        </div>
      </div>


      <BusinessCreditLoanCentre
        simulation={
          simulation
        }
        portfolio={
          loanPortfolio
        }
        applicationOpen={
          loanApplicationOpen
        }
        amount={
          loanAmount
        }
        setAmount={
          setLoanAmount
        }
        termMonths={
          loanTermMonths
        }
        setTermMonths={
          setLoanTermMonths
        }
        purpose={
          loanPurpose
        }
        setPurpose={
          setLoanPurpose
        }
        offer={
          loanOffer
        }
        notice={
          loanNotice
        }
        onGenerateOffer={
          handleGenerateLoanOffer
        }
        onAcceptOffer={
          handleAcceptLoanOffer
        }
        onCancel={
          handleCancelLoanApplication
        }
      />


      <RevenueProfitCashLesson
        business={
          simulation.business
        }
      />


      <div className="finance-v2-kpis">
        <FinanceV2StatCard
          label="Available Cash"
          value={formatCurrency(
            business.cash
          )}
          status={
            financial.cashStatus
          }
          detail={`${financial.estimatedCashMonths.toFixed(
            1
          )} months of operating cover`}
          tone={
            financial.cashCoverage >= 1
              ? "good"
              : financial.cashCoverage >= 0.5
                ? "watch"
                : "danger"
          }
        />

        <FinanceV2StatCard
          label="Monthly Profit"
          value={formatCurrency(
            profit
          )}
          status={
            profit >= 0
              ? "Profitable"
              : "Loss making"
          }
          detail={`${formatPercent(
            financial.profitMargin
          )} operating margin`}
          tone={
            profit >= 0
              ? "good"
              : "danger"
          }
        />

        <FinanceV2StatCard
          label="Debt"
          value={formatCurrency(
            business.debt
          )}
          status={
            financial.debtStatus
          }
          detail={`${formatPercent(
            financial.debtToAssets
          )} of asset base`}
          tone={
            financial.debtToAssets <
            45
              ? "good"
              : financial.debtToAssets <
                  70
                ? "watch"
                : "danger"
          }
        />

        <FinanceV2StatCard
          label="Outstanding Invoices"
          value={formatCurrency(
            business.receivables
          )}
          status={
            financial.receivableExposure >
            40
              ? "Needs attention"
              : "Manageable"
          }
          detail={`${formatPercent(
            financial.receivableExposure
          )} of monthly revenue`}
          tone={
            financial.receivableExposure <=
            40
              ? "good"
              : "watch"
          }
        />
      </div>


      <div className="finance-v2-main-grid">
        <FinanceV2Statement
          title="Monthly Performance"
          subtitle="Income snapshot"
          rows={[
            {
              label: "Revenue",
              value:
                formatCurrency(
                  business.revenue
                ),
            },
            {
              label: "Expenses",
              value:
                formatCurrency(
                  business.expenses
                ),
            },
            {
              label:
                "Operating Profit",
              value:
                formatCurrency(
                  profit
                ),
              highlight: true,
              negative:
                profit < 0,
            },
            {
              label:
                "Profit Margin",
              value:
                formatPercent(
                  financial.profitMargin
                ),
            },
          ]}
        />

        <FinanceV2Statement
          title="Financial Position"
          subtitle="What the business owns and owes"
          rows={[
            {
              label: "Assets",
              value:
                formatCurrency(
                  business.assets
                ),
            },
            {
              label:
                "Liabilities",
              value:
                formatCurrency(
                  business.liabilities
                ),
            },
            {
              label:
                "Net Asset Position",
              value:
                formatCurrency(
                  financial.netAssets
                ),
              highlight: true,
              negative:
                financial.netAssets <
                0,
            },
            {
              label:
                "Founder Ownership",
              value:
                `${business.founderOwnership}%`,
            },
          ]}
        />

        <FinanceV2Statement
          title="Cash & Commitments"
          subtitle="Liquidity and obligations"
          rows={[
            {
              label:
                "Available Cash",
              value:
                formatCurrency(
                  business.cash
                ),
            },
            {
              label:
                "Customers Owe",
              value:
                formatCurrency(
                  business.receivables
                ),
            },
            {
              label:
                "Debt Outstanding",
              value:
                formatCurrency(
                  business.debt
                ),
            },
            {
              label:
                "Monthly Expenses",
              value:
                formatCurrency(
                  business.expenses
                ),
              highlight: true,
            },
          ]}
        />
      </div>


      <div className="finance-v2-bottom-grid">
        <article className="finance-v2-health-card">
          <div className="finance-v2-section-heading">
            <div>
              <p className="card-label">
                FINANCIAL HEALTH
              </p>

              <h3>
                How resilient is the
                business?
              </h3>
            </div>

            <span>
              LIVE
            </span>
          </div>

          <FinanceV2HealthRow
            label="Cash Coverage"
            value={`${financial.cashCoverage.toFixed(
              1
            )} months`}
            description="Ability to cover operating costs using available cash."
            progress={
              cashCoveragePercent
            }
          />

          <FinanceV2HealthRow
            label="Debt Position"
            value={formatPercent(
              financial.debtToAssets
            )}
            description="Lower debt relative to assets generally provides more financial flexibility."
            progress={debtHealth}
          />

          <FinanceV2HealthRow
            label="Customer Collections"
            value={formatPercent(
              financial.receivableExposure
            )}
            description="Shows how much revenue is still waiting to become cash."
            progress={
              collectionHealth
            }
          />
        </article>


        <article className="finance-v2-learning">
          <span className="finance-v2-learning-kicker">
            IIMS FINANCE LESSON
          </span>

          <h3>
            Profit and cash are not
            the same thing.
          </h3>

          <p>
            Your company can make a
            profit on paper and still
            struggle to pay salaries,
            suppliers or debt.
          </p>

          <div className="finance-v2-example">
            <div>
              <span>
                MONTHLY PROFIT
              </span>

              <strong>
                {formatCurrency(
                  profit
                )}
              </strong>
            </div>

            <span className="finance-v2-arrow">
              →
            </span>

            <div>
              <span>
                UNPAID INVOICES
              </span>

              <strong>
                {formatCurrency(
                  business.receivables
                )}
              </strong>
            </div>
          </div>

          <div className="finance-v2-takeaway">
            <strong>
              Think like an owner:
            </strong>

            <p>
              Ask not only “Are we
              profitable?” but also
              “Do we have enough cash
              available when our bills
              become due?”
            </p>
          </div>
        </article>
      </div>

      <p className="finance-v2-disclaimer">
        Educational simulation
        indicators only. They do not
        replace professional
        accounting, tax, investment or
        financial advice.
      </p>
    </section>
  );
}


function FinanceV2StatCard({
  label,
  value,
  status,
  detail,
  tone = "neutral",
}) {
  return (
    <article
      className={`finance-v2-stat finance-v2-${tone}`}
    >
      <div className="finance-v2-stat-top">
        <span>{label}</span>

        <span className="finance-v2-status">
          {status}
        </span>
      </div>

      <strong className="finance-v2-stat-value">
        {value}
      </strong>

      <p>{detail}</p>
    </article>
  );
}


function FinanceV2Statement({
  title,
  subtitle,
  rows,
}) {
  return (
    <article className="finance-v2-statement">
      <div className="finance-v2-statement-heading">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="finance-v2-statement-body">
        {rows.map((row) => (
          <div
            className={`finance-v2-row ${
              row.highlight
                ? "finance-v2-row-highlight"
                : ""
            }`}
            key={row.label}
          >
            <span>
              {row.label}
            </span>

            <strong
              className={
                row.negative
                  ? "finance-v2-negative"
                  : ""
              }
            >
              {row.value}
            </strong>
          </div>
        ))}
      </div>
    </article>
  );
}


function FinanceV2HealthRow({
  label,
  value,
  description,
  progress,
}) {
  return (
    <div className="finance-v2-health-row">
      <div className="finance-v2-health-top">
        <div>
          <strong>
            {label}
          </strong>

          <p>
            {description}
          </p>
        </div>

        <span>
          {value}
        </span>
      </div>

      <div className="finance-v2-health-track">
        <span
          style={{
            width: `${Math.max(
              0,
              Math.min(
                100,
                progress
              )
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

function FinanceStatus({
  title,
  value,
  status,
  explanation,
}) {
  return (
    <article className="finance-status">
      <div>
        <span>{title}</span>

        <strong>{value}</strong>
      </div>

      <span className="status-badge">
        {status}
      </span>

      <p>{explanation}</p>
    </article>
  );
}

function FinanceRow({
  label,
  value,
  strong,
}) {
  return (
    <div
      className={`finance-row ${
        strong ? "strong" : ""
      }`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProgressView({
  simulation,
}) {
  return (
    <section className="page-panel">
      <p className="card-label">
        ENTREPRENEUR JOURNAL
      </p>

      <h2>
        Business Journey & Decision History
      </h2>

      <p className="progress-intro">
        Every decision carries forward.
        Review how your business journey
        developed stage by stage.
      </p>

      <div className="journal-list">
        {[1, 2, 3, 4, 5, 6].map((day) => {
          const scenario =
            scenarios.find(
              (item) =>
                item.day === day
            );

          const decision =
            simulation.decisions.find(
              (item) =>
                item.scenarioDay ===
                day
            );

          const reflection =
            simulation.reflections.find(
              (item) =>
                item.day === day
            );

          return (
            <article
              className="journal-entry"
              key={day}
            >
              <div className="journal-day">
                <span>DAY</span>
                <strong>
                  {day}
                </strong>
              </div>

              <div className="journal-content">
                <span>
                  {scenario?.month}
                </span>

                <h3>
                  {
                    scenario?.theme
                  }
                </h3>

                {decision ? (
                  <>
                    <strong>
                      {
                        decision.decisionTitle
                      }
                    </strong>

                    <p>
                      {
                        decision.outcomeExplanation
                      }
                    </p>

                    {reflection && (
                      <div className="journal-reflection">
                        <span>
                          WHY
                        </span>

                        <strong>
                          {
                            reflection.reason
                          }
                        </strong>

                        <p>
                          Confidence:{" "}
                          {
                            reflection.confidence
                          }
                          /5
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p>
                    Not completed yet.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AdvisorView({
  simulation,
  advisor,
  financial,
  entrepreneurProfile,
  learningRecommendations,
  advisorConversation,
}) {
  return (
    <section className="page-panel">
      <p className="card-label">
        YAEI ADVISOR INTELLIGENCE
      </p>

      <h2>
        Entrepreneur Development
        View
      </h2>

      <EntrepreneurProfileCard
        profile={
          entrepreneurProfile
        }
      />

      <PersonalisedLearningPanel
        learning={
          learningRecommendations
        }
      />

      <AdvisorConversationPanel
        conversation={
          advisorConversation
        }
      />

      <div className="advisor-summary-grid">
        <SummaryCard
          label="Decisions"
          value={
            advisor.decisionsReviewed
          }
        />

        <SummaryCard
          label="Reflections"
          value={
            advisor.reflectionsReviewed
          }
        />

        <SummaryCard
          label="Avg. confidence"
          value={
            advisor.averageConfidence !==
            null
              ? `${advisor.averageConfidence}/5`
              : "—"
          }
        />

        <SummaryCard
          label="Debt / Assets"
          value={formatPercent(
            financial.debtToAssets
          )}
        />
      </div>

      <div className="advisor-analysis-grid">
        <article className="analysis-card">
          <p className="card-label">
            DEVELOPMENT PRIORITIES
          </p>

          {advisor.developmentAreas.map(
            (item) => (
              <SkillRow
                key={item.key}
                label={item.label}
                value={item.value}
              />
            )
          )}
        </article>

        <article className="analysis-card">
          <p className="card-label">
            CURRENT STRENGTHS
          </p>

          {advisor.strengths.map(
            (item) => (
              <SkillRow
                key={item.key}
                label={item.label}
                value={item.value}
              />
            )
          )}
        </article>
      </div>

      <article className="behaviour-card">
        <p className="card-label">
          ADVISOR OBSERVATION
        </p>

        <h3>
          Current decision pattern
        </h3>

        <p>
          {
            advisor.behaviourSummary
          }
        </p>
      </article>
    </section>
  );
}

function QuarterReview({
  simulation,
  review,
  handleReset,
  setActiveView,
}) {
  const business =
    simulation.business;

  const health =
    calculateBusinessHealth(
      business
    );

  const recoveryCount =
    (simulation.recoveryActions || [])
      .length;

  let overallStatus =
    "Business remains operational";

  if (health >= 80) {
    overallStatus =
      "Strong business position";
  } else if (health >= 60) {
    overallStatus =
      "Business requires monitoring";
  } else if (health >= 40) {
    overallStatus =
      "Financial pressure is significant";
  } else {
    overallStatus =
      "Business is in serious difficulty";
  }

  return (
    <section className="quarter-review">
      <div className="review-header">
        <div>
          <p className="card-label">
            FIRST HALF BUSINESS REVIEW
          </p>

          <h2>
            {review.headline}
          </h2>

          <p>
            Six simulated business
            months are complete.
            Review what your decisions
            did to the company.
          </p>
        </div>

        <div className="review-health">
          <span>
            BUSINESS HEALTH
          </span>

          <strong>
            {health}%
          </strong>

          <small>
            {overallStatus}
          </small>
        </div>
      </div>

      <div className="review-change-grid">
        <ReviewMetric
          label="Revenue"
          value={
            review.changes.revenue
          }
          goodWhenPositive
        />

        <ReviewMetric
          label="Expenses"
          value={
            review.changes.expenses
          }
          goodWhenPositive={false}
        />

        <ReviewMetric
          label="Cash"
          value={
            review.changes.cash
          }
          goodWhenPositive
        />

        <ReviewMetric
          label="Debt"
          value={
            review.changes.debt
          }
          goodWhenPositive={false}
        />
      </div>

      <div className="review-summary-grid">
        <article className="review-summary-card">
          <p className="card-label">
            CURRENT POSITION
          </p>

          <ReviewRow
            label="Monthly revenue"
            value={formatCurrency(
              business.revenue
            )}
          />

          <ReviewRow
            label="Monthly expenses"
            value={formatCurrency(
              business.expenses
            )}
          />

          <ReviewRow
            label="Monthly profit"
            value={formatCurrency(
              calculateProfit(
                business
              )
            )}
          />

          <ReviewRow
            label="Debt"
            value={formatCurrency(
              business.debt
            )}
          />

          <ReviewRow
            label="Founder ownership"
            value={`${business.founderOwnership}%`}
          />
        </article>

        <article className="review-summary-card">
          <p className="card-label">
            ENTREPRENEUR JOURNEY
          </p>

          <ReviewRow
            label="Major decisions"
            value={
              simulation.decisions.length
            }
          />

          <ReviewRow
            label="Reflections"
            value={
              simulation.reflections.length
            }
          />

          <ReviewRow
            label="Recovery actions"
            value={
              recoveryCount
            }
          />

          <ReviewRow
            label="Customers"
            value={
              business.customers
            }
          />

          <ReviewRow
            label="Employees"
            value={
              business.employees
            }
          />
        </article>
      </div>

      <article className="review-risks">
        <div className="review-section-heading">
          <div>
            <p className="card-label">
              WHAT NEEDS ATTENTION
            </p>

            <h3>
              Key business risks
            </h3>
          </div>

          <span>
            {review.risks.length}
          </span>
        </div>

        <div className="review-risk-list">
          {review.risks.map(
            (risk, index) => (
              <div
                className="review-risk"
                key={risk}
              >
                <span>
                  {index + 1}
                </span>

                <p>
                  {risk}
                </p>
              </div>
            )
          )}
        </div>
      </article>

      {recoveryCount > 0 && (
        <article className="review-recovery">
          <p className="card-label">
            RECOVERY EXPERIENCE
          </p>

          <h3>
            You attempted to stabilise
            the business.
          </h3>

          <p>
            Recovery is part of
            entrepreneurship. The
            important lesson is not
            avoiding every mistake,
            but recognising problems
            early and responding
            deliberately.
          </p>

          <div className="review-recovery-list">
            {simulation.recoveryActions.map(
              (item) => (
                <div key={item.id}>
                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    {
                      item.outcome
                        .headline
                    }
                  </span>
                </div>
              )
            )}
          </div>
        </article>
      )}

      <div className="review-final-message">
        <div>
          <span>
            IIMS LEARNING INSIGHT
          </span>

          <h3>
            Growth does not always
            mean a healthier business.
          </h3>

          <p>
            Revenue, cash, debt,
            expenses, employees and
            customer relationships
            must be managed together.
            A business can grow while
            becoming financially
            weaker.
          </p>
        </div>
      </div>

      <section className="journey-next-actions">
        <div className="journey-next-heading">
          <p className="card-label">
            YOUR JOURNEY IS COMPLETE
          </p>

          <h2>
            What would you like to do next?
          </h2>

          <p>
            Review what happened, understand your business position,
            and use what you learned before starting another journey.
          </p>
        </div>

        <div className="journey-next-grid">
          <button
            type="button"
            className="journey-next-card journey-next-primary"
            onClick={() => {
              setActiveView(
                "reports"
              );

              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            }}
          >
            <span className="journey-next-icon">
              1
            </span>

            <div>
              <strong>
                View My Final Report
              </strong>

              <p>
                See your business outcome, strengths and development areas.
              </p>
            </div>

            <span className="journey-next-arrow">
              →
            </span>
          </button>


          <button
            type="button"
            className="journey-next-card"
            onClick={() => {
              setActiveView(
                "finance"
              );

              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            }}
          >
            <span className="journey-next-icon">
              R
            </span>

            <div>
              <strong>
                Review My Money
              </strong>

              <p>
                Understand cash, profit, debt, loans and business credit.
              </p>
            </div>

            <span className="journey-next-arrow">
              →
            </span>
          </button>


          <button
            type="button"
            className="journey-next-card"
            onClick={() => {
              setActiveView(
                "advisor"
              );

              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            }}
          >
            <span className="journey-next-icon">
              A
            </span>

            <div>
              <strong>
                Talk to My Advisor
              </strong>

              <p>
                See what you should improve and discuss with a YAEI advisor.
              </p>
            </div>

            <span className="journey-next-arrow">
              →
            </span>
          </button>


          <button
            type="button"
            className="journey-next-card"
            onClick={() => {
              setActiveView(
                "progress"
              );

              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            }}
          >
            <span className="journey-next-icon">
              ✓
            </span>

            <div>
              <strong>
                Review My Journey
              </strong>

              <p>
                Look back at the decisions and progress you made.
              </p>
            </div>

            <span className="journey-next-arrow">
              →
            </span>
          </button>
        </div>


        <div className="journey-replay-area">
          <div>
            <strong>
              Want to try a different strategy?
            </strong>

            <p>
              Restart the simulation and see how different decisions change the business.
            </p>
          </div>

          <button
            type="button"
            className="journey-replay-button"
            onClick={handleReset}
          >
            Replay With Different Decisions
          </button>
        </div>
      </section>
    </section>
  );
}


function ReviewMetric({
  label,
  value,
  goodWhenPositive,
}) {
  const positive =
    value >= 0;

  const favourable =
    goodWhenPositive
      ? positive
      : !positive;

  return (
    <article className="review-change-card">
      <span>{label}</span>

      <strong
        className={
          favourable
            ? "review-good"
            : "review-bad"
        }
      >
        {value > 0 ? "+" : ""}
        {formatPercent(value)}
      </strong>

      <small>
        vs. start of simulation
      </small>
    </article>
  );
}


function ReviewRow({
  label,
  value,
}) {
  return (
    <div className="review-row">
      <span>{label}</span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function ChangeCard({
  label,
  value,
}) {
  const positive =
    value >= 0;

  return (
    <article className="change-card">
      <span>{label}</span>

      <strong
        className={
          positive
            ? "positive-text"
            : "negative-text"
        }
      >
        {positive ? "+" : ""}
        {formatPercent(value)}
      </strong>
    </article>
  );
}

function GuidedBusinessPanel({
  simulation,
  businessObjectives,
}) {
  const business =
    simulation?.business || {};

  const skills =
    simulation?.skills || {};

  const revenue =
    Number(
      business.revenue || 0
    );

  const expenses =
    Number(
      business.expenses || 0
    );

  const cash =
    Number(
      business.cash || 0
    );

  const receivables =
    Math.max(
      0,
      Number(
        business.receivables || 0
      )
    );

  const debt =
    Math.max(
      0,
      Number(
        business.debt || 0
      )
    );

  const customerSatisfaction =
    Number(
      business.customerSatisfaction ??
        74
    );

  const employeeMorale =
    Number(
      business.employeeMorale ?? 72
    );

  const businessRisk =
    Number(
      business.risk ?? 38
    );

  const profit =
    revenue - expenses;

  const cashMonths =
    expenses > 0
      ? cash / expenses
      : 0;

  const safeAverage = (
    values
  ) => {
    const clean = values.filter(
      (value) =>
        Number.isFinite(value)
    );

    if (!clean.length) {
      return 0;
    }

    return (
      clean.reduce(
        (sum, value) =>
          sum + value,
        0
      ) / clean.length
    );
  };

  const getTone = (
    status
  ) => {
    if (status === "Good") {
      return "good";
    }

    if (status === "Watch") {
      return "watch";
    }

    return "urgent";
  };

  const getSkillStage = (
    score
  ) => {
    if (score >= 70) {
      return {
        label: "Strong",
        tone: "good",
        help: "You are making confident decisions in this area.",
      };
    }

    if (score >= 45) {
      return {
        label: "Growing",
        tone: "watch",
        help: "You are improving, but still need more practice.",
      };
    }

    return {
      label: "Starting",
      tone: "urgent",
      help: "This is still a learning area for your business journey.",
    };
  };

  const goalCards = [
    {
      id: "money",
      icon: "R",
      title: "Money",
      status:
        profit > 0 &&
        cashMonths >= 1
          ? "Good"
          : cashMonths >= 0.7
          ? "Watch"
          : "Urgent",
      headline:
        profit > 0
          ? "Your business is making money."
          : "Your costs are too high.",
      description:
        profit > 0
          ? "You are earning more than you are spending."
          : "Monthly expenses are above or too close to revenue.",
      action:
        cashMonths >= 1
          ? "Keep protecting cash and avoid unnecessary spending."
          : "Collect money faster and control spending.",
    },

    {
      id: "customers",
      icon: "C",
      title: "Customers",
      status:
        customerSatisfaction >= 70
          ? "Good"
          : customerSatisfaction >= 55
          ? "Watch"
          : "Urgent",
      headline:
        customerSatisfaction >= 70
          ? "Customers are generally happy."
          : "Customer relationships need attention.",
      description: `Customer satisfaction is ${Math.round(
        customerSatisfaction
      )}%.`,
      action:
        customerSatisfaction >= 70
          ? "Keep service levels high and respond quickly."
          : "Improve communication, delivery and consistency.",
    },

    {
      id: "team",
      icon: "T",
      title: "Team",
      status:
        employeeMorale >= 70
          ? "Good"
          : employeeMorale >= 55
          ? "Watch"
          : "Urgent",
      headline:
        employeeMorale >= 70
          ? "Your team is in a healthy place."
          : "Your team needs support.",
      description: `Employee morale is ${Math.round(
        employeeMorale
      )}%.`,
      action:
        employeeMorale >= 70
          ? "Keep expectations clear and reward good work."
          : "Talk to your team and reduce pressure where possible.",
    },

    {
      id: "growth",
      icon: "G",
      title: "Growth",
      status:
        businessRisk < 40 &&
        receivables < revenue * 0.35 &&
        debt < (business.assets || 1)
          ? "Good"
          : businessRisk < 60
          ? "Watch"
          : "Urgent",
      headline:
        businessRisk < 40
          ? "Growth is under control."
          : "Growth is creating pressure.",
      description: `Risk is ${Math.round(
        businessRisk
      )}% and debt is ${formatCurrency(
        debt
      )}.`,
      action:
        businessRisk < 40
          ? "Grow carefully while protecting cash flow."
          : "Slow down risky growth and strengthen the business base.",
    },
  ];

  const onTrackCount =
    goalCards.filter(
      (item) =>
        item.status === "Good"
    ).length;

  const topActions =
    goalCards
      .filter(
        (item) =>
          item.status !== "Good"
      )
      .slice(0, 3);

  const learningCards = [
    {
      id: "cash",
      title: "Money skills",
      score: safeAverage([
        Number(
          skills.cashFlow || 0
        ),
        Number(
          skills.financialPlanning ||
            0
        ),
        Number(
          skills.fundingDecisions ||
            0
        ),
      ]),
      whatItMeans:
        "Understanding cash flow, planning and borrowing.",
    },

    {
      id: "people",
      title: "People skills",
      score: safeAverage([
        Number(
          skills.peopleManagement ||
            0
        ),
      ]),
      whatItMeans:
        "Managing staff, pressure and teamwork.",
    },

    {
      id: "customer",
      title: "Customer skills",
      score: safeAverage([
        Number(
          skills.customerManagement ||
            0
        ),
        Number(
          skills.pricing || 0
        ),
      ]),
      whatItMeans:
        "Keeping customers, pricing properly and delivering value.",
    },

    {
      id: "growth",
      title: "Growth skills",
      score: safeAverage([
        Number(
          skills.growthStrategy ||
            0
        ),
        Number(
          skills.riskManagement ||
            0
        ),
      ]),
      whatItMeans:
        "Growing the business without losing control.",
    },
  ];

  const completedObjectives =
    Array.isArray(
      businessObjectives
    )
      ? businessObjectives.filter(
          (item) =>
            item?.completed ||
            item?.achieved ||
            item?.status ===
              "achieved"
        ).length
      : 0;

  return (
    <section className="guided-panel">
      <div className="guided-panel-header">
        <div>
          <p className="card-label">
            IIMS BUSINESS GUIDE
          </p>

          <h2>
            What matters right now
          </h2>

          <p>
            This simple view helps
            entrepreneurs quickly
            understand the business,
            what is safe, what needs
            attention, and what to do
            next.
          </p>
        </div>

        <div className="guided-panel-chip">
          <strong>
            {onTrackCount}/4
          </strong>
          <span>
            goals on track
          </span>
        </div>
      </div>

      <div className="guided-help-note">
        <strong>
          Easy guide:
        </strong>{" "}
        Green means okay, gold means
        watch carefully, red means act
        now.
        {completedObjectives > 0 && (
          <>
            {" "}
            You have already achieved{" "}
            {completedObjectives}{" "}
            objective
            {completedObjectives === 1
              ? ""
              : "s"}
            .
          </>
        )}
      </div>

      <div className="guided-goals-grid">
        {goalCards.map((item) => (
          <article
            key={item.id}
            className={`guided-goal-card guided-goal-${getTone(
              item.status
            )}`}
          >
            <div className="guided-goal-top">
              <div className="guided-goal-icon">
                {item.icon}
              </div>

              <div className="guided-goal-badge">
                {item.status}
              </div>
            </div>

            <div className="guided-goal-body">
              <span>
                {item.title}
              </span>

              <h3>
                {item.headline}
              </h3>

              <p>
                {item.description}
              </p>
            </div>

            <div className="guided-goal-action">
              <strong>
                What to do:
              </strong>
              <p>{item.action}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="guided-bottom-grid">
        <section className="guided-next-steps">
          <div className="guided-section-heading">
            <p className="card-label">
              WHAT TO DO NOW
            </p>

            <h3>
              Your next simple steps
            </h3>
          </div>

          {topActions.length > 0 ? (
            <div className="guided-step-list">
              {topActions.map(
                (item, index) => (
                  <div
                    key={item.id}
                    className="guided-step"
                  >
                    <div className="guided-step-number">
                      {index + 1}
                    </div>

                    <div>
                      <strong>
                        {item.title}
                      </strong>

                      <p>
                        {item.action}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="guided-step-list">
              <div className="guided-step">
                <div className="guided-step-number">
                  1
                </div>

                <div>
                  <strong>
                    Keep going
                  </strong>

                  <p>
                    Your business is
                    currently stable.
                    Protect cash,
                    customers and your
                    team while making
                    your next decision.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="guided-learning">
          <div className="guided-section-heading">
            <p className="card-label">
              YOUR LEARNING JOURNEY
            </p>

            <h3>
              Business skills you are
              building
            </h3>
          </div>

          <div className="guided-learning-grid">
            {learningCards.map(
              (item) => {
                const stage =
                  getSkillStage(
                    item.score
                  );

                return (
                  <article
                    key={item.id}
                    className={`guided-learning-card guided-learning-${stage.tone}`}
                  >
                    <div className="guided-learning-top">
                      <span>
                        {item.title}
                      </span>

                      <div className="guided-learning-score">
                        {Math.round(
                          item.score
                        )}
                        %
                      </div>
                    </div>

                    <div className="guided-learning-stage">
                      {stage.label}
                    </div>

                    <p>
                      {
                        item.whatItMeans
                      }
                    </p>

                    <small>
                      {stage.help}
                    </small>
                  </article>
                );
              }
            )}
          </div>
        </section>
      </div>
    </section>
  );
}


function MessageCard({
  scenario,
}) {
  const sender =
    scenario.sender ||
    scenario.context?.title ||
    "IIMS";

  const subject =
    scenario.subject ||
    scenario.title ||
    "Business Update";

  const message =
    scenario.message ||
    scenario.context?.text ||
    scenario.description ||
    "A new business situation requires your attention.";

  return (
    <article className="message-card">
      <div className="message-avatar">
        {sender
          .charAt(0)
          .toUpperCase()}
      </div>

      <div>
        <strong>
          {sender}
        </strong>

        <h3>
          {subject}
        </h3>

        <p>
          {message}
        </p>
      </div>
    </article>
  );
}

function OutcomePanel({
  outcome,
}) {
  return (
    <section className="outcome-panel">
      <p className="card-label">
        DECISION OUTCOME
      </p>

      <h3>
        {outcome.headline}
      </h3>

      <p>
        {outcome.explanation}
      </p>

      <div className="effect-grid">
        {Object.entries(
          outcome.immediateEffects ||
            {}
        ).map(
          ([key, value]) => (
            <div
              key={key}
              className="effect-item"
            >
              <span>
                {effectLabelMap[key] ||
                  key}
              </span>

              <strong>
                {value > 0
                  ? "+"
                  : ""}

                {[
                  "cash",
                  "revenue",
                  "expenses",
                  "assets",
                  "liabilities",
                  "debt",
                  "receivables",
                ].includes(key)
                  ? formatCurrency(
                      value
                    )
                  : value}
              </strong>
            </div>
          )
        )}
      </div>

      <div className="lesson-box">
        <strong>
          Business lesson
        </strong>

        <p>
          {outcome.lesson}
        </p>
      </div>
    </section>
  );
}

function ReflectionPanel({
  completed,
  reason,
  setReason,
  confidence,
  setConfidence,
  text,
  setText,
  handleSave,
}) {
  if (completed) {
    return (
      <div className="reflection-complete">
        ✓ Reflection saved
      </div>
    );
  }

  return (
    <section className="reflection-panel">
      <p className="card-label">
        REFLECT BEFORE CONTINUING
      </p>

      <h3>
        Why did you make this
        decision?
      </h3>

      <select
        value={reason}
        onChange={(event) =>
          setReason(
            event.target.value
          )
        }
      >
        <option value="">
          Choose a reason
        </option>

        {reflectionReasons.map(
          (item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          )
        )}
      </select>

      <p className="reflection-label">
        Confidence
      </p>

      <div className="confidence-buttons">
        {[1, 2, 3, 4, 5].map(
          (number) => (
            <button
              key={number}
              className={
                confidence ===
                number
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setConfidence(
                  number
                )
              }
            >
              {number}
            </button>
          )
        )}
      </div>

      <textarea
        value={text}
        maxLength={500}
        onChange={(event) =>
          setText(
            event.target.value
          )
        }
        placeholder="Optional note about what influenced your thinking..."
      />

      <button
        className="secondary-button"
        onClick={handleSave}
      >
        Save Reflection
      </button>
    </section>
  );
}

function DelayedConsequences({
  items,
}) {
  return (
    <section className="delayed-alert">
      <p className="card-label">
        A PREVIOUS DECISION HAS
        RETURNED
      </p>

      {items.map(
        (item, index) => (
          <div key={index}>
            <strong>
              {item.title}
            </strong>

            <p>
              {
                item.description
              }
            </p>
          </div>
        )
      )}
    </section>
  );
}

function LiveStatus({
  business,
}) {
  return (
    <article className="status-panel">
      <p className="card-label">
        LIVE BUSINESS STATUS
      </p>

      <StatusRow
        label="Customer satisfaction"
        value={
          business.customerSatisfaction
        }
      />

      <StatusRow
        label="Employee morale"
        value={
          business.employeeMorale
        }
      />

      <StatusRow
        label="Business risk"
        value={business.risk}
        inverse
      />
    </article>
  );
}

function DevelopmentProfile({
  skills,
}) {
  return (
    <article className="skills-panel">
      <p className="card-label">
        DEVELOPMENT PROFILE
      </p>

      {Object.entries(skills).map(
        ([key, value]) => (
          <SkillRow
            key={key}
            label={
              skillLabelMap[key] ||
              key
            }
            value={value}
          />
        )
      )}
    </article>
  );
}

function StatusRow({
  label,
  value,
  inverse,
}) {
  const progress = inverse
    ? 100 - value
    : value;

  return (
    <div className="status-row">
      <div>
        <span>{label}</span>
        <strong>
          {Math.round(value)}%
        </strong>
      </div>

      <div className="status-track">
        <span
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

function SkillRow({
  label,
  value,
}) {
  return (
    <div className="skill-row">
      <div>
        <span>{label}</span>
        <strong>
          {Math.round(value)}%
        </strong>
      </div>

      <div className="skill-track">
        <span
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  negative,
}) {
  return (
    <article className="metric-card">
      <span>{label}</span>

      <strong
        className={
          negative
            ? "negative-text"
            : ""
        }
      >
        {value}
      </strong>

      <small>{detail}</small>
    </article>
  );
}

function SecondaryMetric({
  label,
  value,
}) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}) {
  return (
    <article className="summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}


// =========================================================
// ALPHA 5
// BUSINESS INTELLIGENCE
// =========================================================

function BusinessIntelligencePanel({
  alerts,
  objectives,
  achievements,
  recoveryState,
  recoveryActions,
  selectedRecoveryActionId,
  setSelectedRecoveryActionId,
  handleRecoveryAction,
  recoveryNotice,
  recoveryHistory,
  lastRecoveryOutcome,
}) {
  const primaryAlert =
    alerts[0];

  return (
    <section className="business-intelligence">
      {recoveryState.level !==
        "normal" && (
        <RecoveryDecisionCentre
          recoveryState={
            recoveryState
          }
          recoveryActions={
            recoveryActions
          }
          selectedRecoveryActionId={
            selectedRecoveryActionId
          }
          setSelectedRecoveryActionId={
            setSelectedRecoveryActionId
          }
          handleRecoveryAction={
            handleRecoveryAction
          }
          recoveryNotice={
            recoveryNotice
          }
          recoveryHistory={
            recoveryHistory
          }
          lastRecoveryOutcome={
            lastRecoveryOutcome
          }
        />
      )}

      <div className="intelligence-grid">
        <article className="business-alert-card">
          <div className="intelligence-heading">
            <div>
              <p className="card-label">
                BUSINESS INTELLIGENCE
              </p>

              <h2>
                What needs your
                attention?
              </h2>
            </div>

            <span className="alert-count">
              {alerts.length}
            </span>
          </div>

          {primaryAlert ? (
            <div
              className={`primary-business-alert alert-${primaryAlert.severity}`}
            >
              <span className="alert-severity">
                {
                  primaryAlert.severity
                }
              </span>

              <h3>
                {
                  primaryAlert.title
                }
              </h3>

              <p>
                {
                  primaryAlert.message
                }
              </p>

              <div>
                <strong>
                  Recommended action
                </strong>

                <p>
                  {
                    primaryAlert.action
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="no-alerts">
              No major business
              warnings at the moment.
            </div>
          )}

          {alerts.length > 1 && (
            <div className="secondary-alert-list">
              {alerts
                .slice(1, 4)
                .map((alert) => (
                  <div
                    className="secondary-alert"
                    key={alert.id}
                  >
                    <span
                      className={`alert-dot dot-${alert.severity}`}
                    />

                    <div>
                      <strong>
                        {alert.title}
                      </strong>

                      <p>
                        {
                          alert.message
                        }
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </article>

        <article className="objectives-card">
          <p className="card-label">
            LIVE BUSINESS OBJECTIVES
          </p>

          <h2>
            What are you trying to
            protect?
          </h2>

          <div className="objective-list">
            {objectives.map(
              (objective) => (
                <div
                  className="objective-item"
                  key={
                    objective.id
                  }
                >
                  <div className="objective-top">
                    <div>
                      <strong>
                        {
                          objective.title
                        }
                      </strong>

                      <p>
                        {
                          objective.description
                        }
                      </p>
                    </div>

                    <span
                      className={
                        objective.completed
                          ? "objective-complete"
                          : "objective-open"
                      }
                    >
                      {objective.completed
                        ? "✓"
                        : `${Math.round(
                            objective.progress
                          )}%`}
                    </span>
                  </div>

                  <div className="objective-track">
                    <span
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            objective.progress
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </article>
      </div>

      {achievements.length > 0 && (
        <article className="achievement-strip">
          <div>
            <p className="card-label">
              ACHIEVEMENTS
            </p>

            <strong>
              Business experience
              earned
            </strong>
          </div>

          <div className="achievement-list">
            {achievements
              .slice(-4)
              .map(
                (
                  achievement
                ) => (
                  <div
                    className="achievement-chip"
                    key={
                      achievement.id
                    }
                    title={
                      achievement.description
                    }
                  >
                    <span>
                      {
                        achievement.icon
                      }
                    </span>

                    <div>
                      <strong>
                        {
                          achievement.title
                        }
                      </strong>

                      <small>
                        {
                          achievement.description
                        }
                      </small>
                    </div>
                  </div>
                )
              )}
          </div>
        </article>
      )}
    </section>
  );
}


function RecoveryDecisionCentre({
  recoveryState,
  recoveryActions,
  selectedRecoveryActionId,
  setSelectedRecoveryActionId,
  handleRecoveryAction,
  recoveryNotice,
  recoveryHistory,
  lastRecoveryOutcome,
}) {
  return (
    <section
      id="recovery-actions"
      className={`recovery-decision-centre recovery-${recoveryState.level}`}
    >
      <div className="recovery-header">
        <div className="recovery-icon">
          !
        </div>

        <div>
          <p className="card-label">
            BUSINESS RECOVERY MODE
          </p>

          <h2>
            {recoveryState.title}
          </h2>

          <p>
            {recoveryState.message}
          </p>
        </div>
      </div>

      <div className="recovery-guidance">
        <strong>
          What should the business
          focus on?
        </strong>

        <div>
          {recoveryState.actions.map(
            (action) => (
              <span key={action}>
                {action}
              </span>
            )
          )}
        </div>
      </div>

      {lastRecoveryOutcome && (
        <article className="recovery-outcome">
          <p className="card-label">
            LATEST RECOVERY RESULT
          </p>

          <h3>
            {
              lastRecoveryOutcome.headline
            }
          </h3>

          <p>
            {
              lastRecoveryOutcome.explanation
            }
          </p>

          <div className="recovery-lesson">
            <strong>
              What you learned
            </strong>

            <p>
              {
                lastRecoveryOutcome.lesson
              }
            </p>
          </div>
        </article>
      )}

      <div className="recovery-action-heading">
        <div>
          <p className="card-label">
            CHOOSE A RECOVERY ACTION
          </p>

          <h3>
            How do you want to
            stabilise the company?
          </h3>
        </div>

        <span>
          {
            recoveryHistory.length
          }{" "}
          action
          {recoveryHistory.length ===
          1
            ? ""
            : "s"}{" "}
          taken
        </span>
      </div>

      <div className="recovery-option-grid">
        {recoveryActions.map(
          (action) => {
            const used =
              recoveryHistory.some(
                (item) =>
                  item.actionId ===
                  action.id
              );

            const selected =
              selectedRecoveryActionId ===
              action.id;

            return (
              <button
                key={action.id}
                className={`recovery-option ${
                  selected
                    ? "selected"
                    : ""
                } ${
                  used
                    ? "used"
                    : ""
                }`}
                disabled={used}
                onClick={() =>
                  setSelectedRecoveryActionId(
                    action.id
                  )
                }
              >
                <div className="recovery-option-top">
                  <span>
                    {
                      action.category
                    }
                  </span>

                  {used && (
                    <strong>
                      USED
                    </strong>
                  )}
                </div>

                <h4>
                  {action.title}
                </h4>

                <p>
                  {
                    action.description
                  }
                </p>
              </button>
            );
          }
        )}
      </div>

      {recoveryNotice && (
        <p className="notice">
          {recoveryNotice}
        </p>
      )}

      <button
        className="recovery-confirm-button"
        onClick={
          handleRecoveryAction
        }
      >
        Apply Recovery Action
      </button>

      {recoveryHistory.length >
        0 && (
        <div className="recovery-history">
          <p className="card-label">
            RECOVERY HISTORY
          </p>

          {recoveryHistory
            .slice()
            .reverse()
            .map((item) => (
              <div
                key={item.id}
                className="recovery-history-row"
              >
                <div>
                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    Day {item.day}
                  </span>
                </div>

                <p>
                  {
                    item.outcome
                      .headline
                  }
                </p>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}


function EntrepreneurProfileCard({
  profile,
}) {
  return (
    <section className="entrepreneur-profile-card">
      <div className="profile-main">
        <div className="profile-symbol">
          {profile.primary.title
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <p className="card-label">
            ENTREPRENEUR DECISION PROFILE
          </p>

          <h3>
            {profile.primary.title}
          </h3>

          <p>
            {profile.explanation}
          </p>
        </div>

        <div className="profile-confidence">
          <span>
            Pattern confidence
          </span>

          <strong>
            {profile.confidence}%
          </strong>
        </div>
      </div>

      <div className="profile-traits">
        {profile.traits.map(
          (trait) => (
            <span key={trait}>
              {trait}
            </span>
          )
        )}
      </div>

      <div className="profile-detail-grid">
        <div>
          <p className="card-label">
            STRENGTHS
          </p>

          {profile.strengths.map(
            (item) => (
              <div
                className="profile-point positive"
                key={item}
              >
                <span>+</span>
                <p>{item}</p>
              </div>
            )
          )}
        </div>

        <div>
          <p className="card-label">
            WATCH OUT FOR
          </p>

          {profile.watchouts.map(
            (item) => (
              <div
                className="profile-point warning"
                key={item}
              >
                <span>!</span>
                <p>{item}</p>
              </div>
            )
          )}
        </div>
      </div>

      {profile.secondary && (
        <div className="secondary-profile">
          <span>
            Secondary tendency
          </span>

          <strong>
            {
              profile.secondary
                .title
            }
          </strong>
        </div>
      )}
    </section>
  );
}


function PersonalisedLearningPanel({
  learning,
}) {
  const guidance =
    learning.profileGuidance;

  return (
    <section className="personal-learning-panel">
      <div className="learning-guidance">
        <p className="card-label">
          PERSONALISED GUIDANCE
        </p>

        <h3>
          {guidance.headline}
        </h3>

        <p>
          {guidance.message}
        </p>

        <div className="learning-challenge">
          <span>
            NEXT CHALLENGE
          </span>

          <p>
            {guidance.challenge}
          </p>
        </div>
      </div>

      <div className="recommended-learning">
        <div className="learning-heading">
          <div>
            <p className="card-label">
              RECOMMENDED LEARNING
            </p>

            <h3>
              What should you focus
              on next?
            </h3>
          </div>

          <span>
            {
              learning
                .recommendations
                .length
            }{" "}
            topics
          </span>
        </div>

        <div className="learning-topic-list">
          {learning.recommendations.map(
            (item) => (
              <article
                className="learning-topic-card"
                key={item.id}
              >
                <div className="learning-topic-top">
                  <span
                    className={`learning-priority priority-${item.priority
                      .toLowerCase()
                      .replace(
                        " ",
                        "-"
                      )}`}
                  >
                    {item.priority}
                  </span>

                  <span>
                    {item.category}
                  </span>
                </div>

                <h4>
                  {item.title}
                </h4>

                <p>
                  {
                    item.description
                  }
                </p>

                <div className="learning-score">
                  <span>
                    Current learning
                    score
                  </span>

                  <strong>
                    {
                      Math.round(
                        item.currentScore
                      )
                    }
                    %
                  </strong>
                </div>

                <div className="why-it-matters">
                  <strong>
                    Why this matters
                  </strong>

                  <p>
                    {item.why}
                  </p>
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}


function AdvisorConversationPanel({
  conversation,
}) {
  return (
    <section className="advisor-conversation-panel">
      <div className="advisor-conversation-heading">
        <div>
          <p className="card-label">
            YAEI ADVISOR DISCUSSION
          </p>

          <h3>
            Suggested coaching
            conversation
          </h3>

          <p>
            These prompts help an
            advisor connect simulation
            behaviour to the
            entrepreneur's real
            business.
          </p>
        </div>

        <div className="advisor-session-stats">
          <div>
            <span>
              Decisions
            </span>

            <strong>
              {
                conversation.decisions
              }
            </strong>
          </div>

          <div>
            <span>
              Reflections
            </span>

            <strong>
              {
                conversation.reflections
              }
            </strong>
          </div>

          <div>
            <span>
              Recoveries
            </span>

            <strong>
              {
                conversation.recoveryActions
              }
            </strong>
          </div>
        </div>
      </div>

      <div className="advisor-question-list">
        {conversation.prompts.map(
          (prompt, index) => (
            <article
              className="advisor-question"
              key={prompt.id}
            >
              <span className="advisor-question-number">
                {index + 1}
              </span>

              <div>
                <span className="advisor-question-type">
                  {prompt.title}
                </span>

                <h4>
                  {
                    prompt.question
                  }
                </h4>

                <p>
                  <strong>
                    Advisor purpose:
                  </strong>{" "}
                  {
                    prompt.purpose
                  }
                </p>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}


function BusinessTaskCentre({
  tasks,
  summary,
  selectedTaskId,
  setSelectedTaskId,
  handleCompleteTask,
  handlePostponeTask,
  taskNotice,
  lastTaskOutcome,
}) {
  return (
    <section className="task-centre">
      <div className="task-centre-heading">
        <div>
          <p className="card-label">
            TODAY'S BUSINESS TASKS
          </p>

          <h2>
            What needs to get done?
          </h2>

          <p>
            Running a business also
            means managing deadlines,
            follow-ups and operational
            responsibilities.
          </p>
        </div>

        <div className="task-summary">
          <div>
            <span>Total</span>
            <strong>
              {summary.total}
            </strong>
          </div>

          <div className="task-summary-critical">
            <span>Critical</span>
            <strong>
              {summary.critical}
            </strong>
          </div>
        </div>
      </div>


      {lastTaskOutcome && (
        <div
          className={`task-last-outcome task-${lastTaskOutcome.type}`}
        >
          <strong>
            {
              lastTaskOutcome.headline
            }
          </strong>

          <span>
            {
              lastTaskOutcome.title
            }
          </span>

          <p>
            {
              lastTaskOutcome.explanation
            }
          </p>
        </div>
      )}


      {tasks.length === 0 ? (
        <div className="task-empty">
          <span>✓</span>

          <div>
            <strong>
              Today's operational work
              is complete.
            </strong>

            <p>
              You can now focus on the
              main business decision.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="task-list">
            {tasks.map(
              (task) => {
                const selected =
                  selectedTaskId ===
                  task.id;

                return (
                  <button
                    key={task.id}
                    className={`task-item ${
                      selected
                        ? "selected"
                        : ""
                    } task-priority-${task.priority.toLowerCase()}`}
                    onClick={() =>
                      setSelectedTaskId(
                        task.id
                      )
                    }
                  >
                    <div className="task-item-top">
                      <div>
                        <span className="task-category">
                          {
                            task.category
                          }
                        </span>

                        {task.carriedOver && (
                          <span className="task-carried">
                            OVERDUE
                          </span>
                        )}
                      </div>

                      <span
                        className={`task-priority task-priority-label-${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <h3>
                      {task.title}
                    </h3>

                    <p>
                      {
                        task.description
                      }
                    </p>

                    <div className="task-due">
                      Due today
                    </div>
                  </button>
                );
              }
            )}
          </div>

          {taskNotice && (
            <p className="notice">
              {taskNotice}
            </p>
          )}

          <div className="task-actions">
            <button
              className="task-complete-button"
              onClick={
                handleCompleteTask
              }
            >
              Complete Task
            </button>

            <button
              className="task-postpone-button"
              onClick={
                handlePostponeTask
              }
            >
              Postpone
            </button>
          </div>
        </>
      )}
    </section>
  );
}


function JourneyCalendar({
  progress,
  mode,
}) {
  return (
    <section className="journey-calendar">
      <div className="journey-calendar-heading">
        <div>
          <p className="card-label">
            BUSINESS JOURNEY
          </p>

          <h2>
            Your six-stage business
            experience
          </h2>

          <p>
            Each stage builds on the
            decisions you made before
            it.
          </p>
        </div>

        <div className="journey-progress-summary">
          <span>
            JOURNEY PROGRESS
          </span>

          <strong>
            {progress.percent}%
          </strong>

          <small>
            {progress.completed} of{" "}
            {progress.total} stages
            completed
          </small>
        </div>
      </div>

      {mode === "demo" && (
        <div className="journey-demo-banner">
          <span>DEMO MODE</span>

          <p>
            All stages are unlocked
            for development and
            presentation testing.
          </p>
        </div>
      )}

      {mode !== "demo" && (
        <div className="journey-learning-banner">
          <span>
            REFLECTION MODE
          </span>

          <p>
            New stages open one day
            at a time so you can
            reflect on your decisions
            before continuing.
          </p>
        </div>
      )}

      <div className="journey-stage-list">
        {progress.stages.map(
          (stage) => (
            <article
              key={stage.day}
              className={`journey-stage journey-stage-${stage.status}`}
            >
              <div className="journey-stage-number">
                {stage.isCompleted
                  ? "✓"
                  : stage.day}
              </div>

              <div className="journey-stage-content">
                <div className="journey-stage-top">
                  <span>
                    {stage.month}
                  </span>

                  <span
                    className={`journey-stage-status journey-status-${stage.status}`}
                  >
                    {stage.status ===
                    "completed"
                      ? "Completed"
                      : stage.status ===
                          "current"
                        ? "Current"
                        : stage.status ===
                            "available"
                          ? "Available"
                          : "Locked"}
                  </span>
                </div>

                <strong>
                  {stage.title}
                </strong>

                <small>
                  Focus:{" "}
                  {stage.focus}
                </small>

                {stage.status ===
                  "locked" && (
                  <p>
                    Opens{" "}
                    {
                      stage.unlockLabel
                    }
                  </p>
                )}
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}


function DynamicBusinessEvent({
  event,
  selectedOptionId,
  setSelectedOptionId,
  handleEvent,
  eventNotice,
  lastEventOutcome,
}) {
  const resolved =
    event.status ===
    "resolved";

  return (
    <section
      className={`dynamic-event dynamic-event-${event.type.toLowerCase()}`}
    >
      <div className="dynamic-event-header">
        <div className="dynamic-event-symbol">
          {event.type ===
          "OPPORTUNITY"
            ? "+"
            : event.type ===
                "RISK"
              ? "!"
              : "•"}
        </div>

        <div>
          <p className="card-label">
            UNEXPECTED BUSINESS EVENT
          </p>

          <div className="dynamic-event-title-row">
            <h2>
              {event.title}
            </h2>

            <span>
              {event.type}
            </span>
          </div>

          <p>
            {event.message}
          </p>
        </div>
      </div>


      <div className="event-probability-explanation">
        <span>
          WHY THIS EVENT?
        </span>

        <p>
          {
            event.probabilityReason
          }
        </p>
      </div>


      {!resolved ? (
        <>
          <div className="event-response-heading">
            <p className="card-label">
              YOUR RESPONSE
            </p>

            <h3>
              What do you want to do?
            </h3>
          </div>

          <div className="event-options">
            {event.options.map(
              (option) => (
                <button
                  key={option.id}
                  className={`event-option ${
                    selectedOptionId ===
                    option.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedOptionId(
                      option.id
                    )
                  }
                >
                  <span className="event-option-radio">
                    {selectedOptionId ===
                    option.id
                      ? "✓"
                      : ""}
                  </span>

                  <div>
                    <strong>
                      {
                        option.title
                      }
                    </strong>

                    <p>
                      {
                        option.description
                      }
                    </p>
                  </div>
                </button>
              )
            )}
          </div>

          {eventNotice && (
            <p className="notice">
              {eventNotice}
            </p>
          )}

          <button
            className="event-confirm-button"
            onClick={
              handleEvent
            }
          >
            Respond to Event
          </button>
        </>
      ) : (
        <article className="event-resolved">
          <span>
            EVENT RESOLVED
          </span>

          <h3>
            {
              event.outcome
                ?.headline
            }
          </h3>

          <p>
            {
              event.outcome
                ?.explanation
            }
          </p>

          <div>
            <strong>
              Business lesson
            </strong>

            <p>
              {
                event.outcome
                  ?.lesson
              }
            </p>
          </div>
        </article>
      )}
    </section>
  );
}


function BusinessWorldView({
  world,
  simulation,
}) {
  return (
    <section className="world-page">
      <div className="world-hero">
        <div>
          <p className="card-label">
            LIVING BUSINESS WORLD
          </p>

          <h2>
            Your company is becoming
            its own story.
          </h2>

          <p>
            Customers, employees,
            lenders and the market are
            reacting to the decisions
            you make.
          </p>
        </div>

        <div className="world-mood">
          <span>
            COMPANY MOOD
          </span>

          <strong>
            {world.companyMood}
          </strong>

          <small>
            Day{" "}
            {Math.min(
              simulation.currentDay,
              MAX_MVP_DAY
            )}{" "}
            of the business journey
          </small>
        </div>
      </div>


      <div className="world-score-grid">
        <WorldScore
          label="Reputation"
          value={
            world.reputation
          }
          detail="How customers and stakeholders perceive the company."
        />

        <WorldScore
          label="Momentum"
          value={
            world.momentum
          }
          detail="Whether the business feels like it is moving forward or losing energy."
        />

        <WorldScore
          label="Financial Resilience"
          value={
            world.resilience
          }
          detail="Ability to absorb financial pressure and unexpected costs."
        />

        <WorldScore
          label="Team Confidence"
          value={
            world.teamConfidence
          }
          detail="How healthy and confident the team currently feels."
        />

        <WorldScore
          label="Customer Trust"
          value={
            world.customerTrust
          }
          detail="Strength of current customer relationships."
        />
      </div>


      <div className="world-main-grid">
        <article className="world-feed-card">
          <div className="world-section-heading">
            <div>
              <p className="card-label">
                BUSINESS PULSE
              </p>

              <h3>
                What is happening
                around your company?
              </h3>
            </div>

            <span>
              LIVE STORY
            </span>
          </div>

          <div className="world-feed">
            {world.feed.map(
              (item) => (
                <div
                  className="world-feed-item"
                  key={item.id}
                >
                  <div
                    className={`world-feed-type world-feed-${item.type.toLowerCase()}`}
                  >
                    {item.type
                      .charAt(0)}
                  </div>

                  <div>
                    <div className="world-feed-meta">
                      <span>
                        {item.type}
                      </span>

                      <small>
                        {
                          item.time
                        }
                      </small>
                    </div>

                    <strong>
                      {item.title}
                    </strong>

                    <p>
                      {item.message}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </article>


        <article className="world-voices-card">
          <p className="card-label">
            VOICES AROUND THE BUSINESS
          </p>

          <h3>
            What people are saying
          </h3>

          <div className="world-voices">
            {world.voices.map(
              (voice) => (
                <div
                  key={voice.source}
                  className={`world-voice world-voice-${voice.sentiment}`}
                >
                  <span>
                    “
                  </span>

                  <p>
                    {voice.quote}
                  </p>

                  <strong>
                    —{" "}
                    {voice.source}
                  </strong>
                </div>
              )
            )}
          </div>
        </article>
      </div>


      <article className="world-milestones-card">
        <div className="world-section-heading">
          <div>
            <p className="card-label">
              BUSINESS MILESTONES
            </p>

            <h3>
              Moments worth
              remembering
            </h3>
          </div>

          <strong className="world-milestone-count">
            {
              world.milestones
                .length
            }
          </strong>
        </div>

        {world.milestones.length ===
        0 ? (
          <div className="world-no-milestones">
            Keep running the company.
            Major milestones will
            appear as your business
            develops.
          </div>
        ) : (
          <div className="world-milestone-grid">
            {world.milestones.map(
              (milestone) => (
                <div
                  className="world-milestone"
                  key={
                    milestone.id
                  }
                >
                  <span>
                    ★
                  </span>

                  <div>
                    <strong>
                      {
                        milestone.title
                      }
                    </strong>

                    <p>
                      {
                        milestone.description
                      }
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </article>


      <article className="world-learning-banner">
        <span>
          IIMS EXPERIENCE INSIGHT
        </span>

        <h3>
          A business is more than its
          bank balance.
        </h3>

        <p>
          Every decision can change
          reputation, employee
          confidence, customer trust,
          financial resilience and
          future opportunities.
          Entrepreneurs must manage
          the whole system — not one
          number at a time.
        </p>
      </article>
    </section>
  );
}


function WorldScore({
  label,
  value,
  detail,
}) {
  return (
    <article className="world-score">
      <div>
        <span>{label}</span>

        <strong>
          {value}%
        </strong>
      </div>

      <div className="world-score-track">
        <span
          style={{
            width: `${value}%`,
          }}
        />
      </div>

      <p>
        {detail}
      </p>
    </article>
  );
}


function ManagementMeetingPreview({
  managementTeam,
  setActiveView,
}) {
  const {
    consensus,
    team,
  } = managementTeam;

  return (
    <section className="management-preview">
      <div className="management-preview-heading">
        <div>
          <p className="card-label">
            MANAGEMENT MEETING
          </p>

          <h2>
            Your leadership team has
            different views.
          </h2>

          <p>
            Listen to the advice, but
            remember: you are still
            responsible for the final
            decision.
          </p>
        </div>

        <div className="management-room-mood">
          <span>
            ROOM MOOD
          </span>

          <strong>
            {
              consensus.roomMood
            }
          </strong>
        </div>
      </div>

      <div className="management-preview-people">
        {team.map(
          (member) => (
            <div
              className={`management-mini-person management-stance-${member.stance}`}
              key={member.id}
            >
              <div className="management-avatar">
                {
                  member.initials
                }
              </div>

              <div>
                <strong>
                  {member.name}
                </strong>

                <span>
                  {
                    member.shortRole
                  }
                </span>
              </div>

              <div className="management-mini-position">
                {member.stance ===
                "supportive"
                  ? "SUPPORT"
                  : member.stance ===
                      "cautious"
                    ? "CAUTION"
                    : "BALANCED"}
              </div>
            </div>
          )
        )}
      </div>

      <div className="management-preview-bottom">
        <div className="management-consensus-mini">
          <span>
            {consensus.supportive} support
          </span>

          <span>
            {consensus.balanced} balanced
          </span>

          <span>
            {consensus.cautious} cautious
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            setActiveView(
              "team"
            )
          }
        >
          Enter Management Meeting
        </button>
      </div>
    </section>
  );
}


function ManagementTeamView({
  managementTeam,
  simulation,
  scenario,
}) {
  const {
    team,
    consensus,
  } = managementTeam;

  const [selectedMember, setSelectedMember] =
    useState(
      team[0]?.id || "cfo"
    );

  const activeMember =
    team.find(
      (member) =>
        member.id ===
        selectedMember
    ) || team[0];

  return (
    <section className="management-page">
      <div className="management-room-hero">
        <div>
          <p className="card-label">
            VIRTUAL MANAGEMENT TEAM
          </p>

          <h2>
            Leadership meeting in
            progress.
          </h2>

          <p>
            Your management team has
            reviewed the current
            business position and the
            decision in front of you.
          </p>
        </div>

        <div className="management-current-decision">
          <span>
            CURRENT DISCUSSION
          </span>

          <strong>
            {scenario?.title ||
              `Business Day ${simulation.currentDay}`}
          </strong>

          <small>
            Day{" "}
            {Math.min(
              simulation.currentDay,
              MAX_MVP_DAY
            )}{" "}
            / {MAX_MVP_DAY}
          </small>
        </div>
      </div>


      <div className="management-consensus">
        <div>
          <p className="card-label">
            LEADERSHIP TEMPERATURE
          </p>

          <h3>
            {consensus.roomMood}
          </h3>

          <p>
            Average confidence in the
            team's current advice:{" "}
            <strong>
              {
                consensus.averageConfidence
              }
              %
            </strong>
          </p>
        </div>

        <div className="management-consensus-bars">
          <ManagementConsensusBar
            label="Support"
            value={
              consensus.supportive
            }
            total={team.length}
            tone="support"
          />

          <ManagementConsensusBar
            label="Balanced"
            value={
              consensus.balanced
            }
            total={team.length}
            tone="balanced"
          />

          <ManagementConsensusBar
            label="Caution"
            value={
              consensus.cautious
            }
            total={team.length}
            tone="caution"
          />
        </div>
      </div>


      <div className="management-team-tabs">
        {team.map(
          (member) => (
            <button
              type="button"
              key={member.id}
              className={
                selectedMember ===
                member.id
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedMember(
                  member.id
                )
              }
            >
              <div className="management-tab-avatar">
                {
                  member.initials
                }
              </div>

              <div>
                <strong>
                  {member.name}
                </strong>

                <span>
                  {
                    member.shortRole
                  }
                </span>
              </div>

              <span
                className={`management-tab-stance management-tab-${member.stance}`}
              >
                {member.stance}
              </span>
            </button>
          )
        )}
      </div>


      {activeMember && (
        <div className="management-advisor-stage">
          <div className="management-advisor-profile">
            <div className="management-large-avatar">
              {
                activeMember.initials
              }
            </div>

            <div>
              <span>
                {
                  activeMember.department
                }
              </span>

              <h3>
                {
                  activeMember.name
                }
              </h3>

              <p>
                {
                  activeMember.role
                }
              </p>
            </div>

            <div
              className={`management-position-badge management-position-${activeMember.stance}`}
            >
              {activeMember.stance ===
              "supportive"
                ? "SUPPORTIVE"
                : activeMember.stance ===
                    "cautious"
                  ? "CAUTIOUS"
                  : "BALANCED"}
            </div>
          </div>


          <div className="management-advice-grid">
            <article className="management-main-advice">
              <span>
                MY VIEW
              </span>

              <h2>
                {
                  activeMember.headline
                }
              </h2>

              <p>
                {
                  activeMember.advice
                }
              </p>

              <div className="management-scenario-insight">
                <strong>
                  On today's decision
                </strong>

                <p>
                  {
                    activeMember.scenarioInsight
                  }
                </p>
              </div>
            </article>


            <aside className="management-advisor-sidebar">
              <div className="management-confidence">
                <span>
                  CONFIDENCE
                </span>

                <strong>
                  {
                    activeMember.confidence
                  }
                  %
                </strong>

                <div>
                  <span
                    style={{
                      width: `${activeMember.confidence}%`,
                    }}
                  />
                </div>
              </div>

              <div className="management-focus">
                <span>
                  PRIMARY FOCUS
                </span>

                <p>
                  {
                    activeMember.focus
                  }
                </p>
              </div>

              <div className="management-live-metric">
                <span>
                  LIVE METRIC
                </span>

                <p>
                  {
                    activeMember.metric.label
                  }
                </p>

                <strong>
                  {
                    activeMember.metric.value
                  }
                </strong>
              </div>
            </aside>
          </div>


          <article className="management-warning-card">
            <div>
              !
            </div>

            <div>
              <span>
                WHAT I WOULD WATCH
              </span>

              <p>
                {
                  activeMember.warning
                }
              </p>
            </div>
          </article>
        </div>
      )}


      <article className="management-founder-message">
        <span>
          YOUR ROLE AS FOUNDER
        </span>

        <h3>
          Advisors advise. You decide.
        </h3>

        <p>
          A strong entrepreneur does
          not simply follow the person
          with the loudest opinion.
          Compare finance, people,
          operations, customers and
          risk — then make a decision
          you can defend.
        </p>
      </article>
    </section>
  );
}


function ManagementConsensusBar({
  label,
  value,
  total,
  tone,
}) {
  const percent =
    total > 0
      ? (value / total) * 100
      : 0;

  return (
    <div className="management-consensus-row">
      <div>
        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>
      </div>

      <div className="management-consensus-track">
        <span
          className={`management-consensus-${tone}`}
          style={{
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  );
}


function CommandCentreView({
  commandCentre,
  simulation,
  setActiveView,
}) {
  const {
    metrics,
    alerts,
    focus,
    urgentTasks,
    latestMilestones,
    nextDecision,
    managementSignal,
  } = commandCentre;


  const healthLabel =
    commandCentre.health >= 80
      ? "Strong"
      : commandCentre.health >= 65
        ? "Healthy"
        : commandCentre.health >= 45
          ? "Under Pressure"
          : "Critical";


  return (
    <section className="command-centre-page">
      <div className="command-centre-hero">
        <div className="command-centre-hero-copy">
          <p className="card-label">
            CEO COMMAND CENTRE
          </p>

          <h1>
            Good morning,
            Founder.
          </h1>

          <p>
            Here is what needs your
            attention across the
            business right now.
          </p>
        </div>

        <div className="command-business-health">
          <div
            className="command-health-ring"
            style={{
              "--health":
                `${commandCentre.health * 3.6}deg`,
            }}
          >
            <div>
              <strong>
                {
                  commandCentre.health
                }
              </strong>

              <span>
                / 100
              </span>
            </div>
          </div>

          <div>
            <span>
              BUSINESS HEALTH
            </span>

            <strong>
              {healthLabel}
            </strong>

            <small>
              Day{" "}
              {Math.min(
                simulation.currentDay,
                MAX_MVP_DAY
              )}{" "}
              / {MAX_MVP_DAY}
            </small>
          </div>
        </div>
      </div>


      <div className="command-metric-grid">
        <CommandMetric
          label="Cash Available"
          value={formatCurrency(
            metrics.cash
          )}
          detail={`${metrics.runway.toFixed(
            1
          )} months runway`}
          trend={
            metrics.runway >= 1
              ? "stable"
              : "risk"
          }
        />

        <CommandMetric
          label="Monthly Profit"
          value={formatCurrency(
            metrics.profit
          )}
          detail={
            metrics.profit >= 0
              ? "Business is profitable"
              : "Expenses exceed revenue"
          }
          trend={
            metrics.profit >= 0
              ? "positive"
              : "risk"
          }
        />

        <CommandMetric
          label="Reputation"
          value={`${metrics.reputation}%`}
          detail="External confidence"
          trend={
            metrics.reputation >= 70
              ? "positive"
              : "stable"
          }
        />

        <CommandMetric
          label="Momentum"
          value={`${metrics.momentum}%`}
          detail="Business direction"
          trend={
            metrics.momentum >= 70
              ? "positive"
              : "stable"
          }
        />

        <CommandMetric
          label="Business Risk"
          value={`${Math.round(
            metrics.risk
          )}%`}
          detail="Combined risk pressure"
          trend={
            metrics.risk >= 70
              ? "risk"
              : "stable"
          }
        />
      </div>


      <div className="command-main-grid">
        <div className="command-left-column">
          <article
            className={`command-focus command-focus-${focus.type}`}
          >
            <div className="command-focus-top">
              <span>
                {focus.label}
              </span>

              <span>
                CEO FOCUS
              </span>
            </div>

            <h2>
              {focus.title}
            </h2>

            <p>
              {focus.message}
            </p>

            <div className="command-focus-question">
              <span>
                ASK YOURSELF
              </span>

              <strong>
                {focus.question}
              </strong>
            </div>
          </article>


          <article className="command-alert-panel">
            <div className="command-section-heading">
              <div>
                <p className="card-label">
                  ATTENTION REQUIRED
                </p>

                <h3>
                  Business alerts
                </h3>
              </div>

              <span className="command-alert-count">
                {alerts.length}
              </span>
            </div>

            {alerts.length === 0 ? (
              <div className="command-clear-state">
                <span>
                  ✓
                </span>

                <div>
                  <strong>
                    No major alerts
                  </strong>

                  <p>
                    The business has no
                    urgent warning
                    signals right now.
                  </p>
                </div>
              </div>
            ) : (
              <div className="command-alert-list">
                {alerts.map(
                  (alert) => (
                    <div
                      key={
                        alert.id
                      }
                      className={`command-alert command-alert-${alert.level}`}
                    >
                      <div className="command-alert-icon">
                        {alert.level ===
                        "critical"
                          ? "!"
                          : alert.level ===
                              "positive"
                            ? "✓"
                            : alert.level ===
                                "warning"
                              ? "!"
                              : "i"}
                      </div>

                      <div>
                        <strong>
                          {
                            alert.title
                          }
                        </strong>

                        <p>
                          {
                            alert.message
                          }
                        </p>
                      </div>

                      <span>
                        {
                          alert.action
                        }
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </article>
        </div>


        <div className="command-right-column">
          <article className="command-next-decision">
            <span className="command-small-label">
              NEXT MAJOR DECISION
            </span>

            <div className="command-decision-day">
              DAY{" "}
              {
                nextDecision.day
              }
            </div>

            <h3>
              {
                nextDecision.title
              }
            </h3>

            <p>
              {
                nextDecision.context
              }
            </p>

            <button
              type="button"
              onClick={() =>
                setActiveView(
                  "simulation"
                )
              }
            >
              Open Decision
              <span>→</span>
            </button>
          </article>


          <article className="command-management-signal">
            <div className="command-section-heading">
              <div>
                <p className="card-label">
                  MANAGEMENT TEAM
                </p>

                <h3>
                  {
                    managementSignal.mood
                  }
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveView(
                    "team"
                  )
                }
              >
                Open
              </button>
            </div>

            <div className="command-management-votes">
              <div>
                <strong>
                  {
                    managementSignal.supportive
                  }
                </strong>

                <span>
                  Support
                </span>
              </div>

              <div>
                <strong>
                  {
                    managementSignal.balanced
                  }
                </strong>

                <span>
                  Balanced
                </span>
              </div>

              <div>
                <strong>
                  {
                    managementSignal.cautious
                  }
                </strong>

                <span>
                  Caution
                </span>
              </div>
            </div>
          </article>


          <article className="command-pressure-card">
            <p className="card-label">
              COMPANY PULSE
            </p>

            <CommandPressure
              label="Financial Resilience"
              value={
                metrics.resilience
              }
            />

            <CommandPressure
              label="Customer Trust"
              value={
                Math.round(
                  metrics.customers
                )
              }
            />

            <CommandPressure
              label="Team Confidence"
              value={
                Math.round(
                  metrics.team
                )
              }
            />
          </article>
        </div>
      </div>


      <div className="command-secondary-grid">
        <article className="command-task-card">
          <div className="command-section-heading">
            <div>
              <p className="card-label">
                TODAY'S PRIORITIES
              </p>

              <h3>
                Operational work
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveView(
                  "simulation"
                )
              }
            >
              View all
            </button>
          </div>

          {urgentTasks.length ===
          0 ? (
            <div className="command-no-tasks">
              No critical or important
              tasks are outstanding.
            </div>
          ) : (
            <div className="command-task-list">
              {urgentTasks.map(
                (task) => (
                  <div
                    key={
                      task.id
                    }
                    className="command-task-row"
                  >
                    <span
                      className={`command-task-priority command-task-${task.priority.toLowerCase()}`}
                    >
                      {
                        task.priority
                      }
                    </span>

                    <div>
                      <strong>
                        {
                          task.title
                        }
                      </strong>

                      <p>
                        {
                          task.category
                        }
                      </p>
                    </div>

                    <span>
                      Today
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </article>


        <article className="command-milestone-card">
          <div className="command-section-heading">
            <div>
              <p className="card-label">
                RECENT WINS
              </p>

              <h3>
                Business milestones
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveView(
                  "world"
                )
              }
            >
              World
            </button>
          </div>

          {latestMilestones.length ===
          0 ? (
            <div className="command-no-tasks">
              Keep progressing through
              the journey to unlock
              business milestones.
            </div>
          ) : (
            <div className="command-milestone-list">
              {latestMilestones.map(
                (milestone) => (
                  <div
                    key={
                      milestone.id
                    }
                  >
                    <span>
                      ★
                    </span>

                    <div>
                      <strong>
                        {
                          milestone.title
                        }
                      </strong>

                      <p>
                        {
                          milestone.description
                        }
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </article>
      </div>


      <div className="command-shortcuts">
        <CommandShortcut
          label="Finance Centre"
          description="Understand cash, profit and financial health."
          button="Open Finance"
          onClick={() =>
            setActiveView(
              "finance"
            )
          }
        />

        <CommandShortcut
          label="Business World"
          description="See reputation, momentum and stakeholder reactions."
          button="View World"
          onClick={() =>
            setActiveView(
              "world"
            )
          }
        />

        <CommandShortcut
          label="Management Team"
          description="Hear different leadership perspectives before deciding."
          button="Enter Meeting"
          onClick={() =>
            setActiveView(
              "team"
            )
          }
        />

        <CommandShortcut
          label="Business Simulation"
          description="Return to today's tasks, events and decisions."
          button="Run Business"
          onClick={() =>
            setActiveView(
              "simulation"
            )
          }
        />
      </div>
    </section>
  );
}


function CommandMetric({
  label,
  value,
  detail,
  trend,
}) {
  return (
    <article
      className={`command-metric command-metric-${trend}`}
    >
      <div className="command-metric-top">
        <span>
          {label}
        </span>

        <span className="command-metric-dot" />
      </div>

      <strong>
        {value}
      </strong>

      <p>
        {detail}
      </p>
    </article>
  );
}


function CommandPressure({
  label,
  value,
}) {
  return (
    <div className="command-pressure-row">
      <div>
        <span>
          {label}
        </span>

        <strong>
          {value}%
        </strong>
      </div>

      <div className="command-pressure-track">
        <span
          style={{
            width: `${Math.max(
              0,
              Math.min(
                100,
                value
              )
            )}%`,
          }}
        />
      </div>
    </div>
  );
}


function CommandShortcut({
  label,
  description,
  button,
  onClick,
}) {
  return (
    <article className="command-shortcut">
      <div>
        <strong>
          {label}
        </strong>

        <p>
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={
          onClick
        }
      >
        {button}
        <span>
          →
        </span>
      </button>
    </article>
  );
}


function RelationshipsView({
  dashboard,
}) {
  const [
    selectedCharacterId,
    setSelectedCharacterId,
  ] = useState(
    dashboard.characters[0]
      ?.id || null
  );

  const selectedCharacter =
    dashboard.characters.find(
      (character) =>
        character.id ===
        selectedCharacterId
    ) ||
    dashboard.characters[0];


  return (
    <section className="relationships-page">
      <div className="relationships-hero">
        <div>
          <p className="card-label">
            BUSINESS RELATIONSHIPS
          </p>

          <h2>
            People remember how you
            run your business.
          </h2>

          <p>
            Customers, employees,
            suppliers, lenders and
            investors build trust over
            time based on your
            decisions.
          </p>
        </div>

        <div className="relationship-trust-summary">
          <span>
            AVERAGE TRUST
          </span>

          <strong>
            {
              dashboard.averageTrust
            }
            %
          </strong>

          <small>
            Across key business
            relationships
          </small>
        </div>
      </div>


      <div className="relationship-summary-grid">
        <article>
          <span>
            STRONGEST RELATIONSHIP
          </span>

          <strong>
            {
              dashboard.strongest
                ?.name || "-"
            }
          </strong>

          <p>
            {
              dashboard.strongest
                ?.trust || 0
            }
            % trust
          </p>
        </article>

        <article>
          <span>
            MOST AT RISK
          </span>

          <strong>
            {
              dashboard.weakest
                ?.name || "-"
            }
          </strong>

          <p>
            {
              dashboard.weakest
                ?.trust || 0
            }
            % trust
          </p>
        </article>

        <article>
          <span>
            INTERACTIONS
          </span>

          <strong>
            {
              dashboard
                .interactions
                .length
            }
          </strong>

          <p>
            Relationship moments
            remembered
          </p>
        </article>
      </div>


      <div className="relationship-main-grid">
        <div className="relationship-character-list">
          {dashboard.characters.map(
            (character) => (
              <button
                type="button"
                key={character.id}
                onClick={() =>
                  setSelectedCharacterId(
                    character.id
                  )
                }
                className={`relationship-character-card ${
                  selectedCharacterId ===
                  character.id
                    ? "active"
                    : ""
                }`}
              >
                <div className="relationship-avatar">
                  {
                    character.initials
                  }
                </div>

                <div>
                  <strong>
                    {
                      character.name
                    }
                  </strong>

                  <span>
                    {
                      character.role
                    }
                  </span>

                  <small>
                    {
                      character.organisation
                    }
                  </small>
                </div>

                <div className="relationship-card-score">
                  <strong>
                    {
                      character.trust
                    }
                    %
                  </strong>

                  <span>
                    {
                      character.relationshipStatus
                    }
                  </span>
                </div>
              </button>
            )
          )}
        </div>


        {selectedCharacter && (
          <article className="relationship-profile">
            <div className="relationship-profile-heading">
              <div className="relationship-large-avatar">
                {
                  selectedCharacter.initials
                }
              </div>

              <div>
                <span>
                  {
                    selectedCharacter.type
                  }
                </span>

                <h2>
                  {
                    selectedCharacter.name
                  }
                </h2>

                <p>
                  {
                    selectedCharacter.role
                  }{" "}
                  ·{" "}
                  {
                    selectedCharacter.organisation
                  }
                </p>
              </div>

              <div className="relationship-status-badge">
                {
                  selectedCharacter.relationshipStatus
                }
              </div>
            </div>


            <div className="relationship-profile-grid">
              <RelationshipMeter
                label="Trust"
                value={
                  selectedCharacter.trust
                }
              />

              <RelationshipMeter
                label="Sentiment"
                value={
                  selectedCharacter.sentiment
                }
              />
            </div>


            <div className="relationship-personality">
              <div>
                <span>
                  PERSONALITY
                </span>

                <p>
                  {
                    selectedCharacter.personality
                  }
                </p>
              </div>

              <div>
                <span>
                  WHAT MATTERS TO THEM
                </span>

                <p>
                  {
                    selectedCharacter.motivation
                  }
                </p>
              </div>
            </div>


            <div className="relationship-bio">
              <span>
                RELATIONSHIP CONTEXT
              </span>

              <p>
                {
                  selectedCharacter.bio
                }
              </p>
            </div>


            <div className="relationship-memory-section">
              <div className="relationship-memory-heading">
                <div>
                  <span>
                    RELATIONSHIP MEMORY
                  </span>

                  <h3>
                    What this person
                    remembers
                  </h3>
                </div>

                <strong>
                  {
                    selectedCharacter
                      .memories.length
                  }
                </strong>
              </div>

              {selectedCharacter
                .memories.length ===
              0 ? (
                <div className="relationship-no-memory">
                  You have not had a
                  significant
                  interaction with
                  this person yet.
                </div>
              ) : (
                <div className="relationship-memory-list">
                  {[
                    ...selectedCharacter
                      .memories,
                  ]
                    .reverse()
                    .map(
                      (
                        memory
                      ) => (
                        <div
                          key={
                            memory.id
                          }
                          className="relationship-memory"
                        >
                          <div>
                            <span>
                              DAY{" "}
                              {
                                memory.day
                              }
                            </span>

                            <strong>
                              {
                                memory.trustChange >
                                0
                                  ? `+${memory.trustChange}`
                                  : memory.trustChange
                              }{" "}
                              trust
                            </strong>
                          </div>

                          <p>
                            {
                              memory.text
                            }
                          </p>
                        </div>
                      )
                    )}
                </div>
              )}
            </div>
          </article>
        )}
      </div>


      <article className="relationship-learning">
        <span>
          IIMS LEADERSHIP INSIGHT
        </span>

        <h3>
          Relationships are business
          assets.
        </h3>

        <p>
          Entrepreneurs do not make
          decisions in isolation.
          Employees remember how they
          were treated. Customers
          remember service failures.
          Lenders remember repayment
          discipline. Investors
          remember transparency.
          Strong relationships can
          create future opportunities
          — and damaged relationships
          can create future risk.
        </p>
      </article>
    </section>
  );
}


function RelationshipMeter({
  label,
  value,
}) {
  return (
    <div className="relationship-meter">
      <div>
        <span>
          {label}
        </span>

        <strong>
          {value}%
        </strong>
      </div>

      <div>
        <span
          style={{
            width:
              `${value}%`,
          }}
        />
      </div>
    </div>
  );
}


function RelationshipCallbackCard({
  event,
  setActiveView,
}) {
  const positive =
    event.type === "POSITIVE";

  const effectEntries =
    Object.entries(
      event.effect || {}
    );

  const formatEffectLabel = (
    key
  ) => {
    const labels = {
      cash: "Cash",
      revenue: "Revenue",
      expenses: "Expenses",
      employees: "Employees",
      customers: "Customers",
      employeeMorale:
        "Team Morale",
      customerSatisfaction:
        "Customer Trust",
      risk: "Business Risk",
      debt: "Debt",
      assets: "Assets",
    };

    return labels[key] || key;
  };


  return (
    <section
      className={`relationship-callback ${
        positive
          ? "relationship-callback-positive"
          : "relationship-callback-risk"
      }`}
    >
      <div className="relationship-callback-icon">
        {positive ? "★" : "!"}
      </div>

      <div className="relationship-callback-main">
        <div className="relationship-callback-top">
          <div>
            <p className="card-label">
              YOUR PAST DECISION CAME
              BACK
            </p>

            <h2>
              {event.title}
            </h2>
          </div>

          <span>
            {positive
              ? "POSITIVE CALLBACK"
              : "RELATIONSHIP RISK"}
          </span>
        </div>

        <p className="relationship-callback-message">
          {event.message}
        </p>

        <div className="relationship-callback-person">
          <span>
            RELATIONSHIP
          </span>

          <strong>
            {event.characterName}
          </strong>
        </div>

        {effectEntries.length >
          0 && (
          <div className="relationship-effect-grid">
            {effectEntries.map(
              ([key, value]) => (
                <div key={key}>
                  <span>
                    {formatEffectLabel(
                      key
                    )}
                  </span>

                  <strong
                    className={
                      value >= 0
                        ? "positive"
                        : "negative"
                    }
                  >
                    {value > 0
                      ? "+"
                      : ""}
                    {key ===
                      "employeeMorale" ||
                    key ===
                      "customerSatisfaction" ||
                    key === "risk"
                      ? `${value}%`
                      : key === "cash" ||
                          key === "revenue" ||
                          key === "expenses" ||
                          key === "debt" ||
                          key === "assets"
                        ? formatCurrency(
                            value
                          )
                        : value}
                  </strong>
                </div>
              )
            )}
          </div>
        )}

        <div className="relationship-callback-explanation">
          <span>
            WHY DID THIS HAPPEN?
          </span>

          <p>
            {event.explanation}
          </p>
        </div>

        <div className="relationship-callback-footer">
          <p>
            This consequence exists
            because the relationship
            remembers an earlier
            decision.
          </p>

          <button
            type="button"
            onClick={() =>
              setActiveView(
                "relationships"
              )
            }
          >
            View Relationship History
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}


function ConversationCentre({
  conversation,
  session,
  responses,
  completedToday,
  handleStart,
  handleResponse,
  handleComplete,
  notice,
}) {
  if (completedToday) {
    return (
      <section className="conversation-centre conversation-complete-card">
        <div className="conversation-complete-icon">
          ✓
        </div>

        <div>
          <p className="card-label">
            CONVERSATION COMPLETE
          </p>

          <h2>
            {conversation.title}
          </h2>

          <p>
            This conversation has
            already influenced the
            relationship and business
            today.
          </p>
        </div>
      </section>
    );
  }


  if (!session) {
    return (
      <section className="conversation-centre conversation-intro">
        <div className="conversation-intro-top">
          <div>
            <p className="card-label">
              LIVE CONVERSATION
            </p>

            <h2>
              {conversation.title}
            </h2>

            <p>
              {conversation.subtitle}
            </p>
          </div>

          <span className="conversation-live-badge">
            INTERACTIVE
          </span>
        </div>

        <div className="conversation-opening-preview">
          <div className="conversation-avatar">
            {conversation.opening.speaker
              .split(" ")
              .map(
                (part) =>
                  part[0]
              )
              .slice(0, 2)
              .join("")}
          </div>

          <div>
            <strong>
              {
                conversation.opening
                  .speaker
              }
            </strong>

            <p>
              “
              {
                conversation.opening
                  .text
              }
              ”
            </p>
          </div>
        </div>

        <button
          type="button"
          className="conversation-start-button"
          onClick={handleStart}
        >
          Start Conversation
          <span>→</span>
        </button>
      </section>
    );
  }


  return (
    <section className="conversation-centre">
      <div className="conversation-header">
        <div>
          <p className="card-label">
            LIVE NEGOTIATION
          </p>

          <h2>
            {conversation.title}
          </h2>

          <p>
            Your wording affects both
            the commercial result and
            the relationship.
          </p>
        </div>

        <span className="conversation-live-indicator">
          LIVE
        </span>
      </div>


      <div className="conversation-thread">
        {session.messages.map(
          (message) => (
            <div
              key={message.id}
              className={`conversation-message conversation-message-${message.type}`}
            >
              <div className="conversation-message-avatar">
                {message.type ===
                "entrepreneur"
                  ? "YOU"
                  : message.speaker
                      .split(" ")
                      .map(
                        (part) =>
                          part[0]
                      )
                      .slice(0, 2)
                      .join("")}
              </div>

              <div className="conversation-message-body">
                <div>
                  <strong>
                    {
                      message.speaker
                    }
                  </strong>

                  {message.tone && (
                    <span>
                      {message.tone}
                    </span>
                  )}
                </div>

                <p>
                  {message.text}
                </p>
              </div>
            </div>
          )
        )}
      </div>


      {!session.completed && (
        <div className="conversation-response-area">
          <p className="card-label">
            HOW DO YOU RESPOND?
          </p>

          <div className="conversation-response-list">
            {responses.map(
              (response) => (
                <button
                  type="button"
                  key={response.id}
                  onClick={() =>
                    handleResponse(
                      response
                    )
                  }
                  className="conversation-response"
                >
                  <div>
                    <span>
                      {response.tone}
                    </span>

                    <strong>
                      “
                      {
                        response.text
                      }
                      ”
                    </strong>
                  </div>

                  <span>
                    →
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      )}


      {session.completed && (
        <div className="conversation-outcome">
          <span>
            NEGOTIATION RESULT
          </span>

          <h3>
            {
              session.outcome
                ?.headline
            }
          </h3>

          <p>
            {
              session.outcome
                ?.lesson
            }
          </p>

          <div className="conversation-impact-summary">
            <div>
              <span>
                TRUST
              </span>

              <strong
                className={
                  session.trustChange >=
                  0
                    ? "positive"
                    : "negative"
                }
              >
                {session.trustChange >
                0
                  ? "+"
                  : ""}
                {
                  session.trustChange
                }
              </strong>
            </div>

            <div>
              <span>
                SENTIMENT
              </span>

              <strong
                className={
                  session.sentimentChange >=
                  0
                    ? "positive"
                    : "negative"
                }
              >
                {session.sentimentChange >
                0
                  ? "+"
                  : ""}
                {
                  session.sentimentChange
                }
              </strong>
            </div>
          </div>

          {notice && (
            <p className="notice">
              {notice}
            </p>
          )}

          <button
            type="button"
            className="conversation-confirm-button"
            onClick={
              handleComplete
            }
          >
            Confirm Conversation Outcome
          </button>
        </div>
      )}
    </section>
  );
}


function StorylinePathCard({
  path,
  currentDay,
}) {
  if (!path?.primary) {
    return null;
  }

  const reveal =
    currentDay >= 4;

  return (
    <section
      className={`storyline-path storyline-${path.primary.tone}`}
    >
      <div className="storyline-path-icon">
        {path.primary.id ===
        "cash-pressure"
          ? "!"
          : path.primary.id ===
              "expansion"
            ? "↗"
            : path.primary.id ===
                "people-pressure"
              ? "◎"
              : path.primary.id ===
                  "customer-opportunity"
                ? "★"
                : path.primary.id ===
                    "investor-governance"
                  ? "◆"
                  : path.primary.id ===
                      "debt-pressure"
                    ? "!"
                    : "●"}
      </div>

      <div className="storyline-path-main">
        <div className="storyline-path-heading">
          <div>
            <p className="card-label">
              YOUR BUSINESS STORY
            </p>

            <h2>
              {reveal
                ? path.primary.title
                : "Your business path is still forming"}
            </h2>
          </div>

          <span>
            {reveal
              ? `${path.primary.score}% signal`
              : "EMERGING"}
          </span>
        </div>

        <p>
          {reveal
            ? path.primary.description
            : "IIMS is watching how your decisions affect cash, people, customers, ownership and risk. Your later scenarios will change based on the company you create."}
        </p>

        {reveal && (
          <>
            <div className="storyline-indicators">
              <div>
                <span>
                  PRIMARY PATH
                </span>

                <strong>
                  {
                    path.primary.shortTitle
                  }
                </strong>
              </div>

              <div>
                <span>
                  SECONDARY SIGNAL
                </span>

                <strong>
                  {
                    path.secondary.shortTitle
                  }
                </strong>
              </div>

              <div>
                <span>
                  CASH COVER
                </span>

                <strong>
                  {
                    path.metrics.cashCoverage.toFixed(
                      1
                    )
                  }{" "}
                  months
                </strong>
              </div>

              <div>
                <span>
                  RISK
                </span>

                <strong>
                  {
                    Math.round(
                      path.metrics.risk
                    )
                  }
                  %
                </strong>
              </div>
            </div>

            {currentDay < 6 && (
              <div className="storyline-warning">
                <span>
                  STORYLINE IS NOT FIXED
                </span>

                <p>
                  Your next decisions
                  can still change the
                  path before the
                  final strategic
                  challenge.
                </p>
              </div>
            )}

            {currentDay === 6 && (
              <div className="storyline-branch-arrived">
                <span>
                  YOUR PATH CHANGED
                  THE FINAL SCENARIO
                </span>

                <p>
                  Another entrepreneur
                  could be facing a
                  completely different
                  strategic challenge
                  right now.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}


function DeepConsequenceCard({
  consequence,
  difficulty,
}) {
  const positive =
    consequence.type ===
      "COMPOUND_POSITIVE" ||
    consequence.type ===
      "WORLD_OPPORTUNITY";

  const external =
    consequence.type ===
      "WORLD_SHOCK" ||
    consequence.type ===
      "WORLD_OPPORTUNITY";


  return (
    <section
      className={`deep-consequence ${
        positive
          ? "deep-positive"
          : "deep-pressure"
      }`}
    >
      <div className="deep-consequence-symbol">
        {external
          ? "◈"
          : positive
            ? "↗"
            : "!"}
      </div>

      <div className="deep-consequence-main">
        <div className="deep-consequence-heading">
          <div>
            <p className="card-label">
              {external
                ? "BUSINESS ENVIRONMENT"
                : "COMPOUND CONSEQUENCE"}
            </p>

            <h2>
              {consequence.title}
            </h2>
          </div>

          <div className="deep-difficulty-badge">
            <span>
              SIMULATION MODE
            </span>

            <strong>
              {difficulty.level}
            </strong>
          </div>
        </div>

        <p className="deep-consequence-message">
          {consequence.message}
        </p>

        <div className="deep-why">
          <span>
            {external
              ? "WHY NOW?"
              : "WHY DID THIS HAPPEN?"}
          </span>

          <p>
            {consequence.why}
          </p>
        </div>

        <div className="deep-effect-row">
          {Object.entries(
            consequence.effects ||
              {}
          ).map(
            ([key, value]) => (
              <div key={key}>
                <span>
                  {key
                    .replace(
                      /([A-Z])/g,
                      " $1"
                    )
                    .replace(
                      /^./,
                      (text) =>
                        text.toUpperCase()
                    )}
                </span>

                <strong
                  className={
                    value >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {value > 0
                    ? "+"
                    : ""}
                  {value}
                </strong>
              </div>
            )
          )}
        </div>

        <div className="deep-lesson">
          <strong>
            Business lesson
          </strong>

          <p>
            {consequence.lesson}
          </p>
        </div>
      </div>
    </section>
  );
}


function EndingCard({
  ending,
}) {
  return (
    <section
      className={`ending-card ending-${ending.tone}`}
    >
      <div className="ending-score">
        <strong>
          {ending.score}
        </strong>

        <span>
          /100
        </span>
      </div>

      <div className="ending-content">
        <p className="card-label">
          BUSINESS ENDING
        </p>

        <h2>
          {ending.title}
        </h2>

        <h3>
          {ending.headline}
        </h3>

        <p>
          {ending.message}
        </p>

        <div>
          <span>
            NEXT CHAPTER
          </span>

          <strong>
            {ending.nextChapter}
          </strong>
        </div>
      </div>
    </section>
  );
}


function PerformanceReportView({
  report,
  simulation,
  readiness,
}) {
  const [
    reportTab,
    setReportTab,
  ] = useState(
    "entrepreneur"
  );


  const currency = (
    value
  ) =>
    new Intl.NumberFormat(
      "en-ZA",
      {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0,
      }
    ).format(
      value || 0
    );


  const percentChangeClass = (
    value,
    metricKey
  ) => {
    if (
      metricKey === "risk" ||
      metricKey === "expenses" ||
      metricKey === "debt"
    ) {
      return value <= 0
        ? "positive"
        : "negative";
    }

    return value >= 0
      ? "positive"
      : "negative";
  };


  const formatMetric = (
    metric
  ) => {
    if (
      [
        "cash",
        "revenue",
        "expenses",
        "debt",
      ].includes(
        metric.key
      )
    ) {
      return currency(
        metric.after
      );
    }

    if (
      [
        "employeeMorale",
        "customerSatisfaction",
        "risk",
      ].includes(
        metric.key
      )
    ) {
      return `${Math.round(
        metric.after
      )}%`;
    }

    return metric.after;
  };


  return (
    <div className="report-page">
      <section className="report-hero">
        <div>
          <p className="report-eyebrow">
            IIMS ENTREPRENEUR
            SIMULATION
          </p>

          <h1>
            Performance &
            Development Report
          </h1>

          <p>
            A live evidence-based
            summary of the
            entrepreneur's decisions,
            business outcomes,
            behavioural patterns and
            development needs.
          </p>
        </div>

        <div className="report-hero-actions">
          <button
            type="button"
            onClick={() =>
              window.print()
            }
          >
            {readiness.reportReady
              ? "Print Final Report"
              : "Print Draft Report"}
          </button>

          <span>
            Simulation ID
            <strong>
              {
                report.simulationSeed
              }
            </strong>
          </span>
        </div>
      </section>


      <section
        className={`report-readiness-banner report-readiness-${readiness.assessment.tone}`}
      >
        <div>
          <p className="card-label">
            ASSESSMENT STATUS
          </p>

          <h2>
            {
              readiness.assessment
                .title
            }
          </h2>

          <p>
            {
              readiness.assessment
                .description
            }
          </p>
        </div>

        <div className="report-readiness-score">
          <strong>
            {
              readiness
                .evidenceReadiness
            }
            %
          </strong>

          <span>
            EVIDENCE READINESS
          </span>
        </div>
      </section>

      <section className="report-summary-grid">
        <ReportScore
          label={
            readiness.reportReady
              ? "Business Outcome"
              : "Evidence Readiness"
          }
          value={
            readiness.reportReady
              ? report.business
                  .ending.score
              : readiness
                  .evidenceReadiness
          }
          detail={
            readiness.reportReady
              ? report.business
                  .ending.title
              : readiness.assessment
                  .label
          }
        />

        <ReportScore
          label={
            readiness.advisorReady
              ? "Capability"
              : "Capability Baseline"
          }
          value={
            report.entrepreneur
              .capabilityScore
          }
          detail={
            readiness.advisorReady
              ? "Observed simulation capability"
              : "More decisions needed for reliable assessment"
          }
        />

        <ReportScore
          label="Engagement"
          value={
            report.entrepreneur
              .engagementScore
          }
          detail="Simulation participation"
        />

        <ReportScore
          label="Completion"
          value={
            report.impact
              .completionRate
          }
          detail="Journey progress"
        />
      </section>


      <nav className="report-tabs">
        <button
          type="button"
          className={
            reportTab ===
            "entrepreneur"
              ? "active"
              : ""
          }
          onClick={() =>
            setReportTab(
              "entrepreneur"
            )
          }
        >
          Entrepreneur
        </button>

        <button
          type="button"
          className={
            reportTab ===
            "advisor"
              ? "active"
              : ""
          }
          onClick={() =>
            setReportTab(
              "advisor"
            )
          }
        >
          YAEI Advisor
        </button>

        <button
          type="button"
          className={
            reportTab ===
            "impact"
              ? "active"
              : ""
          }
          onClick={() =>
            setReportTab(
              "impact"
            )
          }
        >
          IIMS Impact
        </button>
      </nav>


      {reportTab ===
        "entrepreneur" && (
        <div className="report-section-stack">
          <section className="report-ending-panel">
            <div className="report-ending-score">
              <strong>
                {
                  report.business
                    .ending.score
                }
              </strong>

              <span>
                /100
              </span>
            </div>

            <div>
              <p className="card-label">
                {readiness.reportReady
                  ? "YOUR BUSINESS OUTCOME"
                  : "CURRENT ASSESSMENT STATUS"}
              </p>

              <h2>
                {
                  report.business
                    .ending.title
                }
              </h2>

              <h3>
                {
                  report.business
                    .ending.headline
                }
              </h3>

              <p>
                {
                  report.business
                    .ending.message
                }
              </p>

              <div className="report-next-chapter">
                <span>
                  NEXT DEVELOPMENT
                  CHAPTER
                </span>

                <strong>
                  {
                    report.business
                      .ending
                      .nextChapter
                  }
                </strong>
              </div>
            </div>
          </section>


          <section className="report-two-column">
            <div className="report-card">
              <p className="card-label">
                ENTREPRENEUR PROFILE
              </p>

              <h2>
                {
                  report.entrepreneur
                    .profile.title
                }
              </h2>

              <p>
                {
                  report.entrepreneur
                    .behaviour.text
                }
              </p>

              <div className="report-callout-positive">
                <span>
                  STRONGEST CAPABILITY
                </span>

                <strong>
                  {
                    report.entrepreneur
                      .strongestSkill
                      .label
                  }
                </strong>

                <p>
                  {
                    report.entrepreneur
                      .behaviour
                      .strongestStatement
                  }
                </p>
              </div>

              <div className="report-callout-development">
                <span>
                  DEVELOPMENT PRIORITY
                </span>

                <strong>
                  {
                    report.entrepreneur
                      .weakestSkill
                      .label
                  }
                </strong>

                <p>
                  {
                    report.entrepreneur
                      .behaviour
                      .developmentStatement
                  }
                </p>
              </div>
            </div>


            <div className="report-card">
              <p className="card-label">
                BUSINESS STORY
              </p>

              <h2>
                {
                  report.business
                    .path.primary.title
                }
              </h2>

              <p>
                {
                  report.business
                    .path.primary
                    .description
                }
              </p>

              <div className="report-business-path">
                <div>
                  <span>
                    PRIMARY PATH
                  </span>

                  <strong>
                    {
                      report.business
                        .path.primary
                        .shortTitle
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    SECONDARY SIGNAL
                  </span>

                  <strong>
                    {
                      report.business
                        .path.secondary
                        .shortTitle
                    }
                  </strong>
                </div>
              </div>
            </div>
          </section>


          <section className="report-card">
            <div className="report-card-heading">
              <div>
                <p className="card-label">
                  CAPABILITY PROFILE
                </p>

                <h2>
                  What your decisions
                  demonstrated
                </h2>
              </div>

              <strong>
                {
                  report.entrepreneur
                    .capabilityScore
                }
                %
              </strong>
            </div>

            <div className="report-skills">
              {
                report.entrepreneur
                  .skills.map(
                    (skill) => (
                      <div
                        key={
                          skill.key
                        }
                        className="report-skill-row"
                      >
                        <div>
                          <span>
                            {
                              skill.label
                            }
                          </span>

                          <strong>
                            {
                              skill.value
                            }
                            %
                          </strong>
                        </div>

                        <div className="report-skill-track">
                          <span
                            style={{
                              width:
                                `${Math.min(
                                  skill.value,
                                  100
                                )}%`,
                            }}
                          />
                        </div>

                        <small
                          className={
                            skill.change >=
                            0
                              ? "positive"
                              : "negative"
                          }
                        >
                          {skill.change >
                          0
                            ? "+"
                            : ""}
                          {
                            skill.change
                          }{" "}
                          from starting
                          level
                        </small>
                      </div>
                    )
                  )
              }
            </div>
          </section>


          <section className="report-card">
            <p className="card-label">
              BUSINESS MOVEMENT
            </p>

            <h2>
              What changed during
              your journey
            </h2>

            <div className="report-metric-grid">
              {
                report.business
                  .changes.map(
                    (metric) => (
                      <div
                        key={
                          metric.key
                        }
                        className="report-metric"
                      >
                        <span>
                          {
                            metric.label
                          }
                        </span>

                        <strong>
                          {
                            formatMetric(
                              metric
                            )
                          }
                        </strong>

                        <small
                          className={
                            percentChangeClass(
                              metric.change,
                              metric.key
                            )
                          }
                        >
                          {metric.change >
                          0
                            ? "+"
                            : ""}
                          {
                            [
                              "cash",
                              "revenue",
                              "expenses",
                              "debt",
                            ].includes(
                              metric.key
                            )
                              ? currency(
                                  metric.change
                                )
                              : metric.change
                          }
                        </small>
                      </div>
                    )
                  )
              }
            </div>
          </section>
        </div>
      )}


      {reportTab ===
        "advisor" && (
        <div className="report-section-stack">
          {!readiness.advisorReady && (
            <section className="advisor-evidence-warning">
              <div>
                <span>
                  LIMITED EVIDENCE
                </span>

                <h2>
                  Advisor conclusions are still provisional
                </h2>

                <p>
                  The entrepreneur has not yet completed enough strategic decisions for IIMS to make a strong development recommendation. Continue the simulation before treating these findings as formal advisory evidence.
                </p>
              </div>

              <strong>
                {
                  readiness
                    .evidenceReadiness
                }
                %
              </strong>
            </section>
          )}

          <section className="advisor-priority-panel">
            <div>
              <p className="card-label">
                RECOMMENDED YAEI
                INTERVENTION
              </p>

              <h2>
                {
                  report.advisor
                    .recommendation
                    .intervention
                }
              </h2>

              <p>
                {
                  report.advisor
                    .recommendation
                    .focus
                }
              </p>
            </div>

            <div className="advisor-priority-score">
              <span>
                DEVELOPMENT
                PRIORITY
              </span>

              <strong>
                {
                  report.advisor
                    .suggestedPriority
                }
              </strong>
            </div>
          </section>


          <section className="report-two-column">
            <div className="report-card">
              <p className="card-label">
                ADVISOR INTERPRETATION
              </p>

              <h2>
                Behaviour observed
              </h2>

              <p>
                {
                  report.entrepreneur
                    .behaviour.text
                }
              </p>

              <div className="advisor-evidence">
                <span>
                  STRONGEST CAPABILITY
                </span>

                <strong>
                  {
                    report.advisor
                      .strongestCapability
                  }
                </strong>
              </div>

              <div className="advisor-evidence">
                <span>
                  PRIORITY CAPABILITY
                </span>

                <strong>
                  {
                    report.advisor
                      .suggestedPriority
                  }
                </strong>
              </div>
            </div>


            <div className="report-card advisor-question-card">
              <p className="card-label">
                COACHING QUESTION
              </p>

              <h2>
                Ask the entrepreneur
              </h2>

              <blockquote>
                “
                {
                  report.advisor
                    .conversationPrompt
                }
                ”
              </blockquote>

              <p>
                Use the entrepreneur's
                own simulation
                decisions as evidence
                during the discussion.
              </p>
            </div>
          </section>


          <section className="report-card">
            <p className="card-label">
              RELATIONSHIP
              INTELLIGENCE
            </p>

            <h2>
              How the entrepreneur
              managed stakeholders
            </h2>

            <div className="advisor-relationship-grid">
              {
                report.relationships
                  .relationships.map(
                    (person) => (
                      <div
                        key={
                          person.id ||
                          person.name
                        }
                        className="advisor-relationship"
                      >
                        <div>
                          <strong>
                            {
                              person.name
                            }
                          </strong>

                          <span>
                            {
                              person.role
                            }
                          </span>
                        </div>

                        <div>
                          <span>
                            Trust
                          </span>

                          <strong>
                            {
                              person.trust
                            }
                            %
                          </strong>
                        </div>

                        <div>
                          <span>
                            Memories
                          </span>

                          <strong>
                            {
                              person.memories
                            }
                          </strong>
                        </div>
                      </div>
                    )
                  )
              }
            </div>
          </section>


          <section className="report-card">
            <p className="card-label">
              ADVISOR SESSION GUIDE
            </p>

            <h2>
              Suggested discussion
              flow
            </h2>

            <div className="advisor-session-steps">
              <div>
                <span>01</span>

                <strong>
                  Reflection
                </strong>

                <p>
                  Ask which decision
                  was hardest and why.
                </p>
              </div>

              <div>
                <span>02</span>

                <strong>
                  Evidence
                </strong>

                <p>
                  Review the financial
                  and stakeholder
                  consequences.
                </p>
              </div>

              <div>
                <span>03</span>

                <strong>
                  Development
                </strong>

                <p>
                  Explore the lowest
                  capability area.
                </p>
              </div>

              <div>
                <span>04</span>

                <strong>
                  Action
                </strong>

                <p>
                  Agree on one real
                  business action to
                  apply after the
                  simulation.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}


      {reportTab ===
        "impact" && (
        <div className="report-section-stack">
          <section className="impact-hero">
            <div>
              <p className="card-label">
                IIMS IMPACT EVIDENCE
              </p>

              <h2>
                Learning behaviour,
                not just completion
              </h2>

              <p>
                The simulation records
                what the entrepreneur
                actually did, how they
                responded to pressure,
                and where advisory
                support should focus.
              </p>
            </div>

            <div className="impact-hero-score">
              <strong>
                {
                  report.impact
                    .engagementScore
                }
                %
              </strong>

              <span>
                ENGAGEMENT
              </span>
            </div>
          </section>


          <section className="impact-evidence-grid">
            <ImpactMetric
              value={
                report.impact
                  .evidence
                  .strategicDecisions
              }
              label="Strategic decisions"
            />

            <ImpactMetric
              value={
                report.impact
                  .evidence
                  .conversations
              }
              label="Negotiations"
            />

            <ImpactMetric
              value={
                report.impact
                  .evidence
                  .reflections
              }
              label="Reflections"
            />

            <ImpactMetric
              value={
                report.impact
                  .evidence
                  .completedTasks
              }
              label="Business tasks"
            />

            <ImpactMetric
              value={
                report.impact
                  .evidence
                  .relationshipCallbacks
              }
              label="Relationship consequences"
            />

            <ImpactMetric
              value={
                report.impact
                  .evidence
                  .deepConsequences
              }
              label="Compound consequences"
            />

            <ImpactMetric
              value={
                report.impact
                  .evidence
                  .recoveryActions
              }
              label="Recovery actions"
            />

            <ImpactMetric
              value={
                report.impact
                  .completionRate
              }
              suffix="%"
              label="Journey completion"
            />
          </section>


          <section className="report-two-column">
            <div className="report-card">
              <p className="card-label">
                CAPABILITY EVIDENCE
              </p>

              <h2>
                Demonstrated learning
              </h2>

              <div className="impact-big-number">
                <strong>
                  {
                    report.impact
                      .capabilityScore
                  }
                  %
                </strong>

                <span>
                  overall simulated
                  capability
                </span>
              </div>

              <p>
                Capability is based on
                decisions made across
                finance, customers,
                people, funding,
                pricing, risk and
                growth.
              </p>
            </div>


            <div className="report-card">
              <p className="card-label">
                COMMERCIAL OUTCOME
              </p>

              <h2>
                Business movement
              </h2>

              <div className="impact-commercial-row">
                <span>
                  Revenue
                </span>

                <strong>
                  {
                    currency(
                      simulation
                        .baseline
                        .revenue
                    )
                  }
                  {" → "}
                  {
                    currency(
                      simulation
                        .business
                        .revenue
                    )
                  }
                </strong>
              </div>

              <div className="impact-commercial-row">
                <span>
                  Profit
                </span>

                <strong>
                  {
                    currency(
                      report.business
                        .profitBefore
                    )
                  }
                  {" → "}
                  {
                    currency(
                      report.business
                        .profitAfter
                    )
                  }
                </strong>
              </div>

              <div className="impact-commercial-row">
                <span>
                  Customers
                </span>

                <strong>
                  {
                    simulation
                      .baseline
                      .customers
                  }
                  {" → "}
                  {
                    simulation
                      .business
                      .customers
                  }
                </strong>
              </div>

              <div className="impact-commercial-row">
                <span>
                  Business risk
                </span>

                <strong>
                  {
                    simulation
                      .baseline
                      .risk
                  }
                  %
                  {" → "}
                  {
                    simulation
                      .business
                      .risk
                  }
                  %
                </strong>
              </div>
            </div>
          </section>


          <section className="impact-value-panel">
            <p className="card-label">
              WHY THIS MATTERS TO
              IIMS / YAEI
            </p>

            <h2>
              The simulation produces
              evidence that a normal
              course completion cannot.
            </h2>

            <div className="impact-value-grid">
              <div>
                <strong>
                  Decisions
                </strong>

                <p>
                  What the
                  entrepreneur chose
                  under pressure.
                </p>
              </div>

              <div>
                <strong>
                  Behaviour
                </strong>

                <p>
                  Patterns across
                  finance, people,
                  customers and
                  growth.
                </p>
              </div>

              <div>
                <strong>
                  Consequences
                </strong>

                <p>
                  Whether earlier
                  choices strengthened
                  or weakened the
                  simulated company.
                </p>
              </div>

              <div>
                <strong>
                  Advisory need
                </strong>

                <p>
                  A specific area for
                  YAEI support rather
                  than generic
                  business coaching.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}


function ReportScore({
  label,
  value,
  detail,
}) {
  return (
    <article className="report-score-card">
      <div>
        <strong>
          {Math.round(
            value || 0
          )}
        </strong>

        <span>%</span>
      </div>

      <p>
        {label}
      </p>

      <small>
        {detail}
      </small>
    </article>
  );
}


function ImpactMetric({
  value,
  label,
  suffix = "",
}) {
  return (
    <article className="impact-metric-card">
      <strong>
        {value}
        {suffix}
      </strong>

      <span>
        {label}
      </span>
    </article>
  );
}


function BusinessCreditLoanCentre({
  simulation,
  portfolio,
  applicationOpen,
  amount,
  setAmount,
  termMonths,
  setTermMonths,
  purpose,
  setPurpose,
  offer,
  notice,
  onGenerateOffer,
  onAcceptOffer,
  onCancel,
}) {
  const credit =
    portfolio.creditProfile;

  const activeLoans =
    portfolio.activeLoans ||
    [];


  return (
    <section className="loan-centre">
      <div className="loan-credit-summary">
        <div>
          <p className="card-label">
            IIMS BUSINESS CREDIT PROFILE
          </p>

          <h2>
            Build a business banks
            want to lend to
          </h2>

          <p>
            This is an educational
            simulation score. It is
            not a real credit-bureau
            score.
          </p>
        </div>

        <div className="loan-credit-score">
          <strong>
            {credit.score}
          </strong>

          <span>
            /100
          </span>

          <small>
            {credit.band}
          </small>
        </div>
      </div>


      <div className="credit-component-grid">
        {[
          [
            "Payment history",
            credit.components
              .paymentHistory,
          ],

          [
            "Cash flow",
            credit.components
              .cashFlow,
          ],

          [
            "Debt burden",
            credit.components
              .debtBurden,
          ],

          [
            "Liquidity",
            credit.components
              .liquidity,
          ],

          [
            "Profitability",
            credit.components
              .profitability,
          ],

          [
            "Financial discipline",
            credit.components
              .financialDiscipline,
          ],
        ].map(
          ([label, value]) => (
            <div
              key={label}
              className="credit-component"
            >
              <div>
                <span>
                  {label}
                </span>

                <strong>
                  {value}%
                </strong>
              </div>

              <div className="credit-component-track">
                <span
                  style={{
                    width:
                      `${value}%`,
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>


      <div className="loan-portfolio-summary">
        <div>
          <span>
            TOTAL BUSINESS DEBT
          </span>

          <strong>
            {formatCurrency(
              simulation.business
                .debt
            )}
          </strong>
        </div>

        <div>
          <span>
            ACTIVE LOAN BALANCE
          </span>

          <strong>
            {formatCurrency(
              portfolio
                .totalOutstanding
            )}
          </strong>
        </div>

        <div>
          <span>
            EST. MONTHLY DEBT SERVICE
          </span>

          <strong>
            {formatCurrency(
              portfolio
                .monthlyDebtService
            )}
          </strong>
        </div>

        <div>
          <span>
            ON-TIME PAYMENTS
          </span>

          <strong>
            {
              credit.metrics
                .onTimePayments
            }
          </strong>
        </div>
      </div>


      {applicationOpen && (
        <div className="loan-application">
          <div className="loan-application-heading">
            <div>
              <p className="card-label">
                BUSINESS LOAN APPLICATION
              </p>

              <h2>
                How much should the
                company borrow?
              </h2>

              <p>
                Compare affordability
                and total borrowing
                cost before accepting
                finance.
              </p>
            </div>

            <span>
              UBUNTU COMMERCIAL BANK
            </span>
          </div>


          <div className="loan-form-grid">
            <label>
              <span>
                Amount requested
              </span>

              <input
                type="number"
                min="10000"
                step="10000"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value
                  )
                }
              />
            </label>


            <label>
              <span>
                Loan purpose
              </span>

              <select
                value={purpose}
                onChange={(event) =>
                  setPurpose(
                    event.target.value
                  )
                }
              >
                <option>
                  Automation & equipment
                </option>

                <option>
                  Working capital
                </option>

                <option>
                  Business expansion
                </option>

                <option>
                  Vehicle / equipment
                </option>
              </select>
            </label>
          </div>


          <div className="loan-term-section">
            <span>
              REPAYMENT PERIOD
            </span>

            <div className="loan-term-options">
              {[12, 24, 36, 48, 60]
                .map(
                  (months) => (
                    <button
                      type="button"
                      key={months}
                      className={
                        Number(
                          termMonths
                        ) === months
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setTermMonths(
                          months
                        )
                      }
                    >
                      <strong>
                        {months}
                      </strong>

                      <span>
                        months
                      </span>
                    </button>
                  )
                )}
            </div>
          </div>


          {!offer && (
            <button
              type="button"
              className="loan-assess-button"
              onClick={
                onGenerateOffer
              }
            >
              Assess Loan Application
            </button>
          )}


          {offer && (
            <div
              className={`loan-offer loan-offer-${offer.status.toLowerCase()}`}
            >
              <div className="loan-offer-status">
                <div>
                  <span>
                    BANK DECISION
                  </span>

                  <h3>
                    {offer.status ===
                    "APPROVED"
                      ? "Loan Approved"
                      : offer.status ===
                          "PARTIAL"
                        ? "Partial Approval"
                        : "Application Declined"}
                  </h3>

                  <p>
                    {offer.reason}
                  </p>
                </div>

                <strong>
                  {offer.creditProfile
                    .score}
                  /100
                  <small>
                    CREDIT PROFILE
                  </small>
                </strong>
              </div>


              {offer.approvedAmount >
                0 && (
                <>
                  <div className="loan-offer-grid">
                    <LoanOfferMetric
                      label="Approved amount"
                      value={formatCurrency(
                        offer.approvedAmount
                      )}
                    />

                    <LoanOfferMetric
                      label="Interest rate"
                      value={`${offer.interestRate.toFixed(
                        1
                      )}% p.a.`}
                    />

                    <LoanOfferMetric
                      label="Monthly repayment"
                      value={formatCurrency(
                        offer.monthlyPayment
                      )}
                    />

                    <LoanOfferMetric
                      label="Loan term"
                      value={`${offer.application.termMonths} months`}
                    />

                    <LoanOfferMetric
                      label="Total interest"
                      value={formatCurrency(
                        offer.totalInterest
                      )}
                      warning
                    />

                    <LoanOfferMetric
                      label="Total repaid"
                      value={formatCurrency(
                        offer.totalRepayment
                      )}
                    />
                  </div>


                  <div className="loan-cost-lesson">
                    <div>
                      <span>
                        AMOUNT BORROWED
                      </span>

                      <strong>
                        {formatCurrency(
                          offer.approvedAmount
                        )}
                      </strong>
                    </div>

                    <span className="loan-cost-arrow">
                      →
                    </span>

                    <div>
                      <span>
                        TOTAL INTEREST
                      </span>

                      <strong>
                        {formatCurrency(
                          offer.totalInterest
                        )}
                      </strong>
                    </div>

                    <span className="loan-cost-arrow">
                      →
                    </span>

                    <div>
                      <span>
                        TOTAL REPAYMENT
                      </span>

                      <strong>
                        {formatCurrency(
                          offer.totalRepayment
                        )}
                      </strong>
                    </div>
                  </div>


                  <div className="loan-affordability-grid">
                    <div>
                      <span>
                        CURRENT MONTHLY PROFIT
                      </span>

                      <strong>
                        {formatCurrency(
                          offer.affordability
                            .monthlyProfit
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        TOTAL DEBT SERVICE
                      </span>

                      <strong>
                        {formatCurrency(
                          offer.projectedDebtService
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        PROJECTED DSCR
                      </span>

                      <strong>
                        {offer.projectedDscr.toFixed(
                          2
                        )}
                        x
                      </strong>
                    </div>

                    <div>
                      <span>
                        DEBT / ASSETS
                      </span>

                      <strong>
                        {offer.projectedDebtToAssets.toFixed(
                          1
                        )}
                        %
                      </strong>
                    </div>
                  </div>


                  <div className="dscr-learning">
                    <strong>
                      What does DSCR mean?
                    </strong>

                    <p>
                      A DSCR of{" "}
                      <b>
                        {offer.projectedDscr.toFixed(
                          2
                        )}
                        x
                      </b>{" "}
                      means the business
                      generates about R
                      {offer.projectedDscr.toFixed(
                        2
                      )}{" "}
                      of operating profit
                      for every R1 of
                      estimated monthly
                      debt repayments.
                    </p>
                  </div>


                  <div className="loan-offer-actions">
                    <button
                      type="button"
                      className="loan-accept-button"
                      onClick={
                        onAcceptOffer
                      }
                    >
                      Accept Loan & Invest
                    </button>

                    <button
                      type="button"
                      onClick={
                        onGenerateOffer
                      }
                    >
                      Recalculate
                    </button>

                    <button
                      type="button"
                      onClick={
                        onCancel
                      }
                    >
                      Decline & Return
                    </button>
                  </div>
                </>
              )}


              {offer.status ===
                "DECLINED" && (
                <div className="loan-decline-help">
                  <strong>
                    What should the
                    business improve?
                  </strong>

                  <p>
                    Improve profitability,
                    cash reserves,
                    repayment history and
                    debt levels before
                    applying again.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      onCancel();
                    }}
                  >
                    Return to Funding Decision
                  </button>
                </div>
              )}
            </div>
          )}


          {notice && (
            <p className="notice">
              {notice}
            </p>
          )}
        </div>
      )}


      {activeLoans.length > 0 && (
        <div className="active-loans">
          <div className="active-loans-heading">
            <div>
              <p className="card-label">
                ACTIVE BUSINESS LOANS
              </p>

              <h3>
                Repayment history
                affects future credit
              </h3>
            </div>

            <span>
              {activeLoans.length}{" "}
              ACTIVE
            </span>
          </div>

          {activeLoans.map(
            (loan) => (
              <article
                key={loan.id}
                className="loan-account"
              >
                <div>
                  <strong>
                    {loan.lender}
                  </strong>

                  <span>
                    {loan.purpose}
                  </span>
                </div>

                <div>
                  <span>
                    BALANCE
                  </span>

                  <strong>
                    {formatCurrency(
                      loan.outstandingBalance
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    RATE
                  </span>

                  <strong>
                    {loan.annualInterestRate.toFixed(
                      1
                    )}
                    %
                  </strong>
                </div>

                <div>
                  <span>
                    MONTHLY
                  </span>

                  <strong>
                    {formatCurrency(
                      loan.monthlyPayment
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    REMAINING
                  </span>

                  <strong>
                    {loan.remainingMonths}{" "}
                    months
                  </strong>
                </div>

                <div>
                  <span>
                    STATUS
                  </span>

                  <strong>
                    {loan.status}
                  </strong>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}


function LoanOfferMetric({
  label,
  value,
  warning = false,
}) {
  return (
    <div
      className={`loan-offer-metric ${
        warning
          ? "warning"
          : ""
      }`}
    >
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}


function RevenueProfitCashLesson({
  business,
}) {
  const revenue =
    Number(
      business?.revenue || 0
    );

  const expenses =
    Number(
      business?.expenses || 0
    );

  const cash =
    Number(
      business?.cash || 0
    );

  const receivables =
    Math.max(
      0,
      Number(
        business?.receivables || 0
      )
    );

  const debt =
    Math.max(
      0,
      Number(
        business?.debt || 0
      )
    );

  const profit =
    revenue -
    expenses;


  const cashVsRevenueMessage =
    cash < revenue
      ? "The company has earned more revenue this month than the cash currently available. Some money may still be tied up in expenses, receivables or previous commitments."
      : "The company currently has more cash available than this month's revenue. That can happen when cash was built up previously or when the business received financing.";


  return (
    <section className="finance-learning-panel">
      <div className="finance-learning-heading">
        <div>
          <p className="card-label">
            IIMS FINANCE LESSON
          </p>

          <h2>
            Revenue, profit and cash
            are not the same thing
          </h2>

          <p>
            Understanding the
            difference helps you avoid
            thinking a profitable
            business automatically has
            enough money available to
            pay its obligations.
          </p>
        </div>

        <span>
          BUSINESS FUNDAMENTALS
        </span>
      </div>


      <div className="finance-concept-grid">
        <article className="finance-concept-card">
          <div className="finance-concept-number">
            01
          </div>

          <span>
            REVENUE
          </span>

          <strong>
            {formatCurrency(
              revenue
            )}
          </strong>

          <p>
            Money the business earned
            from selling products or
            services during the
            current period.
          </p>
        </article>


        <article className="finance-concept-card">
          <div className="finance-concept-number">
            02
          </div>

          <span>
            EXPENSES
          </span>

          <strong>
            {formatCurrency(
              expenses
            )}
          </strong>

          <p>
            The cost of running the
            business, including
            salaries, suppliers,
            operations and financing
            costs.
          </p>
        </article>


        <article className="finance-concept-card finance-concept-profit">
          <div className="finance-concept-number">
            03
          </div>

          <span>
            PROFIT
          </span>

          <strong>
            {formatCurrency(
              profit
            )}
          </strong>

          <p>
            What remains after
            subtracting expenses from
            revenue.
          </p>

          <small>
            Revenue − Expenses
          </small>
        </article>


        <article className="finance-concept-card finance-concept-cash">
          <div className="finance-concept-number">
            04
          </div>

          <span>
            CASH AVAILABLE
          </span>

          <strong>
            {formatCurrency(
              cash
            )}
          </strong>

          <p>
            Money the business can
            actually use right now to
            pay salaries, suppliers,
            debt and other
            obligations.
          </p>
        </article>
      </div>


      <div className="finance-money-flow">
        <div>
          <span>
            SALES MADE
          </span>

          <strong>
            {formatCurrency(
              revenue
            )}
          </strong>
        </div>

        <div className="finance-flow-arrow">
          →
        </div>

        <div>
          <span>
            CUSTOMERS STILL OWE
          </span>

          <strong>
            {formatCurrency(
              receivables
            )}
          </strong>
        </div>

        <div className="finance-flow-arrow">
          →
        </div>

        <div>
          <span>
            CASH AVAILABLE NOW
          </span>

          <strong>
            {formatCurrency(
              cash
            )}
          </strong>
        </div>
      </div>


      <div className="finance-learning-explanation">
        <div className="finance-learning-icon">
          i
        </div>

        <div>
          <strong>
            What is happening in your
            business?
          </strong>

          <p>
            {cashVsRevenueMessage}
          </p>
        </div>
      </div>


      <div className="finance-learning-scenarios">
        <article>
          <span>
            CUSTOMER INVOICE
          </span>

          <h3>
            Revenue can increase
            before cash arrives
          </h3>

          <p>
            If you invoice a customer
            R100,000 today but they
            only pay next month,
            revenue increases now
            while cash does not.
          </p>

          <div>
            <strong>
              Revenue
              <b> +R100,000</b>
            </strong>

            <strong>
              Cash
              <b> +R0</b>
            </strong>

            <strong>
              Receivables
              <b> +R100,000</b>
            </strong>
          </div>
        </article>


        <article>
          <span>
            BANK LOAN
          </span>

          <h3>
            Cash can increase without
            increasing revenue
          </h3>

          <p>
            Borrowed money gives the
            business cash, but it is
            not income. The company
            must repay it.
          </p>

          <div>
            <strong>
              Cash
              <b> +R100,000</b>
            </strong>

            <strong>
              Revenue
              <b> +R0</b>
            </strong>

            <strong>
              Debt
              <b> +R100,000</b>
            </strong>
          </div>
        </article>
      </div>


      <div className="finance-current-position">
        <div>
          <span>
            CUSTOMERS OWE YOU
          </span>

          <strong>
            {formatCurrency(
              receivables
            )}
          </strong>

          <p>
            Revenue already earned
            but cash not yet
            collected.
          </p>
        </div>

        <div>
          <span>
            BUSINESS DEBT
          </span>

          <strong>
            {formatCurrency(
              debt
            )}
          </strong>

          <p>
            Cash previously borrowed
            that the business still
            has an obligation to
            repay.
          </p>
        </div>
      </div>


      <div className="finance-key-lesson">
        <span>
          KEY LESSON
        </span>

        <p>
          A business can have strong
          revenue and profit but still
          fail if it runs out of cash.
          Always manage sales,
          collections, expenses and
          debt together.
        </p>
      </div>
    </section>
  );
}


function InboxMessageReader({
  message,
  onClose,
}) {
  if (!message) {
    return null;
  }

  const sender =
    message.sender ||
    message.from ||
    "Business Update";

  const subject =
    message.subject ||
    message.title ||
    "Message";

  const body =
    message.fullMessage ||
    message.body ||
    message.message ||
    message.description ||
    "";

  const time =
    message.time ||
    message.createdAt ||
    "";

  const senderInitial =
    String(sender)
      .trim()
      .charAt(0)
      .toUpperCase() ||
    "I";

  return (
    <section className="inbox-reader">
      <div className="inbox-reader-top">
        <div className="inbox-reader-person">
          <div className="inbox-reader-avatar">
            {senderInitial}
          </div>

          <div>
            <span>
              MESSAGE FROM
            </span>

            <strong>
              {sender}
            </strong>
          </div>
        </div>

        <button
          type="button"
          className="inbox-reader-close-icon"
          onClick={onClose}
          aria-label="Close message"
        >
          ×
        </button>
      </div>

      <div className="inbox-reader-content">
        <div className="inbox-reader-meta">
          <span>
            BUSINESS MESSAGE
          </span>

          {time && (
            <small>
              {String(time).slice(
                0,
                16
              )}
            </small>
          )}
        </div>

        <h2>
          {subject}
        </h2>

        <p>
          {body}
        </p>
      </div>

      <div className="inbox-reader-help">
        <div className="inbox-reader-help-icon">
          i
        </div>

        <div>
          <strong>
            Why does this matter?
          </strong>

          <p>
            Read business messages
            carefully. They may contain
            information that affects
            your next decision, cash,
            customers or team.
          </p>
        </div>
      </div>

      <div className="inbox-reader-actions">
        <button
          type="button"
          className="primary-button"
          onClick={onClose}
        >
          Close Message
        </button>
      </div>
    </section>
  );
}

export default App;
