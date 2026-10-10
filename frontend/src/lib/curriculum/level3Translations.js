/**
 * Revoraa Level 3: Intermediate Python Multilingual Translations
 *
 * Provides natural Hinglish (Roman script `hi-Latn`) and Hindi (Devanagari `hi`)
 * translations for core Level 3 lessons across all 8 modules.
 * Preserves Python keywords, standard library APIs, SQL syntax, and code verbatim.
 */

export const LEVEL_3_TRANSLATIONS = {
  // --- MODULE 1: ADVANCED DATA STRUCTURES ---
  'les-revisiting-core-collections': {
    'hi-Latn': {
      title: 'Python Collections Ka Deep Dive: Lists, Tuples, Sets aur Dictionaries',
      summary: 'Data structures ki underlying memory layout, mutation safety aur O(1) hash table lookup performance ko master karein.',
      learning_objectives: [
        'List dynamic resizing over-allocation factor samajhna',
        'Tuples ki immutability aur dictionary keys ki hashability jaan-na',
        'Sets aur Dicts ki O(1) average lookup complexity ko evaluate karna'
      ],
      content_markdown: `### Python Collections Ki Internal Memory Architecture

Python ke chaar primary built-in collections generic storage tools nahi hain—har ek specific memory layout aur runtime access trade-off ke liye optimize kiya gaya hai:

1. **Lists (\`list\`)**: Ye contiguous array of pointers hote hain. Jab list expand hoti hai, CPython extra amortized capacity allocate karta hai taaki har append par O(n) reallocation na karni pade.
2. **Tuples (\`tuple\`)**: Fixed-size immutable sequences. Memory lightweight hoti hai aur hashable hote hain jab tak unke saare elements bhi hashable hon.
3. **Dictionaries (\`dict\`)**: Combined compact hash table jisme keys O(1) average time mein map hoti hain. Insertion order preserve rehta hai (Python 3.7+).
4. **Sets (\`set\`)**: Hash table structure bina values ke, jo O(1) membership testing aur mathematical set operations ke liye best hai.`,
      key_takeaways: [
        'Lists mutable pointers ki arrays hain jo amortized O(1) append provide karti hain.',
        'Dictionaries aur Sets hash tables use karte hain, isliye O(1) lookups ke liye keys hashable honi chahiye.',
        'Fast lookups ke liye hamesha list ke bajaye set ya dict prefer karein.'
      ],
      revision_prompts: [
        'Python list mein `append()` aur `insert(0, val)` ki Big-O complexity mein kya antar hai?',
        'Kya ek tuple jisme list ho (`(1, [2, 3])`) dictionary ki key ban sakta hai? Kyun ya kyun nahi?'
      ]
    },
    hi: {
      title: 'पायथन कलेक्शन्स का गहन अध्ययन: सूचियाँ, टुपल्स, सेट्स और शब्दकोश',
      summary: 'डेटा संरचनाओं के अंतर्निहित मेमोरी लेआउट, उत्परिवर्तन सुरक्षा और O(1) हैश टेबल लुकअप को समझें।',
      learning_objectives: [
        'सूची के डायनेमिक रिसाइज़िंग ओवर-एलोकेशन को समझना',
        'टुपल्स की अपरिवर्तनीयता और डिक्शनरी कुंजियों की हैश योग्यता जानना',
        'सेट्स और डिक्शनरी की O(1) औसत लुकअप जटिलता का मूल्यांकन करना'
      ],
      content_markdown: `### पायथन कलेक्शन्स का आंतरिक मेमोरी लेआउट

पायथन के चार मुख्य बिल्ट-इन कलेक्शन्स विशिष्ट मेमोरी लेआउट और रनटाइम प्राथमिकताओं के अनुसार डिज़ाइन किए गए हैं:

1. **Lists (\`list\`)**: पॉइंटर्स की एक निरंतर सरणी। CPython अतिरिक्त क्षमता आवंटित करता है ताकि प्रत्येक अपेंड पर पुनः आवंटन न हो।
2. **Tuples (\`tuple\`)**: निश्चित आकार के अपरिवर्तनीय अनुक्रम। ये हल्के होते हैं और यदि तत्व हैश करने योग्य हों तो कुंजी बन सकते हैं।
3. **Dictionaries (\`dict\`)**: उच्च-प्रदर्शन हैश टेबल जो O(1) औसत समय में मान खोजते हैं और प्रविष्टि क्रम बनाए रखते हैं।
4. **Sets (\`set\`)**: बिना मानों की हैश टेबल संरचना, जो सदस्यता परीक्षण और गणितीय सेट संचालन के लिए सर्वोत्तम है।`,
      key_takeaways: [
        'सूचियाँ पॉइंटर्स की सरणियाँ हैं जो अमोर्टाइज़्ड O(1) अपेंड प्रदान करती हैं।',
        'डिक्शनरी और सेट हैश टेबल का उपयोग करते हैं, इसलिए कुंजियाँ हैश योग्य होनी चाहिए।',
        'त्वरित लुकअप के लिए हमेशा सूची के स्थान पर सेट या डिक्शनरी का उपयोग करें।'
      ],
      revision_prompts: [
        'पायथन सूची में `append()` और `insert(0, val)` की बिग-ओ जटिलता में क्या अंतर है?',
        'क्या म्यूटेबल तत्वों वाला टुपल डिक्शनरी की कुंजी बन सकता है?'
      ]
    }
  },

  'les-time-complexity-big-o': {
    'hi-Latn': {
      title: 'Intermediate Python Ke Liye Big-O Intuition',
      summary: 'Python operations ka asymptotic cost evaluate karein taaki 10,000+ records par production scripts slow na hon.',
      learning_objectives: [
        'O(1), O(log n), O(n), O(n log n), aur O(n²) operations pehchanna',
        'List `in` (O(n)) aur Set `in` (O(1)) ka benchmark farak dekhna',
        'Hidden complexity traps (nested loops, string concatenations) se bachna'
      ],
      content_markdown: `### Python Operations Ki Big-O Time Complexity

Jab data scale hota hai, algorithms ka growth rate code performance tay karta hai:

- **O(1) Constant**: Dictionary key access, Set membership lookup, List append, List index lookup.
- **O(log n) Logarithmic**: Binary search (sorted data).
- **O(n) Linear**: List membership test (\`val in my_list\`), List slicing, \`min()\`, \`max()\`, string joining.
- **O(n log n) Linearithmic**: Python built-in Timsort (\`sorted()\`, \`.sort()\`).
- **O(n²) Quadratic**: Nested list loops, loop ke andar repeated linear search.`,
      key_takeaways: [
        'Large collections mein lookup ke liye list ke bajaye set use karein (O(n) vs O(1)).',
        'Loop ke andar `+` se string concatenate na karein, balki `"".join()` use karein.',
        'Python ka built-in `sorted()` Timsort use karta hai jo O(n log n) guaranteed time deta hai.'
      ],
      revision_prompts: [
        'Loop ke andar `target in my_list` likhne par overall complexity O(n²) kyun ban jati hai?',
        'Space complexity ka matlab kya hota hai aur generator ise kaise kam karta hai?'
      ]
    },
    hi: {
      title: 'मध्यवर्ती पायथन के लिए बिग-ओ अंतर्ज्ञान (Big-O Intuition)',
      summary: 'पायथन ऑपरेशन्स की विकास दर का मूल्यांकन करें ताकि बड़े डेटासेट पर प्रदर्शन प्रभावित न हो।',
      learning_objectives: [
        'O(1), O(log n), O(n), O(n log n) और O(n²) जटिलताओं को पहचानना',
        'सूची और सेट सदस्यता लुकअप के बीच के अंतर को मापना',
        'नेस्टेड लूप्स और अप्रत्यक्ष जटिलता जाल से बचना'
      ],
      content_markdown: `### बिग-ओ समय जटिलता की बुनियादी समझ

डेटा बढ़ने पर एल्गोरिदम का व्यवहार उसकी बिग-ओ जटिलता द्वारा निर्धारित होता है:

- **O(1) स्थिरांक**: डिक्शनरी लुकअप, सेट लुकअप, सूची में अपेंड।
- **O(n) रैखिक**: सूची में खोजना (\`x in list\`), स्लाइसिंग, लूप।
- **O(n log n)**: पायथन का टिमसॉर्ट (\`sorted()\`)।
- **O(n²) द्विघात**: नेस्टेड लूप या लूप के अंदर बार-बार सूची खोजना।`,
      key_takeaways: [
        'बड़े डेटा में खोज के लिए सेट का उपयोग करें (O(1) बनाम O(n))।',
        'लूप में स्ट्रिंग जोड़ने के बजाय `"".join()` का उपयोग करें।',
        'बिल्ट-इन सॉर्टिंग एल्गोरिदम कुशल और स्थिर है।'
      ],
      revision_prompts: [
        'लूप के भीतर सूची लुकअप से कुल समय O(n²) क्यों हो जाता है?',
        'स्पेस जटिलता को न्यूनतम रखने के लिए क्या तकनीकें हैं?'
      ]
    }
  },

  // --- MODULE 2: ITERATORS AND GENERATORS ---
  'les-iterable-vs-iterator': {
    'hi-Latn': {
      title: 'Iterable vs Iterator: Iteration Protocol Ko Master Karein',
      summary: 'Seekhein kaise Python ke for loops background mein __iter__() aur __next__() dunder methods call karte hain.',
      learning_objectives: [
        'Iterable (jisse iterator create hota hai) aur Iterator (jo state track karta hai) ka farak samajhna',
        'Iterator exhaustion aur StopIteration exception lifecycle dekhna',
        'Custom classes par iterator protocol implement karna'
      ],
      content_markdown: `### The Iteration Protocol: iter() aur next()

Python mein iteration do protocols par chalti hai:

1. **Iterable**: Koi bhi object jo \`__iter__()\` method implement kare aur ek iterator return kare (jaise lists, strings, dictionaries).
2. **Iterator**: Ek stateful object jo \`__next__()\` method implement karta hai aur har call par agla item yield karta hai, ant mein \`StopIteration\` raise karta hai.`,
      key_takeaways: [
        'For-loop background mein pehle `iter(obj)` call karta hai phir `next(it)` tab tak jab tak `StopIteration` na aaye.',
        'Iterators single-use hote hain; ek baar exhaust hone ke baad dobara reset nahi hote.',
        'Har iterator ek iterable hota hai, lekin har iterable iterator nahi hota.'
      ],
      revision_prompts: [
        'List aur List-Iterator ke beech mein kya farak hota hai?',
        'Jab iterator exhaust ho jata hai toh agla `next()` call kya karta hai?'
      ]
    },
    hi: {
      title: 'इटरेबल बनाम इटरेटर: इटरेशन प्रोटोकॉल की महारत',
      summary: 'जानिए कैसे पायथन लूप पृष्ठभूमि में __iter__() और __next__() विधियों का उपयोग करते हैं।',
      learning_objectives: [
        'इटरेबल और इटरेटर के बीच अंतर को स्पष्ट रूप से समझना',
        'इटरेटर समाप्ति और StopIteration जीवनचक्र को देखना',
        'कस्टम कक्षाओं पर इटरेशन प्रोटोकॉल लागू करना'
      ],
      content_markdown: `### इटरेशन प्रोटोकॉल का कार्य सिद्धांत

पायथन में इटरेशन दो घटकों पर निर्भर करता है:

1. **Iterable**: कोई भी ऑब्जेक्ट जो \`__iter__()\` लागू करता है और इटरेटर देता है (जैसे सूचियाँ, टुपल्स)।
2. **Iterator**: एक स्थिति बनाए रखने वाला ऑब्जेक्ट जो \`__next__()\` लागू करता है और अंत में \`StopIteration\` उठाता है।`,
      key_takeaways: [
        'लूप्स पर्दे के पीछे `iter()` और `next()` का उपयोग करते हैं।',
        'इटरेटर एक बार समाप्त होने के बाद मान नहीं लौटाते।',
        'कस्टम डेटा संरचनाओं पर कस्टम इटरेटर बनाए जा सकते हैं।'
      ],
      revision_prompts: [
        'इटरेबल और इटरेटर में क्या मौलिक अंतर है?',
        'StopIteration त्रुटि लूप को कैसे समाप्त करती है?'
      ]
    }
  },

  'les-generator-functions-yield': {
    'hi-Latn': {
      title: 'Generator Functions aur yield Keyword',
      summary: 'Functions ko suspendable pipelines mein convert karein jo values ko on-demand lazy generate karti hain.',
      learning_objectives: [
        'yield aur return ke execution difference ko master karna',
        'Function frame suspension aur state preservation samajhna',
        'Gigabytes of records ko constant memory mein process karna'
      ],
      content_markdown: `### Generator Functions: Memory-Efficient Lazy Streams

Jab kisi function mein \`yield\` keyword aata hai, toh Python use normal function ke bajaye **Generator Function** bana deta hai.

- Normal function ek baar \`return\` karke apna execution frame destroy kar deta hai.
- Generator function har \`yield\` par caller ko value bhejta hai aur apna local scope aur instruction pointer **freeze** kar deta hai. Agle \`next()\` par execution theek wahi se resume hota hai!`,
      key_takeaways: [
        'Yield execution ko suspend karta hai aur local variables ki state preserve rakhta hai.',
        'Generators lazy evaluation use karte hain, isliye memory O(1) rehti hai chahe million rows hon.',
        'Data pipelines ke liye generators standard industry pattern hain.'
      ],
      revision_prompts: [
        '`return` aur `yield` mein execution lifecycle ke hisaab se kya farak hai?',
        'Kyun generator function call karne par code turant execute nahi hota?'
      ]
    },
    hi: {
      title: 'जनरेटर फ़ंक्शंस और yield कीवर्ड',
      summary: 'फ़ंक्शंस को आलसी (lazy) डेटा पाइपलाइनों में बदलें जो मांग पर मान उत्पन्न करते हैं।',
      learning_objectives: [
        'yield और return के बीच निष्पादन अंतर को समझना',
        'फ़ंक्शन स्थिति के निलंबन और पुनरारंभ को देखना',
        'न्यूनतम मेमोरी में विशाल डेटा स्ट्रीम को प्रोसेस करना'
      ],
      content_markdown: `### जनरेटर फ़ंक्शंस और लेज़ी इवैल्यूएशन

जब किसी फ़ंक्शन में \`yield\` होता है, तो वह एक जनरेटर बन जाता है:

- सामान्य फ़ंक्शन रिटर्न के बाद समाप्त हो जाता है।
- जनरेटर फ़ंक्शन \`yield\` पर मान लौटाता है और अपनी आंतरिक स्थिति को रोक देता है। अगली कॉल पर निष्पादन वहीं से आगे बढ़ता है।`,
      key_takeaways: [
        'yield स्थिति को बनाए रखते हुए मान लौटाता है।',
        'जनरेटर बड़े डेटासेट के लिए स्मृति-कुशल O(1) समाधान हैं।',
        'डेटा प्रोसेसिंग पाइपलाइनों के लिए अत्यंत उपयोगी।'
      ],
      revision_prompts: [
        'yield और return के जीवनचक्र में क्या अंतर है?',
        'जनरेटर से मेमोरी ओवरहेड कैसे कम होता है?'
      ]
    }
  },

  // --- MODULE 3: FUNCTIONS, CLOSURES, AND DECORATORS ---
  'les-first-class-functions': {
    'hi-Latn': {
      title: 'Functions As First-Class Citizens',
      summary: 'Python mein functions ko objects ki tarah treat karein: variables mein assign karein, arguments ki tarah pass karein, aur return karein.',
      learning_objectives: [
        'First-class citizen concept aur runtime representation samajhna',
        'Functions ko data structures mein store karna',
        'Higher-order functions (functions taking/returning functions) likhna'
      ],
      content_markdown: `### Python Mein Functions Objects Hain

Python mein functions first-class objects hote hain:
1. Unka type \`function\` hota hai aur heap par memory allocate hoti hai.
2. Unhe variables ko assign kiya ja sakta hai (\`f = my_func\`).
3. Unhe doosre functions ko arguments ke roop mein pass kiya ja sakta hai.
4. Unhe functions ke andar se return kiya ja sakta hai.`,
      key_takeaways: [
        'Function definitions executable code objects banati hain.',
        'Functions ko arguments ki tarah pass karke generic reusable abstractions banaye ja sakte hain.',
        'Higher-order functions decorators aur callback architectures ka base hain.'
      ],
      revision_prompts: [
        '`my_func` aur `my_func()` mein kya antar hai?',
        'Higher-order function kise kehte hain?'
      ]
    },
    hi: {
      title: 'फ़ंक्शंस प्रथम श्रेणी के ऑब्जेक्ट के रूप में',
      summary: 'पायथन में फ़ंक्शंस को अन्य मानों की तरह उपयोग करें: चरों में असाइन करें, तर्कों के रूप में पास करें और वापस लौटाएं।',
      learning_objectives: [
        'प्रथम श्रेणी के नागरिक की अवधारणा को समझना',
        'फ़ंक्शंस को डेटा संरचनाओं में संग्रहीत करना',
        'उच्च-स्तरीय फ़ंक्शंस (Higher-Order Functions) का निर्माण'
      ],
      content_markdown: `### पायथन में फ़ंक्शन ऑब्जेक्ट्स

पायथन में प्रत्येक फ़ंक्शन एक पूर्ण ऑब्जेक्ट है:
1. उन्हें सामान्य चरों में असाइन किया जा सकता है।
2. उन्हें अन्य फ़ंक्शंस में तर्कों के रूप में भेजा जा सकता है।
3. उन्हें अन्य फ़ंक्शंस से परिणाम के रूप में वापस किया जा सकता है।`,
      key_takeaways: [
        'फ़ंक्शंस अन्य मानों की तरह ही मेमोरी में ऑब्जेक्ट होते हैं।',
        'उच्च-स्तरीय फ़ंक्शंस शक्तिशाली अमूर्तता प्रदान करते हैं।',
        'यह अवधारणा डेकोरेटर्स की नींव है।'
      ],
      revision_prompts: [
        '`fn` (संदर्भ) और `fn()` (कॉल) में क्या अंतर है?',
        'उच्च-स्तरीय फ़ंक्शन का एक व्यावहारिक उदाहरण क्या है?'
      ]
    }
  },

  'les-understanding-decorators': {
    'hi-Latn': {
      title: 'Decorators: Higher-Order Function Wrapping',
      summary: 'Syntactic sugar `@decorator` ko master karein aur functions ko bina modify kiye unka behavior extend karein.',
      learning_objectives: [
        'Decorator syntax `@dec` ko samjhna jo `func = dec(func)` hota hai',
        'Wrapper function signature aur `*args, **kwargs` forwarding implement karna',
        'Metadata preserve karne ke liye `functools.wraps` use karna'
      ],
      content_markdown: `### Decorator Pattern Ka Core Logic

Decorator ek function hota hai jo doosre function ko input leta hai, uska behavior wrap karta hai, aur naya wrapper function return karta hai:

\`\`\`python
@my_decorator
def greet():
    ...

# Background translation:
greet = my_decorator(greet)
\`\`\`

Wrapper function ko hamesha \`*args, **kwargs\` accept karne chahiye aur original function ka result \`return\` karna chahiye.`,
      key_takeaways: [
        '@decorator syntax `func = decorator(func)` ke barabar hota hai.',
        'Wrapper ko *args, **kwargs accept aur pass karna chahiye.',
        'functools.wraps se __name__ aur docstrings preserve rehti hain.'
      ],
      revision_prompts: [
        'Agar wrapper function mein `return` na likhein toh kya bug hoga?',
        '`functools.wraps` use karna kyun standard best practice hai?'
      ]
    },
    hi: {
      title: 'डेकोरेटर्स (Decorators): फ़ंक्शन रैपिंग पैटर्न',
      summary: 'बिना मूल कोड बदले फ़ंक्शंस के व्यवहार को संशोधित और विस्तारित करने की तकनीक सीखें।',
      learning_objectives: [
        '@decorator सिंटैक्स के आंतरिक कार्य को समझना',
        'रैपर फ़ंक्शंस में तर्कों को अग्रेषित करना',
        'मेटाडेटा संरक्षण के लिए `functools.wraps` का उपयोग'
      ],
      content_markdown: `### डेकोरेटर का कार्य सिद्धांत

डेकोरेटर एक ऐसा फ़ंक्शन है जो दूसरे फ़ंक्शन को स्वीकार करता है, उसका विस्तार करता है और एक नया रैपर लौटाता है:

\`\`\`python
@my_decorator
def greet():
    pass
# समान है: greet = my_decorator(greet)
\`\`\``,
      key_takeaways: [
        '@ सिंटैक्स फ़ंक्शन रीअसाइनमेंट का सिंटैक्टिक शुगर है।',
        'रैपर को सामान्य तर्कों के लिए *args, **kwargs का उपयोग करना चाहिए।',
        '`functools.wraps` मूल फ़ंक्शन की पहचान बनाए रखता है।'
      ],
      revision_prompts: [
        'रैपर में रिटर्न स्टेटमेंट छोड़ देने पर क्या परिणाम होगा?',
        '`functools.wraps` क्यों आवश्यक है?'
      ]
    }
  },

  // --- MODULE 5: HTTP, APIS, AND JSON ---
  'les-http-rest-foundations': {
    'hi-Latn': {
      title: 'HTTP, REST APIs aur JSON Foundations',
      summary: 'HTTP protocol, REST principles, status codes aur structured JSON payloads ko master karein.',
      learning_objectives: [
        'Client-Server model, request-response cycle aur statelessness samajhna',
        'REST verbs (GET, POST, PUT, DELETE) aur status code families (2xx, 4xx, 5xx) jaan-na',
        'JSON data format aur Python dictionaries ke beech serialization evaluate karna'
      ],
      content_markdown: `### Modern Web APIs Ka Foundation

REST (Representational State Transfer) internet applications ka standard communication protocol hai:
- **HTTP Methods**: GET (read), POST (create), PUT (replace), PATCH (update), DELETE (remove).
- **Status Codes**: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Error.
- **Data Exchange**: JSON (JavaScript Object Notation) universal lightweight text format hai jo Python dicts aur lists se map hota hai.`,
      key_takeaways: [
        'HTTP stateless protocol hai jisme har request independent hoti hai.',
        'Idempotent methods (GET, PUT, DELETE) baar-baar run karne par same end-state generate karte hain.',
        'JSON strings ko Python data structures mein convert karne ke liye `json.loads()` use hota hai.'
      ],
      revision_prompts: [
        '400 Client Error aur 500 Server Error mein kya farak hota hai?',
        'Idempotent method kise kehte hain aur POST idempotent kyun nahi hota?'
      ]
    },
    hi: {
      title: 'HTTP, REST APIs और JSON की बुनियादी समझ',
      summary: 'क्लाइंट-सर्वर संचार, REST आर्किटेक्चर, स्टेटस कोड और डेटा एक्सचेंज को समझें।',
      learning_objectives: [
        'क्लाइंट-सर्वर मॉडल और अनुरोध-प्रतिक्रिया चक्र को समझना',
        'REST विधियों और स्टेटस कोड श्रेणियों को जानना',
        'JSON फॉर्मेट और पायथन डेटा संरचनाओं के बीच रूपांतरण'
      ],
      content_markdown: `### आधुनिक वेब एपीआई का आधार

REST इंटरनेट पर सेवाओं को जोड़ने का मानक आर्किटेक्चरल दृष्टिकोण है:
- **विधियाँ (Methods)**: GET, POST, PUT, DELETE आदि।
- **स्थिति कोड (Status Codes)**: 2xx (सफलता), 4xx (क्लाइंट त्रुटि), 5xx (सर्वर त्रुटि)।
- **JSON**: हल्का, पाठ-आधारित डेटा प्रारूप जो पायथन शब्दकोशों से मेल खाता है।`,
      key_takeaways: [
        'HTTP एक स्टेटलेस प्रोटोकॉल है।',
        'स्टेटस कोड अनुरोध के परिणाम का स्पष्ट संकेत देते हैं।',
        'JSON डेटा को पायथन में आसानी से पार्स किया जा सकता है।'
      ],
      revision_prompts: [
        '404 Not Found और 500 Internal Server Error में क्या अंतर है?',
        'GET और POST विधियों के उपयोग के मामले क्या हैं?'
      ]
    }
  },

  // --- MODULE 6: DATABASE INTEGRATION ---
  'les-sqlite-python-connection': {
    'hi-Latn': {
      title: 'Python Aur SQLite: Relational Database Integration',
      summary: 'Python ke built-in sqlite3 module se relational databases connect, configure aur query karna seekhein.',
      learning_objectives: [
        'Embedded SQLite database engine aur standard `sqlite3` driver samajhna',
        'Connections, Cursors aur SQL execution lifecycle implement karna',
        'Context managers aur connection isolation se resource leaks prevent karna'
      ],
      content_markdown: `### SQLite: Serverless Relational Database

SQLite ek embedded relational database hai jo Python ke standard library (\`import sqlite3\`) mein built-in aata hai:
- Kisi alag database server process ki zaroorat nahi hoti.
- Ye file-based ya in-memory (\`":memory:"\`) database create karta hai jo unit testing ke liye perfect hai.
- \`conn.cursor()\` se queries execute hoti hain aur results fetch kiye ja sakte hain (\`fetchone()\`, \`fetchall()\`).`,
      key_takeaways: [
        'SQLite zero-configuration file-based relational engine hai.',
        'In-memory databases (`:memory:`) lightning-fast tests ke liye best hain.',
        'Hamesha connection close karein ya context manager use karein resource leaks se bachne ke liye.'
      ],
      revision_prompts: [
        'Cursor object ka kya role hota hai database queries execute karte waqt?',
        'In-memory SQLite database (`:memory:`) kab use karna chahiye?'
      ]
    },
    hi: {
      title: 'पायथन और SQLite: रिलेशनल डेटाबेस एकीकरण',
      summary: 'पायथन के अंतर्निहित sqlite3 मॉड्यूल के साथ डेटाबेस को जोड़ना, तालिकाओं का निर्माण और डेटा का प्रबंधन सीखें।',
      learning_objectives: [
        'एंबेडेड SQLite डेटाबेस और sqlite3 ड्राइवर को समझना',
        'कनेक्शन और कर्सर जीवनचक्र को लागू करना',
        'संसाधन रिसाव को रोकने के लिए संदर्भ प्रबंधकों का उपयोग'
      ],
      content_markdown: `### SQLite: सर्वर रहित रिलेशनल डेटाबेस

SQLite एक शक्तिशाली एम्बेडेड डेटाबेस है जो पायथन के साथ आता है:
- किसी अलग डेटाबेस सर्वर की आवश्यकता नहीं होती।
- यह फ़ाइल आधारित या मेमोरी आधारित (\`":memory:"\`) डेटाबेस का समर्थन करता है।
- कर्सर प्रश्नों को निष्पादित करने और परिणाम प्राप्त करने के लिए हैंडलर प्रदान करता है।`,
      key_takeaways: [
        'SQLite बिना किसी सर्वर सेटअप के रिलेशनल कार्यक्षमता प्रदान करता है।',
        'मेमोरी डेटाबेस तीव्र और पृथक परीक्षणों के लिए उत्कृष्ट हैं।',
        'हमेशा कनेक्शन को सुरक्षित रूप से बंद करें।'
      ],
      revision_prompts: [
        'कर्सर और कनेक्शन ऑब्जेक्ट में क्या अंतर है?',
        'SQLite में इन-मेमोरी डेटाबेस के क्या फायदे हैं?'
      ]
    }
  },

  'les-parameterized-queries-security': {
    'hi-Latn': {
      title: 'Parameterized Queries: SQL Injection Se Suraksha',
      summary: 'String formatting vulnerability ko samjhein aur parameterized queries se secure database interactions implement karein.',
      learning_objectives: [
        'SQL Injection attack vector aur malicious payload execution dekhna',
        'String concatenation ya f-strings se SQL queries banane ka danger samajhna',
        'Placeholders (`?`) use karke parameterized queries execute karna'
      ],
      content_markdown: `### SQL Injection: The #1 Database Vulnerability

Agar aap user input ko directly SQL query mein string format karte hain:
\`\`\`python
# DANGEROUS VULNERABILITY!
query = f"SELECT * FROM users WHERE email = '{user_input}'"
\`\`\`
Attacker input mein \`' OR '1'='1\` pass karke authentication bypass kar sakta hai ya data drop kar sakta hai!

**Solution**: Hamesha parameterized queries use karein jisme driver data aur command ko separate channels par send karta hai:
\`\`\`python
# SECURE AND PROFESSIONAL
cursor.execute("SELECT * FROM users WHERE email = ?", (user_input,))
\`\`\``,
      key_takeaways: [
        'Kabhi bhi f-strings ya % se SQL queries format na karein.',
        'Parameterized queries mein input string ko SQL command ke roop mein execute nahi hone diya jata.',
        'Params hamesha tuple ya list ke roop mein pass karein.'
      ],
      revision_prompts: [
        'SQL injection attack kaise kaam karta hai?',
        'Parameterized query mein driver input data ko malicious SQL command banne se kaise rokta hai?'
      ]
    },
    hi: {
      title: 'पैरामीटरयुक्त प्रश्न (Parameterized Queries) और सुरक्षा',
      summary: 'एसक्यूएल इंजेक्शन के खतरों को समझें और सुरक्षित क्वेरी निष्पादन सुनिश्चित करें।',
      learning_objectives: [
        'एसक्यूएल इंजेक्शन हमलों के तंत्र को समझना',
        'स्ट्रिंग कॉनकेटनेशन के खतरों की पहचान करना',
        'प्लेसहोल्डर्स (`?`) के साथ सुरक्षित प्रश्न लिखना'
      ],
      content_markdown: `### एसक्यूएल इंजेक्शन से सुरक्षा

यूज़र इनपुट को सीधे एसक्यूएल स्ट्रिंग में जोड़ने से विनाशकारी सुरक्षा कमजोरियाँ उत्पन्न होती हैं।

**सुरक्षित दृष्टिकोण**: प्लेसहोल्डर का उपयोग करें ताकि डेटा और कमांड अलग-अलग संसाधित हों:
\`\`\`python
# सुरक्षित दृष्टिकोण
cursor.execute("SELECT * FROM users WHERE email = ?", (user_input,))
\`\`\``,
      key_takeaways: [
        'एसक्यूएल क्वेरीज़ में कभी भी f-strings का उपयोग न करें।',
        'पैरामीटरयुक्त क्वेरी डेटा को कोड के रूप में निष्पादित होने से रोकती हैं।',
        'हमेशा टुपल प्रारूप में मान पास करें।'
      ],
      revision_prompts: [
        'एसक्यूएल इंजेक्शन से डेटाबेस कैसे खतरे में पड़ सकता है?',
        'प्लेसहोल्डर्स कोड और डेटा को कैसे अलग रखते हैं?'
      ]
    }
  }
};
