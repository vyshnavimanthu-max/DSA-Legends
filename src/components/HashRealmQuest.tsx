import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Lightbulb, Cpu, Trophy, Send, X, Sliders, Sparkles, ChevronRight, HelpCircle, Shield, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileState } from '../types';
import PremiumAudioManager from '../lib/audioManager';

interface HashRealmQuestProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
  onCompleteSector: () => void;
}

export interface QuestProblem {
  id: string;
  title: string;
  type: 'concept' | 'twosum' | 'frequency' | 'anagrams' | 'sequence' | 'happy' | 'customhash';
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
    name: "HashMap Core Mechanics",
    topic: "Dynamic Memory Bundles",
    bossName: "HashedHaze",
    bossTitle: "Master of Constant Time",
    bossAvatar: "🌀",
    bossMaxHP: 110,
    bossDialogueGreeting: "In my constant-time domain, sorting is slow and linear scans are a crime! Master my index-buckets and key mappings or get lost in infinite colliders!",
    bossDialogueDefeated: "Excellent constant-time lookups. Your hashes distribute beautifully.",
    rewardAchievementId: "hash_lvl1",
    rewardAchievementName: "Bucket Mapper",
    problems: [
      {
        id: "hashmap_lookup_speed",
        title: "HashMap Lookup Speed",
        type: "concept",
        description: "What is the average time complexity to retrieve or verify a key in a well-distributed, correctly sized HashMap of N entries?",
        objective: "Select the average-case retrieval complexity bound.",
        hint: "HashMap uses constant-time mathematical array hashing to bypass element comparison loops.",
        xpReward: 35,
        pointsReward: 20,
        data: { options: ["O(N)", "O(log N)", "O(1) average", "O(N log N)"], correctIdx: 2 }
      },
      {
        id: "hash_collisions",
        title: "Understanding Hash Collisions",
        type: "concept",
        description: "What happens when two completely different, distinct keys produce the exact same integer hash code index?",
        objective: "Identify the standard hashing conflict term.",
        hint: "When two bodies attempt to occupy the exact same physical coordinates, a clash occurs.",
        xpReward: 35,
        pointsReward: 20,
        data: { options: ["A memory leak", "A Hash Collision", "An infinite compilation loop", "A pointer nullification"], correctIdx: 1 }
      },
      {
        id: "load_factor_threshold",
        title: "Load Factor Threshold",
        type: "concept",
        description: "What is the standard, widely-adopted load factor threshold (e.g. in Java's HashMap) which dictates when a hash table should automatically double its capacity and rehash all keys?",
        objective: "Choose the default balance threshold ratio.",
        hint: "Rehashing occurs when elements exceed approximately 75% of the total bucket slots.",
        xpReward: 40,
        pointsReward: 20,
        data: { options: ["0.25 (25%)", "0.50 (50%)", "0.75 (75%)", "0.99 (99%)"], correctIdx: 2 }
      },
      {
        id: "bucket_storage",
        title: "Bucket Storage Structures",
        type: "concept",
        description: "How are collided keys in a single bucket slot typically stored in modern production hash table implementations when the collision size is relatively small?",
        objective: "Select the bucket collection type.",
        hint: "Nodes are appended sequentially, but can upgrade to a tree structure if collisions get too high.",
        xpReward: 40,
        pointsReward: 20,
        data: { options: ["A static 1D array", "A Linked List", "A Max-Heap", "A stack frame"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 2,
    name: "HashSet Set Theory",
    topic: "Unique Collections",
    bossName: "Duo Sieve",
    bossTitle: "Uniqueness Collector",
    bossAvatar: "🕳️",
    bossMaxHP: 115,
    bossDialogueGreeting: "I tolerate zero duplicates! Prove how unique set constraints work, or find your redundant elements pruned instantly!",
    bossDialogueDefeated: "All redundant data filtered! Set mathematical invariants remain pristine.",
    rewardAchievementId: "hash_lvl2",
    rewardAchievementName: "Redundancy Filter",
    problems: [
      {
        id: "hashset_uniqueness",
        title: "HashSet Uniqueness Rule",
        type: "concept",
        description: "What is the primary defining feature of a HashSet compared to a standard ArrayList?",
        objective: "Identify set mathematical invariants.",
        hint: "A set in mathematics does not allow any item to be present more than once.",
        xpReward: 40,
        pointsReward: 20,
        data: { options: ["Elements are kept in sorted order", "Duplicates are strictly forbidden; each element must be unique", "Elements can only be accessed via integers", "Set sizes are strictly capped at 256"], correctIdx: 1 }
      },
      {
        id: "hashset_backing",
        title: "HashSet Backing Implementation",
        type: "concept",
        description: "How is a HashSet typically implemented under the hood in popular programming frameworks like Java's standard collections?",
        objective: "Select HashSet's inner storage engine.",
        hint: "It reuses the exact same hashing code by storing elements as the *keys* of an internal HashMap, with a shared dummy constant value object.",
        xpReward: 45,
        pointsReward: 20,
        data: { options: ["By using a binary search tree", "Using a backing HashMap where the set elements act as the map keys", "By using a flat contiguous array list with bubble-sorting", "Through direct hard disk files"], correctIdx: 1 }
      },
      {
        id: "set_intersection_speed",
        title: "Set Intersection Complexity",
        type: "concept",
        description: "To find the intersection of two HashSets of size M and N (where M < N) in optimal time, what is the best strategy and complexity?",
        objective: "Identify the optimal set intersection approach.",
        hint: "We iterate the smaller set of size M and perform constant-time checks inside the larger set of size N.",
        xpReward: 45,
        pointsReward: 20,
        data: { options: ["O(M * N) via double nested scanning", "O(M) average time by scanning the smaller set and looking up in the larger set", "O(log(M + N))", "O(N log N)"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 3,
    name: "Two Sum Algorithms",
    topic: "Complement Mapping",
    bossName: "Binary Matcher",
    bossTitle: "Dual Target Director",
    bossAvatar: "🏹",
    bossMaxHP: 120,
    bossDialogueGreeting: "Two values combine to breach my castle doors! Map their complements in one single constant-time sweep, or suffer from O(N^2) quadratic slowness!",
    bossDialogueDefeated: "Target sum matched in a single pass! Linear efficiency accomplished.",
    rewardAchievementId: "hash_lvl3",
    rewardAchievementName: "Linear Targeter",
    problems: [
      {
        id: "twosum_complement",
        title: "Two Sum Hash Complement",
        type: "twosum",
        description: "During a single-pass Two Sum algorithm, as you iterate through element 'x' in an array, what 'complement' value must you look up in the HashMap to see if a valid pair exists?",
        objective: "Identify the target sum math.",
        hint: "If the total target sum is T, and your current value is x, the remaining needed value is the difference.",
        xpReward: 45,
        pointsReward: 25,
        data: { options: ["T * x", "T + x", "T - x", "x / T"], correctIdx: 2 }
      },
      {
        id: "twosum_sorted_alternative",
        title: "Two Sum with Sorted Arrays",
        type: "twosum",
        description: "If the input array is already sorted in ascending order, which algorithm allows you to solve Two Sum in O(1) auxiliary space (no HashMap required)?",
        objective: "Identify the sorted alternative solution.",
        hint: "Position markers on the left and right ends, moving them inward depending on the current sum.",
        xpReward: 50,
        pointsReward: 25,
        data: { options: ["Binary Search on all numbers", "Two Pointers starting at the extremities", "Depth First Search", "Radix sorting"], correctIdx: 1 }
      },
      {
        id: "twosum_value_index",
        title: "Storing Indices in HashMap",
        type: "twosum",
        description: "Why does the standard single-pass Two Sum algorithm store the *index* of each element as the VALUE in the HashMap (with number as the KEY)?",
        objective: "Understand Two Sum index retrieval.",
        hint: "The problem asks us to return the indices of the two elements that add up to the target, and we must make sure we don't use the same element twice.",
        xpReward: 50,
        pointsReward: 25,
        data: { options: ["To encrypt the array structure", "To easily retrieve the indices of the matched pair and prevent reusing the same element at its current position", "Because HashMaps only support integer values", "To sort the indices automatically"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 4,
    name: "Frequency Counters",
    topic: "Element Occurrence Trackers",
    bossName: "Tally Titan",
    bossTitle: "Bulk Counter Sentry",
    bossAvatar: "📊",
    bossMaxHP: 130,
    bossDialogueGreeting: "How many times does each element repeat? Keep your counters clean, or watch your buffer counters overflow under my stream stress!",
    bossDialogueDefeated: "Data streams tallied. Majority elements isolated correctly.",
    rewardAchievementId: "hash_lvl4",
    rewardAchievementName: "Tally Champion",
    problems: [
      {
        id: "freq_space_complexity",
        title: "Alphabet Space Bounds",
        type: "frequency",
        description: "When using a HashMap to count the occurrences of all characters in a text of length N, where the text only uses lowercase English characters, what is the strict space complexity of our map?",
        objective: "Determine character space boundaries.",
        hint: "The number of unique keys is tightly bounded by the alphabet size (26), which does not grow with N.",
        xpReward: 45,
        pointsReward: 25,
        data: { options: ["O(N) space", "O(26) or O(1) auxiliary space", "O(log N) space", "O(N^2) space"], correctIdx: 1 }
      },
      {
        id: "first_unique_char",
        title: "First Unique Character Pass",
        type: "frequency",
        description: "How many total linear passes over the input string of length N are required to find the index of the first unique character using a frequency HashMap?",
        objective: "Deduce optimal frequency scans.",
        hint: "We need one pass to populate the map counts, then a second pass to look up each character's count in order.",
        xpReward: 50,
        pointsReward: 25,
        data: { options: ["Exactly one pass", "Exactly two passes", "N passes", "Log(N) passes"], correctIdx: 1 }
      },
      {
        id: "top_k_frequent_elements",
        title: "Top K Frequent Elements",
        type: "frequency",
        description: "To find the K most frequent elements in an array of N numbers in O(N log K) time, which combination of data structures is optimal?",
        objective: "Select optimal top-K frequency design.",
        hint: "First count frequencies in a map, then push items into a boundary priority structure of size K.",
        xpReward: 55,
        pointsReward: 25,
        data: { options: ["A static sorted array only", "A frequency HashMap paired with a Min-Heap of size K", "A Doubly Linked List", "A binary search tree"], correctIdx: 1 }
      },
      {
        id: "majority_element_moore",
        title: "Moore's Voting vs HashMap",
        type: "frequency",
        description: "While a HashMap can easily find the majority element (count > N/2) in O(N) space, which famous algorithm can solve it in O(1) auxiliary space?",
        objective: "Identify the Boyer-Moore majority voting algorithm.",
        hint: "It maintains a candidate and a count, incrementing or decrementing as we scan, canceling out non-majority elements.",
        xpReward: 60,
        pointsReward: 25,
        data: { options: ["Dijkstra's Algorithm", "Boyer-Moore Majority Voting Algorithm", "Floyd's Cycle Detection", "Aho-Corasick Algorithm"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 5,
    name: "Anagram Groups",
    topic: "Equivalence Keys",
    bossName: "Scribe of Anagrams",
    bossTitle: "Key Shuffler",
    bossAvatar: "📜",
    bossMaxHP: 135,
    bossDialogueGreeting: "Letters are easily shuffled! Can you group matching anagram categories together by projecting identical key signatures? Fail and find your dictionary in complete chaos!",
    bossDialogueDefeated: "Anagram groupings compiled. Equivalent spellings grouped perfectly.",
    rewardAchievementId: "hash_lvl5",
    rewardAchievementName: "Lexical Shuffler",
    problems: [
      {
        id: "group_anagrams_signature",
        title: "Group Anagrams Key Signature",
        type: "anagrams",
        description: "To group strings like 'eat', 'tea', and 'ate' into the same category in a HashMap, what is the most common key signature used?",
        objective: "Select the grouping key.",
        hint: "All anagrams have the exact same characters. Sorting their characters produces an identical string.",
        xpReward: 50,
        pointsReward: 30,
        data: { options: ["The length of the string", "The sorted version of the string (e.g. 'aet')", "The memory address of the string", "The first character of each word"], correctIdx: 1 }
      },
      {
        id: "anagram_sorting_complexity",
        title: "Anagram Sorting Complexity",
        type: "anagrams",
        description: "If we group N words of maximum length L by sorting each word, what is the total time complexity to process the full collection?",
        objective: "Select the anagram sorting bound.",
        hint: "Each of the N words takes L log L time to sort, plus the hash map insert.",
        xpReward: 55,
        pointsReward: 30,
        data: { options: ["O(N * L)", "O(N * L log L)", "O(N^2)", "O(L^2)"], correctIdx: 1 }
      },
      {
        id: "prime_factor_anagram_hash",
        title: "Prime Product Hashing",
        type: "anagrams",
        description: "What unique mathematical advantage does assigning each of the 26 characters to a distinct prime number and multiplying them together yield for hashing anagrams?",
        objective: "Deduce prime factor hash characteristics.",
        hint: "By the Fundamental Theorem of Arithmetic, the product of prime factors is unique for any multiset of characters. This allows O(L) hash generation with zero sorting overhead.",
        xpReward: 65,
        pointsReward: 30,
        data: { options: ["It compresses strings to 32 bits", "It guarantees O(L) hashing without needing to sort the word's characters", "It prevents any possible hash collision across all words", "It automatically translates the strings to binary"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 6,
    name: "Consecutive Sequences",
    topic: "HashSet Boundary Runs",
    bossName: "Run-Length Overlord",
    bossTitle: "Sequence Sentry",
    bossAvatar: "🏃",
    bossMaxHP: 145,
    bossDialogueGreeting: "Numbers form linear chains in the chaotic sea of keys! Find the longest consecutive run in a single linear pass of my set structures, or face absolute path fragmentation!",
    bossDialogueDefeated: "Consecutive bounds solved in linear time. Zero redundant sub-scans executed.",
    rewardAchievementId: "hash_lvl6",
    rewardAchievementName: "Sequence Runner",
    problems: [
      {
        id: "longest_consecutive_set_flow",
        title: "Longest Consecutive Sequence Goal",
        type: "sequence",
        description: "To find the longest consecutive sequence of integers in an unsorted array in O(N) time, we first dump all numbers into a HashSet. How do we determine if a number 'num' is the starting point of a sequence?",
        objective: "Choose the sequence start check condition.",
        hint: "A number starts a consecutive sequence if and only if the set does not contain the value one unit smaller than it.",
        xpReward: 55,
        pointsReward: 30,
        data: { options: ["If 'num + 1' is present in the set", "If 'num - 1' is NOT present in the set", "If the number is even", "If 'num' is smaller than the mean value"], correctIdx: 1 }
      },
      {
        id: "consecutive_double_scan_prevention",
        title: "Double Scan Prevention",
        type: "sequence",
        description: "Why is verifying that 'num - 1' is absent from the HashSet critical to achieving O(N) linear time complexity instead of drifting into O(N^2) quadratic time?",
        objective: "Explain linear consecutive bounds.",
        hint: "It ensures we only walk and count sequences from their absolute beginning, so each element is visited at most twice.",
        xpReward: 60,
        pointsReward: 30,
        data: { options: ["It automatically sorts the set", "It prevents scanning and incrementing from middle or end elements of sequences repeatedly", "It encrypts the index paths", "It halves the set size"], correctIdx: 1 }
      },
      {
        id: "consecutive_space_complexity",
        title: "Sequence Space Complexity",
        type: "sequence",
        description: "What is the auxiliary space complexity of the optimal O(N) consecutive sequence search algorithm using a HashSet?",
        objective: "Select consecutive set memory usage.",
        hint: "We must store all N elements in our HashSet to achieve O(1) lookup checks.",
        xpReward: 60,
        pointsReward: 30,
        data: { options: ["O(1) auxiliary space", "O(N) space", "O(log N) space", "O(N^2) space"], correctIdx: 1 }
      },
      {
        id: "consecutive_sorting_cost",
        title: "Sorting vs Set Consecutive Runs",
        type: "sequence",
        description: "If we sort the array first, we can find the longest consecutive sequence in O(1) auxiliary space. What is the time complexity cost of this alternative?",
        objective: "Compare sorting and hashing trade-offs.",
        hint: "The sorting phase dominates the time complexity.",
        xpReward: 65,
        pointsReward: 30,
        data: { options: ["O(N)", "O(N log N)", "O(N^2)", "O(1)"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 7,
    name: "Happy Numbers & Loops",
    topic: "Cycle Detection Matrices",
    bossName: "Happy Harvester",
    bossTitle: "Cycle Sieve",
    bossAvatar: "🎭",
    bossMaxHP: 155,
    bossDialogueGreeting: "Happy numbers reach the unit throne of 1! Unhappy numbers wander in infinite loop cycles! Use sets to capture these loops, or cycle in my vaults forever!",
    bossDialogueDefeated: "Digit loops mapped. Cycle detection engines completed.",
    rewardAchievementId: "hash_lvl7",
    rewardAchievementName: "Happy Alchemist",
    problems: [
      {
        id: "happy_number_terminal",
        title: "Happy Number Terminal",
        type: "happy",
        description: "A happy number is defined as a number which eventually reaches what terminal value when repeatedly replaced by the sum of squares of its digits?",
        objective: "Identify the happy terminal integer.",
        hint: "It is the unit origin value, representing completeness and happiness.",
        xpReward: 55,
        pointsReward: 35,
        data: { options: ["0", "1", "10", "Infinity"], correctIdx: 1 }
      },
      {
        id: "happy_number_loop_set",
        title: "HashSet Cycle Detection",
        type: "happy",
        description: "If a number is NOT happy, what behavior occurs during the sum-of-squares replacement chain, and how does a HashSet detect it?",
        objective: "Deduce set-based cycle detection mechanics.",
        hint: "The chain enters an infinite repeating loop. The HashSet detects this by storing each sum and checking if a newly generated sum already exists in the set.",
        xpReward: 65,
        pointsReward: 35,
        data: { options: ["The chain shrinks to negative values", "The sum-of-squares chain enters an infinite loop, which the HashSet detects when a value is seen twice", "The number turns prime", "The algorithm raises a DivisionByZero error"], correctIdx: 1 }
      },
      {
        id: "happy_number_floyd",
        title: "Happy sum-of-squares Floyd Cycle",
        type: "happy",
        description: "Which cycle-finding algorithm can prove if a number is Happy in O(1) auxiliary space (no HashSet memory needed) by using slow and fast pointers?",
        objective: "Identify setless cycle detection.",
        hint: "This famous pointer algorithm uses a tortoise and a hare walking down the sequence at different speeds.",
        xpReward: 70,
        pointsReward: 35,
        data: { options: ["Dijkstra's Shortest Path", "Floyd's Tortoise and Hare Cycle Finding Algorithm", "Kruskal's Algorithm", "Binary Search Tree traversal"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 8,
    name: "Custom Hashing & Collisions",
    topic: "Designing Uniform Distributions",
    bossName: "Grand Cipher-Lord",
    bossTitle: "Master of Cryptographic Keys",
    bossAvatar: "👑",
    bossMaxHP: 180,
    bossDialogueGreeting: "You have scaled my constant-time steps! Now, face my custom hash algorithms, linear probe indices, and prime multipliers! Prove your uniform key distribution or crumble under the collision weight!",
    bossDialogueDefeated: "Hash Realm fully consolidated! Your O(1) database maps with perfect, uniform distribution. You are the Lord of Hashing!",
    rewardAchievementId: "hash_lvl8",
    rewardAchievementName: "Lord of Constant Time",
    problems: [
      {
        id: "hash_primes",
        title: "The Role of Primes in Hashing",
        type: "customhash",
        description: "Why are prime numbers (like 31 or 53) heavily used as multipliers in custom string hash functions?",
        objective: "Understand prime multiplication in hashing.",
        hint: "Multiplication by primes distributes hash keys relatively uniformly across the integer spectrum, minimizing index overlaps and collision clumps.",
        xpReward: 70,
        pointsReward: 45,
        data: { options: ["They speed up division operations", "They reduce collision clumps by ensuring hash codes distribute more uniformly", "They automatically compress strings to exactly 8 bits", "They prevent negative numbers from generating"], correctIdx: 1 }
      },
      {
        id: "linear_probing_mechanics",
        title: "Linear Probing Collision Resolution",
        type: "customhash",
        description: "In open addressing linear probing, if a slot index 'hash(key) % capacity' is already occupied by another key, where is the colliding key placed?",
        objective: "Trace linear probing resolution.",
        hint: "Linear probing looks at the very next consecutive index slots, wrapping around the table sequentially.",
        xpReward: 75,
        pointsReward: 45,
        data: { options: ["In a secondary overflow binary tree", "In the next consecutively available vacant slot, wrapping around if needed", "At the root node of the backing heap", "It overwrites the existing element immediately"], correctIdx: 1 }
      },
      {
        id: "chaining_vs_open_address",
        title: "Chaining vs Open Addressing",
        type: "customhash",
        description: "What is the primary difference in memory allocation strategy between Chaining (closed addressing) and Open Addressing collision resolution?",
        objective: "Contrast hash table memory types.",
        hint: "Chaining creates extra pointer structures like linked lists outside the table, whereas Open Addressing stores all keys directly in the pre-allocated table array.",
        xpReward: 80,
        pointsReward: 45,
        data: { options: ["Open addressing uses double the memory", "Chaining utilizes auxiliary linked nodes outside the main array, while Open Addressing stores all keys directly inside the pre-allocated array", "Chaining is strictly slower to insert", "Open addressing requires no hash function"], correctIdx: 1 }
      },
      {
        id: "crypto_vs_non_crypto_hash",
        title: "Cryptographic vs Compiler Hashing",
        type: "customhash",
        description: "For standard HashMap compilers and runtime data lookups, why are non-cryptographic hash functions (like MurmurHash or xxHash) preferred over cryptographic hash functions (like SHA-256)?",
        objective: "Evaluate runtime performance requirements of hashing.",
        hint: "Cryptographic hashes prioritize secure preimage resistance making them extremely complex, whereas compiler lookups prioritize raw execution speed.",
        xpReward: 85,
        pointsReward: 45,
        data: { options: ["Non-cryptographic hash functions are cryptographically more secure", "Non-cryptographic hash functions are significantly faster to compute, minimizing lookup overhead", "Cryptographic hash functions cannot output integers", "Non-cryptographic hash functions use zero memory"], correctIdx: 1 }
      }
    ]
  }
];

export default function HashRealmQuest({ profile, onUpdateProfile, onBackToMenu, onCompleteSector }: HashRealmQuestProps) {
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
      `[HASH REALM] Portal accessed: Level ${lvl.id} - ${lvl.name}`, 
      `[GATEWAY] Guardian entity ${lvl.bossName} active.`
    ]);
  }, [activeLevelIdx]);

  // Sync Problem selection
  useEffect(() => {
    const prob = selectedLevel.problems[activeProblemIdx];
    if (prob) {
      setShowHint(false);
      setSelectedIdx(null);
      setConsoleLogs(prev => [...prev, `[LOG] Parsing O(1) hash parameters for task: ${prob.title}`]);
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
      setConsoleLogs(prev => [...prev, "⚠️ No collision parameters chosen! Define slot distribution."]);
      playSound('error');
      return;
    }

    let success = false;
    let feedback = '';

    if (selectedIdx === prob.data.correctIdx) {
      success = true;
      feedback = `✅ Correct! Constant-time bucket check verified: ${prob.data.options[selectedIdx]}`;
    } else {
      feedback = `❌ Collision check failed. Key hash produced a nested chain conflict!`;
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
          setCurrentDialogue("Curse your uniform key distributions! My index arrays are breaking!");
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
              description: `Conquered Level ${selectedLevel.id} of the Hash Realm by proving perfect uniform key mapping.`,
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

    if (totalLvlSolved === 8) {
      setConsoleLogs(prev => [...prev, "🚨 SECTOR CONQUEST SECURED! HASH REALM IS COMPLETELY MASTERED!"]);
      setTimeout(() => {
        onCompleteSector();
      }, 3000);
    }
  };

  const prob = selectedLevel.problems[activeProblemIdx];

  return (
    <div className="bg-[#0b0502] border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-mono text-slate-200 w-full">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.8)]" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-950/40">
        <div>
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">
              HASH REALM: CONSTANT TIME O(1)
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
            8 Levels • 28 Key-Value Tasks • HashMap, HashSet, Two Sum, Frequencies & Collisions
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
            ← LEAVE REALM
          </button>
        </div>
      </div>

      {/* LEVEL SELECTION RAIL */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5 mb-6">
        {QUEST_LEVELS.map((lvl, index) => {
          const isSelected = activeLevelIdx === index;
          const isCleared = lvl.problems.every(p => solvedProblemIds.includes(p.id));
          return (
            <button
              key={lvl.id}
              onClick={() => handleLevelSelect(index)}
              className={`relative p-2 rounded-xl border text-center transition-all ${
                isSelected 
                  ? 'bg-amber-950/30 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)] text-amber-200' 
                  : isCleared
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-300 hover:bg-amber-950/30'
                  : 'bg-slate-905/30 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300'
              }`}
            >
              <div className="text-[9px] text-slate-400 uppercase font-black">L{lvl.id} - {lvl.name.split(' ')[0]}</div>
              {isCleared && <CheckCircle2 className="w-3 h-3 text-amber-400 absolute top-1 right-1" />}
            </button>
          );
        })}
      </div>

      {/* MAIN GAMEPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PROBLEM DESCRIPTOR */}
          <div className="bg-[#080301] border border-amber-950/80 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="px-2 py-0.5 bg-amber-950 text-amber-400 rounded text-[9px] uppercase font-bold tracking-widest">
                Task {activeProblemIdx + 1} of {selectedLevel.problems.length}
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
                <span className="text-[10px] text-amber-300 uppercase font-black block">Warden Objective</span>
                <p className="text-xs text-amber-200 font-bold">{prob?.objective}</p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE STAGE */}
          <div className="bg-[#050201] border border-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] relative">
            <span className="absolute top-3 left-4 text-[9px] text-slate-500 uppercase font-bold tracking-widest">
              Live Hash Slot Array Emulator
            </span>

            {/* INTERACTIVE VECTOR DISPLAY */}
            <div className="w-full flex flex-col items-center justify-center gap-4 py-6">
              
              {/* STATIC HASH MEMORY BUCKETS */}
              <div className="flex flex-col items-center mb-4 p-4 bg-slate-950/80 border border-slate-900 rounded-xl w-full max-w-sm">
                <span className="text-[8px] text-slate-500 uppercase font-bold mb-2">Hash Table Slots [Linear Bucket Map]</span>
                <div className="flex items-center gap-1 w-full justify-center font-mono">
                  {[
                    { label: 'key: 7', active: false },
                    { label: 'empty', active: false },
                    { label: 'key: 12', active: true },
                    { label: 'empty', active: false },
                    { label: 'key: 22', active: false }
                  ].map((slot, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`w-12 h-12 border rounded flex flex-col items-center justify-center text-[10px] ${
                        slot.active 
                          ? 'border-amber-500 bg-amber-950/20 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.2)]' 
                          : 'border-slate-850 bg-slate-950 text-slate-500'
                      }`}>
                        <span className="text-[7px] text-slate-600">slot[{idx}]</span>
                        <span className="font-bold mt-1">{slot.label}</span>
                      </div>
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
                      selectedIdx === idx ? 'border-amber-400 bg-amber-400 text-[#0b0502]' : 'border-slate-800'
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
                <span>COMPILE & COMPUTE</span>
              </button>

              {solvedProblemIds.includes(prob?.id) && (
                <button
                  onClick={handleNextProblem}
                  className="px-4 py-2.5 bg-amber-950 border border-amber-500/40 text-amber-300 hover:border-amber-500 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <span>NEXT SLOT</span>
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
                  <span className="text-xs font-black text-yellow-300 block uppercase tracking-wider">Haze Warden Tip:</span>
                  <p className="text-xs text-yellow-200/90 mt-1 leading-relaxed">{prob?.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: BOSS & ENVIRONMENT FEEDBACK */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* BOSS BATTLE SCREEN */}
          <div className="bg-gradient-to-b from-slate-950 to-[#0c0502] border border-amber-950 rounded-2xl p-5 relative overflow-hidden">
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
                <span>SECTOR SHIELDS</span>
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
                Constant Time Memory Bus
              </span>
              <button 
                onClick={() => setConsoleLogs([`[HASH REALM] Collisions cleared.`])}
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
            className="fixed bottom-6 right-6 bg-[#0c0502] border-2 border-amber-500/80 rounded-2xl p-5 shadow-[0_0_30px_rgba(245,158,11,0.4)] z-50 flex items-center gap-4 max-w-sm"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-2xl animate-spin-slow">
              🏆
            </div>
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest block">Achievement Unlocked!</span>
              <h5 className="text-sm font-black text-white">{newAchievement}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">Defeated the local sector threat in Hash Realm.</p>
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
