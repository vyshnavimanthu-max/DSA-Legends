import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Lightbulb, Cpu, Trophy, Send, X, Sliders, Sparkles, ChevronRight, HelpCircle, BookOpen, Binary
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileState } from '../types';
import PremiumAudioManager from '../lib/audioManager';

interface TrieLibraryQuestProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
  onCompleteSector: () => void;
}

export interface QuestProblem {
  id: string;
  title: string;
  type: 'concept' | 'insertion' | 'search' | 'prefix' | 'autocomplete';
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
    name: "Trie Inception & Nodes",
    topic: "Trie Node Structs",
    bossName: "TrieScribe",
    bossTitle: "Keeper of Prefixes",
    bossAvatar: "📖",
    bossMaxHP: 100,
    bossDialogueGreeting: "Welcome, seeker! I record all lexical paths. Fail to grasp standard alphabetic pointers, and you will wander forever in my index pages!",
    bossDialogueDefeated: "Ah, your understanding of character-by-character allocation is solid. You may turn the page.",
    rewardAchievementId: "trie_lvl1",
    rewardAchievementName: "Lexicon Inceptor",
    problems: [
      {
        id: "trie_node_pointers",
        title: "Trie Node Pointers",
        type: "concept",
        description: "In a standard prefix Trie designed specifically for lowercase English words ('a' through 'z'), how many potential child pointers does each node contain in its children array?",
        objective: "Select the correct dimensions for a standard English lowercase alphabetic node array.",
        hint: "The English alphabet has a fixed amount of letters: count them from A to Z.",
        xpReward: 35,
        pointsReward: 25,
        data: { options: ["10 pointers", "26 pointers", "52 pointers", "Unlimited pointers (dynamic list)"], correctIdx: 1 }
      },
      {
        id: "trie_root_node",
        title: "Trie Root Node Storage",
        type: "concept",
        description: "Does the root node of a standard prefix Trie store the first character of inserted keys, or is it typically empty/null?",
        objective: "Identify the architectural initialization property of the root node.",
        hint: "The root node is the universal starting gateway. It doesn't bind to any single letter.",
        xpReward: 40,
        pointsReward: 25,
        data: { options: ["It stores the letter 'a' by default", "It stores a null/empty character representing the empty string", "It stores the length of the longest word", "It stores the most frequently accessed character"], correctIdx: 1 }
      },
      {
        id: "end_of_word_flag",
        title: "The isEndOfWord Flag",
        type: "concept",
        description: "Why is an explicit boolean flag like 'isEndOfWord' (or 'isTerminal') absolutely necessary in Trie nodes?",
        objective: "Explain the differentiation between full words and shared prefix paths.",
        hint: "Consider the words 'cat' and 'cattle'. If we search for 'cat', how do we know it's a recorded word and not just a fragment of 'cattle'?",
        xpReward: 45,
        pointsReward: 25,
        data: { options: ["To specify if the node has no children at all", "To distinguish complete words from prefixes that are not explicitly inserted", "To encrypt the word for secure storage", "To signal that the string is completely unique"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 2,
    name: "Key Insertion Pathing",
    topic: "Grafting Character Nodes",
    bossName: "Path Weaver",
    bossTitle: "Suffix Allocator",
    bossAvatar: "🧶",
    bossMaxHP: 110,
    bossDialogueGreeting: "Strings are but chains of keys. Trace their grafting process down the tree as new letters sprout, or see your pointers severed!",
    bossDialogueDefeated: "Perfect node allocations! The character graph is perfectly compressed.",
    rewardAchievementId: "trie_lvl2",
    rewardAchievementName: "Suffix Grafter",
    problems: [
      {
        id: "insert_cat",
        title: "Inserting 'CAT'",
        type: "insertion",
        description: "If you insert the word 'CAT' into an initially completely empty standard prefix Trie, how many new character nodes are allocated?",
        objective: "Determine node allocation overhead for a simple word insertion.",
        hint: "Every character in 'CAT' is brand new to the empty Trie, requiring unique node creations.",
        xpReward: 40,
        pointsReward: 30,
        data: { options: ["1 node", "2 nodes", "3 nodes", "4 nodes (including root)"], correctIdx: 2 }
      },
      {
        id: "insert_car",
        title: "Inserting 'CAR' after 'CAT'",
        type: "insertion",
        description: "If you insert the word 'CAR' into the Trie that already contains the word 'CAT', how many additional nodes are newly allocated?",
        objective: "Calculate node reuse efficiency in shared prefixes.",
        hint: "Identify the common prefix between 'CAT' and 'CAR'. Only the unique suffix characters require new nodes.",
        xpReward: 45,
        pointsReward: 30,
        data: { options: ["0 nodes (fully reused)", "1 node (only 'R')", "2 nodes ('A' and 'R')", "3 nodes ('C', 'A', and 'R')"], correctIdx: 1 }
      },
      {
        id: "insert_complexity",
        title: "Time Complexity of Insert",
        type: "insertion",
        description: "What is the time complexity to insert a word of length L into a standard Trie containing N already stored words?",
        objective: "Select insertion time complexity bounds.",
        hint: "We walk character-by-character for the word's length, looking up indices in O(1). Does the total words count N affect this?",
        xpReward: 50,
        pointsReward: 30,
        data: { options: ["O(N * L)", "O(L) - completely independent of N", "O(log N)", "O(1) absolute"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 3,
    name: "Word Search Dynamics",
    topic: "Validating Key Presence",
    bossName: "Index Guardian",
    bossTitle: "Key Scanner",
    bossAvatar: "🔍",
    bossMaxHP: 120,
    bossDialogueGreeting: "Querying strings is a walk on high-wires! Fall off the pointer route or hit a terminal barrier, and your search returns null!",
    bossDialogueDefeated: "Query algorithms certified. Search complexity remains beautifully linear.",
    rewardAchievementId: "trie_lvl3",
    rewardAchievementName: "Query Navigator",
    problems: [
      {
        id: "search_ca_in_cat",
        title: "Searching for 'CA'",
        type: "search",
        description: "If a Trie contains only the inserted word 'CAT', what will a standard search for the word 'CA' (i.e. search('CA')) return?",
        objective: "Determine the result of a search query for a prefix.",
        hint: "Although the letters C and A exist, 'CA' was never marked as a completed word.",
        xpReward: 45,
        pointsReward: 30,
        data: { options: ["True, because the nodes exist", "False, because node 'A' does not have isEndOfWord set to true", "Null Pointer Exception", "Returns 'T' (the suffix)"], correctIdx: 1 }
      },
      {
        id: "search_failure_trigger",
        title: "Search Failure Modes",
        type: "search",
        description: "During a word search walk in a Trie, what occurs as soon as we look for a character and encounter a null pointer in the children array?",
        objective: "Identify standard early-termination behavior during a query.",
        hint: "If the path doesn't exist, the word cannot possibly be in the Trie.",
        xpReward: 50,
        pointsReward: 30,
        data: { options: ["We backtrace to the root and try another route", "The search terminates immediately and returns False", "The Trie automatically inserts the missing node", "We throw an index-out-of-bounds error"], correctIdx: 1 }
      },
      {
        id: "search_complexity_bounds",
        title: "Search Time Complexity",
        type: "search",
        description: "What are the average and worst-case time complexities respectively for searching a word of length L in a Trie with N nodes?",
        objective: "Select correct search bounds.",
        hint: "We only perform at most L pointer lookups. It is independent of total node size.",
        xpReward: 55,
        pointsReward: 30,
        data: { options: ["O(L) average, O(N) worst", "O(log N) average, O(N) worst", "O(L) for both cases, independent of N", "O(1) constant for both"], correctIdx: 2 }
      }
    ]
  },
  {
    id: 4,
    name: "Prefix Matchers",
    topic: "StartsWith & Suffix Projections",
    bossName: "Prefix Warden",
    bossTitle: "Gateway Filtering Director",
    bossAvatar: "🛡️",
    bossMaxHP: 130,
    bossDialogueGreeting: "Do you start with a whisper or end with a roar? Prove how to filter paths using standard prefix indicators, or be filtered out yourself!",
    bossDialogueDefeated: "Prefix matching verified. Character stream routing is fully operational.",
    rewardAchievementId: "trie_lvl4",
    rewardAchievementName: "Prefix Warden",
    problems: [
      {
        id: "startswith_difference",
        title: "startsWith vs search",
        type: "prefix",
        description: "How does the implementation of 'startsWith(prefix)' differ from the standard 'search(word)' method in a standard Trie?",
        objective: "Contrast prefix verification with full word verification.",
        hint: "For a prefix, we only care if the character path is fully present in the tree. We do not care if it terminates there.",
        xpReward: 50,
        pointsReward: 35,
        data: { options: ["It searches backwards from the leaves", "It only checks if the character path exists, without checking the isEndOfWord flag", "It is twice as slow", "It requires a full depth scan first"], correctIdx: 1 }
      },
      {
        id: "prefix_lookup_speed",
        title: "Prefix Lookup Complexity",
        type: "prefix",
        description: "Given a dictionary of N words, what is the time complexity of verifying if a prefix of length P exists using a standard Trie?",
        objective: "Identify prefix query speed metrics.",
        hint: "We walk down P character nodes in the Trie, which takes constant time per letter.",
        xpReward: 55,
        pointsReward: 35,
        data: { options: ["O(N * P)", "O(P) - completely constant relative to dictionary size N", "O(log N)", "O(N)"], correctIdx: 1 }
      },
      {
        id: "trie_vs_hash_prefix",
        title: "Trie vs Hash Table for Prefixes",
        type: "prefix",
        description: "Why is a Trie mathematically superior to a standard Hash Table for prefix-based autocompletion searches?",
        objective: "Evaluate the prefix advantage of Trie structures.",
        hint: "Hash Tables store full string hashes, losing character-by-character tree navigation which makes prefix lookups require checking all keys.",
        xpReward: 65,
        pointsReward: 35,
        data: { options: ["Hash Tables are slower to insert", "Tries group common characters together allowing O(P) prefix walks, whereas Hash Tables require scanning all entries", "Tries use significantly less memory in all possible cases", "Hash tables cannot store strings with odd lengths"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 5,
    name: "Autocomplete & Wildcards",
    topic: "Predictive Character Walking",
    bossName: "Predictive Oracle",
    bossTitle: "Lexical Forecaster",
    bossAvatar: "🔮",
    bossMaxHP: 150,
    bossDialogueGreeting: "Type a single letter, and I see a thousand futures! Unravel my autocomplete and wildcard equations to secure the Grand Archivist ranking!",
    bossDialogueDefeated: "Wildcard patterns solved! Autocomplete suggestions populated with lightning speed. You are a Master Scribe!",
    rewardAchievementId: "trie_lvl5",
    rewardAchievementName: "Grand Trie Archivist",
    problems: [
      {
        id: "autocomplete_traversal",
        title: "Finding Autocomplete Suggestions",
        type: "autocomplete",
        description: "To gather all words matching prefix 'ca', what algorithmic step is executed after walking the characters 'c' and 'a' to reach node 'a'?",
        objective: "Identify the correct traversal mechanism to collect suggestions.",
        hint: "Starting from node 'a', we must explore all deeper paths (subtrees) to collect all terminal leaf indicators.",
        xpReward: 60,
        pointsReward: 40,
        data: { options: ["Return to root and scan linearly", "Perform a Depth-First Search (DFS) or BFS from node 'a' to find all descendant terminal nodes", "Delete all nodes that do not start with 'ca'", "Binary search the remaining letters"], correctIdx: 1 }
      },
      {
        id: "wildcard_match_walk",
        title: "Wildcard Character Walking",
        type: "autocomplete",
        description: "When implementing a search for a pattern containing a wildcard like 'c.t' (where '.' can match any single character), how does the walker handle the wildcard '.'?",
        objective: "Design recursive search branching for wildcards.",
        hint: "Since '.' can be any letter, we must try all available children paths of node 'c' recursively.",
        xpReward: 70,
        pointsReward: 40,
        data: { options: ["Skip the wildcard and jump straight to 't'", "Recursively search the remaining suffix 't' across all non-null children of node 'c'", "Always replace the wildcard with the letter 'a'", "Throw a wildcard exception"], correctIdx: 1 }
      },
      {
        id: "trie_space_efficiency_case",
        title: "Space Efficiency Scenario",
        type: "autocomplete",
        description: "In which of the following real-world datasets is a Trie extremely space-efficient compared to a standard flat list or set of strings?",
        objective: "Recognize optimal memory patterns for Tries.",
        hint: "Tries are space efficient when many words share prefix blocks (e.g. dictionaries, URLs with shared domains, IP routing prefixes).",
        xpReward: 75,
        pointsReward: 40,
        data: { options: ["A list of completely random unique hash strings", "A dictionary of millions of words with many shared prefixes and inflections", "An array of short numbers", "A single massive string of a book"], correctIdx: 1 }
      }
    ]
  }
];

export default function TrieLibraryQuest({ profile, onUpdateProfile, onBackToMenu, onCompleteSector }: TrieLibraryQuestProps) {
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
      `[TRIE LIBRARY] Chapter accessed: Level ${lvl.id} - ${lvl.name}`, 
      `[ARCHIVE] Archivist Spirit ${lvl.bossName} active.`
    ]);
  }, [activeLevelIdx]);

  // Sync Problem selection
  useEffect(() => {
    const prob = selectedLevel.problems[activeProblemIdx];
    if (prob) {
      setShowHint(false);
      setSelectedIdx(null);
      setConsoleLogs(prev => [...prev, `[PARSER] Unpacking prefix tree challenge: ${prob.title}`]);
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
      setConsoleLogs(prev => [...prev, "⚠️ No spelling route chosen! Trace your character pointers."]);
      playSound('error');
      return;
    }

    let success = false;
    let feedback = '';

    if (selectedIdx === prob.data.correctIdx) {
      success = true;
      feedback = `✅ Correct! Lexical path verified: ${prob.data.options[selectedIdx]}`;
    } else {
      feedback = `❌ Path mismatch. Word node is missing isEndOfWord or invalid pointer!`;
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
          setCurrentDialogue("Impressive lexical walk! My node counts are shrinking!");
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
              description: `Conquered Level ${selectedLevel.id} of the Trie Library by proving prefix-search mechanics.`,
              isUnlocked: true,
              ratingValue: 150 + selectedLevel.id * 10
            }
          ];

      onUpdateProfile({
        points: profile.points + 150 + selectedLevel.id * 10,
        achievements: finalAchievements
      });

      setNewAchievement(selectedLevel.rewardAchievementName);
      playSound('win');
    }

    const totalLvlSolved = QUEST_LEVELS.filter(l => 
      l.problems.every(p => solvedProblemIds.includes(p.id))
    ).length;

    if (totalLvlSolved === 5) {
      setConsoleLogs(prev => [...prev, "🚨 SECTOR CONQUEST SECURED! TRIE LIBRARY IS COMPLETELY MASTERED!"]);
      setTimeout(() => {
        onCompleteSector();
      }, 3000);
    }
  };

  const prob = selectedLevel.problems[activeProblemIdx];

  return (
    <div className="bg-[#040510] border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-mono text-slate-200 w-full">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(99,102,241,0.8)]" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-indigo-950/40">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
              TRIE LIBRARY: LEXICAL INDEX
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
            5 Levels • 15 Character-Based Tasks • Insertion, Search, Prefix & Autocomplete
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl text-xs flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>CREDITS: <b className="text-indigo-400">{profile.points}</b></span>
          </div>

          <button
            onClick={() => { playSound('powerdown'); onBackToMenu(); }}
            className="px-4 py-1.5 bg-slate-950 border border-indigo-900/40 hover:border-indigo-500/80 text-indigo-300 text-xs font-bold rounded-xl transition-all"
          >
            ← LEAVE LIBRARY
          </button>
        </div>
      </div>

      {/* LEVEL SELECTION RAIL */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {QUEST_LEVELS.map((lvl, index) => {
          const isSelected = activeLevelIdx === index;
          const isCleared = lvl.problems.every(p => solvedProblemIds.includes(p.id));
          return (
            <button
              key={lvl.id}
              onClick={() => handleLevelSelect(index)}
              className={`relative p-2 rounded-xl border text-center transition-all ${
                isSelected 
                  ? 'bg-indigo-950/30 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)] text-indigo-200' 
                  : isCleared
                  ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/30'
                  : 'bg-slate-905/30 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300'
              }`}
            >
              <div className="text-[9px] text-slate-400 uppercase font-black">L{lvl.id} - {lvl.name}</div>
              {isCleared && <CheckCircle2 className="w-3 h-3 text-indigo-400 absolute top-1 right-1" />}
            </button>
          );
        })}
      </div>

      {/* MAIN GAMEPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PROBLEM DESCRIPTOR */}
          <div className="bg-[#030308] border border-indigo-950/80 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="px-2 py-0.5 bg-indigo-950 text-indigo-400 rounded text-[9px] uppercase font-bold tracking-widest">
                Path {activeProblemIdx + 1} of {selectedLevel.problems.length}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                REWARD: +{prob?.xpReward} XP / +{prob?.pointsReward} Credits
              </span>
            </div>

            <h3 className="text-base font-black text-white">{prob?.title}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{prob?.description}</p>
            
            <div className="mt-4 p-3 bg-indigo-950/10 border border-indigo-950 rounded-xl flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-indigo-300 uppercase font-black block">Archivist Objective</span>
                <p className="text-xs text-indigo-200 font-bold">{prob?.objective}</p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE STAGE */}
          <div className="bg-[#020205] border border-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] relative">
            <span className="absolute top-3 left-4 text-[9px] text-slate-500 uppercase font-bold tracking-widest">
              Live Prefix Tree Path Emulator
            </span>

            {/* INTERACTIVE VECTOR DISPLAY */}
            <div className="w-full flex flex-col items-center justify-center gap-4 py-6">
              
              {/* STATIC CHARACTER PATH MAP */}
              <div className="flex flex-col items-center mb-4 p-4 bg-slate-950/80 border border-slate-900 rounded-xl w-full max-w-sm">
                <span className="text-[8px] text-slate-500 uppercase font-bold mb-2">Lexical character tree walking</span>
                <div className="flex items-center justify-center gap-2 font-mono">
                  <div className="w-8 h-8 rounded-full border border-slate-800 bg-slate-950 flex items-center justify-center text-xs font-bold text-slate-400">
                    root
                  </div>
                  <div className="text-slate-600">→</div>
                  <div className="w-8 h-8 rounded-full border border-indigo-500/50 bg-indigo-950/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                    C
                  </div>
                  <div className="text-indigo-600 animate-pulse">→</div>
                  <div className="w-8 h-8 rounded-full border border-indigo-500/50 bg-indigo-950/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                    A
                  </div>
                  <div className="text-indigo-600 animate-pulse">→</div>
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500 bg-indigo-950/50 flex items-center justify-center text-xs font-black text-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.4)]">
                    T*
                  </div>
                </div>
                <span className="text-[8px] text-slate-600 mt-2 text-center font-bold">
                  * asterisk indicates terminal word node (isEndOfWord = true)
                </span>
              </div>

              {/* OPTIONS MATRIX */}
              <div className="flex flex-col gap-2.5 w-full max-w-md">
                {prob?.data.options?.map((opt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                    className={`p-3 border rounded-xl font-mono text-xs font-bold text-left flex justify-between items-center transition-all ${
                      selectedIdx === idx
                        ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                        : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedIdx === idx ? 'border-indigo-400 bg-indigo-400 text-[#040510]' : 'border-slate-800'
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
              <span>{showHint ? 'HIDE ARCHIVE HINT' : 'REVEAL ARCHIVE HINT'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleVerifyProblem}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>COMPILE & WALK</span>
              </button>

              {solvedProblemIds.includes(prob?.id) && (
                <button
                  onClick={handleNextProblem}
                  className="px-4 py-2.5 bg-indigo-950 border border-indigo-500/40 text-indigo-300 hover:border-indigo-500 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <span>NEXT PATH</span>
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
                  <span className="text-xs font-black text-yellow-300 block uppercase tracking-wider">Library Scribe Tip:</span>
                  <p className="text-xs text-yellow-200/90 mt-1 leading-relaxed">{prob?.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: BOSS & ENVIRONMENT FEEDBACK */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* BOSS BATTLE SCREEN */}
          <div className="bg-gradient-to-b from-slate-950 to-[#03030b] border border-indigo-950 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-glow opacity-5 pointer-events-none" />

            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-900/60">
              <span className="text-3xl animate-bounce">{selectedLevel.bossAvatar}</span>
              <div>
                <h4 className="text-sm font-black text-white">{selectedLevel.bossName}</h4>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{selectedLevel.bossTitle}</p>
              </div>
            </div>

            {/* BOSS HP BAR */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[10px] font-black text-slate-400">
                <span>SECTOR SHIELDS</span>
                <span className={bossHP < 30 ? 'text-red-400 animate-pulse' : 'text-indigo-400'}>
                  {bossHP} / {selectedLevel.bossMaxHP} HP
                </span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
                <motion.div 
                  className={`h-full rounded-full ${bossHP < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
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
            <div className="mt-4 p-3 bg-indigo-950/10 border border-indigo-950/40 rounded-xl relative">
              <div className="absolute top-2 left-4 w-2 h-2 bg-indigo-950/10 rotate-45 transform -translate-y-4" />
              <p className="text-xs text-indigo-300 italic leading-relaxed">
                "{currentDialogue}"
              </p>
            </div>
          </div>

          {/* COMPILER STREAM LOGS */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 h-[240px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                Character Pointer Bus
              </span>
              <button 
                onClick={() => setConsoleLogs([`[TRIE LIBRARY] Prefix logs cleared.`])}
                className="text-[8px] hover:text-white text-slate-600 font-bold"
              >
                RESET BUS
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 text-[10px] font-mono scrollbar-thin">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className={
                  log.startsWith('✅') 
                    ? 'text-indigo-400 font-bold' 
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
            className="fixed bottom-6 right-6 bg-[#040510] border-2 border-indigo-500/80 rounded-2xl p-5 shadow-[0_0_30px_rgba(99,102,241,0.4)] z-50 flex items-center gap-4 max-w-sm"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500 flex items-center justify-center text-2xl animate-spin-slow">
              🏆
            </div>
            <div>
              <span className="text-[10px] text-indigo-400 uppercase font-black tracking-widest block">Achievement Unlocked!</span>
              <h5 className="text-sm font-black text-white">{newAchievement}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">Defeated the local sector threat in Trie Library.</p>
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
