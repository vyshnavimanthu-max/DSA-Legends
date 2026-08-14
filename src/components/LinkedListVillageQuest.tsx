import React, { useState, useEffect } from 'react';
import { 
  Shield, Award, Sparkles, HelpCircle, AlertCircle, 
  ChevronRight, Play, CheckCircle2, RotateCcw, Lightbulb, 
  Cpu, Flame, Lock, Unlock, Trophy, Send, RefreshCw, X, ArrowRight,
  Sliders, ArrowLeft, ArrowRightLeft, Layers, Columns, BarChart3, Link, GitCommit, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileState } from '../types';
import PremiumAudioManager from '../lib/audioManager';

interface LinkedListVillageQuestProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
  onCompleteSector: () => void;
}

export interface QuestProblem {
  id: string;
  title: string;
  type: 'concept' | 'insertion' | 'deletion' | 'reverse' | 'midpoint' | 'cycle' | 'merge_pal' | 'lru';
  description: string;
  objective: string;
  hint: string;
  xpReward: number;
  pointsReward: number;
  data: any; // Setup data (e.g. initial node configuration, targets, answers)
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
    name: "Traversing Node Chains",
    topic: "Linked List Traversal",
    bossName: "HeadPointer Guardian",
    bossTitle: "Sequential Access Watcher",
    bossAvatar: "🛡️",
    bossMaxHP: 100,
    bossDialogueGreeting: "I guard the entry point! Lose track of your head pointer and you shall drown in dereferenced null pointer voids!",
    bossDialogueDefeated: "Entry point verified. Traversal indices mapped flawlessly without memory leaks.",
    rewardAchievementId: "list_lvl1",
    rewardAchievementName: "Linked Pathfinder",
    problems: [
      {
        id: "list_head",
        title: "Identify the Head Node",
        type: "concept",
        description: "To read a singly-linked list, you must identify its unique entrance (the Head Node). Head points to the first value node, which in turn points to subsequent elements.",
        objective: "Select the Head Node (Value: 12) to begin the traversal stream.",
        hint: "The list flows as: 12 -> 45 -> 78 -> 99. The starting element is the Head Node.",
        xpReward: 30,
        pointsReward: 20,
        data: { list: [{ id: 'A', val: 12, next: 'B' }, { id: 'B', val: 45, next: 'C' }, { id: 'C', val: 78, next: 'D' }, { id: 'D', val: 99, next: null }], expectedId: 'A' }
      },
      {
        id: "list_traversal_count",
        title: "Traversal Hops Counter",
        type: "concept",
        description: "Given the list A(10) -> B(20) -> C(30) -> D(40) -> NULL, how many pointer jumps (hops) are needed to traverse from the Head Node to the final element before hitting NULL?",
        objective: "Enter the correct number of jumps.",
        hint: "Count the arrows: A to B is 1, B to C is 2, etc.",
        xpReward: 35,
        pointsReward: 20,
        data: { count: 3 }
      },
      {
        id: "list_node_val",
        title: "Node Access Query",
        type: "concept",
        description: "Determine the value of the node that is exactly 2 hops away from Head (at index 2). Remember, index 0 is the Head Node.",
        objective: "Select the correct node on the interactive map.",
        hint: "Head is index 0 (val 5). Index 1 is val 15. Index 2 is the node we want.",
        xpReward: 40,
        pointsReward: 20,
        data: { list: [{ id: '0', val: 5 }, { id: '1', val: 15 }, { id: '2', val: 25 }, { id: '3', val: 35 }], expectedIdx: 2 }
      }
    ]
  },
  {
    id: 2,
    name: "Point Insertion Protocols",
    topic: "Linked List Insertion",
    bossName: "Splice Constructor",
    bossTitle: "Heap Allocator Shaper",
    bossAvatar: "🧬",
    bossMaxHP: 110,
    bossDialogueGreeting: "You cannot simply overwrite memory! Splice new nodes with care or your list chain will snap!",
    bossDialogueDefeated: "Linked list successfully spliced! The nodes are perfectly contiguous.",
    rewardAchievementId: "list_lvl2",
    rewardAchievementName: "Splicer Master",
    problems: [
      {
        id: "insert_head",
        title: "Prepend to Head Node",
        type: "insertion",
        description: "Insert a new node containing value 99 at the head of the list 10 -> 20. Point new node's next pointer to the current head, then update the head pointer to the new node.",
        objective: "Click the Prepend option to update the head link.",
        hint: "The new head becomes 99, which then points to the old head 10.",
        xpReward: 40,
        pointsReward: 25,
        data: { oldList: [10, 20], newVal: 99, expectedList: [99, 10, 20] }
      },
      {
        id: "insert_tail",
        title: "Append to Tail Node",
        type: "insertion",
        description: "Append a new node containing value 50 to the end of the list. Identify which current pointer must be modified.",
        objective: "Select the tail node whose next pointer needs to change.",
        hint: "The last node (30) currently points to NULL. It must now point to the new node 50.",
        xpReward: 45,
        pointsReward: 25,
        data: { list: [10, 20, 30], targetVal: 30, insertVal: 50, expectedTailIdx: 2 }
      },
      {
        id: "insert_mid",
        title: "Intermediate Node Splicing",
        type: "insertion",
        description: "To insert a new node X between node A and node B, what is the correct order of pointer assignments to avoid losing the remaining nodes of the list?",
        objective: "Choose the correct pointer instruction ordering.",
        hint: "First point X.next = A.next (which is B), then point A.next = X. If we assign A.next first, we lose the link to B!",
        xpReward: 50,
        pointsReward: 25,
        data: { options: ["1. A.next = X; X.next = B", "2. X.next = A.next; A.next = X"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 3,
    name: "Pruning Nodes & Deletions",
    topic: "Linked List Deletion",
    bossName: "Nullifyer Spectre",
    bossTitle: "Memory Reclamation Spectre",
    bossAvatar: "🗑️",
    bossMaxHP: 120,
    bossDialogueGreeting: "To delete is to sever connections! If you do not reconnect the adjacent links, your nodes will be swept away by garbage collection!",
    bossDialogueDefeated: "Linked list pruned. Unused elements successfully reclaimed without causing orphaned segments.",
    rewardAchievementId: "list_lvl3",
    rewardAchievementName: "Pruner of Links",
    problems: [
      {
        id: "delete_head",
        title: "Shift Head Pointer",
        type: "deletion",
        description: "To delete the first element of the list (Head containing value 8), we move the head pointer forward. What is the value of the new head node?",
        objective: "Input the new head value.",
        hint: "Head currently points to 8, whose next points to 15. Shifting head to head.next makes 15 the new head.",
        xpReward: 50,
        pointsReward: 30,
        data: { list: [8, 15, 22, 35], expectedNewHead: 15 }
      },
      {
        id: "delete_by_value",
        title: "Bypass Middle Node",
        type: "deletion",
        description: "In the list 1 -> 99 -> 3, node 99 has become corrupt. Set the next pointer of node 1 directly to node 3 to bypass and effectively delete 99.",
        objective: "Select node 1 to link to node 3.",
        hint: "Bypointing Node 1's next directly to Node 3, we leave 99 with no incoming references so it gets garbage collected.",
        xpReward: 55,
        pointsReward: 30,
        data: { list: [{ id: '1', val: 1, next: '99' }, { id: '99', val: 99, next: '3' }, { id: '3', val: 3, next: null }], expectedNext: '3' }
      },
      {
        id: "delete_tail",
        title: "Sever Tail Pointers",
        type: "deletion",
        description: "To delete the final node (40) from 10 -> 20 -> 30 -> 40, identify the node whose next pointer must be updated to NULL.",
        objective: "Click on the node that will become the new tail.",
        hint: "The second-to-last node is 30. Its next must point to NULL.",
        xpReward: 60,
        pointsReward: 30,
        data: { list: [10, 20, 30, 40], expectedTailIdx: 2 }
      }
    ]
  },
  {
    id: 4,
    name: "Reversing the Flow",
    topic: "Linked List Reversal",
    bossName: "Inversion Overlord",
    bossTitle: "Arrow Direction Sorter",
    bossAvatar: "🔄",
    bossMaxHP: 130,
    bossDialogueGreeting: "I reverse temporal flows! Swap all arrow directionalities in-place or freeze in the recursive loop of yesterday!",
    bossDialogueDefeated: "Arrows flipped. Pointer flow runs backward perfectly without loss of integrity.",
    rewardAchievementId: "list_lvl4",
    rewardAchievementName: "Inversion Sorcerer",
    problems: [
      {
        id: "reverse_pointer_step",
        title: "In-Place Reversal Step",
        type: "reverse",
        description: "During an iterative reversal of list node A -> B -> C, we flip the links one-by-one. When reversing the first link, what should node A's next pointer point to?",
        objective: "Select the target of A's next pointer after the first step.",
        hint: "The head element A has no previous nodes, so its next pointer must point to NULL to become the new tail.",
        xpReward: 55,
        pointsReward: 35,
        data: { options: ["B", "NULL", "C"], correctIdx: 1 }
      },
      {
        id: "reverse_three_pointers",
        title: "Three Reversal Iterators",
        type: "reverse",
        description: "To safely reverse a singly linked list in a single traversal, we must track three reference points in each step. Which are they?",
        objective: "Identify the missing reference variable: prev, curr, and ________.",
        hint: "We need the next node (next/temp) to keep a reference to the remaining list before we overwrite current's next pointer.",
        xpReward: 60,
        pointsReward: 35,
        data: { options: ["head", "tail", "next", "mid"], correctIdx: 2 }
      },
      {
        id: "reverse_list_fully",
        title: "Reverse Full Chain",
        type: "reverse",
        description: "Reverse the link directions of the list 10 -> 20 -> 30 -> 40. Point out the value of the new head node.",
        objective: "Input the new head value after a full reverse operation.",
        hint: "Reversing 10 -> 20 -> 30 -> 40 produces 40 -> 30 -> 20 -> 10. The new head is 40.",
        xpReward: 65,
        pointsReward: 35,
        data: { list: [10, 20, 30, 40], expectedNewHead: 40 }
      },
      {
        id: "reverse_subsegment",
        title: "Reverse a Sub-segment",
        type: "reverse",
        description: "Given the list 1 -> 2 -> 3 -> 4 -> 5, reverse ONLY the portion between node 2 and 4. What is the state of the list after this partial reversal?",
        objective: "Choose the correct resulting list state.",
        hint: "Nodes 2, 3, 4 are reversed to 4, 3, 2. The outer nodes remain untouched: 1 -> 4 -> 3 -> 2 -> 5.",
        xpReward: 70,
        pointsReward: 35,
        data: { options: ["1 -> 4 -> 3 -> 2 -> 5", "1 -> 2 -> 4 -> 3 -> 5", "5 -> 4 -> 3 -> 2 -> 1"], correctIdx: 0 }
      }
    ]
  },
  {
    id: 5,
    name: "Midpoint & Tortoise/Hare",
    topic: "Two Pointers Technique",
    bossName: "Slow & Fast Twin Spectres",
    bossTitle: "Dynamic Velocity Pacer",
    bossAvatar: "🐇",
    bossMaxHP: 140,
    bossDialogueGreeting: "Speed is relative! While the Hare leaps twice as fast, the slow Tortoise lands precisely at the half-way threshold.",
    bossDialogueDefeated: "Midpoint captured. Relative pace pointer invariants resolved correctly.",
    rewardAchievementId: "list_lvl5",
    rewardAchievementName: "Pace Coordinator",
    problems: [
      {
        id: "mid_node_odd",
        title: "Odd-Length Midpoint",
        type: "midpoint",
        description: "Find the middle node of list: 1 -> 2 -> 3 -> 4 -> 5. If slow pointer moves 1 node at a time, and fast pointer moves 2 nodes, select the value where slow lands when fast reaches the end.",
        objective: "Click the node where slow pointer lands.",
        hint: "Slow advances to 1, 2, then 3. Meanwhile, Fast advances to 1, 3, then 5 (end). Slow lands at 3.",
        xpReward: 60,
        pointsReward: 40,
        data: { list: [1, 2, 3, 4, 5], expectedMidVal: 3 }
      },
      {
        id: "mid_node_even",
        title: "Even-Length Midpoint",
        type: "midpoint",
        description: "For an even-length list: 10 -> 20 -> 30 -> 40 -> 50 -> 60, finding the middle using tortoise/hare lands the slow pointer at which second-middle node?",
        objective: "Select the second-middle node value.",
        hint: "Even list has two middles: 30 and 40. The standard fast/slow algorithm returns the second middle (40) because fast reaches NULL.",
        xpReward: 65,
        pointsReward: 40,
        data: { list: [10, 20, 30, 40, 50, 60], expectedMidVal: 40 }
      },
      {
        id: "tortoise_hare_hop",
        title: "Pointer Location Math",
        type: "midpoint",
        description: "In a fast and slow pointer traversal, if the slow pointer is at index 3 of a long list, what index is the fast pointer currently examining?",
        objective: "Enter the index of the fast pointer.",
        hint: "Fast pointer moves at exactly double the speed of slow: Index = 2 * slow_index = 2 * 3 = 6.",
        xpReward: 70,
        pointsReward: 40,
        data: { expectedIdx: 6 }
      },
      {
        id: "nth_node_from_end",
        title: "Nth Node from end of list",
        type: "midpoint",
        description: "To locate the N-th node from the end in a single pass, we initialize a fast pointer N steps ahead. If N = 2, and the list is 10 -> 20 -> 30 -> 40, what is the value of the target node?",
        objective: "Choose the value of the 2nd node from the end.",
        hint: "Counting from the end: 40 is 1st from end, 30 is 2nd from end.",
        xpReward: 75,
        pointsReward: 40,
        data: { list: [10, 20, 30, 40], n: 2, expectedVal: 30 }
      }
    ]
  },
  {
    id: 6,
    name: "Cycle Detection Invariants",
    topic: "Floyd's Cycle-Finding Algorithm",
    bossName: "Infinite Loop Daemon",
    bossTitle: "Recursion Loop Overlord",
    bossAvatar: "🌀",
    bossMaxHP: 150,
    bossDialogueGreeting: "A list without an end is an eternity. Walk my cyclic paths forever or detect the recursion intersection!",
    bossDialogueDefeated: "Infinite cycle detected. Traversal loop broken and memory reference freed.",
    rewardAchievementId: "list_lvl6",
    rewardAchievementName: "Infinite Cycle Breaker",
    problems: [
      {
        id: "cycle_detect_bool",
        title: "Loop Detection Check",
        type: "cycle",
        description: "Given a node list setup where A -> B -> C -> D -> B (D points back to B), is this list cyclic?",
        objective: "Select True or False.",
        hint: "Because D points back to B, traveling past D returns us to B. This is an infinite cyclic list.",
        xpReward: 65,
        pointsReward: 45,
        data: { expectedCyclic: true }
      },
      {
        id: "cycle_start_node",
        title: "Locate Cycle Entry Node",
        type: "cycle",
        description: "Given a cyclic list A -> B -> C -> D -> B, identify which specific node is the entry point (first node revisited during traversal).",
        objective: "Select the cycle starting node on the interactive diagram.",
        hint: "The link from D points back to B, making B the cycle starter.",
        xpReward: 75,
        pointsReward: 45,
        data: { list: ['A', 'B', 'C', 'D'], entry: 'B' }
      },
      {
        id: "cycle_detect_proof",
        title: "Convergence Assurance",
        type: "cycle",
        description: "Why is the slow pointer guaranteed to meet the fast pointer in a cyclic list instead of slipping past?",
        objective: "Select the mathematically correct reason.",
        hint: "In each step, the distance between slow and fast pointers decreases by exactly 1. Thus, they must eventually meet.",
        xpReward: 80,
        pointsReward: 45,
        data: { options: ["Fast moves 3x faster", "The distance decreases by 1 in each step", "Slow pointer stops in the cycle"], correctIdx: 1 }
      },
      {
        id: "cycle_length",
        title: "Loop Period Count",
        type: "cycle",
        description: "Once the slow pointer meets the fast pointer inside a loop A -> B -> C -> B, we can count the cycle length by holding one pointer static and moving the other until they meet again. What is the node length of the cycle in A -> B -> C -> D -> B?",
        objective: "Enter the cycle node count.",
        hint: "The cyclic portion consists of nodes B, C, and D. So length is 3.",
        xpReward: 85,
        pointsReward: 45,
        data: { expectedLength: 3 }
      }
    ]
  },
  {
    id: 7,
    name: "Merging & Palindromes",
    topic: "List Combination & Reflection",
    bossName: "Symmetric Harmonizer",
    bossTitle: "Symmetric Structurer",
    bossAvatar: "⚖️",
    bossMaxHP: 160,
    bossDialogueGreeting: "Harmony is symmetry. Can you merge divergent paths while preserving ascending sort, or verify if the tail is a reflection of the head?",
    bossDialogueDefeated: "Nodes aligned symmetrically. Merged nodes remain sorted and palindromes confirmed.",
    rewardAchievementId: "list_lvl7",
    rewardAchievementName: "Harmonious Merger",
    problems: [
      {
        id: "merge_two_sorted",
        title: "Merge Two Sorted Lists",
        type: "merge_pal",
        description: "Combine sorted list L1: 1 -> 3 and L2: 2 -> 4 into a single sorted list. What is the merged sequence?",
        objective: "Enter the sorted sequence separating elements with commas (e.g., 1,2,3,4).",
        hint: "Compare head elements, take smaller first, step by step: 1 -> 2 -> 3 -> 4.",
        xpReward: 75,
        pointsReward: 50,
        data: { l1: [1, 3], l2: [2, 4], expectedSeq: "1,2,3,4" }
      },
      {
        id: "palindrome_linked_list",
        title: "Palindrome Verification",
        type: "merge_pal",
        description: "Does the linked list 1 -> 2 -> 2 -> 1 read the same backwards and forwards?",
        objective: "Select True or False.",
        hint: "The sequence 1, 2, 2, 1 read from tail is also 1, 2, 2, 1. So it is a palindrome.",
        xpReward: 85,
        pointsReward: 50,
        data: { list: [1, 2, 2, 1], expectedPalindrome: true }
      },
      {
        id: "intersect_lists",
        title: "List Intersection Node",
        type: "merge_pal",
        description: "Two lists L1: 1 -> 2 -> 3 -> 4 and L2: 9 -> 3 -> 4 intersect. Identify the intersection node value where they merge.",
        objective: "Choose the intersecting value node.",
        hint: "The lists merge at node value 3, sharing the subsegment 3 -> 4.",
        xpReward: 95,
        pointsReward: 50,
        data: { expectedIntersect: 3 }
      }
    ]
  },
  {
    id: 8,
    name: "Advanced Cache & LRU",
    topic: "Doubly Linked List Applications",
    bossName: "Cache Overlord LRU",
    bossTitle: "Eviction Decision Daemon",
    bossAvatar: "💾",
    bossMaxHP: 180,
    bossDialogueGreeting: "My cache has finite capacity! If an entry is requested, bubble it to the head of the DLL. If full, evict the least recently used element from the tail!",
    bossDialogueDefeated: "Cache invariants satisfied. O(1) latency accomplished on hash keys and dynamic doubly linked links.",
    rewardAchievementId: "list_lvl8",
    rewardAchievementName: "LRU Cache Architect",
    problems: [
      {
        id: "dll_nodes",
        title: "Doubly Linked List Structure",
        type: "lru",
        description: "How does a Doubly Linked List (DLL) node differ from a Singly Linked List node?",
        objective: "Select the correct structure attribute of a DLL node.",
        hint: "Singly nodes contain 'val' and 'next'. Doubly nodes also contain a 'prev' pointer pointing back to the predecessor.",
        xpReward: 80,
        pointsReward: 60,
        data: { options: ["Only has 'next' pointer", "Has both 'next' and 'prev' pointers", "Does not contain a value slot"], correctIdx: 1 }
      },
      {
        id: "lru_evict",
        title: "LRU Eviction Protocol",
        type: "lru",
        description: "Given LRU cache with capacity = 2. Operations: Put A, Put B, Get A, Put C. Which item is evicted when C is inserted?",
        objective: "Enter the evicted key (A, B, or C).",
        hint: "Put A, B: cache has [B, A] (B is newest). Get A: A is accessed, moves to front -> [A, B]. Put C: capacity exceeded, evict tail (B) -> [C, A]. B is evicted.",
        xpReward: 95,
        pointsReward: 60,
        data: { expectedEvicted: "B" }
      },
      {
        id: "lru_bubble",
        title: "Bubble Accessed Element",
        type: "lru",
        description: "In DLL cache sequence: Head <-> A <-> B <-> C <-> Tail. If B is accessed via 'Get(B)', where should it be moved?",
        objective: "Choose the target position for accessed element B.",
        hint: "LRU updates the access status of B. B must be moved to the head (most recently used) position.",
        xpReward: 105,
        pointsReward: 60,
        data: { options: ["To the Head of the DLL", "Keep at same position", "To the Tail of the DLL"], correctIdx: 0 }
      },
      {
        id: "lru_hashmap_dll_relation",
        title: "LRU Time Complexity Dual",
        type: "lru",
        description: "Why does an LRU Cache combine a HashMap with a Doubly Linked List?",
        objective: "Identify the dual complexity benefit.",
        hint: "HashMap provides O(1) key lookups, while DLL provides O(1) node additions and removals from head/tail.",
        xpReward: 115,
        pointsReward: 60,
        data: { options: ["Provides sorting and encryption", "Enables O(1) lookup and O(1) node reordering", "Provides thread-safe atomic operations"], correctIdx: 1 }
      }
    ]
  }
];

export default function LinkedListVillageQuest({ profile, onUpdateProfile, onBackToMenu, onCompleteSector }: LinkedListVillageQuestProps) {
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

  // Dynamic interactive problem states
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [selectedBoolean, setSelectedBoolean] = useState<boolean | null>(null);

  // Reversal pointer flow simulation
  const [reversedPointers, setReversedPointers] = useState<{ [key: string]: string | null }>({});

  // Fast/Slow pointer indexes
  const [slowIdx, setSlowIdx] = useState<number>(0);
  const [fastIdx, setFastIdx] = useState<number>(0);

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
    setConsoleLogs([`[MAINFRAME] Connection secure: ${lvl.name} Segment.`, `[SENTRY] ${lvl.bossName} threat vector identified.`]);
  }, [activeLevelIdx]);

  // Sync Problem selection
  useEffect(() => {
    const prob = selectedLevel.problems[activeProblemIdx];
    if (prob) {
      setShowHint(false);
      setSelectedNodeId(null);
      setSelectedIdx(null);
      setTextAnswer('');
      setSelectedBoolean(null);

      // Setup dynamic states
      if (prob.id === 'reverse_list_fully') {
        const initialFlow: { [key: string]: string | null } = { '10': '20', '20': '30', '30': '40', '40': null };
        setReversedPointers(initialFlow);
      } else if (prob.type === 'midpoint') {
        setSlowIdx(0);
        setFastIdx(0);
      }

      setConsoleLogs(prev => [...prev, `[SENTRY] Decrypting Challenge ${activeProblemIdx + 1}: ${prob.title}`]);
    }
  }, [activeProblemIdx, selectedLevel]);

  // Handle Level click
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

  // INTERACTIVE VERIFICATION SYSTEM
  const handleVerifyProblem = () => {
    const prob = selectedLevel.problems[activeProblemIdx];
    if (!prob) return;

    let success = false;
    let feedback = '';

    switch(prob.id) {
      case 'list_head':
        if (selectedNodeId === prob.data.expectedId) {
          success = true;
          feedback = "✅ Head Node verified! Entry vector unlocked.";
        } else {
          feedback = "❌ Incorrect node selected. Head node holds value 12 and has no incoming pointers.";
        }
        break;
      case 'list_traversal_count':
        if (parseInt(textAnswer) === prob.data.count) {
          success = true;
          feedback = `✅ Correct! Exactly ${prob.data.count} jumps are needed.`;
        } else {
          feedback = `❌ Incorrect jump count. Try tracing the list arrows sequentially.`;
        }
        break;
      case 'list_node_val':
        if (selectedIdx === prob.data.expectedIdx) {
          success = true;
          feedback = "✅ Node selected successfully! Value 25 is exactly 2 hops away from Head.";
        } else {
          feedback = "❌ Index mismatch. Trace exactly 2 links starting from the Head Node.";
        }
        break;
      case 'insert_head':
        if (selectedIdx === 0) { // prepend chosen
          success = true;
          feedback = "✅ Spliced new node to head! Chain structure updated: 99 -> 10 -> 20.";
        } else {
          feedback = "❌ Select the Prepend operation to put node 99 before 10.";
        }
        break;
      case 'insert_tail':
        if (selectedIdx === prob.data.expectedTailIdx) {
          success = true;
          feedback = "✅ Tail node set! Tail node now points to 50 instead of NULL.";
        } else {
          feedback = "❌ Wrong node selected. Select the node holding 30 to update its next pointer.";
        }
        break;
      case 'insert_mid':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Splice order correct! First bridge to next, then redirect original.";
        } else {
          feedback = "❌ Wrong order! If you redirect A's next pointer first, you lose the reference to B.";
        }
        break;
      case 'delete_head':
        if (parseInt(textAnswer) === prob.data.expectedNewHead) {
          success = true;
          feedback = "✅ Correct! Head node moved forward. 15 is the new head.";
        } else {
          feedback = "❌ Incorrect value. If 8 is deleted, head advances to its next node.";
        }
        break;
      case 'delete_by_value':
        if (selectedNodeId === prob.data.expectedNext) {
          success = true;
          feedback = "✅ Node 1 re-routed to Node 3. Corrupt Node 99 has been bypassed!";
        } else {
          feedback = "❌ Reroute failed. Select node 3 to link Node 1's next directly to Node 3.";
        }
        break;
      case 'delete_tail':
        if (selectedIdx === prob.data.expectedTailIdx) {
          success = true;
          feedback = "✅ Tail pruned! Node 30's next is now NULL.";
        } else {
          feedback = "❌ Select node 30 to make it the new tail of the list.";
        }
        break;
      case 'reverse_pointer_step':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Correct! Old head A must now point to NULL (becoming the new tail).";
        } else {
          feedback = "❌ Incorrect. To reverse, A.next must point backwards to its previous element (NULL).";
        }
        break;
      case 'reverse_three_pointers':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Three pointer iterators aligned: prev, curr, and next!";
        } else {
          feedback = "❌ Incorrect. You need 'next' to keep track of the remaining list chain.";
        }
        break;
      case 'reverse_list_fully':
        if (parseInt(textAnswer) === prob.data.expectedNewHead) {
          success = true;
          feedback = "✅ Correct! Reversing the chain makes the tail 40 the new head.";
        } else {
          feedback = "❌ Mismatch. Check the final head node value of the reversed chain.";
        }
        break;
      case 'reverse_subsegment':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Subsegment successfully reversed in-place!";
        } else {
          feedback = "❌ Mismatch. Check the indices of reversed segment [2, 3, 4] inside 1..5.";
        }
        break;
      case 'mid_node_odd':
        if (selectedIdx === 2) { // 3 selected
          success = true;
          feedback = "✅ Slow pointer lands perfectly on 3 when Fast reaches 5 (end).";
        } else {
          feedback = "❌ Incorrect slow pointer landing index. Trace both speeds step by step.";
        }
        break;
      case 'mid_node_even':
        if (selectedIdx === 3) { // 40 selected
          success = true;
          feedback = "✅ Second-middle node 40 returned successfully!";
        } else {
          feedback = "❌ Incorrect node. Tortoise/Hare algorithm returns 40 for even list sizes.";
        }
        break;
      case 'tortoise_hare_hop':
        if (parseInt(textAnswer) === prob.data.expectedIdx) {
          success = true;
          feedback = `✅ Math matches! Fast pointer is at index ${prob.data.expectedIdx}.`;
        } else {
          feedback = "❌ Double the speed of slow. Calculate again.";
        }
        break;
      case 'nth_node_from_end':
        if (selectedIdx === 2) { // value 30
          success = true;
          feedback = "✅ Selected correctly! 30 is the second node from the end.";
        } else {
          feedback = "❌ Incorrect node. Trace from tail (40) backward to the 2nd node.";
        }
        break;
      case 'cycle_detect_bool':
        if (selectedBoolean === prob.data.expectedCyclic) {
          success = true;
          feedback = "✅ Correct! Loop found. Travel back to B is an infinite loop.";
        } else {
          feedback = "❌ Mismatch. Check if the flow points back to predecessor.";
        }
        break;
      case 'cycle_start_node':
        if (selectedNodeId === prob.data.entry) {
          success = true;
          feedback = "✅ Loop entry point isolated successfully at node B!";
        } else {
          feedback = "❌ Selection incorrect. B is the first node revisited.";
        }
        break;
      case 'cycle_detect_proof':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Correct! Relative speed difference is exactly 1, eliminating loops.";
        } else {
          feedback = "❌ Incorrect answer. Consider relative distance decrease.";
        }
        break;
      case 'cycle_length':
        if (parseInt(textAnswer) === prob.data.expectedLength) {
          success = true;
          feedback = "✅ Cycle length verified as 3 (B -> C -> D).";
        } else {
          feedback = "❌ Cycle node count mismatch.";
        }
        break;
      case 'merge_two_sorted':
        if (textAnswer.replace(/\s+/g, '') === prob.data.expectedSeq) {
          success = true;
          feedback = "✅ Lists sorted and combined flawlessly!";
        } else {
          feedback = "❌ Mismatch. Enter sequence like: 1,2,3,4";
        }
        break;
      case 'palindrome_linked_list':
        if (selectedBoolean === prob.data.expectedPalindrome) {
          success = true;
          feedback = "✅ Palindrome linked list verified!";
        } else {
          feedback = "❌ Palindrome check failed.";
        }
        break;
      case 'intersect_lists':
        if (selectedIdx === prob.data.expectedIntersect) {
          success = true;
          feedback = "✅ Intersection intersection node found at value 3!";
        } else {
          feedback = "❌ Mismatch. Node 3 is shared by both list streams.";
        }
        break;
      case 'dll_nodes':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ Doubly nodes contain predecessor link references (prev)!";
        } else {
          feedback = "❌ Incorrect. Look closely at DLL properties.";
        }
        break;
      case 'lru_evict':
        if (textAnswer.trim().toUpperCase() === prob.data.expectedEvicted) {
          success = true;
          feedback = "✅ Correct! B is the least recently used element and gets evicted.";
        } else {
          feedback = "❌ Eviction key mismatch. Check node access times.";
        }
        break;
      case 'lru_bubble':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ B is bubbled to the Head of DLL successfully!";
        } else {
          feedback = "❌ Mismatch. Accessed elements should be placed as newest (Head).";
        }
        break;
      case 'lru_hashmap_dll_relation':
        if (selectedIdx === prob.data.correctIdx) {
          success = true;
          feedback = "✅ O(1) constraints solved perfectly! Best of both worlds.";
        } else {
          feedback = "❌ Mismatch. Think about why lookups are fast (hash) and shifts are cheap (DLL).";
        }
        break;
      default:
        break;
    }

    setConsoleLogs(prev => [...prev, feedback]);

    if (success) {
      playSound('win');
      
      // HP damage
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
          setCurrentDialogue("Impudent node crawler! You managed to solve my link constraints!");
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
              description: `Cleared Level ${selectedLevel.id} of Linked List Village by defeating ${selectedLevel.bossName}`,
              isUnlocked: true,
              ratingValue: 100 + selectedLevel.id * 10
            }
          ];

      onUpdateProfile({
        points: profile.points + 100 + selectedLevel.id * 10,
        achievements: finalAchievements
      });

      setNewAchievement(selectedLevel.rewardAchievementName);
      playSound('win');
    }

    // Check if ALL 8 levels are completed to unlock the entire sector
    const totalLvlSolved = QUEST_LEVELS.filter(l => 
      l.problems.every(p => solvedProblemIds.includes(p.id))
    ).length;

    if (totalLvlSolved === 8) {
      setConsoleLogs(prev => [...prev, "🚨 SECTOR CLEARANCE RECEIVED! LINKED LIST VILLAGE HAS BEEN SECURED!"]);
      setTimeout(() => {
        onCompleteSector();
      }, 3000);
    }
  };

  const prob = selectedLevel.problems[activeProblemIdx];

  return (
    <div className="bg-[#080b16] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-mono text-slate-200 w-full">
      
      {/* Laser line header overlay */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 shadow-[0_0_20px_rgba(6,182,212,0.8)]" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-cyan-950/40">
        <div>
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-400">
              LINKED LIST VILLAGE: THE POINTER SECURE
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
            8 Levels • 28 Interactive Pointer Problems • Grid Node Security Protocol
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl text-xs flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>CREDITS: <b className="text-cyan-400">{profile.points}</b></span>
          </div>

          <button
            onClick={() => { playSound('powerdown'); onBackToMenu(); }}
            className="px-4 py-1.5 bg-slate-950 border border-cyan-900/40 hover:border-cyan-500/80 text-cyan-300 text-xs font-bold rounded-xl transition-all"
          >
            ← LEAVE VILLAGE
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
                  ? 'bg-cyan-950/30 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-cyan-200' 
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
        
        {/* LEFT COLUMN: PROBLEMS & CONTROL PANEL */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PROBLEM DESCRIPTOR TAB */}
          <div className="bg-[#05070e] border border-cyan-950/80 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="px-2 py-0.5 bg-cyan-950 text-cyan-400 rounded text-[9px] uppercase font-bold tracking-widest">
                Problem {activeProblemIdx + 1} of {selectedLevel.problems.length}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                REWARD: +{prob?.xpReward} XP / +{prob?.pointsReward} Credits
              </span>
            </div>

            <h3 className="text-base font-black text-white">{prob?.title}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{prob?.description}</p>
            
            <div className="mt-4 p-3 bg-cyan-950/10 border border-cyan-950 rounded-xl flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-cyan-300 uppercase font-black block">Mission Objective</span>
                <p className="text-xs text-cyan-200 font-bold">{prob?.objective}</p>
              </div>
            </div>
          </div>

          {/* DYNAMIC INTERACTIVE DIAGRAM STAGE */}
          <div className="bg-[#05070e] border border-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] relative">
            <span className="absolute top-3 left-4 text-[9px] text-slate-500 uppercase font-bold tracking-widest">
              Live Address Node Visualization
            </span>

            {/* Render specialized UI according to problem type */}
            <div className="w-full flex flex-wrap items-center justify-center gap-4 py-6">
              
              {/* LEVEL 1 & 2 & 3: BASIC LIST STRUCTURES */}
              {prob?.id === 'list_head' && (
                prob.data.list.map((node: any, idx: number) => (
                  <React.Fragment key={node.id}>
                    <button
                      onClick={() => { playSound('click'); setSelectedNodeId(node.id); }}
                      className={`p-4 border rounded-2xl flex flex-col items-center min-w-[70px] transition-all ${
                        selectedNodeId === node.id
                          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-[9px] text-slate-500">Node {node.id}</span>
                      <span className="text-base font-black mt-1">{node.val}</span>
                      <span className="text-[9px] text-yellow-500 mt-1 font-mono">Next: {node.next || 'NULL'}</span>
                    </button>
                    {idx < prob.data.list.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600" />}
                  </React.Fragment>
                ))
              )}

              {prob?.id === 'list_traversal_count' && (
                ['A(10)', 'B(20)', 'C(30)', 'D(40)'].map((nodeName, idx) => (
                  <React.Fragment key={nodeName}>
                    <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex flex-col items-center min-w-[70px]">
                      <span className="text-[9px] text-slate-500">Node</span>
                      <span className="text-sm font-black mt-1 text-cyan-300">{nodeName}</span>
                    </div>
                    {idx < 3 ? <ArrowRight className="w-4 h-4 text-yellow-500 animate-pulse" /> : <ArrowRight className="w-4 h-4 text-slate-600" />}
                  </React.Fragment>
                ))
              )}

              {prob?.id === 'list_node_val' && (
                prob.data.list.map((node: any, idx: number) => (
                  <React.Fragment key={node.id}>
                    <button
                      onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                      className={`p-4 border rounded-2xl flex flex-col items-center min-w-[70px] transition-all ${
                        selectedIdx === idx
                          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 scale-105'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[9px] text-slate-500">Index {idx}</span>
                      <span className="text-sm font-black mt-1">{node.val}</span>
                    </button>
                    {idx < prob.data.list.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600" />}
                  </React.Fragment>
                ))
              )}

              {prob?.id === 'insert_head' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-950/30 border border-yellow-500/50 text-yellow-300 rounded-xl flex flex-col items-center animate-bounce">
                      <span className="text-[8px] uppercase">New Node</span>
                      <span className="font-bold">99</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <div className="p-3 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl">10</div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <div className="p-3 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl">20</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => { playSound('click'); setSelectedIdx(0); }}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border ${selectedIdx === 0 ? 'bg-cyan-900/30 border-cyan-400 text-cyan-200' : 'bg-slate-900/60 border-slate-850 text-slate-400'}`}
                    >
                      Prepend 99 (X.next = Head; Head = X)
                    </button>
                    <button
                      onClick={() => { playSound('click'); setSelectedIdx(1); }}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border ${selectedIdx === 1 ? 'bg-red-900/30 border-red-500/50 text-red-200' : 'bg-slate-900/60 border-slate-850 text-slate-400'}`}
                    >
                      Append 99 (Tail.next = X)
                    </button>
                  </div>
                </div>
              )}

              {prob?.id === 'insert_tail' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    {prob.data.list.map((v: number, idx: number) => (
                      <React.Fragment key={v}>
                        <button
                          onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                          className={`p-4 border rounded-xl flex flex-col items-center min-w-[60px] ${
                            selectedIdx === idx 
                              ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 scale-105' 
                              : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-[9px] text-slate-500">Idx {idx}</span>
                          <span className="font-bold">{v}</span>
                        </button>
                        <ArrowRight className="w-4 h-4 text-slate-600" />
                      </React.Fragment>
                    ))}
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 rounded-xl flex flex-col items-center">
                      <span className="text-[8px]">New</span>
                      <span className="font-bold">50</span>
                    </div>
                  </div>
                </div>
              )}

              {prob?.id === 'insert_mid' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl text-center">
                      <span className="block text-[8px] text-slate-600">Node A</span>
                      <span className="font-bold">10</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <ArrowRight className="w-4 h-4 text-slate-600" />
                      <span className="text-[8px] text-red-500 line-through">Sever?</span>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl text-center">
                      <span className="block text-[8px] text-slate-600">Node B</span>
                      <span className="font-bold">20</span>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-950/30 border border-yellow-500/50 text-yellow-300 rounded-xl text-center animate-pulse">
                    <span className="block text-[8px]">New Node X</span>
                    <span className="font-bold">15</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                    {prob.data.options.map((opt: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                        className={`p-3 text-xs text-left font-bold rounded-xl border transition-all ${
                          selectedIdx === idx
                            ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200'
                            : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {prob?.id === 'delete_head' && (
                <div className="flex items-center gap-3">
                  {prob.data.list.map((v: number, idx: number) => (
                    <React.Fragment key={idx}>
                      <div className={`p-4 border rounded-xl flex flex-col items-center ${idx === 0 ? 'bg-red-950/20 border-red-500/40 text-red-400 line-through scale-90 opacity-65' : 'bg-slate-950 border border-slate-850 text-cyan-300'}`}>
                        {idx === 0 && <span className="text-[8px] uppercase font-bold">Deleted Head</span>}
                        {idx === 1 && <span className="text-[8px] uppercase font-bold text-yellow-500">New Head?</span>}
                        <span className="font-bold">{v}</span>
                      </div>
                      {idx < prob.data.list.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600" />}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {prob?.id === 'delete_by_value' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    {prob.data.list.map((node: any, idx: number) => (
                      <React.Fragment key={node.id}>
                        <div className={`p-4 border rounded-xl flex flex-col items-center ${
                          node.id === '99' 
                            ? selectedNodeId === '3' 
                              ? 'bg-slate-950/30 border-slate-900 text-slate-600 line-through opacity-40 scale-90' 
                              : 'bg-red-950/30 border-red-500/80 text-red-400 animate-pulse'
                            : 'bg-slate-950 border border-slate-850 text-cyan-300'
                        }`}>
                          <span className="text-[9px] text-slate-500 uppercase">Val</span>
                          <span className="font-bold">{node.val}</span>
                        </div>
                        {idx < prob.data.list.length - 1 && (
                          <div className={`text-slate-600 font-black flex items-center transition-all ${selectedNodeId === '3' && node.id === '1' ? 'text-emerald-400 animate-pulse' : ''}`}>
                            {selectedNodeId === '3' && node.id === '1' ? '------------->' : '-->'}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => { playSound('click'); setSelectedNodeId(null); }}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border ${selectedNodeId === null ? 'bg-red-900/30 border-red-500/50 text-red-200' : 'bg-slate-900/60 border-slate-850 text-slate-400'}`}
                    >
                      Point Node 1 to 99 (Default)
                    </button>
                    <button
                      onClick={() => { playSound('click'); setSelectedNodeId('3'); }}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border ${selectedNodeId === '3' ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:border-cyan-500 hover:text-cyan-400'}`}
                    >
                      Point Node 1 to Node 3 (Bypass 99)
                    </button>
                  </div>
                </div>
              )}

              {prob?.id === 'delete_tail' && (
                <div className="flex items-center gap-3">
                  {prob.data.list.map((v: number, idx: number) => (
                    <React.Fragment key={idx}>
                      <button
                        onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                        className={`p-4 border rounded-xl flex flex-col items-center min-w-[60px] ${
                          selectedIdx === idx 
                            ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 scale-105' 
                            : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[9px] text-slate-500">Idx {idx}</span>
                        <span className="font-bold">{v}</span>
                      </button>
                      {idx < prob.data.list.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600" />}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {prob?.id === 'reverse_pointer_step' && (
                <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                  {prob.data.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                      className={`p-3 text-xs text-left font-bold rounded-xl border transition-all ${
                        selectedIdx === idx
                          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200'
                          : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {prob?.id === 'reverse_three_pointers' && (
                <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                  {prob.data.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                      className={`p-3 text-xs text-left font-bold rounded-xl border transition-all ${
                        selectedIdx === idx
                          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200'
                          : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {prob?.id === 'reverse_list_fully' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    {prob.data.list.map((v: number, idx: number) => (
                      <React.Fragment key={idx}>
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                          <span className="block text-[8px] text-slate-500">Node</span>
                          <span className="font-bold text-cyan-300">{v}</span>
                        </div>
                        {idx < prob.data.list.length - 1 && <ArrowLeft className="w-4 h-4 text-yellow-500 animate-pulse" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {prob?.id === 'reverse_subsegment' && (
                <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                  {prob.data.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                      className={`p-3 text-xs text-left font-bold rounded-xl border transition-all ${
                        selectedIdx === idx
                          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200'
                          : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {prob?.id === 'mid_node_odd' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    {prob.data.list.map((v: number, idx: number) => (
                      <React.Fragment key={idx}>
                        <button
                          onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                          className={`p-4 border rounded-xl flex flex-col items-center min-w-[55px] ${
                            selectedIdx === idx 
                              ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200' 
                              : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-[9px] text-slate-500">Node</span>
                          <span className="font-bold">{v}</span>
                        </button>
                        {idx < prob.data.list.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {prob?.id === 'mid_node_even' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    {prob.data.list.map((v: number, idx: number) => (
                      <React.Fragment key={idx}>
                        <button
                          onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                          className={`p-4 border rounded-xl flex flex-col items-center min-w-[55px] ${
                            selectedIdx === idx 
                              ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200' 
                              : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-[9px] text-slate-500">Node</span>
                          <span className="font-bold">{v}</span>
                        </button>
                        {idx < prob.data.list.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {prob?.id === 'nth_node_from_end' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    {prob.data.list.map((v: number, idx: number) => (
                      <React.Fragment key={idx}>
                        <button
                          onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                          className={`p-4 border rounded-xl flex flex-col items-center min-w-[55px] ${
                            selectedIdx === idx 
                              ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 animate-pulse' 
                              : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-[9px] text-slate-500">Node</span>
                          <span className="font-bold">{v}</span>
                        </button>
                        {idx < prob.data.list.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {prob?.id === 'cycle_start_node' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    {prob.data.list.map((nodeName: string) => (
                      <button
                        key={nodeName}
                        onClick={() => { playSound('click'); setSelectedNodeId(nodeName); }}
                        className={`p-4 border rounded-xl flex flex-col items-center min-w-[55px] ${
                          selectedNodeId === nodeName
                            ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 animate-pulse'
                            : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-bold">{nodeName}</span>
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-yellow-500 font-mono">Note: Node D points back to Node B in cyclic loop</span>
                </div>
              )}

              {prob?.id === 'cycle_detect_proof' && (
                <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                  {prob.data.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                      className={`p-3 text-xs text-left font-bold rounded-xl border transition-all ${
                        selectedIdx === idx
                          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200'
                          : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {prob?.id === 'intersect_lists' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 rounded-xl">
                      L1: 1 → 2
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <button
                      onClick={() => { playSound('click'); setSelectedIdx(3); }}
                      className={`p-4 border rounded-xl flex flex-col items-center ${selectedIdx === 3 ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 animate-pulse' : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-700'}`}
                    >
                      <span className="text-xs font-bold">Node 3</span>
                    </button>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <div className="p-3 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl">
                      Node 4
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-950/40 border border-purple-500/30 text-purple-300 rounded-xl">
                      L2: 9
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-500">Joins Node 3</span>
                  </div>
                </div>
              )}

              {prob?.id === 'dll_nodes' && (
                <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                  {prob.data.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                      className={`p-3 text-xs text-left font-bold rounded-xl border transition-all ${
                        selectedIdx === idx
                          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200'
                          : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {prob?.id === 'lru_bubble' && (
                <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                  {prob.data.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                      className={`p-3 text-xs text-left font-bold rounded-xl border transition-all ${
                        selectedIdx === idx
                          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200'
                          : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {prob?.id === 'lru_hashmap_dll_relation' && (
                <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                  {prob.data.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                      className={`p-3 text-xs text-left font-bold rounded-xl border transition-all ${
                        selectedIdx === idx
                          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200'
                          : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* FALLBACK INPUT OPTIONS */}
              {selectedBoolean !== null && (
                <div className="flex gap-4">
                  <button
                    onClick={() => { playSound('click'); setSelectedBoolean(true); }}
                    className={`px-6 py-3 rounded-2xl font-bold border transition-all ${selectedBoolean === true ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200' : 'bg-slate-950 border-slate-850 text-slate-500 hover:border-slate-700'}`}
                  >
                    TRUE
                  </button>
                  <button
                    onClick={() => { playSound('click'); setSelectedBoolean(false); }}
                    className={`px-6 py-3 rounded-2xl font-bold border transition-all ${selectedBoolean === false ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200' : 'bg-slate-950 border-slate-850 text-slate-500 hover:border-slate-700'}`}
                  >
                    FALSE
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* LOWER CONTROL ACTION CONSOLE */}
          <div className="bg-[#05070e] border border-cyan-950/30 rounded-2xl p-5">
            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider mb-3">
              Memory Controller Input
            </h4>

            <div className="flex flex-col md:flex-row items-stretch gap-4">
              
              {/* Conditional text input */}
              {(prob?.id === 'list_traversal_count' || prob?.id === 'delete_head' || prob?.id === 'reverse_list_fully' || prob?.id === 'tortoise_hare_hop' || prob?.id === 'cycle_length' || prob?.id === 'merge_two_sorted' || prob?.id === 'lru_evict') && (
                <input
                  type="text"
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Enter your pointer query output..."
                  className="flex-1 px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-sm text-cyan-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              )}

              {/* Conditional Boolean setter */}
              {(prob?.id === 'cycle_detect_bool' || prob?.id === 'palindrome_linked_list') && selectedBoolean === null && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedBoolean(true)}
                    className="px-4 py-2 bg-slate-950 border border-slate-900 text-xs font-bold rounded-xl hover:border-cyan-500 text-cyan-400"
                  >
                    Select True
                  </button>
                  <button
                    onClick={() => setSelectedBoolean(false)}
                    className="px-4 py-2 bg-slate-950 border border-slate-900 text-xs font-bold rounded-xl hover:border-cyan-500 text-cyan-400"
                  >
                    Select False
                  </button>
                </div>
              )}

              <button
                onClick={handleVerifyProblem}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                DEPLOY COMPILATION POINTER
              </button>

              <button
                onClick={() => { playSound('click'); setShowHint(!showHint); }}
                className="px-4 py-3 bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
                <span>{showHint ? "HIDE HINT" : "REQUEST DECRYPT"}</span>
              </button>
            </div>

            {/* Hint Box */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 bg-yellow-950/10 border border-yellow-500/20 text-yellow-200 rounded-xl text-xs leading-relaxed"
                >
                  📡 <b>DECRYPTED CORE HINT:</b> {prob?.hint}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* RIGHT COLUMN: BOSS & TERMINAL LOGS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* BOSS BATTLE CARD */}
          <div className="bg-[#05070e] border border-cyan-500/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-950 text-red-400 rounded text-[9px] uppercase font-bold tracking-widest">
              Level Boss
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                {selectedLevel.bossAvatar}
              </span>
              <div>
                <h4 className="text-sm font-black text-white">{selectedLevel.bossName}</h4>
                <p className="text-[10px] text-red-400 uppercase tracking-wider">{selectedLevel.bossTitle}</p>
              </div>
            </div>

            {/* HP Bar */}
            <div className="space-y-1 mb-4">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400 uppercase">HP Status</span>
                <span className="text-red-400 font-bold">{bossHP} / {selectedLevel.bossMaxHP}</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${(bossHP / selectedLevel.bossMaxHP) * 100}%` }}
                />
              </div>
            </div>

            {/* Boss Dialogue */}
            <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl relative">
              <div className="absolute -top-1.5 left-4 w-3 h-3 bg-slate-950 border-t border-l border-slate-900 transform rotate-45" />
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{currentDialogue}"
              </p>
            </div>

            {/* Damage floating animation */}
            <AnimatePresence>
              {bossDamageAnim !== null && (
                <motion.div
                  initial={{ opacity: 1, y: 10, scale: 0.8 }}
                  animate={{ opacity: 0, y: -40, scale: 1.4 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] pointer-events-none"
                >
                  -{bossDamageAnim} CRIT!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CONSOLE TERMINAL LOGS */}
          <div className="bg-[#03050a] border border-slate-950 rounded-2xl p-4 h-[240px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[9px] text-slate-500 uppercase font-bold tracking-widest border-b border-slate-900/40 pb-2 mb-2">
              <span>Secure Terminal Log</span>
              <span className="text-cyan-400 animate-pulse">● ACTIVE</span>
            </div>

            <div className="flex-1 overflow-y-auto text-[11px] space-y-1.5 font-mono pr-2 scrollbar-thin scrollbar-thumb-cyan-900">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className={log.startsWith('✅') ? 'text-emerald-400 font-bold' : log.startsWith('❌') ? 'text-red-400' : 'text-slate-400'}>
                  {log}
                </div>
              ))}
            </div>

            {/* Next Problem Button (Only shown when current is solved) */}
            {solvedProblemIds.includes(prob?.id) && activeProblemIdx < selectedLevel.problems.length - 1 && (
              <button
                onClick={handleNextProblem}
                className="mt-3 w-full py-2 bg-emerald-950/40 border border-emerald-500 text-emerald-400 hover:bg-emerald-950/60 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <span>NEXT NODE CONSTRAINTS</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* NEW ACHIEVEMENT POPUP MODAL */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <div className="bg-gradient-to-b from-cyan-950 to-slate-950 border-2 border-cyan-500 rounded-3xl p-8 max-w-sm text-center relative shadow-[0_0_50px_rgba(6,182,212,0.3)]">
              <div className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 cursor-pointer" onClick={() => setNewAchievement(null)}>
                <X className="w-5 h-5" />
              </div>
              <div className="w-16 h-16 bg-cyan-950 border border-cyan-500/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl filter drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                🏆
              </div>
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-400">
                ACHIEVEMENT UNLOCKED!
              </h3>
              <p className="text-slate-200 font-bold text-sm mt-2">{newAchievement}</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                You have successfully patched this sector link, resolved dereferenced constraints, and secured memory addresses.
              </p>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setNewAchievement(null)}
                  className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black rounded-xl transition-all"
                >
                  CONTINUE SECURING
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
