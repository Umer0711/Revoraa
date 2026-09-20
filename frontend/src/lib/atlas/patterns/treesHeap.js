export const treesHeapPatterns = {
  "DFS": {
    "slug": "trees-dfs",
    "name": "DFS",
    "topic": "Trees",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H) where H is height",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Depth-First Search (Tree Traversal & Recursion)",
      "overview": "Visiting all nodes by recursively exploring as deep as possible along each branch before backtracking.",
      "whatItIs": "Pre-order, In-order, or Post-order recursion utilizing call stack to explore left and right subtrees.",
      "whyItWorks": "Tree is an acyclic connected graph; recursion naturally models the inductive subproblem of subtree computation.",
      "whenToUse": "Maximum depth of binary tree, path sum, invert binary tree, symmetric tree.",
      "recognitionSignals": [
        "Traverse every path from root to leaf",
        "Calculate tree height or validate subtree conditions",
        "Recursive structural property"
      ],
      "commonMistakes": [
        "Missing base case `if (!root) return 0/null` leading to Maximum Call Stack Exceeded",
        "Assuming tree is balanced and space is always O(log N) instead of O(N) worst case"
      ],
      "stepLogic": "1. Base case: if (!root) return default (0, null, true).\n2. Recurse on left child: dfs(root.left).\n3. Recurse on right child: dfs(root.right).\n4. Combine results and return."
    },
    "hi": {
      "title": "Tree Depth-First Search (DFS)",
      "overview": "Root se shuru karke har branch ke end tak gehraai mein traverse karna aur phir backtrack karna.",
      "whatItIs": "Recursion call stack ka use karke left aur right subtrees ko systematically visit karna.",
      "whyItWorks": "Tree mein koi cycle nahi hoti, isliye har node par subproblem naturally inductive hoti hai.",
      "whenToUse": "Max depth of binary tree, Path sum, Invert tree jaise sawalon mein.",
      "recognitionSignals": [
        "Root to leaf paths",
        "Tree height calculation"
      ],
      "commonMistakes": [
        "Base case `if (!root)` bhool kar stack overflow kar dena"
      ],
      "stepLogic": "1. Base case: null par return karein.\n2. Left aur Right child par dfs call karein.\n3. Result combine karke return karein."
    },
    "visual": {
      "type": "TREE",
      "category": "TREES",
      "title": "DFS Maximum Depth Exploration",
      "input": [
        3,
        9,
        20,
        null,
        null,
        15,
        7
      ],
      "description": "Recursively explores depth: root 3 -> right 20 -> child 7 reaches max depth 3.",
      "description_hi": "Recursion se har path ki depth calculate hoti hai: maximum depth 3.",
      "steps": [
        {
          "activeNode": 3,
          "path": [
            3
          ],
          "explanation": "Root 3: explores left (depth=2) and right (depth=3)",
          "explanation_hi": "Root 3 dono subtrees ko explore karta hai"
        },
        {
          "activeNode": 20,
          "path": [
            3,
            20
          ],
          "explanation": "Node 20: explores 15 (depth=3) and 7 (depth=3)",
          "explanation_hi": "Node 20 apne children 15 aur 7 ko explore karta hai"
        },
        {
          "activeNode": 7,
          "path": [
            3,
            20,
            7
          ],
          "explanation": "Leaf 7 reached at depth 3. Max depth = 1 + max(1, 2) = 3.",
          "explanation_hi": "Leaf 7 par depth 3 complete hoti hai. Result = 3."
        }
      ],
      "result": 3
    },
    "code": "function maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}\n\n// Tree [3,9,20,null,null,15,7] returns 3",
    "searchSignals": {
      "tags": [
        "trees",
        "dfs",
        "binary-tree"
      ],
      "keywords": [
        "max depth binary tree",
        "tree dfs",
        "tree recursion"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft",
        "Apple"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Maximum Depth of Binary Tree",
        "difficulty": "Easy",
        "slug": "maximum-depth-of-binary-tree",
        "url": "https://leetcode.com/problems/maximum-depth-of-binary-tree/"
      },
      {
        "title": "Invert Binary Tree",
        "difficulty": "Easy",
        "slug": "invert-binary-tree",
        "url": "https://leetcode.com/problems/invert-binary-tree/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Binary Tree Explore Card",
        "url": "https://leetcode.com/explore/learn/card/data-structure-tree/",
        "type": "LeetCode"
      }
    ]
  },
  "BFS": {
    "slug": "trees-bfs",
    "name": "BFS",
    "topic": "Trees",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(W) where W is max width",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Tree Breadth-First Search (Level Order)",
      "overview": "Visiting tree nodes horizontal row-by-row using a FIFO queue.",
      "whatItIs": "At each step, process all nodes present in the queue (the current level) before proceeding to child nodes.",
      "whyItWorks": "The queue isolates each generation/depth level because children of level k are strictly enqueued behind nodes of level k.",
      "whenToUse": "Binary Tree Level Order Traversal, Zigzag Level Order, Binary Tree Right Side View, Minimum Depth.",
      "recognitionSignals": [
        "Level by level processing",
        "Right/Left side view of tree",
        "Minimum distance/depth to first leaf"
      ],
      "commonMistakes": [
        "Calling queue.length inside the inner loop without freezing levelSize first (infinite/corrupted level grouping)"
      ],
      "stepLogic": "1. If (!root) return [].\n2. queue = [root], res = [].\n3. While queue.length > 0:\n   a. levelSize = queue.length, currLevel = []\n   b. For i = 0 to levelSize: node = queue.shift(); currLevel.push(node.val); enqueue left & right\n   c. res.push(currLevel)\n4. Return res."
    },
    "hi": {
      "title": "Tree BFS (Level Order Traversal)",
      "overview": "Queue ki madad se tree ko level-by-level (horizontal rows) traverse karna.",
      "whatItIs": "Har level par maujood saare nodes ko ek sath process karke unke children ko queue ke end mein add karna.",
      "whyItWorks": "FIFO property ki wajah se level k ke saare nodes level k+1 se pehle nikalte hain.",
      "whenToUse": "Level Order, Right Side View, Zigzag traversal mein.",
      "recognitionSignals": [
        "Tree level by level output",
        "Right side view"
      ],
      "commonMistakes": [
        "Inner loop mein queue.length directly use karna bina pehle freeze kiye"
      ],
      "stepLogic": "1. Root ko queue mein daalein.\n2. levelSize = queue.length fix karein.\n3. levelSize bar pop karke current level array bharein aur children push karein."
    },
    "visual": {
      "type": "TREE",
      "category": "TREES",
      "title": "Tree Level By Level Grouping",
      "input": [
        3,
        9,
        20,
        null,
        null,
        15,
        7
      ],
      "description": "Level 0: [3] -> Level 1: [9, 20] -> Level 2: [15, 7].",
      "description_hi": "Level 0: [3], Level 1: [9, 20], Level 2: [15, 7] rows banti hain.",
      "steps": [
        {
          "activeNode": 3,
          "path": [
            3
          ],
          "explanation": "Process Level 0: [3]",
          "explanation_hi": "Level 0 process hua"
        },
        {
          "activeNode": 9,
          "path": [
            9,
            20
          ],
          "explanation": "Process Level 1: [9, 20]",
          "explanation_hi": "Level 1 process hua"
        },
        {
          "activeNode": 15,
          "path": [
            15,
            7
          ],
          "explanation": "Process Level 2: [15, 7]. Traversal complete!",
          "explanation_hi": "Level 2 process hua. Complete!"
        }
      ],
      "result": [
        [
          3
        ],
        [
          9,
          20
        ],
        [
          15,
          7
        ]
      ]
    },
    "code": "function levelOrder(root) {\n  if (!root) return [];\n  const res = [];\n  const queue = [root];\n  \n  while (queue.length) {\n    const size = queue.length;\n    const level = [];\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    res.push(level);\n  }\n  return res;\n}",
    "searchSignals": {
      "tags": [
        "trees",
        "bfs",
        "queue"
      ],
      "keywords": [
        "binary tree level order",
        "tree bfs",
        "right side view tree"
      ],
      "companies": [
        "Amazon",
        "Microsoft",
        "Bloomberg",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Binary Tree Level Order Traversal",
        "difficulty": "Medium",
        "slug": "binary-tree-level-order-traversal",
        "url": "https://leetcode.com/problems/binary-tree-level-order-traversal/"
      },
      {
        "title": "Binary Tree Right Side View",
        "difficulty": "Medium",
        "slug": "binary-tree-right-side-view",
        "url": "https://leetcode.com/problems/binary-tree-right-side-view/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Level Order Traversal Editorial",
        "url": "https://leetcode.com/problems/binary-tree-level-order-traversal/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Tree Traversals": {
    "slug": "trees-tree-traversals",
    "name": "Tree Traversals",
    "topic": "Trees",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Canonical Tree Traversals (Pre, In, Post-Order)",
      "overview": "Systematic orders for visiting tree nodes: Pre-order (N-L-R), In-order (L-N-R), and Post-order (L-R-N).",
      "whatItIs": "In-order traversal of a BST yields sorted order; Post-order processes subtrees bottom-up; Pre-order clones or serializes hierarchical structure.",
      "whyItWorks": "Different positions of root processing relative to left and right subtree recursions produce canonical linear sequences.",
      "whenToUse": "Binary Tree Inorder Traversal, Construct Binary Tree from Preorder and Inorder, flattening tree.",
      "recognitionSignals": [
        "In-order on BST gives ascending numbers",
        "Post-order for deleting nodes or calculating subtree properties",
        "Pre-order for tree replication"
      ],
      "commonMistakes": [
        "Confusing visit order of root with left/right execution"
      ],
      "stepLogic": "1. In-order: traverse(node.left) -> visit(node) -> traverse(node.right).\n2. Pre-order: visit(node) -> traverse(node.left) -> traverse(node.right).\n3. Post-order: traverse(node.left) -> traverse(node.right) -> visit(node)."
    },
    "hi": {
      "title": "Tree Traversals (Pre, In, Post-Order)",
      "overview": "Tree nodes ko visit karne ke 3 standard orders: Pre-order (Root-Left-Right), In-order (Left-Root-Right), aur Post-order (Left-Right-Root).",
      "whatItIs": "BST ka In-order traversal hamesha sorted values deta hai; Post-order bottom-up calculation ke liye best hota hai.",
      "whyItWorks": "Root ko pehle, beech mein ya aakhiri mein process karne se alag-alag linear sequences bante hain.",
      "whenToUse": "Inorder traversal, Tree reconstruction problems mein.",
      "recognitionSignals": [
        "BST sorted traversal",
        "Post-order bottom-up calculation"
      ],
      "commonMistakes": [
        "Pre, In, aur Post order ke sequence mein confuse hona"
      ],
      "stepLogic": "1. In-order: Left child -> Root value -> Right child.\n2. Pre-order: Root value -> Left -> Right.\n3. Post-order: Left -> Right -> Root."
    },
    "visual": {
      "type": "TREE",
      "category": "TREES",
      "title": "In-Order Traversal (L-N-R)",
      "input": [
        1,
        null,
        2,
        3
      ],
      "description": "Tree: 1 -> right 2 -> left 3. In-order traversal: Left first (none), Root (1), Left (3), Root (2) -> [1, 3, 2].",
      "description_hi": "Left-Root-Right sequence mein visit karke [1, 3, 2] output milta hai.",
      "steps": [
        {
          "activeNode": 1,
          "path": [
            1
          ],
          "explanation": "Visit 1 (root)",
          "explanation_hi": "Root 1 visit hua"
        },
        {
          "activeNode": 3,
          "path": [
            1,
            2,
            3
          ],
          "explanation": "Visit 3 (left child of 2)",
          "explanation_hi": "Node 3 visit hua"
        },
        {
          "activeNode": 2,
          "path": [
            1,
            2
          ],
          "explanation": "Visit 2 (root of right subtree). Result = [1, 3, 2]",
          "explanation_hi": "Node 2 visit hua. Complete!"
        }
      ],
      "result": [
        1,
        3,
        2
      ]
    },
    "code": "function inorderTraversal(root) {\n  const res = [];\n  function dfs(node) {\n    if (!node) return;\n    dfs(node.left);\n    res.push(node.val);\n    dfs(node.right);\n  }\n  dfs(root);\n  return res;\n}\n\nconsole.log(inorderTraversal({ val: 1, left: null, right: { val: 2, left: { val: 3 } } })); // [1, 3, 2]",
    "searchSignals": {
      "tags": [
        "trees",
        "traversal",
        "inorder"
      ],
      "keywords": [
        "inorder traversal",
        "preorder traversal",
        "postorder traversal"
      ],
      "companies": [
        "Microsoft",
        "Amazon",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Binary Tree Inorder Traversal",
        "difficulty": "Easy",
        "slug": "binary-tree-inorder-traversal",
        "url": "https://leetcode.com/problems/binary-tree-inorder-traversal/"
      },
      {
        "title": "Binary Tree Preorder Traversal",
        "difficulty": "Easy",
        "slug": "binary-tree-preorder-traversal",
        "url": "https://leetcode.com/problems/binary-tree-preorder-traversal/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Tree Traversals",
        "url": "https://leetcode.com/problems/binary-tree-inorder-traversal/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Diameter": {
    "slug": "trees-diameter",
    "name": "Diameter",
    "topic": "Trees",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Diameter of Binary Tree (Post-Order Bottom-Up)",
      "overview": "Calculating the length of the longest path between any two nodes in a tree, which may or may not pass through the root.",
      "whatItIs": "Post-order DFS returns the depth of each subtree (`1 + max(left, right)`) while globally maximizing `leftDepth + rightDepth`.",
      "whyItWorks": "The longest path turning at any given node has length equal to the maximum left branch depth plus maximum right branch depth.",
      "whenToUse": "Diameter of Binary Tree, Binary Tree Maximum Path Sum.",
      "recognitionSignals": [
        "Longest path between any two nodes",
        "Path does not need to pass through root"
      ],
      "commonMistakes": [
        "Assuming the longest path must always pass through the root node",
        "Returning diameter instead of height from recursive helper function"
      ],
      "stepLogic": "1. Initialize maxDiameter = 0.\n2. In dfs(node):\n   a. If (!node) return 0\n   b. leftH = dfs(node.left), rightH = dfs(node.right)\n   c. maxDiameter = max(maxDiameter, leftH + rightH)\n   d. return 1 + max(leftH, rightH)\n3. Return maxDiameter."
    },
    "hi": {
      "title": "Diameter of Binary Tree",
      "overview": "Tree ke kisi bhi do nodes ke beech ka longest path length calculate karna.",
      "whatItIs": "Post-order traversal se har node par left subtree height aur right subtree height ka sum calculate karke global max track karna.",
      "whyItWorks": "Kisi bhi node se turn hone wala longest path hamesha left depth + right depth hota hai.",
      "whenToUse": "Diameter of Binary Tree, Max Path Sum problems mein.",
      "recognitionSignals": [
        "Longest path between any two nodes",
        "Path root se guzar bhi sakta hai aur nahi bhi"
      ],
      "commonMistakes": [
        "Recursion function se diameter return kar dena (height return karni hoti hai)"
      ],
      "stepLogic": "1. maxDiameter = 0 rakhein.\n2. DFS mein left aur right subtree height nikaalein.\n3. maxDiameter = max(maxDiameter, leftH + rightH) update karein.\n4. 1 + max(leftH, rightH) return karein."
    },
    "visual": {
      "type": "TREE",
      "category": "TREES",
      "title": "Longest Path Through Subtree",
      "input": [
        1,
        2,
        3,
        4,
        5
      ],
      "description": "Longest path is 4 -> 2 -> 1 -> 3 or 5 -> 2 -> 1 -> 3. Length = 3 edges (4 nodes).",
      "description_hi": "Path 4 -> 2 -> 1 -> 3 total 3 edges lambi hai.",
      "steps": [
        {
          "activeNode": 2,
          "path": [
            4,
            2,
            5
          ],
          "explanation": "At node 2: leftH=1, rightH=1. Local diameter = 2",
          "explanation_hi": "Node 2 par local path length 2 hai"
        },
        {
          "activeNode": 1,
          "path": [
            4,
            2,
            1,
            3
          ],
          "explanation": "At root 1: leftH=2, rightH=1. Diameter = 2 + 1 = 3 edges!",
          "explanation_hi": "Root 1 par total diameter = 2 + 1 = 3 edges!"
        }
      ],
      "result": 3
    },
    "code": "function diameterOfBinaryTree(root) {\n  let diameter = 0;\n  \n  function getDepth(node) {\n    if (!node) return 0;\n    const left = getDepth(node.left);\n    const right = getDepth(node.right);\n    diameter = Math.max(diameter, left + right);\n    return 1 + Math.max(left, right);\n  }\n  \n  getDepth(root);\n  return diameter;\n}",
    "searchSignals": {
      "tags": [
        "trees",
        "dfs",
        "diameter"
      ],
      "keywords": [
        "diameter of binary tree",
        "longest path in tree",
        "max path tree"
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
        "title": "Diameter of Binary Tree",
        "difficulty": "Easy",
        "slug": "diameter-of-binary-tree",
        "url": "https://leetcode.com/problems/diameter-of-binary-tree/"
      },
      {
        "title": "Binary Tree Maximum Path Sum",
        "difficulty": "Hard",
        "slug": "binary-tree-maximum-path-sum",
        "url": "https://leetcode.com/problems/binary-tree-maximum-path-sum/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Diameter Editorial",
        "url": "https://leetcode.com/problems/diameter-of-binary-tree/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "LCA": {
    "slug": "trees-lca",
    "name": "LCA",
    "topic": "Trees",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Lowest Common Ancestor (LCA)",
      "overview": "Finding the lowest shared ancestor node of two given nodes p and q in a tree.",
      "whatItIs": "Post-order recursion: if root matches p or q, return root. If both left and right recursive calls return non-null, root is their split point (LCA).",
      "whyItWorks": "If p and q lie in different subtrees of a node, that node must be their lowest common ancestor.",
      "whenToUse": "Lowest Common Ancestor of Binary Tree, LCA of BST, Distance between two nodes in binary tree.",
      "recognitionSignals": [
        "Find lowest shared ancestor of two nodes",
        "Where two paths from root diverge"
      ],
      "commonMistakes": [
        "Assuming values are ordered like in a BST when problem is on general Binary Tree",
        "Searching for values instead of comparing node references"
      ],
      "stepLogic": "1. If (!root || root === p || root === q) return root.\n2. left = lca(root.left, p, q), right = lca(root.right, p, q).\n3. If (left && right) return root (split point).\n4. Return left || right."
    },
    "hi": {
      "title": "Lowest Common Ancestor (LCA)",
      "overview": "Do nodes p aur q ka sabse gehra common ancestor node dhoondhna.",
      "whatItIs": "Agar root p ya q ke barabar ho toh root return karein. Agar left aur right dono subtrees se non-null mile, toh current root hi LCA hai.",
      "whyItWorks": "Jis node par p aur q ke paths alag-alag branches mein divert hote hain, wahi unka lowest common ancestor hota hai.",
      "whenToUse": "LCA of Binary Tree ya BST problems mein.",
      "recognitionSignals": [
        "Lowest common ancestor",
        "Paths divergence point"
      ],
      "commonMistakes": [
        "Binary tree mein BST ka property (root.val > p.val) laga dena"
      ],
      "stepLogic": "1. Agar root null, p, ya q ho toh root return karein.\n2. Left aur Right par LCA call karein.\n3. Agar dono se node mile toh current root return karein.\n4. Warna jo non-null ho wo return karein."
    },
    "visual": {
      "type": "TREE",
      "category": "TREES",
      "title": "LCA Subtree Split Point",
      "input": {
        "root": [
          3,
          5,
          1,
          6,
          2,
          0,
          8
        ],
        "p": 5,
        "q": 1
      },
      "description": "p (5) is in left subtree, q (1) is in right subtree. Root 3 is the lowest common ancestor.",
      "description_hi": "5 left branch mein hai aur 1 right branch mein hai. Root 3 LCA hai.",
      "steps": [
        {
          "activeNode": 5,
          "path": [
            3,
            5
          ],
          "explanation": "Found p (5) in left subtree",
          "explanation_hi": "Left subtree mein p=5 mila"
        },
        {
          "activeNode": 1,
          "path": [
            3,
            1
          ],
          "explanation": "Found q (1) in right subtree",
          "explanation_hi": "Right subtree mein q=1 mila"
        },
        {
          "activeNode": 3,
          "path": [
            3
          ],
          "explanation": "Both left and right returned non-null -> Node 3 is LCA!",
          "explanation_hi": "Dono subtrees se match mila -> Node 3 LCA hai!"
        }
      ],
      "result": 3
    },
    "code": "function lowestCommonAncestor(root, p, q) {\n  if (!root || root === p || root === q) return root;\n  const left = lowestCommonAncestor(root.left, p, q);\n  const right = lowestCommonAncestor(root.right, p, q);\n  if (left && right) return root;\n  return left || right;\n}",
    "searchSignals": {
      "tags": [
        "trees",
        "dfs",
        "lca"
      ],
      "keywords": [
        "lowest common ancestor",
        "lca binary tree",
        "common ancestor"
      ],
      "companies": [
        "Amazon",
        "Facebook",
        "Microsoft",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Lowest Common Ancestor of a Binary Tree",
        "difficulty": "Medium",
        "slug": "lowest-common-ancestor-of-a-binary-tree",
        "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/"
      },
      {
        "title": "Lowest Common Ancestor of a Binary Search Tree",
        "difficulty": "Easy",
        "slug": "lowest-common-ancestor-of-a-binary-search-tree",
        "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode LCA Editorial",
        "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Tree DP": {
    "slug": "trees-tree-dp",
    "name": "Tree DP",
    "topic": "Trees",
    "difficulty": "Hard",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "interviewFrequency": "High",
    "en": {
      "title": "Tree Dynamic Programming (House Robber III)",
      "overview": "Solving state optimization problems on trees by returning state vectors from bottom-up post-order DFS.",
      "whatItIs": "Each node computes a state tuple: `[robThisNode, notRobThisNode]`. Parent combines states of left and right children.",
      "whyItWorks": "Subtree optimal substructure: decision at parent depends only on optimal decisions of its immediate children.",
      "whenToUse": "House Robber III, Binary Tree Cameras, Maximum Independent Set on Trees.",
      "recognitionSignals": [
        "Choose or don't choose nodes on tree with adjacent constraints",
        "Minimize cameras to cover all nodes"
      ],
      "commonMistakes": [
        "Recomputing subproblems exponentially without passing state tuple in return value"
      ],
      "stepLogic": "1. In dfs(node):\n   a. If (!node) return [0, 0] (rob, notRob)\n   b. left = dfs(node.left), right = dfs(node.right)\n   c. rob = node.val + left[1] + right[1]\n   d. notRob = max(left[0], left[1]) + max(right[0], right[1])\n   e. return [rob, notRob]\n2. Return max(dfs(root)[0], dfs(root)[1])."
    },
    "hi": {
      "title": "Tree Dynamic Programming",
      "overview": "Tree par DP lagana jahan har node bottom-up post-order mein state tuple `[include, exclude]` return karta hai.",
      "whatItIs": "Agar current node choose kiya toh children choose nahi kar sakte; agar nahi kiya toh children se best le sakte hain.",
      "whyItWorks": "Subtree problems independent hoti hain aur parent sirf children ke computed states se O(1) mein decide kar leta hai.",
      "whenToUse": "House Robber III, Binary Tree Cameras problems mein.",
      "recognitionSignals": [
        "Adjacent nodes choose na karne ki condition",
        "Tree state optimization"
      ],
      "commonMistakes": [
        "Recursion mein overlapping calls karke time exponential O(2^N) bana dena"
      ],
      "stepLogic": "1. dfs se `[rob, notRob]` return karein.\n2. rob = node.val + left.notRob + right.notRob.\n3. notRob = max(left) + max(right).\n4. Root par max(rob, notRob) return karein."
    },
    "visual": {
      "type": "TREE",
      "category": "TREES",
      "title": "Tree DP State Decisions",
      "input": [
        3,
        2,
        3,
        null,
        3,
        null,
        1
      ],
      "description": "Node state: [rob, notRob]. Root 3: rob = 3 + 3 + 1 = 7. Max loot = 7.",
      "description_hi": "Root ko rob karne par 3 + 3 + 1 = 7 milta hai jo maximum hai.",
      "steps": [
        {
          "activeNode": 2,
          "path": [
            3,
            2
          ],
          "explanation": "Node 2 states: [rob=2, notRob=3]",
          "explanation_hi": "Node 2 ka state compute hua"
        },
        {
          "activeNode": 3,
          "path": [
            3
          ],
          "explanation": "Root 3: rob = 3 + 3 + 1 = 7, notRob = 7. Max = 7!",
          "explanation_hi": "Root 3 par optimal decision = 7!"
        }
      ],
      "result": 7
    },
    "code": "function rob(root) {\n  function dfs(node) {\n    if (!node) return [0, 0]; // [rob, notRob]\n    const left = dfs(node.left);\n    const right = dfs(node.right);\n    \n    const robCurr = node.val + left[1] + right[1];\n    const notRobCurr = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);\n    return [robCurr, notRobCurr];\n  }\n  const res = dfs(root);\n  return Math.max(res[0], res[1]);\n}",
    "searchSignals": {
      "tags": [
        "trees",
        "dp",
        "tree-dp"
      ],
      "keywords": [
        "house robber iii",
        "tree dynamic programming",
        "tree cameras"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Uber"
      ]
    },
    "relatedCanonical": [
      {
        "title": "House Robber III",
        "difficulty": "Medium",
        "slug": "house-robber-iii",
        "url": "https://leetcode.com/problems/house-robber-iii/"
      },
      {
        "title": "Binary Tree Cameras",
        "difficulty": "Hard",
        "slug": "binary-tree-cameras",
        "url": "https://leetcode.com/problems/binary-tree-cameras/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode House Robber III Editorial",
        "url": "https://leetcode.com/problems/house-robber-iii/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Subtree": {
    "slug": "trees-subtree",
    "name": "Subtree",
    "topic": "Trees",
    "difficulty": "Easy",
    "timeComplexity": "O(N * M)",
    "spaceComplexity": "O(H)",
    "interviewFrequency": "High",
    "en": {
      "title": "Subtree of Another Tree (Tree Matching)",
      "overview": "Determining if a binary tree contains a subtree with identical structure and node values to a target tree.",
      "whatItIs": "DFS traverses main tree; at each node, runs `isSameTree(root, subRoot)`. Can also be solved in O(N + M) using tree serialization + KMP.",
      "whyItWorks": "A tree T contains S if and only if there exists a node in T where the subtree rooted at that node is isomorphic to S.",
      "whenToUse": "Subtree of Another Tree, Same Tree, Symmetric Tree.",
      "recognitionSignals": [
        "Check if tree is identical to another subtree",
        "Compare tree topologies and values"
      ],
      "commonMistakes": [
        "Terminating search early when one node fails instead of checking other nodes in tree",
        "Handling null pointer mismatches in `isSameTree`"
      ],
      "stepLogic": "1. If (!root) return false.\n2. If isSameTree(root, subRoot) return true.\n3. Return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot)."
    },
    "hi": {
      "title": "Subtree of Another Tree",
      "overview": "Check karna ki kya tree ke andar koi aisa subtree maujood hai jo doosre tree ke bilkul identical ho.",
      "whatItIs": "Har node par jakar `isSameTree` match check karna.",
      "whyItWorks": "Agar kisi bhi node par subtree ki shape aur values exact match ho jati hain toh result true hota hai.",
      "whenToUse": "Subtree of Another Tree, Same Tree problems mein.",
      "recognitionSignals": [
        "Subtree verification",
        "Isomorphic tree check"
      ],
      "commonMistakes": [
        "Ek match fail hone par pura search abort kar dena"
      ],
      "stepLogic": "1. Agar root null hai toh false return karein.\n2. Agar isSameTree true hai toh true return karein.\n3. Left ya Right subtree par search continue karein."
    },
    "visual": {
      "type": "TREE",
      "category": "TREES",
      "title": "Subtree Isomorphism Match",
      "input": {
        "root": [
          3,
          4,
          5,
          1,
          2
        ],
        "subRoot": [
          4,
          1,
          2
        ]
      },
      "description": "Subtree rooted at node 4 matches subRoot [4, 1, 2] completely -> Return true.",
      "description_hi": "Node 4 par rooted subtree subRoot se 100% match hota hai.",
      "steps": [
        {
          "activeNode": 3,
          "path": [
            3
          ],
          "explanation": "Check root 3: does not match subRoot 4",
          "explanation_hi": "Root 3 match nahi hua"
        },
        {
          "activeNode": 4,
          "path": [
            3,
            4
          ],
          "explanation": "Check node 4: Left (1) matches 1, Right (2) matches 2! Subtree found!",
          "explanation_hi": "Node 4 par exact match mil gaya!"
        }
      ],
      "result": true
    },
    "code": "function isSubtree(root, subRoot) {\n  if (!root) return false;\n  if (isSame(root, subRoot)) return true;\n  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);\n}\n\nfunction isSame(s, t) {\n  if (!s && !t) return true;\n  if (!s || !t || s.val !== t.val) return false;\n  return isSame(s.left, t.left) && isSame(s.right, t.right);\n}",
    "searchSignals": {
      "tags": [
        "trees",
        "dfs",
        "subtree"
      ],
      "keywords": [
        "subtree of another tree",
        "same tree",
        "isomorphic trees"
      ],
      "companies": [
        "Amazon",
        "Facebook",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Subtree of Another Tree",
        "difficulty": "Easy",
        "slug": "subtree-of-another-tree",
        "url": "https://leetcode.com/problems/subtree-of-another-tree/"
      },
      {
        "title": "Same Tree",
        "difficulty": "Easy",
        "slug": "same-tree",
        "url": "https://leetcode.com/problems/same-tree/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Subtree Editorial",
        "url": "https://leetcode.com/problems/subtree-of-another-tree/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Euler Tour": {
    "slug": "trees-euler-tour",
    "name": "Euler Tour",
    "topic": "Trees",
    "difficulty": "Hard",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Euler Tour Technique (Tree Flattening into Array Intervals)",
      "overview": "Flattening a tree into a linear array using entry and exit DFS timestamps, transforming subtree queries into contiguous range queries.",
      "whatItIs": "Record `tin[u]` when entering node u, and `tout[u]` when leaving node u. Any node in subtree(u) has entry timestamp in `[tin[u]..tout[u]]`.",
      "whyItWorks": "DFS traversal orders nodes sequentially; all descendants of u are visited strictly between u's start and end times.",
      "whenToUse": "Subtree sum updates, checking if u is ancestor of v in O(1), subtree range queries with Segment Tree / Fenwick Tree.",
      "recognitionSignals": [
        "Subtree queries transformed to 1D array ranges",
        "O(1) ancestor check: `tin[u] <= tin[v] && tout[u] >= tout[v]`"
      ],
      "commonMistakes": [
        "Forgetting to increment timer on exit or mixing up pre-order vs post-order timer tracking"
      ],
      "stepLogic": "1. Maintain global timer = 0.\n2. In dfs(u):\n   a. tin[u] = ++timer\n   b. Recurse for all children v\n   c. tout[u] = timer\n3. Subtree of u corresponds to array interval [tin[u]..tout[u]]."
    },
    "hi": {
      "title": "Euler Tour Technique",
      "overview": "Tree ko linear array intervals mein flatten karna DFS entry aur exit time ke zariye.",
      "whatItIs": "Har node ke entry `tin` aur exit `tout` timestamps record karna jisse pura subtree ek contiguous interval `[tin..tout]` ban jata hai.",
      "whyItWorks": "DFS mein descendants hamesha parent ke start aur end time ke beech visit hote hain.",
      "whenToUse": "Subtree update/query Segment Tree ke sath karne aur O(1) Ancestor check mein.",
      "recognitionSignals": [
        "Subtree queries ko range queries banana",
        "O(1) ancestor verification"
      ],
      "commonMistakes": [
        "Timer update order mein off-by-one"
      ],
      "stepLogic": "1. Global timer = 0.\n2. tin[u] = ++timer.\n3. Children visit karein.\n4. tout[u] = timer. Subtree range [tin[u]..tout[u]] ban gayi."
    },
    "visual": {
      "type": "TREE",
      "category": "TREES",
      "title": "Euler Tour Entry-Exit Flattening",
      "input": "Tree with root 1, children 2 and 3",
      "description": "Node 1: [1..6], Node 2: [2..3], Node 3: [4..5]. Subtree queries become array range queries.",
      "description_hi": "Har node ka subtree ek linear interval ban jata hai.",
      "steps": [
        {
          "activeNode": 1,
          "path": [
            1
          ],
          "explanation": "Enter 1: tin[1] = 1",
          "explanation_hi": "1 mein enter hue"
        },
        {
          "activeNode": 2,
          "path": [
            1,
            2
          ],
          "explanation": "Subtree 2: [tin=2, tout=3]",
          "explanation_hi": "Node 2 interval [2..3]"
        },
        {
          "activeNode": 3,
          "path": [
            1,
            3
          ],
          "explanation": "Subtree 3: [tin=4, tout=5]. Exit 1: tout[1] = 5.",
          "explanation_hi": "Node 3 interval [4..5]. Complete!"
        }
      ],
      "result": {
        "1": [
          1,
          5
        ],
        "2": [
          2,
          3
        ],
        "3": [
          4,
          5
        ]
      }
    },
    "code": "class EulerTour {\n  constructor(n, adj) {\n    this.timer = 0;\n    this.tin = new Array(n + 1).fill(0);\n    this.tout = new Array(n + 1).fill(0);\n    this.dfs(1, 0, adj);\n  }\n  \n  dfs(u, p, adj) {\n    this.tin[u] = ++this.timer;\n    for (const v of adj[u] || []) {\n      if (v !== p) this.dfs(v, u, adj);\n    }\n    this.tout[u] = this.timer;\n  }\n  \n  isAncestor(u, v) {\n    return this.tin[u] <= this.tin[v] && this.tout[u] >= this.tout[v];\n  }\n}",
    "searchSignals": {
      "tags": [
        "trees",
        "euler-tour",
        "dfs"
      ],
      "keywords": [
        "euler tour technique",
        "tree flattening",
        "tin tout timestamps"
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
        "name": "CP-Algorithms Euler Tour",
        "url": "https://cp-algorithms.com/graph/euler_path.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Binary Lifting": {
    "slug": "trees-binary-lifting",
    "name": "Binary Lifting",
    "topic": "Trees",
    "difficulty": "Hard",
    "timeComplexity": "O(N log N) precompute, O(log N) per query",
    "spaceComplexity": "O(N log N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Binary Lifting (LCA in O(log N))",
      "overview": "Precomputing 2^k-th ancestors (`up[node][k]`) to answer K-th ancestor and LCA queries in O(log N) time.",
      "whatItIs": "`up[u][i] = up[up[u][i-1]][i-1]` allows jumping 2^i steps by taking two jumps of 2^(i-1) steps.",
      "whyItWorks": "Any positive integer distance K can be decomposed into powers of 2 (binary representation).",
      "whenToUse": "Kth Ancestor of a Tree Node, Lowest Common Ancestor on massive dynamic trees, distance queries between nodes in trees.",
      "recognitionSignals": [
        "Query Kth ancestor of a node in O(log N)",
        "Multiple LCA queries on static tree (up to 10^5 queries)"
      ],
      "commonMistakes": [
        "Array bounds on logN jumps (`Math.ceil(Math.log2(N))`)",
        "Not bringing both nodes to the same depth before jumping together"
      ],
      "stepLogic": "1. Compute depths and up[u][0] (direct parent) via DFS.\n2. Precompute up[u][k] = up[up[u][k-1]][k-1].\n3. To find LCA(u, v): equalize depths by jumping the deeper node.\n4. If u === v return u.\n5. Jump both nodes by decreasing powers of 2 while up[u][k] !== up[v][k].\n6. Return up[u][0]."
    },
    "hi": {
      "title": "Binary Lifting",
      "overview": "Har node ke 2^k-th ancestors ko precompute karke K-th ancestor aur LCA queries ko O(log N) mein answer karna.",
      "whatItIs": "Binary powers (1, 2, 4, 8, 16...) mein jumps laga kar kisi bhi ancestor tak pahunchna.",
      "whyItWorks": "Kisi bhi distance K ko binary bits mein tod kar logarithmic jumps se traverse kiya ja sakta hai.",
      "whenToUse": "Kth Ancestor of a Tree Node, High performance LCA queries mein.",
      "recognitionSignals": [
        "K-th ancestor query in O(log N)",
        "10^5 LCA queries"
      ],
      "commonMistakes": [
        "Dono nodes ko same depth par laane se pehle parallel jumps lagana"
      ],
      "stepLogic": "1. DFS se direct parents aur depths nikaalein.\n2. up[u][k] table precompute karein.\n3. Deeper node ko equalize karein.\n4. Decreasing powers of 2 jumps lagakar LCA nikaalein."
    },
    "visual": {
      "type": "TREE",
      "category": "TREES",
      "title": "Powers of Two Ancestor Jumps",
      "input": "Node at depth 7 wants 5th ancestor (5 = 4 + 1)",
      "description": "Jumps 2^2 = 4 steps up, then 2^0 = 1 step up. Reaches 5th ancestor in 2 jumps instead of 5.",
      "description_hi": "5th ancestor ke liye 4 steps + 1 step jump laga kar O(log N) mein pahunchein.",
      "steps": [
        {
          "activeNode": 7,
          "path": [
            7
          ],
          "explanation": "Start at depth 7. Want k=5 (binary: 101_2)",
          "explanation_hi": "Start depth 7"
        },
        {
          "activeNode": 3,
          "path": [
            7,
            3
          ],
          "explanation": "Jump 2^2 = 4 steps up -> lands at node at depth 3",
          "explanation_hi": "4 steps jump kiya"
        },
        {
          "activeNode": 2,
          "path": [
            7,
            3,
            2
          ],
          "explanation": "Jump 2^0 = 1 step up -> lands at 5th ancestor (depth 2) in O(log N)!",
          "explanation_hi": "1 step jump kiya -> 5th ancestor mil gaya!"
        }
      ],
      "result": 2
    },
    "code": "class TreeAncestor {\n  constructor(n, parent) {\n    this.LOG = Math.ceil(Math.log2(n)) + 1;\n    this.up = Array.from({ length: n }, () => new Array(this.LOG).fill(-1));\n    \n    for (let i = 0; i < n; i++) {\n      this.up[i][0] = parent[i];\n    }\n    \n    for (let j = 1; j < this.LOG; j++) {\n      for (let i = 0; i < n; i++) {\n        if (this.up[i][j - 1] !== -1) {\n          this.up[i][j] = this.up[this.up[i][j - 1]][j - 1];\n        }\n      }\n    }\n  }\n  \n  getKthAncestor(node, k) {\n    for (let j = 0; j < this.LOG; j++) {\n      if ((k >> j) & 1) {\n        node = this.up[node][j];\n        if (node === -1) break;\n      }\n    }\n    return node;\n  }\n}",
    "searchSignals": {
      "tags": [
        "trees",
        "binary-lifting",
        "lca"
      ],
      "keywords": [
        "binary lifting",
        "kth ancestor",
        "lca binary lifting"
      ],
      "companies": [
        "Google",
        "Directi",
        "Uber"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Kth Ancestor of a Tree Node",
        "difficulty": "Hard",
        "slug": "kth-ancestor-of-a-tree-node",
        "url": "https://leetcode.com/problems/kth-ancestor-of-a-tree-node/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Binary Lifting LCA",
        "url": "https://cp-algorithms.com/graph/lca_binary_lifting.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Serialization": {
    "slug": "trees-serialization",
    "name": "Serialization",
    "topic": "Trees",
    "difficulty": "Hard",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Serialize and Deserialize Binary Tree",
      "overview": "Converting a binary tree into a delimited string representation and reconstructing the exact identical tree from the string.",
      "whatItIs": "Pre-order traversal recording values with sentinel null tokens (e.g., `\"1,2,null,null,3,4,null,null,5,null,null\"`). Deserialization consumes tokens sequentially.",
      "whyItWorks": "Recording null pointers uniquely identifies the tree topology without needing both in-order and pre-order traversal arrays.",
      "whenToUse": "Serialize and Deserialize Binary Tree, storing tree states to disk/network, cloning trees.",
      "recognitionSignals": [
        "Encode tree to string and decode string back to original tree",
        "Null pointer tokenization"
      ],
      "commonMistakes": [
        "Parsing multi-digit or negative numbers without proper delimiters (e.g. commas)",
        "Using global state that leaks between test cases"
      ],
      "stepLogic": "1. serialize(root): DFS pre-order; if (!node) append \"null,\"; append val + \",\"; recurse left and right.\n2. deserialize(data): split by comma into token queue; in buildTree(): pop token; if \"null\" return null; create TreeNode(token); node.left = buildTree(); node.right = buildTree(); return node."
    },
    "hi": {
      "title": "Serialize and Deserialize Binary Tree",
      "overview": "Binary tree ko string mein encode karna aur usi string se wapas identical tree decode karna.",
      "whatItIs": "Pre-order traversal ke dauran null pointers ko bhi \"null\" token ke roop mein record karna.",
      "whyItWorks": "Null values explicitly save karne se tree ki exact shape bina kisi ambiguity ke capture ho jati hai.",
      "whenToUse": "Tree ko database/network par save karne aur restore karne ke liye.",
      "recognitionSignals": [
        "Encode tree to string and decode back",
        "Tokenized tree structure"
      ],
      "commonMistakes": [
        "Negative numbers ya multi-digit numbers ko commas ke bina jodhna"
      ],
      "stepLogic": "1. Serialize: Pre-order traversal mein node.val aur null tokens ko comma se jodein.\n2. Deserialize: String ko split karke queue banayein.\n3. Recursively tokens pop karke tree rebuild karein."
    },
    "visual": {
      "type": "TREE",
      "category": "TREES",
      "title": "Pre-Order Serialization String",
      "input": [
        1,
        2,
        3,
        null,
        null,
        4,
        5
      ],
      "description": "String output: \"1,2,null,null,3,4,null,null,5,null,null\". Reconstructs exact tree topology.",
      "description_hi": "Tokens se tree ka exact structure recover hota hai.",
      "steps": [
        {
          "activeNode": 1,
          "path": [
            1
          ],
          "explanation": "Serialize root 1 -> \"1,\"",
          "explanation_hi": "Root 1 serialize hua"
        },
        {
          "activeNode": 2,
          "path": [
            1,
            2
          ],
          "explanation": "Serialize node 2 with null children -> \"1,2,null,null,\"",
          "explanation_hi": "Node 2 with nulls serialize hua"
        },
        {
          "activeNode": 3,
          "path": [
            1,
            3
          ],
          "explanation": "Reconstruction reproduces original tree identically!",
          "explanation_hi": "Exact tree recover ho gaya!"
        }
      ],
      "result": "1,2,null,null,3,4,null,null,5,null,null"
    },
    "code": "function serialize(root) {\n  const parts = [];\n  function dfs(node) {\n    if (!node) {\n      parts.push(\"null\");\n      return;\n    }\n    parts.push(String(node.val));\n    dfs(node.left);\n    dfs(node.right);\n  }\n  dfs(root);\n  return parts.join(\",\");\n}\n\nfunction deserialize(data) {\n  const tokens = data.split(\",\");\n  let cursor = 0;\n  \n  function build() {\n    if (cursor >= tokens.length) return null;\n    const token = tokens[cursor++];\n    if (token === \"null\") return null;\n    const node = { val: Number(token), left: null, right: null };\n    node.left = build();\n    node.right = build();\n    return node;\n  }\n  return build();\n}",
    "searchSignals": {
      "tags": [
        "trees",
        "design",
        "serialization"
      ],
      "keywords": [
        "serialize deserialize binary tree",
        "encode tree string"
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
        "title": "Serialize and Deserialize Binary Tree",
        "difficulty": "Hard",
        "slug": "serialize-and-deserialize-binary-tree",
        "url": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"
      },
      {
        "title": "Serialize and Deserialize BST",
        "difficulty": "Medium",
        "slug": "serialize-and-deserialize-bst",
        "url": "https://leetcode.com/problems/serialize-and-deserialize-bst/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Serialize Tree Editorial",
        "url": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Morris Traversal": {
    "slug": "trees-morris-traversal",
    "name": "Morris Traversal",
    "topic": "Trees",
    "difficulty": "Hard",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Morris In-Order Traversal (Threaded Binary Trees)",
      "overview": "In-order tree traversal in strictly O(N) time and O(1) auxiliary space without recursion or stack.",
      "whatItIs": "Creates temporary predecessor threads (`pred.right = curr`) pointing back to the current node, then removes threads during second visit.",
      "whyItWorks": "The in-order predecessor is the rightmost node in the left subtree. Threading allows walking back up the tree in O(1) space.",
      "whenToUse": "When auxiliary space must be strictly O(1) (cannot use stack or recursion call stack).",
      "recognitionSignals": [
        "O(1) extra space binary tree in-order traversal",
        "Threaded binary tree modifications"
      ],
      "commonMistakes": [
        "Forgetting to remove temporary predecessor threads, corrupting the tree structure",
        "Infinite loops if predecessor check `pred.right !== curr` is missing"
      ],
      "stepLogic": "1. curr = root.\n2. While curr !== null:\n   a. If (!curr.left): visit curr; curr = curr.right\n   b. Else: find in-order predecessor (rightmost node in curr.left)\n   c. If (pred.right === null): pred.right = curr (thread); curr = curr.left\n   d. Else: pred.right = null (restore); visit curr; curr = curr.right."
    },
    "hi": {
      "title": "Morris Traversal",
      "overview": "Bina kisi recursion ya stack ke strictly O(1) auxiliary memory mein In-order traversal karna.",
      "whatItIs": "Left subtree ke rightmost node (predecessor) se temporary thread `pred.right = curr` bana kar wapas aana.",
      "whyItWorks": "Temporary pointer back to parent banane se bina stack ke tree mein upar lautna possible ho jata hai.",
      "whenToUse": "Strict O(1) memory constraint wale tree traversal questions mein.",
      "recognitionSignals": [
        "O(1) auxiliary space traversal",
        "Threaded binary tree"
      ],
      "commonMistakes": [
        "Temporary thread ko remove karna bhool jana jisse tree corrupt ho jaye"
      ],
      "stepLogic": "1. curr = root.\n2. curr.left na ho toh visit karein aur right jayein.\n3. Predecessor dhoondein: agar pred.right null hai toh thread banayein aur left jayein; agar thread pehle se hai toh null karke visit karein aur right jayein."
    },
    "visual": {
      "type": "TREE",
      "category": "TREES",
      "title": "Morris Predecessor Threading",
      "input": [
        2,
        1,
        3
      ],
      "description": "Node 1 links thread `1.right = 2`. Visits 1, unwinds thread, visits 2, visits 3. Space = O(1)!",
      "description_hi": "1 se 2 par temporary link banta hai aur traversal ke baad safely delete ho jata hai.",
      "steps": [
        {
          "activeNode": 2,
          "path": [
            2,
            1
          ],
          "explanation": "Find predecessor of 2: node 1. Create thread 1.right = 2",
          "explanation_hi": "Predecessor 1 par thread link banaya"
        },
        {
          "activeNode": 1,
          "path": [
            1
          ],
          "explanation": "Visit 1. Follow thread back to 2 in O(1) space",
          "explanation_hi": "1 visit hua, thread se 2 par pahunche"
        },
        {
          "activeNode": 2,
          "path": [
            2
          ],
          "explanation": "Remove thread. Visit 2. Proceed to 3 -> Result: [1, 2, 3]",
          "explanation_hi": "Thread remove kiya. Result = [1, 2, 3]"
        }
      ],
      "result": [
        1,
        2,
        3
      ]
    },
    "code": "function morrisInorder(root) {\n  const res = [];\n  let curr = root;\n  \n  while (curr) {\n    if (!curr.left) {\n      res.push(curr.val);\n      curr = curr.right;\n    } else {\n      let pred = curr.left;\n      while (pred.right && pred.right !== curr) {\n        pred = pred.right;\n      }\n      if (!pred.right) {\n        pred.right = curr; // Create thread\n        curr = curr.left;\n      } else {\n        pred.right = null; // Remove thread\n        res.push(curr.val);\n        curr = curr.right;\n      }\n    }\n  }\n  return res;\n}",
    "searchSignals": {
      "tags": [
        "trees",
        "morris-traversal",
        "inorder"
      ],
      "keywords": [
        "morris traversal",
        "threaded binary tree",
        "o1 space traversal"
      ],
      "companies": [
        "Microsoft",
        "Google",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Binary Tree Inorder Traversal",
        "difficulty": "Easy",
        "slug": "binary-tree-inorder-traversal",
        "url": "https://leetcode.com/problems/binary-tree-inorder-traversal/"
      },
      {
        "title": "Recover Binary Search Tree",
        "difficulty": "Medium",
        "slug": "recover-binary-search-tree",
        "url": "https://leetcode.com/problems/recover-binary-search-tree/"
      }
    ],
    "externalResources": [
      {
        "name": "GFG Morris Traversal",
        "url": "https://www.geeksforgeeks.org/inorder-tree-traversal-without-recursion-and-without-stack/",
        "type": "GFG"
      }
    ]
  },
  "Search": {
    "slug": "bst-search",
    "name": "Search",
    "topic": "BST",
    "difficulty": "Easy",
    "timeComplexity": "O(H) where H is height",
    "spaceComplexity": "O(1) iterative",
    "interviewFrequency": "High",
    "en": {
      "title": "BST Search (Binary Search Tree Property)",
      "overview": "Searching for target value in a Binary Search Tree by taking left branch if target < val or right branch if target > val.",
      "whatItIs": "In a BST, all nodes in left subtree have keys < root.val, and right subtree have keys > root.val.",
      "whyItWorks": "Guaranteed ordering eliminates half of the remaining candidate nodes at each step (logarithmic on balanced trees).",
      "whenToUse": "Search in a Binary Search Tree, range queries, BST lookup.",
      "recognitionSignals": [
        "Binary Search Tree property given",
        "Search for value in BST in O(H)"
      ],
      "commonMistakes": [
        "Using recursion and consuming O(H) stack space when a simple `while (root)` loop achieves O(1) space"
      ],
      "stepLogic": "1. While root !== null and root.val !== val:\n2. If val < root.val root = root.left.\n3. Else root = root.right.\n4. Return root."
    },
    "hi": {
      "title": "BST Search",
      "overview": "BST property ka use karke target value ko O(H) time mein search karna.",
      "whatItIs": "Agar target < root.val hai toh left branch mein jayein, warna right branch mein jayein.",
      "whyItWorks": "BST ordering guarantee karti hai ki chhote numbers left mein aur bade numbers right mein hote hain.",
      "whenToUse": "BST lookup questions mein.",
      "recognitionSignals": [
        "Search in Binary Search Tree"
      ],
      "commonMistakes": [
        "Recursion lagakar space waste karna jabki while loop se O(1) space mein ho jata hai"
      ],
      "stepLogic": "1. While root null na ho aur root.val !== val:\n2. target chhota ho toh root = root.left, warna root = root.right.\n3. Match milte hi node return karein."
    },
    "visual": {
      "type": "TREE",
      "category": "BST",
      "title": "BST Logarithmic Search Path",
      "input": {
        "root": [
          4,
          2,
          7,
          1,
          3
        ],
        "val": 2
      },
      "description": "Search for 2: Root is 4 -> 2 < 4 -> move to left child 2 -> Match!",
      "description_hi": "2 < 4 hone par left child 2 par jate hain, match mil gaya.",
      "steps": [
        {
          "activeNode": 4,
          "path": [
            4
          ],
          "explanation": "Root 4: 2 < 4 -> go left",
          "explanation_hi": "4 se left gaye"
        },
        {
          "activeNode": 2,
          "path": [
            4,
            2
          ],
          "explanation": "Node 2: val matches target! Return subtree.",
          "explanation_hi": "Node 2 target se match ho gaya!"
        }
      ],
      "result": [
        2,
        1,
        3
      ]
    },
    "code": "function searchBST(root, val) {\n  while (root && root.val !== val) {\n    root = val < root.val ? root.left : root.right;\n  }\n  return root;\n}",
    "searchSignals": {
      "tags": [
        "bst",
        "tree",
        "binary-search"
      ],
      "keywords": [
        "search bst",
        "binary search tree lookup"
      ],
      "companies": [
        "Amazon",
        "Microsoft",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Search in a Binary Search Tree",
        "difficulty": "Easy",
        "slug": "search-in-a-binary-search-tree",
        "url": "https://leetcode.com/problems/search-in-a-binary-search-tree/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode BST Search",
        "url": "https://leetcode.com/problems/search-in-a-binary-search-tree/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Insert": {
    "slug": "bst-insert",
    "name": "Insert",
    "topic": "BST",
    "difficulty": "Medium",
    "timeComplexity": "O(H)",
    "spaceComplexity": "O(1) iterative",
    "interviewFrequency": "High",
    "en": {
      "title": "Insert into a Binary Search Tree",
      "overview": "Inserting a new value into BST maintaining the binary search ordering invariant.",
      "whatItIs": "Walk down the tree comparing value: if val < curr.val go left, else go right, until finding an empty slot to attach the new node.",
      "whyItWorks": "A valid BST insertion can always be placed at a leaf position without needing to rebalance the existing nodes.",
      "whenToUse": "Insert into a Binary Search Tree, building BST from stream.",
      "recognitionSignals": [
        "Insert value into BST preserving BST property"
      ],
      "commonMistakes": [
        "Overcomplicating by trying to insert at internal nodes when leaf attachment is always valid"
      ],
      "stepLogic": "1. If (!root) return new TreeNode(val).\n2. curr = root.\n3. While true: if val < curr.val: if (!curr.left) { curr.left = new TreeNode(val); break; } curr = curr.left;\n   else: if (!curr.right) { curr.right = new TreeNode(val); break; } curr = curr.right;\n4. Return root."
    },
    "hi": {
      "title": "Insert into BST",
      "overview": "BST mein nayi value insert karna bina BST property violate kiye.",
      "whatItIs": "Value compare karte hue leaf tak jana aur jahan null slot mile wahan naya node attach karna.",
      "whyItWorks": "Leaf level par insert karne se purane kisi bhi node ko shift ya rebalance nahi karna padta.",
      "whenToUse": "Insert into a Binary Search Tree problem mein.",
      "recognitionSignals": [
        "Insert node into BST"
      ],
      "commonMistakes": [
        "Internal node restructure karne ki koshish karna jabki leaf insert safe rehta hai"
      ],
      "stepLogic": "1. Agar root null ho toh naya node root banayein.\n2. Compare karke left ya right branch follow karein.\n3. Null slot milte hi naya node link karein."
    },
    "visual": {
      "type": "TREE",
      "category": "BST",
      "title": "BST Leaf Insertion",
      "input": {
        "root": [
          4,
          2,
          7,
          1,
          3
        ],
        "val": 5
      },
      "description": "Insert 5: 5 > 4 (go right) -> 5 < 7 (go left) -> Attach 5 as left child of 7.",
      "description_hi": "5 > 4 (right) -> 5 < 7 (left) -> 7 ke left child par 5 attach hua.",
      "steps": [
        {
          "activeNode": 4,
          "path": [
            4
          ],
          "explanation": "5 > 4 -> go right to 7",
          "explanation_hi": "4 se right gaye"
        },
        {
          "activeNode": 7,
          "path": [
            4,
            7
          ],
          "explanation": "5 < 7 and 7.left is null -> Attach 5 as left child of 7!",
          "explanation_hi": "7.left null hai -> 5 link ho gaya!"
        }
      ],
      "result": [
        4,
        2,
        7,
        1,
        3,
        5
      ]
    },
    "code": "function insertIntoBST(root, val) {\n  const newNode = { val, left: null, right: null };\n  if (!root) return newNode;\n  let curr = root;\n  while (true) {\n    if (val < curr.val) {\n      if (!curr.left) {\n        curr.left = newNode;\n        break;\n      }\n      curr = curr.left;\n    } else {\n      if (!curr.right) {\n        curr.right = newNode;\n        break;\n      }\n      curr = curr.right;\n    }\n  }\n  return root;\n}",
    "searchSignals": {
      "tags": [
        "bst",
        "tree",
        "insertion"
      ],
      "keywords": [
        "insert into bst",
        "bst insert node"
      ],
      "companies": [
        "Amazon",
        "Microsoft",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Insert into a Binary Search Tree",
        "difficulty": "Medium",
        "slug": "insert-into-a-binary-search-tree",
        "url": "https://leetcode.com/problems/insert-into-a-binary-search-tree/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Insert BST Editorial",
        "url": "https://leetcode.com/problems/insert-into-a-binary-search-tree/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Delete": {
    "slug": "bst-delete",
    "name": "Delete",
    "topic": "BST",
    "difficulty": "Medium",
    "timeComplexity": "O(H)",
    "spaceComplexity": "O(H)",
    "interviewFrequency": "High",
    "en": {
      "title": "Delete Node in a BST (In-Order Successor Replacement)",
      "overview": "Removing a node from BST handling 3 cases: leaf (remove), 1 child (bypass), 2 children (replace with in-order successor).",
      "whatItIs": "For node with two children, find minimum node in its right subtree (in-order successor), overwrite current value with successor value, then delete successor from right subtree.",
      "whyItWorks": "The in-order successor has value strictly greater than all left descendants and strictly less than all other right descendants.",
      "whenToUse": "Delete Node in a BST.",
      "recognitionSignals": [
        "Remove key from BST maintaining BST order"
      ],
      "commonMistakes": [
        "Forgetting to recursively delete the successor from the right subtree after copying its value",
        "Losing pointer links when node has only 1 child"
      ],
      "stepLogic": "1. If (!root) return null.\n2. If (key < root.val) root.left = deleteNode(root.left, key).\n3. Else if (key > root.val) root.right = deleteNode(root.right, key).\n4. Else (found node):\n   a. If no left child return root.right\n   b. If no right child return root.left\n   c. Both children: successor = min(root.right); root.val = successor.val; root.right = deleteNode(root.right, successor.val).\n5. Return root."
    },
    "hi": {
      "title": "Delete Node in a BST",
      "overview": "BST se kisi node ko remove karna: 0 child (seedha delete), 1 child (bypass), 2 children (in-order successor se replace).",
      "whatItIs": "2 children hone par right subtree ke minimum node (in-order successor) se value swap karke successor ko delete karna.",
      "whyItWorks": "In-order successor left subtree se bada aur right subtree se chhota rehta hai, isliye BST property maintain rehti hai.",
      "whenToUse": "Delete Node in a BST problem mein.",
      "recognitionSignals": [
        "Delete node from BST"
      ],
      "commonMistakes": [
        "Successor copy karne ke baad use right subtree se delete karna bhool jana"
      ],
      "stepLogic": "1. Key search karein.\n2. 0 ya 1 child ho toh child return karein.\n3. 2 children ho toh right subtree ka min dhoondein, value copy karein aur right subtree se use delete karein."
    },
    "visual": {
      "type": "TREE",
      "category": "BST",
      "title": "In-Order Successor Replacement",
      "input": {
        "root": [
          5,
          3,
          6,
          2,
          4,
          null,
          7
        ],
        "key": 3
      },
      "description": "Delete 3 (has children 2 and 4): Successor is 4. Overwrite 3 with 4, delete leaf 4.",
      "description_hi": "Node 3 ko uske successor 4 se replace kiya aur leaf 4 delete kiya.",
      "steps": [
        {
          "activeNode": 3,
          "path": [
            5,
            3
          ],
          "explanation": "Found node 3 with 2 children (2 and 4)",
          "explanation_hi": "Node 3 mila jiske 2 children hain"
        },
        {
          "activeNode": 4,
          "path": [
            5,
            4
          ],
          "explanation": "Replace 3 with successor 4 -> Result: [5, 4, 6, 2, null, null, 7]",
          "explanation_hi": "3 ko 4 se replace kiya. Invariant safe!"
        }
      ],
      "result": [
        5,
        4,
        6,
        2,
        null,
        null,
        7
      ]
    },
    "code": "function deleteNode(root, key) {\n  if (!root) return null;\n  if (key < root.val) {\n    root.left = deleteNode(root.left, key);\n  } else if (key > root.val) {\n    root.right = deleteNode(root.right, key);\n  } else {\n    if (!root.left) return root.right;\n    if (!root.right) return root.left;\n    let succ = root.right;\n    while (succ.left) succ = succ.left;\n    root.val = succ.val;\n    root.right = deleteNode(root.right, succ.val);\n  }\n  return root;\n}",
    "searchSignals": {
      "tags": [
        "bst",
        "tree",
        "deletion"
      ],
      "keywords": [
        "delete node in bst",
        "bst deletion",
        "inorder successor"
      ],
      "companies": [
        "Amazon",
        "Microsoft",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Delete Node in a BST",
        "difficulty": "Medium",
        "slug": "delete-node-in-a-bst",
        "url": "https://leetcode.com/problems/delete-node-in-a-bst/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Delete Node BST Editorial",
        "url": "https://leetcode.com/problems/delete-node-in-a-bst/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Floor/Ceil": {
    "slug": "bst-floor-ceil",
    "name": "Floor/Ceil",
    "topic": "BST",
    "difficulty": "Medium",
    "timeComplexity": "O(H)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Floor and Ceil in a BST",
      "overview": "Finding floor (greatest value <= key) and ceil (smallest value >= key) in O(H) time and O(1) space.",
      "whatItIs": "Ceil: if node.val >= key, record candidate ceil = node.val and search left for a closer match. Else go right. Floor is symmetric.",
      "whyItWorks": "Binary search tree ordering partitions candidate bounds monotonically.",
      "whenToUse": "Finding closest element in BST, range bounds, implementing TreeSet floor/ceiling.",
      "recognitionSignals": [
        "Greatest value in BST <= X",
        "Smallest value in BST >= X",
        "Closest key lookups"
      ],
      "commonMistakes": [
        "Confusing floor (<=) and ceil (>=) direction logic"
      ],
      "stepLogic": "1. Ceil: ceil = -1. While curr:\n   a. If curr.val === key return curr.val\n   b. If curr.val > key: ceil = curr.val, curr = curr.left\n   c. Else: curr = curr.right\n2. Return ceil."
    },
    "hi": {
      "title": "Floor and Ceil in BST",
      "overview": "BST mein Floor (sabse bada number jo <= key ho) aur Ceil (sabse chhota number jo >= key ho) O(H) mein nikalna.",
      "whatItIs": "Ceil ke liye agar curr >= key hai toh candidate record karke left jayein taaki aur paas ka answer mil sake.",
      "whyItWorks": "BST properties se binary search ki tarah boundaries narrow hoti hain.",
      "whenToUse": "Closest element dhoondhne ya TreeSet floor/ceiling method implement karne mein.",
      "recognitionSignals": [
        "Floor ya Ceil in BST",
        "Closest values in BST"
      ],
      "commonMistakes": [
        "Floor aur Ceil ki direction ulta kar dena"
      ],
      "stepLogic": "1. Ceil ke liye: curr.val > key par ceil = curr.val save karke left jayein.\n2. Warna right jayein. Return ceil."
    },
    "visual": {
      "type": "TREE",
      "category": "BST",
      "title": "Ceil Boundary Search",
      "input": {
        "root": [
          8,
          4,
          12,
          2,
          6,
          10,
          14
        ],
        "key": 11
      },
      "description": "Find Ceil of 11: 8 < 11 (go right) -> 12 > 11 (candidate ceil=12, go left) -> 10 < 11 (go right, null). Ceil = 12.",
      "description_hi": "11 ka ceil 12 milta hai.",
      "steps": [
        {
          "activeNode": 8,
          "path": [
            8
          ],
          "explanation": "8 < 11 -> go right to 12",
          "explanation_hi": "8 chhota hai -> right gaye"
        },
        {
          "activeNode": 12,
          "path": [
            8,
            12
          ],
          "explanation": "12 > 11 -> candidate Ceil = 12, go left to 10",
          "explanation_hi": "12 bada hai -> candidate Ceil=12"
        },
        {
          "activeNode": 10,
          "path": [
            8,
            12,
            10
          ],
          "explanation": "10 < 11 -> go right (null). Final Ceil = 12!",
          "explanation_hi": "Final Ceil = 12!"
        }
      ],
      "result": 12
    },
    "code": "function findCeil(root, key) {\n  let ceil = -1;\n  while (root) {\n    if (root.val === key) return root.val;\n    if (root.val > key) {\n      ceil = root.val;\n      root = root.left;\n    } else {\n      root = root.right;\n    }\n  }\n  return ceil;\n}",
    "searchSignals": {
      "tags": [
        "bst",
        "tree",
        "floor-ceil"
      ],
      "keywords": [
        "floor in bst",
        "ceil in bst",
        "closest bst value"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Closest Binary Search Tree Value",
        "difficulty": "Easy",
        "slug": "closest-binary-search-tree-value",
        "url": "https://leetcode.com/problems/closest-binary-search-tree-value/"
      }
    ],
    "externalResources": [
      {
        "name": "GFG Floor and Ceil in BST",
        "url": "https://www.geeksforgeeks.org/floor-and-ceil-from-a-bst/",
        "type": "GFG"
      }
    ]
  },
  "Kth Smallest": {
    "slug": "bst-kth-smallest",
    "name": "Kth Smallest",
    "topic": "BST",
    "difficulty": "Medium",
    "timeComplexity": "O(H + K)",
    "spaceComplexity": "O(H)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Kth Smallest Element in a BST (In-Order Traversal)",
      "overview": "Finding the k-th smallest element in a BST by stopping early during iterative in-order traversal.",
      "whatItIs": "In-order traversal visits BST elements in strictly increasing sorted order. Counter decrements on each visited node; when k === 0, return node value.",
      "whyItWorks": "The k-th element visited in in-order order is mathematically the k-th smallest element.",
      "whenToUse": "Kth Smallest Element in a BST, Kth Largest (traverse reverse in-order: right -> node -> left).",
      "recognitionSignals": [
        "Kth smallest element in BST",
        "Take advantage of BST in-order sorted property"
      ],
      "commonMistakes": [
        "Traversing the entire tree into an array instead of early-stopping when counter reaches k"
      ],
      "stepLogic": "1. Initialize stack = [], curr = root.\n2. While curr || stack.length:\n   a. While curr: push curr, curr = curr.left\n   b. curr = stack.pop()\n   c. k--; if (k === 0) return curr.val\n   d. curr = curr.right."
    },
    "hi": {
      "title": "Kth Smallest in BST",
      "overview": "BST ke In-Order traversal se K-th smallest element O(H + K) time mein nikalna.",
      "whatItIs": "In-order traversal sorted order deta hai. Har visit par k-- karein, jab k === 0 ho jaye wahi answer hai.",
      "whyItWorks": "In-order mein visit hone wala k-th node automatically k-th smallest hota hai.",
      "whenToUse": "Kth Smallest Element in a BST problem mein.",
      "recognitionSignals": [
        "Kth smallest in BST",
        "Early stop in-order traversal"
      ],
      "commonMistakes": [
        "Pura tree array mein store karna jabki k milte hi ruk sakte hain"
      ],
      "stepLogic": "1. Iterative stack banayein.\n2. Deepest left par jayein.\n3. Pop karein aur k-- karein. k === 0 par value return karein.\n4. Right child par move karein."
    },
    "visual": {
      "type": "TREE",
      "category": "BST",
      "title": "In-Order Early Exit at K=1",
      "input": {
        "root": [
          3,
          1,
          4,
          null,
          2
        ],
        "k": 1
      },
      "description": "In-order visits: 1 (k=0, Stop!). Returns 1 immediately without visiting 2, 3, 4.",
      "description_hi": "Pehla node visit hote hi k=0 ho gaya -> Result = 1.",
      "steps": [
        {
          "activeNode": 1,
          "path": [
            3,
            1
          ],
          "explanation": "Smallest node is 1. k becomes 0 -> Return 1 immediately!",
          "explanation_hi": "1 smallest node hai -> turant return kiya!"
        }
      ],
      "result": 1
    },
    "code": "function kthSmallest(root, k) {\n  const stack = [];\n  let curr = root;\n  \n  while (curr || stack.length) {\n    while (curr) {\n      stack.push(curr);\n      curr = curr.left;\n    }\n    curr = stack.pop();\n    k--;\n    if (k === 0) return curr.val;\n    curr = curr.right;\n  }\n  return -1;\n}",
    "searchSignals": {
      "tags": [
        "bst",
        "tree",
        "inorder"
      ],
      "keywords": [
        "kth smallest element in bst",
        "kth smallest bst",
        "inorder early stop"
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
        "title": "Kth Smallest Element in a BST",
        "difficulty": "Medium",
        "slug": "kth-smallest-element-in-a-bst",
        "url": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Kth Smallest BST Editorial",
        "url": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "BST Iterator": {
    "slug": "bst-bst-iterator",
    "name": "BST Iterator",
    "topic": "BST",
    "difficulty": "Medium",
    "timeComplexity": "O(1) amortized next, O(1) hasNext",
    "spaceComplexity": "O(H)",
    "interviewFrequency": "High",
    "en": {
      "title": "Binary Search Tree Iterator (Controlled In-Order Stack)",
      "overview": "Designing an iterator over the in-order traversal of a BST with next() and hasNext() in O(1) amortized time and O(H) memory.",
      "whatItIs": "Maintains a stack of the current branch. `pushAllLeft(node)` pushes all left descendants. `next()` pops the node and calls `pushAllLeft(node.right)`.",
      "whyItWorks": "Each node is pushed and popped exactly once across the complete iteration, yielding strictly O(1) amortized time per `next()` call.",
      "whenToUse": "Binary Search Tree Iterator, flattening BST streaming queries, Two Sum IV with dual iterators.",
      "recognitionSignals": [
        "Iterator design with next() and hasNext()",
        "O(H) memory constraint instead of O(N)"
      ],
      "commonMistakes": [
        "Dumping all tree values into an array in the constructor (violates O(H) space constraint)"
      ],
      "stepLogic": "1. Constructor: stack = [], pushAllLeft(root).\n2. hasNext(): return stack.length > 0.\n3. next(): node = stack.pop(); if (node.right) pushAllLeft(node.right); return node.val."
    },
    "hi": {
      "title": "BST Iterator (Controlled Stack)",
      "overview": "BST par next() aur hasNext() methods wala iterator banana jo O(1) amortized time aur O(H) memory mein chale.",
      "whatItIs": "Pura tree array mein load karne ke badle stack mein sirf current left branch rakhi jati hai.",
      "whyItWorks": "Har node ek baar push aur ek baar pop hota hai, isliye average time O(1) rehta hai aur memory sirf tree height H hoti hai.",
      "whenToUse": "BST Iterator design karne ke liye.",
      "recognitionSignals": [
        "Design BST iterator",
        "O(H) memory constraint"
      ],
      "commonMistakes": [
        "Constructor mein saare nodes array mein daal dena (O(N) memory ban jata hai)"
      ],
      "stepLogic": "1. Stack banayein aur root ke saare left nodes push karein.\n2. hasNext: stack khali na ho.\n3. next: pop karein, agar right child ho toh uske saare left nodes push karein, aur val return karein."
    },
    "visual": {
      "type": "STACK",
      "category": "BST",
      "title": "Controlled In-Order Stack",
      "input": [
        7,
        3,
        15,
        null,
        null,
        9,
        20
      ],
      "description": "Stack stores left spine [7, 3]. next() returns 3, next() returns 7 and pushes [15, 9]. Space is bounded by O(H).",
      "description_hi": "Stack mein sirf left branch rehti hai, height H se zyada space kabhi use nahi hoti.",
      "steps": [
        {
          "stack": [
            7,
            3
          ],
          "top": 3,
          "explanation": "Initial stack holds left spine [7, 3]",
          "explanation_hi": "Shuru mein stack mein [7, 3] hain"
        },
        {
          "stack": [
            7
          ],
          "top": 7,
          "explanation": "next() pops 3 (no right child)",
          "explanation_hi": "next() ne 3 return kiya"
        },
        {
          "stack": [
            15,
            9
          ],
          "top": 9,
          "explanation": "next() pops 7 -> pushes right child spine [15, 9]",
          "explanation_hi": "7 pop hua aur [15, 9] push hue"
        }
      ],
      "result": [
        3,
        7,
        9,
        15,
        20
      ]
    },
    "code": "class BSTIterator {\n  constructor(root) {\n    this.stack = [];\n    this._pushLeft(root);\n  }\n  \n  _pushLeft(node) {\n    while (node) {\n      this.stack.push(node);\n      node = node.left;\n    }\n  }\n  \n  next() {\n    const node = this.stack.pop();\n    if (node.right) {\n      this._pushLeft(node.right);\n    }\n    return node.val;\n  }\n  \n  hasNext() {\n    return this.stack.length > 0;\n  }\n}",
    "searchSignals": {
      "tags": [
        "bst",
        "tree",
        "design",
        "iterator"
      ],
      "keywords": [
        "bst iterator",
        "binary search tree iterator",
        "controlled inorder stack"
      ],
      "companies": [
        "Facebook",
        "Amazon",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Binary Search Tree Iterator",
        "difficulty": "Medium",
        "slug": "binary-search-tree-iterator",
        "url": "https://leetcode.com/problems/binary-search-tree-iterator/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode BST Iterator Editorial",
        "url": "https://leetcode.com/problems/binary-search-tree-iterator/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Validate BST": {
    "slug": "bst-validate-bst",
    "name": "Validate BST",
    "topic": "BST",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Validate Binary Search Tree (Range Interval Checking)",
      "overview": "Verifying that every node satisfies the strict BST property within its inherited minimum and maximum valid range `(minVal, maxVal)`.",
      "whatItIs": "Passing `(min, max)` down recursive calls: for left child `max = root.val`, for right child `min = root.val`.",
      "whyItWorks": "Simply checking `root.val > root.left.val` is insufficient because an entire subtree must obey the bound inherited from ancestors above.",
      "whenToUse": "Validate Binary Search Tree.",
      "recognitionSignals": [
        "Check if binary tree is valid BST",
        "Ancestor range bounding"
      ],
      "commonMistakes": [
        "Only checking local parent-child relationship (`root.left.val < root.val`) instead of global ancestor bounds",
        "Integer overflow when setting initial min/max (use `null` or `-Infinity / Infinity`)"
      ],
      "stepLogic": "1. In validate(node, min, max):\n   a. If (!node) return true\n   b. If (min !== null && node.val <= min) return false\n   c. If (max !== null && node.val >= max) return false\n   d. return validate(node.left, min, node.val) && validate(node.right, node.val, max)\n2. Return validate(root, null, null)."
    },
    "hi": {
      "title": "Validate Binary Search Tree",
      "overview": "Check karna ki tree ka har ek node valid BST property follow kar raha hai ya nahi.",
      "whatItIs": "Har recursive call mein valid `(min, max)` range pass karna jo ancestors se aati hai.",
      "whyItWorks": "Sirf immediate children ko check karna kaafi nahi hota kyunki left subtree ke kisi bhi node ko root se bada hone ki permission nahi hoti.",
      "whenToUse": "Validate BST problem mein.",
      "recognitionSignals": [
        "Check valid BST",
        "Strict range boundaries"
      ],
      "commonMistakes": [
        "Sirf parent aur child compare karna (ancestor bounds miss kar dena)"
      ],
      "stepLogic": "1. validate(node, min, max) function banayein.\n2. Agar node.val <= min ya node.val >= max ho toh false return karein.\n3. Left ke liye max = node.val aur Right ke liye min = node.val pass karein."
    },
    "visual": {
      "type": "TREE",
      "category": "BST",
      "title": "Ancestor Range Verification",
      "input": [
        5,
        1,
        4,
        null,
        null,
        3,
        6
      ],
      "description": "Node 3 is in right subtree of 5, but 3 < 5! Fails range check (5, Infinity) -> Invalid BST!",
      "description_hi": "Node 3 root 5 ke right mein hai lekin 3 < 5 hai, isliye invalid BST!",
      "steps": [
        {
          "activeNode": 5,
          "path": [
            5
          ],
          "explanation": "Root 5: valid range (-Inf, +Inf)",
          "explanation_hi": "Root 5 valid hai"
        },
        {
          "activeNode": 4,
          "path": [
            5,
            4
          ],
          "explanation": "Node 4: valid range (5, +Inf). But 4 <= 5! Invalid BST.",
          "explanation_hi": "Node 4 range (5, Inf) violate karta hai -> Invalid!"
        }
      ],
      "result": false
    },
    "code": "function isValidBST(root, min = -Infinity, max = Infinity) {\n  if (!root) return true;\n  if (root.val <= min || root.val >= max) return false;\n  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);\n}",
    "searchSignals": {
      "tags": [
        "bst",
        "tree",
        "validation"
      ],
      "keywords": [
        "validate binary search tree",
        "valid bst",
        "range validate bst"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft",
        "Bloomberg"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Validate Binary Search Tree",
        "difficulty": "Medium",
        "slug": "validate-binary-search-tree",
        "url": "https://leetcode.com/problems/validate-binary-search-tree/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Validate BST Editorial",
        "url": "https://leetcode.com/problems/validate-binary-search-tree/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Min Heap": {
    "slug": "heap-min-heap",
    "name": "Min Heap",
    "topic": "Heap",
    "difficulty": "Medium",
    "timeComplexity": "O(log N) push/pop, O(1) peek",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Min Heap Data Structure",
      "overview": "Complete binary tree where parent is always less than or equal to its children, ensuring root is the minimum element.",
      "whatItIs": "Array representation with `parent(i) = (i-1)/2`, `left(i) = 2i+1`, `right(i) = 2i+2`. Sift-up on insertion and sift-down on extraction.",
      "whyItWorks": "Compact array structure requires zero pointer overhead and provides optimal cache line locality.",
      "whenToUse": "Dijkstra's algorithm, Continuous running minimum, Top K Largest Elements.",
      "recognitionSignals": [
        "Retrieve smallest element in O(1)",
        "Insert and remove in O(log N)"
      ],
      "commonMistakes": [
        "Heapify index formulas off-by-one",
        "Swapping parent with wrong child during sift-down (must swap with the strictly smaller child)"
      ],
      "stepLogic": "1. Push: append to end, siftUp comparing with parent.\n2. Pop: swap root with end, pop end, siftDown comparing with smallest child.\n3. Peek: return array[0]."
    },
    "hi": {
      "title": "Min Heap",
      "overview": "Complete binary tree jisme parent node hamesha apne children se chhota hota hai, aur root par hamesha minimum element rehta hai.",
      "whatItIs": "Array based tree jisme sift-up aur sift-down se O(log N) mein balance maintain hota hai.",
      "whyItWorks": "Array indices math formula se bina kisi pointer memory ke tree banta hai.",
      "whenToUse": "Dijkstra algorithm aur Top K largest elements mein.",
      "recognitionSignals": [
        "Minimum element in O(1)",
        "Logarithmic push aur pop"
      ],
      "commonMistakes": [
        "Sift-down karte waqt dono children mein se chhote wale child ke badle bade se swap kar dena"
      ],
      "stepLogic": "1. Push: end mein daal kar siftUp karein.\n2. Pop: root aur last element swap karein, pop karein, siftDown karein.\n3. Peek: index 0 return karein."
    },
    "visual": {
      "type": "HEAP",
      "category": "HEAP",
      "title": "Min-Heap Sift-Down Invariant",
      "input": [
        3,
        5,
        8,
        17,
        20
      ],
      "description": "Root is 3. Popping 3 swaps 20 to root, then sifts down: 20 swaps with 5. New root is 5.",
      "description_hi": "Root 3 pop hone ke baad 5 naya minimum root banta hai.",
      "steps": [
        {
          "activeIdx": 0,
          "heapArray": [
            3,
            5,
            8,
            17,
            20
          ],
          "explanation": "Min-Heap root holds 3",
          "explanation_hi": "Root 3 min hold karta hai"
        },
        {
          "activeIdx": 0,
          "heapArray": [
            5,
            17,
            8,
            20
          ],
          "explanation": "After pop: 5 becomes new root. Invariant restored in O(log N)!",
          "explanation_hi": "5 naya root bana. Invariant restored!"
        }
      ],
      "result": 3
    },
    "code": "class MinHeap {\n  constructor() {\n    this.heap = [];\n  }\n  push(val) {\n    this.heap.push(val);\n    let i = this.heap.length - 1;\n    while (i > 0) {\n      const p = (i - 1) >> 1;\n      if (this.heap[i] >= this.heap[p]) break;\n      [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];\n      i = p;\n    }\n  }\n  pop() {\n    if (this.heap.length <= 1) return this.heap.pop();\n    const top = this.heap[0];\n    this.heap[0] = this.heap.pop();\n    let i = 0, n = this.heap.length;\n    while ((i << 1) + 1 < n) {\n      let s = (i << 1) + 1;\n      if (s + 1 < n && this.heap[s + 1] < this.heap[s]) s++;\n      if (this.heap[i] <= this.heap[s]) break;\n      [this.heap[i], this.heap[s]] = [this.heap[s], this.heap[i]];\n      i = s;\n    }\n    return top;\n  }\n  peek() { return this.heap[0]; }\n}",
    "searchSignals": {
      "tags": [
        "heap",
        "min-heap",
        "priority-queue"
      ],
      "keywords": [
        "min heap",
        "heapify",
        "binary heap"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Kth Largest Element in an Array",
        "difficulty": "Medium",
        "slug": "kth-largest-element-in-an-array",
        "url": "https://leetcode.com/problems/kth-largest-element-in-an-array/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Heap Explore",
        "url": "https://leetcode.com/explore/learn/card/heap-priority-queue/",
        "type": "LeetCode"
      }
    ]
  },
  "Max Heap": {
    "slug": "heap-max-heap",
    "name": "Max Heap",
    "topic": "Heap",
    "difficulty": "Medium",
    "timeComplexity": "O(log N) push/pop, O(1) peek",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Max Heap Data Structure",
      "overview": "Complete binary tree where parent is always greater than or equal to its children, ensuring root is the maximum element.",
      "whatItIs": "Sift-up and sift-down maintain max-heap ordering where `heap[parent] >= heap[child]`.",
      "whyItWorks": "Guarantees the global maximum can be extracted in O(log N) while peek takes O(1).",
      "whenToUse": "Top K Smallest Elements, Find Median from Data Stream (lower half max-heap).",
      "recognitionSignals": [
        "Retrieve maximum element continuously in O(1)",
        "Top K smallest tracking"
      ],
      "commonMistakes": [
        "Inverting comparison condition during siftDown (must swap with strictly larger child)"
      ],
      "stepLogic": "1. Push: append to end, siftUp swapping with smaller parent.\n2. Pop: swap root with end, pop, siftDown swapping with larger child.\n3. Peek: return root (array[0])."
    },
    "hi": {
      "title": "Max Heap",
      "overview": "Complete binary tree jisme root par hamesha maximum element hota hai.",
      "whatItIs": "Parent hamesha children se bada ya barabar rehta hai.",
      "whyItWorks": "Global maximum O(1) mein accessible hota hai aur updates O(log N) mein ho jaate hain.",
      "whenToUse": "Top K Smallest elements aur Median from Data Stream mein.",
      "recognitionSignals": [
        "Maximum element in O(1)",
        "Max heap priority queue"
      ],
      "commonMistakes": [
        "Sift-down mein chhote child se swap kar dena"
      ],
      "stepLogic": "1. End mein push karke siftUp karein.\n2. Root pop karke last element layein aur siftDown karein.\n3. Index 0 peek karein."
    },
    "visual": {
      "type": "HEAP",
      "category": "HEAP",
      "title": "Max-Heap Root Extraction",
      "input": [
        50,
        30,
        40,
        10,
        20
      ],
      "description": "Root is 50. Popping 50 leaves 40 as the new maximum root.",
      "description_hi": "Root 50 pop hone par 40 naya maximum root banta hai.",
      "steps": [
        {
          "activeIdx": 0,
          "heapArray": [
            50,
            30,
            40,
            10,
            20
          ],
          "explanation": "Root holds maximum element 50",
          "explanation_hi": "Root par max 50 hai"
        },
        {
          "activeIdx": 0,
          "heapArray": [
            40,
            30,
            20,
            10
          ],
          "explanation": "After pop: 40 is new max root",
          "explanation_hi": "Pop ke baad 40 naya root bana"
        }
      ],
      "result": 50
    },
    "code": "class MaxHeap {\n  constructor() {\n    this.heap = [];\n  }\n  push(val) {\n    this.heap.push(val);\n    let i = this.heap.length - 1;\n    while (i > 0) {\n      const p = (i - 1) >> 1;\n      if (this.heap[i] <= this.heap[p]) break;\n      [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];\n      i = p;\n    }\n  }\n  pop() {\n    if (this.heap.length <= 1) return this.heap.pop();\n    const top = this.heap[0];\n    this.heap[0] = this.heap.pop();\n    let i = 0, n = this.heap.length;\n    while ((i << 1) + 1 < n) {\n      let l = (i << 1) + 1;\n      if (l + 1 < n && this.heap[l + 1] > this.heap[l]) l++;\n      if (this.heap[i] >= this.heap[l]) break;\n      [this.heap[i], this.heap[l]] = [this.heap[l], this.heap[i]];\n      i = l;\n    }\n    return top;\n  }\n  peek() { return this.heap[0]; }\n}",
    "searchSignals": {
      "tags": [
        "heap",
        "max-heap"
      ],
      "keywords": [
        "max heap",
        "max priority queue"
      ],
      "companies": [
        "Amazon",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Find Median from Data Stream",
        "difficulty": "Hard",
        "slug": "find-median-from-data-stream",
        "url": "https://leetcode.com/problems/find-median-from-data-stream/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Heap Explore Card",
        "url": "https://leetcode.com/explore/learn/card/heap-priority-queue/",
        "type": "LeetCode"
      }
    ]
  },
  "Top K": {
    "slug": "heap-top-k",
    "name": "Top K",
    "topic": "Heap",
    "difficulty": "Medium",
    "timeComplexity": "O(N log K)",
    "spaceComplexity": "O(K)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Top K Elements (Bounded Min-Heap of Size K)",
      "overview": "Maintaining a Min-Heap of size K to find the K largest elements in a stream in O(N log K) time and O(K) space.",
      "whatItIs": "For each element x: push to min-heap. If heap size exceeds K, pop the minimum. The heap retains only the K largest elements.",
      "whyItWorks": "By continually evicting the smallest element from the heap of size K + 1, all dominated elements are filtered out.",
      "whenToUse": "Kth Largest Element in an Array, Top K Frequent Elements, K Closest Points to Origin.",
      "recognitionSignals": [
        "Find top K largest or smallest elements",
        "Streaming data where total N is unknown or very large",
        "Memory bounded by O(K)"
      ],
      "commonMistakes": [
        "Using a max-heap of size N (takes O(N) space and O(N log N) time) instead of a min-heap of size K"
      ],
      "stepLogic": "1. Create MinHeap.\n2. For each num in nums:\n   a. heap.push(num)\n   b. If heap.size() > k: heap.pop()\n3. Return heap.peek() (for Kth largest) or heap elements (for top K)."
    },
    "hi": {
      "title": "Top K Elements (Min-Heap Size K)",
      "overview": "Size K ka Min-Heap maintain karke O(N log K) time aur O(K) memory mein K sabse bade elements nikalna.",
      "whatItIs": "Har number ko min-heap mein daalein. Jaise hi size > K ho, sabse chhota element pop kar dein.",
      "whyItWorks": "Chhote elements lagatar pop hote rehte hain, isliye heap mein hamesha K sabse bade elements hi bachte hain.",
      "whenToUse": "Kth Largest Element in an Array, Top K Frequent Elements mein.",
      "recognitionSignals": [
        "Top K elements",
        "O(K) memory constraint"
      ],
      "commonMistakes": [
        "Max heap of size N use karna (O(N) memory waste hoti hai)"
      ],
      "stepLogic": "1. Min-Heap banayein.\n2. Num push karein; size > k hote hi pop karein.\n3. Heap root Kth largest element hota hai."
    },
    "visual": {
      "type": "HEAP",
      "category": "HEAP",
      "title": "Bounded Size K Min-Heap Filter",
      "input": {
        "nums": [
          3,
          2,
          1,
          5,
          6,
          4
        ],
        "k": 2
      },
      "description": "Stream: [3, 2, 1, 5, 6, 4]. Bounded min-heap of size 2 keeps [5, 6]. 2nd largest is 5.",
      "description_hi": "Size 2 ka heap [5, 6] retain karta hai. 2nd largest 5 hai.",
      "steps": [
        {
          "activeIdx": 0,
          "heapArray": [
            5,
            6
          ],
          "explanation": "Min-Heap of size 2 retains [5, 6]. Root is 5 (Kth largest)",
          "explanation_hi": "Heap mein [5, 6] hain. Root 5 hai."
        }
      ],
      "result": 5
    },
    "code": "function findKthLargest(nums, k) {\n  // Using bounded min-heap of size k\n  const minHeap = [];\n  function push(val) {\n    minHeap.push(val);\n    let i = minHeap.length - 1;\n    while (i > 0) {\n      const p = (i - 1) >> 1;\n      if (minHeap[i] >= minHeap[p]) break;\n      [minHeap[i], minHeap[p]] = [minHeap[p], minHeap[i]];\n      i = p;\n    }\n  }\n  function pop() {\n    const top = minHeap[0];\n    minHeap[0] = minHeap.pop();\n    let i = 0, n = minHeap.length;\n    while ((i << 1) + 1 < n) {\n      let s = (i << 1) + 1;\n      if (s + 1 < n && minHeap[s + 1] < minHeap[s]) s++;\n      if (minHeap[i] <= minHeap[s]) break;\n      [minHeap[i], minHeap[s]] = [minHeap[s], minHeap[i]];\n      i = s;\n    }\n    return top;\n  }\n  \n  for (const n of nums) {\n    push(n);\n    if (minHeap.length > k) pop();\n  }\n  return minHeap[0];\n}\n\nconsole.log(findKthLargest([3,2,1,5,6,4], 2)); // 5",
    "searchSignals": {
      "tags": [
        "heap",
        "top-k",
        "min-heap"
      ],
      "keywords": [
        "kth largest element",
        "top k elements",
        "bounded heap"
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
        "title": "Kth Largest Element in an Array",
        "difficulty": "Medium",
        "slug": "kth-largest-element-in-an-array",
        "url": "https://leetcode.com/problems/kth-largest-element-in-an-array/"
      },
      {
        "title": "K Closest Points to Origin",
        "difficulty": "Medium",
        "slug": "k-closest-points-to-origin",
        "url": "https://leetcode.com/problems/k-closest-points-to-origin/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Kth Largest Editorial",
        "url": "https://leetcode.com/problems/kth-largest-element-in-an-array/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Heap Sort": {
    "slug": "heap-heap-sort",
    "name": "Heap Sort",
    "topic": "Heap",
    "difficulty": "Medium",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(1) auxiliary in-place",
    "interviewFrequency": "High",
    "en": {
      "title": "In-Place Heap Sort",
      "overview": "Comparison-based sorting algorithm transforming array into a Max-Heap in O(N), then repeatedly swapping root to sorted suffix in O(N log N).",
      "whatItIs": "Phase 1 builds max-heap bottom-up from index n/2 down to 0 in O(N). Phase 2 swaps max element (index 0) to end and sifts down remaining heap.",
      "whyItWorks": "Max-Heap property guarantees index 0 is largest remaining element. Placing it at index i and shrinking heap boundary sorts array in-place.",
      "whenToUse": "When guaranteed O(N log N) worst-case time is required with strictly O(1) auxiliary memory.",
      "recognitionSignals": [
        "In-place O(N log N) sorting without extra space",
        "Convert array to max heap then sort"
      ],
      "commonMistakes": [
        "Building heap via N insertions (O(N log N)) instead of bottom-up heapify (O(N))"
      ],
      "stepLogic": "1. Build max heap: for i = Math.floor(n/2) - 1 down to 0: heapify(n, i).\n2. For i = n - 1 down to 1:\n   a. Swap arr[0] with arr[i]\n   b. heapify(i, 0) on remaining array.\n3. Array is sorted."
    },
    "hi": {
      "title": "In-Place Heap Sort",
      "overview": "Array ko Max-Heap bana kar bina kisi extra memory ke O(N log N) time aur O(1) space mein sort karna.",
      "whatItIs": "Bottom-up heapify se O(N) mein heap banate hain, fir max element ko end par swap karke bache hue array ko sift down karte hain.",
      "whyItWorks": "Index 0 par hamesha bacha hua sabse bada element hota hai, jise array ke aakhiri mein bhej kar sorted suffix banate rehte hain.",
      "whenToUse": "In-place sorting with guaranteed O(N log N) worst case.",
      "recognitionSignals": [
        "Heap sort in place",
        "O(1) memory sorting"
      ],
      "commonMistakes": [
        "Bottom-up heapify ke badle repeated insertions use karna"
      ],
      "stepLogic": "1. n/2 - 1 se 0 tak max heapify karein.\n2. Index 0 ko end se swap karein.\n3. Bache hue size par heapify karein."
    },
    "visual": {
      "type": "HEAP",
      "category": "HEAP",
      "title": "In-Place Heap Sort Swap",
      "input": [
        4,
        10,
        3,
        5,
        1
      ],
      "description": "Max heap: [10, 5, 3, 4, 1]. Swap 10 with 1 -> [1, 5, 3, 4 | 10]. Sift down 1 -> [5, 4, 3, 1 | 10].",
      "description_hi": "10 ko aakhiri mein bhej kar bache hue array ko re-heapify karte hain.",
      "steps": [
        {
          "activeIdx": 0,
          "heapArray": [
            10,
            5,
            3,
            4,
            1
          ],
          "explanation": "Max heap built in O(N)",
          "explanation_hi": "Max heap build hua"
        },
        {
          "activeIdx": 4,
          "heapArray": [
            5,
            4,
            3,
            1,
            10
          ],
          "explanation": "10 placed at end. Sift down 5 -> sorted suffix grows!",
          "explanation_hi": "10 sorted position par gaya"
        }
      ],
      "result": [
        1,
        3,
        4,
        5,
        10
      ]
    },
    "code": "function heapSort(arr) {\n  const n = arr.length;\n  \n  function heapify(size, i) {\n    let largest = i;\n    const l = 2 * i + 1, r = 2 * i + 2;\n    if (l < size && arr[l] > arr[largest]) largest = l;\n    if (r < size && arr[r] > arr[largest]) largest = r;\n    if (largest !== i) {\n      [arr[i], arr[largest]] = [arr[largest], arr[i]];\n      heapify(size, largest);\n    }\n  }\n  \n  // Phase 1: Build max heap\n  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {\n    heapify(n, i);\n  }\n  \n  // Phase 2: Extract elements\n  for (let i = n - 1; i > 0; i--) {\n    [arr[0], arr[i]] = [arr[i], arr[0]];\n    heapify(i, 0);\n  }\n  return arr;\n}\n\nconsole.log(heapSort([4, 10, 3, 5, 1])); // [1, 3, 4, 5, 10]",
    "searchSignals": {
      "tags": [
        "heap",
        "sorting",
        "in-place"
      ],
      "keywords": [
        "heap sort",
        "in place heap sort",
        "bottom up heapify"
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
        "name": "GFG Heap Sort",
        "url": "https://www.geeksforgeeks.org/heap-sort/",
        "type": "GFG"
      }
    ]
  },
  "Median": {
    "slug": "heap-median",
    "name": "Median",
    "topic": "Heap",
    "difficulty": "Hard",
    "timeComplexity": "O(log N) addNum, O(1) findMedian",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Find Median from Data Stream (Dual Heaps)",
      "overview": "Maintaining running median of a data stream in O(1) time by splitting numbers between a Max-Heap (lower half) and Min-Heap (upper half).",
      "whatItIs": "`small` (Max-Heap) stores lower half; `large` (Min-Heap) stores upper half. Balance invariant: `small.size === large.size` or `small.size === large.size + 1`.",
      "whyItWorks": "Max of lower half and min of upper half are adjacent middle values in sorted order, yielding the median in O(1).",
      "whenToUse": "Find Median from Data Stream, Sliding Window Median.",
      "recognitionSignals": [
        "Online continuous median of stream",
        "Dual heap balancing pattern"
      ],
      "commonMistakes": [
        "Pushing directly into one heap without checking boundary condition (`small.peek() <= large.peek()`)",
        "Sizes differing by more than 1"
      ],
      "stepLogic": "1. addNum(num): push to small (max-heap). Move small.pop() to large (min-heap).\n2. If large.size > small.size: move large.pop() to small.\n3. findMedian(): if small.size > large.size return small.peek(); else return (small.peek() + large.peek()) / 2."
    },
    "hi": {
      "title": "Find Median from Data Stream (Dual Heaps)",
      "overview": "Stream ka median O(1) time mein nikalne ke liye numbers ko do heaps (Max-Heap lower half aur Min-Heap upper half) mein divide karna.",
      "whatItIs": "Lower half ka max aur Upper half ka min adjacent middle elements hote hain.",
      "whyItWorks": "Dono heaps ke size balance rakhne se median hamesha dono roots se turant O(1) mein mil jata hai.",
      "whenToUse": "Find Median from Data Stream problem mein.",
      "recognitionSignals": [
        "Streaming data ka continuous median",
        "Dual heaps balancing"
      ],
      "commonMistakes": [
        "Sizes ka difference 1 se zyada hone dena"
      ],
      "stepLogic": "1. Naya number add karein aur heaps mein balance karein.\n2. Agar odd numbers hain toh small.peek() median hai.\n3. Even numbers hain toh (small.peek() + large.peek()) / 2 median hai."
    },
    "visual": {
      "type": "HEAP",
      "category": "HEAP",
      "title": "Dual Heaps Median Balancing",
      "input": [
        "add(1)",
        "add(2)",
        "median -> 1.5",
        "add(3)",
        "median -> 2"
      ],
      "description": "Lower half (MaxHeap): [2, 1]. Upper half (MinHeap): [3]. Median = root of lower half = 2.",
      "description_hi": "Lower half max 2 hai aur upper half min 3 hai. Median = 2.",
      "steps": [
        {
          "activeIdx": 0,
          "heapArray": [
            2,
            1
          ],
          "explanation": "Lower Half Max-Heap root = 2",
          "explanation_hi": "Lower half root = 2"
        },
        {
          "activeIdx": 0,
          "heapArray": [
            3
          ],
          "explanation": "Upper Half Min-Heap root = 3. Odd count -> Median is 2!",
          "explanation_hi": "Upper half root = 3. Median = 2!"
        }
      ],
      "result": 2
    },
    "code": "class MedianFinder {\n  constructor() {\n    this.small = []; // Max-heap (simulated with negation)\n    this.large = []; // Min-heap\n  }\n  \n  addNum(num) {\n    // Push to small\n    this._pushHeap(this.small, -num);\n    // Balance to large\n    this._pushHeap(this.large, -this._popHeap(this.small));\n    // Maintain size invariant\n    if (this.large.length > this.small.length) {\n      this._pushHeap(this.small, -this._popHeap(this.large));\n    }\n  }\n  \n  findMedian() {\n    if (this.small.length > this.large.length) {\n      return -this.small[0];\n    }\n    return (-this.small[0] + this.large[0]) / 2;\n  }\n  \n  _pushHeap(h, val) {\n    h.push(val);\n    let i = h.length - 1;\n    while (i > 0) {\n      const p = (i - 1) >> 1;\n      if (h[i] >= h[p]) break;\n      [h[i], h[p]] = [h[p], h[i]];\n      i = p;\n    }\n  }\n  \n  _popHeap(h) {\n    if (h.length <= 1) return h.pop();\n    const top = h[0];\n    h[0] = h.pop();\n    let i = 0, n = h.length;\n    while ((i << 1) + 1 < n) {\n      let s = (i << 1) + 1;\n      if (s + 1 < n && h[s + 1] < h[s]) s++;\n      if (h[i] <= h[s]) break;\n      [h[i], h[s]] = [h[s], h[i]];\n      i = s;\n    }\n    return top;\n  }\n}",
    "searchSignals": {
      "tags": [
        "heap",
        "design",
        "dual-heap"
      ],
      "keywords": [
        "find median from data stream",
        "dual heaps median",
        "running median"
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
        "title": "Find Median from Data Stream",
        "difficulty": "Hard",
        "slug": "find-median-from-data-stream",
        "url": "https://leetcode.com/problems/find-median-from-data-stream/"
      },
      {
        "title": "Sliding Window Median",
        "difficulty": "Hard",
        "slug": "sliding-window-median",
        "url": "https://leetcode.com/problems/sliding-window-median/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Median Finder Editorial",
        "url": "https://leetcode.com/problems/find-median-from-data-stream/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Merge K Lists": {
    "slug": "heap-merge-k-lists",
    "name": "Merge K Lists",
    "topic": "Heap",
    "difficulty": "Hard",
    "timeComplexity": "O(N log K)",
    "spaceComplexity": "O(K)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Merge K Sorted Lists (Min-Heap Multiway Merge)",
      "overview": "Merging K pre-sorted linked lists into one sorted list in O(N log K) using a Min-Heap of size K.",
      "whatItIs": "Initialize min-heap with heads of all K lists. Repeatedly extract the minimum node, append it to result, and push its `next` node into the heap.",
      "whyItWorks": "The globally smallest remaining node across all K sorted lists is always one of the current head nodes stored in the heap.",
      "whenToUse": "Merge k Sorted Lists, Smallest Range Covering Elements from K Lists, Find K Pairs with Smallest Sums.",
      "recognitionSignals": [
        "Merge multiple sorted sequences/lists into one",
        "Multiway k-pointer merge"
      ],
      "commonMistakes": [
        "Inserting empty/null list heads into heap",
        "Inefficient O(N * K) linear comparisons instead of O(N log K) min-heap"
      ],
      "stepLogic": "1. Insert head node of each non-empty list into MinHeap.\n2. Create dummy head, tail = dummy.\n3. While heap not empty:\n   a. node = heap.pop()\n   b. tail.next = node; tail = node\n   c. If node.next !== null: heap.push(node.next)\n4. Return dummy.next."
    },
    "hi": {
      "title": "Merge K Sorted Lists (Min-Heap)",
      "overview": "K sorted linked lists ko O(N log K) time mein ek sorted list mein merge karna Min-Heap of size K use karke.",
      "whatItIs": "Sabhi lists ke current heads ko heap mein daal kar sabse chhota node nikaalna aur uska next node wapas heap mein add karna.",
      "whyItWorks": "Next smallest candidate hamesha kisi na kisi list ke current head par hi hota hai.",
      "whenToUse": "Merge k Sorted Lists problem mein.",
      "recognitionSignals": [
        "Merge K sorted lists",
        "Multiway merge"
      ],
      "commonMistakes": [
        "Null heads ko heap mein daal dena"
      ],
      "stepLogic": "1. Sabhi lists ke heads Min-Heap mein daalein.\n2. Min node pop karein aur result mein attach karein.\n3. Us node ka next exist kare toh heap mein push karein."
    },
    "visual": {
      "type": "LINKED_LIST",
      "category": "HEAP",
      "title": "Multiway Min-Heap Node Selection",
      "input": "3 lists: [1->4->5], [1->3->4], [2->6]",
      "description": "Heap holds heads: [1, 1, 2]. Pops 1, enqueues 4. Result connects: 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6.",
      "description_hi": "Heads compare karke min nikalte hain aur next link karte hain.",
      "steps": [
        {
          "head": 1,
          "slow": 1,
          "fast": 2,
          "explanation": "Pop 1 from L1, enqueue 4. Heap holds [1, 2, 4]",
          "explanation_hi": "1 pop hua, 4 add hua"
        },
        {
          "head": 1,
          "slow": 1,
          "fast": 2,
          "explanation": "Pop 1 from L2, enqueue 3. Heap holds [2, 3, 4]",
          "explanation_hi": "1 pop hua, 3 add hua"
        },
        {
          "head": 1,
          "slow": 2,
          "fast": 3,
          "explanation": "Merged sorted chain: 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6",
          "explanation_hi": "Final sorted list complete!"
        }
      ],
      "result": [
        1,
        1,
        2,
        3,
        4,
        4,
        5,
        6
      ]
    },
    "code": "function mergeKLists(lists) {\n  const heap = [];\n  function push(node) {\n    heap.push(node);\n    let i = heap.length - 1;\n    while (i > 0) {\n      const p = (i - 1) >> 1;\n      if (heap[i].val >= heap[p].val) break;\n      [heap[i], heap[p]] = [heap[p], heap[i]];\n      i = p;\n    }\n  }\n  function pop() {\n    if (heap.length <= 1) return heap.pop();\n    const top = heap[0];\n    heap[0] = heap.pop();\n    let i = 0, n = heap.length;\n    while ((i << 1) + 1 < n) {\n      let s = (i << 1) + 1;\n      if (s + 1 < n && heap[s + 1].val < heap[s].val) s++;\n      if (heap[i].val <= heap[s].val) break;\n      [heap[i], heap[s]] = [heap[s], heap[i]];\n      i = s;\n    }\n    return top;\n  }\n  \n  for (const l of lists) {\n    if (l) push(l);\n  }\n  \n  const dummy = { val: 0, next: null };\n  let tail = dummy;\n  \n  while (heap.length) {\n    const node = pop();\n    tail.next = node;\n    tail = node;\n    if (node.next) push(node.next);\n  }\n  return dummy.next;\n}",
    "searchSignals": {
      "tags": [
        "heap",
        "linked-list",
        "k-way-merge"
      ],
      "keywords": [
        "merge k sorted lists",
        "multiway merge heap"
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
        "title": "Merge k Sorted Lists",
        "difficulty": "Hard",
        "slug": "merge-k-sorted-lists",
        "url": "https://leetcode.com/problems/merge-k-sorted-lists/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Merge K Lists Editorial",
        "url": "https://leetcode.com/problems/merge-k-sorted-lists/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Priority Queue": {
    "slug": "heap-priority-queue",
    "name": "Priority Queue",
    "topic": "Heap",
    "difficulty": "Medium",
    "timeComplexity": "O(log N) per task update",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Priority Queue Task Scheduling",
      "overview": "Greedy scheduling and simulation using Priority Queues to dispatch highest-priority or earliest-deadline tasks.",
      "whatItIs": "Heap organizes tasks by execution deadline, frequency, or cooling intervals to maximize throughput and minimize idle time.",
      "whyItWorks": "Always picking the most constrained task (e.g. highest frequency in Task Scheduler) prevents bottleneck pileups at the end.",
      "whenToUse": "Task Scheduler, Reorganize String, Meeting Rooms II, Minimum Number of Refueling Stops.",
      "recognitionSignals": [
        "Schedule tasks with cooldown periods",
        "Process highest frequency/urgency items first without adjacent duplicates"
      ],
      "commonMistakes": [
        "Putting tasks back into priority queue before their cooldown interval expires"
      ],
      "stepLogic": "1. Count task frequencies.\n2. Push frequencies into MaxHeap.\n3. In each cycle of length (n + 1), pop up to (n + 1) distinct tasks.\n4. Decrement frequencies and push valid remainders back for next cycle."
    },
    "hi": {
      "title": "Priority Queue Task Scheduling",
      "overview": "Priority Queue ka use karke tasks ko schedule karna taaki idle time minimum rahe aur highest frequency tasks pehle complete hon.",
      "whatItIs": "Highest frequency wale tasks ko sabse pehle schedule karke cooldown period handle karna.",
      "whyItWorks": "Greedy strategy: jo task sabse zyada bar bacha hai use pehle karne se aakhiri mein idle time nahi bachta.",
      "whenToUse": "Task Scheduler, Reorganize String, Meeting Rooms II mein.",
      "recognitionSignals": [
        "Cooldown period ke sath task scheduling",
        "No adjacent duplicate characters"
      ],
      "commonMistakes": [
        "Cooldown khatam hone se pehle task ko wapas heap mein daal dena"
      ],
      "stepLogic": "1. Task frequencies count karein aur MaxHeap mein daalein.\n2. (n+1) time slice mein distinct tasks pop karein.\n3. Bache hue count ko next round ke liye re-push karein."
    },
    "visual": {
      "type": "HEAP",
      "category": "HEAP",
      "title": "Max-Priority Task Dispatch",
      "input": {
        "tasks": [
          "A",
          "A",
          "A",
          "B",
          "B",
          "B"
        ],
        "n": 2
      },
      "description": "Schedule: A -> B -> idle -> A -> B -> idle -> A -> B. Total time = 8 units.",
      "description_hi": "A aur B alternate dispatch hote hain. Total time 8 units.",
      "steps": [
        {
          "activeIdx": 0,
          "heapArray": [
            3,
            3
          ],
          "explanation": "Heap holds max frequencies: A:3, B:3",
          "explanation_hi": "A:3 aur B:3 heap mein hain"
        },
        {
          "activeIdx": 0,
          "heapArray": [
            2,
            2
          ],
          "explanation": "Cycle 1 dispatches [A, B, idle] -> frequencies become A:2, B:2",
          "explanation_hi": "Cycle 1 mein A aur B dispatch hue"
        }
      ],
      "result": 8
    },
    "code": "function leastInterval(tasks, n) {\n  const counts = new Array(26).fill(0);\n  for (const t of tasks) counts[t.charCodeAt(0) - 65]++;\n  counts.sort((a, b) => b - a);\n  \n  const maxVal = counts[0] - 1;\n  let idleSlots = maxVal * n;\n  \n  for (let i = 1; i < 26 && counts[i] > 0; i++) {\n    idleSlots -= Math.min(counts[i], maxVal);\n  }\n  return idleSlots > 0 ? idleSlots + tasks.length : tasks.length;\n}\n\nconsole.log(leastInterval([\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], 2)); // 8",
    "searchSignals": {
      "tags": [
        "heap",
        "greedy",
        "priority-queue"
      ],
      "keywords": [
        "task scheduler",
        "priority queue tasks",
        "reorganize string"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Task Scheduler",
        "difficulty": "Medium",
        "slug": "task-scheduler",
        "url": "https://leetcode.com/problems/task-scheduler/"
      },
      {
        "title": "Reorganize String",
        "difficulty": "Medium",
        "slug": "reorganize-string",
        "url": "https://leetcode.com/problems/reorganize-string/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Task Scheduler Editorial",
        "url": "https://leetcode.com/problems/task-scheduler/editorial/",
        "type": "LeetCode"
      }
    ]
  }
};
