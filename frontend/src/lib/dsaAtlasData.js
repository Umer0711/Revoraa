export const DSA_ATLAS_DATA = [
  {
    id: 'arrays',
    topic: 'Arrays',
    description: 'A data structure consisting of a collection of elements identified by array index or key.',
    patterns: [
      {
        id: 'two-pointers',
        name: 'Two Pointers',
        difficulty: 'Easy',
        overview: 'Involves using two pointers to iterate through an array or list, usually from both ends or at different speeds.',
        explanation: 'The Two Pointers pattern is used to solve problems where we need to find a set of elements that fulfill certain constraints. We typically start one pointer at the beginning and one at the end, moving them towards each other based on conditions.',
        whenToUse: 'When dealing with sorted arrays (or linked lists) and you need to find a set of elements that fulfill certain constraints.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        recognitionTips: ['The array is sorted.', 'You need to find a pair, triplet, or subarray.', 'You need to compare elements at different positions.'],
        commonMistakes: ['Not sorting the array first (if required).', 'Incorrectly updating pointer conditions, leading to infinite loops.', 'Out of bounds errors.'],
        visualExample: 'Pointer L -> [ 1, 2, 3, 4, 5 ] <- Pointer R',
        interviewFrequency: 'High',
        relatedProblems: ['Two Sum II', '3Sum', 'Container With Most Water', 'Trapping Rain Water'],
        companies: ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft']
      },
      {
        id: 'sliding-window',
        name: 'Sliding Window',
        difficulty: 'Medium',
        overview: 'Used to perform operations on a specific window size of a given array or linked list.',
        explanation: 'A sliding window is a sublist that runs over an underlying collection. Start with a window, and slide it to the right by one element at a time to examine contiguous sequences.',
        whenToUse: 'When the problem requires finding a contiguous subarray, substring, or looking for the longest/shortest/maximum/minimum subset.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) or O(K)',
        recognitionTips: ['The problem asks for "longest", "shortest", or "maximum" contiguous sequence.', 'Deals with strings, arrays, or linked lists.'],
        commonMistakes: ['Not shrinking the window correctly from the left.', 'Off-by-one errors in window size calculation.'],
        visualExample: '[ 1, 2, 3 ] 4, 5  ->  1, [ 2, 3, 4 ] 5',
        interviewFrequency: 'High',
        relatedProblems: ['Longest Substring Without Repeating Characters', 'Minimum Size Subarray Sum', 'Sliding Window Maximum'],
        companies: ['Amazon', 'Microsoft', 'Google', 'Uber']
      },
      {
        id: 'prefix-sum',
        name: 'Prefix Sum',
        difficulty: 'Easy',
        overview: 'Precomputing cumulative sums of an array to quickly query the sum of a contiguous subarray.',
        explanation: 'By creating an array where each element at index i stores the sum of all elements from 0 to i, we can find the sum of any subarray from j to i in O(1) time: sum = prefix[i] - prefix[j-1].',
        whenToUse: 'When you need to perform multiple range sum queries on an array.',
        timeComplexity: 'O(N) for preprocessing, O(1) per query',
        spaceComplexity: 'O(N) auxiliary space (or O(1) if modifying input)',
        recognitionTips: ['Problem involves multiple sum queries over subarrays.', 'Checking if a subarray sum equals a target.'],
        commonMistakes: ['Handling the 0-th index incorrectly (usually fixed by making prefix array size N+1).'],
        visualExample: 'Arr: [1, 2, 3] -> Prefix: [1, 3, 6]. Sum of index 1 to 2 = 6 - 1 = 5.',
        interviewFrequency: 'Medium',
        relatedProblems: ['Range Sum Query - Immutable', 'Subarray Sum Equals K', 'Continuous Subarray Sum'],
        companies: ['Meta', 'Amazon', 'Google', 'ByteDance']
      }
    ]
  },
  {
    id: 'strings',
    topic: 'Strings',
    description: 'Sequences of characters used to represent text.',
    patterns: [
      {
        id: 'palindrome-checking',
        name: 'Palindrome Checking',
        difficulty: 'Easy',
        overview: 'Techniques to determine if a string reads the same forwards and backwards.',
        explanation: 'Often uses the Two Pointers pattern, starting from both ends and moving inwards, or expanding from the center.',
        whenToUse: 'When dealing with palindromic substrings or checking string symmetry.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        recognitionTips: ['Keywords: "Palindrome", "Symmetry".', 'Looking for longest palindromic substring.'],
        commonMistakes: ['Forgetting that palindromes can have even or odd lengths.', 'Case sensitivity and ignoring non-alphanumeric characters.'],
        visualExample: 'L -> r a d a r <- R',
        interviewFrequency: 'High',
        relatedProblems: ['Valid Palindrome', 'Longest Palindromic Substring', 'Palindromic Substrings'],
        companies: ['Meta', 'Amazon', 'Apple', 'Google']
      },
      {
        id: 'anagrams',
        name: 'Anagrams',
        difficulty: 'Easy',
        overview: 'Grouping or checking strings that have the exact same character frequencies.',
        explanation: 'Anagrams can be detected by sorting the strings (O(N log N)) or by counting character frequencies (O(N)) using an array of size 26 or a hash map.',
        whenToUse: 'When you need to find permutations of a string or group similar strings together.',
        timeComplexity: 'O(N * K) or O(N * K log K) where N is number of strings, K is max length',
        spaceComplexity: 'O(N * K)',
        recognitionTips: ['Keywords: "Anagram", "Permutation of characters".'],
        commonMistakes: ['Using sorting when character counting is much faster.', 'Not handling Unicode characters properly if applicable.'],
        visualExample: '"listen" -> {l:1, i:1, s:1, t:1, e:1, n:1} <- "silent"',
        interviewFrequency: 'Medium',
        relatedProblems: ['Valid Anagram', 'Group Anagrams', 'Find All Anagrams in a String'],
        companies: ['Amazon', 'Microsoft', 'Bloomberg', 'Google']
      }
    ]
  },
  {
    id: 'linked-list',
    topic: 'Linked List',
    description: 'A linear collection of data elements whose order is not given by their physical placement in memory.',
    patterns: [
      {
        id: 'fast-and-slow-pointers',
        name: 'Fast & Slow Pointers (Tortoise and Hare)',
        difficulty: 'Medium',
        overview: 'Using two pointers moving at different speeds to detect cycles or find midpoints.',
        explanation: 'By advancing one pointer by 1 step and the other by 2 steps, they will eventually meet if a cycle exists. It is also useful for finding the middle of a linked list in one pass.',
        whenToUse: 'Cycle detection, finding the middle element, finding the N-th node from the end.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        recognitionTips: ['Problem involves finding a cycle.', 'Problem asks to find the middle of a linked list.', 'Restrictions on space complexity (O(1)).'],
        commonMistakes: ['Null pointer exceptions when advancing the fast pointer (e.g., `fast.next.next`).'],
        visualExample: 'S moves 1, F moves 2. If F == S, cycle exists.',
        interviewFrequency: 'High',
        relatedProblems: ['Linked List Cycle', 'Middle of the Linked List', 'Palindrome Linked List', 'Find the Duplicate Number'],
        companies: ['Microsoft', 'Amazon', 'Apple', 'Google']
      },
      {
        id: 'in-place-reversal',
        name: 'In-place Reversal of a LinkedList',
        difficulty: 'Medium',
        overview: 'Reversing links between nodes of a linked list without using extra space.',
        explanation: 'Requires manipulating `next` pointers using a few temporary variables (`prev`, `current`, `next`) to reverse the list in a single pass.',
        whenToUse: 'When you need to reverse a linked list or parts of it without using extra memory.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        recognitionTips: ['Problem asks to reverse the whole list or a sub-list (e.g., reverse from m to n).', 'Reverse in groups of k.'],
        commonMistakes: ['Losing track of the original `next` node, breaking the list.', 'Incorrectly handling the head or tail connections.'],
        visualExample: '1 -> 2 -> 3  =>  1 <- 2 <- 3',
        interviewFrequency: 'High',
        relatedProblems: ['Reverse Linked List', 'Reverse Linked List II', 'Reverse Nodes in k-Group'],
        companies: ['Amazon', 'Microsoft', 'Meta', 'Apple']
      }
    ]
  },
  {
    id: 'trees',
    topic: 'Trees',
    description: 'A widely used abstract data type that simulates a hierarchical tree structure.',
    patterns: [
      {
        id: 'tree-bfs',
        name: 'Tree Breadth First Search (BFS)',
        difficulty: 'Medium',
        overview: 'Traversing a tree level by level using a Queue.',
        explanation: 'BFS explores the tree level by level. It pushes the root to a queue, and while the queue is not empty, pops the front, processes it, and pushes its children.',
        whenToUse: 'When the problem asks for level-order traversal, finding the shortest path, or processing nodes depth-wise.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N) (queue size can be up to N/2)',
        recognitionTips: ['Keywords: "Level order", "Shortest path", "Minimum depth".'],
        commonMistakes: ['Forgetting to record the queue size at the start of a level iteration.', 'Pushing null nodes to the queue.'],
        visualExample: 'Level 1: Root -> Level 2: Children -> Level 3: Grandchildren',
        interviewFrequency: 'High',
        relatedProblems: ['Binary Tree Level Order Traversal', 'Minimum Depth of Binary Tree', 'Binary Tree Right Side View'],
        companies: ['Amazon', 'Microsoft', 'Meta', 'Google', 'LinkedIn']
      },
      {
        id: 'tree-dfs',
        name: 'Tree Depth First Search (DFS)',
        difficulty: 'Medium',
        overview: 'Traversing a tree by exploring as far as possible along each branch before backtracking.',
        explanation: 'DFS can be implemented recursively or iteratively using a Stack. Sub-patterns include Pre-order, In-order, and Post-order traversals.',
        whenToUse: 'When searching the entire tree, finding paths, or when the answer lies near the leaves.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(H) where H is tree height (recursive stack)',
        recognitionTips: ['Keywords: "Path sum", "All paths", "Maximum depth", "Lowest Common Ancestor".'],
        commonMistakes: ['Not returning the correct value from recursive calls.', 'Incorrect base cases (e.g., handling null nodes).'],
        visualExample: 'Root -> Left Child -> Left Grandchild -> backtrack...',
        interviewFrequency: 'Very High',
        relatedProblems: ['Maximum Depth of Binary Tree', 'Path Sum', 'Lowest Common Ancestor of a Binary Tree', 'Serialize and Deserialize Binary Tree'],
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple']
      }
    ]
  },
  {
    id: 'graphs',
    topic: 'Graphs',
    description: 'A non-linear data structure consisting of nodes and edges.',
    patterns: [
      {
        id: 'topological-sort',
        name: 'Topological Sort',
        difficulty: 'Medium',
        overview: 'Finding a linear ordering of vertices such that for every directed edge U->V, vertex U comes before V.',
        explanation: 'Often implemented using Kahn\'s Algorithm (BFS with In-degree array) or DFS with a visited and visiting set.',
        whenToUse: 'When dealing with dependencies or prerequisites scheduling.',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V + E)',
        recognitionTips: ['Keywords: "Prerequisites", "Dependencies", "Scheduling", "Order of tasks".'],
        commonMistakes: ['Failing to detect cycles (Topological sort is impossible in cyclic graphs).', 'Not initializing the in-degree array correctly.'],
        visualExample: 'A -> B -> C. Order: A, B, C',
        interviewFrequency: 'High',
        relatedProblems: ['Course Schedule', 'Course Schedule II', 'Alien Dictionary'],
        companies: ['Google', 'Amazon', 'Microsoft', 'Uber']
      },
      {
        id: 'union-find',
        name: 'Union Find (Disjoint Set)',
        difficulty: 'Medium',
        overview: 'A data structure that keeps track of a set of elements partitioned into a number of disjoint subsets.',
        explanation: 'Supports two operations: Find (determine which subset an element is in) and Union (join two subsets into a single subset). Often optimized with Path Compression and Union by Rank.',
        whenToUse: 'When finding connected components, detecting cycles in undirected graphs, or maintaining group relationships.',
        timeComplexity: 'O(a(N)) amortized nearly O(1) per operation',
        spaceComplexity: 'O(N)',
        recognitionTips: ['Keywords: "Connected components", "Groupings", "Dynamic connectivity".'],
        commonMistakes: ['Forgetting path compression, leading to O(N) find operations.', 'Initializing the parent array incorrectly.'],
        visualExample: 'Union(1, 2), Union(2, 3) -> 1, 2, and 3 are in the same set. Find(1) == Find(3).',
        interviewFrequency: 'Medium',
        relatedProblems: ['Number of Connected Components in an Undirected Graph', 'Redundant Connection', 'Accounts Merge'],
        companies: ['Google', 'Meta', 'Amazon']
      }
    ]
  },
  {
    id: 'dynamic-programming',
    topic: 'Dynamic Programming',
    description: 'Solving complex problems by breaking them down into simpler subproblems and storing the results.',
    patterns: [
      {
        id: '0-1-knapsack',
        name: '0/1 Knapsack',
        difficulty: 'Hard',
        overview: 'Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value.',
        explanation: 'Every item can either be included or excluded. We build a 2D DP table dp[i][w] representing max value using first i items and weight limit w, or a 1D array optimizing space.',
        whenToUse: 'Optimization problems involving combinations, subset sums, or choosing items with constraints.',
        timeComplexity: 'O(N * W)',
        spaceComplexity: 'O(W)',
        recognitionTips: ['Keywords: "Maximize value", "Given capacity", "Subset sum".'],
        commonMistakes: ['Iterating the weight limit in the wrong direction when optimizing space to 1D (must iterate backwards to avoid reusing the same item).'],
        visualExample: 'DP[w] = max(DP[w], DP[w - weight[i]] + value[i])',
        interviewFrequency: 'High',
        relatedProblems: ['Partition Equal Subset Sum', 'Target Sum', 'Ones and Zeroes'],
        companies: ['Amazon', 'Google', 'Microsoft']
      },
      {
        id: 'longest-common-subsequence',
        name: 'Longest Common Subsequence (LCS)',
        difficulty: 'Medium',
        overview: 'Finding the longest subsequence present in given two sequences in the same order.',
        explanation: 'Uses a 2D DP table where dp[i][j] represents the LCS of string1[0..i] and string2[0..j]. If chars match, dp[i][j] = 1 + dp[i-1][j-1], else max(dp[i-1][j], dp[i][j-1]).',
        whenToUse: 'Comparing two strings for similarity, edits, or commonalities.',
        timeComplexity: 'O(N * M)',
        spaceComplexity: 'O(N * M) or O(min(N, M))',
        recognitionTips: ['Comparing two strings.', 'Keywords: "Subsequence", "Edit distance".'],
        commonMistakes: ['Confusing subsequence (not necessarily contiguous) with substring (contiguous).'],
        visualExample: 'LCS of "abcde" and "ace" is "ace".',
        interviewFrequency: 'Medium',
        relatedProblems: ['Longest Common Subsequence', 'Edit Distance', 'Distinct Subsequences'],
        companies: ['Amazon', 'Microsoft', 'Bloomberg']
      }
    ]
  },
  {
    id: 'backtracking',
    topic: 'Backtracking',
    description: 'An algorithmic-technique for solving problems recursively by trying to build a solution incrementally.',
    patterns: [
      {
        id: 'subsets-permutations',
        name: 'Subsets / Permutations / Combinations',
        difficulty: 'Medium',
        overview: 'Generating all possible groupings, orderings, or selections of elements.',
        explanation: 'Recursively explore choices. Add the choice to the current path, make a recursive call, and then "backtrack" by removing the choice from the current path to explore other options.',
        whenToUse: 'When the problem asks for "all possible" configurations, combinations, or permutations.',
        timeComplexity: 'O(2^N) for subsets, O(N!) for permutations',
        spaceComplexity: 'O(N) recursion stack',
        recognitionTips: ['Keywords: "All permutations", "All subsets", "Combinations".', 'N is usually small (N < 20).'],
        commonMistakes: ['Forgetting to backtrack (remove the element) after the recursive call.', 'Not handling duplicates correctly when generating unique subsets.'],
        visualExample: 'Path: [1] -> recurse -> Path: [1, 2] -> backtrack -> Path: [1] -> Path: [1, 3]...',
        interviewFrequency: 'High',
        relatedProblems: ['Subsets', 'Permutations', 'Combination Sum', 'Letter Combinations of a Phone Number'],
        companies: ['Meta', 'Amazon', 'Microsoft', 'Google', 'Apple']
      }
    ]
  },
  {
    id: 'binary-search',
    topic: 'Binary Search',
    description: 'A search algorithm that finds the position of a target value within a sorted array.',
    patterns: [
      {
        id: 'bs-on-answer',
        name: 'Binary Search on Answer',
        difficulty: 'Hard',
        overview: 'Applying binary search not on indices, but on the potential answer range.',
        explanation: 'If we know the answer lies in range [L, R] and we have a monotonic condition (if X is possible, X+1 is also possible), we can binary search the answer. We need a helper `isValid(mid)` function.',
        whenToUse: 'When finding a minimum of a maximum (or max of min), or optimizing a monotonic property.',
        timeComplexity: 'O(N log(Range))',
        spaceComplexity: 'O(1)',
        recognitionTips: ['Keywords: "Minimum possible maximum", "Monotonically increasing/decreasing".'],
        commonMistakes: ['Incorrect loop invariants leading to infinite loops.', 'Helper function `isValid` taking too long.'],
        visualExample: 'Range [1, 100]. Is 50 valid? Yes -> Search [1, 49]. No -> Search [51, 100].',
        interviewFrequency: 'Medium',
        relatedProblems: ['Koko Eating Bananas', 'Split Array Largest Sum', 'Capacity To Ship Packages Within D Days'],
        companies: ['Google', 'Meta', 'Amazon', 'ByteDance']
      }
    ]
  },
  {
    id: 'heap',
    topic: 'Heap / Priority Queue',
    description: 'A specialized tree-based data structure that satisfies the heap property.',
    patterns: [
      {
        id: 'top-k-elements',
        name: 'Top K Elements',
        difficulty: 'Medium',
        overview: 'Finding the top, smallest, or most frequent K elements in a collection.',
        explanation: 'Maintain a Min-Heap of size K for "Top K Largest" elements, or a Max-Heap for "Top K Smallest". When a new element comes, push it in and pop the top if size exceeds K.',
        whenToUse: 'When dealing with "Kth largest/smallest" or "Top K frequent" elements.',
        timeComplexity: 'O(N log K)',
        spaceComplexity: 'O(K)',
        recognitionTips: ['Keywords: "Top K", "Kth largest", "Most frequent".'],
        commonMistakes: ['Using a Max-Heap for Kth largest instead of Min-Heap (Max-Heap would require size N).', 'Not implementing custom comparators correctly.'],
        visualExample: 'Stream: 3, 1, 4, 2. K=2 (Largest). Min-Heap contains [3, 4].',
        interviewFrequency: 'High',
        relatedProblems: ['Kth Largest Element in an Array', 'Top K Frequent Elements', 'Find K Pairs with Smallest Sums'],
        companies: ['Amazon', 'Meta', 'Google', 'Microsoft']
      }
    ]
  }
];
