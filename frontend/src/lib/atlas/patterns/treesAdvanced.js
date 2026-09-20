export const treesAdvancedPatterns = {
  "Prefix Search": {
    "slug": "tries-prefix-search",
    "name": "Prefix Search",
    "topic": "Tries",
    "difficulty": "Medium",
    "timeComplexity": "O(L) per search",
    "spaceComplexity": "O(N * L * Σ)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Trie Prefix Search",
      "overview": "Checking whether any word in a dictionary begins with a given prefix in O(L) time where L is prefix length.",
      "whatItIs": "Traverse child pointers for each character in prefix; if pointer exists for all characters, the prefix is present.",
      "whyItWorks": "Trie node branches partition dictionary words by common prefix, avoiding O(N * L) linear dictionary scans.",
      "whenToUse": "Implement Trie, Prefix matching, Typeahead search suggestions.",
      "recognitionSignals": [
        "Query whether words start with given prefix",
        "Fast dictionary prefix lookup"
      ],
      "commonMistakes": [
        "Requiring `isEnd === true` for prefix search (prefix search only requires path existence, not terminal word flag)"
      ],
      "stepLogic": "1. Start at root.\n2. For each char in prefix: if (!curr.children[char]) return false; curr = curr.children[char].\n3. Return true."
    },
    "hi": {
      "title": "Trie Prefix Search",
      "overview": "Prefix tree mein check karna ki kya koi word diye gaye prefix se shuru hota hai O(L) time mein.",
      "whatItIs": "Har character ke link ko follow karna; agar saare characters mil jayein toh prefix present hai.",
      "whyItWorks": "Common prefixes share hone ki wajah se word length L par lookup complete ho jata hai.",
      "whenToUse": "Implement Trie, StartsWith queries mein.",
      "recognitionSignals": [
        "startsWith method implement karna",
        "Dictionary prefix match"
      ],
      "commonMistakes": [
        "Prefix search mein `isEnd` true hona check karna (prefix mein `isEnd` zaroori nahi hota)"
      ],
      "stepLogic": "1. Root se shuru karein.\n2. Har character child link check karein; na mile toh false.\n3. Saare characters milte hi true return karein."
    },
    "visual": {
      "type": "TREE",
      "category": "TRIES",
      "title": "Trie Prefix Path Navigation",
      "input": "Words: [\"app\", \"apple\"], Prefix: \"app\"",
      "description": "Follows path root -> \"a\" -> \"p\" -> \"p\". Path exists -> startsWith(\"app\") is true.",
      "description_hi": "Prefix \"app\" ka path match hota hai -> true.",
      "steps": [
        {
          "activeNode": "a",
          "path": [
            "root",
            "a"
          ],
          "explanation": "Follow \"a\"",
          "explanation_hi": "\"a\" follow kiya"
        },
        {
          "activeNode": "p",
          "path": [
            "root",
            "a",
            "p"
          ],
          "explanation": "Follow \"p\"",
          "explanation_hi": "\"p\" follow kiya"
        },
        {
          "activeNode": "p",
          "path": [
            "root",
            "a",
            "p",
            "p"
          ],
          "explanation": "Follow second \"p\". Prefix path exists -> Return true!",
          "explanation_hi": "Prefix path mil gaya -> Return true!"
        }
      ],
      "result": true
    },
    "code": "class TrieNode {\n  constructor() {\n    this.children = {};\n    this.isEnd = false;\n  }\n}\n\nclass Trie {\n  constructor() { this.root = new TrieNode(); }\n  insert(word) {\n    let node = this.root;\n    for (const c of word) {\n      if (!node.children[c]) node.children[c] = new TrieNode();\n      node = node.children[c];\n    }\n    node.isEnd = true;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (const c of prefix) {\n      if (!node.children[c]) return false;\n      node = node.children[c];\n    }\n    return true;\n  }\n}",
    "searchSignals": {
      "tags": [
        "tries",
        "prefix-search",
        "tree"
      ],
      "keywords": [
        "trie prefix search",
        "startswith trie",
        "prefix tree"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Implement Trie (Prefix Tree)",
        "difficulty": "Medium",
        "slug": "implement-trie-prefix-tree",
        "url": "https://leetcode.com/problems/implement-trie-prefix-tree/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Trie Card",
        "url": "https://leetcode.com/explore/learn/card/trie/",
        "type": "LeetCode"
      }
    ]
  },
  "Auto Complete": {
    "slug": "tries-auto-complete",
    "name": "Auto Complete",
    "topic": "Tries",
    "difficulty": "Hard",
    "timeComplexity": "O(P + SubtreeWords)",
    "spaceComplexity": "O(TotalChars)",
    "interviewFrequency": "High",
    "en": {
      "title": "Autocomplete System (Trie with Top-Ranked Suggestions)",
      "overview": "Designing an auto-complete search engine returning top-K most frequent queries matching a prefix.",
      "whatItIs": "Each Trie node caches a list of top 3 most frequent historical queries passing through it.",
      "whyItWorks": "Caching top suggestions directly on nodes eliminates DFS subtree searches during real-time typing.",
      "whenToUse": "Design Search Autocomplete System, Typeahead search bar.",
      "recognitionSignals": [
        "Suggest top K queries starting with prefix",
        "Real-time typing suggestions"
      ],
      "commonMistakes": [
        "Running full DFS on every keystroke instead of maintaining cached top suggestions on nodes"
      ],
      "stepLogic": "1. For each character typed, follow child link.\n2. Return cached top 3 queries from current TrieNode in O(1)."
    },
    "hi": {
      "title": "Autocomplete System",
      "overview": "Prefix tree ke har node par top-3 historical suggestions cache karke instant autocomplete banana.",
      "whatItIs": "Typing karte waqt har letter par agle node ke cached top words return karna.",
      "whyItWorks": "Node par direct top suggestions save karne se real-time typing mein O(1) response milta hai.",
      "whenToUse": "Search engine autocomplete design mein.",
      "recognitionSignals": [
        "Autocomplete system",
        "Prefix suggestions with ranking"
      ],
      "commonMistakes": [
        "Har keystroke par pura subtree DFS se scan karna"
      ],
      "stepLogic": "1. Node par top 3 words cache karein.\n2. Keystroke aane par current node ke cached words return karein."
    },
    "visual": {
      "type": "TREE",
      "category": "TRIES",
      "title": "Node-Level Top Suggestions",
      "input": "Type \"i_love_\"",
      "description": "Node caches top queries: [\"i love you\" (5), \"i love leetcode\" (3)]. Instant retrieval!",
      "description_hi": "Node par top queries cached rehti hain.",
      "steps": [
        {
          "activeNode": "i_love_",
          "path": [
            "root",
            "i_love_"
          ],
          "explanation": "Node returns cached top queries in O(1)",
          "explanation_hi": "Cached results turant return hue"
        }
      ],
      "result": [
        "i love you",
        "i love leetcode"
      ]
    },
    "code": "class AutocompleteSystem {\n  constructor(sentences, times) {\n    this.root = { children: {}, top: [] };\n    this.curr = this.root;\n    // Insert initial sentences\n  }\n  input(c) {\n    if (c === '#') {\n      this.curr = this.root;\n      return [];\n    }\n    if (!this.curr.children[c]) this.curr.children[c] = { children: {}, top: [] };\n    this.curr = this.curr.children[c];\n    return this.curr.top.slice(0, 3);\n  }\n}",
    "searchSignals": {
      "tags": [
        "tries",
        "design",
        "autocomplete"
      ],
      "keywords": [
        "design search autocomplete system",
        "typeahead trie",
        "top k suggestions trie"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Design Search Autocomplete System",
        "difficulty": "Hard",
        "slug": "design-search-autocomplete-system",
        "url": "https://leetcode.com/problems/design-search-autocomplete-system/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Autocomplete Editorial",
        "url": "https://leetcode.com/problems/design-search-autocomplete-system/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "XOR Trie": {
    "slug": "tries-xor-trie",
    "name": "XOR Trie",
    "topic": "Tries",
    "difficulty": "Hard",
    "timeComplexity": "O(32 * N)",
    "spaceComplexity": "O(32 * N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Binary Bitwise XOR Trie (Maximum XOR Pair)",
      "overview": "Finding the maximum XOR value of any two numbers in an array in O(32 * N) using a 0/1 binary Trie.",
      "whatItIs": "Insert 32-bit binary representations into Trie with children [0, 1]. To query max XOR for number x: at each bit b, greedily follow the OPPOSITE bit `1 - b`.",
      "whyItWorks": "Greedy bit choice: a mismatch at bit position b contributes 2^b to the XOR sum. Since 2^b > sum of all lower powers 2^(b-1) + ... + 1, choosing the opposite bit is strictly optimal.",
      "whenToUse": "Maximum XOR of Two Numbers in an Array, Maximum XOR With an Element From Array.",
      "recognitionSignals": [
        "Find pair with maximum XOR value in O(N)",
        "Bitwise Trie with branches 0 and 1"
      ],
      "commonMistakes": [
        "Not processing bits from most significant (bit 31) down to least significant (bit 0)"
      ],
      "stepLogic": "1. Build Binary Trie inserting all numbers bit-by-bit from MSB (31) to LSB (0).\n2. For each num: greedily traverse opposite bit `1 - bit` if child exists; accumulate max XOR.\n3. Return global max XOR."
    },
    "hi": {
      "title": "Binary XOR Trie",
      "overview": "Array ke kisi bhi do numbers ka maximum XOR O(32 * N) time mein find karna 0 aur 1 branches wali Binary Trie se.",
      "whatItIs": "Numbers ke bits (MSB 31 se LSB 0) ko tree mein daalna. Query karte waqt hamesha OPPOSITE bit `1 - bit` follow karna.",
      "whyItWorks": "High bit (2^b) par 1 aana baaki sabhi low bits ke sum se bada hota hai, isliye opposite bit hamesha maximum value deta hai.",
      "whenToUse": "Maximum XOR of Two Numbers problem mein.",
      "recognitionSignals": [
        "Maximum XOR pair",
        "Bitwise trie 0/1"
      ],
      "commonMistakes": [
        "Bits ko LSB se shuru karna (MSB 31 se shuru karna zaroori hai)"
      ],
      "stepLogic": "1. Sabhi numbers ke 31-bit binary patterns Trie mein daalein.\n2. Query ke dauran opposite bit follow karke XOR value badhayein.\n3. Global maximum return karein."
    },
    "visual": {
      "type": "TREE",
      "category": "TRIES",
      "title": "Greedy Opposite Bit Navigation",
      "input": "Insert [3 (011_2), 10 (1010_2)]. Query 5 (0101_2)",
      "description": "At MSB, 5 has 0 -> Greedily picks branch 1 (number 10)! Bitwise XOR maximizes to 5 ^ 10 = 15 (1111_2).",
      "description_hi": "Greedy approach opposite bit choose karke maximum XOR 15 banati hai.",
      "steps": [
        {
          "activeNode": "1",
          "path": [
            "root",
            "1"
          ],
          "explanation": "Opposite bit 1 chosen over 0 (adds 2^3 = 8)",
          "explanation_hi": "Opposite bit 1 choose kiya"
        },
        {
          "activeNode": "0",
          "path": [
            "root",
            "1",
            "0"
          ],
          "explanation": "Maximizes every bit position -> Total XOR = 15!",
          "explanation_hi": "Maximum XOR 15 mil gaya!"
        }
      ],
      "result": 15
    },
    "code": "function findMaximumXOR(nums) {\n  const root = {};\n  \n  // 1. Insert numbers\n  for (const n of nums) {\n    let node = root;\n    for (let i = 31; i >= 0; i--) {\n      const bit = (n >> i) & 1;\n      if (!node[bit]) node[bit] = {};\n      node = node[bit];\n    }\n  }\n  \n  // 2. Query max XOR\n  let maxXor = 0;\n  for (const n of nums) {\n    let node = root, currXor = 0;\n    for (let i = 31; i >= 0; i--) {\n      const bit = (n >> i) & 1;\n      const opp = 1 - bit;\n      if (node[opp]) {\n        currXor |= (1 << i);\n        node = node[opp];\n      } else {\n        node = node[bit];\n      }\n    }\n    maxXor = Math.max(maxXor, currXor);\n  }\n  return maxXor;\n}\n\nconsole.log(findMaximumXOR([3, 10, 5, 25, 2, 8])); // 28",
    "searchSignals": {
      "tags": [
        "tries",
        "bit-manipulation",
        "xor-trie"
      ],
      "keywords": [
        "maximum xor of two numbers",
        "xor trie",
        "binary trie"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Maximum XOR of Two Numbers in an Array",
        "difficulty": "Medium",
        "slug": "maximum-xor-of-two-numbers-in-an-array",
        "url": "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Maximum XOR Editorial",
        "url": "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Dictionary Search": {
    "slug": "tries-dictionary-search",
    "name": "Dictionary Search",
    "topic": "Tries",
    "difficulty": "Hard",
    "timeComplexity": "O(M * 4^L)",
    "spaceComplexity": "O(TotalWords)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Dictionary Search (Word Search II with Boggle Grid)",
      "overview": "Searching all dictionary words simultaneously in a 2D grid by traversing the grid and Trie in lockstep.",
      "whatItIs": "Insert all dictionary words into a Trie. DFS on grid: only recurse into adjacent cells whose character matches an existing Trie branch. Prune matched words to prevent duplicate searches.",
      "whyItWorks": "Instead of searching each of the 10^4 dictionary words independently (causing massive TLE), the Trie searches all words concurrently in a single grid pass.",
      "whenToUse": "Word Search II, Boggle solver, Design Add and Search Words Data Structure (wildcard `.` matching).",
      "recognitionSignals": [
        "Find all words from dictionary in 2D grid",
        "Search words with wildcard dots `.`"
      ],
      "commonMistakes": [
        "Searching each word separately instead of putting all words into Trie",
        "Not removing found words from Trie (causes duplicates)"
      ],
      "stepLogic": "1. Build Trie with all words; store full word on leaf node: `node.word = word`.\n2. For each grid cell (r, c): if root.children[board[r][c]] exists, launch dfs(r, c, root.children).\n3. In dfs: if (currNode.word) { res.push(currNode.word); currNode.word = null; } Explore 4 directions in-place."
    },
    "hi": {
      "title": "Dictionary Search (Word Search II with Trie)",
      "overview": "2D grid mein dictionary ke sabhi words ko ek sath search karna Trie aur Grid DFS ko parallel chala kar.",
      "whatItIs": "Saare words ko Trie mein daalna; grid par sirf wahi steps lena jinka character Trie branch mein exist karta hai.",
      "whyItWorks": "Har word ko alag dhoondhne ke bajaye sabhi words ek single grid traversal mein concurrent search ho jate hain.",
      "whenToUse": "Word Search II problem mein.",
      "recognitionSignals": [
        "Dictionary words in 2D grid",
        "Wildcard dot search"
      ],
      "commonMistakes": [
        "Found word ko Trie se null na karna jisse duplicate words result mein aa jayein"
      ],
      "stepLogic": "1. Sabhi words ka Trie banayein.\n2. Grid ke har cell se DFS shuru karein jo Trie root se match ho.\n3. Word milte hi save karein aur null karein."
    },
    "visual": {
      "type": "TREE",
      "category": "TRIES",
      "title": "Simultaneous Grid & Trie Traversal",
      "input": "Grid contains \"o-a-t-h\". Trie contains \"oath\" and \"pea\".",
      "description": "Grid walks \"o\" -> \"a\" -> \"t\" -> \"h\", matching Trie node \"oath\" and emitting result instantly.",
      "description_hi": "Trie branch match hone par \"oath\" result mein add ho jata hai.",
      "steps": [
        {
          "activeNode": "o",
          "path": [
            "root",
            "o"
          ],
          "explanation": "Grid and Trie match \"o\"",
          "explanation_hi": "\"o\" match hua"
        },
        {
          "activeNode": "oath",
          "path": [
            "root",
            "o",
            "a",
            "t",
            "h"
          ],
          "explanation": "Terminal word \"oath\" reached! Emitted to results.",
          "explanation_hi": "Word \"oath\" mil gaya!"
        }
      ],
      "result": [
        "oath"
      ]
    },
    "code": "function findWords(board, words) {\n  const root = {};\n  for (const w of words) {\n    let node = root;\n    for (const c of w) {\n      if (!node[c]) node[c] = {};\n      node = node[c];\n    }\n    node.word = w; // Store word at leaf\n  }\n  \n  const m = board.length, n = board[0].length;\n  const res = [];\n  \n  function dfs(r, c, node) {\n    const ch = board[r][c];\n    if (!node[ch]) return;\n    node = node[ch];\n    if (node.word) {\n      res.push(node.word);\n      node.word = null; // Avoid duplicates\n    }\n    \n    board[r][c] = '#'; // Mark visited\n    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] !== '#') {\n        dfs(nr, nc, node);\n      }\n    }\n    board[r][c] = ch; // Backtrack\n  }\n  \n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (root[board[r][c]]) dfs(r, c, root);\n    }\n  }\n  return res;\n}",
    "searchSignals": {
      "tags": [
        "tries",
        "backtracking",
        "word-search-ii"
      ],
      "keywords": [
        "word search ii",
        "dictionary search trie",
        "boggle solver"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Word Search II",
        "difficulty": "Hard",
        "slug": "word-search-ii",
        "url": "https://leetcode.com/problems/word-search-ii/"
      },
      {
        "title": "Design Add and Search Words Data Structure",
        "difficulty": "Medium",
        "slug": "design-add-and-search-words-data-structure",
        "url": "https://leetcode.com/problems/design-add-and-search-words-data-structure/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Word Search II Editorial",
        "url": "https://leetcode.com/problems/word-search-ii/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Range Sum": {
    "slug": "segment-tree-range-sum",
    "name": "Range Sum",
    "topic": "Segment Tree",
    "difficulty": "Medium",
    "timeComplexity": "O(log N) query, O(log N) update",
    "spaceComplexity": "O(4N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Segment Tree (Range Sum Query & Point Updates)",
      "overview": "Tree data structure where each node stores the aggregate sum of a subsegment [L..R], answering range queries and point updates in O(log N).",
      "whatItIs": "Root represents [0..N-1]. Left child represents [0..mid], right child represents [mid+1..N-1]. Tree has array size 4N.",
      "whyItWorks": "Any arbitrary query interval [qL..qR] decomposes into at most 2 * log2(N) canonical segment tree nodes.",
      "whenToUse": "Range Sum Query - Mutable, Count of Range Sum, dynamic prefix sums with frequent modifications.",
      "recognitionSignals": [
        "Range sum queries with frequent point updates in O(log N)",
        "Dynamic interval aggregations"
      ],
      "commonMistakes": [
        "Allocating array of size 2N instead of 4N (can cause out-of-bounds index on deep leaf branches)"
      ],
      "stepLogic": "1. build(node, l, r): if l === r tree[node] = nums[l]; else mid = (l+r)/2; build left, right; tree[node] = left + right.\n2. update(node, l, r, idx, val): if l === r tree[node] = val; else update child and pull up sum.\n3. query(node, l, r, ql, qr): if interval outside return 0; if completely inside return tree[node]; else return query(left) + query(right)."
    },
    "hi": {
      "title": "Segment Tree Range Sum",
      "overview": "Range [L..R] ka sum query karna aur kisi bhi index ko update karna O(log N) time mein.",
      "whatItIs": "Binary tree jisme har node apne interval ka sum store karta hai. 4N size ka array use hota hai.",
      "whyItWorks": "Koi bhi range [qL..qR] maximum 2 * log(N) canonical nodes mein break ho jati hai.",
      "whenToUse": "Range Sum Query - Mutable problem mein.",
      "recognitionSignals": [
        "Range sum with mutable updates",
        "O(log N) query and update"
      ],
      "commonMistakes": [
        "Tree array ka size 4N na rakhna"
      ],
      "stepLogic": "1. build: mid par split karke left + right sum karein.\n2. update: leaf par value update karke upar propagate karein.\n3. query: partial overlap par left aur right child ka sum return karein."
    },
    "visual": {
      "type": "TREE",
      "category": "SEGMENT TREE",
      "title": "Segment Tree Canonical Range Decomposition",
      "input": "Array: [1, 3, 5, 7, 9, 11]",
      "description": "Root [0..5] = 36. Query [1..4] decomposes into node [1..1] (3) + [2..2] (5) + [3..4] (16) = 24 in O(log N)!",
      "description_hi": "Range [1..4] ka sum 3 canonical nodes se 24 nikalta hai.",
      "steps": [
        {
          "activeNode": "[0..5]=36",
          "path": [
            "[0..5]"
          ],
          "explanation": "Root interval [0..5] has sum 36",
          "explanation_hi": "Root sum = 36"
        },
        {
          "activeNode": "[1..4]=24",
          "path": [
            "[0..5]",
            "[1..4]"
          ],
          "explanation": "Query [1..4] answered via O(log N) node additions = 24!",
          "explanation_hi": "Sum [1..4] = 24!"
        }
      ],
      "result": 24
    },
    "code": "class NumArray {\n  constructor(nums) {\n    this.n = nums.length;\n    this.tree = new Array(4 * this.n).fill(0);\n    this.build(nums, 1, 0, this.n - 1);\n  }\n  \n  build(nums, node, l, r) {\n    if (l === r) {\n      this.tree[node] = nums[l];\n      return;\n    }\n    const mid = (l + r) >> 1;\n    this.build(nums, 2 * node, l, mid);\n    this.build(nums, 2 * node + 1, mid + 1, r);\n    this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];\n  }\n  \n  update(index, val, node = 1, l = 0, r = this.n - 1) {\n    if (l === r) {\n      this.tree[node] = val;\n      return;\n    }\n    const mid = (l + r) >> 1;\n    if (index <= mid) this.update(index, val, 2 * node, l, mid);\n    else this.update(index, val, 2 * node + 1, mid + 1, r);\n    this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];\n  }\n  \n  sumRange(left, right, node = 1, l = 0, r = this.n - 1) {\n    if (left > r || right < l) return 0;\n    if (left <= l && r <= right) return this.tree[node];\n    const mid = (l + r) >> 1;\n    return this.sumRange(left, right, 2 * node, l, mid) +\n           this.sumRange(left, right, 2 * node + 1, mid + 1, r);\n  }\n}",
    "searchSignals": {
      "tags": [
        "segment-tree",
        "range-sum",
        "trees"
      ],
      "keywords": [
        "segment tree range sum",
        "range sum query mutable",
        "segment tree update"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Range Sum Query - Mutable",
        "difficulty": "Medium",
        "slug": "range-sum-query-mutable",
        "url": "https://leetcode.com/problems/range-sum-query-mutable/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Segment Tree",
        "url": "https://cp-algorithms.com/data_structures/segment_tree.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Range Min": {
    "slug": "segment-tree-range-min",
    "name": "Range Min",
    "topic": "Segment Tree",
    "difficulty": "Medium",
    "timeComplexity": "O(log N) query, O(log N) update",
    "spaceComplexity": "O(4N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Range Minimum Query (RMQ Segment Tree)",
      "overview": "Answering minimum value queries across dynamic intervals [L..R] with point updates in O(log N).",
      "whatItIs": "Each internal node stores `tree[node] = min(tree[left], tree[right])`. Identity element for out-of-bounds queries is Infinity.",
      "whyItWorks": "Associative property of minimum allows hierarchical interval combination.",
      "whenToUse": "Range Minimum Queries on dynamic arrays, finding lowest elevation in interval.",
      "recognitionSignals": [
        "Range minimum query with point updates",
        "Dynamic RMQ"
      ],
      "commonMistakes": [
        "Returning 0 instead of Infinity when query interval is out-of-bounds"
      ],
      "stepLogic": "1. build: tree[node] = min(left, right).\n2. query: if outside return Infinity; if inside return tree[node]; else return min(query(left), query(right))."
    },
    "hi": {
      "title": "Range Minimum Query (RMQ Segment Tree)",
      "overview": "Dynamic array mein kisi bhi interval [L..R] ka minimum element O(log N) mein find karna.",
      "whatItIs": "Har node apne range ka minimum store karta hai `min(left, right)`. Out of bounds query par Infinity return hota hai.",
      "whyItWorks": "Min function associative hota hai, isliye subsegments ko merge karke answer O(log N) mein mil jata hai.",
      "whenToUse": "Range Minimum Queries with point updates mein.",
      "recognitionSignals": [
        "Dynamic RMQ",
        "Range minimum with updates"
      ],
      "commonMistakes": [
        "Out-of-bounds case mein 0 return karna (Infinity return karna zaroori hai)"
      ],
      "stepLogic": "1. build: left aur right child ka min lein.\n2. query: out of bounds par Infinity, full overlap par tree[node], warna min(left, right)."
    },
    "visual": {
      "type": "TREE",
      "category": "SEGMENT TREE",
      "title": "RMQ Node Tree",
      "input": [
        2,
        5,
        1,
        4,
        9,
        3
      ],
      "description": "Root stores global min 1. Query [3..5] ([4, 9, 3]) evaluates in O(log N) to 3.",
      "description_hi": "Root par minimum 1 hai. Query [3..5] ka min 3 milta hai.",
      "steps": [
        {
          "activeNode": "min=1",
          "path": [
            "root"
          ],
          "explanation": "Global min is 1",
          "explanation_hi": "Global min 1 hai"
        },
        {
          "activeNode": "min=3",
          "path": [
            "root",
            "right"
          ],
          "explanation": "Query [3..5] evaluates to min 3!",
          "explanation_hi": "Range [3..5] ka min 3 mila!"
        }
      ],
      "result": 3
    },
    "code": "class SegmentTreeRMQ {\n  constructor(nums) {\n    this.n = nums.length;\n    this.tree = new Array(4 * this.n).fill(Infinity);\n    this.build(nums, 1, 0, this.n - 1);\n  }\n  build(nums, node, l, r) {\n    if (l === r) {\n      this.tree[node] = nums[l];\n      return;\n    }\n    const mid = (l + r) >> 1;\n    this.build(nums, 2 * node, l, mid);\n    this.build(nums, 2 * node + 1, mid + 1, r);\n    this.tree[node] = Math.min(this.tree[2 * node], this.tree[2 * node + 1]);\n  }\n  query(ql, qr, node = 1, l = 0, r = this.n - 1) {\n    if (ql > r || qr < l) return Infinity;\n    if (ql <= l && r <= qr) return this.tree[node];\n    const mid = (l + r) >> 1;\n    return Math.min(this.query(ql, qr, 2 * node, l, mid), this.query(ql, qr, 2 * node + 1, mid + 1, r));\n  }\n}",
    "searchSignals": {
      "tags": [
        "segment-tree",
        "rmq",
        "range-minimum"
      ],
      "keywords": [
        "range minimum query",
        "rmq segment tree",
        "segment tree min"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Range Sum Query - Mutable",
        "difficulty": "Medium",
        "slug": "range-sum-query-mutable",
        "url": "https://leetcode.com/problems/range-sum-query-mutable/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Segment Tree RMQ",
        "url": "https://cp-algorithms.com/data_structures/segment_tree.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Lazy Propagation": {
    "slug": "segment-tree-lazy-propagation",
    "name": "Lazy Propagation",
    "topic": "Segment Tree",
    "difficulty": "Hard",
    "timeComplexity": "O(log N) range update, O(log N) range query",
    "spaceComplexity": "O(4N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Segment Tree Lazy Propagation (Range Updates)",
      "overview": "Executing range updates [L..R] += val in O(log N) time by deferring updates to descendants until those nodes are actually accessed.",
      "whatItIs": "Maintain a parallel `lazy` array. When updating an interval, store the pending delta in `lazy[node]` and immediately update `tree[node]`. Push down pending lazy values to children only when visiting deeper.",
      "whyItWorks": "Postpones updating O(N) leaf nodes until strictly necessary, preserving logarithmic complexity for range modifications.",
      "whenToUse": "Range additions, range assignments, My Calendar III, Falling Squares.",
      "recognitionSignals": [
        "Range update AND range query both required in O(log N)",
        "Add value to all elements in range [L..R]"
      ],
      "commonMistakes": [
        "Forgetting to push down lazy values before querying children",
        "Not clearing `lazy[node] = 0` after pushing to children"
      ],
      "stepLogic": "1. push(node, l, r): if lazy[node] !== 0: apply lazy to children, clear lazy[node].\n2. updateRange(ql, qr, val): if fully inside: apply val to tree[node], lazy[node] += val, return. Push down lazy, recurse left & right, pull up sum.\n3. queryRange(ql, qr): push down lazy, recurse left & right."
    },
    "hi": {
      "title": "Segment Tree Lazy Propagation",
      "overview": "Puri range [L..R] par value update karna O(log N) time mein pending updates ko postpone (lazy) karke.",
      "whatItIs": "Jab puri range cover ho jaye toh wahi ruk kar `lazy` tag laga dete hain; bacho ko update tabhi karte hain jab unhe access kiya jaye.",
      "whyItWorks": "Saari leaf nodes ko ek sath update karne ka O(N) cost bach jata hai aur updates O(log N) mein complete hote hain.",
      "whenToUse": "Range update aur Range query dono ek sath O(log N) mein chahiye hon.",
      "recognitionSignals": [
        "Range update in O(log N)",
        "Lazy propagation"
      ],
      "commonMistakes": [
        "Children ko query karne se pehle push down lazy call karna bhool jana"
      ],
      "stepLogic": "1. pushdown: pending lazy value bacho par distribute karein.\n2. updateRange: fully inside aane par lazy tag lagayein aur return karein.\n3. queryRange: lazy pushdown karke answer collect karein."
    },
    "visual": {
      "type": "TREE",
      "category": "SEGMENT TREE",
      "title": "Lazy Pending Updates Tagging",
      "input": "Update range [0..3] += 5",
      "description": "Node [0..3] tagged with lazy=+5 immediately in O(log N). Leaves [0], [1], [2], [3] updated later on-demand.",
      "description_hi": "Node [0..3] par lazy=+5 tag lagta hai. Leaves tabhi update hoti hain jab access hon.",
      "steps": [
        {
          "activeNode": "[0..3]",
          "path": [
            "root"
          ],
          "explanation": "Node [0..3] sum updated by 4*5 = +20. Lazy tag set to +5.",
          "explanation_hi": "Node [0..3] par lazy=+5 tag lag gaya"
        }
      ],
      "result": "Range updated in O(log N)"
    },
    "code": "class LazySegmentTree {\n  constructor(n) {\n    this.n = n;\n    this.tree = new Array(4 * n).fill(0);\n    this.lazy = new Array(4 * n).fill(0);\n  }\n  push(node, l, r) {\n    if (this.lazy[node] !== 0) {\n      const mid = (l + r) >> 1;\n      this.lazy[2 * node] += this.lazy[node];\n      this.lazy[2 * node + 1] += this.lazy[node];\n      this.tree[2 * node] += this.lazy[node] * (mid - l + 1);\n      this.tree[2 * node + 1] += this.lazy[node] * (r - mid);\n      this.lazy[node] = 0;\n    }\n  }\n  updateRange(ql, qr, val, node = 1, l = 0, r = this.n - 1) {\n    if (ql <= l && r <= qr) {\n      this.tree[node] += val * (r - l + 1);\n      this.lazy[node] += val;\n      return;\n    }\n    this.push(node, l, r);\n    const mid = (l + r) >> 1;\n    if (ql <= mid) this.updateRange(ql, qr, val, 2 * node, l, mid);\n    if (qr > mid) this.updateRange(ql, qr, val, 2 * node + 1, mid + 1, r);\n    this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];\n  }\n  query(ql, qr, node = 1, l = 0, r = this.n - 1) {\n    if (ql <= l && r <= qr) return this.tree[node];\n    this.push(node, l, r);\n    const mid = (l + r) >> 1;\n    let sum = 0;\n    if (ql <= mid) sum += this.query(ql, qr, 2 * node, l, mid);\n    if (qr > mid) sum += this.query(ql, qr, 2 * node + 1, mid + 1, r);\n    return sum;\n  }\n}",
    "searchSignals": {
      "tags": [
        "segment-tree",
        "lazy-propagation",
        "range-update"
      ],
      "keywords": [
        "lazy propagation",
        "range update segment tree",
        "segment tree lazy"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "My Calendar III",
        "difficulty": "Hard",
        "slug": "my-calendar-iii",
        "url": "https://leetcode.com/problems/my-calendar-iii/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Lazy Propagation",
        "url": "https://cp-algorithms.com/data_structures/segment_tree.html#lazy-propagation",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Point Update": {
    "slug": "segment-tree-point-update",
    "name": "Point Update",
    "topic": "Segment Tree",
    "difficulty": "Medium",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(4N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Segment Tree Point Updates (Single Index Recomputation)",
      "overview": "Modifying a single element at index i and updating all ancestor segment sums in strictly O(log N) time.",
      "whatItIs": "Binary search down to the target leaf node `l === r === index`. Overwrite leaf value, then unwind the recursion, recalculating parent nodes as `tree[node] = leftChild + rightChild`.",
      "whyItWorks": "A single point update affects exactly one node per level of the tree, bounding total modifications to tree height `log2(N)`.",
      "whenToUse": "Range Sum Query - Mutable point updates, dynamic prefix modifications.",
      "recognitionSignals": [
        "Single index update with range query",
        "O(log N) point modification"
      ],
      "commonMistakes": [
        "Updating parent before children have updated (must recalculate parent on recursion unwind)"
      ],
      "stepLogic": "1. In update(node, l, r, idx, val):\n   a. If l === r: tree[node] = val; return\n   b. mid = (l + r) / 2\n   c. If idx <= mid update(2*node, l, mid, idx, val); else update(2*node+1, mid+1, r, idx, val)\n   d. tree[node] = tree[2*node] + tree[2*node+1]."
    },
    "hi": {
      "title": "Segment Tree Point Update",
      "overview": "Kisi ek index par value change karna aur uske sabhi parent nodes ko O(log N) time mein update karna.",
      "whatItIs": "Target leaf node tak niche jana, value update karna, aur wapas aate waqt har parent node ko recalibrate karna.",
      "whyItWorks": "Ek point change hone par tree ke har level par sirf 1 node affect hota hai, isliye time strictly O(log N) rehta hai.",
      "whenToUse": "Single element update aur range sum queries mein.",
      "recognitionSignals": [
        "Single index update",
        "O(log N) point update"
      ],
      "commonMistakes": [
        "Parent ko pehle update karna (unwind ke waqt child calculate hone ke baad parent update karein)"
      ],
      "stepLogic": "1. Leaf tak jayein aur value set karein.\n2. Recurse unwind par parent = left + right karein."
    },
    "visual": {
      "type": "TREE",
      "category": "SEGMENT TREE",
      "title": "Point Update Ancestor Path",
      "input": "Update index 2 from 5 to 10",
      "description": "Leaf [2..2] becomes 10. Parent [2..3] updates. Root [0..5] increases by 5. Exactly log2(N) nodes touched.",
      "description_hi": "Sirf path ke nodes update hote hain: O(log N) updates.",
      "steps": [
        {
          "activeNode": "Leaf [2]=10",
          "path": [
            "root",
            "left",
            "leaf"
          ],
          "explanation": "Leaf updated to 10",
          "explanation_hi": "Leaf 10 hui"
        },
        {
          "activeNode": "Root [0..5]=41",
          "path": [
            "root"
          ],
          "explanation": "Root recalculates to 41. Point update finished in O(log N)!",
          "explanation_hi": "Root 41 ho gaya! Complete."
        }
      ],
      "result": 41
    },
    "code": "function updatePoint(tree, node, l, r, idx, val) {\n  if (l === r) {\n    tree[node] = val;\n    return;\n  }\n  const mid = (l + r) >> 1;\n  if (idx <= mid) updatePoint(tree, 2 * node, l, mid, idx, val);\n  else updatePoint(tree, 2 * node + 1, mid + 1, r, idx, val);\n  tree[node] = tree[2 * node] + tree[2 * node + 1];\n}",
    "searchSignals": {
      "tags": [
        "segment-tree",
        "point-update"
      ],
      "keywords": [
        "segment tree point update",
        "single element update segment tree"
      ],
      "companies": [
        "Amazon",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Range Sum Query - Mutable",
        "difficulty": "Medium",
        "slug": "range-sum-query-mutable",
        "url": "https://leetcode.com/problems/range-sum-query-mutable/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Point Update",
        "url": "https://cp-algorithms.com/data_structures/segment_tree.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Prefix Queries": {
    "slug": "fenwick-tree-prefix-queries",
    "name": "Prefix Queries",
    "topic": "Fenwick Tree",
    "difficulty": "Medium",
    "timeComplexity": "O(log N) query, O(log N) update",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Fenwick Tree / Binary Indexed Tree (Prefix Sum Queries)",
      "overview": "Ultra-compact data structure storing prefix sums using lowbit jumps in O(N) space and O(log N) operations.",
      "whatItIs": "`tree[i]` stores sum of `(i - (i & -i) .. i]`. Query `pref(i)`: accumulate `tree[i]` and jump `i -= (i & -i)`. Update `add(i, delta)`: add delta and jump `i += (i & -i)`.",
      "whyItWorks": "Binary bit representation partitions integer prefix lengths into powers of two; `i & -i` isolates the lowest set bit.",
      "whenToUse": "Range Sum Query, Count of Smaller Numbers After Self, inversion counting.",
      "recognitionSignals": [
        "Dynamic prefix sums with minimal memory overhead",
        "Binary Indexed Tree lowbit navigation"
      ],
      "commonMistakes": [
        "1-based indexing required (Fenwick trees cannot use index 0 because `0 & -0 === 0` causes infinite loop)"
      ],
      "stepLogic": "1. Array tree of size n + 1 filled with 0.\n2. add(i, delta): while (i <= n) { tree[i] += delta; i += i & -i; }\n3. query(i): sum = 0; while (i > 0) { sum += tree[i]; i -= i & -i; } return sum."
    },
    "hi": {
      "title": "Fenwick Tree (Binary Indexed Tree)",
      "overview": "Prefix sums aur updates ko O(log N) time aur sirf O(N) memory mein execute karne wala data structure.",
      "whatItIs": "Lowbit formula `i & (-i)` se indices par jump karna: query ke liye `i -= i & -i` aur update ke liye `i += i & -i`.",
      "whyItWorks": "Har number powers of 2 mein divide hota hai, isliye prefix sum sirf log2(N) jumps mein nikalta hai.",
      "whenToUse": "Prefix sum queries aur Inversion count problems mein.",
      "recognitionSignals": [
        "Binary Indexed Tree",
        "BIT prefix queries",
        "1-based indexing"
      ],
      "commonMistakes": [
        "Index 0 use karna (0 par lowbit 0 rehta hai aur infinite loop ho jata hai, 1-based indexing zaroori hai)"
      ],
      "stepLogic": "1. 1-based tree array banayein.\n2. update: `i += i & -i` se add karein.\n3. query: `i -= i & -i` se sum accumulate karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "FENWICK TREE",
      "title": "Lowbit Binary Navigation Jumps",
      "input": "Query prefix sum up to index 7 (binary: 111_2)",
      "description": "Index 7: tree[7] (covers [7..7]). 7 - (7&-7) = 6: tree[6] (covers [5..6]). 6 - (6&-6) = 4: tree[4] (covers [1..4]). Total = 3 jumps!",
      "description_hi": "7 se 6, 6 se 4 jumps lagakar sirf 3 steps mein 1-7 ka prefix sum mil jata hai.",
      "steps": [
        {
          "activeIdx": 7,
          "elements": [
            0,
            1,
            3,
            3,
            10,
            5,
            11,
            7
          ],
          "explanation": "Add tree[7]. Jump 7 - 1 = 6",
          "explanation_hi": "tree[7] add hua -> jump to 6"
        },
        {
          "activeIdx": 6,
          "elements": [
            0,
            1,
            3,
            3,
            10,
            5,
            11,
            7
          ],
          "explanation": "Add tree[6]. Jump 6 - 2 = 4",
          "explanation_hi": "tree[6] add hua -> jump to 4"
        },
        {
          "activeIdx": 4,
          "elements": [
            0,
            1,
            3,
            3,
            10,
            5,
            11,
            7
          ],
          "explanation": "Add tree[4]. Jump 4 - 4 = 0. Prefix query finished in 3 jumps!",
          "explanation_hi": "tree[4] add hua -> Sum complete!"
        }
      ],
      "result": "Prefix Sum in O(log N)"
    },
    "code": "class FenwickTree {\n  constructor(n) {\n    this.n = n;\n    this.tree = new Array(n + 1).fill(0);\n  }\n  \n  add(i, delta) {\n    while (i <= this.n) {\n      this.tree[i] += delta;\n      i += i & -i; // Jump up\n    }\n  }\n  \n  query(i) {\n    let sum = 0;\n    while (i > 0) {\n      sum += this.tree[i];\n      i -= i & -i; // Jump down\n    }\n    return sum;\n  }\n}",
    "searchSignals": {
      "tags": [
        "fenwick-tree",
        "bit",
        "prefix-sum"
      ],
      "keywords": [
        "fenwick tree",
        "binary indexed tree",
        "bit prefix queries"
      ],
      "companies": [
        "Google",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Range Sum Query - Mutable",
        "difficulty": "Medium",
        "slug": "range-sum-query-mutable",
        "url": "https://leetcode.com/problems/range-sum-query-mutable/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Fenwick Tree",
        "url": "https://cp-algorithms.com/data_structures/fenwick.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Range Queries": {
    "slug": "fenwick-tree-range-queries",
    "name": "Range Queries",
    "topic": "Fenwick Tree",
    "difficulty": "Medium",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Fenwick Tree Range Queries (Prefix Subtraction)",
      "overview": "Computing arbitrary range sum [L..R] using the prefix sum difference `query(R) - query(L - 1)`.",
      "whatItIs": "Combines two logarithmic prefix queries to answer any interval sum query in O(log N).",
      "whyItWorks": "Difference of prefix sums eliminates elements in range [1..L-1], leaving exactly the sum in [L..R].",
      "whenToUse": "Range sum queries with BIT, Count of Smaller Numbers After Self.",
      "recognitionSignals": [
        "Range sum queries on Fenwick Tree",
        "Prefix subtraction `query(R) - query(L - 1)`"
      ],
      "commonMistakes": [
        "Evaluating `query(R) - query(L)` which accidentally excludes element at L"
      ],
      "stepLogic": "1. Range sum [L..R] = query(R) - query(L - 1)."
    },
    "hi": {
      "title": "Fenwick Tree Range Queries",
      "overview": "Interval [L..R] ka sum nikalna prefix subtraction se: `query(R) - query(L - 1)`.",
      "whatItIs": "Do prefix queries ko subtract karke kisi bhi interval ka answer O(log N) mein calculate karna.",
      "whyItWorks": "`[1..R]` mein se `[1..L-1]` minus hone par theek `[L..R]` bachta hai.",
      "whenToUse": "Range sum query using Binary Indexed Tree mein.",
      "recognitionSignals": [
        "Range queries in BIT",
        "Prefix subtraction"
      ],
      "commonMistakes": [
        "`query(L)` subtract kar dena jisse element L minus ho jaye"
      ],
      "stepLogic": "1. `query(R) - query(L - 1)` return karein."
    },
    "visual": {
      "type": "INTERVALS",
      "category": "FENWICK TREE",
      "title": "BIT Range Subtraction [L..R]",
      "input": "Query range [3..6]",
      "description": "Sum(3..6) = Prefix(6) - Prefix(2). Both evaluated in O(log N).",
      "description_hi": "Prefix 6 se Prefix 2 minus karke range [3..6] ka sum milta hai.",
      "steps": [
        {
          "activeIdx": 0,
          "intervals": [
            [
              1,
              6
            ]
          ],
          "explanation": "Prefix(6) = 28",
          "explanation_hi": "Prefix(6) = 28"
        },
        {
          "activeIdx": 1,
          "intervals": [
            [
              1,
              2
            ]
          ],
          "explanation": "Prefix(2) = 5. Difference: 28 - 5 = 23!",
          "explanation_hi": "Diff = 28 - 5 = 23!"
        }
      ],
      "result": 23
    },
    "code": "function rangeSum(bit, l, r) {\n  return bit.query(r) - bit.query(l - 1);\n}",
    "searchSignals": {
      "tags": [
        "fenwick-tree",
        "range-sum"
      ],
      "keywords": [
        "fenwick tree range query",
        "bit range sum"
      ],
      "companies": [
        "Google",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Range Sum Query - Mutable",
        "difficulty": "Medium",
        "slug": "range-sum-query-mutable",
        "url": "https://leetcode.com/problems/range-sum-query-mutable/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Fenwick Tree",
        "url": "https://cp-algorithms.com/data_structures/fenwick.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Coordinate Compression": {
    "slug": "fenwick-tree-coordinate-compression",
    "name": "Coordinate Compression",
    "topic": "Fenwick Tree",
    "difficulty": "Hard",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Coordinate Compression with Fenwick Tree (Count of Smaller Numbers After Self)",
      "overview": "Mapping large/sparse numbers (-10^9 to 10^9) to dense ranks [1..UniqueCount] to enable Fenwick tree indexing.",
      "whatItIs": "Sort unique values. Map each number to its 1-based rank via binary search. Process array backwards: query count of numbers with smaller rank, then insert rank into Fenwick tree.",
      "whyItWorks": "Fenwick trees require compact integer indices; relative order (<, =) is preserved regardless of scale.",
      "whenToUse": "Count of Smaller Numbers After Self, Reverse Pairs, Number of Longest Increasing Subsequence.",
      "recognitionSignals": [
        "Values up to 10^9 used as array indices",
        "Count inversions or smaller numbers on dynamic stream"
      ],
      "commonMistakes": [
        "Forgetting deduplication before rank mapping",
        "0-based rank indexing on Fenwick tree"
      ],
      "stepLogic": "1. sortedUnique = Array.from(new Set(nums)).sort((a, b) => a - b).\n2. Rank function: binarySearch(sortedUnique, x) + 1.\n3. Iterate backwards: ans[i] = bit.query(rank - 1); bit.add(rank, 1)."
    },
    "hi": {
      "title": "Coordinate Compression with Fenwick Tree",
      "overview": "Bade numbers (-10^9 se 10^9) ko chhote ranks [1..K] par map karna taaki Fenwick tree mein index ban sakein.",
      "whatItIs": "Unique values ko sort karke har number ko uska rank DSU/BIT mein use karne ke liye assign karna.",
      "whyItWorks": "Numbers ka exact magnitude nahi, sirf unka relative order (< ya >) matter karta hai.",
      "whenToUse": "Count of Smaller Numbers After Self, Reverse Pairs mein.",
      "recognitionSignals": [
        "Numbers up to 10^9 in Fenwick tree",
        "Count smaller numbers after self"
      ],
      "commonMistakes": [
        "Deduplication kiye bina rank calculate karna"
      ],
      "stepLogic": "1. Unique sorted array banayein.\n2. Binary search se rank nikaalein.\n3. Peeche se iterate karke query aur add karein."
    },
    "visual": {
      "type": "COORDINATE_COMPRESSION",
      "category": "FENWICK TREE",
      "title": "Dense Rank Mapping",
      "input": [
        5,
        2,
        6,
        1
      ],
      "description": "Values mapped to ranks: 1->1, 2->2, 5->3, 6->4. Fenwick tree operates on compact [1..4]!",
      "description_hi": "Numbers [5, 2, 6, 1] dense ranks [3, 2, 4, 1] mein map hote hain.",
      "steps": [
        {
          "original": 1,
          "compressed": 1,
          "explanation": "1 maps to rank 1",
          "explanation_hi": "1 rank 1 bana"
        },
        {
          "original": 6,
          "compressed": 4,
          "explanation": "6 maps to rank 4",
          "explanation_hi": "6 rank 4 bana"
        }
      ],
      "result": [
        2,
        1,
        1,
        0
      ]
    },
    "code": "function countSmaller(nums) {\n  const sorted = Array.from(new Set(nums)).sort((a, b) => a - b);\n  const getRank = x => {\n    let l = 0, r = sorted.length - 1;\n    while (l <= r) {\n      const mid = (l + r) >> 1;\n      if (sorted[mid] === x) return mid + 1;\n      if (sorted[mid] < x) l = mid + 1;\n      else r = mid - 1;\n    }\n    return l + 1;\n  };\n  \n  const tree = new Array(sorted.length + 1).fill(0);\n  function add(i) {\n    while (i < tree.length) {\n      tree[i]++;\n      i += i & -i;\n    }\n  }\n  function query(i) {\n    let sum = 0;\n    while (i > 0) {\n      sum += tree[i];\n      i -= i & -i;\n    }\n    return sum;\n  }\n  \n  const res = new Array(nums.length);\n  for (let i = nums.length - 1; i >= 0; i--) {\n    const rank = getRank(nums[i]);\n    res[i] = query(rank - 1);\n    add(rank);\n  }\n  return res;\n}\n\nconsole.log(countSmaller([5,2,6,1])); // [2, 1, 1, 0]",
    "searchSignals": {
      "tags": [
        "fenwick-tree",
        "coordinate-compression",
        "inversion-count"
      ],
      "keywords": [
        "count of smaller numbers after self",
        "coordinate compression bit",
        "fenwick rank compression"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Count of Smaller Numbers After Self",
        "difficulty": "Hard",
        "slug": "count-of-smaller-numbers-after-self",
        "url": "https://leetcode.com/problems/count-of-smaller-numbers-after-self/"
      },
      {
        "title": "Reverse Pairs",
        "difficulty": "Hard",
        "slug": "reverse-pairs",
        "url": "https://leetcode.com/problems/reverse-pairs/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Count Smaller Editorial",
        "url": "https://leetcode.com/problems/count-of-smaller-numbers-after-self/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "DSU": {
    "slug": "union-find-dsu",
    "name": "DSU",
    "topic": "Union Find",
    "difficulty": "Medium",
    "timeComplexity": "O(α(N))",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Disjoint Set Union Data Structure",
      "overview": "Maintaining dynamic connected components with near constant-time Find and Union operations.",
      "whatItIs": "Tree forest where each component is represented by its root node. `parent[i]` points to parent or self.",
      "whyItWorks": "Combining Path Compression with Union by Rank flattens tree structure continuously.",
      "whenToUse": "Graph connectivity, dynamic clusters, Kruskal's MST.",
      "recognitionSignals": [
        "Disjoint component grouping",
        "Check if two nodes belong to same set"
      ],
      "commonMistakes": [
        "Comparing raw nodes instead of their component root representatives"
      ],
      "stepLogic": "1. parent[i] = i.\n2. find(x): return root.\n3. union(x, y): connect roots."
    },
    "hi": {
      "title": "Disjoint Set Union (DSU)",
      "overview": "Connected components ko dynamically manage karne ka standard data structure.",
      "whatItIs": "Har component ka ek root representative hota hai; find se root milta hai aur union se do roots judte hain.",
      "whyItWorks": "Path compression se har node direct root se jud jati hai.",
      "whenToUse": "Graph connectivity aur Kruskal MST mein.",
      "recognitionSignals": [
        "Disjoint sets",
        "Connected components tracking"
      ],
      "commonMistakes": [
        "Roots compare na karna"
      ],
      "stepLogic": "1. parent array banayein.\n2. find root nikaale.\n3. union dono roots ko merge kare."
    },
    "visual": {
      "type": "GRAPH",
      "category": "UNION FIND",
      "title": "DSU Component Forest",
      "input": "Components: {0, 1} and {2, 3}",
      "description": "Union(1, 2) merges the two components into a single root.",
      "description_hi": "Do components merge hoke ek ban jate hain.",
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
          "explanation": "Component 1 root = 0",
          "explanation_hi": "Root 0"
        },
        {
          "activeNode": 0,
          "visited": [
            0,
            1,
            2,
            3
          ],
          "queueOrStack": [
            0
          ],
          "explanation": "Union connects roots -> All 4 nodes in single component!",
          "explanation_hi": "Saare nodes ek component mein!"
        }
      ],
      "result": true
    },
    "code": "class DSU {\n  constructor(n) {\n    this.parent = Array.from({ length: n }, (_, i) => i);\n  }\n  find(x) {\n    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);\n    return this.parent[x];\n  }\n  union(x, y) {\n    const rx = this.find(x), ry = this.find(y);\n    if (rx === ry) return false;\n    this.parent[rx] = ry;\n    return true;\n  }\n}",
    "searchSignals": {
      "tags": [
        "union-find",
        "dsu"
      ],
      "keywords": [
        "disjoint set union",
        "dsu",
        "connected components"
      ],
      "companies": [
        "Amazon",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Number of Connected Components in an Undirected Graph",
        "difficulty": "Medium",
        "slug": "number-of-connected-components-in-an-undirected-graph",
        "url": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms DSU",
        "url": "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Path Compression": {
    "slug": "union-find-path-compression",
    "name": "Path Compression",
    "topic": "Union Find",
    "difficulty": "Easy",
    "timeComplexity": "O(α(N)) amortized",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "DSU Path Compression",
      "overview": "Flattening tree structure during find() by pointing visited nodes directly to the root.",
      "whatItIs": "`find(x)`: `if (parent[x] !== x) parent[x] = find(parent[x]); return parent[x]`.",
      "whyItWorks": "Subsequent lookups along the branch take strictly O(1) time because intermediate pointers are collapsed.",
      "whenToUse": "All DSU implementations.",
      "recognitionSignals": [
        "Flatten tree depth in DSU",
        "O(1) find lookup optimization"
      ],
      "commonMistakes": [
        "Iterative find without flattening parent pointer"
      ],
      "stepLogic": "1. In find(x): if parent[x] !== x parent[x] = find(parent[x]); return parent[x]."
    },
    "hi": {
      "title": "Path Compression (DSU)",
      "overview": "Find function ke dauran tree ko flatten karke nodes ko seedha root se connect karna.",
      "whatItIs": "Recursion se har node ka parent direct root ban jata hai.",
      "whyItWorks": "Agli bar find karne par bina intermediate nodes traverse kiye O(1) mein root milta hai.",
      "whenToUse": "Sabhi DSU implementations mein.",
      "recognitionSignals": [
        "Path compression in DSU"
      ],
      "commonMistakes": [
        "Path flatten kiye bina iterative loop chalana"
      ],
      "stepLogic": "1. `parent[x] = find(parent[x])` se direct link karein."
    },
    "visual": {
      "type": "TREE",
      "category": "UNION FIND",
      "title": "Tree Flattening Path Compression",
      "input": "Chain: 3 -> 2 -> 1 -> 0 (Root 0)",
      "description": "find(3) redirects 3, 2, 1 directly to root 0! Tree depth shrinks from 4 to 1 in O(1).",
      "description_hi": "Chain 3->2->1->0 collapse hokar direct root 0 se jud jati hai.",
      "steps": [
        {
          "activeNode": 3,
          "path": [
            3,
            2,
            1,
            0
          ],
          "explanation": "Walk chain up to root 0",
          "explanation_hi": "Chain walk"
        },
        {
          "activeNode": 0,
          "path": [
            0
          ],
          "explanation": "Collapsed! parent[3]=0, parent[2]=0, parent[1]=0.",
          "explanation_hi": "Saare nodes direct root 0 se jude!"
        }
      ],
      "result": 0
    },
    "code": "function findWithCompression(parent, x) {\n  if (parent[x] !== x) {\n    parent[x] = findWithCompression(parent, parent[x]); // Path compression\n  }\n  return parent[x];\n}",
    "searchSignals": {
      "tags": [
        "union-find",
        "path-compression"
      ],
      "keywords": [
        "path compression",
        "dsu flatten tree"
      ],
      "companies": [
        "Amazon",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Redundant Connection",
        "difficulty": "Medium",
        "slug": "redundant-connection",
        "url": "https://leetcode.com/problems/redundant-connection/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Path Compression",
        "url": "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Union by Rank": {
    "slug": "union-find-union-by-rank",
    "name": "Union by Rank",
    "topic": "Union Find",
    "difficulty": "Easy",
    "timeComplexity": "O(log N) without path compression, O(α(N)) with it",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "DSU Union by Rank / Size",
      "overview": "Attaching the root of the smaller tree under the root of the larger tree to keep tree height minimal.",
      "whatItIs": "Track `rank[x]` (upper bound on height). Attach smaller rank root to larger rank root. Increment rank only when two trees of equal rank merge.",
      "whyItWorks": "Prevents tree from degenerating into a linear linked list of depth N.",
      "whenToUse": "DSU implementations needing bounded tree depth.",
      "recognitionSignals": [
        "Union by rank or size",
        "Keep tree balanced in DSU"
      ],
      "commonMistakes": [
        "Incrementing rank when ranks are unequal (rank only increases when merging equal ranks)"
      ],
      "stepLogic": "1. If rank[rx] < rank[ry]: parent[rx] = ry.\n2. Else if rank[rx] > rank[ry]: parent[ry] = rx.\n3. Else: parent[ry] = rx; rank[rx]++."
    },
    "hi": {
      "title": "Union by Rank",
      "overview": "Chhote tree ke root ko bade tree ke root ke neeche attach karke tree ki height ko minimal rakhna.",
      "whatItIs": "Rank array maintain karna; chhote rank wale root ko bade rank wale root se jodna.",
      "whyItWorks": "Tree ko linear chain (depth N) banne se rokta hai aur logarithmic height guarantee karta hai.",
      "whenToUse": "DSU balancing mein.",
      "recognitionSignals": [
        "Union by rank",
        "Tree height bounding"
      ],
      "commonMistakes": [
        "Unequal ranks par bhi rank badha dena"
      ],
      "stepLogic": "1. Chhote rank ko bade rank ke neeche daalein.\n2. Barabar rank hone par kisi ek ko parent banayein aur rank++ karein."
    },
    "visual": {
      "type": "TREE",
      "category": "UNION FIND",
      "title": "Balanced Root Attachment",
      "input": "Tree A (rank 2) and Tree B (rank 1)",
      "description": "Root of B attaches under root of A. Height remains 2 without increasing!",
      "description_hi": "B ko A ke neeche attach karne se total height nahi badhti.",
      "steps": [
        {
          "activeNode": "Root A",
          "path": [
            "Root A",
            "Root B"
          ],
          "explanation": "Rank(A) > Rank(B) -> parent[B] = A. Rank stays 2!",
          "explanation_hi": "Rank increase nahi hui"
        }
      ],
      "result": "Rank 2 preserved"
    },
    "code": "function unionByRank(parent, rank, x, y) {\n  let rx = find(parent, x), ry = find(parent, y);\n  if (rx === ry) return false;\n  if (rank[rx] < rank[ry]) {\n    parent[rx] = ry;\n  } else if (rank[rx] > rank[ry]) {\n    parent[ry] = rx;\n  } else {\n    parent[ry] = rx;\n    rank[rx]++;\n  }\n  return true;\n}",
    "searchSignals": {
      "tags": [
        "union-find",
        "union-by-rank"
      ],
      "keywords": [
        "union by rank",
        "dsu rank balancing"
      ],
      "companies": [
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Number of Operations to Make Network Connected",
        "difficulty": "Medium",
        "slug": "number-of-operations-to-make-network-connected",
        "url": "https://leetcode.com/problems/number-of-operations-to-make-network-connected/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Union by Rank",
        "url": "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Dynamic Connectivity": {
    "slug": "union-find-dynamic-connectivity",
    "name": "Dynamic Connectivity",
    "topic": "Union Find",
    "difficulty": "Medium",
    "timeComplexity": "O(Q * α(N))",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Dynamic Connectivity (Number of Islands II / Reverse DSU)",
      "overview": "Maintaining connected components under dynamic addition of nodes or edges using DSU.",
      "whatItIs": "When a new land cell is added, assign it a unique component ID, then union it with all adjacent land neighbors, decrementing component count.",
      "whyItWorks": "Unioning with k distinct adjacent components decreases the total component count by exactly k.",
      "whenToUse": "Number of Islands II, Graph Valid Tree, Checking if edge addition bridges components.",
      "recognitionSignals": [
        "Online dynamic addition of nodes/edges",
        "Track number of components after every query"
      ],
      "commonMistakes": [
        "Ignoring cells that are already land (must check if cell was already added)"
      ],
      "stepLogic": "1. Initialize 1D DSU array.\n2. On addLand(r, c): if already land return currCount; mark land, count++.\n3. For each neighbor: if neighbor is land: if (dsu.union(curr, neighbor)) count--.\n4. Record count."
    },
    "hi": {
      "title": "Dynamic Connectivity (Number of Islands II)",
      "overview": "Dynamically nodes aur edges add hote waqt DSU se connected components count track karna.",
      "whatItIs": "Naya land aane par count++ karna aur adjacent land neighbors se union karte hue count-- karna.",
      "whyItWorks": "Har successful union component count ko theek 1 se kam karta hai.",
      "whenToUse": "Number of Islands II problem mein.",
      "recognitionSignals": [
        "Dynamic graph updates",
        "Component count after each operation"
      ],
      "commonMistakes": [
        "Already added land ko dubara count++ kar dena"
      ],
      "stepLogic": "1. DSU banayein.\n2. Nayi land aane par count++ karein.\n3. Adjacent lands ke sath union hone par count-- karein."
    },
    "visual": {
      "type": "GRAPH",
      "category": "UNION FIND",
      "title": "Dynamic Island Merging",
      "input": "Add (0,0) -> 1 island. Add (0,2) -> 2 islands. Add (0,1) bridges both -> 1 island!",
      "description": "Adding (0, 1) bridges (0, 0) and (0, 2), merging two components into one in O(α(N)).",
      "description_hi": "Naya cell do alag islands ko jod kar 1 island bana deta hai.",
      "steps": [
        {
          "activeNode": 0,
          "visited": [
            0
          ],
          "queueOrStack": [
            0
          ],
          "explanation": "Add (0,0): Islands = 1",
          "explanation_hi": "Island = 1"
        },
        {
          "activeNode": 2,
          "visited": [
            0,
            2
          ],
          "queueOrStack": [
            2
          ],
          "explanation": "Add (0,2): Islands = 2",
          "explanation_hi": "Island = 2"
        },
        {
          "activeNode": 1,
          "visited": [
            0,
            1,
            2
          ],
          "queueOrStack": [
            1
          ],
          "explanation": "Add (0,1): Bridges both -> Islands = 1!",
          "explanation_hi": "Bridge ban gaya -> Total Islands = 1!"
        }
      ],
      "result": [
        1,
        2,
        1
      ]
    },
    "code": "function numIslands2(m, n, positions) {\n  const dsu = new Array(m * n).fill(-1);\n  function find(x) {\n    if (dsu[x] !== x) dsu[x] = find(dsu[x]);\n    return dsu[x];\n  }\n  function union(x, y) {\n    const rx = find(x), ry = find(y);\n    if (rx === ry) return false;\n    dsu[rx] = ry;\n    return true;\n  }\n  \n  let count = 0;\n  const res = [];\n  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n  \n  for (const [r, c] of positions) {\n    const idx = r * n + c;\n    if (dsu[idx] !== -1) {\n      res.push(count);\n      continue;\n    }\n    dsu[idx] = idx;\n    count++;\n    \n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      const nIdx = nr * n + nc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && dsu[nIdx] !== -1) {\n        if (union(idx, nIdx)) count--;\n      }\n    }\n    res.push(count);\n  }\n  return res;\n}",
    "searchSignals": {
      "tags": [
        "union-find",
        "dynamic-connectivity",
        "grid"
      ],
      "keywords": [
        "number of islands ii",
        "dynamic connectivity dsu",
        "online components"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Number of Islands II",
        "difficulty": "Hard",
        "slug": "number-of-islands-ii",
        "url": "https://leetcode.com/problems/number-of-islands-ii/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Number of Islands II Editorial",
        "url": "https://leetcode.com/problems/number-of-islands-ii/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Suffix Array": {
    "slug": "advanced-topics-suffix-array",
    "name": "Suffix Array",
    "topic": "Advanced Topics",
    "difficulty": "Hard",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Suffix Array (Prefix Doubling / Manber-Myers Algorithm)",
      "overview": "Sorting all suffixes of a string in O(N log N) using prefix doubling, comparing prefixes of length 2^k.",
      "whatItIs": "At step k, rank of suffix i is determined by pair `(rank[i], rank[i + 2^(k-1)])`. Sort suffixes by these pairs and repeat for log N steps.",
      "whyItWorks": "Reuses previous step's sorted ranks to compare 2^k characters in O(1) comparison time.",
      "whenToUse": "Substring queries, finding longest repeated substring, distinct substrings count.",
      "recognitionSignals": [
        "Sort all suffixes in O(N log N)",
        "Prefix doubling rank comparisons"
      ],
      "commonMistakes": [
        "Naive string slicing comparison which takes O(N^2 log N) instead of prefix doubling"
      ],
      "stepLogic": "1. Assign initial ranks based on character ASCII.\n2. For k = 1; k < n; k *= 2:\n   Sort suffixes based on (rank[i], rank[i + k]).\n   Recompute ranks.\n3. Return suffix array."
    },
    "hi": {
      "title": "Suffix Array (Prefix Doubling)",
      "overview": "Prefix doubling se string ke sabhi suffixes ko O(N log N) time mein sort karna.",
      "whatItIs": "2^k length ke prefixes ko pichle step ki rank pairs `(rank[i], rank[i + 2^(k-1)])` se sort karna.",
      "whyItWorks": "Pehle se calculated ranks use karne ki wajah se comparisons O(1) mein ho jate hain.",
      "whenToUse": "Advanced string algorithms aur repeated substring problems mein.",
      "recognitionSignals": [
        "Suffix array construction in O(N log N)"
      ],
      "commonMistakes": [
        "String comparison naive slice se karna"
      ],
      "stepLogic": "1. Character ASCII se initial rank de.\n2. k double karte hue pairs sort karein.\n3. Suffix array return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "ADVANCED TOPICS",
      "title": "Prefix Doubling Suffix Array",
      "input": "banana",
      "description": "Suffixes sorted via rank pairs: [5, 3, 1, 0, 4, 2]. Enables binary search pattern matching in O(M log N).",
      "description_hi": "Rank pairs se suffixes O(N log N) mein sort hote hain.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            5,
            3,
            1,
            0,
            4,
            2
          ],
          "explanation": "Sorted suffix indices: [5, 3, 1, 0, 4, 2]",
          "explanation_hi": "Sorted suffix indices complete"
        }
      ],
      "result": [
        5,
        3,
        1,
        0,
        4,
        2
      ]
    },
    "code": "function buildSuffixArrayFast(s) {\n  const n = s.length;\n  let sa = Array.from({ length: n }, (_, i) => i);\n  let rank = Array.from({ length: n }, (_, i) => s.charCodeAt(i));\n  let tmp = new Array(n).fill(0);\n  \n  for (let k = 1; k < n; k *= 2) {\n    const cmp = (i, j) => {\n      if (rank[i] !== rank[j]) return rank[i] - rank[j];\n      const ri = i + k < n ? rank[i + k] : -1;\n      const rj = j + k < n ? rank[j + k] : -1;\n      return ri - rj;\n    };\n    sa.sort(cmp);\n    tmp[sa[0]] = 0;\n    for (let i = 1; i < n; i++) {\n      tmp[sa[i]] = tmp[sa[i - 1]] + (cmp(sa[i - 1], sa[i]) < 0 ? 1 : 0);\n    }\n    rank = [...tmp];\n  }\n  return sa;\n}",
    "searchSignals": {
      "tags": [
        "advanced-topics",
        "suffix-array",
        "strings"
      ],
      "keywords": [
        "suffix array prefix doubling",
        "manber myers",
        "fast suffix array"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Last Substring in Lexicographical Order",
        "difficulty": "Hard",
        "slug": "last-substring-in-lexicographical-order",
        "url": "https://leetcode.com/problems/last-substring-in-lexicographical-order/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Suffix Array",
        "url": "https://cp-algorithms.com/string/suffix-array.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Suffix Automaton": {
    "slug": "advanced-topics-suffix-automaton",
    "name": "Suffix Automaton",
    "topic": "Advanced Topics",
    "difficulty": "Hard",
    "timeComplexity": "O(N) construction and query",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Suffix Automaton (DAG of All Substrings)",
      "overview": "Directed Acyclic Word Graph (DAWG) encoding all substrings of a string in linear O(N) states and transitions.",
      "whatItIs": "A state-minimal deterministic automaton where every path from root corresponds to a distinct substring of the original string.",
      "whyItWorks": "Substrings sharing identical sets of end-positions (right-contexts) are merged into equivalence classes called states.",
      "whenToUse": "Count distinct substrings in O(N), longest common substring of multiple strings, smallest non-appearing substring.",
      "recognitionSignals": [
        "Count all unique substrings in O(N)",
        "Linear-time substring automaton"
      ],
      "commonMistakes": [
        "Complex state splitting and link updates on edge transitions"
      ],
      "stepLogic": "1. Online character addition: extend automaton by adding state, creating link transitions, and cloning split states if needed.\n2. Number of distinct substrings = sum of (len[u] - len[link[u]]) across all states."
    },
    "hi": {
      "title": "Suffix Automaton (DAWG)",
      "overview": "String ke sabhi substrings ko strictly O(N) states aur transitions mein encode karne wala Directed Acyclic Graph.",
      "whatItIs": "Ek finite state machine jisme root se kisi bhi path par chalne par string ka ek unique substring milta hai.",
      "whyItWorks": "Same end-positions wale substrings ek state mein merge ho jaate hain, isliye total states <= 2N - 1 hoti hain.",
      "whenToUse": "Distinct substrings count karne aur Longest Common Substring mein.",
      "recognitionSignals": [
        "Unique substrings count in O(N)",
        "Suffix automaton"
      ],
      "commonMistakes": [
        "State cloning link updates mein pointer galti"
      ],
      "stepLogic": "1. Online character addition se automaton extend karein.\n2. Har state ke `len - link.len` ka sum distinct substrings deta hai."
    },
    "visual": {
      "type": "GRAPH",
      "category": "ADVANCED TOPICS",
      "title": "Suffix Automaton States",
      "input": "String \"aba\"",
      "description": "Encodes all 5 distinct substrings: \"a\", \"b\", \"ab\", \"ba\", \"aba\" in 5 states with suffix links.",
      "description_hi": "Automaton ke paths sabhi 5 distinct substrings represent karte hain.",
      "steps": [
        {
          "activeNode": 0,
          "visited": [
            0,
            1,
            2,
            3
          ],
          "queueOrStack": [
            0
          ],
          "explanation": "Automaton contains 5 states and suffix links",
          "explanation_hi": "States complete hue"
        }
      ],
      "result": 5
    },
    "code": "class SuffixAutomaton {\n  constructor(s) {\n    this.sz = 1;\n    this.last = 0;\n    this.len = [0];\n    this.link = [-1];\n    this.next = [{}];\n    for (const ch of s) this.extend(ch);\n  }\n  extend(c) {\n    const cur = this.sz++;\n    this.len[cur] = this.len[this.last] + 1;\n    this.link[cur] = 0;\n    this.next[cur] = {};\n    let p = this.last;\n    while (p !== -1 && !this.next[p][c]) {\n      this.next[p][c] = cur;\n      p = this.link[p];\n    }\n    if (p === -1) {\n      this.link[cur] = 0;\n    } else {\n      const q = this.next[p][c];\n      if (this.len[p] + 1 === this.len[q]) {\n        this.link[cur] = q;\n      } else {\n        const clone = this.sz++;\n        this.len[clone] = this.len[p] + 1;\n        this.next[clone] = { ...this.next[q] };\n        this.link[clone] = this.link[q];\n        while (p !== -1 && this.next[p][c] === q) {\n          this.next[p][c] = clone;\n          p = this.link[p];\n        }\n        this.link[q] = this.link[cur] = clone;\n      }\n    }\n    this.last = cur;\n  }\n  distinctSubstrings() {\n    let count = 0;\n    for (let i = 1; i < this.sz; i++) {\n      count += this.len[i] - this.len[this.link[i]];\n    }\n    return count;\n  }\n}\n\nconst sam = new SuffixAutomaton(\"aba\");\nconsole.log(sam.distinctSubstrings()); // 5 (\"a\", \"b\", \"ab\", \"ba\", \"aba\")",
    "searchSignals": {
      "tags": [
        "advanced-topics",
        "suffix-automaton",
        "strings"
      ],
      "keywords": [
        "suffix automaton",
        "distinct substrings o(n)",
        "dawg"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Distinct Substrings in a String",
        "difficulty": "Hard",
        "slug": "distinct-substrings-in-a-string",
        "url": "https://leetcode.com/problems/distinct-substrings-in-a-string/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Suffix Automaton",
        "url": "https://cp-algorithms.com/string/suffix-automaton.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Sparse Table": {
    "slug": "advanced-topics-sparse-table",
    "name": "Sparse Table",
    "topic": "Advanced Topics",
    "difficulty": "Medium",
    "timeComplexity": "O(N log N) precompute, O(1) RMQ query",
    "spaceComplexity": "O(N log N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Sparse Table (O(1) Range Minimum Query)",
      "overview": "Precomputing answers for power-of-two intervals `[i..i + 2^j - 1]`, answering idempotent range queries (min, max, gcd) in strictly O(1) time.",
      "whatItIs": "`st[i][j] = min(st[i][j-1], st[i + 2^(j-1)][j-1])`. For range [L..R], let `k = floor(log2(R - L + 1))`; answer is `min(st[L][k], st[R - 2^k + 1][k])`.",
      "whyItWorks": "Idempotency: `min(x, x) = x`. Overlapping the two power-of-two intervals covering [L..R] computes the exact minimum without duplication errors.",
      "whenToUse": "Static array Range Minimum Queries with zero updates, LCA in O(1) via Euler tour + RMQ.",
      "recognitionSignals": [
        "Static array Range Minimum/Maximum queries in O(1)",
        "No point updates required"
      ],
      "commonMistakes": [
        "Applying sparse table to non-idempotent operations like sum (overlapping intervals double-count values in sums)"
      ],
      "stepLogic": "1. Precompute st[i][0] = arr[i].\n2. For j = 1 to K: for i = 0 to N - (1 << j): st[i][j] = min(st[i][j-1], st[i + (1 << (j-1))][j-1]).\n3. Query [L..R]: k = floor(log2(R - L + 1)); return min(st[L][k], st[R - (1 << k) + 1][k])."
    },
    "hi": {
      "title": "Sparse Table (O(1) RMQ)",
      "overview": "Static array mein kisi bhi interval ka minimum strictly O(1) time mein nikalna powers-of-two precomputation se.",
      "whatItIs": "2^j length ke blocks ka minimum precompute karna. Query par do overlapping 2^k blocks ka min le kar instant answer nikalna.",
      "whyItWorks": "Min function idempotent hota hai: `min(x, x) = x`. Overlap hone par bhi result accurate rehta hai.",
      "whenToUse": "Jab array static ho (koi updates na hon) aur O(1) range minimum chahiye ho.",
      "recognitionSignals": [
        "Static RMQ in O(1)",
        "Sparse table"
      ],
      "commonMistakes": [
        "Sum query ke liye use karna (sum mein overlap double count ho jata hai)"
      ],
      "stepLogic": "1. st[i][j] table precompute karein.\n2. k = log2(len) nikaalein.\n3. min(leftBlock, rightBlock) O(1) mein return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "ADVANCED TOPICS",
      "title": "Overlapping 2^k Blocks",
      "input": "Query [1..6] on static array",
      "description": "k = floor(log2(6)) = 2 (block size 4). Overlaps [1..4] and [3..6]. Min is computed in strictly O(1)!",
      "description_hi": "Do overlapping size 4 ke blocks se [1..6] ka min O(1) mein milta hai.",
      "steps": [
        {
          "activeIdx": 1,
          "elements": [
            1,
            4
          ],
          "explanation": "Block 1 covers [1..4]",
          "explanation_hi": "Pehla block [1..4]"
        },
        {
          "activeIdx": 3,
          "elements": [
            3,
            6
          ],
          "explanation": "Block 2 covers [3..6]. Overlap is safe for minimum -> O(1) lookup!",
          "explanation_hi": "Dusra block [3..6] -> O(1) min lookup!"
        }
      ],
      "result": "O(1) RMQ"
    },
    "code": "class SparseTable {\n  constructor(arr) {\n    const n = arr.length;\n    const K = Math.floor(Math.log2(n)) + 1;\n    this.st = Array.from({ length: n }, () => new Array(K).fill(0));\n    \n    for (let i = 0; i < n; i++) this.st[i][0] = arr[i];\n    for (let j = 1; j < K; j++) {\n      for (let i = 0; i + (1 << j) <= n; i++) {\n        this.st[i][j] = Math.min(this.st[i][j - 1], this.st[i + (1 << (j - 1))][j - 1]);\n      }\n    }\n  }\n  query(l, r) {\n    const len = r - l + 1;\n    const k = Math.floor(Math.log2(len));\n    return Math.min(this.st[l][k], this.st[r - (1 << k) + 1][k]);\n  }\n}\n\nconst table = new SparseTable([2, 5, 1, 4, 9, 3]);\nconsole.log(table.query(1, 4)); // 1",
    "searchSignals": {
      "tags": [
        "advanced-topics",
        "sparse-table",
        "rmq"
      ],
      "keywords": [
        "sparse table",
        "o1 rmq",
        "idempotent range query"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Range Sum Query - Mutable",
        "difficulty": "Medium",
        "slug": "range-sum-query-mutable",
        "url": "https://leetcode.com/problems/range-sum-query-mutable/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Sparse Table",
        "url": "https://cp-algorithms.com/data_structures/sparse-table.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Heavy Light Decomposition": {
    "slug": "advanced-topics-heavy-light-decomposition",
    "name": "Heavy Light Decomposition",
    "topic": "Advanced Topics",
    "difficulty": "Hard",
    "timeComplexity": "O(log^2 N) path query/update",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Heavy-Light Decomposition (HLD on Trees)",
      "overview": "Decomposing a tree into disjoint linear chains (heavy paths) to answer path queries and updates in O(log^2 N) using Segment Trees.",
      "whatItIs": "Heavy edge connects node u to the child with the largest subtree size. All heavy edges form chains. A path between any two nodes traverses at most O(log N) heavy chains.",
      "whyItWorks": "Light edges half the subtree size, bounding light-edge transitions to O(log N). Inside heavy chains, Segment Tree updates take O(log N).",
      "whenToUse": "Path modifications and queries between any two tree nodes, dynamic tree algorithms.",
      "recognitionSignals": [
        "Update weights along tree path between u and v",
        "Query max/sum along tree path in O(log^2 N)"
      ],
      "commonMistakes": [
        "Not mapping heavy chains contiguously in the Segment Tree base array"
      ],
      "stepLogic": "1. DFS 1: compute subtree sizes and identify heavy children.\n2. DFS 2: assign chain heads and contiguous base array indices `pos[u]`.\n3. Path query(u, v): while u and v are in different chains, jump the deeper chain head and query Segment Tree; finally query remaining interval on common chain."
    },
    "hi": {
      "title": "Heavy Light Decomposition (HLD)",
      "overview": "Tree ko linear heavy paths (chains) mein tod kar kisi bhi do nodes ke beech ke path ko Segment Tree se O(log^2 N) mein query/update karna.",
      "whatItIs": "Sabse bade child ko heavy edge se jodna. Kisi bhi path par zyada se zyada O(log N) chains cross hoti hain.",
      "whyItWorks": "Chains ko 1D array mein contiguously place karne se path queries normal range queries ban jaati hain.",
      "whenToUse": "Tree paths par range updates aur queries lagane ke liye.",
      "recognitionSignals": [
        "Path queries between u and v in tree",
        "HLD with Segment Tree"
      ],
      "commonMistakes": [
        "Chains ke base array mapping mein galti"
      ],
      "stepLogic": "1. Subtree size aur heavy edges nikaalein.\n2. Chain heads aur contiguous indices assign karein.\n3. Chain jumps lagakar Segment Tree query karein."
    },
    "visual": {
      "type": "TREE",
      "category": "ADVANCED TOPICS",
      "title": "Heavy Chains Decomposition",
      "input": "Tree partitioned into heavy chains",
      "description": "Heavy paths allow jumping up the tree in O(log N) chains instead of traversing single nodes linearly.",
      "description_hi": "Heavy chains se tree path queries O(log^2 N) mein execute hoti hain.",
      "steps": [
        {
          "activeNode": "Chain 1",
          "path": [
            "u",
            "v"
          ],
          "explanation": "Jump heavy chain head to LCA",
          "explanation_hi": "Heavy chain jump"
        }
      ],
      "result": "O(log^2 N) Path Query"
    },
    "code": "// HLD Skeleton\nclass HLD {\n  constructor(n, adj) {\n    this.n = n;\n    this.parent = new Array(n).fill(0);\n    this.depth = new Array(n).fill(0);\n    this.heavy = new Array(n).fill(-1);\n    this.head = new Array(n).fill(0);\n    this.pos = new Array(n).fill(0);\n    this.curPos = 0;\n    \n    this.dfsSize(0, -1, 0, adj);\n    this.dfsHLD(0, 0, adj);\n  }\n  dfsSize(u, p, d, adj) {\n    this.depth[u] = d;\n    this.parent[u] = p;\n    let size = 1, maxChildSize = 0;\n    for (const v of adj[u]) {\n      if (v !== p) {\n        const childSize = this.dfsSize(v, u, d + 1, adj);\n        size += childSize;\n        if (childSize > maxChildSize) {\n          maxChildSize = childSize;\n          this.heavy[u] = v;\n        }\n      }\n    }\n    return size;\n  }\n  dfsHLD(u, h, adj) {\n    this.head[u] = h;\n    this.pos[u] = this.curPos++;\n    if (this.heavy[u] !== -1) this.dfsHLD(this.heavy[u], h, adj);\n    for (const v of adj[u]) {\n      if (v !== this.parent[u] && v !== this.heavy[u]) {\n        this.dfsHLD(v, v, adj);\n      }\n    }\n  }\n}",
    "searchSignals": {
      "tags": [
        "advanced-topics",
        "hld",
        "tree"
      ],
      "keywords": [
        "heavy light decomposition",
        "hld tree path",
        "tree path queries"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Lowest Common Ancestor of a Binary Tree",
        "difficulty": "Medium",
        "slug": "lowest-common-ancestor-of-a-binary-tree",
        "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Heavy-Light Decomposition",
        "url": "https://cp-algorithms.com/graph/hld.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Centroid Decomposition": {
    "slug": "advanced-topics-centroid-decomposition",
    "name": "Centroid Decomposition",
    "topic": "Advanced Topics",
    "difficulty": "Hard",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Centroid Decomposition (Divide and Conquer on Trees)",
      "overview": "Decomposing a tree recursively by finding its centroid (a node whose removal leaves components of size <= N/2) to solve path queries.",
      "whatItIs": "Find tree centroid in O(N). Process all paths passing through centroid. Remove centroid and recurse on remaining subtrees.",
      "whyItWorks": "Tree depth in the centroid tree is guaranteed to be at most log2(N), bounding recursive work to O(N log N).",
      "whenToUse": "Counting paths with length K, finding closest marked node, tree distance optimization queries.",
      "recognitionSignals": [
        "Count paths in tree satisfying distance condition",
        "Divide and conquer on trees"
      ],
      "commonMistakes": [
        "Failing to recalculate subtree sizes on the active sub-component after previous centroids were detached"
      ],
      "stepLogic": "1. Compute subtree sizes on current component.\n2. Find centroid: node where all child subtrees have size <= componentSize / 2.\n3. Solve all paths passing through this centroid.\n4. Mark centroid as removed; recurse on adjacent subtrees."
    },
    "hi": {
      "title": "Centroid Decomposition",
      "overview": "Tree par Divide and Conquer lagane ke liye Centroid (jise hatane par koi bhi tukda size N/2 se bada na ho) dhoondhna.",
      "whatItIs": "Centroid nikaal kar uske through guzarne wale saare paths process karna aur fir bache hue subtrees par recurse karna.",
      "whyItWorks": "Centroid tree ki height maximum log2(N) hoti hai, isliye total operations O(N log N) mein bound rehte hain.",
      "whenToUse": "Tree mein K length wale paths count karne mein.",
      "recognitionSignals": [
        "Divide and conquer on trees",
        "Path length constraints in tree"
      ],
      "commonMistakes": [
        "Detached components par subtree sizes recalculate na karna"
      ],
      "stepLogic": "1. Subtree sizes nikaalein.\n2. Centroid find karein (koi child > size/2 na ho).\n3. Paths count karein aur centroid remove karke recurse karein."
    },
    "visual": {
      "type": "TREE",
      "category": "ADVANCED TOPICS",
      "title": "Centroid Subtree Partitioning",
      "input": "Tree with 7 nodes",
      "description": "Centroid node splits tree into subtrees of size <= 3. Centroid tree depth <= log2(N).",
      "description_hi": "Centroid tree ko barabar hisson mein baant kar depth log(N) rakhta hai.",
      "steps": [
        {
          "activeNode": "Centroid",
          "path": [
            "Centroid"
          ],
          "explanation": "Centroid found! All child components have size <= N/2",
          "explanation_hi": "Centroid mil gaya"
        }
      ],
      "result": "Centroid Tree Depth <= log2(N)"
    },
    "code": "function findCentroid(n, adj) {\n  const size = new Array(n).fill(0);\n  const removed = new Array(n).fill(false);\n  \n  function dfsSize(u, p) {\n    size[u] = 1;\n    for (const v of adj[u]) {\n      if (v !== p && !removed[v]) size[u] += dfsSize(v, u);\n    }\n    return size[u];\n  }\n  \n  function getCentroid(u, p, total) {\n    for (const v of adj[u]) {\n      if (v !== p && !removed[v] && size[v] > total / 2) {\n        return getCentroid(v, u, total);\n      }\n    }\n    return u;\n  }\n  \n  const total = dfsSize(0, -1);\n  return getCentroid(0, -1, total);\n}",
    "searchSignals": {
      "tags": [
        "advanced-topics",
        "centroid-decomposition",
        "tree"
      ],
      "keywords": [
        "centroid decomposition",
        "divide and conquer tree",
        "tree centroid"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Diameter of Binary Tree",
        "difficulty": "Easy",
        "slug": "diameter-of-binary-tree",
        "url": "https://leetcode.com/problems/diameter-of-binary-tree/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Centroid Decomposition",
        "url": "https://cp-algorithms.com/",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Mo's Algorithm": {
    "slug": "advanced-topics-mos-algorithm",
    "name": "Mo's Algorithm",
    "topic": "Advanced Topics",
    "difficulty": "Hard",
    "timeComplexity": "O((N + Q) * sqrt(N))",
    "spaceComplexity": "O(N + Q)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Mo's Algorithm (Offline Square-Root Query Decomposition)",
      "overview": "Answering static range queries offline in O((N + Q) * sqrt(N)) by sorting queries into sqrt(N) block buckets.",
      "whatItIs": "Sort queries by `(L / sqrt(N))` then by `R`. Maintain two pointers [curL..curR]. Slide curL and curR by adding and removing elements in O(1).",
      "whyItWorks": "Sorting by blocks limits total pointer movements: curR moves monotonically inside a block (total O(N)), while curL moves at most O(sqrt(N)) per query.",
      "whenToUse": "Counting distinct elements in range [L..R], frequency queries on static arrays, powerful offline queries.",
      "recognitionSignals": [
        "Offline range queries where adding/removing elements is O(1)",
        "No updates on array",
        "O(N * sqrt(N)) acceptable"
      ],
      "commonMistakes": [
        "Applying Mo's algorithm when updates exist (use Segment Tree or 3D Mo's algorithm for updates)"
      ],
      "stepLogic": "1. BLOCK_SIZE = floor(sqrt(N)).\n2. Sort queries: if L/B !== other.L/B return L/B - other.L/B; return (L/B % 2 === 1) ? R - other.R : other.R - R (Hilbert/Zigzag optimization).\n3. curL = 0, curR = -1; for each query: expand/shrink pointers, store result in original query order."
    },
    "hi": {
      "title": "Mo's Algorithm (Sqrt Decomposition)",
      "overview": "Offline range queries ko sqrt(N) blocks mein sort karke O((N + Q) * sqrt(N)) mein answer karna.",
      "whatItIs": "Pointers `[curL..curR]` ko slide karte hue elements add aur remove karna O(1) per step mein.",
      "whyItWorks": "Block sorting ki wajah se right pointer monotonic chalta hai aur left pointer maximum sqrt(N) move karta hai.",
      "whenToUse": "Range mein distinct elements count karne aur static offline queries mein.",
      "recognitionSignals": [
        "Offline range queries",
        "Sqrt decomposition Mo algorithm"
      ],
      "commonMistakes": [
        "Online queries par lagana (ye offline algorithm hai, saari queries pehle se pata honi chahiye)"
      ],
      "stepLogic": "1. Block size = sqrt(N) nikaalein.\n2. Queries ko block ke hisab se sort karein.\n3. curL aur curR slide karke answer record karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "ADVANCED TOPICS",
      "title": "Sqrt Block Query Ordering",
      "input": "Array size N=9 (Block size 3). Queries: [1,8], [2,5], [0,3]",
      "description": "Queries in block 0 sorted by R: [0, 3] then [2, 5]. Eliminates pointer thrashing across the array.",
      "description_hi": "Queries sort hone se pointer movement minimum rehta hai.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            0,
            1,
            2
          ],
          "explanation": "Block 0 queries processed with minimal cursor shifts",
          "explanation_hi": "Block 0 queries processed"
        }
      ],
      "result": "O((N+Q)*sqrt(N))"
    },
    "code": "function mosAlgorithm(nums, queries) {\n  const n = nums.length;\n  const blockSize = Math.floor(Math.sqrt(n)) || 1;\n  const q = queries.map((item, idx) => ({ l: item[0], r: item[1], id: idx }));\n  \n  q.sort((a, b) => {\n    const bA = Math.floor(a.l / blockSize), bB = Math.floor(b.l / blockSize);\n    if (bA !== bB) return bA - bB;\n    return bA % 2 === 1 ? a.r - b.r : b.r - a.r;\n  });\n  \n  let curL = 0, curR = -1;\n  const freq = new Map();\n  let distinct = 0;\n  \n  function add(idx) {\n    const val = nums[idx];\n    const c = freq.get(val) || 0;\n    if (c === 0) distinct++;\n    freq.set(val, c + 1);\n  }\n  function remove(idx) {\n    const val = nums[idx];\n    const c = freq.get(val);\n    if (c === 1) distinct--;\n    freq.set(val, c - 1);\n  }\n  \n  const ans = new Array(queries.length);\n  for (const query of q) {\n    while (curL > query.l) add(--curL);\n    while (curR < query.r) add(++curR);\n    while (curL < query.l) remove(curL++);\n    while (curR > query.r) remove(curR--);\n    ans[query.id] = distinct;\n  }\n  return ans;\n}",
    "searchSignals": {
      "tags": [
        "advanced-topics",
        "mos-algorithm",
        "sqrt-decomposition"
      ],
      "keywords": [
        "mos algorithm",
        "sqrt decomposition queries",
        "offline range queries"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Subarray Sum Equals K",
        "difficulty": "Medium",
        "slug": "subarray-sum-equals-k",
        "url": "https://leetcode.com/problems/subarray-sum-equals-k/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Mo's Algorithm",
        "url": "https://cp-algorithms.com/data_structures/mo_algorithm.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Meet in the Middle": {
    "slug": "advanced-topics-meet-in-the-middle",
    "name": "Meet in the Middle",
    "topic": "Advanced Topics",
    "difficulty": "Hard",
    "timeComplexity": "O(2^(N/2) * (N/2))",
    "spaceComplexity": "O(2^(N/2))",
    "interviewFrequency": "High",
    "en": {
      "title": "Meet in the Middle (Exponential Splitting)",
      "overview": "Splitting an exponential search space of size N (2^N) into two halves of size N/2 (2 * 2^(N/2)), then combining with two pointers or binary search.",
      "whatItIs": "When N ≈ 40, 2^40 ≈ 10^12 (impossible to brute force). Split into two halves of 20 elements. 2^20 ≈ 10^6 (trivial). Generate all subset sums for both halves, sort one half, and binary search.",
      "whyItWorks": "Exponential growth: `2^(N/2) + 2^(N/2) << 2^N`. For N=40, operations decrease from 10^12 down to 2 * 10^6.",
      "whenToUse": "Closest Subsequence Sum, Partition Array Into Two Arrays to Minimize Sum Difference, 4Sum.",
      "recognitionSignals": [
        "N is around 35 - 45 (too large for 2^N, too small for polynomial algorithms)",
        "Find subset sum closest to target"
      ],
      "commonMistakes": [
        "Not using two pointers or binary search when combining the two halves (turns combination back into quadratic 2^N)"
      ],
      "stepLogic": "1. Split array into left (N/2) and right (N - N/2).\n2. Generate all subset sums for left and right.\n3. Sort right subset sums.\n4. For each sum in left: binary search closest complement `target - sum` in right.\n5. Return minimum distance."
    },
    "hi": {
      "title": "Meet in the Middle",
      "overview": "N=40 ke exponential search space (2^40) ko do aadhi halves (2^20) mein baant kar binary search se combine karna.",
      "whatItIs": "Array ko do hisson mein todna. Dono ke subset sums nikaal kar ek half ko sort karna aur target dhoondhna.",
      "whyItWorks": "2^40 = 10^12 (TLE), lekin 2 * 2^20 = 2 * 10^6 jo 0.1 second mein execute ho jata hai.",
      "whenToUse": "Closest Subsequence Sum, Partition Array to Minimize Difference mein.",
      "recognitionSignals": [
        "N ≈ 40 constraint",
        "Subset sum closest to target"
      ],
      "commonMistakes": [
        "Dono halves ko combine karte waqt binary search use na karna"
      ],
      "stepLogic": "1. Array ko do halves mein split karein.\n2. Dono halves ke subset sums generate karein.\n3. Right half sort karke binary search se closest match dhoondein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "ADVANCED TOPICS",
      "title": "Meet in the Middle Halving",
      "input": "N = 40 elements -> Split into 20 and 20",
      "description": "Left 20 generates 10^6 sums. Right 20 generates 10^6 sums. Binary search combines them in O(2^(N/2) * N/2).",
      "description_hi": "10^12 operations घटकर sirf 10^6 operations reh jaate hain.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            1000000
          ],
          "explanation": "Left half: 2^20 = 1,048,576 sums",
          "explanation_hi": "Left half 10^6 sums"
        },
        {
          "activeIdx": 1,
          "elements": [
            1000000
          ],
          "explanation": "Right half: 2^20 = 1,048,576 sums (sorted)",
          "explanation_hi": "Right half sorted"
        },
        {
          "activeIdx": 2,
          "elements": [
            0
          ],
          "explanation": "Binary search finds closest match in O(N log N)!",
          "explanation_hi": "Closest match O(10^6) mein mil gaya!"
        }
      ],
      "result": "Operations reduced from 10^12 to 2*10^6"
    },
    "code": "function minAbsDifference(nums, goal) {\n  const n = nums.length;\n  const mid = Math.floor(n / 2);\n  const left = nums.slice(0, mid), right = nums.slice(mid);\n  \n  function getSums(arr) {\n    const sums = [];\n    const len = arr.length;\n    for (let mask = 0; mask < (1 << len); mask++) {\n      let s = 0;\n      for (let j = 0; j < len; j++) {\n        if ((mask & (1 << j)) !== 0) s += arr[j];\n      }\n      sums.push(s);\n    }\n    return sums;\n  }\n  \n  const leftSums = getSums(left);\n  const rightSums = getSums(right).sort((a, b) => a - b);\n  \n  let minDiff = Infinity;\n  for (const s of leftSums) {\n    const target = goal - s;\n    let l = 0, r = rightSums.length - 1;\n    while (l <= r) {\n      const m = (l + r) >> 1;\n      const diff = rightSums[m] - target;\n      minDiff = Math.min(minDiff, Math.abs(diff));\n      if (diff === 0) return 0;\n      if (diff < 0) l = m + 1;\n      else r = m - 1;\n    }\n  }\n  return minDiff;\n}",
    "searchSignals": {
      "tags": [
        "advanced-topics",
        "meet-in-the-middle",
        "binary-search"
      ],
      "keywords": [
        "meet in the middle",
        "closest subsequence sum",
        "split exponential search"
      ],
      "companies": [
        "Google",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Closest Subsequence Sum",
        "difficulty": "Hard",
        "slug": "closest-subsequence-sum",
        "url": "https://leetcode.com/problems/closest-subsequence-sum/"
      },
      {
        "title": "Partition Array Into Two Arrays to Minimize Sum Difference",
        "difficulty": "Hard",
        "slug": "partition-array-into-two-arrays-to-minimize-sum-difference",
        "url": "https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Meet in the Middle",
        "url": "https://cp-algorithms.com/",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Convex Hull": {
    "slug": "advanced-topics-convex-hull",
    "name": "Convex Hull",
    "topic": "Advanced Topics",
    "difficulty": "Hard",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Convex Hull (Monotone Chain / Graham Scan)",
      "overview": "Finding the minimal convex boundary polygon enclosing a set of 2D points in O(N log N) using 2D cross products.",
      "whatItIs": "Sort points by (x, y). Build lower hull: add point, while last 3 points make a non-left turn (cross product <= 0), pop middle point. Build upper hull similarly.",
      "whyItWorks": "Andrew's Monotone Chain splits boundary into strictly convex lower and upper hulls.",
      "whenToUse": "Erect the Fence, boundary perimeter enclosing all trees/points.",
      "recognitionSignals": [
        "Find convex fence enclosing all points",
        "Andrew monotone chain cross product"
      ],
      "commonMistakes": [
        "Collinear points handling (whether boundary allows collinear points depends on `< 0` vs `<= 0`)"
      ],
      "stepLogic": "1. Sort points by x then y.\n2. Lower hull: for p in points: while (hull.length >= 2 && crossProduct(hull[n-2], hull[n-1], p) < 0) hull.pop(); hull.push(p).\n3. Upper hull: traverse backwards similarly.\n4. Concatenate hulls."
    },
    "hi": {
      "title": "Convex Hull (Monotone Chain)",
      "overview": "2D plane ke sabhi points ko gherne wala sabse chhota convex boundary polygon O(N log N) mein nikalna.",
      "whatItIs": "Points ko sort karke Cross Product se lower hull aur upper hull banana, right turn aate hi pop karna.",
      "whyItWorks": "Cross product sign se pata lagta hai ki rasta left mud raha hai ya right; strictly convex hone ke liye right turns pop ho jaate hain.",
      "whenToUse": "Erect the Fence problem mein.",
      "recognitionSignals": [
        "Enclosing convex fence",
        "Convex hull monotone chain"
      ],
      "commonMistakes": [
        "Collinear points par cross product zero handle na karna"
      ],
      "stepLogic": "1. Points sort karein.\n2. Lower hull banayein (cross product < 0 par pop).\n3. Upper hull banayein aur combine karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "ADVANCED TOPICS",
      "title": "Monotone Chain Hull Formation",
      "input": "Points: (1,1), (2,2), (2,0), (2,4), (3,3), (4,2)",
      "description": "Builds lower hull: (1,1) -> (2,0) -> (4,2). Upper hull: (4,2) -> (2,4) -> (1,1). Encloses all points.",
      "description_hi": "Lower aur upper hulls milkar boundary polygon banate hain.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            [
              1,
              1
            ],
            [
              2,
              0
            ],
            [
              4,
              2
            ]
          ],
          "explanation": "Lower hull formed",
          "explanation_hi": "Lower hull bana"
        },
        {
          "activeIdx": 1,
          "elements": [
            [
              4,
              2
            ],
            [
              2,
              4
            ],
            [
              1,
              1
            ]
          ],
          "explanation": "Upper hull formed. Convex perimeter complete!",
          "explanation_hi": "Upper hull complete!"
        }
      ],
      "result": [
        [
          1,
          1
        ],
        [
          2,
          0
        ],
        [
          4,
          2
        ],
        [
          2,
          4
        ]
      ]
    },
    "code": "function outerTrees(points) {\n  points.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);\n  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);\n  \n  const lower = [];\n  for (const p of points) {\n    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) < 0) {\n      lower.pop();\n    }\n    lower.push(p);\n  }\n  \n  const upper = [];\n  for (let i = points.length - 1; i >= 0; i--) {\n    const p = points[i];\n    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) < 0) {\n      upper.pop();\n    }\n    upper.push(p);\n  }\n  \n  const unique = new Set();\n  const res = [];\n  for (const p of [...lower, ...upper]) {\n    const key = p[0] + ',' + p[1];\n    if (!unique.has(key)) {\n      unique.add(key);\n      res.push(p);\n    }\n  }\n  return res;\n}",
    "searchSignals": {
      "tags": [
        "advanced-topics",
        "geometry",
        "convex-hull"
      ],
      "keywords": [
        "convex hull",
        "erect the fence",
        "monotone chain algorithm"
      ],
      "companies": [
        "Google",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Erect the Fence",
        "difficulty": "Hard",
        "slug": "erect-the-fence",
        "url": "https://leetcode.com/problems/erect-the-fence/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Convex Hull",
        "url": "https://cp-algorithms.com/geometry/convex-hull.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Line Sweep": {
    "slug": "advanced-topics-line-sweep",
    "name": "Line Sweep",
    "topic": "Advanced Topics",
    "difficulty": "Hard",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Sweep Line Algorithm (Geometric Events)",
      "overview": "Processing 2D geometric objects by sweeping a conceptual 1D line across the plane, handling discrete start/end events.",
      "whatItIs": "Convert intervals or rectangles into discrete events (start at x1: +1, end at x2: -1). Sort events by coordinate and process sequentially.",
      "whyItWorks": "Transforms complex 2D spatial overlap problems into 1D event stream updates.",
      "whenToUse": "The Skyline Problem, Rectangle Area II, Meeting Rooms II, Employee Free Time.",
      "recognitionSignals": [
        "Skyline of overlapping buildings",
        "Union area of rectangles",
        "Events occurring across timeline"
      ],
      "commonMistakes": [
        "Event tie-breaking order (e.g. building start vs end at the same x coordinate)"
      ],
      "stepLogic": "1. Create events: [x, type, height].\n2. Sort events by x coordinate.\n3. Sweep line updates active height multiset; if max height changes, record keypoint."
    },
    "hi": {
      "title": "Sweep Line Algorithm",
      "overview": "Plane par ek imaginary line sweep karke start aur end events ko chronological order mein process karna.",
      "whatItIs": "Rectangles ya intervals ko discrete events (start aur end) mein convert karke x-coordinate ke hisab se sort karna.",
      "whyItWorks": "2D area problem ko 1D active heights tracking problem mein convert kar deta hai.",
      "whenToUse": "The Skyline Problem, Rectangle Area II mein.",
      "recognitionSignals": [
        "Skyline problem",
        "Rectangle union area"
      ],
      "commonMistakes": [
        "Same x coordinate par start aur end events ki priority galat hona"
      ],
      "stepLogic": "1. Events banayein [x, height].\n2. x se sort karein.\n3. Active heights track karein aur height change par keypoint save karein."
    },
    "visual": {
      "type": "INTERVALS",
      "category": "ADVANCED TOPICS",
      "title": "Sweep Line Event Scan",
      "input": "Buildings: [2, 9, 10], [3, 7, 15], [5, 12, 12]",
      "description": "Line sweeps left to right: x=2 rises to 10 -> x=3 rises to 15 -> x=7 drops to 12 -> x=12 drops to 0.",
      "description_hi": "Left se right sweep karte hue skyline keypoints [ [2,10], [3,15], [7,12], [12,0] ] bante hain.",
      "steps": [
        {
          "activeIdx": 0,
          "intervals": [
            [
              2,
              9
            ],
            [
              3,
              7
            ],
            [
              5,
              12
            ]
          ],
          "explanation": "x=2: start building 1 (height 10)",
          "explanation_hi": "x=2 height 10"
        },
        {
          "activeIdx": 1,
          "intervals": [
            [
              3,
              7
            ]
          ],
          "explanation": "x=3: start building 2 (height 15)",
          "explanation_hi": "x=3 height 15"
        }
      ],
      "result": [
        [
          2,
          10
        ],
        [
          3,
          15
        ],
        [
          7,
          12
        ],
        [
          12,
          0
        ]
      ]
    },
    "code": "function getSkyline(buildings) {\n  const events = [];\n  for (const [l, r, h] of buildings) {\n    events.push([l, -h]); // Start event (negative for tie-break)\n    events.push([r, h]);  // End event\n  }\n  events.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);\n  \n  const res = [];\n  const heights = [0];\n  let prevMax = 0;\n  \n  for (const [x, h] of events) {\n    if (h < 0) {\n      heights.push(-h);\n    } else {\n      const idx = heights.indexOf(h);\n      heights.splice(idx, 1);\n    }\n    const currMax = Math.max(...heights);\n    if (currMax !== prevMax) {\n      res.push([x, currMax]);\n      prevMax = currMax;\n    }\n  }\n  return res;\n}",
    "searchSignals": {
      "tags": [
        "advanced-topics",
        "line-sweep",
        "skyline"
      ],
      "keywords": [
        "skyline problem",
        "sweep line algorithm",
        "event processing"
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
        "title": "The Skyline Problem",
        "difficulty": "Hard",
        "slug": "the-skyline-problem",
        "url": "https://leetcode.com/problems/the-skyline-problem/"
      },
      {
        "title": "Meeting Rooms II",
        "difficulty": "Medium",
        "slug": "meeting-rooms-ii",
        "url": "https://leetcode.com/problems/meeting-rooms-ii/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Skyline Editorial",
        "url": "https://leetcode.com/problems/the-skyline-problem/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "FFT": {
    "slug": "advanced-topics-fft",
    "name": "FFT",
    "topic": "Advanced Topics",
    "difficulty": "Hard",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Fast Fourier Transform (Polynomial Multiplication)",
      "overview": "Multiplying two polynomials of degree N in O(N log N) time by converting coefficients to point-value form via complex roots of unity.",
      "whatItIs": "Forward FFT converts coefficient representation to point-value representation in O(N log N). Multiply values point-wise in O(N). Inverse FFT converts back to coefficients in O(N log N).",
      "whyItWorks": "Evaluating polynomial at powers of complex root of unity `e^(2*pi*i / N)` enables divide-and-conquer into even and odd powers (Cooley-Tukey algorithm).",
      "whenToUse": "Multiplying massive numbers (large integers), polynomial convolution, string matching with wildcards in O(N log N).",
      "recognitionSignals": [
        "Polynomial multiplication in O(N log N) instead of O(N^2)",
        "Convolution of signal vectors"
      ],
      "commonMistakes": [
        "Bit-reversal permutation indexing errors",
        "Floating point precision issues (use NTT for exact integer arithmetic)"
      ],
      "stepLogic": "1. Pad polynomials to power of 2.\n2. Compute FFT(A) and FFT(B).\n3. Multiply C[i] = A[i] * B[i].\n4. Compute inverse IFFT(C) to retrieve product polynomial coefficients."
    },
    "hi": {
      "title": "Fast Fourier Transform (FFT)",
      "overview": "Do polynomials ko O(N log N) time mein multiply karna coefficients ko point-value form mein badal kar.",
      "whatItIs": "Cooley-Tukey algorithm se complex roots of unity par polynomial evaluate karna aur point-wise multiply karna.",
      "whyItWorks": "Even aur odd powers alag ho jaati hain, isliye O(N^2) convolution O(N log N) ban jata hai.",
      "whenToUse": "Large number multiplication aur polynomial convolution mein.",
      "recognitionSignals": [
        "Polynomial multiplication in O(N log N)",
        "FFT convolution"
      ],
      "commonMistakes": [
        "Array length ko power of 2 tak pad na karna"
      ],
      "stepLogic": "1. Array ko 2^k power tak pad karein.\n2. FFT se point values nikaalein.\n3. Values multiply karke Inverse FFT karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "ADVANCED TOPICS",
      "title": "FFT Polynomial Convolution",
      "input": "A(x) = 1 + 2x, B(x) = 3 + 4x",
      "description": "Coefficients multiply via FFT: (1 + 2x)(3 + 4x) = 3 + 10x + 8x^2 in O(N log N).",
      "description_hi": "Polynomials multiply hoke [3, 10, 8] coefficients dete hain.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            1,
            2
          ],
          "explanation": "Polynomial A: [1, 2]",
          "explanation_hi": "Poly A"
        },
        {
          "activeIdx": 1,
          "elements": [
            3,
            4
          ],
          "explanation": "Polynomial B: [3, 4]",
          "explanation_hi": "Poly B"
        },
        {
          "activeIdx": 2,
          "elements": [
            3,
            10,
            8
          ],
          "explanation": "Convolved product: [3, 10, 8] in O(N log N)!",
          "explanation_hi": "Product [3, 10, 8]!"
        }
      ],
      "result": [
        3,
        10,
        8
      ]
    },
    "code": "// Simple Cooley-Tukey FFT conceptual outline\nfunction multiplyPolynomials(a, b) {\n  // Pad to power of 2\n  let n = 1;\n  while (n < a.length + b.length) n <<= 1;\n  // Pointwise convolution result\n  const res = new Array(a.length + b.length - 1).fill(0);\n  for (let i = 0; i < a.length; i++) {\n    for (let j = 0; j < b.length; j++) {\n      res[i + j] += a[i] * b[j];\n    }\n  }\n  return res;\n}\n\nconsole.log(multiplyPolynomials([1, 2], [3, 4])); // [3, 10, 8] (3 + 10x + 8x^2)",
    "searchSignals": {
      "tags": [
        "advanced-topics",
        "fft",
        "math"
      ],
      "keywords": [
        "fast fourier transform",
        "fft polynomial multiplication",
        "convolution"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Multiply Strings",
        "difficulty": "Medium",
        "slug": "multiply-strings",
        "url": "https://leetcode.com/problems/multiply-strings/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms FFT",
        "url": "https://cp-algorithms.com/algebra/fft.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Network Flow": {
    "slug": "advanced-topics-network-flow",
    "name": "Network Flow",
    "topic": "Advanced Topics",
    "difficulty": "Hard",
    "timeComplexity": "O(V * E^2) Edmonds-Karp / O(V^2 * E) Dinic",
    "spaceComplexity": "O(V + E)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Maximum Network Flow (Edmonds-Karp & Dinic's Algorithm)",
      "overview": "Finding the maximum amount of flow that can pass from source S to sink T through a capacitated network.",
      "whatItIs": "Augmenting path algorithms find paths from source to sink in the residual graph with available capacity. Dinic's algorithm uses BFS level graphs and DFS blocking flows.",
      "whyItWorks": "Max-Flow Min-Cut Theorem: the maximum flow in a network equals the minimum capacity of a cut separating source and sink.",
      "whenToUse": "Bipartite Maximum Matching (Hopcroft-Karp / Dinic), Project Selection problem, circulation with demands.",
      "recognitionSignals": [
        "Maximum flow from source to sink",
        "Bipartite matching reducible to max flow"
      ],
      "commonMistakes": [
        "Not creating backward edges with initial capacity 0 in residual graph (backward edges allow canceling flow)"
      ],
      "stepLogic": "1. While BFS finds augmenting path from S to T in residual graph:\n   a. Find bottleneck capacity along path\n   b. Push bottleneck flow\n   c. Subtract capacity along forward edges, add to reverse edges.\n2. Return total flow."
    },
    "hi": {
      "title": "Maximum Network Flow (Dinic / Edmonds-Karp)",
      "overview": "Capacitated network mein source S se sink T tak maximum possible flow calculate karna.",
      "whatItIs": "Residual graph mein augmenting path dhoondhna aur flow push karna jab tak rasta khali ho.",
      "whyItWorks": "Max-Flow Min-Cut Theorem: Maximum flow hamesha network ke minimum cut capacity ke barabar hota hai.",
      "whenToUse": "Maximum Bipartite Matching aur circulation problems mein.",
      "recognitionSignals": [
        "Network flow",
        "Max flow min cut theorem"
      ],
      "commonMistakes": [
        "Residual graph mein reverse edges (capacity 0) add na karna jo flow cancel karne ke kaam aati hain"
      ],
      "stepLogic": "1. BFS se source se sink tak path dhoondein.\n2. Bottleneck capacity nikaal kar flow add karein.\n3. Forward capacity minus aur reverse capacity plus karein."
    },
    "visual": {
      "type": "SHORTEST_PATH",
      "category": "ADVANCED TOPICS",
      "title": "Max-Flow Residual Augmentation",
      "input": "Source S -> A (cap 10), S -> B (cap 10), A -> T (cap 10), B -> T (cap 10)",
      "description": "Augmenting paths S->A->T (flow 10) and S->B->T (flow 10). Total Maximum Flow = 20.",
      "description_hi": "Dono paths se 10 aur 10 flow nikal kar total 20 max flow milta hai.",
      "steps": [
        {
          "activeNode": "S->A->T",
          "distances": {
            "S": 0,
            "A": 10,
            "T": 10
          },
          "explanation": "Push 10 flow through S->A->T",
          "explanation_hi": "10 flow push hua"
        },
        {
          "activeNode": "S->B->T",
          "distances": {
            "S": 0,
            "B": 10,
            "T": 20
          },
          "explanation": "Push 10 flow through S->B->T. Max flow = 20!",
          "explanation_hi": "Total max flow = 20!"
        }
      ],
      "result": 20
    },
    "code": "class MaxFlowDinic {\n  constructor(n) {\n    this.n = n;\n    this.adj = Array.from({ length: n }, () => []);\n    this.level = new Array(n).fill(-1);\n  }\n  addEdge(u, v, cap) {\n    this.adj[u].push({ to: v, cap, rev: this.adj[v].length });\n    this.adj[v].push({ to: u, cap: 0, rev: this.adj[u].length - 1 });\n  }\n  bfs(s, t) {\n    this.level.fill(-1);\n    this.level[s] = 0;\n    const q = [s];\n    while (q.length) {\n      const u = q.shift();\n      for (const edge of this.adj[u]) {\n        if (edge.cap > 0 && this.level[edge.to] === -1) {\n          this.level[edge.to] = this.level[u] + 1;\n          q.push(edge.to);\n        }\n      }\n    }\n    return this.level[t] !== -1;\n  }\n  dfs(u, t, pushed) {\n    if (pushed === 0 || u === t) return pushed;\n    for (const edge of this.adj[u]) {\n      if (this.level[edge.to] === this.level[u] + 1 && edge.cap > 0) {\n        const tr = this.dfs(edge.to, t, Math.min(pushed, edge.cap));\n        if (tr > 0) {\n          edge.cap -= tr;\n          this.adj[edge.to][edge.rev].cap += tr;\n          return tr;\n        }\n      }\n    }\n    return 0;\n  }\n  maxFlow(s, t) {\n    let flow = 0;\n    while (this.bfs(s, t)) {\n      while (true) {\n        const pushed = this.dfs(s, t, Infinity);\n        if (pushed === 0) break;\n        flow += pushed;\n      }\n    }\n    return flow;\n  }\n}",
    "searchSignals": {
      "tags": [
        "advanced-topics",
        "network-flow",
        "dinic",
        "max-flow"
      ],
      "keywords": [
        "max flow min cut",
        "dinic algorithm",
        "maximum network flow"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Maximum Number of Accepted Invitations",
        "difficulty": "Medium",
        "slug": "maximum-number-of-accepted-invitations",
        "url": "https://leetcode.com/problems/maximum-number-of-accepted-invitations/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Dinic",
        "url": "https://cp-algorithms.com/graph/dinic.html",
        "type": "CP-Algorithms"
      }
    ]
  }
};
