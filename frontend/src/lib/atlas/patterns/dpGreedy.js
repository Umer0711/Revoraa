export const dpGreedyPatterns = {
  "Memoization": {
    "slug": "dynamic-programming-memoization",
    "name": "Memoization",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Top-Down DP with Memoization",
      "overview": "Optimizing recursive algorithms by caching the results of expensive subproblem calls in an array or map.",
      "whatItIs": "Top-down approach where a function checks if `memo[state]` exists before computing; if not, computes recursively and caches the result.",
      "whyItWorks": "Eliminates redundant computation across overlapping subproblems, reducing exponential O(2^N) trees to linear O(N) DAG traversals.",
      "whenToUse": "Climbing Stairs, Fibonacci, House Robber, Coin Change.",
      "recognitionSignals": [
        "Overlapping subproblems in recursive tree",
        "Optimal substructure",
        "Exponential call stack needing caching"
      ],
      "commonMistakes": [
        "Not passing or resetting the memo table between function calls",
        "Using state keys that do not uniquely identify the subproblem"
      ],
      "stepLogic": "1. Create memo cache initialized to default/null.\n2. In solve(n):\n   a. Base cases (e.g. n <= 1 return n)\n   b. If memo[n] !== null return memo[n]\n   c. memo[n] = solve(n-1) + solve(n-2)\n   d. return memo[n]."
    },
    "hi": {
      "title": "Top-Down DP (Memoization)",
      "overview": "Recursion ke dauran repeated subproblems ke answers ko cache (array/map) mein save karke time exponential se linear banana.",
      "whatItIs": "Subproblem calculate karne se pehle memo mein check karna; agar pehle se solved hai toh direct return karna.",
      "whyItWorks": "Overlapping subproblems dubara calculate nahi hoti, isliye O(2^N) recursion tree O(N) ban jata hai.",
      "whenToUse": "Climbing Stairs, Fibonacci, Coin Change problems mein.",
      "recognitionSignals": [
        "Overlapping subproblems in recursion",
        "Recursive branches repeat ho rahi hain"
      ],
      "commonMistakes": [
        "Subproblem ke state parameters ko unique key na banana"
      ],
      "stepLogic": "1. memo array banayein.\n2. solve(n) mein base case check karein.\n3. Agar memo[n] hai toh return karein, warna calculate karke memo mein save karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "DYNAMIC PROGRAMMING",
      "title": "Memoization Subproblem Cache",
      "input": "Climbing Stairs n = 4",
      "description": "memo[4] = memo[3] + memo[2]. Subproblems memo[2] and memo[1] cached on first visit.",
      "description_hi": "Pehli bar calculate hote hi answer cache ho jata hai.",
      "steps": [
        {
          "row": 0,
          "col": 2,
          "cellVal": "memo[2] = 2",
          "explanation": "Compute and cache memo[2] = 2",
          "explanation_hi": "memo[2] = 2 save hua"
        },
        {
          "row": 0,
          "col": 3,
          "cellVal": "memo[3] = 3",
          "explanation": "Compute and cache memo[3] = 3",
          "explanation_hi": "memo[3] = 3 save hua"
        },
        {
          "row": 0,
          "col": 4,
          "cellVal": "memo[4] = 5",
          "explanation": "memo[4] = memo[3] + memo[2] = 5! Reused cached subproblems in O(N).",
          "explanation_hi": "memo[4] = 5 turant calculate ho gaya!"
        }
      ],
      "result": 5
    },
    "code": "function climbStairs(n, memo = {}) {\n  if (n <= 2) return n;\n  if (memo[n]) return memo[n];\n  memo[n] = climbStairs(n - 1, memo) + climbStairs(n - 2, memo);\n  return memo[n];\n}\n\nconsole.log(climbStairs(5)); // 8",
    "searchSignals": {
      "tags": [
        "dynamic-programming",
        "memoization"
      ],
      "keywords": [
        "memoization",
        "top down dp",
        "climbing stairs"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Climbing Stairs",
        "difficulty": "Easy",
        "slug": "climbing-stairs",
        "url": "https://leetcode.com/problems/climbing-stairs/"
      },
      {
        "title": "Coin Change",
        "difficulty": "Medium",
        "slug": "coin-change",
        "url": "https://leetcode.com/problems/coin-change/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode DP Explore Card",
        "url": "https://leetcode.com/explore/learn/card/dynamic-programming/",
        "type": "LeetCode"
      }
    ]
  },
  "Tabulation": {
    "slug": "dynamic-programming-tabulation",
    "name": "Tabulation",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1) with rolling variables",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Bottom-Up Tabulation (Iterative DP)",
      "overview": "Solving subproblems iteratively from smallest base cases to target state, eliminating recursion call stack overhead.",
      "whatItIs": "Bottom-up DP table evaluation. Often space-optimizable by observing that `dp[i]` only depends on `dp[i-1]` and `dp[i-2]`.",
      "whyItWorks": "Subproblems have no mutual circular dependencies, allowing sequential evaluation in topological dependency order.",
      "whenToUse": "Climbing Stairs, House Robber, Min Cost Climbing Stairs.",
      "recognitionSignals": [
        "Convert top-down recursion to iterative loops",
        "O(1) space optimization via rolling variables"
      ],
      "commonMistakes": [
        "Base cases off-by-one indices in loop (`i = 2` vs `i = 0`)"
      ],
      "stepLogic": "1. Handle base cases (n <= 2).\n2. prev2 = 1, prev1 = 2.\n3. For i = 3 to n: curr = prev1 + prev2; prev2 = prev1; prev1 = curr.\n4. Return prev1."
    },
    "hi": {
      "title": "Bottom-Up Tabulation",
      "overview": "Chhote base cases se shuru karke loop ke through aage badhte hue iterative DP table bharna.",
      "whatItIs": "Recursion ka stack overhead hatakar constant O(1) space mein do variables roll karke solve karna.",
      "whyItWorks": "Subproblems ka dependency order seedha linear hota hai, isliye loop aasaani se aage badhta hai.",
      "whenToUse": "House Robber, Climbing Stairs problems mein.",
      "recognitionSignals": [
        "Iterative DP",
        "O(1) space optimization with rolling variables"
      ],
      "commonMistakes": [
        "Loop start index aur base values mein off-by-one"
      ],
      "stepLogic": "1. Base cases handle karein.\n2. Do variables prev1 aur prev2 rakhein.\n3. Loop chalayein aur update karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "DYNAMIC PROGRAMMING",
      "title": "Rolling Tabulation Variables",
      "input": "n = 5",
      "description": "Rolling state: prev2 -> prev1 -> curr. Memory is strictly O(1).",
      "description_hi": "Do variables roll karke O(1) memory mein solve hota hai.",
      "steps": [
        {
          "row": 0,
          "col": 0,
          "cellVal": "prev2 = 1, prev1 = 2",
          "explanation": "Base states",
          "explanation_hi": "Base states set hue"
        },
        {
          "row": 0,
          "col": 1,
          "cellVal": "curr = 3 (for step 3)",
          "explanation": "curr = 1 + 2 = 3",
          "explanation_hi": "curr = 3 calculate hua"
        },
        {
          "row": 0,
          "col": 2,
          "cellVal": "curr = 8 (for step 5)",
          "explanation": "Final answer = 8 in O(1) auxiliary space!",
          "explanation_hi": "Final answer = 8!"
        }
      ],
      "result": 8
    },
    "code": "function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}",
    "searchSignals": {
      "tags": [
        "dynamic-programming",
        "tabulation"
      ],
      "keywords": [
        "tabulation",
        "bottom up dp",
        "rolling variables dp"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Climbing Stairs",
        "difficulty": "Easy",
        "slug": "climbing-stairs",
        "url": "https://leetcode.com/problems/climbing-stairs/"
      },
      {
        "title": "House Robber",
        "difficulty": "Medium",
        "slug": "house-robber",
        "url": "https://leetcode.com/problems/house-robber/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Tabulation Guide",
        "url": "https://leetcode.com/explore/learn/card/dynamic-programming/",
        "type": "LeetCode"
      }
    ]
  },
  "1D DP": {
    "slug": "dynamic-programming-1d-dp",
    "name": "1D DP",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(N * M)",
    "spaceComplexity": "O(Amount)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "1D Dynamic Programming (Unbounded Coin Change / Word Break)",
      "overview": "State depends on a single dimension: `dp[i]` represents the optimal solution for amount/prefix of length i.",
      "whatItIs": "Transitions iterate through decision choices (coins or word lengths): `dp[i] = min(dp[i], 1 + dp[i - coin])`.",
      "whyItWorks": "Optimal substructure: minimum coins to make amount i is 1 + min coins to make amount (i - c) across all valid coins c.",
      "whenToUse": "Coin Change, Word Break, Decode Ways, Combination Sum IV.",
      "recognitionSignals": [
        "Minimum coins to make amount",
        "Partition string into dictionary words",
        "Single numeric capacity or length state"
      ],
      "commonMistakes": [
        "Initializing with 0 instead of Infinity for minimization problems",
        "Accessing negative array indices (`i - coin < 0`)"
      ],
      "stepLogic": "1. dp array of size amount + 1 filled with Infinity; dp[0] = 0.\n2. For i = 1 to amount:\n   For each coin in coins: if (i >= coin) dp[i] = min(dp[i], 1 + dp[i - coin]).\n3. Return dp[amount] === Infinity ? -1 : dp[amount]."
    },
    "hi": {
      "title": "1D Dynamic Programming",
      "overview": "State ek single dimension par depend karti hai jaise `dp[i]` = amount i banane ke minimum coins.",
      "whatItIs": "Har amount i ke liye sabhi coins try karke minimum transition `dp[i - coin] + 1` select karna.",
      "whyItWorks": "Optimal substructure: amount i ka best answer chhote amounts ke best answer par depend karta hai.",
      "whenToUse": "Coin Change, Word Break, Decode Ways mein.",
      "recognitionSignals": [
        "Minimum coins for amount",
        "String segmentation into words"
      ],
      "commonMistakes": [
        "Array ko Infinity ke badle 0 se initialize kar dena jisse min hamesha 0 rahe"
      ],
      "stepLogic": "1. dp array ko Infinity se bharein, dp[0] = 0.\n2. Har amount i ke liye har coin try karein.\n3. dp[amount] return karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "DYNAMIC PROGRAMMING",
      "title": "1D Coin Change Transition Table",
      "input": {
        "coins": [
          1,
          2,
          5
        ],
        "amount": 11
      },
      "description": "dp[11] = 1 + dp[11 - 5] = 1 + dp[6] = 1 + 2 = 3 coins (5 + 5 + 1).",
      "description_hi": "dp[11] minimum 3 coins (5, 5, 1) se banta hai.",
      "steps": [
        {
          "row": 0,
          "col": 0,
          "cellVal": "dp[0] = 0",
          "explanation": "Base case: 0 coins for amount 0",
          "explanation_hi": "Base case 0"
        },
        {
          "row": 0,
          "col": 5,
          "cellVal": "dp[5] = 1",
          "explanation": "dp[5] = 1 coin (5)",
          "explanation_hi": "dp[5] = 1"
        },
        {
          "row": 0,
          "col": 11,
          "cellVal": "dp[11] = 3",
          "explanation": "dp[11] = 3 coins (5 + 5 + 1)! Optimal result.",
          "explanation_hi": "dp[11] = 3 coins complete!"
        }
      ],
      "result": 3
    },
    "code": "function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  \n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i >= c) {\n        dp[i] = Math.min(dp[i], dp[i - c] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}\n\nconsole.log(coinChange([1, 2, 5], 11)); // 3",
    "searchSignals": {
      "tags": [
        "dynamic-programming",
        "1d-dp",
        "coin-change"
      ],
      "keywords": [
        "coin change",
        "word break",
        "1d dp"
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
        "title": "Coin Change",
        "difficulty": "Medium",
        "slug": "coin-change",
        "url": "https://leetcode.com/problems/coin-change/"
      },
      {
        "title": "Word Break",
        "difficulty": "Medium",
        "slug": "word-break",
        "url": "https://leetcode.com/problems/word-break/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Coin Change Editorial",
        "url": "https://leetcode.com/problems/coin-change/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "2D DP": {
    "slug": "dynamic-programming-2d-dp",
    "name": "2D DP",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(N) space-optimized",
    "interviewFrequency": "Very High",
    "en": {
      "title": "2D Dynamic Programming (Grid Path Optimization)",
      "overview": "State defined by two dimensions: `dp[i][j]` represents the answer for grid cell `(i, j)` or subproblems on prefixes of two sequences.",
      "whatItIs": "Transitions evaluate valid directions (from top `dp[i-1][j]` and from left `dp[i][j-1]`).",
      "whyItWorks": "To reach cell `(i, j)`, one must come from either `(i-1, j)` or `(i, j-1)`. Optimal path chooses `min(top, left) + grid[i][j]`.",
      "whenToUse": "Unique Paths I & II, Minimum Path Sum, Edit Distance.",
      "recognitionSignals": [
        "Movement in 2D grid restricted to right and down",
        "Two string sequence alignment (lengths i and j)"
      ],
      "commonMistakes": [
        "Creating unneeded 2D matrices when rolling 1D row buffer `dp[j] = min(dp[j], dp[j-1]) + grid[i][j]` suffices"
      ],
      "stepLogic": "1. Initialize dp array for row 0.\n2. For each row i from 0 to m-1:\n   For each col j from 0 to n-1: update dp[j] based on top and left neighbors.\n3. Return bottom-right destination cell."
    },
    "hi": {
      "title": "2D Dynamic Programming",
      "overview": "State do dimensions par depend karti hai jaise grid cell (i, j) tak pahunchne ka minimum cost path.",
      "whatItIs": "Cell (i, j) par aane ke do raste hain (upar se ya left se). Optimal choice `min(top, left) + grid[i][j]` hoti hai.",
      "whyItWorks": "Har cell ka minimum path pichle cells ke minimum paths se O(1) mein nikal aata hai.",
      "whenToUse": "Unique Paths, Minimum Path Sum, Edit Distance mein.",
      "recognitionSignals": [
        "2D grid movement right aur down",
        "Two strings sequence alignment"
      ],
      "commonMistakes": [
        "Pura 2D matrix use karna jabki single 1D array se rolling update ho sakta hai"
      ],
      "stepLogic": "1. Row 0 ke liye dp array banayein.\n2. Har row par loop chalayein: dp[j] = min(top, left) + cost.\n3. dp[n-1] return karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "DYNAMIC PROGRAMMING",
      "title": "2D Minimum Path Sum Grid",
      "input": [
        [
          1,
          3,
          1
        ],
        [
          1,
          5,
          1
        ],
        [
          4,
          2,
          1
        ]
      ],
      "description": "Path: 1 -> 3 -> 1 -> 1 -> 1. Minimum sum to bottom-right = 7.",
      "description_hi": "1 se shuru karke bottom-right tak minimum path sum 7 banta hai.",
      "steps": [
        {
          "row": 0,
          "col": 0,
          "cellVal": "dp[0][0] = 1",
          "explanation": "Start at top-left cell",
          "explanation_hi": "Start cell 1"
        },
        {
          "row": 2,
          "col": 2,
          "cellVal": "dp[2][2] = 7",
          "explanation": "Arrive at destination with min sum 7!",
          "explanation_hi": "Destination par min sum = 7!"
        }
      ],
      "result": 7
    },
    "code": "function minPathSum(grid) {\n  const m = grid.length, n = grid[0].length;\n  const dp = new Array(n).fill(Infinity);\n  dp[0] = 0;\n  \n  for (let i = 0; i < m; i++) {\n    dp[0] += grid[i][0];\n    for (let j = 1; j < n; j++) {\n      dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];\n    }\n  }\n  return dp[n - 1];\n}\n\nconsole.log(minPathSum([[1,3,1],[1,5,1],[4,2,1]])); // 7",
    "searchSignals": {
      "tags": [
        "dynamic-programming",
        "2d-dp",
        "grid"
      ],
      "keywords": [
        "minimum path sum",
        "unique paths",
        "2d dp grid"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Minimum Path Sum",
        "difficulty": "Medium",
        "slug": "minimum-path-sum",
        "url": "https://leetcode.com/problems/minimum-path-sum/"
      },
      {
        "title": "Unique Paths",
        "difficulty": "Medium",
        "slug": "unique-paths",
        "url": "https://leetcode.com/problems/unique-paths/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Min Path Sum Editorial",
        "url": "https://leetcode.com/problems/minimum-path-sum/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Knapsack": {
    "slug": "dynamic-programming-knapsack",
    "name": "Knapsack",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(N * W)",
    "spaceComplexity": "O(W)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "0/1 Knapsack Problem (Reverse 1D Array Optimization)",
      "overview": "Selecting a subset of items to maximize total value without exceeding capacity W, where each item can be chosen at most once.",
      "whatItIs": "Transition: `dp[w] = max(dp[w], value + dp[w - weight])`. Traversing capacity w in REVERSE order (from W down to weight) prevents an item from being reused.",
      "whyItWorks": "Reverse iteration ensures that `dp[w - weight]` represents the state from the previous item, enforcing the 0/1 (at most once) restriction.",
      "whenToUse": "Partition Equal Subset Sum, Target Sum, Ones and Zeroes, 0/1 Knapsack.",
      "recognitionSignals": [
        "Each item can be picked at most once",
        "Subset sum equals target",
        "Maximize value within weight budget"
      ],
      "commonMistakes": [
        "Iterating capacity forward (which solves Unbounded Knapsack where items can be reused infinitely, rather than 0/1 Knapsack)"
      ],
      "stepLogic": "1. dp array of size W + 1 filled with false/0; dp[0] = true/0.\n2. For each item (weight, val):\n   For w = W down to weight:\n      dp[w] = max(dp[w], val + dp[w - weight])\n3. Return dp[W]."
    },
    "hi": {
      "title": "0/1 Knapsack Problem",
      "overview": "Har item ko zyada se zyada 1 baar chun kar capacity W ke andar maximum value achieve karna.",
      "whatItIs": "Reverse loop (W se weight tak) chalakar ensure karna ki koi bhi item do baar choose na ho.",
      "whyItWorks": "Reverse traversal se `dp[w - weight]` pichle item ka state rehta hai, naye item ka nahi.",
      "whenToUse": "Partition Equal Subset Sum, Target Sum problems mein.",
      "recognitionSignals": [
        "Har item at most once",
        "Subset sum equals target"
      ],
      "commonMistakes": [
        "Capacity loop ko aage se (0 to W) chalana jisse item multiple times pick ho jata hai"
      ],
      "stepLogic": "1. dp array banayein.\n2. Har item ke liye loop W se weight tak reverse chalayein.\n3. dp[w] update karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "DYNAMIC PROGRAMMING",
      "title": "0/1 Knapsack Reverse Traversal",
      "input": {
        "nums": [
          1,
          5,
          11,
          5
        ],
        "target": 11
      },
      "description": "Subset sum target = 11. Reverse iteration safely computes subset {5, 5, 1} = 11. Valid partition!",
      "description_hi": "Reverse loop se subset sum 11 mil jata hai bina duplicate reuse ke.",
      "steps": [
        {
          "row": 0,
          "col": 0,
          "cellVal": "dp[0] = true",
          "explanation": "Base case sum 0",
          "explanation_hi": "Sum 0 possible hai"
        },
        {
          "row": 0,
          "col": 11,
          "cellVal": "dp[11] = true",
          "explanation": "Target sum 11 reached via {5, 5, 1}!",
          "explanation_hi": "Target sum 11 ban gaya!"
        }
      ],
      "result": true
    },
    "code": "function canPartition(nums) {\n  const sum = nums.reduce((a, b) => a + b, 0);\n  if (sum % 2 !== 0) return false;\n  const target = sum / 2;\n  \n  const dp = new Array(target + 1).fill(false);\n  dp[0] = true;\n  \n  for (const num of nums) {\n    // Reverse traversal enforces 0/1 constraint\n    for (let w = target; w >= num; w--) {\n      dp[w] = dp[w] || dp[w - num];\n    }\n  }\n  return dp[target];\n}\n\nconsole.log(canPartition([1, 5, 11, 5])); // true",
    "searchSignals": {
      "tags": [
        "dynamic-programming",
        "knapsack",
        "subset-sum"
      ],
      "keywords": [
        "0/1 knapsack",
        "partition equal subset sum",
        "knapsack reverse loop"
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
        "title": "Partition Equal Subset Sum",
        "difficulty": "Medium",
        "slug": "partition-equal-subset-sum",
        "url": "https://leetcode.com/problems/partition-equal-subset-sum/"
      },
      {
        "title": "Target Sum",
        "difficulty": "Medium",
        "slug": "target-sum",
        "url": "https://leetcode.com/problems/target-sum/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Partition Subset Editorial",
        "url": "https://leetcode.com/problems/partition-equal-subset-sum/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "LIS": {
    "slug": "dynamic-programming-lis",
    "name": "LIS",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(N log N) via Patience Sorting",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Longest Increasing Subsequence (Patience Sorting & Binary Search)",
      "overview": "Finding the length of the longest strictly increasing subsequence in O(N log N) using patience sorting.",
      "whatItIs": "Maintains `tails` array where `tails[i]` stores the smallest tail of all increasing subsequences of length i + 1. For each number, binary search its insertion slot in `tails`.",
      "whyItWorks": "Greedy choice: smaller tails leave the most room for future elements to extend the subsequence.",
      "whenToUse": "Longest Increasing Subsequence, Russian Doll Envelopes, Number of Longest Increasing Subsequence.",
      "recognitionSignals": [
        "Longest strictly increasing subsequence",
        "O(N log N) time limit"
      ],
      "commonMistakes": [
        "Using standard O(N^2) double loop when N = 10^5 (causes TLE, must use O(N log N) binary search)"
      ],
      "stepLogic": "1. tails = [].\n2. For each num in nums:\n   a. Find insertion index idx via binary search (lowerBound) in tails\n   b. If idx === tails.length: tails.push(num)\n   c. Else: tails[idx] = num (replace with smaller tail)\n3. Return tails.length."
    },
    "hi": {
      "title": "Longest Increasing Subsequence (Patience Sorting)",
      "overview": "Array mein strictly increasing subsequence ki maximum length O(N log N) time mein find karna.",
      "whatItIs": "`tails` array maintain karna jisme har length ka sabse chhota ending number rehta hai. Har number ka position binary search se nikaal kar update karte hain.",
      "whyItWorks": "Greedy principle: jitna chhota tail hoga, utna aage naye elements judne ke chances zyada honge.",
      "whenToUse": "Longest Increasing Subsequence, Russian Doll Envelopes problems mein.",
      "recognitionSignals": [
        "LIS problem",
        "O(N log N) requirement on 10^5 elements"
      ],
      "commonMistakes": [
        "O(N^2) approach use karna jab N bada ho"
      ],
      "stepLogic": "1. tails array banayein.\n2. Binary search se insertion index dhoondein.\n3. End par ho toh push karein, warna tails[idx] update karein.\n4. tails.length return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "DYNAMIC PROGRAMMING",
      "title": "Patience Sorting Tails Array",
      "input": [
        10,
        9,
        2,
        5,
        3,
        7,
        101,
        18
      ],
      "description": "Tails array evolves: [2] -> [2, 3] -> [2, 3, 7] -> [2, 3, 7, 18]. Max LIS length = 4.",
      "description_hi": "Tails array evolve hote hue length 4 deta hai.",
      "steps": [
        {
          "activeIdx": 2,
          "elements": [
            2
          ],
          "explanation": "Insert 2: tails = [2]",
          "explanation_hi": "2 add hua"
        },
        {
          "activeIdx": 4,
          "elements": [
            2,
            3
          ],
          "explanation": "Insert 3: replaces 5 -> tails = [2, 3]",
          "explanation_hi": "3 ne 5 ko replace kiya"
        },
        {
          "activeIdx": 5,
          "elements": [
            2,
            3,
            7
          ],
          "explanation": "Insert 7: tails = [2, 3, 7]",
          "explanation_hi": "7 add hua"
        },
        {
          "activeIdx": 7,
          "elements": [
            2,
            3,
            7,
            18
          ],
          "explanation": "Insert 18: replaces 101 -> tails = [2, 3, 7, 18]. LIS Length = 4!",
          "explanation_hi": "LIS length = 4!"
        }
      ],
      "result": 4
    },
    "code": "function lengthOfLIS(nums) {\n  const tails = [];\n  for (const x of nums) {\n    let l = 0, r = tails.length;\n    while (l < r) {\n      const mid = (l + r) >> 1;\n      if (tails[mid] < x) l = mid + 1;\n      else r = mid;\n    }\n    if (l === tails.length) tails.push(x);\n    else tails[l] = x;\n  }\n  return tails.length;\n}\n\nconsole.log(lengthOfLIS([10,9,2,5,3,7,101,18])); // 4",
    "searchSignals": {
      "tags": [
        "dynamic-programming",
        "lis",
        "binary-search"
      ],
      "keywords": [
        "longest increasing subsequence",
        "lis patience sort",
        "lis binary search"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Facebook",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Longest Increasing Subsequence",
        "difficulty": "Medium",
        "slug": "longest-increasing-subsequence",
        "url": "https://leetcode.com/problems/longest-increasing-subsequence/"
      },
      {
        "title": "Russian Doll Envelopes",
        "difficulty": "Hard",
        "slug": "russian-doll-envelopes",
        "url": "https://leetcode.com/problems/russian-doll-envelopes/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode LIS Editorial",
        "url": "https://leetcode.com/problems/longest-increasing-subsequence/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "LCS": {
    "slug": "dynamic-programming-lcs",
    "name": "LCS",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(min(M, N)) space-optimized",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Longest Common Subsequence (2D Grid Alignment)",
      "overview": "Finding length of the longest subsequence present in both strings in the same relative order.",
      "whatItIs": "`dp[i][j]` compares `s1[i-1]` and `s2[j-1]`. If matching: `1 + dp[i-1][j-1]`. Else: `max(dp[i-1][j], dp[i][j-1])`.",
      "whyItWorks": "Optimal substructure of string prefixes: matching characters extend the common subsequence by 1; mismatching characters discard the unhelpful prefix.",
      "whenToUse": "Longest Common Subsequence, Edit Distance, Delete Operation for Two Strings, Shortest Common Supersequence.",
      "recognitionSignals": [
        "Find longest common subsequence of two strings",
        "Minimum insertions/deletions to transform one string into another"
      ],
      "commonMistakes": [
        "Confusing substring (contiguous) with subsequence (non-contiguous)"
      ],
      "stepLogic": "1. dp table of size (m+1) x (n+1) initialized to 0.\n2. For i = 1 to m:\n   For j = 1 to n:\n      if s1[i-1] === s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]\n      else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n3. Return dp[m][n]."
    },
    "hi": {
      "title": "Longest Common Subsequence (LCS)",
      "overview": "Do strings ke beech sabse lambi common subsequence ki length nikalna.",
      "whatItIs": "Agar characters match hon toh `1 + diagonal` lein, agar mismatch hon toh `max(top, left)` lein.",
      "whyItWorks": "Prefix alignment property: match hone par dono strings se ek-ek character consume ho kar answer 1 badhta hai.",
      "whenToUse": "LCS, Edit Distance, Delete Operations to make strings equal mein.",
      "recognitionSignals": [
        "Longest common subsequence",
        "Transform string A to B"
      ],
      "commonMistakes": [
        "Substring (continuous) aur Subsequence (gap allowed) mein confuse hona"
      ],
      "stepLogic": "1. dp matrix 0 se bharo.\n2. Match hone par 1 + dp[i-1][j-1] karein.\n3. Mismatch par max(top, left) karein.\n4. dp[m][n] return karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "DYNAMIC PROGRAMMING",
      "title": "LCS Prefix Alignment Grid",
      "input": {
        "text1": "abcde",
        "text2": "ace"
      },
      "description": "Matches at \"a\", \"c\", \"e\" -> diagonal transitions extend length to 3 (\"ace\").",
      "description_hi": "\"a\", \"c\", \"e\" match hote hain, diagonal transitions se length 3 banti hai.",
      "steps": [
        {
          "row": 1,
          "col": 1,
          "cellVal": "dp[1][1] = 1 (\"a\")",
          "explanation": "Match \"a\": 1 + 0 = 1",
          "explanation_hi": "\"a\" match hua -> 1"
        },
        {
          "row": 3,
          "col": 2,
          "cellVal": "dp[3][2] = 2 (\"c\")",
          "explanation": "Match \"c\": 1 + 1 = 2",
          "explanation_hi": "\"c\" match hua -> 2"
        },
        {
          "row": 5,
          "col": 3,
          "cellVal": "dp[5][3] = 3 (\"e\")",
          "explanation": "Match \"e\": 1 + 2 = 3. Final LCS = 3!",
          "explanation_hi": "\"e\" match hua -> Final LCS = 3!"
        }
      ],
      "result": 3
    },
    "code": "function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  let dp = new Array(n + 1).fill(0);\n  \n  for (let i = 1; i <= m; i++) {\n    const next = new Array(n + 1).fill(0);\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) {\n        next[j] = 1 + dp[j - 1];\n      } else {\n        next[j] = Math.max(dp[j], next[j - 1]);\n      }\n    }\n    dp = next;\n  }\n  return dp[n];\n}\n\nconsole.log(longestCommonSubsequence(\"abcde\", \"ace\")); // 3",
    "searchSignals": {
      "tags": [
        "dynamic-programming",
        "lcs",
        "strings"
      ],
      "keywords": [
        "longest common subsequence",
        "lcs dp",
        "edit distance string"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Longest Common Subsequence",
        "difficulty": "Medium",
        "slug": "longest-common-subsequence",
        "url": "https://leetcode.com/problems/longest-common-subsequence/"
      },
      {
        "title": "Edit Distance",
        "difficulty": "Hard",
        "slug": "edit-distance",
        "url": "https://leetcode.com/problems/edit-distance/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode LCS Editorial",
        "url": "https://leetcode.com/problems/longest-common-subsequence/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Matrix Chain Multiplication": {
    "slug": "dynamic-programming-matrix-chain-multiplication",
    "name": "Matrix Chain Multiplication",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "timeComplexity": "O(N^3)",
    "spaceComplexity": "O(N^2)",
    "interviewFrequency": "High",
    "en": {
      "title": "Matrix Chain Multiplication (Interval Partitioning)",
      "overview": "Finding the optimal parenthesization of a chain of matrices to minimize total scalar multiplications in O(N^3).",
      "whatItIs": "Interval DP: for subsegment [i..j], test all partition split points k from i to j-1: `cost = dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j]`.",
      "whyItWorks": "Matrix multiplication is associative `(A*B)*C = A*(B*C)` but evaluation cost varies drastically depending on bracket order.",
      "whenToUse": "Burst Balloons, Minimum Cost to Merge Stones, Remove Boxes.",
      "recognitionSignals": [
        "Split interval [i..j] at every possible pivot k",
        "Interval DP with cubic complexity O(N^3)"
      ],
      "commonMistakes": [
        "Iterating indices in arbitrary order instead of increasing chain length `len` from 2 to N"
      ],
      "stepLogic": "1. dp[n][n] initialized to 0.\n2. For length L = 2 to n:\n   For i = 1 to n - L + 1:\n      j = i + L - 1; dp[i][j] = Infinity;\n      For k = i to j - 1:\n         dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j])\n3. Return dp[1][n-1]."
    },
    "hi": {
      "title": "Matrix Chain Multiplication (Interval DP)",
      "overview": "Matrices ki multiplication sequence mein brackets aise lagana taaki total scalar multiplications minimum hon.",
      "whatItIs": "Interval [i..j] ko har possible point k par split karke minimum cost calculate karna.",
      "whyItWorks": "Matrices associative hoti hain, isliye kisi bhi k par do independent subproblems ban jaati hain.",
      "whenToUse": "Burst Balloons, Minimum Cost to Merge Stones mein.",
      "recognitionSignals": [
        "Interval split at point k",
        "Cubic O(N^3) interval DP"
      ],
      "commonMistakes": [
        "Loop chain length L ke order mein na chalana"
      ],
      "stepLogic": "1. dp matrix 0 karein.\n2. Chain length L = 2 se n tak chalayein.\n3. k point par split karke cost minimize karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "DYNAMIC PROGRAMMING",
      "title": "Interval Partition Matrix Table",
      "input": "Matrices A(10x30), B(30x5), C(5x60)",
      "description": "(A*B)*C takes 10*30*5 + 10*5*60 = 4,500 multiplications. A*(B*C) takes 27,000! Optimal = 4,500.",
      "description_hi": "(A*B)*C 4,500 operations leta hai jabki A*(B*C) 27,000 operations leta hai.",
      "steps": [
        {
          "row": 1,
          "col": 2,
          "cellVal": "dp[1][2] = 1500",
          "explanation": "Cost for (A * B) = 10 * 30 * 5 = 1,500",
          "explanation_hi": "(A*B) cost = 1500"
        },
        {
          "row": 1,
          "col": 3,
          "cellVal": "dp[1][3] = 4500",
          "explanation": "Optimal: (A * B) * C = 4,500 multiplications!",
          "explanation_hi": "Optimal cost = 4500!"
        }
      ],
      "result": 4500
    },
    "code": "function matrixChainOrder(p) {\n  const n = p.length - 1;\n  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));\n  \n  for (let L = 2; L <= n; L++) {\n    for (let i = 1; i <= n - L + 1; i++) {\n      const j = i + L - 1;\n      dp[i][j] = Infinity;\n      for (let k = i; k < j; k++) {\n        const cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j];\n        dp[i][j] = Math.min(dp[i][j], cost);\n      }\n    }\n  }\n  return dp[1][n];\n}\n\nconsole.log(matrixChainOrder([10, 30, 5, 60])); // 4500",
    "searchSignals": {
      "tags": [
        "dynamic-programming",
        "mcm",
        "interval-dp"
      ],
      "keywords": [
        "matrix chain multiplication",
        "mcm dp",
        "burst balloons"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Burst Balloons",
        "difficulty": "Hard",
        "slug": "burst-balloons",
        "url": "https://leetcode.com/problems/burst-balloons/"
      },
      {
        "title": "Minimum Cost to Merge Stones",
        "difficulty": "Hard",
        "slug": "minimum-cost-to-merge-stones",
        "url": "https://leetcode.com/problems/minimum-cost-to-merge-stones/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Interval DP",
        "url": "https://cp-algorithms.com/",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Digit DP": {
    "slug": "dynamic-programming-digit-dp",
    "name": "Digit DP",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "timeComplexity": "O(Digits * Sum * States)",
    "spaceComplexity": "O(Digits * States)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Digit Dynamic Programming (Number Constraint Counting)",
      "overview": "Counting integers within range [0..N] satisfying custom digit properties using memoized recursion on digit positions.",
      "whatItIs": "State: `(idx, tight, leadingZeros, constraintState)`. `tight` boolean tracks if prefix equals prefix of upper bound N.",
      "whyItWorks": "Decomposes number into digit positions [0..9]. If `tight` is false, all digits 0-9 are valid and independent of N, enabling massive memoization reuse.",
      "whenToUse": "Numbers At Most N Given Digit Set, Non-negative Integers without Consecutive Ones, Count of Integers with Even Digit Sum.",
      "recognitionSignals": [
        "Count numbers in range [L..R] satisfying digit property",
        "Range N up to 10^18 where looping is impossible"
      ],
      "commonMistakes": [
        "Memoizing when `tight` is true (must only memoize when `tight === false`, because tight states are constrained)"
      ],
      "stepLogic": "1. Convert upper bound N to digit string.\n2. In solve(idx, tight, state):\n   a. If idx === len return valid(state) ? 1 : 0\n   b. limit = tight ? digits[idx] : 9\n   c. For d = 0 to limit: sum += solve(idx + 1, tight && d === limit, newState)\n   d. If (!tight) memo[idx][state] = sum; return sum.\n3. Answer for [L..R] is solve(R) - solve(L - 1)."
    },
    "hi": {
      "title": "Digit DP",
      "overview": "[0..N] range ke andar digit properties satisfy karne wale numbers count karna digit positions par DP laga kar.",
      "whatItIs": "State `(idx, tight, condition)` maintain karna; `tight` flag batata hai ki kya hum upper bound N se constrained hain.",
      "whyItWorks": "N = 10^18 tak ke numbers ko loop nahi kiya ja sakta, lekin 18 digits par DP lagana instant hota hai.",
      "whenToUse": "Numbers At Most N, Non-negative Integers without Consecutive Ones mein.",
      "recognitionSignals": [
        "Count numbers in [L..R] with digit rules",
        "N up to 10^18"
      ],
      "commonMistakes": [
        "tight === true hone par memoize kar lena (sirf tight === false memoize hona chahiye)"
      ],
      "stepLogic": "1. N ko digits array mein convert karein.\n2. Har digit 0 se limit tak try karein.\n3. solve(R) - solve(L-1) se range answer nikaalein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "DYNAMIC PROGRAMMING",
      "title": "Digit DP State Transitions",
      "input": "Count numbers <= 324 with sum property",
      "description": "Positions 0, 1, 2. When tight=false, states for sub-branches [00..99] are cached and reused instantly.",
      "description_hi": "Jab tight=false ho jaye, tab remaining digits ka answer cache ho kar reuse hota hai.",
      "steps": [
        {
          "row": 0,
          "col": 0,
          "cellVal": "d=0,1,2 (tight=false)",
          "explanation": "Digits 0..2 branch: tight becomes false, fully memoized",
          "explanation_hi": "tight=false branches cache hui"
        },
        {
          "row": 0,
          "col": 3,
          "cellVal": "d=3 (tight=true)",
          "explanation": "Digit 3 branch: tight remains true, limits next digit to 2",
          "explanation_hi": "Digit 3 branch upper bound constrain karti hai"
        }
      ],
      "result": 325
    },
    "code": "function countDigitOne(n) {\n  const s = String(n);\n  const memo = {};\n  \n  function dfs(idx, count, tight) {\n    if (idx === s.length) return count;\n    const key = idx + ',' + count + ',' + tight;\n    if (memo[key] !== undefined) return memo[key];\n    \n    const limit = tight ? Number(s[idx]) : 9;\n    let res = 0;\n    \n    for (let d = 0; d <= limit; d++) {\n      res += dfs(idx + 1, count + (d === 1 ? 1 : 0), tight && d === limit);\n    }\n    return (memo[key] = res);\n  }\n  \n  return dfs(0, 0, true);\n}\n\nconsole.log(countDigitOne(13)); // 6 (1, 10, 11, 12, 13 contains six 1s)",
    "searchSignals": {
      "tags": [
        "dynamic-programming",
        "digit-dp",
        "math"
      ],
      "keywords": [
        "digit dp",
        "count digit one",
        "number constraint dp"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Number of Digit One",
        "difficulty": "Hard",
        "slug": "number-of-digit-one",
        "url": "https://leetcode.com/problems/number-of-digit-one/"
      },
      {
        "title": "Numbers At Most N Given Digit Set",
        "difficulty": "Hard",
        "slug": "numbers-at-most-n-given-digit-set",
        "url": "https://leetcode.com/problems/numbers-at-most-n-given-digit-set/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Digit DP",
        "url": "https://cp-algorithms.com/",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Bitmask DP": {
    "slug": "dynamic-programming-bitmask-dp",
    "name": "Bitmask DP",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "timeComplexity": "O(N^2 * 2^N)",
    "spaceComplexity": "O(N * 2^N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Bitmask Dynamic Programming (Traveling Salesperson / Subsets)",
      "overview": "Representing visited subsets as integer bitmasks, enabling exponential set states in O(2^N) space.",
      "whatItIs": "An integer `mask` where the i-th bit (1 << i) is 1 if element i is selected/visited. `dp[mask][curr]` tracks minimum cost to visit set of nodes ending at `curr`.",
      "whyItWorks": "Instead of storing arrays or hash sets of visited nodes, a 32-bit integer encodes membership in O(1) time and space.",
      "whenToUse": "Traveling Salesperson Problem (TSP), Shortest Path Visiting All Nodes, Smallest Sufficient Team, Matchsticks to Square.",
      "recognitionSignals": [
        "N is small (N <= 20)",
        "Track subset of visited elements",
        "Permutation / assignment minimization"
      ],
      "commonMistakes": [
        "Bitwise operator precedence bugs: `(mask & (1 << i)) === 0` (bitwise & has lower precedence than ===)"
      ],
      "stepLogic": "1. dp table of size (1 << n) x n filled with Infinity; dp[1 << i][i] = 0.\n2. For mask from 1 to (1 << n) - 1:\n   For curr = 0 to n-1:\n      if (dp[mask][curr] === Infinity) continue;\n      For next = 0 to n-1: if (!(mask & (1 << next))) dp[mask | (1 << next)][next] = min(dp, dp[mask][curr] + dist[curr][next]).\n3. Return min over all dp[(1 << n) - 1][end]."
    },
    "hi": {
      "title": "Bitmask DP (TSP / Subsets)",
      "overview": "Subset states ko integer ke bits (0 aur 1) ke roop mein represent karke DP lagana jab N chhota ho (N <= 20).",
      "whatItIs": "Integer `mask` ka i-th bit `1 << i` batata hai ki item i included hai ya nahi.",
      "whyItWorks": "Set membership O(1) bitwise operations se hoti hai aur memory direct `1 << N` array ban jaati hai.",
      "whenToUse": "TSP, Shortest Path Visiting All Nodes, Smallest Sufficient Team mein.",
      "recognitionSignals": [
        "N <= 20 constraint",
        "Subset of visited items track karna"
      ],
      "commonMistakes": [
        "Operator precedence: `mask & 1 << i` mein parentheses bhool jana"
      ],
      "stepLogic": "1. dp[(1 << n)][n] matrix banayein.\n2. Mask 1 se (1 << n) tak iterate karein.\n3. Bitwise OR se agla element set mein add karke transition karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "DYNAMIC PROGRAMMING",
      "title": "Bitmask Subset Transitions (N=4)",
      "input": "4 cities: mask ranges from 0000_2 to 1111_2 (0 to 15)",
      "description": "mask = 7 (0111_2) represents visited set {0, 1, 2}. Visiting city 3 transitions to mask 15 (1111_2).",
      "description_hi": "mask 7 se 3 visit karke final mask 15 (all visited) par pahunchte hain.",
      "steps": [
        {
          "row": 7,
          "col": 2,
          "cellVal": "dp[0111_2][2]",
          "explanation": "Visited {0, 1, 2} ending at 2",
          "explanation_hi": "Set {0, 1, 2} visited"
        },
        {
          "row": 15,
          "col": 3,
          "cellVal": "dp[1111_2][3]",
          "explanation": "Transition to 3: all 4 cities visited (mask = 15)!",
          "explanation_hi": "Saare 4 cities visit ho gaye (mask 15)!"
        }
      ],
      "result": 15
    },
    "code": "function shortestPathLength(graph) {\n  const n = graph.length;\n  const targetMask = (1 << n) - 1;\n  const queue = [];\n  const visited = Array.from({ length: 1 << n }, () => new Array(n).fill(false));\n  \n  for (let i = 0; i < n; i++) {\n    queue.push([1 << i, i, 0]); // [mask, node, dist]\n    visited[1 << i][i] = true;\n  }\n  \n  while (queue.length) {\n    const [mask, node, dist] = queue.shift();\n    if (mask === targetMask) return dist;\n    \n    for (const neighbor of graph[node]) {\n      const nextMask = mask | (1 << neighbor);\n      if (!visited[nextMask][neighbor]) {\n        visited[nextMask][neighbor] = true;\n        queue.push([nextMask, neighbor, dist + 1]);\n      }\n    }\n  }\n  return 0;\n}",
    "searchSignals": {
      "tags": [
        "dynamic-programming",
        "bitmask-dp",
        "tsp"
      ],
      "keywords": [
        "bitmask dp",
        "shortest path visiting all nodes",
        "tsp dynamic programming"
      ],
      "companies": [
        "Google",
        "Uber",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Shortest Path Visiting All Nodes",
        "difficulty": "Hard",
        "slug": "shortest-path-visiting-all-nodes",
        "url": "https://leetcode.com/problems/shortest-path-visiting-all-nodes/"
      },
      {
        "title": "Smallest Sufficient Team",
        "difficulty": "Hard",
        "slug": "smallest-sufficient-team",
        "url": "https://leetcode.com/problems/smallest-sufficient-team/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Bitmask DP",
        "url": "https://cp-algorithms.com/",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Tree DP": {
    "slug": "dynamic-programming-tree-dp",
    "name": "Tree DP",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Tree DP (Rerooting Technique / All-Nodes Distance)",
      "overview": "Solving tree DP problems for every vertex as the root in O(N) total time via two DFS passes (down-pass and reroot-pass).",
      "whatItIs": "Pass 1 computes answer for arbitrary root 0 (bottom-up). Pass 2 transitions answer from parent u to child v in O(1) when rerooting to v.",
      "whyItWorks": "When moving the root from u to v, v's subtree moves 1 step closer to the new root, while the rest of the tree (N - subtreeSize) moves 1 step farther: `ans[v] = ans[u] - count[v] + (N - count[v])`.",
      "whenToUse": "Sum of Distances in Tree, Tree Diameter for all nodes, Binary Tree Cameras.",
      "recognitionSignals": [
        "Compute tree answer for EVERY node as the root",
        "O(N) total time required instead of O(N^2)"
      ],
      "commonMistakes": [
        "Rerunning full DFS from every node (takes O(N^2)) instead of the two-pass O(N) rerooting technique"
      ],
      "stepLogic": "1. Pass 1 (DFS): compute subtree sizes `count[u]` and initial distance sum `ans[0]` for root 0.\n2. Pass 2 (Reroot DFS): for child v of u: `ans[v] = ans[u] - count[v] + (N - count[v])`; recurse on v.\n3. Return ans array."
    },
    "hi": {
      "title": "Tree DP (Rerooting Technique)",
      "overview": "Tree ke har ek node ko root maan kar answer O(N) total time mein nikalna (do DFS passes se).",
      "whatItIs": "Pehle pass mein root 0 ka answer aur subtree sizes nikalte hain. Dusre pass mein root u se v par shift karne ka O(1) formula lagate hain.",
      "whyItWorks": "Root u se v par aane par v ke subtree ke nodes 1 step paas aate hain aur baaki nodes 1 step door ho jaate hain.",
      "whenToUse": "Sum of Distances in Tree problem mein.",
      "recognitionSignals": [
        "Har node ke liye distance sum chahiye",
        "O(N) total time requirement"
      ],
      "commonMistakes": [
        "Har node se alag DFS chalana (O(N^2) ban kar TLE ho jata hai)"
      ],
      "stepLogic": "1. DFS 1: Subtree count aur root 0 ka sum nikaalein.\n2. DFS 2: `ans[v] = ans[u] - count[v] + (N - count[v])` se bacho ka answer nikaalein."
    },
    "visual": {
      "type": "TREE",
      "category": "DYNAMIC PROGRAMMING",
      "title": "Tree DP Rerooting Shift",
      "input": "Tree with 6 nodes. Root 0 shifts to child 2.",
      "description": "Root shift: child 2 subtree (size 3) gets 1 closer (-3), rest of tree (6 - 3 = 3) gets 1 farther (+3). Formula updates in O(1)!",
      "description_hi": "Root shift formula se bina naya DFS chalaye answer O(1) mein update hota hai.",
      "steps": [
        {
          "activeNode": 0,
          "path": [
            0
          ],
          "explanation": "Pass 1: Root 0 has total distance sum = 8",
          "explanation_hi": "Root 0 ka sum = 8"
        },
        {
          "activeNode": 2,
          "path": [
            0,
            2
          ],
          "explanation": "Reroot to 2: ans[2] = 8 - count[2] + (6 - count[2]) = 8 - 3 + 3 = 8!",
          "explanation_hi": "Reroot to 2: O(1) transition complete!"
        }
      ],
      "result": [
        8,
        12,
        8,
        14,
        14,
        14
      ]
    },
    "code": "function sumOfDistancesInTree(n, edges) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  \n  const count = new Array(n).fill(1);\n  const ans = new Array(n).fill(0);\n  \n  // Pass 1: compute count and ans[0]\n  function dfs1(u, p) {\n    for (const v of adj[u]) {\n      if (v !== p) {\n        dfs1(v, u);\n        count[u] += count[v];\n        ans[u] += ans[v] + count[v];\n      }\n    }\n  }\n  dfs1(0, -1);\n  \n  // Pass 2: reroot\n  function dfs2(u, p) {\n    for (const v of adj[u]) {\n      if (v !== p) {\n        ans[v] = ans[u] - count[v] + (n - count[v]);\n        dfs2(v, u);\n      }\n    }\n  }\n  dfs2(0, -1);\n  return ans;\n}",
    "searchSignals": {
      "tags": [
        "dynamic-programming",
        "tree-dp",
        "rerooting"
      ],
      "keywords": [
        "sum of distances in tree",
        "tree dp rerooting",
        "tree dynamic programming"
      ],
      "companies": [
        "Google",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Sum of Distances in Tree",
        "difficulty": "Hard",
        "slug": "sum-of-distances-in-tree",
        "url": "https://leetcode.com/problems/sum-of-distances-in-tree/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Sum of Distances Editorial",
        "url": "https://leetcode.com/problems/sum-of-distances-in-tree/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Interval DP": {
    "slug": "dynamic-programming-interval-dp",
    "name": "Interval DP",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "timeComplexity": "O(N^3)",
    "spaceComplexity": "O(N^2)",
    "interviewFrequency": "High",
    "en": {
      "title": "Interval Dynamic Programming (Burst Balloons)",
      "overview": "Solving optimization problems on sub-intervals [i..j] by thinking in reverse: choosing which item is LAST to be eliminated.",
      "whatItIs": "In Burst Balloons, choosing balloon k as the LAST balloon to burst in interval `(i, j)` makes boundaries `nums[i]` and `nums[j]` adjacent to k, eliminating subproblem dependency.",
      "whyItWorks": "Thinking forward (first balloon to burst) couples subproblems because neighbors change dynamically. Thinking backward (last to burst) decouples subproblems completely.",
      "whenToUse": "Burst Balloons, Minimum Cost to Merge Stones, Guess Number Higher or Lower II.",
      "recognitionSignals": [
        "Interval optimization with boundary coin/value multiplication",
        "Think in reverse: pick the LAST element to process in interval"
      ],
      "commonMistakes": [
        "Thinking forwards and trying to burst the first balloon (subproblems become interdependent)"
      ],
      "stepLogic": "1. Pad array with 1 at both ends: nums = [1, ...nums, 1].\n2. dp[n][n] initialized to 0.\n3. For len = 2 to n-1:\n   For left = 0 to n - len - 1:\n      right = left + len;\n      For k = left + 1 to right - 1:\n         dp[left][right] = max(dp, dp[left][k] + dp[k][right] + nums[left]*nums[k]*nums[right])\n4. Return dp[0][n-1]."
    },
    "hi": {
      "title": "Interval DP (Burst Balloons)",
      "overview": "Interval `(left, right)` par optimization karna ulti disha (reverse) mein soch kar: kaunsa balloon AAKHIRI mein burst hoga.",
      "whatItIs": "Agar k aakhiri balloon hai jo burst hoga, toh uske left aur right boundary fix rehti hain `nums[left] * nums[k] * nums[right]`.",
      "whyItWorks": "Forward sochne par neighbors change ho jaate hain, par reverse sochne par dono halves completely independent rehte hain.",
      "whenToUse": "Burst Balloons problem mein.",
      "recognitionSignals": [
        "Reverse thinking interval DP",
        "Burst balloons"
      ],
      "commonMistakes": [
        "Pehle burst hone wale balloon par loop lagana"
      ],
      "stepLogic": "1. Array ke aage peeche 1 lagayein.\n2. Interval length 2 se n tak chalayein.\n3. k ko last burst hone wala balloon maan kar max calculate karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "DYNAMIC PROGRAMMING",
      "title": "Burst Balloons Interval Table",
      "input": [
        3,
        1,
        5,
        8
      ],
      "description": "Padded: [1, 3, 1, 5, 8, 1]. Burst order: 1 -> 5 -> 3 -> 8. Maximum coins = 167.",
      "description_hi": "Interval DP se maximum coins 167 calculate hote hain.",
      "steps": [
        {
          "row": 0,
          "col": 5,
          "cellVal": "dp[0][5] = 167",
          "explanation": "Optimal reverse burst sequence yields 167 coins!",
          "explanation_hi": "Optimal sequence se 167 coins milte hain!"
        }
      ],
      "result": 167
    },
    "code": "function maxCoins(nums) {\n  const arr = [1, ...nums, 1];\n  const n = arr.length;\n  const dp = Array.from({ length: n }, () => new Array(n).fill(0));\n  \n  for (let len = 2; len < n; len++) {\n    for (let left = 0; left < n - len; left++) {\n      const right = left + len;\n      for (let k = left + 1; k < right; k++) {\n        const coins = dp[left][k] + dp[k][right] + arr[left] * arr[k] * arr[right];\n        dp[left][right] = Math.max(dp[left][right], coins);\n      }\n    }\n  }\n  return dp[0][n - 1];\n}\n\nconsole.log(maxCoins([3,1,5,8])); // 167",
    "searchSignals": {
      "tags": [
        "dynamic-programming",
        "interval-dp",
        "burst-balloons"
      ],
      "keywords": [
        "burst balloons",
        "interval dp",
        "last element reverse dp"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Burst Balloons",
        "difficulty": "Hard",
        "slug": "burst-balloons",
        "url": "https://leetcode.com/problems/burst-balloons/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Burst Balloons Editorial",
        "url": "https://leetcode.com/problems/burst-balloons/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "State DP": {
    "slug": "dynamic-programming-state-dp",
    "name": "State DP",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "State Machine DP (Stock Trading with Cooldown / Fee)",
      "overview": "Modeling dynamic programming transitions as a Finite State Machine (FSM) where each state represents an asset holding status.",
      "whatItIs": "State machine with 3 states: `held` (holding stock), `sold` (just sold stock, entering cooldown), `reset` (in cooldown or cash, ready to buy).",
      "whyItWorks": "At each time step, optimal state values depend only on previous state transitions in O(1) space.",
      "whenToUse": "Best Time to Buy and Sell Stock with Cooldown, with Transaction Fee, with At Most K Transactions.",
      "recognitionSignals": [
        "Stock trading with cooldown periods",
        "Finite state machine transitions with transaction costs"
      ],
      "commonMistakes": [
        "Allowing buying on the same day as cooldown",
        "Using separate variables without simultaneous update buffer"
      ],
      "stepLogic": "1. Initialize held = -Infinity, sold = 0, reset = 0.\n2. For each price:\n   a. nextHeld = max(held, reset - price)\n   b. nextSold = held + price\n   c. nextReset = max(reset, sold)\n   d. Update held, sold, reset.\n3. Return max(sold, reset)."
    },
    "hi": {
      "title": "State Machine DP (Stock Trading)",
      "overview": "Finite State Machine ke roop mein states (held, sold, cooldown/reset) bana kar stock trading optimize karna.",
      "whatItIs": "3 states maintain karna: stock hold kiya hua hai, abhi-abhi becha hai, ya cash mein reset hai.",
      "whyItWorks": "Har din transition rules fix hote hain, isliye O(1) constant space mein state updates chalte hain.",
      "whenToUse": "Stock with Cooldown, Stock with Transaction Fee problems mein.",
      "recognitionSignals": [
        "Stock trading with cooldown",
        "Finite state machine transitions"
      ],
      "commonMistakes": [
        "Cooldown wale din hi dubara stock buy kar lena"
      ],
      "stepLogic": "1. held = -Infinity, sold = 0, reset = 0 set karein.\n2. Har price par transitions calculate karein.\n3. max(sold, reset) return karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "DYNAMIC PROGRAMMING",
      "title": "FSM Stock States (Held -> Sold -> Reset)",
      "input": [
        1,
        2,
        3,
        0,
        2
      ],
      "description": "Buy at 1, sell at 2 (+1). Cooldown. Buy at 0, sell at 2 (+2). Total profit = 3.",
      "description_hi": "1 par buy, 2 par sell. Cooldown ke baad 0 par buy, 2 par sell. Profit = 3.",
      "steps": [
        {
          "row": 0,
          "col": 1,
          "cellVal": "sold = 1 (profit +1)",
          "explanation": "Sell at 2 -> profit = 1",
          "explanation_hi": "2 par sell kiya -> profit 1"
        },
        {
          "row": 0,
          "col": 4,
          "cellVal": "sold = 3 (profit +3)",
          "explanation": "Buy at 0, sell at 2 -> max profit = 3!",
          "explanation_hi": "Final max profit = 3!"
        }
      ],
      "result": 3
    },
    "code": "function maxProfit(prices) {\n  let held = -Infinity, sold = 0, reset = 0;\n  \n  for (const price of prices) {\n    const prevHeld = held, prevSold = sold, prevReset = reset;\n    held = Math.max(prevHeld, prevReset - price);\n    sold = prevHeld + price;\n    reset = Math.max(prevReset, prevSold);\n  }\n  return Math.max(sold, reset);\n}\n\nconsole.log(maxProfit([1,2,3,0,2])); // 3",
    "searchSignals": {
      "tags": [
        "dynamic-programming",
        "state-machine",
        "stock"
      ],
      "keywords": [
        "best time to buy and sell stock cooldown",
        "state machine dp",
        "stock with fee"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Best Time to Buy and Sell Stock with Cooldown",
        "difficulty": "Medium",
        "slug": "best-time-to-buy-and-sell-stock-with-cooldown",
        "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/"
      },
      {
        "title": "Best Time to Buy and Sell Stock with Transaction Fee",
        "difficulty": "Medium",
        "slug": "best-time-to-buy-and-sell-stock-with-transaction-fee",
        "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Stock with Cooldown Editorial",
        "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Interval Scheduling": {
    "slug": "greedy-interval-scheduling",
    "name": "Interval Scheduling",
    "topic": "Greedy",
    "difficulty": "Medium",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Interval Scheduling (Earliest End-Time Greedy)",
      "overview": "Selecting maximum number of mutually compatible intervals by greedily picking intervals that finish earliest.",
      "whatItIs": "Sort intervals by end time ascending. Iterate and greedily select an interval whenever its start time is >= current finish time.",
      "whyItWorks": "Greedy stays ahead: finishing earliest leaves the maximum available time remaining for all future intervals.",
      "whenToUse": "Non-overlapping Intervals, Meeting Rooms, Activity Selection.",
      "recognitionSignals": [
        "Maximum mutually non-overlapping intervals",
        "Minimum intervals to remove to eliminate overlaps"
      ],
      "commonMistakes": [
        "Sorting by start time instead of end time (sorting by start time fails for long-duration activities)"
      ],
      "stepLogic": "1. Sort intervals ascending by end time `a[1] - b[1]`.\n2. prevEnd = -Infinity, count = 0.\n3. For each interval [start, end]: if start >= prevEnd: count++, prevEnd = end; else removals++.\n4. Return count (or removals)."
    },
    "hi": {
      "title": "Interval Scheduling (Earliest End-Time)",
      "overview": "End time ke hisab se sort karke sabse pehle khatam hone wale intervals ko choose karna taaki maximum activities ho sakein.",
      "whatItIs": "Jo activity sabse pehle finish hoti hai use pehle choose karna.",
      "whyItWorks": "Earliest finish time chunne se aage aane wali activities ke liye sabse zyada time bachta hai.",
      "whenToUse": "Non-overlapping Intervals, Activity Selection mein.",
      "recognitionSignals": [
        "Non-overlapping intervals maximum count",
        "Minimum removals to fix overlaps"
      ],
      "commonMistakes": [
        "Start time se sort kar dena (end time se sort karna zaroori hai)"
      ],
      "stepLogic": "1. Intervals ko end time se sort karein.\n2. prevEnd track karein.\n3. Agar start >= prevEnd ho toh select karein aur prevEnd update karein."
    },
    "visual": {
      "type": "INTERVALS",
      "category": "GREEDY",
      "title": "Earliest End-Time Selection",
      "input": [
        [
          1,
          2
        ],
        [
          2,
          3
        ],
        [
          3,
          4
        ],
        [
          1,
          3
        ]
      ],
      "description": "Sort by end time: [1,2], [2,3], [1,3], [3,4]. Select [1,2], [2,3], [3,4]. Remove [1,3] (1 removal).",
      "description_hi": "Earliest end time follow karne par sirf [1,3] remove karna padta hai.",
      "steps": [
        {
          "activeIdx": 0,
          "intervals": [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ]
          ],
          "explanation": "Select [1, 2], end = 2",
          "explanation_hi": "[1, 2] select hua"
        },
        {
          "activeIdx": 1,
          "intervals": [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ]
          ],
          "explanation": "Select [2, 3], end = 3",
          "explanation_hi": "[2, 3] select hua"
        },
        {
          "activeIdx": 2,
          "intervals": [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ]
          ],
          "explanation": "Select [3, 4], end = 4. Total 3 non-overlapping intervals!",
          "explanation_hi": "3 non-overlapping intervals select hue!"
        }
      ],
      "result": 3
    },
    "code": "function eraseOverlapIntervals(intervals) {\n  if (!intervals.length) return 0;\n  intervals.sort((a, b) => a[1] - b[1]); // Sort by end time\n  \n  let count = 0;\n  let prevEnd = intervals[0][1];\n  \n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] < prevEnd) {\n      count++; // Overlap detected, remove current\n    } else {\n      prevEnd = intervals[i][1];\n    }\n  }\n  return count;\n}\n\nconsole.log(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]])); // 1",
    "searchSignals": {
      "tags": [
        "greedy",
        "intervals",
        "sorting"
      ],
      "keywords": [
        "interval scheduling",
        "non overlapping intervals",
        "earliest finish time"
      ],
      "companies": [
        "Amazon",
        "Facebook",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Non-overlapping Intervals",
        "difficulty": "Medium",
        "slug": "non-overlapping-intervals",
        "url": "https://leetcode.com/problems/non-overlapping-intervals/"
      },
      {
        "title": "Meeting Rooms",
        "difficulty": "Easy",
        "slug": "meeting-rooms",
        "url": "https://leetcode.com/problems/meeting-rooms/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Non-overlapping Intervals Editorial",
        "url": "https://leetcode.com/problems/non-overlapping-intervals/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Huffman Coding": {
    "slug": "greedy-huffman-coding",
    "name": "Huffman Coding",
    "topic": "Greedy",
    "difficulty": "Medium",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Huffman Coding (Prefix-Free Variable-Length Encoding)",
      "overview": "Building an optimal prefix-free binary code tree by repeatedly merging the two lowest-frequency nodes using a Min-Heap.",
      "whatItIs": "Greedy merge: pop two nodes with smallest frequencies, create parent node with sum of their frequencies, push back into Min-Heap.",
      "whyItWorks": "Frequently occurring symbols get shorter binary codes near the top of tree, minimizing total weighted message bit length.",
      "whenToUse": "Data compression, prefix-free encoding, constructing optimal merge trees.",
      "recognitionSignals": [
        "Optimal lossless compression",
        "Merge two smallest elements repeatedly"
      ],
      "commonMistakes": [
        "Non-prefix free code generation (Huffman tree leaves guarantee prefix-free property)"
      ],
      "stepLogic": "1. Push each symbol with frequency into Min-Heap.\n2. While heap.size > 1: pop node1, pop node2; parent = new Node(freq1 + freq2, left=node1, right=node2); heap.push(parent).\n3. Traverse tree: left edge = 0, right edge = 1 to generate codes."
    },
    "hi": {
      "title": "Huffman Coding (Data Compression)",
      "overview": "Data compression ke liye do sabse kam frequency wale nodes ko merge karke optimal prefix-free tree banana.",
      "whatItIs": "Min-Heap se do minimum frequency nodes nikalna aur unka parent node wapas heap mein daalna.",
      "whyItWorks": "Zyada aane wale characters ko chhote binary codes milte hain, jisse overall file size kam ho jati hai.",
      "whenToUse": "Lossless data compression aur optimal merge problems mein.",
      "recognitionSignals": [
        "Huffman compression",
        "Prefix-free binary encoding"
      ],
      "commonMistakes": [
        "Heap mein frequency comparison galat karna"
      ],
      "stepLogic": "1. Frequencies Min-Heap mein daalein.\n2. Do minimum pop karein, parent banayein, aur wapas push karein.\n3. Leaf tak path se 0 aur 1 binary codes assign karein."
    },
    "visual": {
      "type": "TREE",
      "category": "GREEDY",
      "title": "Huffman Greedy Merge Tree",
      "input": {
        "A": 45,
        "B": 13,
        "C": 12,
        "D": 16,
        "E": 9,
        "F": 5
      },
      "description": "E(9) and F(5) merged first into 14. High-frequency A(45) stays at root (code: \"0\", 1 bit!).",
      "description_hi": "High frequency \"A\" ko 1 bit code milta hai, low frequency ko lambe codes.",
      "steps": [
        {
          "activeNode": "A",
          "path": [
            "root",
            "A"
          ],
          "explanation": "Symbol A (freq 45) assigned shortest code \"0\"",
          "explanation_hi": "A ko sabse chhota code \"0\" mila"
        },
        {
          "activeNode": "F",
          "path": [
            "root",
            "1",
            "F"
          ],
          "explanation": "Lowest frequency symbols assigned longer codes at bottom of tree",
          "explanation_hi": "Low frequency symbols neeche lambe codes lete hain"
        }
      ],
      "result": {
        "A": "0",
        "B": "101",
        "C": "100"
      }
    },
    "code": "class HuffmanNode {\n  constructor(char, freq, left = null, right = null) {\n    this.char = char;\n    this.freq = freq;\n    this.left = left;\n    this.right = right;\n  }\n}\n\nfunction buildHuffmanTree(freqMap) {\n  const pq = Object.entries(freqMap).map(([c, f]) => new HuffmanNode(c, f));\n  \n  while (pq.length > 1) {\n    pq.sort((a, b) => a.freq - b.freq);\n    const left = pq.shift();\n    const right = pq.shift();\n    const parent = new HuffmanNode(null, left.freq + right.freq, left, right);\n    pq.push(parent);\n  }\n  return pq[0];\n}",
    "searchSignals": {
      "tags": [
        "greedy",
        "huffman-coding",
        "tree",
        "compression"
      ],
      "keywords": [
        "huffman coding",
        "prefix free encoding",
        "optimal merge tree"
      ],
      "companies": [
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Minimum Cost to Connect Sticks",
        "difficulty": "Medium",
        "slug": "minimum-cost-to-connect-sticks",
        "url": "https://leetcode.com/problems/minimum-cost-to-connect-sticks/"
      }
    ],
    "externalResources": [
      {
        "name": "GFG Huffman Coding",
        "url": "https://www.geeksforgeeks.org/huffman-coding-greedy-algo-3/",
        "type": "GFG"
      }
    ]
  },
  "Activity Selection": {
    "slug": "greedy-activity-selection",
    "name": "Activity Selection",
    "topic": "Greedy",
    "difficulty": "Easy",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Activity Selection Problem",
      "overview": "Selecting maximal set of mutually compatible activities to execute on a single shared resource.",
      "whatItIs": "Sort by activity finish time. Greedily pick the next activity whose start time is >= finish time of the last chosen activity.",
      "whyItWorks": "Picking the activity with earliest finish time maximizes residual time for subsequent activities.",
      "whenToUse": "Classic activity scheduling, classroom allocation, single-processor task selection.",
      "recognitionSignals": [
        "Single resource scheduling maximum activities",
        "Mutually compatible time slots"
      ],
      "commonMistakes": [
        "Sorting by duration instead of finish time (shortest activity first does not guarantee optimal schedule)"
      ],
      "stepLogic": "1. Sort activities by finish time.\n2. Select first activity; set lastFinish = activity.finish.\n3. For each activity: if start >= lastFinish: select it; lastFinish = activity.finish.\n4. Return count of selected activities."
    },
    "hi": {
      "title": "Activity Selection Problem",
      "overview": "Ek single shared machine/room par maximum activities schedule karna.",
      "whatItIs": "Finish time ke hisab se sort karke agli non-conflicting activity select karna.",
      "whyItWorks": "Pehle finish hone wali activity agle sabhi options ke liye room khali chhodti hai.",
      "whenToUse": "Single room meeting scheduling mein.",
      "recognitionSignals": [
        "Max non-overlapping activities",
        "Earliest finish time greedy"
      ],
      "commonMistakes": [
        "Shortest duration se sort karna (counterexample exists)"
      ],
      "stepLogic": "1. Activities ko finish time se sort karein.\n2. Pehli activity select karein.\n3. Jo activities start >= lastFinish satisfy karein unhe add karein."
    },
    "visual": {
      "type": "INTERVALS",
      "category": "GREEDY",
      "title": "Activity Selection Timeline",
      "input": [
        [
          1,
          4
        ],
        [
          3,
          5
        ],
        [
          0,
          6
        ],
        [
          5,
          7
        ],
        [
          3,
          9
        ],
        [
          5,
          9
        ],
        [
          6,
          10
        ],
        [
          8,
          11
        ]
      ],
      "description": "Selected: [1, 4] -> [5, 7] -> [8, 11]. Maximum 3 activities scheduled.",
      "description_hi": "3 activities [1, 4], [5, 7], [8, 11] bina conflict ke schedule hui.",
      "steps": [
        {
          "activeIdx": 0,
          "intervals": [
            [
              1,
              4
            ],
            [
              5,
              7
            ],
            [
              8,
              11
            ]
          ],
          "explanation": "Selected [1, 4]",
          "explanation_hi": "[1, 4] select hua"
        },
        {
          "activeIdx": 1,
          "intervals": [
            [
              1,
              4
            ],
            [
              5,
              7
            ],
            [
              8,
              11
            ]
          ],
          "explanation": "Selected [5, 7]",
          "explanation_hi": "[5, 7] select hua"
        },
        {
          "activeIdx": 2,
          "intervals": [
            [
              1,
              4
            ],
            [
              5,
              7
            ],
            [
              8,
              11
            ]
          ],
          "explanation": "Selected [8, 11]. Max 3 activities scheduled!",
          "explanation_hi": "Max 3 activities schedule ho gayi!"
        }
      ],
      "result": 3
    },
    "code": "function activitySelection(start, finish) {\n  const activities = start.map((s, i) => [s, finish[i]]);\n  activities.sort((a, b) => a[1] - b[1]);\n  \n  let count = 1;\n  let lastFinish = activities[0][1];\n  \n  for (let i = 1; i < activities.length; i++) {\n    if (activities[i][0] >= lastFinish) {\n      count++;\n      lastFinish = activities[i][1];\n    }\n  }\n  return count;\n}",
    "searchSignals": {
      "tags": [
        "greedy",
        "activity-selection",
        "intervals"
      ],
      "keywords": [
        "activity selection",
        "earliest finish time",
        "meeting scheduling"
      ],
      "companies": [
        "Amazon",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Non-overlapping Intervals",
        "difficulty": "Medium",
        "slug": "non-overlapping-intervals",
        "url": "https://leetcode.com/problems/non-overlapping-intervals/"
      }
    ],
    "externalResources": [
      {
        "name": "GFG Activity Selection",
        "url": "https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/",
        "type": "GFG"
      }
    ]
  },
  "Fractional Knapsack": {
    "slug": "greedy-fractional-knapsack",
    "name": "Fractional Knapsack",
    "topic": "Greedy",
    "difficulty": "Easy",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Fractional Knapsack (Value-to-Weight Ratio Greedy)",
      "overview": "Maximizing value in a knapsack when items can be broken into arbitrary fractions by greedily choosing highest value-per-weight ratio.",
      "whatItIs": "Sort items by `ratio = value / weight` descending. Take full item if capacity allows; otherwise take fractional slice `capacity * ratio` to fill remaining capacity.",
      "whyItWorks": "Greedy choice property: each unit of weight taken with maximum value/weight ratio maximizes total knapsack value.",
      "whenToUse": "Fractional Knapsack, continuous resource allocation, blending ingredients.",
      "recognitionSignals": [
        "Items can be divided/cut into fractions",
        "Value per unit weight sorting"
      ],
      "commonMistakes": [
        "Applying fractional greedy to 0/1 knapsack (0/1 knapsack requires DP because fractions are not allowed)"
      ],
      "stepLogic": "1. Sort items descending by value / weight.\n2. totalVal = 0, remCap = capacity.\n3. For each item: if weight <= remCap: totalVal += value, remCap -= weight; else totalVal += remCap * ratio, break.\n4. Return totalVal."
    },
    "hi": {
      "title": "Fractional Knapsack",
      "overview": "Items ko fractions (tukdon) mein divide karke maximum value achieve karna highest value-per-weight ratio choose karke.",
      "whatItIs": "Value / Weight ratio nikaal kar descending order mein sort karna aur knapsack bharna.",
      "whyItWorks": "Unit weight par sabse zyada value lene se knapsack ka total profit maximum banta hai.",
      "whenToUse": "Jab items ko cut ya divide karne ki permission ho.",
      "recognitionSignals": [
        "Fractional items allowed",
        "Value to weight ratio"
      ],
      "commonMistakes": [
        "0/1 knapsack mein ratio greedy lagana (wahan fractions allowed nahi hote, DP lagti hai)"
      ],
      "stepLogic": "1. value/weight ratio se sort karein.\n2. Pura item aa sake toh add karein.\n3. Capacity kam ho toh bacha hua fraction add karein aur break karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "GREEDY",
      "title": "Value/Weight Ratio Packing",
      "input": {
        "items": [
          [
            60,
            10
          ],
          [
            100,
            20
          ],
          [
            120,
            30
          ]
        ],
        "capacity": 50
      },
      "description": "Ratios: Item 1: 6/wt, Item 2: 5/wt, Item 3: 4/wt. Take all of 1 (60), all of 2 (100), 2/3 of 3 (80) -> Total = 240.",
      "description_hi": "Item 1 aur 2 pure liye, Item 3 ka 2/3 part liya -> Total 240.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            60,
            0,
            0
          ],
          "explanation": "Take full Item 1 (wt 10, val 60). Rem cap = 40",
          "explanation_hi": "Item 1 liya (val 60)"
        },
        {
          "activeIdx": 1,
          "elements": [
            60,
            100,
            0
          ],
          "explanation": "Take full Item 2 (wt 20, val 100). Rem cap = 20",
          "explanation_hi": "Item 2 liya (val 100)"
        },
        {
          "activeIdx": 2,
          "elements": [
            60,
            100,
            80
          ],
          "explanation": "Take 20/30 fraction of Item 3 (val 80). Total Value = 240!",
          "explanation_hi": "Item 3 ka fraction liya -> Total = 240!"
        }
      ],
      "result": 240
    },
    "code": "function fractionalKnapsack(capacity, items) {\n  // items: [{ value, weight }]\n  items.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));\n  \n  let totalValue = 0;\n  let rem = capacity;\n  \n  for (const item of items) {\n    if (rem === 0) break;\n    if (item.weight <= rem) {\n      totalValue += item.value;\n      rem -= item.weight;\n    } else {\n      totalValue += item.value * (rem / item.weight);\n      rem = 0;\n    }\n  }\n  return totalValue;\n}\n\nconsole.log(fractionalKnapsack(50, [{value: 60, weight: 10}, {value: 100, weight: 20}, {value: 120, weight: 30}])); // 240",
    "searchSignals": {
      "tags": [
        "greedy",
        "knapsack",
        "ratio"
      ],
      "keywords": [
        "fractional knapsack",
        "value per weight ratio",
        "continuous knapsack"
      ],
      "companies": [
        "Amazon",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Maximum Units on a Truck",
        "difficulty": "Easy",
        "slug": "maximum-units-on-a-truck",
        "url": "https://leetcode.com/problems/maximum-units-on-a-truck/"
      }
    ],
    "externalResources": [
      {
        "name": "GFG Fractional Knapsack",
        "url": "https://www.geeksforgeeks.org/fractional-knapsack-problem/",
        "type": "GFG"
      }
    ]
  },
  "Job Scheduling": {
    "slug": "greedy-job-scheduling",
    "name": "Job Scheduling",
    "topic": "Greedy",
    "difficulty": "Medium",
    "timeComplexity": "O(N log N + N * maxDeadline)",
    "spaceComplexity": "O(maxDeadline)",
    "interviewFrequency": "High",
    "en": {
      "title": "Job Sequencing with Deadlines",
      "overview": "Maximizing total profit by scheduling each unit-time job on or before its deadline using latest-available slot greedy assignment.",
      "whatItIs": "Sort jobs by profit descending. For each job, greedily assign it to the latest available free time slot `<= job.deadline`.",
      "whyItWorks": "Placing high-profit jobs as close as possible to their deadline leaves earlier time slots free for jobs with tighter deadlines.",
      "whenToUse": "Job Sequencing with Deadlines, Task Scheduler with deadlines, Maximum Profit in Job Scheduling (with DP/binary search for non-unit jobs).",
      "recognitionSignals": [
        "Jobs with deadlines and profits",
        "Maximize profit within deadline slots"
      ],
      "commonMistakes": [
        "Scheduling job at earliest slot instead of latest free slot (blocks other jobs with earlier deadlines)"
      ],
      "stepLogic": "1. Sort jobs descending by profit.\n2. Create time slots array initialized to empty/false.\n3. For each job: search backwards from deadline to 1 for first empty slot; if found, assign job and add profit.\n4. Return total profit and scheduled job count."
    },
    "hi": {
      "title": "Job Sequencing with Deadlines",
      "overview": "Deadlines ke andar jobs ko schedule karke maximum profit kamana.",
      "whatItIs": "Jobs ko profit descending sort karna aur har job ko uski deadline ke sabse late available slot par schedule karna.",
      "whyItWorks": "Late slot par schedule karne se pehle wale slots strict deadline wale jobs ke liye khali rehte hain.",
      "whenToUse": "Job Sequencing problems mein.",
      "recognitionSignals": [
        "Jobs with deadlines and profit",
        "Maximize profit"
      ],
      "commonMistakes": [
        "Job ko slot 1 par schedule kar dena jabki use deadline ke paas schedule karna chahiye"
      ],
      "stepLogic": "1. Jobs ko profit ke descending order mein sort karein.\n2. Slots array banayein.\n3. Deadline se peeche search karke pehla empty slot book karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "GREEDY",
      "title": "Deadline Slot Allocation",
      "input": "Jobs: (A: d2, p100), (B: d1, p19), (C: d2, p27), (D: d1, p25), (E: d3, p15)",
      "description": "Slot 3: E(15), Slot 2: A(100), Slot 1: D(25). Total profit = 140.",
      "description_hi": "Slot 2 par A aur Slot 1 par D book hota hai. Total profit = 140.",
      "steps": [
        {
          "activeIdx": 2,
          "elements": [
            "-",
            "A",
            "E"
          ],
          "explanation": "Schedule A at slot 2 (profit 100)",
          "explanation_hi": "Slot 2 par A book hua"
        },
        {
          "activeIdx": 1,
          "elements": [
            "D",
            "A",
            "E"
          ],
          "explanation": "Schedule D at slot 1 (profit 25). Max profit = 140!",
          "explanation_hi": "Slot 1 par D book hua. Profit = 140!"
        }
      ],
      "result": 140
    },
    "code": "function jobScheduling(jobs) {\n  // jobs: [{ id, deadline, profit }]\n  jobs.sort((a, b) => b.profit - a.profit);\n  const maxD = Math.max(...jobs.map(j => j.deadline));\n  const slots = new Array(maxD + 1).fill(null);\n  \n  let totalProfit = 0, count = 0;\n  for (const job of jobs) {\n    for (let t = job.deadline; t > 0; t--) {\n      if (!slots[t]) {\n        slots[t] = job.id;\n        totalProfit += job.profit;\n        count++;\n        break;\n      }\n    }\n  }\n  return { count, totalProfit };\n}",
    "searchSignals": {
      "tags": [
        "greedy",
        "job-scheduling",
        "deadlines"
      ],
      "keywords": [
        "job sequencing with deadlines",
        "job scheduling greedy"
      ],
      "companies": [
        "Amazon",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Maximum Profit in Job Scheduling",
        "difficulty": "Hard",
        "slug": "maximum-profit-in-job-scheduling",
        "url": "https://leetcode.com/problems/maximum-profit-in-job-scheduling/"
      }
    ],
    "externalResources": [
      {
        "name": "GFG Job Sequencing",
        "url": "https://www.geeksforgeeks.org/job-sequencing-problem/",
        "type": "GFG"
      }
    ]
  },
  "Gas Station": {
    "slug": "greedy-gas-station",
    "name": "Gas Station",
    "topic": "Greedy",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Gas Station (Circular Tour Running Surplus)",
      "overview": "Finding starting gas station to complete circular circuit in O(N) single pass by resetting candidate start when surplus drops below zero.",
      "whatItIs": "Track `totalTank` and `currTank`. If `currTank < 0` at station i, reset `start = i + 1` and `currTank = 0`.",
      "whyItWorks": "If journey fails between start and i, no station between start and i can be the valid starting point (they all had non-negative fuel contribution to the failure). If `totalTank >= 0`, solution is guaranteed.",
      "whenToUse": "Gas Station circular tour.",
      "recognitionSignals": [
        "Circular array circuit completion",
        "Fuel vs cost running balance",
        "Single pass O(N) greedy start reset"
      ],
      "commonMistakes": [
        "Running O(N^2) simulation from every station instead of single-pass greedy reset"
      ],
      "stepLogic": "1. totalTank = 0, currTank = 0, start = 0.\n2. For i = 0 to n-1:\n   diff = gas[i] - cost[i]\n   totalTank += diff; currTank += diff\n   If (currTank < 0): start = i + 1, currTank = 0\n3. Return totalTank >= 0 ? start : -1."
    },
    "hi": {
      "title": "Gas Station Circuit",
      "overview": "Circular gas stations ka pura round lagane ke liye start station O(N) time mein dhoondhna.",
      "whatItIs": "Agar start se i tak petrol khatam ho jaye, toh start aur i ke beech ka koi bhi station answer nahi ho sakta; start = i + 1 karke reset karein.",
      "whyItWorks": "Agar total gas >= total cost hai, toh solution pakka exist karta hai aur reset point se aage pura round lag sakta hai.",
      "whenToUse": "Gas Station circular circuit problem mein.",
      "recognitionSignals": [
        "Circular circuit completion",
        "Gas vs cost surplus"
      ],
      "commonMistakes": [
        "O(N^2) loop chala kar TLE lana"
      ],
      "stepLogic": "1. totalTank, currTank, start = 0 rakhein.\n2. Har station par gas - cost add karein.\n3. currTank < 0 hone par start = i + 1 karein.\n4. totalTank >= 0 par start return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "GREEDY",
      "title": "Running Fuel Tank Surplus",
      "input": {
        "gas": [
          1,
          2,
          3,
          4,
          5
        ],
        "cost": [
          3,
          4,
          5,
          1,
          2
        ]
      },
      "description": "Surplus: [-2, -2, -2, +3, +3]. Stations 0,1,2 fail. Station 3 maintains positive tank -> Start at index 3!",
      "description_hi": "Station 3 par start karne se petrol kabhi negative nahi hota. Result = 3.",
      "steps": [
        {
          "activeIdx": 2,
          "elements": [
            -2,
            -2,
            -2,
            3,
            3
          ],
          "explanation": "Station 2 fails (currTank < 0) -> Reset start to 3",
          "explanation_hi": "Tank negative hua -> start = 3 reset"
        },
        {
          "activeIdx": 3,
          "elements": [
            -2,
            -2,
            -2,
            3,
            3
          ],
          "explanation": "Start at station 3: fuel accumulates to +6. Completes tour!",
          "explanation_hi": "Station 3 se pura circular round complete hua!"
        }
      ],
      "result": 3
    },
    "code": "function canCompleteCircuit(gas, cost) {\n  let totalTank = 0, currTank = 0, start = 0;\n  \n  for (let i = 0; i < gas.length; i++) {\n    const diff = gas[i] - cost[i];\n    totalTank += diff;\n    currTank += diff;\n    if (currTank < 0) {\n      start = i + 1;\n      currTank = 0;\n    }\n  }\n  return totalTank >= 0 ? start : -1;\n}\n\nconsole.log(canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2])); // 3",
    "searchSignals": {
      "tags": [
        "greedy",
        "gas-station",
        "circular-array"
      ],
      "keywords": [
        "gas station",
        "circuit tour",
        "circular gas station"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Gas Station",
        "difficulty": "Medium",
        "slug": "gas-station",
        "url": "https://leetcode.com/problems/gas-station/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Gas Station Editorial",
        "url": "https://leetcode.com/problems/gas-station/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Jump Game": {
    "slug": "greedy-jump-game",
    "name": "Jump Game",
    "topic": "Greedy",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Jump Game (Furthest Reachable Index Greedy)",
      "overview": "Determining if you can reach the last index by tracking the maximum reachable index reachable so far in O(N).",
      "whatItIs": "At each index i: if `i > maxReach`, destination is unreachable. Otherwise update `maxReach = max(maxReach, i + nums[i])`.",
      "whyItWorks": "If you can jump to position X, you can also land on any position between your current spot and X.",
      "whenToUse": "Jump Game I & II, Video Stitching.",
      "recognitionSignals": [
        "Can you reach the last index",
        "Minimum jumps to reach end",
        "Maximum reach horizon tracking"
      ],
      "commonMistakes": [
        "Evaluating jumps beyond maxReach (must break or return false if `i > maxReach`)"
      ],
      "stepLogic": "1. maxReach = 0.\n2. For i = 0 to n-1:\n   a. If i > maxReach return false (stuck)\n   b. maxReach = max(maxReach, i + nums[i])\n   c. If maxReach >= n - 1 return true\n3. Return true."
    },
    "hi": {
      "title": "Jump Game (Furthest Reachable Index)",
      "overview": "Array ke aakhiri index tak pahunchne ki capability O(N) time mein check karna max reach track karke.",
      "whatItIs": "Har index i par check karein: agar `i > maxReach` ho toh stuck ho gaye. Warna `maxReach = max(maxReach, i + nums[i])` update karein.",
      "whyItWorks": "Agar distance X tak pahunch sakte hain toh usse pehle ke sabhi indices reachable hain.",
      "whenToUse": "Jump Game I aur II problems mein.",
      "recognitionSignals": [
        "Can reach last index",
        "Minimum jumps to end"
      ],
      "commonMistakes": [
        "maxReach se aage nikal kar array iterate karte rehna"
      ],
      "stepLogic": "1. maxReach = 0 rakhein.\n2. i > maxReach hone par false return karein.\n3. maxReach >= n - 1 hone par true return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "GREEDY",
      "title": "Max Reach Horizon Expansion",
      "input": [
        2,
        3,
        1,
        1,
        4
      ],
      "description": "Index 0: reach 2. Index 1: reach 1 + 3 = 4 >= last index (4). Success!",
      "description_hi": "Index 1 se reach 4 ho jati hai jo aakhiri index hai. Reachable!",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            2,
            3,
            1,
            1,
            4
          ],
          "explanation": "At index 0 (val 2): maxReach = 2",
          "explanation_hi": "Index 0 se reach = 2"
        },
        {
          "activeIdx": 1,
          "elements": [
            2,
            3,
            1,
            1,
            4
          ],
          "explanation": "At index 1 (val 3): maxReach = 1 + 3 = 4. Last index reached!",
          "explanation_hi": "Index 1 se reach = 4 -> Aakhiri index reach ho gaya!"
        }
      ],
      "result": true
    },
    "code": "function canJump(nums) {\n  let maxReach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false;\n    maxReach = Math.max(maxReach, i + nums[i]);\n    if (maxReach >= nums.length - 1) return true;\n  }\n  return true;\n}\n\nconsole.log(canJump([2,3,1,1,4])); // true",
    "searchSignals": {
      "tags": [
        "greedy",
        "jump-game",
        "array"
      ],
      "keywords": [
        "jump game",
        "max reach greedy",
        "jump game ii"
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
        "title": "Jump Game",
        "difficulty": "Medium",
        "slug": "jump-game",
        "url": "https://leetcode.com/problems/jump-game/"
      },
      {
        "title": "Jump Game II",
        "difficulty": "Medium",
        "slug": "jump-game-ii",
        "url": "https://leetcode.com/problems/jump-game-ii/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Jump Game Editorial",
        "url": "https://leetcode.com/problems/jump-game/editorial/",
        "type": "LeetCode"
      }
    ]
  }
};
