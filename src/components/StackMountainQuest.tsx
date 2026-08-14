import React, { useState, useEffect } from 'react';
import { 
  Shield, Award, Sparkles, HelpCircle, AlertCircle, 
  ChevronRight, Play, CheckCircle2, RotateCcw, Lightbulb, 
  Cpu, Flame, Lock, Unlock, Trophy, Send, RefreshCw, X, ArrowRight,
  Sliders, ArrowLeft, ArrowRightLeft, Layers, Columns, BarChart3, Database, HardDrive, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileState } from '../types';
import PremiumAudioManager from '../lib/audioManager';

interface StackMountainQuestProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
  onCompleteSector: () => void;
}

export interface QuestProblem {
  id: string;
  title: string;
  type: 'concept' | 'push_pop' | 'parentheses' | 'min_stack' | 'nge' | 'histogram' | 'expression' | 'monotonic' | 'undo_redo';
  description: string;
  objective: string;
  hint: string;
  xpReward: number;
  pointsReward: number;
  data: any; // Setup configurations
}

export interface QuestLevel {
  id: number;
  name: string;
  topic: string;
  bossName: string;
  bossTitle: string;
  bossAvatar: string;
  bossMaxHP: number;
  bossDialogueGreeting: string;
  bossDialogueDefeated: string;
  problems: QuestProblem[];
  rewardAchievementId: string;
  rewardAchievementName: string;
}

const QUEST_LEVELS: QuestLevel[] = [
  {
    id: 1,
    name: "LIFO Operations & Piles",
    topic: "Stack Fundamentals",
    bossName: "CallStack Sherpa",
    bossTitle: "Stack Sentinel",
    bossAvatar: "🧗",
    bossMaxHP: 100,
    bossDialogueGreeting: "To scale this mountain, you must respect the rule of Last-In-First-Out! Pile nodes with care, or succumb to the bottomless crash!",
    bossDialogueDefeated: "Sequential stack boundaries validated! You have completed the basic ascent.",
    rewardAchievementId: "stack_lvl1",
    rewardAchievementName: "Stack Initiator",
    problems: [
      {
        id: "stack_properties",
        title: "Properties of LIFO",
        type: "concept",
        description: "A stack is a linear data structure following the LIFO (Last In First Out) principle. The last element pushed onto the stack is the first one to be popped.",
        objective: "Select which real-world scenario behaves exactly like a LIFO stack.",
        hint: "Think of where you can only add or remove from the top of a pile.",
        xpReward: 30,
        pointsReward: 20,
        data: { options: ["A queue of people waiting for a bus", "A pile of dinner plates in a cabinet", "A print queue scheduling documents"], correctIdx: 1 }
      },
      {
        id: "push_pop_sequence",
        title: "Trace Push/Pop Operations",
        type: "push_pop",
        description: "Trace these stack operations: Push(10), Push(20), Pop(), Push(30), Pop(), Pop(). Determine the sequence of values that were returned by the Pop() operations in chronological order.",
        objective: "Select the correct sequence of popped values.",
        hint: "Write down the state of the stack step-by-step. Pop always returns the current top.",
        xpReward: 40,
        pointsReward: 20,
        data: { options: ["20, 30, 10", "10, 20, 30", "20, 10, 30", "30, 20, 10"], correctIdx: 0 }
      },
      {
        id: "peek_operation",
        title: "The Peek Inspector",
        type: "push_pop",
        description: "Given a stack with elements [A, B, C] where C is at the TOP. If we invoke the 'Peek' operation, what happens to the stack and what value is inspected?",
        objective: "Select the correct Peek outcome.",
        hint: "Peek inspects the top element without removing it.",
        xpReward: 40,
        pointsReward: 20,
        data: { options: ["Stack remains [A, B, C], inspects C", "Stack becomes [A, B], inspects C", "Stack remains [A, B, C], inspects A"], correctIdx: 0 }
      }
    ]
  },
  {
    id: 2,
    name: "Valid Parentheses Sentry",
    topic: "Brace Nesting Parsing",
    bossName: "Syntax Compiler",
    bossTitle: "Scope Resolution Watcher",
    bossAvatar: "🤖",
    bossMaxHP: 110,
    bossDialogueGreeting: "Mismatched scopes tear compilers apart! Align your opening and closing braces or prepare for parsing segfaults!",
    bossDialogueDefeated: "Valid parentheses tree built successfully. No brace conflicts detected.",
    rewardAchievementId: "stack_lvl2",
    rewardAchievementName: "Brace Balancer",
    problems: [
      {
        id: "bracket_balance",
        title: "Match Nesting Sequences",
        type: "parentheses",
        description: "Given the symbol stream: '{ [ ( ) ] }', push opening brackets to the stack and pop on matching closing brackets. Is this symbol stream valid?",
        objective: "Click TRUE if valid, FALSE if invalid.",
        hint: "Every open bracket must have a matching closed partner in correct nested order.",
        xpReward: 40,
        pointsReward: 25,
        data: { stream: "{ [ ( ) ] }", expected: true }
      },
      {
        id: "bracket_invalid_trigger",
        title: "Busted Scope Detection",
        type: "parentheses",
        description: "Examine: '[(])'. When scanning this string from left to right, at which character index does the validation process fail?",
        objective: "Enter the index (0-based) where the mismatch is discovered.",
        hint: "'[' (0), '(' (1), ']' (2). Since '(' is at the top of the stack, matching it with ']' is invalid at index 2.",
        xpReward: 45,
        pointsReward: 25,
        data: { stream: "[(])", expectedIdx: 2 }
      },
      {
        id: "min_braces_to_make_valid",
        title: "Minimum Deletions",
        type: "parentheses",
        description: "How many bracket symbols must you remove from '(()))' to convert it into a completely valid matched sequence?",
        objective: "Enter the minimum number of character removals required.",
        hint: "Double opening '(' and triple closing '))' means one extra closing bracket exists.",
        xpReward: 50,
        pointsReward: 25,
        data: { expectedRemovals: 1 }
      },
      {
        id: "empty_parentheses_check",
        title: "Null String Validity",
        type: "parentheses",
        description: "In compiler design, does an empty string or string with zero brackets qualify as a 'Valid Parentheses' sequence under standard stack validator algorithms?",
        objective: "Select the correct theoretical outcome.",
        hint: "An empty input starts and ends with an empty stack and has zero mismatch occurrences, so it is considered valid.",
        xpReward: 55,
        pointsReward: 25,
        data: { options: ["Yes, valid", "No, invalid"], correctIdx: 0 }
      }
    ]
  },
  {
    id: 3,
    name: "The Min Stack Blueprint",
    topic: "Auxiliary State Caching",
    bossName: "Vector Cache",
    bossTitle: "O(1) Minimizer",
    bossAvatar: "🧬",
    bossMaxHP: 125,
    bossDialogueGreeting: "Retrieving the minimum element in O(N) time is an algorithmic crime! Prove you can yield it in O(1) or perish under the search cost!",
    bossDialogueDefeated: "O(1) lookup solved! Auxiliary caching verified.",
    rewardAchievementId: "stack_lvl3",
    rewardAchievementName: "Min Stack Architect",
    problems: [
      {
        id: "min_stack_concept",
        title: "Dual Stack Synchronization",
        type: "min_stack",
        description: "To support getMin() in O(1) time, we run an auxiliary stack alongside our main stack. What does this secondary stack store?",
        objective: "Choose the correct auxiliary role.",
        hint: "The second stack tracks the minimum element up to the corresponding level in the main stack.",
        xpReward: 50,
        pointsReward: 30,
        data: { options: ["All elements sorted", "The history of minimum values pushed so far", "The addresses of main pointers"], correctIdx: 1 }
      },
      {
        id: "min_stack_trace",
        title: "Auxiliary Min State Trace",
        type: "min_stack",
        description: "Perform: Push(5), Push(2), Push(8), Push(1), Pop(). After these calls, what is the current top value of the auxiliary minimum stack?",
        objective: "Input the current minimum value.",
        hint: "The minimum history was: 5 -> 2 -> 2 -> 1. Popping the 1 returns the minimum value of the remaining elements [5, 2, 8].",
        xpReward: 55,
        pointsReward: 30,
        data: { expectedMin: 2 }
      },
      {
        id: "min_stack_space_optimization",
        title: "Space Efficiency",
        type: "min_stack",
        description: "Is it possible to implement a Min Stack with O(1) extra space by storing the difference between the pushed value and the minimum value?",
        objective: "Confirm if O(1) space Min Stack is possible.",
        hint: "Yes, by storing encoded values (value - current_min), we can track previous minimums mathematically with a single variable.",
        xpReward: 60,
        pointsReward: 30,
        data: { options: ["Yes, using numeric offsets", "No, mathematically impossible"], correctIdx: 0 }
      }
    ]
  },
  {
    id: 4,
    name: "Next Greater Element (NGE)",
    topic: "Monotonic Searches",
    bossName: "Horizon Scanner",
    bossTitle: "Linear Lookahead Radar",
    bossAvatar: "📡",
    bossMaxHP: 130,
    bossDialogueGreeting: "Who is greater than I on the upcoming horizon? Peer forward across array spaces, or blink and get swept by quadratic lookup charges!",
    bossDialogueDefeated: "Scanning radar calibrated! Next greater keys mapped instantly.",
    rewardAchievementId: "stack_lvl4",
    rewardAchievementName: "Horizon Pathfinder",
    problems: [
      {
        id: "nge_basic",
        title: "Find Next Greater Elements",
        type: "nge",
        description: "The Next Greater Element for an element X in an array is the first greater element on its right side. Given the array [4, 5, 2, 25], determine the NGE values for each element.",
        objective: "Identify the correct NGE array output.",
        hint: "For 4, next greater is 5. For 5, next greater is 25. For 2, next greater is 25. For 25, none exists (-1).",
        xpReward: 60,
        pointsReward: 35,
        data: { options: ["[5, 25, 25, -1]", "[5, 25, -1, -1]", "[5, -1, 25, -1]"], correctIdx: 0 }
      },
      {
        id: "nge_index",
        title: "NGE Target Selection",
        type: "nge",
        description: "In the array [13, 7, 6, 12, 10], what is the Next Greater Element for value 7?",
        objective: "Select the correct element value.",
        hint: "Look to the right of 7: [6, 12, 10]. The first value strictly greater than 7 is 12.",
        xpReward: 65,
        pointsReward: 35,
        data: { array: [13, 7, 6, 12, 10], expectedVal: 12 }
      },
      {
        id: "nge_circular",
        title: "Circular Array Variant",
        type: "nge",
        description: "In a circular array, you can wrap around to find the next greater element. For array [5, 1, 3], what is the NGE of 3?",
        objective: "Enter the wrap-around NGE for 3.",
        hint: "Since there's no greater on the right of 3, wrap around to the front. The first element greater than 3 is 5.",
        xpReward: 75,
        pointsReward: 35,
        data: { expectedVal: 5 }
      },
      {
        id: "nge_complexity",
        title: "Linear Complexity Guarantee",
        type: "nge",
        description: "By using a stack to process elements in a single pass from right-to-left, what is the tight asymptotic time complexity of finding the Next Greater Element for all items?",
        objective: "Choose the correct complexity bounds.",
        hint: "Every element is pushed and popped from the stack at most once, guaranteeing linear O(N) execution.",
        xpReward: 80,
        pointsReward: 35,
        data: { options: ["O(N^2)", "O(N log N)", "O(N)"], correctIdx: 2 }
      }
    ]
  },
  {
    id: 5,
    name: "Histogram Max Rectangles",
    topic: "Largest Area Boundaries",
    bossName: "Monolithic Pillar",
    bossTitle: "Bar Coordinate Master",
    bossAvatar: "📊",
    bossMaxHP: 145,
    bossDialogueGreeting: "Behold my pillars of fluctuating heights! Find the absolute largest rectangular volume that can be contained, or be crushed beneath the uneven towers!",
    bossDialogueDefeated: "Boundary bounds checked. Maximum contained area isolated and cataloged.",
    rewardAchievementId: "stack_lvl5",
    rewardAchievementName: "Pillar Surveyor",
    problems: [
      {
        id: "histogram_basic",
        title: "Calculate Max Area",
        type: "histogram",
        description: "Given a histogram represented by bar heights [2, 1, 5, 6, 2, 3] of width 1. What is the area of the largest rectangle?",
        objective: "Input the maximum possible rectangular area value.",
        hint: "The bars 5 and 6 have a combined area of height 5 and width 2, which equals 10. No larger block exists.",
        xpReward: 70,
        pointsReward: 40,
        data: { expectedVal: 10 }
      },
      {
        id: "histogram_flat",
        title: "Uniform Bar Contiguity",
        type: "histogram",
        description: "For flat layout height array [4, 4, 4, 4], what is the maximum area?",
        objective: "Enter the mathematical area.",
        hint: "Height 4 across a span of 4 bars is 4 * 4 = 16.",
        xpReward: 75,
        pointsReward: 40,
        data: { expectedVal: 16 }
      },
      {
        id: "histogram_stack_mechanics",
        title: "Boundary Index Tracking",
        type: "histogram",
        description: "How does a monotonic stack help calculate the maximum area in linear time?",
        objective: "Select the correct monotonic mechanism.",
        hint: "It helps instantly locate the nearest smaller bar to the left and right of every bar, defining its boundary width.",
        xpReward: 80,
        pointsReward: 40,
        data: { options: ["Stores the cumulative areas directly", "Locates left and right boundary indices of smaller heights in O(1)", "Sorts the height array recursively"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 6,
    name: "Expression Compiler",
    topic: "Notation Parsing Engines",
    bossName: "Notation Parser",
    bossTitle: "Token Stack Arbitrator",
    bossAvatar: "🧮",
    bossMaxHP: 155,
    bossDialogueGreeting: "Infix, Prefix, Postfix! The compiler cares not for human bracket preferences! Convert and evaluate these syntax trees or crash during token parsing!",
    bossDialogueDefeated: "Evaluation stream synchronized. Compiler token priority verified.",
    rewardAchievementId: "stack_lvl6",
    rewardAchievementName: "Notation Maestro",
    problems: [
      {
        id: "postfix_eval",
        title: "Evaluate Postfix Notation",
        type: "expression",
        description: "Evaluate the reverse-polish (postfix) expression: '2 3 1 * + 9 -'. Keep track of operator push/pop sequence.",
        objective: "Enter the resulting integer output.",
        hint: "Evaluate: 3 * 1 = 3. Then 2 + 3 = 5. Then 5 - 9 = -4.",
        xpReward: 75,
        pointsReward: 45,
        data: { expectedVal: -4 }
      },
      {
        id: "infix_to_postfix",
        title: "Infix to Postfix Conversion",
        type: "expression",
        description: "Convert standard infix equation: 'A + B * C' into postfix notation. Account for mathematical operator precedence.",
        objective: "Choose the correct postfix string layout.",
        hint: "Multiplication '*' has higher priority than addition '+'. Postfix is A B C * +.",
        xpReward: 85,
        pointsReward: 45,
        data: { options: ["A B * C +", "A B C * +", "+ A * B C"], correctIdx: 1 }
      },
      {
        id: "prefix_evaluation",
        title: "Prefix Expression Parse",
        type: "expression",
        description: "Evaluate the prefix expression: '+ * 2 3 5'. (Note that operands are processed from right to left in prefix analysis).",
        objective: "Enter the final computed result.",
        hint: "Evaluate from right to left: * 2 3 becomes 6. Then + 6 5 becomes 11.",
        xpReward: 90,
        pointsReward: 45,
        data: { expectedVal: 11 }
      }
    ]
  },
  {
    id: 7,
    name: "Monotonic Stack Wonders",
    topic: "Strict Order Array Pruning",
    bossName: "Monotonic Titan",
    bossTitle: "Continuous Slope Invariant",
    bossAvatar: "🌋",
    bossMaxHP: 165,
    bossDialogueGreeting: "Only a strictly ordered slope may stand! Pop the weak, push the strong, and maintain the monotonic gradient across the arrays!",
    bossDialogueDefeated: "Monotonic slope established. Temperature and water trapping problems cleared.",
    rewardAchievementId: "stack_lvl7",
    rewardAchievementName: "Monotonic Shaper",
    problems: [
      {
        id: "monotonic_increasing",
        title: "Decreasing Stack Assembly",
        type: "monotonic",
        description: "Assemble a decreasing monotonic stack from stream [5, 3, 12, 10, 8]. If we push elements one by one, popping any element smaller than or equal to the new element, what is the final stack contents?",
        objective: "Select the correct monotonic configuration.",
        hint: "Push 5. Push 3 -> [5, 3]. Push 12 (pops 3, 5) -> [12]. Push 10 -> [12, 10]. Push 8 -> [12, 10, 8].",
        xpReward: 80,
        pointsReward: 50,
        data: { options: ["[12, 10, 8]", "[5, 3, 12, 10, 8]", "[8, 10, 12]"], correctIdx: 0 }
      },
      {
        id: "daily_temperatures",
        title: "Warmer Temperature Intervals",
        type: "monotonic",
        description: "Given temperatures: [73, 74, 75, 71, 69, 72]. How many days must you wait for a warmer temperature starting at index 3 (value 71)?",
        objective: "Input the waiting count of days.",
        hint: "For index 3 (71), look ahead: index 4 is 69 (cooler), index 5 is 72 (warmer). Days to wait = 5 - 3 = 2.",
        xpReward: 90,
        pointsReward: 50,
        data: { expectedDays: 2 }
      },
      {
        id: "rain_water_concept",
        title: "Trapping Rain Water Boundary",
        type: "monotonic",
        description: "In the 'Trapping Rain Water' problem, what mathematical property dictates the volume of water trapped between two boundaries?",
        objective: "Choose the correct boundary constraint.",
        hint: "Water level is bound by the minimum of left and right boundary heights minus the elevation of the floor.",
        xpReward: 100,
        pointsReward: 50,
        data: { options: ["Sum of left and right boundaries", "The minimum of the left and right boundary heights", "The maximum of the left and right boundaries"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 8,
    name: "Advanced Undo/Redo Engine",
    topic: "Transaction Stack Rollbacks",
    bossName: "State Rewinder",
    bossTitle: "Temporal State Master",
    bossAvatar: "⏳",
    bossMaxHP: 180,
    bossDialogueGreeting: "Every forward write has a backward step, and every backward step can be relived! Command the undo and redo stacks without losing state integrity!",
    bossDialogueDefeated: "Dual stack transaction machine cleared with zero state leakage. Stack Mountain fully conquered!",
    rewardAchievementId: "stack_lvl8",
    rewardAchievementName: "Grand Stack Overseer",
    problems: [
      {
        id: "undo_redo_basic",
        title: "Two Stack Editor Model",
        type: "undo_redo",
        description: "An editor tracks state with an Undo Stack and a Redo Stack. When a user presses 'Undo', we pop the state from Undo and push it to which destination?",
        objective: "Select the correct target destination.",
        hint: "To make it available for 'Redo', we push the undone state directly onto the Redo Stack.",
        xpReward: 85,
        pointsReward: 60,
        data: { options: ["Redo Stack", "Main memory pool", "Deleted files trash"], correctIdx: 0 }
      },
      {
        id: "undo_redo_trace",
        title: "Document Transaction Trace",
        type: "undo_redo",
        description: "Perform operations: Write('A'), Write('B'), Undo(), Redo(). What is the current content of the document?",
        objective: "Input the active document characters.",
        hint: "Write A -> Undo [A]. Write B -> [A, B]. Undo -> pops B -> Redo stack has [B]. Redo -> pops B and returns to document -> 'AB'.",
        xpReward: 100,
        pointsReward: 60,
        data: { expectedVal: "AB" }
      },
      {
        id: "redo_flush_rule",
        title: "Redo Stack Invalidation",
        type: "undo_redo",
        description: "If a user performs Undo, and then immediately performs a NEW 'Write' operation, what must happen to the Redo Stack?",
        objective: "Select the correct Redo Stack state rule.",
        hint: "Any new write operation breaks the linear redo timeline, forcing the Redo Stack to be completely cleared.",
        xpReward: 110,
        pointsReward: 60,
        data: { options: ["Keep current contents", "It must be completely cleared", "Move all items back to Undo Stack"], correctIdx: 1 }
      },
      {
        id: "transaction_rollback",
        title: "Transaction State Rollback",
        type: "undo_redo",
        description: "To rollback a database transaction involving multiple changes, we push inverse operations onto a rollback stack. If a transaction fails mid-way, in what order must the inverse operations be executed?",
        objective: "Choose the correct operational execution order.",
        hint: "To revert successfully, changes must be undone in reverse order of execution (LIFO).",
        xpReward: 120,
        pointsReward: 60,
        data: { options: ["First-in, First-reverted (FIFO)", "Reverse chronological order (LIFO)", "Random order"], correctIdx: 1 }
      }
    ]
  }
];

export default function StackMountainQuest({ profile, onUpdateProfile, onBackToMenu, onCompleteSector }: StackMountainQuestProps) {
  const [activeLevelIdx, setActiveLevelIdx] = useState<number>(0);
  const [activeProblemIdx, setActiveProblemIdx] = useState<number>(0);
  const [selectedLevel, setSelectedLevel] = useState<QuestLevel>(QUEST_LEVELS[0]);
  
  // Game interaction states
  const [bossHP, setBossHP] = useState<number>(100);
  const [currentDialogue, setCurrentDialogue] = useState<string>('');
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [bossDamageAnim, setBossDamageAnim] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  // Dynamic interactive stack states
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [selectedBoolean, setSelectedBoolean] = useState<boolean | null>(null);
  const [activeStackSim, setActiveStackSim] = useState<string[]>([]);

  const playSound = (type: 'click' | 'transition' | 'swap' | 'win' | 'error' | 'ability' | 'powerdown') => {
    PremiumAudioManager.getInstance().playSFX(type);
  };

  // Sync Level selection
  useEffect(() => {
    const lvl = QUEST_LEVELS[activeLevelIdx];
    setSelectedLevel(lvl);
    setActiveProblemIdx(0);
    setBossHP(lvl.bossMaxHP);
    setCurrentDialogue(lvl.bossDialogueGreeting);
    setShowHint(false);
    setConsoleLogs([`[EXECUTION SPIRE] Node connected: ${lvl.name} Grid.`, `[SENTRY] ${lvl.bossName} active.`]);
  }, [activeLevelIdx]);

  // Sync Problem selection
  useEffect(() => {
    const prob = selectedLevel.problems[activeProblemIdx];
    if (prob) {
      setShowHint(false);
      setSelectedIdx(null);
      setTextAnswer('');
      setSelectedBoolean(null);

      // Setup dynamic stack simulation
      if (prob.id === 'bracket_balance') {
        setActiveStackSim([]);
      } else if (prob.id === 'min_stack_trace') {
        setActiveStackSim([]);
      } else {
        setActiveStackSim([]);
      }

      setConsoleLogs(prev => [...prev, `[COMPILER] Decoding Instruction ${activeProblemIdx + 1}: ${prob.title}`]);
    }
  }, [activeProblemIdx, selectedLevel]);

  const handleLevelSelect = (idx: number) => {
    playSound('transition');
    setActiveLevelIdx(idx);
  };

  const handleNextProblem = () => {
    playSound('click');
    if (activeProblemIdx < selectedLevel.problems.length - 1) {
      setActiveProblemIdx(prev => prev + 1);
    }
  };

  const handlePushSim = (char: string) => {
    playSound('click');
    setActiveStackSim(prev => [...prev, char]);
    setConsoleLogs(prev => [...prev, `PUSH: ${char}`]);
  };

  const handlePopSim = () => {
    if (activeStackSim.length === 0) return;
    playSound('click');
    const popped = activeStackSim[activeStackSim.length - 1];
    setActiveStackSim(prev => prev.slice(0, -1));
    setConsoleLogs(prev => [...prev, `POP: ${popped}`]);
  };

  const handleVerifyProblem = () => {
    const prob = selectedLevel.problems[activeProblemIdx];
    if (!prob) return;

    let success = false;
    let feedback = '';

    switch(prob.id) {
      case 'stack_properties':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Correct! A pile of dinner plates is a classic real-world LIFO stack.";
        } else {
          feedback = "❌ Incorrect. Bus queues and print queues behave as FIFO (First-In-First-Out).";
        }
        break;
      case 'push_pop_sequence':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Sequence verified! Popped elements returned 20, then 30, then 10.";
        } else {
          feedback = "❌ Incorrect sequence. Trace each push and pop onto a paper stack model.";
        }
        break;
      case 'peek_operation':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Correct! Peek does not alter the stack, it only views the top.";
        } else {
          feedback = "❌ Incorrect. Peek does not pop elements off the stack.";
        }
        break;
      case 'bracket_balance':
        if (selectedBoolean === prob.data.expected) {
          success = true;
          feedback = "✅ Validated! The brackets are perfectly symmetrical and nested.";
        } else {
          feedback = "❌ Evaluation failed. Check bracket pairing symmetries.";
        }
        break;
      case 'bracket_invalid_trigger':
        if (parseInt(textAnswer) === prob.data.expectedIdx) {
          success = true;
          feedback = "✅ Correct! Mismatch trigger occurred at index 2 (']' cannot match '(').";
        } else {
          feedback = "❌ Mismatch index incorrect. Scan left to right and locate the exact fail point.";
        }
        break;
      case 'min_braces_to_make_valid':
        if (parseInt(textAnswer) === prob.data.expectedRemovals) {
          success = true;
          feedback = "✅ Correct! Removing one extra closing bracket makes it valid.";
        } else {
          feedback = "❌ Incorrect count. Count balanced pairs and find the remainder.";
        }
        break;
      case 'empty_parentheses_check':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Theoretical concept valid. Empty bracket sets compile with zero error frames.";
        } else {
          feedback = "❌ Incorrect. Standard parser algorithms classify empty arrays as valid.";
        }
        break;
      case 'min_stack_concept':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Correct! Secondary stack keeps track of current minimums.";
        } else {
          feedback = "❌ Mismatch. Think about why lookup must be O(1) without sorting.";
        }
        break;
      case 'min_stack_trace':
        if (parseInt(textAnswer) === prob.data.expectedMin) {
          success = true;
          feedback = "✅ Trace complete! Pop removed 1, so the new minimum is 2.";
        } else {
          feedback = "❌ Trace incorrect. Push and pop values on min stack and watch the top.";
        }
        break;
      case 'min_stack_space_optimization':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Yes! Encoding values (2 * val - min) allows single-variable tracking.";
        } else {
          feedback = "❌ It is possible. Look up 'Min Stack O(1) Space' encoding techniques.";
        }
        break;
      case 'nge_basic':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Correct NGE array returned: [5, 25, 25, -1]!";
        } else {
          feedback = "❌ Look-ahead mapping failed. Check elements larger to the right.";
        }
        break;
      case 'nge_index':
        if (selectedIdx === 3) { // Value 12
          success = true;
          feedback = "✅ Correct! 12 is the next value greater than 7 looking rightward.";
        } else {
          feedback = "❌ Wrong element. Peer further rightward from value 7.";
        }
        break;
      case 'nge_circular':
        if (parseInt(textAnswer) === prob.data.expectedVal) {
          success = true;
          feedback = "✅ Circular radar locked! NGE of 3 is 5.";
        } else {
          feedback = "❌ Wrapping around the front index failed.";
        }
        break;
      case 'nge_complexity':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Correct! Monotonic stack lookups keep performance at O(N) linear time.";
        } else {
          feedback = "❌ Incorrect bounds. Using a stack bypasses quadratic index scans.";
        }
        break;
      case 'histogram_basic':
        if (parseInt(textAnswer) === prob.data.expectedVal) {
          success = true;
          feedback = "✅ Pillar survey complete! Max rectangular volume is 10.";
        } else {
          feedback = "❌ Incorrect area. Calculate rect height 5 with width 2.";
        }
        break;
      case 'histogram_flat':
        if (parseInt(textAnswer) === prob.data.expectedVal) {
          success = true;
          feedback = "✅ Correct! Constant heights form a rectangle of width * height.";
        } else {
          feedback = "❌ Check uniform width and height product.";
        }
        break;
      case 'histogram_stack_mechanics':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Correct! Monotonic index sweeps locate nearest smaller boundaries in O(1).";
        } else {
          feedback = "❌ Boundary scanning requires smaller neighbor indices, not sorted values.";
        }
        break;
      case 'postfix_eval':
        if (parseInt(textAnswer) === prob.data.expectedVal) {
          success = true;
          feedback = "✅ Postfix evaluation complete! Final result: -4.";
        } else {
          feedback = "❌ Postfix evaluation error. Remember: operators act on prior two stack values.";
        }
        break;
      case 'infix_to_postfix':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Conversion successful! Infix 'A + B * C' matches Postfix 'A B C * +'.";
        } else {
          feedback = "❌ Precedence error. Operator '*' must group and be processed first.";
        }
        break;
      case 'prefix_evaluation':
        if (parseInt(textAnswer) === prob.data.expectedVal) {
          success = true;
          feedback = "✅ Prefix expression evaluated correctly! Result: 11.";
        } else {
          feedback = "❌ Prefix evaluation error. Read right-to-left and evaluate recursively.";
        }
        break;
      case 'monotonic_increasing':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Monotonic stack assembled correctly: [12, 10, 8]!";
        } else {
          feedback = "❌ Assembly mismatch. Smaller items are popped when larger is pushed.";
        }
        break;
      case 'daily_temperatures':
        if (parseInt(textAnswer) === prob.data.expectedDays) {
          success = true;
          feedback = "✅ Correct! You wait exactly 2 days for 72 at index 5.";
        } else {
          feedback = "❌ Incorrect day count. Trace indices carefully.";
        }
        break;
      case 'rain_water_concept':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Boundary constraint correct! Water height is capped by the minimum wall.";
        } else {
          feedback = "❌ Height bounds are constrained by the shorter wall (min), not max.";
        }
        break;
      case 'undo_redo_basic':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Dual stack transaction verified! Undo pops to Redo stack.";
        } else {
          feedback = "❌ Destination mismatch. Target must hold the undone action for redo.";
        }
        break;
      case 'undo_redo_trace':
        if (textAnswer.trim().toUpperCase() === prob.data.expectedVal) {
          success = true;
          feedback = "✅ Correct! Redo restore value B to form document 'AB'.";
        } else {
          feedback = "❌ Document state mismatch. Walk each editor transaction.";
        }
        break;
      case 'redo_flush_rule':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Chronology rule verified! Redo stack gets cleared on a new write.";
        } else {
          feedback = "❌ Rule violation. Standard editors do not preserve redo options after new write inputs.";
        }
        break;
      case 'transaction_rollback':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ LIFO execution orders complete transactions rollbacks safely!";
        } else {
          feedback = "❌ Rollback order must run backwards (LIFO) to guarantee stable unwinding.";
        }
        break;
      default:
        break;
    }

    setConsoleLogs(prev => [...prev, feedback]);

    if (success) {
      playSound('win');
      
      const damage = Math.ceil((prob.xpReward / selectedLevel.problems.length) * 1.5);
      setBossDamageAnim(damage);
      setTimeout(() => setBossDamageAnim(null), 1000);

      setBossHP(prev => {
        const nextHp = Math.max(0, prev - damage);
        if (nextHp === 0) {
          setCurrentDialogue(selectedLevel.bossDialogueDefeated);
          setTimeout(() => {
            triggerLevelCompletion();
          }, 800);
        } else {
          setCurrentDialogue("Curse your logical stack precision! You avoided stack overflow!");
        }
        return nextHp;
      });

      if (!solvedProblemIds.includes(prob.id)) {
        setSolvedProblemIds(prev => [...prev, prob.id]);
        onUpdateProfile({
          points: profile.points + prob.pointsReward
        });
      }
    } else {
      playSound('error');
    }
  };

  const triggerLevelCompletion = () => {
    const hasAchievement = profile.achievements?.some(a => a.id === selectedLevel.rewardAchievementId);
    if (!hasAchievement) {
      const updatedAchievements = (profile.achievements || []).map(ach => {
        if (ach.id === selectedLevel.rewardAchievementId || ach.name === selectedLevel.rewardAchievementName) {
          return { ...ach, isUnlocked: true };
        }
        return ach;
      });

      const finalAchievements = updatedAchievements.some(a => a.id === selectedLevel.rewardAchievementId)
        ? updatedAchievements
        : [
            ...updatedAchievements,
            {
              id: selectedLevel.rewardAchievementId,
              name: selectedLevel.rewardAchievementName,
              description: `Cleared Level ${selectedLevel.id} of Stack Mountain by defeating ${selectedLevel.bossName}`,
              isUnlocked: true,
              ratingValue: 120 + selectedLevel.id * 10
            }
          ];

      onUpdateProfile({
        points: profile.points + 120 + selectedLevel.id * 10,
        achievements: finalAchievements
      });

      setNewAchievement(selectedLevel.rewardAchievementName);
      playSound('win');
    }

    const totalLvlSolved = QUEST_LEVELS.filter(l => 
      l.problems.every(p => solvedProblemIds.includes(p.id))
    ).length;

    if (totalLvlSolved === 8) {
      setConsoleLogs(prev => [...prev, "🚨 SECTOR CLEARANCE RECEIVED! STACK MOUNTAIN HAS BEEN SECURED!"]);
      setTimeout(() => {
        onCompleteSector();
      }, 3000);
    }
  };

  const prob = selectedLevel.problems[activeProblemIdx];

  return (
    <div className="bg-[#080b16] border border-blue-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-mono text-slate-200 w-full">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-blue-950/40">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400 animate-pulse" />
            <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-400">
              STACK MOUNTAIN: THE LIFO HEIGHTS
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
            8 Levels • 28 Parser Stack Challenges • Monotonic Heap Alignment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl text-xs flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>CREDITS: <b className="text-blue-400">{profile.points}</b></span>
          </div>

          <button
            onClick={() => { playSound('powerdown'); onBackToMenu(); }}
            className="px-4 py-1.5 bg-slate-950 border border-blue-900/40 hover:border-blue-500/80 text-blue-300 text-xs font-bold rounded-xl transition-all"
          >
            ← LEAVE MOUNTAIN
          </button>
        </div>
      </div>

      {/* LEVEL SELECTION RAIL */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 mb-6">
        {QUEST_LEVELS.map((lvl, index) => {
          const isSelected = activeLevelIdx === index;
          const isCleared = lvl.problems.every(p => solvedProblemIds.includes(p.id));
          return (
            <button
              key={lvl.id}
              onClick={() => handleLevelSelect(index)}
              className={`relative p-2 rounded-xl border text-left transition-all ${
                isSelected 
                  ? 'bg-blue-950/30 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-blue-200' 
                  : isCleared
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/30'
                  : 'bg-slate-905/30 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300'
              }`}
            >
              <div className="text-[9px] text-slate-400 uppercase font-black">Level 0{lvl.id}</div>
              <div className="text-xs font-bold truncate mt-0.5">{lvl.name}</div>
              {isCleared && <CheckCircle2 className="w-3 h-3 text-emerald-400 absolute top-2 right-2" />}
            </button>
          );
        })}
      </div>

      {/* MAIN GAMEPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PROBLEM DESCRIPTOR */}
          <div className="bg-[#05070e] border border-blue-950/80 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="px-2 py-0.5 bg-blue-950 text-blue-400 rounded text-[9px] uppercase font-bold tracking-widest">
                Instruction Frame {activeProblemIdx + 1} of {selectedLevel.problems.length}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
                REWARD: +{prob?.xpReward} XP / +{prob?.pointsReward} Credits
              </span>
            </div>

            <h3 className="text-base font-black text-white">{prob?.title}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{prob?.description}</p>
            
            <div className="mt-4 p-3 bg-blue-950/10 border border-blue-950 rounded-xl flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-blue-300 uppercase font-black block">Spire Objective</span>
                <p className="text-xs text-blue-200 font-bold">{prob?.objective}</p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE STAGE */}
          <div className="bg-[#05070e] border border-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] relative">
            <span className="absolute top-3 left-4 text-[9px] text-slate-500 uppercase font-bold tracking-widest">
              Live Stack Pointer State
            </span>

            <div className="w-full flex flex-wrap items-center justify-center gap-4 py-6">
              
              {/* CONCEPT PROBLEMS & MULTIPLE CHOICE OPTIONS */}
              {(prob?.type === 'concept' || prob?.id === 'push_pop_sequence' || prob?.id === 'peek_operation' || prob?.id === 'min_stack_concept' || prob?.id === 'min_stack_space_optimization' || prob?.id === 'nge_complexity' || prob?.id === 'histogram_stack_mechanics' || prob?.id === 'infix_to_postfix' || prob?.id === 'monotonic_increasing' || prob?.id === 'rain_water_concept' || prob?.id === 'undo_redo_basic' || prob?.id === 'redo_flush_rule' || prob?.id === 'transaction_rollback') && (
                <div className="flex flex-col gap-3 w-full max-w-md">
                  {prob.data.options?.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                      className={`p-3.5 border rounded-xl font-mono text-xs font-bold text-left flex justify-between items-center transition-all ${
                        selectedIdx === idx
                          ? 'bg-blue-950/40 border-blue-400 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                          : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* BOOLEAN ANSWER (TRUE/FALSE) */}
              {(prob?.id === 'bracket_balance') && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-4 p-4 bg-slate-950 border border-slate-900 rounded-2xl">
                    {prob.data.stream.split(' ').map((char: string, idx: number) => (
                      <div key={idx} className="w-10 h-10 bg-blue-950/20 border border-blue-500/30 text-blue-300 font-bold flex items-center justify-center rounded-xl">
                        {char}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => { playSound('click'); setSelectedBoolean(true); }}
                      className={`px-6 py-3 border text-sm font-bold rounded-xl transition-all ${
                        selectedBoolean === true
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      TRUE (Balanced)
                    </button>
                    <button
                      onClick={() => { playSound('click'); setSelectedBoolean(false); }}
                      className={`px-6 py-3 border text-sm font-bold rounded-xl transition-all ${
                        selectedBoolean === false
                          ? 'bg-red-950/40 border-red-500 text-red-300'
                          : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      FALSE (Unbalanced)
                    </button>
                  </div>
                </div>
              )}

              {/* NGE ACTIVE SELECTION */}
              {prob?.id === 'nge_index' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-3">
                    {prob.data.array.map((val: number, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                        className={`p-4 border rounded-xl flex flex-col items-center min-w-[65px] transition-all ${
                          selectedIdx === idx
                            ? 'bg-blue-950/40 border-blue-400 text-blue-200'
                            : 'bg-slate-950 border border-slate-900 text-slate-400 hover:border-slate-800'
                        }`}
                      >
                        <span className="text-[8px] text-slate-500 font-mono">Idx {idx}</span>
                        <span className="text-base font-black mt-1">{val}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TEXT OR NUMBER INPUT PROBLEMS */}
              {(prob?.id === 'bracket_invalid_trigger' || prob?.id === 'min_braces_to_make_valid' || prob?.id === 'min_stack_trace' || prob?.id === 'nge_circular' || prob?.id === 'histogram_basic' || prob?.id === 'histogram_flat' || prob?.id === 'postfix_eval' || prob?.id === 'prefix_evaluation' || prob?.id === 'daily_temperatures' || prob?.id === 'undo_redo_trace') && (
                <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                  {prob.id === 'bracket_invalid_trigger' && (
                    <div className="flex gap-4 p-4 bg-slate-950 border border-slate-900 rounded-2xl">
                      {prob.data.stream.split('').map((char: string, idx: number) => (
                        <div key={idx} className="w-10 h-10 bg-blue-950/20 border border-blue-500/30 text-blue-300 font-bold flex items-center justify-center rounded-xl">
                          {char}
                          <span className="absolute bottom-1 text-[7px] text-slate-500">idx {idx}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="w-full flex gap-3">
                    <input
                      type="text"
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="ENTER NUMERIC OR STRING ANSWER..."
                      className="flex-1 bg-slate-950 border border-slate-850 focus:border-blue-500 text-sm p-3.5 rounded-xl font-mono text-center text-white focus:outline-none placeholder-slate-700 font-black uppercase"
                    />
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => { playSound('click'); setShowHint(prev => !prev); }}
              className="px-4 py-2 bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
            >
              <Lightbulb className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span>{showHint ? 'HIDE COMPILER HINT' : 'REVEAL COMPILER HINT'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleVerifyProblem}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>COMPILE & EXECUTE</span>
              </button>

              {solvedProblemIds.includes(prob?.id) && (
                <button
                  onClick={handleNextProblem}
                  className="px-4 py-2.5 bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:border-emerald-500 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <span>NEXT INS</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* HINT DISPLAY */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 bg-yellow-950/20 border border-yellow-500/20 rounded-2xl flex items-start gap-3"
              >
                <HelpCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-black text-yellow-300 block uppercase tracking-wider">Compiler Hint:</span>
                  <p className="text-xs text-yellow-200/90 mt-1 leading-relaxed">{prob?.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: BOSS & SENTRY FEEDBACK */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* BOSS BATTLE SCREEN */}
          <div className="bg-gradient-to-b from-slate-950 to-[#030610] border border-blue-950 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-glow opacity-5 pointer-events-none" />

            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-900/60">
              <span className="text-3xl animate-bounce">{selectedLevel.bossAvatar}</span>
              <div>
                <h4 className="text-sm font-black text-white">{selectedLevel.bossName}</h4>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{selectedLevel.bossTitle}</p>
              </div>
            </div>

            {/* BOSS HP BAR */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[10px] font-black text-slate-400">
                <span>SPIRE THREAT INTEGRITY</span>
                <span className={bossHP < 30 ? 'text-red-400 animate-pulse' : 'text-blue-400'}>
                  {bossHP} / {selectedLevel.bossMaxHP} HP
                </span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
                <motion.div 
                  className={`h-full rounded-full ${bossHP < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
                  animate={{ width: `${(bossHP / selectedLevel.bossMaxHP) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* FLOATING DAMAGE POPUP */}
            <AnimatePresence>
              {bossDamageAnim !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -10 }}
                  animate={{ opacity: 1, scale: 1.2, y: -40 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] z-20"
                >
                  -{bossDamageAnim} HP!
                </motion.div>
              )}
            </AnimatePresence>

            {/* DIALOGUE BUBBLE */}
            <div className="mt-4 p-3 bg-blue-950/10 border border-blue-950/40 rounded-xl relative">
              <div className="absolute top-2 left-4 w-2 h-2 bg-blue-950/10 rotate-45 transform -translate-y-4" />
              <p className="text-xs text-blue-300 italic leading-relaxed">
                "{currentDialogue}"
              </p>
            </div>
          </div>

          {/* STACK PARSER LOGS */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 h-[240px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                Stack Parser Stream Output
              </span>
              <button 
                onClick={() => setConsoleLogs([`[EXECUTION SPIRE] Logs cleared.`])}
                className="text-[8px] hover:text-white text-slate-600 font-bold"
              >
                CLEAR LOGS
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 text-[10px] font-mono scrollbar-thin">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className={
                  log.startsWith('✅') 
                    ? 'text-emerald-400 font-bold' 
                    : log.startsWith('❌') 
                    ? 'text-red-400 font-bold animate-pulse' 
                    : 'text-slate-500'
                }>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ACHIEVEMENT TOAST NOTIFIER */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-6 right-6 bg-[#09152a] border-2 border-amber-500/80 rounded-2xl p-5 shadow-[0_0_30px_rgba(245,158,11,0.4)] z-50 flex items-center gap-4 max-w-sm animate-fade-in"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest block">Achievement Unlocked!</span>
              <h5 className="text-sm font-black text-white">{newAchievement}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">Defeated the local sector threat in Stack Mountain.</p>
            </div>
            <button 
              onClick={() => setNewAchievement(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
