import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Unlock, Check, Star, Shield, Play, RotateCcw, Award, Info, 
  MapPin, HelpCircle, ChevronRight, Volume2, VolumeX, AlertCircle,
  Hash, Layers, FastForward, GitCommit, Database, Library, Box, Network,
  Eye, EyeOff, Sparkles, User, MessageSquare, Compass, Trophy, ListTodo,
  TrendingUp, CheckSquare, Sparkle, RefreshCw
} from 'lucide-react';
import { ProfileState } from '../types';
import ArrayKingdomQuest from './ArrayKingdomQuest';
import LinkedListVillageQuest from './LinkedListVillageQuest';
import StackMountainQuest from './StackMountainQuest';
import QueueCityQuest from './QueueCityQuest';
import TreeForestQuest from './TreeForestQuest';
import HeapCastleQuest from './HeapCastleQuest';
import TrieLibraryQuest from './TrieLibraryQuest';
import HashRealmQuest from './HashRealmQuest';
import GraphGalaxyQuest from './GraphGalaxyQuest';
import DPDimensionQuest from './DPDimensionQuest';

interface WorldMapViewProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
  onLaunchLevel: (worldId: string) => void;
}

export interface World {
  id: string;
  name: string;
  lore: string;
  difficulty: 'Beginner' | 'Adept' | 'Expert' | 'Godlike';
  complexity: string;
  themeColor: 'purple' | 'cyan' | 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'violet' | 'pink' | 'orange';
  x: number; // percentage
  y: number; // percentage
  challengeName: string;
  challengeInstructions: string;
  npcName: string;
  npcTitle: string;
  npcAvatar: string;
  npcDialogueLocked: string;
  npcDialogueActive: string;
  npcDialogueSolved: string;
  questDescription: string;
}

export const WORLDS: World[] = [
  {
    id: 'array_kingdom',
    name: 'Array Kingdom',
    lore: 'The absolute bedrock of computer structures. Memory is mapped consecutively in a single, contiguous high-speed ribbon.',
    difficulty: 'Beginner',
    complexity: 'O(1) Access',
    themeColor: 'purple',
    x: 12,
    y: 20,
    challengeName: 'Contiguous Block Alignment',
    challengeInstructions: 'Indices are unsorted! Rearrange adjacent memory blocks into ascending numeric order (10 -> 20 -> 30 -> 40).',
    npcName: 'Index-Master Prime',
    npcTitle: 'Contiguous Guard',
    npcAvatar: '🤖',
    npcDialogueLocked: 'Access denied. Initialize sector core sequence.',
    npcDialogueActive: 'Keep addresses contiguous! Gaps in address ranges will trigger fatal segfaults.',
    npcDialogueSolved: 'Magnificent contiguous order! All memory sectors are humming with linear efficiency.',
    questDescription: 'Sort the contiguous memory addresses'
  },
  {
    id: 'linked_list_village',
    name: 'Linked List Village',
    lore: 'A sprawling scattered settlement. Nodes reside anywhere in the heap space, linked sequentially by fragile pointer vectors.',
    difficulty: 'Beginner',
    complexity: 'O(N) Search',
    themeColor: 'cyan',
    x: 25,
    y: 42,
    challengeName: 'Sequential Chain Linker',
    challengeInstructions: 'Bypass the corrupt node [Node B: 99] by setting the pointer reference of [Node A: 45] directly to [Node C: 60].',
    npcName: 'Pointer-Slinger Link',
    npcTitle: 'Sequential Weaver',
    npcAvatar: '🏹',
    npcDialogueLocked: 'Verify your previous sector pointer before jumping onto our nodes.',
    npcDialogueActive: 'A broken node is leaking garbage data. Dereference the corrupt block and re-link the remaining chain.',
    npcDialogueSolved: 'No more null-pointers! Our sequentially linked settlement is fully salvaged.',
    questDescription: 'Bypass the corrupted node reference'
  },
  {
    id: 'stack_mountain',
    name: 'Stack Mountain',
    lore: 'A towering execution spire operating on strict LIFO (Last-In-First-Out) directives. Watch the stack boundaries!',
    difficulty: 'Beginner',
    complexity: 'O(1) Push/Pop',
    themeColor: 'blue',
    x: 42,
    y: 22,
    challengeName: 'Balanced Bracket Stream',
    challengeInstructions: 'Syntax symbols are unaligned! Push brackets onto the stack in the exact sequence that mirrors nested balance.',
    npcName: 'CallStack Sherpa',
    npcTitle: 'Depth Explorer',
    npcAvatar: '🧗',
    npcDialogueLocked: 'The mountain path is frozen. Solve the sequential linked node challenge to begin ascent.',
    npcDialogueActive: 'One frame over the boundary and we collapse! Push brackets carefully to maintain balance.',
    npcDialogueSolved: 'Balanced peak achieved! You have bypassed stack overflow and aligned the syntax brackets.',
    questDescription: 'Balance the syntax bracket stack'
  },
  {
    id: 'queue_city',
    name: 'Queue City',
    lore: 'A bustling neon transit hub handling asynchronous communication pipelines using strict FIFO scheduling.',
    difficulty: 'Beginner',
    complexity: 'O(1) Dequeue',
    themeColor: 'emerald',
    x: 38,
    y: 68,
    challengeName: 'FIFO Pipeline Router',
    challengeInstructions: 'The packet buffer is overloaded! Dequeue network packet streams in arrival order to prevent cyclic deadlock.',
    npcName: 'Buffer-Baron FIFO',
    npcTitle: 'Traffic Overseer',
    npcAvatar: '🚇',
    npcDialogueLocked: 'Traffic flow is locked until the call-stack buffers above are synchronized.',
    npcDialogueActive: 'First come, first served! Do not allow a higher priority to trigger starvation. Dequeue sequentially!',
    npcDialogueSolved: 'Packet queues cleared! Network streams are running asynchronously without latency spikes.',
    questDescription: 'Clear packet buffer congestion'
  },
  {
    id: 'tree_forest',
    name: 'Tree Forest',
    lore: 'An organic, self-balancing sanctuary. Nodes divide recursively into left and right sub-branches at log-N speeds.',
    difficulty: 'Adept',
    complexity: 'O(log N) Search',
    themeColor: 'amber',
    x: 58,
    y: 45,
    challengeName: 'BST Symmetrical Balancer',
    challengeInstructions: 'Incoming random keys are floating! Route node 30 and node 75 into their mathematically valid BST slots.',
    npcName: 'Arch-Druid AVL',
    npcTitle: 'Equilibrium Sage',
    npcAvatar: '🧝',
    npcDialogueLocked: 'The forest is deep and wild. Balance your linear queues before searching these paths.',
    npcDialogueActive: 'Skewed trees collapse under search times. Rotate left, rotate right, keep our branches in perfect balance!',
    npcDialogueSolved: 'Perfect log-N symmetry restored! The branches are aligned and lookup algorithms operate instantly.',
    questDescription: 'Route keys into valid BST slots'
  },
  {
    id: 'heap_castle',
    name: 'Heap Castle',
    lore: 'A hierarchical binary bastion. The highest-value elite node is maintained at the root summit at all times.',
    difficulty: 'Adept',
    complexity: 'O(log N) Heapify',
    themeColor: 'rose',
    x: 52,
    y: 82,
    challengeName: 'Max-Heapify Up',
    challengeInstructions: 'The fortress hierarchy is corrupted! Select and swap nodes to bubble the maximum value (45) to the top root.',
    npcName: 'King Priority',
    npcTitle: 'Root Monarch',
    npcAvatar: '👑',
    npcDialogueLocked: 'Only those who have balanced the sacred BST forest may seek audience at our castle.',
    npcDialogueActive: 'Only the supreme maximum element may sit upon the root throne! Bubble up the worthy!',
    npcDialogueSolved: 'Max-Heap property restored! The root element is certified as the ultimate value.',
    questDescription: 'Bubble up the maximum node'
  },
  {
    id: 'trie_library',
    name: 'Trie Library',
    lore: 'A quiet, infinite archive of character lookup chains. Decodes text characters and autocompletes dictionary keywords.',
    difficulty: 'Expert',
    complexity: 'O(Length) Lookup',
    themeColor: 'indigo',
    x: 74,
    y: 24,
    challengeName: 'Autocomplete Prefix Linker',
    challengeInstructions: 'Walk the search prefix. Spell out the keyword "REACT" from the root "RE" by adding adjacent characters.',
    npcName: 'Archivist Prefix',
    npcTitle: 'Token Curator',
    npcAvatar: '🧙',
    npcDialogueLocked: 'This library is restricted. Establish heap priority at the castle before browsing our archives.',
    npcDialogueActive: 'One root node, many spelling pathways. Spell out keywords sequentially to traverse our dictionary trees.',
    npcDialogueSolved: 'Autocomplete path resolved! The keyword indexes are cataloged in constant prefix time.',
    questDescription: 'Spell out search prefix tokens'
  },
  {
    id: 'hash_realm',
    name: 'Hash Realm',
    lore: 'A quantum computational rift of key-value slot matrices. Maps infinite indices to direct, constant-time slots.',
    difficulty: 'Expert',
    complexity: 'O(1) Map',
    themeColor: 'violet',
    x: 72,
    y: 62,
    challengeName: 'Collision Resolution Probe',
    challengeInstructions: 'Key [12] hashes to index [12 % 5 = 2], which is occupied. Probe linearly to find the next available slot!',
    npcName: 'Key-Keeper Crypto',
    npcTitle: 'Constant Director',
    npcAvatar: '🛡️',
    npcDialogueLocked: 'Enter prefix strings first before unlocking constant-time quantum slots.',
    npcDialogueActive: 'A hash collision has blocked address slot 2! Probe adjacent slots to map our database in constant O(1) time.',
    npcDialogueSolved: 'Linear probe resolved! Value successfully indexed with zero collision penalties.',
    questDescription: 'Probe vacant collision addresses'
  },
  {
    id: 'graph_galaxy',
    name: 'Graph Galaxy',
    lore: 'An endless matrix of vertices and edges. Pathfind through weighted warp lanes to find shortest routing vectors.',
    difficulty: 'Expert',
    complexity: 'O(V + E)',
    npcName: 'Navigator Star-Edge',
    themeColor: 'pink',
    x: 88,
    y: 74,
    challengeName: 'Dijkstra Shortest Route',
    challengeInstructions: 'Calibrate network cables! Click vertices to activate a continuous shortest-path route from Node 1 to Node 4.',
    npcTitle: 'Warp Pilot',
    npcAvatar: '👩‍✈️',
    npcDialogueLocked: 'The galaxy coordinates are blocked. Resolve key collisions in the hash realm to calibrate our warp drive.',
    npcDialogueActive: 'Avoid cycles and weight deadlocks. Plot shortest distance routes using edge relaxation!',
    npcDialogueSolved: 'Warp path laid! The network vertices are balanced with absolute minimum distance cost.',
    questDescription: 'Build the shortest network path'
  },
  {
    id: 'dp_dimension',
    name: 'Dynamic Programming Dimension',
    lore: 'A higher lookup grid dimension of subproblem caching. Computes complex recursion in constant time using memo matrices.',
    difficulty: 'Godlike',
    complexity: 'O(N * W)',
    themeColor: 'orange',
    x: 92,
    y: 38,
    challengeName: 'Memoization Lookup Grid',
    challengeInstructions: 'Recursive calls are overlapping! Activate memoization registers sequentially to cache results.',
    npcName: 'Chronos Memo',
    npcTitle: 'Subproblem Sage',
    npcAvatar: '⌛',
    npcDialogueLocked: 'The dimension threshold is closed. Map the Graph Galaxy network coordinates first.',
    npcDialogueActive: 'Do not repeat the past! Cache subproblems in our memoization lookup table to speed up time itself.',
    npcDialogueSolved: 'Matrix optimized! Recursion depth flattened into linear time. You have conquered DSA space-time!',
    questDescription: 'Activate memoization cache blocks'
  }
];

export default function WorldMapView({
  profile,
  onUpdateProfile,
  onBackToMenu,
  onLaunchLevel
}: WorldMapViewProps) {
  // Navigation & Interactive States
  const [selectedWorldId, setSelectedWorldId] = useState<string>('array_kingdom');
  const [activeChallengeWorldId, setActiveChallengeWorldId] = useState<string | null>(null);
  const [shakeWorldId, setShakeWorldId] = useState<string | null>(null);
  const [is3DView, setIs3DView] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [activeNpcDialogue, setActiveNpcDialogue] = useState<string | null>(null);
  const [justUnlockedWorldId, setJustUnlockedWorldId] = useState<string | null>(null);

  // Quest Tracker Status (dynamic computed list based on completedWorlds)
  const completedList = profile.completedWorlds || ['array_kingdom'];
  const selectedWorld = WORLDS.find(w => w.id === selectedWorldId) || WORLDS[0];

  // 10 SECTOR-SPECIFIC CHALLENGE STATES
  // 1. Array Kingdom
  const [arrayBlocks, setArrayBlocks] = useState<{ id: number; value: number }[]>([
    { id: 1, value: 30 },
    { id: 2, value: 10 },
    { id: 3, value: 40 },
    { id: 4, value: 20 }
  ]);
  // 2. Linked List Village
  const [linkedNodes, setLinkedNodes] = useState<{ id: string; name: string; val: number; next: string | null; corrupt?: boolean }[]>([
    { id: 'head', name: 'HEAD', val: 0, next: 'A' },
    { id: 'A', name: 'Node A', val: 45, next: 'B' },
    { id: 'B', name: 'Node B', val: 99, next: 'C', corrupt: true },
    { id: 'C', name: 'Node C', val: 60, next: 'tail' },
    { id: 'tail', name: 'TAIL', val: 100, next: null }
  ]);
  // 3. Stack Mountain
  const [stackItems, setStackItems] = useState<string[]>([]);
  const [stackInput, setStackInput] = useState<string[]>(['[', '{', '(', ')', '}', ']']);
  // 4. Queue City
  const [queueBuffer, setQueueBuffer] = useState<number[]>([101, 202, 303, 404, 505]);
  const [queueProcessed, setQueueProcessed] = useState<number[]>([]);
  // 5. Tree Forest
  const [treeNodes, setTreeNodes] = useState<{ value: number; side: 'left' | 'right' | null }[]>([
    { value: 50, side: null }
  ]);
  const [currentTreeInput, setCurrentTreeInput] = useState<number>(30);
  // 6. Heap Castle
  const [heapNodes, setHeapNodes] = useState<number[]>([15, 30, 45, 10, 8, 20]);
  // 7. Trie Library
  const [trieTarget] = useState<string>('REACT');
  const [trieCurrent, setTrieCurrent] = useState<string>('RE');
  // 8. Hash Realm
  const [hashSlots, setHashSlots] = useState<{ key: number | null; label: string }[]>([
    { key: null, label: 'Slot 0 (Empty)' },
    { key: null, label: 'Slot 1 (Empty)' },
    { key: 7, label: 'Slot 2 (Occupied: Key 7)' },
    { key: null, label: 'Slot 3 (Empty)' },
    { key: null, label: 'Slot 4 (Empty)' }
  ]);
  const [selectedHashSlot, setSelectedHashSlot] = useState<number | null>(null);
  // 9. Graph Galaxy
  const [graphNodes, setGraphNodes] = useState<{ id: number; active: boolean; label: string }[]>([
    { id: 1, active: true, label: 'Node 1 (Source)' },
    { id: 2, active: false, label: 'Node 2 (Middle A)' },
    { id: 3, active: false, label: 'Node 3 (Middle B)' },
    { id: 4, active: false, label: 'Node 4 (Destination)' }
  ]);


  // Sound Engine using Web Audio API safely
  const playSound = (type: 'success' | 'fail' | 'select' | 'lock' | 'unlock') => {
    if (!audioEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'fail') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.25);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'select') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'lock') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.setValueAtTime(90, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'unlock') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, now); // C4
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.5); // C6
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      // Audio context blocked or unsupported
    }
  };

  const isWorldUnlocked = (worldId: string) => {
    if (worldId === 'array_kingdom') return true;
    const index = WORLDS.findIndex(w => w.id === worldId);
    if (index === -1) return false;
    const previousWorld = WORLDS[index - 1];
    return completedList.includes(previousWorld.id);
  };

  const handleWorldClick = (world: World) => {
    setSelectedWorldId(world.id);
    const unlocked = isWorldUnlocked(world.id);
    const solved = completedList.includes(world.id);

    // Update talking NPC dialogue automatically
    if (solved) {
      setActiveNpcDialogue(world.npcDialogueSolved);
    } else if (unlocked) {
      setActiveNpcDialogue(world.npcDialogueActive);
    } else {
      setActiveNpcDialogue(world.npcDialogueLocked);
    }

    if (!unlocked) {
      playSound('lock');
      setShakeWorldId(world.id);
      setTimeout(() => setShakeWorldId(null), 500);
    } else {
      playSound('select');
    }
  };

  // Initialize Dialogue for Selected World on load
  useEffect(() => {
    const solved = completedList.includes(selectedWorld.id);
    const unlocked = isWorldUnlocked(selectedWorld.id);
    if (solved) {
      setActiveNpcDialogue(selectedWorld.npcDialogueSolved);
    } else if (unlocked) {
      setActiveNpcDialogue(selectedWorld.npcDialogueActive);
    } else {
      setActiveNpcDialogue(selectedWorld.npcDialogueLocked);
    }
  }, [selectedWorldId]);

  // Launch Active World Challenge
  const handleLaunchWorldChallenge = () => {
    if (!isWorldUnlocked(selectedWorldId)) return;
    playSound('select');
    setActiveChallengeWorldId(selectedWorldId);
    resetChallenges(selectedWorldId);
  };

  // Reset Challenge parameters
  const resetChallenges = (worldId: string) => {
    if (worldId === 'array_kingdom') {
      setArrayBlocks([
        { id: 1, value: 30 },
        { id: 2, value: 10 },
        { id: 3, value: 40 },
        { id: 4, value: 20 }
      ]);
    } else if (worldId === 'linked_list_village') {
      setLinkedNodes([
        { id: 'head', name: 'HEAD', val: 0, next: 'A' },
        { id: 'A', name: 'Node A', val: 45, next: 'B' },
        { id: 'B', name: 'Node B', val: 99, next: 'C', corrupt: true },
        { id: 'C', name: 'Node C', val: 60, next: 'tail' },
        { id: 'tail', name: 'TAIL', val: 100, next: null }
      ]);
    } else if (worldId === 'stack_mountain') {
      setStackItems([]);
      setStackInput(['[', '{', '(', ')', '}', ']']);
    } else if (worldId === 'queue_city') {
      setQueueBuffer([101, 202, 303, 404, 505]);
      setQueueProcessed([]);
    } else if (worldId === 'tree_forest') {
      setTreeNodes([{ value: 50, side: null }]);
      setCurrentTreeInput(30);
    } else if (worldId === 'heap_castle') {
      setHeapNodes([15, 30, 45, 10, 8, 20]);
    } else if (worldId === 'trie_library') {
      setTrieCurrent('RE');
    } else if (worldId === 'hash_realm') {
      setHashSlots([
        { key: null, label: 'Slot 0 (Empty)' },
        { key: null, label: 'Slot 1 (Empty)' },
        { key: 7, label: 'Slot 2 (Occupied: Key 7)' },
        { key: null, label: 'Slot 3 (Empty)' },
        { key: null, label: 'Slot 4 (Empty)' }
      ]);
      setSelectedHashSlot(null);
    } else if (worldId === 'graph_galaxy') {
      setGraphNodes([
        { id: 1, active: true, label: 'Node 1 (Source)' },
        { id: 2, active: false, label: 'Node 2 (Middle A)' },
        { id: 3, active: false, label: 'Node 3 (Middle B)' },
        { id: 4, active: false, label: 'Node 4 (Destination)' }
      ]);
    }
  };

  // Mark world as completed, update stats and check for unlocks
  const handleCompleteChallenge = () => {
    playSound('success');
    const newCompleted = [...completedList];
    if (!newCompleted.includes(selectedWorldId)) {
      newCompleted.push(selectedWorldId);
    }
    
    // Check if a new world has been unlocked to trigger unlock animation sequence
    const nextWorldIndex = WORLDS.findIndex(w => w.id === selectedWorldId) + 1;
    if (nextWorldIndex < WORLDS.length) {
      const nextWorld = WORLDS[nextWorldIndex];
      if (!completedList.includes(nextWorld.id)) {
        setJustUnlockedWorldId(nextWorld.id);
        playSound('unlock');
        setTimeout(() => {
          setJustUnlockedWorldId(null);
        }, 3000);
      }
    }

    // Grant Points and Sync
    const isBossLevel = selectedWorldId === 'dp_dimension';
    const pointsGained = isBossLevel ? 350 : 150;
    const newPoints = profile.points + pointsGained;

    onUpdateProfile({
      points: newPoints,
      completedWorlds: newCompleted,
      rank: getNextRank(newPoints)
    });

    setActiveNpcDialogue(selectedWorld.npcDialogueSolved);
    setActiveChallengeWorldId(null);
  };

  const getNextRank = (points: number) => {
    if (points >= 1800) return 'O(1) Master Wizard';
    if (points >= 1200) return 'O(log N) Binary Adept';
    if (points >= 600) return 'O(N) Linear Agent';
    return 'Bubble Sort Novice';
  };

  const handleResetProgress = () => {
    playSound('select');
    onUpdateProfile({
      completedWorlds: ['array_kingdom'],
      points: Math.max(0, profile.points - 300)
    });
    setSelectedWorldId('array_kingdom');
    setActiveNpcDialogue(WORLDS[0].npcDialogueActive);
    setActiveChallengeWorldId(null);
  };

  // --- SECTOR SPECIFIC MINI CHALLENGE LOGIC ---
  // 1. Array Kingdom Swapping
  const swapArrayBlocks = (idx1: number, idx2: number) => {
    playSound('select');
    const updated = [...arrayBlocks];
    const temp = updated[idx1];
    updated[idx1] = updated[idx2];
    updated[idx2] = temp;
    setArrayBlocks(updated);

    // Verify Ascending Order: 10, 20, 30, 40
    if (
      updated[0].value === 10 &&
      updated[1].value === 20 &&
      updated[2].value === 30 &&
      updated[3].value === 40
    ) {
      setTimeout(() => handleCompleteChallenge(), 350);
    }
  };

  // 2. Linked List Village Link repair
  const repairLinkedList = (targetNextId: string | null) => {
    playSound('select');
    // Set Node A's 'next' to the chosen node
    const updated = linkedNodes.map(node => {
      if (node.id === 'A') {
        return { ...node, next: targetNextId };
      }
      return node;
    });
    setLinkedNodes(updated);

    // If Node A next is 'C' (bypassing B)
    if (targetNextId === 'C') {
      setTimeout(() => handleCompleteChallenge(), 400);
    } else {
      playSound('fail');
    }
  };

  // 3. Stack Mountain balancing
  const handlePushStack = (char: string) => {
    playSound('select');
    const updatedInput = stackInput.filter(c => c !== char);
    setStackInput(updatedInput);
    setStackItems([...stackItems, char]);
  };

  const handlePopStack = () => {
    if (stackItems.length === 0) return;
    playSound('select');
    const popped = stackItems[stackItems.length - 1];
    setStackItems(stackItems.slice(0, -1));
    setStackInput([...stackInput, popped]);
  };

  useEffect(() => {
    if (activeChallengeWorldId === 'stack_mountain') {
      const matchPattern = ['[', '{', '(', ')', '}', ']'];
      if (stackItems.length === matchPattern.length) {
        if (stackItems.join('') === matchPattern.join('')) {
          handleCompleteChallenge();
        } else {
          playSound('fail');
          resetChallenges('stack_mountain');
        }
      }
    }
  }, [stackItems]);

  // 4. Queue City Routing
  const handleDequeue = () => {
    if (queueBuffer.length === 0) return;
    playSound('select');
    const front = queueBuffer[0];
    setQueueBuffer(queueBuffer.slice(1));
    setQueueProcessed([...queueProcessed, front]);
  };

  useEffect(() => {
    if (activeChallengeWorldId === 'queue_city') {
      if (queueBuffer.length === 0) {
        handleCompleteChallenge();
      }
    }
  }, [queueBuffer]);

  // 5. Tree Forest Balancing
  const handleTreeRoute = (side: 'left' | 'right') => {
    playSound('select');
    const rootVal = 50;
    const isCorrectLeft = currentTreeInput < rootVal && side === 'left';
    const isCorrectRight = currentTreeInput > rootVal && side === 'right';

    if (isCorrectLeft || isCorrectRight) {
      setTreeNodes([...treeNodes, { value: currentTreeInput, side }]);
      if (currentTreeInput === 30) {
        setCurrentTreeInput(75);
      } else {
        handleCompleteChallenge();
      }
    } else {
      playSound('fail');
      resetChallenges('tree_forest');
    }
  };

  // 6. Heap Castle Root Restoration
  const handleHeapify = (idx: number) => {
    playSound('select');
    const parentIdx = Math.floor((idx - 1) / 2);
    if (parentIdx >= 0 && heapNodes[idx] > heapNodes[parentIdx]) {
      const updated = [...heapNodes];
      const temp = updated[idx];
      updated[idx] = updated[parentIdx];
      updated[parentIdx] = temp;
      setHeapNodes(updated);

      if (updated[0] === 45) {
        setTimeout(() => handleCompleteChallenge(), 400);
      }
    } else {
      playSound('fail');
    }
  };

  // 7. Trie Library prefix match
  const handleTrieSpell = (letter: string) => {
    playSound('select');
    const textTest = trieCurrent + letter;
    if (trieTarget.startsWith(textTest)) {
      setTrieCurrent(textTest);
      if (textTest === trieTarget) {
        handleCompleteChallenge();
      }
    } else {
      playSound('fail');
      resetChallenges('trie_library');
    }
  };

  // 8. Hash Realm Collision Resolution
  const handleHashProbe = (slotIdx: number) => {
    playSound('select');
    setSelectedHashSlot(slotIdx);
    // Spot 12 hashes to 2, occupied. Probing linearly -> slot 3 is the correct next available slot
    if (slotIdx === 3) {
      const updatedSlots = [...hashSlots];
      updatedSlots[3] = { key: 12, label: 'Slot 3 (Occupied: Key 12)' };
      setHashSlots(updatedSlots);
      setTimeout(() => handleCompleteChallenge(), 400);
    } else {
      playSound('fail');
    }
  };

  // 9. Graph Galaxy routing
  const handleGraphNodeClick = (nodeId: number) => {
    playSound('select');
    const updated = graphNodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, active: true };
      }
      return node;
    });
    setGraphNodes(updated);

    // If node 4 is active, we completed Dijkstra Shortest route
    if (nodeId === 4) {
      setTimeout(() => handleCompleteChallenge(), 400);
    }
  };



  // Theme translation utilities
  const getThemeColorClass = (color: string) => {
    switch (color) {
      case 'purple':
        return {
          glow: 'shadow-[0_0_20px_rgba(168,85,247,0.55)] animate-pulse',
          border: 'border-purple-500/50',
          activeBorder: 'border-purple-400',
          bg: 'bg-purple-950/20',
          text: 'text-purple-400',
          lineColor: '#a855f7'
        };
      case 'cyan':
        return {
          glow: 'shadow-[0_0_20px_rgba(6,182,212,0.55)] animate-pulse',
          border: 'border-cyan-500/50',
          activeBorder: 'border-cyan-400',
          text: 'text-cyan-400',
          lineColor: '#06b6d4'
        };
      case 'blue':
        return {
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.55)] animate-pulse',
          border: 'border-blue-500/50',
          activeBorder: 'border-blue-400',
          text: 'text-blue-400',
          lineColor: '#3b82f6'
        };
      case 'emerald':
        return {
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.55)] animate-pulse',
          border: 'border-emerald-500/50',
          activeBorder: 'border-emerald-400',
          text: 'text-emerald-400',
          lineColor: '#10b981'
        };
      case 'amber':
        return {
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.55)] animate-pulse',
          border: 'border-amber-500/50',
          activeBorder: 'border-amber-400',
          text: 'text-amber-400',
          lineColor: '#f59e0b'
        };
      case 'rose':
        return {
          glow: 'shadow-[0_0_20px_rgba(244,63,94,0.55)] animate-pulse',
          border: 'border-rose-500/50',
          activeBorder: 'border-rose-400',
          text: 'text-rose-400',
          lineColor: '#f43f5e'
        };
      case 'indigo':
        return {
          glow: 'shadow-[0_0_20px_rgba(99,102,241,0.55)] animate-pulse',
          border: 'border-indigo-500/50',
          activeBorder: 'border-indigo-400',
          text: 'text-indigo-400',
          lineColor: '#6366f1'
        };
      case 'violet':
        return {
          glow: 'shadow-[0_0_20px_rgba(139,92,246,0.55)] animate-pulse',
          border: 'border-violet-500/50',
          activeBorder: 'border-violet-400',
          text: 'text-violet-400',
          lineColor: '#8b5cf6'
        };
      case 'pink':
        return {
          glow: 'shadow-[0_0_20px_rgba(236,72,153,0.55)] animate-pulse',
          border: 'border-pink-500/50',
          activeBorder: 'border-pink-400',
          text: 'text-pink-400',
          lineColor: '#ec4899'
        };
      case 'orange':
      default:
        return {
          glow: 'shadow-[0_0_20px_rgba(249,115,22,0.55)] animate-pulse',
          border: 'border-orange-500/50',
          activeBorder: 'border-orange-400',
          text: 'text-orange-400',
          lineColor: '#f97316'
        };
    }
  };

  const selectedTheme = getThemeColorClass(selectedWorld.themeColor);

  return (
    <div className="relative w-full bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 md:p-6 select-none animate-fade-in text-slate-100 min-h-[700px] font-sans">
      
      {/* Background neon ambient light flare */}
      <div className={`absolute top-20 right-20 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-all duration-1000 opacity-20 ${
        selectedWorld.themeColor === 'purple' ? 'bg-purple-600' :
        selectedWorld.themeColor === 'cyan' ? 'bg-cyan-600' :
        selectedWorld.themeColor === 'blue' ? 'bg-blue-600' :
        selectedWorld.themeColor === 'emerald' ? 'bg-emerald-600' :
        selectedWorld.themeColor === 'amber' ? 'bg-amber-600' :
        selectedWorld.themeColor === 'rose' ? 'bg-rose-600' :
        selectedWorld.themeColor === 'indigo' ? 'bg-indigo-600' :
        selectedWorld.themeColor === 'violet' ? 'bg-violet-600' :
        selectedWorld.themeColor === 'pink' ? 'bg-pink-600' : 'bg-orange-600'
      }`} />

      {/* --- DASHBOARD SUB-HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center z-10 border-b border-slate-800/60 pb-2.5 mb-3 gap-2 sm:gap-3">
        <div>
          <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-cyan-400 font-bold uppercase block">
            NEURAL TOPOLOGY CORE v8.0
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight font-sans flex items-center gap-2">
            THE CONSTELLATION MAP
            <span className="text-xs font-normal text-slate-400">({completedList.length}/10 Dimensions Synced)</span>
          </h2>
        </div>

        {/* Tactical Controls & View Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto">
          {/* Flat / 3D Perspective View Switcher */}
          <button
            onClick={() => { playSound('select'); setIs3DView(!is3DView); }}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-lg border cursor-pointer transition-all ${
              is3DView 
                ? 'bg-purple-950/40 text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.25)]' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {is3DView ? (
              <>
                <Eye className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline">3D Isometric</span>
                <span className="xs:hidden">3D</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline">2D Blueprint</span>
                <span className="xs:hidden">2D</span>
              </>
            )}
          </button>

          {/* SFX Audio Toggler */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-1.5 sm:p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
            title={audioEnabled ? "Disable Sound FX" : "Enable Sound FX"}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
          </button>

          {/* Reset Progress */}
          <button
            onClick={handleResetProgress}
            className="text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900/50 rounded-lg cursor-pointer transition-colors"
          >
            Reset
          </button>

          {/* Back to main screen */}
          <button
            onClick={onBackToMenu}
            className="text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-850 hover:border-slate-750 text-slate-300 hover:text-cyan-400 rounded-lg cursor-pointer transition-all"
          >
            &lt; Main Menu
          </button>
        </div>
      </div>

      {/* --- LEVEL UNLOCKED ANIMATION BANNER --- */}
      <AnimatePresence>
        {justUnlockedWorldId && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 bg-gradient-to-r from-cyan-950/90 via-purple-950/90 to-cyan-950/90 border border-cyan-500/40 rounded-2xl p-4 text-center z-50 shadow-[0_4px_30px_rgba(6,182,212,0.4)] backdrop-blur-md"
          >
            <div className="flex items-center justify-center gap-2.5">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold block">NEW FREQUENCY ESTABLISHED</span>
                <h4 className="text-sm font-black text-white uppercase">
                  UNLOCKED: {WORLDS.find(w => w.id === justUnlockedWorldId)?.name}
                </h4>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ACTIVE CHALLENGE PLAY MODE PANEL --- */}
      {activeChallengeWorldId !== null ? (
        activeChallengeWorldId === 'array_kingdom' ? (
          <ArrayKingdomQuest
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            onBackToMenu={() => { playSound('select'); setActiveChallengeWorldId(null); }}
            onCompleteSector={handleCompleteChallenge}
          />
        ) : activeChallengeWorldId === 'linked_list_village' ? (
          <LinkedListVillageQuest
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            onBackToMenu={() => { playSound('select'); setActiveChallengeWorldId(null); }}
            onCompleteSector={handleCompleteChallenge}
          />
        ) : activeChallengeWorldId === 'stack_mountain' ? (
          <StackMountainQuest
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            onBackToMenu={() => { playSound('select'); setActiveChallengeWorldId(null); }}
            onCompleteSector={handleCompleteChallenge}
          />
        ) : activeChallengeWorldId === 'queue_city' ? (
          <QueueCityQuest
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            onBackToMenu={() => { playSound('select'); setActiveChallengeWorldId(null); }}
            onCompleteSector={handleCompleteChallenge}
          />
        ) : activeChallengeWorldId === 'tree_forest' ? (
          <TreeForestQuest
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            onBackToMenu={() => { playSound('select'); setActiveChallengeWorldId(null); }}
            onCompleteSector={handleCompleteChallenge}
          />
        ) : activeChallengeWorldId === 'heap_castle' ? (
          <HeapCastleQuest
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            onBackToMenu={() => { playSound('select'); setActiveChallengeWorldId(null); }}
            onCompleteSector={handleCompleteChallenge}
          />
        ) : activeChallengeWorldId === 'trie_library' ? (
          <TrieLibraryQuest
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            onBackToMenu={() => { playSound('select'); setActiveChallengeWorldId(null); }}
            onCompleteSector={handleCompleteChallenge}
          />
        ) : activeChallengeWorldId === 'hash_realm' ? (
          <HashRealmQuest
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            onBackToMenu={() => { playSound('select'); setActiveChallengeWorldId(null); }}
            onCompleteSector={handleCompleteChallenge}
          />
        ) : activeChallengeWorldId === 'graph_galaxy' ? (
          <GraphGalaxyQuest
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            onBackToMenu={() => { playSound('select'); setActiveChallengeWorldId(null); }}
            onCompleteSector={handleCompleteChallenge}
          />
        ) : activeChallengeWorldId === 'dp_dimension' ? (
          <DPDimensionQuest
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            onBackToMenu={() => { playSound('select'); setActiveChallengeWorldId(null); }}
            onCompleteSector={handleCompleteChallenge}
          />
        ) : (
          <div className="flex-1 flex flex-col justify-between bg-[#040815]/95 border border-slate-850 rounded-2xl p-4 md:p-5 z-10 space-y-4 animate-fade-in relative overflow-hidden">
          
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

          {/* challenge header info */}
          <div className="flex justify-between items-center border-b border-slate-850 pb-2.5 shrink-0 z-10">
            <div>
              <span className={`text-[9px] font-mono tracking-widest font-bold uppercase ${selectedTheme.text}`}>
                {selectedWorld.challengeName}
              </span>
              <h3 className="text-base font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                {selectedWorld.name} Arena
                <span className="text-[9px] font-normal text-slate-400">({selectedWorld.complexity})</span>
              </h3>
            </div>
            <button
              onClick={() => { playSound('select'); setActiveChallengeWorldId(null); }}
              className="text-xs text-slate-400 hover:text-slate-200 font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded-md"
            >
              &lt; Abort Attempt
            </button>
          </div>

          {/* Interactive Core Gameplay Frame */}
          <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 bg-[#03050c] border border-slate-900 rounded-2xl relative min-h-[300px] z-10">
            
            {/* 1. ARRAY KINGDOM CHALLENGE */}
            {activeChallengeWorldId === 'array_kingdom' && (
              <div className="w-full max-w-md flex flex-col items-center gap-5">
                <span className="text-xs text-slate-300 font-mono text-center">
                  Drag/Swap adjacent memory slots to sort ascending (10, 20, 30, 40)
                </span>

                <div className="flex gap-3 justify-center w-full">
                  {arrayBlocks.map((block, idx) => (
                    <div
                      key={block.id}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="text-[10px] font-mono text-slate-500">INDEX [{idx}]</div>
                      <div className="relative w-16 h-16 bg-slate-900/80 border-2 border-purple-500/30 text-purple-400 font-mono font-black text-lg flex items-center justify-center rounded-xl shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                        {block.value}
                        <div className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                      </div>
                      
                      {/* Swapping Controls */}
                      <div className="flex gap-1.5 mt-1">
                        {idx > 0 && (
                          <button
                            onClick={() => swapArrayBlocks(idx, idx - 1)}
                            className="p-1 bg-slate-950 border border-slate-800 rounded text-[9px] hover:text-purple-400 font-mono hover:border-purple-800"
                          >
                            &lt; Swap
                          </button>
                        )}
                        {idx < arrayBlocks.length - 1 && (
                          <button
                            onClick={() => swapArrayBlocks(idx, idx + 1)}
                            className="p-1 bg-slate-950 border border-slate-800 rounded text-[9px] hover:text-purple-400 font-mono hover:border-purple-800"
                          >
                            Swap &gt;
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. LINKED LIST VILLAGE CHALLENGE */}
            {activeChallengeWorldId === 'linked_list_village' && (
              <div className="w-full max-w-lg flex flex-col items-center gap-5">
                <span className="text-xs text-slate-300 font-mono text-center">
                  Set Node A's Pointer target to C in order to bypass the corrupted Node B (99)
                </span>

                {/* Linked Nodes visual map representation */}
                <div className="flex flex-wrap items-center justify-center gap-4 py-4 w-full">
                  {linkedNodes.map((node, idx) => {
                    const isBypassed = node.id === 'B' && linkedNodes.find(n => n.id === 'A')?.next === 'C';
                    
                    return (
                      <React.Fragment key={node.id}>
                        <div className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 ${
                          node.corrupt 
                            ? isBypassed 
                              ? 'bg-slate-950/40 border-slate-900 text-slate-600 scale-90 opacity-40 line-through' 
                              : 'bg-red-950/30 border-red-500/80 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse'
                            : node.id === 'head' || node.id === 'tail'
                            ? 'bg-slate-900 border-slate-800 text-slate-400 font-bold'
                            : 'bg-cyan-950/20 border-cyan-500/40 text-cyan-300'
                        }`}>
                          <span className="text-[9px] font-mono text-slate-500 uppercase">{node.name}</span>
                          <span className="text-sm font-bold font-mono">{node.val}</span>
                          <span className="text-[9px] font-mono text-slate-400">
                            Next: <span className="text-yellow-400">{node.next || 'NULL'}</span>
                          </span>
                        </div>
                        {idx < linkedNodes.length - 1 && (
                          <div className={`text-slate-600 font-black flex items-center transition-all ${isBypassed && node.id === 'A' ? 'text-emerald-400' : ''}`}>
                            {isBypassed && node.id === 'A' ? '----------->' : '-->'}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Repair Actions */}
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => repairLinkedList('B')}
                    className={`px-4 py-2 text-xs font-mono rounded-xl border ${
                      linkedNodes.find(n => n.id === 'A')?.next === 'B'
                        ? 'bg-red-950/40 border-red-900 text-red-400'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    Set A.Next = Node B (Default Pointer)
                  </button>
                  <button
                    onClick={() => repairLinkedList('C')}
                    className={`px-4 py-2 text-xs font-mono rounded-xl border ${
                      linkedNodes.find(n => n.id === 'A')?.next === 'C'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-900 border-slate-800 hover:border-cyan-500 text-cyan-400'
                    }`}
                  >
                    Set A.Next = Node C (Bypass / Delete B)
                  </button>
                </div>
              </div>
            )}

            {/* 3. STACK MOUNTAIN CHALLENGE */}
            {activeChallengeWorldId === 'stack_mountain' && (
              <div className="w-full max-w-sm flex flex-col items-center gap-5">
                <span className="text-xs text-slate-300 font-mono text-center">
                  Form balanced sequence: <b className="text-blue-400">[ &lbrace; ( ) &rbrace; ]</b>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {/* Left Side: Dynamic Stack Container */}
                  <div className="border border-slate-800 bg-slate-950 rounded-2xl p-3 flex flex-col justify-end min-h-[160px] relative">
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-mono text-slate-600 uppercase tracking-widest">
                      LIFO Callstack Frame
                    </span>
                    <div className="flex flex-col-reverse gap-1.5 mt-4">
                      {stackItems.map((char, index) => (
                        <div
                          key={index}
                          className="w-full py-1.5 bg-blue-950/40 border border-blue-500/40 text-blue-300 font-mono text-center font-black text-xs rounded-lg animate-slide-up"
                        >
                          [{index}] • Value: {char}
                        </div>
                      ))}
                      {stackItems.length === 0 && (
                        <span className="text-[10px] font-mono text-slate-700 text-center py-6">
                          STACK_EMPTY
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Options and Actions */}
                  <div className="space-y-4 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {stackInput.map((char) => (
                        <button
                          key={char}
                          onClick={() => handlePushStack(char)}
                          className="w-10 h-10 bg-slate-900 border border-slate-800 hover:border-blue-500 hover:text-blue-400 font-mono font-black rounded-xl transition-all active:scale-95 text-slate-300 cursor-pointer"
                        >
                          {char}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 w-full">
                      <button
                        onClick={handlePopStack}
                        disabled={stackItems.length === 0}
                        className="flex-1 py-2 bg-red-950/20 hover:bg-red-900 border border-red-900/40 hover:border-red-600 rounded-xl text-xs font-mono font-bold text-red-400 disabled:opacity-30 cursor-pointer"
                      >
                        Pop Top
                      </button>
                      <button
                        onClick={() => resetChallenges('stack_mountain')}
                        className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. QUEUE CITY CHALLENGE */}
            {activeChallengeWorldId === 'queue_city' && (
              <div className="w-full max-w-sm flex flex-col items-center gap-5">
                <span className="text-xs text-slate-300 font-mono text-center">
                  Dequeue and process packets in arrival order to prevent cyclic buffer deadlock
                </span>

                {/* Queue Pipeline Blocks */}
                <div className="w-full border border-slate-800 bg-slate-950/80 rounded-2xl p-4 flex flex-col gap-4">
                  
                  {/* Unprocessed incoming buffer */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[9px] text-slate-500">
                      <span>INCOMING FIFO BUFFER (HEAD AT LEFT)</span>
                      <span className="text-emerald-400 font-bold">{queueBuffer.length} BLOCKS LEFT</span>
                    </div>
                    <div className="flex gap-1.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-850 overflow-x-auto">
                      {queueBuffer.map((packet, index) => (
                        <div
                          key={index}
                          className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-black shrink-0 ${
                            index === 0 
                              ? 'bg-emerald-950/50 border-emerald-500 text-emerald-400 animate-pulse' 
                              : 'bg-slate-950 border-slate-800 text-slate-500'
                          }`}
                        >
                          {index === 0 ? '★ ' : ''}PKT-{packet}
                        </div>
                      ))}
                      {queueBuffer.length === 0 && (
                        <span className="text-[10px] font-mono text-slate-700 py-2">NO INCOMING CHANNELS</span>
                      )}
                    </div>
                  </div>

                  {/* Processed outgoing pipeline */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">Processed Output Streams</span>
                    <div className="flex gap-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-850 overflow-x-auto min-h-[40px]">
                      {queueProcessed.map((packet, index) => (
                        <div
                          key={index}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-850 text-slate-400 font-mono text-[10px] rounded"
                        >
                          ✓ ST-{packet}
                        </div>
                      ))}
                      {queueProcessed.length === 0 && (
                        <span className="text-[10px] font-mono text-slate-700">WAITING FOR DEQUEUE...</span>
                      )}
                    </div>
                  </div>

                </div>

                <button
                  onClick={handleDequeue}
                  disabled={queueBuffer.length === 0}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs font-mono rounded-xl border border-emerald-500 shadow-[0_4px_15px_rgba(16,185,129,0.3)] disabled:opacity-40 cursor-pointer"
                >
                  Dequeue Front Packet (FIFO)
                </button>
              </div>
            )}

            {/* 5. TREE FOREST CHALLENGE */}
            {activeChallengeWorldId === 'tree_forest' && (
              <div className="w-full max-w-sm flex flex-col items-center gap-5">
                <span className="text-xs text-slate-300 font-mono text-center">
                  BST Rule Check: Route incoming key <b>{currentTreeInput}</b> relative to Root <b>50</b>
                </span>

                {/* Binary Search Tree Map Layout */}
                <div className="w-full h-40 relative border border-slate-900 bg-slate-950/80 rounded-2xl flex items-center justify-center p-4">
                  {/* Centered Root */}
                  <div className="absolute top-4 w-12 h-12 bg-slate-900 border border-amber-500 text-amber-400 font-mono font-black text-sm rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                    50
                  </div>

                  {/* Left branch nodes */}
                  <div className="absolute bottom-6 left-12 flex flex-col items-center">
                    <span className="text-[8px] font-mono text-slate-600">LEFT BRANCH &lt; 50</span>
                    <div className="flex gap-1.5 mt-1 min-h-[30px]">
                      {treeNodes.filter(n => n.side === 'left').map((n, i) => (
                        <div key={i} className="px-2.5 py-1 bg-amber-950/20 border border-amber-600/50 text-amber-300 font-mono text-xs font-black rounded-lg">
                          {n.value}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right branch nodes */}
                  <div className="absolute bottom-6 right-12 flex flex-col items-center">
                    <span className="text-[8px] font-mono text-slate-600">RIGHT BRANCH &gt; 50</span>
                    <div className="flex gap-1.5 mt-1 min-h-[30px]">
                      {treeNodes.filter(n => n.side === 'right').map((n, i) => (
                        <div key={i} className="px-2.5 py-1 bg-amber-950/20 border border-amber-600/50 text-amber-300 font-mono text-xs font-black rounded-lg">
                          {n.value}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connect lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="50%" y1="28%" x2="25%" y2="70%" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="50%" y1="28%" x2="75%" y2="70%" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
                  </svg>
                </div>

                {/* Routing buttons */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => handleTreeRoute('left')}
                    className="flex-1 py-2.5 bg-slate-900 border border-slate-800 hover:border-amber-500 text-amber-400 font-mono text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Route Left (&lt; 50)
                  </button>
                  <button
                    onClick={() => handleTreeRoute('right')}
                    className="flex-1 py-2.5 bg-slate-900 border border-slate-800 hover:border-amber-500 text-amber-400 font-mono text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Route Right (&gt; 50)
                  </button>
                </div>
              </div>
            )}

            {/* 6. HEAP CASTLE CHALLENGE */}
            {activeChallengeWorldId === 'heap_castle' && (
              <div className="w-full max-w-sm flex flex-col items-center gap-5">
                <span className="text-xs text-slate-300 font-mono text-center">
                  Restructure Max Heap! Click items of higher values to swap up to the root pinnacle
                </span>

                {/* Heap layout tree blocks */}
                <div className="w-full border border-slate-900 bg-slate-950/60 p-4 rounded-2xl relative space-y-3">
                  
                  {/* Level 0: Root */}
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[7px] font-mono text-slate-500">ROOT [0]</span>
                      <button
                        onClick={() => handleHeapify(0)}
                        className={`w-12 h-12 rounded-xl font-mono text-sm font-black border flex items-center justify-center transition-all ${
                          heapNodes[0] === 45
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-rose-500 hover:text-rose-400'
                        }`}
                      >
                        {heapNodes[0]}
                      </button>
                    </div>
                  </div>

                  {/* Level 1: Left & Right child nodes */}
                  <div className="flex justify-around">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[7px] font-mono text-slate-500">LEFT [1]</span>
                      <button
                        onClick={() => handleHeapify(1)}
                        className="w-10 h-10 bg-slate-900 border border-slate-800 hover:border-rose-500 hover:text-rose-400 rounded-lg font-mono text-xs font-black flex items-center justify-center"
                      >
                        {heapNodes[1]}
                      </button>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[7px] font-mono text-slate-500">RIGHT [2]</span>
                      <button
                        onClick={() => handleHeapify(2)}
                        className="w-10 h-10 bg-slate-900 border border-slate-800 hover:border-rose-500 hover:text-rose-400 rounded-lg font-mono text-xs font-black flex items-center justify-center"
                      >
                        {heapNodes[2]}
                      </button>
                    </div>
                  </div>

                  {/* Level 2: Children leafs */}
                  <div className="flex justify-between px-4">
                    {[3, 4, 5].map((valIdx) => (
                      <div key={valIdx} className="flex flex-col items-center gap-1">
                        <span className="text-[7px] font-mono text-slate-500">LEAF [{valIdx}]</span>
                        <button
                          onClick={() => handleHeapify(valIdx)}
                          className="w-8 h-8 bg-slate-900 border border-slate-850 hover:border-rose-500 hover:text-rose-400 rounded-md font-mono text-[10px] font-bold flex items-center justify-center"
                        >
                          {heapNodes[valIdx]}
                        </button>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="text-[10px] font-mono text-slate-500 text-center leading-normal">
                  Click any child node of larger value to swap up with parent!
                </div>
              </div>
            )}

            {/* 7. TRIE LIBRARY CHALLENGE */}
            {activeChallengeWorldId === 'trie_library' && (
              <div className="w-full max-w-sm flex flex-col items-center gap-5">
                <span className="text-xs text-slate-300 font-mono text-center">
                  walk prefix tree! Spell the target keyword: <b>REACT</b>
                </span>

                <div className="w-full py-4 bg-slate-950/80 border border-indigo-500/30 text-indigo-400 font-mono font-black text-xl text-center tracking-widest rounded-2xl shadow-[inset_0_1px_5px_rgba(0,0,0,0.8)]">
                  {trieCurrent} _ _ _
                </div>

                <div className="flex gap-2.5 justify-center w-full">
                  {['A', 'C', 'T', 'Z', 'M'].map((letter) => (
                    <button
                      key={letter}
                      onClick={() => handleTrieSpell(letter)}
                      className="w-11 h-11 bg-slate-900 border border-slate-800 hover:border-indigo-400 hover:text-indigo-400 font-mono font-black text-sm rounded-xl transition-all active:scale-95 cursor-pointer text-slate-300"
                    >
                      {letter}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => resetChallenges('trie_library')}
                  className="text-[10px] font-mono text-slate-500 hover:text-slate-300"
                >
                  Reset Spell-Route
                </button>
              </div>
            )}

            {/* 8. HASH REALM CHALLENGE */}
            {activeChallengeWorldId === 'hash_realm' && (
              <div className="w-full max-w-md flex flex-col items-center gap-5">
                <span className="text-xs text-slate-300 font-mono text-center">
                  Key <b>12</b> hashes to <b>index 2 (12 % 5 = 2)</b>. Address index 2 is taken by Key 7! Find next vacant slot.
                </span>

                {/* Hash slot matrix */}
                <div className="w-full flex flex-col gap-2">
                  {hashSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleHashProbe(idx)}
                      disabled={slot.key !== null}
                      className={`p-3.5 border rounded-xl font-mono text-xs font-bold text-left flex justify-between items-center transition-all ${
                        slot.key !== null
                          ? 'bg-red-950/20 border-red-900/50 text-red-400 cursor-not-allowed'
                          : selectedHashSlot === idx
                          ? 'bg-purple-950/30 border-purple-500 text-purple-400'
                          : 'bg-slate-900/80 border-slate-850 text-slate-300 hover:border-violet-500 hover:text-violet-400 active:scale-98'
                      }`}
                    >
                      <span>Index [{idx}] : {slot.label}</span>
                      {slot.key !== null ? (
                        <span className="text-[9px] bg-red-900/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">BLOCKED</span>
                      ) : (
                        <span className="text-[9px] bg-emerald-900/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">PROBE</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Dialog block */}
          <div className="p-3 bg-slate-950/90 border border-slate-900 rounded-xl flex items-start gap-2.5 z-10 shrink-0">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span className="text-xs font-mono text-slate-300 leading-relaxed">
              Compile algorithm core challenge logic to solve the region's secure lock and unlock sequence.
            </span>
          </div>

        </div>
        )
      ) : (
        /* --- MAIN TACTICAL MAP BOARD SCENE (2D/3D) --- */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1 z-10">
          
          {/* LEFT: Map Visual Panel (8 columns) */}
          <div className="lg:col-span-8 bg-slate-950/90 border border-slate-900 rounded-2xl relative p-4 overflow-hidden min-h-[350px] lg:min-h-[440px] flex items-center justify-center">
            
            {/* Ambient spatial grid and radial light */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-950 via-[#030611] to-slate-950 z-0" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />

            {/* Radar swept laser lines */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse pointer-events-none z-10" />

            {/* Interactive 3D Perspective container */}
            <div 
              className="absolute inset-0 z-10 transition-all duration-1000 ease-out flex items-center justify-center origin-center"
              style={{
                perspective: is3DView ? '1000px' : 'none',
                transform: is3DView 
                  ? 'rotateX(36deg) rotateY(0deg) rotateZ(-10deg) scale(0.96)' 
                  : 'none',
              }}
            >
              
              {/* Back shadows in 3D Mode */}
              {is3DView && (
                <div className="absolute inset-2 bg-black/60 filter blur-xl -z-10 rounded-3xl" />
              )}

              {/* Connecting glowing SVG wires */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                <defs>
                  <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                {WORLDS.map((world, idx) => {
                  if (idx === WORLDS.length - 1) return null;
                  const nextWorld = WORLDS[idx + 1];
                  const isPathCompleted = completedList.includes(world.id);
                  const nextUnlocked = isWorldUnlocked(nextWorld.id);

                  return (
                    <line
                      key={idx}
                      x1={`${world.x}%`}
                      y1={`${world.y}%`}
                      x2={`${nextWorld.x}%`}
                      y2={`${nextWorld.y}%`}
                      stroke={isPathCompleted ? '#10b981' : nextUnlocked ? '#06b6d4' : '#334155'}
                      strokeWidth={isPathCompleted ? '3' : '2'}
                      strokeDasharray={isPathCompleted ? 'none' : '4,4'}
                      className={`transition-all duration-1000 ${
                        isPathCompleted 
                          ? 'shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse' 
                          : nextUnlocked 
                          ? 'animate-dash' 
                          : ''
                      }`}
                    />
                  );
                })}
              </svg>

              {/* All 10 Sectors coordinates rendered */}
              {WORLDS.map((world, idx) => {
                const unlocked = isWorldUnlocked(world.id);
                const completed = completedList.includes(world.id);
                const isSelected = world.id === selectedWorldId;
                const isShaking = shakeWorldId === world.id;
                const theme = getThemeColorClass(world.themeColor);

                return (
                  <motion.div
                    key={world.id}
                    onClick={() => handleWorldClick(world)}
                    style={{
                      left: `${world.x}%`,
                      top: `${world.y}%`,
                    }}
                    whileHover={{ scale: unlocked ? 1.15 : 1 }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer flex flex-col items-center transition-all ${
                      isShaking ? 'animate-shake' : ''
                    }`}
                  >
                    
                    {/* Floating NPC avatar balloon bubble */}
                    {unlocked && (
                      <div className="absolute -top-10 flex flex-col items-center animate-bounce z-30">
                        <div className="bg-slate-900 border border-slate-800 text-[11px] px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-lg text-slate-200">
                          <span>{world.npcAvatar}</span>
                          <span className="font-mono text-[8px] tracking-wide font-extrabold uppercase">{world.npcTitle}</span>
                        </div>
                        <div className="w-1.5 h-1.5 bg-slate-900 border-r border-b border-slate-800 rotate-45 -mt-1" />
                      </div>
                    )}

                    {/* Cybernetic Circle Terminal node */}
                    <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center relative transition-all duration-700 ${
                      completed
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)]'
                        : unlocked
                        ? isSelected
                          ? `bg-slate-950 ${theme.activeBorder} ${theme.text} ${theme.glow} scale-110`
                          : 'bg-slate-900/90 border-cyan-500/50 text-cyan-400 hover:border-cyan-300'
                        : 'bg-slate-950 border-slate-850 text-slate-700'
                    }`}>
                      
                      {/* Interactive inside index label / lock icon */}
                      {!unlocked ? (
                        <Lock className="w-4 h-4 text-slate-700" />
                      ) : completed ? (
                        <Check className="w-4 h-4 text-emerald-400 font-black" />
                      ) : (
                        <span className="text-[10px] font-mono font-black">{idx + 1}</span>
                      )}

                      {/* Double Pulse Wave ring for uncompleted-active level */}
                      {unlocked && !completed && (
                        <span className="absolute -inset-1 rounded-full border border-cyan-400/40 animate-ping pointer-events-none" />
                      )}
                    </div>

                    {/* Sector Title Label Card */}
                    <div className={`mt-2 px-2 py-0.5 rounded-md whitespace-nowrap font-mono text-[9px] tracking-wide border shadow-lg transition-all ${
                      isSelected 
                        ? 'bg-slate-900 text-cyan-400 border-cyan-500 font-bold scale-105'
                        : completed
                        ? 'bg-slate-950/80 text-emerald-400/90 border-slate-900'
                        : unlocked
                        ? 'bg-slate-950/80 text-slate-300 border-slate-900'
                        : 'bg-slate-950/40 text-slate-700 border-transparent'
                    }`}>
                      {world.name}
                    </div>

                  </motion.div>
                );
              })}

            </div>

          </div>

          {/* RIGHT: Selected Sector Lore & NPC HUD (4 columns) */}
          <div className="lg:col-span-4 bg-slate-950/60 border border-slate-900 p-4 rounded-2xl flex flex-col justify-between space-y-4">
            
            {/* World parameters */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-md">
                  {selectedWorld.difficulty} Level
                </span>
                <span className={`text-[10px] font-mono font-black uppercase ${selectedTheme.text}`}>
                  Complexity: {selectedWorld.complexity}
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-100 tracking-tight font-sans">
                {selectedWorld.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed bg-[#030611] p-3 rounded-xl border border-slate-900">
                {selectedWorld.lore}
              </p>

              {/* Resident NPC Speech Bubble */}
              <div className="p-3 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-850 rounded-xl relative space-y-1.5 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{selectedWorld.npcAvatar}</span>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-200 uppercase">{selectedWorld.npcName}</h4>
                    <span className="text-[7px] font-mono text-cyan-400 uppercase tracking-widest">{selectedWorld.npcTitle}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed font-mono bg-black/40 p-2 rounded border border-slate-900/60">
                  "{activeNpcDialogue || selectedWorld.npcDialogueLocked}"
                </p>
              </div>

              {/* Side Quest Objective checklist */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase text-slate-500 font-extrabold block tracking-wider">Sector Quest & Bounty</span>
                <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      completedList.includes(selectedWorld.id) 
                        ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400' 
                        : 'border-slate-800 text-transparent'
                    }`}>
                      <Check className="w-3 h-3 font-black" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-300">{selectedWorld.questDescription}</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 font-bold">
                    {completedList.includes(selectedWorld.id) ? 'SOLVED' : '+150 XP'}
                  </span>
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="border-t border-slate-900 pt-3">
              <button
                onClick={handleLaunchWorldChallenge}
                disabled={!isWorldUnlocked(selectedWorld.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold font-sans tracking-wide transition-all flex items-center justify-center gap-2 border ${
                  isWorldUnlocked(selectedWorld.id)
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 border-purple-500 text-white shadow-[0_4px_15px_rgba(168,85,247,0.35)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-900 border-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                {isWorldUnlocked(selectedWorld.id) ? (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>LAUNCH DIGITAL ARENA</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                    <span>LOCKED BY PREVIOUS SECTOR</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* --- BOTTOM PROGRESS FOOTER BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-3 z-10 shrink-0 mt-3 gap-3">
        <div className="flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>Dimension Progress: <b className="text-slate-300">{completedList.length} / 10 Sectors</b> calibrated</span>
        </div>

        {/* Progression completion state bar */}
        <div className="w-full md:w-48 h-2 bg-slate-900 border border-slate-850 rounded-full overflow-hidden p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-1000"
            style={{ width: `${(completedList.length / 10) * 100}%` }}
          />
        </div>

        <span>PREMIUM BLUEPRINT ACTIVE • DIGITAL STEREO INTEGRATED</span>
      </div>

    </div>
  );
}
