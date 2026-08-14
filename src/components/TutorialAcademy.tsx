import React, { useState, useEffect } from 'react';
import { 
  Terminal, Shield, Award, Sparkles, HelpCircle, AlertCircle, 
  ChevronRight, Play, CheckCircle2, RotateCcw, Lightbulb, 
  Cpu, Flame, Lock, Unlock, Trophy, Send, RefreshCw, X, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileState } from '../types';
import PremiumAudioManager from '../lib/audioManager';

interface TutorialAcademyProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
}

interface Problem {
  id: string;
  title: string;
  type: 'code' | 'complexity' | 'debug';
  description: string;
  objective: string;
  hint: string;
  xpReward: number;
  pointsReward: number;
  
  // For 'code' problems
  boilerplate?: string;
  validator?: (code: string) => { success: boolean; message: string };
  examples?: { input: string; output: string }[];

  // For 'complexity' problems
  codeSnippet?: string;
  complexityOptions?: string[];
  correctAnswer?: string;

  // For 'debug' problems
  buggyCode?: string;
  bugLineIndex?: number;
  fixOptions?: string[];
  correctFix?: string;
}

interface Level {
  id: number;
  name: string;
  topic: string;
  bossName: string;
  bossTitle: string;
  bossAvatar: string;
  bossMaxHP: number;
  bossDialogueGreeting: string;
  bossDialogueDefeated: string;
  problems: Problem[];
  rewardAchievementId: string;
  rewardAchievementName: string;
}

const ACADEMY_LEVELS: Level[] = [
  {
    id: 1,
    name: "Core Fundamentals",
    topic: "Variables & Input/Output Streams",
    bossName: "Byte-Smasher 101",
    bossTitle: "Compiler Gateway Guardian",
    bossAvatar: "💾",
    bossMaxHP: 100,
    bossDialogueGreeting: "System logs show an unauthorized compiler thread! Prove your syntactic clearance or be dereferenced!",
    bossDialogueDefeated: "Compiler clearance verified. Your variables have stable memory boundaries.",
    rewardAchievementId: "academy_lvl1",
    rewardAchievementName: "Syntactic Clearance",
    problems: [
      {
        id: "variables_declare",
        title: "Variable Encryption",
        type: "code",
        description: "To bypass the initial registry lock, declare a variable named `encryptionKey` with a value of `8192` (number), and another variable named `securityProtocol` with the string `'AES256'`. Finally, return an object containing both variables: `{ key: encryptionKey, protocol: securityProtocol }`.",
        objective: "Declare, assign, and return variables in a structured object.",
        hint: "Use const or let. Ensure keys in the returned object are exactly 'key' and 'protocol'.",
        xpReward: 50,
        pointsReward: 50,
        boilerplate: `function solve() {\n  // Write your code here\n  \n}`,
        examples: [
          { input: "No parameters", output: "{ key: 8192, protocol: 'AES256' }" }
        ],
        validator: (code: string) => {
          try {
            const fn = new Function(`${code}\nreturn solve;`)();
            const result = fn();
            if (result && result.key === 8192 && result.protocol === 'AES256') {
              return { success: true, message: "Perfect memory declaration! Variables synchronized successfully." };
            }
            return { success: false, message: `Returned object values mismatch. Got: ${JSON.stringify(result)}` };
          } catch (e: any) {
            return { success: false, message: `Compilation failed: ${e.message}` };
          }
        }
      },
      {
        id: "input_output",
        title: "Buffer Stream Processing",
        type: "code",
        description: "The incoming data feed sends a callsign username string (e.g. `'SortSpectre'`) and a level integer (e.g. `4`). Implement a function `processStream(username, level)` that returns a formatted terminal handshake string: `'AGENT [username] COMMENCING DECRYPTION AT LEVEL [level]'`.",
        objective: "Extract parameters from input stream and construct output string.",
        hint: "Use template literals or standard concatenation. Ensure spacing is exactly correct.",
        xpReward: 60,
        pointsReward: 50,
        boilerplate: `function processStream(username, level) {\n  // Return formatted terminal handshake\n  \n}`,
        examples: [
          { input: "('SortSpectre', 4)", output: "'AGENT SortSpectre COMMENCING DECRYPTION AT LEVEL 4'" }
        ],
        validator: (code: string) => {
          try {
            const fn = new Function(`${code}\nreturn processStream;`)();
            const result = fn('SortSpectre', 4);
            const expected = "AGENT SortSpectre COMMENCING DECRYPTION AT LEVEL 4";
            if (result === expected) {
              return { success: true, message: "Handshake verified! Stream parsed flawlessly." };
            }
            return { success: false, message: `Handshake mismatch.\nExpected: "${expected}"\nGot: "${result}"` };
          } catch (e: any) {
            return { success: false, message: `Compilation failed: ${e.message}` };
          }
        }
      }
    ]
  },
  {
    id: 2,
    name: "Control Logic",
    topic: "Conditions & Loops",
    bossName: "Conditional Cycler",
    bossTitle: "Router Mainframe Supervisor",
    bossAvatar: "🔄",
    bossMaxHP: 120,
    bossDialogueGreeting: "An infinity loop detector is tracking your code flow! Choose your routing paths wisely or face stack overflow!",
    bossDialogueDefeated: "Loop iterations completed. All conditions are logically evaluated.",
    rewardAchievementId: "academy_lvl2",
    rewardAchievementName: "Logical Pathwalker",
    problems: [
      {
        id: "gatekeeper_conditions",
        title: "Firewall Authorization",
        type: "code",
        description: "The central firewall authorizes execution based on CPU load and access rating points. Create a function `authorize(cpuLoad, points)` that returns `'DENIED'` if `cpuLoad` is above `85` (overloaded), returns `'BYPASS'` if `points` is `1000` or higher (elite override), and otherwise returns `'AUTHORIZED'`.",
        objective: "Evaluate conditional thresholds with correct priority.",
        hint: "Check cpuLoad first! Then check points, then default to 'AUTHORIZED'.",
        xpReward: 60,
        pointsReward: 60,
        boilerplate: `function authorize(cpuLoad, points) {\n  // Evaluates authorization criteria\n  \n}`,
        examples: [
          { input: "(90, 1500)", output: "'DENIED'" },
          { input: "(50, 1200)", output: "'BYPASS'" },
          { input: "(50, 420)", output: "'AUTHORIZED'" }
        ],
        validator: (code: string) => {
          try {
            const fn = new Function(`${code}\nreturn authorize;`)();
            if (fn(90, 1500) !== 'DENIED') return { success: false, message: "Failed: cpuLoad above 85 must return 'DENIED' even if points are elite." };
            if (fn(50, 1200) !== 'BYPASS') return { success: false, message: "Failed: points >= 1000 must return 'BYPASS'." };
            if (fn(50, 420) !== 'AUTHORIZED') return { success: false, message: "Failed: Standard parameters must return 'AUTHORIZED'." };
            return { success: true, message: "Firewall authorization rules validated successfully!" };
          } catch (e: any) {
            return { success: false, message: `Compilation failed: ${e.message}` };
          }
        }
      },
      {
        id: "loop_multipliers",
        title: "Sub-sector Summation Loop",
        type: "code",
        description: "The mainframe is requesting a sum of all active sub-sector codes up to a given limit, but ONLY codes divisible by 3. Implement `sumSectors(limit)` which iterates from `1` to `limit` (inclusive) and returns the sum of all numbers divisible by `3`.",
        objective: "Write a for-loop with conditional increments.",
        hint: "Initialize sum to 0. Use a modulo operator (%) to check divisibility by 3.",
        xpReward: 70,
        pointsReward: 60,
        boilerplate: `function sumSectors(limit) {\n  let sum = 0;\n  // Write loop iteration here\n  \n  return sum;\n}`,
        examples: [
          { input: "(10)", output: "18 (3 + 6 + 9)" }
        ],
        validator: (code: string) => {
          try {
            const fn = new Function(`${code}\nreturn sumSectors;`)();
            if (fn(10) !== 18) return { success: false, message: "Failed for limit = 10. Expected 18." };
            if (fn(15) !== 45) return { success: false, message: "Failed for limit = 15. Expected 45 (3+6+9+12+15)." };
            return { success: true, message: "Iteration sum matches mathematical parameters! Loop checked." };
          } catch (e: any) {
            return { success: false, message: `Compilation failed: ${e.message}` };
          }
        }
      }
    ]
  },
  {
    id: 3,
    name: "Modular Engineering",
    topic: "Functions & Scope Enclosures",
    bossName: "Function Overloader",
    bossTitle: "Stack Frame Overlord",
    bossAvatar: "🧠",
    bossMaxHP: 140,
    bossDialogueGreeting: "Your callstack is leaking local scope variables! Encapsulate your execution frames immediately!",
    bossDialogueDefeated: "Callstack stabilized. Modular boundaries successfully compiled.",
    rewardAchievementId: "academy_lvl3",
    rewardAchievementName: "Callstack Architect",
    problems: [
      {
        id: "stack_frames",
        title: "Nested Cyberdeck Modules",
        type: "code",
        description: "To prevent memory bleed, encapsulate execution into modular sub-routines. Implement a master function `calcMemoryBlock(size, nodes)` that calculates total footprint by calling a helper function `getNodeSize(type)` which returns `64` bytes. It should multiply the type's node size by the total `nodes` and add the `size` offset.",
        objective: "Define and call helper functions within scope.",
        hint: "Inside calcMemoryBlock, you can define or call getNodeSize which returns 64. Return: nodes * 64 + size.",
        xpReward: 70,
        pointsReward: 70,
        boilerplate: `function calcMemoryBlock(size, nodes) {\n  function getNodeSize() {\n    return 64;\n  }\n  // Write logic calling getNodeSize\n  \n}`,
        examples: [
          { input: "(1024, 8)", output: "1536 (8 * 64 + 1024)" }
        ],
        validator: (code: string) => {
          try {
            const fn = new Function(`${code}\nreturn calcMemoryBlock;`)();
            if (fn(1024, 8) !== 1536) return { success: false, message: "Failed for (1024, 8). Got: " + fn(1024, 8) };
            if (fn(512, 4) !== 768) return { success: false, message: "Failed for (512, 4). Got: " + fn(512, 4) };
            return { success: true, message: "Modular callstack and sub-routine execution verified!" };
          } catch (e: any) {
            return { success: false, message: `Compilation failed: ${e.message}` };
          }
        }
      },
      {
        id: "lexical_enclosure",
        title: "Memory Vault (Closure)",
        type: "code",
        description: "A closure keeps internal state safe from external injection. Implement a function `createVault(initialValue)` that returns an object with two functions: `add(val)` which increments the vault value, and `getValue()` which returns the current vault value. The internal value must not be directly accessible.",
        objective: "Implement a stateful closure encapsulating data.",
        hint: "Let a variable hold initialValue. Return an object with add and getValue methods.",
        xpReward: 80,
        pointsReward: 70,
        boilerplate: `function createVault(initialValue) {\n  let value = initialValue;\n  return {\n    // Implement add and getValue methods\n  };\n}`,
        examples: [
          { input: "let v = createVault(100); v.add(50); v.getValue();", output: "150" }
        ],
        validator: (code: string) => {
          try {
            const fn = new Function(`${code}\nreturn createVault;`)();
            const vault = fn(100);
            if (typeof vault.add !== 'function' || typeof vault.getValue !== 'function') {
              return { success: false, message: "Failed: Returned object must have 'add' and 'getValue' methods." };
            }
            vault.add(50);
            if (vault.getValue() !== 150) return { success: false, message: "Failed: add(50) did not increment correctly. Expected 150, got: " + vault.getValue() };
            return { success: true, message: "Lexical vault enclosure locked! Internal variables isolated." };
          } catch (e: any) {
            return { success: false, message: `Compilation failed: ${e.message}` };
          }
        }
      }
    ]
  },
  {
    id: 4,
    name: "Algorithmic Complexity",
    topic: "Big-O Space & Time Analysis",
    bossName: "Big-O Chrono-Beast",
    bossTitle: "Asymptotic Warp Master",
    bossAvatar: "⏳",
    bossMaxHP: 160,
    bossDialogueGreeting: "Your algorithm scaling is quadratic! My computational power is sub-linear. Prepare to be throttled!",
    bossDialogueDefeated: "Asymptotic optimization achieved. Memory allocations are minimized.",
    rewardAchievementId: "academy_lvl4",
    rewardAchievementName: "Complexity Analyst",
    problems: [
      {
        id: "bigo_time",
        title: "Asymptotic Time Classifier",
        type: "complexity",
        description: "Identify the correct Big-O time complexity of the given routine that searches an unsorted database by scanning one item at a time.",
        objective: "Identify time scaling characteristics under asymptotic growth.",
        hint: "Scanning an unsorted array of size N one-by-one is a linear search.",
        xpReward: 80,
        pointsReward: 80,
        codeSnippet: `function findSystemCode(codes, target) {
  for (let i = 0; i < codes.length; i++) {
    if (codes[i] === target) {
      return i; // Single loop scan
    }
  }
  return -1;
}`,
        complexityOptions: ["O(1)", "O(log N)", "O(N)", "O(N log N)", "O(N^2)"],
        correctAnswer: "O(N)"
      },
      {
        id: "bigo_space",
        title: "Auxiliary Space Evaluation",
        type: "complexity",
        description: "Identify the auxiliary space complexity of the given recursion stack designed to generate sequential key buffers.",
        objective: "Evaluate additional memory structures allocated dynamically.",
        hint: "Creating a new array of size N directly correlates memory usage linearly with N.",
        xpReward: 90,
        pointsReward: 80,
        codeSnippet: `function generateBuffer(size) {
  const securityLog = [];
  for (let i = 0; i < size; i++) {
    securityLog.push("LOG_" + i); // Appending size elements
  }
  return securityLog;
}`,
        complexityOptions: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        correctAnswer: "O(N)"
      }
    ]
  },
  {
    id: 5,
    name: "Memory & Testing",
    topic: "Basic Arrays & Live Debugging",
    bossName: "NullPointer Overlord",
    bossTitle: "The Kernel Core Threat",
    bossAvatar: "👾",
    bossMaxHP: 200,
    bossDialogueGreeting: "I have loaded corrupt memory segments into your core arrays! Debug this terminal or face complete kernel panic!",
    bossDialogueDefeated: "Core debugged successfully. Array contiguous boundaries verified.",
    rewardAchievementId: "academy_lvl5",
    rewardAchievementName: "Dungeon Exterminator",
    problems: [
      {
        id: "contiguous_arrays",
        title: "Index Swapping Matrix",
        type: "code",
        description: "Contiguous arrays use consecutive memory offsets. Implement `swapEnds(arr)` which modifies the input array by swapping the first element with the last element in O(1) space, and returns the modified array.",
        objective: "Manipulate contiguous index slots in-place.",
        hint: "Store arr[0] in a temp variable. Assign the last element to index 0, and temp to the last index.",
        xpReward: 100,
        pointsReward: 100,
        boilerplate: `function swapEnds(arr) {\n  if (arr.length < 2) return arr;\n  // Swap first and last elements\n  \n  return arr;\n}`,
        examples: [
          { input: "([10, 20, 30, 40])", output: "[40, 20, 30, 10]" }
        ],
        validator: (code: string) => {
          try {
            const fn = new Function(`${code}\nreturn swapEnds;`)();
            const input = [10, 20, 30, 40];
            const output = fn(input);
            if (output[0] === 40 && output[3] === 10) {
              return { success: true, message: "Swap confirmed! Memory indices successfully re-allocated." };
            }
            return { success: false, message: `Indices unaligned. Got: ${JSON.stringify(output)}` };
          } catch (e: any) {
            return { success: false, message: `Compilation failed: ${e.message}` };
          }
        }
      },
      {
        id: "bug_hunt",
        title: "Logic Bug Exterminator",
        type: "debug",
        description: "The binary search module is throwing off-by-one loop errors on boundary queries. Identify the critical bug in the array index boundary initialization to prevent memory corruption.",
        objective: "Scan code for arithmetic boundary errors.",
        hint: "Look at the high pointer initialization. When using 0-based indexing, the last index is length - 1.",
        xpReward: 120,
        pointsReward: 100,
        buggyCode: `function binarySearch(nums, target) {
  let low = 0;
  let high = nums.length; // BUG: Out of range index boundary!
  
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
        bugLineIndex: 2,
        fixOptions: [
          "let high = nums.length - 1;",
          "let high = nums.length + 1;",
          "let low = -1;",
          "let high = nums.length / 2;"
        ],
        correctFix: "let high = nums.length - 1;"
      }
    ]
  }
];

export default function TutorialAcademy({ profile, onUpdateProfile, onBackToMenu }: TutorialAcademyProps) {
  const [activeLevelIdx, setActiveLevelIdx] = useState<number>(0);
  const [activeProblemIdx, setActiveProblemIdx] = useState<number>(0);
  const [selectedLevel, setSelectedLevel] = useState<Level>(ACADEMY_LEVELS[0]);
  const [bossHP, setBossHP] = useState<number>(ACADEMY_LEVELS[0].problems[0] ? ACADEMY_LEVELS[0].bossMaxHP : 100);
  const [currentDialogue, setCurrentDialogue] = useState<string>(ACADEMY_LEVELS[0].bossDialogueGreeting);
  const [userCode, setUserCode] = useState<string>(ACADEMY_LEVELS[0].problems[0]?.boilerplate || '');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('');
  const [selectedFix, setSelectedFix] = useState<string>('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [compilerStatus, setCompilerStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [bossDamageAnim, setBossDamageAnim] = useState<number | null>(null);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  // Audio trigger
  const playSound = (type: 'click' | 'transition' | 'swap' | 'win' | 'error' | 'ability' | 'powerdown') => {
    PremiumAudioManager.getInstance().playSFX(type);
  };

  // Sync level and problem selections
  useEffect(() => {
    const lvl = ACADEMY_LEVELS[activeLevelIdx];
    setSelectedLevel(lvl);
    setActiveProblemIdx(0);
    setBossHP(lvl.bossMaxHP);
    setCurrentDialogue(lvl.bossDialogueGreeting);
    setShowHint(false);
    
    const prob = lvl.problems[0];
    if (prob) {
      setUserCode(prob.boilerplate || '');
      setSelectedComplexity('');
      setSelectedFix('');
    }
    setConsoleLogs([`[SYSTEM] Connected to Sector Level ${lvl.id}: ${lvl.name}. Guardian initialized.`]);
  }, [activeLevelIdx]);

  useEffect(() => {
    const prob = selectedLevel.problems[activeProblemIdx];
    if (prob) {
      setUserCode(prob.boilerplate || '');
      setSelectedComplexity('');
      setSelectedFix('');
      setShowHint(false);
      setConsoleLogs(prev => [...prev, `[SYSTEM] Activated Challenge ${activeProblemIdx + 1}: ${prob.title}`]);
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

  const executeCompilerHandshake = async () => {
    const prob = selectedLevel.problems[activeProblemIdx];
    if (!prob) return;

    setCompilerStatus('running');
    playSound('transition');
    setConsoleLogs(prev => [...prev, `[COMPILER] Initiating syntactic structural analysis...`]);

    await new Promise(resolve => setTimeout(resolve, 1000));

    let isSuccess = false;
    let logMessage = '';

    if (prob.type === 'code' && prob.validator) {
      const valResult = prob.validator(userCode);
      isSuccess = valResult.success;
      logMessage = valResult.message;
    } else if (prob.type === 'complexity') {
      if (selectedComplexity === prob.correctAnswer) {
        isSuccess = true;
        logMessage = "✅ Correct! Algorithmic scaling indices perfectly matching expected performance.";
      } else {
        isSuccess = false;
        logMessage = `❌ Incorrect. Selected complexity ${selectedComplexity} failed runtime constraints.`;
      }
    } else if (prob.type === 'debug') {
      if (selectedFix === prob.correctFix) {
        isSuccess = true;
        logMessage = "✅ Logic error resolved! Contiguous memory bounds aligned.";
      } else {
        isSuccess = false;
        logMessage = `❌ Defect persists. Compiler rejected fix suggestion: "${selectedFix}"`;
      }
    }

    setConsoleLogs(prev => [...prev, logMessage]);

    if (isSuccess) {
      setCompilerStatus('success');
      playSound('win');
      
      // Calculate damage based on problem reward
      const damage = Math.ceil((prob.xpReward / selectedLevel.problems.length) * 1.5);
      setBossDamageAnim(damage);
      setTimeout(() => setBossDamageAnim(null), 1000);

      // Decrement boss HP
      setBossHP(prev => {
        const nextHp = Math.max(0, prev - damage);
        if (nextHp === 0) {
          setCurrentDialogue(selectedLevel.bossDialogueDefeated);
          // Unlock achievement on boss defeat!
          setTimeout(() => {
            triggerLevelCompletion();
          }, 800);
        } else {
          setCurrentDialogue("Curse you! Your algorithm breached my defense buffers! Complete the next sequence to bypass me!");
        }
        return nextHp;
      });

      // Add to solved list
      if (!solvedProblemIds.includes(prob.id)) {
        setSolvedProblemIds(prev => [...prev, prob.id]);
        
        // Grant rewards
        const nextPoints = profile.points + prob.pointsReward;
        onUpdateProfile({
          points: nextPoints
        });
        setConsoleLogs(prev => [...prev, `🎁 REWARDS ACQUIRED: +${prob.xpReward} XP • +${prob.pointsReward} Cyber Credits!`]);
      }

    } else {
      setCompilerStatus('error');
      playSound('error');
      setCurrentDialogue("Miserable compiler thread! Your code contains logical flaws. Rectify the structure immediately!");
    }
  };

  const triggerLevelCompletion = () => {
    // Check if achievement is already unlocked to avoid spamming
    const hasAchievement = profile.achievements.some(a => a.id === selectedLevel.rewardAchievementId);
    
    if (!hasAchievement) {
      const updatedAchievements = profile.achievements.map(ach => {
        if (ach.id === selectedLevel.rewardAchievementId || ach.name === selectedLevel.rewardAchievementName) {
          return { ...ach, isUnlocked: true };
        }
        return ach;
      });

      // Check if the specific level completion achievement is already in profile, if not add it
      const achExists = updatedAchievements.some(a => a.id === selectedLevel.rewardAchievementId);
      const finalAchievements = achExists ? updatedAchievements : [
        ...updatedAchievements,
        {
          id: selectedLevel.rewardAchievementId,
          name: selectedLevel.rewardAchievementName,
          description: `Defeated ${selectedLevel.bossName} and unlocked ${selectedLevel.topic} Clearance.`,
          isUnlocked: true,
          ratingValue: 150
        }
      ];

      onUpdateProfile({
        points: profile.points + 150,
        achievements: finalAchievements
      });

      setNewAchievement(selectedLevel.rewardAchievementName);
      playSound('win');
    }
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-mono text-slate-200">
      
      {/* Visual neon grid header */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]" />

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400 animate-pulse" />
            <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-purple-400">
              UNITY TUTORIAL ACADEMY
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
            Level up fundamental algorithms & computer architecture bounds
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>CREDITS: <b className="text-cyan-400">{profile.points}</b></span>
          </div>

          <button
            onClick={() => { playSound('powerdown'); onBackToMenu(); }}
            className="px-4 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 hover:border-red-500/50 text-red-200 text-xs font-bold rounded-xl transition-all"
          >
            DISCONNECT ACADEMY
          </button>
        </div>
      </div>

      {/* LEVEL SELECTION SLIDERS */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {ACADEMY_LEVELS.map((lvl, index) => {
          const isSelected = activeLevelIdx === index;
          const isCleared = solvedProblemIds.includes(lvl.problems[lvl.problems.length - 1]?.id);
          return (
            <button
              key={lvl.id}
              onClick={() => handleLevelSelect(index)}
              className={`relative p-3 rounded-2xl border text-left transition-all ${
                isSelected 
                  ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)] text-purple-100' 
                  : isCleared
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/30'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>LVL {lvl.id}</span>
                {isCleared ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Lock className="w-2.5 h-2.5" />
                )}
              </div>
              <h4 className="text-xs font-black truncate mt-1">{lvl.name}</h4>
              <p className="text-[8px] text-slate-400 truncate mt-0.5">{lvl.topic}</p>
            </button>
          );
        })}
      </div>

      {/* CORE INTERACTIVE GRID */}
      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: THE BOSS GUARDIAN ENCOUNTER & STORY */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          
          {/* BOSS CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-lg">
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none" />

            <div className="flex items-center gap-3">
              <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] animate-bounce">
                {selectedLevel.bossAvatar}
              </span>
              <div>
                <span className="px-1.5 py-0.5 bg-red-950 text-red-400 border border-red-800/40 rounded text-[8px] font-bold tracking-widest">
                  SECTOR BOSS
                </span>
                <h3 className="text-sm font-black tracking-wide text-slate-100 mt-0.5">
                  {selectedLevel.bossName}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {selectedLevel.bossTitle}
                </p>
              </div>
            </div>

            {/* BOSS HEALTH STATE BAR */}
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-red-400 font-bold uppercase tracking-wider">MAINFRAME STABILITY</span>
                <span className="font-mono text-slate-300">{bossHP} / {selectedLevel.bossMaxHP} HP</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-0.5">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: `${(bossHP / selectedLevel.bossMaxHP) * 100}%` }}
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                />
              </div>
            </div>

            {/* Simulated Floating Damage animation */}
            <AnimatePresence>
              {bossDamageAnim !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.5 }}
                  animate={{ opacity: 1, y: -20, scale: 1.2 }}
                  exit={{ opacity: 0, y: -40 }}
                  className="absolute left-1/2 top-10 transform -translate-x-1/2 text-xl font-extrabold text-amber-400 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] z-20"
                >
                  -{bossDamageAnim} STABILITY!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BOSS DIALOGUE MODULE */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs relative text-left">
            <span className="absolute -top-2 left-4 px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-[8px] text-purple-400 tracking-wider">
              INTERCEPTED COMMUNICATION
            </span>
            <p className="text-slate-300 leading-relaxed italic mt-1 font-sans">
              "{currentDialogue}"
            </p>
          </div>

          {/* PROBLEMS SELECTOR FOR ACTIVE LEVEL */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              Sector Challenge Decryption Keys
            </h4>
            <div className="space-y-2">
              {selectedLevel.problems.map((prob, idx) => {
                const isActive = activeProblemIdx === idx;
                const isSolved = solvedProblemIds.includes(prob.id);
                return (
                  <button
                    key={prob.id}
                    onClick={() => { playSound('click'); setActiveProblemIdx(idx); }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                      isActive 
                        ? 'bg-cyan-950/30 border-cyan-500 text-cyan-200' 
                        : 'bg-slate-950 border-slate-850 hover:border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isSolved ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                      <span className="font-bold truncate max-w-[150px]">{prob.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 font-mono text-[9px]">
                      <span className="text-purple-400">+{prob.pointsReward} PTS</span>
                      {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE INTERACTIVE SYSTEM BOARD */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 text-left">
          
          {/* PROBLEM CONTENT */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800/40 rounded text-[9px] font-bold uppercase tracking-widest">
                  CHALLENGE {activeProblemIdx + 1}: {selectedLevel.problems[activeProblemIdx]?.type.toUpperCase()}
                </span>
                <h3 className="text-sm font-black tracking-wide text-slate-100 mt-1">
                  {selectedLevel.problems[activeProblemIdx]?.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-slate-400">MISSION REWARD:</span>
                <span className="text-emerald-400 font-bold">+{selectedLevel.problems[activeProblemIdx]?.xpReward} XP</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
              {selectedLevel.problems[activeProblemIdx]?.description}
            </p>

            {/* Objective list */}
            <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compiler Directives:</span>
              <p className="text-xs text-cyan-300 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                {selectedLevel.problems[activeProblemIdx]?.objective}
              </p>
            </div>

            {/* EXAMPLES (IF AVAILABLE) */}
            {selectedLevel.problems[activeProblemIdx]?.examples && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Decryption Stream Examples:</span>
                <div className="grid grid-cols-1 gap-2">
                  {selectedLevel.problems[activeProblemIdx].examples?.map((ex, i) => (
                    <div key={i} className="p-2 bg-slate-950 border border-slate-850 rounded-lg text-xs space-y-1">
                      <div className="text-slate-500 font-mono text-[10px]">Handshake input parameters: <code className="text-slate-300">{ex.input}</code></div>
                      <div className="text-slate-500 font-mono text-[10px]">Expected return value: <code className="text-emerald-400 font-bold">{ex.output}</code></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ACTIVE GAME DECK (VARIES BY PROBLEM TYPE) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-[300px]">
            
            {/* Header bar */}
            <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-850 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>INTERACTIVE INTERFACE DECK</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHint(prev => !prev)}
                  className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded hover:bg-slate-800 flex items-center gap-1"
                >
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  <span>{showHint ? "Hide Hint" : "Reveal Hint"}</span>
                </button>
              </div>
            </div>

            {/* HINT OVERLAY */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-amber-950/20 border-b border-amber-900/40 p-4 text-xs text-amber-300 text-left flex items-start gap-2 overflow-hidden"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold">ANALYSIS HINT:</span>
                    <p className="mt-1 font-sans">{selectedLevel.problems[activeProblemIdx]?.hint}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* INTERACTIVE CONTROLS CONTAINER */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              
              {/* IF CODE TYPE: RENDER EDITOR */}
              {selectedLevel.problems[activeProblemIdx]?.type === 'code' && (
                <div className="flex-1 flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">C# / Javascript Syntax Editor:</span>
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="w-full h-48 p-3 bg-slate-950 border border-slate-850 rounded-xl font-mono text-xs text-emerald-400 focus:outline-none focus:border-cyan-500/50 resize-none leading-relaxed"
                    spellCheck="false"
                  />
                </div>
              )}

              {/* IF COMPLEXITY TYPE: RENDER CLASSIFICATION BUTTONS */}
              {selectedLevel.problems[activeProblemIdx]?.type === 'complexity' && (
                <div className="flex-1 flex flex-col gap-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Algorithm Code Profile:</span>
                  <pre className="p-3 bg-slate-950 border border-slate-850 rounded-xl font-mono text-xs text-purple-300 overflow-x-auto text-left leading-relaxed">
                    {selectedLevel.problems[activeProblemIdx]?.codeSnippet}
                  </pre>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select Correct Scaling Metric:</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {selectedLevel.problems[activeProblemIdx]?.complexityOptions?.map((opt) => {
                        const isChosen = selectedComplexity === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => { playSound('click'); setSelectedComplexity(opt); }}
                            className={`p-2.5 rounded-xl border font-bold font-mono text-xs transition-all ${
                              isChosen
                                ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                                : 'bg-slate-950 border-slate-850 hover:border-slate-800 text-slate-400'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* IF DEBUG TYPE: RENDER CODE FIX SELECTOR */}
              {selectedLevel.problems[activeProblemIdx]?.type === 'debug' && (
                <div className="flex-1 flex flex-col gap-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Corrupt Compiler Logic Segment:</span>
                  <div className="relative bg-slate-950 border border-slate-850 rounded-xl p-3 font-mono text-xs text-slate-400 text-left leading-relaxed overflow-x-auto">
                    {selectedLevel.problems[activeProblemIdx]?.buggyCode?.split('\n').map((line, idx) => {
                      const isBugLine = selectedLevel.problems[activeProblemIdx]?.bugLineIndex === idx;
                      return (
                        <div key={idx} className={`flex items-center gap-2 px-2 py-0.5 rounded ${isBugLine ? 'bg-red-950/40 border border-red-500/30' : ''}`}>
                          <span className="text-slate-600 select-none w-4 text-right">{idx + 1}</span>
                          <span className={isBugLine ? 'text-red-300 font-bold' : ''}>{line}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select Proper Core Repair Statement:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedLevel.problems[activeProblemIdx]?.fixOptions?.map((opt) => {
                        const isChosen = selectedFix === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => { playSound('click'); setSelectedFix(opt); }}
                            className={`p-2.5 rounded-xl border font-mono text-xs text-left flex items-center justify-between transition-all ${
                              isChosen
                                ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                                : 'bg-slate-950 border-slate-850 hover:border-slate-800 text-slate-300'
                            }`}
                          >
                            <span>{opt}</span>
                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                              isChosen ? 'border-cyan-400 bg-cyan-950/50' : 'border-slate-700'
                            }`}>
                              {isChosen && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION HANDLERS */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Compiler output feedback */}
                <div className="flex-1 text-left">
                  {compilerStatus === 'running' && (
                    <span className="text-[10px] text-yellow-400 font-bold uppercase animate-pulse flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      COMPILING SOURCE CODE MEMORY CHUNKS...
                    </span>
                  )}
                  {compilerStatus === 'success' && (
                    <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      HANDSHAKE COMPLETION COMPLETE! SYSTEM COMPATIBLE.
                    </span>
                  )}
                  {compilerStatus === 'error' && (
                    <span className="text-[10px] text-red-400 font-bold uppercase flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      COMPILATION FAILED: CHECK CORE SYNTAX LOGS
                    </span>
                  )}
                  {compilerStatus === 'idle' && (
                    <span className="text-[10px] text-slate-500 uppercase">
                      Ready to execute algorithmic parameters
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={executeCompilerHandshake}
                    disabled={compilerStatus === 'running'}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 border border-cyan-500 text-white text-xs font-bold rounded-xl shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:shadow-[0_4px_25px_rgba(168,85,247,0.4)] transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>COMPILE & EXECUTE</span>
                  </button>

                  {/* Move to next problem after solving */}
                  {solvedProblemIds.includes(selectedLevel.problems[activeProblemIdx]?.id) && activeProblemIdx < selectedLevel.problems.length - 1 && (
                    <button
                      onClick={handleNextProblem}
                      className="px-5 py-2 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <span>NEXT KEY</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* REALTIME SYSTEM CONSOLE LOGS */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 text-left font-mono text-[10px] text-slate-400 space-y-2">
            <span className="font-bold uppercase tracking-widest text-slate-500">Live Handshake Console Logs:</span>
            <div className="h-24 overflow-y-auto space-y-1 custom-scrollbar">
              {consoleLogs.map((log, i) => (
                <div key={i} className={`leading-relaxed ${
                  log.startsWith('✅') ? 'text-emerald-400 font-bold' :
                  log.startsWith('🚨') || log.startsWith('❌') ? 'text-red-400 font-bold' :
                  log.startsWith('[COMPILER]') ? 'text-yellow-400' :
                  'text-slate-400'
                }`}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* NEW ACHIEVEMENT UNLOCKED HUD OVERLAY */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <div className="bg-slate-950 border-2 border-amber-500/50 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.3)] text-center p-6 space-y-4">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center bg-amber-500/10 rounded-full border-2 border-amber-500 animate-spin-slow">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] text-amber-400 font-black tracking-widest uppercase">
                  CLEARANCE GRANTED
                </span>
                <h3 className="text-lg font-black tracking-wide text-slate-100">
                  {newAchievement}
                </h3>
                <p className="text-xs text-slate-400">
                  Sector Boss completely eliminated. Handshake saved to local registry.
                </p>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl max-w-[280px] mx-auto flex items-center justify-around text-xs">
                <div className="text-center">
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Points Awarded</span>
                  <span className="text-cyan-400 font-extrabold font-mono text-sm">+150 PTS</span>
                </div>
                <div className="h-6 w-[1px] bg-slate-800" />
                <div className="text-center">
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Rank Status</span>
                  <span className="text-purple-400 font-extrabold font-mono text-sm">LEVEL CLEARED</span>
                </div>
              </div>

              <button
                onClick={() => { playSound('click'); setNewAchievement(null); }}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all w-full"
              >
                ACKNOWLEDGE CLEARANCE SIGNALS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
