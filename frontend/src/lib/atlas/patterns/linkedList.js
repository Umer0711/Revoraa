export const linkedListPatterns = {
  "Fast & Slow Pointer": {
    "slug": "linked-list-fast-slow-pointer",
    "name": "Fast & Slow Pointer",
    "topic": "Linked List",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Fast & Slow Pointer (Floyd's Tortoise & Hare)",
      "overview": "Advancing two pointers at different speeds (1x and 2x) to find midpoints, cycles, or relative positions.",
      "whatItIs": "A pointer technique where the slow pointer advances 1 step while the fast pointer advances 2 steps per iteration.",
      "whyItWorks": "When fast reaches the end of the list, slow has traversed exactly half the distance (N/2), pinpointing the exact middle.",
      "whenToUse": "Finding the middle node of a linked list, cycle detection, palindrome linked list checking.",
      "recognitionSignals": [
        "Find the middle of a linked list in a single pass",
        "Check if linked list has a loop",
        "Split linked list into two equal halves"
      ],
      "commonMistakes": [
        "Checking `fast.next.next` without first ensuring `fast` and `fast.next` are not null (NullPointerException)",
        "Off-by-one with odd vs even length lists"
      ],
      "stepLogic": "1. Initialize slow = head, fast = head.\n2. While fast !== null && fast.next !== null:\n3. slow = slow.next; fast = fast.next.next.\n4. slow points to the middle node."
    },
    "hi": {
      "title": "Fast & Slow Pointer (Hare & Tortoise)",
      "overview": "Do pointers ko alag-alag speed (1 step aur 2 steps) se chala kar midpoint ya loop dhoondhna.",
      "whatItIs": "Slow pointer 1 step aur fast pointer 2 steps chalta hai.",
      "whyItWorks": "Jab fast end par pahunchta hai, slow theek middle (N/2) par hota hai.",
      "whenToUse": "Linked list ka middle nikalne aur cycle detect karne ke liye.",
      "recognitionSignals": [
        "Single pass mein middle node chahiye",
        "Cycle detect karni ho"
      ],
      "commonMistakes": [
        "fast.next null check kiye bina fast.next.next access karna"
      ],
      "stepLogic": "1. slow = head, fast = head set karo.\n2. While fast aur fast.next null na hon: slow=slow.next, fast=fast.next.next.\n3. slow ab midpoint par hai."
    },
    "visual": {
      "type": "LINKED_LIST",
      "category": "LINKED LIST",
      "title": "Middle Node Traversal",
      "input": [
        1,
        2,
        3,
        4,
        5
      ],
      "description": "Slow advances 1 step, Fast advances 2 steps. When Fast hits end (5), Slow is at middle (3).",
      "description_hi": "Fast end par pahunchta hai, slow theek middle node 3 par hota hai.",
      "steps": [
        {
          "head": 1,
          "slow": 1,
          "fast": 1,
          "explanation": "Start: Slow at 1, Fast at 1",
          "explanation_hi": "Shuru: Slow=1, Fast=1"
        },
        {
          "head": 1,
          "slow": 2,
          "fast": 3,
          "explanation": "Step 1: Slow at 2, Fast at 3",
          "explanation_hi": "Step 1: Slow=2, Fast=3"
        },
        {
          "head": 1,
          "slow": 3,
          "fast": 5,
          "explanation": "Step 2: Fast hits tail (5). Slow is at middle node 3!",
          "explanation_hi": "Step 2: Fast tail par hai. Slow middle node 3 par hai!"
        }
      ],
      "result": 3
    },
    "code": "function middleNode(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  return slow;\n}\n\n// Example usage: 1 -> 2 -> 3 -> 4 -> 5 returns node with val 3",
    "searchSignals": {
      "tags": [
        "linked-list",
        "two-pointers",
        "fast-slow"
      ],
      "keywords": [
        "middle of linked list",
        "slow fast pointer",
        "tortoise hare"
      ],
      "companies": [
        "Amazon",
        "Microsoft",
        "Google",
        "Apple"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Middle of the Linked List",
        "difficulty": "Easy",
        "slug": "middle-of-the-linked-list",
        "url": "https://leetcode.com/problems/middle-of-the-linked-list/"
      },
      {
        "title": "Linked List Cycle",
        "difficulty": "Easy",
        "slug": "linked-list-cycle",
        "url": "https://leetcode.com/problems/linked-list-cycle/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Middle of Linked List",
        "url": "https://leetcode.com/problems/middle-of-the-linked-list/editorial/",
        "type": "LeetCode"
      },
      {
        "name": "GFG Floyd Cycle Finding",
        "url": "https://www.geeksforgeeks.org/how-does-floyds-slow-and-fast-pointers-approach-work/",
        "type": "GFG"
      }
    ]
  },
  "Cycle Detection": {
    "slug": "linked-list-cycle-detection",
    "name": "Cycle Detection",
    "topic": "Linked List",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Floyd's Cycle Detection & Cycle Entry Point",
      "overview": "Detecting loops in a linked list and mathematically locating the cycle entry node in O(N) time and O(1) space.",
      "whatItIs": "Phase 1 detects intersection of slow (1x) and fast (2x) inside loop. Phase 2 resets slow to head; advancing both by 1 step finds the cycle start.",
      "whyItWorks": "Distance from head to entry equals distance from meeting point to entry inside the loop: `L = k*C - x`.",
      "whenToUse": "Linked List Cycle I & II, Find Duplicate Number in array (mapped as linked list).",
      "recognitionSignals": [
        "Determine if a linked list contains a loop without extra memory",
        "Find the exact node where cycle begins",
        "Find duplicate in array where array[i] is pointer"
      ],
      "commonMistakes": [
        "Infinite loops due to missing null checks on fast pointer",
        "Not handling list with 0 or 1 nodes"
      ],
      "stepLogic": "1. Phase 1: slow = head, fast = head; advance slow by 1, fast by 2 until they meet or fast hits null.\n2. If fast hits null, return null (no cycle).\n3. Phase 2: reset slow to head. Advance both slow and fast by 1 step.\n4. The node where they meet is the start of the cycle."
    },
    "hi": {
      "title": "Floyd's Cycle Detection",
      "overview": "Linked list mein cycle detect karna aur cycle ka start node O(1) memory mein nikalna.",
      "whatItIs": "Hare & Tortoise algorithm ka use karke meeting point aur entry point nikalna.",
      "whyItWorks": "Math proof: Head se entry tak ki doori meeting point se entry tak ki doori ke barabar hoti hai.",
      "whenToUse": "Linked List Cycle I & II, Find the Duplicate Number problems mein.",
      "recognitionSignals": [
        "Cycle detect karna bina extra set/memory ke",
        "Cycle start node dhoondhna"
      ],
      "commonMistakes": [
        "Single node bina cycle ke case mein crash kar dena"
      ],
      "stepLogic": "1. slow 1 step, fast 2 steps chalao jab tak dono mil na jayein.\n2. Milne ke baad slow ko head par reset karo.\n3. Ab dono ko 1-1 step aage badhao; jahan milenge wahi cycle start hai."
    },
    "visual": {
      "type": "LINKED_LIST",
      "category": "LINKED LIST",
      "title": "Cycle Intersection & Entry Detection",
      "input": [
        3,
        2,
        0,
        -4
      ],
      "description": "List 3 -> 2 -> 0 -> -4 -> points back to 2. Fast & Slow meet at -4. Reset slow to head -> meet at node 2.",
      "description_hi": "Fast aur slow -4 par milte hain. Slow ko head par le ja kar 1 step chalao toh node 2 par milte hain.",
      "steps": [
        {
          "head": 3,
          "slow": 3,
          "fast": 3,
          "explanation": "Start at head (3)",
          "explanation_hi": "Head se start kiya"
        },
        {
          "head": 3,
          "slow": -4,
          "fast": -4,
          "explanation": "Phase 1: Fast and slow meet inside loop at node (-4)",
          "explanation_hi": "Phase 1: Slow aur Fast node -4 par mile"
        },
        {
          "head": 3,
          "slow": 3,
          "fast": -4,
          "explanation": "Phase 2: Reset slow to head (3), keep fast at meeting point (-4)",
          "explanation_hi": "Phase 2: Slow ko head par laya, fast wahi raha"
        },
        {
          "head": 3,
          "slow": 2,
          "fast": 2,
          "explanation": "Advance both 1 step -> Meet at node 2 (Cycle Entry Point!)",
          "explanation_hi": "Dono 1 step chale -> Node 2 par mile, yahi cycle entry hai!"
        }
      ],
      "result": 2
    },
    "code": "function detectCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) {\n      let entry = head;\n      while (entry !== slow) {\n        entry = entry.next;\n        slow = slow.next;\n      }\n      return entry; // Cycle entry node\n    }\n  }\n  return null; // No cycle\n}",
    "searchSignals": {
      "tags": [
        "linked-list",
        "two-pointers",
        "cycle-detection"
      ],
      "keywords": [
        "linked list cycle",
        "cycle detection",
        "floyd cycle entry"
      ],
      "companies": [
        "Amazon",
        "Microsoft",
        "Google",
        "Uber"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Linked List Cycle II",
        "difficulty": "Medium",
        "slug": "linked-list-cycle-ii",
        "url": "https://leetcode.com/problems/linked-list-cycle-ii/"
      },
      {
        "title": "Find the Duplicate Number",
        "difficulty": "Medium",
        "slug": "find-the-duplicate-number",
        "url": "https://leetcode.com/problems/find-the-duplicate-number/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Linked List Cycle II",
        "url": "https://leetcode.com/problems/linked-list-cycle-ii/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Reverse List": {
    "slug": "linked-list-reverse-list",
    "name": "Reverse List",
    "topic": "Linked List",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Iterative In-Place Linked List Reversal",
      "overview": "Reversing direction of next pointers using three pointers (prev, curr, next) in O(1) memory.",
      "whatItIs": "Pointer rewiring where each node's `next` pointer is flipped to point backwards to `prev`.",
      "whyItWorks": "Storing `curr.next` in a temporary variable before breaking the forward link allows complete list inversion without losing remaining nodes.",
      "whenToUse": "Reversing entire linked list, reversing sublists, checking palindrome lists, adding two numbers represented by lists.",
      "recognitionSignals": [
        "Reverse singly linked list",
        "Process linked list from tail to head",
        "Invert pointer directions"
      ],
      "commonMistakes": [
        "Losing reference to the rest of the list by overwriting `curr.next` before caching it",
        "Returning `curr` instead of `prev` after loop terminates (curr is null)"
      ],
      "stepLogic": "1. prev = null, curr = head.\n2. While curr !== null:\n   a. nextTemp = curr.next\n   b. curr.next = prev\n   c. prev = curr\n   d. curr = nextTemp\n3. Return prev (new head)."
    },
    "hi": {
      "title": "In-Place Linked List Reversal",
      "overview": "Three pointers (prev, curr, next) ka use karke pointers ki direction reverse karna bina extra space ke.",
      "whatItIs": "Har node ka `next` pichli node (`prev`) ki taraf point kara dena.",
      "whyItWorks": "`curr.next` ko pehle store kar lene se remaining list ka reference kho nahi jata.",
      "whenToUse": "Linked list ko ulti karni ho ya Palindrome check karna ho.",
      "recognitionSignals": [
        "Reverse linked list in O(1) space",
        "Tail to head traverse karna ho"
      ],
      "commonMistakes": [
        "curr.next save kiye bina overwrite kar dena",
        "Loop ke baad prev ke badle curr return karna"
      ],
      "stepLogic": "1. prev = null, curr = head.\n2. nextTemp = curr.next save karo.\n3. curr.next = prev link reverse karo.\n4. prev aur curr ko 1-1 step aage badhao. Return prev."
    },
    "visual": {
      "type": "LINKED_LIST",
      "category": "LINKED LIST",
      "title": "Pointer Direction Flip (1 -> 2 -> 3 to 3 -> 2 -> 1)",
      "input": [
        1,
        2,
        3
      ],
      "description": "Flip next pointer backwards at each step.",
      "description_hi": "Har step par pointer ko ulta point karein.",
      "steps": [
        {
          "head": 1,
          "slow": 1,
          "fast": 2,
          "explanation": "Node 1 points to null (prev). prev=1, curr=2",
          "explanation_hi": "Node 1 null ki taraf point karta hai. prev=1"
        },
        {
          "head": 1,
          "slow": 2,
          "fast": 3,
          "explanation": "Node 2 points to 1. prev=2, curr=3",
          "explanation_hi": "Node 2 ab 1 ko point karta hai. prev=2"
        },
        {
          "head": 1,
          "slow": 3,
          "fast": null,
          "explanation": "Node 3 points to 2. prev=3. Reversal complete!",
          "explanation_hi": "Node 3 ab 2 ko point karta hai. Reversal complete!"
        }
      ],
      "result": [
        3,
        2,
        1
      ]
    },
    "code": "function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr) {\n    const nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}\n\n// 1 -> 2 -> 3 -> null becomes 3 -> 2 -> 1 -> null",
    "searchSignals": {
      "tags": [
        "linked-list",
        "pointers"
      ],
      "keywords": [
        "reverse linked list",
        "reverse list in place"
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
        "title": "Reverse Linked List",
        "difficulty": "Easy",
        "slug": "reverse-linked-list",
        "url": "https://leetcode.com/problems/reverse-linked-list/"
      },
      {
        "title": "Reverse Linked List II",
        "difficulty": "Medium",
        "slug": "reverse-linked-list-ii",
        "url": "https://leetcode.com/problems/reverse-linked-list-ii/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Reverse Linked List",
        "url": "https://leetcode.com/problems/reverse-linked-list/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Reverse in Groups": {
    "slug": "linked-list-reverse-in-groups",
    "name": "Reverse in Groups",
    "topic": "Linked List",
    "difficulty": "Hard",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Reverse Nodes in k-Group",
      "overview": "Reversing consecutive subsegments of size k while reconnecting adjacent group boundary pointers.",
      "whatItIs": "Modular linked list reversal checking if k nodes exist ahead; if so, reversing the k-segment and stitching to preceding and following blocks.",
      "whyItWorks": "Preserves remainder nodes (< k) unchanged while systematically re-linking group head and tail.",
      "whenToUse": "Reverse Nodes in k-Group, swap nodes in pairs (k=2).",
      "recognitionSignals": [
        "Reverse nodes k at a time",
        "Leave remaining fewer than k nodes intact"
      ],
      "commonMistakes": [
        "Losing pointer links between reversed group tail and next group head",
        "Reversing remainder group that has fewer than k nodes"
      ],
      "stepLogic": "1. Use dummy node pointing to head.\n2. Count if k nodes exist ahead from groupPrev.\n3. If k nodes exist, reverse the k nodes.\n4. Re-link groupPrev.next to reversed head, and old group head to next group start."
    },
    "hi": {
      "title": "Reverse Nodes in k-Group",
      "overview": "k size ke groups mein nodes ko reverse karna aur beech ke links connect rakhna.",
      "whatItIs": "Har k nodes ke block ko alag se reverse karke pichle aur agle block se sahi tarah jodna.",
      "whyItWorks": "Remaining nodes jo k se kam hain unhe chhod diya jata hai, aur har k block safely link ho jata hai.",
      "whenToUse": "Reverse in k-group ya Swap Nodes in Pairs problems mein.",
      "recognitionSignals": [
        "k nodes at a time reverse karna",
        "Remainder intact rakhna"
      ],
      "commonMistakes": [
        "Next group ka connection kho dena",
        "k se kam nodes ko bhi galti se reverse kar dena"
      ],
      "stepLogic": "1. Dummy node banayein.\n2. Check karein ki k nodes aage available hain ya nahi.\n3. k nodes reverse karein aur boundaries link karein."
    },
    "visual": {
      "type": "LINKED_LIST",
      "category": "LINKED LIST",
      "title": "k-Group Reversal (k=2)",
      "input": [
        1,
        2,
        3,
        4,
        5
      ],
      "description": "Group 1: [1, 2] -> [2, 1]. Group 2: [3, 4] -> [4, 3]. Node 5 remains intact.",
      "description_hi": "1-2 reverse ho kar 2-1 bana, 3-4 reverse ho kar 4-3 bana. 5 waisa hi raha.",
      "steps": [
        {
          "head": 1,
          "slow": 2,
          "fast": 1,
          "explanation": "Reverse group 1: 1->2 becomes 2->1",
          "explanation_hi": "Group 1 reverse hua"
        },
        {
          "head": 1,
          "slow": 4,
          "fast": 3,
          "explanation": "Reverse group 2: 3->4 becomes 4->3",
          "explanation_hi": "Group 2 reverse hua"
        },
        {
          "head": 1,
          "slow": 5,
          "fast": null,
          "explanation": "Node 5 is single (< k) -> kept as is: 2 -> 1 -> 4 -> 3 -> 5",
          "explanation_hi": "Node 5 akela hai -> intact raha: 2 -> 1 -> 4 -> 3 -> 5"
        }
      ],
      "result": [
        2,
        1,
        4,
        3,
        5
      ]
    },
    "code": "function reverseKGroup(head, k) {\n  let count = 0, curr = head;\n  while (curr && count < k) {\n    curr = curr.next;\n    count++;\n  }\n  if (count < k) return head;\n  \n  let prev = null, node = head;\n  for (let i = 0; i < k; i++) {\n    const nxt = node.next;\n    node.next = prev;\n    prev = node;\n    node = nxt;\n  }\n  head.next = reverseKGroup(node, k);\n  return prev;\n}",
    "searchSignals": {
      "tags": [
        "linked-list",
        "k-group",
        "reversal"
      ],
      "keywords": [
        "reverse nodes in k-group",
        "k-group reversal",
        "swap nodes in pairs"
      ],
      "companies": [
        "Amazon",
        "Microsoft",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Reverse Nodes in k-Group",
        "difficulty": "Hard",
        "slug": "reverse-nodes-in-k-group",
        "url": "https://leetcode.com/problems/reverse-nodes-in-k-group/"
      },
      {
        "title": "Swap Nodes in Pairs",
        "difficulty": "Medium",
        "slug": "swap-nodes-in-pairs",
        "url": "https://leetcode.com/problems/swap-nodes-in-pairs/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Reverse in k-Group",
        "url": "https://leetcode.com/problems/reverse-nodes-in-k-group/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Merge Lists": {
    "slug": "linked-list-merge-lists",
    "name": "Merge Lists",
    "topic": "Linked List",
    "difficulty": "Easy",
    "timeComplexity": "O(N + M)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Merge Two Sorted Lists",
      "overview": "Splicing together nodes of two sorted lists in-place into one sorted list in O(N + M) time and O(1) auxiliary space.",
      "whatItIs": "Two-pointer comparison choosing the smaller node and advancing pointers without allocating new node objects.",
      "whyItWorks": "Because both lists are already sorted, the globally smallest remaining node is always at the head of either list 1 or list 2.",
      "whenToUse": "Merging two lists, Merge Sort on linked list, Merge k Sorted Lists.",
      "recognitionSignals": [
        "Merge two sorted linked lists into one sorted list",
        "In-place pointer re-linking of two lists"
      ],
      "commonMistakes": [
        "Allocating duplicate ListNode instances instead of re-linking existing ones",
        "Forgetting to attach the remainder of the non-empty list"
      ],
      "stepLogic": "1. Create dummy node; set tail = dummy.\n2. While l1 !== null && l2 !== null:\n   a. Attach smaller node to tail.next\n   b. Advance corresponding list pointer\n   c. Advance tail\n3. Attach remaining non-null list (l1 || l2) to tail.next.\n4. Return dummy.next."
    },
    "hi": {
      "title": "Merge Two Sorted Lists",
      "overview": "Do sorted lists ko in-place re-link karke ek sorted list banana O(1) space mein.",
      "whatItIs": "Dono lists ke heads compare karke chhota node choose karna aur pointer aage badhana.",
      "whyItWorks": "Kyunki dono lists pehle se sorted hain, isliye next smallest node hamesha dono heads mein se ek hogi.",
      "whenToUse": "Merge Two Sorted Lists, Merge Sort on Linked List mein.",
      "recognitionSignals": [
        "Do sorted lists ko merge karna",
        "In-place pointer re-linking"
      ],
      "commonMistakes": [
        "Bache hue non-empty list ko tail se connect karna bhool jana"
      ],
      "stepLogic": "1. Dummy node banayein, tail = dummy.\n2. Chhote node ko tail.next se link karein aur aage badhein.\n3. Jo list bachi ho use tail.next se seedha attach karein."
    },
    "visual": {
      "type": "LINKED_LIST",
      "category": "LINKED LIST",
      "title": "Sorted In-Place Merge",
      "input": {
        "l1": [
          1,
          2,
          4
        ],
        "l2": [
          1,
          3,
          4
        ]
      },
      "description": "Compare heads: 1 from l1, 1 from l2, 2, 3, 4, 4 -> 1 -> 1 -> 2 -> 3 -> 4 -> 4",
      "description_hi": "Heads compare karke sorted order mein link karein.",
      "steps": [
        {
          "head": 1,
          "slow": 1,
          "fast": 1,
          "explanation": "Attach 1 from L1, then 1 from L2",
          "explanation_hi": "1 attach hua"
        },
        {
          "head": 1,
          "slow": 2,
          "fast": 3,
          "explanation": "Attach 2 from L1, then 3 from L2",
          "explanation_hi": "2 aur 3 attach hue"
        },
        {
          "head": 1,
          "slow": 4,
          "fast": 4,
          "explanation": "Attach 4 from L1 and 4 from L2 -> Result: 1->1->2->3->4->4",
          "explanation_hi": "4 attach hua -> Merged list complete!"
        }
      ],
      "result": [
        1,
        1,
        2,
        3,
        4,
        4
      ]
    },
    "code": "function mergeTwoLists(l1, l2) {\n  const dummy = { val: 0, next: null };\n  let tail = dummy;\n  \n  while (l1 && l2) {\n    if (l1.val <= l2.val) {\n      tail.next = l1;\n      l1 = l1.next;\n    } else {\n      tail.next = l2;\n      l2 = l2.next;\n    }\n    tail = tail.next;\n  }\n  tail.next = l1 || l2;\n  return dummy.next;\n}",
    "searchSignals": {
      "tags": [
        "linked-list",
        "merge",
        "sorting"
      ],
      "keywords": [
        "merge two sorted lists",
        "merge lists",
        "merge k sorted lists"
      ],
      "companies": [
        "Amazon",
        "Microsoft",
        "Apple",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Merge Two Sorted Lists",
        "difficulty": "Easy",
        "slug": "merge-two-sorted-lists",
        "url": "https://leetcode.com/problems/merge-two-sorted-lists/"
      },
      {
        "title": "Merge k Sorted Lists",
        "difficulty": "Hard",
        "slug": "merge-k-sorted-lists",
        "url": "https://leetcode.com/problems/merge-k-sorted-lists/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Merge Two Sorted Lists",
        "url": "https://leetcode.com/problems/merge-two-sorted-lists/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Dummy Node": {
    "slug": "linked-list-dummy-node",
    "name": "Dummy Node",
    "topic": "Linked List",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Dummy (Sentinel) Node Pattern",
      "overview": "Using an artificial head node to eliminate edge case branching when modifying or deleting head nodes.",
      "whatItIs": "A sentinel node prepended before the real head: `dummy.next = head`. All operations operate symmetrically on `prev.next`.",
      "whyItWorks": "Removing or inserting the head node requires the same code as modifying intermediate nodes, avoiding separate `if (head == node)` branches.",
      "whenToUse": "Remove Nth Node From End, Remove Linked List Elements, Delete Duplicates, Partition List.",
      "recognitionSignals": [
        "Head node itself might be deleted or moved",
        "Need clean, uniform pointer updates",
        "Eliminate null checks on head"
      ],
      "commonMistakes": [
        "Returning `dummy` instead of `dummy.next` as the updated list head",
        "Memory leaks in languages without GC if sentinel is not deallocated"
      ],
      "stepLogic": "1. Create dummy = new ListNode(0, head).\n2. Maintain pointer prev = dummy.\n3. Perform insertions, deletions, or swaps using prev.next.\n4. Return dummy.next as the safe new head."
    },
    "hi": {
      "title": "Dummy Node Pattern",
      "overview": "Ek extra temporary node (sentinel) head se pehle lagana taaki head delete hone wale edge cases aasaani se handle ho sakein.",
      "whatItIs": "`dummy.next = head` karke standard uniform code likhna bina special `if (head === target)` condition ke.",
      "whyItWorks": "Head node ko bhi normal intermediate node ki tarah treat kiya ja sakta hai.",
      "whenToUse": "Jab head node delete ya modify hone ka chance ho (e.g. Remove Nth node).",
      "recognitionSignals": [
        "Head node delete ho sakti hai",
        "Edge cases clean karne hain"
      ],
      "commonMistakes": [
        "dummy.next ke badle dummy return kar dena"
      ],
      "stepLogic": "1. dummy = new ListNode(0, head) banayein.\n2. Pointer prev = dummy set karein.\n3. prev.next ke through modifications karein.\n4. dummy.next return karein."
    },
    "visual": {
      "type": "LINKED_LIST",
      "category": "LINKED LIST",
      "title": "Dummy Node Deleting Head (Node 1)",
      "input": [
        1,
        2,
        3
      ],
      "description": "Dummy (0) -> 1 -> 2 -> 3. To delete 1, point Dummy (0) directly to 2. Return dummy.next (2).",
      "description_hi": "Dummy 0 se seedha 2 ko link karein, 1 clean bypass ho gaya.",
      "steps": [
        {
          "head": 0,
          "slow": 0,
          "fast": 1,
          "explanation": "Dummy(0) -> 1 -> 2 -> 3",
          "explanation_hi": "Dummy head se pehle attach hua"
        },
        {
          "head": 0,
          "slow": 0,
          "fast": 2,
          "explanation": "Bypass node 1: Dummy(0).next = 2. Safe and clean!",
          "explanation_hi": "Dummy.next = 2 hua, node 1 delete!"
        }
      ],
      "result": [
        2,
        3
      ]
    },
    "code": "function removeElements(head, val) {\n  const dummy = { val: 0, next: head };\n  let curr = dummy;\n  while (curr.next) {\n    if (curr.next.val === val) {\n      curr.next = curr.next.next;\n    } else {\n      curr = curr.next;\n    }\n  }\n  return dummy.next;\n}",
    "searchSignals": {
      "tags": [
        "linked-list",
        "dummy-node",
        "sentinel"
      ],
      "keywords": [
        "dummy node",
        "sentinel node",
        "remove linked list elements"
      ],
      "companies": [
        "Amazon",
        "Google",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Remove Linked List Elements",
        "difficulty": "Easy",
        "slug": "remove-linked-list-elements",
        "url": "https://leetcode.com/problems/remove-linked-list-elements/"
      },
      {
        "title": "Remove Nth Node From End of List",
        "difficulty": "Medium",
        "slug": "remove-nth-node-from-end-of-list",
        "url": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Remove Elements Editorial",
        "url": "https://leetcode.com/problems/remove-linked-list-elements/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Intersection": {
    "slug": "linked-list-intersection",
    "name": "Intersection",
    "topic": "Linked List",
    "difficulty": "Easy",
    "timeComplexity": "O(N + M)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Intersection of Two Linked Lists",
      "overview": "Finding the intersecting node of two lists by equalizing path lengths with dual pointer switching in O(N + M).",
      "whatItIs": "Pointer A traverses list A then switches to list B; pointer B traverses list B then switches to list A. Both traverse exact distance (N + M).",
      "whyItWorks": "Because length(A) + length(B) === length(B) + length(A), both pointers synchronize and meet at the intersection node or at null.",
      "whenToUse": "Finding Y-shaped intersection node of two lists without knowing their lengths beforehand.",
      "recognitionSignals": [
        "Find node where two singly linked lists merge",
        "Determine if two lists share identical reference nodes in O(1) space"
      ],
      "commonMistakes": [
        "Comparing node values instead of reference equality (`pA === pB`)",
        "Infinite loop if pointers switch back and forth infinitely on mismatched lists (they must terminate at null)"
      ],
      "stepLogic": "1. If either head is null, return null.\n2. pA = headA, pB = headB.\n3. While pA !== pB:\n   a. pA = (pA === null) ? headB : pA.next\n   b. pB = (pB === null) ? headA : pB.next\n4. Return pA (either intersection node or null)."
    },
    "hi": {
      "title": "Intersection of Two Linked Lists",
      "overview": "Do lists ke intersection node ko dono pointers switch kara kar O(1) space mein nikalna.",
      "whatItIs": "Pointer A List A khatam hone par List B ke head par jata hai, aur B List A par.",
      "whyItWorks": "Dono pointers total (Length A + Length B) distance cover karte hain, isliye theek intersection par milte hain.",
      "whenToUse": "Y-shaped intersection dhoondhne ke liye.",
      "recognitionSignals": [
        "Do lists ka common intersection node",
        "O(1) memory requirement"
      ],
      "commonMistakes": [
        "Value compare karna reference compare karne ke badle"
      ],
      "stepLogic": "1. pA = headA, pB = headB rakhein.\n2. While pA !== pB, agle node par jayein ya dusri list ke head par switch karein.\n3. Meeting node pA return karein."
    },
    "visual": {
      "type": "LINKED_LIST",
      "category": "LINKED LIST",
      "title": "Dual Pointer Switching Synchronization",
      "input": {
        "listA": [
          4,
          1,
          8,
          4,
          5
        ],
        "listB": [
          5,
          6,
          1,
          8,
          4,
          5
        ]
      },
      "description": "pA walks A then B; pB walks B then A. Both traverse 11 steps and meet at node 8.",
      "description_hi": "Dono pointers barabar total steps chalkar node 8 par milte hain.",
      "steps": [
        {
          "head": 4,
          "slow": 4,
          "fast": 5,
          "explanation": "pA at 4, pB at 5",
          "explanation_hi": "Shuru: pA=4, pB=5"
        },
        {
          "head": 4,
          "slow": 8,
          "fast": 8,
          "explanation": "Both pointers synchronize and meet at common node 8!",
          "explanation_hi": "Dono pointers node 8 par mil gaye!"
        }
      ],
      "result": 8
    },
    "code": "function getIntersectionNode(headA, headB) {\n  if (!headA || !headB) return null;\n  let pA = headA, pB = headB;\n  \n  while (pA !== pB) {\n    pA = pA ? pA.next : headB;\n    pB = pB ? pB.next : headA;\n  }\n  return pA;\n}",
    "searchSignals": {
      "tags": [
        "linked-list",
        "two-pointers",
        "intersection"
      ],
      "keywords": [
        "intersection of two linked lists",
        "intersection node"
      ],
      "companies": [
        "Amazon",
        "Microsoft",
        "Apple",
        "Bloomberg"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Intersection of Two Linked Lists",
        "difficulty": "Easy",
        "slug": "intersection-of-two-linked-lists",
        "url": "https://leetcode.com/problems/intersection-of-two-linked-lists/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Intersection Editorial",
        "url": "https://leetcode.com/problems/intersection-of-two-linked-lists/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Middle Node": {
    "slug": "linked-list-middle-node",
    "name": "Middle Node",
    "topic": "Linked List",
    "difficulty": "Easy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "Middle Node (Single Pass)",
      "overview": "Locating the middle node of a linked list in a single traversal using dual speed pointers.",
      "whatItIs": "Fast pointer moves 2 steps, slow moves 1 step. For even length lists, slow lands on the second middle node.",
      "whyItWorks": "When fast pointer traverses 2k nodes, slow pointer has traversed exactly k nodes.",
      "whenToUse": "Splitting list for Merge Sort, palindrome linked list verification, finding median.",
      "recognitionSignals": [
        "Find middle in one pass",
        "Split list into equal halves"
      ],
      "commonMistakes": [
        "Handling odd vs even length (first middle vs second middle requirements)"
      ],
      "stepLogic": "1. slow = head, fast = head.\n2. While fast && fast.next: slow = slow.next, fast = fast.next.next.\n3. Return slow."
    },
    "hi": {
      "title": "Middle Node Single Pass",
      "overview": "Single pass mein linked list ka beech wala node find karna.",
      "whatItIs": "Fast 2 steps aur slow 1 step chal kar middle node nikalta hai.",
      "whyItWorks": "Fast jab 2k steps chalta hai toh slow exactly k steps par hota hai.",
      "whenToUse": "Merge sort ke liye list aadha karne mein.",
      "recognitionSignals": [
        "Middle node in one traversal"
      ],
      "commonMistakes": [
        "Even length par pehla middle chahiye ya dusra, iska dhyan na rakhna"
      ],
      "stepLogic": "1. slow = head, fast = head.\n2. fast.next tak chalao.\n3. slow return karo."
    },
    "visual": {
      "type": "LINKED_LIST",
      "category": "LINKED LIST",
      "title": "Middle Node Selection",
      "input": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "description": "Even length: Fast hits null, slow lands on second middle node 4.",
      "description_hi": "Even length list mein slow dusre middle node 4 par rukta hai.",
      "steps": [
        {
          "head": 1,
          "slow": 4,
          "fast": null,
          "explanation": "Slow points to second middle node 4",
          "explanation_hi": "Slow node 4 par hai"
        }
      ],
      "result": 4
    },
    "code": "function middleNode(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  return slow;\n}",
    "searchSignals": {
      "tags": [
        "linked-list",
        "fast-slow"
      ],
      "keywords": [
        "middle of linked list",
        "find middle node"
      ],
      "companies": [
        "Amazon",
        "Google"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Middle of the Linked List",
        "difficulty": "Easy",
        "slug": "middle-of-the-linked-list",
        "url": "https://leetcode.com/problems/middle-of-the-linked-list/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Middle of Linked List",
        "url": "https://leetcode.com/problems/middle-of-the-linked-list/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "Random Pointer": {
    "slug": "linked-list-random-pointer",
    "name": "Random Pointer",
    "topic": "Linked List",
    "difficulty": "Medium",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "interviewFrequency": "High",
    "en": {
      "title": "Copy List with Random Pointer (Interleaving Nodes)",
      "overview": "Deep copying a linked list with random pointers in O(1) auxiliary space by interleaving clone nodes.",
      "whatItIs": "Three-pass algorithm: Pass 1 interleaves copies (`A -> A' -> B -> B'`); Pass 2 sets random links (`curr.next.random = curr.random.next`); Pass 3 unweaves the lists.",
      "whyItWorks": "Interleaving nodes pairs original nodes directly with their clones without needing an auxiliary Hash Map.",
      "whenToUse": "Deep copying linked lists with arbitrary pointer graphs.",
      "recognitionSignals": [
        "Copy list with random pointer in O(1) extra memory",
        "Clone graph-like linear structure"
      ],
      "commonMistakes": [
        "Dereferencing `curr.random.next` when `curr.random` is null",
        "Failing to restore original list next pointers during unweaving"
      ],
      "stepLogic": "1. Pass 1: Insert copy node after each original node.\n2. Pass 2: Set copy.random = orig.random ? orig.random.next : null.\n3. Pass 3: Separate original and copy lists cleanly."
    },
    "hi": {
      "title": "Copy List with Random Pointer",
      "overview": "Random pointers wali list ka deep clone O(1) extra space mein banana clone nodes ko interleave karke.",
      "whatItIs": "Har original node ke aage uska clone insert karke bina HashMap ke deep copy create karna.",
      "whyItWorks": "Original node ke theek aage clone hone ki wajah se clone ka random node seedha `orig.random.next` se mil jata hai.",
      "whenToUse": "Copy List with Random Pointer problem mein.",
      "recognitionSignals": [
        "Deep copy linked list with random pointers",
        "O(1) auxiliary memory"
      ],
      "commonMistakes": [
        "curr.random null hone par check bhool jana"
      ],
      "stepLogic": "1. Har node ke aage clone node insert karo.\n2. Random pointers assign karo.\n3. Dono lists ko alag alag unweave karo."
    },
    "visual": {
      "type": "LINKED_LIST",
      "category": "LINKED LIST",
      "title": "Interleaved Cloned Nodes",
      "input": [
        "A",
        "B",
        "C"
      ],
      "description": "Pass 1 weaves: A -> A' -> B -> B' -> C -> C'. Pass 2 links random. Pass 3 splits.",
      "description_hi": "Original aur clone nodes ek ke baad ek weave hote hain.",
      "steps": [
        {
          "head": "A",
          "slow": "A'",
          "fast": "B",
          "explanation": "Weaved: A -> A' -> B -> B'",
          "explanation_hi": "Nodes weaved hue"
        },
        {
          "head": "A'",
          "slow": "B'",
          "fast": "C'",
          "explanation": "Unweaved: Cloned list A' -> B' -> C' separated successfully!",
          "explanation_hi": "Clone list cleanly separate ho gayi!"
        }
      ],
      "result": [
        "A'",
        "B'",
        "C'"
      ]
    },
    "code": "function copyRandomList(head) {\n  if (!head) return null;\n  let curr = head;\n  \n  // 1. Interleave cloned nodes\n  while (curr) {\n    const copy = { val: curr.val, next: curr.next, random: null };\n    curr.next = copy;\n    curr = copy.next;\n  }\n  \n  // 2. Assign random pointers\n  curr = head;\n  while (curr) {\n    if (curr.random) {\n      curr.next.random = curr.random.next;\n    }\n    curr = curr.next.next;\n  }\n  \n  // 3. Unweave lists\n  curr = head;\n  const dummyCopy = { val: 0, next: null };\n  let copyTail = dummyCopy;\n  while (curr) {\n    const copy = curr.next;\n    curr.next = copy.next;\n    copyTail.next = copy;\n    copyTail = copy;\n    curr = curr.next;\n  }\n  return dummyCopy.next;\n}",
    "searchSignals": {
      "tags": [
        "linked-list",
        "hash-table",
        "clone"
      ],
      "keywords": [
        "copy list with random pointer",
        "deep copy list",
        "interleaving"
      ],
      "companies": [
        "Amazon",
        "Facebook",
        "Microsoft"
      ]
    },
    "relatedCanonical": [
      {
        "title": "Copy List with Random Pointer",
        "difficulty": "Medium",
        "slug": "copy-list-with-random-pointer",
        "url": "https://leetcode.com/problems/copy-list-with-random-pointer/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode Copy Random List Editorial",
        "url": "https://leetcode.com/problems/copy-list-with-random-pointer/editorial/",
        "type": "LeetCode"
      }
    ]
  },
  "LRU Cache Concepts": {
    "slug": "linked-list-lru-cache-concepts",
    "name": "LRU Cache Concepts",
    "topic": "Linked List",
    "difficulty": "Medium",
    "timeComplexity": "O(1) get and put",
    "spaceComplexity": "O(Capacity)",
    "interviewFrequency": "Very High",
    "en": {
      "title": "LRU Cache (Doubly Linked List + Hash Map)",
      "overview": "Designing an eviction cache with O(1) lookup, insertion, and eviction using a Doubly Linked List and Hash Map.",
      "whatItIs": "The Hash Map provides O(1) node lookup by key, while the Doubly Linked List maintains recency order with O(1) node removal and prepend.",
      "whyItWorks": "Doubly linked nodes store `prev` and `next`, allowing any node to splice itself out of the list in O(1) without iterating.",
      "whenToUse": "Designing LRU Cache, implementing LFU cache, memory page replacement simulators.",
      "recognitionSignals": [
        "Least Recently Used eviction policy",
        "O(1) get and put time complexity",
        "Cache with fixed capacity"
      ],
      "commonMistakes": [
        "Forgetting to delete evicted key from Hash Map when removing tail node",
        "Broken pointer links when splicing nodes"
      ],
      "stepLogic": "1. Initialize Map and Doubly Linked List with dummy head and tail sentinels.\n2. get(key): If exists, move node to head (most recent) and return value.\n3. put(key, val): If exists, update val and move to head. If new and full, evict tail.prev and remove from map. Insert new node at head."
    },
    "hi": {
      "title": "LRU Cache (DLL + Hash Map)",
      "overview": "O(1) time mein get, put aur eviction perform karne ke liye Doubly Linked List aur Hash Map ka combination.",
      "whatItIs": "Hash Map key se direct node deta hai, aur Doubly Linked List O(1) mein node ko most recent banati hai.",
      "whyItWorks": "DLL mein node ke paas `prev` aur `next` pointers hote hain jisse bina search kiye O(1) mein node unlink ho jata hai.",
      "whenToUse": "LRU Cache design karne ke liye.",
      "recognitionSignals": [
        "LRU eviction policy",
        "O(1) get and put methods"
      ],
      "commonMistakes": [
        "Tail node evict hone ke baad Map se delete karna bhool jana"
      ],
      "stepLogic": "1. Map aur DLL (dummy head/tail) banayein.\n2. get: Node ko head par move karo aur val return karo.\n3. put: Capacity exceed hone par tail se evict karo, nayi node head par daalo."
    },
    "visual": {
      "type": "LINKED_LIST",
      "category": "LINKED LIST",
      "title": "LRU Cache Node Recency Move",
      "input": [
        "get(2)",
        "put(4, 4) evicts least recent (1)"
      ],
      "description": "Dummy Head <-> [4:4] <-> [2:2] <-> [3:3] <-> Dummy Tail. Key 1 evicted from tail.",
      "description_hi": "Most recent head ke paas rehta hai, least recent tail se nikal jata hai.",
      "steps": [
        {
          "head": "Head",
          "slow": "Node 2 moved to Head",
          "fast": "Tail",
          "explanation": "Access key 2 -> Moved directly after Head sentinel in O(1)",
          "explanation_hi": "Key 2 access hui -> Head ke theek baad move hui"
        },
        {
          "head": "Head",
          "slow": "Evict Node 1 from Tail",
          "fast": "Tail",
          "explanation": "Cache full -> Node 1 (before Tail) deleted from list and map in O(1)",
          "explanation_hi": "Node 1 tail se evict ho gayi"
        }
      ],
      "result": {
        "cacheSize": 3,
        "evicted": 1
      }
    },
    "code": "class DListNode {\n  constructor(key = 0, val = 0) {\n    this.key = key;\n    this.val = val;\n    this.prev = null;\n    this.next = null;\n  }\n}\n\nclass LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n    this.head = new DListNode();\n    this.tail = new DListNode();\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n  }\n  \n  _remove(node) {\n    node.prev.next = node.next;\n    node.next.prev = node.prev;\n  }\n  \n  _add(node) {\n    node.next = this.head.next;\n    node.prev = this.head;\n    this.head.next.prev = node;\n    this.head.next = node;\n  }\n  \n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const node = this.map.get(key);\n    this._remove(node);\n    this._add(node);\n    return node.val;\n  }\n  \n  put(key, value) {\n    if (this.map.has(key)) {\n      this._remove(this.map.get(key));\n    }\n    const node = new DListNode(key, value);\n    this._add(node);\n    this.map.set(key, node);\n    if (this.map.size > this.capacity) {\n      const lru = this.tail.prev;\n      this._remove(lru);\n      this.map.delete(lru.key);\n    }\n  }\n}",
    "searchSignals": {
      "tags": [
        "linked-list",
        "hash-table",
        "design",
        "doubly-linked-list"
      ],
      "keywords": [
        "lru cache",
        "doubly linked list",
        "cache eviction"
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
        "title": "LRU Cache",
        "difficulty": "Medium",
        "slug": "lru-cache",
        "url": "https://leetcode.com/problems/lru-cache/"
      },
      {
        "title": "LFU Cache",
        "difficulty": "Hard",
        "slug": "lfu-cache",
        "url": "https://leetcode.com/problems/lfu-cache/"
      }
    ],
    "externalResources": [
      {
        "name": "LeetCode LRU Cache Editorial",
        "url": "https://leetcode.com/problems/lru-cache/editorial/",
        "type": "LeetCode"
      }
    ]
  }
};
