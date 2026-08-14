import React, { useState, useEffect } from 'react';
import { 
  Shield, Award, Sparkles, HelpCircle, AlertCircle, 
  ChevronRight, Play, CheckCircle2, RotateCcw, Lightbulb, 
  Cpu, Flame, Lock, Unlock, Trophy, Send, RefreshCw, X, ArrowRight,
  Sliders, ArrowLeft, ArrowRightLeft, Layers, Columns, BarChart3, Database, HardDrive, Compass, Train, Zap, RefreshCw as LoopIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileState } from '../types';
import PremiumAudioManager from '../lib/audioManager';

interface QueueCityQuestProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
  onCompleteSector: () => void;
}

export interface QuestProblem {
  id: string;
  title: string;
  type: 'concept' | 'enqueue_dequeue' | 'circular' | 'deque' | 'priority' | 'bfs' | 'scheduling';
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
    name: "FIFO Pipeline Core",
    topic: "Queue Foundations",
    bossName: "Buffer-Baron FIFO",
    bossTitle: "Transit Controller",
    bossAvatar: "🚇",
    bossMaxHP: 100,
    bossDialogueGreeting: "First come, first served! Do not allow a higher priority to disrupt our chronological schedule. Enter our packet buffers in order!",
    bossDialogueDefeated: "Packet buffers successfully synchronized in absolute chronological order.",
    rewardAchievementId: "queue_lvl1",
    rewardAchievementName: "FIFO Operator",
    problems: [
      {
        id: "queue_fifo",
        title: "Properties of FIFO",
        type: "concept",
        description: "A queue is a linear data structure that operates on the First-In-First-Out (FIFO) principle. Elements are appended to the back (rear) and removed from the front.",
        objective: "Select which option represents a valid FIFO queue process.",
        hint: "In FIFO, the first person or element to enter is the absolute first to leave.",
        xpReward: 30,
        pointsReward: 20,
        data: { options: ["Stack frame undo history", "A line of shoppers checking out at a store register", "A pile of books in a shipping box"], correctIdx: 1 }
      },
      {
        id: "enqueue_dequeue_simulation",
        title: "Trace Queue Pipeline",
        type: "enqueue_dequeue",
        description: "Trace these queue actions starting from empty: Enqueue(10), Enqueue(20), Dequeue(), Enqueue(30), Dequeue(). What value remains inside the queue buffer?",
        objective: "Identify the correct remaining element.",
        hint: "Enqueue adds to tail. Dequeue removes from head. First Dequeue takes 10. Second takes 20.",
        xpReward: 40,
        pointsReward: 20,
        data: { options: ["10", "20", "30", "Empty"], correctIdx: 2 }
      },
      {
        id: "queue_peek",
        title: "Examine Front Pointer",
        type: "enqueue_dequeue",
        description: "Given a queue containing elements [45, 60, 90] where 45 is at the Front. If we invoke 'Peek' or 'Front', what value is retrieved and what is the new queue size?",
        objective: "Select the correct state of the front pointer.",
        hint: "Peek reads the front element without dequeueing. So size remains 3.",
        xpReward: 40,
        pointsReward: 20,
        data: { options: ["Value 45, Size 3", "Value 90, Size 3", "Value 45, Size 2"], correctIdx: 0 }
      }
    ]
  },
  {
    id: 2,
    name: "Circular Buffer Wrap",
    topic: "Pointer Modulo Mathematics",
    bossName: "Modulo Router",
    bossTitle: "Ring Buffer Arbiter",
    bossAvatar: "🍩",
    bossMaxHP: 110,
    bossDialogueGreeting: "Linear queues suffer from memory leaks and pointer fragmentation! Re-use memory coordinates or watch your memory buffer overflow!",
    bossDialogueDefeated: "Modulo indexing unlocked! Circular arrays wrap around seamlessly without memory leaks.",
    rewardAchievementId: "queue_lvl2",
    rewardAchievementName: "Ring Coordinator",
    problems: [
      {
        id: "circular_advantage",
        title: "Why Circular Arrays?",
        type: "circular",
        description: "What primary issue in linear array-based queues does a Circular Queue solve?",
        objective: "Identify the main advantage of circular queue wrapping.",
        hint: "In linear arrays, dequeuing elements leaves empty spaces at the front that cannot be re-used. Modulo wrapping fixes this.",
        xpReward: 45,
        pointsReward: 25,
        data: { options: ["Enables faster lookup sorting", "Allows vacant slots at the front of the array to be re-used", "Saves battery power on the client"], correctIdx: 1 }
      },
      {
        id: "circular_formula",
        title: "Modulo Increment Formula",
        type: "circular",
        description: "When enqueuing onto a circular queue of capacity N, how is the rear pointer incremented?",
        objective: "Choose the correct pointer advancement formula.",
        hint: "To wrap around, we add 1 and apply modulo N: (rear + 1) % N.",
        xpReward: 50,
        pointsReward: 25,
        data: { options: ["rear = rear + 1", "rear = (rear + 1) % N", "rear = (rear % N) + 1"], correctIdx: 1 }
      },
      {
        id: "circular_full_condition",
        title: "Detect Full Circular Buffer",
        type: "circular",
        description: "In a circular queue of size N, what condition indicates that the queue is fully saturated (assuming we keep one empty space to distinguish from empty)?",
        objective: "Select the correct Boolean boundary condition.",
        hint: "If the next rear slot wraps onto the front slot, the queue is full: (rear + 1) % N == front.",
        xpReward: 55,
        pointsReward: 25,
        data: { options: ["(rear + 1) % N == front", "rear == front", "rear + front == N"], correctIdx: 0 }
      }
    ]
  },
  {
    id: 3,
    name: "Deque Double-Ends",
    topic: "Double-Ended Queues (Deques)",
    bossName: "Bilateral Daemon",
    bossTitle: "Bifurcated Streamer",
    bossAvatar: "🔄",
    bossMaxHP: 120,
    bossDialogueGreeting: "I insert at the front and remove from the rear, or insert at the rear and remove from the front! Conquer my dual directionalities if you can!",
    bossDialogueDefeated: "Bilateral deques mapped. Front and rear index limits validated successfully.",
    rewardAchievementId: "queue_lvl3",
    rewardAchievementName: "Deque Splicer",
    problems: [
      {
        id: "deque_concept",
        title: "Double-Ended Mechanics",
        type: "deque",
        description: "A Deque (Double-Ended Queue) allows insert and delete operations from which points?",
        objective: "Select the correct structural definition.",
        hint: "Pronounced 'deck', it lets you insert or remove from both the Front and the Back.",
        xpReward: 50,
        pointsReward: 30,
        data: { options: ["Only the front pointer", "Only the rear pointer", "Both the front and rear pointers"], correctIdx: 2 }
      },
      {
        id: "deque_insert_front",
        title: "Insert Front Complexity",
        type: "deque",
        description: "In a properly designed doubly linked list implementation of a Deque, what is the time complexity of insertFront() and deleteRear() operations?",
        objective: "Identify the asymptotic efficiency constraints.",
        hint: "DLL maintains direct pointers to head and tail, allowing O(1) front/rear adjustments.",
        xpReward: 55,
        pointsReward: 30,
        data: { options: ["O(1) constant time", "O(N) linear time", "O(log N) logarithmic time"], correctIdx: 0 }
      },
      {
        id: "deque_restricted",
        title: "Restricted Deque Variants",
        type: "deque",
        description: "An input-restricted deque is a deque that allows insertions only at one end, but allows deletions from both ends. Is this definition correct?",
        objective: "Select TRUE if definition is correct, FALSE otherwise.",
        hint: "Yes, 'input-restricted' limits input insertion to 1 end, while leaving delete open on both ends.",
        xpReward: 65,
        pointsReward: 30,
        data: { expected: true }
      }
    ]
  },
  {
    id: 4,
    name: "Priority Heap Queue",
    topic: "Heaps & Priorities",
    bossName: "Apex Sorter",
    bossTitle: "Maximum Element Governor",
    bossAvatar: "👑",
    bossMaxHP: 135,
    bossDialogueGreeting: "Time of arrival matters not in my sovereign palace! Only the highest priority shall sit at the front! Heapify your nodes or remain at the tail!",
    bossDialogueDefeated: "Priority heap constraints solved! Nodes bubble according to priority keys.",
    rewardAchievementId: "queue_lvl4",
    rewardAchievementName: "Priority Governor",
    problems: [
      {
        id: "priority_sorting",
        title: "Departure from FIFO",
        type: "priority",
        description: "How does a Priority Queue differ from a standard FIFO queue in term of servicing elements?",
        objective: "Identify the element ranking mechanism.",
        hint: "Elements are dequeued based on their priority key instead of their arrival order.",
        xpReward: 60,
        pointsReward: 35,
        data: { options: ["Serves items in random sequence", "Serves items with highest priority value first", "Serves the last enqueued item always"], correctIdx: 1 }
      },
      {
        id: "priority_heap_complexity",
        title: "Binary Heap Bounds",
        type: "priority",
        description: "If we implement a Priority Queue using a Binary Heap, what is the time complexity to ENQUEUE a new element?",
        objective: "Select the correct heap complexity bounds.",
        hint: "Inserting an element into a binary heap requires bubble-up (heapify) which scales with tree height: O(log N).",
        xpReward: 70,
        pointsReward: 35,
        data: { options: ["O(1)", "O(log N)", "O(N)"], correctIdx: 1 }
      },
      {
        id: "priority_peek_complexity",
        title: "PQ Peek Complexity",
        type: "priority",
        description: "What is the time complexity to retrieve (PEEK) the maximum priority element in a Max-Heap backed Priority Queue?",
        objective: "Select the peek complexity.",
        hint: "The maximum element is always at the root index [0], so we can look it up in O(1) time.",
        xpReward: 75,
        pointsReward: 35,
        data: { options: ["O(1) constant time", "O(log N) log time", "O(N) linear time"], correctIdx: 0 }
      }
    ]
  },
  {
    id: 5,
    name: "BFS & Traversal Waves",
    topic: "Breadth-First Queue Application",
    bossName: "Grid Scanner",
    bossTitle: "Wavefront Traversal Matrix",
    bossAvatar: "📡",
    bossMaxHP: 145,
    bossDialogueGreeting: "I expand in concentric ripples! Walk my network BFS layers sequentially, or get lost in the deep recursive paths of DFS!",
    bossDialogueDefeated: "Breadth-first wavefront established. Radial level traversal fully synchronized.",
    rewardAchievementId: "queue_lvl5",
    rewardAchievementName: "Wave Navigator",
    problems: [
      {
        id: "bfs_trace",
        title: "BFS Tree Wave Trace",
        type: "bfs",
        description: "Given a tree with root node A. A points to children B and C. B points to D and E. If we perform standard Breadth-First Search (BFS) using a queue, in what order are the nodes processed?",
        objective: "Select the correct level-order sequence.",
        hint: "BFS traverses level by level: Root first, then children, then grandchildren: A, then B, C, then D, E.",
        xpReward: 70,
        pointsReward: 40,
        data: { options: ["A, B, D, E, C", "A, B, C, D, E", "D, E, B, C, A"], correctIdx: 1 }
      },
      {
        id: "bfs_data_struct",
        title: "Queue role in BFS",
        type: "bfs",
        description: "Why is a FIFO queue specifically chosen for Breadth-First Search instead of a LIFO stack?",
        objective: "Choose the correct operational justification.",
        hint: "Queues process older, shallower nodes before newer, deeper ones, enforcing a level-by-level wavefront.",
        xpReward: 80,
        pointsReward: 40,
        data: { options: ["Queues consume less memory heap", "Queues guarantee that nodes are processed in the order they were discovered (level-by-level)", "Queues sort nodes alphabetically"], correctIdx: 1 }
      },
      {
        id: "bfs_shortest_path",
        title: "Unweighted Graph Shortest Path",
        type: "bfs",
        description: "In an unweighted graph, does standard BFS guarantee finding the shortest path (minimum edge hops) from the starting node to any other node?",
        objective: "Confirm if BFS finds the shortest path.",
        hint: "Yes, because BFS expands radially step-by-step, the first time a node is reached, it is guaranteed to be via the shortest possible hops.",
        xpReward: 85,
        pointsReward: 40,
        data: { options: ["Yes, guaranteed", "No, Dijkstra is always required"], correctIdx: 0 }
      },
      {
        id: "bfs_floodfill",
        title: "BFS Flood Fill Application",
        type: "bfs",
        description: "Which algorithm is commonly used in pixel flood fill or route search inside grid mazes?",
        objective: "Identify the radial grid filler.",
        hint: "BFS expands in neat, growing circles, making it ideal for standard unweighted maze pathing and area fills.",
        xpReward: 90,
        pointsReward: 40,
        data: { options: ["Binary Search", "Breadth-First Search (BFS)", "Depth-First Search (DFS)"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 6,
    name: "Pipeline Schedulers",
    topic: "Round Robin & Streams",
    bossName: "Clockwork Scheduler",
    bossTitle: "Process Execution Master",
    bossAvatar: "⏳",
    bossMaxHP: 160,
    bossDialogueGreeting: "No process shall hog the CPU! Every thread receives a tiny slice of time, then gets enqueued back to the rear of my buffer!",
    bossDialogueDefeated: "Scheduling pipeline running with maximum throughput and zero thread starvation. Queue City fully secured!",
    rewardAchievementId: "queue_lvl6",
    rewardAchievementName: "City Scheduler",
    problems: [
      {
        id: "round_robin_slice",
        title: "Round Robin Quantum",
        type: "scheduling",
        description: "In Round Robin scheduling, if a process has a burst time of 8 and the time slice (quantum) is 5, how much burst time remains when the process is preempted and enqueued back to the rear of the scheduler queue?",
        objective: "Enter the remaining burst time.",
        hint: "The process gets to execute for 5 time units. 8 - 5 = 3 remaining burst units.",
        xpReward: 80,
        pointsReward: 45,
        data: { expectedVal: 3 }
      },
      {
        id: "starvation_aging",
        title: "Mitigating Process Starvation",
        type: "scheduling",
        description: "In priority-based process scheduling, low priority tasks might wait forever (starvation) in the queue. What mechanism resolves this by gradually raising priority over waiting time?",
        objective: "Identify the priority inflation technique.",
        hint: "Aging is a standard technique that gradually increases the priority of processes that wait in the queue for a long time.",
        xpReward: 90,
        pointsReward: 45,
        data: { options: ["Pruning", "Decay", "Aging", "Leapfrogging"], correctIdx: 2 }
      },
      {
        id: "pipeline_backpressure",
        title: "Backpressure Signalling",
        type: "scheduling",
        description: "When an asynchronous pipeline buffer becomes completely full, what signal protocol is triggered to slow down upstream producers?",
        objective: "Select the congestion signaling mechanism.",
        hint: "Backpressure is the term for downstream systems signaling upstream ones to slow down flow rate.",
        xpReward: 95,
        pointsReward: 45,
        data: { options: ["Stack tracing", "Backpressure", "Modulo overflow"], correctIdx: 1 }
      },
      {
        id: "quantum_selection",
        title: "Impact of Quantum Size",
        type: "scheduling",
        description: "If the time quantum in a Round Robin queue scheduler is set to an extremely large value (approaching infinity), the scheduling behavior degenerates into which other algorithm?",
        objective: "Choose the degenerated scheduling state.",
        hint: "With infinite quantum, each process runs to completion in order of arrival, mimicking First-Come-First-Served (FCFS).",
        xpReward: 100,
        pointsReward: 45,
        data: { options: ["First-Come-First-Served (FCFS)", "Shortest Job First (SJF)", "Priority Scheduling"], correctIdx: 0 }
      }
    ]
  }
];

export default function QueueCityQuest({ profile, onUpdateProfile, onBackToMenu, onCompleteSector }: QueueCityQuestProps) {
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

  // Dynamic interactive queue states
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [selectedBoolean, setSelectedBoolean] = useState<boolean | null>(null);

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
    setConsoleLogs([`[TRANSIT NETWORK] Link active: ${lvl.topic} grid.`, `[SENTRY] ${lvl.bossName} spawned.`]);
  }, [activeLevelIdx]);

  // Sync Problem selection
  useEffect(() => {
    const prob = selectedLevel.problems[activeProblemIdx];
    if (prob) {
      setShowHint(false);
      setSelectedIdx(null);
      setTextAnswer('');
      setSelectedBoolean(null);
      setConsoleLogs(prev => [...prev, `[SENTRY] Decompressing Task ${activeProblemIdx + 1}: ${prob.title}`]);
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

  const handleVerifyProblem = () => {
    const prob = selectedLevel.problems[activeProblemIdx];
    if (!prob) return;

    let success = false;
    let feedback = '';

    switch(prob.id) {
      case 'queue_fifo':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Correct! Shoppers waiting at a checkout register form a strict FIFO queue.";
        } else {
          feedback = "❌ Mismatch. Think about who enters first and leaves first.";
        }
        break;
      case 'enqueue_dequeue_simulation':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Verified! Queue has [30] remaining. First-in (10, then 20) are dequeued.";
        } else {
          feedback = "❌ Trace incorrect. Follow enqueues and dequeues step by step.";
        }
        break;
      case 'queue_peek':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Correct! Front element is inspected. Size is unaltered.";
        } else {
          feedback = "❌ Mismatch. Peek does not pop the queue elements.";
        }
        break;
      case 'circular_advantage':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Correct! Circular design reclaims unused indices seamlessly.";
        } else {
          feedback = "❌ Modulo wrapping resolves pointer block reclamation.";
        }
        break;
      case 'circular_formula':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Formula verified: rear = (rear + 1) % N wraps indexes smoothly!";
        } else {
          feedback = "❌ Standard linear additions trigger index overflow.";
        }
        break;
      case 'circular_full_condition':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Boundary verified! Circular queue is full.";
        } else {
          feedback = "❌ Condition incorrect. Check wraps overlap thresholds.";
        }
        break;
      case 'deque_concept':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Correct! Deques operate from both fronts and backs.";
        } else {
          feedback = "❌ Wrong. Double-ended structures bypass single-entry limits.";
        }
        break;
      case 'deque_insert_front':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Dual DLL head/tail pointers guarantee constant O(1) performance!";
        } else {
          feedback = "❌ Mismatch. Correct DLL offsets allow constant additions without linear scans.";
        }
        break;
      case 'deque_restricted':
        if (selectedBoolean === prob.data.expected) {
          success = true;
          feedback = "✅ True! Input-restricted queues allow single insert, dual deletions.";
        } else {
          feedback = "❌ Definition mismatch. Review input-restricted deque attributes.";
        }
        break;
      case 'priority_sorting':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Serviced according to priority keys! FIFO is bypassed.";
        } else {
          feedback = "❌ Chronological arrival is ignored in priority pools.";
        }
        break;
      case 'priority_heap_complexity':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Binary heap inserts execute in logarithmic O(log N) heights!";
        } else {
          feedback = "❌ Mismatch. Tree leaf bubbling scales with tree height.";
        }
        break;
      case 'priority_peek_complexity':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Max node is always root, allowing direct constant O(1) peeks!";
        } else {
          feedback = "❌ Looking up root index does not require sorting scans.";
        }
        break;
      case 'bfs_trace':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ BFS trace level-order sequence verified: A, B, C, D, E!";
        } else {
          feedback = "❌ DFS processes deeper nodes first. BFS processes horizontally.";
        }
        break;
      case 'bfs_data_struct':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ FIFO guarantees level-by-level wavefront order.";
        } else {
          feedback = "❌ Stacks trigger depth-first paths instead of radial sweeps.";
        }
        break;
      case 'bfs_shortest_path':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Correct! Wave expansion guarantees minimum hops in unweighted structures.";
        } else {
          feedback = "❌ Unweighted mazes are solved in linear BFS waves with shortest-path guarantee.";
        }
        break;
      case 'bfs_floodfill':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Breadth-First search drives pixel grid expansion waves!";
        } else {
          feedback = "❌ DFS triggers branching lines instead of smooth concentric waves.";
        }
        break;
      case 'round_robin_slice':
        if (parseInt(textAnswer) === prob.data.expectedVal) {
          success = true;
          feedback = "✅ Process remaining slice calculated as 3!";
        } else {
          feedback = "❌ Subtract quantum burst from process requirements.";
        }
        break;
      case 'starvation_aging':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Aging mitigates starvation by inflating priorities over time!";
        } else {
          feedback = "❌ Decay would lower priority further. Aging increases it.";
        }
        break;
      case 'pipeline_backpressure':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Backpressure signalling slows upstream streams!";
        } else {
          feedback = "❌ Dequeue and modulo overflows are separate from backpressure flow signals.";
        }
        break;
      case 'quantum_selection':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Infinite quantum processes elements in order (FCFS)!";
        } else {
          feedback = "❌ SJF requires burst-time sorting, which is unaffected by quantum values.";
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
          setCurrentDialogue("No pipeline latency! You have dequeued my blocks successfully!");
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
              description: `Cleared Level ${selectedLevel.id} of Queue City by defeating ${selectedLevel.bossName}`,
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

    if (totalLvlSolved === 6) {
      setConsoleLogs(prev => [...prev, "🚨 SECTOR CLEARANCE RECEIVED! QUEUE CITY HAS BEEN SECURED!"]);
      setTimeout(() => {
        onCompleteSector();
      }, 3000);
    }
  };

  const prob = selectedLevel.problems[activeProblemIdx];

  return (
    <div className="bg-[#080b16] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-mono text-slate-200 w-full">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-950/40">
        <div>
          <div className="flex items-center gap-2">
            <Train className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-400">
              QUEUE CITY: THE FIFO SCHEDULER
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
            6 Levels • 21 Pipeline Queue Challenges • Asynchronous Ring Buffers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl text-xs flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>CREDITS: <b className="text-emerald-400">{profile.points}</b></span>
          </div>

          <button
            onClick={() => { playSound('powerdown'); onBackToMenu(); }}
            className="px-4 py-1.5 bg-slate-950 border border-emerald-900/40 hover:border-emerald-500/80 text-emerald-300 text-xs font-bold rounded-xl transition-all"
          >
            ← LEAVE CITY
          </button>
        </div>
      </div>

      {/* LEVEL SELECTION RAIL */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {QUEST_LEVELS.map((lvl, index) => {
          const isSelected = activeLevelIdx === index;
          const isCleared = lvl.problems.every(p => solvedProblemIds.includes(p.id));
          return (
            <button
              key={lvl.id}
              onClick={() => handleLevelSelect(index)}
              className={`relative p-2 rounded-xl border text-left transition-all ${
                isSelected 
                  ? 'bg-emerald-950/30 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-emerald-200' 
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
          <div className="bg-[#05070e] border border-emerald-950/80 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded text-[9px] uppercase font-bold tracking-widest">
                Task Frame {activeProblemIdx + 1} of {selectedLevel.problems.length}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                REWARD: +{prob?.xpReward} XP / +{prob?.pointsReward} Credits
              </span>
            </div>

            <h3 className="text-base font-black text-white">{prob?.title}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{prob?.description}</p>
            
            <div className="mt-4 p-3 bg-emerald-950/10 border border-emerald-950 rounded-xl flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-emerald-300 uppercase font-black block">Transit Objective</span>
                <p className="text-xs text-emerald-200 font-bold">{prob?.objective}</p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE STAGE */}
          <div className="bg-[#05070e] border border-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] relative">
            <span className="absolute top-3 left-4 text-[9px] text-slate-500 uppercase font-bold tracking-widest">
              Live Queue Pipeline State
            </span>

            <div className="w-full flex flex-wrap items-center justify-center gap-4 py-6">
              
              {/* CONCEPT PROBLEMS & MULTIPLE CHOICE OPTIONS */}
              {(prob?.type === 'concept' || prob?.type === 'enqueue_dequeue' || prob?.type === 'circular' || prob?.type === 'deque' || prob?.type === 'priority' || prob?.type === 'bfs' || prob?.id === 'starvation_aging' || prob?.id === 'pipeline_backpressure' || prob?.id === 'quantum_selection') && (
                <div className="flex flex-col gap-3 w-full max-w-md">
                  {prob.data.options?.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                      className={`p-3.5 border rounded-xl font-mono text-xs font-bold text-left flex justify-between items-center transition-all ${
                        selectedIdx === idx
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* BOOLEAN ANSWER (TRUE/FALSE) */}
              {(prob?.id === 'deque_restricted') && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => { playSound('click'); setSelectedBoolean(true); }}
                      className={`px-6 py-3 border text-sm font-bold rounded-xl transition-all ${
                        selectedBoolean === true
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      TRUE
                    </button>
                    <button
                      onClick={() => { playSound('click'); setSelectedBoolean(false); }}
                      className={`px-6 py-3 border text-sm font-bold rounded-xl transition-all ${
                        selectedBoolean === false
                          ? 'bg-red-950/40 border-red-500 text-red-300'
                          : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      FALSE
                    </button>
                  </div>
                </div>
              )}

              {/* TEXT OR NUMBER INPUT PROBLEMS */}
              {(prob?.id === 'round_robin_slice') && (
                <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                  <div className="w-full flex gap-3">
                    <input
                      type="text"
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="ENTER NUMERIC OR STRING ANSWER..."
                      className="flex-1 bg-slate-950 border border-slate-850 focus:border-emerald-500 text-sm p-3.5 rounded-xl font-mono text-center text-white focus:outline-none placeholder-slate-700 font-black uppercase"
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
              <span>{showHint ? 'HIDE TRANSIT HINT' : 'REVEAL TRANSIT HINT'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleVerifyProblem}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>COMPILE & DEQUEUE</span>
              </button>

              {solvedProblemIds.includes(prob?.id) && (
                <button
                  onClick={handleNextProblem}
                  className="px-4 py-2.5 bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:border-emerald-500 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <span>NEXT TRN</span>
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
                  <span className="text-xs font-black text-yellow-300 block uppercase tracking-wider">Transit Hint:</span>
                  <p className="text-xs text-yellow-200/90 mt-1 leading-relaxed">{prob?.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: BOSS & SENTRY FEEDBACK */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* BOSS BATTLE SCREEN */}
          <div className="bg-gradient-to-b from-slate-950 to-[#030610] border border-emerald-950 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-glow opacity-5 pointer-events-none" />

            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-900/60">
              <span className="text-3xl animate-bounce">{selectedLevel.bossAvatar}</span>
              <div>
                <h4 className="text-sm font-black text-white">{selectedLevel.bossName}</h4>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{selectedLevel.bossTitle}</p>
              </div>
            </div>

            {/* BOSS HP BAR */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[10px] font-black text-slate-400">
                <span>BUFFER INTEGRITY</span>
                <span className={bossHP < 30 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}>
                  {bossHP} / {selectedLevel.bossMaxHP} HP
                </span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
                <motion.div 
                  className={`h-full rounded-full ${bossHP < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
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
            <div className="mt-4 p-3 bg-emerald-950/10 border border-emerald-950/40 rounded-xl relative">
              <div className="absolute top-2 left-4 w-2 h-2 bg-emerald-950/10 rotate-45 transform -translate-y-4" />
              <p className="text-xs text-emerald-300 italic leading-relaxed">
                "{currentDialogue}"
              </p>
            </div>
          </div>

          {/* QUEUE CITY TRANSIT LOGS */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 h-[240px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                Transit Router Stream
              </span>
              <button 
                onClick={() => setConsoleLogs([`[TRANSIT NETWORK] Logs cleared.`])}
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
              <p className="text-[10px] text-slate-400 mt-0.5">Defeated the local buffer threat in Queue City.</p>
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
