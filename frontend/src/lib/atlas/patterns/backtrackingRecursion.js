export const backtrackingRecursionPatterns = {
  "Permutations": {
    "slug": "backtracking-permutations",
    "name": "Permutations",
    "topic": "Backtracking",
    "difficulty": "Medium",
    "timeComplexity": "O(N * N!)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Permutations (Backtracking with Used Array / Swapping)",
      "overview": "Generating all N! ordered arrangements of distinct elements using a decision tree with choose-explore-unchoose pattern.",
      "whatItIs": "Recursively builds candidate sequences by picking an unused number, recursing down, and backtracking (unchoosing) to restore state.",
      "whyItWorks": "Every level k in the decision tree chooses the k-th position from the remaining N - k available items.",
      "whenToUse": "Permutations I & II (with duplicates), Next Permutation, Letter Combinations of a Phone Number.",
      "recognitionSignals": [
        "Generate all possible orderings/arrangements of elements",
        "Order matters: [1, 2] is distinct from [2, 1]"
      ],
      "commonMistakes": [
        "Pushing array reference `res.push(curr)` instead of shallow clone `res.push([...curr])`",
        "Handling duplicates without sorting and skipping `if (i > 0 && nums[i] === nums[i-1] && !used[i-1])`"
      ],
      "stepLogic": "1. In backtrack(curr, used):\n   a. If curr.length === nums.length: res.push([...curr]); return\n   b. For i = 0 to nums.length - 1:\n      if (used[i]) continue\n      used[i] = true; curr.push(nums[i])\n      backtrack(curr, used)\n      curr.pop(); used[i] = false (Backtrack!)\n2. Return res."
    },
    "hi": {
      "title": "Permutations (Backtracking)",
      "overview": "Elements ke sabhi possible arrangements (N! permutations) nikalna Choose-Explore-Unchoose pattern se.",
      "whatItIs": "Decision tree mein ek unused number select karna, aage explore karna, aur wapas aate waqt state restore karna (pop & unmark).",
      "whyItWorks": "Tree ki har depth par agle index ke liye candidate choose hota hai aur backtracking se saari branches explore hoti hain.",
      "whenToUse": "Permutations I & II problems mein jahan order matter karta hai.",
      "recognitionSignals": [
        "All arrangements of numbers",
        "Order matters ([1, 2] !== [2, 1])"
      ],
      "commonMistakes": [
        "Array reference copy karna bina clone kiye (`res.push([...curr])` zaroori hai)"
      ],
      "stepLogic": "1. backtrack function banayein.\n2. Length complete hone par shallow copy push karein.\n3. used[i] mark karein, push karein, recurse karein, aur pop + unmark karein."
    },
    "visual": {
      "type": "DECISION_TREE",
      "category": "BACKTRACKING",
      "title": "Choose-Explore-Unchoose Decision Tree",
      "input": [
        1,
        2,
        3
      ],
      "description": "Root branches into choices: pick 1 -> picks 2 -> picks 3 -> [1, 2, 3]. Backtracks to explore [1, 3, 2]. Total 6 permutations.",
      "description_hi": "Har branch ek permutation banati hai aur backtrack karke dusre raste explore karti hai.",
      "steps": [
        {
          "branch": "Choose 1",
          "valid": true,
          "explanation": "Branch picks 1 as first element",
          "explanation_hi": "1 pick kiya"
        },
        {
          "branch": "Choose 2",
          "valid": true,
          "explanation": "Branch picks 2 -> picks 3 -> Result: [1, 2, 3]",
          "explanation_hi": "[1, 2, 3] complete hua"
        },
        {
          "branch": "Backtrack 2, Choose 3",
          "valid": true,
          "explanation": "Unchoose 2, choose 3 -> Result: [1, 3, 2]",
          "explanation_hi": "[1, 3, 2] complete hua"
        }
      ],
      "result": [
        [
          1,
          2,
          3
        ],
        [
          1,
          3,
          2
        ],
        [
          2,
          1,
          3
        ],
        [
          2,
          3,
          1
        ],
        [
          3,
          1,
          2
        ],
        [
          3,
          2,
          1
        ]
      ]
    },
    "code": "function permute(nums) {\n  const res = [];\n  const used = new Array(nums.length).fill(false);\n  \n  function backtrack(path) {\n    if (path.length === nums.length) {\n      res.push([...path]);\n      return;\n    }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n      used[i] = true;\n      path.push(nums[i]);\n      backtrack(path);\n      path.pop();\n      used[i] = false;\n    }\n  }\n  \n  backtrack([]);\n  return res;\n}\n\nconsole.log(permute([1, 2, 3]));",
    "searchSignals": {
      "tags": [
        "backtracking",
        "permutations",
        "recursion"
      ],
      "keywords": [
        "permutations",
        "backtracking decision tree",
        "generate all permutations"
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
        "title": "Permutations",
        "difficulty": "Medium",
        "slug": "permutations",
        "url": "https://leetcode.com/problems/permutations/"
      },
      {
        "title": "Permutations II",
        "difficulty": "Medium",
        "slug": "permutations-ii",
        "url": "https://leetcode.com/problems/permutations-ii/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Permutations Editorial",
        "url": "https://leetcode.com/problems/permutations/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Combinations": {
    "slug": "backtracking-combinations",
    "name": "Combinations",
    "topic": "Backtracking",
    "difficulty": "Medium",
    "timeComplexity": "O(k * C(n, k))",
    "spaceComplexity": "O(k)",
    "interviewFrequency": "High",
    "en": {
      "title": "Combinations (Start Index Pruning)",
      "overview": "Generating all combinations of k numbers chosen from range 1 to n where order does not matter.",
      "whatItIs": "Use a `start` index parameter in recursive calls (`i + 1`) to ensure elements are always chosen in increasing order, preventing duplicate sets like `[1, 2]` and `[2, 1]`.",
      "whyItWorks": "Enforcing ascending order partitions combinations canonically, visiting each subset of size k exactly once.",
      "whenToUse": "Combinations, Combination Sum I, II, III.",
      "recognitionSignals": [
        "Choose k numbers from n where order does not matter",
        "Subset of fixed size k",
        "Start index progression"
      ],
      "commonMistakes": [
        "Looping without pruning: `i <= n - (k - path.length) + 1` (prunes impossible branches where not enough remaining numbers exist)"
      ],
      "stepLogic": "1. In backtrack(start, path):\n   a. If path.length === k: res.push([...path]); return\n   b. For i = start to n - (k - path.length) + 1: (Pruned!)\n      path.push(i)\n      backtrack(i + 1, path)\n      path.pop() (Backtrack!)\n2. Return res."
    },
    "hi": {
      "title": "Combinations (Start Index Pruning)",
      "overview": "1 se n ke beech k numbers ke combinations banana jahan order matter nahi karta.",
      "whatItIs": "Recursion mein `start` parameter pass karke aage ke numbers pick karna taaki duplicate sets na banein.",
      "whyItWorks": "Ascending order enforce karne se `[1, 2]` banta hai par `[2, 1]` repeat nahi hota.",
      "whenToUse": "Combinations, Combination Sum problems mein.",
      "recognitionSignals": [
        "Choose k elements from n",
        "Combinations order does not matter"
      ],
      "commonMistakes": [
        "Loop pruning miss karna jab remaining elements k se kam bache hon"
      ],
      "stepLogic": "1. path.length === k hone par push karein.\n2. i = start se loop chalayein.\n3. backtrack(i + 1) call karein aur pop karein."
    },
    "visual": {
      "type": "DECISION_TREE",
      "category": "BACKTRACKING",
      "title": "Combinations Branch Pruning",
      "input": {
        "n": 4,
        "k": 2
      },
      "description": "Start index ensures ascending choices: 1 -> [2, 3, 4], 2 -> [3, 4], 3 -> [4]. Prunes branch starting at 4.",
      "description_hi": "Start index se duplicates avoid hote hain: [1,2], [1,3], [1,4], [2,3], [2,4], [3,4].",
      "steps": [
        {
          "branch": "Pick 1 -> Pick 2",
          "valid": true,
          "explanation": "Forms valid combination [1, 2]",
          "explanation_hi": "[1, 2] bana"
        },
        {
          "branch": "Pick 1 -> Pick 3",
          "valid": true,
          "explanation": "Forms valid combination [1, 3]",
          "explanation_hi": "[1, 3] bana"
        },
        {
          "branch": "Pick 4 for start",
          "valid": false,
          "explanation": "Pruned! Not enough remaining items to reach size k=2",
          "explanation_hi": "Pruned! Elements kam bache hain"
        }
      ],
      "result": [
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          1,
          4
        ],
        [
          2,
          3
        ],
        [
          2,
          4
        ],
        [
          3,
          4
        ]
      ]
    },
    "code": "function combine(n, k) {\n  const res = [];\n  \n  function backtrack(start, path) {\n    if (path.length === k) {\n      res.push([...path]);\n      return;\n    }\n    // Pruned loop boundary: need (k - path.length) more elements\n    for (let i = start; i <= n - (k - path.length) + 1; i++) {\n      path.push(i);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  \n  backtrack(1, []);\n  return res;\n}\n\nconsole.log(combine(4, 2));",
    "searchSignals": {
      "tags": [
        "backtracking",
        "combinations",
        "pruning"
      ],
      "keywords": [
        "combinations",
        "combination sum",
        "pruned backtracking"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Combinations",
        "difficulty": "Medium",
        "slug": "combinations",
        "url": "https://leetcode.com/problems/combinations/"
      },
      {
        "title": "Combination Sum",
        "difficulty": "Medium",
        "slug": "combination-sum",
        "url": "https://leetcode.com/problems/combination-sum/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Combinations Editorial",
        "url": "https://leetcode.com/problems/combinations/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "N Queens": {
    "slug": "backtracking-n-queens",
    "name": "N Queens",
    "topic": "Backtracking",
    "difficulty": "Hard",
    "timeComplexity": "O(N!)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "N-Queens (Diagonal & Column Conflict Tracking)",
      "overview": "Placing N non-attacking queens on an N×N chessboard using row-by-row backtracking with O(1) conflict sets.",
      "whatItIs": "Place one queen per row. Track attacked columns with `cols` set, positive diagonals with `(row + col)` set, and negative diagonals with `(row - col)` set.",
      "whyItWorks": "Any cell on the same major diagonal shares constant `row - col`. Any cell on the same minor diagonal shares constant `row + col`. Set lookups take O(1).",
      "whenToUse": "N-Queens I & II, Sudoku Solver, placing non-attacking pieces.",
      "recognitionSignals": [
        "Place N queens on NxN board without attacking each other",
        "Diagonal constraint hashing"
      ],
      "commonMistakes": [
        "Linear scanning for diagonal conflicts instead of O(1) hash sets"
      ],
      "stepLogic": "1. Sets: cols, diag1 (r - c), diag2 (r + c).\n2. In backtrack(row):\n   a. If row === n: record board; return\n   b. For col = 0 to n - 1:\n      if (cols.has(col) || diag1.has(r - c) || diag2.has(r + c)) continue (Pruned!)\n      add to sets; place queen\n      backtrack(row + 1)\n      remove from sets; remove queen (Backtrack!)."
    },
    "hi": {
      "title": "N-Queens Problem",
      "overview": "N×N chessboard par N queens ko aise place karna taaki koi bhi queen dusri ko attack na kare.",
      "whatItIs": "Har row mein ek queen place karna aur columns, `(r - c)` diagonal aur `(r + c)` diagonal ko sets se O(1) mein track karna.",
      "whyItWorks": "Same diagonal ke cells ka difference `r - c` ya sum `r + c` constant rehta hai, isliye conflicts O(1) mein check hote hain.",
      "whenToUse": "N-Queens I & II questions mein.",
      "recognitionSignals": [
        "N Queens on chessboard",
        "Diagonal hashing"
      ],
      "commonMistakes": [
        "Diagonal check karne ke liye board scan karna (O(1) sets use karein)"
      ],
      "stepLogic": "1. cols, diag1, diag2 sets banayein.\n2. Row-by-row backtrack karein.\n3. Conflict na ho toh queen place karein aur next row par jayein; wapas aate waqt unmark karein."
    },
    "visual": {
      "type": "DECISION_TREE",
      "category": "BACKTRACKING",
      "title": "N-Queens Diagonal Pruning (N=4)",
      "input": "4x4 board",
      "description": "Row 0 places Queen at col 1. Row 1: col 0 and col 2 attacked diagonally (pruned!). Places at col 3.",
      "description_hi": "Diagonals par attack hone par invalid branches turant prune ho jaati hain.",
      "steps": [
        {
          "branch": "Row 0: Queen at (0, 1)",
          "valid": true,
          "explanation": "Valid queen placement",
          "explanation_hi": "(0, 1) par queen place hui"
        },
        {
          "branch": "Row 1: Try (1, 0) or (1, 2)",
          "valid": false,
          "explanation": "Pruned! Attacked by (0, 1) diagonals!",
          "explanation_hi": "Pruned! Diagonally attacked cell"
        },
        {
          "branch": "Row 1: Queen at (1, 3)",
          "valid": true,
          "explanation": "Valid safe cell at (1, 3)!",
          "explanation_hi": "(1, 3) safe cell hai"
        }
      ],
      "result": [
        [
          ".Q..",
          "...Q",
          "Q...",
          "..Q."
        ],
        [
          "..Q.",
          "Q...",
          "...Q",
          ".Q.."
        ]
      ]
    },
    "code": "function solveNQueens(n) {\n  const res = [];\n  const cols = new Set(), diag1 = new Set(), diag2 = new Set();\n  const board = Array.from({ length: n }, () => new Array(n).fill('.'));\n  \n  function backtrack(r) {\n    if (r === n) {\n      res.push(board.map(row => row.join('')));\n      return;\n    }\n    for (let c = 0; c < n; c++) {\n      if (cols.has(c) || diag1.has(r - c) || diag2.has(r + c)) continue;\n      \n      cols.add(c); diag1.add(r - c); diag2.add(r + c);\n      board[r][c] = 'Q';\n      \n      backtrack(r + 1);\n      \n      board[r][c] = '.';\n      cols.delete(c); diag1.delete(r - c); diag2.delete(r + c);\n    }\n  }\n  \n  backtrack(0);\n  return res;\n}",
    "searchSignals": {
      "tags": [
        "backtracking",
        "n-queens",
        "board-games"
      ],
      "keywords": [
        "n queens",
        "chessboard backtracking",
        "diagonal conflict sets"
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
        "title": "N-Queens",
        "difficulty": "Hard",
        "slug": "n-queens",
        "url": "https://leetcode.com/problems/n-queens/"
      },
      {
        "title": "N-Queens II",
        "difficulty": "Hard",
        "slug": "n-queens-ii",
        "url": "https://leetcode.com/problems/n-queens-ii/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode N-Queens Editorial",
        "url": "https://leetcode.com/problems/n-queens/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Sudoku": {
    "slug": "backtracking-sudoku",
    "name": "Sudoku",
    "topic": "Backtracking",
    "difficulty": "Hard",
    "timeComplexity": "O(9^EmptyCells)",
    "spaceComplexity": "O(1) in-place board",
    "interviewFrequency": "High",
    "en": {
      "title": "Sudoku Solver (Exact Constraint Backtracking)",
      "overview": "Solving a 9x9 Sudoku grid by filling empty cells with digits 1-9 while respecting row, column, and 3x3 subgrid constraints.",
      "whatItIs": "Find first empty cell `\".\"`. Try digits \"1\" through \"9\": if digit is valid in row, column, and 3x3 box, place it and recurse. If recursion returns true, board is solved.",
      "whyItWorks": "Backtracking prunes immediately when a digit violates Sudoku rules, checking only a tiny fraction of the search space.",
      "whenToUse": "Sudoku Solver, Valid Sudoku.",
      "recognitionSignals": [
        "Solve 9x9 Sudoku puzzle",
        "Constraint satisfaction puzzle"
      ],
      "commonMistakes": [
        "Incorrect 3x3 subbox formula: `boxRow = Math.floor(r / 3) * 3 + Math.floor(i / 3)`, `boxCol = Math.floor(c / 3) * 3 + i % 3`"
      ],
      "stepLogic": "1. In solve(): find next empty cell (r, c). If no empty cell left, return true (solved!).\n2. For digit \"1\" to \"9\":\n   if isValid(r, c, digit): board[r][c] = digit; if solve() return true; board[r][c] = \".\" (Backtrack!).\n3. Return false."
    },
    "hi": {
      "title": "Sudoku Solver",
      "overview": "9x9 Sudoku grid ko empty cells mein 1-9 digits try karke backtrack karte hue solve karna.",
      "whatItIs": "Pehle empty cell par digits 1 se 9 check karna; valid digit place karke aage badhna, galat hone par wapas \".\" karna.",
      "whyItWorks": "Row, Column aur 3x3 Box ke constraints invalid choices ko turant prune kar dete hain.",
      "whenToUse": "Sudoku Solver problem mein.",
      "recognitionSignals": [
        "Sudoku solver",
        "9x9 grid constraints"
      ],
      "commonMistakes": [
        "3x3 box ke coordinates calculate karne mein galti"
      ],
      "stepLogic": "1. Next khali cell dhoondein; na mile toh return true.\n2. Digits 1 se 9 try karein.\n3. Valid hone par place karein, aage solve karein; fail hone par backtrack karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "BACKTRACKING",
      "title": "Sudoku Constraint Validation",
      "input": "9x9 Sudoku board with empty cells",
      "description": "Cell (0, 2) tests digits 1-9: 1 is in row, 2 is in 3x3 box -> pruned! 4 is valid -> placed.",
      "description_hi": "Row, col aur box check karke invalid digits prune ho jaate hain.",
      "steps": [
        {
          "row": 0,
          "col": 2,
          "cellVal": "digit \"4\"",
          "explanation": "Digits 1, 2, 3 violate constraints. Digit 4 is valid -> placed!",
          "explanation_hi": "Digit 4 valid mila -> place kiya"
        }
      ],
      "result": "Solved Board"
    },
    "code": "function solveSudoku(board) {\n  function isValid(r, c, ch) {\n    const boxR = Math.floor(r / 3) * 3, boxC = Math.floor(c / 3) * 3;\n    for (let i = 0; i < 9; i++) {\n      if (board[r][i] === ch) return false;\n      if (board[i][c] === ch) return false;\n      if (board[boxR + Math.floor(i / 3)][boxC + (i % 3)] === ch) return false;\n    }\n    return true;\n  }\n  \n  function solve() {\n    for (let r = 0; r < 9; r++) {\n      for (let c = 0; c < 9; c++) {\n        if (board[r][c] === '.') {\n          for (let d = 1; d <= 9; d++) {\n            const ch = String(d);\n            if (isValid(r, c, ch)) {\n              board[r][c] = ch;\n              if (solve()) return true;\n              board[r][c] = '.'; // Backtrack\n            }\n          }\n          return false;\n        }\n      }\n    }\n    return true;\n  }\n  solve();\n}",
    "searchSignals": {
      "tags": [
        "backtracking",
        "sudoku",
        "matrix"
      ],
      "keywords": [
        "sudoku solver",
        "valid sudoku",
        "exact cover backtracking"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Sudoku Solver",
        "difficulty": "Hard",
        "slug": "sudoku-solver",
        "url": "https://leetcode.com/problems/sudoku-solver/"
      },
      {
        "title": "Valid Sudoku",
        "difficulty": "Medium",
        "slug": "valid-sudoku",
        "url": "https://leetcode.com/problems/valid-sudoku/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Sudoku Solver Editorial",
        "url": "https://leetcode.com/problems/sudoku-solver/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Word Search": {
    "slug": "backtracking-word-search",
    "name": "Word Search",
    "topic": "Backtracking",
    "difficulty": "Medium",
    "timeComplexity": "O(R * C * 3^L)",
    "spaceComplexity": "O(L) call stack",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Word Search (Grid DFS with In-Place Visited Masking)",
      "overview": "Checking if a word exists in a 2D character board by moving horizontally or vertically without reusing the same cell twice.",
      "whatItIs": "DFS matching characters sequentially. Mark current cell visited in-place by setting `board[r][c] = \"#\"` before recursing, then restore original character upon return.",
      "whyItWorks": "In-place character modification achieves O(1) auxiliary space without maintaining a separate visited matrix.",
      "whenToUse": "Word Search I & II (Word Search II combines with Trie).",
      "recognitionSignals": [
        "Find word in 2D character grid",
        "Cannot use same letter cell more than once"
      ],
      "commonMistakes": [
        "Forgetting to restore `board[r][c] = temp` when backtracking",
        "Not pruning immediately if remaining characters in word cannot fit on board"
      ],
      "stepLogic": "1. In dfs(r, c, idx):\n   a. If idx === word.length return true\n   b. If out of bounds or board[r][c] !== word[idx] return false\n   c. temp = board[r][c]; board[r][c] = \"#\" (Visited)\n   d. found = dfs(r+1,c) || dfs(r-1,c) || dfs(r,c+1) || dfs(r,c-1)\n   e. board[r][c] = temp (Backtrack!)\n   f. return found."
    },
    "hi": {
      "title": "Word Search (Grid Backtracking)",
      "overview": "2D grid mein word search karna in-place visited masking `#` use karke bina extra memory ke.",
      "whatItIs": "Letter match hone par cell ko temporary `#` banate hain taaki wahi cell usi path mein dobara use na ho, fir return par restore karte hain.",
      "whyItWorks": "In-place character masking se O(1) auxiliary space mein exact path constraints enforce hoti hain.",
      "whenToUse": "Word Search I aur II (Trie ke sath) problems mein.",
      "recognitionSignals": [
        "Grid mein word find karna",
        "Same cell do baar use nahi ho sakta"
      ],
      "commonMistakes": [
        "Backtrack karte waqt original character restore karna bhool jana"
      ],
      "stepLogic": "1. Base case: word complete hone par true return karein.\n2. Mismatch par false return karein.\n3. `#` mark karein, 4 directions explore karein, aur character restore karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "BACKTRACKING",
      "title": "Word Search In-Place Masking",
      "input": {
        "board": [
          [
            "A",
            "B",
            "C",
            "E"
          ],
          [
            "S",
            "F",
            "C",
            "S"
          ],
          [
            "A",
            "D",
            "E",
            "E"
          ]
        ],
        "word": "ABCCED"
      },
      "description": "Follows path: (0,0)A -> (0,1)B -> (0,2)C -> (1,2)C -> (2,2)E -> (2,1)D. Returns true!",
      "description_hi": "Path A->B->C->C->E->D match hota hai. Result = true.",
      "steps": [
        {
          "row": 0,
          "col": 0,
          "cellVal": "\"A\" -> \"#\"",
          "explanation": "Match \"A\", mask as \"#\"",
          "explanation_hi": "\"A\" match hua, mask kiya"
        },
        {
          "row": 2,
          "col": 1,
          "cellVal": "\"D\" (complete!)",
          "explanation": "Final letter \"D\" matched! Word \"ABCCED\" found!",
          "explanation_hi": "Final letter match hua. Word found!"
        }
      ],
      "result": true
    },
    "code": "function exist(board, word) {\n  const m = board.length, n = board[0].length;\n  \n  function dfs(r, c, idx) {\n    if (idx === word.length) return true;\n    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[idx]) return false;\n    \n    const temp = board[r][c];\n    board[r][c] = '#'; // Mark visited in-place\n    \n    const found = dfs(r + 1, c, idx + 1) ||\n                  dfs(r - 1, c, idx + 1) ||\n                  dfs(r, c + 1, idx + 1) ||\n                  dfs(r, c - 1, idx + 1);\n                  \n    board[r][c] = temp; // Backtrack!\n    return found;\n  }\n  \n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (dfs(r, c, 0)) return true;\n    }\n  }\n  return false;\n}",
    "searchSignals": {
      "tags": [
        "backtracking",
        "word-search",
        "grid",
        "dfs"
      ],
      "keywords": [
        "word search",
        "grid word search",
        "in place visited mask"
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
        "title": "Word Search",
        "difficulty": "Medium",
        "slug": "word-search",
        "url": "https://leetcode.com/problems/word-search/"
      },
      {
        "title": "Word Search II",
        "difficulty": "Hard",
        "slug": "word-search-ii",
        "url": "https://leetcode.com/problems/word-search-ii/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Word Search Editorial",
        "url": "https://leetcode.com/problems/word-search/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Subsets": {
    "slug": "backtracking-subsets",
    "name": "Subsets",
    "topic": "Backtracking",
    "difficulty": "Medium",
    "timeComplexity": "O(N * 2^N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Subsets (Power Set Generation)",
      "overview": "Generating all 2^N subsets of a set of numbers by branching on whether to include or exclude each element.",
      "whatItIs": "At each index i from `start` to n-1: push `nums[i]`, recurse for `i + 1`, then pop `nums[i]`. Every intermediate state is a valid subset added to results.",
      "whyItWorks": "Binary choice model: each element has exactly 2 options (in or out), creating 2^N distinct leaf states.",
      "whenToUse": "Subsets I & II (with duplicates), Letter Tile Possibilities.",
      "recognitionSignals": [
        "Generate power set",
        "All possible subsets of array",
        "Subsets with duplicates skipping"
      ],
      "commonMistakes": [
        "Handling duplicates: must sort first and skip `if (i > start && nums[i] === nums[i - 1]) continue`"
      ],
      "stepLogic": "1. In backtrack(start, curr):\n   a. res.push([...curr]) (Every prefix is a valid subset!)\n   b. For i = start to nums.length - 1:\n      if (i > start && nums[i] === nums[i - 1]) continue (Skip duplicates!)\n      curr.push(nums[i])\n      backtrack(i + 1, curr)\n      curr.pop() (Backtrack!)\n2. Return res."
    },
    "hi": {
      "title": "Subsets (Power Set)",
      "overview": "Array ke sabhi 2^N possible subsets generate karna include/exclude decision tree se.",
      "whatItIs": "Har step par current state ko results mein add karna, element include karna, recurse karna, aur backtrack karna.",
      "whyItWorks": "Har element ke paas 2 choices hoti hain (subset mein aana ya na aana), total 2^N combinations bante hain.",
      "whenToUse": "Subsets I & II problems mein.",
      "recognitionSignals": [
        "Power set",
        "All subsets of numbers"
      ],
      "commonMistakes": [
        "Duplicates handle karne ke liye pehle sort na karna"
      ],
      "stepLogic": "1. res.push([...curr]) karein.\n2. start se loop chalayein.\n3. Duplicate skip karein, push karein, recurse karein, aur pop karein."
    },
    "visual": {
      "type": "DECISION_TREE",
      "category": "BACKTRACKING",
      "title": "Subsets Inclusion Tree (2^3 = 8)",
      "input": [
        1,
        2,
        3
      ],
      "description": "Branches: [] -> [1] -> [1, 2] -> [1, 2, 3]. Backtracks to [1, 3], [2], [2, 3], [3]. Exactly 8 subsets.",
      "description_hi": "Binary decision tree se sabhi 8 subsets generate hote hain.",
      "steps": [
        {
          "branch": "Empty subset []",
          "valid": true,
          "explanation": "Base empty subset []",
          "explanation_hi": "Empty subset []"
        },
        {
          "branch": "Branch 1: [1], [1, 2], [1, 2, 3]",
          "valid": true,
          "explanation": "Subsets containing 1",
          "explanation_hi": "1 wale subsets"
        },
        {
          "branch": "Branch 2: [2], [2, 3], [3]",
          "valid": true,
          "explanation": "Subsets without 1. All 8 subsets generated!",
          "explanation_hi": "Bina 1 wale subsets"
        }
      ],
      "result": [
        [],
        [
          1
        ],
        [
          2
        ],
        [
          1,
          2
        ],
        [
          3
        ],
        [
          1,
          3
        ],
        [
          2,
          3
        ],
        [
          1,
          2,
          3
        ]
      ]
    },
    "code": "function subsets(nums) {\n  const res = [];\n  function backtrack(start, curr) {\n    res.push([...curr]);\n    for (let i = start; i < nums.length; i++) {\n      curr.push(nums[i]);\n      backtrack(i + 1, curr);\n      curr.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}\n\nconsole.log(subsets([1, 2, 3]));",
    "searchSignals": {
      "tags": [
        "backtracking",
        "subsets",
        "power-set"
      ],
      "keywords": [
        "subsets",
        "power set",
        "generate all subsets"
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
        "title": "Subsets",
        "difficulty": "Medium",
        "slug": "subsets",
        "url": "https://leetcode.com/problems/subsets/"
      },
      {
        "title": "Subsets II",
        "difficulty": "Medium",
        "slug": "subsets-ii",
        "url": "https://leetcode.com/problems/subsets-ii/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Subsets Editorial",
        "url": "https://leetcode.com/problems/subsets/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Branch and Bound": {
    "slug": "backtracking-branch-and-bound",
    "name": "Branch and Bound",
    "topic": "Backtracking",
    "difficulty": "Hard",
    "timeComplexity": "Exponential worst-case, drastically pruned",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Branch and Bound (Heuristic Pruning)",
      "overview": "Searching combinatorial state spaces while aggressively bounding and pruning subtrees that cannot beat the current best solution.",
      "whatItIs": "Calculate an admissible lower/upper bound on the cost of the best possible completion of the current state. If `currentCost + bound >= bestCostSoFar`, prune the entire branch.",
      "whyItWorks": "Guarantees optimality while discarding massive subtrees without exploring them.",
      "whenToUse": "0/1 Knapsack optimization, Traveling Salesperson, Assignment Problem, 15-Puzzle (A* search).",
      "recognitionSignals": [
        "Combinatorial optimization with lower bound heuristic",
        "Pruning branches that cannot beat current best"
      ],
      "commonMistakes": [
        "Using an inadmissible bound that underestimates true cost in a maximization problem (cuts off optimal solutions)"
      ],
      "stepLogic": "1. Track bestCostSoFar.\n2. In explore(state):\n   a. If complete: update bestCostSoFar = min(bestCostSoFar, state.cost); return\n   b. bound = computeOptimisticBound(state)\n   c. If state.cost + bound >= bestCostSoFar return (Pruned!)\n   d. For nextState in getNextStates(): explore(nextState)."
    },
    "hi": {
      "title": "Branch and Bound",
      "overview": "Optimistic lower bound calculate karke un saari branches ko pehle hi prune kar dena jo current best answer se behtar nahi ho sakti.",
      "whatItIs": "Agar current branch ka sabse best possible future score bhi ab tak ke best answer se kharab hai, toh aage explore mat karo.",
      "whyItWorks": "Admissible heuristic bounds guarantee karti hain ki optimal answer kabhi skip nahi hoga jabki lakho unnecessary branches prune ho jayengi.",
      "whenToUse": "TSP, Knapsack exact branch-and-bound optimization mein.",
      "recognitionSignals": [
        "Branch and bound",
        "Prune by heuristic bound"
      ],
      "commonMistakes": [
        "Bound formula galat bana dena jo optimal answer ko prune kar de"
      ],
      "stepLogic": "1. bestCost track karein.\n2. optimistic bound nikaalein.\n3. Agar `cost + bound >= bestCost` ho toh turant prune karein."
    },
    "visual": {
      "type": "DECISION_TREE",
      "category": "BACKTRACKING",
      "title": "Branch & Bound Pruning Horizon",
      "input": "State space search with current best cost = 12",
      "description": "Branch A: cost 7 + bound 6 = 13 > 12 -> Pruned! Branch B: cost 5 + bound 4 = 9 < 12 -> Explored.",
      "description_hi": "Branch A ka optimistic cost 13 hai jo 12 se bada hai, isliye turant prune hui.",
      "steps": [
        {
          "branch": "Branch A (Estimated cost 13)",
          "valid": false,
          "explanation": "Pruned! 13 >= bestCost (12). Cannot produce an improvement!",
          "explanation_hi": "Pruned! Best se behtar nahi ho sakti"
        },
        {
          "branch": "Branch B (Estimated cost 9)",
          "valid": true,
          "explanation": "Explored: 9 < 12. Potential new optimum!",
          "explanation_hi": "Explored: 9 < 12 naya best mil sakta hai"
        }
      ],
      "result": {
        "bestCost": 11
      }
    },
    "code": "function solveTSPBranchBound(dist) {\n  const n = dist.length;\n  let bestCost = Infinity;\n  const visited = new Array(n).fill(false);\n  visited[0] = true;\n  \n  function getBound(curr, count) {\n    let bound = 0;\n    // Simple bound: sum of minimum outgoing edges for remaining unvisited nodes\n    for (let i = 0; i < n; i++) {\n      if (!visited[i] || i === curr) {\n        let minEdge = Infinity;\n        for (let j = 0; j < n; j++) {\n          if (i !== j && (!visited[j] || j === 0)) {\n            minEdge = Math.min(minEdge, dist[i][j]);\n          }\n        }\n        if (minEdge !== Infinity) bound += minEdge;\n      }\n    }\n    return bound;\n  }\n  \n  function dfs(curr, count, cost) {\n    if (count === n) {\n      bestCost = Math.min(bestCost, cost + dist[curr][0]);\n      return;\n    }\n    if (cost + getBound(curr, count) >= bestCost) return; // Pruned!\n    \n    for (let next = 0; next < n; next++) {\n      if (!visited[next]) {\n        visited[next] = true;\n        dfs(next, count + 1, cost + dist[curr][next]);\n        visited[next] = false;\n      }\n    }\n  }\n  \n  dfs(0, 1, 0);\n  return bestCost;\n}",
    "searchSignals": {
      "tags": [
        "backtracking",
        "branch-and-bound",
        "optimization"
      ],
      "keywords": [
        "branch and bound",
        "tsp branch and bound",
        "heuristic pruning"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Find Minimum Time to Finish All Jobs",
        "difficulty": "Hard",
        "slug": "find-minimum-time-to-finish-all-jobs",
        "url": "https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs/"
      }
    ],
    "externalResources": [
      {
        "name": "GFG Branch and Bound",
        "url": "https://www.geeksforgeeks.org/branch-and-bound-algorithm/",
        "type": "GFG"
      }
    ]
  },
  "Divide and Conquer": {
    "slug": "recursion-divide-and-conquer",
    "name": "Divide and Conquer",
    "topic": "Recursion",
    "difficulty": "Medium",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Divide and Conquer (Merge Sort / Binary Partition)",
      "overview": "Breaking a problem into smaller independent subproblems, solving them recursively, and combining their results.",
      "whatItIs": "Split array into two halves at midpoint. Recursively sort left and right halves. Merge the two sorted halves in O(N).",
      "whyItWorks": "Recurrence relation `T(N) = 2T(N/2) + O(N)` solves to `O(N log N)` via the Master Theorem.",
      "whenToUse": "Merge Sort, Sort an Array, Count of Smaller Numbers After Self, Maximum Subarray (D&C).",
      "recognitionSignals": [
        "Divide problem into equal halves",
        "Combine step takes linear time",
        "Recurrence matches Master Theorem"
      ],
      "commonMistakes": [
        "Copying sub-arrays with `.slice()` inside recursion causing excess memory allocations"
      ],
      "stepLogic": "1. Base case: if (l >= r) return.\n2. mid = (l + r) / 2.\n3. Recurse: divide(l, mid); divide(mid + 1, r).\n4. Conquer: merge(l, mid, r) in sorted order."
    },
    "hi": {
      "title": "Divide and Conquer (Merge Sort)",
      "overview": "Problem ko do barabar subproblems mein todna, dono ko solve karna, aur unke answers ko linear time mein combine karna.",
      "whatItIs": "Array ko midpoint par split karna, dono halves sort karna aur fir do sorted halves ko merge karna.",
      "whyItWorks": "Master Theorem ke mutabik `T(N) = 2T(N/2) + O(N)` strictly `O(N log N)` time guarantee karta hai.",
      "whenToUse": "Merge Sort, Count Inversions problems mein.",
      "recognitionSignals": [
        "Halves mein divide karna",
        "Merge step in O(N)"
      ],
      "commonMistakes": [
        "Har step par naya array create karke memory waste karna"
      ],
      "stepLogic": "1. Base case: single element par return karein.\n2. mid nikaal kar dono halves recurse karein.\n3. Sorted halves ko merge karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "RECURSION",
      "title": "Divide and Conquer Tree",
      "input": [
        38,
        27,
        43,
        3,
        9,
        82,
        10
      ],
      "description": "Splits: [38, 27, 43, 3] and [9, 82, 10]. Recursively sorts, then merges into [3, 9, 10, 27, 38, 43, 82].",
      "description_hi": "Dono halves sort hoke merge hote hain.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            38,
            27,
            43,
            3
          ],
          "explanation": "Left half: [38, 27, 43, 3]",
          "explanation_hi": "Left half split"
        },
        {
          "activeIdx": 4,
          "elements": [
            9,
            82,
            10
          ],
          "explanation": "Right half: [9, 82, 10]",
          "explanation_hi": "Right half split"
        },
        {
          "activeIdx": 0,
          "elements": [
            3,
            9,
            10,
            27,
            38,
            43,
            82
          ],
          "explanation": "Merged sorted result in O(N log N)!",
          "explanation_hi": "Merged sorted result complete!"
        }
      ],
      "result": [
        3,
        9,
        10,
        27,
        38,
        43,
        82
      ]
    },
    "code": "function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  \n  const res = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) res.push(left[i++]);\n    else res.push(right[j++]);\n  }\n  return [...res, ...left.slice(i), ...right.slice(j)];\n}\n\nconsole.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));",
    "searchSignals": {
      "tags": [
        "recursion",
        "divide-and-conquer",
        "sorting"
      ],
      "keywords": [
        "divide and conquer",
        "merge sort",
        "master theorem"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Sort an Array",
        "difficulty": "Medium",
        "slug": "sort-an-array",
        "url": "https://leetcode.com/problems/sort-an-array/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Divide and Conquer Card",
        "url": "https://leetcode.com/explore/learn/card/recursion-ii/",
        "type": "LeetCode"
      }
    ]
  },
  "Recursion Trees": {
    "slug": "recursion-recursion-trees",
    "name": "Recursion Trees",
    "topic": "Recursion",
    "difficulty": "Medium",
    "timeComplexity": "O(Branches^Depth)",
    "spaceComplexity": "O(Depth)",
    "interviewFrequency": "High",
    "en": {
      "title": "Recursion Trees (Call Stack State Visualization)",
      "overview": "Visualizing and analyzing algorithm complexity by drawing the branching call stack tree.",
      "whatItIs": "Each node in the recursion tree represents a function invocation with its arguments. Total work is sum of work done across all levels.",
      "whyItWorks": "Visualizing recursion trees clarifies geometric series sums and reveals overlapping subproblems (motivating dynamic programming).",
      "whenToUse": "Fibonacci recurrence, Merge Sort complexity analysis, Strassen's matrix multiplication analysis.",
      "recognitionSignals": [
        "Analyze complexity of recursive relations",
        "Identify exponential branching"
      ],
      "commonMistakes": [
        "Confusing tree depth (height) with total node count (e.g. depth N vs 2^N nodes)"
      ],
      "stepLogic": "1. Root node is initial call f(N).\n2. Branch into subproblems (e.g. f(N-1) and f(N-2)).\n3. Calculate work per level.\n4. Sum work over all levels to derive Master Theorem complexity."
    },
    "hi": {
      "title": "Recursion Trees",
      "overview": "Recursive algorithm ke calls ko tree ke roop mein draw karke total time aur space complexity calculate karna.",
      "whatItIs": "Tree ka har node ek function call represent karta hai. Har level ka work sum karke overall big-O nikaalte hain.",
      "whyItWorks": "Overlapping subproblems aur exponential branching visual tree se turant clear ho jati hai.",
      "whenToUse": "Recurrence relation solve karne aur DP motivation dekhne mein.",
      "recognitionSignals": [
        "Recursion tree analysis",
        "Branching factor evaluation"
      ],
      "commonMistakes": [
        "Tree depth (stack space) aur total nodes (time complexity) mein confuse hona"
      ],
      "stepLogic": "1. Root initial call represent karta hai.\n2. Children subproblems hote hain.\n3. Har level ka work calculate karein."
    },
    "visual": {
      "type": "TREE",
      "category": "RECURSION",
      "title": "Fibonacci Recursion Tree Branching",
      "input": "fib(4)",
      "description": "fib(4) calls fib(3) and fib(2). fib(3) calls fib(2) and fib(1). fib(2) is calculated TWICE (redundant!).",
      "description_hi": "fib(2) do baar call hota hai jo overlap show karta hai.",
      "steps": [
        {
          "activeNode": 4,
          "path": [
            4
          ],
          "explanation": "fib(4) branches into fib(3) and fib(2)",
          "explanation_hi": "fib(4) do branches mein split hua"
        },
        {
          "activeNode": 2,
          "path": [
            4,
            2
          ],
          "explanation": "fib(2) appears in both left and right subtrees -> redundant overlap!",
          "explanation_hi": "fib(2) overlap hua -> DP ki zaroorat hai"
        }
      ],
      "result": 3
    },
    "code": "function fibTree(n) {\n  if (n <= 1) return n;\n  return fibTree(n - 1) + fibTree(n - 2);\n}\n\nconsole.log(fibTree(4)); // 3",
    "searchSignals": {
      "tags": [
        "recursion",
        "recursion-tree",
        "complexity"
      ],
      "keywords": [
        "recursion tree",
        "recurrence analysis",
        "fibonacci recursion tree"
      ],
      "companies": [
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Fibonacci Number",
        "difficulty": "Easy",
        "slug": "fibonacci-number",
        "url": "https://leetcode.com/problems/fibonacci-number/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Recursion Card",
        "url": "https://leetcode.com/explore/learn/card/recursion-i/",
        "type": "LeetCode"
      }
    ]
  },
  "Tail Recursion": {
    "slug": "recursion-tail-recursion",
    "name": "Tail Recursion",
    "topic": "Recursion",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1) with Tail Call Optimization (TCO)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Tail Recursion (Accumulator Pattern & TCO)",
      "overview": "Recursive functions where the recursive call is the final operation, allowing compilers to reuse the existing stack frame in O(1) space.",
      "whatItIs": "Pass an accumulator parameter that aggregates the result forward: `tailFact(n, acc = 1) => tailFact(n - 1, n * acc)`.",
      "whyItWorks": "Since no computation remains after the recursive call returns, the caller frame can be replaced directly with the callee frame.",
      "whenToUse": "Functional programming patterns, deep recursions avoiding stack overflow.",
      "recognitionSignals": [
        "Convert recursion to O(1) space",
        "Accumulator pattern in recursive arguments"
      ],
      "commonMistakes": [
        "Leaving an operation after the call (e.g. `return n * fact(n - 1)` is NOT tail recursive because multiplication happens after return)"
      ],
      "stepLogic": "1. Add accumulator argument to recursive function.\n2. In base case: return accumulator.\n3. In recursive step: return function(n - 1, newAccumulatorVal)."
    },
    "hi": {
      "title": "Tail Recursion (Accumulator Pattern)",
      "overview": "Recursion jisme recursive call aakhiri statement hoti hai, jisse compiler stack frame reuse karke O(1) space mein execute kar sakta hai.",
      "whatItIs": "Accumulator variable ke zariye answer aage pass karna taaki return ke baad koi math operation na bache.",
      "whyItWorks": "Return ke baad kuch bacha nahi hota, isliye stack frame delete karke wahi memory reuse ho jati hai.",
      "whenToUse": "Deep recursion mein stack overflow se bachne ke liye.",
      "recognitionSignals": [
        "Tail call optimization",
        "Accumulator parameter"
      ],
      "commonMistakes": [
        "`return n * func(n-1)` likhna (ye tail recursion nahi hai kyunki multiply baad mein hota hai)"
      ],
      "stepLogic": "1. Accumulator parameter pass karein.\n2. Base case par accumulator return karein.\n3. Recursive call ko exact last statement banayein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "RECURSION",
      "title": "Tail Recursion Stack Reuse",
      "input": "tailFact(4, 1)",
      "description": "tailFact(4, 1) -> tailFact(3, 4) -> tailFact(2, 12) -> tailFact(1, 24). Reuses single stack frame!",
      "description_hi": "Accumulator badhta rehta hai aur ek hi stack frame reuse hota hai.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            4,
            1
          ],
          "explanation": "n=4, acc=1",
          "explanation_hi": "n=4, acc=1"
        },
        {
          "activeIdx": 1,
          "elements": [
            3,
            4
          ],
          "explanation": "n=3, acc=4",
          "explanation_hi": "n=3, acc=4"
        },
        {
          "activeIdx": 3,
          "elements": [
            1,
            24
          ],
          "explanation": "n=1, acc=24 -> Returns 24 in O(1) memory!",
          "explanation_hi": "Answer = 24 in O(1) memory!"
        }
      ],
      "result": 24
    },
    "code": "function tailFact(n, acc = 1) {\n  if (n <= 1) return acc;\n  return tailFact(n - 1, n * acc); // Pure tail call\n}\n\nconsole.log(tailFact(5)); // 120",
    "searchSignals": {
      "tags": [
        "recursion",
        "tail-recursion",
        "functional"
      ],
      "keywords": [
        "tail recursion",
        "tco",
        "accumulator pattern"
      ],
      "companies": [
        "Apple",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Pow(x, n)",
        "difficulty": "Medium",
        "slug": "powx-n",
        "url": "https://leetcode.com/problems/powx-n/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Tail Recursion Tutorial",
        "url": "https://leetcode.com/explore/learn/card/recursion-i/256/complexity-analysis/1672/",
        "type": "LeetCode"
      }
    ]
  },
  "Recursive DFS": {
    "slug": "recursion-recursive-dfs",
    "name": "Recursive DFS",
    "topic": "Recursion",
    "difficulty": "Medium",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Recursive Depth-First Search on Graphs & Trees",
      "overview": "Exploring deeply into recursive tree and graph branches using the system call stack.",
      "whatItIs": "Function recursively calls itself on adjacent unvisited nodes, automatically unwinding and backtracking upon hitting leaf or dead-end.",
      "whyItWorks": "The execution call stack implicitly functions as a LIFO stack, tracking the history of nodes along the current path.",
      "whenToUse": "Path Sum I & II, All Paths From Source to Target, Matchsticks to Square.",
      "recognitionSignals": [
        "Find all paths from root to target",
        "Explore all branches using natural recursion stack"
      ],
      "commonMistakes": [
        "Stack overflow on deep paths (exceeding maximum call stack size of 10,000 frames)"
      ],
      "stepLogic": "1. In dfs(node, path):\n   a. path.push(node.val)\n   b. If (isTarget(node)) res.push([...path])\n   c. For child in children: dfs(child, path)\n   d. path.pop() (Backtrack)."
    },
    "hi": {
      "title": "Recursive DFS",
      "overview": "System call stack ka use karke graph ya tree ki branches ko gehraai tak explore karna.",
      "whatItIs": "Function khud ko unvisited neighbors par call karta hai; dead-end aate hi automatically backtrack karta hai.",
      "whyItWorks": "Call stack khud ek LIFO stack ki tarah kaam karta hai aur current path ki history maintain karta hai.",
      "whenToUse": "Path Sum, All Paths from Source to Target mein.",
      "recognitionSignals": [
        "All paths from source to target",
        "Recursive tree exploration"
      ],
      "commonMistakes": [
        "Maximum call stack size exceed ho jana deep graphs mein"
      ],
      "stepLogic": "1. Node ko path mein add karein.\n2. Target par path save karein.\n3. Children explore karein aur return par pop karein."
    },
    "visual": {
      "type": "TREE",
      "category": "RECURSION",
      "title": "Path Sum Recursive DFS",
      "input": {
        "root": [
          5,
          4,
          8,
          11,
          null,
          13,
          4
        ],
        "targetSum": 22
      },
      "description": "Path 5 -> 4 -> 11 -> 2 sums to 22! Returns true upon leaf verification.",
      "description_hi": "Path 5 -> 4 -> 11 -> 2 ka sum theek 22 banta hai.",
      "steps": [
        {
          "activeNode": 5,
          "path": [
            5
          ],
          "explanation": "Start at root 5 (rem = 17)",
          "explanation_hi": "Root 5 se shuru (rem=17)"
        },
        {
          "activeNode": 4,
          "path": [
            5,
            4
          ],
          "explanation": "Branch to 4 (rem = 13)",
          "explanation_hi": "4 par gaye (rem=13)"
        },
        {
          "activeNode": 11,
          "path": [
            5,
            4,
            11
          ],
          "explanation": "Branch to 11 (rem = 2)",
          "explanation_hi": "11 par gaye (rem=2)"
        },
        {
          "activeNode": 2,
          "path": [
            5,
            4,
            11,
            2
          ],
          "explanation": "Leaf 2 matches remaining sum 2 -> Path sum 22 found!",
          "explanation_hi": "Leaf 2 par sum 22 match ho gaya!"
        }
      ],
      "result": true
    },
    "code": "function hasPathSum(root, targetSum) {\n  if (!root) return false;\n  if (!root.left && !root.right) {\n    return targetSum === root.val;\n  }\n  const remaining = targetSum - root.val;\n  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);\n}",
    "searchSignals": {
      "tags": [
        "recursion",
        "dfs",
        "path-sum",
        "tree"
      ],
      "keywords": [
        "recursive dfs",
        "path sum",
        "all paths from source to target"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Path Sum",
        "difficulty": "Easy",
        "slug": "path-sum",
        "url": "https://leetcode.com/problems/path-sum/"
      },
      {
        "title": "All Paths From Source to Target",
        "difficulty": "Medium",
        "slug": "all-paths-from-source-to-target",
        "url": "https://leetcode.com/problems/all-paths-from-source-to-target/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Path Sum Editorial",
        "url": "https://leetcode.com/problems/path-sum/editorial/",
        "type": "LeetCode"
      }
    ]
  }
};
