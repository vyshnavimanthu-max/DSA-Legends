import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Lightbulb, Cpu, Trophy, Send, X, Sliders, Sparkles, ChevronRight, HelpCircle, Share2, Network, Route, Zap, ShieldAlert, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileState } from '../types';
import PremiumAudioManager from '../lib/audioManager';

interface GraphGalaxyQuestProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
  onCompleteSector: () => void;
}

export interface QuestProblem {
  id: string;
  title: string;
  type: 'concept' | 'dfs' | 'bfs' | 'cycle' | 'topo' | 'dijkstra' | 'mst' | 'unionfind' | 'mastery';
  description: string;
  objective: string;
  hint: string;
  xpReward: number;
  pointsReward: number;
  data: {
    options: string[];
    correctIdx: number;
    graphNodes?: { id: string; label: string; x: number; y: number; active?: boolean }[];
    graphEdges?: { from: string; to: string; weight?: number; active?: boolean }[];
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
    name: "Graph Basics & Representation",
    topic: "Adjacency Lists & Matrices",
    bossName: "Matrix Overseer",
    bossTitle: "Core Grid Validator",
    bossAvatar: "🤖",
    bossMaxHP: 100,
    bossDialogueGreeting: "In my sector, we measure connection density with mathematical matrices. Solve our storage dimensions, or be overwritten as dead references!",
    bossDialogueDefeated: "Data storage efficiency optimal. You represent graph matrices beautifully.",
    rewardAchievementId: "graph_lvl1",
    rewardAchievementName: "Grid Structuralist",
    problems: [
      {
        id: "graph_repr_adj_matrix_space",
        title: "Adjacency Matrix Space Complexity",
        type: "concept",
        description: "To represent a dense graph with V vertices using a standard 2D Adjacency Matrix, what is the strict space complexity required?",
        objective: "Select the correct Big-O space bound for adjacency matrices.",
        hint: "A 2D matrix maps every vertex against every other vertex, regardless of edge counts.",
        xpReward: 30,
        pointsReward: 20,
        data: {
          options: ["O(V + E)", "O(E^2)", "O(V^2)", "O(V * E)"],
          correctIdx: 2,
          graphNodes: [
            { id: '1', label: 'V1', x: 80, y: 80 },
            { id: '2', label: 'V2', x: 220, y: 80 },
            { id: '3', label: 'V3', x: 150, y: 180 }
          ],
          graphEdges: [
            { from: '1', to: '2' },
            { from: '2', to: '3' },
            { from: '3', to: '1' }
          ]
        }
      },
      {
        id: "graph_directed_degree_sum",
        title: "Directed Graph Degrees Summation",
        type: "concept",
        description: "In any directed graph, the sum of the in-degrees of all vertices plus the sum of the out-degrees of all vertices is always equal to what value?",
        objective: "Identify the mathematical degrees-to-edges relationship.",
        hint: "Every single edge starts from exactly one vertex (contributes 1 out-degree) and ends at exactly one vertex (contributes 1 in-degree).",
        xpReward: 35,
        pointsReward: 20,
        data: {
          options: ["The total count of vertices, V", "Exactly double the number of edges, 2E", "The number of edges, E", "V * E"],
          correctIdx: 1
        }
      },
      {
        id: "graph_dense_vs_sparse",
        title: "Adjacency List vs Matrix Efficiency",
        type: "concept",
        description: "For highly sparse graphs where the number of edges is much closer to V than to V^2, why is an Adjacency List heavily preferred over an Adjacency Matrix?",
        objective: "Explain standard graph-density storage trade-offs.",
        hint: "Adjacency lists only store actual active edges, saving considerable memory when many slots would be zero in a matrix.",
        xpReward: 35,
        pointsReward: 20,
        data: {
          options: [
            "Lists allow O(1) vertex lookups instead of O(V) list iteration",
            "Lists store edges in O(V + E) memory space instead of O(V^2)",
            "Lists completely prevent negative weights",
            "Lists automatically sort edges by distance"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 2,
    name: "Depth-First Search (DFS)",
    topic: "Stack-Based Graph Traversal",
    bossName: "DFS Phantom",
    bossTitle: "Deep Recursion Specter",
    bossAvatar: "👻",
    bossMaxHP: 110,
    bossDialogueGreeting: "Dive down my vertex paths recursively! Touch the leaves first, or find your recursion stack in infinite cycle deadlock!",
    bossDialogueDefeated: "Backtracking validated. Your traversal stack frame is elegantly balanced.",
    rewardAchievementId: "graph_lvl2",
    rewardAchievementName: "Recursion Diver",
    problems: [
      {
        id: "dfs_stack_behavior",
        title: "DFS Memory Struct",
        type: "dfs",
        description: "Which computer memory layout or structural architecture governs the order in which vertices are explored during a standard recursive DFS run?",
        objective: "Identify the traversal backing stack pattern.",
        hint: "DFS explores deeply first. It operates with a Last-In-First-Out (LIFO) order.",
        xpReward: 35,
        pointsReward: 20,
        data: {
          options: ["FIFO Queue", "LIFO Stack", "Min-Heap", "Double-Ended Queue"],
          correctIdx: 1,
          graphNodes: [
            { id: 'A', label: 'A', x: 150, y: 50 },
            { id: 'B', label: 'B', x: 80, y: 130 },
            { id: 'C', label: 'C', x: 220, y: 130 },
            { id: 'D', label: 'D', x: 80, y: 210 }
          ],
          graphEdges: [
            { from: 'A', to: 'B' },
            { from: 'A', to: 'C' },
            { from: 'B', to: 'D' }
          ]
        }
      },
      {
        id: "dfs_path_finding",
        title: "DFS Path Capabilities",
        type: "dfs",
        description: "Which of the following problems can DFS resolve perfectly, but WITHOUT guaranteeing the absolute shortest path on unweighted graphs?",
        objective: "Distinguish DFS reachability from optimal unweighted routes.",
        hint: "DFS will follow any deep branch and find a connection if it exists, but it doesn't explore level-by-level.",
        xpReward: 40,
        pointsReward: 20,
        data: {
          options: ["Unweighted shortest path (minimum hops)", "Graph connectivity / finding ANY valid path between nodes", "Minimum Spanning Tree weights", "Topological sorting of cyclic graphs"],
          correctIdx: 1
        }
      },
      {
        id: "dfs_time_complexity",
        title: "Standard DFS Time Bounds",
        type: "dfs",
        description: "What is the standard time complexity for traversing a graph of V vertices and E edges using an Adjacency List with DFS?",
        objective: "Select DFS runtime complexity.",
        hint: "We visit each vertex exactly once, and inspect every adjacency pointer exactly once.",
        xpReward: 45,
        pointsReward: 20,
        data: {
          options: ["O(V * E)", "O(V^2)", "O(V + E)", "O(log(V + E))"],
          correctIdx: 2
        }
      }
    ]
  },
  {
    id: 3,
    name: "Breadth-First Search (BFS)",
    topic: "Queue-Based Layer Expansion",
    bossName: "BFS Voyager",
    bossTitle: "Layer Explorer",
    bossAvatar: "🛰️",
    bossMaxHP: 115,
    bossDialogueGreeting: "I move in waves! Radial scanning in progress. Attempt to bypass my concentric circles of vertex tracking, and get scanned out of bounds!",
    bossDialogueDefeated: "Wave propagation successful. Your level-order queues are pristine.",
    rewardAchievementId: "graph_lvl3",
    rewardAchievementName: "Wave Propagator",
    problems: [
      {
        id: "bfs_queue_behavior",
        title: "BFS Queue Backing",
        type: "bfs",
        description: "Which data structure acts as the structural foundation to track pending vertices in standard Breadth-First Search?",
        objective: "Identify the level-order queue pattern.",
        hint: "BFS explores elements in a First-In-First-Out (FIFO) concentric wave.",
        xpReward: 35,
        pointsReward: 20,
        data: {
          options: ["Stack", "Binary Heap", "First-In-First-Out Queue", "Associative Hash Map"],
          correctIdx: 2,
          graphNodes: [
            { id: '1', label: 'Root', x: 150, y: 50 },
            { id: '2', label: 'L1-A', x: 80, y: 130 },
            { id: '3', label: 'L1-B', x: 220, y: 130 },
            { id: '4', label: 'L2-A', x: 150, y: 210 }
          ],
          graphEdges: [
            { from: '1', to: '2' },
            { from: '1', to: '3' },
            { from: '2', to: '4' }
          ]
        }
      },
      {
        id: "bfs_shortest_path_unweighted",
        title: "Shortest Unweighted Paths",
        type: "bfs",
        description: "Why does standard BFS guarantee finding the shortest path (minimum number of edges) in an unweighted graph starting from a source node?",
        objective: "Explain unweighted radial path optimizations.",
        hint: "BFS expands incrementally level-by-level, so it is guaranteed to hit the target at the earliest level possible.",
        xpReward: 40,
        pointsReward: 20,
        data: {
          options: [
            "Because it uses a heap to track shortest weights",
            "Because it explores nodes in order of strictly increasing distance from the source",
            "Because it ignores back-edges entirely",
            "Because it runs in O(log V) time"
          ],
          correctIdx: 1
        }
      },
      {
        id: "bfs_space_complexity",
        title: "BFS Memory Space Footprint",
        type: "bfs",
        description: "What is the worst-case space complexity of BFS on a graph, and what causes it?",
        objective: "Determine BFS queue memory limits.",
        hint: "In a highly connected or star-shaped graph, almost all nodes might be added to the queue at once.",
        xpReward: 45,
        pointsReward: 20,
        data: {
          options: [
            "O(1) space - it is purely recursive and uses no array storage",
            "O(V) space due to visited trackers and maximum queue size",
            "O(E^2) space due to adjacency list doubling",
            "O(V^V) exponential limits"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 4,
    name: "Connected Components",
    topic: "Disjoint Node Islands",
    bossName: "Archipelago Warden",
    bossTitle: "Island Mapping Director",
    bossAvatar: "🌴",
    bossMaxHP: 120,
    bossDialogueGreeting: "My realm is scattered into many island networks separated by absolute voids! Enumerate each connected cluster accurately, or drift in the isolation voids!",
    bossDialogueDefeated: "All sub-clusters accounted for. Disjoint systems mapped.",
    rewardAchievementId: "graph_lvl4",
    rewardAchievementName: "Island Mapper",
    problems: [
      {
        id: "connected_components_dfs",
        title: "Counting Connected Components",
        type: "dfs",
        description: "To count the number of separate, connected components in an undirected graph, how does one utilize DFS or BFS?",
        objective: "Describe the component enumeration algorithm.",
        hint: "Loop through every node: if it hasn't been visited, launch a new traversal and increment your component counter.",
        xpReward: 40,
        pointsReward: 25,
        data: {
          options: [
            "Run a single DFS from vertex 0 and read stack depth",
            "Loop over all vertices, triggering a new traversal each time an unvisited node is hit, incrementing the tally",
            "Sort all edges by weight and find the median element",
            "Divide total edges by vertices"
          ],
          correctIdx: 1,
          graphNodes: [
            { id: '1', label: 'C1-A', x: 80, y: 80 },
            { id: '2', label: 'C1-B', x: 140, y: 80 },
            { id: '3', label: 'C2-A', x: 220, y: 180 },
            { id: '4', label: 'C2-B', x: 280, y: 180 }
          ],
          graphEdges: [
            { from: '1', to: '2' },
            { from: '3', to: '4' }
          ]
        }
      },
      {
        id: "flood_fill_directions",
        title: "Grid Traversal Directional Matrices",
        type: "concept",
        description: "When performing a flood fill search (like standard island counting on a 2D grid matrix), what is the difference in degrees of freedom between using 4-directional vs 8-directional exploration arrays?",
        objective: "Understand grid path coordinates routing.",
        hint: "4-directional handles up/down/left/right, while 8-directional adds diagonal neighbors.",
        xpReward: 45,
        pointsReward: 25,
        data: {
          options: [
            "4-directional uses recursive stacks while 8-directional uses heaps",
            "4-directional only processes orthogonal offsets, while 8-directional includes diagonal coordinates",
            "They are mathematically identical in all grid shapes",
            "8-directional runs in half the execution time"
          ],
          correctIdx: 1
        }
      },
      {
        id: "strongly_connected_kosaraju",
        title: "Strongly Connected Components (SCC)",
        type: "concept",
        description: "Which algorithmic method finds Strongly Connected Components in a directed graph by reversing edges (transposing the graph) and performing two linear DFS runs?",
        objective: "Identify Kosaraju's algorithm.",
        hint: "This famous algorithm runs a first DFS to sort nodes by finish times, transposes the graph, and runs a second DFS in that order.",
        xpReward: 50,
        pointsReward: 25,
        data: {
          options: ["Kruskal's Algorithm", "Kosaraju's Algorithm", "Kahn's Topological Queue", "Dijkstra's Path Solver"],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 5,
    name: "Cycle Detection",
    topic: "Detecting Deadlocks",
    bossName: "Cycle Sentry",
    bossTitle: "Infinite Loop Interceptor",
    bossAvatar: "🔄",
    bossMaxHP: 130,
    bossDialogueGreeting: "My nodes feed back on themselves in cyclic vortexes! Detect these cycles before your programs loop forever into absolute heat death!",
    bossDialogueDefeated: "Cycles intercepted! Infinite loop vectors terminated.",
    rewardAchievementId: "graph_lvl5",
    rewardAchievementName: "Loop Interceptor",
    problems: [
      {
        id: "cycle_detection_undirected_bfs",
        title: "Undirected Cycle Detection",
        type: "cycle",
        description: "When traversing an undirected graph to detect cycles, how do we distinguish a genuine cycle edge from a simple backward step to the node we just arrived from?",
        objective: "Implement parent tracking in cycle traversal.",
        hint: "We must track the parent of each visited node; hitting a visited node that is NOT the parent indicates a cycle.",
        xpReward: 40,
        pointsReward: 25,
        data: {
          options: [
            "By verifying that edge weights are all positive",
            "By comparing each visited adjacent node against the vertex parent that initiated the current step",
            "By checking if the stack contains exactly 2 elements",
            "By sorting nodes in topological order first"
          ],
          correctIdx: 1,
          graphNodes: [
            { id: '1', label: '1', x: 150, y: 60 },
            { id: '2', label: '2', x: 80, y: 150 },
            { id: '3', label: '3', x: 220, y: 150 }
          ],
          graphEdges: [
            { from: '1', to: '2' },
            { from: '2', to: '3' },
            { from: '3', to: '1' }
          ]
        }
      },
      {
        id: "cycle_detection_directed_color",
        title: "Directed Cycle & Tree Coloring",
        type: "cycle",
        description: "In DFS-based cycle detection for directed graphs, which state indicates the detection of a back-edge (and thus a cycle) using a three-color coloring tracking technique (White = Unvisited, Grey = Visiting, Black = Completed)?",
        objective: "Explain graph back-edges using node color states.",
        hint: "A cycle is found if you encounter a node that is currently in your active recursion path (Grey).",
        xpReward: 45,
        pointsReward: 25,
        data: {
          options: [
            "Hitting a White node",
            "Hitting a Black node",
            "Re-encountering a Grey node (currently in the active recursion stack)",
            "Encountering any root node"
          ],
          correctIdx: 2
        }
      },
      {
        id: "bipartite_graph_cycles",
        title: "Bipartite Graph Constraints",
        type: "cycle",
        description: "A graph is bipartite (2-colorable) if and only if it does NOT contain what type of cycles?",
        objective: "Deduce bipartite odd-length cycle constraints.",
        hint: "Try coloring a triangle (cycle of size 3) with 2 colors: it is impossible because one edge will always bind identical colors.",
        xpReward: 50,
        pointsReward: 25,
        data: {
          options: ["Negative-weight cycles", "Self-loop cycles", "Cycles of odd length", "Cycles of even length"],
          correctIdx: 2
        }
      }
    ]
  },
  {
    id: 6,
    name: "Topological Sorting",
    topic: "Dependency Ordering (DAGs)",
    bossName: "Kahn Scheduler",
    bossTitle: "Dependency Resolver",
    bossAvatar: "📅",
    bossMaxHP: 135,
    bossDialogueGreeting: "Tasks have strict requirements. You cannot compile a project before its headers! Solve my scheduling equations or face dependency compilation errors!",
    bossDialogueDefeated: "Scheduling queue compiled successfully. Zero dependency conflicts.",
    rewardAchievementId: "graph_lvl6",
    rewardAchievementName: "Dependency Resolver",
    problems: [
      {
        id: "topo_sort_dag_condition",
        title: "Topological Ordering Prerequisite",
        type: "topo",
        description: "Which structural condition is an absolute, non-negotiable requirement for a graph to possess a valid topological sorting?",
        objective: "Identify topological DAG constraints.",
        hint: "Cycles make dependency ordering impossible, and undirected edges have no clear start/end direction.",
        xpReward: 45,
        pointsReward: 25,
        data: {
          options: [
            "It must be a complete directed graph with V(V-1) edges",
            "It must be a Directed Acyclic Graph (DAG)",
            "It must be a connected tree",
            "All edge weights must be strictly identical"
          ],
          correctIdx: 1,
          graphNodes: [
            { id: '1', label: 'Job 1', x: 80, y: 100 },
            { id: '2', label: 'Job 2', x: 220, y: 100 },
            { id: '3', label: 'Job 3', x: 150, y: 180 }
          ],
          graphEdges: [
            { from: '1', to: '3' },
            { from: '2', to: '3' }
          ]
        }
      },
      {
        id: "topo_sort_kahns_indegree",
        title: "Kahn's In-Degree Sifting",
        type: "topo",
        description: "In Kahn's Algorithm for topological sorting, which nodes are placed in the processing queue at the beginning of the algorithm?",
        objective: "Understand in-degree queue scheduling.",
        hint: "Nodes with an in-degree of 0 have no outstanding dependencies; they can start immediately.",
        xpReward: 50,
        pointsReward: 25,
        data: {
          options: [
            "Nodes with in-degree equal to 0",
            "Nodes with the maximum out-degree",
            "Leaf nodes with zero out-degree",
            "Nodes that reside in cycle loops"
          ],
          correctIdx: 0
        }
      },
      {
        id: "topo_sort_dfs_postorder",
        title: "DFS Post-Order Topological Sort",
        type: "topo",
        description: "To obtain a topological sort using DFS, you traverse the DAG, push nodes to a tracking list after visiting all of their children, and then execute what final step on the list?",
        objective: "Select post-order reversal sorting mechanics.",
        hint: "Because the deepest nodes are completed first, the list represents a reverse topological sort. We must flip it.",
        xpReward: 55,
        pointsReward: 25,
        data: {
          options: [
            "Sort the list alphabetically",
            "Reverse the entire finished list",
            "Remove all odd index values",
            "Sum the vertex degrees"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 7,
    name: "Dijkstra's Algorithm",
    topic: "Weighted Shortest Paths",
    bossName: "Dijkstra Cartographer",
    bossTitle: "Shortest Path Locator",
    bossAvatar: "🧭",
    bossMaxHP: 145,
    bossDialogueGreeting: "Edges have cost! Paths have weights! Relax my vertex distances, or find your navigation packet routed into dead zones!",
    bossDialogueDefeated: "Shortest-path maps calibrated. Vertex distances minimized perfectly.",
    rewardAchievementId: "graph_lvl7",
    rewardAchievementName: "Path Cartographer",
    problems: [
      {
        id: "dijkstra_greedy_strategy",
        title: "Dijkstra Greedy Optimization",
        type: "dijkstra",
        description: "Dijkstra's algorithm is a greedy algorithm. At each step, which node does it select from the unvisited set to relax next?",
        objective: "Understand Dijkstra's node selection criterion.",
        hint: "Dijkstra grabs the closest node with the current minimum tentative distance.",
        xpReward: 40,
        pointsReward: 30,
        data: {
          options: [
            "The node with the maximum out-degree",
            "The node with the absolute smallest tentative distance from the source",
            "A completely random unvisited node",
            "The node closest to the target destination"
          ],
          correctIdx: 1,
          graphNodes: [
            { id: 'S', label: 'Source', x: 80, y: 130 },
            { id: 'A', label: 'A (dist: 2)', x: 180, y: 70 },
            { id: 'B', label: 'B (dist: 5)', x: 180, y: 190 },
            { id: 'T', label: 'Target', x: 280, y: 130 }
          ],
          graphEdges: [
            { from: 'S', to: 'A', weight: 2 },
            { from: 'S', to: 'B', weight: 5 },
            { from: 'A', to: 'T', weight: 4 },
            { from: 'B', to: 'T', weight: 1 }
          ]
        }
      },
      {
        id: "dijkstra_negative_weights",
        title: "The Negative Weight Barrier",
        type: "dijkstra",
        description: "Why does standard Dijkstra's algorithm fail to guarantee correct shortest paths if a graph contains negative edge weights, even without cycles?",
        objective: "Analyze Dijkstra's negative edge constraints.",
        hint: "Dijkstra assumes that once a node is visited/extracted from the queue, its shortest path is final. Negative edges could make a longer path shorter later on.",
        xpReward: 50,
        pointsReward: 30,
        data: {
          options: [
            "It triggers a divide-by-zero compiler crash",
            "Its greedy assumption is violated; it cannot backtrack to re-update already finalized nodes",
            "It runs in infinite time loops",
            "Negative edge weights can only be stored in adjacency matrices"
          ],
          correctIdx: 1
        }
      },
      {
        id: "dijkstra_time_complexity",
        title: "Dijkstra Heap Optimization Time",
        type: "dijkstra",
        description: "What is the time complexity of Dijkstra's algorithm when using a binary heap (Min-Priority Queue) for vertex extraction on an adjacency list graph?",
        objective: "Determine optimized Dijkstra performance limits.",
        hint: "We extract min O(log V) for V vertices and perform relaxation updates O(log V) across E edges.",
        xpReward: 55,
        pointsReward: 30,
        data: {
          options: ["O(V^2)", "O((V + E) * log V)", "O(V * E)", "O(E^2)"],
          correctIdx: 1
        }
      },
      {
        id: "dijkstra_relaxation_math",
        title: "Dijkstra Relaxation Equation",
        type: "dijkstra",
        description: "During relaxation of edge (u, v) with weight w, what mathematical condition updates the tentative shortest distance to node v?",
        objective: "Identify the edge relaxation equation.",
        hint: "We check if the known path to 'u' plus the step to 'v' is shorter than what we currently know for 'v'.",
        xpReward: 55,
        pointsReward: 30,
        data: {
          options: [
            "If dist[u] * w < dist[v]",
            "If dist[u] + w < dist[v]",
            "If dist[u] - w > dist[v]",
            "If dist[v] + w < dist[u]"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 8,
    name: "Bellman-Ford Algorithm",
    topic: "Negative Edge Routing",
    bossName: "Ford Sentry",
    bossTitle: "Negative Route Inspector",
    bossAvatar: "🚨",
    bossMaxHP: 150,
    bossDialogueGreeting: "Negative weights exist in my matrix depths! Dijkstra will fail here. Prove how to relax all edges sequentially, or fall into cycle sinkholes!",
    bossDialogueDefeated: "Negative paths consolidated. Cycles isolated correctly.",
    rewardAchievementId: "graph_lvl8",
    rewardAchievementName: "Negative Edge Sifter",
    problems: [
      {
        id: "bellman_ford_edge_relaxation",
        title: "Bellman-Ford Relax Iterations",
        type: "concept",
        description: "How many times must Bellman-Ford relax ALL E edges of a graph with V vertices to guarantee finding the shortest path in the absence of negative cycles?",
        objective: "Identify Bellman-Ford iteration bounds.",
        hint: "The maximum possible length of a simple path is V-1 edges.",
        xpReward: 45,
        pointsReward: 30,
        data: {
          options: ["Exactly V times", "Exactly E times", "Exactly V - 1 times", "2 * V times"],
          correctIdx: 2,
          graphNodes: [
            { id: '1', label: '1', x: 80, y: 130 },
            { id: '2', label: '2', x: 180, y: 130 },
            { id: '3', label: '3', x: 280, y: 130 }
          ],
          graphEdges: [
            { from: '1', to: '2', weight: 4 },
            { from: '2', to: '3', weight: -2 }
          ]
        }
      },
      {
        id: "bellman_ford_negative_cycles",
        title: "Negative Cycle Detection Scan",
        type: "concept",
        description: "How does the Bellman-Ford algorithm detect the presence of a negative weight cycle in a graph on its final pass?",
        objective: "Understand negative cycle detection mechanics.",
        hint: "If distance decreases even further on the V-th iteration (after V-1 iterations), a cycle must be actively sucking weight down.",
        xpReward: 55,
        pointsReward: 30,
        data: {
          options: [
            "If the program throws an arithmetic exception",
            "If any distance is successfully updated/reduced further on the V-th edge relaxation pass",
            "If all nodes have their distances drop below zero",
            "If the target queue becomes completely empty"
          ],
          correctIdx: 1
        }
      },
      {
        id: "bellman_ford_vs_dijkstra_speed",
        title: "Bellman-Ford Complexity Cost",
        type: "concept",
        description: "What is the time complexity of the standard Bellman-Ford algorithm on a graph of V vertices and E edges?",
        objective: "Compare Bellman-Ford time complexity.",
        hint: "We loop V-1 times and relax E edges on every single pass.",
        xpReward: 55,
        pointsReward: 30,
        data: {
          options: ["O(V + E)", "O(V * E)", "O(V log E)", "O(E^2)"],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 9,
    name: "Floyd-Warshall Algorithm",
    topic: "All-Pairs Shortest Path (APSP)",
    bossName: "Warshall General",
    bossTitle: "All-Pairs Coordinator",
    bossAvatar: "🔮",
    bossMaxHP: 155,
    bossDialogueGreeting: "What if you must know the shortest path between EVERY pair of vertices? My dynamic equations scan all intermediate steps. Face my triple-nested loops!",
    bossDialogueDefeated: "APSP dynamic matrix calculated. Triple-loops bypassed seamlessly.",
    rewardAchievementId: "graph_lvl9",
    rewardAchievementName: "Global Cartographer",
    problems: [
      {
        id: "floyd_warshall_dp_state",
        title: "Floyd-Warshall DP Transition",
        type: "concept",
        description: "Which of the following equations represents the correct dynamic programming transition step of the Floyd-Warshall algorithm using an intermediate vertex k?",
        objective: "Select Floyd-Warshall DP equation.",
        hint: "We choose the minimum between the path from i to j without k, and the path from i to k plus k to j.",
        xpReward: 50,
        pointsReward: 30,
        data: {
          options: [
            "dist[i][j] = dist[i][j] + dist[i][k] * dist[k][j]",
            "dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])",
            "dist[i][j] = max(dist[i][j], dist[k][j] - dist[i][k])",
            "dist[i][j] = dist[i][k] + dist[k][j]"
          ],
          correctIdx: 1,
          graphNodes: [
            { id: '1', label: 'i', x: 80, y: 150 },
            { id: '2', label: 'k', x: 180, y: 60 },
            { id: '3', label: 'j', x: 280, y: 150 }
          ],
          graphEdges: [
            { from: '1', to: '2', weight: 3 },
            { from: '2', to: '3', weight: 2 },
            { from: '1', to: '3', weight: 7 }
          ]
        }
      },
      {
        id: "floyd_warshall_space_complexity",
        title: "APSP Spatial Footprint",
        type: "concept",
        description: "What is the standard space complexity to store the all-pairs distances for a graph with V vertices in Floyd-Warshall?",
        objective: "Identify the DP grid spatial size.",
        hint: "We store a matrix of size V x V to track distances between any two vertices.",
        xpReward: 55,
        pointsReward: 30,
        data: {
          options: ["O(V + E)", "O(V^2)", "O(V^3)", "O(E^2)"],
          correctIdx: 1
        }
      },
      {
        id: "floyd_warshall_negative_cycle_diag",
        title: "APSP Negative Cycle Diagnostic",
        type: "concept",
        description: "In Floyd-Warshall, how can you easily check the finished distance matrix to confirm if the graph contains a negative weight cycle?",
        objective: "Deduce cycle checks using matrix diagonals.",
        hint: "If a node can reach itself in less than 0 distance, there must be a negative cycle passing through it.",
        xpReward: 60,
        pointsReward: 30,
        data: {
          options: [
            "If any element is null",
            "If the sum of all elements is negative",
            "If any diagonal element dist[i][i] is strictly negative (< 0)",
            "If dist[0][V-1] is smaller than zero"
          ],
          correctIdx: 2
        }
      }
    ]
  },
  {
    id: 10,
    name: "Minimum Spanning Trees",
    topic: "Kruskal's & Prim's Algorithms",
    bossName: "Tree Splicer",
    bossTitle: "Minimum Connector",
    bossAvatar: "🌲",
    bossMaxHP: 160,
    bossDialogueGreeting: "Connect all vertices using the absolute minimal edge weight budget! No cycles allowed. Prune the fat or watch your tree crumble!",
    bossDialogueDefeated: "Spanning tree minimized. All paths consolidated with zero cycles.",
    rewardAchievementId: "graph_lvl10",
    rewardAchievementName: "Forest Architect",
    problems: [
      {
        id: "mst_definition_edges",
        title: "MST Edge Count Invariant",
        type: "mst",
        description: "In any connected undirected graph with V vertices, how many total edges does its Minimum Spanning Tree (MST) contain?",
        objective: "Identify MST edge requirements.",
        hint: "To connect V vertices with the minimum number of lines, you need exactly one less than V.",
        xpReward: 40,
        pointsReward: 35,
        data: {
          options: ["V edges", "V - 1 edges", "V * (V - 1) edges", "E - V edges"],
          correctIdx: 1,
          graphNodes: [
            { id: 'A', label: 'A', x: 80, y: 80 },
            { id: 'B', label: 'B', x: 220, y: 80 },
            { id: 'C', label: 'C', x: 150, y: 180 }
          ],
          graphEdges: [
            { from: 'A', to: 'B', weight: 1 },
            { from: 'B', to: 'C', weight: 2 },
            { from: 'C', to: 'A', weight: 3 }
          ]
        }
      },
      {
        id: "mst_kruskals_greedy",
        title: "Kruskal's Greedy Strategy",
        type: "mst",
        description: "How does Kruskal's algorithm determine which edges are greedily evaluated for addition to the growing Minimum Spanning Tree?",
        objective: "Trace Kruskal's edge sorting pattern.",
        hint: "Kruskal's sorts all edges of the graph from smallest weight to largest first.",
        xpReward: 50,
        pointsReward: 35,
        data: {
          options: [
            "It picks edges radiating out from a random starting vertex",
            "It sorts all edges by weight globally, evaluating them from smallest to largest, skipping those that form cycles",
            "It ignores any edges with odd weights",
            "It evaluates edges in topological order"
          ],
          correctIdx: 1
        }
      },
      {
        id: "mst_prims_vertex",
        title: "Prim's Tree Growth Pattern",
        type: "mst",
        description: "Unlike Kruskal's global edge evaluation, how does Prim's algorithm expand the Minimum Spanning Tree?",
        objective: "Differentiate Prim's growth from Kruskal's.",
        hint: "Prim's begins at a single source vertex and incrementally adds the cheapest edge connecting a tree node to a non-tree node.",
        xpReward: 55,
        pointsReward: 35,
        data: {
          options: [
            "It sorts all edges of the graph first",
            "It grows the MST continuously outward from a single starting vertex, adding the cheapest vertex-to-frontier edge",
            "It uses recursive post-order stack sorting",
            "It connects isolated components pairwise"
          ],
          correctIdx: 1
        }
      },
      {
        id: "mst_unique_vs_multiple",
        title: "Uniqueness of MSTs",
        type: "mst",
        description: "Under what simple condition is a connected undirected graph guaranteed to have exactly ONE unique Minimum Spanning Tree?",
        objective: "Deduce MST uniqueness conditions.",
        hint: "If all edge weights are different, there can never be a tie or duplicate choice during Kruskal/Prim selections.",
        xpReward: 60,
        pointsReward: 35,
        data: {
          options: [
            "If the graph is complete",
            "If all edge weights in the graph are strictly distinct",
            "If the vertex count is an even number",
            "If the graph contains zero cycles"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 11,
    name: "Union-Find (DSU)",
    topic: "Disjoint Set Optimization",
    bossName: "Union Elder",
    bossTitle: "DSU Coordinator",
    bossAvatar: "🧬",
    bossMaxHP: 170,
    bossDialogueGreeting: "Unite disjoint families of nodes under single master representatives! Flatten your trees with path compression, or suffer under linear lookup costs!",
    bossDialogueDefeated: "Path compression operational. Operations running in near-instant amortized time.",
    rewardAchievementId: "graph_lvl11",
    rewardAchievementName: "Disjoint Master",
    problems: [
      {
        id: "union_find_path_compression",
        title: "Path Compression Optimization",
        type: "unionfind",
        description: "In a Disjoint Set Union (DSU) structure, what does 'Path Compression' actively accomplish during a 'find' operation?",
        objective: "Explain path compression mechanics.",
        hint: "It redirects each examined node's parent pointer directly to the root, heavily flattening the tree.",
        xpReward: 50,
        pointsReward: 35,
        data: {
          options: [
            "It deletes redundant edges from the graph",
            "It updates parent pointers of all traversed nodes directly to point to the root, minimizing future traversal depths",
            "It sorts elements of the set in ascending order",
            "It merges odd and even indices"
          ],
          correctIdx: 1,
          graphNodes: [
            { id: 'R', label: 'Root (1)', x: 150, y: 50 },
            { id: '2', label: 'Node 2', x: 150, y: 130 },
            { id: '3', label: 'Node 3', x: 150, y: 210 }
          ],
          graphEdges: [
            { from: '2', to: 'R' },
            { from: '3', to: '2' }
          ]
        }
      },
      {
        id: "union_find_rank_depth",
        title: "Union by Rank Optimization",
        type: "unionfind",
        description: "What is the primary purpose of 'Union by Rank' (or Union by Size) in DSU?",
        objective: "Identify Union by Rank tree-depth limiters.",
        hint: "It ensures the shallower tree is always attached under the deeper tree, keeping overall height minimal.",
        xpReward: 55,
        pointsReward: 35,
        data: {
          options: [
            "To sort vertices numerically before merging",
            "To attach the tree of smaller height/rank under the root of the tree with larger height/rank",
            "To count the number of components",
            "To balance weights in undirected graphs"
          ],
          correctIdx: 1
        }
      },
      {
        id: "union_find_inverse_ackermann",
        title: "DSU Amortized Time Complexity",
        type: "unionfind",
        description: "When BOTH Path Compression and Union by Rank are fully optimized, what is the amortized time complexity per find/union operation for N elements?",
        objective: "Select the inverse Ackermann bound.",
        hint: "It runs in nearly constant time, governed by the extremely slow-growing inverse Ackermann function, α(N).",
        xpReward: 65,
        pointsReward: 35,
        data: {
          options: ["O(log N)", "O(α(N)) - essentially O(1) for all practical inputs", "O(N)", "O(N log N)"],
          correctIdx: 1
        }
      },
      {
        id: "union_find_kruskal_relation",
        title: "Union-Find in Kruskal's MST",
        type: "unionfind",
        description: "Why is Union-Find the ideal data structure to pair with Kruskal's algorithm during Minimum Spanning Tree construction?",
        objective: "Deduce DSU cycle check benefits.",
        hint: "It allows us to check if two edge endpoints are already connected (same set) in almost O(1) time, avoiding cycle insertion.",
        xpReward: 65,
        pointsReward: 35,
        data: {
          options: [
            "Because it sorts edge weights automatically",
            "Because it provides near-instant cycle checking by verifying if edge endpoints belong to the same disjoint set",
            "Because it balances BST heights",
            "Because it deletes leaf nodes"
          ],
          correctIdx: 1
        }
      }
    ]
  },
  {
    id: 12,
    name: "Shortest Paths Mastery",
    topic: "A* Search & Advanced Networks",
    bossName: "GraphGoliath",
    bossTitle: "Supreme Network Master-Core",
    bossAvatar: "🌋",
    bossMaxHP: 200,
    bossDialogueGreeting: "You have scaled my full structural network. Now, face my complete database routing array! Solve my final heuristics and shortest-path paradoxes, or crash under infinite packet congestion!",
    bossDialogueDefeated: "Graph Galaxy fully mapped! All coordinates verified. You are the ultimate Grandmaster Scribe of Graphs!",
    rewardAchievementId: "graph_lvl12",
    rewardAchievementName: "Lord of Graphs",
    problems: [
      {
        id: "astar_heuristic_function",
        title: "A* Search Heuristic Formula",
        type: "mastery",
        description: "In the famous A* Search pathfinding algorithm, what is the mathematical formula used to calculate the priority score f(n) of a vertex n?",
        objective: "Select A* evaluation formula.",
        hint: "It combines the actual cost from start g(n) and the heuristic estimate to target h(n).",
        xpReward: 60,
        pointsReward: 40,
        data: {
          options: [
            "f(n) = g(n) * h(n)",
            "f(n) = g(n) + h(n)",
            "f(n) = h(n) - g(n)",
            "f(n) = g(n) / h(n)"
          ],
          correctIdx: 1,
          graphNodes: [
            { id: 'S', label: 'Start', x: 80, y: 150 },
            { id: 'n', label: 'node (n)', x: 180, y: 150 },
            { id: 'E', label: 'End', x: 280, y: 150 }
          ],
          graphEdges: [
            { from: 'S', to: 'n', weight: 3 },
            { from: 'n', to: 'E', weight: 4 }
          ]
        }
      },
      {
        id: "shortest_path_dag_linear",
        title: "Shortest Path in DAGs",
        type: "mastery",
        description: "What is the absolute fastest time complexity to solve the single-source shortest path problem on a Directed Acyclic Graph (DAG), even with negative edge weights?",
        objective: "Identify linear topological routing bounds.",
        hint: "By processing vertices in topological sort order, we can relax each node's edges exactly once in a single linear pass.",
        xpReward: 65,
        pointsReward: 40,
        data: {
          options: ["O(V^2)", "O(V + E) - linear time", "O(V * E)", "O((V + E) * log V)"],
          correctIdx: 1
        }
      },
      {
        id: "eulerian_path_conditions",
        title: "Eulerian Path Core Degrees",
        type: "mastery",
        description: "An undirected connected graph contains an Eulerian Path (a path visiting every edge exactly once) if and only if what degree condition is met?",
        objective: "Deduce Eulerian path constraints.",
        hint: "We can only have at most two odd-degree vertices (which act as the start and end of the path).",
        xpReward: 70,
        pointsReward: 40,
        data: {
          options: [
            "All vertices must have an odd degree",
            "It has exactly zero or exactly two vertices of odd degree",
            "The count of edges must be prime",
            "Every node degree must be exactly 2"
          ],
          correctIdx: 1
        }
      },
      {
        id: "hamiltonian_np_complete",
        title: "Eulerian vs Hamiltonian Complexity",
        type: "mastery",
        description: "While finding an Eulerian Path (visiting every edge once) is solvable in polynomial O(E) time, what is the complexity class of finding a Hamiltonian Path (visiting every vertex exactly once)?",
        objective: "Deduce Hamiltonian Path complexity bounds.",
        hint: "Finding a Hamiltonian Path is one of Karp's 21 NP-complete problems.",
        xpReward: 75,
        pointsReward: 40,
        data: {
          options: ["Polynomial Time (P)", "NP-Complete", "Logarithmic Time", "O(V) Linear"],
          correctIdx: 1
        }
      },
      {
        id: "network_flow_ford_fulkerson",
        title: "Max-Flow Min-Cut Theorem",
        type: "mastery",
        description: "According to the famous Max-Flow Min-Cut Theorem in network flow systems, the maximum flow of a network is mathematically equal to what value?",
        objective: "Identify maximum flow capacity mappings.",
        hint: "The maximum amount of flow from source to sink is restricted by the capacity of the bottlenecks (the minimum cut).",
        xpReward: 80,
        pointsReward: 40,
        data: {
          options: [
            "The sum of all edge capacities globally",
            "The capacity of the minimum cut that separates source from sink",
            "The maximum node out-degree multiplied by vertex count",
            "The weight of the minimum spanning tree"
          ],
          correctIdx: 1
        }
      },
      {
        id: "graph_galaxy_calibration",
        title: "Selecting Optimal Shortest Path",
        type: "mastery",
        description: "For a real-time global navigation system featuring millions of vertices with positive weights and constant dynamic edge additions, which strategy yields the most optimal pathfinding recalculation speeds?",
        objective: "Analyze shortest-path runtime design criteria.",
        hint: "With positive weights, Dijkstra combined with Fibonacci/Binary Heaps or specialized bi-directional search is the standard, whereas Bellman-Ford is too slow.",
        xpReward: 85,
        pointsReward: 40,
        data: {
          options: [
            "Run Bellman-Ford on every query to catch negative cycles",
            "Run Floyd-Warshall globals hourly",
            "Use Dijkstra's algorithm with priority queues (and bi-directional search or contraction hierarchies) for targeted query updates",
            "Solve via exhaustive Hamiltonian cycles"
          ],
          correctIdx: 2
        }
      }
    ]
  }
];

export default function GraphGalaxyQuest({ profile, onUpdateProfile, onBackToMenu, onCompleteSector }: GraphGalaxyQuestProps) {
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
      `[GRAPH GALAXY] Sector portal accessed: Level ${lvl.id} - ${lvl.name}`, 
      `[VERTEX ENGAGED] Guardian node representative: ${lvl.bossName}`
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
        `[LOG] Parsing graph edges. Vertices: ${prob.data.graphNodes?.length || 'Dynamic'}, Edges: ${prob.data.graphEdges?.length || 'Dynamic'}`
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
      setConsoleLogs(prev => [...prev, "⚠️ Connection route undefined! Select an operational vertex parameter."]);
      playSound('error');
      return;
    }

    let success = false;
    let feedback = '';

    if (selectedIdx === prob.data.correctIdx) {
      success = true;
      feedback = `✅ Vertex calibration correct: ${prob.data.options[selectedIdx]}`;
    } else {
      feedback = `❌ Graph validation conflict. Back-edge or weight relaxation failed!`;
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
          setCurrentDialogue("Curse your shortest-path equations! My edge bounds are expanding!");
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
              description: `Conquered Level ${selectedLevel.id} of the Graph Galaxy by proving advanced graph, cycle, and pathfinding models.`,
              isUnlocked: true,
              ratingValue: 180 + selectedLevel.id * 15
            }
          ];

      onUpdateProfile({
        points: profile.points + 180 + selectedLevel.id * 15,
        achievements: finalAchievements
      });

      setNewAchievement(selectedLevel.rewardAchievementName);
      playSound('win');
    }

    const totalLvlSolved = QUEST_LEVELS.filter(l => 
      l.problems.every(p => solvedProblemIds.includes(p.id))
    ).length;

    if (totalLvlSolved === 12) {
      setConsoleLogs(prev => [...prev, "🚨 SECTOR MASTERY ACHIEVED! THE GRAPH GALAXY NETWORK IS COMPLETELY RECALIBRATED!"]);
      setTimeout(() => {
        onCompleteSector();
      }, 3000);
    }
  };

  const prob = selectedLevel.problems[activeProblemIdx];

  return (
    <div className="bg-[#05040d] border border-violet-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-mono text-slate-200 w-full">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 shadow-[0_0_20px_rgba(139,92,246,0.8)]" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-violet-950/40">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-violet-400 animate-pulse" />
            <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-400">
              GRAPH GALAXY: VERTEX MAP
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
            12 Levels • 42 Network Challenges • DFS, BFS, Dijkstra, Bellman-Ford, Floyd-Warshall & MSTs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl text-xs flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>CREDITS: <b className="text-violet-400">{profile.points}</b></span>
          </div>

          <button
            onClick={() => { playSound('powerdown'); onBackToMenu(); }}
            className="px-4 py-1.5 bg-slate-950 border border-violet-900/40 hover:border-violet-500/80 text-violet-300 text-xs font-bold rounded-xl transition-all"
          >
            ← LEAVE SECTOR
          </button>
        </div>
      </div>

      {/* LEVEL SELECTION RAIL */}
      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-12 gap-1 mb-6">
        {QUEST_LEVELS.map((lvl, index) => {
          const isSelected = activeLevelIdx === index;
          const isCleared = lvl.problems.every(p => solvedProblemIds.includes(p.id));
          return (
            <button
              key={lvl.id}
              onClick={() => handleLevelSelect(index)}
              className={`relative p-2 rounded-xl border text-center transition-all ${
                isSelected 
                  ? 'bg-violet-950/30 border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.3)] text-violet-200' 
                  : isCleared
                  ? 'bg-violet-950/20 border-violet-500/30 text-violet-300 hover:bg-violet-950/30'
                  : 'bg-slate-905/30 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300'
              }`}
            >
              <div className="text-[10px] font-black">{lvl.id}</div>
              <div className="text-[7px] text-slate-400 uppercase tracking-tighter truncate">{lvl.name.split(' ')[0]}</div>
              {isCleared && <CheckCircle2 className="w-2.5 h-2.5 text-violet-400 absolute top-1 right-1" />}
            </button>
          );
        })}
      </div>

      {/* MAIN GAMEPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PROBLEM DESCRIPTOR */}
          <div className="bg-[#04030a] border border-violet-950/80 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="px-2 py-0.5 bg-violet-950 text-violet-400 rounded text-[9px] uppercase font-bold tracking-widest">
                Component {activeProblemIdx + 1} of {selectedLevel.problems.length}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
                REWARD: +{prob?.xpReward} XP / +{prob?.pointsReward} Credits
              </span>
            </div>

            <h3 className="text-base font-black text-white">{prob?.title}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{prob?.description}</p>
            
            <div className="mt-4 p-3 bg-violet-950/10 border border-violet-950 rounded-xl flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-violet-300 uppercase font-black block">Warden Verification Objective</span>
                <p className="text-xs text-violet-200 font-bold">{prob?.objective}</p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE STAGE */}
          <div className="bg-[#020105] border border-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px] relative">
            <span className="absolute top-3 left-4 text-[9px] text-slate-500 uppercase font-bold tracking-widest">
              Live Holographic Graph Network
            </span>

            {/* DYNAMIC SVG GRAPHICS REPRESENTATION */}
            <div className="w-full flex flex-col items-center justify-center gap-6 py-4">
              
              {prob?.data.graphNodes ? (
                <div className="w-full max-w-sm h-48 bg-slate-950/60 border border-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 360 220">
                    {/* Render graph edges */}
                    {prob.data.graphEdges?.map((edge, idx) => {
                      const fromNode = prob.data.graphNodes?.find(n => n.id === edge.from);
                      const toNode = prob.data.graphNodes?.find(n => n.id === edge.to);
                      if (!fromNode || !toNode) return null;
                      
                      const midX = (fromNode.x + toNode.x) / 2;
                      const midY = (fromNode.y + toNode.y) / 2;

                      return (
                        <g key={`edge-${idx}`}>
                          <line
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke={edge.active ? '#a78bfa' : '#334155'}
                            strokeWidth={edge.active ? 2.5 : 1.5}
                            strokeDasharray={prob.type === 'dfs' || prob.type === 'bfs' ? '4,4' : undefined}
                          />
                          {edge.weight !== undefined && (
                            <g>
                              <circle cx={midX} cy={midY - 2} r="8" fill="#090514" stroke="#475569" strokeWidth="1" />
                              <text
                                x={midX}
                                y={midY + 1}
                                textAnchor="middle"
                                fill="#a78bfa"
                                fontSize="8"
                                fontWeight="bold"
                                fontFamily="monospace"
                              >
                                {edge.weight}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}

                    {/* Render graph nodes */}
                    {prob.data.graphNodes.map((node) => (
                      <g key={`node-${node.id}`} className="cursor-pointer">
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="15"
                          fill="#090d1f"
                          stroke={node.active ? '#c084fc' : '#1e293b'}
                          strokeWidth="2"
                        />
                        <text
                          x={node.x}
                          y={node.y + 4}
                          textAnchor="middle"
                          fill={node.active ? '#f472b6' : '#94a3b8'}
                          fontSize="9"
                          fontWeight="black"
                          fontFamily="monospace"
                        >
                          {node.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              ) : (
                <div className="w-full max-w-sm p-4 bg-slate-950/80 border border-slate-900 rounded-xl flex flex-col items-center">
                  <Share2 className="w-8 h-8 text-violet-500/80 animate-pulse mb-2" />
                  <span className="text-[9px] text-slate-500 uppercase font-black text-center">Global Matrix Vector State</span>
                  <span className="text-xs text-violet-400 font-bold text-center mt-1">Multi-level Dynamic Network Coordinates</span>
                </div>
              )}

              {/* OPTIONS MATRIX */}
              <div className="flex flex-col gap-2.5 w-full max-w-md">
                {prob?.data.options?.map((opt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => { playSound('click'); setSelectedIdx(idx); }}
                    className={`p-3 border rounded-xl font-mono text-xs font-bold text-left flex justify-between items-center transition-all ${
                      selectedIdx === idx
                        ? 'bg-violet-950/40 border-violet-500 text-violet-200 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                        : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedIdx === idx ? 'border-violet-400 bg-violet-400 text-[#05040d]' : 'border-slate-800'
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
              <span>{showHint ? 'HIDE SECTOR HINT' : 'REVEAL SECTOR HINT'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleVerifyProblem}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>COMPILE & RELAX EDGE</span>
              </button>

              {solvedProblemIds.includes(prob?.id) && (
                <button
                  onClick={handleNextProblem}
                  className="px-4 py-2.5 bg-violet-950 border border-violet-500/40 text-violet-300 hover:border-violet-500 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <span>NEXT VERTEX</span>
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
                  <span className="text-xs font-black text-yellow-300 block uppercase tracking-wider">Cartographer Scout Tip:</span>
                  <p className="text-xs text-yellow-200/90 mt-1 leading-relaxed">{prob?.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: BOSS & ENVIRONMENT FEEDBACK */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* BOSS BATTLE SCREEN */}
          <div className="bg-gradient-to-b from-slate-950 to-[#04020a] border border-violet-950 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-glow opacity-5 pointer-events-none" />

            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-900/60">
              <span className="text-3xl animate-bounce">{selectedLevel.bossAvatar}</span>
              <div>
                <h4 className="text-sm font-black text-white">{selectedLevel.bossName}</h4>
                <p className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">{selectedLevel.bossTitle}</p>
              </div>
            </div>

            {/* BOSS HP BAR */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[10px] font-black text-slate-400">
                <span>SECTOR SHIELDS</span>
                <span className={bossHP < 30 ? 'text-red-400 animate-pulse' : 'text-violet-400'}>
                  {bossHP} / {selectedLevel.bossMaxHP} HP
                </span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
                <motion.div 
                  className={`h-full rounded-full ${bossHP < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-violet-500 to-purple-500'}`}
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
            <div className="mt-4 p-3 bg-violet-950/10 border border-violet-950/40 rounded-xl relative">
              <div className="absolute top-2 left-4 w-2 h-2 bg-violet-950/10 rotate-45 transform -translate-y-4" />
              <p className="text-xs text-violet-300 italic leading-relaxed">
                "{currentDialogue}"
              </p>
            </div>
          </div>

          {/* COMPILER STREAM LOGS */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 h-[240px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                Holographic Pointer Bus
              </span>
              <button 
                onClick={() => setConsoleLogs([`[GRAPH GALAXY] Paths reset.`])}
                className="text-[8px] hover:text-white text-slate-600 font-bold"
              >
                RESET BUS
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 text-[10px] font-mono scrollbar-thin">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className={
                  log.startsWith('✅') 
                    ? 'text-violet-400 font-bold' 
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
            className="fixed bottom-6 right-6 bg-[#05040d] border-2 border-violet-500/80 rounded-2xl p-5 shadow-[0_0_30px_rgba(139,92,246,0.4)] z-50 flex items-center gap-4 max-w-sm"
          >
            <div className="w-12 h-12 rounded-full bg-violet-500/20 border border-violet-500 flex items-center justify-center text-2xl animate-spin-slow">
              🏆
            </div>
            <div>
              <span className="text-[10px] text-violet-400 uppercase font-black tracking-widest block">Achievement Unlocked!</span>
              <h5 className="text-sm font-black text-white">{newAchievement}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">Defeated the local sector threat in Graph Galaxy.</p>
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
