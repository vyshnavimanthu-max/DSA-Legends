import React, { useState, useEffect } from 'react';
import { 
  Shield, Award, Sparkles, HelpCircle, AlertCircle, 
  ChevronRight, Play, CheckCircle2, RotateCcw, Lightbulb, 
  Cpu, Flame, Lock, Unlock, Trophy, Send, RefreshCw, X, ArrowRight,
  Sliders, ArrowLeft, ArrowRightLeft, Layers, Columns, BarChart3, Binary
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileState } from '../types';
import PremiumAudioManager from '../lib/audioManager';

interface ArrayKingdomQuestProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
  onCompleteSector: () => void;
}

export interface QuestProblem {
  id: string;
  title: string;
  type: 'basic_arr' | 'search_idx' | 'sorting' | 'binary' | 'two_pointers' | 'sliding_window' | 'prefix_sum' | 'kadane' | 'merge_intervals' | 'matrix_op' | 'frequency_count';
  description: string;
  objective: string;
  hint: string;
  xpReward: number;
  pointsReward: number;
  data: any; // Setup data (e.g. array, targets, answers)
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
    name: "Linear Foundations",
    topic: "Array Mechanics & Bounds",
    bossName: "O(N) Index-Sentry",
    bossTitle: "Sequential Segment Defender",
    bossAvatar: "📡",
    bossMaxHP: 100,
    bossDialogueGreeting: "System indexes show raw sequential traversal! Can you resolve contiguous boundary offsets or will your thread overflow?",
    bossDialogueDefeated: "Boundaries checked. Linear registers are consecutive and safe.",
    rewardAchievementId: "arr_lvl1",
    rewardAchievementName: "Linear Pathfinder",
    problems: [
      {
        id: "arr_access",
        title: "Access by Index",
        type: "basic_arr",
        description: "To verify physical memory location bounds, retrieve the element at offset index 3 of the hardware register. Remember, arrays use 0-based indexing.",
        objective: "Click the memory block at exactly index 3.",
        hint: "Count starting from 0: Index 0 is 102, Index 1 is 504, etc.",
        xpReward: 30,
        pointsReward: 20,
        data: { array: [102, 504, 768, 920, 310, 415], targetIndex: 3 }
      },
      {
        id: "arr_bounds",
        title: "Boundary Length Verifier",
        type: "basic_arr",
        description: "Memory allocations fail when index queries are out of bounds. Given the physical buffer array, what is its physical length (total slots) and what is the maximum valid index?",
        objective: "Adjust the values to match the array length and maximum valid index.",
        hint: "Length is the total element count. Max index is length - 1.",
        xpReward: 35,
        pointsReward: 20,
        data: { array: [42, 99, 12, 56, 88, 73, 11], expectedLength: 7, expectedMaxIndex: 6 }
      },
      {
        id: "arr_linear_scan",
        title: "Linear Searching Scan",
        type: "search_idx",
        description: "The mainframe is querying for the security key 88. Perform a sequential scan to find the exact offset index of 88, or determine if it is missing.",
        objective: "Select the index where value 88 resides.",
        hint: "Perform a linear scan from left to right. Select the cell holding 88.",
        xpReward: 40,
        pointsReward: 20,
        data: { array: [19, 44, 102, 33, 88, 12, 97], targetValue: 88, expectedIndex: 4 }
      }
    ]
  },
  {
    id: 2,
    name: "Modifying Memory Nodes",
    topic: "Insertion, Deletion & Extrema",
    bossName: "Dynamic Allocator 2.0",
    bossTitle: "Heap Defragmentation Overlord",
    bossAvatar: "🧬",
    bossMaxHP: 110,
    bossDialogueGreeting: "Array sizes are rigid! Shifting elements consumes high processor cycles. Try to modify my registers without corrupting them!",
    bossDialogueDefeated: "Allocation successful. Elements shifted and defragmented without leakage.",
    rewardAchievementId: "arr_lvl2",
    rewardAchievementName: "Memory Structurer",
    problems: [
      {
        id: "arr_insert",
        title: "Hardware Index Insertion",
        type: "basic_arr",
        description: "Insert a new block containing value 99 at index 2. To do this, all subsequent elements must be shifted to the right to prevent overlap.",
        objective: "Click the insertion command to properly slide and place the 99 element.",
        hint: "Elements at index 2, 3, and 4 must move to 3, 4, and 5.",
        xpReward: 40,
        pointsReward: 25,
        data: { array: [10, 20, 30, 40, 50], insertVal: 99, insertIdx: 2, expectedArray: [10, 20, 99, 30, 40, 50] }
      },
      {
        id: "arr_delete",
        title: "Element Deletion Shift",
        type: "basic_arr",
        description: "Delete the element at index 1 (value 400). Shifting remaining elements to the left is necessary to fill the empty contiguous cell.",
        objective: "Select the delete operation to collapse the blank space.",
        hint: "Index 2 (value 700) shifts to index 1, index 3 to index 2, and so on.",
        xpReward: 45,
        pointsReward: 25,
        data: { array: [100, 400, 700, 900, 1200], deleteIdx: 1, expectedArray: [100, 700, 900, 1200] }
      },
      {
        id: "arr_extrema",
        title: "Min/Max Boundary Scan",
        type: "search_idx",
        description: "Identify the absolute boundaries of the dataset by locating the exact indices of both the minimum and maximum values.",
        objective: "Select the index of the Minimum value, and the index of the Maximum value.",
        hint: "Find the smallest (5) and largest (99) numbers in the array.",
        xpReward: 50,
        pointsReward: 25,
        data: { array: [45, 99, 12, 5, 87, 33, 62], expectedMinIdx: 3, expectedMaxIdx: 1 }
      }
    ]
  },
  {
    id: 3,
    name: "Sorting Core Segments",
    topic: "Linear Sorting Verifications",
    bossName: "Quadratic Comparator",
    bossTitle: "Bubble-Sort Sentinel",
    bossAvatar: "🧪",
    bossMaxHP: 120,
    bossDialogueGreeting: "My comparing operations scale quadratically! Can you verify if your dataset indices are sorted or do you require O(N^2) cycles?",
    bossDialogueDefeated: "Comparator bypassed. Sub-linear check validated.",
    rewardAchievementId: "arr_lvl3",
    rewardAchievementName: "De-cluttered Sorter",
    problems: [
      {
        id: "sort_is_sorted",
        title: "Ascending Sort Verification",
        type: "sorting",
        description: "Determine if the given buffer stream is correctly sorted in ascending order. If there's an inversion (where an element is greater than its subsequent neighbor), point out the exact index of the offender.",
        objective: "Check if sorted, or click the index of the first value that violates the order.",
        hint: "Compare index i with index i+1. Find where the order breaks.",
        xpReward: 50,
        pointsReward: 30,
        data: { array: [12, 18, 25, 22, 35, 40], expectedSorted: false, firstViolatorIdx: 2 } // 25 > 22
      },
      {
        id: "sort_bubble_pass",
        title: "Bubble Sort Single Pass",
        type: "sorting",
        description: "In bubble sort, adjacent elements are swapped if they are in the wrong order. Perform a single bubble sort pass on the given array from index 0 to the end, and select the final state of the array.",
        objective: "Complete the swaps to simulate a single full pass of bubble sort.",
        hint: "Compare (5, 1) -> swap, then compare with next, bubble the largest value to the end.",
        xpReward: 55,
        pointsReward: 30,
        data: { array: [5, 1, 4, 2, 8], expectedAfterOnePass: [1, 4, 2, 5, 8] }
      },
      {
        id: "sort_select_min",
        title: "Selection Sort Strategy",
        type: "sorting",
        description: "Selection sort finds the minimum element from the unsorted part of the array and puts it at the beginning. In the array below, search for the minimum element starting from index 2 to index 5, and swap it with index 2.",
        objective: "Identify the minimum element between indices 2 and 5, then click swap.",
        hint: "The subarray from index 2 to 5 is [15, 99, 4, 88]. The minimum of these is 4 at index 4.",
        xpReward: 60,
        pointsReward: 30,
        data: { array: [1, 2, 15, 99, 4, 88], rangeStart: 2, minVal: 4, minIdx: 4, expectedAfterSwap: [1, 2, 4, 99, 15, 88] }
      }
    ]
  },
  {
    id: 4,
    name: "Binary Search Mastery",
    topic: "Asymptotic Logarithmic Queries",
    bossName: "Binary Sorcerer",
    bossTitle: "Master of O(log N) Space",
    bossAvatar: "🧙",
    bossMaxHP: 130,
    bossDialogueGreeting: "Looking one-by-one is foolish! I slice search spaces in half on every tick. Match my speed or get lost in my dimensions!",
    bossDialogueDefeated: "Half-space narrowed. Binary boundaries matched perfectly.",
    rewardAchievementId: "arr_lvl4",
    rewardAchievementName: "Logarithmic Mage",
    problems: [
      {
        id: "bin_midpoint",
        title: "Midpoint Calculator",
        type: "binary",
        description: "To perform binary search, calculate the precise middle index given search bounds `low` and `high` using: `mid = Math.floor((low + high) / 2)`. Adjust mid to the correct index for the bounds below.",
        objective: "Set the midpoint for Low = 0 and High = 6.",
        hint: "Formula: Math.floor((0 + 6) / 2) = 3.",
        xpReward: 50,
        pointsReward: 35,
        data: { array: [10, 20, 30, 40, 50, 60, 70], low: 0, high: 6, expectedMid: 3 }
      },
      {
        id: "bin_classic",
        title: "Classic Binary Search",
        type: "binary",
        description: "Find the value 60 in the sorted array. Move the low, high, and mid pointers step-by-step to isolate the target.",
        objective: "Adjust Low, High, and Mid pointers until Mid points to 60 (value at index 5).",
        hint: "Since 60 > 40 (mid), set Low to Mid + 1. Recalculate Mid.",
        xpReward: 60,
        pointsReward: 35,
        data: { array: [10, 20, 30, 40, 50, 60, 70], target: 60, expectedIndex: 5 }
      },
      {
        id: "bin_first_occ",
        title: "Find First Occurrence",
        type: "binary",
        description: "In a sorted array with duplicate entries, binary search can locate the first occurrence of a target. Locate the first index of 20.",
        objective: "Find the left-most index of 20 using binary criteria.",
        hint: "The array has 20 at index 1 and 2. The first occurrence is index 1.",
        xpReward: 65,
        pointsReward: 35,
        data: { array: [10, 20, 20, 20, 30, 40, 50], target: 20, expectedIndex: 1 }
      },
      {
        id: "bin_insert_pos",
        title: "Search Insertion Position",
        type: "binary",
        description: "Given a sorted array and a target value 35, return the index where it would be inserted if it were placed in order.",
        objective: "Select the index where 35 should be inserted in order.",
        hint: "35 is between 30 (index 2) and 40 (index 3), so it should be inserted at index 3.",
        xpReward: 70,
        pointsReward: 35,
        data: { array: [10, 20, 30, 40, 50], insertVal: 35, expectedIdx: 3 }
      }
    ]
  },
  {
    id: 5,
    name: "Two Pointers Technique",
    topic: "Linear Convergence & Swaps",
    bossName: "Twin-Thread Spectre",
    bossTitle: "Dual Index Concurrence Engine",
    bossAvatar: "♊",
    bossMaxHP: 140,
    bossDialogueGreeting: "Why traverse sequentially when you can meet in the middle? Synchronize two coordinates or get caught in infinite bounds!",
    bossDialogueDefeated: "Converged successfully. Pointers met in O(N) steps.",
    rewardAchievementId: "arr_lvl5",
    rewardAchievementName: "Concurrence Marshal",
    problems: [
      {
        id: "two_ptr_reverse",
        title: "In-place Array Reversal",
        type: "two_pointers",
        description: "Reverse the array in-place by swapping values at the Left and Right pointers, then incrementing Left and decrementing Right.",
        objective: "Perform swaps on matching Left/Right pointers until array is fully reversed.",
        hint: "Swap index 0 and 4, then move Left/Right pointers inward and swap index 1 and 3.",
        xpReward: 60,
        pointsReward: 40,
        data: { array: ["A", "B", "C", "D", "E"], expectedArray: ["E", "D", "C", "B", "A"] }
      },
      {
        id: "two_ptr_two_sum",
        title: "Sorted Two Sum (Pairs)",
        type: "two_pointers",
        description: "Find two numbers in a sorted array that sum up to target = 15. Adjust Left and Right pointers to point to those numbers.",
        objective: "Point Left and Right to two elements that add up to exactly 15.",
        hint: "If sum is too low, move Left rightward. If too high, move Right leftward.",
        xpReward: 65,
        pointsReward: 40,
        data: { array: [2, 5, 8, 10, 13, 17], target: 15, expectedLeftIdx: 0, expectedRightIdx: 4 } // 2 + 13 = 15
      },
      {
        id: "two_ptr_duplicates",
        title: "Remove Duplicates (O(1) Space)",
        type: "two_pointers",
        description: "Given a sorted array, write unique elements to the front using a write pointer and a read pointer. Find the number of unique elements.",
        objective: "Count the unique elements in the given sorted array.",
        hint: "Unique elements are [1, 2, 3, 4]. Total count is 4.",
        xpReward: 70,
        pointsReward: 40,
        data: { array: [1, 1, 2, 2, 3, 4, 4], expectedUniqueCount: 4 }
      },
      {
        id: "two_ptr_container",
        title: "Container With Most Water",
        type: "two_pointers",
        description: "Find the maximum volume of water two lines can contain. Area = Min(height[L], height[R]) * (R - L). Given line heights, calculate the area of the boundary pointers.",
        objective: "Set Left=0, Right=4. Calculate the area container size.",
        hint: "Left height is 1, Right height is 7. Width is 4 - 0 = 4. Area = Min(1, 7) * 4 = 4.",
        xpReward: 75,
        pointsReward: 40,
        data: { array: [1, 8, 6, 2, 7], left: 0, right: 4, expectedArea: 4 }
      }
    ]
  },
  {
    id: 6,
    name: "Sliding Window Mechanics",
    topic: "Subarray Range Accumulations",
    bossName: "Aperture Matrix",
    bossTitle: "Dynamic Window Scheduler",
    bossAvatar: "🔍",
    bossMaxHP: 150,
    bossDialogueGreeting: "My range views are sliding dynamically! Can you maintain the boundary invariants or will your window buffer overflow?",
    bossDialogueDefeated: "Window invariant locked. Memory footprint successfully contained.",
    rewardAchievementId: "arr_lvl6",
    rewardAchievementName: "Window Aperture Specialist",
    problems: [
      {
        id: "slide_max_k",
        title: "Maximum Sum Subarray (Size K)",
        type: "sliding_window",
        description: "Find the subarray of size K = 3 with the maximum sum of elements. Move the window across the array and identify the highest sum.",
        objective: "Select the index of the start of the window of size 3 with the max sum.",
        hint: "Sums: [2,1,5] is 8. [1,5,1] is 7. [5,1,3] is 9. [1,3,2] is 6. Highest is 9 at index 2.",
        xpReward: 70,
        pointsReward: 45,
        data: { array: [2, 1, 5, 1, 3, 2], k: 3, expectedStartIdx: 2, expectedMaxSum: 9 }
      },
      {
        id: "slide_smallest_sum",
        title: "Smallest Subarray for Target Sum",
        type: "sliding_window",
        description: "Find the length of the smallest contiguous subarray whose sum is greater than or equal to S = 7.",
        objective: "Identify the smallest window size that achieves a sum of at least 7.",
        hint: "Look at subarray [5, 2] at index 2 and 3. Its sum is 7, and its length is 2.",
        xpReward: 75,
        pointsReward: 45,
        data: { array: [2, 1, 5, 2, 3, 2], s: 7, expectedLen: 2 } // [5, 2] or [2, 5] is sum 7 (length 2)
      },
      {
        id: "slide_distinct",
        title: "Longest Unique Subarray",
        type: "sliding_window",
        description: "Find the length of the longest contiguous subarray with all distinct values. Use the sliding window to track non-repeating elements.",
        objective: "Enter the maximum length of unique elements.",
        hint: "In [1, 2, 2, 3, 4], the longest unique sub-segments are [1, 2] (length 2) and [2, 3, 4] (length 3).",
        xpReward: 80,
        pointsReward: 45,
        data: { array: [1, 2, 2, 3, 4, 1], expectedLen: 4 } // [2, 3, 4, 1] is length 4
      },
      {
        id: "slide_count_anagrams",
        title: "Sliding Window Invariant",
        type: "sliding_window",
        description: "For a window sliding from left to right, we update characters at the bounds. If window size is 3 and starts at [A, B, C] and slides to [B, C, B], what is the net character change?",
        objective: "Identify the removed and added characters when sliding index window.",
        hint: "We lose the first character 'A' and gain the new character 'B'.",
        xpReward: 85,
        pointsReward: 45,
        data: { initial: ["A", "B", "C"], final: ["B", "C", "B"], expectedRemoved: "A", expectedAdded: "B" }
      }
    ]
  },
  {
    id: 7,
    name: "Prefix Sums Operations",
    topic: "Range Query Accumulators",
    bossName: "Cumulative Sum Daemon",
    bossTitle: "Prefix Space Transformer",
    bossAvatar: "➕",
    bossMaxHP: 160,
    bossDialogueGreeting: "Performing sum queries in O(N) is an amateur mistake! Pre-compute my integrations or watch my throughput flatline!",
    bossDialogueDefeated: "Range sums pre-computed. All queries answered in O(1) complexity.",
    rewardAchievementId: "arr_lvl7",
    rewardAchievementName: "Prefix Integration Mage",
    problems: [
      {
        id: "prefix_build",
        title: "Prefix Sum Array Construction",
        type: "prefix_sum",
        description: "Construct the Prefix Sum array for `nums = [3, 1, 4, 2]`. Each element at index `i` of the prefix array is the sum of `nums[0]` through `nums[i]`.",
        objective: "Complete the prefix sum cells below.",
        hint: "P[0]=3. P[1]=3+1=4. P[2]=4+4=8. P[3]=8+2=10.",
        xpReward: 70,
        pointsReward: 50,
        data: { array: [3, 1, 4, 2], expectedPrefix: [3, 4, 8, 10] }
      },
      {
        id: "prefix_range",
        title: "O(1) Range Sum Query",
        type: "prefix_sum",
        description: "Using the prefix sum array P = [2, 5, 9, 14, 15] for nums = [2, 3, 4, 5, 1], compute the sum of nums from index 1 to 3 using: `Sum(i, j) = P[j] - P[i-1]`.",
        objective: "Enter the range sum for query index 1 to 3.",
        hint: "P[3] is 14, P[0] is 2. Range sum is 14 - 2 = 12.",
        xpReward: 80,
        pointsReward: 50,
        data: { array: [2, 3, 4, 5, 1], prefix: [2, 5, 9, 14, 15], i: 1, j: 3, expectedSum: 12 }
      },
      {
        id: "prefix_pivot",
        title: "Equilibrium Pivot Index",
        type: "prefix_sum",
        description: "The equilibrium index of an array is an index such that the sum of elements at lower indexes is equal to the sum of elements at higher indexes. Find the equilibrium index.",
        objective: "Identify the pivot equilibrium index.",
        hint: "For array [1, 7, 3, 6, 5, 6], index 3 (value 6) is pivot. Left sum = 1+7+3 = 11. Right sum = 5+6 = 11.",
        xpReward: 90,
        pointsReward: 50,
        data: { array: [1, 7, 3, 6, 5, 6], expectedPivot: 3 }
      }
    ]
  },
  {
    id: 8,
    name: "Kadane's Algorithm",
    topic: "Maximum Contiguous Subarrays",
    bossName: "Maximum Sub-Beast",
    bossTitle: "Dynamic Segment Maximizer",
    bossAvatar: "🌋",
    bossMaxHP: 170,
    bossDialogueGreeting: "My array registers contain negative values! Can you maintain the maximum local subproblem or will your dynamic sum crash into the negative abyss?",
    bossDialogueDefeated: "Maximum continuous subproblem resolved. Local optimization verified.",
    rewardAchievementId: "arr_lvl8",
    rewardAchievementName: "Kadane Commander",
    problems: [
      {
        id: "kadane_step",
        title: "Local Max Sum Iteration",
        type: "kadane",
        description: "Kadane's tracks `currentMax = Math.max(num, currentMax + num)`. Given `currentMax = 4` and next element `num = -2`, compute the new `currentMax`.",
        objective: "Calculate the updated currentMax value.",
        hint: "Math.max(-2, 4 + (-2)) = Math.max(-2, 2) = 2.",
        xpReward: 80,
        pointsReward: 55,
        data: { prevMax: 4, num: -2, expectedNextMax: 2 }
      },
      {
        id: "kadane_classic",
        title: "Maximum Subarray Sum",
        type: "kadane",
        description: "Identify the continuous subarray that yields the highest cumulative sum. Highlight the start and end indices of this maximum subarray.",
        objective: "Select the subarray bounds that maximize the sum.",
        hint: "Subarray [4, -1, 2, 1] gives the maximum sum of 6. This is from index 3 to 6.",
        xpReward: 90,
        pointsReward: 55,
        data: { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4], expectedStart: 3, expectedEnd: 6, expectedSum: 6 }
      },
      {
        id: "kadane_product",
        title: "Maximum Product Boundary",
        type: "kadane",
        description: "Unlike sum, multiplying two negative numbers results in a positive. For nums = [2, 3, -2, 4], find the maximum product of a contiguous subarray.",
        objective: "Enter the value of the maximum contiguous product.",
        hint: "The contiguous subarray [2, 3] gives product 2 * 3 = 6. Including -2 drops it to -12.",
        xpReward: 100,
        pointsReward: 55,
        data: { array: [2, 3, -2, 4], expectedProduct: 6 }
      }
    ]
  },
  {
    id: 9,
    name: "Merge Intervals & Overlaps",
    topic: "Range Consolidation",
    bossName: "Interval Collider",
    bossTitle: "Overlap Resolve Daemon",
    bossAvatar: "⚔️",
    bossMaxHP: 180,
    bossDialogueGreeting: "My scheduling ranges are colliding in temporal memory! Deconflict my overlaps or suffer standard instruction scheduling blocks!",
    bossDialogueDefeated: "Collisions cleared. All intervals merged sequentially.",
    rewardAchievementId: "arr_lvl9",
    rewardAchievementName: "De-conflicted Scheduler",
    problems: [
      {
        id: "int_overlap_check",
        title: "Overlap Check Condition",
        type: "merge_intervals",
        description: "Given two sorted intervals A = [s1, e1] and B = [s2, e2] (where s1 <= s2), they overlap if and only if s2 <= e1. Do the intervals [1, 4] and [3, 6] overlap?",
        objective: "Select True or False.",
        hint: "s2 is 3, e1 is 4. Since 3 <= 4, they overlap. The merged interval is [1, 6].",
        xpReward: 80,
        pointsReward: 60,
        data: { intA: [1, 4], intB: [3, 6], expectedOverlap: true }
      },
      {
        id: "int_merge_pair",
        title: "Merge Overlapping Intervals",
        type: "merge_intervals",
        description: "Merge the overlapping intervals in: [[1, 3], [2, 6], [8, 10]]. What are the resulting intervals?",
        objective: "Specify the resulting merged interval slots.",
        hint: "[1,3] and [2,6] overlap because 2 <= 3. Merging them gives [1,6]. [8,10] is separate.",
        xpReward: 90,
        pointsReward: 60,
        data: { intervals: [[1, 3], [2, 6], [8, 10]], expected: [[1, 6], [8, 10]] }
      },
      {
        id: "int_insert",
        title: "Insert New Interval",
        type: "merge_intervals",
        description: "Given non-overlapping intervals [[1, 3], [6, 9]], insert [2, 5] and merge any overlaps.",
        objective: "Determine the merged array of intervals.",
        hint: "[2,5] overlaps with [1,3] resulting in [1,5]. [6,9] is separate. So final is [[1, 5], [6, 9]].",
        xpReward: 100,
        pointsReward: 60,
        data: { intervals: [[1, 3], [6, 9]], newInterval: [2, 5], expected: [[1, 5], [6, 9]] }
      },
      {
        id: "int_meetings",
        title: "Meeting Room Allocator",
        type: "merge_intervals",
        description: "Find the minimum number of conference rooms required to hold all meetings given times: [[0, 30], [5, 10], [15, 20]].",
        objective: "Determine the min meeting rooms needed.",
        hint: "[0,30] overlaps with both other meetings, but [5,10] and [15,20] don't overlap with each other. Thus, 2 rooms suffice.",
        xpReward: 110,
        pointsReward: 60,
        data: { meetings: [[0, 30], [5, 10], [15, 20]], expectedRooms: 2 }
      }
    ]
  },
  {
    id: 10,
    name: "Matrices & Frequency Engine",
    topic: "2D Array Paths & Hashing Limits",
    bossName: "NullPointer Overlord",
    bossTitle: "The Kernel Core Threat",
    bossAvatar: "👾",
    bossMaxHP: 200,
    bossDialogueGreeting: "I have populated multi-dimensional grids and hash buckets! Debug my matrices and count the occurrences, or face absolute kernel panic!",
    bossDialogueDefeated: "Array Kingdom fully synchronized! Kernel panic resolved.",
    rewardAchievementId: "arr_lvl10",
    rewardAchievementName: "Kingdom Liberator",
    problems: [
      {
        id: "matrix_transpose",
        title: "Matrix Dimension Transpose",
        type: "matrix_op",
        description: "Transpose the 2x2 matrix: [[1, 2], [3, 4]] by swapping rows and columns (matrix[i][j] becomes matrix[j][i]).",
        objective: "Enter the elements of the transposed matrix.",
        hint: "The transposed matrix is [[1, 3], [2, 4]].",
        xpReward: 100,
        pointsReward: 70,
        data: { matrix: [[1, 2], [3, 4]], expected: [[1, 3], [2, 4]] }
      },
      {
        id: "matrix_rotate",
        title: "Rotate Matrix 90° Clockwise",
        type: "matrix_op",
        description: "Rotating [[1, 2], [3, 4]] 90 degrees clockwise yields what matrix layout?",
        objective: "Enter the rotated matrix components.",
        hint: "The rows of the original become columns in reverse order: [[3, 1], [4, 2]].",
        xpReward: 110,
        pointsReward: 70,
        data: { matrix: [[1, 2], [3, 4]], expected: [[3, 1], [4, 2]] }
      },
      {
        id: "matrix_spiral",
        title: "Spiral Matrix Traversal Path",
        type: "matrix_op",
        description: "Traverse a 2x2 matrix [[1, 2], [3, 4]] in spiral order starting from top-left clockwise.",
        objective: "Select the correct traversal path sequence.",
        hint: "Go right, then down, then left: [1, 2, 4, 3].",
        xpReward: 120,
        pointsReward: 70,
        data: { matrix: [[1, 2], [3, 4]], expectedPath: [1, 2, 4, 3] }
      },
      {
        id: "freq_unique",
        title: "Frequency Counting Unique",
        type: "frequency_count",
        description: "Determine if all elements in nums = [1, 2, 2, 3, 3, 3] have a unique number of occurrences.",
        objective: "Select True or False.",
        hint: "1 occurs once, 2 occurs twice, 3 occurs three times. Occurrence counts [1, 2, 3] are all unique.",
        xpReward: 130,
        pointsReward: 70,
        data: { array: [1, 2, 2, 3, 3, 3], expectedUnique: true }
      }
    ]
  }
];

export default function ArrayKingdomQuest({ profile, onUpdateProfile, onBackToMenu, onCompleteSector }: ArrayKingdomQuestProps) {
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
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [inputLength, setInputLength] = useState<number>(0);
  const [inputMaxIdx, setInputMaxIdx] = useState<number>(0);
  const [selectedMinIdx, setSelectedMinIdx] = useState<number | null>(null);
  const [selectedMaxIdx, setSelectedMaxIdx] = useState<number | null>(null);
  
  // Sorting state simulation
  const [currentSortingArr, setCurrentSortingArr] = useState<number[]>([]);
  
  // Binary search state
  const [binLow, setBinLow] = useState<number>(0);
  const [binHigh, setBinHigh] = useState<number>(0);
  const [binMid, setBinMid] = useState<number>(0);

  // Two pointer state
  const [leftPtr, setLeftPtr] = useState<number>(0);
  const [rightPtr, setRightPtr] = useState<number>(0);
  const [twoPtrArr, setTwoPtrArr] = useState<any[]>([]);

  // Sliding window state
  const [windowStart, setWindowStart] = useState<number>(0);
  const [windowInputVal, setWindowInputVal] = useState<number>(0);

  // Prefix sums state
  const [prefixCells, setPrefixCells] = useState<number[]>([]);

  // Kadane's state
  const [kadaneStart, setKadaneStart] = useState<number>(0);
  const [kadaneEnd, setKadaneEnd] = useState<number>(0);
  const [kadaneVal, setKadaneVal] = useState<number>(0);

  // General select option state (True/False or answers)
  const [selectedBoolean, setSelectedBoolean] = useState<boolean | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');

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
      setSelectedIdx(null);
      setInputLength(0);
      setInputMaxIdx(0);
      setSelectedMinIdx(null);
      setSelectedMaxIdx(null);
      setSelectedBoolean(null);
      setTextAnswer('');

      // Setup dynamic variables
      if (prob.type === 'basic_arr' || prob.type === 'search_idx') {
        // Init length/max bounds
        setInputLength(0);
        setInputMaxIdx(0);
      } else if (prob.type === 'sorting') {
        setCurrentSortingArr([...prob.data.array]);
      } else if (prob.type === 'binary') {
        setBinLow(0);
        setBinHigh(prob.data.array.length - 1);
        setBinMid(0);
      } else if (prob.type === 'two_pointers') {
        setTwoPtrArr([...prob.data.array]);
        setLeftPtr(0);
        setRightPtr(prob.data.array.length - 1);
      } else if (prob.type === 'sliding_window') {
        setWindowStart(0);
        setWindowInputVal(0);
      } else if (prob.type === 'prefix_sum') {
        setPrefixCells(new Array(prob.data.array.length).fill(0));
        setWindowInputVal(0);
      } else if (prob.type === 'kadane') {
        setKadaneStart(0);
        setKadaneEnd(0);
        setKadaneVal(0);
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
      case 'arr_access':
        if (selectedIdx === prob.data.targetIndex) {
          success = true;
          feedback = "✅ Memory allocation offset confirmed at index 3!";
        } else {
          feedback = `❌ Incorrect index selection. Click the element at index ${prob.data.targetIndex}.`;
        }
        break;
      case 'arr_bounds':
        if (inputLength === prob.data.expectedLength && inputMaxIdx === prob.data.expectedMaxIndex) {
          success = true;
          feedback = "✅ Boundary limits verified! Buffer memory isolated.";
        } else {
          feedback = `❌ Limits out of bounds. Expected Length: ${prob.data.expectedLength}, Max Valid Index: ${prob.data.expectedMaxIndex}.`;
        }
        break;
      case 'arr_linear_scan':
        if (selectedIdx === prob.data.expectedIndex) {
          success = true;
          feedback = `✅ Scan complete. Value 88 located at offset ${prob.data.expectedIndex}.`;
        } else {
          feedback = `❌ Search failed. Linear scanned index does not match 88.`;
        }
        break;
      case 'arr_insert':
        // Clicking verified insert operation
        success = true;
        feedback = `✅ Shifting completed! New contiguous slot created. Expected: [${prob.data.expectedArray.join(', ')}]`;
        break;
      case 'arr_delete':
        success = true;
        feedback = `✅ Collapsing complete! Shifted remaining pointers. Expected: [${prob.data.expectedArray.join(', ')}]`;
        break;
      case 'arr_extrema':
        if (selectedMinIdx === prob.data.expectedMinIdx && selectedMaxIdx === prob.data.expectedMaxIdx) {
          success = true;
          feedback = "✅ Extrema extremes synchronized!";
        } else {
          feedback = "❌ Index mismatch. Identify min value (5) and max value (99).";
        }
        break;
      case 'sort_is_sorted':
        if (selectedIdx === prob.data.firstViolatorIdx) {
          success = true;
          feedback = "✅ Sorted violation identified! Index 2 (25) is greater than index 3 (22).";
        } else {
          feedback = "❌ Sorted violation bounds unaligned.";
        }
        break;
      case 'sort_bubble_pass':
        // Simulating the user completing single pass
        const isBubbleMatch = currentSortingArr.every((v, i) => v === prob.data.expectedAfterOnePass[i]);
        if (isBubbleMatch) {
          success = true;
          feedback = "✅ Bubble swap pass verified! Maximum element bubbled to the end.";
        } else {
          feedback = "❌ Array state incorrect. Swap elements side-by-side until the largest is on right.";
        }
        break;
      case 'sort_select_min':
        if (selectedIdx === prob.data.minIdx) {
          success = true;
          feedback = `✅ Selection minimum identified at index ${prob.data.minIdx}! Inverting bounds.`;
        } else {
          feedback = `❌ Select the index of the minimum element in range [2, 5].`;
        }
        break;
      case 'bin_midpoint':
        if (binMid === prob.data.expectedMid) {
          success = true;
          feedback = "✅ Logarithmic midpoint isolated!";
        } else {
          feedback = `❌ Recalculate midpoint index using Math.floor((low + high) / 2).`;
        }
        break;
      case 'bin_classic':
        if (binMid === prob.data.expectedIndex) {
          success = true;
          feedback = "✅ Target binary key located at index 5!";
        } else {
          feedback = "❌ Keep binary slicing search spaces until Mid reaches 60.";
        }
        break;
      case 'bin_first_occ':
        if (selectedIdx === prob.data.expectedIndex) {
          success = true;
          feedback = "✅ Left-most occurrence isolated at index 1.";
        } else {
          feedback = "❌ Find first occurrence of 20 (index 1).";
        }
        break;
      case 'bin_insert_pos':
        if (selectedIdx === prob.data.expectedIdx) {
          success = true;
          feedback = "✅ Search insert index matches 3!";
        } else {
          feedback = "❌ Wrong index position.";
        }
        break;
      case 'two_ptr_reverse':
        const reversedCorrect = twoPtrArr.every((v, i) => v === prob.data.expectedArray[i]);
        if (reversedCorrect) {
          success = true;
          feedback = "✅ Twin pointers meets in middle. Reversal completed!";
        } else {
          feedback = "❌ Pointer array is not fully reversed yet.";
        }
        break;
      case 'two_ptr_two_sum':
        if (leftPtr === prob.data.expectedLeftIdx && rightPtr === prob.data.expectedRightIdx) {
          success = true;
          feedback = "✅ Match found! 2 + 13 = 15.";
        } else {
          feedback = "❌ Pair values do not add up to target sum 15.";
        }
        break;
      case 'two_ptr_duplicates':
        if (windowInputVal === prob.data.expectedUniqueCount) {
          success = true;
          feedback = "✅ Unique array capacity quantified!";
        } else {
          feedback = `❌ Duplicate counting invalid. Try again.`;
        }
        break;
      case 'two_ptr_container':
        if (windowInputVal === prob.data.expectedArea) {
          success = true;
          feedback = "✅ Dynamic volume maximized!";
        } else {
          feedback = "❌ Incorrect area calculation.";
        }
        break;
      case 'slide_max_k':
        if (selectedIdx === prob.data.expectedStartIdx) {
          success = true;
          feedback = `✅ Sliding window starts at index ${prob.data.expectedStartIdx} containing [5, 1, 3] sum = 9.`;
        } else {
          feedback = "❌ Incorrect slide boundary.";
        }
        break;
      case 'slide_smallest_sum':
        if (windowInputVal === prob.data.expectedLen) {
          success = true;
          feedback = `✅ Smallest sliding window size is ${prob.data.expectedLen}!`;
        } else {
          feedback = "❌ Length does not fulfill S >= 7 requirement.";
        }
        break;
      case 'slide_distinct':
        if (windowInputVal === prob.data.expectedLen) {
          success = true;
          feedback = `✅ Longest distinct sliding window size is ${prob.data.expectedLen}!`;
        } else {
          feedback = "❌ Length incorrect.";
        }
        break;
      case 'slide_count_anagrams':
        if (textAnswer.trim().toUpperCase() === "A,B" || textAnswer.trim().toUpperCase() === "A B" || textAnswer.trim().toUpperCase() === "A, B") {
          success = true;
          feedback = "✅ Correct! We popped 'A' and pushed 'B'.";
        } else {
          feedback = "❌ Formulate as 'Removed character, Added character' (e.g. A,B).";
        }
        break;
      case 'prefix_build':
        const prefixCorrect = prefixCells.every((v, i) => v === prob.data.expectedPrefix[i]);
        if (prefixCorrect) {
          success = true;
          feedback = "✅ Prefix dynamic array built flawlessly!";
        } else {
          feedback = "❌ Prefix sum values mismatch.";
        }
        break;
      case 'prefix_range':
        if (windowInputVal === prob.data.expectedSum) {
          success = true;
          feedback = "✅ Range sum query resolved in O(1) time!";
        } else {
          feedback = "❌ Incorrect prefix interval calculation.";
        }
        break;
      case 'prefix_pivot':
        if (selectedIdx === prob.data.expectedPivot) {
          success = true;
          feedback = "✅ Equilibrium equilibrium pivot found at index 3!";
        } else {
          feedback = "❌ Sum is not symmetric around selected cell.";
        }
        break;
      case 'kadane_step':
        if (windowInputVal === prob.data.expectedNextMax) {
          success = true;
          feedback = "✅ Dynamic local maxima tracked!";
        } else {
          feedback = "❌ Local optimal not matched.";
        }
        break;
      case 'kadane_classic':
        if (kadaneStart === prob.data.expectedStart && kadaneEnd === prob.data.expectedEnd) {
          success = true;
          feedback = `✅ Kadane max continuous sub-segment bounds match index ${prob.data.expectedStart} to ${prob.data.expectedEnd}!`;
        } else {
          feedback = "❌ Sub-segments do not yield global maximum.";
        }
        break;
      case 'kadane_product':
        if (windowInputVal === prob.data.expectedProduct) {
          success = true;
          feedback = "✅ Maximum product bounded!";
        } else {
          feedback = "❌ Incorrect product value.";
        }
        break;
      case 'int_overlap_check':
        if (selectedBoolean === prob.data.expectedOverlap) {
          success = true;
          feedback = "✅ Correct! Intervals overlap because start B <= end A.";
        } else {
          feedback = "❌ Incorrect overlap analysis.";
        }
        break;
      case 'int_merge_pair':
        if (textAnswer.replace(/\s+/g, '') === '[[1,6],[8,10]]' || textAnswer.replace(/\s+/g, '') === '[1,6],[8,10]') {
          success = true;
          feedback = "✅ Intervals consolidated perfectly!";
        } else {
          feedback = "❌ Incorrect consolidated notation. Write like: [[1,6], [8,10]]";
        }
        break;
      case 'int_insert':
        if (textAnswer.replace(/\s+/g, '') === '[[1,5],[6,9]]' || textAnswer.replace(/\s+/g, '') === '[1,5],[6,9]') {
          success = true;
          feedback = "✅ Range inserted and merged successfully!";
        } else {
          feedback = "❌ Incorrect formatting. Expected: [[1,5], [6,9]]";
        }
        break;
      case 'int_meetings':
        if (windowInputVal === prob.data.expectedRooms) {
          success = true;
          feedback = "✅ Safe meeting schedule synchronized!";
        } else {
          feedback = "❌ Rooms allocation incorrect.";
        }
        break;
      case 'matrix_transpose':
        if (textAnswer.replace(/\s+/g, '') === '[[1,3],[2,4]]') {
          success = true;
          feedback = "✅ Rows and columns swapped successfully!";
        } else {
          feedback = "❌ Incorrect transposition. Try [[1,3], [2,4]]";
        }
        break;
      case 'matrix_rotate':
        if (textAnswer.replace(/\s+/g, '') === '[[3,1],[4,2]]') {
          success = true;
          feedback = "✅ Matrix rotated clockwise by 90 degrees!";
        } else {
          feedback = "❌ Mismatch in clockwise indices.";
        }
        break;
      case 'matrix_spiral':
        if (textAnswer.replace(/\s+/g, '') === '[1,2,4,3]') {
          success = true;
          feedback = "✅ Spiral trajectory completed!";
        } else {
          feedback = "❌ Spiral traversal pattern incorrect.";
        }
        break;
      case 'freq_unique':
        if (selectedBoolean === prob.data.expectedUnique) {
          success = true;
          feedback = "✅ Unique frequency counts identified successfully!";
        } else {
          feedback = "❌ Frequency checks failed.";
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
          setCurrentDialogue("Ugh! Your dynamic constraints are breaching my segment bounds!");
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
              description: `Cleared Level ${selectedLevel.id} of Array Kingdom by defeating ${selectedLevel.bossName}`,
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

    // Check if ALL 10 levels are completed to unlock the entire sector
    const totalLvlSolved = QUEST_LEVELS.filter(l => 
      l.problems.every(p => solvedProblemIds.includes(p.id))
    ).length;

    if (totalLvlSolved === 10) {
      setConsoleLogs(prev => [...prev, "🚨 SECTOR CLEARANCE RECEIVED! ARRAY KINGDOM HAS BEEN LIBERATED!"]);
      setTimeout(() => {
        onCompleteSector();
      }, 3000);
    }
  };

  // Helper swap for sorting passes
  const handleSwapInArr = (i: number, j: number) => {
    playSound('swap');
    const updated = [...currentSortingArr];
    const temp = updated[i];
    updated[i] = updated[j];
    updated[j] = temp;
    setCurrentSortingArr(updated);
  };

  const prob = selectedLevel.problems[activeProblemIdx];

  return (
    <div className="bg-[#0b0c16] border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-mono text-slate-200 w-full">
      
      {/* Laser line header overlay */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-purple-950/40">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400 animate-pulse" />
            <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-400">
              ARRAY KINGDOM: ARENA EXPANSION
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
            10 Levels • 35 Interactive DSA Operations • Sector Clearance Protocol
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl text-xs flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>CREDITS: <b className="text-cyan-400">{profile.points}</b></span>
          </div>

          <button
            onClick={() => { playSound('powerdown'); onBackToMenu(); }}
            className="px-4 py-1.5 bg-slate-950 border border-purple-900/40 hover:border-purple-500/80 text-purple-300 text-xs font-bold rounded-xl transition-all"
          >
            ← LEAVE ARENA
          </button>
        </div>
      </div>

      {/* LEVEL SELECTION RAIL */}
      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 mb-6">
        {QUEST_LEVELS.map((lvl, index) => {
          const isSelected = activeLevelIdx === index;
          const isCleared = lvl.problems.every(p => solvedProblemIds.includes(p.id));
          return (
            <button
              key={lvl.id}
              onClick={() => handleLevelSelect(index)}
              className={`relative p-2 rounded-xl border text-left transition-all ${
                isSelected 
                  ? 'bg-purple-950/30 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] text-purple-200' 
                  : isCleared
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/30'
                  : 'bg-slate-905/30 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300'
              }`}
            >
              <div className="text-[8px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>LVL {lvl.id}</span>
                {isCleared ? (
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                ) : (
                  <Lock className="w-2 h-2" />
                )}
              </div>
              <h4 className="text-[10px] font-black truncate mt-1">{lvl.name}</h4>
            </button>
          );
        })}
      </div>

      {/* DETAILED GAMEWAY BOARD */}
      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPANION BOSS TRACK */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          
          {/* SECTOR BOSS */}
          <div className="bg-[#0f0b1a] border border-purple-950 rounded-2xl p-4 relative overflow-hidden shadow-lg">
            
            <div className="flex items-center gap-3">
              <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-bounce">
                {selectedLevel.bossAvatar}
              </span>
              <div>
                <span className="px-1.5 py-0.5 bg-red-950 text-red-400 border border-red-800/40 rounded text-[8px] font-bold tracking-widest">
                  SEGMENT BOSS (LVL {selectedLevel.id})
                </span>
                <h3 className="text-sm font-black tracking-wide text-slate-100 mt-0.5">
                  {selectedLevel.bossName}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {selectedLevel.bossTitle}
                </p>
              </div>
            </div>

            {/* BOSS HP BAR */}
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-red-400 font-bold uppercase tracking-wider">INTEGRITY CORRUPTION</span>
                <span className="font-mono text-slate-300">{bossHP} / {selectedLevel.bossMaxHP} HP</span>
              </div>
              <div className="w-full h-2 bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-0.5">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: `${(bossHP / selectedLevel.bossMaxHP) * 100}%` }}
                  className="h-full bg-gradient-to-r from-red-500 to-purple-600 rounded-full" 
                />
              </div>
            </div>

            <AnimatePresence>
              {bossDamageAnim !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: -25, scale: 1.2 }}
                  exit={{ opacity: 0, y: -45 }}
                  className="absolute left-1/2 top-12 transform -translate-x-1/2 text-lg font-black text-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                >
                  -{bossDamageAnim} SYSTEM STABILITY!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BOSS SPEECH DIALOGUE */}
          <div className="bg-[#0f0b1a] border border-purple-950/60 rounded-2xl p-4 text-xs text-left">
            <span className="text-[8px] text-purple-400 font-bold uppercase tracking-widest block mb-1">
              INTRUSION TRANSCRIPT
            </span>
            <p className="text-slate-300 italic font-sans">
              "{currentDialogue}"
            </p>
          </div>

          {/* SUB PROBLEMS IN LEVEL */}
          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 text-left">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Sector Challenge Keys ({selectedLevel.problems.filter(p=>solvedProblemIds.includes(p.id)).length} / {selectedLevel.problems.length})
            </h4>
            <div className="space-y-2">
              {selectedLevel.problems.map((p_item, idx) => {
                const isActive = activeProblemIdx === idx;
                const isSolved = solvedProblemIds.includes(p_item.id);
                return (
                  <button
                    key={p_item.id}
                    onClick={() => { playSound('click'); setActiveProblemIdx(idx); }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                      isActive 
                        ? 'bg-purple-950/30 border-purple-500 text-purple-200' 
                        : 'bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isSolved ? 'bg-emerald-400' : 'bg-purple-500 animate-pulse'}`} />
                      <span className="font-bold truncate max-w-[150px]">{p_item.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-[9px]">
                      <span className="text-cyan-400">+{p_item.pointsReward} PTS</span>
                      {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT INTERACTIVE ACTION DECK */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 text-left">
          
          {/* PROBLEM OVERVIEW */}
          {prob && (
            <div className="bg-slate-950/70 border border-slate-900 rounded-2xl p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-900">
                <div>
                  <span className="px-2 py-0.5 bg-purple-950/50 text-purple-400 border border-purple-800/40 rounded text-[8px] font-bold uppercase tracking-widest">
                    LVL {selectedLevel.id} • CHALLENGE {activeProblemIdx + 1}
                  </span>
                  <h3 className="text-sm font-black tracking-wide text-slate-100 mt-1">
                    {prob.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-slate-400 font-bold">REWARD:</span>
                  <span className="text-emerald-400">+{prob.xpReward} XP</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                {prob.description}
              </p>

              <div className="p-3 bg-[#0a0512]/60 border border-purple-950/40 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DECISION SPECIFICATIONS:</span>
                <p className="text-xs text-cyan-300 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  {prob.objective}
                </p>
              </div>
            </div>
          )}

          {/* DYNAMIC INTERACTIVE CHANNELS */}
          <div className="bg-[#07080f] border border-purple-950/40 rounded-2xl overflow-hidden flex flex-col min-h-[280px]">
            
            {/* Action deck sub-header */}
            <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-bold uppercase">PHYSICAL MEMORY GRID REPRESENTATION</span>
              <button
                onClick={() => setShowHint(prev => !prev)}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
              >
                <Lightbulb className="w-3 h-3 text-amber-400 animate-bounce" />
                <span>{showHint ? "Hide Strategy" : "Reveal Strategy"}</span>
              </button>
            </div>

            {/* Hint container */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="bg-amber-950/10 border-b border-amber-900/30 p-3 text-xs text-amber-300/90 leading-relaxed overflow-hidden font-sans"
                >
                  <b>RECALIBRATION ADVICE:</b> {prob?.hint}
                </motion.div>
              )}
            </AnimatePresence>

            {/* INTERACTIVE CONTROLS BY TYPE */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              
              {/* 1. BASIC ARRAYS */}
              {prob?.type === 'basic_arr' && (
                <div className="space-y-4">
                  
                  {/* Access index visual cells */}
                  {prob.id === 'arr_access' && (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap gap-2.5 justify-center">
                        {prob.data.array.map((val: number, idx: number) => {
                          const isSelected = selectedIdx === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                              className={`p-3.5 w-16 h-16 border rounded-xl font-bold transition-all flex flex-col items-center justify-between ${
                                isSelected 
                                  ? 'bg-purple-900/40 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                  : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-850'
                              }`}
                            >
                              <span className="text-[8px] text-slate-500 uppercase font-bold">IDX {idx}</span>
                              <span className="text-sm text-center">{val}</span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-center text-[10px] text-slate-500">Selected Offset: <span className="text-cyan-400 font-bold">{selectedIdx !== null ? `Index ${selectedIdx}` : 'None'}</span></p>
                    </div>
                  )}

                  {/* Bounds length inputs */}
                  {prob.id === 'arr_bounds' && (
                    <div className="space-y-4 max-w-sm mx-auto">
                      <div className="flex gap-2 justify-center py-2 bg-slate-950 border border-slate-900 rounded-xl">
                        {prob.data.array.map((val: number, idx: number) => (
                          <div key={idx} className="w-10 h-10 border border-slate-900 rounded-lg flex flex-col items-center justify-center bg-slate-950/40 text-[10px] text-slate-500">
                            <span>{val}</span>
                            <span className="text-[7px] text-slate-600">[{idx}]</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold">PHYSICAL LENGTH:</label>
                          <input
                            type="number"
                            value={inputLength || ''}
                            onChange={(e) => setInputLength(parseInt(e.target.value) || 0)}
                            className="w-full p-2 bg-slate-950 border border-slate-900 rounded-xl text-center text-xs text-purple-300 focus:outline-none focus:border-purple-500"
                            placeholder="Count elements"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold">MAX VALID INDEX:</label>
                          <input
                            type="number"
                            value={inputMaxIdx || ''}
                            onChange={(e) => setInputMaxIdx(parseInt(e.target.value) || 0)}
                            className="w-full p-2 bg-slate-950 border border-slate-900 rounded-xl text-center text-xs text-purple-300 focus:outline-none focus:border-purple-500"
                            placeholder="Index range cap"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Insert operation simulation */}
                  {prob.id === 'arr_insert' && (
                    <div className="space-y-4 text-center">
                      <div className="flex gap-2.5 justify-center overflow-x-auto py-2">
                        {prob.data.array.map((val: number, idx: number) => (
                          <div key={idx} className="w-14 h-14 bg-slate-950 border border-slate-900 rounded-xl flex flex-col items-center justify-between p-2">
                            <span className="text-[7px] text-slate-500">IDX {idx}</span>
                            <span className="text-xs font-bold text-slate-300">{val}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={handleVerifyProblem}
                        className="mx-auto px-4 py-2 bg-purple-950/30 border border-purple-500/50 hover:bg-purple-900/50 text-purple-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2 justify-center"
                      >
                        <ArrowRightLeft className="w-4 h-4 text-purple-400" />
                        <span>TRIGGER ELEMENT SHIFT & INSERT 99 AT INDEX 2</span>
                      </button>
                    </div>
                  )}

                  {/* Delete operation simulation */}
                  {prob.id === 'arr_delete' && (
                    <div className="space-y-4 text-center">
                      <div className="flex gap-2.5 justify-center overflow-x-auto py-2">
                        {prob.data.array.map((val: number, idx: number) => (
                          <div key={idx} className={`w-14 h-14 bg-slate-950 border rounded-xl flex flex-col items-center justify-between p-2 ${idx === 1 ? 'border-red-500/50 bg-red-950/10' : 'border-slate-900'}`}>
                            <span className="text-[7px] text-slate-500">IDX {idx}</span>
                            <span className={`text-xs font-bold ${idx === 1 ? 'text-red-400 line-through' : 'text-slate-300'}`}>{val}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={handleVerifyProblem}
                        className="mx-auto px-4 py-2 bg-red-950/30 border border-red-500/50 hover:bg-red-900/50 text-red-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2 justify-center"
                      >
                        <span>DELETE AT INDEX 1 & COLLAPSE CELLS</span>
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* 2. SEARCH INDEX */}
              {prob?.type === 'search_idx' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    {prob.data.array.map((val: number, idx: number) => {
                      const isMinSelected = selectedMinIdx === idx;
                      const isMaxSelected = selectedMaxIdx === idx;
                      const isSingleSelected = selectedIdx === idx;

                      return (
                        <div key={idx} className="flex flex-col items-center gap-1.5">
                          <button
                            onClick={() => {
                              playSound('click');
                              if (prob.id === 'arr_extrema') {
                                // Multi selection flow
                                if (selectedMinIdx === null) {
                                  setSelectedMinIdx(idx);
                                } else if (selectedMaxIdx === null) {
                                  setSelectedMaxIdx(idx);
                                } else {
                                  setSelectedMinIdx(idx);
                                  setSelectedMaxIdx(null);
                                }
                              } else {
                                setSelectedIdx(idx);
                              }
                            }}
                            className={`p-3.5 w-16 h-16 border rounded-xl font-bold transition-all flex flex-col items-center justify-between ${
                              isMinSelected
                                ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                                : isMaxSelected
                                ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                                : isSingleSelected
                                ? 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-850'
                            }`}
                          >
                            <span className="text-[7px] text-slate-500 font-bold">IDX {idx}</span>
                            <span className="text-sm">{val}</span>
                          </button>
                          
                          {/* Helper labels */}
                          {isMinSelected && <span className="text-[8px] text-cyan-400 font-bold">MIN</span>}
                          {isMaxSelected && <span className="text-[8px] text-rose-400 font-bold">MAX</span>}
                        </div>
                      );
                    })}
                  </div>

                  {prob.id === 'arr_extrema' && (
                    <div className="text-center text-[10px] space-y-2">
                      <p className="text-slate-500">Min Selected: <b className="text-cyan-400">{selectedMinIdx !== null ? `Index ${selectedMinIdx}` : 'None'}</b> • Max Selected: <b className="text-rose-400">{selectedMaxIdx !== null ? `Index ${selectedMaxIdx}` : 'None'}</b></p>
                      <button
                        onClick={() => { setSelectedMinIdx(null); setSelectedMaxIdx(null); }}
                        className="px-2 py-0.5 bg-slate-950 border border-slate-900 rounded text-[9px]"
                      >
                        Clear Anchors
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 3. SORTING */}
              {prob?.type === 'sorting' && (
                <div className="space-y-4">
                  
                  {/* Is sorted violator finder */}
                  {prob.id === 'sort_is_sorted' && (
                    <div className="space-y-4 text-center">
                      <p className="text-[10px] text-slate-400">Click on the element index that breaks the ascending sort order:</p>
                      <div className="flex gap-2.5 justify-center">
                        {currentSortingArr.map((val: number, idx: number) => {
                          const isSelected = selectedIdx === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                              className={`p-3 w-14 h-14 border rounded-xl flex flex-col justify-between items-center transition-all ${
                                isSelected
                                  ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                                  : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                              }`}
                            >
                              <span className="text-[7px] text-slate-600 font-bold">[{idx}]</span>
                              <span className="text-xs font-bold">{val}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Bubble sort single pass simulator */}
                  {prob.id === 'sort_bubble_pass' && (
                    <div className="space-y-4 text-center">
                      <p className="text-[10px] text-slate-400">Perform pairwise swaps until the largest element is fully bubbled to the end:</p>
                      <div className="flex gap-2.5 justify-center">
                        {currentSortingArr.map((val: number, idx: number) => (
                          <div key={idx} className="flex flex-col items-center gap-1.5">
                            <div className="w-14 h-14 bg-slate-950 border border-purple-950 rounded-xl flex flex-col items-center justify-between p-2">
                              <span className="text-[7px] text-slate-600">[{idx}]</span>
                              <span className="text-xs font-black text-purple-300">{val}</span>
                            </div>

                            {/* Swap button between adjacent elements */}
                            {idx < currentSortingArr.length - 1 && (
                              <button
                                onClick={() => handleSwapInArr(idx, idx + 1)}
                                className="px-1.5 py-0.5 bg-[#0a0614] border border-purple-900/60 rounded text-[8px] hover:text-purple-400"
                              >
                                ⇆ Swap
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selection Sort finder */}
                  {prob.id === 'sort_select_min' && (
                    <div className="space-y-4 text-center">
                      <p className="text-[10px] text-slate-400">Select the index of the minimum element in the sub-array from index {prob.data.rangeStart} to {prob.data.array.length - 1}:</p>
                      <div className="flex gap-2.5 justify-center">
                        {currentSortingArr.map((val: number, idx: number) => {
                          const isUnsortedPart = idx >= prob.data.rangeStart;
                          const isSelected = selectedIdx === idx;

                          return (
                            <button
                              key={idx}
                              disabled={!isUnsortedPart}
                              onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                              className={`p-3 w-14 h-14 border rounded-xl flex flex-col justify-between items-center transition-all ${
                                isSelected
                                  ? 'bg-purple-950 border-purple-500 text-purple-200'
                                  : isUnsortedPart
                                  ? 'bg-purple-950/20 border-purple-950 text-purple-300 hover:border-purple-800'
                                  : 'bg-slate-950/40 border-slate-950 text-slate-600 scale-90'
                              }`}
                            >
                              <span className="text-[7px] text-slate-600 font-bold">[{idx}]</span>
                              <span className="text-xs font-bold">{val}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 4. BINARY SEARCH */}
              {prob?.type === 'binary' && (
                <div className="space-y-4 text-center">
                  
                  {/* Binary Midpoint Selection */}
                  {prob.id === 'bin_midpoint' && (
                    <div className="space-y-3">
                      <div className="flex justify-center gap-2">
                        {prob.data.array.map((val: number, idx: number) => {
                          const isMid = binMid === idx;
                          return (
                            <div key={idx} className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center transition-all ${
                              isMid ? 'bg-purple-950/40 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-900 text-slate-500'
                            }`}>
                              <span className="text-[8px] font-bold">[{idx}]</span>
                              <span className="text-xs">{val}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="max-w-xs mx-auto space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-black">Adjust Midpoint Index Slider:</label>
                        <input
                          type="range"
                          min="0"
                          max={prob.data.array.length - 1}
                          value={binMid}
                          onChange={(e) => { playSound('click'); setBinMid(parseInt(e.target.value)); }}
                          className="w-full accent-purple-500"
                        />
                        <span className="text-xs text-purple-400 font-bold">Selected Mid Index: {binMid}</span>
                      </div>
                    </div>
                  )}

                  {/* Classic Step-by-Step Binary Search Pointers */}
                  {prob.id === 'bin_classic' && (
                    <div className="space-y-4">
                      <div className="flex justify-center gap-2.5">
                        {prob.data.array.map((val: number, idx: number) => {
                          const isLow = binLow === idx;
                          const isHigh = binHigh === idx;
                          const isMid = binMid === idx;

                          return (
                            <div key={idx} className={`w-12 h-14 rounded-xl border flex flex-col justify-between items-center p-1.5 transition-all ${
                              isMid 
                                ? 'bg-purple-950/40 border-purple-400 text-purple-200' 
                                : idx >= binLow && idx <= binHigh
                                ? 'bg-slate-950 border-slate-850 text-slate-300'
                                : 'bg-slate-950/40 border-slate-950 text-slate-600 scale-90'
                            }`}>
                              <span className="text-[7px] text-slate-500">IDX {idx}</span>
                              <span className="text-xs font-bold">{val}</span>
                              <div className="flex gap-0.5 text-[6px] font-black text-cyan-400 uppercase">
                                {isLow && <span>L</span>}
                                {isMid && <span>M</span>}
                                {isHigh && <span>H</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
                        <div className="bg-slate-950 p-2 border border-slate-900 rounded-xl flex flex-col items-center">
                          <span className="text-[8px] text-slate-500">LOW POINTER</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <button onClick={() => { if(binLow > 0) setBinLow(l => l-1); }} className="px-1.5 bg-slate-900 text-xs">-</button>
                            <span className="text-xs font-bold text-cyan-400">{binLow}</span>
                            <button onClick={() => { if(binLow < binHigh) setBinLow(l => l+1); }} className="px-1.5 bg-slate-900 text-xs">+</button>
                          </div>
                        </div>

                        <div className="bg-slate-950 p-2 border border-slate-900 rounded-xl flex flex-col items-center">
                          <span className="text-[8px] text-slate-500">MID POINTER</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <button onClick={() => { if(binMid > 0) setBinMid(m => m-1); }} className="px-1.5 bg-slate-900 text-xs">-</button>
                            <span className="text-xs font-bold text-purple-400">{binMid}</span>
                            <button onClick={() => { if(binMid < prob.data.array.length - 1) setBinMid(m => m+1); }} className="px-1.5 bg-slate-900 text-xs">+</button>
                          </div>
                        </div>

                        <div className="bg-slate-950 p-2 border border-slate-900 rounded-xl flex flex-col items-center">
                          <span className="text-[8px] text-slate-500">HIGH POINTER</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <button onClick={() => { if(binHigh > binLow) setBinHigh(h => h-1); }} className="px-1.5 bg-slate-900 text-xs">-</button>
                            <span className="text-xs font-bold text-rose-400">{binHigh}</span>
                            <button onClick={() => { if(binHigh < prob.data.array.length - 1) setBinHigh(h => h+1); }} className="px-1.5 bg-slate-900 text-xs">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Find First Occurrence & Insert Position indices click */}
                  {(prob.id === 'bin_first_occ' || prob.id === 'bin_insert_pos') && (
                    <div className="space-y-3">
                      <p className="text-[10px] text-slate-400">Click on the exact target index boundary slot:</p>
                      <div className="flex justify-center gap-2">
                        {prob.data.array.map((val: number, idx: number) => {
                          const isSelected = selectedIdx === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                              className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                isSelected ? 'bg-purple-950/40 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-900 text-slate-500 hover:border-slate-800'
                              }`}
                            >
                              <span className="text-[8px] font-bold">[{idx}]</span>
                              <span className="text-xs font-bold">{val}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 5. TWO POINTERS */}
              {prob?.type === 'two_pointers' && (
                <div className="space-y-4 text-center">
                  
                  {/* Reversal Swap steps */}
                  {prob.id === 'two_ptr_reverse' && (
                    <div className="space-y-4">
                      <div className="flex justify-center gap-2">
                        {twoPtrArr.map((val: string, idx: number) => {
                          const isLeft = leftPtr === idx;
                          const isRight = rightPtr === idx;
                          return (
                            <div key={idx} className={`w-14 h-14 rounded-xl border flex flex-col justify-between items-center p-1.5 transition-all ${
                              isLeft ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200' :
                              isRight ? 'bg-rose-950/40 border-rose-500 text-rose-200' :
                              'bg-slate-950 border-slate-900 text-slate-400'
                            }`}>
                              <span className="text-[7px]">[{idx}]</span>
                              <span className="text-sm font-black">{val}</span>
                              <div className="text-[6px] font-bold text-slate-500 uppercase">
                                {isLeft && 'LEFT'}
                                {isRight && 'RIGHT'}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            if (leftPtr < rightPtr) {
                              playSound('swap');
                              const next = [...twoPtrArr];
                              const temp = next[leftPtr];
                              next[leftPtr] = next[rightPtr];
                              next[rightPtr] = temp;
                              setTwoPtrArr(next);
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-950 border border-purple-900/60 rounded-xl text-xs text-purple-300"
                        >
                          SWAP Left & Right
                        </button>
                        
                        <button
                          onClick={() => {
                            playSound('click');
                            if (leftPtr < rightPtr) {
                              setLeftPtr(l => l + 1);
                              setRightPtr(r => r - 1);
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-400"
                        >
                          Move Pointers Inward
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Two Sum Target locator */}
                  {prob.id === 'two_ptr_two_sum' && (
                    <div className="space-y-4">
                      <div className="flex justify-center gap-2">
                        {prob.data.array.map((val: number, idx: number) => {
                          const isLeft = leftPtr === idx;
                          const isRight = rightPtr === idx;
                          return (
                            <div key={idx} className={`w-14 h-14 rounded-xl border flex flex-col justify-between items-center p-1.5 transition-all ${
                              isLeft ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200' :
                              isRight ? 'bg-rose-950/40 border-rose-500 text-rose-200' :
                              'bg-slate-950 border-slate-900 text-slate-400'
                            }`}>
                              <span className="text-[7px]">[{idx}]</span>
                              <span className="text-xs font-bold">{val}</span>
                              <div className="text-[6px] font-bold uppercase">
                                {isLeft && 'L'}
                                {isRight && 'R'}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-center gap-4 max-w-xs mx-auto">
                        <div className="space-y-1">
                          <span className="text-[8px] text-slate-500 block">LEFT INDEX:</span>
                          <div className="flex gap-1.5 items-center bg-slate-950 p-1 rounded-xl border border-slate-900">
                            <button onClick={() => { if(leftPtr > 0) setLeftPtr(l=>l-1); }} className="px-2 text-xs font-bold">-</button>
                            <span className="text-xs font-mono font-bold text-cyan-400">{leftPtr}</span>
                            <button onClick={() => { if(leftPtr < rightPtr) setLeftPtr(l=>l+1); }} className="px-2 text-xs font-bold">+</button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[8px] text-slate-500 block">RIGHT INDEX:</span>
                          <div className="flex gap-1.5 items-center bg-slate-950 p-1 rounded-xl border border-slate-900">
                            <button onClick={() => { if(rightPtr > leftPtr) setRightPtr(r=>r-1); }} className="px-2 text-xs font-bold">-</button>
                            <span className="text-xs font-mono font-bold text-rose-400">{rightPtr}</span>
                            <button onClick={() => { if(rightPtr < prob.data.array.length - 1) setRightPtr(r=>r+1); }} className="px-2 text-xs font-bold">+</button>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400">Sum of selection: <span className="text-cyan-300 font-bold">{prob.data.array[leftPtr] + prob.data.array[rightPtr]}</span></div>
                    </div>
                  )}

                  {/* Remove duplicates numeric input or container volume */}
                  {(prob.id === 'two_ptr_duplicates' || prob.id === 'two_ptr_container') && (
                    <div className="space-y-4 max-w-sm mx-auto text-center">
                      <div className="flex gap-2 justify-center py-2 bg-slate-950 border border-slate-900 rounded-xl">
                        {prob.data.array.map((val: any, idx: number) => (
                          <div key={idx} className="w-10 h-10 border border-slate-900 rounded-lg flex flex-col items-center justify-center bg-slate-950/40 text-[10px] text-slate-500">
                            <span>{val}</span>
                            <span className="text-[7px] text-slate-600">[{idx}]</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold uppercase block">
                          {prob.id === 'two_ptr_duplicates' ? 'Enter unique elements count:' : 'Calculate volume capacity (Area):'}
                        </label>
                        <input
                          type="number"
                          value={windowInputVal || ''}
                          onChange={(e) => setWindowInputVal(parseInt(e.target.value) || 0)}
                          className="w-full p-2 bg-slate-950 border border-slate-900 rounded-xl text-center text-xs text-purple-300 focus:outline-none focus:border-purple-500"
                          placeholder="Your numeric computation"
                        />
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 6. SLIDING WINDOW */}
              {prob?.type === 'sliding_window' && (
                <div className="space-y-4">
                  
                  {/* Sliding window selection */}
                  {prob.id === 'slide_max_k' && (
                    <div className="space-y-4 text-center">
                      <div className="flex justify-center gap-2 py-3 relative bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden">
                        {prob.data.array.map((val: number, idx: number) => {
                          const isInWindow = idx >= windowStart && idx < windowStart + prob.data.k;
                          return (
                            <div key={idx} className={`w-12 h-12 rounded-xl border flex flex-col justify-center items-center transition-all ${
                              isInWindow 
                                ? 'bg-purple-900/30 border-purple-500 text-purple-200 scale-105 shadow-[0_0_12px_rgba(168,85,247,0.3)]' 
                                : 'bg-slate-950 border-slate-900 text-slate-500'
                            }`}>
                              <span className="text-[7px] text-slate-600">[{idx}]</span>
                              <span className="text-xs font-black">{val}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="max-w-xs mx-auto space-y-2">
                        <span className="text-[9px] text-slate-500 font-bold block uppercase">Slide Window Start Index:</span>
                        <div className="flex gap-2 justify-center">
                          {[0, 1, 2, 3].map((val) => (
                            <button
                              key={val}
                              onClick={() => { playSound('click'); setWindowStart(val); setSelectedIdx(val); }}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all ${
                                windowStart === val
                                  ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                                  : 'bg-slate-950 border-slate-900 text-slate-400'
                              }`}
                            >
                              Idx {val}
                            </button>
                          ))}
                        </div>
                        
                        <div className="text-[10px] text-slate-400 mt-2">
                          Active Window Sum: <span className="text-cyan-400 font-black">
                            {prob.data.array.slice(windowStart, windowStart + prob.data.k).reduce((a:number, b:number)=>a+b, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Smaller subarray or distinct characters value */}
                  {(prob.id === 'slide_smallest_sum' || prob.id === 'slide_distinct') && (
                    <div className="space-y-4 max-w-sm mx-auto text-center">
                      <div className="flex gap-2 justify-center py-2 bg-slate-950 border border-slate-900 rounded-xl">
                        {prob.data.array.map((val: any, idx: number) => (
                          <div key={idx} className="w-10 h-10 border border-slate-900 rounded-lg flex flex-col items-center justify-center bg-slate-950/40 text-[10px] text-slate-500">
                            <span>{val}</span>
                            <span className="text-[7px] text-slate-600">[{idx}]</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold uppercase block">
                          Enter your calculated window size:
                        </label>
                        <input
                          type="number"
                          value={windowInputVal || ''}
                          onChange={(e) => setWindowInputVal(parseInt(e.target.value) || 0)}
                          className="w-full p-2 bg-slate-950 border border-slate-900 rounded-xl text-center text-xs text-purple-300 focus:outline-none focus:border-purple-500"
                          placeholder="Length of window"
                        />
                      </div>
                    </div>
                  )}

                  {/* Character pop/push sliding window updates */}
                  {prob.id === 'slide_count_anagrams' && (
                    <div className="space-y-4 max-w-sm mx-auto text-center">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl">
                          <span className="text-[8px] text-slate-500 uppercase font-black">START RANGE WINDOW</span>
                          <div className="text-base font-bold text-cyan-400 mt-1">[{prob.data.initial.join(', ')}]</div>
                        </div>
                        <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl">
                          <span className="text-[8px] text-slate-500 uppercase font-black">SLIDED RANGE WINDOW</span>
                          <div className="text-base font-bold text-rose-400 mt-1">[{prob.data.final.join(', ')}]</div>
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[9px] text-slate-400 font-bold block uppercase">Specify pop / push updates (Removed character, Added character):</label>
                        <input
                          type="text"
                          value={textAnswer}
                          onChange={(e) => setTextAnswer(e.target.value)}
                          className="w-full p-2.5 bg-slate-950 border border-slate-900 rounded-xl text-center text-xs text-purple-300 focus:outline-none focus:border-purple-500 font-mono"
                          placeholder="e.g. A,B"
                        />
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 7. PREFIX SUMS */}
              {prob?.type === 'prefix_sum' && (
                <div className="space-y-4">
                  
                  {/* Building prefix array cells */}
                  {prob.id === 'prefix_build' && (
                    <div className="space-y-4 text-center">
                      <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl max-w-sm mx-auto">
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">Input Array Numbers</span>
                        <div className="flex gap-2.5 justify-center mt-1">
                          {prob.data.array.map((n:number, i:number)=>(
                            <div key={i} className="text-xs font-bold text-slate-300">[{i}]: <b className="text-cyan-400">{n}</b></div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Fill the Prefix Sum indices:</span>
                        <div className="flex gap-2 justify-center">
                          {prefixCells.map((val: number, idx: number) => (
                            <div key={idx} className="flex flex-col items-center gap-1">
                              <span className="text-[7px] text-slate-600 font-bold">P[{idx}]</span>
                              <input
                                type="number"
                                value={val || ''}
                                onChange={(e) => {
                                  const next = [...prefixCells];
                                  next[idx] = parseInt(e.target.value) || 0;
                                  setPrefixCells(next);
                                }}
                                className="w-12 p-1.5 bg-slate-950 border border-slate-900 rounded text-center text-xs text-purple-300 focus:outline-none focus:border-purple-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Prefix ranges query calculated input */}
                  {prob.id === 'prefix_range' && (
                    <div className="space-y-4 max-w-sm mx-auto text-center">
                      <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl space-y-1 text-left">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Calculated Prefix Buffers P:</p>
                        <div className="flex gap-1.5">
                          {prob.data.prefix.map((pVal:number, i:number) => (
                            <div key={i} className="px-2 py-0.5 bg-slate-900 rounded text-[10px]">P[{i}]: <b className="text-purple-300">{pVal}</b></div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold uppercase block">
                          Enter Range Sum from index {prob.data.i} to {prob.data.j}:
                        </label>
                        <input
                          type="number"
                          value={windowInputVal || ''}
                          onChange={(e) => setWindowInputVal(parseInt(e.target.value) || 0)}
                          className="w-full p-2 bg-slate-950 border border-slate-900 rounded-xl text-center text-xs text-purple-300 focus:outline-none focus:border-purple-500"
                          placeholder="Sum calculation result"
                        />
                      </div>
                    </div>
                  )}

                  {/* Equilibrium Pivot Index selection */}
                  {prob.id === 'prefix_pivot' && (
                    <div className="space-y-4 text-center">
                      <p className="text-[10px] text-slate-400">Click on the index that represents the equilibrium pivot:</p>
                      <div className="flex gap-2 justify-center">
                        {prob.data.array.map((val: number, idx: number) => {
                          const isSelected = selectedIdx === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                              className={`w-12 h-12 border rounded-xl flex flex-col justify-center items-center transition-all ${
                                isSelected ? 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                              }`}
                            >
                              <span className="text-[7px] text-slate-600">[{idx}]</span>
                              <span className="text-xs font-bold">{val}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 8. KADANE */}
              {prob?.type === 'kadane' && (
                <div className="space-y-4">
                  
                  {/* Step maxima calculation */}
                  {prob.id === 'kadane_step' && (
                    <div className="space-y-3 max-w-xs mx-auto text-center">
                      <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl space-y-1">
                        <div className="text-[10px] text-slate-500">Current running local max sum: <b className="text-cyan-400">{prob.data.prevMax}</b></div>
                        <div className="text-[10px] text-slate-500">Incoming value element: <b className="text-rose-400">{prob.data.num}</b></div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold uppercase block">Evaluate updated local max sum:</label>
                        <input
                          type="number"
                          value={windowInputVal || ''}
                          onChange={(e) => setWindowInputVal(parseInt(e.target.value) || 0)}
                          className="w-full p-2 bg-slate-950 border border-slate-900 rounded-xl text-center text-xs text-purple-300 focus:outline-none focus:border-purple-500 font-mono"
                          placeholder="Your answer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Classic continuous subarray selection */}
                  {prob.id === 'kadane_classic' && (
                    <div className="space-y-4 text-center">
                      <p className="text-[10px] text-slate-400">Select the bounding range that yields the maximum cumulative sum:</p>
                      <div className="flex gap-1.5 justify-center overflow-x-auto py-2">
                        {prob.data.array.map((val: number, idx: number) => {
                          const isSelected = idx >= kadaneStart && idx <= kadaneEnd;
                          return (
                            <div key={idx} className={`p-2.5 w-11 h-12 rounded border flex flex-col justify-center items-center transition-all ${
                              isSelected ? 'bg-purple-950/40 border-purple-500 text-purple-200 scale-105' : 'bg-slate-950 border-slate-900 text-slate-500'
                            }`}>
                              <span className="text-[7px] text-slate-600 font-mono">[{idx}]</span>
                              <span className="text-[10px] font-black">{val}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-center gap-3 max-w-xs mx-auto">
                        <div className="space-y-1">
                          <span className="text-[8px] text-slate-500 block">START INDEX:</span>
                          <input
                            type="number"
                            value={kadaneStart}
                            onChange={(e) => setKadaneStart(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-16 p-1 bg-slate-950 border border-slate-900 rounded text-center text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[8px] text-slate-500 block">END INDEX:</span>
                          <input
                            type="number"
                            value={kadaneEnd}
                            onChange={(e) => setKadaneEnd(Math.min(prob.data.array.length - 1, parseInt(e.target.value) || 0))}
                            className="w-16 p-1 bg-slate-950 border border-slate-900 rounded text-center text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Maximum product subarray */}
                  {prob.id === 'kadane_product' && (
                    <div className="space-y-4 max-w-sm mx-auto text-center">
                      <div className="flex gap-2 justify-center py-2 bg-slate-950 border border-slate-900 rounded-xl">
                        {prob.data.array.map((val: any, idx: number) => (
                          <div key={idx} className="w-10 h-10 border border-slate-900 rounded-lg flex flex-col items-center justify-center bg-slate-950/40 text-[10px] text-slate-500">
                            <span>{val}</span>
                            <span className="text-[7px] text-slate-600">[{idx}]</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold uppercase block">
                          Enter maximum contiguous subarray product:
                        </label>
                        <input
                          type="number"
                          value={windowInputVal || ''}
                          onChange={(e) => setWindowInputVal(parseInt(e.target.value) || 0)}
                          className="w-full p-2 bg-slate-950 border border-slate-900 rounded-xl text-center text-xs text-purple-300 focus:outline-none focus:border-purple-500"
                          placeholder="Max product value"
                        />
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 9. MERGE INTERVALS */}
              {prob?.type === 'merge_intervals' && (
                <div className="space-y-4">
                  
                  {/* Overlap check True/False buttons */}
                  {prob.id === 'int_overlap_check' && (
                    <div className="space-y-4 text-center">
                      <div className="flex justify-center gap-4 max-w-xs mx-auto">
                        <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl">
                          <span className="text-[8px] text-slate-500 uppercase font-black">Interval A</span>
                          <div className="text-base font-bold text-cyan-400 mt-1">[{prob.data.intA.join(', ')}]</div>
                        </div>
                        <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl">
                          <span className="text-[8px] text-slate-500 uppercase font-black">Interval B</span>
                          <div className="text-base font-bold text-rose-400 mt-1">[{prob.data.intB.join(', ')}]</div>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => { playSound('click'); setSelectedBoolean(true); }}
                          className={`px-6 py-2 rounded-xl border text-xs font-bold transition-all ${
                            selectedBoolean === true ? 'bg-purple-900/40 border-purple-500 text-purple-200' : 'bg-slate-950 border-slate-900 text-slate-400'
                          }`}
                        >
                          TRUE (They Overlap)
                        </button>

                        <button
                          onClick={() => { playSound('click'); setSelectedBoolean(false); }}
                          className={`px-6 py-2 rounded-xl border text-xs font-bold transition-all ${
                            selectedBoolean === false ? 'bg-purple-900/40 border-purple-500 text-purple-200' : 'bg-slate-950 border-slate-900 text-slate-400'
                          }`}
                        >
                          FALSE (Separate)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Consolidate intervals text strings input */}
                  {(prob.id === 'int_merge_pair' || prob.id === 'int_insert') && (
                    <div className="space-y-4 max-w-sm mx-auto text-center">
                      <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl space-y-1">
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">Interval Coordinates:</span>
                        <div className="text-xs text-purple-300 font-bold font-mono">
                          {prob.id === 'int_insert' ? `Intervals: [[1,3],[6,9]] Insert: [2,5]` : `Intervals: [[1,3],[2,6],[8,10]]`}
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[9px] text-slate-400 font-bold uppercase block">Enter consolidated intervals array notation:</label>
                        <input
                          type="text"
                          value={textAnswer}
                          onChange={(e) => setTextAnswer(e.target.value)}
                          className="w-full p-2 bg-slate-950 border border-slate-900 rounded-xl text-center text-xs text-purple-300 focus:outline-none focus:border-purple-500 font-mono"
                          placeholder="e.g. [[1,6], [8,10]]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Meeting rooms selector */}
                  {prob.id === 'int_meetings' && (
                    <div className="space-y-4 max-w-sm mx-auto text-center">
                      <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl space-y-1">
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">Meetings Schedules:</span>
                        <div className="text-xs text-purple-300 font-bold font-mono">
                          [[0, 30], [5, 10], [15, 20]]
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold uppercase block">Minimum conference rooms required:</label>
                        <input
                          type="number"
                          value={windowInputVal || ''}
                          onChange={(e) => setWindowInputVal(parseInt(e.target.value) || 0)}
                          className="w-full p-2 bg-slate-950 border border-slate-900 rounded-xl text-center text-xs text-purple-300 focus:outline-none focus:border-purple-500 font-mono"
                          placeholder="Count rooms needed"
                        />
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 10. MATRICES & FREQUENCY */}
              {prob?.type === 'matrix_op' && (
                <div className="space-y-4 max-w-sm mx-auto text-center">
                  <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl space-y-1">
                    <span className="text-[8px] text-slate-500 block uppercase font-bold">Source Matrix:</span>
                    <div className="text-xs text-purple-300 font-bold font-mono">
                      [[1, 2], [3, 4]]
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[9px] text-slate-400 font-bold uppercase block">
                      {prob.id === 'matrix_spiral' ? 'Enter traversed path sequence (bracket notation):' : 'Enter resulting matrix format:'}
                    </label>
                    <input
                      type="text"
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      className="w-full p-2 bg-slate-950 border border-slate-900 rounded-xl text-center text-xs text-purple-300 focus:outline-none focus:border-purple-500 font-mono"
                      placeholder={prob.id === 'matrix_spiral' ? 'e.g. [1,2,4,3]' : 'e.g. [[1,3],[2,4]]'}
                    />
                  </div>
                </div>
              )}

              {/* Frequency count verify boolean */}
              {prob?.type === 'frequency_count' && (
                <div className="space-y-4 text-center">
                  <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl max-w-sm mx-auto">
                    <span className="text-[8px] text-slate-500 block uppercase font-bold">Frequency Stream array:</span>
                    <div className="text-xs text-cyan-300 font-bold font-mono">[1, 2, 2, 3, 3, 3]</div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => { playSound('click'); setSelectedBoolean(true); }}
                      className={`px-6 py-2 rounded-xl border text-xs font-bold transition-all ${
                        selectedBoolean === true ? 'bg-purple-900/40 border-purple-500 text-purple-200' : 'bg-slate-950 border-slate-900 text-slate-400'
                      }`}
                    >
                      TRUE (All unique frequencies)
                    </button>

                    <button
                      onClick={() => { playSound('click'); setSelectedBoolean(false); }}
                      className={`px-6 py-2 rounded-xl border text-xs font-bold transition-all ${
                        selectedBoolean === false ? 'bg-purple-900/40 border-purple-500 text-purple-200' : 'bg-slate-950 border-slate-900 text-slate-400'
                      }`}
                    >
                      FALSE (Duplicates overlap)
                    </button>
                  </div>
                </div>
              )}

              {/* VERIFICATION HANDLER */}
              <div className="mt-5 pt-4 border-t border-purple-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 uppercase">
                    Status: Interactive simulation telemetry live.
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleVerifyProblem}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 border border-purple-500 text-white text-xs font-bold rounded-xl shadow-[0_4px_15px_rgba(168,85,247,0.3)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>VERIFY & ATTACK BOSS</span>
                  </button>

                  {/* Show NEXT only if solved */}
                  {solvedProblemIds.includes(prob?.id) && activeProblemIdx < selectedLevel.problems.length - 1 && (
                    <button
                      onClick={handleNextProblem}
                      className="px-5 py-2 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 animate-pulse"
                    >
                      <span>NEXT KEY</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* REALTIME SYSTEM TELEMETRY CONSOLE */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 text-left font-mono text-[10px] text-slate-400 space-y-2">
            <span className="font-bold uppercase tracking-widest text-slate-500">Intrusion Sentry Output Streams:</span>
            <div className="h-24 overflow-y-auto space-y-1 custom-scrollbar">
              {consoleLogs.map((log, i) => (
                <div key={i} className={`leading-relaxed ${
                  log.startsWith('✅') ? 'text-emerald-400 font-bold' :
                  log.startsWith('🚨') || log.startsWith('❌') ? 'text-rose-400 font-bold' :
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <div className="bg-slate-950 border-2 border-amber-500/50 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.3)] text-center p-6 space-y-4">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center bg-amber-500/10 rounded-full border-2 border-amber-500 animate-pulse">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] text-amber-400 font-black tracking-widest uppercase">
                  CLEARANCE GRANTED
                </span>
                <h3 className="text-lg font-black tracking-wide text-slate-100">
                  {newAchievement}
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Sector Boss completely eliminated. Handshake saved to local registry.
                </p>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-emerald-400 flex items-center justify-center gap-2">
                <span>🎁 REWARDS: +100 XP • +100 CREDITS</span>
              </div>

              <button
                onClick={() => { playSound('click'); setNewAchievement(null); }}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 border border-purple-500 text-white font-black rounded-xl text-xs uppercase"
              >
                PROCEED TO NESTED GATEWAYS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
