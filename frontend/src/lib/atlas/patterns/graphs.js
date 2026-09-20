export const graphsPatterns = {
  "DFS": {
    "slug": "graphs-dfs",
    "name": "DFS",
    "topic": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Graph Depth-First Search (Visited Set & Call Stack)",
      "overview": "Traversing connected graph components by exploring each branch to its maximum depth before backtracking.",
      "whatItIs": "Unlike trees, graphs can contain cycles, requiring an explicit `visited` set to prevent infinite recursion.",
      "whyItWorks": "Visiting each vertex and each edge exactly once ensures all reachable nodes are discovered in O(V + E) time.",
      "whenToUse": "Number of Connected Components, Clone Graph, Reconstruct Itinerary, Pacific Atlantic Water Flow.",
      "recognitionSignals": [
        "Traverse all reachable nodes in a graph",
        "Count connected components in undirected graph",
        "Cycle detection with recursion stack"
      ],
      "commonMistakes": [
        "Forgetting the visited check leading to infinite recursion on cyclic graphs",
        "Assuming graph is fully connected when it has multiple disjoint components"
      ],
      "stepLogic": "1. Create visited Set/array.\n2. For each unvisited vertex, invoke dfs(u).\n3. In dfs(u): mark u as visited; for each neighbor v in adj[u]: if (!visited[v]) dfs(v).\n4. Count disconnected component launches."
    },
    "hi": {
      "title": "Graph DFS (Depth-First Search)",
      "overview": "Graph ke sabhi connected nodes ko gehraai tak visit karna visited set maintain karke.",
      "whatItIs": "Recursion se deep branches explore karna; cycle se bachne ke liye `visited` set zaroori hota hai.",
      "whyItWorks": "Har vertex aur edge exactly ek baar visit hoti hai, isliye linear O(V + E) time lagta hai.",
      "whenToUse": "Connected components count karne, Clone graph, Pacific Atlantic water flow mein.",
      "recognitionSignals": [
        "Graph traversal",
        "Connected components count"
      ],
      "commonMistakes": [
        "Visited set bhool kar infinite cycle mein phans jana"
      ],
      "stepLogic": "1. visited Set banayein.\n2. Har unvisited node par dfs chalayein.\n3. dfs mein node ko visited mark karein aur neighbors explore karein."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "Graph DFS Path Exploration",
      "input": "Graph with 4 nodes: 0-1, 1-2, 2-3",
      "description": "DFS starts at 0 -> visits 1 -> visits 2 -> visits 3. Stack shows active recursion path.",
      "description_hi": "DFS 0 se 1, 2, 3 tak gehraai mein visit karta hai.",
      "steps": [
        {
          "activeNode": 0,
          "visited": [
            0
          ],
          "queueOrStack": [
            0
          ],
          "explanation": "Visit start vertex 0",
          "explanation_hi": "Vertex 0 visit hua"
        },
        {
          "activeNode": 1,
          "visited": [
            0,
            1
          ],
          "queueOrStack": [
            0,
            1
          ],
          "explanation": "Explore neighbor 1",
          "explanation_hi": "Neighbor 1 visit hua"
        },
        {
          "activeNode": 2,
          "visited": [
            0,
            1,
            2
          ],
          "queueOrStack": [
            0,
            1,
            2
          ],
          "explanation": "Explore neighbor 2",
          "explanation_hi": "Neighbor 2 visit hua"
        },
        {
          "activeNode": 3,
          "visited": [
            0,
            1,
            2,
            3
          ],
          "queueOrStack": [
            0,
            1,
            2,
            3
          ],
          "explanation": "Explore neighbor 3. All vertices visited!",
          "explanation_hi": "Sabhi nodes visit ho gaye!"
        }
      ],
      "result": [
        0,
        1,
        2,
        3
      ]
    },
    "code": "function countComponents(n, edges) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  \n  const visited = new Set();\n  let count = 0;\n  \n  function dfs(node) {\n    visited.add(node);\n    for (const neighbor of adj[node]) {\n      if (!visited.has(neighbor)) dfs(neighbor);\n    }\n  }\n  \n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) {\n      count++;\n      dfs(i);\n    }\n  }\n  return count;\n}\n\nconsole.log(countComponents(5, [[0,1],[1,2],[3,4]])); // 2",
    "searchSignals": {
      "tags": [
        "graphs",
        "dfs",
        "components"
      ],
      "keywords": [
        "graph dfs",
        "connected components",
        "clone graph"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Number of Islands",
        "difficulty": "Medium",
        "slug": "number-of-islands",
        "url": "https://leetcode.com/problems/number-of-islands/"
      },
      {
        "title": "Clone Graph",
        "difficulty": "Medium",
        "slug": "clone-graph",
        "url": "https://leetcode.com/problems/clone-graph/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Graph Explore",
        "url": "https://leetcode.com/explore/learn/card/graph/",
        "type": "LeetCode"
      }
    ]
  },
  "BFS": {
    "slug": "graphs-bfs",
    "name": "BFS",
    "topic": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Graph Breadth-First Search (Shortest Unweighted Path)",
      "overview": "Exploring graph level-by-level using a FIFO queue to find the shortest path in unweighted graphs.",
      "whatItIs": "Enqueue source with distance 0. For each popped node, inspect neighbors: if unvisited, mark visited and enqueue with dist + 1.",
      "whyItWorks": "Monotonic FIFO queue ensures all nodes at distance d are visited before any node at distance d + 1.",
      "whenToUse": "Word Ladder, Shortest Path in Binary Matrix, Minimum Knight Moves, Rotting Oranges.",
      "recognitionSignals": [
        "Fewest steps/transformations between start and target",
        "Shortest distance in unweighted graph/grid"
      ],
      "commonMistakes": [
        "Marking node visited when popped instead of when pushed (leads to exponential duplicate enqueues)"
      ],
      "stepLogic": "1. Initialize queue = [start], visited = new Set([start]), dist = 0.\n2. While queue not empty:\n   a. Process all nodes at current layer (size = queue.length)\n   b. If curr === target return dist\n   c. For each neighbor: if not visited, mark visited and enqueue\n   d. dist++."
    },
    "hi": {
      "title": "Graph BFS (Shortest Path)",
      "overview": "FIFO Queue ki madad se graph ko layer-by-layer explore karke unweighted graph mein shortest path nikalna.",
      "whatItIs": "Start node se sabhi d distance wale nodes ko d+1 distance se pehle explore karna.",
      "whyItWorks": "FIFO ordering ki wajah se pehli baar target milte hi shortest distance guarantee hota hai.",
      "whenToUse": "Word Ladder, Rotting Oranges, Shortest Path in Binary Matrix mein.",
      "recognitionSignals": [
        "Shortest path in unweighted graph",
        "Fewest moves/steps"
      ],
      "commonMistakes": [
        "Visited mark dequeue ke waqt lagana (enqueue ke waqt lagana zaroori hai)"
      ],
      "stepLogic": "1. queue = [start], visited.add(start).\n2. Layer by layer nodes process karein.\n3. Target milte hi distance return karein."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "Layer-by-Layer BFS Queue Wave",
      "input": "Graph with 4 nodes: 0 connected to 1 and 2, 1 and 2 connected to 3",
      "description": "Layer 0: [0]. Layer 1: [1, 2]. Layer 2: [3]. Shortest distance from 0 to 3 is 2 edges.",
      "description_hi": "Layer 0 se 0, Layer 1 se 1 aur 2, Layer 2 se 3 discover hota hai.",
      "steps": [
        {
          "activeNode": 0,
          "visited": [
            0
          ],
          "queueOrStack": [
            0
          ],
          "explanation": "Queue: [0] (dist = 0)",
          "explanation_hi": "Queue mein 0 hai"
        },
        {
          "activeNode": 1,
          "visited": [
            0,
            1,
            2
          ],
          "queueOrStack": [
            1,
            2
          ],
          "explanation": "Expand 0: Enqueue neighbors 1 and 2 (dist = 1)",
          "explanation_hi": "0 expand hua -> 1 aur 2 add hue"
        },
        {
          "activeNode": 3,
          "visited": [
            0,
            1,
            2,
            3
          ],
          "queueOrStack": [
            3
          ],
          "explanation": "Expand 1 & 2: Enqueue target 3 (dist = 2). Shortest path found!",
          "explanation_hi": "Target 3 mila -> Shortest distance = 2!"
        }
      ],
      "result": 2
    },
    "code": "function shortestPath(n, edges, start, target) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  \n  const visited = new Set([start]);\n  const queue = [start];\n  let dist = 0;\n  \n  while (queue.length) {\n    const size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      if (node === target) return dist;\n      for (const nxt of adj[node]) {\n        if (!visited.has(nxt)) {\n          visited.add(nxt);\n          queue.push(nxt);\n        }\n      }\n    }\n    dist++;\n  }\n  return -1;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "bfs",
        "shortest-path"
      ],
      "keywords": [
        "graph bfs",
        "shortest path unweighted",
        "word ladder"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook",
        "Bloomberg"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Word Ladder",
        "difficulty": "Hard",
        "slug": "word-ladder",
        "url": "https://leetcode.com/problems/word-ladder/"
      },
      {
        "title": "Rotting Oranges",
        "difficulty": "Medium",
        "slug": "rotting-oranges",
        "url": "https://leetcode.com/problems/rotting-oranges/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode BFS Graph Tutorial",
        "url": "https://leetcode.com/explore/learn/card/graph/620/breadth-first-search-in-graph/",
        "type": "LeetCode"
      }
    ]
  },
  "Flood Fill": {
    "slug": "graphs-flood-fill",
    "name": "Flood Fill",
    "topic": "Graphs",
    "difficulty": "Easy",
    "timeComplexity": "O(R * C)",
    "spaceComplexity": "O(R * C)",
    "interviewFrequency": "High",
    "en": {
      "title": "Flood Fill Algorithm (Grid Multi-Directional DFS/BFS)",
      "overview": "Recoloring all contiguous 4-directionally connected cells sharing the same initial color.",
      "whatItIs": "DFS or BFS traversing adjacent grid cells `(r±1, c)` and `(r, c±1)` that match the original target color.",
      "whyItWorks": "Directly overwriting the cell with the new color serves as the visited marker, eliminating auxiliary memory.",
      "whenToUse": "Flood Fill, Number of Islands, Max Area of Island, Surrounded Regions.",
      "recognitionSignals": [
        "Connected component in 2D grid",
        "Recolor connected cells with new color"
      ],
      "commonMistakes": [
        "Infinite recursion when `newColor === originalColor` (must return immediately)"
      ],
      "stepLogic": "1. If image[sr][sc] === color return image.\n2. original = image[sr][sc].\n3. In fill(r, c): if out of bounds or image[r][c] !== original return; image[r][c] = color; fill(r+1, c); fill(r-1, c); fill(r, c+1); fill(r, c-1).\n4. Return image."
    },
    "hi": {
      "title": "Flood Fill Algorithm",
      "overview": "2D grid mein connected cells ko naye color se paint karna DFS ya BFS ke zariye.",
      "whatItIs": "4 directions (up, down, left, right) mein adjacent same-color cells ko visit karke unhe new color dena.",
      "whyItWorks": "Naya color assign karne se cell khud visited ban jata hai, isliye alag visited matrix ki zaroorat nahi padti.",
      "whenToUse": "Flood Fill, Number of Islands questions mein.",
      "recognitionSignals": [
        "2D grid connected component fill",
        "Paint bucket tool logic"
      ],
      "commonMistakes": [
        "Agar naya color purane color ke barabar ho toh infinite loop mein phans jana"
      ],
      "stepLogic": "1. Agar original color === newColor ho toh turant return karein.\n2. 4 directions mein recursive fill call karein.\n3. Updated image return karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "GRAPHS",
      "title": "Flood Fill Connected Recolor",
      "input": [
        [
          1,
          1,
          1
        ],
        [
          1,
          1,
          0
        ],
        [
          1,
          0,
          1
        ]
      ],
      "description": "Replace 1s connected to (1,1) with color 2. Isolated bottom-right 1 is untouched.",
      "description_hi": "Connected 1s ko 2 mein badal diya. Alag thalag wala 1 waise hi raha.",
      "steps": [
        {
          "row": 1,
          "col": 1,
          "cellVal": "color=2",
          "explanation": "Start at (1,1): color changed to 2",
          "explanation_hi": "(1,1) color 2 hua"
        },
        {
          "row": 0,
          "col": 0,
          "cellVal": "all connected 1s -> 2",
          "explanation": "All 5 connected cells recolored to 2!",
          "explanation_hi": "Saare connected cells 2 ban gaye!"
        }
      ],
      "result": [
        [
          2,
          2,
          2
        ],
        [
          2,
          2,
          0
        ],
        [
          2,
          0,
          1
        ]
      ]
    },
    "code": "function floodFill(image, sr, sc, color) {\n  const orig = image[sr][sc];\n  if (orig === color) return image;\n  \n  function dfs(r, c) {\n    if (r < 0 || r >= image.length || c < 0 || c >= image[0].length) return;\n    if (image[r][c] !== orig) return;\n    image[r][c] = color;\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  \n  dfs(sr, sc);\n  return image;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "dfs",
        "grid"
      ],
      "keywords": [
        "flood fill",
        "grid dfs",
        "number of islands"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Flood Fill",
        "difficulty": "Easy",
        "slug": "flood-fill",
        "url": "https://leetcode.com/problems/flood-fill/"
      },
      {
        "title": "Number of Islands",
        "difficulty": "Medium",
        "slug": "number-of-islands",
        "url": "https://leetcode.com/problems/number-of-islands/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Flood Fill Editorial",
        "url": "https://leetcode.com/problems/flood-fill/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Topological Sort": {
    "slug": "graphs-topological-sort",
    "name": "Topological Sort",
    "topic": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Topological Sort (Kahn's Algorithm / In-degree BFS)",
      "overview": "Linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u comes before v.",
      "whatItIs": "Kahn's algorithm calculates in-degrees of all vertices. Vertices with in-degree 0 (no prerequisites) are added to queue. As vertices are processed, decrement in-degrees of neighbors.",
      "whyItWorks": "A DAG must have at least one vertex with in-degree 0. If processed count < total vertices, a directed cycle exists.",
      "whenToUse": "Course Schedule I & II, Alien Dictionary, Build Order, Sequence Reconstruction.",
      "recognitionSignals": [
        "Task dependency order",
        "Prerequisites before courses",
        "Directed cycle detection in dependency graph"
      ],
      "commonMistakes": [
        "Applying topological sort to undirected graphs or graphs containing cycles without cycle detection"
      ],
      "stepLogic": "1. Compute in-degree for all vertices; build adjacency list.\n2. Push all vertices with in-degree === 0 into queue.\n3. While queue not empty: pop u, append to topoOrder; for v in adj[u]: inDegree[v]--; if inDegree[v] === 0 push v to queue.\n4. If topoOrder.length === numCourses return topoOrder; else cycle exists."
    },
    "hi": {
      "title": "Topological Sort (Kahn's Algorithm)",
      "overview": "Directed Acyclic Graph (DAG) mein dependencies ke hisab se courses ya tasks ka linear valid order nikalna.",
      "whatItIs": "In-degree (kitne prerequisites hain) count karke jinki in-degree 0 hai unhe queue se pehle process karna.",
      "whyItWorks": "DAG mein hamesha kam se kam ek 0 in-degree node hota hai. Agar saare nodes process nahi hue toh cycle maujood hai.",
      "whenToUse": "Course Schedule I & II, Alien Dictionary mein.",
      "recognitionSignals": [
        "Course prerequisites",
        "Dependency ordering",
        "Cycle detection in directed graph"
      ],
      "commonMistakes": [
        "Directed cycle detect na kar pana (processed count < N check karna zaroori hai)"
      ],
      "stepLogic": "1. In-degrees compute karein.\n2. 0 in-degree wale nodes queue mein daalein.\n3. Pop karke neighbors ki in-degree ghatayein, 0 hote hi queue mein push karein.\n4. Total count match ho toh valid order return karein."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "Kahn's Algorithm In-Degree Depletion",
      "input": "Courses: 0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3",
      "description": "Course 0 has in-degree 0 (taken first). Enables 1 and 2, which enables 3. Order: [0, 1, 2, 3].",
      "description_hi": "Course 0 pehle liya jata hai, fir 1 aur 2, fir aakhiri mein 3.",
      "steps": [
        {
          "activeNode": 0,
          "visited": [
            0
          ],
          "queueOrStack": [
            0
          ],
          "explanation": "Node 0 has in-degree 0 -> enqueue 0",
          "explanation_hi": "0 ki in-degree 0 hai"
        },
        {
          "activeNode": 1,
          "visited": [
            0,
            1,
            2
          ],
          "queueOrStack": [
            1,
            2
          ],
          "explanation": "Process 0: in-degree of 1 and 2 becomes 0 -> enqueue [1, 2]",
          "explanation_hi": "0 process hua -> 1 aur 2 unlock hue"
        },
        {
          "activeNode": 3,
          "visited": [
            0,
            1,
            2,
            3
          ],
          "queueOrStack": [
            3
          ],
          "explanation": "Process 1 & 2: in-degree of 3 becomes 0 -> enqueue 3. Order: [0, 1, 2, 3]!",
          "explanation_hi": "3 unlock hua -> Valid order complete!"
        }
      ],
      "result": [
        0,
        1,
        2,
        3
      ]
    },
    "code": "function findOrder(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({ length: numCourses }, () => []);\n  \n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n    inDegree[course]++;\n  }\n  \n  const queue = [];\n  for (let i = 0; i < numCourses; i++) {\n    if (inDegree[i] === 0) queue.push(i);\n  }\n  \n  const order = [];\n  while (queue.length) {\n    const u = queue.shift();\n    order.push(u);\n    for (const v of adj[u]) {\n      inDegree[v]--;\n      if (inDegree[v] === 0) queue.push(v);\n    }\n  }\n  return order.length === numCourses ? order : [];\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "topological-sort",
        "dag"
      ],
      "keywords": [
        "course schedule",
        "topological sort",
        "kahns algorithm"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Course Schedule",
        "difficulty": "Medium",
        "slug": "course-schedule",
        "url": "https://leetcode.com/problems/course-schedule/"
      },
      {
        "title": "Course Schedule II",
        "difficulty": "Medium",
        "slug": "course-schedule-ii",
        "url": "https://leetcode.com/problems/course-schedule-ii/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Topological Sort Tutorial",
        "url": "https://leetcode.com/explore/learn/card/graph/623/kahns-algorithm-for-topological-sorting/",
        "type": "LeetCode"
      }
    ]
  },
  "Union Find": {
    "slug": "graphs-union-find",
    "name": "Union Find",
    "topic": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(α(N)) nearly O(1)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Disjoint Set Union (Path Compression & Union by Rank)",
      "overview": "Tracking elements partitioned into disjoint subsets with near constant-time union and find operations.",
      "whatItIs": "`find(x)` recursively flattens parent pointers to root (path compression). `union(x, y)` attaches smaller tree under root of larger tree (union by rank).",
      "whyItWorks": "Path compression and union by rank reduce tree depth to inverse Ackermann function α(N) <= 4 for all practical inputs.",
      "whenToUse": "Redundant Connection (cycle in undirected graph), Number of Connected Components, Kruskal's MST, Accounts Merge.",
      "recognitionSignals": [
        "Dynamic connectivity queries",
        "Detect cycle while adding undirected edges incrementally"
      ],
      "commonMistakes": [
        "Omitting path compression (degrades find to O(N))",
        "Unioning by node IDs instead of by root representatives (`find(x) === find(y)`)"
      ],
      "stepLogic": "1. Initialize parent[i] = i, rank[i] = 0.\n2. find(i): if parent[i] !== i parent[i] = find(parent[i]); return parent[i].\n3. union(i, j): rootI = find(i), rootJ = find(j); if rootI === rootJ return false (cycle!); attach smaller rank root to larger rank root."
    },
    "hi": {
      "title": "Union Find (DSU)",
      "overview": "Disjoint subsets ko maintain karna aur check karna ki do elements same component mein hain ya nahi nearly O(1) time mein.",
      "whatItIs": "Path compression se parent pointer seedha root par link ho jata hai, aur rank se tree chhota rehta hai.",
      "whyItWorks": "Inverse Ackermann time complexity α(N) practically constant time O(1) hoti hai.",
      "whenToUse": "Cycle detection in undirected graphs, Kruskal MST, Accounts Merge mein.",
      "recognitionSignals": [
        "Dynamic connectivity",
        "Undirected graph cycle detection"
      ],
      "commonMistakes": [
        "Path compression miss kar dena",
        "Roots nikaale bina direct nodes ko union kar dena"
      ],
      "stepLogic": "1. parent[i] = i set karein.\n2. find mein path flatten karein.\n3. union mein roots compare karein; barabar ho toh cycle detect hui, warna merge karein."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "DSU Cycle Detection",
      "input": "Edges: [1,2], [1,3], [2,3]",
      "description": "Edge [2,3] connects nodes that already share root 1 -> Cycle detected! Redundant edge = [2,3].",
      "description_hi": "Edge [2,3] connect karte waqt dono ka root 1 pehle se tha -> Cycle detect hui!",
      "steps": [
        {
          "activeNode": 1,
          "visited": [
            1,
            2
          ],
          "queueOrStack": [
            1
          ],
          "explanation": "Union(1, 2): root(2) = 1",
          "explanation_hi": "1 aur 2 merge hue"
        },
        {
          "activeNode": 1,
          "visited": [
            1,
            2,
            3
          ],
          "queueOrStack": [
            1
          ],
          "explanation": "Union(1, 3): root(3) = 1",
          "explanation_hi": "1 aur 3 merge hue"
        },
        {
          "activeNode": 2,
          "visited": [
            1,
            2,
            3
          ],
          "queueOrStack": [
            1
          ],
          "explanation": "Union(2, 3): find(2) === find(3) === 1! Cycle found at [2, 3]!",
          "explanation_hi": "find(2) == find(3) == 1 -> Cycle detect hui!"
        }
      ],
      "result": [
        2,
        3
      ]
    },
    "code": "class DSU {\n  constructor(n) {\n    this.parent = Array.from({ length: n + 1 }, (_, i) => i);\n    this.rank = new Array(n + 1).fill(0);\n  }\n  find(x) {\n    if (this.parent[x] !== x) {\n      this.parent[x] = this.find(this.parent[x]); // Path compression\n    }\n    return this.parent[x];\n  }\n  union(x, y) {\n    const rx = this.find(x), ry = this.find(y);\n    if (rx === ry) return false; // Already connected (cycle!)\n    if (this.rank[rx] < this.rank[ry]) {\n      this.parent[rx] = ry;\n    } else if (this.rank[rx] > this.rank[ry]) {\n      this.parent[ry] = rx;\n    } else {\n      this.parent[ry] = rx;\n      this.rank[rx]++;\n    }\n    return true;\n  }\n}\n\nfunction findRedundantConnection(edges) {\n  const dsu = new DSU(edges.length);\n  for (const [u, v] of edges) {\n    if (!dsu.union(u, v)) return [u, v];\n  }\n  return [];\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "union-find",
        "dsu"
      ],
      "keywords": [
        "disjoint set union",
        "redundant connection",
        "dsu cycle"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Redundant Connection",
        "difficulty": "Medium",
        "slug": "redundant-connection",
        "url": "https://leetcode.com/problems/redundant-connection/"
      },
      {
        "title": "Accounts Merge",
        "difficulty": "Medium",
        "slug": "accounts-merge",
        "url": "https://leetcode.com/problems/accounts-merge/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode DSU Guide",
        "url": "https://leetcode.com/explore/learn/card/graph/618/disjoint-set/",
        "type": "LeetCode"
      }
    ]
  },
  "Dijkstra": {
    "slug": "graphs-dijkstra",
    "name": "Dijkstra",
    "topic": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O((V + E) log V)",
    "spaceComplexity": "O(V + E)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Dijkstra's Shortest Path Algorithm (Non-Negative Weights)",
      "overview": "Finding the shortest paths from a single source vertex to all other vertices in a weighted graph with non-negative edge weights.",
      "whatItIs": "Greedy exploration using a Min-Priority Queue. Always pop the unvisited vertex with the minimum tentative distance and relax all outgoing edges.",
      "whyItWorks": "Greedy choice property: because all edge weights are >= 0, once a vertex is popped with minimum distance, no alternative path through remaining unvisited vertices can improve that distance.",
      "whenToUse": "Network Delay Time, Path with Maximum Probability, Cheapest Flights Within K Stops (modified).",
      "recognitionSignals": [
        "Shortest path in weighted graph with non-negative weights",
        "Minimum time or cost to reach all nodes"
      ],
      "commonMistakes": [
        "Applying Dijkstra to graphs with negative weight edges (fails, use Bellman-Ford)",
        "Not skipping obsolete queue entries (`if (d > dist[u]) continue`)"
      ],
      "stepLogic": "1. dist array filled with Infinity; dist[src] = 0; MinPriorityQueue initialized with [0, src].\n2. While queue not empty:\n   a. [d, u] = queue.pop()\n   b. If d > dist[u] continue (obsolete)\n   c. For each neighbor [v, weight]: if (dist[u] + weight < dist[v]): dist[v] = dist[u] + weight; queue.push([dist[v], v]).\n3. Return dist."
    },
    "hi": {
      "title": "Dijkstra's Shortest Path Algorithm",
      "overview": "Non-negative edge weights wale graph mein single source se sabhi nodes ka shortest distance O((V+E) log V) mein nikalna.",
      "whatItIs": "Min-Priority Queue se hamesha sabse kam tentative distance wale node ko pop karke uske outgoing edges ko relax karna.",
      "whyItWorks": "Kyunki koi bhi edge negative nahi hai, ek baar pop hua node permanently optimal distance achieve kar leta hai.",
      "whenToUse": "Network Delay Time, Shortest Path in weighted graph mein.",
      "recognitionSignals": [
        "Weighted graph shortest path",
        "Non-negative weights"
      ],
      "commonMistakes": [
        "Negative edges par Dijkstra chalana (infinite loop ya galat answer)",
        "Outdated priority queue entries skip na karna"
      ],
      "stepLogic": "1. dist array ko Infinity karein, dist[src] = 0.\n2. Min-Heap mein [0, src] daalein.\n3. Pop karein aur outgoing edges relax karein: agar dist[u] + weight < dist[v] ho toh update karein aur push karein."
    },
    "visual": {
      "type": "SHORTEST_PATH",
      "category": "GRAPHS",
      "title": "Dijkstra Relaxation on Weighted Graph",
      "input": "Graph: A->B (wt 4), A->C (wt 2), C->D (wt 1), B->D (wt 3). Start = A, Target = D.",
      "description": "Relax A->C (dist 2) then C->D (dist 3). Path A -> C -> D has total cost 3, beating A -> B -> D (cost 7).",
      "description_hi": "A se C (2) aur C se D (1) total cost 3 banti hai, jo shortest path hai.",
      "steps": [
        {
          "activeNode": "A",
          "distances": {
            "A": 0,
            "B": 4,
            "C": 2,
            "D": null
          },
          "explanation": "Start at A (dist=0). Relax edges: B=4, C=2",
          "explanation_hi": "A se B=4 aur C=2 relax hue"
        },
        {
          "activeNode": "C",
          "distances": {
            "A": 0,
            "B": 4,
            "C": 2,
            "D": 3
          },
          "explanation": "Pop minimum C (dist=2). Relax C->D: dist[D] = 2 + 1 = 3!",
          "explanation_hi": "C pop hua -> D ka distance 3 hua"
        },
        {
          "activeNode": "D",
          "distances": {
            "A": 0,
            "B": 4,
            "C": 2,
            "D": 3
          },
          "explanation": "Pop D (dist=3). Shortest path A -> C -> D confirmed!",
          "explanation_hi": "Shortest path A -> C -> D confirm ho gaya!"
        }
      ],
      "result": {
        "shortestCost": 3,
        "path": [
          "A",
          "C",
          "D"
        ]
      }
    },
    "code": "function networkDelayTime(times, n, k) {\n  const adj = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v, w] of times) adj[u].push([v, w]);\n  \n  const dist = new Array(n + 1).fill(Infinity);\n  dist[k] = 0;\n  \n  // Simulated priority queue with array\n  const pq = [[0, k]];\n  \n  while (pq.length) {\n    pq.sort((a, b) => a[0] - b[0]);\n    const [d, u] = pq.shift();\n    if (d > dist[u]) continue;\n    \n    for (const [v, w] of adj[u]) {\n      if (dist[u] + w < dist[v]) {\n        dist[v] = dist[u] + w;\n        pq.push([dist[v], v]);\n      }\n    }\n  }\n  \n  let maxWait = 0;\n  for (let i = 1; i <= n; i++) {\n    if (dist[i] === Infinity) return -1;\n    maxWait = Math.max(maxWait, dist[i]);\n  }\n  return maxWait;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "dijkstra",
        "shortest-path",
        "priority-queue"
      ],
      "keywords": [
        "dijkstra algorithm",
        "network delay time",
        "single source shortest path"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft",
        "Uber"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Network Delay Time",
        "difficulty": "Medium",
        "slug": "network-delay-time",
        "url": "https://leetcode.com/problems/network-delay-time/"
      },
      {
        "title": "Path with Maximum Probability",
        "difficulty": "Medium",
        "slug": "path-with-maximum-probability",
        "url": "https://leetcode.com/problems/path-with-maximum-probability/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Dijkstra Tutorial",
        "url": "https://leetcode.com/explore/learn/card/graph/622/single-source-shortest-path-algorithm/3862/",
        "type": "LeetCode"
      },
      {
        "name": "CP-Algorithms Dijkstra",
        "url": "https://cp-algorithms.com/graph/dijkstra.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Bellman Ford": {
    "slug": "graphs-bellman-ford",
    "name": "Bellman Ford",
    "topic": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(V * E)",
    "spaceComplexity": "O(V)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Bellman-Ford Algorithm (Negative Weight Edges & Cycles)",
      "overview": "Single-source shortest path algorithm supporting negative edge weights and detecting negative-weight cycles.",
      "whatItIs": "Relax all E edges (V - 1) consecutive times. If any edge can still be relaxed on the V-th iteration, a negative cycle exists.",
      "whyItWorks": "A simple shortest path in a graph of V vertices contains at most V - 1 edges. Repeating relaxation guarantees optimal propagation.",
      "whenToUse": "Cheapest Flights Within K Stops (relaxed K+1 times), graphs with negative weights, detecting negative arbitrage cycles in currency exchange.",
      "recognitionSignals": [
        "Shortest path with negative edge weights",
        "Negative cycle detection",
        "Path constrained to at most K stops"
      ],
      "commonMistakes": [
        "Mutating the distance array directly during K-stops iteration instead of using a cloned snapshot of previous distances"
      ],
      "stepLogic": "1. dist = array of Infinity; dist[src] = 0.\n2. Repeat (V - 1) times: for each edge (u, v, w): if dist[u] + w < dist[v] dist[v] = dist[u] + w.\n3. Run 1 more pass: if any edge can still relax, negative cycle exists."
    },
    "hi": {
      "title": "Bellman-Ford Algorithm",
      "overview": "Negative edge weights wale graph mein shortest path nikalna aur negative cycle detect karna.",
      "whatItIs": "Saare edges ko (V - 1) bar relax karna. Agar V-th round mein bhi koi edge relax ho rahi ho toh negative cycle hai.",
      "whyItWorks": "V vertices wale graph mein simple shortest path zyada se zyada V-1 edges lamba ho sakta hai.",
      "whenToUse": "Negative weights, Cheapest Flights Within K Stops, Currency Arbitrage problems mein.",
      "recognitionSignals": [
        "Negative edge weights",
        "Detect negative cycle"
      ],
      "commonMistakes": [
        "K stops problem mein pichli step ka snapshot clone na karna jisse ek hi round mein multiple edges traverse ho jayein"
      ],
      "stepLogic": "1. dist[src] = 0, baaki Infinity.\n2. (V-1) bar saari edges relax karein.\n3. Ek extra pass mein check karein agar distance abhi bhi ghat raha ho toh negative cycle exist karti hai."
    },
    "visual": {
      "type": "SHORTEST_PATH",
      "category": "GRAPHS",
      "title": "Bellman-Ford Relaxation Passes",
      "input": "4 vertices: Edge relaxation across V-1 = 3 passes.",
      "description": "Pass 1 relaxes direct edges. Pass 2 propagates 2-edge paths. Pass 3 reaches optimal distances.",
      "description_hi": "3 passes mein saare paths settle ho jate hain.",
      "steps": [
        {
          "activeNode": "Pass 1",
          "distances": {
            "S": 0,
            "A": 4,
            "B": 5,
            "C": null
          },
          "explanation": "Pass 1 relaxes direct edges from S",
          "explanation_hi": "Pass 1 complete"
        },
        {
          "activeNode": "Pass 2",
          "distances": {
            "S": 0,
            "A": 4,
            "B": 2,
            "C": 6
          },
          "explanation": "Pass 2 settles 2-edge paths including negative weights",
          "explanation_hi": "Pass 2 settle hua"
        },
        {
          "activeNode": "Pass 3",
          "distances": {
            "S": 0,
            "A": 4,
            "B": 2,
            "C": 4
          },
          "explanation": "Pass 3: Final optimal distances settled. No negative cycle.",
          "explanation_hi": "Pass 3 optimal finish!"
        }
      ],
      "result": {
        "S": 0,
        "A": 4,
        "B": 2,
        "C": 4
      }
    },
    "code": "function findCheapestPrice(n, flights, src, dst, k) {\n  let dist = new Array(n).fill(Infinity);\n  dist[src] = 0;\n  \n  for (let i = 0; i <= k; i++) {\n    const temp = [...dist];\n    for (const [u, v, w] of flights) {\n      if (dist[u] !== Infinity && dist[u] + w < temp[v]) {\n        temp[v] = dist[u] + w;\n      }\n    }\n    dist = temp;\n  }\n  return dist[dst] === Infinity ? -1 : dist[dst];\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "bellman-ford",
        "shortest-path"
      ],
      "keywords": [
        "bellman ford",
        "negative cycle",
        "cheapest flights within k stops"
      ],
      "companies": [
        "Google",
        "Uber",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Cheapest Flights Within K Stops",
        "difficulty": "Medium",
        "slug": "cheapest-flights-within-k-stops",
        "url": "https://leetcode.com/problems/cheapest-flights-within-k-stops/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Bellman-Ford",
        "url": "https://cp-algorithms.com/graph/bellman_ford.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Floyd Warshall": {
    "slug": "graphs-floyd-warshall",
    "name": "Floyd Warshall",
    "topic": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(V^3)",
    "spaceComplexity": "O(V^2)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Floyd-Warshall (All-Pairs Shortest Path)",
      "overview": "Computing shortest paths between all pairs of vertices in a dense weighted graph using dynamic programming in O(V^3).",
      "whatItIs": "Iterate intermediate vertex k from 1 to V: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.",
      "whyItWorks": "Optimal substructure: shortest path from i to j using intermediate vertices {1..k} either passes through k or does not.",
      "whenToUse": "Find the City With the Smallest Number of Neighbors at a Threshold Distance, transitive closure, all-pairs connectivity on small graphs (V <= 400).",
      "recognitionSignals": [
        "Shortest path between every pair of vertices",
        "Small vertex count N <= 400",
        "Transitive reachability"
      ],
      "commonMistakes": [
        "Putting intermediate loop `k` in the innermost loop instead of outermost loop (must be the outermost loop)"
      ],
      "stepLogic": "1. Initialize dist[V][V] with Infinity, dist[i][i] = 0; copy edge weights.\n2. For k from 0 to V-1 (intermediate node):\n   a. For i from 0 to V-1:\n      b. For j from 0 to V-1:\n         dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])\n3. Return dist matrix."
    },
    "hi": {
      "title": "Floyd-Warshall Algorithm",
      "overview": "Graph ke sabhi pairs ke beech shortest path nikalna O(V^3) dynamic programming se.",
      "whatItIs": "Intermediate node k ko check karna: agar i se k aur k se j hokar jane par distance kam hota hai toh update karein.",
      "whyItWorks": "Har pair (i, j) ka optimal path intermediate vertices {1..k} ke inclusion se iteratively improve hota hai.",
      "whenToUse": "Small graphs (V <= 400) mein all-pairs shortest path dhoondhne ke liye.",
      "recognitionSignals": [
        "All pairs shortest path",
        "V <= 400 constraint"
      ],
      "commonMistakes": [
        "Intermediate loop `k` ko innermost loop mein daal dena (outermost loop hona zaroori hai)"
      ],
      "stepLogic": "1. dist matrix ko weights se initialize karein.\n2. k loop sabse bahar chalayein.\n3. dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "GRAPHS",
      "title": "All-Pairs Distance Matrix Update",
      "input": "4 cities with roads under threshold distance",
      "description": "Intermediate node k relaxes distances: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).",
      "description_hi": "k node ke through sabhi pairs ka distance update hota hai.",
      "steps": [
        {
          "row": 0,
          "col": 1,
          "cellVal": "dist[0][1] = 3",
          "explanation": "Direct road: 3",
          "explanation_hi": "Direct road 3"
        },
        {
          "row": 0,
          "col": 2,
          "cellVal": "dist[0][2] = 5",
          "explanation": "Relaxed through k=1: 0->1->2 has distance 3 + 2 = 5!",
          "explanation_hi": "k=1 se hokar distance 5 hua"
        }
      ],
      "result": [
        [
          0,
          3,
          5
        ],
        [
          3,
          0,
          2
        ],
        [
          5,
          2,
          0
        ]
      ]
    },
    "code": "function findTheCity(n, edges, distanceThreshold) {\n  const dist = Array.from({ length: n }, () => new Array(n).fill(Infinity));\n  for (let i = 0; i < n; i++) dist[i][i] = 0;\n  for (const [u, v, w] of edges) {\n    dist[u][v] = w;\n    dist[v][u] = w;\n  }\n  \n  // Floyd-Warshall: k MUST be outermost loop\n  for (let k = 0; k < n; k++) {\n    for (let i = 0; i < n; i++) {\n      for (let j = 0; j < n; j++) {\n        if (dist[i][k] + dist[k][j] < dist[i][j]) {\n          dist[i][j] = dist[i][k] + dist[k][j];\n        }\n      }\n    }\n  }\n  \n  let minCount = Infinity, bestCity = -1;\n  for (let i = 0; i < n; i++) {\n    let count = 0;\n    for (let j = 0; j < n; j++) {\n      if (i !== j && dist[i][j] <= distanceThreshold) count++;\n    }\n    if (count <= minCount) {\n      minCount = count;\n      bestCity = i;\n    }\n  }\n  return bestCity;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "floyd-warshall",
        "all-pairs-shortest-path"
      ],
      "keywords": [
        "floyd warshall",
        "all pairs shortest path",
        "find the city"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Find the City With the Smallest Number of Neighbors at a Threshold Distance",
        "difficulty": "Medium",
        "slug": "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance",
        "url": "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Floyd-Warshall",
        "url": "https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Prim": {
    "slug": "graphs-prim",
    "name": "Prim",
    "topic": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O((V + E) log V)",
    "spaceComplexity": "O(V + E)",
    "interviewFrequency": "High",
    "en": {
      "title": "Prim's Minimum Spanning Tree Algorithm",
      "overview": "Building a Minimum Spanning Tree (MST) by growing a single cut from an arbitrary starting vertex, greedily adding the cheapest connecting edge.",
      "whatItIs": "Maintains a priority queue of cut edges. Popping the minimum weight edge spanning into an unvisited node incorporates that node into the MST.",
      "whyItWorks": "Cut Property: For any cut dividing a graph, the minimum weight edge crossing the cut must belong to the Minimum Spanning Tree.",
      "whenToUse": "Min Cost to Connect All Points, Connecting Cities With Minimum Cost on dense graphs.",
      "recognitionSignals": [
        "Connect all points with minimum total weight/wire",
        "Dense graphs where E ≈ V^2"
      ],
      "commonMistakes": [
        "Adding edges between nodes that are both already in the MST (must check `!visited[v]`)"
      ],
      "stepLogic": "1. visited = new Set(), MinHeap initialized with [0, startNode].\n2. While heap not empty and visited.size < V:\n   a. [cost, u] = heap.pop()\n   b. If (visited.has(u)) continue\n   c. visited.add(u); totalCost += cost\n   d. For [v, w] in adj[u]: if (!visited.has(v)) heap.push([w, v])\n3. Return totalCost."
    },
    "hi": {
      "title": "Prim's MST Algorithm",
      "overview": "Ek single node se shuru karke greedily sabse sasti connecting edge add karte hue Minimum Spanning Tree banana.",
      "whatItIs": "Cut Property use karta hai: Priority Queue se unvisited node tak ki cheapest edge chun kar MST mein jodte hain.",
      "whyItWorks": "Cut Property guarantee karti hai ki cut cross karne wali minimum edge pakka MST ka hissa hoti hai.",
      "whenToUse": "Min Cost to Connect All Points problem mein.",
      "recognitionSignals": [
        "Sabhi points ko minimum cost se connect karna",
        "Dense graph MST"
      ],
      "commonMistakes": [
        "Dono pehle se visited nodes ke beech ki edge dobara add kar lena"
      ],
      "stepLogic": "1. startNode ko 0 cost ke sath Min-Heap mein daalein.\n2. Minimum cost edge pop karein.\n3. Agar node unvisited ho toh MST mein shamil karein aur neighbors push karein."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "Prim's Tree Growth",
      "input": "Points: 4 points. Start at node 0.",
      "description": "Grows tree: 0 -> adds cheapest neighbor 1 (cost 2) -> adds 2 (cost 3) -> adds 3 (cost 4). Total = 9.",
      "description_hi": "Node 0 se shuru hoke cheapest edges judti jati hain.",
      "steps": [
        {
          "activeNode": 0,
          "visited": [
            0
          ],
          "queueOrStack": [
            [
              0,
              0
            ]
          ],
          "explanation": "Start at node 0",
          "explanation_hi": "Node 0 se start kiya"
        },
        {
          "activeNode": 1,
          "visited": [
            0,
            1
          ],
          "queueOrStack": [
            [
              2,
              1
            ]
          ],
          "explanation": "Add node 1 with min edge cost 2",
          "explanation_hi": "Node 1 joda (cost 2)"
        },
        {
          "activeNode": 2,
          "visited": [
            0,
            1,
            2
          ],
          "queueOrStack": [
            [
              3,
              2
            ]
          ],
          "explanation": "Add node 2 with edge cost 3",
          "explanation_hi": "Node 2 joda (cost 3)"
        },
        {
          "activeNode": 3,
          "visited": [
            0,
            1,
            2,
            3
          ],
          "queueOrStack": [
            [
              4,
              3
            ]
          ],
          "explanation": "Add node 3 with cost 4. MST complete with cost 9!",
          "explanation_hi": "MST complete! Total cost = 9."
        }
      ],
      "result": 9
    },
    "code": "function minCostConnectPoints(points) {\n  const n = points.length;\n  const visited = new Set();\n  const minHeap = [[0, 0]]; // [cost, pointIdx]\n  let totalCost = 0;\n  \n  while (visited.size < n) {\n    minHeap.sort((a, b) => a[0] - b[0]);\n    const [cost, u] = minHeap.shift();\n    if (visited.has(u)) continue;\n    \n    visited.add(u);\n    totalCost += cost;\n    \n    for (let v = 0; v < n; v++) {\n      if (!visited.has(v)) {\n        const dist = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);\n        minHeap.push([dist, v]);\n      }\n    }\n  }\n  return totalCost;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "mst",
        "prims-algorithm"
      ],
      "keywords": [
        "prims algorithm",
        "minimum spanning tree",
        "min cost connect points"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Min Cost to Connect All Points",
        "difficulty": "Medium",
        "slug": "min-cost-to-connect-all-points",
        "url": "https://leetcode.com/problems/min-cost-to-connect-all-points/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Prim",
        "url": "https://cp-algorithms.com/graph/mst_prim.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Kruskal": {
    "slug": "graphs-kruskal",
    "name": "Kruskal",
    "topic": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(E log E)",
    "spaceComplexity": "O(V + E)",
    "interviewFrequency": "High",
    "en": {
      "title": "Kruskal's Minimum Spanning Tree Algorithm (Edge Sorting + DSU)",
      "overview": "Constructing an MST by sorting all edges by weight and greedily adding edges that do not form a cycle using Disjoint Set Union (DSU).",
      "whatItIs": "Sort edges ascending. Iterate through sorted edges: if `dsu.find(u) !== dsu.find(v)`, union them and add edge weight to MST.",
      "whyItWorks": "Greedy edge sorting combined with cycle avoidance guarantees picking the minimum weight edge crossing some cut.",
      "whenToUse": "Sparse graphs where E << V^2, Connecting Cities With Minimum Cost, Minimum Spanning Tree problems.",
      "recognitionSignals": [
        "Build MST on sparse graphs",
        "Given list of weighted edges to connect all nodes"
      ],
      "commonMistakes": [
        "Forgetting to check whether the resulting MST has exactly V - 1 edges (if < V - 1, graph is disconnected)"
      ],
      "stepLogic": "1. Sort edges ascending by weight.\n2. Initialize DSU with V nodes, edgesCount = 0, mstCost = 0.\n3. For [u, v, w] in edges: if (dsu.union(u, v)) { mstCost += w; edgesCount++; if (edgesCount === V - 1) break; }\n4. If edgesCount === V - 1 return mstCost; else return -1."
    },
    "hi": {
      "title": "Kruskal's MST Algorithm",
      "overview": "Edges ko weight ke hisab se sort karke DSU ki madad se bina cycle banaye cheapest edges jodte hue MST banana.",
      "whatItIs": "Sabhi edges ko sort karein aur DSU se check karein; agar cycle na ban rahi ho toh edge include karein.",
      "whyItWorks": "Greedy choice se hamesha cheapest available edge milti hai jo disconnected components ko jodh sakti hai.",
      "whenToUse": "Sparse graphs par Minimum Spanning Tree nikalne ke liye.",
      "recognitionSignals": [
        "Kruskal MST",
        "Sort edges and union find"
      ],
      "commonMistakes": [
        "Check na karna ki graph disconnected toh nahi (edgesCount === V - 1 check zaroori hai)"
      ],
      "stepLogic": "1. Edges ko ascending weight mein sort karein.\n2. DSU banayein.\n3. Har edge par union karein; successful hone par cost add karein.\n4. V-1 edges milte hi cost return karein."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "Kruskal's Edge Selection Order",
      "input": "Edges: (1-2, wt 1), (2-3, wt 2), (1-3, wt 3), (3-4, wt 4)",
      "description": "Sort edges: [1, 2, 3, 4]. Adds 1-2 (1), adds 2-3 (2), skips 1-3 (cycle!), adds 3-4 (4). Total = 7.",
      "description_hi": "Cheapest edges 1-2 aur 2-3 judti hain; 1-3 cycle banati hai isliye skip hoti hai.",
      "steps": [
        {
          "activeNode": 1,
          "visited": [
            1,
            2
          ],
          "queueOrStack": [
            1
          ],
          "explanation": "Add edge 1-2 (wt 1)",
          "explanation_hi": "Edge 1-2 add hui (wt 1)"
        },
        {
          "activeNode": 2,
          "visited": [
            1,
            2,
            3
          ],
          "queueOrStack": [
            1
          ],
          "explanation": "Add edge 2-3 (wt 2)",
          "explanation_hi": "Edge 2-3 add hui (wt 2)"
        },
        {
          "activeNode": 3,
          "visited": [
            1,
            2,
            3
          ],
          "queueOrStack": [
            1
          ],
          "explanation": "Edge 1-3 forms cycle -> Skipped!",
          "explanation_hi": "Edge 1-3 cycle banati hai -> Skip!"
        },
        {
          "activeNode": 4,
          "visited": [
            1,
            2,
            3,
            4
          ],
          "queueOrStack": [
            1
          ],
          "explanation": "Add edge 3-4 (wt 4). MST complete with total cost 7!",
          "explanation_hi": "Edge 3-4 add hui. MST complete cost = 7!"
        }
      ],
      "result": 7
    },
    "code": "class DSU {\n  constructor(n) {\n    this.parent = Array.from({ length: n }, (_, i) => i);\n  }\n  find(i) {\n    if (this.parent[i] !== i) this.parent[i] = this.find(this.parent[i]);\n    return this.parent[i];\n  }\n  union(i, j) {\n    const rootI = this.find(i), rootJ = this.find(j);\n    if (rootI === rootJ) return false;\n    this.parent[rootI] = rootJ;\n    return true;\n  }\n}\n\nfunction kruskalMST(n, edges) {\n  edges.sort((a, b) => a[2] - b[2]); // Sort by weight\n  const dsu = new DSU(n);\n  let cost = 0, count = 0;\n  \n  for (const [u, v, w] of edges) {\n    if (dsu.union(u, v)) {\n      cost += w;\n      count++;\n      if (count === n - 1) break;\n    }\n  }\n  return count === n - 1 ? cost : -1;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "kruskals-algorithm",
        "mst",
        "dsu"
      ],
      "keywords": [
        "kruskal algorithm",
        "mst kruskal",
        "minimum spanning tree"
      ],
      "companies": [
        "Google",
        "Microsoft",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Min Cost to Connect All Points",
        "difficulty": "Medium",
        "slug": "min-cost-to-connect-all-points",
        "url": "https://leetcode.com/problems/min-cost-to-connect-all-points/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Kruskal",
        "url": "https://cp-algorithms.com/graph/mst_kruskal.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "MST": {
    "slug": "graphs-mst",
    "name": "MST",
    "topic": "Graphs",
    "difficulty": "Hard",
    "timeComplexity": "O(E log E)",
    "spaceComplexity": "O(V + E)",
    "interviewFrequency": "High",
    "en": {
      "title": "Critical and Pseudo-Critical Edges in Minimum Spanning Tree",
      "overview": "Identifying edges that must appear in every MST (critical) and edges that appear in some but not all MSTs (pseudo-critical).",
      "whatItIs": "Compute base MST weight. For each edge: 1) exclude it: if new MST weight increases or disconnected, it is critical. 2) force-include it: if new MST weight equals base weight, it is pseudo-critical.",
      "whyItWorks": "Testing presence with and without an edge verifies its essentiality to spanning tree minimality.",
      "whenToUse": "Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree.",
      "recognitionSignals": [
        "Classify edges into critical and pseudo-critical in MST"
      ],
      "commonMistakes": [
        "Not sorting edges with preserved original indices (required for returning edge indices)"
      ],
      "stepLogic": "1. Compute base MST weight using Kruskal.\n2. For each edge i:\n   a. Exclude edge i and compute MST; if cost > baseCost or disconnected -> edge i is CRITICAL.\n   b. Force-include edge i as first edge and compute MST; if cost === baseCost -> edge i is PSEUDO-CRITICAL."
    },
    "hi": {
      "title": "Critical & Pseudo-Critical Edges in MST",
      "overview": "MST ke andar aisi edges dhoondhna jo har MST mein zaroori hon (Critical) ya kisi kisi MST mein use ho sakti hon (Pseudo-Critical).",
      "whatItIs": "Base MST cost nikaal kar har edge ko hata kar (exclude) aur zabardasti add karke (force-include) test karna.",
      "whyItWorks": "Agar edge hatane se total cost badh jaye toh wo critical hai; agar include karne par cost same rahe toh wo pseudo-critical hai.",
      "whenToUse": "Critical and Pseudo-Critical Edges in MST problem mein.",
      "recognitionSignals": [
        "Critical and pseudo-critical edges in MST"
      ],
      "commonMistakes": [
        "Original indices preserve na karna jab edges sort hon"
      ],
      "stepLogic": "1. Base MST weight calculate karein.\n2. Har edge ko exclude karke check karein (cost badhe toh critical).\n3. Force-include karke check karein (cost same rahe toh pseudo-critical)."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "Critical vs Pseudo-Critical MST Edge Test",
      "input": "5 vertices with multiple equal weight paths",
      "description": "Removing edge e0 breaks minimal cost -> Critical! Edge e1 can be swapped with e2 without changing cost -> Pseudo-critical.",
      "description_hi": "Edge hatane par cost badhe toh Critical, cost same rahe toh Pseudo-critical.",
      "steps": [
        {
          "activeNode": 0,
          "visited": [
            0,
            1
          ],
          "queueOrStack": [
            0
          ],
          "explanation": "Edge e0 excluded: MST cost increases -> Critical Edge!",
          "explanation_hi": "e0 hatane par cost badhi -> Critical"
        },
        {
          "activeNode": 1,
          "visited": [
            1,
            2
          ],
          "queueOrStack": [
            1
          ],
          "explanation": "Edge e1 force-included: MST cost equals base cost -> Pseudo-Critical Edge!",
          "explanation_hi": "e1 force karne par cost barabar rahi -> Pseudo-Critical"
        }
      ],
      "result": {
        "critical": [
          0,
          1
        ],
        "pseudoCritical": [
          2,
          3
        ]
      }
    },
    "code": "function findCriticalAndPseudoCriticalEdges(n, edges) {\n  const newEdges = edges.map((e, i) => [...e, i]);\n  newEdges.sort((a, b) => a[2] - b[2]);\n  \n  function getMST(forceIdx = -1, skipIdx = -1) {\n    const parent = Array.from({ length: n }, (_, i) => i);\n    function find(x) { return parent[x] === x ? x : (parent[x] = find(parent[x])); }\n    function union(x, y) {\n      const rx = find(x), ry = find(y);\n      if (rx === ry) return false;\n      parent[rx] = ry;\n      return true;\n    }\n    \n    let weight = 0, count = 0;\n    if (forceIdx !== -1) {\n      const [u, v, w] = edges[forceIdx];\n      union(u, v);\n      weight += w;\n      count++;\n    }\n    for (const [u, v, w, idx] of newEdges) {\n      if (idx === skipIdx) continue;\n      if (union(u, v)) {\n        weight += w;\n        count++;\n      }\n    }\n    return count === n - 1 ? weight : Infinity;\n  }\n  \n  const baseWeight = getMST();\n  const critical = [], pseudo = [];\n  \n  for (let i = 0; i < edges.length; i++) {\n    if (getMST(-1, i) > baseWeight) {\n      critical.push(i);\n    } else if (getMST(i, -1) === baseWeight) {\n      pseudo.push(i);\n    }\n  }\n  return [critical, pseudo];\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "mst",
        "kruskal"
      ],
      "keywords": [
        "critical edges mst",
        "pseudo-critical edges",
        "minimum spanning tree"
      ],
      "companies": [
        "Google",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree",
        "difficulty": "Hard",
        "slug": "find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree",
        "url": "https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Critical Edges Editorial",
        "url": "https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "SCC": {
    "slug": "graphs-scc",
    "name": "SCC",
    "topic": "Graphs",
    "difficulty": "Hard",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "interviewFrequency": "High",
    "en": {
      "title": "Strongly Connected Components (SCC Concept)",
      "overview": "Decomposing a directed graph into maximal subgraphs where every vertex is mutually reachable from every other vertex.",
      "whatItIs": "Condensing all vertices of an SCC into a single super-node transforms any arbitrary directed graph into a Directed Acyclic Graph (DAG) of SCCs.",
      "whyItWorks": "Mutual reachability is an equivalence relation (reflexive, symmetric, transitive), partitioning the vertex set into disjoint components.",
      "whenToUse": "2-SAT satisfiability, analyzing circular dependency clusters, software module cycle reduction.",
      "recognitionSignals": [
        "Mutually reachable components in directed graph",
        "Condense directed graph into DAG"
      ],
      "commonMistakes": [
        "Applying SCC algorithms to undirected graphs (where connected components are trivial)"
      ],
      "stepLogic": "1. Use Tarjan's or Kosaraju's algorithm.\n2. Discover all maximal mutually reachable subgraphs.\n3. Condense each SCC into a single component node to form a DAG."
    },
    "hi": {
      "title": "Strongly Connected Components (SCC)",
      "overview": "Directed graph ko aise subgraphs mein baantna jisme har node se doosre node tak mutual path maujood ho.",
      "whatItIs": "Har SCC ko ek single super-node maan lene se koi bhi directed graph ek DAG ban jata hai.",
      "whyItWorks": "Mutual reachability ek equivalence relation hai jo vertices ko disjoint groups mein divide karti hai.",
      "whenToUse": "2-SAT problems aur circular dependencies dhoondhne mein.",
      "recognitionSignals": [
        "Mutually reachable nodes in directed graph",
        "Condense graph to DAG"
      ],
      "commonMistakes": [
        "Undirected graph par SCC lagana (wahan normal connected components hote hain)"
      ],
      "stepLogic": "1. Tarjan ya Kosaraju algorithm use karein.\n2. Mutually reachable components identify karein.\n3. DAG of components banayein."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "SCC Component Condensation",
      "input": "Directed cycles: [0->1, 1->2, 2->0] and [3->4, 4->3] with bridge 2->3.",
      "description": "SCC 1: {0, 1, 2}. SCC 2: {3, 4}. Condenses into DAG: SCC 1 -> SCC 2.",
      "description_hi": "{0, 1, 2} ek component banata hai aur {3, 4} doosra component.",
      "steps": [
        {
          "activeNode": 0,
          "visited": [
            0,
            1,
            2
          ],
          "queueOrStack": [
            0,
            1,
            2
          ],
          "explanation": "SCC 1 identified: {0, 1, 2}",
          "explanation_hi": "SCC 1 mila: {0, 1, 2}"
        },
        {
          "activeNode": 3,
          "visited": [
            0,
            1,
            2,
            3,
            4
          ],
          "queueOrStack": [
            3,
            4
          ],
          "explanation": "SCC 2 identified: {3, 4}",
          "explanation_hi": "SCC 2 mila: {3, 4}"
        }
      ],
      "result": [
        [
          0,
          1,
          2
        ],
        [
          3,
          4
        ]
      ]
    },
    "code": "// Tarjan's SCC implementation\nfunction findSCCs(n, adj) {\n  let timer = 0;\n  const tin = new Array(n).fill(-1);\n  const low = new Array(n).fill(-1);\n  const inStack = new Array(n).fill(false);\n  const stack = [];\n  const sccs = [];\n  \n  function dfs(u) {\n    tin[u] = low[u] = ++timer;\n    stack.push(u);\n    inStack[u] = true;\n    \n    for (const v of adj[u] || []) {\n      if (tin[v] === -1) {\n        dfs(v);\n        low[u] = Math.min(low[u], low[v]);\n      } else if (inStack[v]) {\n        low[u] = Math.min(low[u], tin[v]);\n      }\n    }\n    \n    if (low[u] === tin[u]) {\n      const scc = [];\n      while (true) {\n        const v = stack.pop();\n        inStack[v] = false;\n        scc.push(v);\n        if (v === u) break;\n      }\n      sccs.push(scc);\n    }\n  }\n  \n  for (let i = 0; i < n; i++) {\n    if (tin[i] === -1) dfs(i);\n  }\n  return sccs;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "scc",
        "tarjan"
      ],
      "keywords": [
        "strongly connected components",
        "scc directed graph",
        "tarjan scc"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Critical Connections in a Network",
        "difficulty": "Hard",
        "slug": "critical-connections-in-a-network",
        "url": "https://leetcode.com/problems/critical-connections-in-a-network/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms SCC",
        "url": "https://cp-algorithms.com/graph/strongly-connected-components.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Tarjan": {
    "slug": "graphs-tarjan",
    "name": "Tarjan",
    "topic": "Graphs",
    "difficulty": "Hard",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V)",
    "interviewFrequency": "High",
    "en": {
      "title": "Tarjan's Strongly Connected Components Algorithm",
      "overview": "Finding all strongly connected components in a directed graph in a single DFS pass using discovery times and low-link values.",
      "whatItIs": "Tracks `tin[u]` and `low[u]` (lowest reachable discovery time via subtree back-edges). When `low[u] === tin[u]`, node u is the root of an SCC.",
      "whyItWorks": "Vertices pushed onto recursion stack during DFS form an SCC root when no node in the sub-branch can reach an ancestor above u.",
      "whenToUse": "Linear-time SCC computation in single pass, 2-SAT problems.",
      "recognitionSignals": [
        "Single-pass SCC detection",
        "Low-link values on directed graph"
      ],
      "commonMistakes": [
        "Updating low[u] using cross-edges to nodes not currently on the recursion stack (must check `inStack[v]`)"
      ],
      "stepLogic": "1. tin[u] = low[u] = ++timer; push u to stack, inStack[u] = true.\n2. For each v in adj[u]: if not visited dfs(v), low[u] = min(low[u], low[v]); else if inStack[v] low[u] = min(low[u], tin[v]).\n3. If low[u] === tin[u]: pop stack until u, forming complete SCC."
    },
    "hi": {
      "title": "Tarjan's SCC Algorithm",
      "overview": "Single DFS pass mein directed graph ke sabhi Strongly Connected Components find karna `tin` aur `low` values se.",
      "whatItIs": "DFS recursion stack aur low-link values se detect karta hai ki kab koi branch apne kisi ancestor tak wapas nahi pahunch sakti.",
      "whyItWorks": "Jab `low[u] === tin[u]` hota hai, tab u se shuru hone wali saari cycle stack se pop hokar ek naya SCC banati hai.",
      "whenToUse": "Single pass SCC questions mein.",
      "recognitionSignals": [
        "Tarjan SCC",
        "Single pass strongly connected components"
      ],
      "commonMistakes": [
        "Stack mein na hone wale nodes ki low value include kar lena (`inStack[v]` check zaroori hai)"
      ],
      "stepLogic": "1. Discovery time tin aur low set karein, stack mein push karein.\n2. Neighbors explore karein aur low update karein.\n3. low[u] === tin[u] aane par stack se u tak pop karke SCC record karein."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "Tarjan Low-Link Invariant",
      "input": "Directed cycle 0 -> 1 -> 2 -> 0",
      "description": "tin values: [1, 2, 3]. Back-edge 2->0 sets low[2]=1, low[1]=1, low[0]=1. Root 0 pops {2, 1, 0} as SCC.",
      "description_hi": "Back-edge se low value 1 propagate hoti hai, aur root 0 pura SCC pop karta hai.",
      "steps": [
        {
          "activeNode": 2,
          "visited": [
            0,
            1,
            2
          ],
          "queueOrStack": [
            0,
            1,
            2
          ],
          "explanation": "Back-edge 2->0 detected! low[2] updated to tin[0] = 1",
          "explanation_hi": "Back-edge mili -> low value 1 hui"
        },
        {
          "activeNode": 0,
          "visited": [
            0,
            1,
            2
          ],
          "queueOrStack": [],
          "explanation": "At root 0: low[0] === tin[0] = 1 -> Pops {0, 1, 2} as SCC!",
          "explanation_hi": "Root 0 par low == tin -> SCC {0, 1, 2} pop hua!"
        }
      ],
      "result": [
        [
          2,
          1,
          0
        ]
      ]
    },
    "code": "function tarjanSCC(n, adj) {\n  let timer = 0;\n  const tin = new Array(n).fill(-1);\n  const low = new Array(n).fill(-1);\n  const inStack = new Array(n).fill(false);\n  const stack = [];\n  const sccs = [];\n  \n  function dfs(u) {\n    tin[u] = low[u] = ++timer;\n    stack.push(u);\n    inStack[u] = true;\n    \n    for (const v of adj[u] || []) {\n      if (tin[v] === -1) {\n        dfs(v);\n        low[u] = Math.min(low[u], low[v]);\n      } else if (inStack[v]) {\n        low[u] = Math.min(low[u], tin[v]);\n      }\n    }\n    \n    if (low[u] === tin[u]) {\n      const comp = [];\n      while (true) {\n        const node = stack.pop();\n        inStack[node] = false;\n        comp.push(node);\n        if (node === u) break;\n      }\n      sccs.push(comp);\n    }\n  }\n  \n  for (let i = 0; i < n; i++) {\n    if (tin[i] === -1) dfs(i);\n  }\n  return sccs;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "tarjan",
        "scc"
      ],
      "keywords": [
        "tarjan algorithm",
        "scc single pass",
        "tarjan low link"
      ],
      "companies": [
        "Google",
        "Directi",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Critical Connections in a Network",
        "difficulty": "Hard",
        "slug": "critical-connections-in-a-network",
        "url": "https://leetcode.com/problems/critical-connections-in-a-network/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Tarjan",
        "url": "https://cp-algorithms.com/graph/strongly-connected-components.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Kosaraju": {
    "slug": "graphs-kosaraju",
    "name": "Kosaraju",
    "topic": "Graphs",
    "difficulty": "Hard",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Kosaraju's Two-Pass Algorithm for SCCs",
      "overview": "Finding all strongly connected components using two DFS passes and a transposed (reversed edge) graph.",
      "whatItIs": "Pass 1: Run DFS on original graph, pushing nodes to stack on exit (ordered by finish time). Pass 2: Pop stack and run DFS on reversed graph, collecting SCCs.",
      "whyItWorks": "Vertices with latest finish times in original graph belong to source SCCs in the DAG of components. In the reversed graph, they become sink SCCs, preventing DFS leaks.",
      "whenToUse": "Intuitive and clean implementation of SCC detection when constructing reversed graph is easy.",
      "recognitionSignals": [
        "Find strongly connected components using graph transpose",
        "Two-pass finish time ordering"
      ],
      "commonMistakes": [
        "Running the second pass on original graph instead of reversed transposed graph"
      ],
      "stepLogic": "1. Pass 1: DFS on graph, push to stack on completion.\n2. Build transposed graph (reverse every directed edge u -> v to v -> u).\n3. Pass 2: While stack not empty: pop node u; if not visited in reversed graph, run DFS to collect its entire SCC."
    },
    "hi": {
      "title": "Kosaraju's Two-Pass Algorithm",
      "overview": "Do DFS passes aur graph transpose (edges reverse karke) se Strongly Connected Components nikalna.",
      "whatItIs": "Pehle pass mein finish time ke hisab se stack bharna. Dusre pass mein reversed graph par DFS chala kar SCCs collect karna.",
      "whyItWorks": "Edges reverse karne par source component sink component ban jata hai, jisse DFS dusre components mein leak nahi hota.",
      "whenToUse": "Clean aur easy-to-understand SCC implementation ke liye.",
      "recognitionSignals": [
        "Two pass SCC",
        "Graph transpose DFS"
      ],
      "commonMistakes": [
        "Dusre pass mein reversed graph use karna bhool jana"
      ],
      "stepLogic": "1. Pass 1: Original graph par DFS chala kar exit time se stack bharein.\n2. Graph ki saari edges reverse karein.\n3. Pass 2: Stack se pop karke reversed graph par DFS se SCCs nikaalein."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "Kosaraju Reverse Graph Traversal",
      "input": "Directed graph with 2 components",
      "description": "Pass 1 sorts by finish time. Pass 2 traverses transposed graph to isolate components.",
      "description_hi": "Reversed edges par DFS chala kar har component isolate hota hai.",
      "steps": [
        {
          "activeNode": 0,
          "visited": [
            0,
            1,
            2
          ],
          "queueOrStack": [
            0,
            1,
            2
          ],
          "explanation": "Pass 1 orders nodes by finish time",
          "explanation_hi": "Pass 1 finish time order nikalta hai"
        },
        {
          "activeNode": 0,
          "visited": [
            0,
            1,
            2
          ],
          "queueOrStack": [],
          "explanation": "Pass 2 on transposed graph collects SCC 1: {0, 1, 2}",
          "explanation_hi": "Pass 2 transposed graph se SCC 1 collect karta hai"
        }
      ],
      "result": [
        [
          0,
          1,
          2
        ]
      ]
    },
    "code": "function kosaraju(n, adj) {\n  const visited = new Set();\n  const stack = [];\n  \n  // Pass 1: finish times\n  function dfs1(u) {\n    visited.add(u);\n    for (const v of adj[u] || []) {\n      if (!visited.has(v)) dfs1(v);\n    }\n    stack.push(u);\n  }\n  \n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) dfs1(i);\n  }\n  \n  // Build transposed graph\n  const revAdj = Array.from({ length: n }, () => []);\n  for (let u = 0; u < n; u++) {\n    for (const v of adj[u] || []) revAdj[v].push(u);\n  }\n  \n  // Pass 2: collect SCCs\n  visited.clear();\n  const sccs = [];\n  function dfs2(u, comp) {\n    visited.add(u);\n    comp.push(u);\n    for (const v of revAdj[u]) {\n      if (!visited.has(v)) dfs2(v, comp);\n    }\n  }\n  \n  while (stack.length) {\n    const node = stack.pop();\n    if (!visited.has(node)) {\n      const comp = [];\n      dfs2(node, comp);\n      sccs.push(comp);\n    }\n  }\n  return sccs;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "kosaraju",
        "scc"
      ],
      "keywords": [
        "kosaraju algorithm",
        "transpose graph scc",
        "two pass scc"
      ],
      "companies": [
        "Microsoft",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Critical Connections in a Network",
        "difficulty": "Hard",
        "slug": "critical-connections-in-a-network",
        "url": "https://leetcode.com/problems/critical-connections-in-a-network/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Kosaraju",
        "url": "https://cp-algorithms.com/graph/strongly-connected-components.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Bridges": {
    "slug": "graphs-bridges",
    "name": "Bridges",
    "topic": "Graphs",
    "difficulty": "Hard",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Bridges in Graph (Critical Connections / Tarjan's Bridge Finding)",
      "overview": "Finding all edges in an undirected graph whose removal strictly increases the number of connected components.",
      "whatItIs": "DFS tracks entry time `tin[u]` and low-link `low[u]`. An edge `(u, v)` is a bridge if and only if `low[v] > tin[u]`.",
      "whyItWorks": "If `low[v] > tin[u]`, no node in the subtree of v can reach node u or any of u's ancestors without using edge (u, v).",
      "whenToUse": "Critical Connections in a Network, network vulnerability analysis, finding single points of failure.",
      "recognitionSignals": [
        "Edges whose removal disconnects the network",
        "Critical connections in undirected graph"
      ],
      "commonMistakes": [
        "Treating direct parent edge as a back-edge (must skip `if (v === parent) continue`)"
      ],
      "stepLogic": "1. In dfs(u, parent):\n   a. tin[u] = low[u] = ++timer\n   b. For v in adj[u]: if v === parent continue\n   c. If visited: low[u] = min(low[u], tin[v])\n   d. Else: dfs(v, u); low[u] = min(low[u], low[v]); if (low[v] > tin[u]) bridges.push([u, v])."
    },
    "hi": {
      "title": "Bridges in Graph (Critical Connections)",
      "overview": "Undirected graph mein aisi edges dhoondhna jinhe hatane par graph disconnect ho jaye.",
      "whatItIs": "Tarjan algorithm se check karna: agar `low[v] > tin[u]` hai toh edge (u, v) bridge hai.",
      "whyItWorks": "`low[v] > tin[u]` ka matlab hai ki v ke subtree se u tak pahunčne ka koi doosra alternate rasta nahi hai.",
      "whenToUse": "Critical Connections in a Network problem mein.",
      "recognitionSignals": [
        "Network critical connections",
        "Bridge edges"
      ],
      "commonMistakes": [
        "Direct parent edge ko back-edge samajh kar low update kar dena (`v === parent` skip karna zaroori hai)"
      ],
      "stepLogic": "1. tin aur low timestamps set karein.\n2. Direct parent ko skip karein.\n3. Recursive call ke baad agar `low[v] > tin[u]` ho toh bridge add karein."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "Bridge Detection: low[v] > tin[u]",
      "input": "Cycle 0-1-2-0 with single branch 1-3. Bridge is edge [1, 3].",
      "description": "Node 3 has low[3] = 4 > tin[1] = 2. Removing [1, 3] isolates node 3 -> Critical Bridge!",
      "description_hi": "Node 3 ke paas koi back-edge nahi hai, isliye edge [1, 3] bridge hai.",
      "steps": [
        {
          "activeNode": 3,
          "visited": [
            0,
            1,
            2,
            3
          ],
          "queueOrStack": [
            3
          ],
          "explanation": "At node 3: low[3]=4 > tin[1]=2. Edge [1, 3] is a BRIDGE!",
          "explanation_hi": "low[3] > tin[1] -> Edge [1, 3] bridge hai!"
        }
      ],
      "result": [
        [
          1,
          3
        ]
      ]
    },
    "code": "function criticalConnections(n, connections) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of connections) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  \n  const tin = new Array(n).fill(-1);\n  const low = new Array(n).fill(-1);\n  let timer = 0;\n  const bridges = [];\n  \n  function dfs(u, p) {\n    tin[u] = low[u] = ++timer;\n    for (const v of adj[u]) {\n      if (v === p) continue;\n      if (tin[v] !== -1) {\n        low[u] = Math.min(low[u], tin[v]);\n      } else {\n        dfs(v, u);\n        low[u] = Math.min(low[u], low[v]);\n        if (low[v] > tin[u]) {\n          bridges.push([u, v]);\n        }\n      }\n    }\n  }\n  \n  dfs(0, -1);\n  return bridges;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "bridges",
        "tarjan",
        "dfs"
      ],
      "keywords": [
        "critical connections",
        "find bridges in graph",
        "bridge detection"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Critical Connections in a Network",
        "difficulty": "Hard",
        "slug": "critical-connections-in-a-network",
        "url": "https://leetcode.com/problems/critical-connections-in-a-network/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Bridges",
        "url": "https://cp-algorithms.com/graph/bridge-searching.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Articulation Points": {
    "slug": "graphs-articulation-points",
    "name": "Articulation Points",
    "topic": "Graphs",
    "difficulty": "Hard",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "interviewFrequency": "High",
    "en": {
      "title": "Articulation Points (Cut Vertices)",
      "overview": "Locating vertices in an undirected graph whose removal strictly increases the number of connected components.",
      "whatItIs": "A non-root vertex u is an articulation point if it has a child v such that `low[v] >= tin[u]`. Root is an articulation point if it has >= 2 children in DFS tree.",
      "whyItWorks": "`low[v] >= tin[u]` proves that child v has no back-edge to any strict ancestor of u; removing u traps v.",
      "whenToUse": "Finding single point of failure vertices in networks, network cut vertex analysis.",
      "recognitionSignals": [
        "Vertex whose removal disconnects the graph",
        "Cut vertices in network"
      ],
      "commonMistakes": [
        "Missing the special condition for the DFS root node (root is cut vertex only if it has >= 2 children in DFS tree)"
      ],
      "stepLogic": "1. In dfs(u, parent):\n   a. tin[u] = low[u] = ++timer, children = 0\n   b. For v in adj[u]: if v === parent continue\n   c. If visited: low[u] = min(low[u], tin[v])\n   d. Else: dfs(v, u); low[u] = min(low[u], low[v]); if (low[v] >= tin[u] && parent !== -1) isCut[u] = true; children++\n   e. If parent === -1 && children > 1: isCut[u] = true."
    },
    "hi": {
      "title": "Articulation Points (Cut Vertices)",
      "overview": "Undirected graph mein aisi vertices (nodes) dhoondhna jinhe hatane par graph do ya zyada tukdon mein bat jaye.",
      "whatItIs": "Non-root node ke liye `low[v] >= tin[u]` check karna. Root node ke liye agar DFS tree mein 2 ya zyada children hon toh wo cut vertex hai.",
      "whyItWorks": "`low[v] >= tin[u]` ka matlab hai ki child v bina u ke upar ke ancestors tak nahi pahunch sakta.",
      "whenToUse": "Single point of failure nodes dhoondhne ke liye.",
      "recognitionSignals": [
        "Cut vertices in graph",
        "Node removal disconnects network"
      ],
      "commonMistakes": [
        "Root node ke 2 children rule ko bhool jana"
      ],
      "stepLogic": "1. tin aur low assign karein.\n2. Non-root par `low[v] >= tin[u]` ho toh cut vertex mark karein.\n3. Root node par children > 1 ho toh cut vertex mark karein."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "Articulation Point Cut Vertex",
      "input": "Two triangles {0,1,2} and {2,3,4} sharing vertex 2",
      "description": "Node 2 is the cut vertex. Removing node 2 splits the graph into two disconnected triangles.",
      "description_hi": "Node 2 cut vertex hai; ise hatane par dono triangles alag ho jate hain.",
      "steps": [
        {
          "activeNode": 2,
          "visited": [
            0,
            1,
            2,
            3,
            4
          ],
          "queueOrStack": [
            2
          ],
          "explanation": "Node 2 has child 3 with low[3]=4 >= tin[2]=3 -> Node 2 is an Articulation Point!",
          "explanation_hi": "low[3] >= tin[2] -> Node 2 articulation point hai!"
        }
      ],
      "result": [
        2
      ]
    },
    "code": "function findArticulationPoints(n, adj) {\n  const tin = new Array(n).fill(-1);\n  const low = new Array(n).fill(-1);\n  let timer = 0;\n  const isCut = new Set();\n  \n  function dfs(u, p) {\n    tin[u] = low[u] = ++timer;\n    let children = 0;\n    \n    for (const v of adj[u] || []) {\n      if (v === p) continue;\n      if (tin[v] !== -1) {\n        low[u] = Math.min(low[u], tin[v]);\n      } else {\n        children++;\n        dfs(v, u);\n        low[u] = Math.min(low[u], low[v]);\n        if (p !== -1 && low[v] >= tin[u]) {\n          isCut.add(u);\n        }\n      }\n    }\n    if (p === -1 && children > 1) {\n      isCut.add(u);\n    }\n  }\n  \n  for (let i = 0; i < n; i++) {\n    if (tin[i] === -1) dfs(i, -1);\n  }\n  return Array.from(isCut);\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "articulation-points",
        "tarjan"
      ],
      "keywords": [
        "articulation points",
        "cut vertices",
        "tarjan cut vertex"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Critical Connections in a Network",
        "difficulty": "Hard",
        "slug": "critical-connections-in-a-network",
        "url": "https://leetcode.com/problems/critical-connections-in-a-network/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Cut Vertices",
        "url": "https://cp-algorithms.com/graph/cutpoints.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Bipartite Graph": {
    "slug": "graphs-bipartite-graph",
    "name": "Bipartite Graph",
    "topic": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V)",
    "interviewFrequency": "High",
    "en": {
      "title": "Is Graph Bipartite? (2-Coloring BFS/DFS)",
      "overview": "Verifying if vertices can be divided into two disjoint sets such that every edge connects vertices of opposite sets (colors).",
      "whatItIs": "2-color BFS/DFS: assign color 1 to start node. For each neighbor: if uncolored, assign 1 - color; if colored with same color, graph is NOT bipartite.",
      "whyItWorks": "A graph is bipartite if and only if it contains no odd-length cycles.",
      "whenToUse": "Is Graph Bipartite?, Possible Bipartition (dislike pairs).",
      "recognitionSignals": [
        "Split vertices into two groups with no intra-group edges",
        "Check for odd cycles in graph"
      ],
      "commonMistakes": [
        "Only checking component 0 and missing disconnected components in the graph"
      ],
      "stepLogic": "1. color array initialized with -1.\n2. For each vertex i from 0 to n-1:\n   a. If color[i] === -1:\n   b. BFS queue = [i], color[i] = 0\n   c. While queue not empty: pop u; for v in adj[u]: if color[v] === color[u] return false; if color[v] === -1: color[v] = 1 - color[u], queue.push(v)\n3. Return true."
    },
    "hi": {
      "title": "Bipartite Graph (2-Coloring)",
      "overview": "Check karna ki kya graph ko 2 colors mein paint kiya ja sakta hai taaki koi bhi do adjacent nodes ka color same na ho.",
      "whatItIs": "BFS/DFS se alternating colors (0 aur 1) assign karna; agar kisi neighbor ka color same mil jaye toh graph bipartite nahi hai.",
      "whyItWorks": "Graph bipartite tabhi hota hai jab usme koi odd length cycle (triangle etc.) na ho.",
      "whenToUse": "Is Graph Bipartite?, Possible Bipartition problems mein.",
      "recognitionSignals": [
        "2 disjoint groups mein divide karna",
        "No odd length cycle"
      ],
      "commonMistakes": [
        "Disconnected components ko check na karna"
      ],
      "stepLogic": "1. color array mein -1 bharein.\n2. Har uncolored node se BFS shuru karein.\n3. Neighbor ko opposite color de; agar same color mile toh return false."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "2-Coloring Alternation",
      "input": "Square 0-1-2-3-0. Alternating colors: 0 (Red), 1 (Blue), 2 (Red), 3 (Blue). Valid bipartite!",
      "description": "Even cycle of length 4: 2 colors alternate perfectly without conflicts.",
      "description_hi": "Length 4 ki even cycle bina kisi conflict ke 2 colors mein paint ho jati hai.",
      "steps": [
        {
          "activeNode": 0,
          "visited": [
            0
          ],
          "queueOrStack": [
            0
          ],
          "explanation": "Color node 0 as RED (0)",
          "explanation_hi": "Node 0 ko RED color diya"
        },
        {
          "activeNode": 1,
          "visited": [
            0,
            1
          ],
          "queueOrStack": [
            1
          ],
          "explanation": "Color neighbor 1 as BLUE (1)",
          "explanation_hi": "Neighbor 1 ko BLUE color diya"
        },
        {
          "activeNode": 2,
          "visited": [
            0,
            1,
            2
          ],
          "queueOrStack": [
            2
          ],
          "explanation": "Color neighbor 2 as RED (0)",
          "explanation_hi": "Neighbor 2 ko RED color diya"
        },
        {
          "activeNode": 3,
          "visited": [
            0,
            1,
            2,
            3
          ],
          "queueOrStack": [
            3
          ],
          "explanation": "Color neighbor 3 as BLUE (1). All edges valid bipartite!",
          "explanation_hi": "Valid bipartite graph!"
        }
      ],
      "result": true
    },
    "code": "function isBipartite(graph) {\n  const n = graph.length;\n  const color = new Array(n).fill(-1);\n  \n  for (let i = 0; i < n; i++) {\n    if (color[i] === -1) {\n      const queue = [i];\n      color[i] = 0;\n      \n      while (queue.length) {\n        const u = queue.shift();\n        for (const v of graph[u]) {\n          if (color[v] === color[u]) return false;\n          if (color[v] === -1) {\n            color[v] = 1 - color[u];\n            queue.push(v);\n          }\n        }\n      }\n    }\n  }\n  return true;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "bipartite",
        "bfs",
        "coloring"
      ],
      "keywords": [
        "is graph bipartite",
        "2 coloring graph",
        "odd cycle detection"
      ],
      "companies": [
        "Amazon",
        "Facebook",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Is Graph Bipartite?",
        "difficulty": "Medium",
        "slug": "is-graph-bipartite",
        "url": "https://leetcode.com/problems/is-graph-bipartite/"
      },
      {
        "title": "Possible Bipartition",
        "difficulty": "Medium",
        "slug": "possible-bipartition",
        "url": "https://leetcode.com/problems/possible-bipartition/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Bipartite Editorial",
        "url": "https://leetcode.com/problems/is-graph-bipartite/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Cycle Detection": {
    "slug": "graphs-cycle-detection",
    "name": "Cycle Detection",
    "topic": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Cycle Detection in Directed Graphs (3-Color State / Recursion Stack)",
      "overview": "Detecting directed cycles using 3-state tracking: 0 (Unvisited), 1 (Visiting / on recursion stack), 2 (Visited / fully processed).",
      "whatItIs": "When exploring neighbors in state 1, encountering another neighbor in state 1 indicates a back-edge closing a directed cycle.",
      "whyItWorks": "State 1 represents the active path from root to current node. Re-visiting an active ancestor proves cyclical reachability.",
      "whenToUse": "Course Schedule I, detecting deadlock in resource allocation graphs, detecting recursive infinite dependencies.",
      "recognitionSignals": [
        "Check if directed graph contains a cycle",
        "Course prerequisites deadlock check"
      ],
      "commonMistakes": [
        "Using boolean visited instead of 3-state tracking (boolean cannot distinguish cross-edges from back-edges in directed graphs)"
      ],
      "stepLogic": "1. state array filled with 0 (unvisited).\n2. For each node i: if state[i] === 0 hasCycle(i).\n3. In hasCycle(u): state[u] = 1; for v in adj[u]: if (state[v] === 1) return true (cycle!); if (state[v] === 0 && hasCycle(v)) return true; state[u] = 2; return false."
    },
    "hi": {
      "title": "Directed Cycle Detection (3-Color States)",
      "overview": "Directed graph mein cycle detect karna 3 states use karke: 0 (unvisited), 1 (current path par active), 2 (fully processed).",
      "whatItIs": "Agar neighbor explore karte waqt koi aisa node mile jo pehle se state 1 par ho, toh back-edge mil gayi aur cycle confirm ho gayi.",
      "whyItWorks": "State 1 active recursion stack represent karta hai; active ancestor par wapas aana cycle prove karta hai.",
      "whenToUse": "Course Schedule I mein deadlock check karne ke liye.",
      "recognitionSignals": [
        "Directed graph cycle",
        "Dependency circular deadlock"
      ],
      "commonMistakes": [
        "Simple boolean visited use karna jo cross-edges aur back-edges mein fark nahi samajh sakta"
      ],
      "stepLogic": "1. state array mein 0 rakhein.\n2. Node ko 1 (visiting) mark karein.\n3. Neighbor 1 ho toh cycle confirm; 0 ho toh recurse karein.\n4. Subtree finish hone par 2 (visited) mark karein."
    },
    "visual": {
      "type": "GRAPH",
      "category": "GRAPHS",
      "title": "Back-Edge Cycle Detection",
      "input": "Directed edges: 0 -> 1 -> 2 -> 0",
      "description": "Node 2 encounters neighbor 0 which is currently in state 1 (visiting) -> Back-edge closes cycle!",
      "description_hi": "Node 2 se neighbor 0 mila jo pehle se active stack par hai -> Cycle detected!",
      "steps": [
        {
          "activeNode": 0,
          "visited": [
            0
          ],
          "queueOrStack": [
            0
          ],
          "explanation": "State: node 0 = 1 (visiting)",
          "explanation_hi": "Node 0 active hua"
        },
        {
          "activeNode": 1,
          "visited": [
            0,
            1
          ],
          "queueOrStack": [
            0,
            1
          ],
          "explanation": "State: node 1 = 1 (visiting)",
          "explanation_hi": "Node 1 active hua"
        },
        {
          "activeNode": 2,
          "visited": [
            0,
            1,
            2
          ],
          "queueOrStack": [
            0,
            1,
            2
          ],
          "explanation": "Node 2 points back to node 0 (state 1)! Cycle detected!",
          "explanation_hi": "Node 2 se 0 par back-edge -> Cycle mil gayi!"
        }
      ],
      "result": true
    },
    "code": "function canFinish(numCourses, prerequisites) {\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (const [c, p] of prerequisites) adj[p].push(c);\n  \n  // 0 = unvisited, 1 = visiting, 2 = visited\n  const state = new Array(numCourses).fill(0);\n  \n  function hasCycle(u) {\n    state[u] = 1; // Mark visiting\n    for (const v of adj[u]) {\n      if (state[v] === 1) return true; // Found back-edge!\n      if (state[v] === 0 && hasCycle(v)) return true;\n    }\n    state[u] = 2; // Mark fully processed\n    return false;\n  }\n  \n  for (let i = 0; i < numCourses; i++) {\n    if (state[i] === 0 && hasCycle(i)) return false;\n  }\n  return true;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "cycle-detection",
        "dfs"
      ],
      "keywords": [
        "cycle in directed graph",
        "course schedule cycle",
        "3 color cycle"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Course Schedule",
        "difficulty": "Medium",
        "slug": "course-schedule",
        "url": "https://leetcode.com/problems/course-schedule/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Course Schedule Editorial",
        "url": "https://leetcode.com/problems/course-schedule/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Shortest Path": {
    "slug": "graphs-shortest-path",
    "name": "Shortest Path",
    "topic": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Shortest Path in Directed Acyclic Graph (DAG) via Topological Sort",
      "overview": "Finding single-source shortest path in a DAG in strictly linear O(V + E) time, even with negative weights.",
      "whatItIs": "Compute topological order of DAG. Relax edges strictly in topological order.",
      "whyItWorks": "Because a DAG has no cycles, when vertex u is reached in topological order, all paths leading to u have already been fully relaxed.",
      "whenToUse": "Shortest or longest path in DAG, project scheduling (CPM/PERT), longest path in game trees.",
      "recognitionSignals": [
        "Shortest path in directed acyclic graph",
        "Linear time shortest path even with negative edges"
      ],
      "commonMistakes": [
        "Attempting this on cyclic graphs (topological sort requires DAG)"
      ],
      "stepLogic": "1. Compute topological sort of DAG.\n2. dist array initialized to Infinity, dist[src] = 0.\n3. For each u in topological order:\n   if dist[u] !== Infinity: for each [v, w] in adj[u]: dist[v] = min(dist[v], dist[u] + w).\n4. Return dist."
    },
    "hi": {
      "title": "DAG Shortest Path (Topological Sort)",
      "overview": "Directed Acyclic Graph mein single source shortest path strictly O(V + E) linear time mein nikalna chahe negative weights hon.",
      "whatItIs": "Topological order nikaal kar usi sequence mein edges ko relax karna.",
      "whyItWorks": "Cycle na hone ki wajah se jab kisi node u ki bari aati hai, uske pehle ke saare raste settle ho chuke hote hain.",
      "whenToUse": "DAG shortest path aur longest path problems mein.",
      "recognitionSignals": [
        "Shortest path in DAG",
        "O(V+E) linear shortest path"
      ],
      "commonMistakes": [
        "Cyclic graph par lagana (DAG hona zaroori hai)"
      ],
      "stepLogic": "1. Topological sort nikaalein.\n2. dist[src] = 0 set karein.\n3. Topo order ke sequence mein edges relax karein."
    },
    "visual": {
      "type": "SHORTEST_PATH",
      "category": "GRAPHS",
      "title": "Linear DAG Edge Relaxation",
      "input": "DAG: 0->1 (wt 2), 0->2 (wt 1), 1->3 (wt 4), 2->3 (wt 2). Topo order: [0, 1, 2, 3].",
      "description": "Relax in order: 0 settles 1 (dist 2) and 2 (dist 1). Node 2 settles 3 with cost 1 + 2 = 3 (better than 2 + 4 = 6).",
      "description_hi": "Topological sequence mein relax karke O(V+E) mein shortest path milta hai.",
      "steps": [
        {
          "activeNode": "0",
          "distances": {
            "0": 0,
            "1": 2,
            "2": 1,
            "3": null
          },
          "explanation": "Relax from 0: dist[1]=2, dist[2]=1",
          "explanation_hi": "0 se relax hua"
        },
        {
          "activeNode": "2",
          "distances": {
            "0": 0,
            "1": 2,
            "2": 1,
            "3": 3
          },
          "explanation": "Relax from 2: dist[3] = 1 + 2 = 3!",
          "explanation_hi": "2 se relax hua -> dist[3]=3"
        }
      ],
      "result": {
        "0": 0,
        "1": 2,
        "2": 1,
        "3": 3
      }
    },
    "code": "function shortestPathDAG(n, edges, src) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v, w] of edges) adj[u].push([v, w]);\n  \n  // 1. Topo sort\n  const visited = new Set();\n  const stack = [];\n  function dfs(u) {\n    visited.add(u);\n    for (const [v] of adj[u]) {\n      if (!visited.has(v)) dfs(v);\n    }\n    stack.push(u);\n  }\n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) dfs(i);\n  }\n  \n  // 2. Relax in topo order\n  const dist = new Array(n).fill(Infinity);\n  dist[src] = 0;\n  \n  while (stack.length) {\n    const u = stack.pop();\n    if (dist[u] !== Infinity) {\n      for (const [v, w] of adj[u]) {\n        if (dist[u] + w < dist[v]) {\n          dist[v] = dist[u] + w;\n        }\n      }\n    }\n  }\n  return dist;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "shortest-path",
        "dag",
        "topological-sort"
      ],
      "keywords": [
        "shortest path in dag",
        "linear shortest path dag"
      ],
      "companies": [
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Network Delay Time",
        "difficulty": "Medium",
        "slug": "network-delay-time",
        "url": "https://leetcode.com/problems/network-delay-time/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Shortest Path DAG",
        "url": "https://cp-algorithms.com/graph/shortest_path_dag.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Multi Source BFS": {
    "slug": "graphs-multi-source-bfs",
    "name": "Multi Source BFS",
    "topic": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(R * C)",
    "spaceComplexity": "O(R * C)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Multi-Source BFS (Simultaneous Wave Expansion)",
      "overview": "Expanding BFS waves from multiple starting source nodes simultaneously in a single queue.",
      "whatItIs": "Enqueue all source nodes at distance 0 initially. The BFS queue naturally expands outward concurrently from all sources.",
      "whyItWorks": "Any node reached by the wave receives the minimum distance to its nearest source among all starting points in O(R * C).",
      "whenToUse": "01 Matrix, Rotting Oranges, As Far from Land as Possible, Shortest Bridge.",
      "recognitionSignals": [
        "Distance to nearest 0 (or nearest source)",
        "Multiple starting points spreading at same speed",
        "Simultaneous infection or decay simulation"
      ],
      "commonMistakes": [
        "Running separate BFS from each individual source (takes O(Sources * R * C), causing TLE) instead of multi-source BFS in O(R * C)"
      ],
      "stepLogic": "1. Initialize queue = []; dist matrix filled with -1.\n2. For each cell: if cell is source: dist[r][c] = 0, queue.push([r, c]).\n3. While queue not empty:\n   a. [r, c] = queue.shift()\n   b. For each neighbor (nr, nc): if dist[nr][nc] === -1: dist[nr][nc] = dist[r][c] + 1; queue.push([nr, nc])\n4. Return dist matrix."
    },
    "hi": {
      "title": "Multi-Source BFS",
      "overview": "Sabhi sources se ek sath BFS wave chalana taaki har cell ko nearest source ka minimum distance mil sake.",
      "whatItIs": "Saare sources ko pehle se queue mein distance 0 par daal kar ek hi bar BFS chalana.",
      "whyItWorks": "Ek sath failne ki wajah se har cell pehle aane wali wave se settle hota hai, total time strictly O(R * C) rehta hai.",
      "whenToUse": "01 Matrix, Rotting Oranges, Shortest Bridge mein.",
      "recognitionSignals": [
        "Nearest source se distance nikalna",
        "Simultaneous infection / decay"
      ],
      "commonMistakes": [
        "Har source se alag-alag BFS chalana jisse time limit exceed ho jaye"
      ],
      "stepLogic": "1. Saare sources ko queue mein daalein aur dist = 0 set karein.\n2. Ek hi queue se BFS chalayein.\n3. Unvisited neighbor milte hi dist + 1 karke push karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "GRAPHS",
      "title": "Multi-Source Concurrent Wave",
      "input": [
        [
          0,
          0,
          0
        ],
        [
          0,
          1,
          0
        ],
        [
          1,
          1,
          1
        ]
      ],
      "description": "All 0s start in queue at dist 0. Expands outward to compute nearest 0 distance for all cells.",
      "description_hi": "Sabhi 0s ek sath fail kar 1s ka distance calculate karte hain.",
      "steps": [
        {
          "row": 1,
          "col": 1,
          "cellVal": "dist = 1",
          "explanation": "Cell (1, 1) is adjacent to 0 -> dist = 1",
          "explanation_hi": "(1,1) distance 1 par hai"
        },
        {
          "row": 2,
          "col": 1,
          "cellVal": "dist = 2",
          "explanation": "Cell (2, 1) is reached at step 2 -> dist = 2",
          "explanation_hi": "(2,1) distance 2 par settle hua"
        }
      ],
      "result": [
        [
          0,
          0,
          0
        ],
        [
          0,
          1,
          0
        ],
        [
          1,
          2,
          1
        ]
      ]
    },
    "code": "function updateMatrix(mat) {\n  const m = mat.length, n = mat[0].length;\n  const dist = Array.from({ length: m }, () => new Array(n).fill(-1));\n  const queue = [];\n  \n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (mat[r][c] === 0) {\n        dist[r][c] = 0;\n        queue.push([r, c]);\n      }\n    }\n  }\n  \n  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n  let head = 0;\n  while (head < queue.length) {\n    const [r, c] = queue[head++];\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && dist[nr][nc] === -1) {\n        dist[nr][nc] = dist[r][c] + 1;\n        queue.push([nr, nc]);\n      }\n    }\n  }\n  return dist;\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "bfs",
        "multi-source-bfs",
        "grid"
      ],
      "keywords": [
        "multi source bfs",
        "01 matrix",
        "rotting oranges",
        "nearest distance"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "01 Matrix",
        "difficulty": "Medium",
        "slug": "01-matrix",
        "url": "https://leetcode.com/problems/01-matrix/"
      },
      {
        "title": "Rotting Oranges",
        "difficulty": "Medium",
        "slug": "rotting-oranges",
        "url": "https://leetcode.com/problems/rotting-oranges/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode 01 Matrix Editorial",
        "url": "https://leetcode.com/problems/01-matrix/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "0-1 BFS": {
    "slug": "graphs-0-1-bfs",
    "name": "0-1 BFS",
    "topic": "Graphs",
    "difficulty": "Hard",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V)",
    "interviewFrequency": "High",
    "en": {
      "title": "0-1 BFS (Double-Ended Queue Optimization)",
      "overview": "Shortest path algorithm for graphs with edge weights strictly 0 or 1 using a Double-Ended Queue (Deque) in O(V + E).",
      "whatItIs": "When relaxing an edge with weight 0, push vertex to the FRONT of deque. When relaxing weight 1, push to the BACK of deque.",
      "whyItWorks": "Maintains deque monotonically sorted by distance at all times with max difference of 1 between front and back, eliminating Dijkstra's O(log V) heap overhead.",
      "whenToUse": "Minimum Cost to Make at Least One Valid Path in a Grid, Shortest Path with Alternating Colors, 0-1 weighted mazes.",
      "recognitionSignals": [
        "Graph edges only cost 0 or 1",
        "Grid movement where direction match costs 0 and change costs 1",
        "Linear time O(V+E) required without heap"
      ],
      "commonMistakes": [
        "Using standard queue (which violates monotonic distance order) instead of deque front/back pushes"
      ],
      "stepLogic": "1. dist array filled with Infinity, dist[src] = 0; deque = [src].\n2. While deque not empty:\n   a. u = deque.pop_front()\n   b. For [v, w] in adj[u]: if (dist[u] + w < dist[v]): dist[v] = dist[u] + w; if (w === 0) deque.push_front(v); else deque.push_back(v)\n3. Return dist."
    },
    "hi": {
      "title": "0-1 BFS (Deque Optimization)",
      "overview": "0 aur 1 edge weights wale graph mein Dijkstra ka O(log V) heap overhead hatakar Deque se O(V + E) mein shortest path nikalna.",
      "whatItIs": "Weight 0 hone par node ko Deque ke FRONT mein daalna, aur weight 1 hone par BACK mein daalna.",
      "whyItWorks": "Deque hamesha distance ke sorted order mein rehta hai kyunki 0 weight wale nodes pehle process ho jaate hain.",
      "whenToUse": "Grid mein arrow change karne ki cost 1 aur same direction ki cost 0 hone par.",
      "recognitionSignals": [
        "Weights are strictly 0 or 1",
        "O(V+E) shortest path without heap"
      ],
      "commonMistakes": [
        "Simple queue use karna jisse monotonic order toot jata hai"
      ],
      "stepLogic": "1. dist array Infinity set karein, deque = [src].\n2. Pop front karein.\n3. Weight 0 ho toh push front karein; weight 1 ho toh push back karein."
    },
    "visual": {
      "type": "SHORTEST_PATH",
      "category": "GRAPHS",
      "title": "0-1 BFS Deque Front vs Back Push",
      "input": "Edge with wt 0 pushed to FRONT. Edge with wt 1 pushed to BACK.",
      "description": "Zero cost transitions take immediate priority at front of deque, maintaining strict distance monotonicity in O(V + E).",
      "description_hi": "0 cost transition front par jati hai, 1 cost transition back par jati hai.",
      "steps": [
        {
          "activeNode": "Start",
          "distances": {
            "0": 0,
            "1": null,
            "2": null
          },
          "explanation": "Start at node 0 (dist=0)",
          "explanation_hi": "Node 0 se start kiya"
        },
        {
          "activeNode": "Node 1",
          "distances": {
            "0": 0,
            "1": 0,
            "2": 1
          },
          "explanation": "Edge 0->1 has weight 0 -> Push to FRONT of Deque! Processed next.",
          "explanation_hi": "Weight 0 mila -> FRONT par push hua"
        }
      ],
      "result": {
        "cost": 1
      }
    },
    "code": "function minCost(grid) {\n  const m = grid.length, n = grid[0].length;\n  const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));\n  dist[0][0] = 0;\n  \n  // Deque: array of [r, c]\n  const deque = [[0, 0]];\n  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // 1: right, 2: left, 3: down, 4: up\n  \n  while (deque.length) {\n    const [r, c] = deque.shift();\n    if (r === m - 1 && c === n - 1) return dist[r][c];\n    \n    for (let i = 0; i < 4; i++) {\n      const nr = r + dirs[i][0], nc = c + dirs[i][1];\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {\n        const weight = grid[r][c] === i + 1 ? 0 : 1;\n        if (dist[r][c] + weight < dist[nr][nc]) {\n          dist[nr][nc] = dist[r][c] + weight;\n          if (weight === 0) {\n            deque.unshift([nr, nc]); // Push front\n          } else {\n            deque.push([nr, nc]);    // Push back\n          }\n        }\n      }\n    }\n  }\n  return dist[m - 1][n - 1];\n}",
    "searchSignals": {
      "tags": [
        "graphs",
        "0-1-bfs",
        "deque",
        "shortest-path"
      ],
      "keywords": [
        "0-1 bfs",
        "min cost valid path",
        "deque shortest path"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Minimum Cost to Make at Least One Valid Path in a Grid",
        "difficulty": "Hard",
        "slug": "minimum-cost-to-make-at-least-one-valid-path-in-a-grid",
        "url": "https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms 0-1 BFS",
        "url": "https://cp-algorithms.com/graph/01_bfs.html",
        "type": "CP-Algorithms"
      }
    ]
  }
};
