export const stringsPatterns = {
  "Character Counting": {
    "slug": "strings-character-counting",
    "name": "Character Counting",
    "topic": "Strings",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1) / O(Σ)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Character Counting (Fixed Array)",
      "overview": "Counting occurrences of characters using a fixed-size integer array (e.g. size 26 for lowercase English letters).",
      "whatItIs": "An optimization over generic HashMaps that leverages constant alphabet size (ASCII / Unicode subsets) to achieve O(1) auxiliary space and cache-friendly operations.",
      "whyItWorks": "Every character has a numeric ASCII/UTF-8 code. Offsetting by `a` (charCode - 97) maps each character to a deterministic index [0..25].",
      "whenToUse": "Anagram verification, checking if two strings have identical character distributions, pangram validation, and frequency differences.",
      "recognitionSignals": [
        "String contains only lowercase English letters",
        "Permutation or anagram checking",
        "Determine minimum steps to make two strings anagrams"
      ],
      "commonMistakes": [
        "Not accounting for uppercase characters or symbols",
        "Off-by-one with character code offsets",
        "Creating new arrays inside nested loops"
      ],
      "stepLogic": "1. Create integer array of size 26 initialized to 0.\n2. Iterate through string, increment count[char - \"a\"].\n3. Iterate or compare frequencies as required."
    },
    "hi": {
      "title": "Character Counting (Fixed Array)",
      "overview": "Fixed size array (e.g. 26 size array) ka use karke har character ki frequency count karna.",
      "whatItIs": "HashMap ke badle fixed size array use karke O(1) space aur fast cache access achieve karna.",
      "whyItWorks": "ASCII values deterministic hoti hain; charCode - 97 karne se direct 0-25 index mil jata hai.",
      "whenToUse": "Anagrams verify karne ke liye, letter counts check karne ke liye.",
      "recognitionSignals": [
        "String lowercase English letters tak limited ho",
        "Anagram check karna ho"
      ],
      "commonMistakes": [
        "Uppercase ya special characters ko ignore kar dena",
        "Loop ke andar bar-bar array allocate karna"
      ],
      "stepLogic": "1. 26 size ka array zeros se bharo.\n2. String iterate karke arr[char - \"a\"]++ karo.\n3. Frequencies compare karo."
    },
    "visual": {
      "type": "ARRAY",
      "category": "STRINGS",
      "title": "Character Count Bucket Mapping",
      "input": "anagram",
      "description": "Map each character to index (char - \"a\") and increment bucket frequency.",
      "description_hi": "Har character ko (char - \"a\") index par map karke count badhayein.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            1,
            0,
            0,
            0,
            0,
            0
          ],
          "explanation": "Count \"a\" -> index 0 (count=1)",
          "explanation_hi": "\"a\" mila -> index 0 par count 1 hua"
        },
        {
          "activeIdx": 13,
          "elements": [
            1,
            0,
            0,
            0,
            1,
            0
          ],
          "explanation": "Count \"n\" -> index 13 (count=1)",
          "explanation_hi": "\"n\" mila -> index 13 par count 1 hua"
        },
        {
          "activeIdx": 0,
          "elements": [
            2,
            0,
            0,
            0,
            1,
            0
          ],
          "explanation": "Count second \"a\" -> index 0 (count=2)",
          "explanation_hi": "Dusra \"a\" mila -> index 0 par count 2 hua"
        },
        {
          "activeIdx": 0,
          "elements": [
            3,
            0,
            0,
            1,
            1,
            1
          ],
          "explanation": "Final tally: a:3, n:1, g:1, r:1, m:1",
          "explanation_hi": "Final tally: a:3, n:1, g:1, r:1, m:1"
        }
      ],
      "result": {
        "a": 3,
        "n": 1,
        "g": 1,
        "r": 1,
        "m": 1
      }
    },
    "code": "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = new Int32Array(26);\n  for (let i = 0; i < s.length; i++) {\n    count[s.charCodeAt(i) - 97]++;\n    count[t.charCodeAt(i) - 97]--;\n  }\n  return count.every(c => c === 0);\n}\n\nconsole.log(isAnagram(\"anagram\", \"nagaram\")); // true",
    "searchSignals": {
      "tags": [
        "strings",
        "hash-table",
        "counting"
      ],
      "keywords": [
        "character count",
        "frequency array",
        "anagram"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Facebook",
        "Bloomberg"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Valid Anagram",
        "difficulty": "Easy",
        "slug": "valid-anagram",
        "url": "https://leetcode.com/problems/valid-anagram/"
      },
      {
        "title": "Ransom Note",
        "difficulty": "Easy",
        "slug": "ransom-note",
        "url": "https://leetcode.com/problems/ransom-note/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Anagram Solutions",
        "url": "https://leetcode.com/problems/valid-anagram/editorial/",
        "type": "LeetCode"
      },
      {
        "name": "GFG Character Counting",
        "url": "https://www.geeksforgeeks.org/count-characters-string/",
        "type": "GFG"
      }
    ]
  },
  "Frequency Map": {
    "slug": "strings-frequency-map",
    "name": "Frequency Map",
    "topic": "Strings",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(K)",
    "interviewFrequency": "High",
    "en": {
      "title": "String Frequency Map",
      "overview": "Building a dynamic hash map of character counts when alphabet domain is arbitrary or Unicode.",
      "whatItIs": "Generalization of character counting using Map data structure supporting any character set (Unicode, emojis, spaces, punctuation).",
      "whyItWorks": "Hash maps provide average O(1) lookup and insertion for arbitrary keys, enabling flexible string analysis.",
      "whenToUse": "General strings with non-ASCII characters, grouping anagrams, finding top K frequent characters.",
      "recognitionSignals": [
        "String has mixed cases, punctuation or Unicode",
        "Group words by character frequency signature",
        "Find first unique character"
      ],
      "commonMistakes": [
        "Assuming only 26 lowercase English letters",
        "Overhead of object keys vs ES6 Map",
        "Mutating map while iterating"
      ],
      "stepLogic": "1. Initialize Map().\n2. Loop through characters: map.set(ch, (map.get(ch) || 0) + 1).\n3. Use map entries to solve the target query."
    },
    "hi": {
      "title": "String Frequency Map",
      "overview": "Dynamic Hash Map ka use karke har character ki frequency count karna jab input mein Unicode ya mixed characters hon.",
      "whatItIs": "General HashMap technique jo kisi bhi language, emoji, ya punctuation ke liye kaam karti hai.",
      "whyItWorks": "HashMap dynamic keys allow karta hai aur average O(1) mein lookup deta hai.",
      "whenToUse": "Jab strings mein Unicode ho ya Group Anagrams problem solve karni ho.",
      "recognitionSignals": [
        "Punctuation ya multiple character sets ho",
        "First non-repeating character dhoondhna ho"
      ],
      "commonMistakes": [
        "Sirf 26 letters assume kar lena",
        "Map me lookup karte waqt undefined check miss karna"
      ],
      "stepLogic": "1. Map banayein.\n2. Loop mein map.set(ch, (map.get(ch) || 0) + 1) karein.\n3. Result evaluate karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "STRINGS",
      "title": "Hash Map Frequency Mapping",
      "input": "leetcode",
      "description": "Dynamic character counts: l:1, e:3, t:1, c:1, o:1, d:1",
      "description_hi": "Characters ko map mein count karein.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            1
          ],
          "explanation": "Map: { \"l\": 1 }",
          "explanation_hi": "Map mein \"l\" add hua"
        },
        {
          "activeIdx": 1,
          "elements": [
            1,
            1
          ],
          "explanation": "Map: { \"l\": 1, \"e\": 1 }",
          "explanation_hi": "Map mein \"e\" add hua"
        },
        {
          "activeIdx": 2,
          "elements": [
            1,
            2
          ],
          "explanation": "Map: { \"l\": 1, \"e\": 2 } (\"e\" incremented)",
          "explanation_hi": "\"e\" repeat hua, count 2 ho gaya"
        },
        {
          "activeIdx": 7,
          "elements": [
            1,
            3,
            1,
            1,
            1,
            1
          ],
          "explanation": "Final: \"e\" appears 3 times, first unique is \"l\"",
          "explanation_hi": "Final: \"e\" 3 bar aya, pehla unique character \"l\" hai"
        }
      ],
      "result": {
        "l": 1,
        "e": 3,
        "t": 1,
        "c": 1,
        "o": 1,
        "d": 1
      }
    },
    "code": "function firstUniqChar(s) {\n  const map = new Map();\n  for (const ch of s) {\n    map.set(ch, (map.get(ch) || 0) + 1);\n  }\n  for (let i = 0; i < s.length; i++) {\n    if (map.get(s[i]) === 1) return i;\n  }\n  return -1;\n}\n\nconsole.log(firstUniqChar(\"leetcode\")); // 0 ('l')",
    "searchSignals": {
      "tags": [
        "strings",
        "hash-map"
      ],
      "keywords": [
        "frequency map",
        "first unique character",
        "group anagrams"
      ],
      "companies": [
        "Amazon",
        "Apple",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "First Unique Character in a String",
        "difficulty": "Easy",
        "slug": "first-unique-character-in-a-string",
        "url": "https://leetcode.com/problems/first-unique-character-in-a-string/"
      },
      {
        "title": "Group Anagrams",
        "difficulty": "Medium",
        "slug": "group-anagrams",
        "url": "https://leetcode.com/problems/group-anagrams/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode First Unique Character",
        "url": "https://leetcode.com/problems/first-unique-character-in-a-string/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Sliding Window": {
    "slug": "strings-sliding-window",
    "name": "Sliding Window",
    "topic": "Strings",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(min(N, Σ))",
    "interviewFrequency": "Very High",
    "en": {
      "title": "String Sliding Window",
      "overview": "Maintaining a contiguous substring window defined by two pointers [L..R] that expands and contracts dynamically.",
      "whatItIs": "A technique that avoids quadratic substring re-evaluations by incrementally updating window state (frequencies, unique counts) as characters enter and leave.",
      "whyItWorks": "Because the window boundaries move monotonically forward, each character is processed at most twice (once entering, once leaving), achieving linear O(N) time.",
      "whenToUse": "Longest substring without repeating characters, minimum window substring, substring with concatenation of all words.",
      "recognitionSignals": [
        "Find the longest or shortest contiguous substring satisfying a condition",
        "At most K distinct characters in substring",
        "All anagram occurrences in a text"
      ],
      "commonMistakes": [
        "Shrinking the window too late or too early",
        "Re-computing substring state from scratch inside the loop (turning O(N) into O(N^2))",
        "Off-by-one window length calculations (R - L + 1)"
      ],
      "stepLogic": "1. Initialize left = 0, maxLength = 0, state tracker (Set/Map).\n2. Expand right pointer from 0 to N-1, adding s[right] to state.\n3. While window invariant is violated, remove s[left] from state and increment left.\n4. Update optimal answer with current window length (right - left + 1)."
    },
    "hi": {
      "title": "String Sliding Window",
      "overview": "Do pointers [L..R] ke beech continuous substring window maintain karna jo dynamically stretch aur shrink hoti hai.",
      "whatItIs": "Substring problems mein har substring ko dubara calculate karne ke bajaye window ko slide karke O(N) mein solve karne ka tareeqa.",
      "whyItWorks": "Left aur Right pointers sirf aage badhte hain, isliye har character zyada se zyada 2 baar touch hota hai.",
      "whenToUse": "Longest substring without repeating characters, Minimum window substring jaisi problems mein.",
      "recognitionSignals": [
        "Contiguous substring par condition check karni ho",
        "At most K distinct characters dhoondhne ho"
      ],
      "commonMistakes": [
        "Window shrink karte waqt state update bhool jana",
        "Window length calculation (R - L + 1) mein galti"
      ],
      "stepLogic": "1. left = 0, right = 0 set karein.\n2. right pointer aage badhakar character window mein add karein.\n3. Invariant violate ho toh left pointer aage badha kar fix karein.\n4. Max/Min window record karein."
    },
    "visual": {
      "type": "SLIDING_WINDOW",
      "category": "STRINGS",
      "title": "Longest Substring Without Repeating Characters",
      "input": "abcabcbb",
      "description": "Dynamic window [L..R] expands right; when duplicate seen, left advances.",
      "description_hi": "Right pointer aage badhta hai, duplicate aane par left pointer slide hota hai.",
      "steps": [
        {
          "window": [
            0,
            2
          ],
          "left": 0,
          "right": 2,
          "sum": 3,
          "target": 3,
          "explanation": "Window [0..2] \"abc\": all unique (length = 3)",
          "explanation_hi": "Window [0..2] \"abc\": sabhi unique hain (len = 3)"
        },
        {
          "window": [
            1,
            3
          ],
          "left": 1,
          "right": 3,
          "sum": 3,
          "target": 3,
          "explanation": "\"a\" repeats at 3! Advance L to 1 -> Window [1..3] \"bca\"",
          "explanation_hi": "Index 3 par \"a\" repeat hua! Left ko 1 par slide kiya -> \"bca\""
        },
        {
          "window": [
            2,
            4
          ],
          "left": 2,
          "right": 4,
          "sum": 3,
          "target": 3,
          "explanation": "\"b\" repeats at 4! Advance L to 2 -> Window [2..4] \"cab\"",
          "explanation_hi": "Index 4 par \"b\" repeat hua! Left ko 2 par laya -> \"cab\""
        },
        {
          "window": [
            5,
            7
          ],
          "left": 5,
          "right": 7,
          "sum": 1,
          "target": 3,
          "explanation": "End of string reached. Maximum unique length = 3",
          "explanation_hi": "String complete hui. Maximum unique length = 3"
        }
      ],
      "result": 3
    },
    "code": "function lengthOfLongestSubstring(s) {\n  const seen = new Map();\n  let maxLen = 0;\n  let left = 0;\n  \n  for (let right = 0; right < s.length; right++) {\n    const ch = s[right];\n    if (seen.has(ch) && seen.get(ch) >= left) {\n      left = seen.get(ch) + 1;\n    }\n    seen.set(ch, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}\n\nconsole.log(lengthOfLongestSubstring(\"abcabcbb\")); // 3 (\"abc\")",
    "searchSignals": {
      "tags": [
        "strings",
        "sliding-window",
        "hash-table"
      ],
      "keywords": [
        "longest substring",
        "minimum window",
        "sliding window"
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
        "title": "Longest Substring Without Repeating Characters",
        "difficulty": "Medium",
        "slug": "longest-substring-without-repeating-characters",
        "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
      },
      {
        "title": "Minimum Window Substring",
        "difficulty": "Hard",
        "slug": "minimum-window-substring",
        "url": "https://leetcode.com/problems/minimum-window-substring/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Sliding Window Guide",
        "url": "https://leetcode.com/explore/learn/card/array-and-string/",
        "type": "LeetCode"
      },
      {
        "name": "GFG Sliding Window Technique",
        "url": "https://www.geeksforgeeks.org/window-sliding-technique/",
        "type": "GFG"
      }
    ]
  },
  "Two Pointers": {
    "slug": "strings-two-pointers",
    "name": "Two Pointers",
    "topic": "Strings",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "String Two Pointers (Symmetric Inward / Outward)",
      "overview": "Navigating characters from opposite ends inward, or expanding outward from centers.",
      "whatItIs": "Pointer convergence technique comparing characters symmetrically without extra memory allocation.",
      "whyItWorks": "Palindromes and symmetric strings exhibit reflective symmetry around the midpoint.",
      "whenToUse": "Valid palindrome verification, reversing string in-place, expanding around centers for longest palindromic substring.",
      "recognitionSignals": [
        "Check symmetry of characters",
        "Ignore non-alphanumeric characters while validating palindrome",
        "Expand around center to find palindromes"
      ],
      "commonMistakes": [
        "Failing to skip non-alphanumeric characters",
        "Case-sensitivity mismatches",
        "Pointer crossover without termination"
      ],
      "stepLogic": "1. Set left = 0, right = s.length - 1.\n2. Skip invalid characters on both sides.\n3. Compare lowercased characters; if mismatch return false.\n4. left++, right--; return true when left >= right."
    },
    "hi": {
      "title": "String Two Pointers",
      "overview": "Dono ends se pointers ko center ki taraf lana aur character comparison karna.",
      "whatItIs": "Memory bacha kar strings ki symmetry check karne ka standard pattern.",
      "whyItWorks": "Palindrome string center ke dono side identical hoti hai.",
      "whenToUse": "Valid palindrome check karne, string reverse karne ke liye.",
      "recognitionSignals": [
        "Palindrome verification",
        "In-place string reversal"
      ],
      "commonMistakes": [
        "Special characters skip na karna",
        "Uppercase aur lowercase match na karna"
      ],
      "stepLogic": "1. left = 0, right = N - 1 rakhein.\n2. Valid characters par layein.\n3. Match karein; mismatch par false return karein.\n4. left >= right hone par true return karein."
    },
    "visual": {
      "type": "POINTERS",
      "category": "STRINGS",
      "title": "Two Pointers Palindrome Verification",
      "input": [
        "r",
        "a",
        "c",
        "e",
        "c",
        "a",
        "r"
      ],
      "description": "L at 0, R at 6 -> Compare symmetric characters moving inward.",
      "description_hi": "Left aur right pointers ko center ki taraf laate hue compare karein.",
      "steps": [
        {
          "left": 0,
          "right": 6,
          "elements": [
            "r",
            "a",
            "c",
            "e",
            "c",
            "a",
            "r"
          ],
          "explanation": "s[0] \"r\" === s[6] \"r\" -> Match! Advance pointers",
          "explanation_hi": "s[0] aur s[6] match hue -> L++, R--"
        },
        {
          "left": 1,
          "right": 5,
          "elements": [
            "r",
            "a",
            "c",
            "e",
            "c",
            "a",
            "r"
          ],
          "explanation": "s[1] \"a\" === s[5] \"a\" -> Match! Advance pointers",
          "explanation_hi": "s[1] aur s[5] match hue -> L++, R--"
        },
        {
          "left": 2,
          "right": 4,
          "elements": [
            "r",
            "a",
            "c",
            "e",
            "c",
            "a",
            "r"
          ],
          "explanation": "s[2] \"c\" === s[4] \"c\" -> Match! Advance pointers",
          "explanation_hi": "s[2] aur s[4] match hue -> L++, R--"
        },
        {
          "left": 3,
          "right": 3,
          "elements": [
            "r",
            "a",
            "c",
            "e",
            "c",
            "a",
            "r"
          ],
          "explanation": "Pointers meet at center \"e\". Valid palindrome!",
          "explanation_hi": "Pointers center \"e\" par mil gaye. String palindrome hai!"
        }
      ],
      "result": true
    },
    "code": "function isPalindrome(s) {\n  let l = 0, r = s.length - 1;\n  const isAlphaNum = ch => /[a-z0-9]/i.test(ch);\n  \n  while (l < r) {\n    while (l < r && !isAlphaNum(s[l])) l++;\n    while (l < r && !isAlphaNum(s[r])) r--;\n    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n    l++;\n    r--;\n  }\n  return true;\n}\n\nconsole.log(isPalindrome(\"A man, a plan, a canal: Panama\")); // true",
    "searchSignals": {
      "tags": [
        "strings",
        "two-pointers"
      ],
      "keywords": [
        "valid palindrome",
        "two pointers string",
        "reverse string"
      ],
      "companies": [
        "Facebook",
        "Microsoft",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Valid Palindrome",
        "difficulty": "Easy",
        "slug": "valid-palindrome",
        "url": "https://leetcode.com/problems/valid-palindrome/"
      },
      {
        "title": "Reverse String",
        "difficulty": "Easy",
        "slug": "reverse-string",
        "url": "https://leetcode.com/problems/reverse-string/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Valid Palindrome Editorial",
        "url": "https://leetcode.com/problems/valid-palindrome/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Palindrome": {
    "slug": "strings-palindrome",
    "name": "Palindrome",
    "topic": "Strings",
    "difficulty": "Medium",
    "timeComplexity": "O(N^2)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Palindrome Expand Around Center",
      "overview": "Expanding outward from each of the 2N - 1 possible palindrome centers to find substrings in O(N^2) time and O(1) space.",
      "whatItIs": "An intuitive alternative to DP that treats each single character (odd length) and adjacent pair (even length) as a potential symmetry axis.",
      "whyItWorks": "Every palindrome must have a center. Expanding outward checks character equality greedily until a mismatch is encountered.",
      "whenToUse": "Longest Palindromic Substring, Palindromic Substrings count.",
      "recognitionSignals": [
        "Find longest symmetric substring",
        "Count total number of palindromic substrings",
        "Space complexity must be O(1)"
      ],
      "commonMistakes": [
        "Checking only odd length centers and forgetting even length centers",
        "Off-by-one errors when slicing substring from (left + 1) to right"
      ],
      "stepLogic": "1. Loop through i from 0 to N-1.\n2. Expand around center (i, i) for odd palindromes.\n3. Expand around center (i, i+1) for even palindromes.\n4. Track start and max length."
    },
    "hi": {
      "title": "Palindrome Expand Around Center",
      "overview": "Har character aur pair ko center maan kar dono sides expand karna.",
      "whatItIs": "O(1) extra space mein longest palindromic substring dhoondhne ka best interview approach.",
      "whyItWorks": "Symmetric string hamesha center se dono taraf barabar hoti hai.",
      "whenToUse": "Longest Palindromic Substring problem solve karne ke liye.",
      "recognitionSignals": [
        "Longest palindrome substring dhoondhna ho",
        "O(1) space constraint ho"
      ],
      "commonMistakes": [
        "Even length centers (i, i+1) ko bhool jana"
      ],
      "stepLogic": "1. Har index i par jao.\n2. (i, i) odd aur (i, i+1) even ke liye expand karo.\n3. Max length update karo."
    },
    "visual": {
      "type": "POINTERS",
      "category": "STRINGS",
      "title": "Expand Around Center",
      "input": [
        "b",
        "a",
        "b",
        "a",
        "d"
      ],
      "description": "Center at index 1 (\"a\") -> Expands left to 0 (\"b\") and right to 2 (\"b\") -> \"bab\"",
      "description_hi": "Center index 1 par \"a\" se dono taraf expand karein -> \"bab\"",
      "steps": [
        {
          "left": 1,
          "right": 1,
          "elements": [
            "b",
            "a",
            "b",
            "a",
            "d"
          ],
          "explanation": "Center at index 1: \"a\" (len = 1)",
          "explanation_hi": "Center 1 par \"a\""
        },
        {
          "left": 0,
          "right": 2,
          "elements": [
            "b",
            "a",
            "b",
            "a",
            "d"
          ],
          "explanation": "Expand: s[0] \"b\" === s[2] \"b\" -> Found \"bab\" (len = 3)",
          "explanation_hi": "Dono sides \"b\" match hua -> \"bab\" mil gaya"
        },
        {
          "left": -1,
          "right": 3,
          "elements": [
            "b",
            "a",
            "b",
            "a",
            "d"
          ],
          "explanation": "Boundary hit. Substring is \"bab\".",
          "explanation_hi": "Boundary hit hui. Result \"bab\""
        }
      ],
      "result": "bab"
    },
    "code": "function longestPalindrome(s) {\n  if (s.length < 2) return s;\n  let start = 0, maxLen = 1;\n  \n  function expand(l, r) {\n    while (l >= 0 && r < s.length && s[l] === s[r]) {\n      const len = r - l + 1;\n      if (len > maxLen) {\n        start = l;\n        maxLen = len;\n      }\n      l--;\n      r++;\n    }\n  }\n  \n  for (let i = 0; i < s.length; i++) {\n    expand(i, i);     // Odd length\n    expand(i, i + 1); // Even length\n  }\n  return s.slice(start, start + maxLen);\n}\n\nconsole.log(longestPalindrome(\"babad\")); // \"bab\"",
    "searchSignals": {
      "tags": [
        "strings",
        "palindrome",
        "two-pointers"
      ],
      "keywords": [
        "longest palindromic substring",
        "expand around center"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Longest Palindromic Substring",
        "difficulty": "Medium",
        "slug": "longest-palindromic-substring",
        "url": "https://leetcode.com/problems/longest-palindromic-substring/"
      },
      {
        "title": "Palindromic Substrings",
        "difficulty": "Medium",
        "slug": "palindromic-substrings",
        "url": "https://leetcode.com/problems/palindromic-substrings/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Longest Palindromic Substring",
        "url": "https://leetcode.com/problems/longest-palindromic-substring/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "KMP": {
    "slug": "strings-kmp",
    "name": "KMP",
    "topic": "Strings",
    "difficulty": "Hard",
    "timeComplexity": "O(N + M)",
    "spaceComplexity": "O(M)",
    "interviewFrequency": "High",
    "en": {
      "title": "Knuth-Morris-Pratt (KMP) Algorithm",
      "overview": "Linear-time exact pattern matching using a precomputed Longest Proper Prefix which is also Suffix (LPS) table.",
      "whatItIs": "An algorithm that avoids backtracking the main text pointer when a character mismatch occurs by jumping to the longest matched prefix in the pattern.",
      "whyItWorks": "The LPS array stores information about self-similarity inside the pattern, guaranteeing that characters already matched in the text never need to be re-examined.",
      "whenToUse": "Exact substring search in large texts, finding repeated substring patterns, string rotation matching.",
      "recognitionSignals": [
        "Find all occurrences of pattern P in text T in O(N + M)",
        "Detect repeating prefix-suffix periodicity",
        "Avoid naive O(N*M) worst case"
      ],
      "commonMistakes": [
        "Building the LPS table with off-by-one errors",
        "Backtracking text pointer i instead of just pattern pointer j",
        "Handling zero-indexed vs one-indexed LPS lengths"
      ],
      "stepLogic": "1. Build LPS array for pattern: lps[i] stores max length of proper prefix of pattern[0..i] that is also suffix.\n2. Iterate through text with i and pattern with j.\n3. If text[i] === pattern[j], i++, j++.\n4. If j === pattern.length, record match and set j = lps[j-1].\n5. On mismatch, if j > 0 set j = lps[j-1]; else i++."
    },
    "hi": {
      "title": "Knuth-Morris-Pratt (KMP) Algorithm",
      "overview": "LPS (Longest Prefix Suffix) table banakar bina text pointer ko backtrack kiye O(N + M) mein pattern dhoondhna.",
      "whatItIs": "Substring search ka optimized algorithm jo text pointer ko kabhi peeche nahi le jata.",
      "whyItWorks": "Pattern ke andar ki self-similarity ka faayda uthakar mismatch ke baad seedha safe prefix par jump karta hai.",
      "whenToUse": "Badi string mein chhota pattern dhundhne ke liye (linear time guarantee).",
      "recognitionSignals": [
        "O(N+M) exact string matching",
        "Repeated substring pattern"
      ],
      "commonMistakes": [
        "LPS table build karne mein index galti",
        "Text pointer ko peeche le aana"
      ],
      "stepLogic": "1. Pattern ka LPS table compute karo.\n2. Text aur pattern ko compare karo.\n3. Mismatch hone par j = lps[j-1] par jump karo bina i ko ghataye."
    },
    "visual": {
      "type": "POINTERS",
      "category": "STRINGS",
      "title": "KMP LPS Fallback on Mismatch",
      "input": {
        "text": "ABABDABACDABABCABAB",
        "pattern": "ABABCABAB"
      },
      "description": "Pattern mismatch at index 4 (\"D\" vs \"C\") -> jumps j to lps[3] = 2 (\"AB\"), text pointer does not regress.",
      "description_hi": "Mismatch par j seedha LPS index par jump karta hai, text pointer kabhi backtrack nahi karta.",
      "steps": [
        {
          "left": 0,
          "right": 0,
          "elements": [
            "A",
            "B",
            "A",
            "B",
            "D"
          ],
          "explanation": "Matched \"ABAB\" (indices 0..3)",
          "explanation_hi": "\"ABAB\" match hua"
        },
        {
          "left": 4,
          "right": 4,
          "elements": [
            "A",
            "B",
            "A",
            "B",
            "D"
          ],
          "explanation": "Mismatch! text=\"D\", pattern=\"C\". j falls back to lps[3] = 2 (\"AB\")",
          "explanation_hi": "Mismatch hua! j fallback karke 2 par chala gaya"
        },
        {
          "left": 4,
          "right": 2,
          "elements": [
            "A",
            "B",
            "A",
            "B",
            "D"
          ],
          "explanation": "Compare resumes at j=2 without rewinding text pointer i.",
          "explanation_hi": "Comparison bina text pointer rewind kiye resume hua."
        }
      ],
      "result": [
        10
      ]
    },
    "code": "function computeLPS(pattern) {\n  const lps = new Array(pattern.length).fill(0);\n  let len = 0, i = 1;\n  while (i < pattern.length) {\n    if (pattern[i] === pattern[len]) {\n      len++;\n      lps[i] = len;\n      i++;\n    } else {\n      if (len !== 0) {\n        len = lps[len - 1];\n      } else {\n        lps[i] = 0;\n        i++;\n      }\n    }\n  }\n  return lps;\n}\n\nfunction kmpSearch(text, pattern) {\n  const lps = computeLPS(pattern);\n  let i = 0, j = 0;\n  const matches = [];\n  \n  while (i < text.length) {\n    if (text[i] === pattern[j]) {\n      i++;\n      j++;\n    }\n    if (j === pattern.length) {\n      matches.push(i - j);\n      j = lps[j - 1];\n    } else if (i < text.length && text[i] !== pattern[j]) {\n      if (j !== 0) j = lps[j - 1];\n      else i++;\n    }\n  }\n  return matches;\n}\n\nconsole.log(kmpSearch(\"ABABDABACDABABCABAB\", \"ABABCABAB\")); // [10]",
    "searchSignals": {
      "tags": [
        "strings",
        "kmp",
        "string-matching"
      ],
      "keywords": [
        "knuth morris pratt",
        "lps array",
        "kmp search"
      ],
      "companies": [
        "Google",
        "Microsoft",
        "Uber"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Find the Index of the First Occurrence in a String",
        "difficulty": "Easy",
        "slug": "find-the-index-of-the-first-occurrence-in-a-string",
        "url": "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/"
      },
      {
        "title": "Repeated Substring Pattern",
        "difficulty": "Easy",
        "slug": "repeated-substring-pattern",
        "url": "https://leetcode.com/problems/repeated-substring-pattern/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms KMP Algorithm",
        "url": "https://cp-algorithms.com/string/prefix-func.html",
        "type": "CP-Algorithms"
      },
      {
        "name": "GFG KMP Algorithm",
        "url": "https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/",
        "type": "GFG"
      }
    ]
  },
  "Z Algorithm": {
    "slug": "strings-z-algorithm",
    "name": "Z Algorithm",
    "topic": "Strings",
    "difficulty": "Hard",
    "timeComplexity": "O(N + M)",
    "spaceComplexity": "O(N + M)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Z Algorithm (Z-Array Matching)",
      "overview": "Constructs the Z-array where Z[i] is the length of the longest common prefix between S and S[i..N-1] in O(N).",
      "whatItIs": "A linear pattern matching method maintaining a segment [L, R] representing the interval with the furthest right reach matching a prefix of S.",
      "whyItWorks": "By reusing prefix comparisons inside the [L, R] window, redundant character checks are eliminated completely.",
      "whenToUse": "Pattern matching by concatenating P + \"$\" + T, string periodicity, finding all prefixes that are also suffixes.",
      "recognitionSignals": [
        "Longest common prefix of suffixes with the entire string",
        "Concatenating pattern and text with delimiter"
      ],
      "commonMistakes": [
        "Not updating the [L, R] window correctly",
        "Comparing past the end of string",
        "Missing unique delimiter character"
      ],
      "stepLogic": "1. Create composite string S = P + \"$\" + T.\n2. Compute Z-array maintaining [L, R] window.\n3. Whenever Z[i] === P.length, match found at i - P.length - 1."
    },
    "hi": {
      "title": "Z Algorithm",
      "overview": "Z-array compute karke O(N+M) mein pattern matching karna jisme Z[i] longest prefix match length hoti hai.",
      "whatItIs": "[L, R] window maintain karke linear time mein substring comparisons reuse karne ka method.",
      "whyItWorks": "Window ke andar pehle se calculated Z values ko direct use karke repeated loops skip karta hai.",
      "whenToUse": "Pattern matching P + \"$\" + T bana kar.",
      "recognitionSignals": [
        "Prefix match length",
        "String matching in linear time"
      ],
      "commonMistakes": [
        "Delimiter \"$\" add karna bhool jana"
      ],
      "stepLogic": "1. Composite string S = Pattern + \"$\" + Text banayein.\n2. [L, R] window ke saath Z-array banayein.\n3. Jahan Z[i] === P.length, wahan match record karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "STRINGS",
      "title": "Z-Array Construction",
      "input": "aab$aabaaba",
      "description": "Z[i] is the length of longest prefix matching starting at i.",
      "description_hi": "Z[i] index i se start hone wale longest prefix match ki length hai.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            0,
            1,
            0,
            0,
            3,
            1,
            0,
            3
          ],
          "explanation": "Z[4] = 3 because \"aab\" matches prefix \"aab\"",
          "explanation_hi": "Z[4] = 3 kyunki \"aab\" prefix se match hota hai"
        },
        {
          "activeIdx": 7,
          "elements": [
            0,
            1,
            0,
            0,
            3,
            1,
            0,
            3
          ],
          "explanation": "Z[7] = 3 -> Another match at index 7",
          "explanation_hi": "Z[7] = 3 -> Index 7 par dubara match mila"
        }
      ],
      "result": [
        4,
        7
      ]
    },
    "code": "function buildZ(s) {\n  const n = s.length;\n  const z = new Array(n).fill(0);\n  let l = 0, r = 0;\n  for (let i = 1; i < n; i++) {\n    if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);\n    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;\n    if (i + z[i] - 1 > r) {\n      l = i;\n      r = i + z[i] - 1;\n    }\n  }\n  return z;\n}\n\nconst s = \"aab$aabaaba\";\nconsole.log(buildZ(s));",
    "searchSignals": {
      "tags": [
        "strings",
        "z-algorithm"
      ],
      "keywords": [
        "z algorithm",
        "z array",
        "prefix match"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Find the Index of the First Occurrence in a String",
        "difficulty": "Easy",
        "slug": "find-the-index-of-the-first-occurrence-in-a-string",
        "url": "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Z-function",
        "url": "https://cp-algorithms.com/string/z-function.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Rabin–Karp": {
    "slug": "strings-rabin-karp",
    "name": "Rabin–Karp",
    "topic": "Strings",
    "difficulty": "Medium",
    "timeComplexity": "O(N + M) average, O(N*M) worst",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Rabin–Karp Rolling Hash Algorithm",
      "overview": "Rolling polynomial hash algorithm matching patterns in text by comparing numeric hash fingerprints in O(1) per step.",
      "whatItIs": "A hashing-based substring search method that shifts the window hash value in O(1) time without rehashing from scratch.",
      "whyItWorks": "Rolling hash: `hash = (hash - oldChar * base^(M-1)) * base + newChar (mod P)` maintains exact hash in constant time.",
      "whenToUse": "Multiple pattern matching, finding duplicate substrings of length K, longest duplicate substring.",
      "recognitionSignals": [
        "Find repeated patterns of fixed length",
        "Rolling hash signature",
        "Plagiarism detection in multiple texts"
      ],
      "commonMistakes": [
        "Integer overflow in JavaScript without BigInt or modular arithmetic",
        "Failing to handle spurious hash collisions with string verification",
        "Negative values during modulo subtraction"
      ],
      "stepLogic": "1. Compute hash of pattern and initial text window.\n2. Slide window across text: if hashes match, verify full substring to guard against collision.\n3. Roll hash forward in O(1) using polynomial formula."
    },
    "hi": {
      "title": "Rabin–Karp Rolling Hash",
      "overview": "Rolling polynomial hash calculate karke O(1) mein substring match check karna.",
      "whatItIs": "Har window ka hash direct recalculate karne ke bajaye purana char minus aur naya char add karke slide karna.",
      "whyItWorks": "Math formula se sliding window hash O(1) time mein update ho jata hai.",
      "whenToUse": "Duplicate substrings of length K dhoondhne ke liye.",
      "recognitionSignals": [
        "Rolling hash",
        "Multiple patterns ek sath search karne ho"
      ],
      "commonMistakes": [
        "Modulo subtraction mein negative numbers ka dhyan na rakhna",
        "Hash collision par direct true return kar dena bina verify kiye"
      ],
      "stepLogic": "1. Pattern aur pehli window ka hash compute karein.\n2. Hash match ho toh characters verify karein.\n3. Hash roll karke aage badhein."
    },
    "visual": {
      "type": "SLIDING_WINDOW",
      "category": "STRINGS",
      "title": "Rolling Hash Window Shift",
      "input": {
        "text": "23590231415",
        "pattern": "31415"
      },
      "description": "Roll hash: drop leading digit * base^(m-1), multiply by base, add trailing digit.",
      "description_hi": "Puraani digit drop karo, base se multiply karo, nayi digit add karo.",
      "steps": [
        {
          "window": [
            0,
            4
          ],
          "left": 0,
          "right": 4,
          "sum": 23590,
          "target": 31415,
          "explanation": "Window \"23590\": Hash = 23590 (mismatch)",
          "explanation_hi": "Hash mismatch"
        },
        {
          "window": [
            6,
            10
          ],
          "left": 6,
          "right": 10,
          "sum": 31415,
          "target": 31415,
          "explanation": "Window \"31415\": Hash = 31415 matches pattern hash! Verified match at index 6.",
          "explanation_hi": "Hash match hua! Index 6 par exact match mil gaya."
        }
      ],
      "result": [
        6
      ]
    },
    "code": "function rabinKarp(text, pattern) {\n  const n = text.length, m = pattern.length;\n  if (m > n) return -1;\n  const base = 256, mod = 1000000007;\n  let h = 1;\n  for (let i = 0; i < m - 1; i++) h = (h * base) % mod;\n  \n  let pHash = 0, tHash = 0;\n  for (let i = 0; i < m; i++) {\n    pHash = (pHash * base + pattern.charCodeAt(i)) % mod;\n    tHash = (tHash * base + text.charCodeAt(i)) % mod;\n  }\n  \n  for (let i = 0; i <= n - m; i++) {\n    if (pHash === tHash) {\n      if (text.slice(i, i + m) === pattern) return i;\n    }\n    if (i < n - m) {\n      tHash = (base * (tHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % mod;\n      if (tHash < 0) tHash += mod;\n    }\n  }\n  return -1;\n}\n\nconsole.log(rabinKarp(\"hello world\", \"world\")); // 6",
    "searchSignals": {
      "tags": [
        "strings",
        "hash-table",
        "rolling-hash"
      ],
      "keywords": [
        "rabin karp",
        "rolling hash",
        "substring search"
      ],
      "companies": [
        "Microsoft",
        "Amazon",
        "Apple"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Repeated DNA Sequences",
        "difficulty": "Medium",
        "slug": "repeated-dna-sequences",
        "url": "https://leetcode.com/problems/repeated-dna-sequences/"
      },
      {
        "title": "Longest Duplicate Substring",
        "difficulty": "Hard",
        "slug": "longest-duplicate-substring",
        "url": "https://leetcode.com/problems/longest-duplicate-substring/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Rabin-Karp",
        "url": "https://cp-algorithms.com/string/rabin-karp.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Rolling Hash": {
    "slug": "strings-rolling-hash",
    "name": "Rolling Hash",
    "topic": "Strings",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Rolling Hash Formulation",
      "overview": "Maintaining polynomial prefix hashes allowing any arbitrary substring hash S[L..R] to be computed in O(1).",
      "whatItIs": "Precomputing prefix hashes and power arrays modulo large primes (e.g. 10^9 + 7) for instantaneous equality checks.",
      "whyItWorks": "`hash(L..R) = (pref[R] - pref[L-1] * base^(R - L + 1)) mod P`. Enables comparing any two substrings in O(1).",
      "whenToUse": "Binary search on answer for longest common substring, detecting cycles in string sequences, palindromic prefix queries.",
      "recognitionSignals": [
        "Query equality of multiple substrings in O(1)",
        "Binary search combined with hash checks"
      ],
      "commonMistakes": [
        "Single hash collision risk (mitigate with double hashing with two distinct primes)",
        "Modulus underflow in JS"
      ],
      "stepLogic": "1. Precompute powers of base: pow[i] = (pow[i-1] * base) % MOD.\n2. Precompute prefix hashes: pref[i] = (pref[i-1] * base + s[i]) % MOD.\n3. Query range [L..R] using prefix subtraction formula."
    },
    "hi": {
      "title": "Rolling Hash Formulation",
      "overview": "Prefix hashes precompute karke kisi bhi substring S[L..R] ka hash O(1) time mein query karna.",
      "whatItIs": "Array prefix sum jaisa concept jisme powers of base multiply hoti hain.",
      "whyItWorks": "Math formula se kisi bhi range ka hash instantaneous O(1) mein nikal aata hai.",
      "whenToUse": "Multiple substring equality queries jaldi solve karne ke liye.",
      "recognitionSignals": [
        "O(1) range substring comparisons",
        "Binary search with hashing"
      ],
      "commonMistakes": [
        "Modulo arithmetic mein negative remainder handle na karna"
      ],
      "stepLogic": "1. Base powers precalculate karo.\n2. Prefix hashes banayein.\n3. Range formula se O(1) mein check karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "STRINGS",
      "title": "Prefix Hash Lookup in O(1)",
      "input": "abacaba",
      "description": "Compare substring [0..2] (\"aba\") with [4..6] (\"aba\") via prefix hash subtraction in O(1).",
      "description_hi": "Prefix hash subtraction se kisi bhi do substrings ko O(1) mein compare karein.",
      "steps": [
        {
          "activeIdx": 2,
          "elements": [
            1,
            32,
            993
          ],
          "explanation": "Hash of s[0..2] = 993 (\"aba\")",
          "explanation_hi": "s[0..2] ka hash = 993"
        },
        {
          "activeIdx": 6,
          "elements": [
            1,
            32,
            993,
            30784,
            954305,
            29583488,
            993
          ],
          "explanation": "Hash of s[4..6] via prefix math = 993 (\"aba\") -> Exactly equal in O(1)!",
          "explanation_hi": "s[4..6] ka hash bhi 993 aya -> Dono exact match!"
        }
      ],
      "result": true
    },
    "code": "class StringHasher {\n  constructor(s, base = 313, mod = 1e9 + 7) {\n    this.n = s.length;\n    this.base = BigInt(base);\n    this.mod = BigInt(mod);\n    this.pref = new Array(this.n + 1).fill(0n);\n    this.pow = new Array(this.n + 1).fill(1n);\n    \n    for (let i = 0; i < this.n; i++) {\n      this.pow[i + 1] = (this.pow[i] * this.base) % this.mod;\n      this.pref[i + 1] = (this.pref[i] * this.base + BigInt(s.charCodeAt(i))) % this.mod;\n    }\n  }\n  \n  getHash(l, r) {\n    const len = BigInt(r - l + 1);\n    let h = (this.pref[r + 1] - (this.pref[l] * this.pow[len]) % this.mod) % this.mod;\n    return h < 0n ? h + this.mod : h;\n  }\n}\n\nconst hasher = new StringHasher(\"abacaba\");\nconsole.log(hasher.getHash(0, 2) === hasher.getHash(4, 6)); // true (\"aba\" === \"aba\")",
    "searchSignals": {
      "tags": [
        "strings",
        "hashing",
        "rolling-hash"
      ],
      "keywords": [
        "prefix hash",
        "rolling hash substring",
        "fast substring equality"
      ],
      "companies": [
        "Google",
        "Meta",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Repeated DNA Sequences",
        "difficulty": "Medium",
        "slug": "repeated-dna-sequences",
        "url": "https://leetcode.com/problems/repeated-dna-sequences/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms String Hashing",
        "url": "https://cp-algorithms.com/string/string-hashing.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Trie": {
    "slug": "strings-trie",
    "name": "Trie",
    "topic": "Strings",
    "difficulty": "Medium",
    "timeComplexity": "O(L) per operation",
    "spaceComplexity": "O(N * L * Σ)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Trie (Prefix Tree)",
      "overview": "Tree data structure where edges represent characters, enabling O(L) prefix searches and dictionary lookups.",
      "whatItIs": "A re-retrieval tree where all descendants of a node share a common string prefix.",
      "whyItWorks": "Instead of searching an entire dictionary of N words, each character lookup follows a direct child link in O(1).",
      "whenToUse": "Autocomplete, spell checkers, prefix matching, word search Boggle grids, longest word with all prefixes.",
      "recognitionSignals": [
        "Prefix queries (\"starts with\")",
        "Dictionary search across many words",
        "Grid word search (Boggle)"
      ],
      "commonMistakes": [
        "Forgetting `isEndOfWord` boolean on terminal nodes",
        "High memory usage with object maps (use array of size 26 when alphabet is fixed)"
      ],
      "stepLogic": "1. Root node represents empty prefix.\n2. Insert word: walk/create child nodes for each char; mark last node as isEnd = true.\n3. Search word: walk children; return true only if all chars found and isEnd is true.\n4. StartsWith: walk children; return true if prefix path exists."
    },
    "hi": {
      "title": "Trie (Prefix Tree)",
      "overview": "Prefix tree jisme har node character hold karti hai, O(L) time mein search aur autocomplete enable karti hai.",
      "whatItIs": "Dictionary words ko tree structure mein store karne ka best pattern.",
      "whyItWorks": "Common prefixes share ho jate hain, isliye searching word length L par depend karti hai na ki total words N par.",
      "whenToUse": "Autocomplete, Word Search grid, Prefix matching problems mein.",
      "recognitionSignals": [
        "startsWith method implement karna",
        "Dictionary lookup"
      ],
      "commonMistakes": [
        "Word ke end mein isEndOfWord flag true na karna"
      ],
      "stepLogic": "1. Root node se shuru karein.\n2. Har character ke liye child node create/walk karein.\n3. Last node par isEnd = true set karein."
    },
    "visual": {
      "type": "TREE",
      "category": "STRINGS",
      "title": "Trie Prefix Node Branches",
      "input": [
        "cat",
        "car",
        "cart"
      ],
      "description": "Shared prefix \"ca\" branches into \"t\" (cat) and \"r\" (car) -> \"t\" (cart)",
      "description_hi": "Common prefix \"ca\" aage \"t\" aur \"r\" mein branch hota hai.",
      "steps": [
        {
          "activeNode": "c",
          "path": [
            "root",
            "c"
          ],
          "explanation": "Insert \"c\" under root",
          "explanation_hi": "\"c\" root ke neeche add hua"
        },
        {
          "activeNode": "a",
          "path": [
            "root",
            "c",
            "a"
          ],
          "explanation": "Insert \"a\" under \"c\" (prefix \"ca\")",
          "explanation_hi": "\"a\" add hua (prefix \"ca\")"
        },
        {
          "activeNode": "t",
          "path": [
            "root",
            "c",
            "a",
            "t"
          ],
          "explanation": "Branch to \"t\" -> Word \"cat\" marked (isEnd=true)",
          "explanation_hi": "\"t\" branch ban kar \"cat\" complete hua"
        },
        {
          "activeNode": "r",
          "path": [
            "root",
            "c",
            "a",
            "r"
          ],
          "explanation": "Branch to \"r\" -> Word \"car\" marked; extends to \"t\" for \"cart\"",
          "explanation_hi": "\"r\" branch ban kar \"car\" aur aage \"cart\" bana"
        }
      ],
      "result": [
        "cat",
        "car",
        "cart"
      ]
    },
    "code": "class TrieNode {\n  constructor() {\n    this.children = {};\n    this.isEnd = false;\n  }\n}\n\nclass Trie {\n  constructor() {\n    this.root = new TrieNode();\n  }\n  \n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n  \n  search(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return node.isEnd;\n  }\n  \n  startsWith(prefix) {\n    let node = this.root;\n    for (const ch of prefix) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return true;\n  }\n}\n\nconst trie = new Trie();\ntrie.insert(\"apple\");\nconsole.log(trie.search(\"apple\"));   // true\nconsole.log(trie.startsWith(\"app\")); // true",
    "searchSignals": {
      "tags": [
        "strings",
        "trie",
        "tree"
      ],
      "keywords": [
        "trie",
        "prefix tree",
        "autocomplete"
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
        "title": "Implement Trie (Prefix Tree)",
        "difficulty": "Medium",
        "slug": "implement-trie-prefix-tree",
        "url": "https://leetcode.com/problems/implement-trie-prefix-tree/"
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
        "name": "LeetCode Implement Trie",
        "url": "https://leetcode.com/problems/implement-trie-prefix-tree/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "String Matching": {
    "slug": "strings-string-matching",
    "name": "String Matching",
    "topic": "Strings",
    "difficulty": "Easy",
    "timeComplexity": "O(N * M)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "String Matching (Sliding Window / Naive & Built-in)",
      "overview": "Locating the first occurrence of a needle string within a haystack string using pointer scans.",
      "whatItIs": "Baseline substring search testing every candidate alignment index from 0 to N - M.",
      "whyItWorks": "If needle matches haystack at offset i, every character haystack[i + k] must equal needle[k].",
      "whenToUse": "Small strings, quick implementations, built-in string method interviews.",
      "recognitionSignals": [
        "Return index of first occurrence of needle in haystack",
        "Substrings of small length"
      ],
      "commonMistakes": [
        "Loop boundary running up to N instead of N - M",
        "Handling empty needle edge cases"
      ],
      "stepLogic": "1. If needle is empty, return 0.\n2. For i = 0 to haystack.length - needle.length:\n3. Compare characters needle[k] with haystack[i + k].\n4. If all match, return i; else return -1."
    },
    "hi": {
      "title": "String Matching",
      "overview": "Haystack string mein needle string ka pehla occurrence index find karna.",
      "whatItIs": "Har possible offset index par substring match check karne ka standard pattern.",
      "whyItWorks": "Index i se start karke agar saare characters needle ke equal hain toh index return ho jata hai.",
      "whenToUse": "Chhoti strings ya direct substring search questions mein.",
      "recognitionSignals": [
        "First index of substring",
        "needle in haystack"
      ],
      "commonMistakes": [
        "Loop condition i <= N - M na rakhna"
      ],
      "stepLogic": "1. Needle length check karein.\n2. i = 0 se N - M tak loop chalayein.\n3. M match milte hi index i return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "STRINGS",
      "title": "Naive Substring Alignment Check",
      "input": {
        "haystack": "sadbutsad",
        "needle": "sad"
      },
      "description": "Checks offset 0: \"sad\" matches \"sad\" immediately at index 0.",
      "description_hi": "Index 0 par check karta hai: \"sad\" match ho gaya.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            "s",
            "a",
            "d"
          ],
          "explanation": "Match at offset 0: \"s\"===\"s\", \"a\"===\"a\", \"d\"===\"d\"",
          "explanation_hi": "Offset 0 par exact match mil gaya"
        }
      ],
      "result": 0
    },
    "code": "function strStr(haystack, needle) {\n  if (needle === \"\") return 0;\n  const n = haystack.length, m = needle.length;\n  for (let i = 0; i <= n - m; i++) {\n    let match = true;\n    for (let j = 0; j < m; j++) {\n      if (haystack[i + j] !== needle[j]) {\n        match = false;\n        break;\n      }\n    }\n    if (match) return i;\n  }\n  return -1;\n}\n\nconsole.log(strStr(\"sadbutsad\", \"sad\")); // 0",
    "searchSignals": {
      "tags": [
        "strings",
        "two-pointers"
      ],
      "keywords": [
        "strstr",
        "string matching",
        "needle haystack"
      ],
      "companies": [
        "Amazon",
        "Microsoft",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Find the Index of the First Occurrence in a String",
        "difficulty": "Easy",
        "slug": "find-the-index-of-the-first-occurrence-in-a-string",
        "url": "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode StrStr Editorial",
        "url": "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Manacher's Algorithm": {
    "slug": "strings-manachers-algorithm",
    "name": "Manacher's Algorithm",
    "topic": "Strings",
    "difficulty": "Hard",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Manacher's Algorithm (Optimal Linear Palindrome)",
      "overview": "Finds the longest palindromic substring in strictly linear O(N) time and O(N) space.",
      "whatItIs": "Transforms string with delimiters (e.g., `#a#b#a#`) to handle even/odd symmetry uniformly, then maintains center C and right boundary R.",
      "whyItWorks": "Palindromic symmetry guarantees that radius around index i mirrors the radius around i_mirror = 2*C - i up to the current boundary R.",
      "whenToUse": "When O(N^2) expand-around-center times out on massive strings (N >= 10^5).",
      "recognitionSignals": [
        "Linear time longest palindrome requirement",
        "Count all palindromic substrings in O(N)"
      ],
      "commonMistakes": [
        "Forgetting to pad with start/end sentinel symbols (`^` and `$`)",
        "Not translating back from padded string indices to original string indices"
      ],
      "stepLogic": "1. Pad string: \"^#\" + s.split(\"\").join(\"#\") + \"#$\".\n2. Maintain C = 0, R = 0, and radius array P.\n3. For i, if i < R, P[i] = min(R - i, P[2*C - i]).\n4. Expand while chars match; update C, R when i + P[i] > R.\n5. Extract max radius substring."
    },
    "hi": {
      "title": "Manacher's Algorithm",
      "overview": "Strictly O(N) linear time mein longest palindrome substring calculate karna.",
      "whatItIs": "String mein `#` insert karke even aur odd palindromes ko uniformly handle karta hai.",
      "whyItWorks": "Center C aur boundary R maintain karke mirror index 2*C - i ki value direct reuse karta hai.",
      "whenToUse": "Jab string bahut lambi ho (N >= 10^5) aur O(N^2) TLE de raha ho.",
      "recognitionSignals": [
        "O(N) palindrome finding",
        "Palindromic radius mirror"
      ],
      "commonMistakes": [
        "Sentinel characters (^, $) add na karna",
        "Transformed index se original index convert karne mein galti"
      ],
      "stepLogic": "1. String ko `#` ke sath pad karein.\n2. Center C aur Right boundary R track karein.\n3. Mirror index se initial radius lein aur expand karein.\n4. Max palindrome return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "STRINGS",
      "title": "Manacher's Radius Expansion",
      "input": "^#a#b#a#$",
      "description": "Radius array P tracks palindrome radii around each padded character center.",
      "description_hi": "P array har character ke around palindrome radius track karta hai.",
      "steps": [
        {
          "activeIdx": 4,
          "elements": [
            0,
            0,
            1,
            0,
            3,
            0,
            1,
            0,
            0
          ],
          "explanation": "Center at index 4 (\"#b#\"): Radius P[4] = 3 -> Palindrome \"aba\"",
          "explanation_hi": "Center 4 par radius 3 mila -> \"aba\" palindrome"
        }
      ],
      "result": "aba"
    },
    "code": "function manacher(s) {\n  if (!s) return \"\";\n  const t = \"^#\" + s.split(\"\").join(\"#\") + \"#$\";\n  const p = new Array(t.length).fill(0);\n  let c = 0, r = 0;\n  \n  for (let i = 1; i < t.length - 1; i++) {\n    const iMirror = 2 * c - i;\n    if (r > i) p[i] = Math.min(r - i, p[iMirror]);\n    while (t[i + 1 + p[i]] === t[i - 1 - p[i]]) p[i]++;\n    if (i + p[i] > r) {\n      c = i;\n      r = i + p[i];\n    }\n  }\n  \n  let maxLen = 0, centerIdx = 0;\n  for (let i = 1; i < t.length - 1; i++) {\n    if (p[i] > maxLen) {\n      maxLen = p[i];\n      centerIdx = i;\n    }\n  }\n  const start = Math.floor((centerIdx - maxLen) / 2);\n  return s.slice(start, start + maxLen);\n}\n\nconsole.log(manacher(\"babad\")); // \"bab\" (or \"aba\")",
    "searchSignals": {
      "tags": [
        "strings",
        "palindrome",
        "manacher"
      ],
      "keywords": [
        "manacher algorithm",
        "linear palindrome",
        "longest palindromic substring"
      ],
      "companies": [
        "Google",
        "Uber",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Longest Palindromic Substring",
        "difficulty": "Medium",
        "slug": "longest-palindromic-substring",
        "url": "https://leetcode.com/problems/longest-palindromic-substring/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Manacher's Algorithm",
        "url": "https://cp-algorithms.com/string/manacher.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Suffix Array": {
    "slug": "strings-suffix-array",
    "name": "Suffix Array",
    "topic": "Strings",
    "difficulty": "Hard",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Suffix Array Construction",
      "overview": "Sorted array of all suffixes of a string, represented by their starting indices.",
      "whatItIs": "A compact alternative to Suffix Trees enabling fast substring search, LCP queries, and pattern counting in O(M log N).",
      "whyItWorks": "Sorting suffixes lexicographically allows binary searching for any pattern in logarithmic time.",
      "whenToUse": "Finding longest repeated substring, multiple pattern searches in static text, substring count.",
      "recognitionSignals": [
        "Lexicographical sorting of all suffixes",
        "Binary search over text suffixes"
      ],
      "commonMistakes": [
        "Naive O(N^2 log N) string slicing vs prefix doubling O(N log^2 N) or O(N log N)"
      ],
      "stepLogic": "1. Collect all suffixes s[i..N-1] with their starting indices i.\n2. Sort suffixes lexicographically.\n3. Return the array of starting indices."
    },
    "hi": {
      "title": "Suffix Array Construction",
      "overview": "String ke sabhi suffixes ko alphabetically sort karke unke start indices ka array banana.",
      "whatItIs": "Suffix tree ka memory-efficient alternative jo fast substring search allow karta hai.",
      "whyItWorks": "Lexicographically sorted hone ki wajah se kisi bhi pattern ko binary search se O(M log N) mein dhundha ja sakta hai.",
      "whenToUse": "Repeated substrings aur static text queries mein.",
      "recognitionSignals": [
        "Sorted suffixes",
        "Pattern search in text"
      ],
      "commonMistakes": [
        "Strings ko direct slice karke sort karna jisse memory O(N^2) ho jati hai"
      ],
      "stepLogic": "1. Har index se start hone wale suffix ko label karein.\n2. Unhe sort karein.\n3. Sorted indices ka array return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "STRINGS",
      "title": "Sorted Suffix Indices",
      "input": "banana$",
      "description": "Suffixes sorted: 6:$, 5:a$, 3:ana$, 1:anana$, 0:banana$, 4:na$, 2:nana$",
      "description_hi": "Sorted suffix indices: 6, 5, 3, 1, 0, 4, 2",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            6,
            5,
            3,
            1,
            0,
            4,
            2
          ],
          "explanation": "Sorted suffix array: [6, 5, 3, 1, 0, 4, 2]",
          "explanation_hi": "Suffix array sorted ho chuka hai"
        }
      ],
      "result": [
        6,
        5,
        3,
        1,
        0,
        4,
        2
      ]
    },
    "code": "function buildSuffixArray(s) {\n  const n = s.length;\n  const suffixes = [];\n  for (let i = 0; i < n; i++) {\n    suffixes.push({ index: i, suffix: s.slice(i) });\n  }\n  suffixes.sort((a, b) => a.suffix.localeCompare(b.suffix));\n  return suffixes.map(item => item.index);\n}\n\nconsole.log(buildSuffixArray(\"banana\")); // [5, 3, 1, 0, 4, 2]",
    "searchSignals": {
      "tags": [
        "strings",
        "suffix-array"
      ],
      "keywords": [
        "suffix array",
        "sorted suffixes",
        "lcp"
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
  "LCP": {
    "slug": "strings-lcp",
    "name": "LCP",
    "topic": "Strings",
    "difficulty": "Hard",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Longest Common Prefix (LCP Array / Kasai's Algorithm)",
      "overview": "Array storing lengths of longest common prefixes between consecutive sorted suffixes in O(N).",
      "whatItIs": "Kasai's algorithm constructs the LCP array linearly by taking advantage of the property that suffix i has LCP >= LCP(i-1) - 1.",
      "whyItWorks": "When dropping the first character of suffix i-1 to get suffix i, the shared prefix shrinks by at most 1, avoiding redundant character re-comparisons.",
      "whenToUse": "Counting unique substrings, finding longest repeated substring, string compression analysis.",
      "recognitionSignals": [
        "LCP array alongside suffix array",
        "Total number of distinct substrings in string"
      ],
      "commonMistakes": [
        "Computing LCP between consecutive suffixes from scratch in O(N^2)"
      ],
      "stepLogic": "1. Given suffix array SA and its inverse rank array.\n2. Iterate through string indices i from 0 to N-1.\n3. If rank[i] > 0, compare suffix i with suffix SA[rank[i]-1] starting from previously matched length k - 1.\n4. Set lcp[rank[i]] = k and decrement k if k > 0."
    },
    "hi": {
      "title": "Longest Common Prefix (LCP Array)",
      "overview": "Consecutive sorted suffixes ke beech common prefix lengths calculate karna O(N) mein.",
      "whatItIs": "Kasai's algorithm se linear time mein LCP array nikalna.",
      "whyItWorks": "Pichle suffix ke comparison se k - 1 length guaranteed hoti hai, isliye character comparisons O(N) par limit rehte hain.",
      "whenToUse": "Distinct substrings count karne aur Longest Repeated Substring dhoondhne mein.",
      "recognitionSignals": [
        "Distinct substrings count",
        "Longest repeated substring"
      ],
      "commonMistakes": [
        "Naive O(N^2) comparison loop lagana"
      ],
      "stepLogic": "1. Suffix array aur Rank array lein.\n2. Suffixes compare karein starting from k-1.\n3. LCP array fill karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "STRINGS",
      "title": "LCP Array Between Suffix Pairs",
      "input": "banana",
      "description": "LCP values between consecutive sorted suffixes: [0, 1, 3, 0, 0, 2]",
      "description_hi": "Consecutive suffixes ke beech matching prefix length.",
      "steps": [
        {
          "activeIdx": 2,
          "elements": [
            0,
            1,
            3,
            0,
            0,
            2
          ],
          "explanation": "Suffix \"ana\" and \"anana\" share LCP = 3 (\"ana\")",
          "explanation_hi": "\"ana\" aur \"anana\" mein LCP = 3 hai"
        }
      ],
      "result": [
        0,
        1,
        3,
        0,
        0,
        2
      ]
    },
    "code": "function buildLCP(s, sa) {\n  const n = s.length;\n  const rank = new Array(n).fill(0);\n  for (let i = 0; i < n; i++) rank[sa[i]] = i;\n  \n  const lcp = new Array(n).fill(0);\n  let k = 0;\n  for (let i = 0; i < n; i++) {\n    if (rank[i] === 0) {\n      k = 0;\n      continue;\n    }\n    const j = sa[rank[i] - 1];\n    while (i + k < n && j + k < n && s[i + k] === s[j + k]) k++;\n    lcp[rank[i]] = k;\n    if (k > 0) k--;\n  }\n  return lcp;\n}\n\nconst s = \"banana\";\nconst sa = [5, 3, 1, 0, 4, 2];\nconsole.log(buildLCP(s, sa)); // [0, 1, 3, 0, 0, 2]",
    "searchSignals": {
      "tags": [
        "strings",
        "lcp",
        "suffix-array"
      ],
      "keywords": [
        "lcp array",
        "kasai algorithm",
        "longest common prefix"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Longest Common Prefix",
        "difficulty": "Easy",
        "slug": "longest-common-prefix",
        "url": "https://leetcode.com/problems/longest-common-prefix/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Suffix and LCP",
        "url": "https://cp-algorithms.com/string/suffix-array.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Pattern Matching": {
    "slug": "strings-pattern-matching",
    "name": "Pattern Matching",
    "topic": "Strings",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(K)",
    "interviewFrequency": "High",
    "en": {
      "title": "Word Pattern Bijection Matching",
      "overview": "Validating one-to-one bijection between pattern characters and words or substrings.",
      "whatItIs": "Two-way mapping (pattern char <-> word) ensuring no two distinct pattern keys map to the same word and vice versa.",
      "whyItWorks": "Using two hash maps guarantees injectivity and surjectivity, preserving bijective equivalence.",
      "whenToUse": "Word Pattern, Isomorphic Strings, mapping encoded tokens to vocabulary.",
      "recognitionSignals": [
        "Pattern string maps to list of words",
        "Isomorphic character mapping",
        "Bijective relationship check"
      ],
      "commonMistakes": [
        "Only checking one-way mapping (pattern -> word) but allowing two letters to map to the same word",
        "Mismatch between word count and pattern length"
      ],
      "stepLogic": "1. Split string into tokens.\n2. If pattern.length !== tokens.length, return false.\n3. Check mapCharToWord and mapWordToChar consistently for each pair.\n4. Return true if all positions satisfy bijection."
    },
    "hi": {
      "title": "Word Pattern Bijection Matching",
      "overview": "Pattern characters aur words ke beech exact one-to-one (bijection) relationship check karna.",
      "whatItIs": "Do maps use karke ensure karna ki na do letters ek word par map hon aur na do words ek letter par.",
      "whyItWorks": "Dono taraf se mapping maintain karne se one-to-one isomorphism guarantee hota hai.",
      "whenToUse": "Word Pattern aur Isomorphic Strings problems mein.",
      "recognitionSignals": [
        "Bijection between pattern and words",
        "Isomorphic strings"
      ],
      "commonMistakes": [
        "Sirf ek taraf ka map check karna dusra bhool jana"
      ],
      "stepLogic": "1. Tokens split karein aur length check karein.\n2. Dono taraf maps mein check karein.\n3. Consistent mapping milne par true return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "STRINGS",
      "title": "Bijective Pattern Mapping",
      "input": {
        "pattern": "abba",
        "s": "dog cat cat dog"
      },
      "description": "a <-> dog, b <-> cat. Both directional maps are strictly 1-to-1.",
      "description_hi": "a maps to dog, b maps to cat. Dono maps 1-to-1 hain.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            "a:dog",
            "b:cat",
            "b:cat",
            "a:dog"
          ],
          "explanation": "Valid bijection preserved at all indices.",
          "explanation_hi": "Sabhi indices par valid bijection hai."
        }
      ],
      "result": true
    },
    "code": "function wordPattern(pattern, s) {\n  const words = s.split(\" \");\n  if (pattern.length !== words.length) return false;\n  const pToW = new Map(), wToP = new Map();\n  \n  for (let i = 0; i < pattern.length; i++) {\n    const p = pattern[i], w = words[i];\n    if (pToW.has(p) && pToW.get(p) !== w) return false;\n    if (wToP.has(w) && wToP.get(w) !== p) return false;\n    pToW.set(p, w);\n    wToP.set(w, p);\n  }\n  return true;\n}\n\nconsole.log(wordPattern(\"abba\", \"dog cat cat dog\")); // true",
    "searchSignals": {
      "tags": [
        "strings",
        "hash-table",
        "bijection"
      ],
      "keywords": [
        "word pattern",
        "isomorphic strings",
        "bijection match"
      ],
      "companies": [
        "Amazon",
        "Uber",
        "Dropbox"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Word Pattern",
        "difficulty": "Easy",
        "slug": "word-pattern",
        "url": "https://leetcode.com/problems/word-pattern/"
      },
      {
        "title": "Isomorphic Strings",
        "difficulty": "Easy",
        "slug": "isomorphic-strings",
        "url": "https://leetcode.com/problems/isomorphic-strings/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Word Pattern Editorial",
        "url": "https://leetcode.com/problems/word-pattern/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "String Compression": {
    "slug": "strings-string-compression",
    "name": "String Compression",
    "topic": "Strings",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Run-Length String Compression (Two Pointers In-Place)",
      "overview": "Compressing consecutive repeated characters in-place using read and write pointers in O(1) space.",
      "whatItIs": "Run-length encoding (RLE) modifying character arrays directly, writing count digits when repeat length > 1.",
      "whyItWorks": "Since compressed representation is always <= original length for runs >= 2, write pointer never overtakes read pointer.",
      "whenToUse": "In-place array modifications, Run-Length Encoding, encoding repetitive data streams.",
      "recognitionSignals": [
        "In-place string compression",
        "Replace consecutive identical characters with count",
        "Constant auxiliary memory O(1)"
      ],
      "commonMistakes": [
        "Writing count of 1 when character appears only once",
        "Multi-digit counts (e.g., 12 written as \"1\" then \"2\")",
        "Write pointer overwriting unread characters (cannot occur if logic is correct)"
      ],
      "stepLogic": "1. Initialize write = 0, read = 0.\n2. While read < len, count run length of chars[read].\n3. Write char at chars[write++].\n4. If count > 1, write each digit of count string.\n5. Return write length."
    },
    "hi": {
      "title": "Run-Length String Compression",
      "overview": "Array mein continuous duplicate characters ko read aur write pointers se in-place compress karna.",
      "whatItIs": "Run-length encoding technique jo bina extra array use kiye O(1) space mein operate karti hai.",
      "whyItWorks": "Count >= 2 par compressed version chhota hota hai, isliye write pointer kabhi unread data ko overwrite nahi karta.",
      "whenToUse": "In-place array compression problems mein.",
      "recognitionSignals": [
        "In-place string compression",
        "Run-length encoding"
      ],
      "commonMistakes": [
        "Single count \"1\" ko write kar dena",
        "Two-digit counts ko single char treat karna"
      ],
      "stepLogic": "1. write = 0, read = 0 rakhein.\n2. Same character ka run count karein.\n3. Character aur count digits write karein.\n4. Final write length return karein."
    },
    "visual": {
      "type": "POINTERS",
      "category": "STRINGS",
      "title": "Run-Length Write In-Place",
      "input": [
        "a",
        "a",
        "b",
        "b",
        "c",
        "c",
        "c"
      ],
      "description": "Write pointer compacts: \"a\", \"2\", \"b\", \"2\", \"c\", \"3\" (length = 6)",
      "description_hi": "Write pointer compressed values write karta hai.",
      "steps": [
        {
          "left": 0,
          "right": 2,
          "elements": [
            "a",
            "2",
            "b",
            "b",
            "c",
            "c",
            "c"
          ],
          "explanation": "Run of 2 \"a\"s -> write [\"a\", \"2\"]",
          "explanation_hi": "2 \"a\" mile -> [\"a\", \"2\"] likha"
        },
        {
          "left": 2,
          "right": 4,
          "elements": [
            "a",
            "2",
            "b",
            "2",
            "c",
            "c",
            "c"
          ],
          "explanation": "Run of 2 \"b\"s -> write [\"b\", \"2\"]",
          "explanation_hi": "2 \"b\" mile -> [\"b\", \"2\"] likha"
        },
        {
          "left": 4,
          "right": 7,
          "elements": [
            "a",
            "2",
            "b",
            "2",
            "c",
            "3"
          ],
          "explanation": "Run of 3 \"c\"s -> write [\"c\", \"3\"]. Total length = 6.",
          "explanation_hi": "3 \"c\" mile -> [\"c\", \"3\"] likha. Final length = 6."
        }
      ],
      "result": 6
    },
    "code": "function compress(chars) {\n  let write = 0, read = 0;\n  while (read < chars.length) {\n    const char = chars[read];\n    let count = 0;\n    while (read < chars.length && chars[read] === char) {\n      read++;\n      count++;\n    }\n    chars[write++] = char;\n    if (count > 1) {\n      for (const digit of count.toString()) {\n        chars[write++] = digit;\n      }\n    }\n  }\n  return write;\n}\n\nconst chars = [\"a\",\"a\",\"b\",\"b\",\"c\",\"c\",\"c\"];\nconsole.log(compress(chars)); // 6 (chars is now [\"a\",\"2\",\"b\",\"2\",\"c\",\"3\"])",
    "searchSignals": {
      "tags": [
        "strings",
        "two-pointers",
        "in-place"
      ],
      "keywords": [
        "string compression",
        "run length encoding",
        "in-place compress"
      ],
      "companies": [
        "Amazon",
        "Microsoft",
        "Goldman Sachs"
      ]
    },
    "relatedCanonical": [
      {
        "title": "String Compression",
        "difficulty": "Medium",
        "slug": "string-compression",
        "url": "https://leetcode.com/problems/string-compression/"
      },
      {
        "title": "Count and Say",
        "difficulty": "Medium",
        "slug": "count-and-say",
        "url": "https://leetcode.com/problems/count-and-say/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode String Compression Editorial",
        "url": "https://leetcode.com/problems/string-compression/editorial/",
        "type": "LeetCode"
      }
    ]
  }
};
