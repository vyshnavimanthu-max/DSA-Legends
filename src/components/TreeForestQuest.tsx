import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Lightbulb, Cpu, Trophy, Send, X, Sliders, TreePine, GitMerge, Eye, Binary, Sparkles, ChevronRight, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileState } from '../types';
import PremiumAudioManager from '../lib/audioManager';

interface TreeForestQuestProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
  onCompleteSector: () => void;
}

export interface QuestProblem {
  id: string;
  title: string;
  type: 'concept' | 'traversal' | 'bst' | 'insertion' | 'deletion' | 'lca' | 'diameter' | 'balanced' | 'serialization' | 'view';
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
    name: "Binary Tree Basics",
    topic: "Structural Mechanics",
    bossName: "Root Sentinel",
    bossTitle: "Origin Sentry",
    bossAvatar: "🌲",
    bossMaxHP: 100,
    bossDialogueGreeting: "I stand at the root of all structures! Master the degree of nodes, leaf properties, and height calculations or get tangled in my branches!",
    bossDialogueDefeated: "You understand the fundamental shapes of tree growth. Proceed into the deeper thicket.",
    rewardAchievementId: "tree_lvl1",
    rewardAchievementName: "Root Explorer",
    problems: [
      {
        id: "node_degrees",
        title: "Node Degrees & Children",
        type: "concept",
        description: "In a binary tree, each node can have at most how many children?",
        objective: "Select the correct maximum degree for any node in a binary tree.",
        hint: "A 'binary' choice is always bifurcated: either zero, one, or two.",
        xpReward: 30,
        pointsReward: 20,
        data: { options: ["1 child", "2 children", "Unlimited children", "4 children"], correctIdx: 1 }
      },
      {
        id: "height_depth",
        title: "Height of Empty Tree",
        type: "concept",
        description: "In conventional computer science, what is the height of an empty binary tree (containing 0 nodes)?",
        objective: "Select the standard height measurement for a null tree.",
        hint: "A tree with a single root node has height 0. An empty tree has one level less.",
        xpReward: 30,
        pointsReward: 20,
        data: { options: ["0", "1", "-1", "Infinity"], correctIdx: 2 }
      },
      {
        id: "perfect_tree_leaves",
        title: "Leaves in Perfect Binary Tree",
        type: "concept",
        description: "A perfect binary tree of height H has all leaves at the same level. How many leaf nodes are present at height H?",
        objective: "Choose the mathematical formula for leaf count.",
        hint: "Each level doubles the number of nodes: level 0 has 2^0, level 1 has 2^1, etc.",
        xpReward: 40,
        pointsReward: 20,
        data: { options: ["2^H", "2^(H+1) - 1", "H^2", "2 * H"], correctIdx: 0 }
      }
    ]
  },
  {
    id: 2,
    name: "DFS Traversal Paths",
    topic: "Depth-First Walkers",
    bossName: "Pre-Post Arbiter",
    bossTitle: "Recursive Pathfinder",
    bossAvatar: "🧙‍♂️",
    bossMaxHP: 110,
    bossDialogueGreeting: "Pre-order, In-order, Post-order! Choose your path carefully, or find yourself trapped in an infinite recursive cycle!",
    bossDialogueDefeated: "Symmetrical stack frames unpacked! Traversal sequences validated.",
    rewardAchievementId: "tree_lvl2",
    rewardAchievementName: "Path Weaver",
    problems: [
      {
        id: "preorder_sequence",
        title: "Pre-order Traversal Order",
        type: "traversal",
        description: "Consider a tree with root A, left child B, and right child C. In what order does Pre-order traversal visit these nodes?",
        objective: "Select the correct visit sequence (Root, Left, Right).",
        hint: "Pre-order means Root comes FIRST.",
        xpReward: 40,
        pointsReward: 25,
        data: { options: ["B, A, C", "B, C, A", "A, B, C", "C, B, A"], correctIdx: 2 }
      },
      {
        id: "inorder_bst",
        title: "In-order BST Sorted Property",
        type: "traversal",
        description: "If we perform an In-order traversal on a Binary Search Tree (BST), what unique mathematical property does the visited node sequence possess?",
        objective: "Choose the sequence sort property.",
        hint: "In-order visits Left, Root, Right. In a BST, Left <= Root <= Right.",
        xpReward: 45,
        pointsReward: 25,
        data: { options: ["Strictly decreasing order", "Strictly increasing sorted order", "Alternating odd and even keys", "Completely random order"], correctIdx: 1 }
      },
      {
        id: "postorder_usecase",
        title: "Post-order Deletion Order",
        type: "traversal",
        description: "When freeing memory or deleting a complete binary tree, which traversal strategy is optimal because it guarantees we visit both children before deleting their parent?",
        objective: "Identify the safest cleanup traversal.",
        hint: "You must delete children first, then root. Left, Right, then Root.",
        xpReward: 45,
        pointsReward: 25,
        data: { options: ["Pre-order", "In-order", "Post-order", "Level-order"], correctIdx: 2 }
      }
    ]
  },
  {
    id: 3,
    name: "BFS Traversal & Width",
    topic: "Breadth-First Fronts",
    bossName: "Wave Shader",
    bossTitle: "Level-Order Governor",
    bossAvatar: "🌊",
    bossMaxHP: 120,
    bossDialogueGreeting: "Concentric waves of discovery shall wash over this forest! Walk my layers level-by-level, or suffer from depth distortion!",
    bossDialogueDefeated: "Wavefronts aligned. Queue-based BFS layers cleared successfully.",
    rewardAchievementId: "tree_lvl3",
    rewardAchievementName: "Wave Sweeper",
    problems: [
      {
        id: "bfs_queue_struct",
        title: "Queue-backed BFS Mechanics",
        type: "traversal",
        description: "Which auxiliary data structure is standard for implementing an iterative level-order (BFS) traversal of a binary tree?",
        objective: "Select the required tracking structure.",
        hint: "We process nodes in the order they are discovered: first in, first out.",
        xpReward: 50,
        pointsReward: 30,
        data: { options: ["LIFO Stack", "FIFO Queue", "Hash Map", "Min-Heap Priority Queue"], correctIdx: 1 }
      },
      {
        id: "bfs_node_visits",
        title: "BFS Node Traversal Trace",
        type: "traversal",
        description: "Given a tree where Root (1) has children Left (2) and Right (3). Node 2 has children (4) and (5). What is the BFS level-by-level visit order?",
        objective: "Select the chronological BFS sequence.",
        hint: "Visit level 0, then level 1, then level 2.",
        xpReward: 50,
        pointsReward: 30,
        data: { options: ["1, 2, 4, 5, 3", "1, 2, 3, 4, 5", "4, 5, 2, 3, 1", "1, 3, 2, 5, 4"], correctIdx: 1 }
      },
      {
        id: "max_width_level",
        title: "Maximum Binary Tree Width",
        type: "traversal",
        description: "In a binary tree of height H (where root is height 0), what is the maximum possible number of nodes that can occupy level H?",
        objective: "Choose the maximum level node count expression.",
        hint: "Each level's maximum width is twice the previous level's: 1 -> 2 -> 4 -> 8...",
        xpReward: 55,
        pointsReward: 30,
        data: { options: ["H^2", "2^H", "2^(H+1)", "H * 2"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 4,
    name: "BST Laws & Validations",
    topic: "Search Tree Invariants",
    bossName: "Binary Arbiter",
    bossTitle: "Range Sentinel",
    bossAvatar: "⚖️",
    bossMaxHP: 125,
    bossDialogueGreeting: "In my domain, order is law! Every left descendant must be smaller, and every right descendant must be larger! Stray from this constraint and face immediate pruning!",
    bossDialogueDefeated: "Tree range constraints validated. Binary Search Tree laws remain unbroken.",
    rewardAchievementId: "tree_lvl4",
    rewardAchievementName: "Invariant Guardian",
    problems: [
      {
        id: "bst_definition",
        title: "The BST Invariant Rule",
        type: "bst",
        description: "For any node N in a Binary Search Tree, what must be true about the keys in N's left subtree and right subtree?",
        objective: "Identify the core search tree constraint.",
        hint: "Left values are strictly less than N; right values are strictly greater than N.",
        xpReward: 50,
        pointsReward: 30,
        data: { options: ["Left keys > N, Right keys < N", "Left keys < N, Right keys > N", "Left keys == Right keys", "Keys must be in alphabetical order only"], correctIdx: 1 }
      },
      {
        id: "bst_validation_bug",
        title: "Validating BST Correctly",
        type: "bst",
        description: "Why is it insufficient to validate a BST by simply checking if each node is greater than its immediate left child and smaller than its immediate right child?",
        objective: "Select the correct validation pitfall.",
        hint: "A node might satisfy its local parent, but violate constraints of ancestors higher up the tree.",
        xpReward: 60,
        pointsReward: 30,
        data: { options: ["It is sufficient; that algorithm is perfect", "A right child's left descendant could be smaller than the grandparent root", "It is too slow to execute", "It fails for single node trees"], correctIdx: 1 }
      },
      {
        id: "bst_search_complexity",
        title: "Average vs Worst Search Complexity",
        type: "bst",
        description: "What are the average-case and worst-case time complexities respectively for searching a key in a BST of N nodes?",
        objective: "Choose the search complexity bounds.",
        hint: "Average case has balanced splits; worst case is a skewed linear list (degenerated tree).",
        xpReward: 65,
        pointsReward: 30,
        data: { options: ["O(log N) average, O(N) worst", "O(1) average, O(log N) worst", "O(N) average, O(N^2) worst", "O(log N) average, O(log N) worst"], correctIdx: 0 }
      }
    ]
  },
  {
    id: 5,
    name: "BST Insertion Dynamics",
    topic: "Grafting Keys",
    bossName: "Sprout Grafter",
    bossTitle: "Leaf Allocator",
    bossAvatar: "🌱",
    bossMaxHP: 130,
    bossDialogueGreeting: "Where will the new seedlings sprout? Track their values down the branches, and place them at the correct leaf terminal!",
    bossDialogueDefeated: "Tree expanded with correct structural inserts! Branch paths remained stable.",
    rewardAchievementId: "tree_lvl5",
    rewardAchievementName: "Seed Sprouter",
    problems: [
      {
        id: "insert_5",
        title: "Sprout Insert Trace",
        type: "insertion",
        description: "Given a BST with Root (10), Left (5), and Right (15). If we insert the key 8, where does it get placed?",
        objective: "Trace the insertion pathway.",
        hint: "Compare 8 to 10 (less, go left), then compare 8 to 5 (greater, go right).",
        xpReward: 55,
        pointsReward: 35,
        data: { options: ["As the left child of 5", "As the right child of 5", "As the left child of 15", "As the new root of the tree"], correctIdx: 1 }
      },
      {
        id: "insert_skews",
        title: "Sequential Insertion Degeneracy",
        type: "insertion",
        description: "If you insert sorted keys [1, 2, 3, 4, 5] sequentially into an initially empty BST, what shape does the tree assume?",
        objective: "Identify the skewed tree layout.",
        hint: "Every new node is larger than the previous, always appending to the right.",
        xpReward: 60,
        pointsReward: 35,
        data: { options: ["Perfect Balanced Tree", "Left-skewed chain", "Right-skewed linear chain", "Completeness layout"], correctIdx: 2 }
      },
      {
        id: "insert_uniqueness",
        title: "Does Insert Order Matter?",
        type: "insertion",
        description: "True or False: Inserting the same set of distinct keys in different orders will always result in identical BST structures.",
        objective: "Confirm BST construction uniqueness.",
        hint: "Think of inserting [1, 2, 3] vs [2, 1, 3]. The root changes depending on what is enqueued first.",
        xpReward: 60,
        pointsReward: 35,
        data: { options: ["True - tree structure is order-independent", "False - insertion order dictates the hierarchical root and branches"], correctIdx: 1 }
      },
      {
        id: "insert_duplicate_policies",
        title: "Duplicate Key Policies",
        type: "insertion",
        description: "In standard implementations of a BST that must support duplicate keys, how are duplicates usually handled?",
        objective: "Select the standard duplicate insertion policy.",
        hint: "Duplicate keys are typically consistently stored in either the left subtree or right subtree, or tracked via a frequency counter on the node.",
        xpReward: 65,
        pointsReward: 35,
        data: { options: ["They are always ignored and discarded", "Stored consistently on either the left or right, or tracked via node counters", "They overwrite the root immediately", "They trigger an automatic tree wipe"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 6,
    name: "BST Deletion Protocols",
    topic: "Node Pruning Cases",
    bossName: "Pruning Claw",
    bossTitle: "Memory Reclaimer",
    bossAvatar: "✂️",
    bossMaxHP: 135,
    bossDialogueGreeting: "To cut a branch is simple, but to remove a node with two subtrees requires surgical pointer transplant! Prove your successor mapping or prepare for severed loops!",
    bossDialogueDefeated: "Pointer transplants successful. Successor and predecessor nodes aligned.",
    rewardAchievementId: "tree_lvl6",
    rewardAchievementName: "Surgical Pruner",
    problems: [
      {
        id: "delete_leaf",
        title: "Case 1: Deleting Leaf Nodes",
        type: "deletion",
        description: "When deleting a node in a BST that has zero children (a leaf node), how is the deletion finalized?",
        objective: "Select the leaf deletion protocol.",
        hint: "Since it has no descendants, we simply sever the parent's pointer to null.",
        xpReward: 60,
        pointsReward: 35,
        data: { options: ["Replace with its successor", "Simply remove the node and update its parent's link to null", "Promote grandparent node", "Requires double tree rotation"], correctIdx: 1 }
      },
      {
        id: "delete_one_child",
        title: "Case 2: Node with One Child",
        type: "deletion",
        description: "If a node to be deleted in a BST has exactly one child, how is it removed without losing the subtree below it?",
        objective: "Identify the single child bypass mechanism.",
        hint: "Think of bypassing a middle-man. Connect grandparent directly to child.",
        xpReward: 65,
        pointsReward: 35,
        data: { options: ["Delete the child as well", "Bypass the node by linking its parent directly to its single child", "Convert tree to a linked list", "Throw an exception"], correctIdx: 1 }
      },
      {
        id: "delete_two_children",
        title: "Case 3: Node with Two Children",
        type: "deletion",
        description: "When deleting a node with TWO children, which node is typically chosen to replace its value to preserve BST invariants?",
        objective: "Select the correct replacement node.",
        hint: "We look for either the largest element in the left subtree (inorder predecessor) or smallest in the right subtree (inorder successor).",
        xpReward: 70,
        pointsReward: 35,
        data: { options: ["The root of the tree", "The nearest sibling node", "The In-order Successor or In-order Predecessor", "A random leaf node"], correctIdx: 2 }
      },
      {
        id: "successor_location",
        title: "Finding the Inorder Successor",
        type: "deletion",
        description: "Where is the In-order Successor of a node N located if N's right child is not null?",
        objective: "Locate the successor in the subtree.",
        hint: "The successor is the next larger value. Go to the right child, then walk as far left as possible.",
        xpReward: 70,
        pointsReward: 35,
        data: { options: ["The rightmost node of N's left subtree", "The leftmost node of N's right subtree", "The immediate parent of N", "The root node"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 7,
    name: "Lowest Common Ancestor (LCA)",
    topic: "Symmetric Convergence",
    bossName: "Genealogy Guide",
    bossTitle: "Split Point Monitor",
    bossAvatar: "🧬",
    bossMaxHP: 140,
    bossDialogueGreeting: "Two nodes walk up the ancestral roots. Where do their branches first merge? Track their lowest common node, or wanders in the wildwoods forever!",
    bossDialogueDefeated: "LCA split coordinates mapped successfully. Convergence point verified.",
    rewardAchievementId: "tree_lvl7",
    rewardAchievementName: "Ancestral Surveyor",
    problems: [
      {
        id: "bst_lca_logic",
        title: "LCA in a BST",
        type: "lca",
        description: "In a BST, how do we find the LCA of two nodes p and q starting from the root node?",
        objective: "Choose the BST ancestor split condition.",
        hint: "Walk down. If both p and q are smaller than root, LCA is in left. If both larger, LCA is in right. Otherwise, root is the split point.",
        xpReward: 65,
        pointsReward: 40,
        data: { options: ["Calculate height of both nodes", "Find the node where the paths to p and q split (one is smaller, one is larger than node)", "Return the leaf closest to p", "Always return the root node"], correctIdx: 1 }
      },
      {
        id: "lca_example_values",
        title: "BST LCA Trace",
        type: "lca",
        description: "Given a BST with Root (20), Left (8), Right (22). Left has children (4) and (12). What is the LCA of nodes 4 and 12?",
        objective: "Identify the LCA node value.",
        hint: "Trace paths: root of subtree containing 4 and 12 is 8.",
        xpReward: 70,
        pointsReward: 40,
        data: { options: ["20", "12", "8", "4"], correctIdx: 2 }
      },
      {
        id: "binary_tree_lca_complexity",
        title: "LCA Binary Tree Complexity",
        type: "lca",
        description: "In a general binary tree (not a BST), we do not have sorted properties. What is the worst-case time complexity of finding LCA?",
        objective: "Identify General LCA complexity bounds.",
        hint: "We must scan both subtrees recursively, which may traverse all N nodes.",
        xpReward: 70,
        pointsReward: 40,
        data: { options: ["O(log N)", "O(N)", "O(1)", "O(N^2)"], correctIdx: 1 }
      },
      {
        id: "lca_missing_node",
        title: "LCA with Missing Nodes",
        type: "lca",
        description: "If one of the target nodes p or q is not actually present in the tree, what should a robust LCA implementation return?",
        objective: "Identify error handling in LCA recursion.",
        hint: "If a node is missing, a standard LCA search that assumes presence might return a false positive. We must return null or verify node existence first.",
        xpReward: 80,
        pointsReward: 40,
        data: { options: ["The present node anyway", "Null (or indicate node not found)", "The root node", "The closest existing leaf"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 8,
    name: "Tree Diameter Bounds",
    topic: "Longest Path Spans",
    bossName: "Spanning Sovereign",
    bossTitle: "Extreme Path Measurer",
    bossAvatar: "📐",
    bossMaxHP: 145,
    bossDialogueGreeting: "What is the longest path across my wooden bones? It might not even pass through the root! Calculate the maximum edge hops, or crumble under the span!",
    bossDialogueDefeated: "Maximum tree diameter identified. Longest path bounds calculated.",
    rewardAchievementId: "tree_lvl8",
    rewardAchievementName: "Span Calculator",
    problems: [
      {
        id: "diameter_definition",
        title: "What is Tree Diameter?",
        type: "diameter",
        description: "The diameter (or width) of a binary tree is defined as:",
        objective: "Select the correct definition of tree diameter.",
        hint: "It's the longest route between any two endpoints (leaves) in the tree.",
        xpReward: 70,
        pointsReward: 40,
        data: { options: ["The number of nodes at the bottom level", "The length of the longest path between any two nodes in a tree", "The sum of all heights", "The depth of the root node"], correctIdx: 1 }
      },
      {
        id: "diameter_root_bypass",
        title: "Diameter Root Bypass",
        type: "diameter",
        description: "True or False: The longest path representing the tree's diameter must always pass through the root node of the tree.",
        objective: "Confirm root presence in diameter path.",
        hint: "Consider a tree with a small right subtree but a massive, highly branched left subtree. The longest path might be entirely within the left subtree.",
        xpReward: 75,
        pointsReward: 40,
        data: { options: ["True - it must always cross the root", "False - the longest path can reside entirely in a deep subtree"], correctIdx: 1 }
      },
      {
        id: "diameter_complexity",
        title: "Optimal Diameter Time Complexity",
        type: "diameter",
        description: "By calculating the height and diameter of each subtree in a single post-order recursive pass, what optimal time complexity can we achieve?",
        objective: "Choose the optimal diameter complexity.",
        hint: "We compute height and diameter together, visiting each node exactly once.",
        xpReward: 80,
        pointsReward: 40,
        data: { options: ["O(N^2)", "O(N log N)", "O(N)", "O(1)"], correctIdx: 2 }
      }
    ]
  },
  {
    id: 9,
    name: "Balanced Trees & AVL",
    topic: "Self-Balancing Gravities",
    bossName: "AVL Balance Warden",
    bossTitle: "Symmetric Rotator",
    bossAvatar: "⚖️",
    bossMaxHP: 150,
    bossDialogueGreeting: "Skewed subtrees throw off my center of gravity! Keep the heights of your subtrees balanced within a factor of one, or experience the corrective force of AVL rotations!",
    bossDialogueDefeated: "Branch balance restored. Left and Right balance factors locked at safe levels.",
    rewardAchievementId: "tree_lvl9",
    rewardAchievementName: "Balance Weaver",
    problems: [
      {
        id: "balance_factor",
        title: "Calculating Balance Factor",
        type: "balanced",
        description: "In an AVL tree, the balance factor of a node N is defined as:",
        objective: "Select the correct balance factor formula.",
        hint: "We subtract the height of the right subtree from the height of the left subtree (or vice-versa).",
        xpReward: 70,
        pointsReward: 40,
        data: { options: ["Height(Left) + Height(Right)", "Height(Left) - Height(Right)", "Height(Left) * Height(Right)", "Depth(Node) - Height(Node)"], correctIdx: 1 }
      },
      {
        id: "avl_allowed_factors",
        title: "Allowed AVL Balance Factors",
        type: "balanced",
        description: "To remain balanced under AVL rules, what are the only allowed balance factors for any node in the tree?",
        objective: "Select the set of valid balance factors.",
        hint: "The absolute height difference between left and right subtrees cannot exceed 1.",
        xpReward: 75,
        pointsReward: 40,
        data: { options: ["0 only", "{-1, 0, 1}", "{-2, -1, 0, 1, 2}", "Any positive integer"], correctIdx: 1 }
      },
      {
        id: "single_left_rotation",
        title: "Single Left Rotation (RR Case)",
        type: "balanced",
        description: "If we insert a node into the right subtree of a right child, causing a balance factor of -2, which rotation fixes the imbalance?",
        objective: "Choose the corrective rotation.",
        hint: "This is a right-heavy skewed line. We perform a single Left rotation on the parent.",
        xpReward: 80,
        pointsReward: 40,
        data: { options: ["Single Right Rotation", "Single Left Rotation", "Left-Right Double Rotation", "Right-Left Double Rotation"], correctIdx: 1 }
      },
      {
        id: "avl_height_bound",
        title: "Strict AVL Height Limit",
        type: "balanced",
        description: "Because of strict height balancing, an AVL tree of N nodes guarantees a maximum search height bounded tightly by what logarithmic limit?",
        objective: "Select the AVL height bounds.",
        hint: "AVL trees are highly balanced, guaranteeing height is always less than approximately 1.44 * log2(N).",
        xpReward: 85,
        pointsReward: 40,
        data: { options: ["O(N)", "O(sqrt(N))", "1.44 * log2(N)", "N log N"], correctIdx: 2 }
      }
    ]
  },
  {
    id: 10,
    name: "Tree Serialization Models",
    topic: "Dumping Trees",
    bossName: "Dumping Archmage",
    bossTitle: "Byte-Stream Compactor",
    bossAvatar: "💾",
    bossMaxHP: 160,
    bossDialogueGreeting: "A tree in memory is a web of pointers! Convert this complex graph into a flat sequence of characters for transit across network sockets, then rehydrate it perfectly!",
    bossDialogueDefeated: "Trees serialized and reconstructed with zero byte leakage.",
    rewardAchievementId: "tree_lvl10",
    rewardAchievementName: "Byte Compactor",
    problems: [
      {
        id: "serialization_concept",
        title: "What is Tree Serialization?",
        type: "serialization",
        description: "Serialization is the process of converting a data structure into a linear format (like a string or byte stream) so it can be saved or transmitted, then reconstructed later.",
        objective: "Identify the primary challenge in tree serialization.",
        hint: "In linear arrays, structural parent-child pointer relationships are lost unless we encode 'null' markers or use dual traversals.",
        xpReward: 75,
        pointsReward: 45,
        data: { options: ["Making the values smaller", "Preserving the parent-child structural layout in a linear sequence", "Sorting the tree values", "Converting keys to floating numbers"], correctIdx: 1 }
      },
      {
        id: "preorder_nulls",
        title: "Serialization with Null Markers",
        type: "serialization",
        description: "If we serialize a binary tree using Pre-order traversal and use '#' to represent null pointers, can we uniquely reconstruct the tree from this single sequence?",
        objective: "Confirm reconstruction uniqueness with nulls.",
        hint: "Yes, embedding null indicators explicitly resolves the ambiguity of where subtrees terminate during DFS pre-order rebuilding.",
        xpReward: 80,
        pointsReward: 45,
        data: { options: ["Yes, the null markers preserve tree boundaries completely", "No, we still need the In-order sequence as well"], correctIdx: 0 }
      },
      {
        id: "traversal_rebuild_requirements",
        title: "Reconstruction with Clean Traversals",
        type: "serialization",
        description: "If we do NOT write null markers, what is the minimum combination of traversals required to uniquely reconstruct a general binary tree?",
        objective: "Identify the required traversal pair.",
        hint: "To locate the root and separate left and right subtrees, we always need In-order paired with either Pre-order or Post-order.",
        xpReward: 85,
        pointsReward: 45,
        data: { options: ["Pre-order and Post-order", "In-order and either Pre-order or Post-order", "Only In-order is enough", "Level-order only"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 11,
    name: "Views & Spatial Projections",
    topic: "Dimensional Tree Views",
    bossName: "Perspective Gazer",
    bossTitle: "Ray-Tracing Watcher",
    bossAvatar: "🔮",
    bossMaxHP: 170,
    bossDialogueGreeting: "Stand on the flanks of my forest! Cast your eyes left, right, top, or bottom. Which nodes block the light? Project the tree shadow correctly!",
    bossDialogueDefeated: "Views and projections verified. Radial silhouettes mapped.",
    rewardAchievementId: "tree_lvl11",
    rewardAchievementName: "Silhouette Master",
    problems: [
      {
        id: "left_view_rule",
        title: "Left View Projection",
        type: "view",
        description: "The Left View of a binary tree is the set of nodes visible when the tree is viewed from the left side. What is the rule to determine which nodes belong in this view?",
        objective: "Select the Left View inclusion rule.",
        hint: "It contains the first node encountered at each level when traversing level-by-level.",
        xpReward: 80,
        pointsReward: 45,
        data: { options: ["Only leaf nodes on the left side", "The first node of each level during level-by-level scanning", "All nodes with keys smaller than the root", "Only odd level nodes"], correctIdx: 1 }
      },
      {
        id: "right_view_example",
        title: "Right View Validation",
        type: "view",
        description: "Given a tree with Root (1). Left is (2), Right is (3). Node 2 has right child (4). If we look from the right, which nodes are visible?",
        objective: "Trace the Right View nodes.",
        hint: "Level 0: 1 is visible. Level 1: 3 is visible (blocks 2). Level 2: 4 is visible.",
        xpReward: 85,
        pointsReward: 45,
        data: { options: ["1, 3, 2", "1, 3, 4", "1, 2, 4", "1, 3"], correctIdx: 1 }
      },
      {
        id: "top_view_vertical",
        title: "Top View & Vertical Columns",
        type: "view",
        description: "To calculate the Top View of a binary tree, we often assign horizontal vertical coordinates. What coordinate shifts are applied when traversing left or right?",
        objective: "Select the vertical coordinate progression.",
        hint: "Going left decreases vertical line position (col - 1); going right increases it (col + 1).",
        xpReward: 90,
        pointsReward: 45,
        data: { options: ["Left: col - 1, Right: col + 1", "Left: col + 1, Right: col - 1", "Left: col - 1, Right: col - 1", "No coordinates are needed"], correctIdx: 0 }
      },
      {
        id: "bottom_view_overwrite",
        title: "Bottom View Overwrite Invariant",
        type: "view",
        description: "In calculating the Bottom View, if multiple nodes fall on the same horizontal vertical line, which node is visible?",
        objective: "Identify the visible bottom node.",
        hint: "The node at the lowest level (deepest) will overwrite higher nodes on that vertical column.",
        xpReward: 90,
        pointsReward: 45,
        data: { options: ["The one closest to the root", "The node at the maximum depth/level on that column", "None, they cancel each other out", "The leftmost node in the tree"], correctIdx: 1 }
      }
    ]
  },
  {
    id: 12,
    name: "Advanced Trees Conquest",
    topic: "Red-Black & Splay Mastery",
    bossName: "Grand Arch-Oak",
    bossTitle: "Master of Balance and Color",
    bossAvatar: "👑",
    bossMaxHP: 190,
    bossDialogueGreeting: "You have scaled the branches! Now, face the ultimate coloring laws of Red-Black trees and the amortized sweeps of Splay tree rotations! Conquer me to secure the forest!",
    bossDialogueDefeated: "Tree Forest secured! The balance equations of advanced structures are fully solved. You are the Grand Druid of Trees!",
    rewardAchievementId: "tree_lvl12",
    rewardAchievementName: "Grand Druid of Trees",
    problems: [
      {
        id: "rb_color_rules",
        title: "Red-Black Coloring Laws",
        type: "bst",
        description: "In a Red-Black self-balancing tree, which color constraints must the root node and any red node's children adhere to?",
        objective: "Select the core Red-Black coloring rule.",
        hint: "The root must always be BLACK, and children of a RED node must always be BLACK (no two adjacent red nodes).",
        xpReward: 90,
        pointsReward: 60,
        data: { options: ["Root can be red; red nodes can have red children", "Root must be black; red nodes must have black children", "All nodes must be red", "Root must be red; black nodes must have red children"], correctIdx: 1 }
      },
      {
        id: "splay_tree_cache",
        title: "Splay Tree Self-Adjustment",
        type: "bst",
        description: "What unique action does a Splay Tree perform whenever a node is successfully accessed or searched?",
        objective: "Choose the splay operation consequence.",
        hint: "Splay trees move the accessed node to the root via rotations to make recently-accessed items instantly queryable in O(1).",
        xpReward: 100,
        pointsReward: 60,
        data: { options: ["It deletes the accessed node", "It splays (rotates) the accessed node up to become the new root", "It colors the node red", "It converts the node into a leaf"], correctIdx: 1 }
      },
      {
        id: "rb_black_height",
        title: "Red-Black Tree Black-Height",
        type: "bst",
        description: "What critical property regarding 'black-height' must be true for all simple paths from any node to its descendant leave nodes in a Red-Black Tree?",
        objective: "Select the black-height symmetry rule.",
        hint: "Every path from a node to any of its leaf descendants must contain the exact same number of black nodes.",
        xpReward: 110,
        pointsReward: 60,
        data: { options: ["Paths must have more red than black nodes", "Every path must contain the exact same number of black nodes", "The path lengths must be prime numbers", "Only the left subtree paths contain black nodes"], correctIdx: 1 }
      },
      {
        id: "splay_amortized_complexity",
        title: "Splay Amortized Bounds",
        type: "bst",
        description: "A splay tree does not guarantee strict O(log N) worst-case height, yet what is its guaranteed AMORTIZED time complexity for standard operations?",
        objective: "Select the amortized splay bounds.",
        hint: "While a single operation can take O(N), any sequence of M operations on N nodes runs in O(log N) average amortized time.",
        xpReward: 120,
        pointsReward: 60,
        data: { options: ["O(N) worst-case and amortized", "O(log N) amortized", "O(1) amortized", "O(N log N) amortized"], correctIdx: 1 }
      }
    ]
  }
];

export default function TreeForestQuest({ profile, onUpdateProfile, onBackToMenu, onCompleteSector }: TreeForestQuestProps) {
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
      `[TREE FOREST] Sector accessed: Level ${lvl.id} - ${lvl.name}`, 
      `[SENTRY] Guarding Spirit ${lvl.bossName} active.`
    ]);
  }, [activeLevelIdx]);

  // Sync Problem selection
  useEffect(() => {
    const prob = selectedLevel.problems[activeProblemIdx];
    if (prob) {
      setShowHint(false);
      setSelectedIdx(null);
      setConsoleLogs(prev => [...prev, `[PARSER] Unpacking node challenge: ${prob.title}`]);
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
      setConsoleLogs(prev => [...prev, "⚠️ No option selected! Specify a node resolution parameter."]);
      playSound('error');
      return;
    }

    let success = false;
    let feedback = '';

    if (selectedIdx === prob.data.correctIdx) {
      success = true;
      feedback = `✅ Correct! Root split verified: ${prob.data.options[selectedIdx]}`;
    } else {
      feedback = `❌ Incorrect branch calibration. Try again!`;
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
          setCurrentDialogue("Impressive cognitive recursion! You bypassed my branch blocks!");
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
              description: `Conquered Level ${selectedLevel.id} of the Tree Forest by proving structural mastery.`,
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

    if (totalLvlSolved === 12) {
      setConsoleLogs(prev => [...prev, "🚨 SECTOR CONQUEST SECURED! TREE FOREST IS COMPLETELY MASTERED!"]);
      setTimeout(() => {
        onCompleteSector();
      }, 3000);
    }
  };

  const prob = selectedLevel.problems[activeProblemIdx];

  return (
    <div className="bg-[#040910] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-mono text-slate-200 w-full">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-950/40">
        <div>
          <div className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">
              TREE FOREST: RECURSIVE BRANCHES
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
            12 Levels • 42 Structured Node Tasks • Balanced Height & View Estimators
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl text-xs flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>CREDITS: <b className="text-emerald-400">{profile.points}</b></span>
          </div>

          <button
            onClick={() => { playSound('powerdown'); onBackToMenu(); }}
            className="px-4 py-1.5 bg-slate-950 border border-emerald-900/40 hover:border-emerald-500/80 text-emerald-300 text-xs font-bold rounded-xl transition-all"
          >
            ← LEAVE FOREST
          </button>
        </div>
      </div>

      {/* LEVEL SELECTION RAIL */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5 mb-6">
        {QUEST_LEVELS.map((lvl, index) => {
          const isSelected = activeLevelIdx === index;
          const isCleared = lvl.problems.every(p => solvedProblemIds.includes(p.id));
          return (
            <button
              key={lvl.id}
              onClick={() => handleLevelSelect(index)}
              className={`relative p-1.5 rounded-lg border text-center transition-all ${
                isSelected 
                  ? 'bg-emerald-950/30 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] text-emerald-200' 
                  : isCleared
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/30'
                  : 'bg-slate-905/30 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300'
              }`}
            >
              <div className="text-[8px] text-slate-400 uppercase font-black">L{lvl.id}</div>
              {isCleared && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 absolute top-1 right-1" />}
            </button>
          );
        })}
      </div>

      {/* MAIN GAMEPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PROBLEM DESCRIPTOR */}
          <div className="bg-[#03060a] border border-emerald-950/80 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded text-[9px] uppercase font-bold tracking-widest">
                Branch Frame {activeProblemIdx + 1} of {selectedLevel.problems.length}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                REWARD: +{prob?.xpReward} XP / +{prob?.pointsReward} Credits
              </span>
            </div>

            <h3 className="text-base font-black text-white">{prob?.title}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{prob?.description}</p>
            
            <div className="mt-4 p-3 bg-emerald-950/10 border border-emerald-950 rounded-xl flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-emerald-300 uppercase font-black block">Forest Objective</span>
                <p className="text-xs text-emerald-200 font-bold">{prob?.objective}</p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE STAGE */}
          <div className="bg-[#020508] border border-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] relative">
            <span className="absolute top-3 left-4 text-[9px] text-slate-500 uppercase font-bold tracking-widest">
              Live Structural Branch Representation
            </span>

            {/* HIGH-END INTERACTIVE VECTOR DISPLAY */}
            <div className="w-full flex flex-col items-center justify-center gap-4 py-6">
              
              {/* STATIC SYMBOLIC GRAPHICAL AID */}
              <div className="flex flex-col items-center mb-4 p-4 bg-slate-950/80 border border-slate-900 rounded-xl">
                <span className="text-[8px] text-slate-500 uppercase font-bold mb-2">Hierarchical Tree Map</span>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 rounded-full border border-emerald-500/50 flex items-center justify-center bg-emerald-950/20 text-emerald-400 text-xs font-bold shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                    Root
                  </div>
                  <div className="h-4 w-[2px] bg-emerald-500/30" />
                  <div className="flex gap-8">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border border-teal-500/30 flex items-center justify-center bg-teal-950/20 text-teal-400 text-xs font-bold">
                        Left
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border border-teal-500/30 flex items-center justify-center bg-teal-950/20 text-teal-400 text-xs font-bold">
                        Right
                      </div>
                    </div>
                  </div>
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
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedIdx === idx ? 'border-emerald-400 bg-emerald-400 text-[#040910]' : 'border-slate-800'
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
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>COMPILE & TRANSPLANT</span>
              </button>

              {solvedProblemIds.includes(prob?.id) && (
                <button
                  onClick={handleNextProblem}
                  className="px-4 py-2.5 bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:border-emerald-500 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <span>NEXT BRN</span>
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
                  <span className="text-xs font-black text-yellow-300 block uppercase tracking-wider">Arboreal Hint:</span>
                  <p className="text-xs text-yellow-200/90 mt-1 leading-relaxed">{prob?.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: BOSS & ENVIRONMENT FEEDBACK */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* BOSS BATTLE SCREEN */}
          <div className="bg-gradient-to-b from-slate-950 to-[#02050c] border border-emerald-950 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-glow opacity-5 pointer-events-none" />

            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-900/60">
              <span className="text-3xl animate-bounce">{selectedLevel.bossAvatar}</span>
              <div>
                <h4 className="text-sm font-black text-white">{selectedLevel.bossName}</h4>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{selectedLevel.bossTitle}</p>
              </div>
            </div>

            {/* BOSS HP BAR */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[10px] font-black text-slate-400">
                <span>FOREST HEALTH</span>
                <span className={bossHP < 30 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}>
                  {bossHP} / {selectedLevel.bossMaxHP} HP
                </span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
                <motion.div 
                  className={`h-full rounded-full ${bossHP < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-green-500'}`}
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
            <div className="mt-4 p-3 bg-emerald-950/10 border border-emerald-950/40 rounded-xl relative">
              <div className="absolute top-2 left-4 w-2 h-2 bg-emerald-950/10 rotate-45 transform -translate-y-4" />
              <p className="text-xs text-emerald-300 italic leading-relaxed">
                "{currentDialogue}"
              </p>
            </div>
          </div>

          {/* COMPILER STREAM LOGS */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 h-[240px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                Arboreal Parser Stream
              </span>
              <button 
                onClick={() => setConsoleLogs([`[TREE FOREST] Streams cleared.`])}
                className="text-[8px] hover:text-white text-slate-600 font-bold"
              >
                CLEAR LOGS
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 text-[10px] font-mono scrollbar-thin">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className={
                  log.startsWith('✅') 
                    ? 'text-emerald-400 font-bold' 
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
            className="fixed bottom-6 right-6 bg-[#030d08] border-2 border-amber-500/80 rounded-2xl p-5 shadow-[0_0_30px_rgba(245,158,11,0.4)] z-50 flex items-center gap-4 max-w-sm"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-2xl animate-spin-slow">
              🏆
            </div>
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest block">Achievement Unlocked!</span>
              <h5 className="text-sm font-black text-white">{newAchievement}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">Defeated the local sector threat in Tree Forest.</p>
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
