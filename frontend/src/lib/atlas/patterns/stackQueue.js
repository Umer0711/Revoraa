export const stackQueuePatterns = {
  "Monotonic Stack": {
    "slug": "stack-monotonic-stack",
    "name": "Monotonic Stack",
    "topic": "Stack",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Monotonic Stack (Increasing / Decreasing)",
      "overview": "Maintaining a stack whose elements are strictly monotonic to find next/previous greater/smaller elements in linear O(N) time.",
      "whatItIs": "Before pushing an element, all elements violating monotonicity are popped. Each element enters and exits the stack at most once.",
      "whyItWorks": "Popping obsolete elements preserves only candidate boundary elements that can constrain subsequent queries.",
      "whenToUse": "Daily Temperatures, Next Greater Element, Trapping Rain Water, Online Stock Span.",
      "recognitionSignals": [
        "Find the nearest element greater/smaller than current element",
        "Linear scan where previous elements must be remembered until dominated"
      ],
      "commonMistakes": [
        "Storing values instead of indices in stack (storing indices allows computing distance and value lookup)",
        "Strictly greater vs greater-or-equal inequality errors"
      ],
      "stepLogic": "1. Initialize empty stack.\n2. Iterate through array: while stack not empty and arr[curr] > arr[stack.peek()], pop and resolve result for popped index.\n3. Push curr onto stack."
    },
    "hi": {
      "title": "Monotonic Stack",
      "overview": "Stack ke andar elements ko hamesha strictly increasing ya decreasing order mein rakhna taaki Next Greater/Smaller O(N) mein mil sake.",
      "whatItIs": "Naya element push karne se pehle monotonicity violate karne wale elements ko pop kar diya jata hai.",
      "whyItWorks": "Har element zyada se zyada ek baar push aur ek baar pop hota hai, isliye total time O(N) rehta hai.",
      "whenToUse": "Next Greater Element, Daily Temperatures, Trapping Rain Water mein.",
      "recognitionSignals": [
        "Next greater ya previous smaller dhoondhna ho",
        "Dominance order maintain karna ho"
      ],
      "commonMistakes": [
        "Stack mein values store karna indices ke badle",
        "Greater-than vs greater-equal mein confuse hona"
      ],
      "stepLogic": "1. Khali stack banayein.\n2. Array iterate karein: jab tak stack top naye element se chhota ho, pop karein aur answer set karein.\n3. Naye index ko stack mein push karein."
    },
    "visual": {
      "type": "STACK",
      "category": "STACK",
      "title": "Monotonic Decreasing Stack Push",
      "input": [
        73,
        74,
        75,
        71,
        69,
        72,
        76,
        73
      ],
      "description": "Elements popped when warmer day arrives: 71, 69 popped by 72.",
      "description_hi": "Chhote elements pop ho jate hain jab bada number aata hai.",
      "steps": [
        {
          "stack": [
            75,
            71,
            69
          ],
          "top": 69,
          "explanation": "Stack holds [75, 71, 69] (decreasing)",
          "explanation_hi": "Stack mein [75, 71, 69] hain"
        },
        {
          "stack": [
            75,
            72
          ],
          "top": 72,
          "explanation": "72 arrives: pops 69 (diff=1 day) and 71 (diff=2 days). Push 72.",
          "explanation_hi": "72 aya: 69 aur 71 pop hue, 72 push hua."
        }
      ],
      "result": [
        1,
        1,
        4,
        2,
        1,
        1,
        0,
        0
      ]
    },
    "code": "function dailyTemperatures(temperatures) {\n  const n = temperatures.length;\n  const res = new Array(n).fill(0);\n  const stack = []; // Stores indices\n  \n  for (let i = 0; i < n; i++) {\n    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prevIdx = stack.pop();\n      res[prevIdx] = i - prevIdx;\n    }\n    stack.push(i);\n  }\n  return res;\n}\n\nconsole.log(dailyTemperatures([73,74,75,71,69,72,76,73]));",
    "searchSignals": {
      "tags": [
        "stack",
        "monotonic-stack"
      ],
      "keywords": [
        "monotonic stack",
        "daily temperatures",
        "next greater element"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Bloomberg",
        "Meta"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Daily Temperatures",
        "difficulty": "Medium",
        "slug": "daily-temperatures",
        "url": "https://leetcode.com/problems/daily-temperatures/"
      },
      {
        "title": "Next Greater Element I",
        "difficulty": "Easy",
        "slug": "next-greater-element-i",
        "url": "https://leetcode.com/problems/next-greater-element-i/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Monotonic Stack Guide",
        "url": "https://leetcode.com/problems/daily-temperatures/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Expression Evaluation": {
    "slug": "stack-expression-evaluation",
    "name": "Expression Evaluation",
    "topic": "Stack",
    "difficulty": "Hard",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Arithmetic Expression Evaluation (Shunting-Yard & Stack)",
      "overview": "Parsing and calculating mathematical expressions containing operands, operators, parentheses, and operator precedence.",
      "whatItIs": "Using operator and operand stacks to resolve high-precedence operations (*, /) before low-precedence operations (+, -).",
      "whyItWorks": "Parentheses and operator precedence create nested sub-problems naturally handled by LIFO order.",
      "whenToUse": "Basic Calculator I, II, III, Evaluate Reverse Polish Notation.",
      "recognitionSignals": [
        "Evaluate math expression with parentheses",
        "Support +, -, *, / with precedence"
      ],
      "commonMistakes": [
        "Unary minus handling (e.g., \"-1 + 2\" or \"1 - (-2)\")",
        "Multi-digit number parsing errors"
      ],
      "stepLogic": "1. Parse tokens sequentially.\n2. When seeing digit, accumulate multi-digit number.\n3. When seeing operator, apply precedence rules, popping stack and evaluating.\n4. Parentheses trigger push of current state."
    },
    "hi": {
      "title": "Expression Evaluation",
      "overview": "Operators, operands aur parentheses wali math expression ko stack ki madad se evaluate karna.",
      "whatItIs": "Precedence (* / pehle, + - baad mein) follow karte hue stack se sub-expressions calculate karna.",
      "whyItWorks": "Stack LIFO structure innermost parentheses aur higher precedence ko pehle execute karta hai.",
      "whenToUse": "Basic Calculator problems mein.",
      "recognitionSignals": [
        "String expression calculate karna",
        "Parentheses and precedence handle karna"
      ],
      "commonMistakes": [
        "Unary minus (-2) handle na karna",
        "Multi-digit numbers ko single char samajhna"
      ],
      "stepLogic": "1. String tokens parse karein.\n2. Precedence ke hisab se stack operate karein.\n3. Parentheses close par sub-result nikaal kar stack par wapas push karein."
    },
    "visual": {
      "type": "STACK",
      "category": "STACK",
      "title": "Expression Evaluation Stack",
      "input": "3 + 2 * 2",
      "description": "* has higher precedence than +: compute 2*2 = 4 first, then 3 + 4 = 7.",
      "description_hi": "2 * 2 = 4 pehle calculate hota hai, fir 3 + 4 = 7.",
      "steps": [
        {
          "stack": [
            3
          ],
          "top": 3,
          "explanation": "Push 3",
          "explanation_hi": "3 push hua"
        },
        {
          "stack": [
            3,
            4
          ],
          "top": 4,
          "explanation": "Operator * evaluated with 2: push 4",
          "explanation_hi": "2*2=4 evaluate hua"
        },
        {
          "stack": [
            7
          ],
          "top": 7,
          "explanation": "Sum stack: 3 + 4 = 7",
          "explanation_hi": "Total sum = 7"
        }
      ],
      "result": 7
    },
    "code": "function calculate(s) {\n  let stack = [];\n  let num = 0, sign = '+';\n  s = s.replace(/\\s+/g, '');\n  \n  for (let i = 0; i < s.length; i++) {\n    const ch = s[i];\n    if (/\\d/.test(ch)) num = num * 10 + Number(ch);\n    if (!/\\d/.test(ch) || i === s.length - 1) {\n      if (sign === '+') stack.push(num);\n      else if (sign === '-') stack.push(-num);\n      else if (sign === '*') stack.push(stack.pop() * num);\n      else if (sign === '/') stack.push(Math.trunc(stack.pop() / num));\n      sign = ch;\n      num = 0;\n    }\n  }\n  return stack.reduce((a, b) => a + b, 0);\n}\n\nconsole.log(calculate(\"3+2*2\")); // 7",
    "searchSignals": {
      "tags": [
        "stack",
        "math",
        "parsing"
      ],
      "keywords": [
        "basic calculator",
        "expression evaluation",
        "evaluate rpn"
      ],
      "companies": [
        "Google",
        "Microsoft",
        "Amazon"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Basic Calculator II",
        "difficulty": "Medium",
        "slug": "basic-calculator-ii",
        "url": "https://leetcode.com/problems/basic-calculator-ii/"
      },
      {
        "title": "Evaluate Reverse Polish Notation",
        "difficulty": "Medium",
        "slug": "evaluate-reverse-polish-notation",
        "url": "https://leetcode.com/problems/evaluate-reverse-polish-notation/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Basic Calculator II Editorial",
        "url": "https://leetcode.com/problems/basic-calculator-ii/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Parentheses Validation": {
    "slug": "stack-parentheses-validation",
    "name": "Parentheses Validation",
    "topic": "Stack",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Valid Parentheses Matching",
      "overview": "Verifying that opening brackets have corresponding matching closing brackets in correct nesting order.",
      "whatItIs": "Push open brackets `(`, `{`, `[` onto stack. For closing brackets, pop top and verify type match.",
      "whyItWorks": "The most recently opened bracket must be the first one to be closed (LIFO nesting).",
      "whenToUse": "Valid Parentheses, Minimum Add to Make Parentheses Valid, Generate Parentheses validation.",
      "recognitionSignals": [
        "Input consists of bracket characters",
        "Validate syntax nesting order",
        "Find longest valid parentheses substring"
      ],
      "commonMistakes": [
        "Popping from empty stack when closing bracket occurs first",
        "Failing to check that stack is completely empty at the end"
      ],
      "stepLogic": "1. Create empty stack.\n2. Iterate through characters: if opening bracket, push matching closing bracket.\n3. If closing bracket, pop stack; if popped !== curr, return false.\n4. Return stack.length === 0."
    },
    "hi": {
      "title": "Valid Parentheses Matching",
      "overview": "Check karna ki har opening bracket theek order mein close ho raha hai.",
      "whatItIs": "Opening bracket ko stack mein push karna aur closing bracket aane par top se match karna.",
      "whyItWorks": "Bracket nesting LIFO rule follow karti hai: jo sabse aakhiri mein open hua, wahi pehle close hona chahiye.",
      "whenToUse": "Valid Parentheses check karne ke liye.",
      "recognitionSignals": [
        "Brackets matching",
        "Syntax validation"
      ],
      "commonMistakes": [
        "Empty stack par pop karna",
        "Loop khatam hone par stack empty check na karna"
      ],
      "stepLogic": "1. Khali stack banayein.\n2. Opening bracket par uska partner push karein.\n3. Closing par pop karke match karein.\n4. End mein stack empty hona chahiye."
    },
    "visual": {
      "type": "STACK",
      "category": "STACK",
      "title": "Bracket Match Stack Verification",
      "input": "()[]{}",
      "description": "Every opening bracket pushes expected closer. Pop and verify match.",
      "description_hi": "Har bracket match ho kar pop hota hai. Stack empty rehta hai.",
      "steps": [
        {
          "stack": [
            ")"
          ],
          "top": ")",
          "explanation": "Read \"(\": push \")\"",
          "explanation_hi": "\"(\" aya -> \")\" push hua"
        },
        {
          "stack": [],
          "top": null,
          "explanation": "Read \")\": matches popped \")\" -> stack empty!",
          "explanation_hi": "\")\" match hua -> stack empty"
        },
        {
          "stack": [
            "]"
          ],
          "top": "]",
          "explanation": "Read \"[\": push \"]\"",
          "explanation_hi": "\"[\" aya -> \"]\" push hua"
        },
        {
          "stack": [],
          "top": null,
          "explanation": "All pairs matched. Stack empty -> Valid!",
          "explanation_hi": "Saare brackets match hue -> Valid!"
        }
      ],
      "result": true
    },
    "code": "function isValid(s) {\n  const stack = [];\n  const map = { '(': ')', '{': '}', '[': ']' };\n  \n  for (const ch of s) {\n    if (map[ch]) {\n      stack.push(map[ch]);\n    } else {\n      if (stack.pop() !== ch) return false;\n    }\n  }\n  return stack.length === 0;\n}\n\nconsole.log(isValid(\"()[]{}\")); // true",
    "searchSignals": {
      "tags": [
        "stack",
        "string"
      ],
      "keywords": [
        "valid parentheses",
        "parentheses matching",
        "balanced brackets"
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
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "slug": "valid-parentheses",
        "url": "https://leetcode.com/problems/valid-parentheses/"
      },
      {
        "title": "Minimum Add to Make Parentheses Valid",
        "difficulty": "Medium",
        "slug": "minimum-add-to-make-parentheses-valid",
        "url": "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Valid Parentheses Editorial",
        "url": "https://leetcode.com/problems/valid-parentheses/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Next Greater Element": {
    "slug": "stack-next-greater-element",
    "name": "Next Greater Element",
    "topic": "Stack",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Next Greater Element (Monotonic Decreasing Stack)",
      "overview": "Finding the first element to the right that is strictly greater than the current element.",
      "whatItIs": "Elements waiting for a greater value remain in a monotonic decreasing stack. When a greater value is visited, waiting elements are popped and resolved.",
      "whyItWorks": "Linear one-pass resolution because smaller intermediate values cannot be the next greater element for any future number once a larger number arrives.",
      "whenToUse": "Next Greater Element I & II (circular array), Daily Temperatures, Stock Span.",
      "recognitionSignals": [
        "Next greater element to right",
        "Circular array next greater (run loop 2*N times)"
      ],
      "commonMistakes": [
        "Handling circular arrays without index modulo (% n)",
        "Default value -1 for elements that have no next greater"
      ],
      "stepLogic": "1. res array filled with -1, empty stack.\n2. For i from 0 to 2*n - 1:\n3. While stack not empty and nums[i % n] > nums[stack.peek()], res[stack.pop()] = nums[i % n].\n4. If i < n, push i to stack."
    },
    "hi": {
      "title": "Next Greater Element",
      "overview": "Right side mein pehla bada element linear time O(N) mein find karna.",
      "whatItIs": "Stack mein decreasing order mein elements rakh kar jab bada number mile tab pop karna.",
      "whyItWorks": "Ek baar bada number mil jane par beech ke chhote numbers future queries ke kaam nahi aate.",
      "whenToUse": "Next Greater Element I & II mein.",
      "recognitionSignals": [
        "Right side pehla greater number chahiye",
        "Circular array search"
      ],
      "commonMistakes": [
        "Circular array mein modulo `% n` use na karna"
      ],
      "stepLogic": "1. res array mein -1 bharo.\n2. Loop 2*n tak chalayein circular array ke liye.\n3. Bada number milte hi pop karke result set karein."
    },
    "visual": {
      "type": "STACK",
      "category": "STACK",
      "title": "Next Greater Element Resolution",
      "input": [
        2,
        1,
        2,
        4,
        3
      ],
      "description": "4 is next greater for 2, 1, and 2. Res: [4, 2, 4, -1, -1]",
      "description_hi": "4 pehle teen elements ka next greater ban kar pop karta hai.",
      "steps": [
        {
          "stack": [
            0,
            1
          ],
          "top": 1,
          "explanation": "Stack holds indices of [2, 1]",
          "explanation_hi": "Stack mein 2 aur 1 ke index hain"
        },
        {
          "stack": [
            0,
            2
          ],
          "top": 2,
          "explanation": "Index 2 (val 2) pops index 1 (val 1) -> NGE(1) = 2",
          "explanation_hi": "1 ka next greater 2 ban gaya"
        },
        {
          "stack": [
            3
          ],
          "top": 3,
          "explanation": "Index 3 (val 4) pops 2 and 0 -> NGE = 4",
          "explanation_hi": "4 sabhi ko pop karke unka NGE ban gaya"
        }
      ],
      "result": [
        4,
        2,
        4,
        -1,
        -1
      ]
    },
    "code": "function nextGreaterElements(nums) {\n  const n = nums.length;\n  const res = new Array(n).fill(-1);\n  const stack = [];\n  \n  for (let i = 0; i < 2 * n; i++) {\n    const idx = i % n;\n    while (stack.length && nums[idx] > nums[stack[stack.length - 1]]) {\n      res[stack.pop()] = nums[idx];\n    }\n    if (i < n) stack.push(idx);\n  }\n  return res;\n}\n\nconsole.log(nextGreaterElements([1, 2, 1])); // [2, -1, 2]",
    "searchSignals": {
      "tags": [
        "stack",
        "monotonic-stack"
      ],
      "keywords": [
        "next greater element",
        "nge",
        "circular array nge"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Next Greater Element I",
        "difficulty": "Easy",
        "slug": "next-greater-element-i",
        "url": "https://leetcode.com/problems/next-greater-element-i/"
      },
      {
        "title": "Next Greater Element II",
        "difficulty": "Medium",
        "slug": "next-greater-element-ii",
        "url": "https://leetcode.com/problems/next-greater-element-ii/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode NGE II Editorial",
        "url": "https://leetcode.com/problems/next-greater-element-ii/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Previous Greater Element": {
    "slug": "stack-previous-greater-element",
    "name": "Previous Greater Element",
    "topic": "Stack",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Previous Greater Element / Online Stock Span",
      "overview": "Locating the closest preceding element to the left that exceeds current element in O(1) amortized time.",
      "whatItIs": "Monotonic decreasing stack evaluated from left-to-right, popping all smaller preceding elements.",
      "whyItWorks": "Any smaller previous element is shadowed by the current element and can never be the previous greater element for future queries.",
      "whenToUse": "Online Stock Span, Subarray Minimums / Maximums, Asteroid Collision.",
      "recognitionSignals": [
        "Consecutive preceding days with price <= today",
        "Left boundary constraint for histograms"
      ],
      "commonMistakes": [
        "Resetting span counts instead of aggregating weights of popped elements"
      ],
      "stepLogic": "1. Maintain stack of [price, span].\n2. For each incoming price, span = 1.\n3. While stack not empty and stack.top.price <= price: span += stack.pop().span.\n4. Push [price, span] and return span."
    },
    "hi": {
      "title": "Previous Greater Element / Stock Span",
      "overview": "Left side mein pehla bada element find karna ya consecutive chhote dino ka span nikalna.",
      "whatItIs": "Current price se chhote sabhi previous prices ko pop karke span accumulate karna.",
      "whyItWorks": "Chhote elements future ke liye current element ke peeche chhip jaate hain.",
      "whenToUse": "Online Stock Span problem mein.",
      "recognitionSignals": [
        "Online stock span",
        "Left greater element"
      ],
      "commonMistakes": [
        "Popped elements ka span sum karna bhool jana"
      ],
      "stepLogic": "1. Stack mein [price, span] rakhein.\n2. Nayi price aane par span = 1 se shuru karein.\n3. Stack top <= price hone par span add karke pop karein."
    },
    "visual": {
      "type": "STACK",
      "category": "STACK",
      "title": "Stock Span Accumulation",
      "input": [
        100,
        80,
        60,
        70,
        60,
        75,
        85
      ],
      "description": "Price 75 pops 60 and 70 -> Span = 1 + 1 + 2 = 4.",
      "description_hi": "75 pichle teen dino (60, 70, 60) ko absorb karke span 4 banata hai.",
      "steps": [
        {
          "stack": [
            [
              100,
              1
            ],
            [
              80,
              1
            ],
            [
              70,
              2
            ],
            [
              60,
              1
            ]
          ],
          "top": [
            60,
            1
          ],
          "explanation": "Stack before 75",
          "explanation_hi": "75 se pehle ka stack"
        },
        {
          "stack": [
            [
              100,
              1
            ],
            [
              80,
              1
            ],
            [
              75,
              4
            ]
          ],
          "top": [
            75,
            4
          ],
          "explanation": "75 pops 60 and 70 -> total span = 4",
          "explanation_hi": "75 ne 60 aur 70 ko absorb kiya -> span 4"
        }
      ],
      "result": [
        1,
        1,
        1,
        2,
        1,
        4,
        6
      ]
    },
    "code": "class StockSpanner {\n  constructor() {\n    this.stack = []; // [price, span]\n  }\n  \n  next(price) {\n    let span = 1;\n    while (this.stack.length && this.stack[this.stack.length - 1][0] <= price) {\n      span += this.stack.pop()[1];\n    }\n    this.stack.push([price, span]);\n    return span;\n  }\n}",
    "searchSignals": {
      "tags": [
        "stack",
        "design",
        "monotonic-stack"
      ],
      "keywords": [
        "stock span",
        "previous greater element",
        "online stock span"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Online Stock Span",
        "difficulty": "Medium",
        "slug": "online-stock-span",
        "url": "https://leetcode.com/problems/online-stock-span/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Online Stock Span Editorial",
        "url": "https://leetcode.com/problems/online-stock-span/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Largest Rectangle": {
    "slug": "stack-largest-rectangle",
    "name": "Largest Rectangle",
    "topic": "Stack",
    "difficulty": "Hard",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Largest Rectangle in Histogram",
      "overview": "Calculating the maximum area rectangle within a histogram in O(N) using an increasing monotonic stack.",
      "whatItIs": "When height decreases, the current bar acts as the right boundary for popped bars. The preceding stack element acts as the left boundary.",
      "whyItWorks": "Every bar is the limiting minimum height for a maximal contiguous rectangle spanning from its left smaller to right smaller boundary: `area = height * (right - left - 1)`.",
      "whenToUse": "Largest Rectangle in Histogram, Maximal Rectangle in 2D binary matrix.",
      "recognitionSignals": [
        "Maximum rectangular area in histogram bars",
        "Find largest rectangle of 1s in a grid"
      ],
      "commonMistakes": [
        "Not appending a zero-height sentinel bar at the end to flush all remaining stack bars",
        "Width formula off-by-one: `stack.length ? i - stack[stack.length - 1] - 1 : i`"
      ],
      "stepLogic": "1. Push indices onto increasing stack.\n2. Append a sentinel 0 at the end of heights.\n3. When heights[i] < heights[stack.peek()]: pop h = heights[pop()], width = stack.isEmpty ? i : i - stack.peek() - 1, maxArea = max(maxArea, h * width).\n4. Push i to stack."
    },
    "hi": {
      "title": "Largest Rectangle in Histogram",
      "overview": "Histogram bars ke andar sabse bada rectangle area O(N) linear time mein nikalna.",
      "whatItIs": "Har bar ko minimum height maan kar uska left aur right boundary index stack se O(1) amortized mein nikalna.",
      "whyItWorks": "Popped bar ki height fix rehti hai aur width uske pichle smaller aur agle smaller ke beech hoti hai: `h * (right - left - 1)`.",
      "whenToUse": "Largest Rectangle in Histogram, Maximal Rectangle 2D grid mein.",
      "recognitionSignals": [
        "Histogram max area",
        "2D binary matrix largest rectangle"
      ],
      "commonMistakes": [
        "Aakhiri mein height 0 sentinel na lagana jisse stack ke bache hue bars calculate nahi hote"
      ],
      "stepLogic": "1. Increasing stack banayein.\n2. Aakhiri mein 0 height ka dummy bar jodein.\n3. Chhota bar aane par pop karein, width calculate karein aur maxArea update karein."
    },
    "visual": {
      "type": "STACK",
      "category": "STACK",
      "title": "Histogram Bar Area Computation",
      "input": [
        2,
        1,
        5,
        6,
        2,
        3
      ],
      "description": "Bars 5 and 6 form rectangle of height 5 and width 2 -> Area = 10.",
      "description_hi": "Height 5 aur width 2 ka rectangle banta hai -> Area = 10.",
      "steps": [
        {
          "stack": [
            1,
            2,
            3
          ],
          "top": 3,
          "explanation": "Stack holds indices for heights [1, 5, 6]",
          "explanation_hi": "Stack mein 1, 5, 6 ke index hain"
        },
        {
          "stack": [
            1,
            4
          ],
          "top": 4,
          "explanation": "Bar with height 2 arrives: pops 6 (area=6), pops 5 (area = 5 * 2 = 10!). MaxArea = 10.",
          "explanation_hi": "Height 2 aayi: 6 pop hua (area 6), 5 pop hua (area 10). Max = 10."
        }
      ],
      "result": 10
    },
    "code": "function largestRectangleArea(heights) {\n  const stack = [];\n  let maxArea = 0;\n  const h = [...heights, 0]; // Sentinel 0\n  \n  for (let i = 0; i < h.length; i++) {\n    while (stack.length && h[i] < h[stack[stack.length - 1]]) {\n      const height = h[stack.pop()];\n      const width = stack.length ? i - stack[stack.length - 1] - 1 : i;\n      maxArea = Math.max(maxArea, height * width);\n    }\n    stack.push(i);\n  }\n  return maxArea;\n}\n\nconsole.log(largestRectangleArea([2,1,5,6,2,3])); // 10",
    "searchSignals": {
      "tags": [
        "stack",
        "monotonic-stack"
      ],
      "keywords": [
        "largest rectangle",
        "histogram area",
        "maximal rectangle"
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
        "title": "Largest Rectangle in Histogram",
        "difficulty": "Hard",
        "slug": "largest-rectangle-in-histogram",
        "url": "https://leetcode.com/problems/largest-rectangle-in-histogram/"
      },
      {
        "title": "Maximal Rectangle",
        "difficulty": "Hard",
        "slug": "maximal-rectangle",
        "url": "https://leetcode.com/problems/maximal-rectangle/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Largest Rectangle Editorial",
        "url": "https://leetcode.com/problems/largest-rectangle-in-histogram/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Histogram Problems": {
    "slug": "stack-histogram-problems",
    "name": "Histogram Problems",
    "topic": "Stack",
    "difficulty": "Hard",
    "timeComplexity": "O(R * C)",
    "spaceComplexity": "O(C)",
    "interviewFrequency": "High",
    "en": {
      "title": "2D Histogram Projection (Maximal Rectangle)",
      "overview": "Converting a 2D binary matrix into consecutive 1D histogram rows and solving each in O(C) using monotonic stack.",
      "whatItIs": "Each row accumulates heights of consecutive 1s from above: if cell is \"1\", `h[j]++`; if \"0\", `h[j] = 0`.",
      "whyItWorks": "Reduces an exponential 2D sub-matrix search to R independent 1D histogram sub-problems.",
      "whenToUse": "Maximal Rectangle of 1s in a grid, maximal square, count submatrices with all ones.",
      "recognitionSignals": [
        "Find maximum area of 1s in 2D binary grid",
        "Repeated histogram calculation across matrix rows"
      ],
      "commonMistakes": [
        "Not resetting column height to 0 when encountering a \"0\" in the grid"
      ],
      "stepLogic": "1. Create heights array of size Cols initialized to 0.\n2. For each row: update heights (if cell==\"1\" h[j]++ else h[j]=0).\n3. Run largestRectangleArea on current row heights.\n4. Track global maximum area."
    },
    "hi": {
      "title": "2D Histogram Projection",
      "overview": "2D matrix ko har row par 1D histogram mein badal kar monotonic stack se solve karna.",
      "whatItIs": "Har row mein \"1\" aane par height badhti hai aur \"0\" aane par 0 ho jati hai.",
      "whyItWorks": "2D problem ko R number of 1D histogram problems mein convert kar deta hai.",
      "whenToUse": "Maximal Rectangle in 2D binary matrix mein.",
      "recognitionSignals": [
        "2D binary grid mein largest rectangle",
        "Consecutive ones rectangular area"
      ],
      "commonMistakes": [
        "Cell 0 hone par height ko 0 reset karna bhool jana"
      ],
      "stepLogic": "1. Cols size ka heights array banayein.\n2. Har row par heights update karein (\"1\" par h++, \"0\" par h=0).\n3. 1D histogram largest rectangle algorithm se max area nikaalein."
    },
    "visual": {
      "type": "DP_TABLE",
      "category": "STACK",
      "title": "Matrix to Histogram Conversion",
      "input": [
        [
          "1",
          "0",
          "1",
          "0",
          "0"
        ],
        [
          "1",
          "0",
          "1",
          "1",
          "1"
        ],
        [
          "1",
          "1",
          "1",
          "1",
          "1"
        ]
      ],
      "description": "Row 2 converts to histogram heights: [3, 1, 3, 2, 2] -> Max area = 6.",
      "description_hi": "Row 2 histogram banati hai [3, 1, 3, 2, 2] jisse max rectangle 6 milta hai.",
      "steps": [
        {
          "row": 0,
          "col": 0,
          "cellVal": "h=[1, 0, 1, 0, 0]",
          "explanation": "Row 0 heights: [1, 0, 1, 0, 0] -> Max = 1",
          "explanation_hi": "Row 0 max area = 1"
        },
        {
          "row": 2,
          "col": 0,
          "cellVal": "h=[3, 1, 3, 2, 2]",
          "explanation": "Row 2 heights: [3, 1, 3, 2, 2] -> Max area = 6",
          "explanation_hi": "Row 2 max area = 6"
        }
      ],
      "result": 6
    },
    "code": "function maximalRectangle(matrix) {\n  if (!matrix.length || !matrix[0].length) return 0;\n  const cols = matrix[0].length;\n  const heights = new Array(cols).fill(0);\n  let maxArea = 0;\n  \n  function getHistogramArea(h) {\n    const stack = [];\n    let maxA = 0;\n    const arr = [...h, 0];\n    for (let i = 0; i < arr.length; i++) {\n      while (stack.length && arr[i] < arr[stack[stack.length - 1]]) {\n        const height = arr[stack.pop()];\n        const width = stack.length ? i - stack[stack.length - 1] - 1 : i;\n        maxA = Math.max(maxA, height * width);\n      }\n      stack.push(i);\n    }\n    return maxA;\n  }\n  \n  for (const row of matrix) {\n    for (let j = 0; j < cols; j++) {\n      heights[j] = row[j] === '1' ? heights[j] + 1 : 0;\n    }\n    maxArea = Math.max(maxArea, getHistogramArea(heights));\n  }\n  return maxArea;\n}",
    "searchSignals": {
      "tags": [
        "stack",
        "matrix",
        "monotonic-stack"
      ],
      "keywords": [
        "maximal rectangle",
        "histogram matrix",
        "largest 1s rectangle"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Maximal Rectangle",
        "difficulty": "Hard",
        "slug": "maximal-rectangle",
        "url": "https://leetcode.com/problems/maximal-rectangle/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Maximal Rectangle Editorial",
        "url": "https://leetcode.com/problems/maximal-rectangle/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Min Stack": {
    "slug": "stack-min-stack",
    "name": "Min Stack",
    "topic": "Stack",
    "difficulty": "Medium",
    "timeComplexity": "O(1) all operations",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Min Stack with Constant Time Retrieval",
      "overview": "Designing a stack that supports push, pop, top, and retrieving the minimum element in O(1) time.",
      "whatItIs": "Pairing each element with the current running minimum at that state, or maintaining a parallel auxiliary min stack.",
      "whyItWorks": "Because elements are pushed and popped in LIFO order, the minimum of the remaining elements cannot change until the minimum element itself is popped.",
      "whenToUse": "Min Stack, Max Stack, Slidng Window Minimum with dual stacks.",
      "recognitionSignals": [
        "Retrieve minimum element in O(1) time from stack",
        "Stack design interview questions"
      ],
      "commonMistakes": [
        "Only tracking a single scalar min variable (when that min is popped, previous min is lost)"
      ],
      "stepLogic": "1. Maintain primary stack and minStack.\n2. push(x): push x to primary stack; push min(x, minStack.top) to minStack.\n3. pop(): pop from both stacks.\n4. getMin(): return minStack.top."
    },
    "hi": {
      "title": "Min Stack O(1) Retrieval",
      "overview": "Ek aisi stack design karna jisme minimum element O(1) time mein mil sake.",
      "whatItIs": "Har value ke sath us waqt ka minimum store karna ya parallel minStack maintain karna.",
      "whyItWorks": "LIFO order ki wajah se jab tak minimum element pop nahi hota tab tak purana minimum safe rehta hai.",
      "whenToUse": "Min Stack design problem mein.",
      "recognitionSignals": [
        "O(1) getMin operation",
        "Stack design question"
      ],
      "commonMistakes": [
        "Sirf ek variable mein min rakhna (pop hone par purana min kho jata hai)"
      ],
      "stepLogic": "1. Do stacks rakhein: main stack aur minStack.\n2. Push par min update karke minStack mein daalein.\n3. Pop par dono se nikalein.\n4. getMin par minStack ka top return karein."
    },
    "visual": {
      "type": "STACK",
      "category": "STACK",
      "title": "Parallel Min Stack Tracking",
      "input": [
        "push(-2)",
        "push(0)",
        "push(-3)",
        "getMin() -> -3",
        "pop()",
        "getMin() -> -2"
      ],
      "description": "Main: [-2, 0, -3]. MinStack: [-2, -2, -3]. When -3 is popped, min reverts to -2 in O(1).",
      "description_hi": "Main stack aur Min stack parallel chalte hain. -3 pop hone par min wapas -2 ho jata hai.",
      "steps": [
        {
          "stack": [
            -2,
            0,
            -3
          ],
          "top": -3,
          "explanation": "Current stack min is -3",
          "explanation_hi": "Current min = -3"
        },
        {
          "stack": [
            -2,
            0
          ],
          "top": 0,
          "explanation": "Pop -3: Current stack min reverts to -2 in O(1)",
          "explanation_hi": "-3 pop hua -> min wapas -2 ho gaya"
        }
      ],
      "result": -2
    },
    "code": "class MinStack {\n  constructor() {\n    this.stack = [];\n    this.minStack = [];\n  }\n  \n  push(val) {\n    this.stack.push(val);\n    const currMin = this.minStack.length === 0 \n      ? val \n      : Math.min(val, this.minStack[this.minStack.length - 1]);\n    this.minStack.push(currMin);\n  }\n  \n  pop() {\n    this.stack.pop();\n    this.minStack.pop();\n  }\n  \n  top() {\n    return this.stack[this.stack.length - 1];\n  }\n  \n  getMin() {\n    return this.minStack[this.minStack.length - 1];\n  }\n}",
    "searchSignals": {
      "tags": [
        "stack",
        "design"
      ],
      "keywords": [
        "min stack",
        "getmin in o(1)",
        "constant time min"
      ],
      "companies": [
        "Amazon",
        "Bloomberg",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Min Stack",
        "difficulty": "Medium",
        "slug": "min-stack",
        "url": "https://leetcode.com/problems/min-stack/"
      },
      {
        "title": "Max Stack",
        "difficulty": "Hard",
        "slug": "max-stack",
        "url": "https://leetcode.com/problems/max-stack/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Min Stack Editorial",
        "url": "https://leetcode.com/problems/min-stack/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Infix/Postfix/Prefix": {
    "slug": "stack-infix-postfix-prefix",
    "name": "Infix/Postfix/Prefix",
    "topic": "Stack",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "High",
    "en": {
      "title": "Infix to Postfix Conversion & RPN Evaluation",
      "overview": "Converting human-readable infix notations (A + B) to parenthesis-free postfix (A B +) and evaluating in O(N).",
      "whatItIs": "Dijkstra's Shunting-Yard algorithm using an operator stack to output postfix tokens in correct evaluation sequence.",
      "whyItWorks": "Postfix notation eliminates parentheses and precedence ambiguity; numbers are operands, operators immediately consume top two stack items.",
      "whenToUse": "Evaluate Reverse Polish Notation, compiler parser design, converting arithmetic expressions.",
      "recognitionSignals": [
        "Reverse Polish Notation (RPN)",
        "Infix to Postfix conversion",
        "Evaluate postfix tokens"
      ],
      "commonMistakes": [
        "Division truncation towards zero in JavaScript (`Math.trunc(a / b)`) vs `Math.floor`",
        "Order of operands when popping: `b = pop(), a = pop(), result = a - b`"
      ],
      "stepLogic": "1. For token in tokens:\n2. If operand, push number to stack.\n3. If operator, pop b then pop a; calculate a [op] b; push result back.\n4. Return final stack item."
    },
    "hi": {
      "title": "Infix to Postfix & RPN Evaluation",
      "overview": "Infix expressions ko Postfix (Reverse Polish Notation) mein badalna aur stack se evaluate karna.",
      "whatItIs": "Postfix notation mein parentheses ki zaroorat nahi padti; operators aate hi top 2 numbers par apply hote hain.",
      "whyItWorks": "Pehle do operands stack se nikalte hain aur operation ka result wapas push hota hai.",
      "whenToUse": "Evaluate Reverse Polish Notation problem mein.",
      "recognitionSignals": [
        "RPN notation",
        "Postfix evaluation"
      ],
      "commonMistakes": [
        "Division mein truncation towards zero (`Math.trunc`) na use karna",
        "Operands ka order ulta kar dena (a - b ke badle b - a)"
      ],
      "stepLogic": "1. Har token ko check karein.\n2. Number ho toh stack mein push karein.\n3. Operator ho toh b = pop(), a = pop() karke a op b calculate karein aur push karein."
    },
    "visual": {
      "type": "STACK",
      "category": "STACK",
      "title": "RPN Postfix Evaluation",
      "input": [
        "2",
        "1",
        "+",
        "3",
        "*"
      ],
      "description": "(2 + 1) * 3 = 9. First 2+1=3, then 3*3=9.",
      "description_hi": "Pehle 2 aur 1 jod kar 3 bante hain, fir 3 * 3 = 9 banta hai.",
      "steps": [
        {
          "stack": [
            2,
            1
          ],
          "top": 1,
          "explanation": "Push 2, push 1",
          "explanation_hi": "2 aur 1 push hue"
        },
        {
          "stack": [
            3
          ],
          "top": 3,
          "explanation": "Operator \"+\": 2 + 1 = 3",
          "explanation_hi": "\"+\" aya: 2 + 1 = 3"
        },
        {
          "stack": [
            3,
            3
          ],
          "top": 3,
          "explanation": "Push 3",
          "explanation_hi": "3 push hua"
        },
        {
          "stack": [
            9
          ],
          "top": 9,
          "explanation": "Operator \"*\": 3 * 3 = 9. Result = 9!",
          "explanation_hi": "\"*\" aya: 3 * 3 = 9. Final result 9!"
        }
      ],
      "result": 9
    },
    "code": "function evalRPN(tokens) {\n  const stack = [];\n  for (const token of tokens) {\n    if (token === '+') stack.push(stack.pop() + stack.pop());\n    else if (token === '-') {\n      const b = stack.pop(), a = stack.pop();\n      stack.push(a - b);\n    } else if (token === '*') stack.push(stack.pop() * stack.pop());\n    else if (token === '/') {\n      const b = stack.pop(), a = stack.pop();\n      stack.push(Math.trunc(a / b));\n    } else {\n      stack.push(Number(token));\n    }\n  }\n  return stack[0];\n}\n\nconsole.log(evalRPN([\"2\",\"1\",\"+\",\"3\",\"*\"])); // 9",
    "searchSignals": {
      "tags": [
        "stack",
        "math",
        "rpn"
      ],
      "keywords": [
        "reverse polish notation",
        "eval rpn",
        "infix postfix"
      ],
      "companies": [
        "Amazon",
        "Google",
        "LinkedIn"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Evaluate Reverse Polish Notation",
        "difficulty": "Medium",
        "slug": "evaluate-reverse-polish-notation",
        "url": "https://leetcode.com/problems/evaluate-reverse-polish-notation/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode RPN Editorial",
        "url": "https://leetcode.com/problems/evaluate-reverse-polish-notation/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "BFS Queue": {
    "slug": "queue-deque-bfs-queue",
    "name": "BFS Queue",
    "topic": "Queue & Deque",
    "difficulty": "Medium",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Breadth-First Search (FIFO Queue)",
      "overview": "Level-by-level traversal of graphs, grids, or trees using a FIFO Queue to find shortest unweighted paths.",
      "whatItIs": "Nodes are visited in non-decreasing order of their distance from the source. The queue guarantees that closer nodes are expanded before farther nodes.",
      "whyItWorks": "First-In-First-Out ordering naturally partitions traversal by layer (distance 0, distance 1, distance 2, ...).",
      "whenToUse": "Shortest path in unweighted maze/grid, level-order tree traversal, minimum knight moves, word ladder.",
      "recognitionSignals": [
        "Find shortest path in unweighted graph or grid",
        "Level-order traversal",
        "Fewest transformations between words"
      ],
      "commonMistakes": [
        "Marking nodes visited when dequeuing instead of when enqueuing (causes exponential duplicate enqueues)",
        "Using JS array `shift()` on large N without a proper circular queue or index pointer (O(N^2) overhead)"
      ],
      "stepLogic": "1. Enqueue start node and mark visited.\n2. While queue not empty:\n   a. Level size = queue.length.\n   b. For i = 0 to level size: dequeue curr, explore neighbors.\n   c. If neighbor unvisited: mark visited and enqueue.\n3. Increment step counter after level finishes."
    },
    "hi": {
      "title": "BFS Queue (Level Order)",
      "overview": "FIFO Queue ka use karke graph, grid ya tree ko level-by-level traverse karna aur unweighted shortest path nikalna.",
      "whatItIs": "Har node ko distance ke ascending order mein visit karta hai.",
      "whyItWorks": "FIFO order ensure karta hai ki distance d wale sabhi nodes distance d+1 se pehle process hon.",
      "whenToUse": "Unweighted grid mein shortest path, Tree level-order traversal mein.",
      "recognitionSignals": [
        "Shortest path in unweighted graph",
        "Level by level traverse karna"
      ],
      "commonMistakes": [
        "Visited mark dequeue karte waqt lagana (enqueue karte waqt lagana chahiye warna duplicates aayenge)"
      ],
      "stepLogic": "1. Start node queue mein daalein aur visited mark karein.\n2. Jab tak queue khali na ho, level size nikaalein.\n3. Har node ke neighbors ko visit mark karke queue mein push karein."
    },
    "visual": {
      "type": "QUEUE",
      "category": "QUEUE & DEQUE",
      "title": "BFS Level-by-Level Queue Expansion",
      "input": "Tree Root (1)",
      "description": "Level 1: [1] -> Level 2: [2, 3] -> Level 3: [4, 5, 6, 7]",
      "description_hi": "Level 1 se 1 pop hota hai aur 2, 3 enqueue hote hain.",
      "steps": [
        {
          "queue": [
            1
          ],
          "front": 1,
          "explanation": "Level 0: Queue = [1]",
          "explanation_hi": "Root node 1 queue mein hai"
        },
        {
          "queue": [
            2,
            3
          ],
          "front": 2,
          "explanation": "Dequeue 1: Enqueue children [2, 3]",
          "explanation_hi": "1 pop hua, 2 aur 3 enqueue hue"
        },
        {
          "queue": [
            3,
            4,
            5
          ],
          "front": 3,
          "explanation": "Dequeue 2: Enqueue children [4, 5]",
          "explanation_hi": "2 pop hua, 4 aur 5 enqueue hue"
        }
      ],
      "result": [
        [
          1
        ],
        [
          2,
          3
        ],
        [
          4,
          5
        ]
      ]
    },
    "code": "function levelOrder(root) {\n  if (!root) return [];\n  const result = [];\n  const queue = [root];\n  \n  while (queue.length > 0) {\n    const levelSize = queue.length;\n    const currentLevel = [];\n    \n    for (let i = 0; i < levelSize; i++) {\n      const node = queue.shift();\n      currentLevel.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(currentLevel);\n  }\n  return result;\n}",
    "searchSignals": {
      "tags": [
        "queue",
        "bfs",
        "tree",
        "graph"
      ],
      "keywords": [
        "bfs queue",
        "level order traversal",
        "shortest path unweighted"
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
        "title": "Binary Tree Level Order Traversal",
        "difficulty": "Medium",
        "slug": "binary-tree-level-order-traversal",
        "url": "https://leetcode.com/problems/binary-tree-level-order-traversal/"
      },
      {
        "title": "Shortest Path in Binary Matrix",
        "difficulty": "Medium",
        "slug": "shortest-path-in-binary-matrix",
        "url": "https://leetcode.com/problems/shortest-path-in-binary-matrix/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode BFS Guide",
        "url": "https://leetcode.com/explore/learn/card/queue-stack/",
        "type": "LeetCode"
      }
    ]
  },
  "Circular Queue": {
    "slug": "queue-deque-circular-queue",
    "name": "Circular Queue",
    "topic": "Queue & Deque",
    "difficulty": "Medium",
    "timeComplexity": "O(1) all operations",
    "spaceComplexity": "O(K)",
    "interviewFrequency": "Medium",
    "en": {
      "title": "Design Circular Queue (Ring Buffer)",
      "overview": "Implementing a fixed-size FIFO queue using a contiguous array with wrapping head and tail pointers via modulo arithmetic.",
      "whatItIs": "Reuses memory vacated by dequeued elements by wrapping around: `tail = (tail + 1) % capacity`.",
      "whyItWorks": "Avoids shifting elements in memory when head moves forward, maintaining strict O(1) enQueue and deQueue.",
      "whenToUse": "Designing circular queue, ring buffers, streaming audio buffers, bounded worker thread job queues.",
      "recognitionSignals": [
        "Design circular queue with fixed capacity",
        "O(1) enqueue and dequeue without memory reallocation"
      ],
      "commonMistakes": [
        "Differentiating empty vs full queue states (use explicit `count` variable or reserve 1 sentinel slot)"
      ],
      "stepLogic": "1. Create array of size k, head = 0, tail = -1, count = 0.\n2. enQueue(val): if full return false. tail = (tail + 1) % k; arr[tail] = val; count++.\n3. deQueue(): if empty return false. head = (head + 1) % k; count--."
    },
    "hi": {
      "title": "Circular Queue (Ring Buffer)",
      "overview": "Fixed capacity array par modulo `% k` ka use karke head aur tail wrap-around FIFO queue banana.",
      "whatItIs": "Dequeued elements ki jagah ko naye elements ke liye reuse karta hai bina memory shift kiye.",
      "whyItWorks": "Modulo arithmetic se index automatically array ke start par wrap ho jata hai.",
      "whenToUse": "Ring buffer aur Fixed Capacity job queues implement karne ke liye.",
      "recognitionSignals": [
        "Design circular queue",
        "Ring buffer design"
      ],
      "commonMistakes": [
        "Empty aur full queue state mein distinction maintain na karna"
      ],
      "stepLogic": "1. k size array banayein, head=0, tail=-1, count=0.\n2. enQueue: tail = (tail + 1) % k par store karein aur count++ karein.\n3. deQueue: head = (head + 1) % k karein aur count-- karein."
    },
    "visual": {
      "type": "QUEUE",
      "category": "QUEUE & DEQUE",
      "title": "Ring Buffer Wrap-Around",
      "input": [
        "enQueue(1)",
        "enQueue(2)",
        "enQueue(3)",
        "deQueue()",
        "enQueue(4) wraps to index 0"
      ],
      "description": "Capacity 3: When tail reaches end, next enqueue wraps around to index 0 vacated by head.",
      "description_hi": "Index 2 ke baad agla element index 0 par wrap hota hai.",
      "steps": [
        {
          "queue": [
            1,
            2,
            3
          ],
          "front": 1,
          "explanation": "Queue full: [1, 2, 3]",
          "explanation_hi": "Queue full ho chuki hai"
        },
        {
          "queue": [
            null,
            2,
            3
          ],
          "front": 2,
          "explanation": "deQueue 1: Index 0 now available",
          "explanation_hi": "1 pop hua, index 0 khali ho gaya"
        },
        {
          "queue": [
            4,
            2,
            3
          ],
          "front": 2,
          "explanation": "enQueue 4: Wraps around to index 0! Queue = [4, 2, 3]",
          "explanation_hi": "4 wrap hoke index 0 par aa gaya!"
        }
      ],
      "result": true
    },
    "code": "class MyCircularQueue {\n  constructor(k) {\n    this.queue = new Array(k);\n    this.capacity = k;\n    this.head = 0;\n    this.tail = -1;\n    this.count = 0;\n  }\n  \n  enQueue(value) {\n    if (this.isFull()) return false;\n    this.tail = (this.tail + 1) % this.capacity;\n    this.queue[this.tail] = value;\n    this.count++;\n    return true;\n  }\n  \n  deQueue() {\n    if (this.isEmpty()) return false;\n    this.head = (this.head + 1) % this.capacity;\n    this.count--;\n    return true;\n  }\n  \n  Front() {\n    return this.isEmpty() ? -1 : this.queue[this.head];\n  }\n  \n  Rear() {\n    return this.isEmpty() ? -1 : this.queue[this.tail];\n  }\n  \n  isEmpty() {\n    return this.count === 0;\n  }\n  \n  isFull() {\n    return this.count === this.capacity;\n  }\n}",
    "searchSignals": {
      "tags": [
        "queue",
        "design",
        "circular-queue"
      ],
      "keywords": [
        "circular queue",
        "ring buffer",
        "design queue"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Design Circular Queue",
        "difficulty": "Medium",
        "slug": "design-circular-queue",
        "url": "https://leetcode.com/problems/design-circular-queue/"
      },
      {
        "title": "Design Circular Deque",
        "difficulty": "Medium",
        "slug": "design-circular-deque",
        "url": "https://leetcode.com/problems/design-circular-deque/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Circular Queue Editorial",
        "url": "https://leetcode.com/problems/design-circular-queue/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Monotonic Queue": {
    "slug": "queue-deque-monotonic-queue",
    "name": "Monotonic Queue",
    "topic": "Queue & Deque",
    "difficulty": "Hard",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(K)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Monotonic Deque (Double-Ended Queue)",
      "overview": "Maintaining a monotonic decreasing deque that supports push, pop, and max retrieval in amortized O(1) time.",
      "whatItIs": "Before pushing an element x into back, all smaller elements are removed from the back. When window slides, front element is removed if expired.",
      "whyItWorks": "An older element that is strictly smaller than a newer element can never be the maximum in any future window containing both.",
      "whenToUse": "Sliding Window Maximum, Shortest Subarray with Sum at Least K, Constrained Subsequence Sum.",
      "recognitionSignals": [
        "Sliding window maximum/minimum in O(N)",
        "Queue where max element is always at the front in O(1)"
      ],
      "commonMistakes": [
        "Storing values instead of indices in deque (indices make boundary expiration checks trivial)",
        "Failing to clean smaller elements from the back before pushing"
      ],
      "stepLogic": "1. Maintain double-ended queue of indices.\n2. For each element at index i:\n   a. Pop front if it falls outside window [i - k + 1..i].\n   b. Pop back while nums[back] <= nums[i].\n   c. Push i to back.\n   d. If i >= k - 1, nums[front] is window maximum."
    },
    "hi": {
      "title": "Monotonic Deque",
      "overview": "Double-ended queue mein elements ko decreasing order mein rakhna taaki har sliding window ka maximum O(1) mein mil sake.",
      "whatItIs": "Back se chhote elements ko pop kar diya jata hai kyunki wo kabhi maximum nahi ban sakte.",
      "whyItWorks": "Front element hamesha current window ka largest element hota hai.",
      "whenToUse": "Sliding Window Maximum problem mein.",
      "recognitionSignals": [
        "Sliding window max in O(N)",
        "Deque front gives current max"
      ],
      "commonMistakes": [
        "Deque mein value daalna index ke badle (index se window expire check aasaan hota hai)"
      ],
      "stepLogic": "1. Deque of indices banayein.\n2. Front se expired index nikalein.\n3. Back se chhote elements pop karein aur naya index daalein.\n4. Front element max result mein daalein."
    },
    "visual": {
      "type": "QUEUE",
      "category": "QUEUE & DEQUE",
      "title": "Monotonic Deque Window Slide",
      "input": [
        1,
        3,
        -1,
        -3,
        5,
        3,
        6,
        7
      ],
      "description": "Window k=3: [1, 3, -1] -> max is 3. 3 arrives, pops 1 from back. Front holds 3.",
      "description_hi": "3 aate hi 1 ko pop kar deta hai. Front par hamesha maximum element rehta hai.",
      "steps": [
        {
          "queue": [
            3,
            -1
          ],
          "front": 3,
          "explanation": "Window [1, 3, -1]: Deque stores [3, -1] -> Max = 3",
          "explanation_hi": "Window 1 ka max = 3"
        },
        {
          "queue": [
            3,
            -1,
            -3
          ],
          "front": 3,
          "explanation": "Window [3, -1, -3]: Deque stores [3, -1, -3] -> Max = 3",
          "explanation_hi": "Window 2 ka max = 3"
        },
        {
          "queue": [
            5
          ],
          "front": 5,
          "explanation": "5 arrives: pops 3, -1, -3 from back! Deque = [5] -> Max = 5",
          "explanation_hi": "5 aya: pichle saare chhote elements pop hue! Max = 5"
        }
      ],
      "result": [
        3,
        3,
        5,
        5,
        6,
        7
      ]
    },
    "code": "function maxSlidingWindow(nums, k) {\n  const deque = []; // stores indices\n  const res = [];\n  \n  for (let i = 0; i < nums.length; i++) {\n    // 1. Remove expired index from front\n    if (deque.length && deque[0] < i - k + 1) {\n      deque.shift();\n    }\n    // 2. Remove smaller elements from back\n    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {\n      deque.pop();\n    }\n    // 3. Add current index\n    deque.push(i);\n    // 4. Record result once first window is formed\n    if (i >= k - 1) {\n      res.push(nums[deque[0]]);\n    }\n  }\n  return res;\n}\n\nconsole.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3)); // [3,3,5,5,6,7]",
    "searchSignals": {
      "tags": [
        "queue",
        "deque",
        "sliding-window",
        "monotonic-queue"
      ],
      "keywords": [
        "sliding window maximum",
        "monotonic deque",
        "max sliding window"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft",
        "Facebook"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Sliding Window Maximum",
        "difficulty": "Hard",
        "slug": "sliding-window-maximum",
        "url": "https://leetcode.com/problems/sliding-window-maximum/"
      },
      {
        "title": "Shortest Subarray with Sum at Least K",
        "difficulty": "Hard",
        "slug": "shortest-subarray-with-sum-at-least-k",
        "url": "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Sliding Window Maximum Editorial",
        "url": "https://leetcode.com/problems/sliding-window-maximum/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Sliding Window Maximum": {
    "slug": "queue-deque-sliding-window-maximum",
    "name": "Sliding Window Maximum",
    "topic": "Queue & Deque",
    "difficulty": "Hard",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(K)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Sliding Window Maximum (Optimal Deque Approach)",
      "overview": "Extracting maximum value of every sliding window of width k across an array in strictly linear O(N) total time.",
      "whatItIs": "Eliminates the naive O(N*k) or heap-based O(N log k) overhead by storing indices in a monotonic decreasing double-ended queue.",
      "whyItWorks": "Each element enters and exits the deque at most once, yielding strictly O(1) amortized work per window transition.",
      "whenToUse": "Sliding Window Maximum, Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit.",
      "recognitionSignals": [
        "Sliding window of size k with max queries",
        "O(N) time complexity required without heap overhead"
      ],
      "commonMistakes": [
        "Using standard array `.shift()` inside high iteration loops (benchmark performance drop in JS)"
      ],
      "stepLogic": "1. Initialize deque = [].\n2. For each index i in nums:\n   a. Evict elements outside current window: if (deque[0] <= i - k) deque.shift().\n   b. Maintain decreasing order: while (nums[deque.back] <= nums[i]) deque.pop().\n   c. deque.push(i).\n   d. If i >= k - 1: append nums[deque[0]] to results."
    },
    "hi": {
      "title": "Sliding Window Maximum",
      "overview": "Array mein k size ki har window ka maximum value O(N) linear time mein nikalna.",
      "whatItIs": "Heap O(N log k) ke badle Monotonic Deque se O(N) mein har window ka max nikalne ka tareeqa.",
      "whyItWorks": "Har element zyada se zyada 1 baar push aur 1 baar pop hota hai, isliye amortized time O(1) per step rehta hai.",
      "whenToUse": "Sliding Window Maximum questions mein.",
      "recognitionSignals": [
        "Window size k ka maximum nikalna",
        "Linear O(N) time requirement"
      ],
      "commonMistakes": [
        "Window boundary index check mein `<= i - k` ke badle galti karna"
      ],
      "stepLogic": "1. Deque banayein.\n2. Expired elements front se hatayein.\n3. Back se chhote elements pop karke naya index push karein.\n4. i >= k-1 par front value output mein daalein."
    },
    "visual": {
      "type": "SLIDING_WINDOW",
      "category": "QUEUE & DEQUE",
      "title": "Sliding Window Max Result Output",
      "input": [
        1,
        3,
        -1,
        -3,
        5,
        3,
        6,
        7
      ],
      "description": "Slide window of size 3. Output max at each step: [3, 3, 5, 5, 6, 7].",
      "description_hi": "3-size window slide karte hue max record karein.",
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
          "explanation": "Window [1, 3, -1] -> Max = 3",
          "explanation_hi": "Pehli window ka max 3 hai"
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
          "explanation": "Window [3, -1, -3] -> Max = 3",
          "explanation_hi": "Dusri window ka max 3 hai"
        },
        {
          "window": [
            2,
            4
          ],
          "left": 2,
          "right": 4,
          "sum": 5,
          "target": 5,
          "explanation": "Window [-1, -3, 5] -> Max = 5",
          "explanation_hi": "Teesri window ka max 5 hai"
        }
      ],
      "result": [
        3,
        3,
        5,
        5,
        6,
        7
      ]
    },
    "code": "function maxSlidingWindow(nums, k) {\n  const deque = [];\n  const res = [];\n  \n  for (let i = 0; i < nums.length; i++) {\n    if (deque.length && deque[0] <= i - k) {\n      deque.shift();\n    }\n    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {\n      deque.pop();\n    }\n    deque.push(i);\n    if (i >= k - 1) {\n      res.push(nums[deque[0]]);\n    }\n  }\n  return res;\n}",
    "searchSignals": {
      "tags": [
        "queue",
        "deque",
        "sliding-window"
      ],
      "keywords": [
        "sliding window max",
        "max sliding window",
        "monotonic deque"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Sliding Window Maximum",
        "difficulty": "Hard",
        "slug": "sliding-window-maximum",
        "url": "https://leetcode.com/problems/sliding-window-maximum/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Sliding Window Maximum Editorial",
        "url": "https://leetcode.com/problems/sliding-window-maximum/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Priority Queue Concepts": {
    "slug": "queue-deque-priority-queue-concepts",
    "name": "Priority Queue Concepts",
    "topic": "Queue & Deque",
    "difficulty": "Medium",
    "timeComplexity": "O(log N) push/pop, O(1) peek",
    "spaceComplexity": "O(N)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Priority Queue / Min-Heap Queues",
      "overview": "Abstract data type where each element has a priority, and elements with higher priority are dequeued first.",
      "whatItIs": "Implemented via a binary heap where root is always the extremum (min or max priority). Insertions and extractions take O(log N).",
      "whyItWorks": "Complete binary tree representation in an array `(parent = (i-1)/2, left = 2i+1, right = 2i+2)` provides compact cache locality.",
      "whenToUse": "Dijkstra's shortest path, Prim's MST, Top K Frequent Elements, Task Scheduler.",
      "recognitionSignals": [
        "Dynamic stream where highest/lowest priority item must be processed next",
        "Top K elements online"
      ],
      "commonMistakes": [
        "Heapify index arithmetic off-by-one errors",
        "Inverting comparator (min-heap vs max-heap)"
      ],
      "stepLogic": "1. Push: add to array end, bubbleUp while parent violates heap order.\n2. Pop: swap root with last element, pop last, bubbleDown from root restoring heap invariant.\n3. Peek: return root (index 0) in O(1)."
    },
    "hi": {
      "title": "Priority Queue / Min-Heap Concepts",
      "overview": "Priority based queue jisme highest priority wala element sabse pehle dequeue hota hai.",
      "whatItIs": "Binary heap se implement hota hai jisme root par hamesha min ya max element rehta hai.",
      "whyItWorks": "Array based binary tree mein parent aur child indices direct math formula se milte hain.",
      "whenToUse": "Dijkstra shortest path aur Top K Frequent Elements mein.",
      "recognitionSignals": [
        "Priority based ordering",
        "Top K dynamic processing"
      ],
      "commonMistakes": [
        "Min heap aur Max heap comparator ulta likh dena"
      ],
      "stepLogic": "1. Push: element end par daalein aur bubbleUp karein.\n2. Pop: root ko last element se swap karein aur bubbleDown karein.\n3. Peek: index 0 element return karein O(1) mein."
    },
    "visual": {
      "type": "HEAP",
      "category": "QUEUE & DEQUE",
      "title": "Priority Queue Min-Heap Root",
      "input": [
        10,
        15,
        20,
        17,
        25
      ],
      "description": "Min-Heap: Root (10) has minimum value and highest dequeue priority.",
      "description_hi": "Root node 10 sabse chhota hai aur pehle dequeue hoga.",
      "steps": [
        {
          "activeIdx": 0,
          "heapArray": [
            10,
            15,
            20,
            17,
            25
          ],
          "explanation": "Root 10 holds minimum priority key",
          "explanation_hi": "Root 10 min priority hold karta hai"
        },
        {
          "activeIdx": 0,
          "heapArray": [
            15,
            17,
            20,
            25
          ],
          "explanation": "Dequeue 10 -> Root replaced by 15. Invariant preserved!",
          "explanation_hi": "10 dequeue hua -> 15 naya root bana."
        }
      ],
      "result": 10
    },
    "code": "class MinPriorityQueue {\n  constructor() {\n    this.heap = [];\n  }\n  \n  push(val) {\n    this.heap.push(val);\n    this._bubbleUp(this.heap.length - 1);\n  }\n  \n  pop() {\n    if (this.heap.length <= 1) return this.heap.pop();\n    const top = this.heap[0];\n    this.heap[0] = this.heap.pop();\n    this._bubbleDown(0);\n    return top;\n  }\n  \n  peek() {\n    return this.heap[0];\n  }\n  \n  _bubbleUp(idx) {\n    while (idx > 0) {\n      const p = Math.floor((idx - 1) / 2);\n      if (this.heap[idx] >= this.heap[p]) break;\n      [this.heap[idx], this.heap[p]] = [this.heap[p], this.heap[idx]];\n      idx = p;\n    }\n  }\n  \n  _bubbleDown(idx) {\n    const n = this.heap.length;\n    while (2 * idx + 1 < n) {\n      let smallest = 2 * idx + 1;\n      const right = smallest + 1;\n      if (right < n && this.heap[right] < this.heap[smallest]) smallest = right;\n      if (this.heap[idx] <= this.heap[smallest]) break;\n      [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];\n      idx = smallest;\n    }\n  }\n}",
    "searchSignals": {
      "tags": [
        "queue",
        "heap",
        "priority-queue"
      ],
      "keywords": [
        "priority queue",
        "min heap queue",
        "heap push pop"
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
      },
      {
        "title": "Top K Frequent Elements",
        "difficulty": "Medium",
        "slug": "top-k-frequent-elements",
        "url": "https://leetcode.com/problems/top-k-frequent-elements/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Priority Queue Card",
        "url": "https://leetcode.com/explore/learn/card/heap-priority-queue/",
        "type": "LeetCode"
      }
    ]
  }
};
