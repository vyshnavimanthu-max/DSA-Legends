import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Lightbulb, Cpu, Trophy, Send, X, Sliders, Shield, Zap, Sparkles, ChevronRight, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileState } from '../types';
import PremiumAudioManager from '../lib/audioManager';

interface HeapCastleQuestProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
  onCompleteSector: () => void;
}

export interface QuestProblem {
  id: string;
  title: string;
  type: 'concept' | 'indexing' | 'sift' | 'heapsort' | 'pq' | 'klargest' | 'median';
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
    name: "Heap Laws & Indexing",
    topic: "Structural Geometry",
    bossName: "Iron Sentinel",
    bossTitle: "Gatekeeper of the Array",
    bossAvatar: "🏰",
    bossMaxHP: 100,
    bossDialogueGreeting: "Halt! A binary heap is a flattened array in disguise! Fail to map the parent-to-child indices correctly, and my iron gates will lock you out!",
    bossDialogueDefeated: "Sequential index maps parsed. The drawbridge lowers.",
    rewardAchievementId: "heap_lvl1",
    rewardAchievementName: "Castle Gatekeeper",
    problems: [
      {
        id: "heap_shape",
        title: "Binary Heap Structural Shape",
        type: "concept",
        description: "What structural classification must a binary heap satisfy regarding its tree shape?",
        objective: "Select the structural shape condition.",
        hint: "All levels are filled except possibly the last, which is filled from left to right.",
        xpReward: 35,
        pointsReward: 20,
        data: { options: ["Perfect Binary Tree", "Complete Binary Tree", "Full Binary Tree", "Degenerate Linear Tree"], correctIdx: 1 }
      },
      {
        id: "left_child_index",
        title: "Left Child Index Relation",
        type: "indexing",
        description: "If a node is stored at index 'i' in a 0-indexed array representing a binary heap, what is the formula to locate its left child?",
        objective: "Choose the correct array indexing offset formula.",
        hint: "Double the parent index, then adjust for 0-based offset.",
        xpReward: 35,
        pointsReward: 20,
        data: { options: ["2 * i", "2 * i + 1", "2 * i + 2", "i / 2"], correctIdx: 1 }
      },
      {
        id: "parent_index",
        title: "Parent Node Index Relation",
        type: "indexing",
        description: "For any node stored at index 'i' (where i > 0) in a 0-indexed binary heap array, what is the formula to retrieve its parent index using integer division?",
        objective: "Identify parent node retrieval math.",
        hint: "Subtract 1 and divide by 2, rounding down.",
        xpReward: 40,
        pointsReward: 20,
        data: { options: ["i / 2", "(i - 1) / 2", "(i - 2) / 2", "2 * i"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 2,
    name: "Sift Up, Down & Heapify",
    topic: "Dynamic Sift Mechanics",
    bossName: "Levitation Alchemist",
    bossTitle: "Gravitational Regulator",
    bossAvatar: "🧪",
    bossMaxHP: 115,
    bossDialogueGreeting: "Elements must bubble up or precipitate down! Master the physical sifting protocols, or my alchemical solutions will boil over!",
    bossDialogueDefeated: "Inversion anomalies neutralized. Tree gravity settled.",
    rewardAchievementId: "heap_lvl2",
    rewardAchievementName: "Gravity Alchemist",
    problems: [
      {
        id: "sift_up_trigger",
        title: "Sift-Up Operational Trigger",
        type: "sift",
        description: "In a Max-Heap, when do we invoke the sift-up (or bubble-up) operation on a node?",
        objective: "Identify when sift-up is required.",
        hint: "When we insert a new item at the bottom of the heap, we must restore heap properties going upwards.",
        xpReward: 40,
        pointsReward: 25,
        data: { options: ["Upon extracting the max element", "Upon inserting a new element at the bottom leaf", "When deleting the entire array", "Upon searching a key"], correctIdx: 1 }
      },
      {
        id: "sift_down_trigger",
        title: "Sift-Down Extraction Flow",
        type: "sift",
        description: "When performing a 'poll' or 'extract' operation, we move the last leaf node to the root. Which operation restores order downwards?",
        objective: "Identify the downward correction helper.",
        hint: "We must sink the root down by swapping with its largest (Max-Heap) or smallest (Min-Heap) child.",
        xpReward: 45,
        pointsReward: 25,
        data: { options: ["Sift-Up", "Sift-Down (or Heapify-Down)", "Linear Scan", "Double Rotation"], correctIdx: 1 }
      },
      {
        id: "build_heap_complexity",
        title: "In-Place Heapify Complexity",
        type: "sift",
        description: "Building a binary heap from an unsorted array of N elements in-place using bottom-up heapify runs in what optimal time complexity?",
        objective: "Select the optimal build-heap complexity bound.",
        hint: "Though N calls to sift-down are made, height-related math limits total swaps to linear time.",
        xpReward: 50,
        pointsReward: 25,
        data: { options: ["O(N log N)", "O(N)", "O(N^2)", "O(1)"], correctIdx: 1 }
      },
      {
        id: "heapify_direction",
        title: "Bottom-Up Heapify Direction",
        type: "sift",
        description: "From which index does the bottom-up heapify algorithm start processing nodes when initializing an array of size N?",
        objective: "Determine the starting index of building.",
        hint: "We ignore leaf nodes because single-element subtrees are already valid heaps. We start at the last non-leaf node: N/2 - 1.",
        xpReward: 50,
        pointsReward: 25,
        data: { options: ["index 0", "index N - 1", "index N/2 - 1", "index sqrt(N)"], correctIdx: 2 }
      }
    ]
  },
  {
    id: 3,
    name: "Heap Sort Protocols",
    topic: "Sorting Fortifications",
    bossName: "Steel Forge-Master",
    bossTitle: "Metal Sorter",
    bossAvatar: "⚒️",
    bossMaxHP: 125,
    bossDialogueGreeting: "Welcome to the forge! We hammer raw arrays into perfectly ordered arrays of steel. Sift, swap, shrink! Can you trace my in-place sorted steel sheets?",
    bossDialogueDefeated: "Array forged into pristine ascending sorted order. Steel strength approved.",
    rewardAchievementId: "heap_lvl3",
    rewardAchievementName: "Forge Master",
    problems: [
      {
        id: "heapsort_worst_case",
        title: "Worst-Case Sorting Bounds",
        type: "heapsort",
        description: "What is the worst-case time complexity of Heap Sort on an array of N elements?",
        objective: "Select Heap Sort complexity.",
        hint: "We perform N extractions, each requiring a sift-down bounded by tree height.",
        xpReward: 45,
        pointsReward: 30,
        data: { options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"], correctIdx: 1 }
      },
      {
        id: "heapsort_stability",
        title: "Heap Sort Stability",
        type: "heapsort",
        description: "Is Heap Sort classified as a stable sorting algorithm (retaining original relative order of duplicate elements)?",
        objective: "Identify stability characteristics.",
        hint: "Elements are swapped across long distances in the array, making relative duplicates break ordering rules.",
        xpReward: 50,
        pointsReward: 30,
        data: { options: ["Yes, always stable", "No, it is an unstable sort due to long-range swaps"], correctIdx: 1 }
      },
      {
        id: "heapsort_phases",
        title: "Heap Sort Execution Phases",
        type: "heapsort",
        description: "What are the two high-level phases of Heap Sort when sorting an array in ascending order?",
        objective: "Identify the chronological phases.",
        hint: "First, build a Max-Heap. Then, repeatedly swap root with the last leaf and shrink heap boundary while heapifying down.",
        xpReward: 55,
        pointsReward: 30,
        data: { options: ["Build Min-Heap, then do BFS", "Build Max-Heap, then repeatedly extract-max and place at the end", "Sort elements using Merge-Sort, then heapify", "Randomly permute until sorted"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 4,
    name: "Priority Queue Systems",
    topic: "Castle Task Schedulers",
    bossName: "High Chancellor",
    bossTitle: "Core Dispatcher",
    bossAvatar: "📜",
    bossMaxHP: 135,
    bossDialogueGreeting: "My scrolls list a thousand tasks, each with distinct critical urgency! Solve my dispatching equations, or let the castle's tasks descend into total priority starvation!",
    bossDialogueDefeated: "Scheduling queue balanced. Tasks prioritized with microsecond accuracy.",
    rewardAchievementId: "heap_lvl4",
    rewardAchievementName: "Grand Dispatcher",
    problems: [
      {
        id: "pq_insert_extract_complex",
        title: "PQ Operation Complexities",
        type: "pq",
        description: "In a binary heap-backed Priority Queue, what are the time complexities of insert (enqueue) and extract-min (dequeue) operations respectively?",
        objective: "Select priority queue boundaries.",
        hint: "Both operations are bounded by the logarithmic height of the complete binary tree.",
        xpReward: 50,
        pointsReward: 30,
        data: { options: ["O(1) insert, O(N) extract", "O(log N) insert, O(log N) extract", "O(N) insert, O(1) extract", "O(1) insert, O(1) extract"], correctIdx: 1 }
      },
      {
        id: "d_ary_heap_pq",
        title: "D-ary Heap Optimizations",
        type: "pq",
        description: "What is the primary advantage of using a d-ary heap (where each node has d children instead of 2) in systems that perform many more insertions than extractions?",
        objective: "Analyze d-ary heap mechanics.",
        hint: "A larger branching factor reduces tree height, accelerating 'sift-up' insertions to O(log_d N).",
        xpReward: 55,
        pointsReward: 30,
        data: { options: ["Faster extraction operations", "Shallower tree height leading to faster sift-up insertions", "Reduced overall memory footprint", "Easier debugging"], correctIdx: 1 }
      },
      {
        id: "heap_decrease_key",
        title: "Decrease Key Complexity",
        type: "pq",
        description: "In a Min-Heap-based Priority Queue, which internal operation is triggered when the priority value of an existing node is decreased?",
        objective: "Identify the priority shift response.",
        hint: "Making priority smaller in a Min-Heap means the node must travel closer to the root. We sift-up.",
        xpReward: 60,
        pointsReward: 30,
        data: { options: ["Sift-Down", "Sift-Up", "Full Array Re-sort", "Grandparent Deletion"], correctIdx: 1 }
      },
      {
        id: "pq_starvation_fix",
        title: "Preventing Priority Starvation",
        type: "pq",
        description: "How can a system prevent 'priority starvation' where low-priority tasks wait indefinitely in a priority queue?",
        objective: "Identify scheduling mitigation.",
        hint: "Dynamically boost (age) the priority of tasks that have been waiting in the queue for a long time.",
        xpReward: 65,
        pointsReward: 30,
        data: { options: ["Constantly wipe the queue", "Dynamic Priority Aging based on wait time", "Enforce equal priority for all", "Execute tasks in alphabetical order"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 5,
    name: "K Largest Elements",
    topic: "Streaming Filtering Engines",
    bossName: "Colossus Filter",
    bossTitle: "Bulk Sieve Director",
    bossAvatar: "🛡️",
    bossMaxHP: 145,
    bossDialogueGreeting: "Millions of items flow like sand in my streams! Sieve them down to the premium top-K candidates instantly, or find yourself buried in raw un-sorted dust!",
    bossDialogueDefeated: "Top-K streaming channels stabilized. Memory bound to O(K) space.",
    rewardAchievementId: "heap_lvl5",
    rewardAchievementName: "Bulk Filterer",
    problems: [
      {
        id: "k_largest_optimal_heap",
        title: "Optimal Heap Choice for Top-K",
        type: "klargest",
        description: "To find the K largest elements in a streaming array of size N (where N >> K), which heap type should you maintain to achieve O(N log K) time and O(K) space?",
        objective: "Select optimal heap design.",
        hint: "We want a heap of size K. If a streaming element is larger than the smallest element in our candidate set (the root), we swap it. The smallest candidate is tracked at the root of a Min-Heap.",
        xpReward: 60,
        pointsReward: 35,
        data: { options: ["A Max-Heap of size N", "A Min-Heap of size K", "A Max-Heap of size K", "A Min-Heap of size N"], correctIdx: 1 }
      },
      {
        id: "k_largest_space_complexity",
        title: "Streaming Space Constraints",
        type: "klargest",
        description: "Why is maintaining a Min-Heap of size K superior to sorting the entire array of size N to find the top K elements?",
        objective: "Evaluate space-time streaming trade-offs.",
        hint: "Sorting takes O(N log N) time and O(N) memory. The heap approach takes O(N log K) time and only O(K) memory, which is ideal for infinite streams.",
        xpReward: 65,
        pointsReward: 35,
        data: { options: ["Heap sorting is always faster than O(N)", "It reduces auxiliary space to O(K) and time to O(N log K) instead of full O(N log N)", "It guarantees stable sorting", "Min-heaps automatically encrypt the data"], correctIdx: 1 }
      },
      {
        id: "k_largest_insertion_rule",
        title: "Top-K Insertion Rules",
        type: "klargest",
        description: "When processing a new stream item 'x' against a Min-Heap of size K representing the K largest elements so far, what is the action rule?",
        objective: "Choose the stream filtering criteria.",
        hint: "If x > root value, pop the root and insert x. Otherwise, ignore x.",
        xpReward: 70,
        pointsReward: 35,
        data: { options: ["If x < root, insert x", "If x > root, extract root and insert x", "Always insert x and double heap size", "Delete the entire heap"], correctIdx: 1 }
      },
      {
        id: "quickselect_vs_heap",
        title: "QuickSelect vs Heap top-K",
        type: "klargest",
        description: "In non-streaming, static datasets, QuickSelect achieves O(N) average time to find the K-th largest item. Why is the Heap method still preferred for live network streams?",
        objective: "Distinguish static vs stream algorithms.",
        hint: "QuickSelect requires full random access to the entire dataset at once (static array) and cannot handle live incoming network streams.",
        xpReward: 75,
        pointsReward: 35,
        data: { options: ["QuickSelect takes O(N^2) space", "QuickSelect requires holding all data in memory and cannot operate on continuous live streams", "Heaps are always mathematically faster", "QuickSelect is a fake algorithm"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 6,
    name: "Running Median Finder",
    topic: "Dual Heap Balancers",
    bossName: "Grand Inquisitor",
    bossTitle: "Master of Castle Balance",
    bossAvatar: "👑",
    bossMaxHP: 165,
    bossDialogueGreeting: "I stand on the needle point of absolute equilibrium! Balance a Max-Heap against a Min-Heap perfectly. Let the median point shine at the roots, or witness the fortress collapse into chaos!",
    bossDialogueDefeated: "Dual heap median balancer operating perfectly. You are the Grand Lord of Heap Castle!",
    rewardAchievementId: "heap_lvl6",
    rewardAchievementName: "Grand Lord of Heaps",
    problems: [
      {
        id: "median_dual_heaps",
        title: "Dual Heap Median Model",
        type: "median",
        description: "To find the running median of a streaming dataset in O(1) access time, we split the elements into two halves. Which heap types represent the lower half and upper half respectively?",
        objective: "Analyze dual heap configurations.",
        hint: "We want the largest of the small half (Max-Heap) and the smallest of the large half (Min-Heap) to meet at the center.",
        xpReward: 80,
        pointsReward: 50,
        data: { options: ["Min-Heap for lower, Max-Heap for upper", "Max-Heap for lower, Min-Heap for upper", "Two Min-Heaps", "Two Max-Heaps"], correctIdx: 1 }
      },
      {
        id: "median_balance_condition",
        title: "Dual Heap Size Balancing",
        type: "median",
        description: "To correctly compute the median from dual heaps, the absolute difference in size between the Max-Heap and Min-Heap must not exceed what value?",
        objective: "Define the size balance constraint.",
        hint: "The size difference must be at most 1 element. If one gets too large, we poll from it and push to the other.",
        xpReward: 85,
        pointsReward: 50,
        data: { options: ["0 elements", "1 element", "K elements", "N / 2 elements"], correctIdx: 1 }
      },
      {
        id: "median_calculation_formula",
        title: "Retrieving the Median",
        type: "median",
        description: "If the total number of elements processed is EVEN, and the Max-Heap (lower half) and Min-Heap (upper half) are equal in size, how is the median calculated?",
        objective: "Select the even median math formula.",
        hint: "Average the roots of both heaps.",
        xpReward: 95,
        pointsReward: 50,
        data: { options: ["The root of the Max-Heap", "The root of the Min-Heap", "The average of the roots of both heaps", "The sum of all elements divided by N"], correctIdx: 2 }
      }
    ]
  }
];

export default function HeapCastleQuest({ profile, onUpdateProfile, onBackToMenu, onCompleteSector }: HeapCastleQuestProps) {
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

  // Dynamic interactive options
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

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
    setConsoleLogs([
      `[HEAP FORTRESS] Sector active: Level ${lvl.id} - ${lvl.name}`, 
      `[SENTRY] Commander ${lvl.bossName} in position.`
    ]);
  }, [activeLevelIdx]);

  // Sync Problem selection
  useEffect(() => {
    const prob = selectedLevel.problems[activeProblemIdx];
    if (prob) {
      setShowHint(false);
      setSelectedIdx(null);
      setConsoleLogs(prev => [...prev, `[LOG] Loading heap parameters for task: ${prob.title}`]);
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

    if (selectedIdx === null) {
      setConsoleLogs(prev => [...prev, "⚠️ No sift parameter chosen! Define element movement."]);
      playSound('error');
      return;
    }

    let success = false;
    let feedback = '';

    if (selectedIdx === prob.data.correctIdx) {
      success = true;
      feedback = `✅ Correct! Index/Heap parameter mapped: ${prob.data.options[selectedIdx]}`;
    } else {
      feedback = `❌ Heap property violated. Gravitational forces collapsed! Try again.`;
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
          setCurrentDialogue("Curse your logarithmic speed! My shields cracked!");
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
              description: `Conquered Level ${selectedLevel.id} of the Heap Castle by proving dynamic heap allocation mastery.`,
              isUnlocked: true,
              ratingValue: 160 + selectedLevel.id * 12
            }
          ];

      onUpdateProfile({
        points: profile.points + 160 + selectedLevel.id * 12,
        achievements: finalAchievements
      });

      setNewAchievement(selectedLevel.rewardAchievementName);
      playSound('win');
    }

    const totalLvlSolved = QUEST_LEVELS.filter(l => 
      l.problems.every(p => solvedProblemIds.includes(p.id))
    ).length;

    if (totalLvlSolved === 6) {
      setConsoleLogs(prev => [...prev, "🚨 SECTOR CONQUEST SECURED! HEAP CASTLE IS COMPLETELY MASTERED!"]);
      setTimeout(() => {
        onCompleteSector();
      }, 3000);
    }
  };

  const prob = selectedLevel.problems[activeProblemIdx];

  return (
    <div className="bg-[#0b0804] border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-mono text-slate-200 w-full">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.8)]" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-950/40">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">
              HEAP CASTLE: BALANCED PRIORITY
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
            6 Levels • 21 Heap Mechanics Problems • Sifting & Median Finding Filters
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl text-xs flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>CREDITS: <b className="text-amber-400">{profile.points}</b></span>
          </div>

          <button
            onClick={() => { playSound('powerdown'); onBackToMenu(); }}
            className="px-4 py-1.5 bg-slate-950 border border-amber-900/40 hover:border-amber-500/80 text-amber-300 text-xs font-bold rounded-xl transition-all"
          >
            ← LEAVE CASTLE
          </button>
        </div>
      </div>

      {/* LEVEL SELECTION RAIL */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {QUEST_LEVELS.map((lvl, index) => {
          const isSelected = activeLevelIdx === index;
          const isCleared = lvl.problems.every(p => solvedProblemIds.includes(p.id));
          return (
            <button
              key={lvl.id}
              onClick={() => handleLevelSelect(index)}
              className={`relative p-2.5 rounded-xl border text-center transition-all ${
                isSelected 
                  ? 'bg-amber-950/30 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)] text-amber-200' 
                  : isCleared
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-300 hover:bg-amber-950/30'
                  : 'bg-slate-905/30 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300'
              }`}
            >
              <div className="text-[9px] text-slate-400 uppercase font-black">L{lvl.id} - {lvl.name}</div>
              {isCleared && <CheckCircle2 className="w-3 h-3 text-amber-400 absolute top-1.5 right-1.5" />}
            </button>
          );
        })}
      </div>

      {/* MAIN GAMEPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PROBLEM DESCRIPTOR */}
          <div className="bg-[#080503] border border-amber-950/80 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="px-2 py-0.5 bg-amber-950 text-amber-400 rounded text-[9px] uppercase font-bold tracking-widest">
                Sift Step {activeProblemIdx + 1} of {selectedLevel.problems.length}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                REWARD: +{prob?.xpReward} XP / +{prob?.pointsReward} Credits
              </span>
            </div>

            <h3 className="text-base font-black text-white">{prob?.title}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{prob?.description}</p>
            
            <div className="mt-4 p-3 bg-amber-950/10 border border-amber-950 rounded-xl flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-amber-300 uppercase font-black block">Fortress Objective</span>
                <p className="text-xs text-amber-200 font-bold">{prob?.objective}</p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE STAGE */}
          <div className="bg-[#050302] border border-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] relative">
            <span className="absolute top-3 left-4 text-[9px] text-slate-500 uppercase font-bold tracking-widest">
              Live Sifting Array Emulator
            </span>

            {/* HIGH-END INTERACTIVE VECTOR DISPLAY */}
            <div className="w-full flex flex-col items-center justify-center gap-4 py-6">
              
              {/* HEAP ARRAY REPRESENTATION VISUAL */}
              <div className="flex flex-col items-center mb-4 p-4 bg-slate-950/80 border border-slate-900 rounded-xl w-full max-w-sm">
                <span className="text-[8px] text-slate-500 uppercase font-bold mb-2">Sequential Heap Memory Layout</span>
                <div className="flex items-center gap-1 w-full justify-center">
                  {[100, 80, 90, 40, 50, 70].map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-10 h-10 border border-amber-500/30 bg-amber-950/10 rounded flex items-center justify-center text-amber-400 font-bold text-xs">
                        {val}
                      </div>
                      <span className="text-[8px] text-slate-600 mt-1">[{idx}]</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* OPTIONS MATRIX */}
              <div className="flex flex-col gap-2.5 w-full max-w-md">
                {prob?.data.options?.map((opt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                    className={`p-3 border rounded-xl font-mono text-xs font-bold text-left flex justify-between items-center transition-all ${
                      selectedIdx === idx
                        ? 'bg-amber-950/40 border-amber-500 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedIdx === idx ? 'border-amber-400 bg-amber-400 text-[#0b0804]' : 'border-slate-800'
                    }`}>
                      {selectedIdx === idx && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                ))}
              </div>

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
                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>COMPILE & SIFFE</span>
              </button>

              {solvedProblemIds.includes(prob?.id) && (
                <button
                  onClick={handleNextProblem}
                  className="px-4 py-2.5 bg-amber-950 border border-amber-500/40 text-amber-300 hover:border-amber-500 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <span>NEXT SFT</span>
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
                  <span className="text-xs font-black text-yellow-300 block uppercase tracking-wider">Castle Scholar Tip:</span>
                  <p className="text-xs text-yellow-200/90 mt-1 leading-relaxed">{prob?.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: BOSS & ENVIRONMENT FEEDBACK */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* BOSS BATTLE SCREEN */}
          <div className="bg-gradient-to-b from-slate-950 to-[#0c0802] border border-amber-950 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-glow opacity-5 pointer-events-none" />

            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-900/60">
              <span className="text-3xl animate-bounce">{selectedLevel.bossAvatar}</span>
              <div>
                <h4 className="text-sm font-black text-white">{selectedLevel.bossName}</h4>
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{selectedLevel.bossTitle}</p>
              </div>
            </div>

            {/* BOSS HP BAR */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[10px] font-black text-slate-400">
                <span>FORTRESS SHIELDS</span>
                <span className={bossHP < 30 ? 'text-red-400 animate-pulse' : 'text-amber-400'}>
                  {bossHP} / {selectedLevel.bossMaxHP} HP
                </span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
                <motion.div 
                  className={`h-full rounded-full ${bossHP < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-yellow-500'}`}
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
            <div className="mt-4 p-3 bg-amber-950/10 border border-amber-950/40 rounded-xl relative">
              <div className="absolute top-2 left-4 w-2 h-2 bg-amber-950/10 rotate-45 transform -translate-y-4" />
              <p className="text-xs text-amber-300 italic leading-relaxed">
                "{currentDialogue}"
              </p>
            </div>
          </div>

          {/* COMPILER STREAM LOGS */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 h-[240px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                Dynamic Memory Bus
              </span>
              <button 
                onClick={() => setConsoleLogs([`[HEAP FORTRESS] Logs cleared.`])}
                className="text-[8px] hover:text-white text-slate-600 font-bold"
              >
                RESET BUS
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 text-[10px] font-mono scrollbar-thin">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className={
                  log.startsWith('✅') 
                    ? 'text-amber-400 font-bold' 
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
            className="fixed bottom-6 right-6 bg-[#0c0803] border-2 border-amber-500/80 rounded-2xl p-5 shadow-[0_0_30px_rgba(245,158,11,0.4)] z-50 flex items-center gap-4 max-w-sm"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-2xl animate-spin-slow">
              🏆
            </div>
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest block">Achievement Unlocked!</span>
              <h5 className="text-sm font-black text-white">{newAchievement}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">Defeated the local sector threat in Heap Castle.</p>
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
