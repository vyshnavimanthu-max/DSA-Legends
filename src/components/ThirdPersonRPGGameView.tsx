import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Zap, Swords, Shield, Backpack, Compass, Save, RotateCcw, 
  Sparkles, Volume2, VolumeX, RefreshCw, Skull, Award, Coins, Trash2, 
  CheckCircle, MessageSquare, HelpCircle, Trophy, Sparkle, Lock, Unlock, ArrowRight
} from 'lucide-react';
import { ProfileState, Guardian } from '../types';
import { GUARDIANS } from './CharacterSelectionView';

interface ThirdPersonRPGGameViewProps {
  profile: ProfileState;
  selectedWorldId?: string;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
}

// RPG Loot Items types
interface RPGItem {
  id: string;
  name: string;
  type: 'weapon' | 'shield' | 'potion' | 'crystal';
  statName: string;
  statValue: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  equipped: boolean;
  color: string;
  symbol: string;
  description: string;
}

// 3D Vector point
interface Point3D {
  x: number;
  y: number;
  z: number;
}

// 3D Particles
interface Particle {
  id: number;
  pos: Point3D;
  vel: Point3D;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

// Floating Text Numbers
interface FloatingText {
  id: number;
  pos: Point3D;
  text: string;
  color: string;
  life: number;
  size: number;
}

// Game Actor (Player / Enemies / NPCs)
interface Actor {
  id: string;
  type: 'player' | 'drone' | 'shooter' | 'boss' | 'npc';
  pos: Point3D;
  vel: Point3D;
  angle: number;
  targetAngle: number;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  color: string;
  aggro: boolean;
  lastAttackTime: number;
  patrolCenter: Point3D;
  patrolRadius: number;
  patrolAngle: number;
  state: 'idle' | 'patrol' | 'chase' | 'attack' | 'dead';
  stateTimer: number;
  name?: string;
  title?: string;
}

// Chest object
interface TreasureChest {
  id: string;
  pos: Point3D;
  opened: boolean;
  rarity: 'Epic' | 'Legendary';
  color: string;
  symbol: string;
}

// Collectable side-quest items
interface SideQuestCollectable {
  id: string;
  pos: Point3D;
  collected: boolean;
  color: string;
}

// Checkpoint interface
interface Checkpoint {
  id: string;
  name: string;
  pos: Point3D;
  active: boolean;
  color: string;
}

// Loot Drop 
interface LootDrop {
  id: string;
  pos: Point3D;
  item: RPGItem;
  angle: number;
  collected: boolean;
}

// Ranged Projectiles
interface Projectile {
  id: string;
  pos: Point3D;
  vel: Point3D;
  type: 'player_spell' | 'enemy_fireball' | 'boss_ring';
  damage: number;
  color: string;
  size: number;
  life: number;
}

// World Configuration Map
interface WorldConfig {
  id: string;
  name: string;
  themeColor: string;
  gridColor: string;
  ambientColor: string;
  npcName: string;
  npcTitle: string;
  npcAvatar: string;
  lore: string;
  questPrimary: string;
  questSide: string;
  bossName: string;
  bossTitle: string;
  bossColor: string;
  collectableSymbol: string;
  collectableName: string;
  introLines: string[];
}

export const WORLDS_CONFIG: Record<string, WorldConfig> = {
  array_kingdom: {
    id: 'array_kingdom',
    name: 'Array Kingdom',
    themeColor: '#a855f7',
    gridColor: '#1e113a',
    ambientColor: '#581c87',
    npcName: 'Index-Master Prime',
    npcTitle: 'Contiguous Sentry',
    npcAvatar: '🤖',
    lore: ' Bedrock sector where linear registers are packed consecutively in high-speed segments. Decoupled arrays process sequential data with O(1) index lookups.',
    questPrimary: 'Purge the Segment-Fault Sentry block and recalibrate the array root.',
    questSide: 'Locate 3 Contiguous Address Keys to lock the sector indexes.',
    bossName: 'SEGMENT_FAULT_CORE',
    bossTitle: 'Address Corruption Matrix',
    bossColor: '#ef4444',
    collectableSymbol: '🔑',
    collectableName: 'Address Key',
    introLines: [
      "DIAGNOSTIC REPORT: Rogue virus strains are fragmenting the Contiguous Segments of Array Kingdom.",
      "If the index mappings collapse, a global system deref leak will occur.",
      "Guardian, establish connection, search the linear segments, and purge the faulty core."
    ]
  },
  linked_list_village: {
    id: 'linked_list_village',
    name: 'Linked List Village',
    themeColor: '#06b6d4',
    gridColor: '#082535',
    ambientColor: '#155e75',
    npcName: 'Pointer-Slinger Link',
    npcTitle: 'Chain Linker',
    npcAvatar: '🏹',
    lore: 'Settlement where memory nodes are scattered across Heap space, chained strictly by pointer addresses.',
    questPrimary: 'Sever the corrupted Node Leak and heal the dangling pointers.',
    questSide: 'Rescue 3 lost Pointer Nodes wandering in the unallocated heap.',
    bossName: 'DANGLING_PTR_LEACH',
    bossTitle: 'Garbage Collection Phantom',
    bossColor: '#f43f5e',
    collectableSymbol: '🔗',
    collectableName: 'Pointer Node',
    introLines: [
      "SECTOR ALARM: Pointers are dereferencing. Circular links have caused recursion loops.",
      "The heap is flooding with memory leaks. Pointer-Slinger Link has sent a distress signal.",
      "Locate the Dangling Pointer Leach and re-balance the Sequential Chain."
    ]
  },
  stack_mountain: {
    id: 'stack_mountain',
    name: 'Stack Mountain',
    themeColor: '#3b82f6',
    gridColor: '#0c1b35',
    ambientColor: '#1e3a8a',
    npcName: 'CallStack Sherpa',
    npcTitle: 'LIFO Spire Guide',
    npcAvatar: '🧗',
    lore: 'Vertical execution spire operating on strict Last-In-First-Out call frames.',
    questPrimary: 'Scale the execution summit and clear the Stack Overflow Daemon.',
    questSide: 'Retrieve 3 balanced bracket brackets to align memory boundaries.',
    bossName: 'STACK_OVERFLOW_LORD',
    bossTitle: 'Infinite Recursion Monarch',
    bossColor: '#ef4444',
    collectableSymbol: '💎',
    collectableName: 'Bracket Core',
    introLines: [
      "WARNING: Stack overflow is imminent. Overlapping execution frames are freezing processor cores.",
      "We must push frames carefully, maintaining balanced brackets to descend the vertical spire.",
      "Reach the peak, coordinate with the Sherpa, and pop the Overflow Lord off the stack."
    ]
  },
  queue_city: {
    id: 'queue_city',
    name: 'Queue City',
    themeColor: '#10b981',
    gridColor: '#062d22',
    ambientColor: '#065f46',
    npcName: 'Buffer-Baron FIFO',
    npcTitle: 'Traffic Coordinator',
    npcAvatar: '🚇',
    lore: 'Asynchronous network transit hub scheduling packet buffers in First-In-First-Out order.',
    questPrimary: 'Bypass the deadlocked buffer lock and reset packet flow pipeline.',
    questSide: 'Collect 3 prioritized packet buffers dropped in the congestion zone.',
    bossName: 'DEADLOCK_SCHEDULER',
    bossTitle: 'Thread Starvation Fiend',
    bossColor: '#ec4899',
    collectableSymbol: '📦',
    collectableName: 'Packet Core',
    introLines: [
      "TRANSIT BLOCK: Incoming data packets are starved. Thread allocation has deadlocked.",
      "Buffer-Baron FIFO needs an Algorithm Guardian to resolve queue starvation.",
      "Clear packet congestion, avoid cycle buffers, and dismantle the rogue Scheduler."
    ]
  },
  tree_forest: {
    id: 'tree_forest',
    name: 'Tree Forest',
    themeColor: '#f59e0b',
    gridColor: '#351f08',
    ambientColor: '#78350f',
    npcName: 'Arch-Druid AVL',
    npcTitle: 'Log-N Balance Elder',
    npcAvatar: '🧝',
    lore: 'Recursive branching sanctuary keeping keys symmetrical in perfect balanced BST logs.',
    questPrimary: 'Defeat the Skewed Tree Specter which degrades search efficiency to O(N).',
    questSide: 'Gather 3 balanced Leaf Nodes to fertilize the AVL root.',
    bossName: 'SKEWED_RED_BLACK',
    bossTitle: 'Asymmetric Tree Corrupter',
    bossColor: '#f43f5e',
    collectableSymbol: '🍁',
    collectableName: 'Leaf Core',
    introLines: [
      "FOREST INTRUSION: The organic binary trees are tilting. Skewed growth has bloated lookup times.",
      "We must re-balance with left-right rotations to preserve Log-N lookup speed.",
      "Coordinate with the AVL Sage, find the core nodes, and restore binary balance."
    ]
  },
  heap_castle: {
    id: 'heap_castle',
    name: 'Heap Castle',
    themeColor: '#f43f5e',
    gridColor: '#350a14',
    ambientColor: '#881337',
    npcName: 'King Priority',
    npcTitle: 'Binary Summit Monarch',
    npcAvatar: '👑',
    lore: 'Hierarchical bastion maintaining the absolute maximum key at the root summit at all times.',
    questPrimary: 'Purge the Min-Heap Impostor attempting to overthrow maximum priority.',
    questSide: 'Reclaim 3 Priority Sigils hidden around the castle ramparts.',
    bossName: 'MIN_HEAP_IMPOSTOR',
    bossTitle: 'Reversed Priority Construct',
    bossColor: '#a855f7',
    collectableSymbol: '🛡️',
    collectableName: 'Priority Sigil',
    introLines: [
      "THREAT IDENTIFIED: An inverted Min-Heap entity is corrupting the Priority Throne.",
      "Only the ultimate maximum element can sit at the summit. Bubble up the worthy!",
      "Scale the castle, retrieve the crowns, and dethrone the inverted impostor."
    ]
  },
  trie_library: {
    id: 'trie_library',
    name: 'Trie Library',
    themeColor: '#6366f1',
    gridColor: '#12133a',
    ambientColor: '#312e81',
    npcName: 'Archivist Prefix',
    npcTitle: 'Text Token Curator',
    npcAvatar: '🧙',
    lore: 'Infinite dictionary archive indexing text chains and spell lookup paths.',
    questPrimary: 'Banish the Keyword Corruptor erasing prefix string paths.',
    questSide: 'Collect 3 Spell Prefix tokens to rebuild the index dictionary.',
    bossName: 'KEYWORD_ERASER',
    bossTitle: 'Index Wipe Agent',
    bossColor: '#ef4444',
    collectableSymbol: '📜',
    collectableName: 'Prefix Token',
    introLines: [
      "RESTRICTED ARCHIVE: Word search trees are collapsing. Autocomplete pathways are turning blank.",
      "The Archivist requires assistance spelling word chains from root nodes.",
      "Re-link prefix nodes to locate the Keyword Eraser lurking in the text indexes."
    ]
  },
  hash_realm: {
    id: 'hash_realm',
    name: 'Hash Realm',
    themeColor: '#8b5cf6',
    gridColor: '#220e3a',
    ambientColor: '#4c1d95',
    npcName: 'Key-Keeper Crypto',
    npcTitle: 'Constant Time Director',
    npcAvatar: '🔮',
    lore: 'Quantum coordinate dimension mapping keys directly to constant-time O(1) slots.',
    questPrimary: 'Annihilate the Collision Dragon clogging database address buffers.',
    questSide: 'Collect 3 Probe Resolvers to bypass collision clusters.',
    bossName: 'COLLISION_FIEND',
    bossTitle: 'Quadratic Overload Daemon',
    bossColor: '#ec4899',
    collectableSymbol: '🔑',
    collectableName: 'Probe Core',
    introLines: [
      "COLLISION DETECTED: Rogue address queries have flooded slot indexes, stalling O(1) speeds.",
      "Key-Keeper Crypto is locked. Linear probing has reached its limits.",
      "Clear the collision matrices, unlock vacant registers, and destroy the Collision Fiend."
    ]
  },
  graph_galaxy: {
    id: 'graph_galaxy',
    name: 'Graph Galaxy',
    themeColor: '#ec4899',
    gridColor: '#350a25',
    ambientColor: '#831843',
    npcName: 'Navigator Star-Edge',
    npcTitle: 'Warp Route Pilot',
    npcAvatar: '👩‍✈️',
    lore: 'Mesh galaxy of vertices connected by weighted vector paths. Traversed using edge relaxation.',
    questPrimary: 'Sever the rogue Cycle Loop dragging warp drives into infinite loops.',
    questSide: 'Collect 3 Edge Relays to calibrate Dijkstra warp lanes.',
    bossName: 'INFINITY_CYCLE_CORE',
    bossTitle: 'Deadlocked Routing Vortex',
    bossColor: '#ef4444',
    collectableSymbol: '📡',
    collectableName: 'Edge Relay',
    introLines: [
      "COORDINATE OUT OF RANGE: An infinite cycle has trapped warp pilots in a weighted loop.",
      "Dijkstra calculations have diverged. Navigator Star-Edge requests immediate shortest-path routing.",
      "Plot shortest distance routes, avoid circular vertices, and disable the routing vortex."
    ]
  },
  dp_dimension: {
    id: 'dp_dimension',
    name: 'DP Dimension',
    themeColor: '#f97316',
    gridColor: '#351a0a',
    ambientColor: '#7c2d12',
    npcName: 'Chronos Memo',
    npcTitle: 'Memoization Overlord',
    npcAvatar: '⏳',
    lore: 'Infinite grid of cached overlapping subproblems, solving space-time equations in linear speeds.',
    questPrimary: 'Eradicate the Exponential Recursion Overlord slowing computation to an absolute crawl.',
    questSide: 'Capture 3 memoized registers dropped across the matrix dimensions.',
    bossName: 'RECURSIVE_EXPONENT',
    bossTitle: 'O(2^N) Space-Time Consumer',
    bossColor: '#ef4444',
    collectableSymbol: '⏱️',
    collectableName: 'Memo Core',
    introLines: [
      "CRITICAL THREAT: Redundant subproblem calculation has pushed processing times to eternity.",
      "We must memoize intermediate results to flatten time itself back into linear speeds.",
      "Help Chronos Memo cache overlapping branches, and crush the Recursive Exponent."
    ]
  }
};

export default function ThirdPersonRPGGameView({ 
  profile, 
  selectedWorldId = 'array_kingdom', 
  onUpdateProfile, 
  onBackToMenu 
}: ThirdPersonRPGGameViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load World Configuration
  const worldConfig = WORLDS_CONFIG[selectedWorldId] || WORLDS_CONFIG.array_kingdom;

  // Active Guardian Profile
  const activeGuardian = GUARDIANS.find(g => g.id === profile.selectedGuardianId) || GUARDIANS[0];

  // Game UI & HUD State
  const [playerHP, setPlayerHP] = useState(100);
  const [playerMaxHP, setPlayerMaxHP] = useState(100);
  const [playerMP, setPlayerMP] = useState(50);
  const [playerMaxMP, setPlayerMaxMP] = useState(50);
  const [playerXP, setPlayerXP] = useState(0);
  const [playerNextLevelXP, setPlayerNextLevelXP] = useState(100);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerGold, setPlayerGold] = useState(50);
  const [gameMessage, setGameMessage] = useState(`Synchronized into ${worldConfig.name}. Clear rogue threads!`);
  const [savedSuccessAlert, setSavedSuccessAlert] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Quests Trackers
  const [pointerFragmentsCollected, setPointerFragmentsCollected] = useState(0);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [sideQuestCompleted, setSideQuestCompleted] = useState(false);

  // Cinematic States
  const [cinematicStage, setCinematicStage] = useState<'intro' | 'boss_intro' | 'none' | 'victory'>('intro');
  const [cinematicLineIdx, setCinematicLineIdx] = useState(0);
  const [cinematicTypedText, setCinematicTypedText] = useState('');
  const [cinematicCameraAngle, setCinematicCameraAngle] = useState(0);

  // NPC Dialogue States
  const [dialogueActive, setDialogueActive] = useState(false);
  const [dialogueText, setDialogueText] = useState('');
  const [dialogueNode, setDialogueNode] = useState<'greet' | 'lore' | 'quest' | 'secret'>('greet');

  // Cooldowns
  const [ability1Cooldown, setAbility1Cooldown] = useState(0);
  const [ability2Cooldown, setAbility2Cooldown] = useState(0);
  const [dodgeCooldown, setDodgeCooldown] = useState(0);

  // RPG Inventory
  const [inventory, setInventory] = useState<RPGItem[]>([
    { id: 'start_blade', name: 'Standard Katana', type: 'weapon', statName: 'Damage', statValue: 12, rarity: 'Common', equipped: true, color: '#a855f7', symbol: '⚔️', description: 'Standard cyberdeck slicing edge.' },
    { id: 'start_shield', name: 'LIFO Ward', type: 'shield', statName: 'Defense', statValue: 5, rarity: 'Common', equipped: true, color: '#3b82f6', symbol: '🛡️', description: 'Basic sequential shielding barrier.' }
  ]);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  // Constants
  const GRAVITY = -0.3;
  const PLAYER_SPEED = 0.16;
  const DODGE_SPEED = 0.42;
  const GRID_SIZE = 120;

  // Game Engine Reference Refs
  const playerRef = useRef<Actor>({
    id: 'player',
    type: 'player',
    pos: { x: 0, y: 0, z: -10 },
    vel: { x: 0, y: 0, z: 0 },
    angle: 0,
    targetAngle: 0,
    health: 100,
    maxHealth: 100,
    speed: PLAYER_SPEED,
    damage: 15,
    color: worldConfig.themeColor,
    aggro: false,
    lastAttackTime: 0,
    patrolCenter: { x: 0, y: 0, z: 0 },
    patrolRadius: 0,
    patrolAngle: 0,
    state: 'idle',
    stateTimer: 0
  });

  const cameraRef = useRef({
    yaw: -Math.PI / 2,
    pitch: 0.35,
    zoom: 11,
    targetZoom: 11,
    x: 0,
    y: 5,
    z: -20
  });

  const keysRef = useRef<Record<string, boolean>>({});
  const mouseRef = useRef({ isDown: false, startX: 0, startY: 0 });

  // Entity Lists
  const actorsRef = useRef<Actor[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const lootDropsRef = useRef<LootDrop[]>([]);
  const checkpointsRef = useRef<Checkpoint[]>([
    { id: 'start', name: 'Central Register Node', pos: { x: 0, y: 0, z: -10 }, active: true, color: '#10b981' },
    { id: 'outpost', name: `${worldConfig.name} Portal`, pos: { x: 0, y: 0, z: 25 }, active: false, color: '#06b6d4' }
  ]);

  // World specific interactive entities
  const chestsRef = useRef<TreasureChest[]>([]);
  const collectablesRef = useRef<SideQuestCollectable[]>([]);
  
  // Secret Wall & Room properties
  const secretWallRef = useRef<{ pos: Point3D; size: Point3D; health: number; maxHealth: number; destroyed: boolean }>({
    pos: { x: 18, y: 1.5, z: 12 },
    size: { x: 6, y: 3, z: 3 },
    health: 45,
    maxHealth: 45,
    destroyed: false
  });

  const playerDodgeTimer = useRef(0);
  const playerDodgeDir = useRef({ x: 0, z: 0 });
  const playerAttackSwingTimer = useRef(0);
  const playerBuffShieldActive = useRef(false);
  const playerShieldTimer = useRef(0);

  // Static Obstacles in world
  const staticObstacles = useRef<{ pos: Point3D; size: Point3D; color: string }[]>([
    { pos: { x: -8, y: 1.5, z: 8 }, size: { x: 3, y: 3, z: 3 }, color: '#1e293b' },
    { pos: { x: 10, y: 1.5, z: 6 }, size: { x: 3, y: 3, z: 3 }, color: '#1e293b' },
    { pos: { x: -14, y: 2, z: -4 }, size: { x: 4, y: 4, z: 4 }, color: '#334155' },
    { pos: { x: 16, y: 2.5, z: 24 }, size: { x: 5, y: 5, z: 5 }, color: '#334155' }
  ]);

  // Safe Web Audio Synthesizer
  const triggerAudioEffect = (type: 'slash' | 'spell' | 'hit' | 'heal' | 'levelup' | 'save' | 'dodge' | 'defeat' | 'boss_roar' | 'explosion' | 'collect') => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      switch (type) {
        case 'slash':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(1100, now + 0.15);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now); osc.stop(now + 0.15);
          break;
        case 'spell':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.linearRampToValueAtTime(800, now + 0.3);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now); osc.stop(now + 0.3);
          break;
        case 'hit':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.linearRampToValueAtTime(60, now + 0.1);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now); osc.stop(now + 0.1);
          break;
        case 'collect':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(783.99, now + 0.1);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now); osc.stop(now + 0.25);
          break;
        case 'explosion':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.linearRampToValueAtTime(30, now + 0.4);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.start(now); osc.stop(now + 0.4);
          break;
        case 'heal':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(350, now);
          osc.frequency.setValueAtTime(550, now + 0.1);
          osc.frequency.setValueAtTime(750, now + 0.2);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now); osc.stop(now + 0.35);
          break;
        case 'levelup':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(261.6, now);
          osc.frequency.setValueAtTime(392.0, now + 0.12);
          osc.frequency.setValueAtTime(523.3, now + 0.24);
          osc.frequency.exponentialRampToValueAtTime(1046, now + 0.5);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
          osc.start(now); osc.stop(now + 0.65);
          break;
        case 'dodge':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(700, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now); osc.stop(now + 0.18);
          break;
        case 'save':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.3, now);
          osc.frequency.setValueAtTime(1174.6, now + 0.2);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.start(now); osc.stop(now + 0.4);
          break;
        case 'defeat':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.linearRampToValueAtTime(35, now + 0.8);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          osc.start(now); osc.stop(now + 0.8);
          break;
        case 'boss_roar':
          osc.type = 'square';
          osc.frequency.setValueAtTime(80, now);
          osc.frequency.linearRampToValueAtTime(40, now + 1.2);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc.start(now); osc.stop(now + 1.2);
          break;
      }
    } catch (e) {
      // Audio context error recovery
    }
  };

  // Spark Generator
  const spawnParticles = (pos: Point3D, color: string, count = 12, speedMultiplier = 1.0) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const heightAngle = (Math.random() - 0.5) * Math.PI;
      const speed = (0.05 + Math.random() * 0.1) * speedMultiplier;
      particlesRef.current.push({
        id: Math.random(),
        pos: { ...pos },
        vel: {
          x: Math.cos(angle) * Math.cos(heightAngle) * speed,
          y: Math.sin(heightAngle) * speed + 0.05,
          z: Math.sin(angle) * Math.cos(heightAngle) * speed
        },
        color,
        size: 1.5 + Math.random() * 2,
        life: 0,
        maxLife: 15 + Math.floor(Math.random() * 20)
      });
    }
  };

  // Floating text indicators
  const spawnFloatingText = (pos: Point3D, text: string, color = '#ff3333', size = 15) => {
    floatingTextsRef.current.push({
      id: Math.random(),
      pos: { ...pos, y: pos.y + 1.2 },
      text,
      color,
      life: 0,
      size
    });
  };

  // Setup/Reset Entities based on loaded world
  const initLevel = () => {
    const theme = worldConfig.themeColor;
    
    // Reset trackers
    setPointerFragmentsCollected(0);
    setBossDefeated(false);
    setSideQuestCompleted(false);

    // Initial player coordinates
    playerRef.current.pos = { x: 0, y: 0, z: -10 };
    playerRef.current.health = playerMaxHP;

    // Reset chest coordinates
    chestsRef.current = [
      { id: 'chest_common', pos: { x: -14, y: 0, z: 12 }, opened: false, rarity: 'Epic', color: theme, symbol: '📦' },
      { id: 'chest_secret', pos: { x: 22, y: 0, z: 12 }, opened: false, rarity: 'Legendary', color: '#eab308', symbol: '🔱' }
    ];

    // Reset breakable wall
    secretWallRef.current = {
      pos: { x: 18, y: 1.5, z: 12 },
      size: { x: 6, y: 3, z: 3 },
      health: 45,
      maxHealth: 45,
      destroyed: false
    };

    // Spawn 3 collectable side quest items scattered across the landscape
    collectablesRef.current = [
      { id: 'item_1', pos: { x: -18, y: 0.6, z: 20 }, collected: false, color: theme },
      { id: 'item_2', pos: { x: 12, y: 0.6, z: -5 }, collected: false, color: theme },
      { id: 'item_3', pos: { x: -5, y: 0.6, z: 35 }, collected: false, color: theme }
    ];

    // Spawn Rogue AI actors
    actorsRef.current = [
      // friendly companion NPC
      { 
        id: 'npc_companion', 
        type: 'npc', 
        pos: { x: -3, y: 0, z: -4 }, 
        vel: { x: 0, y: 0, z: 0 }, 
        angle: 0, targetAngle: 0, 
        health: 100, maxHealth: 100, 
        speed: 0, damage: 0, 
        color: '#10b981', aggro: false, lastAttackTime: 0, 
        patrolCenter: { x: -3, y: 0, z: -4 }, patrolRadius: 0, patrolAngle: 0, 
        state: 'idle', stateTimer: 0,
        name: worldConfig.npcName,
        title: worldConfig.npcTitle
      },

      // Section 1 Sentry Drones
      { 
        id: 'drone1', 
        type: 'drone', 
        pos: { x: -8, y: 0, z: 14 }, 
        vel: { x: 0, y: 0, z: 0 }, 
        angle: 0, targetAngle: 0, 
        health: 40, maxHealth: 40, 
        speed: 0.05, damage: 8, 
        color: theme, aggro: false, lastAttackTime: 0, 
        patrolCenter: { x: -8, y: 0, z: 14 }, patrolRadius: 4, patrolAngle: 0, 
        state: 'patrol', stateTimer: 0 
      },
      { 
        id: 'drone2', 
        type: 'drone', 
        pos: { x: 8, y: 0, z: 14 }, 
        vel: { x: 0, y: 0, z: 0 }, 
        angle: 0, targetAngle: 0, 
        health: 40, maxHealth: 40, 
        speed: 0.05, damage: 8, 
        color: theme, aggro: false, lastAttackTime: 0, 
        patrolCenter: { x: 8, y: 0, z: 14 }, patrolRadius: 4, patrolAngle: Math.PI, 
        state: 'patrol', stateTimer: 0 
      },

      // Section 2 Shooter AI
      { 
        id: 'shooter1', 
        type: 'shooter', 
        pos: { x: -14, y: 0, z: 32 }, 
        vel: { x: 0, y: 0, z: 0 }, 
        angle: 0, targetAngle: 0, 
        health: 55, maxHealth: 55, 
        speed: 0.02, damage: 12, 
        color: '#3b82f6', aggro: false, lastAttackTime: 0, 
        patrolCenter: { x: -14, y: 0, z: 32 }, patrolRadius: 0, patrolAngle: 0, 
        state: 'idle', stateTimer: 0 
      },
      { 
        id: 'shooter2', 
        type: 'shooter', 
        pos: { x: 14, y: 0, z: 32 }, 
        vel: { x: 0, y: 0, z: 0 }, 
        angle: 0, targetAngle: 0, 
        health: 55, maxHealth: 55, 
        speed: 0.02, damage: 12, 
        color: '#3b82f6', aggro: false, lastAttackTime: 0, 
        patrolCenter: { x: 14, y: 0, z: 32 }, patrolRadius: 0, patrolAngle: 0, 
        state: 'idle', stateTimer: 0 
      },

      // Boss Arena Gatekeeper Elite
      { 
        id: 'gatekeeper1', 
        type: 'drone', 
        pos: { x: 0, y: 0, z: 50 }, 
        vel: { x: 0, y: 0, z: 0 }, 
        angle: 0, targetAngle: 0, 
        health: 75, maxHealth: 75, 
        speed: 0.06, damage: 15, 
        color: '#ec4899', aggro: false, lastAttackTime: 0, 
        patrolCenter: { x: 0, y: 0, z: 50 }, patrolRadius: 3, patrolAngle: 0, 
        state: 'patrol', stateTimer: 0 
      },

      // GIANT ROGUE AI BOSS OF THE KINGDOM
      { 
        id: 'world_boss', 
        type: 'boss', 
        pos: { x: 0, y: 0, z: 72 }, 
        vel: { x: 0, y: 0, z: 0 }, 
        angle: Math.PI, targetAngle: Math.PI, 
        health: 450, maxHealth: 450, 
        speed: 0.04, damage: 20, 
        color: worldConfig.bossColor, aggro: false, lastAttackTime: 0, 
        patrolCenter: { x: 0, y: 0, z: 72 }, patrolRadius: 0, patrolAngle: 0, 
        state: 'idle', stateTimer: 0,
        name: worldConfig.bossName,
        title: worldConfig.bossTitle
      }
    ];

    projectilesRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    lootDropsRef.current = [];

    // Trigger Typewriter Intro Cutscene
    setCinematicStage('intro');
    setCinematicLineIdx(0);
    setCinematicTypedText('');
    setCinematicCameraAngle(0);
  };

  // Keyboard Event Bindings
  useEffect(() => {
    initLevel();

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;

      // Melee Swing (Space, F)
      if (e.key === ' ' || e.key.toLowerCase() === 'f') {
        e.preventDefault();
        triggerMeleeAttack();
      }

      // Roll / Dodge Shift
      if (e.key === 'Shift') {
        e.preventDefault();
        triggerDodgeRoll();
      }

      // Q skill
      if (e.key.toLowerCase() === 'q') triggerAbility1();

      // E skill (interact/buff)
      if (e.key.toLowerCase() === 'e') {
        if (!interactWithWorld()) {
          triggerAbility2();
        }
      }

      // I Inventory Bag
      if (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'b') {
        setIsInventoryOpen(prev => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true;
      mouseRef.current.startX = e.clientX;
      mouseRef.current.startY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseRef.current.isDown) return;
      const dx = e.clientX - mouseRef.current.startX;
      const dy = e.clientY - mouseRef.current.startY;

      cameraRef.current.yaw -= dx * 0.007;
      cameraRef.current.pitch = Math.max(0.1, Math.min(Math.PI / 2.2, cameraRef.current.pitch + dy * 0.005));

      mouseRef.current.startX = e.clientX;
      mouseRef.current.startY = e.clientY;
    };

    const handleMouseUp = () => { mouseRef.current.isDown = false; };

    // Touch event handlers for mobile/tablet camera drag
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.isDown = true;
        mouseRef.current.startX = e.touches[0].clientX;
        mouseRef.current.startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!mouseRef.current.isDown || e.touches.length === 0) return;
      const dx = e.touches[0].clientX - mouseRef.current.startX;
      const dy = e.touches[0].clientY - mouseRef.current.startY;

      cameraRef.current.yaw -= dx * 0.007;
      cameraRef.current.pitch = Math.max(0.1, Math.min(Math.PI / 2.2, cameraRef.current.pitch + dy * 0.005));

      mouseRef.current.startX = e.touches[0].clientX;
      mouseRef.current.startY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => { mouseRef.current.isDown = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [selectedWorldId]);

  // Handle Level Up
  const handleLevelUp = () => {
    triggerAudioEffect('levelup');
    setPlayerLevel((prev) => {
      const nextLvl = prev + 1;
      const nextHP = 100 + nextLvl * 15;
      const nextMP = 50 + nextLvl * 5;

      setPlayerMaxHP(nextHP);
      setPlayerHP(nextHP);
      setPlayerMaxMP(nextMP);
      setPlayerMP(nextMP);

      playerRef.current.damage += 3;
      playerRef.current.maxHealth = nextHP;
      playerRef.current.health = nextHP;

      setGameMessage(`COMPILER BOOST: Level ${nextLvl}! Core damage and stability upgraded.`);
      spawnFloatingText(playerRef.current.pos, `CORE BOOST!`, '#f59e0b', 22);
      spawnParticles(playerRef.current.pos, '#f59e0b', 35, 2.0);

      return nextLvl;
    });

    setPlayerNextLevelXP((prev) => Math.floor(prev * 1.35));
  };

  // Melee Attack Sweep
  const triggerMeleeAttack = () => {
    if (playerAttackSwingTimer.current > 0 || playerHP <= 0 || cinematicStage !== 'none') return;
    playerAttackSwingTimer.current = 10; // swing duration frames
    triggerAudioEffect('slash');

    const player = playerRef.current;
    const damage = player.damage;

    // Check hit against secret wall
    const sWall = secretWallRef.current;
    if (!sWall.destroyed) {
      const dx = sWall.pos.x - player.pos.x;
      const dz = sWall.pos.z - player.pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 4.5) {
        sWall.health = Math.max(0, sWall.health - damage);
        spawnFloatingText(sWall.pos, `-${damage} HIT`, '#f97316', 15);
        spawnParticles(sWall.pos, '#f97316', 6);
        triggerAudioEffect('hit');

        if (sWall.health <= 0) {
          sWall.destroyed = true;
          triggerAudioEffect('explosion');
          spawnParticles(sWall.pos, '#f97316', 40, 2.0);
          setGameMessage('HIDDEN ARCHIVE EXPOSED! Sector lock decrypted.');
          spawnFloatingText(sWall.pos, 'SECTOR BROKEN!', '#ef4444', 18);
        }
      }
    }

    // Check hit against enemies
    actorsRef.current.forEach((enemy) => {
      if (enemy.health <= 0 || enemy.type === 'npc') return;

      const dx = enemy.pos.x - player.pos.x;
      const dz = enemy.pos.z - player.pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 2.8) {
        // Sweep direction check
        const angleToEnemy = Math.atan2(dx, dz);
        let angleDiff = Math.abs(angleToEnemy - player.angle);
        while (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

        if (angleDiff < Math.PI / 1.5) {
          enemy.health = Math.max(0, enemy.health - damage);
          triggerAudioEffect('hit');
          enemy.pos.x += Math.sin(player.angle) * 0.5;
          enemy.pos.z += Math.cos(player.angle) * 0.5;

          spawnFloatingText(enemy.pos, `-${damage}`, '#ef4444', 16);
          spawnParticles(enemy.pos, enemy.color, 8);

          enemy.aggro = true;
          enemy.state = 'chase';

          if (enemy.health <= 0) {
            handleEnemyDefeat(enemy);
          }
        }
      }
    });
  };

  const handleEnemyDefeat = (enemy: Actor) => {
    const isBoss = enemy.type === 'boss';
    const xpGained = isBoss ? 300 : 25;
    const goldGained = isBoss ? 100 : 15 + Math.floor(Math.random() * 10);

    spawnFloatingText(enemy.pos, `+${xpGained} XP`, '#10b981', 18);
    spawnFloatingText({ ...enemy.pos, x: enemy.pos.x - 0.5 }, `+${goldGained} Gold`, '#eab308', 15);

    setPlayerXP((prev) => {
      const total = prev + xpGained;
      if (total >= playerNextLevelXP) {
        setTimeout(() => handleLevelUp(), 100);
        return total - playerNextLevelXP;
      }
      return total;
    });

    setPlayerGold((prev) => prev + goldGained);

    // Spawn dynamic loot drop
    if (Math.random() > 0.4 || isBoss) {
      spawnLootDrop(enemy.pos);
    }

    if (isBoss) {
      setBossDefeated(true);
      setCinematicStage('victory');
      triggerAudioEffect('levelup');
      setGameMessage(`VICTORY! ${worldConfig.bossName} has been purged from ${worldConfig.name}!`);
      // Update profile
      const currentCompleted = profile.completedWorlds || [];
      if (!currentCompleted.includes(selectedWorldId)) {
        onUpdateProfile({
          completedWorlds: [...currentCompleted, selectedWorldId],
          points: profile.points + 200
        });
      }
    } else {
      setGameMessage(`Terminated rogue process: ${enemy.type.toUpperCase()}`);
    }
  };

  const triggerDodgeRoll = () => {
    if (dodgeCooldown > 0 || playerHP <= 0 || playerDodgeTimer.current > 0 || cinematicStage !== 'none') return;
    playerDodgeTimer.current = 14;
    triggerAudioEffect('dodge');

    let dx = 0; let dz = 0;
    if (keysRef.current['w']) dz = 1;
    if (keysRef.current['s']) dz = -1;
    if (keysRef.current['a']) dx = -1;
    if (keysRef.current['d']) dx = 1;

    if (dx === 0 && dz === 0) {
      dx = Math.sin(playerRef.current.angle);
      dz = Math.cos(playerRef.current.angle);
    } else {
      const camYaw = cameraRef.current.yaw;
      const rx = dx * Math.cos(camYaw + Math.PI/2) - dz * Math.sin(camYaw + Math.PI/2);
      const rz = dx * Math.sin(camYaw + Math.PI/2) + dz * Math.cos(camYaw + Math.PI/2);
      dx = rx; dz = rz;
    }

    const len = Math.sqrt(dx*dx + dz*dz);
    playerDodgeDir.current = { x: dx / len, z: dz / len };
    setDodgeCooldown(2.0);
  };

  // Skill 1 (Q key) - Damage Spell
  const triggerAbility1 = () => {
    if (ability1Cooldown > 0 || playerHP <= 0 || playerMP < 15 || cinematicStage !== 'none') return;
    setPlayerMP(prev => Math.max(0, prev - 15));
    setAbility1Cooldown(4.5);
    triggerAudioEffect('spell');

    const player = playerRef.current;
    const dirX = Math.sin(player.angle);
    const dirZ = Math.cos(player.angle);

    projectilesRef.current.push({
      id: 'proj_' + Math.random(),
      pos: { x: player.pos.x, y: 0.6, z: player.pos.z },
      vel: { x: dirX * 0.38, y: 0, z: dirZ * 0.38 },
      type: 'player_spell',
      damage: 30,
      color: worldConfig.themeColor,
      size: 4,
      life: 50
    });

    setGameMessage('Executed: Compiler Purge Laser!');
  };

  // Skill 2 (E key) - Shield Buff
  const triggerAbility2 = () => {
    if (ability2Cooldown > 0 || playerHP <= 0 || playerMP < 20 || cinematicStage !== 'none') return;
    setPlayerMP(prev => Math.max(0, prev - 20));
    setAbility2Cooldown(10.0);
    triggerAudioEffect('heal');

    playerBuffShieldActive.current = true;
    playerShieldTimer.current = 300; // 5 seconds at 60fps
    setPlayerHP(prev => Math.min(playerMaxHP, prev + 20));

    spawnFloatingText(playerRef.current.pos, `+20 HP`, '#10b981', 16);
    spawnParticles(playerRef.current.pos, '#10b981', 15);
    setGameMessage('Initiated: Diagnostic Shield Buffer.');
  };

  // Interact with NPCs / Chests
  const interactWithWorld = (): boolean => {
    if (playerHP <= 0 || cinematicStage !== 'none') return false;
    const player = playerRef.current;

    // 1. Talk to NPC
    const npc = actorsRef.current.find(a => a.type === 'npc');
    if (npc) {
      const dx = npc.pos.x - player.pos.x;
      const dz = npc.pos.z - player.pos.z;
      if (Math.sqrt(dx*dx + dz*dz) < 2.8) {
        setDialogueActive(true);
        setDialogueNode('greet');
        setDialogueText(`Halt, Guardian! I am ${worldConfig.npcName}, the ${worldConfig.npcTitle}. What brings you to this uncompiled dimension?`);
        triggerAudioEffect('save');
        return true;
      }
    }

    // 2. Open chests
    for (const chest of chestsRef.current) {
      if (!chest.opened) {
        const dx = chest.pos.x - player.pos.x;
        const dz = chest.pos.z - player.pos.z;
        if (Math.sqrt(dx*dx + dz*dz) < 2.5) {
          chest.opened = true;
          triggerAudioEffect('collect');
          spawnParticles(chest.pos, chest.color, 25, 1.5);

          const isSecret = chest.id === 'chest_secret';
          const rewardGold = isSecret ? 120 : 40;
          setPlayerGold(prev => prev + rewardGold);
          spawnFloatingText(chest.pos, `+${rewardGold}G`, '#eab308', 18);

          // Spawn legendary weapon/shield
          const rewardItem: RPGItem = isSecret ? {
            id: 'legend_claymore',
            name: 'O(1) Constant Edge',
            type: 'weapon',
            statName: 'Damage',
            statValue: 45,
            rarity: 'Legendary',
            equipped: false,
            color: '#f59e0b',
            symbol: '🔱',
            description: 'Ultra-fast algorithmic blade slashing with constant constant latency.'
          } : {
            id: 'epic_shield',
            name: 'Cache Guard v2',
            type: 'shield',
            statName: 'Defense',
            statValue: 18,
            rarity: 'Epic',
            equipped: false,
            color: '#a855f7',
            symbol: '🌀',
            description: 'Decoupled memory defense buffer.'
          };

          setInventory(prev => [...prev, rewardItem]);
          setGameMessage(`ARCHIVE SECURED: Found [${rewardItem.name}]!`);
          spawnFloatingText({ ...chest.pos, y: chest.pos.y + 1.2 }, `+1 ${rewardItem.name}`, rewardItem.color, 14);
          return true;
        }
      }
    }

    return false;
  };

  const handleNpcChoice = (choice: 'lore' | 'quest' | 'secret' | 'complete' | 'exit') => {
    triggerAudioEffect('slash');
    if (choice === 'exit') {
      setDialogueActive(false);
    } else if (choice === 'lore') {
      setDialogueNode('lore');
      setDialogueText(worldConfig.lore);
    } else if (choice === 'quest') {
      setDialogueNode('quest');
      if (pointerFragmentsCollected >= 3 && !sideQuestCompleted) {
        setSideQuestCompleted(true);
        setPlayerGold(prev => prev + 60);
        const bonusPotion: RPGItem = {
          id: 'bonus_potion_' + Date.now(),
          name: 'Supreme Restore Core',
          type: 'potion',
          statName: 'Restore HP/MP',
          statValue: 100,
          rarity: 'Epic',
          equipped: false,
          color: '#10b981',
          symbol: '🧪',
          description: 'Fully restores health and calculation points instantly.'
        };
        setInventory(prev => [...prev, bonusPotion]);
        setDialogueText(`Sensational work, Guardian! You recovered all the ${worldConfig.collectableName} fragments. Here is a Supreme Restore Core and 60 Gold chips! Now, destroy the rogue AI core.`);
        spawnFloatingText(playerRef.current.pos, '+60 Gold', '#eab308', 16);
      } else {
        setDialogueText(`Core: ${worldConfig.questPrimary} \nSide objective: ${worldConfig.questSide} (${pointerFragmentsCollected}/3 secured)`);
      }
    } else if (choice === 'secret') {
      setDialogueNode('secret');
      setDialogueText(`Whispers in the system registry suggest a hidden cache is compile-blocked behind a breakable brick wall in the east quadrant (x:18, z:12). Strike it repeatedly with your weapon to bypass the sector barrier.`);
    }
  };

  // Loot drop generation
  const spawnLootDrop = (pos: Point3D) => {
    const newItem: RPGItem = {
      id: 'loot_' + Date.now(),
      name: 'Algorithm Fragment',
      type: 'potion',
      statName: 'Heal HP',
      statValue: 40,
      rarity: 'Common',
      equipped: false,
      color: '#ec4899',
      symbol: '🧪',
      description: 'Heals 40 process diagnostic points.'
    };
    lootDropsRef.current.push({
      id: 'drop_' + Date.now(),
      pos: { ...pos, y: 0.2 },
      item: newItem,
      angle: 0,
      collected: false
    });
  };

  const handleInventoryUse = (itemId: string) => {
    triggerAudioEffect('save');
    const updated = inventory.map(item => {
      if (item.id === itemId) {
        if (item.type === 'potion') {
          triggerAudioEffect('heal');
          setPlayerHP(prev => Math.min(playerMaxHP, prev + item.statValue));
          spawnFloatingText(playerRef.current.pos, `+${item.statValue} HP`, '#10b981', 18);
          return null; // destroy
        } else {
          // equip toggle
          return { ...item, equipped: !item.equipped };
        }
      }
      return item;
    }).filter(Boolean) as RPGItem[];

    setInventory(updated);

    // Recalculate stats based on equipment
    let baseDmg = 15;
    updated.forEach(item => {
      if (item.equipped && item.type === 'weapon') baseDmg = item.statValue;
    });
    playerRef.current.damage = baseDmg;
  };

  const handleRespawn = () => {
    setPlayerGold(prev => Math.max(0, prev - 10));
    setPlayerHP(playerMaxHP);
    setPlayerMP(playerMaxMP);
    playerRef.current.pos = { x: 0, y: 0, z: -10 };
    playerRef.current.health = playerMaxHP;
    initLevel();
    triggerAudioEffect('heal');
  };

  const handleSaveGame = () => {
    triggerAudioEffect('save');
    setSavedSuccessAlert(true);
    setTimeout(() => setSavedSuccessAlert(false), 2000);
    onUpdateProfile({
      points: profile.points + 40
    });
  };

  // --- Main Animation & Simulation Loop ---
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cooldownTimer = 0;

    const gameLoop = () => {
      // 1. Decelerate skill cooldowns
      cooldownTimer++;
      if (cooldownTimer >= 10) {
        cooldownTimer = 0;
        setAbility1Cooldown(prev => Math.max(0, prev - 0.16));
        setAbility2Cooldown(prev => Math.max(0, prev - 0.16));
        setDodgeCooldown(prev => Math.max(0, prev - 0.16));
      }

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      const player = playerRef.current;
      const camera = cameraRef.current;

      // 2. Cinematic & Auto-Orbit Camera Mechanics
      if (cinematicStage === 'intro') {
        // Slow rotation around starting point
        setCinematicCameraAngle(prev => prev + 0.005);
        camera.yaw = Math.PI + Math.sin(cinematicCameraAngle) * 0.4;
        camera.pitch = 0.25;
        camera.zoom = 13;
        
        // Target intro coordinates
        camera.x = 0 - Math.sin(camera.yaw) * 13;
        camera.y = 4;
        camera.z = -10 - Math.cos(camera.yaw) * 13;

        // Typewriter simulation
        const currentLine = worldConfig.introLines[cinematicLineIdx] || '';
        if (cinematicTypedText.length < currentLine.length) {
          setCinematicTypedText(currentLine.substring(0, cinematicTypedText.length + 1));
        }
      } else if (cinematicStage === 'boss_intro') {
        // Camera locked directly onto Boss
        const boss = actorsRef.current.find(a => a.type === 'boss');
        if (boss) {
          camera.x += (boss.pos.x - camera.x) * 0.05;
          camera.y += (boss.pos.y + 4 - camera.y) * 0.05;
          camera.z += (boss.pos.z - 12 - camera.z) * 0.05;
          camera.yaw = Math.PI;
          camera.pitch = 0.2;
        }
      } else {
        // Normal Camera Follow
        const targetX = player.pos.x - Math.sin(camera.yaw) * Math.cos(camera.pitch) * camera.zoom;
        const targetY = player.pos.y + Math.sin(camera.pitch) * camera.zoom + 1.2;
        const targetZ = player.pos.z - Math.cos(camera.yaw) * Math.cos(camera.pitch) * camera.zoom;

        camera.x += (targetX - camera.x) * 0.12;
        camera.y += (targetY - camera.y) * 0.12;
        camera.z += (targetZ - camera.z) * 0.12;
      }

      // 3. Player Physics & Input Handling
      if (playerHP > 0 && cinematicStage === 'none' && !dialogueActive) {
        if (playerDodgeTimer.current > 0) {
          playerDodgeTimer.current--;
          const nextX = player.pos.x + playerDodgeDir.current.x * DODGE_SPEED;
          const nextZ = player.pos.z + playerDodgeDir.current.z * DODGE_SPEED;
          if (Math.abs(nextX) < GRID_SIZE / 2 && Math.abs(nextZ) < GRID_SIZE / 2) {
            player.pos.x = nextX;
            player.pos.z = nextZ;
          }
          // Dodge particle trail
          particlesRef.current.push({
            id: Math.random(),
            pos: { ...player.pos },
            vel: { x: 0, y: 0.04, z: 0 },
            color: worldConfig.themeColor,
            size: 2,
            life: 0, maxLife: 8
          });
        } else {
          // Standard walk vectors
          let dx = 0; let dz = 0;
          if (keysRef.current['w']) dz = 1;
          if (keysRef.current['s']) dz = -1;
          if (keysRef.current['a']) dx = -1;
          if (keysRef.current['d']) dx = 1;

          if (dx !== 0 || dz !== 0) {
            const camYaw = camera.yaw;
            const moveX = dx * Math.cos(camYaw + Math.PI/2) - dz * Math.sin(camYaw + Math.PI/2);
            const moveZ = dx * Math.sin(camYaw + Math.PI/2) + dz * Math.cos(camYaw + Math.PI/2);

            const nextX = player.pos.x + moveX * player.speed;
            const nextZ = player.pos.z + moveZ * player.speed;

            // Obstacle & Wall Boundaries check
            let collide = false;
            staticObstacles.current.forEach(obs => {
              if (Math.abs(nextX - obs.pos.x) < (obs.size.x/2 + 1.1) && Math.abs(nextZ - obs.pos.z) < (obs.size.z/2 + 1.1)) {
                collide = true;
              }
            });

            // Secret wall boundary
            const sWall = secretWallRef.current;
            if (!sWall.destroyed) {
              if (Math.abs(nextX - sWall.pos.x) < (sWall.size.x/2 + 1.1) && Math.abs(nextZ - sWall.pos.z) < (sWall.size.z/2 + 1.1)) {
                collide = true;
              }
            }

            if (!collide && Math.abs(nextX) < GRID_SIZE/2 && Math.abs(nextZ) < GRID_SIZE/2) {
              player.pos.x = nextX;
              player.pos.z = nextZ;
            }

            player.targetAngle = Math.atan2(moveX, moveZ);
            let angleDiff = player.targetAngle - player.angle;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            player.angle += angleDiff * 0.18;

            if (Math.random() > 0.8) {
              particlesRef.current.push({
                id: Math.random(),
                pos: { x: player.pos.x, y: 0.1, z: player.pos.z },
                vel: { x: -moveX * 0.05, y: 0.03, z: -moveZ * 0.05 },
                color: '#64748b',
                size: 2.0,
                life: 0, maxLife: 12
              });
            }
          }
        }

        // Jump physics
        if (keysRef.current[' '] && player.pos.y === 0) {
          player.vel.y = 2.4;
          triggerAudioEffect('dodge');
        }
        if (player.pos.y > 0 || player.vel.y > 0) {
          player.pos.y += player.vel.y * 0.05;
          player.vel.y += GRAVITY;
          if (player.pos.y < 0) {
            player.pos.y = 0;
            player.vel.y = 0;
          }
        }

        // Trigger boss intro cinematic dynamically when approaching boss arena
        if (player.pos.z > 52 && !bossDefeated && cinematicStage === 'none') {
          setCinematicStage('boss_intro');
          triggerAudioEffect('boss_roar');
          setGameMessage(`BOSS INTRUSION DETECTED: Slay the legendary ${worldConfig.bossName}!`);
          setTimeout(() => {
            setCinematicStage('none');
          }, 3200);
        }
      }

      if (playerAttackSwingTimer.current > 0) {
        playerAttackSwingTimer.current--;
      }

      // 4. Projectile Physics
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const proj = projectilesRef.current[i];
        proj.pos.x += proj.vel.x;
        proj.pos.z += proj.vel.z;
        proj.life--;

        let destroyed = proj.life <= 0;

        if (proj.type === 'player_spell') {
          actorsRef.current.forEach(enemy => {
            if (enemy.health <= 0 || enemy.type === 'npc' || destroyed) return;
            const dist = Math.sqrt((enemy.pos.x - proj.pos.x)**2 + (enemy.pos.z - proj.pos.z)**2);
            if (dist < 2.0) {
              enemy.health = Math.max(0, enemy.health - proj.damage);
              spawnFloatingText(enemy.pos, `-${proj.damage} CRIT!`, worldConfig.themeColor, 18);
              spawnParticles(enemy.pos, worldConfig.themeColor, 12);
              triggerAudioEffect('hit');
              destroyed = true;
              enemy.aggro = true;
              enemy.state = 'chase';
              if (enemy.health <= 0) handleEnemyDefeat(enemy);
            }
          });
        } else if (proj.type === 'enemy_fireball' || proj.type === 'boss_ring') {
          const dist = Math.sqrt((player.pos.x - proj.pos.x)**2 + (player.pos.z - proj.pos.z)**2);
          if (dist < 1.6 && playerHP > 0 && playerDodgeTimer.current <= 0 && cinematicStage === 'none') {
            let finalDmg = proj.damage;
            if (playerBuffShieldActive.current) finalDmg = Math.floor(finalDmg * 0.4);

            setPlayerHP(prev => {
              const res = Math.max(0, prev - finalDmg);
              if (res <= 0) {
                triggerAudioEffect('defeat');
                setGameMessage('Neural sync lost! Compile and Respawn.');
              }
              return res;
            });

            spawnFloatingText(player.pos, `-${finalDmg}`, '#ef4444', 18);
            spawnParticles(player.pos, '#ef4444', 12);
            triggerAudioEffect('hit');
            destroyed = true;
          }
        }

        if (destroyed) {
          projectilesRef.current.splice(i, 1);
        }
      }

      // 5. Enemy Artificial Intelligence state machine
      actorsRef.current.forEach(enemy => {
        if (enemy.health <= 0 || enemy.type === 'npc') return;

        const dx = player.pos.x - enemy.pos.x;
        const dz = player.pos.z - enemy.pos.z;
        const dist = Math.sqrt(dx*dx + dz*dz);

        if (dist < 10.0 && playerHP > 0 && cinematicStage === 'none') {
          enemy.aggro = true;
          enemy.state = 'chase';
        }

        if (enemy.state === 'patrol') {
          enemy.patrolAngle += 0.015;
          enemy.pos.x = enemy.patrolCenter.x + Math.sin(enemy.patrolAngle) * enemy.patrolRadius;
          enemy.pos.z = enemy.patrolCenter.z + Math.cos(enemy.patrolAngle) * enemy.patrolRadius;
          enemy.angle = enemy.patrolAngle + Math.PI/2;
        } else if (enemy.state === 'chase' && playerHP > 0 && cinematicStage === 'none') {
          const dirX = dx / dist;
          const dirZ = dz / dist;
          enemy.pos.x += dirX * enemy.speed;
          enemy.pos.z += dirZ * enemy.speed;
          enemy.angle = Math.atan2(dirX, dirZ);

          const range = enemy.type === 'boss' ? 5.5 : enemy.type === 'shooter' ? 7.5 : 2.2;
          const now = Date.now();
          if (dist < range && now - enemy.lastAttackTime > (enemy.type === 'boss' ? 1800 : 2400)) {
            enemy.lastAttackTime = now;

            if (enemy.type === 'drone') {
              if (playerDodgeTimer.current <= 0) {
                let dmg = enemy.damage;
                if (playerBuffShieldActive.current) dmg = Math.floor(dmg * 0.4);
                setPlayerHP(prev => Math.max(0, prev - dmg));
                spawnFloatingText(player.pos, `-${dmg}`, '#ef4444', 16);
                spawnParticles(player.pos, '#f43f5e', 8);
                triggerAudioEffect('hit');
              }
            } else if (enemy.type === 'shooter') {
              projectilesRef.current.push({
                id: 'proj_' + Math.random(),
                pos: { x: enemy.pos.x, y: 0.6, z: enemy.pos.z },
                vel: { x: (dx/dist) * 0.2, y: 0, z: (dz/dist) * 0.2 },
                type: 'enemy_fireball',
                damage: enemy.damage,
                color: '#ec4899',
                size: 2.5,
                life: 70
              });
              triggerAudioEffect('slash');
            } else if (enemy.type === 'boss') {
              triggerAudioEffect('boss_roar');
              // Boss Hexagon Spells Sweep
              for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
                projectilesRef.current.push({
                  id: 'boss_ring_' + Math.random(),
                  pos: { x: enemy.pos.x, y: 0.4, z: enemy.pos.z },
                  vel: { x: Math.sin(a) * 0.16, y: 0, z: Math.cos(a) * 0.16 },
                  type: 'boss_ring',
                  damage: enemy.damage,
                  color: worldConfig.bossColor,
                  size: 3.5,
                  life: 80
                });
              }
              setGameMessage(`CORE STRIKE: ${worldConfig.bossName} cast global loop waves!`);
            }
          }
        }
      });

      // 6. Side quest collectable collision checks
      collectablesRef.current.forEach(item => {
        if (!item.collected) {
          const dx = player.pos.x - item.pos.x;
          const dz = player.pos.z - item.pos.z;
          if (Math.sqrt(dx*dx + dz*dz) < 1.8 && playerHP > 0 && cinematicStage === 'none') {
            item.collected = true;
            triggerAudioEffect('collect');
            spawnParticles(item.pos, worldConfig.themeColor, 16, 1.2);
            spawnFloatingText(player.pos, `+1 Key Sigil`, worldConfig.themeColor, 15);
            setPointerFragmentsCollected(prev => {
              const updated = prev + 1;
              setGameMessage(`SECURED FRAGMENT: collected ${updated}/3 ${worldConfig.collectableName} slots.`);
              return updated;
            });
          }
        }
      });

      // 7. Loot magnet pick up
      for (let i = lootDropsRef.current.length - 1; i >= 0; i--) {
        const drop = lootDropsRef.current[i];
        drop.angle += 0.04;

        const dist = Math.sqrt((player.pos.x - drop.pos.x)**2 + (player.pos.z - drop.pos.z)**2);
        if (dist < 2.0 && playerHP > 0) {
          triggerAudioEffect('heal');
          setInventory(prev => [...prev, drop.item]);
          spawnFloatingText(player.pos, `+1 Restore Core`, '#ec4899', 15);
          setGameMessage('Found diagnostic restore core in loop memory.');
          lootDropsRef.current.splice(i, 1);
        }
      }

      // Checkpoint Syncer
      checkpointsRef.current.forEach(cp => {
        const dist = Math.sqrt((player.pos.x - cp.pos.x)**2 + (player.pos.z - cp.pos.z)**2);
        if (dist < 2.0 && !cp.active) {
          checkpointsRef.current.forEach(c => c.active = false);
          cp.active = true;
          triggerAudioEffect('save');
          spawnParticles(cp.pos, '#10b981', 25, 1.6);
          spawnFloatingText(cp.pos, 'SECTOR SYNCED', '#10b981', 18);
          setPlayerHP(playerMaxHP);
          setPlayerMP(playerMaxMP);
          setGameMessage(`Synchronized at checkpoint compiler: ${cp.name}`);
        }
      });

      // Decay systems
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;
        p.pos.z += p.vel.z;
        p.life++;
        if (p.life >= p.maxLife) particlesRef.current.splice(i, 1);
      }

      for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
        const ft = floatingTextsRef.current[i];
        ft.pos.y += 0.04;
        ft.life++;
        if (ft.life >= 40) floatingTextsRef.current.splice(i, 1);
      }

      // 8. 3D Projector Renderer Pass
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const projectPoint = (point: Point3D): { x: number; y: number; visible: boolean } => {
        const dx = point.x - camera.x;
        const dy = point.y - camera.y;
        const dz = point.z - camera.z;

        // Apply orbit Yaw
        const rx = dx * Math.cos(camera.yaw) + dz * Math.sin(camera.yaw);
        const rz = -dx * Math.sin(camera.yaw) + dz * Math.cos(camera.yaw);

        // Apply Pitch
        const ry = dy * Math.cos(camera.pitch) - rz * Math.sin(camera.pitch);
        const rDepth = dy * Math.sin(camera.pitch) + rz * Math.cos(camera.pitch);

        const focalLength = 390;
        const visible = rDepth > 1.2;

        const sX = canvas.width / 2 + (rx * focalLength) / rDepth;
        const sY = canvas.height / 2 - (ry * focalLength) / rDepth;

        return { x: sX, y: sY, visible };
      };

      // Draw Floor Grid wireframes
      ctx.strokeStyle = worldConfig.gridColor;
      ctx.lineWidth = 1;
      const step = 4;
      for (let x = -GRID_SIZE/2; x <= GRID_SIZE/2; x += step) {
        ctx.beginPath();
        let pStart = projectPoint({ x, y: 0, z: -GRID_SIZE/2 });
        let pEnd = projectPoint({ x, y: 0, z: GRID_SIZE/2 });
        if (pStart.visible && pEnd.visible) {
          ctx.moveTo(pStart.x, pStart.y);
          ctx.lineTo(pEnd.x, pEnd.y);
          ctx.stroke();
        }
      }
      for (let z = -GRID_SIZE/2; z <= GRID_SIZE/2; z += step) {
        ctx.beginPath();
        let pStart = projectPoint({ x: -GRID_SIZE/2, y: 0, z });
        let pEnd = projectPoint({ x: GRID_SIZE/2, y: 0, z });
        if (pStart.visible && pEnd.visible) {
          ctx.moveTo(pStart.x, pStart.y);
          ctx.lineTo(pEnd.x, pEnd.y);
          ctx.stroke();
        }
      }

      // Draw Static Cubes/Pillars
      staticObstacles.current.forEach(obs => {
        const hX = obs.size.x / 2;
        const hY = obs.size.y;
        const hZ = obs.size.z / 2;

        const corners: Point3D[] = [
          { x: obs.pos.x - hX, y: 0, z: obs.pos.z - hZ },
          { x: obs.pos.x + hX, y: 0, z: obs.pos.z - hZ },
          { x: obs.pos.x + hX, y: 0, z: obs.pos.z + hZ },
          { x: obs.pos.x - hX, y: 0, z: obs.pos.z + hZ },
          { x: obs.pos.x - hX, y: hY, z: obs.pos.z - hZ },
          { x: obs.pos.x + hX, y: hY, z: obs.pos.z - hZ },
          { x: obs.pos.x + hX, y: hY, z: obs.pos.z + hZ },
          { x: obs.pos.x - hX, y: hY, z: obs.pos.z + hZ }
        ];

        const proj = corners.map(projectPoint);
        if (proj.every(p => p.visible)) {
          ctx.strokeStyle = '#475569';
          ctx.fillStyle = '#0f172a';

          ctx.beginPath();
          ctx.moveTo(proj[0].x, proj[0].y);
          for (let j = 1; j < 4; j++) ctx.lineTo(proj[j].x, proj[j].y);
          ctx.closePath();
          ctx.fill(); ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(proj[4].x, proj[4].y);
          for (let j = 5; j < 8; j++) ctx.lineTo(proj[j].x, proj[j].y);
          ctx.closePath();
          ctx.fillStyle = '#1e293b';
          ctx.fill(); ctx.stroke();

          for (let j = 0; j < 4; j++) {
            ctx.beginPath();
            ctx.moveTo(proj[j].x, proj[j].y);
            ctx.lineTo(proj[j+4].x, proj[j+4].y);
            ctx.stroke();
          }
        }
      });

      // Draw Secret breakable Data Wall
      const sWall = secretWallRef.current;
      if (!sWall.destroyed) {
        const hX = sWall.size.x / 2;
        const hY = sWall.size.y;
        const hZ = sWall.size.z / 2;

        const corners: Point3D[] = [
          { x: sWall.pos.x - hX, y: 0, z: sWall.pos.z - hZ },
          { x: sWall.pos.x + hX, y: 0, z: sWall.pos.z - hZ },
          { x: sWall.pos.x + hX, y: 0, z: sWall.pos.z + hZ },
          { x: sWall.pos.x - hX, y: 0, z: sWall.pos.z + hZ },
          { x: sWall.pos.x - hX, y: hY, z: sWall.pos.z - hZ },
          { x: sWall.pos.x + hX, y: hY, z: sWall.pos.z - hZ },
          { x: sWall.pos.x + hX, y: hY, z: sWall.pos.z + hZ },
          { x: sWall.pos.x - hX, y: hY, z: sWall.pos.z + hZ }
        ];

        const proj = corners.map(projectPoint);
        if (proj.every(p => p.visible)) {
          ctx.strokeStyle = worldConfig.themeColor;
          ctx.fillStyle = '#1c0528';
          ctx.shadowBlur = 10;
          ctx.shadowColor = worldConfig.themeColor;

          ctx.beginPath();
          ctx.moveTo(proj[4].x, proj[4].y);
          for (let j = 5; j < 8; j++) ctx.lineTo(proj[j].x, proj[j].y);
          ctx.closePath();
          ctx.fill(); ctx.stroke();

          for (let j = 0; j < 4; j++) {
            ctx.beginPath();
            ctx.moveTo(proj[j].x, proj[j].y);
            ctx.lineTo(proj[j+4].x, proj[j+4].y);
            ctx.stroke();
          }

          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 9px Courier New';
          ctx.textAlign = 'center';
          ctx.fillText(`BREAKABLE BLOCK (${sWall.health}HP)`, proj[4].x, proj[4].y - 8);
          ctx.shadowBlur = 0;
        }
      }

      // Draw Checkpoints
      checkpointsRef.current.forEach(cp => {
        const cpProj = projectPoint(cp.pos);
        if (cpProj.visible) {
          const mult = 1.0 + Math.sin(Date.now() * 0.005) * 0.15;
          ctx.strokeStyle = cp.active ? '#10b981' : '#475569';
          ctx.lineWidth = cp.active ? 2.5 : 1;
          ctx.beginPath();
          ctx.arc(cpProj.x, cpProj.y, 20 * mult, 0, Math.PI * 2);
          ctx.stroke();
          ctx.lineWidth = 1;

          ctx.fillStyle = cp.active ? '#10b981' : '#64748b';
          ctx.font = 'bold 9px Courier New';
          ctx.textAlign = 'center';
          ctx.fillText(cp.name, cpProj.x, cpProj.y - 25);
        }
      });

      // Draw Side Quest Collectables
      collectablesRef.current.forEach(item => {
        if (!item.collected) {
          const cpProj = projectPoint(item.pos);
          if (cpProj.visible) {
            ctx.shadowBlur = 12;
            ctx.shadowColor = item.color;
            ctx.fillStyle = item.color;
            ctx.font = '18px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(worldConfig.collectableSymbol, cpProj.x, cpProj.y - 8 + Math.sin(Date.now()*0.006)*4);
            ctx.shadowBlur = 0;
          }
        }
      });

      // Draw Chests
      chestsRef.current.forEach(chest => {
        const cpProj = projectPoint(chest.pos);
        if (cpProj.visible) {
          ctx.shadowBlur = chest.opened ? 0 : 12;
          ctx.shadowColor = chest.color;
          ctx.fillStyle = chest.opened ? '#475569' : chest.color;
          ctx.font = '20px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(chest.opened ? '🔓' : chest.symbol, cpProj.x, cpProj.y - 6);
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#94a3b8';
          ctx.font = '8px Courier New';
          ctx.fillText(chest.opened ? 'OPENED' : chest.rarity.toUpperCase(), cpProj.x, cpProj.y + 12);
        }
      });

      // Draw Loot Drops
      lootDropsRef.current.forEach(drop => {
        const cpProj = projectPoint(drop.pos);
        if (cpProj.visible) {
          ctx.fillStyle = '#ec4899';
          ctx.font = '16px sans-serif';
          ctx.fillText(drop.item.symbol, cpProj.x, cpProj.y - 6);
        }
      });

      // Draw Projectiles
      projectilesRef.current.forEach(proj => {
        const cpProj = projectPoint(proj.pos);
        if (cpProj.visible) {
          ctx.fillStyle = proj.color;
          ctx.beginPath();
          ctx.arc(cpProj.x, cpProj.y, proj.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Enemies / NPCs
      actorsRef.current.forEach(enemy => {
        if (enemy.health <= 0) return;
        const cpProj = projectPoint(enemy.pos);
        if (cpProj.visible) {
          // Draw floating Health bars
          if (enemy.type !== 'npc') {
            const barW = enemy.type === 'boss' ? 70 : 35;
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(cpProj.x - barW/2, cpProj.y - 35, barW, 3);
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(cpProj.x - barW/2, cpProj.y - 35, barW * (enemy.health / enemy.maxHealth), 3);
          }

          ctx.strokeStyle = enemy.color;
          ctx.fillStyle = '#0b0c16';
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 10;
          ctx.shadowColor = enemy.color;

          if (enemy.type === 'npc') {
            // Friendly holo-column Sage
            ctx.beginPath();
            ctx.arc(cpProj.x, cpProj.y - 12, 10, 0, Math.PI * 2);
            ctx.stroke(); ctx.fill();

            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 9px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('NPC: ' + enemy.name, cpProj.x, cpProj.y - 30);
            ctx.fillText('💬 [Press E]', cpProj.x, cpProj.y - 42);
          } else if (enemy.type === 'drone') {
            ctx.beginPath();
            ctx.moveTo(cpProj.x, cpProj.y - 25);
            ctx.lineTo(cpProj.x - 12, cpProj.y - 8);
            ctx.lineTo(cpProj.x + 12, cpProj.y - 8);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
          } else if (enemy.type === 'shooter') {
            ctx.strokeRect(cpProj.x - 9, cpProj.y - 28, 18, 24);
            ctx.fillRect(cpProj.x - 9, cpProj.y - 28, 18, 24);
          } else if (enemy.type === 'boss') {
            // Giant hexagonal matrix construct
            ctx.beginPath();
            ctx.moveTo(cpProj.x, cpProj.y - 50);
            ctx.lineTo(cpProj.x + 28, cpProj.y - 25);
            ctx.lineTo(cpProj.x + 22, cpProj.y + 10);
            ctx.lineTo(cpProj.x - 22, cpProj.y + 10);
            ctx.lineTo(cpProj.x - 28, cpProj.y - 25);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Core eye
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(cpProj.x, cpProj.y - 20, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#f43f5e';
            ctx.font = 'bold 10px Courier New';
            ctx.fillText(enemy.name || 'ROGUE_AI', cpProj.x, cpProj.y - 58);
          }

          ctx.shadowBlur = 0;
          ctx.lineWidth = 1;
        }
      });

      // Draw Player
      if (playerHP > 0 && cinematicStage === 'none') {
        const cpProj = projectPoint(player.pos);
        if (cpProj.visible) {
          if (playerBuffShieldActive.current) {
            ctx.strokeStyle = '#3b82f6';
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cpProj.x, cpProj.y - 14, 22, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.lineWidth = 1;
          }

          // Render attack sword trail arc
          if (playerAttackSwingTimer.current > 0) {
            ctx.strokeStyle = worldConfig.themeColor;
            ctx.lineWidth = 4;
            ctx.beginPath();
            const angleS = player.angle - Math.PI / 2;
            const angleE = player.angle + Math.PI / 2;
            ctx.moveTo(cpProj.x + Math.sin(angleS)*25, cpProj.y - 12 - Math.cos(angleS)*6);
            ctx.lineTo(cpProj.x + Math.sin(angleE)*25, cpProj.y - 12 - Math.cos(angleE)*6);
            ctx.stroke();
            ctx.lineWidth = 1;
          }

          // Cyber-Humanoid polygons
          ctx.strokeStyle = activeGuardian.themeColor === 'purple' ? '#a855f7' : '#06b6d4';
          ctx.fillStyle = '#091322';
          ctx.shadowBlur = 8;
          ctx.shadowColor = ctx.strokeStyle;

          ctx.fillRect(cpProj.x - 6, cpProj.y - 32 - player.pos.y * 5, 12, 9);
          ctx.strokeRect(cpProj.x - 6, cpProj.y - 32 - player.pos.y * 5, 12, 9);

          ctx.fillStyle = '#22d3ee';
          ctx.fillRect(cpProj.x - 4, cpProj.y - 29 - player.pos.y * 5, 8, 2); // Neon visor

          // Torso
          ctx.beginPath();
          ctx.moveTo(cpProj.x - 9, cpProj.y - 23 - player.pos.y * 5);
          ctx.lineTo(cpProj.x + 9, cpProj.y - 23 - player.pos.y * 5);
          ctx.lineTo(cpProj.x + 5, cpProj.y - 10 - player.pos.y * 5);
          ctx.lineTo(cpProj.x - 5, cpProj.y - 10 - player.pos.y * 5);
          ctx.closePath();
          ctx.fill(); ctx.stroke();

          // Left Leg / Right Leg lines
          const swing = Math.sin(Date.now() * 0.012) * 8;
          ctx.beginPath();
          ctx.moveTo(cpProj.x - 4, cpProj.y - 10 - player.pos.y * 5);
          ctx.lineTo(cpProj.x - 4 - swing*0.3, cpProj.y - player.pos.y * 5);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cpProj.x + 4, cpProj.y - 10 - player.pos.y * 5);
          ctx.lineTo(cpProj.x + 4 + swing*0.3, cpProj.y - player.pos.y * 5);
          ctx.stroke();

          ctx.shadowBlur = 0;
        }
      }

      // Draw generic Particles
      particlesRef.current.forEach(p => {
        const cpProj = projectPoint(p.pos);
        if (cpProj.visible) {
          ctx.fillStyle = p.color;
          ctx.fillRect(cpProj.x - p.size/2, cpProj.y - p.size/2, p.size, p.size);
        }
      });

      // Draw Floating text numbers
      floatingTextsRef.current.forEach(ft => {
        const cpProj = projectPoint(ft.pos);
        if (cpProj.visible) {
          ctx.fillStyle = ft.color;
          ctx.font = `bold ${ft.size}px Courier New`;
          ctx.textAlign = 'center';
          ctx.fillText(ft.text, cpProj.x, cpProj.y);
        }
      });

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [selectedWorldId, playerLevel, playerMaxHP, cinematicStage, cinematicLineIdx, cinematicTypedText, dialogueActive, dialogueNode]);

  return (
    <div className="relative w-full bg-[#030712] border border-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 md:p-6 select-none animate-fade-in text-slate-100 min-h-[660px] font-sans">
      
      {/* 1. Header Area */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4 z-10 gap-3">
        <div>
          <span className="text-[9px] font-mono tracking-widest text-cyan-400 font-bold uppercase block">
            AAA CINEMATIC EXPEDITION MODULE v3.0
          </span>
          <h2 className="text-lg font-black text-slate-100 tracking-tight font-sans flex items-center gap-2">
            THE ALGORITHM GUARDIAN
            <span className="text-xs font-normal text-slate-400">({activeGuardian.name} Level {playerLevel})</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
            title={audioEnabled ? "Disable SFX Audio" : "Enable SFX Audio"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>

          <button
            onClick={handleSaveGame}
            className="flex items-center gap-1 text-xs font-mono font-bold bg-emerald-950/40 border border-emerald-900 hover:border-emerald-500 text-emerald-400 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Sync Register (+40 points)</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="text-xs font-semibold px-3 py-1.5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-red-400 rounded-lg cursor-pointer transition-all"
          >
            &lt; Orbit Map
          </button>
        </div>
      </div>

      {savedSuccessAlert && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-emerald-950/90 border border-emerald-500 rounded-2xl px-5 py-2.5 z-50 flex items-center gap-2.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-100 uppercase">SYS: REGISTER MEMORY SYNCHRONIZED</span>
        </div>
      )}

      {/* 2. Core Game Canvas & HUD */}
      <div className="flex-1 grid grid-cols-12 gap-4 h-full relative z-10">
        
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-3 relative min-h-[380px] h-full">
          
          <div className="flex-1 bg-slate-950 rounded-2xl relative border-2 border-slate-900 overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-full block cursor-crosshair"
            />

            {/* A. Cinematic Letterbox Intro Overlay */}
            {cinematicStage === 'intro' && (
              <div className="absolute inset-0 bg-[#02050c]/85 flex flex-col justify-between p-10 z-40 animate-fade-in pointer-events-auto">
                <div className="border-t border-slate-800 w-full h-12 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-slate-500">TRANSMITTING SECTOR LOGISTICS...</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{worldConfig.name}</span>
                </div>

                <div className="max-w-2xl mx-auto text-center space-y-6">
                  <span className="text-[11px] font-mono text-yellow-500 uppercase tracking-widest font-bold">CINEMATIC TRANSMISSION</span>
                  <h3 className="text-2xl md:text-3xl font-black font-sans bg-gradient-to-r from-slate-100 to-purple-400 bg-clip-text text-transparent uppercase tracking-tight">
                    {worldConfig.name} Kingdom
                  </h3>
                  <p className="text-sm font-mono text-slate-300 leading-relaxed min-h-[64px]">
                    {cinematicTypedText}
                    <span className="animate-pulse">|</span>
                  </p>
                  
                  <div className="flex gap-4 justify-center pt-4">
                    {cinematicLineIdx < worldConfig.introLines.length - 1 ? (
                      <button
                        onClick={() => {
                          triggerAudioEffect('slash');
                          const nextIdx = cinematicLineIdx + 1;
                          setCinematicLineIdx(nextIdx);
                          setCinematicTypedText('');
                        }}
                        className="flex items-center gap-1 bg-purple-900/40 hover:bg-purple-900 border border-purple-500 px-4 py-2 rounded-lg font-mono text-xs text-white font-bold cursor-pointer"
                      >
                        <span>Next Directive</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          triggerAudioEffect('levelup');
                          setCinematicStage('none');
                        }}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] px-5 py-2.5 rounded-lg font-mono text-xs text-white font-bold cursor-pointer"
                      >
                        Deploy Thread (Launch Level)
                      </button>
                    )}
                  </div>
                </div>

                <div className="border-b border-slate-800 w-full h-12 flex items-center justify-end">
                  <button
                    onClick={() => {
                      triggerAudioEffect('levelup');
                      setCinematicStage('none');
                    }}
                    className="text-[10px] font-mono text-slate-500 hover:text-slate-300 uppercase cursor-pointer"
                  >
                    Skip Cinematic Cutscene &gt;&gt;
                  </button>
                </div>
              </div>
            )}

            {/* B. Cinematic Boss Intro Banner */}
            {cinematicStage === 'boss_intro' && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0c0305]/90 border-2 border-red-500/80 p-6 rounded-2xl text-center space-y-2 z-40 w-[90%] max-w-md animate-slide-up shadow-[0_0_25px_rgba(239,68,68,0.4)] pointer-events-none">
                <span className="text-[10px] font-mono tracking-widest text-red-500 font-bold animate-pulse uppercase">DANGER: HARDWARE OVERLOAD</span>
                <h3 className="text-xl font-black text-slate-100 font-mono">{worldConfig.bossName}</h3>
                <p className="text-[11px] text-slate-400 font-mono uppercase">{worldConfig.bossTitle}</p>
                <div className="h-0.5 bg-red-900 w-full rounded my-2" />
                <p className="text-xs text-red-400 font-mono italic">"YOUR DUSTY DECIMALS WILL BE WIPED FROM MEMORY FLOATS."</p>
              </div>
            )}

            {/* C. Interactive Friendly NPC Dialogue Box */}
            {dialogueActive && (
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/95 border border-slate-800 p-5 rounded-2xl z-40 flex flex-col md:flex-row gap-4 backdrop-blur-md animate-slide-up pointer-events-auto shadow-2xl">
                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-3xl shrink-0">
                  {worldConfig.npcAvatar}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold font-mono text-emerald-400">{worldConfig.npcName}</h4>
                    <span className="text-[8px] font-mono text-slate-500 uppercase block">{worldConfig.npcTitle}</span>
                  </div>
                  
                  <p className="text-xs font-mono text-slate-300 leading-relaxed max-w-xl whitespace-pre-line">
                    {dialogueText}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {dialogueNode === 'greet' && (
                      <>
                        <button
                          onClick={() => handleNpcChoice('lore')}
                          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200 cursor-pointer"
                        >
                          1. Learn Sector Lore
                        </button>
                        <button
                          onClick={() => handleNpcChoice('quest')}
                          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200 cursor-pointer"
                        >
                          2. Sector Quest Details
                        </button>
                        <button
                          onClick={() => handleNpcChoice('secret')}
                          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200 cursor-pointer"
                        >
                          3. Ask about Secret Archives
                        </button>
                        <button
                          onClick={() => handleNpcChoice('exit')}
                          className="bg-slate-900 hover:bg-red-950 border border-red-900/40 px-3 py-1.5 rounded-lg text-xs font-mono text-red-400 cursor-pointer"
                        >
                          4. Exit Dialogue
                        </button>
                      </>
                    )}

                    {(dialogueNode === 'lore' || dialogueNode === 'quest' || dialogueNode === 'secret') && (
                      <button
                        onClick={() => {
                          triggerAudioEffect('slash');
                          setDialogueNode('greet');
                          setDialogueText(`Anything else, Guardian? The virus lines are multiplying.`);
                        }}
                        className="bg-slate-900 hover:bg-slate-850 border border-slate-800 px-4 py-1.5 rounded-lg text-xs font-mono text-cyan-400 cursor-pointer"
                      >
                        &lt;&lt; Back to Options
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* D. Defeated Dead Respawn Screen */}
            {playerHP <= 0 && (
              <div className="absolute inset-0 bg-[#0d0406]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40 space-y-4 animate-fade-in pointer-events-auto">
                <Skull className="w-16 h-16 text-red-500 animate-pulse" />
                <h3 className="text-xl font-black text-slate-100 uppercase font-mono tracking-widest">
                  SEGMENTATION FAULT OVERFLOW EXCEPTION
                </h3>
                <p className="text-xs text-slate-400 font-mono max-w-md leading-relaxed">
                  Call stack overflowed, dereferencing memory addresses. Re-respawn to compile safely at starting compile node.
                </p>
                <button
                  onClick={handleRespawn}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 border border-red-500 text-white font-mono font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-transform hover:scale-105 shadow-[0_4px_15px_rgba(239,68,68,0.4)]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Compile & Restore (-10 Gold penalty)</span>
                </button>
              </div>
            )}

            {/* E. Quest Completion Victory Overlay */}
            {cinematicStage === 'victory' && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-8 text-center z-40 animate-fade-in pointer-events-auto">
                <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
                <h3 className="text-2xl font-black text-slate-100 uppercase tracking-widest font-mono">
                  {worldConfig.name} UNIFIED!
                </h3>
                <p className="text-xs font-mono text-slate-400 max-w-md leading-relaxed">
                  The rogue core matrix has been entirely purged and memory is running consecutive contiguous calculations perfectly! 200 Rank points successfully synced.
                </p>
                
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-xs text-left space-y-1 max-w-sm w-full">
                  <div className="text-emerald-400 flex items-center gap-2 font-bold">
                    <CheckCircle className="w-4 h-4" /> <span>Primary Quest Completed</span>
                  </div>
                  <div className={`${sideQuestCompleted ? 'text-emerald-400' : 'text-slate-500'} flex items-center gap-2`}>
                    <CheckCircle className="w-4 h-4" /> <span>Side Quest Completed: {pointerFragmentsCollected}/3 keys</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={onBackToMenu}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Proceed to Constellation Map
                  </button>
                </div>
              </div>
            )}

            {/* F. Controller Guidance Overlay */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#020617]/85 border border-slate-850 p-2 sm:px-3 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-mono text-slate-400 space-y-0.5 sm:space-y-1 backdrop-blur-sm pointer-events-none max-w-[180px] sm:max-w-none">
              <span className="text-cyan-400 font-bold block">CONTROLS:</span>
              <div>• Move: <b className="text-slate-200">WASD / Touch D-Pad</b></div>
              <div className="hidden sm:block">• Rotate Camera: <b className="text-slate-200">Drag Left-Click / Touch Drag</b></div>
              <div>• Attack: <b className="text-slate-200">F / Touch Button</b></div>
              <div className="hidden sm:block">• Skills: <b className="text-slate-200">Q (Spell)</b> | <b className="text-slate-200">E (Shield)</b></div>
            </div>

            {/* G. Quests Tracker Widget HUD */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#020617]/85 border border-slate-850 p-2 sm:px-3 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] font-mono backdrop-blur-sm pointer-events-none space-y-1 w-44 sm:w-60">
              <div className="flex items-center gap-1">
                <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 animate-spin" />
                <span className="text-slate-400 uppercase text-[8px] font-bold truncate">QUEST LOG: {worldConfig.name}</span>
              </div>
              <div className="h-0.5 bg-slate-900 w-full" />
              
              <div className="space-y-0.5 sm:space-y-1 text-slate-300">
                <div className="flex items-start gap-1">
                  <span className={bossDefeated ? 'text-emerald-400' : 'text-slate-500'}>
                    {bossDefeated ? '☑' : '☐'}
                  </span>
                  <span className="leading-tight truncate"><b>Primary</b>: {worldConfig.bossName}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className={pointerFragmentsCollected >= 3 ? 'text-emerald-400' : 'text-slate-500'}>
                    {pointerFragmentsCollected >= 3 ? '☑' : '☐'}
                  </span>
                  <span className="leading-tight truncate"><b>Side</b>: Recover slots ({pointerFragmentsCollected}/3)</span>
                </div>
              </div>
            </div>

            {/* H. Virtual On-Screen Mobile & Touch Controller Overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end pointer-events-auto z-30 select-none">
              {/* Virtual D-Pad (Left) */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-slate-950/80 border border-slate-800/80 rounded-full p-1 backdrop-blur-md shadow-2xl flex items-center justify-center">
                {/* UP */}
                <button
                  onMouseDown={() => { keysRef.current['w'] = true; }}
                  onMouseUp={() => { keysRef.current['w'] = false; }}
                  onTouchStart={(e) => { e.preventDefault(); keysRef.current['w'] = true; }}
                  onTouchEnd={(e) => { e.preventDefault(); keysRef.current['w'] = false; }}
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 border border-slate-700/60 active:bg-cyan-600 rounded-lg flex items-center justify-center text-xs font-black text-cyan-300 shadow cursor-pointer"
                >
                  ▲
                </button>
                {/* LEFT */}
                <button
                  onMouseDown={() => { keysRef.current['a'] = true; }}
                  onMouseUp={() => { keysRef.current['a'] = false; }}
                  onTouchStart={(e) => { e.preventDefault(); keysRef.current['a'] = true; }}
                  onTouchEnd={(e) => { e.preventDefault(); keysRef.current['a'] = false; }}
                  className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 border border-slate-700/60 active:bg-cyan-600 rounded-lg flex items-center justify-center text-xs font-black text-cyan-300 shadow cursor-pointer"
                >
                  ◀
                </button>
                {/* CENTER JOYSTICK DECK */}
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 animate-pulse" />
                {/* RIGHT */}
                <button
                  onMouseDown={() => { keysRef.current['d'] = true; }}
                  onMouseUp={() => { keysRef.current['d'] = false; }}
                  onTouchStart={(e) => { e.preventDefault(); keysRef.current['d'] = true; }}
                  onTouchEnd={(e) => { e.preventDefault(); keysRef.current['d'] = false; }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 border border-slate-700/60 active:bg-cyan-600 rounded-lg flex items-center justify-center text-xs font-black text-cyan-300 shadow cursor-pointer"
                >
                  ▶
                </button>
                {/* DOWN */}
                <button
                  onMouseDown={() => { keysRef.current['s'] = true; }}
                  onMouseUp={() => { keysRef.current['s'] = false; }}
                  onTouchStart={(e) => { e.preventDefault(); keysRef.current['s'] = true; }}
                  onTouchEnd={(e) => { e.preventDefault(); keysRef.current['s'] = false; }}
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 border border-slate-700/60 active:bg-cyan-600 rounded-lg flex items-center justify-center text-xs font-black text-cyan-300 shadow cursor-pointer"
                >
                  ▼
                </button>
              </div>

              {/* Virtual Action Buttons Deck (Right) */}
              <div className="flex gap-1.5 sm:gap-2 items-center">
                {/* DODGE ROLL (Shift) */}
                <button
                  onClick={triggerDodgeRoll}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/90 border border-purple-500/60 active:bg-purple-600 text-purple-300 font-mono font-black text-[9px] sm:text-[10px] flex items-center justify-center shadow-lg cursor-pointer"
                  title="Dodge Roll"
                >
                  ROLL
                </button>

                {/* SPELL LASER (Q) */}
                <button
                  onClick={triggerAbility1}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-cyan-950/80 border border-cyan-400 active:bg-cyan-600 text-cyan-200 font-mono font-black text-[9px] sm:text-[10px] flex items-center justify-center shadow-lg cursor-pointer"
                  title="Spell Laser"
                >
                  SPELL
                </button>

                {/* MELEE SWORD ATTACK (F / Space) */}
                <button
                  onClick={triggerMeleeAttack}
                  className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-r from-red-600 to-rose-600 border-2 border-rose-400 active:scale-95 text-white font-mono font-black text-[10px] sm:text-xs flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-pointer"
                  title="Melee Attack"
                >
                  ATTACK
                </button>
              </div>
            </div>

          </div>

          <div className="bg-[#02050c] border border-slate-900 px-4 py-2.5 rounded-xl flex items-center gap-2">
            <span className="text-[10px] font-mono font-black bg-slate-900 px-1.5 py-0.5 rounded text-cyan-400 border border-slate-800">
              CONSOLE:
            </span>
            <span className="text-xs font-mono text-slate-300 truncate">
              {gameMessage}
            </span>
          </div>

        </div>

        {/* 3. Status Sidebar Panels */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          
          <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl space-y-4 shadow-xl">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 border border-slate-800 flex items-center justify-center text-xl rounded-xl">
                {activeGuardian.avatarUrl}
              </div>
              <div>
                <h4 className="text-sm font-black font-mono text-slate-100">{activeGuardian.name}</h4>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  {activeGuardian.title}
                </span>
              </div>
            </div>

            {/* Level Bars */}
            <div className="space-y-1.5 pt-1 border-t border-slate-900">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-slate-400 uppercase">Guardian Level</span>
                <span className="text-cyan-400 font-bold">Lvl {playerLevel}</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-850">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                  style={{ width: `${(playerXP / playerNextLevelXP) * 100}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[8px] text-slate-500">
                <span>{playerXP} XP</span>
                <span>{playerNextLevelXP} XP TARGET</span>
              </div>
            </div>

            {/* HP */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="flex items-center gap-1 text-red-400">
                  <Heart className="w-3.5 h-3.5 fill-red-400/20" />
                  <span>PROCESSOR INTEGRITY</span>
                </span>
                <span className="text-red-400 font-bold">{playerHP} / {playerMaxHP} HP</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-850">
                <div 
                  className="bg-red-500 h-full transition-all duration-300"
                  style={{ width: `${(playerHP / playerMaxHP) * 100}%` }}
                />
              </div>
            </div>

            {/* MP */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Zap className="w-3.5 h-3.5 fill-cyan-400/20" />
                  <span>CALCULATION BUFFER</span>
                </span>
                <span className="text-cyan-400 font-bold">{playerMP} / {playerMaxMP} MP</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-850">
                <div 
                  className="bg-cyan-500 h-full transition-all duration-300"
                  style={{ width: `${(playerMP / playerMaxMP) * 100}%` }}
                />
              </div>
            </div>

            {/* Currency */}
            <div className="flex justify-between items-center bg-[#090b14] border border-slate-900 p-2.5 rounded-xl font-mono text-xs">
              <span className="flex items-center gap-1.5 text-yellow-400 font-bold">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span>GOLD CHIPS:</span>
              </span>
              <span className="text-yellow-400 font-black text-sm">{playerGold}G</span>
            </div>

          </div>

          {/* Cyberdeck Inventory Panel */}
          <div className="flex-1 bg-slate-950 border border-slate-900 rounded-2xl p-4 flex flex-col gap-3 min-h-[220px]">
            
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <h4 className="text-xs font-black font-mono text-slate-100 flex items-center gap-1.5">
                <Backpack className="w-4 h-4 text-cyan-400" />
                CYBERDECK INVENTORY
              </h4>
              <button
                onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                className="text-[9px] font-mono text-slate-400 hover:text-cyan-400 uppercase bg-slate-900 border border-slate-850 px-2 py-0.5 rounded cursor-pointer"
              >
                {isInventoryOpen ? 'Hide' : 'Inspect'}
              </button>
            </div>

            {/* Quick Grid Slots */}
            <div className="grid grid-cols-4 gap-2 overflow-y-auto max-h-[160px] custom-scrollbar">
              {inventory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleInventoryUse(item.id)}
                  title={`${item.name}: ${item.description}`}
                  className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${
                    item.equipped 
                      ? 'bg-cyan-950/30 border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.2)]' 
                      : 'bg-[#060812] border-slate-850'
                  }`}
                >
                  <span className="text-lg">{item.symbol}</span>
                  {item.equipped && (
                    <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Full List Inspector */}
            {isInventoryOpen && (
              <div className="mt-2 pt-2 border-t border-slate-900 space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                {inventory.map((item) => (
                  <div key={item.id} className="p-2 bg-[#050711] border border-slate-900 rounded-xl flex justify-between items-center gap-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-base">{item.symbol}</span>
                      <div>
                        <span className="text-[10px] font-bold font-mono text-slate-200 block truncate max-w-[120px]">{item.name}</span>
                        <span className="text-[8px] font-mono text-cyan-400 block">{item.statName}: +{item.statValue}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInventoryUse(item.id)}
                      className={`text-[9px] font-mono px-2 py-1 rounded cursor-pointer ${
                        item.equipped 
                          ? 'bg-cyan-950 border border-cyan-800 text-cyan-400' 
                          : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.type === 'potion' ? 'Consume' : item.equipped ? 'Dismount' : 'Equip'}
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
