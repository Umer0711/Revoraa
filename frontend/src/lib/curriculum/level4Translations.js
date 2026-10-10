/**
 * Revoraa Level 4: Advanced Python Multilingual Translations
 *
 * Provides natural Hinglish (Roman script `hi-Latn`) and Hindi (Devanagari `hi`)
 * translations for core Level 4 lessons across all 8 modules.
 * Preserves Python keywords, asyncio APIs, concurrency primitives, typing protocols, and code verbatim.
 */

export const LEVEL_4_TRANSLATIONS = {
  // ─── MODULE 1: Advanced Python Internals and Resource Management ─────────────
  'les-l4-revisiting-execution-model': {
    'hi-Latn': {
      title: 'Python Execution Model Ka Deep Dive: CPython, Frames aur PyObject',
      summary: 'CPython ke internal virtual machine loop, PyObject headers aur stack frame evaluation ko master karein.',
      learning_objectives: [
        'CPython Virtual Machine (PVM) loop aur bytecode dispatch samajhna',
        'PyObject memory structure: ob_refcnt aur ob_type ki importance jaan-na',
        'Stack frames aur bytecode evaluation tracing visualize karna'
      ],
      content_markdown: `### CPython Ka Virtual Machine Architecture

Jab Python aapka code run karta hai, toh har variable aur value C level par ek \`PyObject\` structure hota hai:

\`\`\`c
// CPython internal structure (Include/object.h)
typedef struct _object {
    _PyObject_HEAD_EXTRA
    Py_ssize_t ob_refcnt;          // Reference counter (GC ke liye)
    struct _typeobject *ob_type;   // Pointer to Python type object
} PyObject;
\`\`\`

1. **ob_refcnt**: Ye track karta hai ki kitne variables is object ko point kar rahe hain. Jaise hi ye 0 hota hai, memory turant deallocate ho sakti hai.
2. **ob_type**: Isse Python ko runtime par pata chalta hai ki object integer hai, string hai, ya custom class.
3. **PVM Evaluation Loop**: CPython \`_PyEval_EvalFrameDefault\` function ke andar ek giant switch/computed-goto loop chalata hai jo bytecodes ko read karta hai.`,
      key_takeaways: [
        'Python mein har cheez ek PyObject pointer hai jisme reference counter aur type pointer hota hai.',
        'Bytecode platform-independent intermediate language hai jo PVM loop mein execute hoti hai.',
        'sys.getrefcount() temporary reference add karta hai, isliye expected se 1 zyada count return hota hai.'
      ],
      revision_prompts: [
        'PyObject header mein ob_refcnt ka role kya hai?',
        'Python 3.12+ mein adaptive bytecode specialization kaise execution speed badhata hai?'
      ]
    },
    hi: {
      title: 'पायथन निष्पादन मॉडल का गहन अध्ययन: CPython, फ्रेम्स और PyObject',
      summary: 'CPython के आंतरिक वर्चुअल मशीन लूप, PyObject हेडर और स्टैक फ़्रेम मूल्यांकन को समझें।',
      learning_objectives: [
        'CPython वर्चुअल मशीन लूप और बाइटकोड प्रेषण को समझना',
        'PyObject मेमोरी संरचना: ob_refcnt और ob_type का महत्व जानना',
        'स्टैक फ़्रेम और बाइटकोड मूल्यांकन का विज़ुअलाइज़ेशन'
      ],
      content_markdown: `### CPython की आंतरिक वर्चुअल मशीन संरचना

जब पायथन कोड निष्पादित करता है, तो मेमोरी में प्रत्येक मान C स्तर पर एक \`PyObject\` संरचना होता है।

- **ob_refcnt**: यह ट्रैक करता है कि कितने पॉइंटर्स इस ऑब्जेक्ट का संदर्भ दे रहे हैं। 0 होते ही मेमोरी तुरंत मुक्त हो जाती है।
- **ob_type**: यह रनटाइम प्रकार की जानकारी प्रदान करता है।
- **PVM लूप**: CPython बाइटकोड को एक अनुकूलित लूप में व्याख्यायित करता है।`,
      key_takeaways: [
        'पायथन में सब कुछ एक PyObject है जिसमें संदर्भ गणना और प्रकार सूचक होता है।',
        'बाइटकोड PVM लूप में निष्पादित होता है।',
        'sys.getrefcount() एक अस्थायी संदर्भ जोड़ता है।'
      ],
      revision_prompts: [
        'PyObject संरचना में ob_refcnt की क्या भूमिका है?',
        'पायथन में बाइटकोड और मशीन कोड में क्या अंतर है?'
      ]
    }
  },

  'les-l4-custom-context-managers': {
    'hi-Latn': {
      title: 'Custom Context Managers: __enter__, __exit__ aur contextlib',
      summary: 'Production-ready context managers banayein jo deterministic resource allocation aur clean exception cleanup guarantee karein.',
      learning_objectives: [
        'Class-based __enter__ aur __exit__ dunder protocol implement karna',
        'Exception suppression mechanics (return True) ko samajhna',
        '@contextlib.contextmanager generator pattern master karna'
      ],
      content_markdown: `### Context Manager Protocol Ka Anatomy

Resource cleanup ko bulletproof banane ke liye Python context manager protocol provide karta hai:

\`\`\`python
class ManagedResource:
    def __enter__(self):
        # Resource acquire karein
        return resource

    def __exit__(self, exc_type, exc_val, exc_tb):
        # Resource release karein
        # Agar exc_type ko swallow karna hai toh return True, warna False/None
        return False
\`\`\`

Agar \`__exit__\` \`True\` return kare, toh \`with\` block ke andar utha exception suppress ho jata hai. Agar \`False\` ya \`None\` return kare, toh exception normal tarike se bubble up hota hai.`,
      key_takeaways: [
        '__exit__ ko chaar arguments milte hain: self, exc_type, exc_val, exc_tb.',
        '__exit__ se True return karne par exception suppress ho jata hai; False par propagate hota hai.',
        'contextlib.contextmanager generator function ko clean context manager mein convert karta hai.'
      ],
      revision_prompts: [
        '__exit__ kab True return karna chahiye aur kab False?',
        'Generator-based context manager mein finally block ka execute hona kyun guaranteed hota hai?'
      ]
    },
    hi: {
      title: 'कस्टम संदर्भ प्रबंधक: __enter__, __exit__ और contextlib',
      summary: 'संसाधनों के सुरक्षित और स्वचालित प्रबंधन के लिए कस्टम संदर्भ प्रबंधक बनाएं।',
      learning_objectives: [
        'क्लास-आधारित __enter__ और __exit__ प्रोटोकॉल लागू करना',
        'अपवाद दमन तंत्र (return True) को समझना',
        '@contextlib.contextmanager जनरेटर पैटर्न में महारत हासिल करना'
      ],
      content_markdown: `### संदर्भ प्रबंधक प्रोटोकॉल

संसाधन रिसाव को रोकने के लिए पायथन में \`with\` स्टेटमेंट का उपयोग किया जाता है।
\`__enter__\` विधि संसाधन शुरू करती है और \`__exit__\` विधि ब्लॉक समाप्त होने पर सफाई सुनिश्चित करती है।`,
      key_takeaways: [
        '__exit__ अपवाद विवरण प्राप्त करता है और सफाई सुनिश्चित करता है।',
        'True लौटाने से अपवाद दब जाता है; False पर अपवाद आगे बढ़ता है।',
        '@contextlib.contextmanager जनरेटर को संदर्भ प्रबंधक में बदल देता है।'
      ],
      revision_prompts: [
        '__exit__ विधि में अपवाद को कब दबाना चाहिए?'
      ]
    }
  },

  // ─── MODULE 2: Asynchronous Programming with asyncio ─────────────────────────
  'les-l4-coroutines-async-await': {
    'hi-Latn': {
      title: 'Coroutines, async aur await Ki Internal Working',
      summary: 'Seekhein kaise async def coroutines generate karta hai aur await keyword control wapas event loop ko yield karta hai.',
      learning_objectives: [
        'async def functions aur coroutine objects ke beech farak samajhna',
        'await suspension points aur cooperative multitasking ka flow jaan-na',
        'asyncio.run() se root event loop lifecycle manage karna'
      ],
      content_markdown: `### Coroutines Ka Cooperative Multitasking Model

Normal function call stack frame par tab tak rehta hai jab tak return na ho jaye. Lekin ek **coroutine** \`await\` keyword par apni execution pause kar sakta hai:

\`\`\`python
async def fetch_data():
    print("Starting I/O...")
    await asyncio.sleep(1.0) # Control event loop ko de diya!
    print("Resumed!")
    return 42
\`\`\`

Jab coroutine suspend hota hai, event loop doosre ready tasks ko run kar sakta hai. Isse ek single thread par hazaron concurrent I/O operations efficiently handle ho jate hain!`,
      key_takeaways: [
        'async def function call karne par sirf coroutine object banta hai; execution start nahi hoti.',
        'await expression execution ko suspend karke event loop ko control wapas de deta hai.',
        'Coroutines cooperative multitasking par chalte hain: agar koi task CPU block karega toh baaki sab pause ho jayenge.'
      ],
      revision_prompts: [
        'Agar async function mein bina await ke normal time.sleep() call karein toh kya hoga?'
      ]
    },
    hi: {
      title: 'कोरोटिन, async और await की आंतरिक कार्यप्रणाली',
      summary: 'जानें कि कैसे async def कोरोटिन बनाता है और await इवेंट लूप को नियंत्रण सौंपता है।',
      learning_objectives: [
        'async def और सामान्य फ़ंक्शंस के बीच अंतर समझना',
        'सहकारी मल्टीटास्किंग और await निलंबन बिंदुओं को जानना',
        'इवेंट लूप का जीवनचक्र प्रबंधित करना'
      ],
      content_markdown: `### कोरोटिन और इवेंट लूप

कोरोटिन विशेष पायथन फ़ंक्शन हैं जो निष्पादन को रोक सकते हैं और बाद में फिर से शुरू कर सकते हैं। \`await\` कीवर्ड इवेंट लूप को अन्य कार्यों को संसाधित करने की अनुमति देता है।`,
      key_takeaways: [
        'async def कोरोटिन ऑब्जेक्ट लौटाता है।',
        'await निष्पादन को निलंबित करता है और नियंत्रण वापस देता है।',
        'अतुल्यकालिक कोड में अवरोधक कॉल से बचें।'
      ],
      revision_prompts: [
        'कोरोटिन में time.sleep() का उपयोग करना हानिकारक क्यों है?'
      ]
    }
  },

  'les-l4-asyncio-gather-taskgroups': {
    'hi-Latn': {
      title: 'asyncio.gather() aur Structured Concurrency: TaskGroups',
      summary: 'Multiple coroutines ko concurrently orchestrate karein aur Python 3.11+ asyncio.TaskGroup se leak-free structured concurrency payein.',
      learning_objectives: [
        'asyncio.gather() se multiple coroutines ko parallel wait karna',
        'return_exceptions=True ka importance exceptions swallow kiye bina samajhna',
        'Python 3.11+ asyncio.TaskGroup aur ExceptionGroup modern standard use karna'
      ],
      content_markdown: `### asyncio.gather() vs asyncio.TaskGroup

Concurrent tasks ko schedule karne ke do primary approaches hain:

1. **asyncio.gather(*coros)**: Multiple coroutines ko ek saath await karta hai aur results ko input order mein return karta hai.
   - Tip: \`return_exceptions=True\` pass karein taaki ek task crash hone par baaki tasks ke results lost na hon!
2. **asyncio.TaskGroup() (Python 3.11+)**: Structured concurrency provide karta hai. Agar koi child task fail hota hai, toh TaskGroup baaki running sibling tasks ko automatically cancel kar deta hai aur \`ExceptionGroup\` raise karta hai.`,
      key_takeaways: [
        'asyncio.gather() concurrent I/O operations ka results list order mein preserve karta hai.',
        'Production mein return_exceptions=True use karein taaki failure handling isolated rahe.',
        'Python 3.11+ TaskGroup structured task lifecycles ke liye recommended modern standard hai.'
      ],
      revision_prompts: [
        'TaskGroup use karte waqt agar ek task fail ho jaye toh baaki tasks ka kya hota hai?'
      ]
    },
    hi: {
      title: 'asyncio.gather() और संरचित समवर्तीता: TaskGroups',
      summary: 'एकाधिक कोरोटिन को समवर्ती रूप से निष्पादित करें और आधुनिक टास्कग्रुप का उपयोग करें।',
      learning_objectives: [
        'asyncio.gather का उपयोग करके एक साथ प्रतीक्षा करना',
        'return_exceptions=True के साथ अपवाद प्रबंधन',
        'पायथन 3.11+ asyncio.TaskGroup का उपयोग'
      ],
      content_markdown: `### संरचित समवर्तीता (Structured Concurrency)

\`asyncio.gather\` कई कार्यों को एक साथ चलाता है। पायथन 3.11 में पेश किया गया \`TaskGroup\` यह सुनिश्चित करता है कि यदि कोई कार्य विफल हो जाता है, तो अन्य सभी कार्य सुरक्षित रूप से रद्द हो जाएं।`,
      key_takeaways: [
        'asyncio.gather समानांतर परिणामों को एकत्रित करता है।',
        'TaskGroup स्वचालित रूप से कार्य रद्द करने का प्रबंधन करता है।',
        'ExceptionGroup कई समवर्ती त्रुटियों को एक साथ बंडल करता है।'
      ],
      revision_prompts: [
        'TaskGroup पारंपरिक gather() से अधिक सुरक्षित क्यों है?'
      ]
    }
  },

  // ─── MODULE 3: Threads, Processes, and Concurrency ───────────────────────────
  'les-l4-concurrency-vs-parallelism': {
    'hi-Latn': {
      title: 'Concurrency vs Parallelism: Hardware aur Execution Models',
      summary: 'Interleaved execution aur true simultaneous multi-core execution ke farak ko crystal clear karein.',
      learning_objectives: [
        'Concurrency (structure) aur Parallelism (execution) mein farak samajhna',
        'CPython Global Interpreter Lock (GIL) ka hardware implications jaan-na',
        'I/O-bound aur CPU-bound workloads ke liye correct architecture choose karna'
      ],
      content_markdown: `### Concurrency vs Parallelism

Rob Pike ne famous quote diya tha: *"Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once."*

- **Concurrency**: Ek single CPU core fast time-slicing ke zariye multiple tasks ke beech switch karta hai. Illusion milta hai ki sab ek saath chal raha hai.
- **Parallelism**: Multiple physical CPU cores par multiple threads/processes sach me ek hi microsecond mein simultaneous execute hote hain.

CPython mein **GIL (Global Interpreter Lock)** ki wajah se ek interpreter process ke andar sirf ek thread hi Python bytecode execute kar sakta hai. Isliye CPU-bound tasks ke liye \`multiprocessing\` zaroori hota hai!`,
      key_takeaways: [
        'Concurrency code ki structural capability hai; Parallelism hardware multi-core execution hai.',
        'CPython GIL pure Python threads ko simultaneous multi-core parallelism achieve karne se rokta hai.',
        'I/O-bound ke liye asyncio ya threads best hain; CPU-bound ke liye multiprocessing best hai.'
      ],
      revision_prompts: [
        'Kya single-core CPU par parallelism achieve kiya ja sakta hai? Kyun ya kyun nahi?'
      ]
    },
    hi: {
      title: 'समवर्तीता बनाम समानांतरता: हार्डवेयर और निष्पादन मॉडल',
      summary: 'समवर्तीता और वास्तविक समानांतर मल्टी-कोर निष्पादन के बीच के अंतर को स्पष्ट रूप से समझें।',
      learning_objectives: [
        'समवर्तीता और समानांतरता में स्पष्ट अंतर जानना',
        'CPython में ग्लोबल इंटरप्रेटर लॉक (GIL) का प्रभाव समझना',
        'I/O-बाउंड और CPU-बाउंड कार्यों के लिए सही रणनीति चुनना'
      ],
      content_markdown: `### समवर्तीता बनाम समानांतरता

- **समवर्तीता (Concurrency)**: कई कार्यों को एक साथ संभालना (एक कोर पर स्विचिंग)।
- **समानांतरता (Parallelism)**: कई कोर पर एक साथ कई कार्यों को भौतिक रूप से चलाना।

CPython का GIL यह सुनिश्चित करता है कि एक समय में केवल एक थ्रेड पायथन बाइटकोड चलाए।`,
      key_takeaways: [
        'समवर्तीता संरचना है; समानांतरता निष्पादन है।',
        'GIL मल्टी-थ्रेडेड CPU कार्यों को सीमित करता है।',
        'CPU-बाउंड कार्यों के लिए मल्टीप्रोसेसिंग का उपयोग करें।'
      ],
      revision_prompts: [
        'पायथन में CPU-बाउंड कोड के लिए थ्रेड्स धीमे क्यों हो सकते हैं?'
      ]
    }
  },

  // ─── MODULE 5: Advanced Type Hints and Protocols ─────────────────────────────
  'les-l4-protocols-structural-subtyping': {
    'hi-Latn': {
      title: 'Protocols aur Structural Subtyping: Pythonic Duck Typing with Types',
      summary: 'typing.Protocol se structural duck typing contracts define karein bina inheritance hierarchy force kiye.',
      learning_objectives: [
        'Nominal subtyping (abc.ABC) vs Structural subtyping (typing.Protocol) mein farak samajhna',
        'Custom Protocol classes define karna method signatures ke saath',
        '@runtime_checkable decorator se isinstance() checks enable karna'
      ],
      content_markdown: `### Nominal Typing vs Structural Typing

- **Nominal Subtyping** (\`class Dog(Animal)\`): Subclass ko explicitly parent class inherit karni padti hai.
- **Structural Subtyping (PEP 544 Protocols)**: Agar kisi class ke paas required methods aur signatures hain, toh wo automatically protocol ko satisfy karti hai—bina kisi inheritance ke!

\`\`\`python
from typing import Protocol, runtime_checkable

@runtime_checkable
class Renderable(Protocol):
    def render(self) -> str: ...
\`\`\`

Koi bhi class jo \`render() -> str\` implement karti hai, type checker usse automatically \`Renderable\` consider karega. Ye Python ke traditional "duck typing" philosophy ke saath perfectly align hota hai!`,
      key_takeaways: [
        'Protocols structural subtyping allow karte hain: classes bina explicit inheritance ke contracts satisfy karti hain.',
        '@runtime_checkable decorator runtime isinstance() aur issubclass() checks allow karta hai.',
        'Microservices aur decoupled architecture mein Protocols interfaces define karne ka gold standard hain.'
      ],
      revision_prompts: [
        'ABC inheritance ke bajaye Protocol use karne ka sabse bada architectural advantage kya hai?'
      ]
    },
    hi: {
      title: 'प्रोटोकॉल और संरचनात्मक सबटाइपिंग (Protocols & Structural Subtyping)',
      summary: 'typing.Protocol का उपयोग करके बिना इनहेरिटेंस के डक टाइपिंग अनुबंध परिभाषित करें।',
      learning_objectives: [
        'नाममात्र (Nominal) बनाम संरचनात्मक (Structural) टाइपिंग को समझना',
        'कस्टम प्रोटोकॉल क्लास परिभाषित करना',
        '@runtime_checkable के साथ रनटाइम जाँच सक्षम करना'
      ],
      content_markdown: `### संरचनात्मक सबटाइपिंग

पायथन प्रोटोकॉल (PEP 544) हमें यह निर्दिष्ट करने की अनुमति देते हैं कि किसी ऑब्जेक्ट में कौन सी विधियाँ होनी चाहिए, बिना उसे किसी विशिष्ट बेस क्लास से इनहेरिट करने के लिए बाध्य किए। यदि ऑब्जेक्ट आवश्यक विधियों को लागू करता है, तो यह प्रकार से मेल खाता है।`,
      key_takeaways: [
        'प्रोटोकॉल डक टाइपिंग को स्थिर प्रकार सुरक्षा प्रदान करते हैं।',
        '@runtime_checkable रनटाइम isinstance() सक्षम करता है।',
        'यह वास्तुकला को डिकपल रखने में मदद करता है।'
      ],
      revision_prompts: [
        'प्रोटोकॉल और पारंपरिक बेस क्लास में क्या अंतर है?'
      ]
    }
  },

  // ─── MODULE 7: Reliable Pipelines, Logging, and Error Handling ────────────────
  'les-l4-correlation-ids-traceability': {
    'hi-Latn': {
      title: 'Correlation IDs aur Traceable Distributed Operations',
      summary: 'contextvars use karke end-to-end correlation IDs propagate karein taaki multi-service async logs trace kiye ja sakein.',
      learning_objectives: [
        'Correlation IDs / Request IDs ka production tracing purpose samajhna',
        'Python 3.7+ contextvars.ContextVar se async-safe context storage implement karna',
        'Custom logging.Filter se structured logs mein correlation ID inject karna'
      ],
      content_markdown: `### Correlation IDs: Async Distributed Tracing Ka Dil

Microservices aur concurrent async pipelines mein ek hi second mein 10,000 logs generate hote hain. Agar correlation ID na ho, toh crash hone wale specific request ke logs dhundhna namumkin ho jata hai.

**\`contextvars\`** Python ka standard mechanism hai jo async tasks ke andar execution context ko preserve karta hai. Thread-local variables async tasks mein kaam nahi karte kyunki multiple async tasks ek hi thread share karte hain! Lekin \`ContextVar\` har async task ke liye isolated context maintain karta hai.`,
      key_takeaways: [
        'Correlation IDs distributed systems mein transactions ko track karne ke liye mandatory hain.',
        'Async code mein threading.local() fail ho jata hai; hamesha contextvars.ContextVar use karein.',
        'Logging filters context variables ko automatically format strings aur JSON logs mein inject kar sakte hain.'
      ],
      revision_prompts: [
        'threading.local() asyncio event loop ke andar kyun fail ho jata hai?'
      ]
    },
    hi: {
      title: 'सहसंबंध आईडी और ट्रेस करने योग्य संचालन (Correlation IDs & Tracing)',
      summary: 'contextvars का उपयोग करके वितरित लॉग्स को ट्रेस करने के लिए सहसंबंध आईडी लागू करें।',
      learning_objectives: [
        'सहसंबंध आईडी का उद्देश्य समझना',
        'async-सुरक्षित contextvars.ContextVar का उपयोग करना',
        'लॉग फ़िल्टर में सहसंबंध आईडी इंजेक्ट करना'
      ],
      content_markdown: `### सहसंबंध आईडी (Correlation IDs)

अतुल्यकालिक और वितरित प्रणालियों में, एक ही समय में कई कार्य चलते हैं। सहसंबंध आईडी (Correlation ID) प्रत्येक अनुरोध को एक विशिष्ट पहचानकर्ता प्रदान करता है ताकि सभी संबंधित लॉग्स को एक साथ खोजा जा सके। \`contextvars\` मॉड्यूल इसे अतुल्यकालिक कार्यों में सुरक्षित रूप से बनाए रखता है।`,
      key_takeaways: [
        'सहसंबंध आईडी लॉग्स को खोजने योग्य बनाती है।',
        'अतुल्यकालिक कोड में contextvars.ContextVar का उपयोग करें।',
        'लॉग फ़िल्टर स्वचालित रूप से आईडी जोड़ते हैं।'
      ],
      revision_prompts: [
        'अतुल्यकालिक प्रोग्रामिंग में threading.local के बजाय contextvars का उपयोग क्यों किया जाता है?'
      ]
    }
  },

  // ─── MODULE 8: Advanced Testing and Architecture Validation ──────────────────
  'les-l4-8-3': {
    'hi-Latn': {
      title: 'unittest.mock.AsyncMock Se Coroutine Dependencies Mock Karna',
      summary: 'AsyncMock master karein taaki asynchronous services ko test doubles ke saath isolate karke assert kiya ja sake.',
      learning_objectives: [
        'MagicMock aur AsyncMock ke beech farak samajhna',
        'AsyncMock return_value aur side_effect configure karna',
        'assert_awaited_once_with() aur await_count se async calls verify karna'
      ],
      content_markdown: `### AsyncMock: Coroutines Ka Dedicated Test Double

Agar aap normal \`MagicMock\` ko await karne ki koshish karenge, toh Python TypeError throw karega kyunki \`MagicMock\` awaitable nahi hota:
\`TypeError: object MagicMock can't be used in 'await' expression\`

Python 3.8+ mein \`unittest.mock.AsyncMock\` introduce kiya gaya:
- Jab isse call kiya jata hai, toh ye automatically ek awaitable coroutine return karta hai jo configured \`return_value\` resolve karta hai.
- Ye specialized async verification assertions provide karta hai jaise \`assert_awaited_once_with(*args)\`.`,
      key_takeaways: [
        'Hamesha AsyncMock use karein jab bhi async def coroutine methods ko mock karna ho.',
        'assert_awaited_once_with() verify karta hai ki coroutine exact expected arguments ke saath await hui.',
        'spec=TargetClass pass karne se refactoring ke waqt obsolete method names turant fail ho jate hain.'
      ],
      revision_prompts: [
        'MagicMock aur AsyncMock mein fundamental difference kya hai?'
      ]
    },
    hi: {
      title: 'AsyncMock के साथ अतुल्यकालिक निर्भरताओं का परीक्षण',
      summary: 'अतुल्यकालिक फ़ंक्शंस को अलग करने और उनका परीक्षण करने के लिए AsyncMock का उपयोग करें।',
      learning_objectives: [
        'MagicMock और AsyncMock के बीच अंतर समझना',
        'AsyncMock रिटर्न मान और साइड इफेक्ट्स कॉन्फ़िगर करना',
        'assert_awaited_once_with के साथ कॉल सत्यापित करना'
      ],
      content_markdown: `### AsyncMock का उपयोग

सामान्य \`MagicMock\` को await नहीं किया जा सकता है। पायथन 3.8 में पेश किया गया \`AsyncMock\` विशेष रूप से कोरोटिन के लिए डिज़ाइन किया गया है और यह सुनिश्चित करता है कि परीक्षण सुचारू रूप से चलें।`,
      key_takeaways: [
        'कोरोटिन के लिए AsyncMock का उपयोग करें।',
        'assert_awaited_once_with तर्कों की पुष्टि करता है।',
        'यह परीक्षणों को बाहरी निर्भरताओं से अलग करता है।'
      ],
      revision_prompts: [
        'MagicMock को await करने पर क्या त्रुटि आती है?'
      ]
    }
  }
};
