export const mathBitPatterns = {
  "XOR": {
    "slug": "bit-manipulation-xor",
    "name": "XOR",
    "topic": "Bit Manipulation",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "XOR Operator Properties (Self-Inverse Cancellation)",
      "overview": "Exploiting the algebraic properties of Bitwise XOR (`x ^ x = 0` and `x ^ 0 = x`) to cancel duplicate pairs and isolate unique values.",
      "whatItIs": "XOR is commutative and associative. XORing all elements in an array where every element appears twice except one reduces duplicates to 0, leaving the unique element.",
      "whyItWorks": "Pairs of identical bit patterns cancel each other out to zero: `(a ^ a) ^ (b ^ b) ^ c = 0 ^ 0 ^ c = c`.",
      "whenToUse": "Single Number I, II, III, Missing Number, Find the Duplicate Number.",
      "recognitionSignals": [
        "Every element appears twice except one",
        "Find missing element in range [0..N]",
        "O(1) space cancellation requirement"
      ],
      "commonMistakes": [
        "Confusing bitwise XOR (`^`) with exponentiation (`**`) in JavaScript",
        "Negative number bitwise representations in 32-bit signed integers"
      ],
      "stepLogic": "1. Initialize result = 0.\n2. For each num in nums: result ^= num.\n3. Return result."
    },
    "hi": {
      "title": "XOR Operator Properties",
      "overview": "Bitwise XOR ke rules (`x ^ x = 0` aur `x ^ 0 = x`) ka use karke duplicate pairs ko cancel karna aur unique number O(1) space mein nikalna.",
      "whatItIs": "XOR commutative hota hai; sabhi numbers ko XOR karne par jo do baar aate hain wo 0 ban jaate hain aur akela number bach jata hai.",
      "whyItWorks": "Same bit values XOR hone par zero ho jaati hain: `a ^ a = 0`.",
      "whenToUse": "Single Number, Missing Number problems mein.",
      "recognitionSignals": [
        "Har element 2 bar ata hai sirf ek ko chhod kar",
        "O(1) extra space requirement"
      ],
      "commonMistakes": [
        "JavaScript mein `^` ko power samajh lena (`^` bitwise XOR hota hai)"
      ],
      "stepLogic": "1. result = 0 rakhein.\n2. Array ke saare numbers ko result ^= num karein.\n3. result return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "BIT MANIPULATION",
      "title": "XOR Pair Cancellation",
      "input": [
        4,
        1,
        2,
        1,
        2
      ],
      "description": "Pairs (1^1=0) and (2^2=0) cancel out. Result: 4 ^ 0 = 4 in O(1) auxiliary space.",
      "description_hi": "Pairs 1 aur 2 cancel ho kar 0 bante hain, sirf 4 bachta hai.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            4,
            1,
            2,
            1,
            2
          ],
          "explanation": "4 ^ 1 = 5",
          "explanation_hi": "4 ^ 1 = 5"
        },
        {
          "activeIdx": 2,
          "elements": [
            4,
            1,
            2,
            1,
            2
          ],
          "explanation": "5 ^ 2 = 7",
          "explanation_hi": "5 ^ 2 = 7"
        },
        {
          "activeIdx": 3,
          "elements": [
            4,
            1,
            2,
            1,
            2
          ],
          "explanation": "7 ^ 1 = 6 (1 cancelled!)",
          "explanation_hi": "1 cancel hua"
        },
        {
          "activeIdx": 4,
          "elements": [
            4,
            1,
            2,
            1,
            2
          ],
          "explanation": "6 ^ 2 = 4 (2 cancelled!). Single number is 4!",
          "explanation_hi": "2 cancel hua -> Result 4!"
        }
      ],
      "result": 4
    },
    "code": "function singleNumber(nums) {\n  let res = 0;\n  for (const n of nums) res ^= n;\n  return res;\n}\n\nconsole.log(singleNumber([4, 1, 2, 1, 2])); // 4",
    "searchSignals": {
      "tags": [
        "bit-manipulation",
        "xor"
      ],
      "keywords": [
        "single number",
        "xor properties",
        "bitwise cancellation"
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
        "title": "Single Number",
        "difficulty": "Easy",
        "slug": "single-number",
        "url": "https://leetcode.com/problems/single-number/"
      },
      {
        "title": "Missing Number",
        "difficulty": "Easy",
        "slug": "missing-number",
        "url": "https://leetcode.com/problems/missing-number/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Single Number Editorial",
        "url": "https://leetcode.com/problems/single-number/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Bitmask": {
    "slug": "bit-manipulation-bitmask",
    "name": "Bitmask",
    "topic": "Bit Manipulation",
    "difficulty": "Medium",
    "timeComplexity": "O(1) per bit operation",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Bitmask Operations (Set, Clear, Toggle, Test)",
      "overview": "Manipulating individual bits using standard bitwise primitives in O(1) time and zero extra space.",
      "whatItIs": "Set bit: `mask | (1 << i)`. Clear bit: `mask & ~(1 << i)`. Toggle bit: `mask ^ (1 << i)`. Test bit: `(mask >> i) & 1`.",
      "whyItWorks": "Binary bit operations execute directly in CPU registers in a single clock cycle.",
      "whenToUse": "State representation, checking parity, Subsets, Smallest Sufficient Team.",
      "recognitionSignals": [
        "Manipulate individual bits of a flag",
        "Compact representation of boolean attributes"
      ],
      "commonMistakes": [
        "Bitwise operator precedence: `(mask & (1 << i)) !== 0` requires outer parentheses"
      ],
      "stepLogic": "1. To set bit i: mask = mask | (1 << i).\n2. To clear bit i: mask = mask & ~(1 << i).\n3. To test bit i: if ((mask & (1 << i)) !== 0) bit is set."
    },
    "hi": {
      "title": "Bitmask Operations",
      "overview": "Integer ke individual bits ko Set, Clear, Toggle aur Test karna standard bitwise operators se O(1) mein.",
      "whatItIs": "Set bit: `mask | (1 << i)`, Clear bit: `mask & ~(1 << i)`, Test bit: `(mask & (1 << i)) !== 0`.",
      "whyItWorks": "CPU registers direct single clock cycle mein bitwise operations execute karte hain.",
      "whenToUse": "Boolean flags aur states ko compactly store karne ke liye.",
      "recognitionSignals": [
        "Set/Clear/Test bits",
        "Compact bit flags"
      ],
      "commonMistakes": [
        "Operator precedence mein parentheses miss karna"
      ],
      "stepLogic": "1. Set: `mask | (1 << i)`.\n2. Clear: `mask & ~(1 << i)`.\n3. Test: `(mask >> i) & 1`."
    },
    "visual": {
      "type": "ARRAY",
      "category": "BIT MANIPULATION",
      "title": "Bitmask Bitwise Register Operations",
      "input": "mask = 0000_2. Set bit 2 -> 0100_2. Set bit 0 -> 0101_2.",
      "description": "Bit 2 represents element 2. Bit 0 represents element 0. Encodes set {0, 2} as integer 5.",
      "description_hi": "Bits 0 aur 2 set hone par integer 5 banta hai jo set {0, 2} represent karta hai.",
      "steps": [
        {
          "activeIdx": 2,
          "elements": [
            0,
            1,
            0,
            0
          ],
          "explanation": "Set bit 2: mask = 4 (0100_2)",
          "explanation_hi": "Bit 2 set hua"
        },
        {
          "activeIdx": 0,
          "elements": [
            0,
            1,
            0,
            1
          ],
          "explanation": "Set bit 0: mask = 5 (0101_2). Encodes subset {0, 2}!",
          "explanation_hi": "Bit 0 set hua -> Subset {0, 2} encode hua!"
        }
      ],
      "result": 5
    },
    "code": "class BitmaskHelper {\n  static setBit(mask, i) { return mask | (1 << i); }\n  static clearBit(mask, i) { return mask & ~(1 << i); }\n  static toggleBit(mask, i) { return mask ^ (1 << i); }\n  static isSet(mask, i) { return (mask & (1 << i)) !== 0; }\n}\n\nlet m = 0;\nm = BitmaskHelper.setBit(m, 2);\nconsole.log(BitmaskHelper.isSet(m, 2)); // true",
    "searchSignals": {
      "tags": [
        "bit-manipulation",
        "bitmask"
      ],
      "keywords": [
        "bitmask operations",
        "set bit",
        "clear bit",
        "test bit"
      ],
      "companies": [
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
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Bit Manipulation",
        "url": "https://cp-algorithms.com/",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Bit Tricks": {
    "slug": "bit-manipulation-bit-tricks",
    "name": "Bit Tricks",
    "topic": "Bit Manipulation",
    "difficulty": "Medium",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Famous Bit Tricks (Brian Kernighan's & Lowbit)",
      "overview": "Clever constant-time bit identity tricks: `n & (n - 1)` clears lowest set bit; `n & (-n)` isolates lowest set bit.",
      "whatItIs": "Brian Kernighan's trick: subtracting 1 flips the rightmost set bit and all following zeros. ANDing `n & (n - 1)` clears that lowest set bit in one instruction.",
      "whyItWorks": "Two's complement negation `-n = ~n + 1` leaves only the lowest set bit identical, so `n & (-n)` extracts the lowest bit.",
      "whenToUse": "Number of 1 Bits (Hamming Weight), Fenwick Tree (Binary Indexed Tree) index navigation, Power of Two.",
      "recognitionSignals": [
        "Count number of set bits in O(SetBits) instead of O(32)",
        "Isolate lowest set bit in O(1)"
      ],
      "commonMistakes": [
        "Bitwise operations treating negative numbers as signed 32-bit (use unsigned right shift `>>>`)"
      ],
      "stepLogic": "1. Brian Kernighan (Count set bits): count = 0; while (n !== 0): n = n & (n - 1); count++; return count.\n2. Lowbit: return n & (-n)."
    },
    "hi": {
      "title": "Famous Bit Tricks (Kernighan & Lowbit)",
      "overview": "O(1) time bit identities: `n & (n - 1)` sabse right wali set bit ko 0 karta hai; `n & (-n)` sabse right wali set bit ko isolate karta hai.",
      "whatItIs": "Brian Kernighan algorithm sirf set bits ki counting karta hai bina sabhi 32 bits ko check kiye.",
      "whyItWorks": "Two's complement `-n = ~n + 1` aur `n & (n - 1)` mathematical properties se operate karte hain.",
      "whenToUse": "Number of 1 Bits, Fenwick Tree index jumps, Power of Two verification mein.",
      "recognitionSignals": [
        "Count set bits in O(K)",
        "Isolate lowest set bit"
      ],
      "commonMistakes": [
        "Unsigned right shift `>>>` ke badle signed `>>` use karna negative numbers par"
      ],
      "stepLogic": "1. Kernighan: count = 0; while n != 0: n = n & (n - 1); count++.\n2. Lowbit: `n & (-n)`."
    },
    "visual": {
      "type": "ARRAY",
      "category": "BIT MANIPULATION",
      "title": "Brian Kernighan Set Bit Clearing",
      "input": "n = 12 (1100_2)",
      "description": "Step 1: 12 & 11 = 1100 & 1011 = 1000 (8). Cleared lowest 1 bit! Step 2: 8 & 7 = 0. Total 2 set bits.",
      "description_hi": "12 & 11 se lowest bit clear hokar 8 banta hai, fir 8 & 7 se 0. Total 2 set bits.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            1,
            1,
            0,
            0
          ],
          "explanation": "12 is 1100_2",
          "explanation_hi": "12 = 1100_2"
        },
        {
          "activeIdx": 1,
          "elements": [
            1,
            0,
            0,
            0
          ],
          "explanation": "12 & 11 = 1000_2 (cleared lowest 1 bit in 1 step!)",
          "explanation_hi": "Pehli set bit clear hui"
        },
        {
          "activeIdx": 2,
          "elements": [
            0,
            0,
            0,
            0
          ],
          "explanation": "8 & 7 = 0. Finished in 2 steps! Hamming weight = 2.",
          "explanation_hi": "Dusri set bit clear hui -> Answer = 2"
        }
      ],
      "result": 2
    },
    "code": "function hammingWeight(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1); // Clears rightmost set bit\n    count++;\n  }\n  return count;\n}\n\nconsole.log(hammingWeight(11)); // 3 (1011_2 has three 1s)",
    "searchSignals": {
      "tags": [
        "bit-manipulation",
        "bit-tricks",
        "hamming-weight"
      ],
      "keywords": [
        "brian kernighan",
        "bit tricks",
        "hamming weight",
        "n and n-1"
      ],
      "companies": [
        "Apple",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Number of 1 Bits",
        "difficulty": "Easy",
        "slug": "number-of-1-bits",
        "url": "https://leetcode.com/problems/number-of-1-bits/"
      },
      {
        "title": "Power of Two",
        "difficulty": "Easy",
        "slug": "power-of-two",
        "url": "https://leetcode.com/problems/power-of-two/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Hamming Weight Editorial",
        "url": "https://leetcode.com/problems/number-of-1-bits/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Subsets using Bits": {
    "slug": "bit-manipulation-subsets-using-bits",
    "name": "Subsets using Bits",
    "topic": "Bit Manipulation",
    "difficulty": "Medium",
    "timeComplexity": "O(N * 2^N)",
    "spaceComplexity": "O(1) auxiliary",
    "interviewFrequency": "High",
    "en": {
      "title": "Power Set via Binary Counting (Iterative Subsets)",
      "overview": "Generating all 2^N subsets iteratively by counting integers from 0 to 2^N - 1, using bit positions as element inclusion flags.",
      "whatItIs": "For each mask from 0 to (1 << N) - 1: if `(mask & (1 << j)) !== 0`, include `nums[j]` in the current subset.",
      "whyItWorks": "The binary representations of numbers 0 through 2^N - 1 enumerate all possible combinations of N binary choices.",
      "whenToUse": "Generating subsets iteratively without recursion, Bitmask DP submask enumeration (`sub = (sub - 1) & mask`).",
      "recognitionSignals": [
        "Iterative subset generation",
        "Loop mask from 0 to (1 << N) - 1"
      ],
      "commonMistakes": [
        "N > 30 causing 32-bit integer overflow in JS bitwise operations (use BigInt if N > 30)"
      ],
      "stepLogic": "1. Total subsets = 1 << n.\n2. For mask = 0 to total - 1:\n   subset = []\n   For j = 0 to n - 1: if ((mask & (1 << j)) !== 0) subset.push(nums[j])\n   res.push(subset)\n3. Return res."
    },
    "hi": {
      "title": "Iterative Subsets using Bits",
      "overview": "0 se 2^N - 1 tak binary counting karke bina recursion ke sabhi 2^N subsets generate karna.",
      "whatItIs": "Integer mask ke har bit j ko check karna: agar bit j set hai toh `nums[j]` ko subset mein add karein.",
      "whyItWorks": "0 se 2^N - 1 ke binary patterns saare possible include/exclude combinations ko represent karte hain.",
      "whenToUse": "Bina recursion ke subsets banane ke liye.",
      "recognitionSignals": [
        "Iterative power set",
        "Binary counting subsets"
      ],
      "commonMistakes": [
        "N > 30 hone par JS 32-bit bitwise overflow hona"
      ],
      "stepLogic": "1. mask = 0 se (1 << n) - 1 tak loop chalayein.\n2. Har bit check karein: `(mask & (1 << j)) !== 0`.\n3. Matched numbers ka subset result mein push karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "BIT MANIPULATION",
      "title": "Binary Counting Power Set (N=3)",
      "input": [
        "A",
        "B",
        "C"
      ],
      "description": "000->[], 001->[A], 010->[B], 011->[A,B], 100->[C], 101->[A,C], 110->[B,C], 111->[A,B,C].",
      "description_hi": "Binary numbers 0 se 7 tak exact 8 subsets generate karte hain.",
      "steps": [
        {
          "activeIdx": 3,
          "elements": [
            "A",
            "B"
          ],
          "explanation": "mask = 3 (011_2) -> subset [A, B]",
          "explanation_hi": "mask 3 = [A, B]"
        },
        {
          "activeIdx": 7,
          "elements": [
            "A",
            "B",
            "C"
          ],
          "explanation": "mask = 7 (111_2) -> subset [A, B, C] (all items)",
          "explanation_hi": "mask 7 = [A, B, C]"
        }
      ],
      "result": 8
    },
    "code": "function subsetsBitwise(nums) {\n  const n = nums.length;\n  const total = 1 << n;\n  const res = [];\n  \n  for (let mask = 0; mask < total; mask++) {\n    const sub = [];\n    for (let j = 0; j < n; j++) {\n      if ((mask & (1 << j)) !== 0) {\n        sub.push(nums[j]);\n      }\n    }\n    res.push(sub);\n  }\n  return res;\n}\n\nconsole.log(subsetsBitwise([1, 2, 3]));",
    "searchSignals": {
      "tags": [
        "bit-manipulation",
        "subsets",
        "iterative"
      ],
      "keywords": [
        "subsets using bits",
        "iterative power set",
        "binary counting subsets"
      ],
      "companies": [
        "Amazon",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Subsets",
        "difficulty": "Medium",
        "slug": "subsets",
        "url": "https://leetcode.com/problems/subsets/"
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
  "Power of Two": {
    "slug": "bit-manipulation-power-of-two",
    "name": "Power of Two",
    "topic": "Bit Manipulation",
    "difficulty": "Easy",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Power of Two (Bitwise Verification)",
      "overview": "Checking whether an integer is a power of two in strictly O(1) time using `n > 0 && (n & (n - 1)) === 0`.",
      "whatItIs": "A positive power of two has exactly one bit set in binary (e.g., 8 is 1000_2). Clearing its lowest set bit via `n & (n - 1)` must result in 0.",
      "whyItWorks": "If n is 2^k, n - 1 has all lower k bits set. Bitwise AND between 100...0 and 011...1 is always zero.",
      "whenToUse": "Power of Two, Power of Four (power of two AND `(n & 0x55555555) !== 0`).",
      "recognitionSignals": [
        "Determine if integer is power of 2 without loops",
        "Strictly O(1) time check"
      ],
      "commonMistakes": [
        "Forgetting to check `n > 0` (for n = 0 or negative numbers, formula fails)"
      ],
      "stepLogic": "1. Check `n > 0`.\n2. Return `(n & (n - 1)) === 0`."
    },
    "hi": {
      "title": "Power of Two (Bitwise Check)",
      "overview": "Bina kisi loop ya division ke O(1) time mein check karna ki kya number 2 ki power hai: `n > 0 && (n & (n - 1)) === 0`.",
      "whatItIs": "2 ki power wale number mein binary mein sirf 1 bit set hoti hai (e.g. 8 = 1000_2). `n & (n - 1)` karte hi wo 0 ho jata hai.",
      "whyItWorks": "2^k aur 2^k - 1 ke beech koi bhi common 1 bit nahi hoti, isliye unka bitwise AND hamesha 0 hota hai.",
      "whenToUse": "Power of Two, Power of Four questions mein.",
      "recognitionSignals": [
        "Check power of 2 without loops",
        "O(1) time bitwise check"
      ],
      "commonMistakes": [
        "`n > 0` check na karna (n <= 0 par galat result deta hai)"
      ],
      "stepLogic": "1. Check karein `n > 0`.\n2. Return karein `(n & (n - 1)) === 0`."
    },
    "visual": {
      "type": "ARRAY",
      "category": "BIT MANIPULATION",
      "title": "Power of Two Zero Check",
      "input": "n = 16 (10000_2), n - 1 = 15 (01111_2)",
      "description": "16 & 15 = 10000_2 & 01111_2 = 00000_2 (0). Exactly zero -> Valid power of 2!",
      "description_hi": "16 & 15 = 0 hota hai, isliye 16 valid power of 2 hai.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            1,
            0,
            0,
            0,
            0
          ],
          "explanation": "16 is 10000_2",
          "explanation_hi": "16 = 10000_2"
        },
        {
          "activeIdx": 1,
          "elements": [
            0,
            1,
            1,
            1,
            1
          ],
          "explanation": "15 is 01111_2. Bitwise AND = 0 -> Power of Two!",
          "explanation_hi": "16 & 15 = 0 -> Valid Power of 2!"
        }
      ],
      "result": true
    },
    "code": "function isPowerOfTwo(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}\n\nconsole.log(isPowerOfTwo(16)); // true\nconsole.log(isPowerOfTwo(18)); // false",
    "searchSignals": {
      "tags": [
        "bit-manipulation",
        "math",
        "power-of-two"
      ],
      "keywords": [
        "power of two",
        "n and n-1 zero",
        "bitwise power of 2"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Power of Two",
        "difficulty": "Easy",
        "slug": "power-of-two",
        "url": "https://leetcode.com/problems/power-of-two/"
      },
      {
        "title": "Power of Four",
        "difficulty": "Easy",
        "slug": "power-of-four",
        "url": "https://leetcode.com/problems/power-of-four/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Power of Two Editorial",
        "url": "https://leetcode.com/problems/power-of-two/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Counting Bits": {
    "slug": "bit-manipulation-counting-bits",
    "name": "Counting Bits",
    "topic": "Bit Manipulation",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N) output array",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Counting Bits (Bitwise Dynamic Programming)",
      "overview": "Computing number of 1 bits for all integers from 0 to N in strictly linear O(N) time using DP recurrence.",
      "whatItIs": "Relation: `ans[i] = ans[i >> 1] + (i & 1)` or `ans[i] = ans[i & (i - 1)] + 1`.",
      "whyItWorks": "Shifting right `i >> 1` drops the last bit; its set-bit count is already computed. Adding `i & 1` accounts for the dropped bit.",
      "whenToUse": "Counting Bits, Hamming Distance, bit frequency arrays.",
      "recognitionSignals": [
        "Count set bits for all numbers 0 to N in O(N)",
        "Bit DP recurrence"
      ],
      "commonMistakes": [
        "Calling popcount on each number independently taking O(N log N) instead of O(N) DP recurrence"
      ],
      "stepLogic": "1. ans = new Array(n + 1).fill(0).\n2. For i = 1 to n: ans[i] = ans[i >> 1] + (i & 1).\n3. Return ans."
    },
    "hi": {
      "title": "Counting Bits (DP Recurrence)",
      "overview": "0 se N tak ke sabhi numbers ke set bits O(N) linear time mein nikalna DP relation se: `ans[i] = ans[i >> 1] + (i & 1)`.",
      "whatItIs": "Right shift `i >> 1` karne par pichla number ban jata hai jiska answer pehle se calculated hai.",
      "whyItWorks": "Har number ka bit count uske aadhe `i >> 1` ke bit count + aakhiri bit (0 ya 1) ke barabar hota hai.",
      "whenToUse": "Counting Bits problem mein.",
      "recognitionSignals": [
        "Count bits for 0 to N in O(N)",
        "Bitwise DP relation"
      ],
      "commonMistakes": [
        "Har number par alag loop chalana (O(N log N) ban jata hai)"
      ],
      "stepLogic": "1. ans array 0 se initialize karein.\n2. Loop 1 se n: `ans[i] = ans[i >> 1] + (i & 1)`.\n3. ans return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "BIT MANIPULATION",
      "title": "Counting Bits DP Progression",
      "input": "n = 5",
      "description": "ans[0]=0. ans[1]=ans[0]+1=1. ans[2]=ans[1]+0=1. ans[3]=ans[1]+1=2. ans[4]=ans[2]+0=1. ans[5]=ans[2]+1=2.",
      "description_hi": "DP se har number ka set bit count pichle answer se turant O(1) mein nikalta hai.",
      "steps": [
        {
          "activeIdx": 2,
          "elements": [
            0,
            1,
            1
          ],
          "explanation": "ans[2] = ans[1] + (2&1) = 1 + 0 = 1",
          "explanation_hi": "ans[2] = 1"
        },
        {
          "activeIdx": 5,
          "elements": [
            0,
            1,
            1,
            2,
            1,
            2
          ],
          "explanation": "ans[5] = ans[2] + (5&1) = 1 + 1 = 2! All bits counted in O(N).",
          "explanation_hi": "ans[5] = 2! Complete array in O(N)."
        }
      ],
      "result": [
        0,
        1,
        1,
        2,
        1,
        2
      ]
    },
    "code": "function countBits(n) {\n  const ans = new Array(n + 1).fill(0);\n  for (let i = 1; i <= n; i++) {\n    ans[i] = ans[i >> 1] + (i & 1);\n  }\n  return ans;\n}\n\nconsole.log(countBits(5)); // [0, 1, 1, 2, 1, 2]",
    "searchSignals": {
      "tags": [
        "bit-manipulation",
        "dynamic-programming",
        "counting-bits"
      ],
      "keywords": [
        "counting bits",
        "bit dp",
        "number of set bits 0 to n"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Apple"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Counting Bits",
        "difficulty": "Easy",
        "slug": "counting-bits",
        "url": "https://leetcode.com/problems/counting-bits/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Counting Bits Editorial",
        "url": "https://leetcode.com/problems/counting-bits/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "GCD": {
    "slug": "math-gcd",
    "name": "GCD",
    "topic": "Math",
    "difficulty": "Easy",
    "timeComplexity": "O(log(min(a, b)))",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Greatest Common Divisor (Euclidean Algorithm)",
      "overview": "Computing the greatest common divisor of two integers using the Euclidean division theorem in logarithmic steps.",
      "whatItIs": "`gcd(a, b) = gcd(b, a % b)`. When b === 0, gcd is a.",
      "whyItWorks": "If d divides both a and b, d must also divide the remainder `a - q * b = a % b`.",
      "whenToUse": "Simplifying fractions, finding coprime numbers, Water and Jug Problem, LCM calculations.",
      "recognitionSignals": [
        "Find greatest common factor",
        "Reduce numerator and denominator to lowest terms",
        "Bézout's identity"
      ],
      "commonMistakes": [
        "Recursion without checking `b === 0` base case"
      ],
      "stepLogic": "1. While b !== 0: temp = b; b = a % b; a = temp.\n2. Return a."
    },
    "hi": {
      "title": "Greatest Common Divisor (Euclidean Algorithm)",
      "overview": "Do numbers ka sabse bada common factor (HCF/GCD) Euclidean theorem se O(log(min(a, b))) mein nikalna.",
      "whatItIs": "`gcd(a, b) = gcd(b, a % b)`. Jab b zero ho jaye tab bacha hua a answer hota hai.",
      "whyItWorks": "Agar d a aur b dono ko divide karta hai, toh wo unke remainder `a % b` ko bhi divide karega.",
      "whenToUse": "Fractions simplify karne, Water and Jug Problem mein.",
      "recognitionSignals": [
        "Greatest common divisor",
        "HCF calculation"
      ],
      "commonMistakes": [
        "Modulo 0 handle na karna"
      ],
      "stepLogic": "1. While b != 0: temp = b, b = a % b, a = temp.\n2. a return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "MATH",
      "title": "Euclidean Division Steps",
      "input": {
        "a": 48,
        "b": 18
      },
      "description": "48 % 18 = 12 -> 18 % 12 = 6 -> 12 % 6 = 0. GCD = 6.",
      "description_hi": "48 aur 18 ka GCD 3 steps mein 6 nikalta hai.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            48,
            18
          ],
          "explanation": "48 % 18 = 12 -> next is (18, 12)",
          "explanation_hi": "48 % 18 = 12"
        },
        {
          "activeIdx": 1,
          "elements": [
            18,
            12
          ],
          "explanation": "18 % 12 = 6 -> next is (12, 6)",
          "explanation_hi": "18 % 12 = 6"
        },
        {
          "activeIdx": 2,
          "elements": [
            12,
            6
          ],
          "explanation": "12 % 6 = 0 -> GCD is 6!",
          "explanation_hi": "12 % 6 = 0 -> GCD = 6!"
        }
      ],
      "result": 6
    },
    "code": "function gcd(a, b) {\n  while (b !== 0) {\n    const temp = b;\n    b = a % b;\n    a = temp;\n  }\n  return Math.abs(a);\n}\n\nconsole.log(gcd(48, 18)); // 6",
    "searchSignals": {
      "tags": [
        "math",
        "gcd",
        "number-theory"
      ],
      "keywords": [
        "euclidean algorithm",
        "gcd",
        "greatest common divisor"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Water and Jug Problem",
        "difficulty": "Medium",
        "slug": "water-and-jug-problem",
        "url": "https://leetcode.com/problems/water-and-jug-problem/"
      },
      {
        "title": "Greatest Common Divisor of Strings",
        "difficulty": "Easy",
        "slug": "greatest-common-divisor-of-strings",
        "url": "https://leetcode.com/problems/greatest-common-divisor-of-strings/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Euclidean Algorithm",
        "url": "https://cp-algorithms.com/algebra/euclid-algorithm.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "LCM": {
    "slug": "math-lcm",
    "name": "LCM",
    "topic": "Math",
    "difficulty": "Easy",
    "timeComplexity": "O(log(min(a, b)))",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Least Common Multiple (GCD Formula)",
      "overview": "Computing least common multiple using the identity `LCM(a, b) = (a * b) / GCD(a, b)`.",
      "whatItIs": "To prevent integer overflow, divide before multiplying: `(a / GCD(a, b)) * b`.",
      "whyItWorks": "Every common multiple must contain the union of prime factors of a and b. Their product contains the intersection twice, which GCD divides out.",
      "whenToUse": "Periodic cycle alignment, finding common recurrence intervals.",
      "recognitionSignals": [
        "Smallest number divisible by both a and b",
        "Events repeating at different intervals aligning together"
      ],
      "commonMistakes": [
        "Multiplying `a * b` before division, causing 32-bit integer overflow"
      ],
      "stepLogic": "1. Compute g = gcd(a, b).\n2. Return (a / g) * b."
    },
    "hi": {
      "title": "Least Common Multiple (LCM)",
      "overview": "Identity `LCM(a, b) = (a * b) / GCD(a, b)` se LCM calculate karna.",
      "whatItIs": "Integer overflow se bachne ke liye pehle divide karein: `(a / gcd(a, b)) * b`.",
      "whyItWorks": "Product mein common factors do baar count hote hain, GCD unhe divide karke cancel karta hai.",
      "whenToUse": "Periodic events aur recurrence intervals synchronize karne mein.",
      "recognitionSignals": [
        "Least common multiple",
        "Repeated interval alignment"
      ],
      "commonMistakes": [
        "Pehle multiply karna jisse number overflow ho jaye"
      ],
      "stepLogic": "1. g = gcd(a, b) calculate karein.\n2. (a / g) * b return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "MATH",
      "title": "LCM from GCD Calculation",
      "input": {
        "a": 12,
        "b": 18
      },
      "description": "GCD(12, 18) = 6. LCM = (12 / 6) * 18 = 2 * 18 = 36.",
      "description_hi": "GCD 6 se divide karke LCM 36 nikalta hai.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            12,
            18
          ],
          "explanation": "GCD(12, 18) = 6",
          "explanation_hi": "GCD 6 nikal gaya"
        },
        {
          "activeIdx": 1,
          "elements": [
            2,
            18
          ],
          "explanation": "(12 / 6) = 2",
          "explanation_hi": "Divide kiya -> 2"
        },
        {
          "activeIdx": 2,
          "elements": [
            36
          ],
          "explanation": "2 * 18 = 36! LCM = 36.",
          "explanation_hi": "LCM = 36!"
        }
      ],
      "result": 36
    },
    "code": "function lcm(a, b) {\n  function gcd(x, y) {\n    while (y !== 0) {\n      const t = y;\n      y = x % y;\n      x = t;\n    }\n    return x;\n  }\n  return (a / gcd(a, b)) * b;\n}\n\nconsole.log(lcm(12, 18)); // 36",
    "searchSignals": {
      "tags": [
        "math",
        "lcm",
        "gcd"
      ],
      "keywords": [
        "lcm formula",
        "least common multiple",
        "lcm gcd identity"
      ],
      "companies": [
        "Amazon",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Ugly Number III",
        "difficulty": "Medium",
        "slug": "ugly-number-iii",
        "url": "https://leetcode.com/problems/ugly-number-iii/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms LCM",
        "url": "https://cp-algorithms.com/algebra/euclid-algorithm.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Modular Arithmetic": {
    "slug": "math-modular-arithmetic",
    "name": "Modular Arithmetic",
    "topic": "Math",
    "difficulty": "Medium",
    "timeComplexity": "O(1) per operation",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Modular Arithmetic Rules (Addition, Multiplication, Inverse)",
      "overview": "Preventing integer overflow by applying modulo properties throughout intermediate calculations.",
      "whatItIs": "Rules: `(a + b) % M = ((a % M) + (b % M)) % M`. `(a * b) % M = ((a % M) * (b % M)) % M`. Division: `(a / b) % M = (a * b^(M-2)) % M` via Fermat's Little Theorem when M is prime.",
      "whyItWorks": "Modulo congruence is a ring homomorphism preserving addition and multiplication across residue classes.",
      "whenToUse": "Any problem asking for \"answer modulo 10^9 + 7\", combinatorics nCr with modulo, counting paths.",
      "recognitionSignals": [
        "Return answer modulo 10^9 + 7",
        "Avoid 64-bit overflow in combinatorial counting"
      ],
      "commonMistakes": [
        "Handling subtraction: `(a - b) % M` can be negative in JS (must do `((a - b) % M + M) % M`)"
      ],
      "stepLogic": "1. Add: `((a % M) + (b % M)) % M`.\n2. Sub: `(((a - b) % M) + M) % M`.\n3. Mul: `Number((BigInt(a) * BigInt(b)) % BigInt(M))`.\n4. Div: multiply by modular inverse `pow(b, M - 2, M)`."
    },
    "hi": {
      "title": "Modular Arithmetic Rules",
      "overview": "Large numbers ke overflow se bachne ke liye har calculation par modulo arithmetic lagana (e.g. modulo 10^9 + 7).",
      "whatItIs": "Addition aur multiplication mein modulo distribute ho jata hai. Subtraction mein negative remainder avoid karne ke liye `+ M` kiya jata hai.",
      "whyItWorks": "Fermat's Little Theorem se prime modulo M ke liye division modular inverse ban jata hai: `b^(M-2)`.",
      "whenToUse": "Jab question kahe \"Return answer modulo 10^9 + 7\".",
      "recognitionSignals": [
        "Modulo 10^9 + 7 requirement",
        "Combinatorics modulo division"
      ],
      "commonMistakes": [
        "Subtraction mein negative remainder aane dena (`+ M` bhool jana)"
      ],
      "stepLogic": "1. Addition: `(a + b) % M`.\n2. Subtraction: `((a - b) % M + M) % M`.\n3. Division: `a * modInverse(b, M)`."
    },
    "visual": {
      "type": "ARRAY",
      "category": "MATH",
      "title": "Modulo Underflow Protection",
      "input": "a = 3, b = 7, M = 1000000007",
      "description": "(3 - 7) % M in JS is -4. With safe formula: ((-4 % M) + M) % M = 1000000003 (positive!).",
      "description_hi": "Negative remainder se bachne ke liye `+ M` karke safe modulo nikalte hain.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            -4
          ],
          "explanation": "Raw (3 - 7) = -4",
          "explanation_hi": "Raw subtraction = -4"
        },
        {
          "activeIdx": 1,
          "elements": [
            1000000003
          ],
          "explanation": "((-4 % M) + M) % M = 1,000,000,003 (Safe positive residue!)",
          "explanation_hi": "Positive residue safe ban gaya!"
        }
      ],
      "result": 1000000003
    },
    "code": "const MOD = 1000000007n;\n\nfunction modAdd(a, b) { return Number((BigInt(a) + BigInt(b)) % MOD); }\nfunction modSub(a, b) { return Number(((BigInt(a) - BigInt(b)) % MOD + MOD) % MOD); }\nfunction modMul(a, b) { return Number((BigInt(a) * BigInt(b)) % MOD); }\n\nconsole.log(modSub(3, 7)); // 1000000003",
    "searchSignals": {
      "tags": [
        "math",
        "modular-arithmetic",
        "number-theory"
      ],
      "keywords": [
        "modular arithmetic",
        "modulo 10e9+7",
        "fermat little theorem"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Count Number of Ways to Place Houses",
        "difficulty": "Medium",
        "slug": "count-number-of-ways-to-place-houses",
        "url": "https://leetcode.com/problems/count-number-of-ways-to-place-houses/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Modular Arithmetic",
        "url": "https://cp-algorithms.com/algebra/module-inverse.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Fast Exponentiation": {
    "slug": "math-fast-exponentiation",
    "name": "Fast Exponentiation",
    "topic": "Math",
    "difficulty": "Medium",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Binary Exponentiation (Fast Power)",
      "overview": "Computing x^n in O(log N) multiplications by squaring base and halving exponent repeatedly.",
      "whatItIs": "If n is even, `x^n = (x^2)^(n/2)`. If n is odd, `x^n = x * (x^2)^((n-1)/2)`.",
      "whyItWorks": "Binary decomposition of power n reduces N linear multiplications to at most 2 * log2(N) squarings.",
      "whenToUse": "Pow(x, n), Modular Exponentiation, Matrix Exponentiation (Fibonacci in O(log N)).",
      "recognitionSignals": [
        "Calculate x^n for large n (n up to 2^31 - 1)",
        "Logarithmic power calculation"
      ],
      "commonMistakes": [
        "Handling negative powers: `x^(-n) = (1/x)^n`",
        "Integer overflow on `-2147483648` in 32-bit signed integers"
      ],
      "stepLogic": "1. If n < 0: x = 1 / x, n = -n.\n2. res = 1.\n3. While n > 0: if (n % 2 === 1) res *= x; x *= x; n = Math.floor(n / 2).\n4. Return res."
    },
    "hi": {
      "title": "Fast Exponentiation (Binary Power)",
      "overview": "x^n ko O(log N) time mein calculate karna base ko square aur power ko aadha karte hue.",
      "whatItIs": "Agar power even hai toh `(x*x)^(n/2)`, agar odd hai toh `x * (x*x)^((n-1)/2)`.",
      "whyItWorks": "Power n ke binary bits process hote hain, isliye N multiplications ke badle sirf log2(N) steps lagte hain.",
      "whenToUse": "Pow(x, n) aur Modular Exponentiation mein.",
      "recognitionSignals": [
        "Calculate x^n in O(log N)",
        "Large exponent calculation"
      ],
      "commonMistakes": [
        "Negative powers handle na karna (`x^(-n) = (1/x)^n`)"
      ],
      "stepLogic": "1. n < 0 ho toh x = 1/x aur n = -n karein.\n2. res = 1.\n3. While n > 0: odd hone par res *= x; x *= x; n = n / 2.\n4. res return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "MATH",
      "title": "Exponent Halving Steps (2^10)",
      "input": "x = 2, n = 10",
      "description": "2^10 = (2^2)^5 = 4^5 = 4 * 16^2 = 4 * 256 = 1024. Only 4 multiplications instead of 10!",
      "description_hi": "10 multiplications ke badle sirf 4 squarings mein 1024 calculate hota hai.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            2,
            10
          ],
          "explanation": "2^10 -> square base to 4, n=5",
          "explanation_hi": "4^5 bana"
        },
        {
          "activeIdx": 1,
          "elements": [
            4,
            5
          ],
          "explanation": "n is odd: res *= 4. Base becomes 16, n=2",
          "explanation_hi": "res = 4, base = 16, n = 2"
        },
        {
          "activeIdx": 2,
          "elements": [
            16,
            2
          ],
          "explanation": "Base becomes 256, n=1 -> res = 4 * 256 = 1024!",
          "explanation_hi": "Result = 1024!"
        }
      ],
      "result": 1024
    },
    "code": "function myPow(x, n) {\n  if (n === 0) return 1;\n  let p = n;\n  if (p < 0) {\n    x = 1 / x;\n    p = -p;\n  }\n  let res = 1;\n  while (p > 0) {\n    if (p % 2 === 1) res *= x;\n    x *= x;\n    p = Math.floor(p / 2);\n  }\n  return res;\n}\n\nconsole.log(myPow(2.0, 10)); // 1024",
    "searchSignals": {
      "tags": [
        "math",
        "binary-exponentiation",
        "power"
      ],
      "keywords": [
        "pow x n",
        "fast exponentiation",
        "binary exponentiation"
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
        "title": "Pow(x, n)",
        "difficulty": "Medium",
        "slug": "powx-n",
        "url": "https://leetcode.com/problems/powx-n/"
      },
      {
        "title": "Super Pow",
        "difficulty": "Medium",
        "slug": "super-pow",
        "url": "https://leetcode.com/problems/super-pow/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Pow(x, n) Editorial",
        "url": "https://leetcode.com/problems/powx-n/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Prime Sieve": {
    "slug": "math-prime-sieve",
    "name": "Prime Sieve",
    "topic": "Math",
    "difficulty": "Medium",
    "timeComplexity": "O(N log log N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Sieve of Eratosthenes (Prime Generation)",
      "overview": "Generating all prime numbers strictly less than N in O(N log log N) time by eliminating multiples of primes.",
      "whatItIs": "Boolean array where `isPrime[i]` is true initially. For each prime p starting from 2, mark all multiples `p*p, p*p + p, ...` as false.",
      "whyItWorks": "Composite numbers < p*p have already been marked by smaller prime factors, so inner loop starts at p*p.",
      "whenToUse": "Count Primes, Prime Factorization preprocessing, Closest Prime Numbers in Range.",
      "recognitionSignals": [
        "Find/count all primes up to N",
        "Prime factorization queries across large ranges"
      ],
      "commonMistakes": [
        "Starting inner loop from `2*p` instead of `p*p` (still correct, but `p*p` is optimal)",
        "Integer overflow when computing `p * p` on large N"
      ],
      "stepLogic": "1. isPrime array of size n filled with true; isPrime[0] = isPrime[1] = false.\n2. For p = 2 to Math.sqrt(n):\n   If isPrime[p]: for i = p * p to n - 1 with step p: isPrime[i] = false.\n3. Count or filter remaining true entries."
    },
    "hi": {
      "title": "Sieve of Eratosthenes (Prime Numbers)",
      "overview": "N tak ke sabhi prime numbers ko O(N log log N) time mein generate karna composite numbers ko cross-off karke.",
      "whatItIs": "Array mein sabhi ko prime maan kar 2 se shuru karein aur har prime ke multiples `p*p, p*p + p...` ko false mark karein.",
      "whyItWorks": "p*p se pehle ke sabhi multiples chhote primes dwara pehle hi mark ho chuke hote hain.",
      "whenToUse": "Count Primes problem mein.",
      "recognitionSignals": [
        "Count primes less than N",
        "Prime numbers generation"
      ],
      "commonMistakes": [
        "Inner loop ko 2*p se chalana (p*p se chalana optimal hota hai)"
      ],
      "stepLogic": "1. isPrime array banayein, 0 aur 1 ko false karein.\n2. p = 2 se sqrt(n) tak loop chalayein.\n3. isPrime[p] true hone par p*p se multiples ko false karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "MATH",
      "title": "Eratosthenes Multiple Elimination",
      "input": "n = 10",
      "description": "Primes <= 10: 2 marks 4,6,8. 3 marks 9. Remaining primes: [2, 3, 5, 7]. Total count = 4.",
      "description_hi": "2 ke multiples (4,6,8) aur 3 ke multiples (9) eliminate hokar primes [2,3,5,7] bachte hain.",
      "steps": [
        {
          "activeIdx": 2,
          "elements": [
            false,
            false,
            true,
            true,
            false,
            true,
            false,
            true,
            false,
            false
          ],
          "explanation": "Eliminated multiples of 2 and 3",
          "explanation_hi": "2 aur 3 ke multiples cross hue"
        },
        {
          "activeIdx": 7,
          "elements": [
            2,
            3,
            5,
            7
          ],
          "explanation": "Remaining primes: [2, 3, 5, 7]. Count = 4!",
          "explanation_hi": "Total primes = 4!"
        }
      ],
      "result": 4
    },
    "code": "function countPrimes(n) {\n  if (n <= 2) return 0;\n  const isPrime = new Uint8Array(n).fill(1);\n  isPrime[0] = isPrime[1] = 0;\n  \n  for (let p = 2; p * p < n; p++) {\n    if (isPrime[p]) {\n      for (let i = p * p; i < n; i += p) {\n        isPrime[i] = 0;\n      }\n    }\n  }\n  return isPrime.reduce((acc, val) => acc + val, 0);\n}\n\nconsole.log(countPrimes(10)); // 4 (2, 3, 5, 7)",
    "searchSignals": {
      "tags": [
        "math",
        "sieve",
        "primes"
      ],
      "keywords": [
        "sieve of eratosthenes",
        "count primes",
        "prime generation"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Count Primes",
        "difficulty": "Medium",
        "slug": "count-primes",
        "url": "https://leetcode.com/problems/count-primes/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Sieve of Eratosthenes",
        "url": "https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Combinatorics": {
    "slug": "math-combinatorics",
    "name": "Combinatorics",
    "topic": "Math",
    "difficulty": "Medium",
    "timeComplexity": "O(N) precompute, O(1) query",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Combinatorics nCr (Factorials and Modular Inverse)",
      "overview": "Computing combinations nCr modulo M in O(1) time using precomputed factorials and modular inverse arrays.",
      "whatItIs": "Formula: `nCr = n! / (r! * (n - r)!) = fact[n] * invFact[r] * invFact[n - r] % M`.",
      "whyItWorks": "Precomputing factorials and inverse factorials via `invFact[i] = invFact[i+1] * (i+1) % M` enables O(1) query answering.",
      "whenToUse": "Unique Paths (grid combination formula), Pascal's Triangle, counting arrangements under constraints.",
      "recognitionSignals": [
        "Count ways to choose r items from n",
        "Grid paths combinations formula `(m+n-2) C (m-1)`"
      ],
      "commonMistakes": [
        "Computing n! with BigInt on every query instead of O(N) precomputed arrays"
      ],
      "stepLogic": "1. fact[0] = 1; for i = 1 to N: fact[i] = (fact[i-1] * i) % M.\n2. invFact[N] = modInverse(fact[N], M).\n3. For i = N - 1 down to 0: invFact[i] = (invFact[i+1] * (i+1)) % M.\n4. Query: nCr(n, r) = fact[n] * invFact[r] % M * invFact[n-r] % M."
    },
    "hi": {
      "title": "Combinatorics nCr (Factorials & Inverses)",
      "overview": "Precomputed factorials aur modular inverses ka use karke kisi bhi nCr query ko O(1) time mein answer karna.",
      "whatItIs": "`nCr = fact[n] * invFact[r] * invFact[n - r] % M`.",
      "whyItWorks": "Ek bar factorials precompute ho jane par har combination query single multiplication se O(1) mein solve hoti hai.",
      "whenToUse": "Unique Paths grid formula aur combination counting questions mein.",
      "recognitionSignals": [
        "Choose r from n items",
        "nCr modulo 10^9 + 7"
      ],
      "commonMistakes": [
        "Har query par n! dobara calculate karna"
      ],
      "stepLogic": "1. fact aur invFact arrays precompute karein.\n2. Query nCr ko formula se O(1) mein return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "MATH",
      "title": "Pascal Combinations nCr Mapping",
      "input": "n = 4, r = 2",
      "description": "4C2 = 4! / (2! * 2!) = 24 / (2 * 2) = 6 combinations.",
      "description_hi": "4C2 = 6 unique combinations bante hain.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            1,
            1
          ],
          "explanation": "Row 1: [1, 1]",
          "explanation_hi": "Row 1"
        },
        {
          "activeIdx": 2,
          "elements": [
            1,
            4,
            6,
            4,
            1
          ],
          "explanation": "Row 4: 4C0=1, 4C1=4, 4C2=6! Answer = 6.",
          "explanation_hi": "Row 4: 4C2 = 6 mil gaya!"
        }
      ],
      "result": 6
    },
    "code": "const MOD = 1000000007n;\n\nfunction precomputeFactorials(maxN) {\n  const fact = new Array(maxN + 1);\n  const invFact = new Array(maxN + 1);\n  fact[0] = 1n;\n  for (let i = 1; i <= maxN; i++) fact[i] = (fact[i - 1] * BigInt(i)) % MOD;\n  \n  function modPow(b, exp) {\n    let res = 1n;\n    b = b % MOD;\n    while (exp > 0n) {\n      if (exp % 2n === 1n) res = (res * b) % MOD;\n      b = (b * b) % MOD;\n      exp /= 2n;\n    }\n    return res;\n  }\n  \n  invFact[maxN] = modPow(fact[maxN], MOD - 2n);\n  for (let i = maxN - 1; i >= 0; i--) {\n    invFact[i] = (invFact[i + 1] * BigInt(i + 1)) % MOD;\n  }\n  \n  return function nCr(n, r) {\n    if (r < 0 || r > n) return 0;\n    const ans = (((fact[n] * invFact[r]) % MOD) * invFact[n - r]) % MOD;\n    return Number(ans);\n  };\n}\n\nconst nCr = precomputeFactorials(100);\nconsole.log(nCr(4, 2)); // 6",
    "searchSignals": {
      "tags": [
        "math",
        "combinatorics",
        "ncr"
      ],
      "keywords": [
        "ncr combinations",
        "modular inverse factorials",
        "pascal combinations"
      ],
      "companies": [
        "Google",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Unique Paths",
        "difficulty": "Medium",
        "slug": "unique-paths",
        "url": "https://leetcode.com/problems/unique-paths/"
      },
      {
        "title": "Pascal's Triangle",
        "difficulty": "Easy",
        "slug": "pascals-triangle",
        "url": "https://leetcode.com/problems/pascals-triangle/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Binomial Coefficients",
        "url": "https://cp-algorithms.com/combinatorics/binomial-coefficients.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Probability": {
    "slug": "math-probability",
    "name": "Probability",
    "topic": "Math",
    "difficulty": "Medium",
    "timeComplexity": "O(K * N)",
    "spaceComplexity": "O(N^2)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Probability DP (Markov State Transitions)",
      "overview": "Calculating event probabilities using expected value formulas and transition matrices.",
      "whatItIs": "Each state transition distributes probability mass evenly: `prob[next] += prob[curr] * (1 / branchCount)`.",
      "whyItWorks": "Law of Total Probability: the probability of being at state S at step k is the sum of probabilities of transitioning from all predecessor states.",
      "whenToUse": "Knight Probability in Chessboard, Soup Servings, Airplane Seat Assignment Probability.",
      "recognitionSignals": [
        "Probability of staying on board after K steps",
        "Random walk on grid with equal choice distributions"
      ],
      "commonMistakes": [
        "Adding integer counts instead of floating point probability masses"
      ],
      "stepLogic": "1. dp[r][c] = 1 at start position, 0 elsewhere.\n2. For step = 1 to k:\n   nextDp = zeros\n   For (r, c) with dp > 0: for each of 8 knight moves: if inside board: nextDp[nr][nc] += dp[r][c] / 8\n   dp = nextDp.\n3. Return sum of all cells in dp."
    },
    "hi": {
      "title": "Probability DP (State Transitions)",
      "overview": "Expected value aur transition probabilities ka use karke K steps ke baad event ki probability nikalna.",
      "whatItIs": "Har step par probability mass ko available valid directions mein evenly distribute karna (e.g. Knight ke 8 moves mein / 8).",
      "whyItWorks": "Law of Total Probability ke hisab se har cell ki probability pichle valid moves ke sum ke barabar hoti hai.",
      "whenToUse": "Knight Probability in Chessboard, Soup Servings mein.",
      "recognitionSignals": [
        "Probability after K moves",
        "Random walk on grid"
      ],
      "commonMistakes": [
        "Integer division use karna float ke badle"
      ],
      "stepLogic": "1. Start cell ki probability 1 karein.\n2. K steps tak loop chalayein aur 8 moves par `dp / 8` distribute karein.\n3. Board ke andar bachi hui saari probabilities ka sum return karein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "MATH",
      "title": "Probability Mass Distribution",
      "input": "Knight on 3x3 board at (0,0), k=1 step",
      "description": "Knight has 8 moves, only 2 stay on board: (1, 2) and (2, 1). Probability on board = 2 / 8 = 0.25 (25%).",
      "description_hi": "8 moves mein se sirf 2 board par rehte hain -> Probability = 2/8 = 0.25.",
      "steps": [
        {
          "row": 0,
          "col": 0,
          "cellVal": "p = 1.0 (start)",
          "explanation": "Knight starts at (0, 0)",
          "explanation_hi": "Start probability 1.0"
        },
        {
          "row": 1,
          "col": 2,
          "cellVal": "p = 0.125",
          "explanation": "Move to (1, 2): probability = 1/8 = 0.125",
          "explanation_hi": "(1, 2) probability = 0.125"
        },
        {
          "row": 2,
          "col": 1,
          "cellVal": "p = 0.125",
          "explanation": "Total probability on board = 0.125 + 0.125 = 0.25!",
          "explanation_hi": "Total board probability = 0.25!"
        }
      ],
      "result": 0.25
    },
    "code": "function knightProbability(n, k, row, column) {\n  let dp = Array.from({ length: n }, () => new Array(n).fill(0));\n  dp[row][column] = 1;\n  const dirs = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];\n  \n  for (let step = 0; step < k; step++) {\n    const nextDp = Array.from({ length: n }, () => new Array(n).fill(0));\n    for (let r = 0; r < n; r++) {\n      for (let c = 0; c < n; c++) {\n        if (dp[r][c] > 0) {\n          for (const [dr, dc] of dirs) {\n            const nr = r + dr, nc = c + dc;\n            if (nr >= 0 && nr < n && nc >= 0 && nc < n) {\n              nextDp[nr][nc] += dp[r][c] / 8;\n            }\n          }\n        }\n      }\n    }\n    dp = nextDp;\n  }\n  \n  let total = 0;\n  for (let r = 0; r < n; r++) {\n    for (let c = 0; c < n; c++) total += dp[r][c];\n  }\n  return total;\n}\n\nconsole.log(knightProbability(3, 2, 0, 0)); // ~0.0625",
    "searchSignals": {
      "tags": [
        "math",
        "probability",
        "dynamic-programming"
      ],
      "keywords": [
        "knight probability",
        "markov probability dp",
        "random walk grid"
      ],
      "companies": [
        "Amazon",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Knight Probability in Chessboard",
        "difficulty": "Medium",
        "slug": "knight-probability-in-chessboard",
        "url": "https://leetcode.com/problems/knight-probability-in-chessboard/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Knight Probability Editorial",
        "url": "https://leetcode.com/problems/knight-probability-in-chessboard/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Geometry Basics": {
    "slug": "math-geometry-basics",
    "name": "Geometry Basics",
    "topic": "Math",
    "difficulty": "Medium",
    "timeComplexity": "O(N^2)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Computational Geometry (Cross Product & Collinear Slope Matching)",
      "overview": "Solving geometric queries using vector cross products and normalized slope hash maps to avoid floating point inaccuracies.",
      "whatItIs": "Collinear points share identical reduced slope: `dx / gcd(dx, dy)` and `dy / gcd(dx, dy)`. Cross product `(x2 - x1)*(y3 - y1) - (y2 - y1)*(x3 - x1) === 0` verifies orientation.",
      "whyItWorks": "Cross product of parallel vectors is exactly zero. Reduced integer fractions eliminate floating point precision rounding bugs.",
      "whenToUse": "Max Points on a Line, Convex Hull, Valid Square, Minimum Area Rectangle.",
      "recognitionSignals": [
        "Points on a 2D Cartesian plane",
        "Check collinearity or convex hull",
        "Avoid floating point slope division"
      ],
      "commonMistakes": [
        "Using standard division `dy / dx` (causes precision errors and fails on vertical lines `dx === 0`)"
      ],
      "stepLogic": "1. For each anchor point i:\n   map = new Map(), duplicates = 1\n   For point j: compute dx = x2 - x1, dy = y2 - y1; g = gcd(dx, dy); key = (dx/g) + \"/\" + (dy/g); increment map[key].\n2. Track max points across all anchors."
    },
    "hi": {
      "title": "Computational Geometry Basics",
      "overview": "Vector Cross Product aur normalized slopes ka use karke geometric collinearity check karna bina floating point rounding error ke.",
      "whatItIs": "Slope ko direct divide karne ke badle `dx / gcd` aur `dy / gcd` se reduced string key banana.",
      "whyItWorks": "Cross product parallel vectors par exact 0 hota hai, aur integer fractions exact match ensure karte hain.",
      "whenToUse": "Max Points on a Line, Convex Hull problems mein.",
      "recognitionSignals": [
        "2D Cartesian plane points",
        "Collinear points check"
      ],
      "commonMistakes": [
        "`dy / dx` divide karna jisse float rounding bugs aur divide by zero error aata hai"
      ],
      "stepLogic": "1. Har point ko anchor banayein.\n2. dx aur dy ka GCD nikaal kar reduced string key banayein.\n3. Slope frequencies track karke max line points nikaalein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "MATH",
      "title": "Collinear Vector Alignment",
      "input": "Points: (1,1), (2,2), (3,3)",
      "description": "All 3 points share slope (1, 1). Cross product is zero -> Collinear line with 3 points!",
      "description_hi": "Teeno points ka slope 1/1 match hota hai -> Collinear line!",
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
              2
            ]
          ],
          "explanation": "Slope between (1,1) and (2,2): dx=1, dy=1",
          "explanation_hi": "Slope 1/1 mila"
        },
        {
          "activeIdx": 2,
          "elements": [
            [
              1,
              1
            ],
            [
              2,
              2
            ],
            [
              3,
              3
            ]
          ],
          "explanation": "Point (3,3) matches slope 1/1. Max points on line = 3!",
          "explanation_hi": "(3,3) match hua -> 3 collinear points!"
        }
      ],
      "result": 3
    },
    "code": "function maxPoints(points) {\n  if (points.length <= 2) return points.length;\n  let maxP = 2;\n  \n  function gcd(a, b) {\n    while (b !== 0) {\n      const t = b;\n      b = a % b;\n      a = t;\n    }\n    return a;\n  }\n  \n  for (let i = 0; i < points.length; i++) {\n    const map = new Map();\n    for (let j = i + 1; j < points.length; j++) {\n      let dx = points[j][0] - points[i][0];\n      let dy = points[j][1] - points[i][1];\n      const g = gcd(dx, dy);\n      dx /= g;\n      dy /= g;\n      if (dx < 0 || (dx === 0 && dy < 0)) {\n        dx = -dx;\n        dy = -dy;\n      }\n      const key = dx + '/' + dy;\n      map.set(key, (map.get(key) || 1) + 1);\n      maxP = Math.max(maxP, map.get(key));\n    }\n  }\n  return maxP;\n}\n\nconsole.log(maxPoints([[1,1],[2,2],[3,3]])); // 3",
    "searchSignals": {
      "tags": [
        "math",
        "geometry",
        "cross-product"
      ],
      "keywords": [
        "max points on a line",
        "collinear points",
        "cross product geometry"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Max Points on a Line",
        "difficulty": "Hard",
        "slug": "max-points-on-a-line",
        "url": "https://leetcode.com/problems/max-points-on-a-line/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Geometry",
        "url": "https://cp-algorithms.com/geometry/basic-geometry.html",
        "type": "CP-Algorithms"
      }
    ]
  }
};
