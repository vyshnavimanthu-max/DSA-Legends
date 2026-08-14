import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, Zap, Shield, Sparkles, Activity, Brain, 
  Cpu, Check, Gamepad2, Timer, Info, AlertTriangle, Key, Lock, Unlock,
  Award, Palette, User, TrendingUp, Coins, RefreshCw, Star, ArrowRight,
  Maximize2, Play, ChevronUp, AlertCircle
} from 'lucide-react';
import { Guardian, ProfileState, GuardianProgression, GuardianSkin } from '../types';

interface CharacterSelectionViewProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onSelectGuardian: (guardianId: string) => void;
  onBackToMenu: () => void;
}

// 10 UNIQUE ALGORITHM GUARDIANS
export const GUARDIANS: Guardian[] = [
  {
    id: 'sort_spectre',
    name: 'SortSpectre',
    title: 'The Linear Executioner',
    classType: 'Bubble / Insertion Sort Class',
    difficulty: 'Beginner',
    themeColor: 'purple',
    complexityFactor: 'O(N²)',
    rarity: 'Common',
    unlockCost: 0, // Unlocked by default
    stats: {
      speed: 45,
      memoryEfficiency: 95,
      recursionPower: 25,
      stability: 100
    },
    avatarUrl: 'S',
    description: 'An elusive hacker entity specializing in linear arrangements. Resolves unsorted memory zones through brute force and adjacent element swaps with perfect, robust stability.',
    abilities: [
      {
        name: 'Adjacent Swap Pulsar',
        description: 'Forcefully trades adjacent values, eliminating local entropy. High stability, low speed.',
        cooldown: '3.5s',
        complexityCost: 'O(1) auxiliary space'
      },
      {
        name: 'In-Place Fortification',
        description: 'Locks down stack pointer bounds, preventing additional auxiliary heap memory allocations completely.',
        cooldown: '12.0s',
        complexityCost: 'O(1) aux memory'
      }
    ],
    skins: [
      { id: 'default', name: 'Default Spectre', tag: 'CLASSIC', description: 'Standard cyberdeck compiler configuration.', preview: 'S', cost: 0 },
      { id: 'neon', name: 'Vaporwave Glitch', tag: 'VAPOR', description: 'Retro 1980s neon colorway with laser scanlines.', preview: 'V', cost: 100 },
      { id: 'void', name: 'Void Matrix', tag: 'MYSTIC', description: 'Stealth black matte frame with shifting dark nebula energy.', preview: 'X', cost: 250 }
    ]
  },
  {
    id: 'binary_blade',
    name: 'BinaryBlade',
    title: 'The Divide & Conquer Ronin',
    classType: 'Merge / Quick Search Class',
    difficulty: 'Adept',
    themeColor: 'cyan',
    complexityFactor: 'O(log N)',
    rarity: 'Rare',
    unlockCost: 100,
    stats: {
      speed: 85,
      memoryEfficiency: 60,
      recursionPower: 95,
      stability: 30
    },
    avatarUrl: 'B',
    description: 'A cyber-ronin operating with absolute split-second binary precision. Slashes raw databases directly in half at every step, discarding irrelevant memory ranges instantly.',
    abilities: [
      {
        name: 'Pivot Slasher',
        description: 'Chooses a balanced pivot element to isolate higher and lower values in parallel execution threads.',
        cooldown: '5.0s',
        complexityCost: 'O(log N) recursion'
      },
      {
        name: 'Divide & Conquer Strike',
        description: 'Splits arrays recursively into individual singletons before merging with extreme speed.',
        cooldown: '15.0s',
        complexityCost: 'O(N) memory overhead'
      }
    ],
    skins: [
      { id: 'default', name: 'Core Samurai', tag: 'CLASSIC', description: 'Standard cyber-katana outfit.', preview: 'B', cost: 0 },
      { id: 'gilded', name: 'Shogun Code', tag: 'PRESTIGE', description: 'Glorious gold-plated armor with custom circuitry.', preview: 'Ω', cost: 200 },
      { id: 'plasma', name: 'Laser Ronin', tag: 'FUTURISTIC', description: 'Infused with high-frequency thermal plasma particles.', preview: 'Ψ', cost: 350 }
    ]
  },
  {
    id: 'graph_goliath',
    name: 'GraphGoliath',
    title: 'The Grid Mainframe Behemoth',
    classType: 'Dijkstra / Pathfinding Class',
    difficulty: 'Expert',
    themeColor: 'emerald',
    complexityFactor: 'O(V + E)',
    rarity: 'Epic',
    unlockCost: 250,
    stats: {
      speed: 70,
      memoryEfficiency: 50,
      recursionPower: 80,
      stability: 85
    },
    avatarUrl: 'G',
    description: 'A massive Core construct that traverses high-density neural networks. Maps graph connections instantly using shortest-path vectors to completely bypass cycle deadlock zones.',
    abilities: [
      {
        name: 'Relax Edge Wave',
        description: 'Relaxes graph edge bounds recursively to calibrate minimum steps across weighted neural vertices.',
        cooldown: '8.0s',
        complexityCost: 'O(V) priority queue'
      },
      {
        name: 'Mainframe Flood',
        description: 'Fires broad search pulses in all directions outward to discover nearest objective nodes.',
        cooldown: '20.0s',
        complexityCost: 'O(E) edges visited'
      }
    ],
    skins: [
      { id: 'default', name: 'Stone Mainframe', tag: 'CLASSIC', description: 'Heavy basalt concrete containment chassis.', preview: 'G', cost: 0 },
      { id: 'toxic', name: 'Acid Overload', tag: 'HAZARD', description: 'Corrosive neon sludge running through the coolant lines.', preview: '☣', cost: 250 },
      { id: 'mech', name: 'Obsidian Titan', tag: 'LEGACY', description: 'Plated with deep-space dark obsidian alloys.', preview: '⚙', cost: 400 }
    ]
  },
  {
    id: 'hashed_haze',
    name: 'HashedHaze',
    title: 'The Quantum Index Spectre',
    classType: 'Hash Map / Constant Time Class',
    difficulty: 'Godlike',
    themeColor: 'amber',
    complexityFactor: 'O(1)',
    rarity: 'Legendary',
    unlockCost: 500,
    stats: {
      speed: 100,
      memoryEfficiency: 35,
      recursionPower: 15,
      stability: 90
    },
    avatarUrl: 'H',
    description: 'A localized quantum cloud computing system. Maps chaotic, unlimited incoming data streams directly into deterministic memory slots, achieving constant-time retrieval.',
    abilities: [
      {
        name: 'Constant-Time Rip',
        description: 'Bypasses standard element comparisons entirely, pulling items directly from their unique hash key.',
        cooldown: '1.5s',
        complexityCost: 'O(1) lookup'
      },
      {
        name: 'Linear Probing Scatter',
        description: 'Resolves index collisions dynamically by shifting target values to adjacent vacant slots.',
        cooldown: '10.0s',
        complexityCost: 'O(N) load factor max'
      }
    ],
    skins: [
      { id: 'default', name: 'Quantum Ether', tag: 'CLASSIC', description: 'Abstract energy manifestation of pure equations.', preview: 'H', cost: 0 },
      { id: 'nebula', name: 'Singularity Cloud', tag: 'COSMIC', description: 'A pulsing micro-galaxy with actual cosmic dust.', preview: '✦', cost: 400 },
      { id: 'street', name: 'Tokyo Syndicate', tag: 'STREET', description: 'Cyberpunk street wear with animated graffiti overlays.', preview: '☠', cost: 600 }
    ]
  },
  {
    id: 'stack_sentinel',
    name: 'StackSentinel',
    title: 'The LIFO Depth Guardian',
    classType: 'LIFO Stack / Parsing Class',
    difficulty: 'Beginner',
    themeColor: 'purple',
    complexityFactor: 'O(N)',
    rarity: 'Common',
    unlockCost: 50,
    stats: {
      speed: 50,
      memoryEfficiency: 80,
      recursionPower: 40,
      stability: 95
    },
    avatarUrl: 'P',
    description: 'A sentinel holding vigil over the execution call stack. Uniquely skilled at reversing operations, balancing brackets, and parsing high-level expressions.',
    abilities: [
      {
        name: 'LIFO Repulsion',
        description: 'Pops the top element of the execution list to blast adjacent enemies backward.',
        cooldown: '4.0s',
        complexityCost: 'O(1) push/pop'
      },
      {
        name: 'Bracket Shield',
        description: 'Generates a balanced shield that absorbs damage proportional to recursion depth.',
        cooldown: '11.0s',
        complexityCost: 'O(N) nested check'
      }
    ],
    skins: [
      { id: 'default', name: 'Iron Sentinel', tag: 'CLASSIC', description: 'Solid metallic plates guarding core memories.', preview: 'P', cost: 0 },
      { id: 'rust', name: 'Corroded Registry', tag: 'WASTELAND', description: 'Weathered mechanical gear showing battle wear.', preview: 'R', cost: 120 },
      { id: 'glacier', name: 'Ice Buffer', tag: 'FROST', description: 'Crafted from crystal glaciers that never melt.', preview: '❄', cost: 200 }
    ]
  },
  {
    id: 'queue_quake',
    name: 'QueueQuake',
    title: 'The FIFO Bulwark',
    classType: 'FIFO Queue / Buffering Class',
    difficulty: 'Beginner',
    themeColor: 'emerald',
    complexityFactor: 'O(N)',
    rarity: 'Common',
    unlockCost: 50,
    stats: {
      speed: 55,
      memoryEfficiency: 75,
      recursionPower: 30,
      stability: 100
    },
    avatarUrl: 'Q',
    description: 'An unstoppable buffer engine that processes tasks strictly in the order they arrive. Excels at asynchronous event scheduling and thread synchronization.',
    abilities: [
      {
        name: 'FIFO Steamroller',
        description: 'Charges forward in a straight line, smashing elements in arrival sequence order.',
        cooldown: '6.0s',
        complexityCost: 'O(1) enqueue'
      },
      {
        name: 'Circular Buffer Burst',
        description: 'Rotates around elements to recycle memory blocks, granting temporal stat buffs.',
        cooldown: '14.0s',
        complexityCost: 'O(1) pointer reuse'
      }
    ],
    skins: [
      { id: 'default', name: 'Standard Pipe', tag: 'CLASSIC', description: 'Standard copper conduit framework.', preview: 'Q', cost: 0 },
      { id: 'sludge', name: 'Sludge Leak', tag: 'HAZARD', description: 'Dripping with radioactive industrial runoff.', preview: '☣', cost: 120 },
      { id: 'lava', name: 'Magma Core', tag: 'ELEMENTAL', description: 'Formed in subterranean chambers of pure magma.', preview: '☄', cost: 220 }
    ]
  },
  {
    id: 'tree_trapper',
    name: 'TreeTrapper',
    title: 'The Balanced BST Arch-Druid',
    classType: 'Self-Balancing Tree Class',
    difficulty: 'Adept',
    themeColor: 'cyan',
    complexityFactor: 'O(log N)',
    rarity: 'Rare',
    unlockCost: 120,
    stats: {
      speed: 80,
      memoryEfficiency: 70,
      recursionPower: 85,
      stability: 65
    },
    avatarUrl: 'T',
    description: 'A biological-computational system that keeps itself in perfect equilibrium. Rotates elements dynamically to ensure log-N operations are guaranteed.',
    abilities: [
      {
        name: 'AVL Rotation Slam',
        description: 'Triggers a double rotation (left-right) to knock down clusters of unbalanced arrays.',
        cooldown: '7.0s',
        complexityCost: 'O(1) pivot shift'
      },
      {
        name: 'Pre-Order Spore',
        description: 'Releases a cloud of spores that traces nodes recursively to reveal enemy vulnerabilities.',
        cooldown: '16.0s',
        complexityCost: 'O(N) traversal'
      }
    ],
    skins: [
      { id: 'default', name: 'Digital Root', tag: 'CLASSIC', description: 'Bionic tree configuration with neon roots.', preview: 'T', cost: 0 },
      { id: 'autumn', name: 'Amber Canopy', tag: 'SEASONAL', description: 'Glows with golden autumn leaves and warm light.', preview: '🍁', cost: 150 },
      { id: 'crystal', name: 'Prism Branch', tag: 'CRYSTAL', description: 'Crystalline leaves reflecting laser spectra.', preview: '✦', cost: 250 }
    ]
  },
  {
    id: 'dynamic_drifter',
    name: 'DynamicDrifter',
    title: 'The Subproblem Time Bender',
    classType: 'Dynamic Programming Class',
    difficulty: 'Expert',
    themeColor: 'amber',
    complexityFactor: 'O(N * W)',
    rarity: 'Epic',
    unlockCost: 300,
    stats: {
      speed: 65,
      memoryEfficiency: 40,
      recursionPower: 90,
      stability: 70
    },
    avatarUrl: 'D',
    description: 'An absolute master of optimization. Remembers every solved subproblem to avoid redundant work, solving complex knapsack riddles via memoization matrices.',
    abilities: [
      {
        name: 'Memoization Matrix',
        description: 'Freezes time locally, retrieving cached steps to resolve encounters with near-instant speed.',
        cooldown: '9.0s',
        complexityCost: 'O(N * W) storage'
      },
      {
        name: 'Overlapping Strike',
        description: 'Splits damage into multiple subproblems, multiplying impact exponentially.',
        cooldown: '18.0s',
        complexityCost: 'O(N) dependency chain'
      }
    ],
    skins: [
      { id: 'default', name: 'Chrono Rogue', tag: 'CLASSIC', description: 'Wears a temporal chronometer harness.', preview: 'D', cost: 0 },
      { id: 'matrix', name: 'Grid Phantom', tag: 'CODE', description: 'Surrounded by cascading green digital waterfall code.', preview: '⚿', cost: 300 },
      { id: 'retro', name: 'Arcade Glitch', tag: 'RETRO', description: '8-bit blocky retro pixels rendering dynamically.', preview: '👾', cost: 450 }
    ]
  },
  {
    id: 'greedy_griffin',
    name: 'GreedyGriffin',
    title: 'The Optimal Path Hunter',
    classType: 'Greedy Optimization Class',
    difficulty: 'Adept',
    themeColor: 'purple',
    complexityFactor: 'O(N log N)',
    rarity: 'Rare',
    unlockCost: 150,
    stats: {
      speed: 75,
      memoryEfficiency: 85,
      recursionPower: 20,
      stability: 40
    },
    avatarUrl: 'R',
    description: 'A metallic avian raptor that makes the locally optimal choice at every step, hoping to discover the global maximum. Highly aggressive sorting algorithm.',
    abilities: [
      {
        name: 'Max Heuristic Swoop',
        description: 'Swoops down instantly to harvest the highest-valued element from the battlefield.',
        cooldown: '5.0s',
        complexityCost: 'O(log N) sorting'
      },
      {
        name: 'Fractional Looting',
        description: 'Breaks values into fractions, gaining speed boots and resource multiplier stacks.',
        cooldown: '13.0s',
        complexityCost: 'O(1) greedy choice'
      }
    ],
    skins: [
      { id: 'default', name: 'Steel Hawk', tag: 'CLASSIC', description: 'Constructed from polished stainless steel sheets.', preview: 'R', cost: 0 },
      { id: 'stealth', name: 'Shadow Feather', tag: 'STEALTH', description: 'Carbon fiber chassis with sound dampeners.', preview: '🦅', cost: 180 },
      { id: 'solar', name: 'Solar Apex', tag: 'COSMIC', description: 'Bathed in stellar fusion plasma flares.', preview: '☀', cost: 300 }
    ]
  },
  {
    id: 'astar_avenger',
    name: 'AStarAvenger',
    title: 'The Heuristic Wayfinder',
    classType: 'A* Pathfinding Class',
    difficulty: 'Godlike',
    themeColor: 'cyan',
    complexityFactor: 'O(b^d)',
    rarity: 'Legendary',
    unlockCost: 600,
    stats: {
      speed: 95,
      memoryEfficiency: 45,
      recursionPower: 75,
      stability: 80
    },
    avatarUrl: 'W',
    description: 'The absolute pinnacle of routing technology. Merges Dijkstra with heuristic projections to solve maze layouts, avoiding obstacle segments and deadlocks effortlessly.',
    abilities: [
      {
        name: 'Heuristic Compass',
        description: 'Calibrates Manhattan distance vectors to find the perfect straight path across any arena.',
        cooldown: '4.5s',
        complexityCost: 'O(b) branch factor'
      },
      {
        name: 'F-Score Overdrive',
        description: 'Supercharges local processors to lock target pathways, granting hyper-speed maneuverability.',
        cooldown: '22.0s',
        complexityCost: 'O(d) depth tracking'
      }
    ],
    skins: [
      { id: 'default', name: 'Zenith Wayfinder', tag: 'CLASSIC', description: 'Heavy navigator pilot exosuit.', preview: 'W', cost: 0 },
      { id: 'celestial', name: 'Star Map HUD', tag: 'CELESTIAL', description: 'Projects a virtual starry constellation grid.', preview: '★', cost: 500 },
      { id: 'proto', name: 'Prototype X-0', tag: 'PROJECT_X', description: 'Top-secret military tactical cybernetic armor.', preview: '☠', cost: 700 }
    ]
  }
];

export default function CharacterSelectionView({
  profile,
  onUpdateProfile,
  onSelectGuardian,
  onBackToMenu
}: CharacterSelectionViewProps) {
  const [selectedId, setSelectedId] = useState<string>(profile.selectedGuardianId || GUARDIANS[0].id);
  const [activeTab, setActiveTab] = useState<'abilities' | 'skins' | 'upgrades' | 'customize'>('abilities');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hudAlert, setHudAlert] = useState<{ title: string; message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sound Engine
  const playSound = (type: 'click' | 'unlock' | 'upgrade' | 'error') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(850, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'unlock') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'upgrade') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.setValueAtTime(480, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(640, ctx.currentTime + 0.16);
        osc.frequency.setValueAtTime(960, ctx.currentTime + 0.24);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'error') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // Audio context blocked
    }
  };

  // Progression retrieval helper (with default fallbacks)
  const getProgression = (id: string): GuardianProgression => {
    const defaults: Record<string, boolean> = {
      sort_spectre: true,
      stack_sentinel: true,
      queue_quake: true,
    };
    const map = profile.guardianProgression || {};
    return map[id] || {
      level: 1,
      xp: 0,
      unlocked: !!defaults[id],
      selectedSkinId: 'default',
      unlockedSkins: ['default'],
      speedBonus: 0,
      memoryBonus: 0,
      recursionBonus: 0,
      stabilityBonus: 0,
    };
  };

  const selectedGuardian = useMemo(() => {
    return GUARDIANS.find(g => g.id === selectedId) || GUARDIANS[0];
  }, [selectedId]);

  const selectedProgression = useMemo(() => {
    return getProgression(selectedId);
  }, [selectedId, profile.guardianProgression]);

  // Decryption Flow (Unlock Guardian / Skin)
  const [decryptingState, setDecryptingState] = useState<{
    active: boolean;
    type: 'guardian' | 'skin';
    targetName: string;
    targetId: string;
    progress: number;
    logLines: string[];
    cost: number;
    skinId?: string;
  } | null>(null);

  // Upgraded stats computed on the fly
  const currentStats = useMemo(() => {
    return {
      speed: Math.min(100, selectedGuardian.stats.speed + selectedProgression.speedBonus),
      memoryEfficiency: Math.min(100, selectedGuardian.stats.memoryEfficiency + selectedProgression.memoryBonus),
      recursionPower: Math.min(100, selectedGuardian.stats.recursionPower + selectedProgression.recursionBonus),
      stability: Math.min(100, selectedGuardian.stats.stability + selectedProgression.stabilityBonus),
    };
  }, [selectedGuardian, selectedProgression]);

  // Trigger skin unlock or guardian unlock
  const handleUnlockRequest = (type: 'guardian' | 'skin', id: string, name: string, cost: number, skinId?: string) => {
    if (profile.points < cost) {
      playSound('error');
      setHudAlert({
        title: "INSUFFICIENT CREDITS",
        message: `DECRYPTION FAILURE!\nUnlocking "${name}" requires ${cost} Points. Clear sorting dungeons to earn more points!`,
        type: 'error'
      });
      return;
    }

    playSound('click');
    setDecryptingState({
      active: true,
      type,
      targetName: name,
      targetId: id,
      progress: 0,
      logLines: ['Initializing auxiliary security subroutines...'],
      cost,
      skinId
    });
  };

  // Run Decryption typing log lines simulation
  useEffect(() => {
    if (!decryptingState || !decryptingState.active) return;

    const logPool = [
      'Establishing tunnel directly to local cache registries...',
      'Synthesizing security authentication key...',
      'Allocating high-efficiency auxiliary heap memory block...',
      'Resolving LIFO stack pointers for decryption buffer...',
      'Dijkstra pathfinding algorithm mapped bypass of firewalls...',
      'Evaluating Constant-Time O(1) hash keys for code injection...',
      'Self-balancing AVL tree rotation successful...',
      'Compiling C# scripts to local assemblies...',
      'Bypassing system permissions block. Override complete!',
      'Executing code sequence injection...'
    ];

    const timer = setInterval(() => {
      setDecryptingState(prev => {
        if (!prev) return null;
        const nextProgress = prev.progress + 10;
        const lineIdx = Math.floor(nextProgress / 10) - 1;
        const newLogs = [...prev.logLines];
        if (logPool[lineIdx]) {
          newLogs.push(logPool[lineIdx]);
        }
        
        if (nextProgress >= 100) {
          clearInterval(timer);
          // Unlock operation
          setTimeout(() => {
            finalizeDecryption(prev.type, prev.targetId, prev.cost, prev.skinId);
          }, 350);
        }

        return {
          ...prev,
          progress: Math.min(100, nextProgress),
          logLines: newLogs
        };
      });
    }, 150);

    return () => clearInterval(timer);
  }, [decryptingState?.active]);

  const finalizeDecryption = (type: 'guardian' | 'skin', id: string, cost: number, skinId?: string) => {
    playSound('unlock');
    const progressionMap = profile.guardianProgression || {};
    const current = getProgression(id);

    if (type === 'guardian') {
      const nextProgressionMap = {
        ...progressionMap,
        [id]: {
          ...current,
          unlocked: true
        }
      };
      onUpdateProfile({
        points: Math.max(0, profile.points - cost),
        guardianProgression: nextProgressionMap,
        selectedGuardianId: id // auto-equip upon unlocking!
      });
    } else if (type === 'skin' && skinId) {
      const nextProgressionMap = {
        ...progressionMap,
        [id]: {
          ...current,
          unlockedSkins: [...current.unlockedSkins, skinId],
          selectedSkinId: skinId // auto-equip skin!
        }
      };
      onUpdateProfile({
        points: Math.max(0, profile.points - cost),
        guardianProgression: nextProgressionMap
      });
    }

    setDecryptingState(null);
  };

  // Upgrades mechanism (Level up character)
  const handleLevelUp = () => {
    const cost = selectedProgression.level * 100;
    if (profile.points < cost) {
      playSound('error');
      setHudAlert({
        title: "INSUFFICIENT XP POINTS",
        message: `UPGRADE REJECTED!\nLeveling up to Lv. ${selectedProgression.level + 1} requires ${cost} Points. Clear more array dungeons to gain computational credits!`,
        type: 'error'
      });
      return;
    }

    playSound('upgrade');
    const nextProgressionMap = {
      ...(profile.guardianProgression || {}),
      [selectedId]: {
        ...selectedProgression,
        level: selectedProgression.level + 1,
        // Award some bonus stat increments on level up
        speedBonus: selectedProgression.speedBonus + 3,
        memoryBonus: selectedProgression.memoryBonus + 3,
        recursionBonus: selectedProgression.recursionBonus + 3,
        stabilityBonus: selectedProgression.stabilityBonus + 3,
      }
    };

    // Check if new skins should be unlocked at certain levels
    let unlockedSkins = [...selectedProgression.unlockedSkins];
    let customMsg = '';
    if (selectedProgression.level + 1 >= 5 && !unlockedSkins.includes(selectedGuardian.skins[1].id)) {
      unlockedSkins.push(selectedGuardian.skins[1].id);
      customMsg = `\n🔥 LEVEL 5 REACHED! Skin "${selectedGuardian.skins[1].name}" has been unlocked!`;
    }

    onUpdateProfile({
      points: Math.max(0, profile.points - cost),
      guardianProgression: nextProgressionMap
    });

    setHudAlert({
      title: "LEVEL UP SUCCESSFUL",
      message: `${selectedGuardian.name} is now Level ${selectedProgression.level + 1}!\nAll core statistics upgraded by +3 points.${customMsg}`,
      type: 'success'
    });
  };

  // Specific stat upgrade with points
  const handleStatUpgrade = (statName: 'speed' | 'memory' | 'recursion' | 'stability') => {
    const upgradeCost = 25;
    if (profile.points < upgradeCost) {
      playSound('error');
      setHudAlert({
        title: "INSUFFICIENT CREDITS",
        message: `SPEC UPGRADE REJECTED!\nUpgrading a specification requires 25 Points. Clear more array dungeons!`,
        type: 'error'
      });
      return;
    }

    // Check bounds
    const baseValue = selectedGuardian.stats[
      statName === 'speed' ? 'speed' :
      statName === 'memory' ? 'memoryEfficiency' :
      statName === 'recursion' ? 'recursionPower' : 'stability'
    ];
    const currentBonus = selectedProgression[
      statName === 'speed' ? 'speedBonus' :
      statName === 'memory' ? 'memoryBonus' :
      statName === 'recursion' ? 'recursionBonus' : 'stabilityBonus'
    ];

    if (baseValue + currentBonus >= 100) {
      playSound('error');
      setHudAlert({
        title: "MAX CAP REACHED",
        message: `SPECIFICATION LIMIT MET!\nThis specification is already at its 100 limit.`,
        type: 'error'
      });
      return;
    }

    playSound('upgrade');
    const key = `${statName}Bonus` as keyof GuardianProgression;
    const nextProgressionMap = {
      ...(profile.guardianProgression || {}),
      [selectedId]: {
        ...selectedProgression,
        [key]: (selectedProgression[key] as number) + 5
      }
    };

    onUpdateProfile({
      points: Math.max(0, profile.points - upgradeCost),
      guardianProgression: nextProgressionMap
    });
  };

  // Equip Skin
  const handleEquipSkin = (skinId: string) => {
    playSound('click');
    const nextProgressionMap = {
      ...(profile.guardianProgression || {}),
      [selectedId]: {
        ...selectedProgression,
        selectedSkinId: skinId
      }
    };
    onUpdateProfile({ guardianProgression: nextProgressionMap });
  };

  // Profile Customizer variables
  const [tempCallsign, setTempCallsign] = useState(profile.username);
  const titlesList = [
    'Bubble Sort Novice',
    'O(N) Linear Agent',
    'O(log N) Divide & Conquer Ronin',
    'LIFO Depth Sentinel',
    'Dijkstra Roadblock Behemoth',
    'Quantum O(1) Spectre',
    'Heuristic A* Wayfinder'
  ];

  const handleSaveProfileCustomization = () => {
    playSound('upgrade');
    onUpdateProfile({
      username: tempCallsign,
    });
    setHudAlert({
      title: "PROFILE SYNCHRONIZED",
      message: `CYBERDECK CREDENTIALS SYNCHRONIZED!\nYour callsign has been saved successfully to the system state.`,
      type: 'success'
    });
  };

  // Colors utility mapping based on rarity / theme
  const getRarityBadgeStyle = (rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary') => {
    switch (rarity) {
      case 'Legendary':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] border-amber-400';
      case 'Epic':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border-emerald-400';
      case 'Rare':
        return 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] border-cyan-400';
      case 'Common':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getThemeColorClass = (color: string) => {
    switch (color) {
      case 'purple':
        return {
          glow: 'shadow-[0_0_30px_rgba(168,85,247,0.45)]',
          border: 'border-purple-500/50',
          activeBorder: 'border-purple-400',
          text: 'text-purple-400',
          textMuted: 'text-purple-300',
          bg: 'bg-purple-950/20',
          solidBg: 'bg-purple-600',
          hoverBg: 'hover:bg-purple-500',
          barColor: 'bg-gradient-to-r from-purple-600 to-indigo-400',
          accentGlow: 'text-purple-300 bg-purple-950/50 border-purple-800/40'
        };
      case 'cyan':
        return {
          glow: 'shadow-[0_0_30px_rgba(6,182,212,0.45)]',
          border: 'border-cyan-500/50',
          activeBorder: 'border-cyan-400',
          text: 'text-cyan-400',
          textMuted: 'text-cyan-300',
          bg: 'bg-cyan-950/20',
          solidBg: 'bg-cyan-600',
          hoverBg: 'hover:bg-cyan-500',
          barColor: 'bg-gradient-to-r from-cyan-500 to-blue-400',
          accentGlow: 'text-cyan-300 bg-cyan-950/50 border-cyan-800/40'
        };
      case 'emerald':
        return {
          glow: 'shadow-[0_0_30px_rgba(16,185,129,0.45)]',
          border: 'border-emerald-500/50',
          activeBorder: 'border-emerald-400',
          text: 'text-emerald-400',
          textMuted: 'text-emerald-300',
          bg: 'bg-emerald-950/20',
          solidBg: 'bg-emerald-600',
          hoverBg: 'hover:bg-emerald-500',
          barColor: 'bg-gradient-to-r from-emerald-500 to-teal-400',
          accentGlow: 'text-emerald-300 bg-emerald-950/50 border-emerald-800/40'
        };
      case 'amber':
      default:
        return {
          glow: 'shadow-[0_0_30px_rgba(245,158,11,0.45)]',
          border: 'border-amber-500/50',
          activeBorder: 'border-amber-400',
          text: 'text-amber-400',
          textMuted: 'text-amber-300',
          bg: 'bg-amber-950/20',
          solidBg: 'bg-amber-600',
          hoverBg: 'hover:bg-amber-500',
          barColor: 'bg-gradient-to-r from-amber-500 to-orange-400',
          accentGlow: 'text-amber-300 bg-amber-950/50 border-amber-800/40'
        };
    }
  };

  const theme = getThemeColorClass(selectedGuardian.themeColor);

  return (
    <div className="relative w-full bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 md:p-6 select-none animate-fade-in text-slate-100 min-h-[750px] font-sans">
      
      {/* Background ambient lighting matching the active guardian theme */}
      <div className={`absolute -top-60 -left-60 w-120 h-120 rounded-full blur-[120px] pointer-events-none z-0 transition-all duration-700 opacity-20 ${
        selectedGuardian.themeColor === 'purple' ? 'bg-purple-600' :
        selectedGuardian.themeColor === 'cyan' ? 'bg-cyan-600' :
        selectedGuardian.themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'
      }`} />

      {/* Decryption Hack Sequence Overlay Modal */}
      <AnimatePresence>
        {decryptingState?.active && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="max-w-md w-full space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-dashed border-cyan-500 animate-spin mx-auto flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-cyan-950/30 rounded-full blur-xl animate-pulse" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-black block">
                  ALGORITHM CORE TUNNEL DETECTED
                </span>
                <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight">
                  DECRYPTING: {decryptingState.targetName}
                </h3>
              </div>

              {/* Progress Loading bar */}
              <div className="space-y-2">
                <div className="w-full h-2.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${decryptingState.progress}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                  />
                </div>
                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                  <span>SEGMENTS RETRIEVED</span>
                  <span className="text-cyan-400 font-bold">{decryptingState.progress}%</span>
                </div>
              </div>

              {/* Running Cyber Logs terminal */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 h-40 overflow-y-auto text-left font-mono text-[9px] text-emerald-400 space-y-1 custom-scrollbar">
                {decryptingState.logLines.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-slate-600 select-none">&gt;&gt;</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PREMIUM TOP HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10 border-b border-slate-800/60 pb-4 mb-4">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl text-purple-400 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)]">
            <Award className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-widest text-cyan-400 font-black uppercase block">
              SECURE BLUEPRINT REPOSITORY v6.2
            </span>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              ALGORITHM GUARDIAN ROSTER
              <span className="text-xs font-normal text-slate-400">({GUARDIANS.length} Guardians Online)</span>
            </h2>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 p-2 rounded-2xl w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-400 font-black text-sm relative">
            {profile.avatar}
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-[7px] text-white">
              ✓
            </div>
          </div>
          <div className="text-left flex-1 min-w-[120px]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-200 truncate">{profile.username}</span>
              <span className="text-[8px] font-mono bg-cyan-950/50 text-cyan-400 px-1 py-0.5 rounded border border-cyan-800/30">ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-mono font-bold text-amber-400">{profile.points} XP Points</span>
            </div>
          </div>
          <button
            onClick={onBackToMenu}
            className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 transition-colors px-3 py-2 bg-slate-950 rounded-xl border border-slate-850 hover:border-slate-700 cursor-pointer"
          >
            &lt; Main Menu
          </button>
        </div>

      </div>

      {/* --- GRID ROSTER & DETAILS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 z-10 items-stretch">
        
        {/* LEFT COLUMN: ROSTER GRID OF 10 GUARDIANS (4 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3 h-[580px] lg:h-[620px]">
          <div className="flex justify-between items-center bg-[#050914]/80 px-3 py-2 rounded-xl border border-slate-900/60">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-purple-400" /> Choose Class Instance
            </span>
            <span className="text-[9px] font-mono text-slate-500">SCROLL FOR MORE</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1.5 space-y-2.5 custom-scrollbar">
            {GUARDIANS.map((guardian, idx) => {
              const prog = getProgression(guardian.id);
              const isSelected = selectedId === guardian.id;
              const isCurrentlyEquipped = profile.selectedGuardianId === guardian.id;
              const cardColor = getThemeColorClass(guardian.themeColor);

              return (
                <motion.div
                  key={guardian.id}
                  onClick={() => {
                    playSound('click');
                    setSelectedId(guardian.id);
                  }}
                  onMouseEnter={() => setHoveredId(guardian.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  whileHover={{ scale: 1.01 }}
                  className={`relative p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    isSelected 
                      ? `${cardColor.border} bg-slate-900/80 shadow-[0_4px_20px_rgba(255,255,255,0.02)]`
                      : 'bg-slate-950 border-slate-900 hover:border-slate-800 hover:bg-slate-900/20'
                  }`}
                >
                  {/* Decorative card gradient back glow */}
                  {isSelected && (
                    <div className={`absolute -right-10 -bottom-10 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none ${
                      guardian.themeColor === 'purple' ? 'bg-purple-600' :
                      guardian.themeColor === 'cyan' ? 'bg-cyan-600' :
                      guardian.themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'
                    }`} />
                  )}

                  <div className="flex items-center gap-3.5">
                    
                    {/* Hologram Circle Avatar */}
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl font-black font-mono tracking-widest relative overflow-hidden shrink-0 ${
                      isSelected ? cardColor.border : 'border-slate-800'
                    } bg-slate-900`}>
                      <span className={isSelected ? cardColor.text : 'text-slate-300'}>
                        {prog.selectedSkinId !== 'default' 
                          ? guardian.skins.find(s => s.id === prog.selectedSkinId)?.preview || guardian.avatarUrl
                          : guardian.avatarUrl
                        }
                      </span>
                      {/* Holographic matrix line background decorative */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse pointer-events-none" />
                    </div>

                    {/* Meta labels */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className="text-xs font-black text-slate-100 truncate flex items-center gap-1">
                          {guardian.name}
                          {isCurrentlyEquipped && (
                            <span className="text-[7px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded border border-emerald-500/30 font-mono font-bold">EQUIPPED</span>
                          )}
                        </span>
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-md border font-semibold ${getRarityBadgeStyle(guardian.rarity)}`}>
                          {guardian.rarity}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 font-mono truncate mt-0.5 uppercase tracking-wider">
                        {guardian.classType}
                      </p>
                      
                      {/* Stats Overview */}
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[8px] font-mono text-slate-400 bg-slate-900 border border-slate-850 px-1 py-0.5 rounded">
                          LV. {prog.level}
                        </span>
                        <span className={`text-[8px] font-mono font-bold ${cardColor.text}`}>
                          Complexity: {guardian.complexityFactor}
                        </span>
                      </div>
                    </div>

                    {/* Locking Icon indicator overlay */}
                    {!prog.unlocked && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px] rounded-2xl flex items-center justify-between p-4 z-20">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-slate-400" />
                          <div className="text-left">
                            <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block font-bold">LOCKED MODULE</span>
                            <span className="text-xs font-bold text-slate-200">Decrypt: {guardian.unlockCost} pts</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnlockRequest('guardian', guardian.id, guardian.name, guardian.unlockCost);
                          }}
                          className="bg-cyan-950/50 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-400 text-[10px] font-mono font-bold py-1.5 px-3 rounded-lg transition-all hover:scale-105 active:scale-95"
                        >
                          DECRYPT
                        </button>
                      </div>
                    )}

                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ADVANCED STATS, CORES & SKINS (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* TOP SHOWCASE VIEWPORT */}
          <div className="bg-[#030611] border border-slate-900 rounded-3xl p-4 md:p-5 relative overflow-hidden flex flex-col md:flex-row items-center gap-5">
            
            {/* Hologram Interactive Render Stage */}
            <div className="relative w-36 h-36 md:w-44 md:h-44 shrink-0 flex items-center justify-center p-3 bg-slate-950 rounded-2xl border border-slate-900">
              {/* Floating laser rings */}
              <div className={`absolute inset-0 rounded-2xl border border-dashed transition-all duration-700 animate-spin-slow ${theme.border} ${theme.glow}`} />
              <div className="absolute inset-2 border border-slate-850/60 rounded-xl pointer-events-none" />

              {/* Glowing vertical scanning laser line */}
              <motion.div 
                animate={{ y: [-60, 60, -60] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                className="absolute left-1 right-1 h-[1.5px] bg-cyan-500/60 shadow-[0_0_8px_rgba(6,182,212,0.8)] pointer-events-none z-10"
              />

              {/* Centered Large initial floating */}
              <div className="text-5xl font-black font-mono tracking-wider text-slate-100 z-10 flex flex-col items-center">
                <span className={`text-6xl animate-pulse ${theme.text}`}>
                  {selectedProgression.selectedSkinId !== 'default' 
                    ? selectedGuardian.skins.find(s => s.id === selectedProgression.selectedSkinId)?.preview || selectedGuardian.avatarUrl
                    : selectedGuardian.avatarUrl
                  }
                </span>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1">HOLOGRAPHIC CORE</span>
              </div>
            </div>

            {/* Selected Guardian Quick Lore Specs */}
            <div className="flex-1 text-left space-y-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-black text-slate-100 tracking-tight uppercase">
                    {selectedGuardian.name}
                  </h3>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md border font-semibold ${getRarityBadgeStyle(selectedGuardian.rarity)}`}>
                    {selectedGuardian.rarity}
                  </span>
                  <span className={`text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md`}>
                    Level {selectedProgression.level}
                  </span>
                </div>
                <p className={`text-xs font-bold uppercase tracking-widest ${theme.text} font-mono`}>
                  {selectedGuardian.title}
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                  {selectedGuardian.description}
                </p>
              </div>

              {/* Equipping Core state action trigger */}
              <div className="flex gap-3">
                {selectedProgression.unlocked ? (
                  profile.selectedGuardianId === selectedGuardian.id ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950/20 text-emerald-400 rounded-xl border border-emerald-800/40 text-xs font-bold font-mono">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>CODE SYNCED TO CORE</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectGuardian(selectedGuardian.id)}
                      className={`py-2 px-5 rounded-xl text-xs font-sans font-black transition-all flex items-center justify-center gap-2 border bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 border-purple-500 text-white shadow-[0_4px_15px_rgba(168,85,247,0.35)] cursor-pointer hover:scale-103 active:scale-97`}
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>DEPLOY IDENTITY INSTANCE</span>
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handleUnlockRequest('guardian', selectedGuardian.id, selectedGuardian.name, selectedGuardian.unlockCost)}
                    className="py-2.5 px-6 rounded-xl text-xs font-mono font-bold border border-cyan-500 bg-cyan-950/40 text-cyan-400 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Unlock className="w-4 h-4 animate-bounce" />
                    <span>DECRYPT CODE MODULE ({selectedGuardian.unlockCost} pts)</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* ADVANCED SUBTABS INTERFACES PANEL */}
          <div className="flex-1 bg-[#040713]/50 border border-slate-900 rounded-2xl flex flex-col overflow-hidden min-h-[380px]">
            
            {/* Tab selection */}
            <div className="flex border-b border-slate-900 bg-slate-950/40 p-1">
              <button
                onClick={() => { playSound('click'); setActiveTab('abilities'); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'abilities'
                    ? 'bg-slate-900 border border-slate-800 text-cyan-400 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                C# CORE ABILITIES
              </button>
              <button
                onClick={() => { playSound('click'); setActiveTab('skins'); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all relative ${
                  activeTab === 'skins'
                    ? 'bg-slate-900 border border-slate-800 text-cyan-400 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SKINS SHOP
                <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
              </button>
              <button
                onClick={() => { playSound('click'); setActiveTab('upgrades'); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'upgrades'
                    ? 'bg-slate-900 border border-slate-800 text-cyan-400 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                CORE UPGRADES
              </button>
              <button
                onClick={() => { playSound('click'); setActiveTab('customize'); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'customize'
                    ? 'bg-slate-900 border border-slate-800 text-cyan-400 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                HUD PREFS
              </button>
            </div>

            {/* TAB CONTENTS PANEL */}
            <div className="p-4 flex-1 overflow-y-auto">
              
              {/* 1. ABILITIES TAB */}
              {activeTab === 'abilities' && (
                <div className="space-y-4 text-left">
                  <div className="bg-slate-900/30 border border-slate-900 p-2.5 rounded-xl flex items-center gap-2">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                    <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                      These compiler routines match real C# classes mapped inside the local Unity project layout structure.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedGuardian.abilities.map((ability, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl space-y-1.5 hover:border-slate-800 transition-all">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-200">{ability.name}</span>
                          <span className="text-[8px] font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-500">
                            CD: {ability.cooldown}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {ability.description}
                        </p>
                        <div className="flex justify-between items-center border-t border-slate-900 pt-1.5 mt-2">
                          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Complexity Cost</span>
                          <span className={`text-[9px] font-mono font-bold ${theme.text}`}>{ability.complexityCost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. SKINS SHOP */}
              {activeTab === 'skins' && (
                <div className="space-y-4 text-left">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                    Equip alternative sub-skins inside simulated databases:
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedGuardian.skins.map((skin) => {
                      const isSkinUnlocked = selectedProgression.unlockedSkins.includes(skin.id);
                      const isSkinEquipped = selectedProgression.selectedSkinId === skin.id;

                      return (
                        <div 
                          key={skin.id}
                          className={`p-3 bg-slate-900/40 border rounded-xl flex flex-col justify-between h-44 transition-all relative ${
                            isSkinEquipped 
                              ? `${theme.border} bg-slate-950/50 shadow-md`
                              : 'border-slate-900 hover:border-slate-800'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-100 truncate">{skin.name}</span>
                              <span className={`text-[7px] font-mono font-bold px-1 py-0.5 rounded ${
                                skin.cost === 0 ? 'bg-slate-850 text-slate-400' : 'bg-cyan-950 text-cyan-400'
                              }`}>
                                {skin.tag}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-snug">
                              {skin.description}
                            </p>
                          </div>

                          {/* Large aesthetic skin model initial block */}
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold font-mono bg-slate-950 border border-slate-900 mx-auto my-1 ${
                            isSkinEquipped ? theme.text : 'text-slate-400'
                          }`}>
                            {skin.preview}
                          </div>

                          {/* Controls */}
                          <div className="mt-2">
                            {isSkinUnlocked ? (
                              isSkinEquipped ? (
                                <div className="w-full text-center py-1.5 bg-emerald-950/20 text-emerald-400 border border-emerald-900 rounded-lg text-[9px] font-mono font-bold flex items-center justify-center gap-1">
                                  <Check className="w-3 h-3" /> EQUIPPED
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleEquipSkin(skin.id)}
                                  className="w-full text-center py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-lg text-[9px] font-mono font-bold transition-all hover:scale-102 active:scale-98 cursor-pointer"
                                >
                                  EQUIP SKIN
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() => handleUnlockRequest('skin', selectedGuardian.id, skin.name, skin.cost, skin.id)}
                                className="w-full text-center py-1.5 bg-amber-950/30 hover:bg-amber-900/30 border border-amber-800/40 text-amber-400 rounded-lg text-[9px] font-mono font-bold transition-all hover:scale-102 active:scale-98 cursor-pointer"
                              >
                                BUY ({skin.cost} pts)
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. CORE UPGRADES (LEVEL & STAT TUNING) */}
              {activeTab === 'upgrades' && (
                <div className="space-y-4 text-left">
                  
                  {/* Ascend levels section */}
                  <div className="p-3.5 bg-slate-950/80 border border-slate-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-slate-100">GUARDIAN ASCENSION</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Spend Points to trigger massive ascensions. Grants +3 points to all core specifications. Unlocks rare character skins at Level 5!
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[8px] font-mono text-slate-500 block">ASCEND COST</span>
                        <span className="text-xs font-mono font-bold text-amber-400">{selectedProgression.level * 100} XP Points</span>
                      </div>
                      <button
                        onClick={handleLevelUp}
                        className="py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-500 text-purple-100 rounded-xl text-[10px] font-mono font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <ChevronUp className="w-4 h-4" /> ASCEND MODULE
                      </button>
                    </div>
                  </div>

                  {/* Tuning individual stats */}
                  <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold block mt-3">
                    MANUAL MICRO-TUNING SPECIFICATIONS (25 points each):
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
                    
                    {/* STAT 1: Execution speed */}
                    <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-300">
                        <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Execution Speed</span>
                        <span className="font-bold">{currentStats.speed} / 100</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${theme.barColor} rounded-full`} style={{ width: `${currentStats.speed}%` }} />
                      </div>
                      <div className="flex justify-between items-center pt-1 text-[9px] font-mono text-slate-500">
                        <span>Base: {selectedGuardian.stats.speed} (+{selectedProgression.speedBonus})</span>
                        <button
                          onClick={() => handleStatUpgrade('speed')}
                          disabled={currentStats.speed >= 100}
                          className="text-[9px] bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-cyan-400 px-2 py-0.5 rounded cursor-pointer disabled:opacity-50"
                        >
                          {currentStats.speed >= 100 ? 'MAX' : '+5 Upgrade'}
                        </button>
                      </div>
                    </div>

                    {/* STAT 2: Memory */}
                    <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-300">
                        <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-emerald-400" /> Space Efficiency</span>
                        <span className="font-bold">{currentStats.memoryEfficiency} / 100</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${theme.barColor} rounded-full`} style={{ width: `${currentStats.memoryEfficiency}%` }} />
                      </div>
                      <div className="flex justify-between items-center pt-1 text-[9px] font-mono text-slate-500">
                        <span>Base: {selectedGuardian.stats.memoryEfficiency} (+{selectedProgression.memoryBonus})</span>
                        <button
                          onClick={() => handleStatUpgrade('memory')}
                          disabled={currentStats.memoryEfficiency >= 100}
                          className="text-[9px] bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-cyan-400 px-2 py-0.5 rounded cursor-pointer disabled:opacity-50"
                        >
                          {currentStats.memoryEfficiency >= 100 ? 'MAX' : '+5 Upgrade'}
                        </button>
                      </div>
                    </div>

                    {/* STAT 3: Recursion */}
                    <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-300">
                        <span className="flex items-center gap-1"><Brain className="w-3.5 h-3.5 text-purple-400" /> Recursion Depth</span>
                        <span className="font-bold">{currentStats.recursionPower} / 100</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${theme.barColor} rounded-full`} style={{ width: `${currentStats.recursionPower}%` }} />
                      </div>
                      <div className="flex justify-between items-center pt-1 text-[9px] font-mono text-slate-500">
                        <span>Base: {selectedGuardian.stats.recursionPower} (+{selectedProgression.recursionBonus})</span>
                        <button
                          onClick={() => handleStatUpgrade('recursion')}
                          disabled={currentStats.recursionPower >= 100}
                          className="text-[9px] bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-cyan-400 px-2 py-0.5 rounded cursor-pointer disabled:opacity-50"
                        >
                          {currentStats.recursionPower >= 100 ? 'MAX' : '+5 Upgrade'}
                        </button>
                      </div>
                    </div>

                    {/* STAT 4: Stability */}
                    <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-300">
                        <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-amber-400" /> Sort Stability</span>
                        <span className="font-bold">{currentStats.stability} / 100</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${theme.barColor} rounded-full`} style={{ width: `${currentStats.stability}%` }} />
                      </div>
                      <div className="flex justify-between items-center pt-1 text-[9px] font-mono text-slate-500">
                        <span>Base: {selectedGuardian.stats.stability} (+{selectedProgression.stabilityBonus})</span>
                        <button
                          onClick={() => handleStatUpgrade('stability')}
                          disabled={currentStats.stability >= 100}
                          className="text-[9px] bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-cyan-400 px-2 py-0.5 rounded cursor-pointer disabled:opacity-50"
                        >
                          {currentStats.stability >= 100 ? 'MAX' : '+5 Upgrade'}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 4. CUSTOMIZE TAB */}
              {activeTab === 'customize' && (
                <div className="space-y-4 text-left">
                  <div className="bg-slate-900/30 border border-slate-900 p-3 rounded-xl space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                      Edit cyberdeck user configuration profiles:
                    </span>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500 block">CALLSIGN NAME</label>
                          <input
                            type="text"
                            value={tempCallsign}
                            onChange={(e) => setTempCallsign(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 outline-none focus:border-cyan-500 transition-colors"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500 block">ACTIVE ACCOUNT STATS</label>
                          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-400 flex items-center justify-between">
                            <span>Points</span>
                            <span className="text-amber-400">{profile.points} pts</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-900 pt-3 mt-3 flex justify-end">
                        <button
                          onClick={handleSaveProfileCustomization}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-mono font-bold text-cyan-400 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> SAVE CREDENTIALS
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* UI Color Preset selection explanation */}
                  <div className="bg-slate-900/10 border border-dashed border-slate-800 rounded-xl p-3 flex gap-2.5 items-start">
                    <Palette className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-300">DYNAMIC HUD COLOR MAP</span>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                        The user HUD interface matches the selected algorithm's specific compile color. Equip alternate guardians in the roster view to dynamically recalibrate the entire cockpit theme!
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* --- FOOTER STATUS & CONTINUE --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-900 pt-4 mt-4 gap-4 z-10 shrink-0">
        
        {/* Status */}
        <div className="text-center sm:text-left flex items-center gap-2">
          {profile.selectedGuardianId ? (
            <>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-xs font-mono text-emerald-400">
                ACTIVE IDENTITY: <b className="uppercase font-extrabold">{GUARDIANS.find(g => g.id === profile.selectedGuardianId)?.name} (Lv. {getProgression(profile.selectedGuardianId).level})</b>
              </span>
            </>
          ) : (
            <>
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-slate-400">
                Awaiting compile credential loading...
              </span>
            </>
          )}
        </div>

        {/* Start Game Action */}
        <button
          onClick={() => {
            playSound('click');
            if (profile.selectedGuardianId) {
              onSelectGuardian(profile.selectedGuardianId);
            } else {
              onSelectGuardian(selectedId);
            }
          }}
          className="w-full sm:w-auto py-3 px-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 border border-purple-500 text-white rounded-2xl text-xs font-black tracking-widest uppercase shadow-[0_4px_25px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white animate-pulse" />
          <span>ENTER SORTING DUNGEON</span>
        </button>

      </div>

      {/* Custom HUD Alert Overlay */}
      {hudAlert && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in font-mono">
          <div className="bg-slate-950 border-2 border-cyan-500/50 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)] text-left">
            <div className={`px-4 py-2 border-b border-cyan-500/30 flex items-center gap-2 ${
              hudAlert.type === 'error' ? 'bg-red-950/40 text-red-400' : 'bg-cyan-950/40 text-cyan-300'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0 animate-pulse" />
              <span className="text-xs font-bold tracking-wider">{hudAlert.title}</span>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{hudAlert.message}</p>
              <button
                onClick={() => { playSound('click'); setHudAlert(null); }}
                className="w-full py-2 bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500/40 text-cyan-200 text-xs font-bold rounded-lg transition-all"
              >
                CONFIRM DECRYPTION ROUTE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
