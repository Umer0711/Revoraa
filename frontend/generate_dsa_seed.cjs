const fs = require('fs');
const crypto = require('crypto');

const topics = [
  { slug: 'arrays', name: 'Arrays', desc: 'Core linear data structures.' },
  { slug: 'strings', name: 'Strings', desc: 'Character sequences.' },
  { slug: 'linked-list', name: 'Linked List', desc: 'Node-based sequences.' },
  { slug: 'stack', name: 'Stack', desc: 'LIFO data structures.' },
  { slug: 'queue-deque', name: 'Queue & Deque', desc: 'FIFO and double-ended queues.' },
  { slug: 'hashing', name: 'Hashing', desc: 'Key-value maps and sets.' },
  { slug: 'binary-search', name: 'Binary Search', desc: 'Logarithmic search techniques.' },
  { slug: 'trees', name: 'Trees', desc: 'Hierarchical node structures.' },
  { slug: 'bst', name: 'BST', desc: 'Binary Search Trees.' },
  { slug: 'heap', name: 'Heap', desc: 'Priority queues.' },
  { slug: 'graphs', name: 'Graphs', desc: 'Nodes and edges.' },
  { slug: 'dynamic-programming', name: 'Dynamic Programming', desc: 'State-based optimization.' },
  { slug: 'greedy', name: 'Greedy', desc: 'Locally optimal choices.' },
  { slug: 'backtracking', name: 'Backtracking', desc: 'Exhaustive search with pruning.' },
  { slug: 'recursion', name: 'Recursion', desc: 'Self-referential functions.' },
  { slug: 'bit-manipulation', name: 'Bit Manipulation', desc: 'Bitwise operations.' },
  { slug: 'math', name: 'Math', desc: 'Mathematical algorithms.' },
  { slug: 'tries', name: 'Tries', desc: 'Prefix trees.' },
  { slug: 'segment-tree', name: 'Segment Tree', desc: 'Range queries.' },
  { slug: 'fenwick-tree', name: 'Fenwick Tree', desc: 'Binary indexed trees.' },
  { slug: 'union-find', name: 'Union Find', desc: 'Disjoint sets.' },
  { slug: 'advanced-topics', name: 'Advanced Topics', desc: 'Competitive programming algorithms.' }
];

const patternsMap = {
  'arrays': ['Traversal', 'Simulation', 'Two Pointers', 'Sliding Window', 'Prefix Sum', 'Difference Array', 'Kadane\'s Algorithm', 'Merge Intervals', 'Matrix Traversal', 'Matrix Rotation', 'Sorting Techniques', 'Binary Search on Answer', 'Coordinate Compression', 'Frequency Counting', 'Cyclic Sort', 'Bucket Sort', 'Counting Sort', 'Dutch National Flag', 'Sweep Line', 'Interval Processing'],
  'strings': ['Character Counting', 'Frequency Map', 'Sliding Window', 'Two Pointers', 'Palindrome', 'KMP', 'Z Algorithm', 'Rabin–Karp', 'Rolling Hash', 'Trie', 'String Matching', 'Manacher\'s Algorithm', 'Suffix Array', 'LCP', 'Pattern Matching', 'String Compression'],
  'linked-list': ['Fast & Slow Pointer', 'Cycle Detection', 'Reverse List', 'Reverse in Groups', 'Merge Lists', 'Dummy Node', 'Intersection', 'Middle Node', 'Random Pointer', 'LRU Cache Concepts'],
  'stack': ['Monotonic Stack', 'Expression Evaluation', 'Parentheses Validation', 'Next Greater Element', 'Previous Greater Element', 'Largest Rectangle', 'Histogram Problems', 'Min Stack', 'Infix/Postfix/Prefix'],
  'queue-deque': ['BFS Queue', 'Circular Queue', 'Monotonic Queue', 'Sliding Window Maximum', 'Priority Queue Concepts'],
  'hashing': ['Hash Maps', 'Hash Sets', 'Frequency Counting', 'Prefix Hash', 'Custom Hashing', 'Collision Concepts'],
  'binary-search': ['Classic Binary Search', 'Lower Bound', 'Upper Bound', 'Binary Search on Answer', 'Search in Rotated Array', 'Peak Element', 'Infinite Array', 'Ternary Search'],
  'trees': ['DFS', 'BFS', 'Tree Traversals', 'Diameter', 'LCA', 'Tree DP', 'Subtree', 'Euler Tour', 'Binary Lifting', 'Serialization', 'Morris Traversal'],
  'bst': ['Search', 'Insert', 'Delete', 'Floor/Ceil', 'Kth Smallest', 'BST Iterator', 'Validate BST'],
  'heap': ['Min Heap', 'Max Heap', 'Top K', 'Heap Sort', 'Median', 'Merge K Lists', 'Priority Queue'],
  'graphs': ['DFS', 'BFS', 'Flood Fill', 'Topological Sort', 'Union Find', 'Dijkstra', 'Bellman Ford', 'Floyd Warshall', 'Prim', 'Kruskal', 'MST', 'SCC', 'Tarjan', 'Kosaraju', 'Bridges', 'Articulation Points', 'Bipartite Graph', 'Cycle Detection', 'Shortest Path', 'Multi Source BFS', '0-1 BFS'],
  'dynamic-programming': ['Memoization', 'Tabulation', '1D DP', '2D DP', 'Knapsack', 'LIS', 'LCS', 'Matrix Chain Multiplication', 'Digit DP', 'Bitmask DP', 'Tree DP', 'Interval DP', 'State DP'],
  'greedy': ['Interval Scheduling', 'Huffman Coding', 'Activity Selection', 'Fractional Knapsack', 'Job Scheduling', 'Gas Station', 'Jump Game'],
  'backtracking': ['Permutations', 'Combinations', 'N Queens', 'Sudoku', 'Word Search', 'Subsets', 'Branch and Bound'],
  'recursion': ['Divide and Conquer', 'Recursion Trees', 'Tail Recursion', 'Recursive DFS'],
  'bit-manipulation': ['XOR', 'Bitmask', 'Bit Tricks', 'Subsets using Bits', 'Power of Two', 'Counting Bits'],
  'math': ['GCD', 'LCM', 'Modular Arithmetic', 'Fast Exponentiation', 'Prime Sieve', 'Combinatorics', 'Probability', 'Geometry Basics'],
  'tries': ['Prefix Search', 'Auto Complete', 'XOR Trie', 'Dictionary Search'],
  'segment-tree': ['Range Sum', 'Range Min', 'Lazy Propagation', 'Point Update'],
  'fenwick-tree': ['Prefix Queries', 'Range Queries', 'Coordinate Compression'],
  'union-find': ['DSU', 'Path Compression', 'Union by Rank', 'Dynamic Connectivity'],
  'advanced-topics': ['Suffix Array', 'Suffix Automaton', 'Sparse Table', 'Heavy Light Decomposition', 'Centroid Decomposition', 'Mo\'s Algorithm', 'Meet in the Middle', 'Convex Hull', 'Line Sweep', 'FFT', 'Network Flow']
};

let sql = `
-- Create dsa_atlas_topics table
CREATE TABLE IF NOT EXISTS public.dsa_atlas_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create dsa_atlas_patterns table
CREATE TABLE IF NOT EXISTS public.dsa_atlas_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES public.dsa_atlas_topics(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  difficulty text DEFAULT 'Medium',
  overview text,
  explanation text,
  when_to_use text,
  time_complexity text,
  space_complexity text,
  recognition_tips text[] DEFAULT '{}',
  common_mistakes text[] DEFAULT '{}',
  visual_example text,
  interview_frequency text DEFAULT 'Medium',
  related_problems text[] DEFAULT '{}',
  companies text[] DEFAULT '{}',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dsa_atlas_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_atlas_patterns ENABLE ROW LEVEL SECURITY;

-- Create Policies
DO $$ BEGIN
  CREATE POLICY "Allow public read access on topics" ON public.dsa_atlas_topics FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read access on patterns" ON public.dsa_atlas_patterns FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Truncate existing data to allow re-seeding
TRUNCATE TABLE public.dsa_atlas_patterns CASCADE;
TRUNCATE TABLE public.dsa_atlas_topics CASCADE;

`;

let sortOrder = 1;

for (const t of topics) {
  const topicId = crypto.randomUUID();
  sql += `INSERT INTO public.dsa_atlas_topics (id, slug, name, description, sort_order) VALUES ('${topicId}', '${t.slug}', '${t.name.replace(/'/g, "''")}', '${t.desc.replace(/'/g, "''")}', ${sortOrder++});\n`;
  
  const patterns = patternsMap[t.slug] || [];
  let pSortOrder = 1;
  for (const p of patterns) {
    const patternSlug = p.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const overview = `A standard algorithmic approach used within ${t.name} to solve problems relating to ${p}.`;
    const exp = `The ${p} technique helps optimize brute-force scenarios by leveraging specific invariants of the data structure.`;
    const whenToUse = `Use this pattern when dealing with ${t.name.toLowerCase()} that require efficient querying or modification.`;
    
    // Assign pseudo-random difficulty based on length
    let diff = 'Medium';
    if (p.length < 8) diff = 'Easy';
    if (p.length > 15) diff = 'Hard';

    // Assign pseudo-random frequency
    let freq = 'Medium';
    if (pSortOrder <= 3) freq = 'High';

    sql += `INSERT INTO public.dsa_atlas_patterns (topic_id, slug, name, difficulty, overview, explanation, when_to_use, time_complexity, space_complexity, recognition_tips, common_mistakes, visual_example, interview_frequency, related_problems, companies, sort_order) VALUES ('${topicId}', '${t.slug}-${patternSlug}', '${p.replace(/'/g, "''")}', '${diff}', '${overview.replace(/'/g, "''")}', '${exp.replace(/'/g, "''")}', '${whenToUse.replace(/'/g, "''")}', 'O(N)', 'O(1)', ARRAY['Look for constraints', 'Identify invariants'], ARRAY['Off-by-one errors', 'Ignoring edge cases'], 'Example logic for ${p.replace(/'/g, "''")}', '${freq}', ARRAY['Problem 1', 'Problem 2'], ARRAY['Google', 'Meta', 'Amazon'], ${pSortOrder++});\n`;
  }
}

fs.writeFileSync('/Users/anasshaikh/Desktop/OS/frontend/supabase/migrations/20240101000040_dsa_atlas_schema.sql', sql);
console.log('Migration generated successfully.');
