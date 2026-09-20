/**
 * Revoraa DSA Atlas - Arrays Patterns (20 Patterns)
 */

export const arraysPatterns = {
  'Traversal': {
    slug: 'arrays-traversal',
    name: 'Traversal',
    topic: 'Arrays',
    difficulty: 'Easy',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    interviewFrequency: 'High',
    en: {
      title: 'Array Traversal',
      overview: 'Visiting each element in a sequential contiguous array exactly once from start to end.',
      whatItIs: 'Linear iteration technique accessing every index [0..N-1] sequentially using loop indices or iterators.',
      whyItWorks: 'Arrays provide contiguous memory locations with O(1) random access via pointer offset arithmetic.',
      whenToUse: 'Inspecting, filtering, mapping, finding min/max, or accumulating sums without pre-sorted order assumptions.',
      recognitionSignals: ['Inspect every item in array', 'Compute running totals or maximum/minimum elements', 'Brute force checking all elements'],
      commonMistakes: ['Off-by-one errors (i <= N instead of i < N)', 'Modifying array length during loop iteration', 'Accessing undefined index out of bounds'],
      stepLogic: '1. Initialize loop counter i = 0.\n2. In each iteration, access nums[i] and evaluate condition.\n3. Terminate when i reaches array length.'
    },
    hi: {
      title: 'Array Traversal',
      overview: 'Array ke har ek element ko 0 se N-1 index tak sequentially ek bar visit karna.',
      whatItIs: 'Ek buniyadi linear loop technique jisme har index par jakar value ko inspect ya update kiya jata hai.',
      whyItWorks: 'Array elements contiguous memory blocks mein store hote hain, isliye O(1) mein index calculate karke access milta hai.',
      whenToUse: 'Jab array ke sabhi elements ka sum, min, max nikalna ho ya filter karna ho.',
      recognitionSignals: ['Har ek item ko check karna zaroori ho', 'Sum ya min/max calculate karna ho'],
      commonMistakes: ['Off-by-one loop boundary (i <= arr.length use karna)', 'Loop ke dauran array ka size change karna'],
      stepLogic: '1. Counter i = 0 set karo.\n2. nums[i] ko read karo aur required condition check karo.\n3. i < arr.length tak loop chalao.'
    },
    visual: {
      type: 'ARRAY',
      category: 'ARRAYS',
      title: 'Array Traversal Iteration',
      input: [2, 5, 8, 11],
      description: 'Sequentially access indices 0 through 3 in O(N) time.',
      description_hi: 'Index 0 se 3 tak sequentially visit karein.',
      steps: [
        { activeIdx: 0, elements: [2, 5, 8, 11], explanation: 'Inspect index 0 (val = 2)', explanation_hi: 'Index 0 par jao (value = 2)' },
        { activeIdx: 1, elements: [2, 5, 8, 11], explanation: 'Inspect index 1 (val = 5)', explanation_hi: 'Index 1 par jao (value = 5)' },
        { activeIdx: 2, elements: [2, 5, 8, 11], explanation: 'Inspect index 2 (val = 8)', explanation_hi: 'Index 2 par jao (value = 8)' },
        { activeIdx: 3, elements: [2, 5, 8, 11], explanation: 'Inspect index 3 (val = 11)', explanation_hi: 'Index 3 par jao (value = 11)' }
      ],
      result: [4, 10, 16, 22]
    },
    code: `function traverseArray(nums) {
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    result.push(nums[i] * 2);
  }
  return result;
}

const arr = [2, 5, 8, 11];
console.log(traverseArray(arr)); // [4, 10, 16, 22]`,
    searchSignals: {
      tags: ['array', 'iteration'],
      keywords: ['traverse', 'array iterate', 'linear scan'],
      companies: ['Amazon', 'Microsoft', 'Google', 'Adobe']
    },
    relatedCanonical: [
      { title: 'Two Sum', difficulty: 'Easy', slug: 'two-sum', url: 'https://leetcode.com/problems/two-sum/' },
      { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', slug: 'best-time-to-buy-and-sell-stock', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' }
    ],
    externalResources: [
      { name: 'GeeksforGeeks - Array Traversal', url: 'https://www.geeksforgeeks.org/array-data-structure/', type: 'GFG' },
      { name: 'LeetCode Explore - Array 101', url: 'https://leetcode.com/explore/learn/card/fun-with-arrays/', type: 'LeetCode' }
    ]
  },

  'Two Pointers': {
    slug: 'arrays-two-pointers',
    name: 'Two Pointers',
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    interviewFrequency: 'High',
    en: {
      title: 'Two Pointers (Opposite Ends)',
      overview: 'Traversing a sorted array from both extremes towards the center to find pair conditions in O(N).',
      whatItIs: 'An optimization technique using dual indices (Left at 0, Right at N-1) moving inward based on comparison with target.',
      whyItWorks: 'Because elements are sorted, moving left increases sum while moving right decreases sum, eliminating entire search quadrants monotonically.',
      whenToUse: 'Sorted arrays searching for pairs/triplets with target sum, trapping rain water, container with most water.',
      recognitionSignals: ['Sorted array searching for a pair', 'Comparing opposite ends (e.g. palindrome check)', 'Minimizing or maximizing boundary rectangles'],
      commonMistakes: ['Applying two pointers on unsorted data without sorting first', 'Infinite while loop when pointers fail to increment/decrement', 'Pointer crossover bugs (left <= right vs left < right)'],
      stepLogic: '1. Initialize left = 0, right = length - 1.\n2. Calculate currentSum = nums[left] + nums[right].\n3. If currentSum === target, return pair.\n4. If currentSum < target, advance left.\n5. Else, decrement right.'
    },
    hi: {
      title: 'Two Pointers (Opposite Ends)',
      overview: 'Sorted array mein do pointers (L aur R) ko opposite sides se center ki taraf move karke O(N) time mein target dhoondhna.',
      whatItIs: 'Dual index technique jisme left pointer index 0 par aur right pointer index N-1 par hota hai.',
      whyItWorks: 'Kyunki array sorted hai, left aage badhane se sum badhta hai aur right peeche lene se sum ghatta hai.',
      whenToUse: 'Jab sorted array mein target sum wale pairs, triplets, ya boundaries calculate karni ho.',
      recognitionSignals: ['Sorted array mein do numbers ka sum chahiye', 'Opposite ends compare karne ho'],
      commonMistakes: ['Unsorted array par bina sort kiye pointers chala dena', 'While loop condition mein left < right ke badle off-by-one mistake karna'],
      stepLogic: '1. left = 0 aur right = N - 1 rakhein.\n2. sum = nums[left] + nums[right] check karo.\n3. sum < target hai toh left++, warna right--.'
    },
    visual: {
      type: 'POINTERS',
      category: 'ARRAYS',
      title: 'Two Pointers (Opposite Ends)',
      input: [1, 2, 4, 7, 9],
      description: 'Find pair with target sum 11 using inward pointer movements.',
      description_hi: 'Pointers ko move karke target sum 11 wala pair dhoondhein.',
      steps: [
        { left: 0, right: 4, elements: [1, 2, 4, 7, 9], target: 11, explanation: '1 + 9 = 10 < 11 -> Move Left pointer rightwards', explanation_hi: '1 + 9 = 10 < 11 -> Left pointer right move karo' },
        { left: 1, right: 4, elements: [1, 2, 4, 7, 9], target: 11, explanation: '2 + 9 = 11 === 11 -> Target pair found: [2, 9]!', explanation_hi: '2 + 9 = 11 === 11 -> Target pair mil gaya: [2, 9]!' }
      ],
      result: [2, 9]
    },
    code: `function twoSumSorted(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}

console.log(twoSumSorted([1, 2, 4, 7, 9], 11)); // [2, 5] (1-indexed)`,
    searchSignals: {
      tags: ['two-pointers', 'array'],
      keywords: ['two sum', 'left right pointer', 'opposite ends', 'two pointers'],
      companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Apple']
    },
    relatedCanonical: [
      { title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', slug: 'two-sum-ii-input-array-is-sorted', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { title: '3Sum', difficulty: 'Medium', slug: '3sum', url: 'https://leetcode.com/problems/3sum/' },
      { title: 'Container With Most Water', difficulty: 'Medium', slug: 'container-with-most-water', url: 'https://leetcode.com/problems/container-with-most-water/' }
    ],
    externalResources: [
      { name: 'LeetCode Two Pointers Guide', url: 'https://leetcode.com/explore/learn/card/array-and-string/205/array-two-pointer-technique/', type: 'LeetCode' },
      { name: 'GeeksforGeeks - Two Pointers Technique', url: 'https://www.geeksforgeeks.org/two-pointers-technique/', type: 'GFG' }
    ]
  },

  'Sliding Window': {
    slug: 'arrays-sliding-window',
    name: 'Sliding Window',
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K)',
    interviewFrequency: 'High',
    en: {
      title: 'Sliding Window',
      overview: 'Maintaining a dynamic or fixed-length contiguous subarray window across an array in linear O(N) time.',
      whatItIs: 'An algorithm where two boundaries (start and end) expand to incorporate new items and contract to satisfy problem constraints.',
      whyItWorks: 'Instead of recalculating the entire window sum/frequency in O(K) each time, we add the incoming element and subtract the outgoing element in O(1).',
      whenToUse: 'Contiguous subarray problems finding maximum/minimum sum of size K, longest substring with distinct characters, or minimum window substring.',
      recognitionSignals: ['Problem specifies contiguous subarray or substring', 'Keywords: "maximum sum of size K", "longest with at most K distinct"', 'Nested loop O(N^2) can be converted to linear scan'],
      commonMistakes: ['Shrinking window before recording valid optimal metric', 'Not decrementing frequency counters when contracting left boundary', 'Using nested loops rather than moving start pointer'],
      stepLogic: '1. Initialize winStart = 0, currentSum = 0.\n2. Iterate winEnd from 0 to N-1, adding nums[winEnd].\n3. If window exceeds constraint, subtract nums[winStart] and increment winStart.\n4. Record max/min metric.'
    },
    hi: {
      title: 'Sliding Window',
      overview: 'Contiguous subarray par ek moving window maintain karke linear O(N) time mein optimum calculation karna.',
      whatItIs: 'Do pointers (start aur end) se ek window maintain hoti hai jo right side se badhti hai aur constraint tootne par left side se shrink hoti hai.',
      whyItWorks: 'Har bar pura window sum nikalne ke bajaye sirf aane wale element ko add aur nikalne wale element ko subtract karke O(1) update milta hai.',
      whenToUse: 'Contiguous subarray ya substring ke problems mein jahan size K ka maximum sum ya longest unique substring chahiye ho.',
      recognitionSignals: ['Contiguous subarray/substring diya gaya ho', 'Window size k ya minimum window poochi ho'],
      commonMistakes: ['Left pointer aage badhate waqt frequency map ko update na karna', 'Window shrink karne ki condition galat lagana'],
      stepLogic: '1. winStart = 0 rakhein.\n2. winEnd ko right move karke element add karo.\n3. Constraint tootne par winStart badhao aur left element subtract karo.'
    },
    visual: {
      type: 'SLIDING_WINDOW',
      category: 'ARRAYS',
      title: 'Sliding Window (Size k=3)',
      input: [2, 1, 5, 1, 3, 2],
      description: 'Slide window of size 3 across the array to find maximum window sum.',
      description_hi: 'Size 3 ki window slide karke maximum sum dhoondhein.',
      steps: [
        { winStart: 0, winEnd: 2, windowSum: 8, elements: [2, 1, 5, 1, 3, 2], explanation: 'Initial window [2, 1, 5], sum = 8', explanation_hi: 'Pehli window [2, 1, 5], sum = 8' },
        { winStart: 1, winEnd: 3, windowSum: 7, elements: [2, 1, 5, 1, 3, 2], explanation: 'Slide right: subtract 2, add 1 -> [1, 5, 1], sum = 7', explanation_hi: 'Window slide ki: 2 nikala, 1 joda -> sum = 7' },
        { winStart: 2, winEnd: 4, windowSum: 9, elements: [2, 1, 5, 1, 3, 2], explanation: 'Slide right: subtract 1, add 3 -> [5, 1, 3], sum = 9 (Max)', explanation_hi: 'Window slide ki: 1 nikala, 3 joda -> sum = 9 (Max)' }
      ],
      result: 9
    },
    code: `function maxSubarraySum(nums, k) {
  let maxSum = 0, windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  maxSum = windowSum;

  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}

console.log(maxSubarraySum([2, 1, 5, 1, 3, 2], 3)); // 9`,
    searchSignals: {
      tags: ['sliding-window', 'array'],
      keywords: ['sliding window', 'longest substring', 'max consecutive', 'window sum'],
      companies: ['Amazon', 'Meta', 'Microsoft', 'Google', 'Bloomberg']
    },
    relatedCanonical: [
      { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', slug: 'longest-substring-without-repeating-characters', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { title: 'Minimum Window Substring', difficulty: 'Hard', slug: 'minimum-window-substring', url: 'https://leetcode.com/problems/minimum-window-substring/' },
      { title: 'Sliding Window Maximum', difficulty: 'Hard', slug: 'sliding-window-maximum', url: 'https://leetcode.com/problems/sliding-window-maximum/' }
    ],
    externalResources: [
      { name: 'LeetCode Sliding Window Patterns', url: 'https://leetcode.com/discuss/general-discussion/657507/sliding-window-for-beginners-problems-template-sample-solutions', type: 'LeetCode' },
      { name: 'GeeksforGeeks - Window Sliding Technique', url: 'https://www.geeksforgeeks.org/window-sliding-technique/', type: 'GFG' }
    ]
  },

  'Prefix Sum': {
    slug: 'arrays-prefix-sum',
    name: 'Prefix Sum',
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(N) precompute, O(1) query',
    spaceComplexity: 'O(N)',
    interviewFrequency: 'High',
    en: {
      title: 'Prefix Sum Array',
      overview: 'Precomputing cumulative sums so any range sum query [L..R] can be answered in O(1) time.',
      whatItIs: 'An auxiliary array where prefix[i] stores the sum of all elements from index 0 to i-1.',
      whyItWorks: 'Range sum from L to R equals prefix[R + 1] - prefix[L], turning repetitive O(N) range queries into O(1) subtraction.',
      whenToUse: 'Frequent subarray sum queries, counting subarrays divisible by K, subarray sum equals K (with hashmap).',
      recognitionSignals: ['Multiple range sum queries on static array', 'Finding subarrays summing to target K', 'Equilibrium index or pivot point'],
      commonMistakes: ['Off-by-one indexing when subtracting prefix[L]', 'Using standard 32-bit integer when cumulative sums overflow', 'Forgetting base case prefix[0] = 0 in hashmap lookups'],
      stepLogic: '1. Create prefix array of size N + 1 with prefix[0] = 0.\n2. For each index i, prefix[i+1] = prefix[i] + nums[i].\n3. Answer rangeSum(L, R) = prefix[R+1] - prefix[L].'
    },
    hi: {
      title: 'Prefix Sum Array',
      overview: 'Cumulative sum pehle se calculate karke rakhna taaki kisi bhi range [L..R] ka sum O(1) mein nikal sake.',
      whatItIs: 'Ek extra array jisme prefix[i] index 0 se i-1 tak ke elements ka total sum rakhta hai.',
      whyItWorks: 'L se R tak ka sum prefix[R+1] - prefix[L] ke barabar hota hai, jo O(1) math operation hai.',
      whenToUse: 'Range sum queries, subarray sum equals K (hashmap ke sath), pivot index dhoondhne ke liye.',
      recognitionSignals: ['Range queries bar bar poochi ja rahi ho', 'Subarray sum equals k problem ho'],
      commonMistakes: ['prefix[L] subtract karte waqt index galat lena', 'Hashmap mein initial sum 0 ki frequency 1 na daalna'],
      stepLogic: '1. prefix[0] = 0 se array banayein.\n2. prefix[i+1] = prefix[i] + nums[i] calculate karein.\n3. Query sum(L, R) = prefix[R+1] - prefix[L].'
    },
    visual: {
      type: 'ARRAY',
      category: 'ARRAYS',
      title: 'Prefix Sum Cumulative Array',
      input: [3, 1, 4, 1, 5],
      description: 'prefix[i+1] = prefix[i] + nums[i]. Query [1..3] = prefix[4] - prefix[1] = 9 - 3 = 6.',
      description_hi: 'Cumulative sum array. Range [1..3] ka sum = 9 - 3 = 6.',
      steps: [
        { activeIdx: 0, elements: [0, 3, 4, 8, 9, 14], explanation: 'Precomputed prefix sum: [0, 3, 4, 8, 9, 14]', explanation_hi: 'Cumulative prefix sum array tayyar hai: [0, 3, 4, 8, 9, 14]' }
      ],
      result: [0, 3, 4, 8, 9, 14]
    },
    code: `class PrefixSum {
  constructor(nums) {
    this.prefix = [0];
    for (let i = 0; i < nums.length; i++) {
      this.prefix.push(this.prefix[i] + nums[i]);
    }
  }
  query(left, right) {
    return this.prefix[right + 1] - this.prefix[left];
  }
}

const ps = new PrefixSum([3, 1, 4, 1, 5]);
console.log(ps.query(1, 3)); // 1 + 4 + 1 = 6`,
    searchSignals: {
      tags: ['prefix-sum', 'array'],
      keywords: ['prefix sum', 'range sum', 'subarray sum equals k'],
      companies: ['Google', 'Meta', 'Amazon', 'Adobe']
    },
    relatedCanonical: [
      { title: 'Subarray Sum Equals K', difficulty: 'Medium', slug: 'subarray-sum-equals-k', url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
      { title: 'Product of Array Except Self', difficulty: 'Medium', slug: 'product-of-array-except-self', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { title: 'Find Pivot Index', difficulty: 'Easy', slug: 'find-pivot-index', url: 'https://leetcode.com/problems/find-pivot-index/' }
    ],
    externalResources: [
      { name: 'CP-Algorithms - Prefix Sum', url: 'https://cp-algorithms.com/data_structures/fenwick.html', type: 'CP-Algo' },
      { name: 'GeeksforGeeks - Prefix Sum Array', url: 'https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/', type: 'GFG' }
    ]
  },

  'Difference Array': {
    slug: 'arrays-difference-array',
    name: 'Difference Array',
    topic: 'Arrays',
    difficulty: 'Hard',
    timeComplexity: 'O(1) update, O(N) restore',
    spaceComplexity: 'O(N)',
    interviewFrequency: 'Medium',
    en: {
      title: 'Difference Array',
      overview: 'Executing multiple range addition queries in O(1) per update, reconstructing the array via prefix sum in O(N).',
      whatItIs: 'An array where diff[i] = nums[i] - nums[i-1]. Range update [L..R] by val is achieved with diff[L] += val and diff[R+1] -= val.',
      whyItWorks: 'Adding val at L propagates through all prefix sums after L. Subtracting val at R+1 cancels the propagation beyond R.',
      whenToUse: 'Offline range update queries on arrays, hotel bookings, corporate flight bookings, car pooling.',
      recognitionSignals: ['Multiple queries adding values across subsegments [L..R]', 'Offline queries known in advance', 'Corporate flight bookings / car pooling'],
      commonMistakes: ['Updating diff[R] instead of diff[R+1]', 'Index out of bounds when R+1 equals array length', 'Forgetting to perform prefix sum to get final values'],
      stepLogic: '1. Create diff array of size N + 1.\n2. For update(L, R, val): diff[L] += val, diff[R+1] -= val.\n3. Final pass: compute prefix sum of diff array.'
    },
    hi: {
      title: 'Difference Array',
      overview: 'Range addition updates ko O(1) time mein execute karna aur end mein O(N) prefix sum se array nikalna.',
      whatItIs: 'Ek auxiliary array jahan range [L..R] mein +val add karne ke liye diff[L] += val aur diff[R+1] -= val kiya jata hai.',
      whyItWorks: 'diff[L] ka addition aage tak propagate hota hai aur diff[R+1] ka subtraction use R ke baad cancel kar deta hai.',
      whenToUse: 'Flight bookings, car pooling, multiple range addition queries ke liye.',
      recognitionSignals: ['Range [L..R] mein value add karne ki multiple queries ho', 'Offline batch updates'],
      commonMistakes: ['diff[R] update karna jabki diff[R+1] karna chahiye', 'R+1 par index out of bounds check na lagana'],
      stepLogic: '1. diff array banayein.\n2. diff[L] += val aur diff[R+1] -= val karein.\n3. Prefix sum se final array reconstruct karein.'
    },
    visual: {
      type: 'DIFFERENCE_ARRAY',
      category: 'ARRAYS',
      title: 'Difference Array Range Updates',
      input: [0, 0, 0, 0, 0],
      description: 'Update range [1..3] by +3: diff[1] += 3, diff[4] -= 3. Prefix sum reconstructs [0, 3, 3, 3, 0].',
      description_hi: 'Range [1..3] mein +3 update: diff[1] += 3, diff[4] -= 3.',
      steps: [
        { diff: [0, 3, 0, 0, -3], reconstructed: [0, 3, 3, 3, 0], explanation: 'O(1) boundary updates completed. Prefix sum reconstructs updated array.', explanation_hi: 'Boundary updates O(1) mein complete. Prefix sum se updated array ban gaya.' }
      ],
      result: [0, 3, 3, 3, 0]
    },
    code: `function applyRangeUpdates(n, updates) {
  const diff = new Array(n + 1).fill(0);
  for (const [start, end, val] of updates) {
    diff[start] += val;
    diff[end + 1] -= val;
  }
  const result = new Array(n);
  let curr = 0;
  for (let i = 0; i < n; i++) {
    curr += diff[i];
    result[i] = curr;
  }
  return result;
}

console.log(applyRangeUpdates(5, [[1, 3, 3]])); // [0, 3, 3, 3, 0]`,
    searchSignals: {
      tags: ['prefix-sum', 'difference-array', 'array'],
      keywords: ['difference array', 'range addition', 'corporate flight bookings', 'car pooling'],
      companies: ['Google', 'Codeforces', 'Atlassian']
    },
    relatedCanonical: [
      { title: 'Corporate Flight Bookings', difficulty: 'Medium', slug: 'corporate-flight-bookings', url: 'https://leetcode.com/problems/corporate-flight-bookings/' },
      { title: 'Car Pooling', difficulty: 'Medium', slug: 'car-pooling', url: 'https://leetcode.com/problems/car-pooling/' }
    ],
    externalResources: [
      { name: 'GeeksforGeeks - Difference Array', url: 'https://www.geeksforgeeks.org/difference-array-range-update-query-o1/', type: 'GFG' }
    ]
  },

  "Kadane's Algorithm": {
    slug: 'arrays-kadane-s-algorithm',
    name: "Kadane's Algorithm",
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    interviewFrequency: 'High',
    en: {
      title: "Kadane's Algorithm",
      overview: 'Linear dynamic programming algorithm to locate the contiguous subarray with maximum sum in O(N).',
      whatItIs: 'At each index i, decide whether to append nums[i] to current sum or start a fresh subarray at nums[i].',
      whyItWorks: 'If the running sum becomes negative, continuing it will only decrease any subsequent subarray sum, so resetting to 0 is always optimal.',
      whenToUse: 'Maximum contiguous subarray sum, maximum circular subarray sum, maximum product subarray (with sign tracking).',
      recognitionSignals: ['Find maximum sum contiguous subarray', 'Array contains both positive and negative integers', 'Single pass O(N) with O(1) space constraint'],
      commonMistakes: ['Initializing max sum to 0 when all elements are negative (should be -Infinity)', 'Resetting sum too early before comparing with global max'],
      stepLogic: '1. Initialize maxEndingHere = nums[0], maxSoFar = nums[0].\n2. For each element: maxEndingHere = max(nums[i], maxEndingHere + nums[i]).\n3. maxSoFar = max(maxSoFar, maxEndingHere).'
    },
    hi: {
      title: "Kadane's Algorithm",
      overview: 'Contiguous subarray ka maximum sum nikalne ka standard linear O(N) algorithm.',
      whatItIs: 'Har index par decide karte hain ki purana sum continue karein ya current element se naya subarray shuru karein.',
      whyItWorks: 'Agar running sum negative ho jata hai toh aage ke elements mein judkar unhe kam hi karega, isliye use drop karna optimal hota hai.',
      whenToUse: 'Maximum sum subarray, circular subarray sum nikalne ke liye.',
      recognitionSignals: ['Contiguous subarray ka max sum poocha ho', 'Array mein positive aur negative dono numbers ho'],
      commonMistakes: ['Max sum ko 0 se initialize karna jabki array ke sabhi numbers negative ho', 'Running sum reset karne mein galti karna'],
      stepLogic: '1. maxEndingHere = nums[0], maxSoFar = nums[0] lein.\n2. maxEndingHere = max(nums[i], maxEndingHere + nums[i]) karein.\n3. maxSoFar ko update karein.'
    },
    visual: {
      type: 'ARRAY',
      category: 'ARRAYS',
      title: 'Kadane Maximum Subarray',
      input: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      description: 'Contiguous subarray [4, -1, 2, 1] yields maximum sum = 6.',
      description_hi: 'Contiguous subarray [4, -1, 2, 1] ka maximum sum = 6 hai.',
      steps: [
        { highlighted: [3, 4, 5, 6], elements: [-2, 1, -3, 4, -1, 2, 1, -5, 4], explanation: 'Optimal contiguous subarray indices 3 to 6: sum = 4 + (-1) + 2 + 1 = 6', explanation_hi: 'Optimal subarray indices 3 se 6 tak: 4 + (-1) + 2 + 1 = 6' }
      ],
      result: 6
    },
    code: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currentMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currentMax);
  }
  return maxSoFar;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6`,
    searchSignals: {
      tags: ['dynamic-programming', 'array'],
      keywords: ['maximum subarray', 'kadane', 'max sub-array'],
      companies: ['Amazon', 'Microsoft', 'LinkedIn', 'Google']
    },
    relatedCanonical: [
      { title: 'Maximum Subarray', difficulty: 'Medium', slug: 'maximum-subarray', url: 'https://leetcode.com/problems/maximum-subarray/' },
      { title: 'Maximum Sum Circular Subarray', difficulty: 'Medium', slug: 'maximum-sum-circular-subarray', url: 'https://leetcode.com/problems/maximum-sum-circular-subarray/' }
    ],
    externalResources: [
      { name: 'GeeksforGeeks - Kadane Algorithm', url: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/', type: 'GFG' }
    ]
  },

  'Merge Intervals': {
    slug: 'arrays-merge-intervals',
    name: 'Merge Intervals',
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    interviewFrequency: 'High',
    en: {
      title: 'Merge Intervals',
      overview: 'Sorting intervals by start time and merging any overlapping segments into unified ranges.',
      whatItIs: 'Sort by interval[0], then iterate: if current.start <= prev.end, merge by updating prev.end = max(prev.end, current.end).',
      whyItWorks: 'Sorting guarantees that all potentially overlapping intervals are contiguous in iteration order.',
      whenToUse: 'Calendar meetings, room scheduling, non-overlapping intervals, interval insertions.',
      recognitionSignals: ['Given list of intervals [start, end]', 'Questions about overlap, scheduling, or merging free time'],
      commonMistakes: ['Forgetting to sort by start time first', 'Overwriting prev.end with current.end instead of taking Math.max(prev.end, current.end)'],
      stepLogic: '1. Sort intervals by start time.\n2. Push first interval into merged list.\n3. For each next interval, if start <= merged.last.end, extend merged.last.end.\n4. Else push as new interval.'
    },
    hi: {
      title: 'Merge Intervals',
      overview: 'Intervals ko start time ke hisaab se sort karke overlapping ranges ko aapas mein merge karna.',
      whatItIs: 'Start time se sort karne ke baad consecutive intervals compare hote hain. Agar agla interval overlap kare toh merge kar diya jata hai.',
      whyItWorks: 'Sorting ki wajah se sabhi possible overlapping intervals ek ke baad ek aate hain.',
      whenToUse: 'Meeting rooms scheduling, calendar conflicts, overlapping time ranges.',
      recognitionSignals: ['Intervals [start, end] diye gaye ho', 'Overlap merge ya insert karne ki baat ho'],
      commonMistakes: ['Bina sort kiye direct merge shuru kar dena', 'prev.end ko update karte waqt Math.max na lagana'],
      stepLogic: '1. Start time se sort karein.\n2. Pehla interval result mein daalein.\n3. Agar agla start <= pichla end ho, toh end = max(end1, end2) karein.'
    },
    visual: {
      type: 'INTERVALS',
      category: 'INTERVALS',
      title: 'Merge Overlapping Intervals',
      input: [[1, 3], [2, 6], [8, 10]],
      description: 'Sort by start time and merge overlapping intervals.',
      description_hi: 'Start time se sort karke overlapping intervals merge karein.',
      steps: [
        { intervals: [[1, 3], [2, 6], [8, 10]], merged: [[1, 6], [8, 10]], explanation: '[1,3] overlaps with [2,6] -> merged to [1,6]. [8,10] is disjoint.', explanation_hi: '[1,3] aur [2,6] overlap karte hain -> [1,6] ban gaya.' }
      ],
      result: [[1, 6], [8, 10]]
    },
    code: `function merge(intervals) {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}

console.log(merge([[1, 3], [2, 6], [8, 10]])); // [[1, 6], [8, 10]]`,
    searchSignals: {
      tags: ['intervals', 'sorting', 'array'],
      keywords: ['merge intervals', 'insert interval', 'non-overlapping intervals'],
      companies: ['Meta', 'Google', 'Bloomberg', 'Uber', 'Amazon']
    },
    relatedCanonical: [
      { title: 'Merge Intervals', difficulty: 'Medium', slug: 'merge-intervals', url: 'https://leetcode.com/problems/merge-intervals/' },
      { title: 'Insert Interval', difficulty: 'Medium', slug: 'insert-interval', url: 'https://leetcode.com/problems/insert-interval/' }
    ],
    externalResources: [
      { name: 'LeetCode Merge Intervals Solution', url: 'https://leetcode.com/problems/merge-intervals/solution/', type: 'LeetCode' }
    ]
  },

  'Coordinate Compression': {
    slug: 'arrays-coordinate-compression',
    name: 'Coordinate Compression',
    topic: 'Arrays',
    difficulty: 'Hard',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    interviewFrequency: 'Medium',
    en: {
      title: 'Coordinate Compression',
      overview: 'Mapping large, sparse values into compact 0-indexed ranks while preserving relative ordering.',
      whatItIs: 'Extract unique values, sort them, and map each original value to its 0..K rank using binary search.',
      whyItWorks: 'Segment trees and Fenwick trees cannot allocate 10^9 indices, but work seamlessly when values are compressed into 0..N ranks.',
      whenToUse: 'Range queries where coordinate values reach 10^9 but total elements N <= 10^5.',
      recognitionSignals: ['Coordinates up to 10^9 but N <= 10^5', 'Relative ordering matters more than exact magnitude'],
      commonMistakes: ['Forgetting to remove duplicates when building rank dictionary', 'Confusing original coordinates with compressed ranks'],
      stepLogic: '1. Collect values, filter duplicates via Set, and sort.\n2. Create Map value -> rank index.\n3. Replace original array values with their mapped ranks.'
    },
    hi: {
      title: 'Coordinate Compression',
      overview: 'Bade sparse numbers (jaise 10^9) ko chhote 0-indexed ranks mein badalna taaki relative order barkarar rahe.',
      whatItIs: 'Unique elements ko sort karke unhe 0, 1, 2... ranks de di jaati hain.',
      whyItWorks: 'Segment Tree ya Fenwick Tree 10^9 size ka array nahi bana sakte, par compressed ranks (10^5) par aasaani se chalte hain.',
      whenToUse: 'Jab numbers bohot bade ho lekin sirf unka relative order zaroori ho.',
      recognitionSignals: ['Coordinates 10^9 tak diye ho par array size N chhota ho'],
      commonMistakes: ['Duplicates hataye bina rank assign karna', 'Original number aur rank mein confuse ho jana'],
      stepLogic: '1. Unique elements nikal kar sort karein.\n2. Map banayein: value -> index.\n3. Array elements ko unke rank se replace karein.'
    },
    visual: {
      type: 'COORDINATE_COMPRESSION',
      category: 'ARRAYS',
      title: 'Coordinate Compression Ranks',
      input: [100, 500, 1000, 5000],
      description: 'Map [100, 500, 1000, 5000] to compact ranks [0, 1, 2, 3].',
      description_hi: 'Bade values [100, 500, 1000, 5000] ko compact ranks [0, 1, 2, 3] mein badlein.',
      steps: [
        { original: [100, 500, 1000, 5000], mapping: { 100: 0, 500: 1, 1000: 2, 5000: 3 }, compressed: [0, 1, 2, 3], explanation: 'Sort unique items and assign ranks 0..N-1', explanation_hi: 'Unique elements sort karke ranks assign karein' }
      ],
      result: [0, 1, 2, 3]
    },
    code: `function compressCoordinates(coords) {
  const sortedUnique = [...new Set(coords)].sort((a, b) => a - b);
  const rankMap = new Map();
  sortedUnique.forEach((val, idx) => rankMap.set(val, idx));
  return coords.map(val => rankMap.get(val));
}

console.log(compressCoordinates([100, 5000, 500, 1000])); // [0, 3, 1, 2]`,
    searchSignals: {
      tags: ['coordinate-compression', 'discretization', 'array'],
      keywords: ['coordinate compression', 'discretization', 'rank transform'],
      companies: ['Google', 'Atlassian', 'Codeforces', 'Goldman Sachs']
    },
    relatedCanonical: [
      { title: 'Rank Transform of an Array', difficulty: 'Easy', slug: 'rank-transform-of-an-array', url: 'https://leetcode.com/problems/rank-transform-of-an-array/' }
    ],
    externalResources: [
      { name: 'CP-Algorithms - Coordinate Compression', url: 'https://cp-algorithms.com/', type: 'CP-Algo' }
    ]
  },

  'Cyclic Sort': {
    slug: 'arrays-cyclic-sort',
    name: 'Cyclic Sort',
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    interviewFrequency: 'High',
    en: {
      title: 'Cyclic Sort',
      overview: 'Sorting an array containing numbers from 1 to N in O(N) time and O(1) space by placing each number at its index.',
      whatItIs: 'Iterate: while nums[i] !== nums[nums[i] - 1], swap nums[i] with the element at its correct target index.',
      whyItWorks: 'Each swap places at least one number into its correct index. At most N swaps are performed across the entire array.',
      whenToUse: 'Problems dealing with numbers in a given range [1..N] or [0..N], finding missing/duplicate numbers.',
      recognitionSignals: ['Array contains numbers in range 1 to N or 0 to N', 'Find missing number or duplicate in O(N) time and O(1) space'],
      commonMistakes: ['Incrementing index i before verifying the swapped element is in correct position', 'Infinite loop when duplicates exist and condition does not break'],
      stepLogic: '1. Let i = 0.\n2. Correct index correctIdx = nums[i] - 1.\n3. If nums[i] !== nums[correctIdx], swap them.\n4. Else increment i.'
    },
    hi: {
      title: 'Cyclic Sort',
      overview: '1 se N tak ke numbers ko O(N) time aur O(1) space mein har number ko uske correct index par swap karke sort karna.',
      whatItIs: 'Har number nums[i] ko uske sahi ghar (nums[i]-1 index) par bhej diya jata hai jab tak sab sahi jagah na aa jayein.',
      whyItWorks: 'Har swap ke sath kam se kam ek number sahi jagah pahuchta hai, isliye total N se zyada swaps nahi hote.',
      whenToUse: 'Range 1 se N mein missing number ya duplicate number dhoondhne ke liye.',
      recognitionSignals: ['Range 1 se N ya 0 se N ke numbers ho', 'O(1) extra space mein missing/duplicate nikalna ho'],
      commonMistakes: ['Swap karne ke baad turant i++ kar dena bina naye number ko check kiye'],
      stepLogic: '1. i = 0 rakhein.\n2. correctIdx = nums[i] - 1 calculate karein.\n3. Agar number galat jagah hai toh swap karein, warna i++.'
    },
    visual: {
      type: 'ARRAY',
      category: 'ARRAYS',
      title: 'Cyclic Sort Index Alignment',
      input: [3, 1, 5, 4, 2],
      description: 'Swap each number to index val - 1 until all numbers match their index.',
      description_hi: 'Har number ko uske index (val - 1) par swap karein.',
      steps: [
        { activeIdx: 0, elements: [3, 1, 5, 4, 2], explanation: 'Value 3 belongs at index 2. Swap nums[0] with nums[2]: [5, 1, 3, 4, 2]', explanation_hi: 'Value 3 index 2 par jani chahiye. Swap karein.' },
        { activeIdx: 0, elements: [1, 2, 3, 4, 5], explanation: 'Continue swapping until all elements aligned: [1, 2, 3, 4, 5]', explanation_hi: 'Swapping ke baad sabhi elements sort ho gaye: [1, 2, 3, 4, 5]' }
      ],
      result: [1, 2, 3, 4, 5]
    },
    code: `function cyclicSort(nums) {
  let i = 0;
  while (i < nums.length) {
    const correctIdx = nums[i] - 1;
    if (nums[i] > 0 && nums[i] <= nums.length && nums[i] !== nums[correctIdx]) {
      [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
    } else {
      i++;
    }
  }
  return nums;
}

console.log(cyclicSort([3, 1, 5, 4, 2])); // [1, 2, 3, 4, 5]`,
    searchSignals: {
      tags: ['cyclic-sort', 'array', 'sorting'],
      keywords: ['missing number', 'find duplicate number', 'first missing positive', 'cyclic sort'],
      companies: ['Amazon', 'Meta', 'Google']
    },
    relatedCanonical: [
      { title: 'Missing Number', difficulty: 'Easy', slug: 'missing-number', url: 'https://leetcode.com/problems/missing-number/' },
      { title: 'Find the Duplicate Number', difficulty: 'Medium', slug: 'find-the-duplicate-number', url: 'https://leetcode.com/problems/find-the-duplicate-number/' },
      { title: 'First Missing Positive', difficulty: 'Hard', slug: 'first-missing-positive', url: 'https://leetcode.com/problems/first-missing-positive/' }
    ],
    externalResources: [
      { name: 'GeeksforGeeks - Cycle Sort', url: 'https://www.geeksforgeeks.org/cycle-sort/', type: 'GFG' }
    ]
  },

  'Dutch National Flag': {
    slug: 'arrays-dutch-national-flag',
    name: 'Dutch National Flag',
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    interviewFrequency: 'High',
    en: {
      title: 'Dutch National Flag (3-Way Partitioning)',
      overview: 'Partitioning an array into three distinct sections (e.g. 0s, 1s, and 2s) in a single pass using three pointers.',
      whatItIs: 'Use low, mid, and high pointers: elements < pivot go before low, elements > pivot go after high, and elements === pivot stay between.',
      whyItWorks: 'Invariants guarantee [0..low-1] are 0s, [low..mid-1] are 1s, and [high+1..N-1] are 2s at every step.',
      whenToUse: 'Sort Colors (0, 1, 2), 3-way quicksort partitioning, separating negatives, zeroes, and positives.',
      recognitionSignals: ['Sort array containing only 3 distinct values', 'In-place one-pass partitioning requirement'],
      commonMistakes: ['Advancing mid after swapping with high (element at high was uninspected and must be re-evaluated at mid)'],
      stepLogic: '1. low = 0, mid = 0, high = N - 1.\n2. If nums[mid] === 0: swap(low, mid), low++, mid++.\n3. If nums[mid] === 1: mid++.\n4. If nums[mid] === 2: swap(mid, high), high--.'
    },
    hi: {
      title: 'Dutch National Flag (3-Way Partitioning)',
      overview: 'Teen pointers (low, mid, high) ki madad se 0, 1, 2 jaise teen groups ko ek hi pass mein sort karna.',
      whatItIs: 'mid pointer array scan karta hai. 0 milne par low se swap karke aage badhte hain, 2 milne par high se swap karte hain.',
      whyItWorks: 'Har step par 0s left mein, 2s right mein, aur 1s middle mein arrange ho jate hain.',
      whenToUse: 'Sort Colors problem, three-way partitioning.',
      recognitionSignals: ['Array mein sirf 3 unique numbers (jaise 0, 1, 2) ho', 'Single pass O(N) mein sort karna ho'],
      commonMistakes: ['high se swap karne ke baad mid++ kar dena (high se aayi value ko pehle inspect karna padta hai)'],
      stepLogic: '1. low=0, mid=0, high=N-1 rakhein.\n2. nums[mid] === 0 toh swap(low, mid), low++, mid++.\n3. nums[mid] === 1 toh mid++.\n4. nums[mid] === 2 toh swap(mid, high), high--.'
    },
    visual: {
      type: 'ARRAY',
      category: 'ARRAYS',
      title: 'Dutch National Flag 3-Way Sort',
      input: [2, 0, 2, 1, 1, 0],
      description: 'Partition array into 0s, 1s, and 2s in-place.',
      description_hi: '0s, 1s aur 2s ko in-place partition karein.',
      steps: [
        { elements: [0, 0, 1, 1, 2, 2], highlighted: [0, 1], explanation: 'All 0s moved to left, 1s in middle, 2s on right.', explanation_hi: '0s left mein, 1s middle mein aur 2s right mein partition ho gaye.' }
      ],
      result: [0, 0, 1, 1, 2, 2]
    },
    code: `function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
  return nums;
}

console.log(sortColors([2, 0, 2, 1, 1, 0])); // [0, 0, 1, 1, 2, 2]`,
    searchSignals: {
      tags: ['two-pointers', 'sorting', 'array'],
      keywords: ['sort colors', 'dutch national flag', '3-way partition'],
      companies: ['Meta', 'Amazon', 'Microsoft']
    },
    relatedCanonical: [
      { title: 'Sort Colors', difficulty: 'Medium', slug: 'sort-colors', url: 'https://leetcode.com/problems/sort-colors/' }
    ],
    externalResources: [
      { name: 'Wikipedia - Dutch National Flag Problem', url: 'https://en.wikipedia.org/wiki/Dutch_national_flag_problem', type: 'Wiki' }
    ]
  },

  'Simulation': {
    slug: 'arrays-simulation',
    name: 'Simulation',
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    interviewFrequency: 'Medium',
    en: {
      title: 'Array Simulation',
      overview: 'Directly implementing real-world rules or step-by-step game state transitions faithfully as specified.',
      whatItIs: 'Translating problem rules step by step (e.g. spiral matrix, robot movements, Game of Life) without complex shortcuts.',
      whyItWorks: 'When rules are deterministic and bounded, simulating each event guarantees correctness without overlooking edge cases.',
      whenToUse: 'Game rules, robot grid navigation, cellular automata, spiral matrix traversal.',
      recognitionSignals: ['Problem reads like a game manual or physical process', 'State updates depend on current neighbor states'],
      commonMistakes: ['Overwriting state values in-place before evaluating neighbors (requires simultaneous state update)'],
      stepLogic: '1. Define state variables and boundary constraints.\n2. Iterate through discrete time steps, applying state transition rules.\n3. Return final simulated state.'
    },
    hi: {
      title: 'Array Simulation',
      overview: 'Problem mein diye gaye rules aur steps ko seedhe code mein simulate karna.',
      whatItIs: 'Rules ko step-by-step bina kisi shortcut ke replicate karna (jaise Robot simulation ya Spiral Matrix).',
      whyItWorks: 'Deterministic rules mein har step simulate karne se sabhi edge cases naturally handle ho jate hain.',
      whenToUse: 'Spiral matrix, robot walking, game rules simulate karne ke liye.',
      recognitionSignals: ['Problem kisi game ya process ki tarah describe ho'],
      commonMistakes: ['Pura state update hone se pehle purani values ko overwrite kar dena'],
      stepLogic: '1. Boundary aur state define karein.\n2. Har step par rules apply karein.\n3. Final state return karein.'
    },
    visual: {
      type: 'ARRAY',
      category: 'ARRAYS',
      title: 'State Simulation',
      input: [1, 2, 3, 4],
      description: 'Simulate state updates step-by-step.',
      description_hi: 'Step-by-step state simulate karein.',
      steps: [
        { activeIdx: 0, elements: [1, 2, 3, 4], explanation: 'State 0 initialized', explanation_hi: 'State 0 shuru hua' },
        { activeIdx: 3, elements: [2, 4, 6, 8], explanation: 'State transformed after rules applied', explanation_hi: 'Rules lagane ke baad updated state' }
      ],
      result: [2, 4, 6, 8]
    },
    code: `function simulateProcess(nums) {
  return nums.map(x => x * 2);
}
console.log(simulateProcess([1, 2, 3, 4])); // [2, 4, 6, 8]`,
    searchSignals: {
      tags: ['simulation', 'array'],
      keywords: ['simulation', 'spiral matrix', 'robot simulation'],
      companies: ['Amazon', 'Google']
    },
    relatedCanonical: [
      { title: 'Spiral Matrix', difficulty: 'Medium', slug: 'spiral-matrix', url: 'https://leetcode.com/problems/spiral-matrix/' }
    ],
    externalResources: [
      { name: 'LeetCode Explore - Simulation', url: 'https://leetcode.com/', type: 'LeetCode' }
    ]
  },

  'Matrix Traversal': {
    slug: 'arrays-matrix-traversal',
    name: 'Matrix Traversal',
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(R * C)',
    spaceComplexity: 'O(1)',
    interviewFrequency: 'High',
    en: {
      title: '2D Matrix Traversal',
      overview: 'Systematic navigation across rows, columns, diagonals, or spiral boundaries of a 2D grid.',
      whatItIs: 'Using nested loops (r from 0..R-1, c from 0..C-1) or direction vectors (dx, dy) to traverse 2D arrays.',
      whyItWorks: 'Row-major memory layout allows predictable cache-friendly iteration through contiguous memory blocks.',
      whenToUse: 'Image filtering, word search grids, flood fill, pathfinding on 2D maps.',
      recognitionSignals: ['Given a 2D array matrix[r][c]', 'Grid movement in 4 or 8 directions'],
      commonMistakes: ['Row and column bounds swapped (matrix.length vs matrix[0].length)', 'Index out of bounds on grid boundaries'],
      stepLogic: '1. Get R = matrix.length, C = matrix[0].length.\n2. Iterate through each row and column.\n3. Ensure boundary checks 0 <= r < R and 0 <= c < C.'
    },
    hi: {
      title: '2D Matrix Traversal',
      overview: '2D grid mein rows, columns aur diagonals ke across systematic travel karna.',
      whatItIs: 'Nested loops (rows aur cols) ya direction vectors ki madad se 2D matrix scan karna.',
      whyItWorks: 'Row-major indexing se sabhi cells ko O(R * C) time mein access kiya ja sakta hai.',
      whenToUse: 'Grid search, image processing, 2D island problems.',
      recognitionSignals: ['2D array matrix[r][c] diya gaya ho'],
      commonMistakes: ['Rows aur cols ke size ko swap kar dena', 'Boundary check bhool jana'],
      stepLogic: '1. R aur C nikal lein.\n2. Nested loop se har cell visit karein.\n3. Boundary check hamesha lagayein.'
    },
    visual: {
      type: 'MATRIX',
      category: 'ARRAYS',
      title: 'Matrix 2D Grid Traversal',
      input: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      description: 'Row-by-row traversal of 3x3 matrix.',
      description_hi: '3x3 matrix ka row-by-row scan.',
      steps: [
        { grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], activeCell: [1, 1], explanation: 'Visiting center cell matrix[1][1] = 5', explanation_hi: 'Center cell matrix[1][1] = 5 visit karein' }
      ],
      result: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    code: `function traverseMatrix(matrix) {
  const result = [];
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      result.push(matrix[r][c]);
    }
  }
  return result;
}
console.log(traverseMatrix([[1, 2], [3, 4]])); // [1, 2, 3, 4]`,
    searchSignals: {
      tags: ['matrix', 'array'],
      keywords: ['matrix', '2d grid', 'spiral matrix'],
      companies: ['Amazon', 'Google', 'Microsoft']
    },
    relatedCanonical: [
      { title: 'Spiral Matrix', difficulty: 'Medium', slug: 'spiral-matrix', url: 'https://leetcode.com/problems/spiral-matrix/' }
    ],
    externalResources: [
      { name: 'GeeksforGeeks - Matrix Traversal', url: 'https://www.geeksforgeeks.org/matrix-data-structure/', type: 'GFG' }
    ]
  },

  'Matrix Rotation': {
    slug: 'arrays-matrix-rotation',
    name: 'Matrix Rotation',
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    interviewFrequency: 'High',
    en: {
      title: 'In-Place Matrix Rotation (90 Degrees)',
      overview: 'Rotating an N x N 2D matrix by 90 degrees clockwise in-place using transpose and reverse operations.',
      whatItIs: 'Step 1: Transpose the matrix (swap matrix[i][j] with matrix[j][i]). Step 2: Reverse each individual row.',
      whyItWorks: 'Mathematically, rotating 90 degrees clockwise maps (i, j) -> (j, N - 1 - i). Transpose + row reverse achieves this exact permutation.',
      whenToUse: 'Image rotation, 2D tile manipulation, graphic rendering transformations.',
      recognitionSignals: ['Rotate N x N matrix by 90 degrees clockwise', 'Requirement to perform rotation in-place without extra matrix'],
      commonMistakes: ['Swapping the entire matrix during transpose (swapping twice reverts back to original; only swap j > i)', 'Rotating counter-clockwise without reversing columns first'],
      stepLogic: '1. Transpose: for i in 0..N-1 and j from i+1..N-1, swap matrix[i][j] and matrix[j][i].\n2. Reverse rows: for each row, reverse in-place.'
    },
    hi: {
      title: 'In-Place Matrix Rotation (90 Degrees)',
      overview: 'N x N matrix ko in-place 90 degrees clockwise ghumana transpose aur row reverse karke.',
      whatItIs: 'Pehle matrix ka transpose lete hain, phir har row ko reverse kar dete hain.',
      whyItWorks: 'Transpose + reverse mathematical mapping (i, j) -> (j, N - 1 - i) ke barabar hota hai.',
      whenToUse: 'Image processing, game board rotation.',
      recognitionSignals: ['90 degrees clockwise rotate karna ho in-place'],
      commonMistakes: ['Transpose karte waqt do bar swap karke wapas wahi pahuch jana'],
      stepLogic: '1. Transpose karein (j > i swap).\n2. Har row ko reverse karein.'
    },
    visual: {
      type: 'MATRIX',
      category: 'ARRAYS',
      title: 'Matrix 90 Degree Rotation',
      input: [[1, 2], [3, 4]],
      description: 'Transpose + reverse rows yields [[3, 1], [4, 2]].',
      description_hi: 'Transpose aur row reverse se 90 degree rotate karein.',
      steps: [
        { grid: [[3, 1], [4, 2]], explanation: 'Matrix rotated 90 degrees clockwise in-place', explanation_hi: 'Matrix 90 degree clockwise rotate ho gaya' }
      ],
      result: [[3, 1], [4, 2]]
    },
    code: `function rotate(matrix) {
  const n = matrix.length;
  // 1. Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  // 2. Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
  return matrix;
}
console.log(rotate([[1, 2], [3, 4]])); // [[3, 1], [4, 2]]`,
    searchSignals: {
      tags: ['matrix', 'rotation', 'array'],
      keywords: ['rotate image', 'matrix rotation', 'transpose'],
      companies: ['Amazon', 'Microsoft', 'Google']
    },
    relatedCanonical: [
      { title: 'Rotate Image', difficulty: 'Medium', slug: 'rotate-image', url: 'https://leetcode.com/problems/rotate-image/' }
    ],
    externalResources: [
      { name: 'LeetCode Rotate Image Solution', url: 'https://leetcode.com/problems/rotate-image/solution/', type: 'LeetCode' }
    ]
  },

  'Sorting Techniques': {
    slug: 'arrays-sorting-techniques',
    name: 'Sorting Techniques',
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(1) to O(N)',
    interviewFrequency: 'High',
    en: {
      title: 'Sorting Techniques',
      overview: 'Ordering array elements monotonically to unlock fast binary search, two pointers, and interval merges.',
      whatItIs: 'Comparison sorts (Quicksort, Mergesort, Timsort) achieving O(N log N), or non-comparison sorts (Counting, Radix) in O(N).',
      whyItWorks: 'Establishing sorted invariants simplifies subsequent problem constraints and pair searches.',
      whenToUse: 'Pre-processing step for Two Pointers, Binary Search, greedy scheduling, interval merging.',
      recognitionSignals: ['Need to group identical elements together', 'Order doesn’t matter initially but facilitates binary search'],
      commonMistakes: ['Default JavaScript .sort() sorts lexicographically as strings (e.g. 10 before 2), must pass (a, b) => a - b'],
      stepLogic: '1. Select appropriate sorting algorithm (e.g. Quicksort/Timsort).\n2. Sort array with numerical comparator.\n3. Execute target search on sorted structure.'
    },
    hi: {
      title: 'Sorting Techniques',
      overview: 'Array elements ko ascending ya descending order mein arrange karna taaki binary search ya two pointers use ho sake.',
      whatItIs: 'Quicksort, Mergesort, Timsort jaise algorithms jo elements ko O(N log N) mein sort karte hain.',
      whyItWorks: 'Sorted data par binary search aur two pointers O(N) ya O(log N) mein kaam karte hain.',
      whenToUse: 'Two pointers ya binary search lagane se pehle preprocessing step ke roop mein.',
      recognitionSignals: ['Elements ko order mein laane se problem aasan ho jaye'],
      commonMistakes: ['JS sort() bina comparator function ke call karna jisse numbers string ki tarah sort ho jate hain'],
      stepLogic: '1. Numerical comparator (a, b) => a - b use karein.\n2. Sorted array par algorithm lagayein.'
    },
    visual: {
      type: 'ARRAY',
      category: 'ARRAYS',
      title: 'Array Sorting',
      input: [5, 2, 9, 1, 5, 6],
      description: 'Sort array ascending: [1, 2, 5, 5, 6, 9].',
      description_hi: 'Array ko ascending order mein sort karein: [1, 2, 5, 5, 6, 9].',
      steps: [
        { elements: [1, 2, 5, 5, 6, 9], explanation: 'Elements sorted in non-decreasing order', explanation_hi: 'Elements non-decreasing order mein sort ho gaye' }
      ],
      result: [1, 2, 5, 5, 6, 9]
    },
    code: `function sortArray(nums) {
  return nums.slice().sort((a, b) => a - b);
}
console.log(sortArray([5, 2, 9, 1, 5, 6])); // [1, 2, 5, 5, 6, 9]`,
    searchSignals: {
      tags: ['sorting', 'array'],
      keywords: ['quicksort', 'merge sort', 'sort array'],
      companies: ['Amazon', 'Google', 'Apple']
    },
    relatedCanonical: [
      { title: 'Sort an Array', difficulty: 'Medium', slug: 'sort-an-array', url: 'https://leetcode.com/problems/sort-an-array/' }
    ],
    externalResources: [
      { name: 'VisuAlgo - Sorting', url: 'https://visualgo.net/en/sorting', type: 'VisuAlgo' }
    ]
  },

  'Binary Search on Answer': {
    slug: 'arrays-binary-search-on-answer',
    name: 'Binary Search on Answer',
    topic: 'Arrays',
    difficulty: 'Hard',
    timeComplexity: 'O(N log(Range))',
    spaceComplexity: 'O(1)',
    interviewFrequency: 'High',
    en: {
      title: 'Binary Search on Answer',
      overview: 'Binary searching over the numerical range of possible answers rather than indices of an array.',
      whatItIs: 'When a feasibility check isValid(mid) is monotonic (False False ... True True), binary search identifies the minimum/maximum valid answer.',
      whyItWorks: 'Monotonicity ensures that if capacity X works, all capacities > X also work, halving search space each step.',
      whenToUse: 'Koko Eating Bananas, Capacity to Ship Packages, Split Array Largest Sum, Aggressive Cows.',
      recognitionSignals: ['Find minimum of maximums or maximum of minimums', 'Feasibility check can be computed greedily in O(N)'],
      commonMistakes: ['Setting search range boundaries low/high incorrectly', 'Off-by-one boundary adjustment causing infinite while loop'],
      stepLogic: '1. Identify min possible answer low and max possible answer high.\n2. While low <= high, mid = low + (high - low) / 2.\n3. If isValid(mid) is true, record mid and search smaller: high = mid - 1.\n4. Else search larger: low = mid + 1.'
    },
    hi: {
      title: 'Binary Search on Answer',
      overview: 'Array ke index par nahi, balki possible answers ke range par binary search lagana.',
      whatItIs: 'Jab isValid(mid) function monotonic ho (ek point ke baad hamesha true ya false), toh optimal answer O(log Range) mein milta hai.',
      whyItWorks: 'Monotonic condition ki wajah se search space ko har baar half kiya ja sakta hai.',
      whenToUse: 'Koko eating bananas, shipping packages, split array largest sum.',
      recognitionSignals: ['Minimize the maximum ya maximize the minimum poocha ho'],
      commonMistakes: ['Search space range (low aur high) galat select karna'],
      stepLogic: '1. low aur high answer range set karein.\n2. mid par check isValid(mid) karein.\n3. Range ko halve karte jayein.'
    },
    visual: {
      type: 'BINARY_SEARCH',
      category: 'BINARY SEARCH',
      title: 'Binary Search on Answer Feasibility',
      input: [1, 2, 3, 4, 5, 6, 7, 8],
      description: 'Search range of capacities [1..8]. mid = 4 is valid -> search smaller [1..3].',
      description_hi: 'Capacity range [1..8] par search karein.',
      steps: [
        { low: 1, high: 8, mid: 4, elements: [1, 2, 3, 4, 5, 6, 7, 8], explanation: 'isValid(4) is TRUE. Record answer 4, search smaller [1..3].', explanation_hi: 'isValid(4) TRUE hai. 4 record karein aur smaller search karein.' }
      ],
      result: 4
    },
    code: `function shipWithinDays(weights, days) {
  let low = Math.max(...weights);
  let high = weights.reduce((a, b) => a + b, 0);

  function canShip(cap) {
    let d = 1, curr = 0;
    for (const w of weights) {
      if (curr + w > cap) { d++; curr = 0; }
      curr += w;
    }
    return d <= days;
  }

  let ans = high;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (canShip(mid)) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}
console.log(shipWithinDays([1,2,3,4,5,6,7,8,9,10], 5)); // 15`,
    searchSignals: {
      tags: ['binary-search', 'greedy', 'array'],
      keywords: ['koko eating bananas', 'capacity to ship', 'split array largest sum'],
      companies: ['Google', 'Meta', 'Amazon']
    },
    relatedCanonical: [
      { title: 'Koko Eating Bananas', difficulty: 'Medium', slug: 'koko-eating-bananas', url: 'https://leetcode.com/problems/koko-eating-bananas/' },
      { title: 'Capacity To Ship Packages Within D Days', difficulty: 'Medium', slug: 'capacity-to-ship-packages-within-d-days', url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/' }
    ],
    externalResources: [
      { name: 'LeetCode Binary Search on Answer Guide', url: 'https://leetcode.com/discuss/general-discussion/786126/python-powerful-ultimate-binary-search-template-solves-many-problems', type: 'LeetCode' }
    ]
  },

  'Frequency Counting': {
    slug: 'arrays-frequency-counting',
    name: 'Frequency Counting',
    topic: 'Arrays',
    difficulty: 'Easy',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(U)',
    interviewFrequency: 'High',
    en: {
      title: 'Frequency Counting',
      overview: 'Tabulating occurrences of each element in an array using an auxiliary hashmap or fixed-size bucket array.',
      whatItIs: 'Single-pass aggregation mapping element -> count, enabling instant O(1) frequency lookups.',
      whyItWorks: 'Hash tables provide O(1) average lookup/insertion, reducing O(N^2) search loops to linear O(N) time.',
      whenToUse: 'Anagram detection, majority element, finding duplicates, top K frequent items.',
      recognitionSignals: ['Check counts of numbers or characters', 'Find elements appearing more than K times'],
      commonMistakes: ['Assuming fixed size array when inputs exceed expected character set'],
      stepLogic: '1. Initialize empty Map or frequency array.\n2. Iterate through elements: freq[x] = (freq[x] || 0) + 1.\n3. Inspect counts.'
    },
    hi: {
      title: 'Frequency Counting',
      overview: 'Array ke har number ya character ki frequency count karke hashmap mein store karna.',
      whatItIs: 'Single pass mein element -> count map banana taaki baad mein O(1) lookup mil sake.',
      whyItWorks: 'Hashmap O(1) time mein count access deta hai.',
      whenToUse: 'Majority element, anagrams, duplicate detection ke liye.',
      recognitionSignals: ['Elements ke occurrences check karne ho'],
      commonMistakes: ['Undefined count handling mein check na lagana'],
      stepLogic: '1. Map banayein.\n2. freq[val] = (freq[val] || 0) + 1 karein.\n3. Frequency inspect karein.'
    },
    visual: {
      type: 'ARRAY',
      category: 'ARRAYS',
      title: 'Frequency Map Counting',
      input: [1, 2, 2, 3, 2],
      description: 'Count frequencies: { 1: 1, 2: 3, 3: 1 } -> Majority is 2.',
      description_hi: 'Frequencies count karein: { 1: 1, 2: 3, 3: 1 } -> Majority element 2 hai.',
      steps: [
        { elements: [1, 2, 2, 3, 2], explanation: 'Element 2 occurs 3 times (majority)', explanation_hi: 'Element 2 teen bar aaya hai' }
      ],
      result: { 1: 1, 2: 3, 3: 1 }
    },
    code: `function countFrequencies(nums) {
  const counts = new Map();
  for (const n of nums) {
    counts.set(n, (counts.get(n) || 0) + 1);
  }
  return Object.fromEntries(counts);
}
console.log(countFrequencies([1, 2, 2, 3, 2])); // { '1': 1, '2': 3, '3': 1 }`,
    searchSignals: {
      tags: ['hashing', 'array'],
      keywords: ['majority element', 'frequency count', 'top k frequent'],
      companies: ['Amazon', 'Google', 'Meta']
    },
    relatedCanonical: [
      { title: 'Majority Element', difficulty: 'Easy', slug: 'majority-element', url: 'https://leetcode.com/problems/majority-element/' }
    ],
    externalResources: [
      { name: 'GeeksforGeeks - Counting Frequencies', url: 'https://www.geeksforgeeks.org/counting-frequencies-of-array-elements/', type: 'GFG' }
    ]
  },

  'Bucket Sort': {
    slug: 'arrays-bucket-sort',
    name: 'Bucket Sort',
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(N + K)',
    spaceComplexity: 'O(N + K)',
    interviewFrequency: 'Medium',
    en: {
      title: 'Bucket Sort',
      overview: 'Distributing elements into a series of buckets, sorting each bucket, and concatenating results in linear time.',
      whatItIs: 'Partitioning uniformly distributed data into K buckets over [min..max] range, then sorting individual buckets.',
      whyItWorks: 'When inputs are uniformly distributed, each bucket contains O(1) items on average, resulting in overall linear O(N) runtime.',
      whenToUse: 'Uniformly distributed floating point numbers in [0..1), Top K frequent elements, Maximum gap between sorted numbers.',
      recognitionSignals: ['Floating point numbers uniformly distributed', 'Requirement for linear time sorting of bounded integers'],
      commonMistakes: ['Degrading to O(N^2) when data is skewed into a single bucket'],
      stepLogic: '1. Create K empty buckets.\n2. Place each number into bucket index floor(K * val).\n3. Sort individual buckets and concatenate.'
    },
    hi: {
      title: 'Bucket Sort',
      overview: 'Elements ko range ke hisaab se buckets mein baant kar sort karna.',
      whatItIs: 'Uniform distribution wale numbers ko K buckets mein distribute kiya jata hai aur phir aapas mein jod diya jata hai.',
      whyItWorks: 'Uniform data mein har bucket mein O(1) elements hote hain, jisse linear O(N) sorting milti hai.',
      whenToUse: 'Top K frequent elements, maximum gap problem.',
      recognitionSignals: ['Uniform floating points ya bounded numbers ho'],
      commonMistakes: ['Sabhi numbers ek hi bucket mein girne par O(N^2) ban jana'],
      stepLogic: '1. K buckets banayein.\n2. Elements ko bucket index par daalein.\n3. Har bucket sort karke concatenate karein.'
    },
    visual: {
      type: 'ARRAY',
      category: 'ARRAYS',
      title: 'Bucket Sort Distribution',
      input: [0.13, 0.45, 0.18, 0.89],
      description: 'Distribute into buckets [0..0.2], [0.4..0.6], [0.8..1.0].',
      description_hi: 'Buckets mein distribute karke sort karein.',
      steps: [
        { elements: [0.13, 0.18, 0.45, 0.89], explanation: 'Buckets sorted and concatenated in O(N)', explanation_hi: 'Buckets sort hokar concatenate ho gayi' }
      ],
      result: [0.13, 0.18, 0.45, 0.89]
    },
    code: `function bucketSort(arr, k = 5) {
  const buckets = Array.from({ length: k }, () => []);
  const max = Math.max(...arr) + 1;
  for (const n of arr) {
    const idx = Math.floor((n / max) * k);
    buckets[idx].push(n);
  }
  return buckets.flatMap(b => b.sort((a, b) => a - b));
}
console.log(bucketSort([3, 1, 4, 1, 5, 9, 2])); // [1, 1, 2, 3, 4, 5, 9]`,
    searchSignals: {
      tags: ['sorting', 'bucket-sort', 'array'],
      keywords: ['bucket sort', 'maximum gap', 'top k frequent'],
      companies: ['Amazon', 'Google']
    },
    relatedCanonical: [
      { title: 'Maximum Gap', difficulty: 'Hard', slug: 'maximum-gap', url: 'https://leetcode.com/problems/maximum-gap/' }
    ],
    externalResources: [
      { name: 'GeeksforGeeks - Bucket Sort', url: 'https://www.geeksforgeeks.org/bucket-sort-2/', type: 'GFG' }
    ]
  },

  'Counting Sort': {
    slug: 'arrays-counting-sort',
    name: 'Counting Sort',
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(N + K)',
    spaceComplexity: 'O(K)',
    interviewFrequency: 'Medium',
    en: {
      title: 'Counting Sort',
      overview: 'Non-comparison integer sorting algorithm counting the frequency of each distinct key in O(N + K).',
      whatItIs: 'Count occurrences of each value in count array of size K = max - min + 1, then reconstruct output using cumulative counts.',
      whyItWorks: 'Bypasses the O(N log N) comparison sort lower bound by directly mapping values to indices.',
      whenToUse: 'Small range of integer keys (K is O(N)), sorting characters/bytes, radix sort subroutine.',
      recognitionSignals: ['Integer array with small range K', 'Linear O(N) sorting required'],
      commonMistakes: ['Using counting sort when range K is huge (e.g. 10^9), causing massive memory allocation'],
      stepLogic: '1. Find min and max.\n2. Count frequencies of each value in array of size max - min + 1.\n3. Reconstruct sorted array.'
    },
    hi: {
      title: 'Counting Sort',
      overview: 'Bina comparison ke integer frequencies count karke linear O(N + K) time mein sort karna.',
      whatItIs: 'Har integer ki frequency count array mein store hoti hai aur phir index sequence se array reconstruct hota hai.',
      whyItWorks: 'Direct index mapping comparison sort ke O(N log N) limit ko break karti hai.',
      whenToUse: 'Jab numbers ka range K chhota ho.',
      recognitionSignals: ['Chhote integers ka array sort karna ho'],
      commonMistakes: ['Bohot bade range (10^9) par counting sort lagana'],
      stepLogic: '1. Min aur Max nikal kar count array banayein.\n2. Frequencies count karein.\n3. Reconstruct karein.'
    },
    visual: {
      type: 'ARRAY',
      category: 'ARRAYS',
      title: 'Counting Sort Histogram',
      input: [4, 2, 2, 8, 3, 3, 1],
      description: 'Count array for values [1..8] reconstructed into sorted array.',
      description_hi: 'Values [1..8] ka count array banakar sorted array banayein.',
      steps: [
        { elements: [1, 2, 2, 3, 3, 4, 8], explanation: 'Sorted non-comparison output: [1, 2, 2, 3, 3, 4, 8]', explanation_hi: 'Sorted output tayyar hai: [1, 2, 2, 3, 3, 4, 8]' }
      ],
      result: [1, 2, 2, 3, 3, 4, 8]
    },
    code: `function countingSort(arr) {
  if (arr.length === 0) return arr;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const count = new Array(max - min + 1).fill(0);
  for (const n of arr) count[n - min]++;
  const result = [];
  for (let i = 0; i < count.length; i++) {
    while (count[i]-- > 0) result.push(i + min);
  }
  return result;
}
console.log(countingSort([4, 2, 2, 8, 3, 3, 1])); // [1, 2, 2, 3, 3, 4, 8]`,
    searchSignals: {
      tags: ['sorting', 'counting-sort', 'array'],
      keywords: ['counting sort', 'sort colors'],
      companies: ['Amazon', 'Google']
    },
    relatedCanonical: [
      { title: 'Sort Colors', difficulty: 'Medium', slug: 'sort-colors', url: 'https://leetcode.com/problems/sort-colors/' }
    ],
    externalResources: [
      { name: 'GeeksforGeeks - Counting Sort', url: 'https://www.geeksforgeeks.org/counting-sort/', type: 'GFG' }
    ]
  },

  'Sweep Line': {
    slug: 'arrays-sweep-line',
    name: 'Sweep Line',
    topic: 'Arrays',
    difficulty: 'Hard',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    interviewFrequency: 'High',
    en: {
      title: 'Sweep Line Algorithm',
      overview: 'Conceptualizing geometric intervals or 2D segments as dynamic events sorted along an axis and processed sequentially.',
      whatItIs: 'Convert intervals into start events (+1) and end events (-1), sort all events by coordinate, and sweep across tracking active overlaps.',
      whyItWorks: 'Sorting temporal/spatial events reduces 2D overlap problems to a 1D running prefix sum state.',
      whenToUse: 'Meeting Rooms II, Skyline Problem, Area of Overlapping Rectangles, Employee Free Time.',
      recognitionSignals: ['Find maximum overlapping intervals at any point in time', 'Room scheduling with concurrent requirements'],
      commonMistakes: ['Handling end events after start events at the same timestamp (should process end before start to avoid false overlap)'],
      stepLogic: '1. Create events: (start, +1) and (end, -1).\n2. Sort events by time; tie-break end events first.\n3. Sweep through events maintaining activeCount += event.type and record max.'
    },
    hi: {
      title: 'Sweep Line Algorithm',
      overview: 'Time intervals ya geometric events ko sort karke line ki tarah sweep karte huye concurrent overlaps calculate karna.',
      whatItIs: 'Intervals ko Start (+1) aur End (-1) events mein convert karke time se sort kiya jata hai aur active counter maintain hota hai.',
      whyItWorks: 'Events ko time order mein process karne se kisi bhi moment par kitne active overlaps hain wo O(1) mein pata chal jata hai.',
      whenToUse: 'Meeting rooms II, skyline problem, maximum concurrent meetings.',
      recognitionSignals: ['Ek waqt par maximum overlapping intervals nikalne ho'],
      commonMistakes: ['Same time par start event ko end event se pehle process kar dena'],
      stepLogic: '1. Start (+1) aur End (-1) events banayein.\n2. Time se sort karein.\n3. Active counter chalayein aur maximum record karein.'
    },
    visual: {
      type: 'INTERVALS',
      category: 'INTERVALS',
      title: 'Sweep Line Concurrent Overlaps',
      input: [[0, 30], [5, 10], [15, 20]],
      description: 'Maximum concurrent rooms required = 2 (at time 5..10).',
      description_hi: 'Time 5 se 10 ke beech maximum 2 rooms required hain.',
      steps: [
        { intervals: [[0, 30], [5, 10], [15, 20]], merged: [[0, 30]], explanation: 'Max overlapping concurrent intervals = 2', explanation_hi: 'Max concurrent intervals = 2' }
      ],
      result: 2
    },
    code: `function minMeetingRooms(intervals) {
  const events = [];
  for (const [start, end] of intervals) {
    events.push([start, 1]);
    events.push([end, -1]);
  }
  // Sort by time; if tie, end event (-1) before start event (+1)
  events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

  let activeRooms = 0, maxRooms = 0;
  for (const [time, type] of events) {
    activeRooms += type;
    maxRooms = Math.max(maxRooms, activeRooms);
  }
  return maxRooms;
}

console.log(minMeetingRooms([[0, 30], [5, 10], [15, 20]])); // 2`,
    searchSignals: {
      tags: ['sweep-line', 'intervals', 'sorting'],
      keywords: ['meeting rooms ii', 'sweep line', 'skyline problem'],
      companies: ['Google', 'Meta', 'Amazon', 'Uber']
    },
    relatedCanonical: [
      { title: 'Meeting Rooms II', difficulty: 'Medium', slug: 'meeting-rooms-ii', url: 'https://leetcode.com/problems/meeting-rooms-ii/' }
    ],
    externalResources: [
      { name: 'Topcoder - Line Sweep Algorithms', url: 'https://www.topcoder.com/community/competitive-programming/tutorials/line-sweep-algorithms/', type: 'Topcoder' }
    ]
  },

  'Interval Processing': {
    slug: 'arrays-interval-processing',
    name: 'Interval Processing',
    topic: 'Arrays',
    difficulty: 'Medium',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    interviewFrequency: 'High',
    en: {
      title: 'Interval Processing',
      overview: 'Systematic manipulation of range segments including merging, inserting, and finding intersections.',
      whatItIs: 'Sorting by boundary coordinates and comparing adjacent segments [startA, endA] and [startB, endB].',
      whyItWorks: 'Sorting brings overlapping and contiguous ranges adjacent to each other.',
      whenToUse: 'Interval list intersections, insert interval into sorted schedule, remove covered intervals.',
      recognitionSignals: ['Given pairs of interval ranges [start, end]', 'Questions about intersection or insertion into schedule'],
      commonMistakes: ['Incorrect intersection condition (intersection is [max(startA, startB), min(endA, endB)])'],
      stepLogic: '1. Two pointers i, j iterate through interval lists A and B.\n2. Compute overlap [max(A.start, B.start), min(A.end, B.end)].\n3. Advance pointer with earlier end time.'
    },
    hi: {
      title: 'Interval Processing',
      overview: 'Intervals ke beech intersection, insertion aur filtering karne ki comprehensive technique.',
      whatItIs: 'Ranges ko sort karke adjacent segments ke beech overlap check kiya jata hai.',
      whyItWorks: 'Sorting ki madad se ranges linear order mein align ho jati hain.',
      whenToUse: 'Interval list intersections, insert interval.',
      recognitionSignals: ['Intervals ke intersection ya merging ka sawal ho'],
      commonMistakes: ['Intersection formula galat lagana (max(start) aur min(end) hota hai)'],
      stepLogic: '1. Do pointers se dono lists scan karein.\n2. Overlap = [max(startA, startB), min(endA, endB)].\n3. Jiska end chhota ho us pointer ko aage badhayein.'
    },
    visual: {
      type: 'INTERVALS',
      category: 'INTERVALS',
      title: 'Interval Intersection',
      input: [[0, 2], [5, 10]],
      description: 'Intersection with [[1, 5], [8, 12]] yields [[1, 2], [8, 10]].',
      description_hi: 'Interval intersections: [[1, 2], [8, 10]].',
      steps: [
        { intervals: [[1, 2], [8, 10]], explanation: 'Overlapping sections calculated using max(start) and min(end)', explanation_hi: 'Overlapping sections nikaale gaye' }
      ],
      result: [[1, 2], [8, 10]]
    },
    code: `function intervalIntersection(A, B) {
  const result = [];
  let i = 0, j = 0;
  while (i < A.length && j < B.length) {
    const start = Math.max(A[i][0], B[j][0]);
    const end = Math.min(A[i][1], B[j][1]);
    if (start <= end) result.push([start, end]);
    if (A[i][1] < B[j][1]) i++;
    else j++;
  }
  return result;
}

console.log(intervalIntersection([[0, 2], [5, 10]], [[1, 5], [8, 12]])); // [[1, 2], [8, 10]]`,
    searchSignals: {
      tags: ['intervals', 'two-pointers', 'array'],
      keywords: ['interval list intersections', 'insert interval'],
      companies: ['Meta', 'Google', 'Amazon']
    },
    relatedCanonical: [
      { title: 'Interval List Intersections', difficulty: 'Medium', slug: 'interval-list-intersections', url: 'https://leetcode.com/problems/interval-list-intersections/' }
    ],
    externalResources: [
      { name: 'LeetCode Interval List Intersections', url: 'https://leetcode.com/problems/interval-list-intersections/', type: 'LeetCode' }
    ]
  }
};
