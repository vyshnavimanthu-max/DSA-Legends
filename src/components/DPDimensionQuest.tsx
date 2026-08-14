import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Lightbulb, Cpu, Trophy, Send, X, Sliders, Sparkles, ChevronRight, HelpCircle, Layers, ShieldAlert, Award, Play, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileState } from '../types';
import PremiumAudioManager from '../lib/audioManager';

interface DPDimensionQuestProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
  onCompleteSector: () => void;
}

export interface QuestProblem {
  id: string;
  title: string;
  type: 'concept' | 'fibonacci' | 'stairs' | 'robber' | 'coin' | 'knapsack' | 'lcs' | 'lis' | 'edit' | 'paths' | 'partition' | 'bitmask' | 'tree' | 'digit' | 'interval' | 'advanced';
  description: string;
  objective: string;
  hint: string;
  xpReward: number;
  pointsReward: number;
  data: {
    options: string[];
    correctIdx: number;
    visualArray?: number[];
    visualTree?: string;
  };
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
    name: "Fibonacci & Overlapping Calls",
    topic: "Memoization vs Tabulation",
    bossName: "Fib-Overlord",
    bossTitle: "Curator of Repeated Subproblems",
    bossAvatar: "🌀",
    bossMaxHP: 100,
    bossDialogueGreeting: "I execute overlapping branches of recursion until the memory tree collapses under exponential weight! Find my lookup cache configurations or drown in O(2^N) depth!",
    bossDialogueDefeated: "Excellent lookup speeds. You have optimized my state overlaps perfectly.",
    rewardAchievementId: "dp_lvl1",
    rewardAchievementName: "Cache Scribe",
    problems: [
      {
        id: "fib_naive_complexity",
        title: "Naive Recursive Complexity",
        type: "concept",
        description: "Without memoization, why does the naive recursive Fibonacci algorithm (fib(n) = fib(n-1) + fib(n-2)) run in exponential time complexity O(2^N)?",
        objective: "Identify the cause of naive Fibonacci's exponential slowdown.",
        hint: "Count how many times fib(2) is calculated while resolving fib(6). We repeat same calculations over and over.",
        xpReward: 30,
        pointsReward: 20,
        data: {
          options: [
            "Because matrix operations are done in linear time",
            "Because it performs the same subproblem computations multiple times independently",
            "Because it allocates O(N^2) stack frames per step",
            "Because it requires binary search iterations"
          ],
          correctIdx: 1,
          visualArray: [1, 1, 2, 3, 5, 8, 13, 21]
        }
      },
      {
        id: "fib_memo_space",
        title: "Memoization Space Cost",
        type: "concept",
        description: "What is the worst-case space complexity of top-down memoized Fibonacci of N, counting both the call stack and the memo array?",
        objective: "Identify top-down storage cost.",
        hint: "The recursion depth goes from N down to 1. The cache also stores N elements.",
        xpReward: 35,
        pointsReward: 20,
        data: {
          options: ["O(1) space", "O(N) space", "O(2^N) space", "O(N log N) space"],
          correctIdx: 1
        }
      },
      {
        id: "fib_tabulation_space",
        title: "Space-Optimized Tabulation",
        type: "concept",
        description: "Bottom-up dynamic programming (tabulation) for Fibonacci can be optimized from O(N) space down to O(1) space. How is this achieved?",
        objective: "Select the optimal bottom-up storage strategy.",
        hint: "To calculate the next value, we only need the last two variables, not the entire list.",
        xpReward: 35,
        pointsReward: 20,
        data: {
          options: [
            "By using bitwise shift operators",
            "By only maintaining the last two computed values in variables instead of a full array",
            "By using tail-recursion optimization",
            "By running on a parallel GPU kernel"
          ],
          correctIdx: 1
        }
      },
      {
        id: "fib_matrix_exponentiation",
        title: "Logarithmic Scaling via Matrices",
        type: "concept",
        description: "To find the N-th Fibonacci number for extremely large values (e.g., N = 10^18), which advanced method scales in O(log N) time?",
        objective: "Select logarithmic Fibonacci calculation method.",
        hint: "Expressing the Fibonacci recurrence as a 2x2 matrix multiplication and using binary exponentiation.",
        xpReward: 40,
        pointsReward: 20,
        data: {
          options: [
            "Divide-and-conquer binary search",
            "Matrix Exponentiation combined with binary exponentiation",
            "Fast Fourier Transform",
            "Linear Sieve computation"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 2,
    name: "Climbing Stairs Variations",
    topic: "Combinatorics and Step Bounds",
    bossName: "Stairway Guardian",
    bossTitle: "Ascent Security Unit",
    bossAvatar: "🪜",
    bossMaxHP: 110,
    bossDialogueGreeting: "To ascend our platform, you must calculate step sequences. Modify my strides, jump across gap constraints, or plummet into memory leaks!",
    bossDialogueDefeated: "Ascension path safe. Your combinations match our structure.",
    rewardAchievementId: "dp_lvl2",
    rewardAchievementName: "Stairway Sculptor",
    problems: [
      {
        id: "climb_stairs_base",
        title: "Climbing Stairs Recurrence",
        type: "stairs",
        description: "You are climbing a staircase of N steps. Each time you can climb either 1 or 2 steps. What is the recurrence relation to find the total number of unique ways to reach the top?",
        objective: "Identify the base climbing stairs equation.",
        hint: "To be at step i, you could have only arrived from step i-1 (jumping 1) or step i-2 (jumping 2).",
        xpReward: 35,
        pointsReward: 20,
        data: {
          options: ["dp[i] = dp[i-1] * dp[i-2]", "dp[i] = dp[i-1] + dp[i-2]", "dp[i] = max(dp[i-1], dp[i-2])", "dp[i] = dp[i-1] + 1"],
          correctIdx: 1
        }
      },
      {
        id: "climb_stairs_min_cost",
        title: "Min Cost Climbing Stairs",
        type: "stairs",
        description: "In 'Min Cost Climbing Stairs', where you pay cost[i] to step from index i, which transition calculates the minimum expense to reach step i?",
        objective: "Formulate optimal state transition for cost-based stairs.",
        hint: "You pay the step's cost plus the minimal accumulated cost of the previous two steps.",
        xpReward: 40,
        pointsReward: 20,
        data: {
          options: [
            "dp[i] = cost[i] + max(dp[i-1], dp[i-2])",
            "dp[i] = cost[i] + min(dp[i-1], dp[i-2])",
            "dp[i] = min(cost[i-1], cost[i-2])",
            "dp[i] = dp[i-1] + dp[i-2] - cost[i]"
          ],
          correctIdx: 1
        }
      },
      {
        id: "climb_stairs_k_steps",
        title: "Stairs with K Strides",
        type: "stairs",
        description: "If you can take anywhere from 1 up to K steps at a time, what is the time complexity to find the total ways to reach the N-th step using basic dynamic programming?",
        objective: "Analyze multi-stride stairs complexity.",
        hint: "For each of the N steps, we must sum up to K previous DP states.",
        xpReward: 40,
        pointsReward: 20,
        data: {
          options: ["O(N) time", "O(N * K) time", "O(K^N) time", "O(N log K) time"],
          correctIdx: 1
        }
      },
      {
        id: "climb_stairs_forbidden",
        title: "Climbing with Forbidden Steps",
        type: "stairs",
        description: "If certain staircase steps are broken/forbidden and cannot be stepped on, how do we adjust our DP table during the iteration?",
        objective: "Handle obstacle step constraints.",
        hint: "If step i is broken, there are exactly zero ways to stand on it. What number represents zero ways?",
        xpReward: 45,
        pointsReward: 20,
        data: {
          options: [
            "We delete the index from the array completely, shifting other indices left",
            "We set dp[i] = 0 for all forbidden steps i",
            "We set dp[i] to negative infinity",
            "We multiply dp[i-1] by dp[i-2]"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 3,
    name: "House Robber & Non-Adjacency",
    topic: "Maximum Subsets without Neighboring Items",
    bossName: "Phantom Thief",
    bossTitle: "Master of Stealth Selection",
    bossAvatar: "🦹",
    bossMaxHP: 115,
    bossDialogueGreeting: "You cannot rob adjacent vaults without setting off our security alarms! Balance maximum loot values against layout bounds, or trigger a full wipe!",
    bossDialogueDefeated: "Loot maximized without warnings. Your selection vectors are silent.",
    rewardAchievementId: "dp_lvl3",
    rewardAchievementName: "Alarms Defused",
    problems: [
      {
        id: "robber_base_transition",
        title: "House Robber I Core Choice",
        type: "robber",
        description: "In a straight line of houses containing cash values, what are the two options at house i that determine our DP maximization state?",
        objective: "Express the core decision equation.",
        hint: "Either we skip house i and keep max of i-1, or we rob house i plus whatever we accumulated up to i-2.",
        xpReward: 35,
        pointsReward: 25,
        data: {
          options: [
            "Rob house i and i-1, or rob house i-2",
            "Skip house i (dp[i-1]) OR rob house i plus max loot from i-2 (dp[i-2] + nums[i])",
            "Multiply houses pairwise",
            "Sort houses in descending value"
          ],
          correctIdx: 1
        }
      },
      {
        id: "robber_circular",
        title: "Circular Neighborhood (House Robber II)",
        type: "robber",
        description: "If the houses are arranged in a circle, meaning the first house is adjacent to the last, how do we solve it using standard House Robber I logic?",
        objective: "Manage circular adjacency constraints.",
        hint: "We cannot rob both first and last. Split the problem into two sub-problems.",
        xpReward: 45,
        pointsReward: 25,
        data: {
          options: [
            "Take the average of robbing odd and even indices",
            "Solve standard House Robber twice: once for houses [0 to N-2] and once for houses [1 to N-1], taking the maximum of the two results",
            "Insert a dummy house in the middle with zero value",
            "Divide the final sum by N"
          ],
          correctIdx: 1
        }
      },
      {
        id: "robber_tree_version",
        title: "Tree Robbery State Options",
        type: "robber",
        description: "For House Robber III (where houses are nodes in a binary tree), what information should each tree-recursion step return for its subtree?",
        objective: "Determine tree-state array return values.",
        hint: "For any node, we need to know: what is the max value if we rob this node? And what is the max if we skip this node?",
        xpReward: 45,
        pointsReward: 25,
        data: {
          options: [
            "The sum of all leaf values",
            "A pair/tuple: [max loot if we rob this node, max loot if we skip this node]",
            "The depth of the deepest leaf",
            "A boolean indicating if the node is left or right"
          ],
          correctIdx: 1
        }
      },
      {
        id: "robber_cooldown",
        title: "Robbery with rest cooldown",
        type: "robber",
        description: "If robbing a house forces you into a 1-day cooldown where you cannot rob the next day, how is the state dp[i] updated when choosing to rob house i?",
        objective: "Formulate cooldown rest steps.",
        hint: "Robbing house i requires skipping day i-1, meaning we can add nums[i] to the max loot accumulated up to day i-3.",
        xpReward: 50,
        pointsReward: 25,
        data: {
          options: [
            "dp[i] = max(dp[i-1], dp[i-2] + nums[i])",
            "dp[i] = max(dp[i-1], dp[i-3] + nums[i])",
            "dp[i] = dp[i-4] + nums[i]",
            "dp[i] = max(dp[i-1], dp[i-2]) - nums[i]"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 4,
    name: "Coin Change combinations",
    topic: "Change Optimization and Combinations",
    bossName: "Banker Spectre",
    bossTitle: "Liquidity Optimizer",
    bossAvatar: "💰",
    bossMaxHP: 120,
    bossDialogueGreeting: "Coins represent fractional values in our database. Can you make exact amounts using minimal counts? Or will your calculations lead to currency inflation?",
    bossDialogueDefeated: "Exact values matched. Minting procedures fully calibrated.",
    rewardAchievementId: "dp_lvl4",
    rewardAchievementName: "Currency Minter",
    problems: [
      {
        id: "coin_change_min_coins",
        title: "Fewest Coins (Coin Change I)",
        type: "coin",
        description: "Given a target amount and coins of various denominations, what is the state transition to find the fewest coins to make up that amount?",
        objective: "Define the minimization coin change recurrence.",
        hint: "We try every coin c: if we use it, our cost is 1 + few_coins(amount - c). Take the minimum across all c.",
        xpReward: 40,
        pointsReward: 25,
        data: {
          options: [
            "dp[i] = sum(dp[i - c])",
            "dp[i] = min(dp[i], dp[i - c] + 1) for all coins c",
            "dp[i] = max(dp[i], dp[i - c])",
            "dp[i] = dp[i] / c"
          ],
          correctIdx: 1
        }
      },
      {
        id: "coin_change_combinations",
        title: "Total Combinations (Coin Change II)",
        type: "coin",
        description: "To count the number of unique combinations to make up an amount (where order of coins does not matter), how are loops ordered?",
        objective: "Prevent duplicate combinations by proper loop nesting.",
        hint: "Loop through each coin first, then loop through each amount from coin to target. This prevents counting [1,2] and [2,1] as distinct.",
        xpReward: 45,
        pointsReward: 25,
        data: {
          options: [
            "Loop amounts first, then coin denominations",
            "Loop coin denominations first, then loop amounts from coin value to target",
            "It does not matter, both nesting structures yield identical combination counts",
            "Merge coin arrays using quicksort"
          ],
          correctIdx: 1
        }
      },
      {
        id: "coin_change_limited",
        title: "Limited Coin Count State",
        type: "coin",
        description: "If each coin denomination has a limited quantity available, which dynamic programming variant does this coin change problem transform into?",
        objective: "Identify bounded subproblem translations.",
        hint: "Because items are restricted in count, this mimics a bounded knapsack problem.",
        xpReward: 45,
        pointsReward: 25,
        data: {
          options: ["Unbounded Knapsack", "Bounded Knapsack / Subset Sum with duplicates", "Fractional Greedy Knapsack", "Fibonacci Lattice"],
          correctIdx: 1
        }
      },
      {
        id: "coin_change_unreachable",
        title: "Representing Unreachable Amounts",
        type: "coin",
        description: "If it is impossible to make up a specific amount with any coin combinations, what value is traditionally stored in dp[amount] to signal unreachable states?",
        objective: "Select unreachable sentinel values.",
        hint: "Since we seek the minimum, an unreachable state is initialized to a high sentinel (like Infinity or amount + 1).",
        xpReward: 50,
        pointsReward: 25,
        data: {
          options: ["Zero (0)", "Negative one (-1) or Infinity", "The sum of all coin values", "One (1)"],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 5,
    name: "Knapsack Formulations",
    topic: "0-1 and Unbounded Weights",
    bossName: "Treasury Golem",
    bossTitle: "Vault Storage Guardian",
    bossAvatar: "🎒",
    bossMaxHP: 130,
    bossDialogueGreeting: "My knapsack can only hold a strict weight limit! Pack your valuables with maximum density. Violate my weight capacity and your memory buffers explode!",
    bossDialogueDefeated: "Capacity optimized. Vault integrity sustained.",
    rewardAchievementId: "dp_lvl5",
    rewardAchievementName: "Vault Packer",
    problems: [
      {
        id: "knapsack_01_transition",
        title: "0-1 Knapsack State Transition",
        type: "knapsack",
        description: "In the standard 0-1 Knapsack problem with weight capacity W and item values/weights, what is the core state transition when evaluating item i?",
        objective: "Select the 0-1 Knapsack recurrence equation.",
        hint: "We choose the max of skipping the item, or taking it (adding its value to the solution of the remaining weight).",
        xpReward: 40,
        pointsReward: 25,
        data: {
          options: [
            "dp[i][w] = dp[i-1][w] + dp[i][w - wt[i]]",
            "dp[i][w] = max(dp[i-1][w], dp[i-1][w - wt[i-1]] + val[i-1]) for w >= wt[i-1]",
            "dp[i][w] = min(dp[i-1][w], dp[i][w-1])",
            "dp[i][w] = val[i] * w"
          ],
          correctIdx: 1
        }
      },
      {
        id: "knapsack_01_space_opt",
        title: "0-1 Knapsack 1D Space Optimization",
        type: "knapsack",
        description: "To optimize 0-1 Knapsack space to a single 1D array of size W, what is the critical direction we must run the nested weight loop, and why?",
        objective: "Trace 1D knapsack iteration direction.",
        hint: "We must run the loop backwards (from W down to weight) to ensure we use values from the previous item step, preventing multiple uses of the same item.",
        xpReward: 50,
        pointsReward: 25,
        data: {
          options: [
            "Forwards (from weight to W), so items can be reused infinitely",
            "Backwards (from W down to weight), to avoid overwriting values from the previous iteration row",
            "It can run in either direction with identical outcomes",
            "We iterate weights in powers of 2"
          ],
          correctIdx: 1
        }
      },
      {
        id: "knapsack_unbounded_iteration",
        title: "Unbounded Knapsack Loop Direction",
        type: "knapsack",
        description: "In Unbounded Knapsack, where items can be selected an infinite number of times, in what direction do we loop weights in our 1D array?",
        objective: "Differentiate unbounded from bounded looping.",
        hint: "Forwards iteration allows later slots to build upon decisions made earlier in the same item step, allowing multiple uses.",
        xpReward: 50,
        pointsReward: 25,
        data: {
          options: [
            "Backwards from W down to weight",
            "Forwards from weight up to W",
            "We do not use loops; we solve it recursively with no memoization",
            "Weights are sorted in decreasing order"
          ],
          correctIdx: 1
        }
      },
      {
        id: "knapsack_fractional_trap",
        title: "The Fractional Knapsack Trap",
        type: "knapsack",
        description: "If you can take fractional parts of items (Fractional Knapsack), which technique solves it optimally and in what complexity?",
        objective: "Identify the optimal fractional knapsack solver.",
        hint: "Fractional items mean we can just greedily pick items with highest value-to-weight ratio. No DP required!",
        xpReward: 50,
        pointsReward: 25,
        data: {
          options: [
            "Dynamic programming in O(N * W) time",
            "Greedy algorithm sorting by value/weight ratio in O(N log N) time",
            "Depth-First search in exponential time",
            "Binary search on floating points"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 6,
    name: "Longest Common Subsequence",
    topic: "Comparing Parallel Sequences",
    bossName: "Sequence Splicer",
    bossTitle: "Strand Aligning Overseer",
    bossAvatar: "🧬",
    bossMaxHP: 135,
    bossDialogueGreeting: "Align my genomic string data! Match shared characters across sequence dimensions, or be pruned as a mutation!",
    bossDialogueDefeated: "Strands aligned. LCS indices matching perfectly.",
    rewardAchievementId: "dp_lvl6",
    rewardAchievementName: "Strand Aligner",
    problems: [
      {
        id: "lcs_core_transition",
        title: "LCS State Transition",
        type: "lcs",
        description: "Given strings A of length M and B of length N, if A[i] matches B[j], how does the DP cell value at dp[i][j] update?",
        objective: "Identify the matching state change equation.",
        hint: "A match adds 1 to the optimal subsequence length excluding both characters (dp[i-1][j-1]).",
        xpReward: 40,
        pointsReward: 25,
        data: {
          options: [
            "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
            "dp[i][j] = dp[i-1][j-1] + 1",
            "dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
            "dp[i][j] = dp[i-1][j-1] + 2"
          ],
          correctIdx: 1
        }
      },
      {
        id: "shortest_common_supersequence",
        title: "Shortest Common Supersequence",
        type: "lcs",
        description: "What is the relationship between the Shortest Common Supersequence (SCS) of strings A and B, and their Longest Common Subsequence (LCS)?",
        objective: "Formulate SCS length from LCS.",
        hint: "The supersequence contains all characters of both strings. We can save length by only writing the shared LCS characters once.",
        xpReward: 45,
        pointsReward: 25,
        data: {
          options: [
            "Length(SCS) = Length(A) + Length(B)",
            "Length(SCS) = Length(A) + Length(B) - Length(LCS)",
            "Length(SCS) = Length(LCS) / 2",
            "Length(SCS) = Length(A) * Length(B) - Length(LCS)"
          ],
          correctIdx: 1
        }
      },
      {
        id: "lps_lcs_relation",
        title: "Longest Palindromic Subsequence",
        type: "lcs",
        description: "How can the Longest Palindromic Subsequence (LPS) of a single string S be calculated using standard LCS?",
        objective: "Relate LPS to LCS.",
        hint: "A palindrome reads the same forwards and backwards. Try aligning S with its reverse.",
        xpReward: 45,
        pointsReward: 25,
        data: {
          options: [
            "LPS is the LCS of string S and string S with all vowels removed",
            "LPS is the LCS of string S and its reversed string S'",
            "LPS is exactly double the LCS of S with itself",
            "LPS is solved by sorting S alphabetically"
          ],
          correctIdx: 1
        }
      },
      {
        id: "distinct_subseq_transition",
        title: "Distinct Subsequences Counts",
        type: "lcs",
        description: "When calculating the number of distinct subsequences of S that equal T, what is the transition step for dp[i][j] when S[i-1] == T[j-1]?",
        objective: "Deduce distinct subsequence matching logic.",
        hint: "We can either match S[i-1] to T[j-1] (taking dp[i-1][j-1]) or choose not to use S[i-1] as a match (taking dp[i-1][j]). Sum them up.",
        xpReward: 50,
        pointsReward: 25,
        data: {
          options: [
            "dp[i][j] = dp[i-1][j-1] * dp[i-1][j]",
            "dp[i][j] = dp[i-1][j-1] + dp[i-1][j]",
            "dp[i][j] = dp[i-1][j-1] + 1",
            "dp[i][j] = max(dp[i-1][j-1], dp[i-1][j])"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 7,
    name: "Longest Increasing Subsequence",
    topic: "Monotonic Elements Tracking",
    bossName: "Patience Keeper",
    bossTitle: "Monotonic Coordinator",
    bossAvatar: "📈",
    bossMaxHP: 140,
    bossDialogueGreeting: "My sequences must trend strictly upwards! Sort, filter, and track incremental indexes, or face descending stack overflow!",
    bossDialogueDefeated: "Monotonicity verified. Subsequence arrays perfectly scaled.",
    rewardAchievementId: "dp_lvl7",
    rewardAchievementName: "Monotonic Master",
    problems: [
      {
        id: "lis_naive_complexity",
        title: "Standard LIS Complexity",
        type: "lis",
        description: "What is the worst-case time complexity of the standard, easy-to-implement dynamic programming approach for Longest Increasing Subsequence of size N?",
        objective: "Identify O(N^2) complexity bounds.",
        hint: "For every element, we scan backwards across all previous elements to check for smaller values.",
        xpReward: 40,
        pointsReward: 30,
        data: {
          options: ["O(N) time", "O(N log N) time", "O(N^2) time", "O(2^N) time"],
          correctIdx: 2
        }
      },
      {
        id: "lis_binary_search_opt",
        title: "Patience Sorting O(N log N)",
        type: "lis",
        description: "The O(N log N) optimized LIS algorithm replaces elements in an active helper array. What binary search function performs this replacement step?",
        objective: "Identify upper-bound/lower-bound replacement tools.",
        hint: "We search for the first element in our active list greater than or equal to our current value, which is standard 'lower_bound' or binary replacement.",
        xpReward: 50,
        pointsReward: 30,
        data: {
          options: [
            "Linear array scanning",
            "Binary search (lower_bound) to locate and replace the first element >= current element",
            "HashTable lookup",
            "Fibonacci divide search"
          ],
          correctIdx: 1
        }
      },
      {
        id: "lis_number_of_subseq",
        title: "Number of LIS",
        type: "lis",
        description: "To find the COUNT of distinct longest increasing subsequences, what secondary array must we maintain alongside our standard LIS length array?",
        objective: "Maintain parallel status counts.",
        hint: "We track the length of the LIS ending at index i, and also a count array tracking the number of paths achieving that length.",
        xpReward: 55,
        pointsReward: 30,
        data: {
          options: [
            "A sorted copy of the input",
            "A parallel count array representing the number of subsequences achieving the maximum length at each position",
            "A hashmap storing active index sums",
            "An array of prime factors"
          ],
          correctIdx: 1
        }
      },
      {
        id: "lis_russian_doll",
        title: "Russian Doll Envelopes",
        type: "lis",
        description: "In the 'Russian Doll Envelopes' problem, where you must nest envelopes based on width and height, how do we sort envelopes to solve it using LIS?",
        objective: "Arrange envelopes for LIS solutions.",
        hint: "Sort width ascending, and sort height descending for matching widths. Then, run standard LIS on the heights.",
        xpReward: 55,
        pointsReward: 30,
        data: {
          options: [
            "Sort both dimensions ascending",
            "Sort width ascending, and height descending for identical widths, then apply 1D LIS on heights",
            "Sort by area size",
            "Sort by prime factor counts"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 8,
    name: "Edit Distance Alignments",
    topic: "Levenshtein Distance Steps",
    bossName: "Lexical Alignment Core",
    bossTitle: "Levenshtein Administrator",
    bossAvatar: "📝",
    bossMaxHP: 145,
    bossDialogueGreeting: "Words undergo mutations. Insert, delete, or replace characters to transform terms smoothly. Solve our edit matrix or get deleted as syntax noise!",
    bossDialogueDefeated: "Transformation cost minimal. Edits fully reconciled.",
    rewardAchievementId: "dp_lvl8",
    rewardAchievementName: "Syntax Optimizer",
    problems: [
      {
        id: "edit_distance_operations",
        title: "Edit Distance operations",
        type: "edit",
        description: "Which three single-character operations are evaluated at each step of the classic Levenshtein Edit Distance algorithm?",
        objective: "Identify Levenshtein operations.",
        hint: "We can add a letter, remove a letter, or change one letter into another.",
        xpReward: 40,
        pointsReward: 30,
        data: {
          options: [
            "Shift, Rotate, Capitalize",
            "Insert, Delete, Replace",
            "Append, Truncate, Concat",
            "Hash, Encrypt, Decrypt"
          ],
          correctIdx: 1
        }
      },
      {
        id: "edit_distance_transition",
        title: "Edit Distance Recurrence",
        type: "edit",
        description: "If string S1 at index i does NOT match string S2 at index j, which dynamic programming equation calculates dp[i][j]?",
        objective: "Select edit minimization equation.",
        hint: "We take the minimum cost of our three edit options (dp[i-1][j] for delete, dp[i][j-1] for insert, dp[i-1][j-1] for replace) and add 1.",
        xpReward: 50,
        pointsReward: 30,
        data: {
          options: [
            "dp[i][j] = dp[i-1][j-1] + 1",
            "dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])",
            "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
            "dp[i][j] = max(dp[i-1][j], dp[i][j-1])"
          ],
          correctIdx: 1
        }
      },
      {
        id: "one_edit_distance",
        title: "One Edit Distance",
        type: "edit",
        description: "To check if two strings S1 and S2 are exactly ONE edit distance apart, is running the full O(N^2) DP algorithm required?",
        objective: "Recognize linear edit distance bounds.",
        hint: "Since the distance is exactly 1, we can scan both strings in a single linear pass of O(N) time with pointers.",
        xpReward: 50,
        pointsReward: 30,
        data: {
          options: [
            "Yes, DP is the only mathematically proven method for string comparison",
            "No, it can be resolved in linear O(N) time using two pointers to compare character mismatches",
            "No, it requires O(log N) ternary trees",
            "Yes, edit checking is NP-hard"
          ],
          correctIdx: 1
        }
      },
      {
        id: "delete_op_two_strings",
        title: "Delete Steps for Two Strings",
        type: "edit",
        description: "To find the minimum number of deletion steps to make two strings identical, what is the optimal DP solution using their LCS?",
        objective: "Deduce deletion step metrics from LCS.",
        hint: "We keep the shared characters (LCS) untouched. We must delete everything else from both strings.",
        xpReward: 55,
        pointsReward: 30,
        data: {
          options: [
            "Length(A) * Length(B) - Length(LCS)",
            "Length(A) + Length(B) - 2 * Length(LCS)",
            "Length(LCS) + 2",
            "Length(A) - Length(B) + Length(LCS)"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 9,
    name: "Matrix Paths & Grid Bounds",
    topic: "Coordinates and Barrier Processing",
    bossName: "Grid Overlord",
    bossTitle: "Coordinate Grid Controller",
    bossAvatar: "🏁",
    bossMaxHP: 150,
    bossDialogueGreeting: "My grids are littered with high-voltage blockades! Map safe coordinate paths from top-left to bottom-right, or find your state cells wiped!",
    bossDialogueDefeated: "Safe coordinates validated. Min path costs recorded.",
    rewardAchievementId: "dp_lvl9",
    rewardAchievementName: "Grid Explorer",
    problems: [
      {
        id: "unique_paths_base",
        title: "Unique Paths Grid Recurrence",
        type: "paths",
        description: "In an obstacle-free M x N grid, what is the recurrence to find the total unique paths from top-left to bottom-right, moving only right or down?",
        objective: "Identify the grid path adder.",
        hint: "You can only enter cell (i, j) from the top (i-1, j) or from the left (i, j-1).",
        xpReward: 40,
        pointsReward: 30,
        data: {
          options: [
            "dp[i][j] = dp[i-1][j] * dp[i][j-1]",
            "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
            "dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + 1",
            "dp[i][j] = i * j"
          ],
          correctIdx: 1
        }
      },
      {
        id: "unique_paths_obstacles",
        title: "Grid Pathing with Obstacles",
        type: "paths",
        description: "In Unique Paths II, if grid[i][j] contains an obstacle, how is its DP state resolved?",
        objective: "Handle grid obstacle equations.",
        hint: "Obstacles block all incoming paths. Set the paths to this cell to exactly 0.",
        xpReward: 45,
        pointsReward: 30,
        data: {
          options: [
            "dp[i][j] = dp[i-1][j-1]",
            "dp[i][j] = 0",
            "dp[i][j] = dp[i-1][j] + dp[i][j-1] + 1",
            "dp[i][j] = -1"
          ],
          correctIdx: 1
        }
      },
      {
        id: "min_path_sum",
        title: "Minimum Path Sum in Grid",
        type: "paths",
        description: "To find the path with the smallest sum of values on a grid, what is the cell transition equation?",
        objective: "Select min-sum cell optimization step.",
        hint: "The cost to reach (i, j) is the cell's own value plus the minimum cost of arriving from the top or left cells.",
        xpReward: 45,
        pointsReward: 30,
        data: {
          options: [
            "dp[i][j] = grid[i][j] + max(dp[i-1][j], dp[i][j-1])",
            "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])",
            "dp[i][j] = min(grid[i-1][j], grid[i][j-1])",
            "dp[i][j] = dp[i-1][j] + dp[i][j-1]"
          ],
          correctIdx: 1
        }
      },
      {
        id: "dungeon_game_health",
        title: "Dungeon Game Health Optimization",
        type: "paths",
        description: "In 'Dungeon Game', where cells contain health points and you must survive with health >= 1, in what direction should we calculate DP, and why?",
        objective: "Explain reverse grid path calculations.",
        hint: "Calculating forwards doesn't let you know if a future cell will kill you. Start from bottom-right and work backwards to determine minimum starting health.",
        xpReward: 50,
        pointsReward: 30,
        data: {
          options: [
            "Forwards from top-left, since health always increments",
            "Backwards from bottom-right (the exit) to top-left, to ensure health never drops to 0 or below during any step",
            "Diagonally starting from the center cell",
            "Using a BFS queue instead of DP"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 10,
    name: "Partition & Subproblem Cuts",
    topic: "Dividing Arrays and Sequences",
    bossName: "Splitter Titan",
    bossTitle: "Array Partition Director",
    bossAvatar: "🧱",
    bossMaxHP: 155,
    bossDialogueGreeting: "My arrays must be sliced into perfect portions! Solve my division weights, calculate minimal cuts, or find your partitions fragmented in memory!",
    bossDialogueDefeated: "Partitions balanced. Splitting indices verified.",
    rewardAchievementId: "dp_lvl10",
    rewardAchievementName: "Subproblem Slicer",
    problems: [
      {
        id: "partition_subset_sum",
        title: "Equal Subset Sum Partition",
        type: "partition",
        description: "To partition an array into two subsets with identical sums, what sum value S do we search for in our dynamic programming subset sum array?",
        objective: "Identify target subset sum weights.",
        hint: "Two equal parts means each part must sum to exactly half of the total array sum. If the sum is odd, it's immediately impossible.",
        xpReward: 45,
        pointsReward: 35,
        data: {
          options: [
            "Sum / 3",
            "Sum / 2 (only if total sum is even)",
            "The median element",
            "The maximum element value"
          ],
          correctIdx: 1
        }
      },
      {
        id: "palindrome_partitioning_ii",
        title: "Palindrome Partitioning II Cuts",
        type: "partition",
        description: "To find the minimum cuts to partition a string into palindromes, how does DP help us optimize the palindromic checks?",
        objective: "Identify nested palindrome preprocessing benefits.",
        hint: "We can precompute isPalindrome[i][j] in O(N^2) time to look up palindrome properties of any substring in O(1) time.",
        xpReward: 50,
        pointsReward: 35,
        data: {
          options: [
            "By sorting the string characters first",
            "By precalculating a 2D boolean array where dp[i][j] indicates whether substring S[i..j] is a palindrome",
            "By running a binary search on the cuts",
            "By reversing the string"
          ],
          correctIdx: 1
        }
      },
      {
        id: "decode_ways_transition",
        title: "Decode Ways State Addition",
        type: "partition",
        description: "In 'Decode Ways' (where A=1, B=2,... Z=26), how many preceding steps do we read to calculate dp[i] for a digit character?",
        objective: "Handle single and double character groupings.",
        hint: "We check the single digit at i-1 (if not '0'), and the double digit at i-2 to i-1 (if between 10 and 26). We sum their valid contributions.",
        xpReward: 50,
        pointsReward: 35,
        data: {
          options: [
            "Only the previous step, dp[i-1]",
            "The previous two steps: dp[i-1] (for single-digit decode) and dp[i-2] (for two-digit decode)",
            "We sum all indices up to i",
            "Only prime indexes"
          ],
          correctIdx: 1
        }
      },
      {
        id: "partition_array_max_sum",
        title: "Partition Array for Max Sum",
        type: "partition",
        description: "If you partition an array into contiguous subarrays of maximum size K, where each subarray's values are changed to its maximum element, which approach updates dp[i]?",
        objective: "Formulate optimal lookback steps.",
        hint: "For each position i, we look back up to K elements, find the maximum in that window, and maximize: max_val * len + dp[i - len].",
        xpReward: 55,
        pointsReward: 35,
        data: {
          options: [
            "dp[i] = dp[i-1] * K",
            "Loop lookback length j from 1 to K: dp[i] = max(dp[i], dp[i-j] + max_in_window * j)",
            "dp[i] = max(dp[i-K], dp[i])",
            "Run a greedy priority queue"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 11,
    name: "Bitmask Dynamic Programming",
    topic: "State Compression and Subsets",
    bossName: "Bitmask General",
    bossTitle: "State Compression Marshal",
    bossAvatar: "🎭",
    bossMaxHP: 160,
    bossDialogueGreeting: "I represent dense configurations using binary numbers! Compress high-dimensional configurations into single integers or run out of memory space!",
    bossDialogueDefeated: "Bit states aligned. Complex subsets compressed perfectly.",
    rewardAchievementId: "dp_lvl11",
    rewardAchievementName: "Bitmask Overlord",
    problems: [
      {
        id: "tsp_state_formulation",
        title: "TSP Bitmask State Parameters",
        type: "bitmask",
        description: "In the Traveling Salesperson Problem (TSP) solved via dynamic programming, what parameters define the DP table state?",
        objective: "Identify TSP state compression indices.",
        hint: "We need to know which cities have been visited (stored as a binary bitmask) and which city we are currently at.",
        xpReward: 55,
        pointsReward: 35,
        data: {
          options: [
            "dp[visited_mask] - just the visited set of cities",
            "dp[visited_mask][current_city] - a bitmask representing visited cities, and the index of the current city",
            "dp[current_city][next_city]",
            "dp[total_distance][cities_count]"
          ],
          correctIdx: 1
        }
      },
      {
        id: "bitmask_assignment",
        title: "Assigning N Tasks to N People",
        type: "bitmask",
        description: "To assign N tasks to N people with optimal compatibility, what is the size of the bitmask dimension, and what does it represent?",
        objective: "Trace state dimensions of binary task masks.",
        hint: "With N tasks, we can represent which tasks have been assigned with N binary bits (0 to 2^N - 1).",
        xpReward: 60,
        pointsReward: 35,
        data: {
          options: [
            "Size N, representing the task count",
            "Size 2^N, where each bit in the integer represent whether a specific task has been assigned or not",
            "Size N^2, representing all pairs",
            "Size N * log N"
          ],
          correctIdx: 1
        }
      },
      {
        id: "minimax_can_i_win",
        title: "Minimax Game State (Can I Win)",
        type: "bitmask",
        description: "When implementing a minimax game state (like 'Can I Win' where players pick numbers from 1 to Max), why is a bitmask used as the memoization key?",
        objective: "Explain game state compression via bits.",
        hint: "Since numbers can only be chosen once, a bitmask represents the exact subset of pool integers that are still available.",
        xpReward: 65,
        pointsReward: 35,
        data: {
          options: [
            "To encrypt player turns securely",
            "To represent the exact subset of integers already chosen from the pool in a compact form",
            "To speed up addition operations",
            "To check if the sum is even"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 12,
    name: "Tree Dynamic Programming",
    topic: "Recursion on Hierarchical Nodes",
    bossName: "Arbor Warden",
    bossTitle: "Core Tree Architect",
    bossAvatar: "🌳",
    bossMaxHP: 165,
    bossDialogueGreeting: "In my domain, structures branch recursively! Compute parent states from child vertices, or watch your tree collapse!",
    bossDialogueDefeated: "Tree metrics processed. All nodes balanced.",
    rewardAchievementId: "dp_lvl12",
    rewardAchievementName: "Arbor Scholar",
    problems: [
      {
        id: "tree_max_path_sum",
        title: "Binary Tree Maximum Path Sum",
        type: "tree",
        description: "In 'Binary Tree Maximum Path Sum', what value does each recursive step return to its parent node?",
        objective: "Identify correct tree step return values.",
        hint: "To form a path, a parent can only continue through one of its children. Return node.val + max(left_gain, right_gain).",
        xpReward: 55,
        pointsReward: 35,
        data: {
          options: [
            "The sum of the entire subtree",
            "The maximum path sum that can go up to the parent: node.val plus the maximum of its left or right child's path gain",
            "The maximum path sum contained entirely within the subtree",
            "The height of the current node"
          ],
          correctIdx: 1
        }
      },
      {
        id: "tree_diameter",
        title: "Tree Diameter Relation",
        type: "tree",
        description: "How is the diameter of a tree (longest path between any two nodes) calculated during the recursive height calculation of nodes?",
        objective: "Deduce tree diameter metrics from heights.",
        hint: "The longest path passing through node i is: left_height + right_height. We track the maximum across all nodes.",
        xpReward: 60,
        pointsReward: 35,
        data: {
          options: [
            "Diameter = Total Nodes - 1",
            "At each node, we calculate: LeftHeight + RightHeight, and update a global maximum diameter tracker",
            "Diameter is simply the height of the root multiplied by 2",
            "It requires running Floyd-Warshall globally"
          ],
          correctIdx: 1
        }
      },
      {
        id: "tree_bst_catalan",
        title: "Unique Binary Search Trees II",
        type: "tree",
        description: "Which famous mathematical sequence defines the total number of unique Binary Search Trees (BSTs) that can be formed using N unique keys?",
        objective: "Identify Catalan number allocations.",
        hint: "The formula is C_n = (1/(n+1)) * (2n choose n).",
        xpReward: 65,
        pointsReward: 35,
        data: {
          options: ["Fibonacci Numbers", "Catalan Numbers", "Ackermann Numbers", "Lucas Numbers"],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 13,
    name: "Digit Dynamic Programming",
    topic: "Counting Numbers under N",
    bossName: "Count Automaton",
    bossTitle: "Digit Scanner Unit",
    bossAvatar: "🔢",
    bossMaxHP: 170,
    bossDialogueGreeting: "Numbers have strict properties in their digits! Count elements matching specific digits below 10^18 in milliseconds, or get timed out of bounds!",
    bossDialogueDefeated: "Digit enumeration optimal. Zero timeout violations.",
    rewardAchievementId: "dp_lvl13",
    rewardAchievementName: "Digit Analyst",
    problems: [
      {
        id: "digit_dp_tight_flag",
        title: "The 'Tight' Flag Parameter",
        type: "digit",
        description: "In Digit DP, what does the boolean 'tight' parameter actively regulate during digit placement?",
        objective: "Explain digit-tight limiting conditions.",
        hint: "If tight is true, the current digit cannot exceed the corresponding digit of the upper-bound number N. If false, we can place any digit from 0 to 9.",
        xpReward: 60,
        pointsReward: 35,
        data: {
          options: [
            "It controls memory heap allocations",
            "It indicates if the current prefix is strictly bounded by/equal to the original upper-bound number N",
            "It checks if the number is prime",
            "It compresses digits into bits"
          ],
          correctIdx: 1
        }
      },
      {
        id: "digit_dp_parameters",
        title: "Digit DP State Parameters",
        type: "digit",
        description: "To count numbers up to N satisfying a condition, which parameters are typically used to represent the DP state?",
        objective: "Select common digit state variables.",
        hint: "We need the current digit index, the 'tight' limit flag, and parameters representing the condition (e.g., preceding digit, or active sum).",
        xpReward: 65,
        pointsReward: 35,
        data: {
          options: [
            "dp[value]",
            "dp[index][tight][condition_state] - index of the digit, tight constraint flag, and dynamic trackers for the search properties",
            "dp[index][N]",
            "dp[sum][digit_count]"
          ],
          correctIdx: 1
        }
      },
      {
        id: "digit_dp_consecutive_ones",
        title: "Integers without Consecutive Ones",
        type: "digit",
        description: "When using Digit DP to find integers up to N with no consecutive '1' digits in binary, what state information must be passed to check this restriction?",
        objective: "Track preceding digit restrictions.",
        hint: "To avoid consecutive ones, we must know if the immediately preceding digit placed was a '1'.",
        xpReward: 70,
        pointsReward: 35,
        data: {
          options: [
            "The sum of all bits placed so far",
            "A flag indicating whether the immediately preceding digit placed was a '1'",
            "The total count of zero bits",
            "The index of the first digit"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 14,
    name: "Interval Dynamic Programming",
    topic: "DP on Subsegments and Segments",
    bossName: "Bubble Splicer",
    bossTitle: "Interval Segment Evaluator",
    bossAvatar: "🎈",
    bossMaxHP: 180,
    bossDialogueGreeting: "We calculate metrics across subsegments and merge them incrementally! Master interval limits or get trapped in quadratic recursion!",
    bossDialogueDefeated: "Interval matrices merged. Segment boundaries optimized.",
    rewardAchievementId: "dp_lvl14",
    rewardAchievementName: "Segment Coordinator",
    problems: [
      {
        id: "mcm_base_recurrence",
        title: "Matrix Chain Multiplication DP",
        type: "interval",
        description: "What is the standard dynamic programming equation to find the minimum multiplication operations to multiply a chain of matrices from index i to j?",
        objective: "Select Matrix Chain Multiplication recurrence.",
        hint: "We split the chain at all possible indexes k between i and j, sum their costs, and add the cost to multiply the two resulting matrices.",
        xpReward: 60,
        pointsReward: 40,
        data: {
          options: [
            "dp[i][j] = dp[i][j-1] * cost",
            "dp[i][j] = min_{i<=k<j} (dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j])",
            "dp[i][j] = dp[i-1][j-1] + 1",
            "dp[i][j] = max(dp[i][k] * dp[k][j])"
          ],
          correctIdx: 1
        }
      },
      {
        id: "burst_balloons_direction",
        title: "Burst Balloons Reverse Thinking",
        type: "interval",
        description: "In the 'Burst Balloons' problem, why is standard interval DP calculated by choosing the LAST balloon to burst in an interval, rather than the first?",
        objective: "Explain backward interval dependency splits.",
        hint: "If you burst a balloon first, it creates a dependency between its left and right neighbors, breaking subproblem independence. Choosing the last balloon to burst preserves boundary independence.",
        xpReward: 70,
        pointsReward: 40,
        data: {
          options: [
            "To speed up addition calculations",
            "Choosing the last balloon burst ensures subproblems [i to k-1] and [k+1 to j] remain completely independent, separated by the boundary of k",
            "Because bursting balloons is solved in linear time",
            "Because balloon values are always even"
          ],
          correctIdx: 1
        }
      },
      {
        id: "merge_stones_interval",
        title: "Minimum Cost to Merge Stones",
        type: "interval",
        description: "When merging N piles of stones into 1 pile with cost equal to sum of piles merged, what complexity class does the optimal Interval DP solution belong to?",
        objective: "Identify merge stones performance bounds.",
        hint: "Solving merging segments across size ranges utilizes three nested loops: loop over length, loop over start index i, and loop over split points k.",
        xpReward: 75,
        pointsReward: 40,
        data: {
          options: ["O(N log N) time", "O(N^3) time", "O(2^N) time", "O(N) linear"],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 15,
    name: "Advanced Dynamic Programming",
    topic: "State Machines and Optimizations",
    bossName: "Supreme Scribe of DP",
    bossTitle: "Grandmaster Scribe of DP Dimension",
    bossAvatar: "🧿",
    bossMaxHP: 200,
    bossDialogueGreeting: "You have traversed our entire dimension of subproblems. Now, face my complete database optimization array! Solve my final state-machine and egg-drop paradoxes, or get wiped!",
    bossDialogueDefeated: "DP Dimension fully calibrated! You are the ultimate dynamic programming Grandmaster!",
    rewardAchievementId: "dp_lvl15",
    rewardAchievementName: "Lord of Subproblems",
    problems: [
      {
        id: "stock_state_machine",
        title: "Stock with Cooldown State Machine",
        type: "advanced",
        description: "In 'Best Time to Buy and Sell Stock with Cooldown', which three states are tracked to model the state transition system accurately?",
        objective: "Identify dynamic state-machine parameters.",
        hint: "At any day, you could be: actively holding a stock, not holding a stock (and free to buy), or in a cooldown rest state.",
        xpReward: 65,
        pointsReward: 40,
        data: {
          options: [
            "Buy, Sell, Hold",
            "Hold (has stock), Sold (just sold, in cooldown), Reset (no stock, can buy)",
            "Prime, Odd, Even",
            "Binary, Decimal, Hex"
          ],
          correctIdx: 1
        }
      },
      {
        id: "convex_hull_trick_concept",
        title: "Convex Hull Optimization Concept",
        type: "advanced",
        description: "What does the 'Convex Hull Trick' optimization achieve for certain 1D DP transitions of type dp[i] = min_{j<i} (dp[j] + slope[j]*x[i])?",
        objective: "Identify Convex Hull optimization bounds.",
        hint: "By maintaining a set of linear equations representing lines, it reduces lookback search from O(N) to O(1) or O(log N) using envelopes.",
        xpReward: 75,
        pointsReward: 40,
        data: {
          options: [
            "It sorts weights in descending order",
            "It reduces the state transition scanning cost from O(N) down to O(1) or O(log N) by treating terms as lines on a plane",
            "It replaces DP with greedy sorting",
            "It runs DP on multi-dimensional hypercubes"
          ],
          correctIdx: 1
        }
      },
      {
        id: "super_egg_drop",
        title: "Super Egg Drop Optimization",
        type: "advanced",
        description: "In the famous Super Egg Drop problem with K eggs and N floors, what is the optimal DP transition equation, and what mathematical function solves the minimax strategy?",
        objective: "Formulate minimax floor checks.",
        hint: "At floor x, either the egg breaks (search below x with K-1 eggs) or survives (search above x with K eggs). Take the maximum of these worst-case directions, and minimize across all x.",
        xpReward: 85,
        pointsReward: 40,
        data: {
          options: [
            "dp[k][n] = dp[k-1][n-1] * dp[k][n]",
            "dp[k][n] = 1 + min_{1<=x<=n} (max(dp[k-1][x-1], dp[k][n-x]))",
            "dp[k][n] = dp[k-1][n-1] + dp[k-1][n]",
            "dp[k][n] = n / k"
          ],
          correctIdx: 1
        }
      }
    ]
  }
];

export default function DPDimensionQuest({ profile, onUpdateProfile, onBackToMenu, onCompleteSector }: DPDimensionQuestProps) {
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

  // Selected Option
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
    setSelectedIdx(null);
    setConsoleLogs([
      `[DP DIMENSION] Sector portal accessed: Level ${lvl.id} - ${lvl.name}`, 
      `[MEMOIZATION MATRIX] Guardian loaded: ${lvl.bossName} - ${lvl.bossTitle}`
    ]);
  }, [activeLevelIdx]);

  // Sync Problem selection
  useEffect(() => {
    const prob = selectedLevel.problems[activeProblemIdx];
    if (prob) {
      setShowHint(false);
      setSelectedIdx(null);
      setConsoleLogs(prev => [
        ...prev, 
        `[LOG] Loading subproblem state: ${prob.title}. Category: ${prob.type.toUpperCase()}`
      ]);
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
      setConsoleLogs(prev => [...prev, "⚠️ Cache register undefined! Specify state transition index."]);
      playSound('error');
      return;
    }

    let success = false;
    let feedback = '';

    if (selectedIdx === prob.data.correctIdx) {
      success = true;
      feedback = `✅ Subproblem memoized correctly: ${prob.data.options[selectedIdx]}`;
    } else {
      feedback = `❌ State recursion conflict. Overlapping evaluation failed!`;
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
          setConsoleLogs(prevLogs => [...prevLogs, `🏆 GUARDIAN DEFEATED! Level ${selectedLevel.id} cleared.`]);
          handleUnlockReward();
        } else {
          setCurrentDialogue(`Arrgh! Your cache solved that subproblem perfectly. Take -${damage} DMG!`);
        }
        return nextHp;
      });

      if (!solvedProblemIds.includes(prob.id)) {
        setSolvedProblemIds(prev => [...prev, prob.id]);
      }
    } else {
      playSound('error');
      setCurrentDialogue("Hahaha! Exponential recursion runs wild. Your lookup cache has failed!");
    }
  };

  const handleUnlockReward = () => {
    const currentAchievements = profile.achievements || [];
    const hasAchievement = currentAchievements.some(ach => ach.id === selectedLevel.rewardAchievementId);

    if (!hasAchievement) {
      const updatedAchievements = currentAchievements.map(ach => {
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
              description: `Conquered Level ${selectedLevel.id} of the DP Dimension by proving dynamic programming recursion.`,
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

    if (totalLvlSolved === 15) {
      setConsoleLogs(prev => [...prev, "🚨 SECTOR CONQUEST SECURED! DP DIMENSION IS COMPLETELY CALIBRATED!"]);
      setTimeout(() => {
        onCompleteSector();
      }, 3000);
    }
  };

  const prob = selectedLevel.problems[activeProblemIdx];

  return (
    <div className="bg-[#040510] border border-orange-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-mono text-slate-200 w-full">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 shadow-[0_0_20px_rgba(249,115,22,0.8)]" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-orange-950/40">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-400 animate-pulse" />
            <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-400">
              DP DIMENSION: OPTIMAL SUBPROBLEMS
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
            15 Levels • 55 Recursive Tasks • Memoization, Tabulation & State-Machine Optimal Paths
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl text-xs flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>CREDITS: <b className="text-orange-400">{profile.points}</b></span>
          </div>

          <button
            onClick={() => { playSound('powerdown'); onBackToMenu(); }}
            className="px-4 py-1.5 bg-slate-950 border border-orange-900/40 hover:border-orange-500/80 text-orange-300 text-xs font-bold rounded-xl transition-all"
          >
            ← LEAVE DIMENSION
          </button>
        </div>
      </div>

      {/* LEVEL SELECTION RAIL */}
      <div className="flex flex-wrap gap-1.5 mb-6 max-h-[140px] overflow-y-auto p-1 border border-slate-900 rounded-xl bg-slate-950/40">
        {QUEST_LEVELS.map((lvl, index) => {
          const isSelected = activeLevelIdx === index;
          const isCleared = lvl.problems.every(p => solvedProblemIds.includes(p.id));
          return (
            <button
              key={lvl.id}
              onClick={() => handleLevelSelect(index)}
              className={`p-1.5 px-3 rounded-lg border text-center transition-all text-xs font-bold ${
                isSelected 
                  ? 'bg-orange-950/30 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)] text-orange-200' 
                  : isCleared
                  ? 'bg-orange-950/10 border-orange-500/20 text-orange-300 hover:bg-orange-950/20'
                  : 'bg-slate-950/30 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300'
              }`}
            >
              <span>L{lvl.id} - {lvl.name.split(' ')[0]}</span>
              {isCleared && <span className="ml-1 text-orange-400">✓</span>}
            </button>
          );
        })}
      </div>

      {/* MAIN GAMEPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PROBLEM DESCRIPTOR */}
          <div className="bg-[#030308] border border-orange-950/80 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="px-2 py-0.5 bg-orange-950 text-orange-400 rounded text-[9px] uppercase font-bold tracking-widest">
                Subproblem {activeProblemIdx + 1} of {selectedLevel.problems.length}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />
                REWARD: +{prob?.xpReward} XP / +{prob?.pointsReward} Credits
              </span>
            </div>

            <h3 className="text-base font-black text-white">{prob?.title}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{prob?.description}</p>
            
            <div className="mt-4 p-3 bg-orange-950/10 border border-orange-950 rounded-xl flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-orange-300 uppercase font-black block">Memoization Target</span>
                <p className="text-xs text-orange-200 font-bold">{prob?.objective}</p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE STAGE */}
          <div className="bg-[#020205] border border-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] relative">
            <span className="absolute top-3 left-4 text-[9px] text-slate-500 uppercase font-bold tracking-widest">
              Live State Register Emulator
            </span>

            {/* INTERACTIVE DISPLAY */}
            <div className="w-full flex flex-col items-center justify-center gap-4 py-4">
              
              {/* VISUAL AID */}
              <div className="flex flex-col items-center mb-4 p-4 bg-slate-950/80 border border-slate-900 rounded-xl w-full max-w-sm">
                <span className="text-[8px] text-slate-500 uppercase font-bold mb-2">DYNAMIC CACHE BLOCK STATE</span>
                <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono">
                  {prob?.data.visualArray ? (
                    prob.data.visualArray.map((v, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className="text-[7px] text-slate-600 mb-0.5">[{i}]</span>
                        <div className="w-8 h-8 rounded border border-orange-500/30 bg-orange-950/20 flex items-center justify-center text-xs font-bold text-orange-400">
                          {v}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center text-[10px] text-slate-400">i-2</div>
                      <div className="text-slate-600">→</div>
                      <div className="w-8 h-8 rounded-full border border-orange-500/50 bg-orange-950/20 flex items-center justify-center text-[10px] text-orange-300 font-bold">i-1</div>
                      <div className="text-orange-600 animate-pulse">→</div>
                      <div className="w-10 h-10 rounded-full border-2 border-orange-500 bg-orange-950 flex items-center justify-center text-xs text-orange-100 font-black shadow-[0_0_10px_rgba(249,115,22,0.4)]">i</div>
                    </div>
                  )}
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
                        ? 'bg-orange-950/40 border-orange-500 text-orange-200 shadow-[0_0_12px_rgba(249,115,22,0.3)]'
                        : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedIdx === idx ? 'border-orange-400 bg-orange-400 text-[#040510]' : 'border-slate-800'
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
              <span>{showHint ? 'HIDE COMPACT HINT' : 'REVEAL COMPACT HINT'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleVerifyProblem}
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-slate-900 font-black text-xs rounded-xl flex items-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] active:scale-95"
              >
                <Activity className="w-4 h-4" />
                <span>WRITE TO REGISTER</span>
              </button>

              {activeProblemIdx < selectedLevel.problems.length - 1 && solvedProblemIds.includes(prob?.id) && (
                <button
                  onClick={handleNextProblem}
                  className="px-5 py-2 bg-slate-950 border border-orange-500/30 text-orange-300 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:border-orange-500 hover:text-orange-200 transition-all"
                >
                  <span>NEXT PORTION</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* FLOATING HINT BOX */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 bg-[#090b1c] border border-amber-500/30 rounded-2xl flex gap-3 text-xs text-slate-300"
              >
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px] block mb-1">RECURSION ARCHIVE DECODING</span>
                  <p className="leading-relaxed">{prob?.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN (BOSS HUB) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* BOSS CARD */}
          <div className="bg-[#03030c] border border-orange-500/20 rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-slate-950 border border-orange-500/30 flex items-center justify-center text-3xl mb-3 relative">
              {selectedLevel.bossAvatar}
              {bossDamageAnim !== null && (
                <motion.div
                  initial={{ opacity: 1, scale: 0.5, y: 0 }}
                  animate={{ opacity: 0, scale: 1.5, y: -30 }}
                  className="absolute inset-0 flex items-center justify-center text-lg font-black text-red-500"
                >
                  -{bossDamageAnim} HP
                </motion.div>
              )}
            </div>

            <div className="text-xs text-orange-400 uppercase font-bold tracking-widest">{selectedLevel.bossTitle}</div>
            <h4 className="text-base font-black text-white mt-1">{selectedLevel.bossName}</h4>

            {/* HP BAR */}
            <div className="w-full mt-4 space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span>Memory Integ</span>
                <span className="text-orange-400">{bossHP} / {selectedLevel.bossMaxHP} HP</span>
              </div>
              <div className="w-full h-2 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                  animate={{ width: `${(bossHP / selectedLevel.bossMaxHP) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* DIALOGUE */}
            <div className="mt-4 p-3.5 bg-slate-950/80 border border-slate-900 rounded-xl text-xs text-slate-300 leading-relaxed italic relative min-h-[80px] w-full text-left">
              <span className="text-[8px] font-mono text-slate-500 uppercase block mb-1">Guardian dialogue</span>
              "{currentDialogue}"
            </div>
          </div>

          {/* TERMINAL CONSOLE LOGS */}
          <div className="bg-[#010208] border border-slate-900 rounded-2xl p-4 font-mono text-[10px] space-y-2 h-[220px] overflow-y-auto flex flex-col justify-end">
            <div className="text-slate-500 uppercase tracking-widest text-[8px] font-black border-b border-slate-900/50 pb-1.5 mb-1 flex items-center justify-between">
              <span>MEMOIZATION LOGS</span>
              <span className="text-orange-500 animate-pulse">● LIVE</span>
            </div>
            <div className="flex-1 space-y-1.5 overflow-y-auto">
              {consoleLogs.map((log, i) => (
                <div key={i} className="leading-normal">
                  <span className="text-slate-600 mr-1.5">&gt;&gt;</span>
                  <span className={log.startsWith('✅') ? 'text-emerald-400 font-bold' : log.startsWith('❌') ? 'text-red-400 font-bold font-mono' : log.startsWith('⚠️') ? 'text-amber-400' : 'text-slate-400'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* NEW ACHIEVEMENT POPUP */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          >
            <div className="bg-[#05081b] border-2 border-orange-500 p-6 rounded-3xl max-w-sm w-full text-center relative shadow-[0_0_50px_rgba(249,115,22,0.4)]">
              <div className="w-14 h-14 rounded-full bg-orange-950 border border-orange-500 flex items-center justify-center text-3xl mx-auto mb-3">
                🏆
              </div>
              <h3 className="text-lg font-black text-white tracking-wide">ACHIEVEMENT UNLOCKED</h3>
              <p className="text-orange-400 font-bold text-sm mt-1 uppercase tracking-widest">{newAchievement}</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                You have solved a full segment level of the dynamic programming matrix. Sector data calibrated!
              </p>
              <button
                onClick={() => setNewAchievement(null)}
                className="mt-5 w-full py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-slate-900 text-xs font-bold rounded-xl transition-all"
              >
                PROCEED WITH CREDITS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
