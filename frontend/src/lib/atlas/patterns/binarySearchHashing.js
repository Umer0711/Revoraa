export const binarySearchHashingPatterns = {
  "Classic Binary Search": {
    "slug": "binary-search-classic-binary-search",
    "name": "Classic Binary Search",
    "topic": "Binary Search",
    "difficulty": "Easy",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Classic Binary Search",
      "overview": "Locating a target value within a sorted array by halving the search space in each iteration in O(log N).",
      "whatItIs": "Compare target with midpoint element: if target < mid search left half, if target > mid search right half, else target found.",
      "whyItWorks": "Monotonic sorted order guarantees that if target > nums[mid], no element in nums[0..mid] can equal target, eliminating half the candidates per comparison.",
      "whenToUse": "Searching in sorted collections, range boundary lookups.",
      "recognitionSignals": [
        "Sorted array input",
        "Logarithmic search time requirement O(log N)",
        "Find exact target index"
      ],
      "commonMistakes": [
        "Integer overflow when computing mid (`(low + high) / 2` instead of `low + Math.floor((high - low) / 2)`)",
        "Loop condition mismatch (`low <= high` vs `low < high`)"
      ],
      "stepLogic": "1. low = 0, high = n - 1.\n2. While low <= high:\n   a. mid = low + Math.floor((high - low) / 2)\n   b. If nums[mid] === target return mid\n   c. If nums[mid] < target low = mid + 1\n   d. Else high = mid - 1\n3. Return -1 if not found."
    },
    "hi": {
      "title": "Classic Binary Search",
      "overview": "Sorted array mein target element ko har bar search space aadhi karke O(log N) mein find karna.",
      "whatItIs": "Midpoint se target compare karke decide karna ki left half mein jana hai ya right half mein.",
      "whyItWorks": "Array sorted hone ki wajah se agar target nums[mid] se bada hai toh left side ke sabhi numbers reject ho jate hain.",
      "whenToUse": "Sorted array mein fast search karne ke liye.",
      "recognitionSignals": [
        "Sorted array input",
        "O(log N) lookup requirement"
      ],
      "commonMistakes": [
        "Mid calculate karte waqt overflow ya float division",
        "low <= high loop condition galat lagana"
      ],
      "stepLogic": "1. low = 0, high = N - 1 rakhein.\n2. mid = low + Math.floor((high - low) / 2) calculate karein.\n3. nums[mid] === target par mid return karein, warna low ya high update karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "BINARY SEARCH",
      "title": "Halving Search Space",
      "input": [
        -1,
        0,
        3,
        5,
        9,
        12
      ],
      "description": "Search for target 9: mid=2 (val 3) -> search right [5, 9, 12] -> mid=4 (val 9) -> Found!",
      "description_hi": "Target 9: mid 3 mila -> right half mein dekha -> 9 mil gaya!",
      "steps": [
        {
          "activeIdx": 2,
          "elements": [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          "explanation": "low=0, high=5 -> mid=2 (val 3). 3 < 9 -> low=3",
          "explanation_hi": "mid 2 par value 3 hai jo 9 se chhoti hai -> low=3"
        },
        {
          "activeIdx": 4,
          "elements": [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          "explanation": "low=3, high=5 -> mid=4 (val 9). Found target at index 4!",
          "explanation_hi": "mid 4 par value 9 mil gayi! Target found at index 4."
        }
      ],
      "result": 4
    },
    "code": "function search(nums, target) {\n  let low = 0, high = nums.length - 1;\n  while (low <= high) {\n    const mid = low + Math.floor((high - low) / 2);\n    if (nums[mid] === target) return mid;\n    else if (nums[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}\n\nconsole.log(search([-1,0,3,5,9,12], 9)); // 4",
    "searchSignals": {
      "tags": [
        "binary-search",
        "array"
      ],
      "keywords": [
        "binary search",
        "classic binary search",
        "logarithmic search"
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
        "title": "Binary Search",
        "difficulty": "Easy",
        "slug": "binary-search",
        "url": "https://leetcode.com/problems/binary-search/"
      },
      {
        "title": "Search Insert Position",
        "difficulty": "Easy",
        "slug": "search-insert-position",
        "url": "https://leetcode.com/problems/search-insert-position/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Binary Search Learn Card",
        "url": "https://leetcode.com/explore/learn/card/binary-search/",
        "type": "LeetCode"
      }
    ]
  },
  "Lower Bound": {
    "slug": "binary-search-lower-bound",
    "name": "Lower Bound",
    "topic": "Binary Search",
    "difficulty": "Medium",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Lower Bound (First Element >= Target)",
      "overview": "Locating the first index in a sorted array where the element is greater than or equal to target.",
      "whatItIs": "When nums[mid] >= target, mid is a candidate answer, so we record ans = mid and narrow right bound (`high = mid - 1`).",
      "whyItWorks": "Monotonicity of condition `nums[i] >= target` ensures false for prefix and true for suffix; lower bound finds the false/true boundary.",
      "whenToUse": "Find First and Last Position of Element in Sorted Array, insertion index for binary search.",
      "recognitionSignals": [
        "First element >= target",
        "Leftmost occurrence of target in duplicates",
        "Find first true in boolean predicate"
      ],
      "commonMistakes": [
        "Setting `high = mid` without loop condition coordination (infinite loop)",
        "Not recording candidate answer correctly"
      ],
      "stepLogic": "1. low = 0, high = n - 1, ans = n.\n2. While low <= high:\n   a. mid = low + Math.floor((high - low) / 2)\n   b. If nums[mid] >= target: ans = mid, high = mid - 1\n   c. Else: low = mid + 1\n3. Return ans."
    },
    "hi": {
      "title": "Lower Bound",
      "overview": "Sorted array mein pehla index jahan value >= target ho, O(log N) mein find karna.",
      "whatItIs": "Target se badi ya barabar pehli value dhoondhne ke liye left side par contract karna.",
      "whyItWorks": "nums[mid] >= target aate hi candidate record hota hai aur usse pehle bhi possible hone ki wajah se high = mid - 1 hota hai.",
      "whenToUse": "First occurrence dhoondhne ya Search Insert Position mein.",
      "recognitionSignals": [
        "First element >= target",
        "Leftmost duplicate position"
      ],
      "commonMistakes": [
        "Infinite loop agar boundary conditions low < high aur low <= high confuse ho"
      ],
      "stepLogic": "1. low = 0, high = N - 1, ans = N rakhein.\n2. nums[mid] >= target ho toh ans = mid aur high = mid - 1 karein.\n3. Warna low = mid + 1 karein. ans return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "BINARY SEARCH",
      "title": "Lower Bound Boundary Search",
      "input": [
        5,
        7,
        7,
        8,
        8,
        10
      ],
      "description": "Find lower bound of 8: First index with val >= 8 is index 3.",
      "description_hi": "8 ka lower bound index 3 par milta hai.",
      "steps": [
        {
          "activeIdx": 2,
          "elements": [
            5,
            7,
            7,
            8,
            8,
            10
          ],
          "explanation": "mid=2 (val 7) < 8 -> low=3",
          "explanation_hi": "mid 2 par 7 < 8 hai -> low=3"
        },
        {
          "activeIdx": 4,
          "elements": [
            5,
            7,
            7,
            8,
            8,
            10
          ],
          "explanation": "mid=4 (val 8) >= 8 -> ans=4, high=3",
          "explanation_hi": "mid 4 par 8 >= 8 hai -> ans=4, high=3"
        },
        {
          "activeIdx": 3,
          "elements": [
            5,
            7,
            7,
            8,
            8,
            10
          ],
          "explanation": "mid=3 (val 8) >= 8 -> ans=3, high=2. Loop ends. Lower Bound = 3!",
          "explanation_hi": "mid 3 par 8 >= 8 hai -> ans=3. Final Lower Bound = 3!"
        }
      ],
      "result": 3
    },
    "code": "function lowerBound(nums, target) {\n  let low = 0, high = nums.length - 1;\n  let ans = nums.length;\n  while (low <= high) {\n    const mid = low + Math.floor((high - low) / 2);\n    if (nums[mid] >= target) {\n      ans = mid;\n      high = mid - 1;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return ans;\n}\n\nconsole.log(lowerBound([5,7,7,8,8,10], 8)); // 3",
    "searchSignals": {
      "tags": [
        "binary-search",
        "lower-bound"
      ],
      "keywords": [
        "lower bound",
        "first element greater equal",
        "search insert"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Search Insert Position",
        "difficulty": "Easy",
        "slug": "search-insert-position",
        "url": "https://leetcode.com/problems/search-insert-position/"
      },
      {
        "title": "Find First and Last Position of Element in Sorted Array",
        "difficulty": "Medium",
        "slug": "find-first-and-last-position-of-element-in-sorted-array",
        "url": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Binary Search",
        "url": "https://cp-algorithms.com/num_methods/binary_search.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Upper Bound": {
    "slug": "binary-search-upper-bound",
    "name": "Upper Bound",
    "topic": "Binary Search",
    "difficulty": "Medium",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Upper Bound (First Element > Target)",
      "overview": "Finding the first index where the element is strictly greater than target in O(log N).",
      "whatItIs": "Unlike lower bound (>=), upper bound checks strictly greater (>). The rightmost duplicate of target is at `upperBound - 1`.",
      "whyItWorks": "Partitions array into elements <= target and elements > target.",
      "whenToUse": "Range count queries, finding last occurrence of element in sorted array with duplicates.",
      "recognitionSignals": [
        "First element strictly greater than target",
        "Count occurrences in sorted array: `upperBound - lowerBound`"
      ],
      "commonMistakes": [
        "Confusing strictly greater (upper bound) with greater-or-equal (lower bound)"
      ],
      "stepLogic": "1. low = 0, high = n - 1, ans = n.\n2. While low <= high:\n   a. mid = low + Math.floor((high - low) / 2)\n   b. If nums[mid] > target: ans = mid, high = mid - 1\n   c. Else: low = mid + 1\n3. Return ans."
    },
    "hi": {
      "title": "Upper Bound",
      "overview": "Pehla aisa index jahan element strictly target se bada ho (> target), O(log N) mein find karna.",
      "whatItIs": "Lower bound (>=) se alag, upper bound strictly greater (>) dhoondhta hai.",
      "whyItWorks": "Array ko target se chhote/barabar aur strictly bade parts mein baant-ta hai.",
      "whenToUse": "Duplicates wale sorted array mein last occurrence dhoondhne ke liye (`upperBound - 1`).",
      "recognitionSignals": [
        "Strictly greater than target",
        "Range count in duplicates"
      ],
      "commonMistakes": [
        "Lower bound aur Upper bound ke comparison symbol mein galti"
      ],
      "stepLogic": "1. low = 0, high = N - 1, ans = N.\n2. nums[mid] > target par ans = mid, high = mid - 1.\n3. Warna low = mid + 1. ans return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "BINARY SEARCH",
      "title": "Upper Bound Strict Inequality",
      "input": [
        5,
        7,
        7,
        8,
        8,
        10
      ],
      "description": "Upper bound of 8: First element strictly > 8 is 10 at index 5.",
      "description_hi": "8 se strictly bada element 10 hai jo index 5 par hai.",
      "steps": [
        {
          "activeIdx": 4,
          "elements": [
            5,
            7,
            7,
            8,
            8,
            10
          ],
          "explanation": "mid=4 (val 8) <= 8 -> low=5",
          "explanation_hi": "mid 4 par 8 <= 8 hai -> low=5"
        },
        {
          "activeIdx": 5,
          "elements": [
            5,
            7,
            7,
            8,
            8,
            10
          ],
          "explanation": "mid=5 (val 10) > 8 -> ans=5, high=4. Upper Bound = 5!",
          "explanation_hi": "mid 5 par 10 > 8 hai -> Upper Bound = 5!"
        }
      ],
      "result": 5
    },
    "code": "function upperBound(nums, target) {\n  let low = 0, high = nums.length - 1;\n  let ans = nums.length;\n  while (low <= high) {\n    const mid = low + Math.floor((high - low) / 2);\n    if (nums[mid] > target) {\n      ans = mid;\n      high = mid - 1;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return ans;\n}\n\nconsole.log(upperBound([5,7,7,8,8,10], 8)); // 5",
    "searchSignals": {
      "tags": [
        "binary-search",
        "upper-bound"
      ],
      "keywords": [
        "upper bound",
        "strictly greater binary search"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Find First and Last Position of Element in Sorted Array",
        "difficulty": "Medium",
        "slug": "find-first-and-last-position-of-element-in-sorted-array",
        "url": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Upper Bound",
        "url": "https://cp-algorithms.com/num_methods/binary_search.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Binary Search on Answer": {
    "slug": "binary-search-on-answer",
    "name": "Binary Search on Answer",
    "topic": "Binary Search",
    "difficulty": "Medium",
    "timeComplexity": "O(N log(Range))",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Binary Search on Answer (Monotonic Predicate)",
      "overview": "Binary searching the numerical solution space directly when a verification function `canAchieve(mid)` is monotonic.",
      "whatItIs": "Instead of searching elements in an array, search possible answer values in range [minAns..maxAns]. Check feasibility in O(N).",
      "whyItWorks": "If speed X is fast enough to finish within H hours, any speed > X will also finish within H hours (monotonic truth table FFF...TTT).",
      "whenToUse": "Koko Eating Bananas, Capacity To Ship Packages Within D Days, Split Array Largest Sum, Aggressive Cows.",
      "recognitionSignals": [
        "Minimize the maximum or maximize the minimum",
        "Verification is easy in O(N) but direct construction is hard",
        "Continuous monotonic answer range"
      ],
      "commonMistakes": [
        "Setting range boundaries incorrectly (e.g. low = 0 when speed must be >= 1)",
        "Non-monotonic predicate condition"
      ],
      "stepLogic": "1. Identify answer range: low = minPossible, high = maxPossible, ans = high.\n2. While low <= high:\n   a. mid = low + Math.floor((high - low) / 2)\n   b. If canAchieve(mid) is feasible: ans = mid, try for better answer (high = mid - 1)\n   c. Else: low = mid + 1\n3. Return ans."
    },
    "hi": {
      "title": "Binary Search on Answer",
      "overview": "Array elements ke badle answer range [min..max] par binary search lagana jahan condition monotonic ho.",
      "whatItIs": "Ek feasibility function `canAchieve(mid)` banate hain jo O(N) mein check karta hai ki kya mid answer possible hai.",
      "whyItWorks": "Agar speed X par task complete ho raha hai, toh X se badi har speed par task pakka complete hoga (Monotonicity).",
      "whenToUse": "Koko Eating Bananas, Capacity To Ship Packages, Split Array Largest Sum mein.",
      "recognitionSignals": [
        "\"Minimize the maximum\" ya \"Maximize the minimum\"",
        "Feasibility check O(N) mein aasan ho"
      ],
      "commonMistakes": [
        "low boundary 0 rakh dena jabki speed minimum 1 honi chahiye"
      ],
      "stepLogic": "1. low aur high answer boundaries decide karein.\n2. mid = (low + high) / 2 nikaalein.\n3. canAchieve(mid) true ho toh ans = mid, high = mid - 1 karein.\n4. Warna low = mid + 1 karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "BINARY SEARCH",
      "title": "Feasibility Monotonic Predicate Range",
      "input": {
        "piles": [
          3,
          6,
          7,
          11
        ],
        "h": 8
      },
      "description": "Search speed in range [1..11]. Speed 4 finishes in 8 hrs! Try 3: 10 hrs (too slow). Optimal speed = 4.",
      "description_hi": "Speed range [1..11] par binary search: speed 4 theek 8 ghante mein khatam karti hai.",
      "steps": [
        {
          "activeIdx": 5,
          "elements": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11
          ],
          "explanation": "mid speed=6: takes 6 hrs (<=8, feasible!) -> ans=6, search left",
          "explanation_hi": "Speed 6 feasible hai -> ans=6, left try karein"
        },
        {
          "activeIdx": 3,
          "elements": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11
          ],
          "explanation": "mid speed=4: takes 8 hrs (<=8, feasible!) -> ans=4, search left",
          "explanation_hi": "Speed 4 feasible hai -> ans=4, left try karein"
        },
        {
          "activeIdx": 2,
          "elements": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11
          ],
          "explanation": "mid speed=3: takes 10 hrs (>8, impossible!). Final optimal speed = 4.",
          "explanation_hi": "Speed 3 impossible hai. Final answer = 4."
        }
      ],
      "result": 4
    },
    "code": "function minEatingSpeed(piles, h) {\n  let low = 1, high = Math.max(...piles);\n  let ans = high;\n  \n  function canEatAll(speed) {\n    let hours = 0;\n    for (const p of piles) {\n      hours += Math.ceil(p / speed);\n    }\n    return hours <= h;\n  }\n  \n  while (low <= high) {\n    const mid = low + Math.floor((high - low) / 2);\n    if (canEatAll(mid)) {\n      ans = mid;\n      high = mid - 1;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return ans;\n}\n\nconsole.log(minEatingSpeed([3,6,7,11], 8)); // 4",
    "searchSignals": {
      "tags": [
        "binary-search",
        "array"
      ],
      "keywords": [
        "binary search on answer",
        "koko eating bananas",
        "capacity to ship packages"
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
        "title": "Koko Eating Bananas",
        "difficulty": "Medium",
        "slug": "koko-eating-bananas",
        "url": "https://leetcode.com/problems/koko-eating-bananas/"
      },
      {
        "title": "Capacity To Ship Packages Within D Days",
        "difficulty": "Medium",
        "slug": "capacity-to-ship-packages-within-d-days",
        "url": "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Koko Bananas Editorial",
        "url": "https://leetcode.com/problems/koko-eating-bananas/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Search in Rotated Array": {
    "slug": "binary-search-search-in-rotated-array",
    "name": "Search in Rotated Array",
    "topic": "Binary Search",
    "difficulty": "Medium",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Search in Rotated Sorted Array",
      "overview": "Searching a target in an array sorted in ascending order then rotated at an unknown pivot in O(log N).",
      "whatItIs": "At any split midpoint, at least one half (left or right) is guaranteed to be strictly sorted. Determine which half is sorted and check if target lies within its bounds.",
      "whyItWorks": "If `nums[low] <= nums[mid]`, left half is normally sorted; otherwise right half is normally sorted.",
      "whenToUse": "Search in Rotated Sorted Array I & II, Find Minimum in Rotated Sorted Array.",
      "recognitionSignals": [
        "Sorted array rotated at unknown pivot",
        "Find target in rotated array in O(log N)"
      ],
      "commonMistakes": [
        "Handling duplicates (when nums[low] === nums[mid] === nums[high], shrink bounds low++, high--)",
        "Inequality comparison with target (`nums[low] <= target && target < nums[mid]`)"
      ],
      "stepLogic": "1. low = 0, high = n - 1.\n2. mid = low + Math.floor((high - low) / 2).\n3. If nums[mid] === target return mid.\n4. If left half is sorted (nums[low] <= nums[mid]): if target >= nums[low] and target < nums[mid], high = mid - 1; else low = mid + 1.\n5. Else (right sorted): if target > nums[mid] and target <= nums[high], low = mid + 1; else high = mid - 1."
    },
    "hi": {
      "title": "Search in Rotated Sorted Array",
      "overview": "Rotated sorted array mein target ko O(log N) mein dhoondhna.",
      "whatItIs": "Har mid par ek half pakka sorted hota hai. Sorted half mein target check karke search space aadhi karte hain.",
      "whyItWorks": "nums[low] <= nums[mid] se pata lagta hai ki left half sorted hai ya right half.",
      "whenToUse": "Rotated sorted array search problems mein.",
      "recognitionSignals": [
        "Rotated sorted array",
        "O(log N) search requirement"
      ],
      "commonMistakes": [
        "Duplicates aane par O(log N) fail ho sakta hai (low++, high-- karna padta hai)"
      ],
      "stepLogic": "1. low, high set karein.\n2. Mid check karein.\n3. Check karein kaunsa half sorted hai.\n4. Agar target sorted half ke range mein hai toh us taraf jayein, warna dusri taraf."
    },
    "visual": {
      "type": "ARRAY",
      "category": "BINARY SEARCH",
      "title": "Rotated Sorted Half Identification",
      "input": [
        4,
        5,
        6,
        7,
        0,
        1,
        2
      ],
      "description": "Search for target 0: mid=3 (val 7). Left [4..7] is sorted, target 0 is not in [4..7] -> search right [0, 1, 2] -> Found at index 4!",
      "description_hi": "Left half [4..7] sorted hai lekin 0 usme nahi hai, isliye right half [0..2] mein search kiya.",
      "steps": [
        {
          "activeIdx": 3,
          "elements": [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          "explanation": "mid=3 (val 7). Left sorted [4..7], 0 not in range -> low=4",
          "explanation_hi": "Left sorted hai par 0 wahan nahi hai -> low=4"
        },
        {
          "activeIdx": 5,
          "elements": [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          "explanation": "low=4, high=6 -> mid=5 (val 1). 0 < 1 -> high=4",
          "explanation_hi": "mid=5 (val 1) > 0 -> high=4"
        },
        {
          "activeIdx": 4,
          "elements": [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          "explanation": "mid=4 (val 0) === target. Target found at index 4!",
          "explanation_hi": "mid=4 par target 0 mil gaya!"
        }
      ],
      "result": 4
    },
    "code": "function searchRotated(nums, target) {\n  let low = 0, high = nums.length - 1;\n  while (low <= high) {\n    const mid = low + Math.floor((high - low) / 2);\n    if (nums[mid] === target) return mid;\n    \n    // Check if left half is sorted\n    if (nums[low] <= nums[mid]) {\n      if (nums[low] <= target && target < nums[mid]) {\n        high = mid - 1;\n      } else {\n        low = mid + 1;\n      }\n    } else {\n      // Right half is sorted\n      if (nums[mid] < target && target <= nums[high]) {\n        low = mid + 1;\n      } else {\n        high = mid - 1;\n      }\n    }\n  }\n  return -1;\n}\n\nconsole.log(searchRotated([4,5,6,7,0,1,2], 0)); // 4",
    "searchSignals": {
      "tags": [
        "binary-search",
        "array"
      ],
      "keywords": [
        "search in rotated sorted array",
        "rotated array search"
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
        "title": "Search in Rotated Sorted Array",
        "difficulty": "Medium",
        "slug": "search-in-rotated-sorted-array",
        "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/"
      },
      {
        "title": "Find Minimum in Rotated Sorted Array",
        "difficulty": "Medium",
        "slug": "find-minimum-in-rotated-sorted-array",
        "url": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Rotated Search Editorial",
        "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Peak Element": {
    "slug": "binary-search-peak-element",
    "name": "Peak Element",
    "topic": "Binary Search",
    "difficulty": "Medium",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Find Peak Element (Local Monotonic Gradient)",
      "overview": "Finding an element strictly greater than its neighbors in an unsorted array in O(log N).",
      "whatItIs": "Compare `nums[mid]` with `nums[mid + 1]`. If `nums[mid] < nums[mid + 1]`, a peak must exist to the right (following the upward slope). Else peak exists at mid or to the left.",
      "whyItWorks": "Because boundaries are treated as negative infinity, following the ascending slope guarantees hitting a local maximum.",
      "whenToUse": "Find Peak Element, Peak Index in a Mountain Array.",
      "recognitionSignals": [
        "Find peak element strictly greater than neighbors",
        "Logarithmic time on unsorted data"
      ],
      "commonMistakes": [
        "Checking `nums[mid - 1]` and causing out of bounds at index 0",
        "Using `low <= high` with `low = mid + 1` causing index out of bounds on `mid + 1`"
      ],
      "stepLogic": "1. low = 0, high = nums.length - 1.\n2. While low < high:\n   a. mid = low + Math.floor((high - low) / 2)\n   b. If nums[mid] < nums[mid + 1]: low = mid + 1 (uphill to the right)\n   c. Else: high = mid (peak is at mid or to the left)\n3. Return low."
    },
    "hi": {
      "title": "Find Peak Element",
      "overview": "Unsorted array mein koi bhi aisa element dhoondhna jo apne dono neighbors se bada ho, O(log N) mein.",
      "whatItIs": "Slope follow karna: agar mid < mid+1 hai toh right side chadhai hai, wahan peak pakka milega.",
      "whyItWorks": "Boundaries -infinity hone ki wajah se upward slope follow karne par local maximum zaroor milta hai.",
      "whenToUse": "Find Peak Element, Mountain array problems mein.",
      "recognitionSignals": [
        "Peak element greater than neighbors",
        "Unsorted array par O(log N) time"
      ],
      "commonMistakes": [
        "low <= high use karke mid+1 index out of bounds kar dena (use low < high)"
      ],
      "stepLogic": "1. low = 0, high = N - 1 rakhein.\n2. While low < high: agar nums[mid] < nums[mid + 1] toh low = mid + 1, warna high = mid.\n3. low return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "BINARY SEARCH",
      "title": "Peak Slope Climb",
      "input": [
        1,
        2,
        1,
        3,
        5,
        6,
        4
      ],
      "description": "Follow ascending slope: mid=3 (val 3) < 5 -> climb right to peak 6 at index 5.",
      "description_hi": "Upward slope follow karke peak index 5 (val 6) par pahunchein.",
      "steps": [
        {
          "activeIdx": 3,
          "elements": [
            1,
            2,
            1,
            3,
            5,
            6,
            4
          ],
          "explanation": "mid=3 (val 3) < mid+1 (val 5) -> Peak exists to right. low=4",
          "explanation_hi": "Right side slope badh raha hai -> low=4"
        },
        {
          "activeIdx": 5,
          "elements": [
            1,
            2,
            1,
            3,
            5,
            6,
            4
          ],
          "explanation": "mid=5 (val 6) > mid+1 (val 4) -> Peak is at 6 or left. high=5",
          "explanation_hi": "Slope gir raha hai -> high=5"
        },
        {
          "activeIdx": 5,
          "elements": [
            1,
            2,
            1,
            3,
            5,
            6,
            4
          ],
          "explanation": "low === high === 5. Found peak element 6 at index 5!",
          "explanation_hi": "low === high == 5. Peak index 5 mil gaya!"
        }
      ],
      "result": 5
    },
    "code": "function findPeakElement(nums) {\n  let low = 0, high = nums.length - 1;\n  while (low < high) {\n    const mid = low + Math.floor((high - low) / 2);\n    if (nums[mid] < nums[mid + 1]) {\n      low = mid + 1;\n    } else {\n      high = mid;\n    }\n  }\n  return low;\n}\n\nconsole.log(findPeakElement([1,2,1,3,5,6,4])); // 5 (value 6)",
    "searchSignals": {
      "tags": [
        "binary-search",
        "array"
      ],
      "keywords": [
        "find peak element",
        "peak index mountain",
        "binary search peak"
      ],
      "companies": [
        "Google",
        "Facebook",
        "Amazon",
        "Apple"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Find Peak Element",
        "difficulty": "Medium",
        "slug": "find-peak-element",
        "url": "https://leetcode.com/problems/find-peak-element/"
      },
      {
        "title": "Peak Index in a Mountain Array",
        "difficulty": "Medium",
        "slug": "peak-index-in-a-mountain-array",
        "url": "https://leetcode.com/problems/peak-index-in-a-mountain-array/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Find Peak Element Editorial",
        "url": "https://leetcode.com/problems/find-peak-element/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Infinite Array": {
    "slug": "binary-search-infinite-array",
    "name": "Infinite Array",
    "topic": "Binary Search",
    "difficulty": "Medium",
    "timeComplexity": "O(log P) where P is target index",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Binary Search in Infinite / Unbounded Array",
      "overview": "Searching an unbounded sorted stream by exponentially doubling window bounds [2^k] to bound target, then binary searching.",
      "whatItIs": "Start with low=0, high=1. While target > reader.get(high), advance low = high, high = high * 2. Then perform classic binary search.",
      "whyItWorks": "Exponential doubling finds upper bound in O(log P) steps; standard binary search takes O(log P) steps.",
      "whenToUse": "Search in a Sorted Array of Unknown Size, unbounded streams, search without length property.",
      "recognitionSignals": [
        "Array of unknown size or infinite length",
        "ArrayReader API without length method"
      ],
      "commonMistakes": [
        "Linear scan to find bound (takes O(P) instead of O(log P))",
        "Handling out-of-bound sentinel values (e.g., 2^31 - 1)"
      ],
      "stepLogic": "1. Set low = 0, high = 1.\n2. While target > reader.get(high): low = high, high = high * 2.\n3. Binary search in [low..high]."
    },
    "hi": {
      "title": "Infinite / Unbounded Array Search",
      "overview": "Bina array size jaane target dhoondhne ke liye boundaries ko exponentially double (1, 2, 4, 8...) karna.",
      "whatItIs": "Exponential jump se range [low..high] nikaal kar us range par standard binary search lagana.",
      "whyItWorks": "Range dhoondhne mein O(log P) aur binary search mein O(log P) lagta hai, total time O(log P) rehta hai.",
      "whenToUse": "Array of Unknown Size ya streaming data questions mein.",
      "recognitionSignals": [
        "Array length unknown",
        "ArrayReader API"
      ],
      "commonMistakes": [
        "Boundary search linear step se karna (exponential doubling zaroori hai)"
      ],
      "stepLogic": "1. low = 0, high = 1 set karein.\n2. Jab tak target > arr[high], low = high aur high = high * 2 karein.\n3. [low..high] par binary search chalayein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "BINARY SEARCH",
      "title": "Exponential Bounds Doubling",
      "input": {
        "target": 19,
        "stream": [
          3,
          5,
          7,
          9,
          10,
          90,
          100,
          130,
          140,
          160,
          170
        ]
      },
      "description": "Exponential window: [0..1] -> [1..2] -> [2..4] -> [4..8]. High=8 bounds target. Binary search in [4..8].",
      "description_hi": "Boundaries 1 -> 2 -> 4 -> 8 double hoti hain. Phir [4..8] mein binary search hota hai.",
      "steps": [
        {
          "activeIdx": 1,
          "elements": [
            3,
            5
          ],
          "explanation": "high=1 (val 5) < 19 -> double high to 2",
          "explanation_hi": "high=1 double hua"
        },
        {
          "activeIdx": 4,
          "elements": [
            3,
            5,
            7,
            9,
            10
          ],
          "explanation": "high=4 (val 10) < 19 -> double high to 8",
          "explanation_hi": "high=4 double hua"
        },
        {
          "activeIdx": 8,
          "elements": [
            3,
            5,
            7,
            9,
            10,
            90,
            100,
            130,
            140
          ],
          "explanation": "high=8 (val 140) > 19 -> Bounded in [4..8]! Run binary search.",
          "explanation_hi": "Range [4..8] confirm ho gayi! Binary search start."
        }
      ],
      "result": 4
    },
    "code": "function searchInfinite(reader, target) {\n  let low = 0, high = 1;\n  while (reader.get(high) < target) {\n    low = high;\n    high = high * 2;\n  }\n  \n  while (low <= high) {\n    const mid = low + Math.floor((high - low) / 2);\n    const val = reader.get(mid);\n    if (val === target) return mid;\n    else if (val < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}",
    "searchSignals": {
      "tags": [
        "binary-search",
        "infinite-array"
      ],
      "keywords": [
        "search in sorted array unknown size",
        "infinite array binary search"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Search in a Sorted Array of Unknown Size",
        "difficulty": "Medium",
        "slug": "search-in-a-sorted-array-of-unknown-size",
        "url": "https://leetcode.com/problems/search-in-a-sorted-array-of-unknown-size/"
      }
    ],
    "externalResources": [
      {
        "name": "GFG Search in Infinite Array",
        "url": "https://www.geeksforgeeks.org/find-position-element-sorted-array-infinite-numbers/",
        "type": "GFG"
      }
    ]
  },
  "Ternary Search": {
    "slug": "binary-search-ternary-search",
    "name": "Ternary Search",
    "topic": "Binary Search",
    "difficulty": "Medium",
    "timeComplexity": "O(log3 N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Ternary Search (Unimodal Optimization)",
      "overview": "Finding the maximum or minimum of a unimodal function by splitting interval into 3 equal parts in O(log3 N).",
      "whatItIs": "Evaluate function at two trisection points: m1 = low + (high - low)/3 and m2 = high - (high - low)/3. Eliminate 1/3 of the interval per step.",
      "whyItWorks": "Unimodal functions have exactly one local extremum and strictly monotonic flanks. If f(m1) < f(m2), peak cannot reside in [low..m1].",
      "whenToUse": "Finding peak of convex/concave parabolas, unimodal geometric distances, mathematical extrema without derivatives.",
      "recognitionSignals": [
        "Function increases then decreases (unimodal)",
        "Continuous float extremum optimization"
      ],
      "commonMistakes": [
        "Applying ternary search to general sorted arrays for element lookups (binary search does fewer comparisons: 2*log3(N) > log2(N))"
      ],
      "stepLogic": "1. While (high - low > epsilon):\n2. m1 = low + (high - low) / 3, m2 = high - (high - low) / 3.\n3. If f(m1) < f(m2): low = m1; else high = m2.\n4. Return (low + high) / 2."
    },
    "hi": {
      "title": "Ternary Search",
      "overview": "Unimodal function (pehle badhti hai fir ghatti hai) ka maximum dhoondhne ke liye range ko 3 parts mein divide karna.",
      "whatItIs": "Interval ko m1 aur m2 do points se 3 barabar hisson mein baant kar 1/3 interval discard karna.",
      "whyItWorks": "Unimodal curve par agar f(m1) < f(m2) hai toh peak m1 ke left mein kabhi nahi ho sakta.",
      "whenToUse": "Convex ya concave mathematical curve ka maximum ya minimum nikalne ke liye.",
      "recognitionSignals": [
        "Unimodal function peak",
        "Mathematical optimization without calculus"
      ],
      "commonMistakes": [
        "Normal sorted array element search mein lagana (binary search zyada efficient hai)"
      ],
      "stepLogic": "1. m1 = low + (high - low)/3, m2 = high - (high - low)/3 nikaalein.\n2. f(m1) aur f(m2) compare karein.\n3. 1/3 interval eliminate karein."
    },
    "visual": {
      "type": "TERNARY_SEARCH",
      "category": "BINARY SEARCH",
      "title": "Unimodal Trisection Points",
      "input": "f(x) = -(x - 3)^2 + 9",
      "description": "Evaluates m1 and m2, discards left 1/3, converges on maximum at x = 3 in O(log3 N).",
      "description_hi": "Interval ko 3 parts mein baant kar maximum x = 3 par converge karta hai.",
      "steps": [
        {
          "left": 0,
          "right": 6,
          "m1": 2,
          "m2": 4,
          "explanation": "f(m1=2) = 8, f(m2=4) = 8. Peak lies symmetrically between 2 and 4.",
          "explanation_hi": "m1 aur m2 evaluate hue"
        },
        {
          "left": 2,
          "right": 4,
          "m1": 2.67,
          "m2": 3.33,
          "explanation": "Interval narrowed to [2.67..3.33]. Converging on peak x = 3.0!",
          "explanation_hi": "Peak x = 3.0 par converge ho gaya!"
        }
      ],
      "result": 3
    },
    "code": "function ternarySearchMax(f, low, high, eps = 1e-7) {\n  while (high - low > eps) {\n    const m1 = low + (high - low) / 3;\n    const m2 = high - (high - low) / 3;\n    if (f(m1) < f(m2)) {\n      low = m1;\n    } else {\n      high = m2;\n    }\n  }\n  return (low + high) / 2;\n}\n\nconst f = x => -(x - 3) * (x - 3) + 9;\nconsole.log(ternarySearchMax(f, 0, 6)); // ~3.0",
    "searchSignals": {
      "tags": [
        "binary-search",
        "ternary-search",
        "math"
      ],
      "keywords": [
        "ternary search",
        "unimodal function",
        "optimization"
      ],
      "companies": [
        "Google",
        "Directi"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Peak Index in a Mountain Array",
        "difficulty": "Medium",
        "slug": "peak-index-in-a-mountain-array",
        "url": "https://leetcode.com/problems/peak-index-in-a-mountain-array/"
      }
    ],
    "externalResources": [
      {
        "name": "CP-Algorithms Ternary Search",
        "url": "https://cp-algorithms.com/num_methods/ternary_search.html",
        "type": "CP-Algorithms"
      }
    ]
  },
  "Hash Maps": {
    "slug": "hashing-hash-maps",
    "name": "Hash Maps",
    "topic": "Hashing",
    "difficulty": "Easy",
    "timeComplexity": "O(1) average lookup/insert",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Hash Maps (Two Sum Complement Matching)",
      "overview": "Storing seen numbers and indices to match target complements in single linear pass O(N) time.",
      "whatItIs": "For each number x, calculate complement = target - x. Check if complement exists in Map in O(1).",
      "whyItWorks": "Replaces nested O(N^2) brute force searches with instantaneous O(1) hash bucket lookups.",
      "whenToUse": "Two Sum, 4Sum II, Subarray Sum Equals K.",
      "recognitionSignals": [
        "Find pair that sums to target in unsorted array",
        "O(N) time requirement instead of O(N^2)"
      ],
      "commonMistakes": [
        "Matching element with itself when storing into map before lookup",
        "Collisions in custom hash keys"
      ],
      "stepLogic": "1. Initialize empty Map seen.\n2. For i = 0 to n-1:\n   a. complement = target - nums[i]\n   b. If seen.has(complement): return [seen.get(complement), i]\n   c. seen.set(nums[i], i)\n3. Return [] if no pair found."
    },
    "hi": {
      "title": "Hash Maps (Complement Matching)",
      "overview": "Target sum ke liye complement (target - x) ko hash map mein O(1) mein lookup karna.",
      "whatItIs": "O(N^2) brute force loop ko single O(N) pass mein badalne ka standard pattern.",
      "whyItWorks": "HashMap average O(1) lookup deta hai, isliye complement turant mil jata hai.",
      "whenToUse": "Two Sum aur Subarray Sum problems mein.",
      "recognitionSignals": [
        "Unsorted array mein pair sum",
        "O(N) time requirement"
      ],
      "commonMistakes": [
        "Number ko map mein pehle add karna aur fir usi se match kar lena (self pair)"
      ],
      "stepLogic": "1. Khali Map banayein.\n2. complement = target - nums[i] check karein.\n3. Map mein ho toh index pair return karein, warna current element map mein save karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "HASHING",
      "title": "Hash Map Complement Lookup",
      "input": {
        "nums": [
          2,
          7,
          11,
          15
        ],
        "target": 9
      },
      "description": "At index 1 (val 7): complement = 9 - 7 = 2. 2 is found in Map at index 0! Pair = [0, 1].",
      "description_hi": "Index 1 par 7 aya: complement 9 - 7 = 2 map mein mil gaya index 0 par!",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            2,
            7,
            11,
            15
          ],
          "explanation": "Map: { 2: 0 }",
          "explanation_hi": "Map mein 2 add hua"
        },
        {
          "activeIdx": 1,
          "elements": [
            2,
            7,
            11,
            15
          ],
          "explanation": "Read 7: complement 9 - 7 = 2 exists in Map! Return [0, 1].",
          "explanation_hi": "Complement 2 map mein mila! Return [0, 1]."
        }
      ],
      "result": [
        0,
        1
      ]
    },
    "code": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) {\n      return [map.get(comp), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log(twoSum([2,7,11,15], 9)); // [0, 1]",
    "searchSignals": {
      "tags": [
        "hashing",
        "hash-map",
        "two-sum"
      ],
      "keywords": [
        "two sum",
        "hash map complement",
        "instant lookup"
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
        "title": "Two Sum",
        "difficulty": "Easy",
        "slug": "two-sum",
        "url": "https://leetcode.com/problems/two-sum/"
      },
      {
        "title": "Subarray Sum Equals K",
        "difficulty": "Medium",
        "slug": "subarray-sum-equals-k",
        "url": "https://leetcode.com/problems/subarray-sum-equals-k/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Two Sum Editorial",
        "url": "https://leetcode.com/problems/two-sum/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Hash Sets": {
    "slug": "hashing-hash-sets",
    "name": "Hash Sets",
    "topic": "Hashing",
    "difficulty": "Easy",
    "timeComplexity": "O(1) average lookup/insert",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Hash Sets (O(N) Longest Consecutive Sequence)",
      "overview": "Deduplicating collections and verifying sequence continuity in O(1) per check.",
      "whatItIs": "Insert all numbers into a HashSet. Only start counting streaks when `num - 1` does NOT exist in the set (guaranteeing streak start).",
      "whyItWorks": "Filtering for streak starts ensures each number is part of a counting loop at most once, yielding strictly O(N) total time.",
      "whenToUse": "Longest Consecutive Sequence, Contains Duplicate, Intersection of Two Arrays.",
      "recognitionSignals": [
        "Unsorted array finding longest sequence of consecutive integers",
        "Remove duplicates and check presence in O(1)"
      ],
      "commonMistakes": [
        "Starting streak counts on every number (degrades to O(N^2)) instead of only when `!set.has(num - 1)`"
      ],
      "stepLogic": "1. Populate Set with all nums.\n2. For each num in set:\n   a. If !set.has(num - 1): curr = num, streak = 1\n   b. While set.has(curr + 1): curr++, streak++\n   c. maxStreak = max(maxStreak, streak)\n3. Return maxStreak."
    },
    "hi": {
      "title": "Hash Sets (Longest Consecutive Streak)",
      "overview": "Set ka use karke duplicates hatana aur O(N) time mein longest consecutive sequence find karna.",
      "whatItIs": "Set mein sabhi numbers daal kar sirf unhi numbers se streak ginte hain jinka pichla number `num - 1` set mein nahi hota.",
      "whyItWorks": "Sirf sequence ke start point se loop chalane se har number maximum ek hi baar count hota hai.",
      "whenToUse": "Longest Consecutive Sequence problem mein.",
      "recognitionSignals": [
        "Consecutive integers ki longest streak",
        "O(N) unsorted array sequence"
      ],
      "commonMistakes": [
        "Har number par loop chalana bina `num - 1` check kiye"
      ],
      "stepLogic": "1. Set mein sabhi numbers daalein.\n2. Agar `num - 1` nahi hai, toh streak start karein.\n3. `curr + 1` check karte hue streak badhayein aur max record karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "HASHING",
      "title": "Streak Start Filter",
      "input": [
        100,
        4,
        200,
        1,
        3,
        2
      ],
      "description": "Set holds: {100, 4, 200, 1, 3, 2}. Only 1, 100, 200 are streak starts. Streak from 1: 1->2->3->4 (length 4).",
      "description_hi": "1 se start hone wali streak 1, 2, 3, 4 length 4 banati hai.",
      "steps": [
        {
          "activeIdx": 3,
          "elements": [
            1,
            2,
            3,
            4
          ],
          "explanation": "1 is streak start (0 not in set). Count 1->2->3->4 (len 4)",
          "explanation_hi": "1 start point hai -> 1, 2, 3, 4 count hua"
        },
        {
          "activeIdx": 0,
          "elements": [
            100
          ],
          "explanation": "100 is start (99 not in set). Streak = 1",
          "explanation_hi": "100 start hai -> streak 1"
        }
      ],
      "result": 4
    },
    "code": "function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let maxStreak = 0;\n  \n  for (const num of set) {\n    if (!set.has(num - 1)) {\n      let curr = num;\n      let streak = 1;\n      while (set.has(curr + 1)) {\n        curr++;\n        streak++;\n      }\n      maxStreak = Math.max(maxStreak, streak);\n    }\n  }\n  return maxStreak;\n}\n\nconsole.log(longestConsecutive([100,4,200,1,3,2])); // 4",
    "searchSignals": {
      "tags": [
        "hashing",
        "hash-set",
        "array"
      ],
      "keywords": [
        "longest consecutive sequence",
        "hash set streak",
        "set lookup"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Facebook",
        "Spotify"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Longest Consecutive Sequence",
        "difficulty": "Medium",
        "slug": "longest-consecutive-sequence",
        "url": "https://leetcode.com/problems/longest-consecutive-sequence/"
      },
      {
        "title": "Contains Duplicate",
        "difficulty": "Easy",
        "slug": "contains-duplicate",
        "url": "https://leetcode.com/problems/contains-duplicate/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Longest Consecutive Editorial",
        "url": "https://leetcode.com/problems/longest-consecutive-sequence/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Frequency Counting": {
    "slug": "hashing-frequency-counting",
    "name": "Frequency Counting",
    "topic": "Hashing",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Frequency Counting & Bucket Sort",
      "overview": "Counting item frequencies with a Hash Map, then grouping by frequency using bucket indexing in O(N).",
      "whatItIs": "Map counts frequency of each number. Array of buckets where index is frequency stores all numbers having that count.",
      "whyItWorks": "Because maximum frequency is bounded by array length N, buckets [0..N] sort frequencies in strictly linear O(N) time without comparison sorting.",
      "whenToUse": "Top K Frequent Elements, Sort Characters By Frequency, Frequency Sort.",
      "recognitionSignals": [
        "Find top K frequent items in linear time O(N)",
        "Sort items by occurrence count"
      ],
      "commonMistakes": [
        "Using heap O(N log K) when bucket sort achieves strictly O(N)"
      ],
      "stepLogic": "1. Count frequencies in Map.\n2. Create buckets array of size N + 1.\n3. For each [num, count], buckets[count].push(num).\n4. Iterate backwards from bucket N collecting top K elements."
    },
    "hi": {
      "title": "Frequency Counting & Bucket Sort",
      "overview": "Numbers ki frequency count karke unhe frequency index wale buckets mein daalna taaki O(N) mein Top K elements mil sakein.",
      "whatItIs": "Max frequency N se badi nahi ho sakti, isliye frequency ko direct array index maan kar sort kar lete hain.",
      "whyItWorks": "Comparison sorting O(N log N) ke badle O(N) linear time mein top frequent elements mil jaate hain.",
      "whenToUse": "Top K Frequent Elements problem mein.",
      "recognitionSignals": [
        "Top K frequent elements in O(N)",
        "Frequency based sorting"
      ],
      "commonMistakes": [
        "Heap use karna jabki bucket sort O(N) mein ho sakta hai"
      ],
      "stepLogic": "1. Map mein frequencies count karein.\n2. N+1 size ka buckets array banayein.\n3. buckets[count].push(num) karein.\n4. Peeche se iterate karke top K collect karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "HASHING",
      "title": "Frequency to Bucket Mapping",
      "input": {
        "nums": [
          1,
          1,
          1,
          2,
          2,
          3
        ],
        "k": 2
      },
      "description": "Counts: 1:3, 2:2, 3:1. Buckets: [3]: [1], [2]: [2], [1]: [3]. Read top 2: [1, 2].",
      "description_hi": "Counts ke hisab se buckets bante hain aur peeche se top K read hote hain.",
      "steps": [
        {
          "activeIdx": 3,
          "elements": [
            1
          ],
          "explanation": "Bucket[3] holds [1] (freq = 3)",
          "explanation_hi": "Bucket 3 mein 1 hai"
        },
        {
          "activeIdx": 2,
          "elements": [
            1,
            2
          ],
          "explanation": "Bucket[2] holds [2] (freq = 2). Top 2 elements collected: [1, 2]!",
          "explanation_hi": "Bucket 2 se 2 liya -> Top 2 [1, 2] mil gaye!"
        }
      ],
      "result": [
        1,
        2
      ]
    },
    "code": "function topKFrequent(nums, k) {\n  const map = new Map();\n  for (const n of nums) map.set(n, (map.get(n) || 0) + 1);\n  \n  const buckets = Array.from({ length: nums.length + 1 }, () => []);\n  for (const [num, count] of map) {\n    buckets[count].push(num);\n  }\n  \n  const res = [];\n  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {\n    if (buckets[i].length) {\n      res.push(...buckets[i]);\n    }\n  }\n  return res.slice(0, k);\n}\n\nconsole.log(topKFrequent([1,1,1,2,2,3], 2)); // [1, 2]",
    "searchSignals": {
      "tags": [
        "hashing",
        "bucket-sort",
        "top-k"
      ],
      "keywords": [
        "top k frequent elements",
        "frequency counting",
        "bucket sort"
      ],
      "companies": [
        "Amazon",
        "Facebook",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Top K Frequent Elements",
        "difficulty": "Medium",
        "slug": "top-k-frequent-elements",
        "url": "https://leetcode.com/problems/top-k-frequent-elements/"
      },
      {
        "title": "Sort Characters By Frequency",
        "difficulty": "Medium",
        "slug": "sort-characters-by-frequency",
        "url": "https://leetcode.com/problems/sort-characters-by-frequency/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Top K Frequent Editorial",
        "url": "https://leetcode.com/problems/top-k-frequent-elements/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Prefix Hash": {
    "slug": "hashing-prefix-hash",
    "name": "Prefix Hash",
    "topic": "Hashing",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Prefix Sum Hash Map (Subarray Sum Equals K)",
      "overview": "Counting subarrays with sum equal to k by recording occurrences of running prefix sums in a Hash Map in O(N).",
      "whatItIs": "If running sum at index j is S_j, any preceding prefix sum S_i = S_j - k defines a valid subarray [i+1..j] with sum k.",
      "whyItWorks": "Algebraic rearrangement: `Sum(i+1..j) = Prefix(j) - Prefix(i) = k` becomes `Prefix(i) = Prefix(j) - k`.",
      "whenToUse": "Subarray Sum Equals K, Contiguous Array (equal 0s and 1s), Subarray Sums Divisible by K.",
      "recognitionSignals": [
        "Find number of continuous subarrays whose sum equals K",
        "Prefix sum with negative numbers"
      ],
      "commonMistakes": [
        "Forgetting base case `map.set(0, 1)` representing empty prefix sum before array start",
        "Using two pointers on arrays containing negative numbers (sliding window fails with negatives)"
      ],
      "stepLogic": "1. map = new Map([[0, 1]]), runningSum = 0, count = 0.\n2. For each num in nums:\n   a. runningSum += num\n   b. If map.has(runningSum - k): count += map.get(runningSum - k)\n   c. map.set(runningSum, (map.get(runningSum) || 0) + 1)\n3. Return count."
    },
    "hi": {
      "title": "Prefix Sum Hash Map",
      "overview": "Running prefix sum ko hash map mein store karke sum === k wale subarrays O(N) time mein count karna.",
      "whatItIs": "Agar current prefix sum S hai, toh `S - k` jitni bar pehle aa chuka hai, utne valid subarrays banenge.",
      "whyItWorks": "Algebra: `Prefix[j] - Prefix[i] = k` implies `Prefix[i] = Prefix[j] - k`.",
      "whenToUse": "Subarray Sum Equals K, negative numbers wale subarray sum problems mein.",
      "recognitionSignals": [
        "Subarray sum equals K",
        "Negative numbers present in array"
      ],
      "commonMistakes": [
        "Base case `map.set(0, 1)` daalna bhool jana"
      ],
      "stepLogic": "1. Map mein `{0: 1}` daalein.\n2. runningSum calculate karein.\n3. `runningSum - k` map mein dhoondein aur count mein add karein.\n4. Current sum map mein update karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "HASHING",
      "title": "Prefix Sum Delta Lookup",
      "input": {
        "nums": [
          1,
          2,
          3
        ],
        "k": 3
      },
      "description": "Pref sums: [1, 3, 6]. At 3: 3 - 3 = 0 (seen once). At 6: 6 - 3 = 3 (seen once). Total 2 subarrays.",
      "description_hi": "Running sum se k minus karke pichle prefix sums count kiye jaate hain.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            1,
            2,
            3
          ],
          "explanation": "currSum = 1: 1 - 3 = -2 not in map. Map: {0:1, 1:1}",
          "explanation_hi": "currSum 1 hua"
        },
        {
          "activeIdx": 1,
          "elements": [
            1,
            2,
            3
          ],
          "explanation": "currSum = 3: 3 - 3 = 0 in map! (count += 1). Map: {0:1, 1:1, 3:1}",
          "explanation_hi": "currSum 3: 3-3=0 mila -> count=1"
        },
        {
          "activeIdx": 2,
          "elements": [
            1,
            2,
            3
          ],
          "explanation": "currSum = 6: 6 - 3 = 3 in map! (count += 1). Total count = 2.",
          "explanation_hi": "currSum 6: 6-3=3 mila -> total count=2"
        }
      ],
      "result": 2
    },
    "code": "function subarraySum(nums, k) {\n  const map = new Map([[0, 1]]);\n  let currSum = 0, count = 0;\n  \n  for (const num of nums) {\n    currSum += num;\n    if (map.has(currSum - k)) {\n      count += map.get(currSum - k);\n    }\n    map.set(currSum, (map.get(currSum) || 0) + 1);\n  }\n  return count;\n}\n\nconsole.log(subarraySum([1,1,1], 2)); // 2",
    "searchSignals": {
      "tags": [
        "hashing",
        "prefix-sum",
        "array"
      ],
      "keywords": [
        "subarray sum equals k",
        "prefix hash",
        "prefix sum map"
      ],
      "companies": [
        "Facebook",
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Subarray Sum Equals K",
        "difficulty": "Medium",
        "slug": "subarray-sum-equals-k",
        "url": "https://leetcode.com/problems/subarray-sum-equals-k/"
      },
      {
        "title": "Contiguous Array",
        "difficulty": "Medium",
        "slug": "contiguous-array",
        "url": "https://leetcode.com/problems/contiguous-array/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Subarray Sum Editorial",
        "url": "https://leetcode.com/problems/subarray-sum-equals-k/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Custom Hashing": {
    "slug": "hashing-custom-hashing",
    "name": "Custom Hashing",
    "topic": "Hashing",
    "difficulty": "Medium",
    "timeComplexity": "O(N * K)",
    "spaceComplexity": "O(N * K)",
    "interviewFrequency": "High",
    "en": {
      "title": "Custom Hashing (Group Anagrams / Composite Keys)",
      "overview": "Generating deterministic serialized key strings for complex objects, tuples, or frequency vectors.",
      "whatItIs": "Convert a multi-field state (e.g. 26 character frequencies `#1#0#0...`) into a unique string key used for Hash Map grouping.",
      "whyItWorks": "Two objects belong to the same equivalence class if and only if their normalized canonical key representations are identical.",
      "whenToUse": "Group Anagrams, Group Shifted Strings, Point reflection sets.",
      "recognitionSignals": [
        "Group objects by non-trivial equivalence relation",
        "Composite key hashing for multi-dimensional coordinates"
      ],
      "commonMistakes": [
        "Using array reference directly as key in Map (reference equality prevents key matches in JS)",
        "Delimiter omission leading to ambiguity (e.g. \"1\" and \"11\" vs \"11\" and \"1\")"
      ],
      "stepLogic": "1. For each item, build canonical string key (e.g. count array joined with \"#\").\n2. Group in Map: map.get(key).push(item).\n3. Return Array.from(map.values())."
    },
    "hi": {
      "title": "Custom Hashing (Composite Keys)",
      "overview": "Complex data ya character frequencies ko unique serialized string key mein badal kar group karna.",
      "whatItIs": "Anagrams ya shifted strings ko canonical string key (e.g. frequency string) se map mein group karna.",
      "whyItWorks": "Same class ke sabhi items ki serialized key identical hoti hai.",
      "whenToUse": "Group Anagrams aur Group Shifted Strings problems mein.",
      "recognitionSignals": [
        "Group items by equivalence",
        "Composite key hashing"
      ],
      "commonMistakes": [
        "Array reference ko direct key banana (JS reference match karta hai value nahi)"
      ],
      "stepLogic": "1. Har item ke liye frequency key banayein.\n2. Map mein key par array mein push karein.\n3. Array.from(map.values()) return karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "HASHING",
      "title": "Canonical Frequency Key Grouping",
      "input": [
        "eat",
        "tea",
        "tan",
        "ate",
        "nat",
        "bat"
      ],
      "description": "\"eat\", \"tea\", \"ate\" all generate key \"1#0#0...1(e)...1(t)\" -> grouped together.",
      "description_hi": "\"eat\", \"tea\", \"ate\" ki key same banti hai, isliye ek saath group hote hain.",
      "steps": [
        {
          "activeIdx": 0,
          "elements": [
            [
              "eat",
              "tea",
              "ate"
            ],
            [
              "tan",
              "nat"
            ],
            [
              "bat"
            ]
          ],
          "explanation": "Group 1: [eat, tea, ate], Group 2: [tan, nat], Group 3: [bat]",
          "explanation_hi": "Teeno groups form ho gaye"
        }
      ],
      "result": [
        [
          "eat",
          "tea",
          "ate"
        ],
        [
          "tan",
          "nat"
        ],
        [
          "bat"
        ]
      ]
    },
    "code": "function groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const count = new Array(26).fill(0);\n    for (let i = 0; i < s.length; i++) {\n      count[s.charCodeAt(i) - 97]++;\n    }\n    const key = count.join('#');\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  return Array.from(map.values());\n}\n\nconsole.log(groupAnagrams([\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]));",
    "searchSignals": {
      "tags": [
        "hashing",
        "string",
        "custom-key"
      ],
      "keywords": [
        "group anagrams",
        "custom hashing",
        "composite key"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Apple"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Group Anagrams",
        "difficulty": "Medium",
        "slug": "group-anagrams",
        "url": "https://leetcode.com/problems/group-anagrams/"
      },
      {
        "title": "Group Shifted Strings",
        "difficulty": "Medium",
        "slug": "group-shifted-strings",
        "url": "https://leetcode.com/problems/group-shifted-strings/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Group Anagrams Editorial",
        "url": "https://leetcode.com/problems/group-anagrams/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Collision Concepts": {
    "slug": "hashing-collision-concepts",
    "name": "Collision Concepts",
    "topic": "Hashing",
    "difficulty": "Medium",
    "timeComplexity": "O(1) amortized, O(N) worst",
    "spaceComplexity": "O(Capacity)",
    "interviewFrequency": "High",
    "en": {
      "title": "Hash Collision Resolution (Chaining vs Open Addressing)",
      "overview": "Designing hash tables handling index collisions via separate chaining (linked lists) or open addressing (linear probing).",
      "whatItIs": "When two keys hash to the same bucket `hash(k1) % M === hash(k2) % M`, separate chaining stores a linked list of key-value pairs at that bucket.",
      "whyItWorks": "Keeping load factor `lambda = N / M < 0.75` guarantees average bucket chain length is O(1).",
      "whenToUse": "Design HashMap, Design HashSet, understanding hash table internals and worst-case DoS attacks.",
      "recognitionSignals": [
        "Design HashMap from scratch without built-in library",
        "Collision handling mechanisms"
      ],
      "commonMistakes": [
        "Infinite loop during linear probing when table is 100% full",
        "Deleting entries in open addressing without tombstone markers"
      ],
      "stepLogic": "1. Create fixed array of buckets (e.g. size 10007 prime).\n2. put(k, v): bucket = hash(k) % size; search chain for key to update; if not found, append [k, v].\n3. get(k): search bucket chain; return value if found, else -1.\n4. remove(k): filter out key from bucket chain."
    },
    "hi": {
      "title": "Hash Collision Resolution",
      "overview": "Jab do alag keys ka hash index same ban jaye toh Separate Chaining ya Open Addressing se resolve karna.",
      "whatItIs": "Bucket array ke har index par linked list rakhna jisme colliding elements store hote hain.",
      "whyItWorks": "Load factor chhota rakhne par har chain ki length constant O(1) rehti hai.",
      "whenToUse": "Design HashMap problem mein bina kisi library ke hash table banane ke liye.",
      "recognitionSignals": [
        "Design HashMap without library",
        "Collision resolution interview questions"
      ],
      "commonMistakes": [
        "Tombstone marker na lagana jab open addressing mein element delete ho"
      ],
      "stepLogic": "1. Prime size ka bucket array banayein.\n2. put par bucket index nikaalein aur chain mein update ya append karein.\n3. get par chain search karein.\n4. remove par chain se unlink karein."
    },
    "visual": {
      "type": "ARRAY",
      "category": "HASHING",
      "title": "Separate Chaining Bucket Array",
      "input": [
        "put(1, \"A\")",
        "put(10008, \"B\") collides with index 1"
      ],
      "description": "Bucket 1 holds linked list: [1, \"A\"] -> [10008, \"B\"]. Both stored safely.",
      "description_hi": "Bucket 1 par collision resolve ho kar linked list banti hai.",
      "steps": [
        {
          "activeIdx": 1,
          "elements": [
            "[1, A] -> [10008, B]"
          ],
          "explanation": "Collision at bucket index 1 resolved via separate chaining",
          "explanation_hi": "Bucket 1 par chaining se collision resolve hui"
        }
      ],
      "result": true
    },
    "code": "class MyHashMap {\n  constructor() {\n    this.size = 10007; // Prime size\n    this.buckets = Array.from({ length: this.size }, () => []);\n  }\n  \n  _hash(key) {\n    return key % this.size;\n  }\n  \n  put(key, value) {\n    const bucket = this.buckets[this._hash(key)];\n    for (const pair of bucket) {\n      if (pair[0] === key) {\n        pair[1] = value;\n        return;\n      }\n    }\n    bucket.push([key, value]);\n  }\n  \n  get(key) {\n    const bucket = this.buckets[this._hash(key)];\n    for (const pair of bucket) {\n      if (pair[0] === key) return pair[1];\n    }\n    return -1;\n  }\n  \n  remove(key) {\n    const bucket = this.buckets[this._hash(key)];\n    const idx = bucket.findIndex(pair => pair[0] === key);\n    if (idx !== -1) bucket.splice(idx, 1);\n  }\n}",
    "searchSignals": {
      "tags": [
        "hashing",
        "design"
      ],
      "keywords": [
        "design hashmap",
        "hash collisions",
        "separate chaining"
      ],
      "companies": [
        "Microsoft",
        "Amazon",
        "Apple"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Design HashMap",
        "difficulty": "Easy",
        "slug": "design-hashmap",
        "url": "https://leetcode.com/problems/design-hashmap/"
      },
      {
        "title": "Design HashSet",
        "difficulty": "Easy",
        "slug": "design-hashset",
        "url": "https://leetcode.com/problems/design-hashset/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Design HashMap Editorial",
        "url": "https://leetcode.com/problems/design-hashmap/editorial/",
        "type": "LeetCode"
      }
    ]
  }
};
