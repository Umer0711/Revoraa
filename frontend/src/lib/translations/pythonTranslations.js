/**
 * Revoraa Multilingual Learning Platform - Python Curriculum Translations
 * 
 * Provides natural Hinglish (Roman script) and Hindi (Devanagari) translations
 * for core Python lessons. Technical keywords, function names, and code syntax
 * remain in canonical Python to preserve engineering precision.
 */
import { LEVEL_3_TRANSLATIONS } from '../curriculum/level3Translations.js';
import { LEVEL_4_TRANSLATIONS } from '../curriculum/level4Translations.js';
import { LEVEL_5_TRANSLATIONS } from '../curriculum/level5Translations.js';

const BASE_LESSON_TRANSLATIONS = {
  'les-how-python-runs': {
    'hi-Latn': {
      title: 'Python Kaise Run Hota Hai: Interpreters, Bytecode & The REPL',
      summary: 'Janiye Python code ka journey source text se lekar bytecode execution aur virtual machine tak.',
      learning_objectives: [
        'CPython compiler aur bytecode (.pyc) ka role samajhna',
        'Script execution aur interactive REPL evaluation mein farak jaan-na',
        'Python indentation aur scope rules ko master karna'
      ],
      content_markdown: `### Python Ka Execution Lifecycle

Jab aap terminal mein \`python script.py\` run karte hain, toh interpreter aapke code ko seedhe shell script ki tarah line-by-line execute nahi karta. CPython do main steps follow karta hai:

1. **Bytecode Compilation**: Sabse pehle CPython compiler aapke source code (\`.py\`) ko parse karke platform-independent intermediate instructions mein convert karta hai, jise **bytecode** kehte hain (ye aksar \`__pycache__\` folder ke andar \`.pyc\` files ke roop mein save hota hai).
2. **Virtual Machine Evaluation**: Iske baad Python Virtual Machine (PVM) is bytecode ko read karta hai aur native CPU operations execute karta hai.

\`\`\`
Source Code (.py) ──► Compiler ──► Bytecode (.pyc) ──► PVM Loop ──► Machine Output
\`\`\`

### Whitespace aur Indentation Ka Importance

Doosri languages jaise C++ ya Java mein blocks ko curly braces (\`{}\`) se define kiya jata hai, lekin Python mein **indentation** se code block ka scope tay hota hai. PEP 8 standard ke mutabik har level par **4 spaces** use karna zaroori hai. Kabhi bhi tabs aur spaces ko mix na karein.

### Common Misconception
- **Myth**: Python sirf interpreted language hai aur kabhi compile nahi hoti.
  - *Reality*: Python hamesha bytecode mein compile hoti hai. Bas ye compilation process memory mein automatically ho jata hai bina kisi manual build command ke.`,
      key_takeaways: [
        'Python code pehle .pyc bytecode mein compile hota hai, phir PVM loop use execute karta hai.',
        'Indentation hi Python ka block scope define karta hai; hamesha 4 spaces use karein.',
        'Interactive REPL code ko Read-Eval-Print loop mein turant evaluate karta hai.'
      ],
      revision_prompts: [
        'CPython script run karte waqt kaunse do main stages follow karta hai?',
        'Python mein tabs aur spaces ko mix karna kyun mana hai?'
      ]
    },
    hi: {
      title: 'पायथन कैसे चलता है: इंटरप्रेटर, बाइटकोड और REPL',
      summary: 'जानिए पायथन कोड की यात्रा स्रोत टेक्स्ट से लेकर बाइटकोड निष्पादन और वर्चुअल मशीन तक।',
      learning_objectives: [
        'CPython कंपाइलर और बाइटकोड (.pyc) की भूमिका को समझना',
        'स्क्रिप्ट निष्पादन और इंटरैक्टिव REPL मूल्यांकन में अंतर जानना',
        'पायथन इंडेंटेशन और ब्लॉक नियमों को मास्टर करना'
      ],
      content_markdown: `### पायथन निष्पादन जीवनचक्र (Execution Lifecycle)

जब आप \`python script.py\` चलाते हैं, तो इंटरप्रेटर आपके कोड को सीधे लाइन-दर-लाइन शेल स्क्रिप्ट की तरह निष्पादित नहीं करता। CPython दो चरणों का पालन करता है:

1. **बाइटकोड संकलन (Compilation to Bytecode)**: CPython कंपाइलर आपके सोर्स कोड (\`.py\`) को पार्स करके प्लेटफ़ॉर्म-स्वतंत्र मध्यवर्ती निर्देशों में बदलता है, जिन्हें **बाइटकोड** कहा जाता है (यह अक्सर \`__pycache__\` फ़ोल्डर में \`.pyc\` फ़ाइलों के रूप में संग्रहीत होता है)।
2. **वर्चुअल मशीन मूल्यांकन (PVM Evaluation)**: पायथन वर्चुअल मशीन (PVM) एक रनटाइम लूप है जो बाइटकोड को पढ़ता है और मूल मशीन निर्देश चलाता है।

\`\`\`
Source Code (.py) ──► Compiler ──► Bytecode (.pyc) ──► PVM Loop ──► Machine Output
\`\`\`

### इंडेंटेशन का महत्व (Indentation)

curly braces (\`{}\`) का उपयोग करने वाली अन्य भाषाओं के विपरीत, पायथन ब्लॉक स्कोप घोषित करने के लिए **इंडेंटेशन** का उपयोग करता है। PEP 8 आधिकारिक गाइड प्रत्येक स्तर पर **4 रिक्त स्थान (spaces)** की अनुशंसा करता है। कभी भी टैब और स्पेस को एक साथ न मिलाएं।`,
      key_takeaways: [
        'पायथन कोड को PVM द्वारा चलाने से पहले बाइटकोड में संकलित किया जाता है।',
        'इंडेंटेशन ही स्कोप तय करता है; प्रति नेस्टिंग स्तर ठीक 4 स्पेस का उपयोग करें।',
        'इंटरैक्टिव REPL रीड-इवेल-प्रिंट-लूप का उपयोग करके तुरंत परिणाम दिखाता है।'
      ],
      revision_prompts: [
        'CPython द्वारा स्क्रिप्ट चलाने के दो मुख्य चरण कौन से हैं?',
        'पायथन में टैब और स्पेस को मिश्रित करने से IndentationError क्यों आता है?'
      ]
    }
  },

  'les-variables-typing': {
    'hi-Latn': {
      title: 'Variables, References & Dynamic Typing',
      summary: 'Seekhein kaise Python variables fixed memory slots nahi balki heap objects ke reference pointers hote hain.',
      learning_objectives: [
        'Object binding aur reference assignment samajhna',
        'Identity (is) aur Equality (==) ke beech ka farak jaan-na',
        'type() aur id() functions se objects inspect karna'
      ],
      content_markdown: `### Variables: Objects Se Jude Hue Naam

C ya Go jaisi languages mein variable ek fixed memory slot hota hai. Lekin Python mein, **variables heap par bane objects ke reference tags (naam) hote hain**.

Jab aap likhte hain \`x = 42\`:
- Python heap memory par ek integer object \`42\` create karta hai.
- \`x\` naam is object ke pointer se bind ho jata hai.
- Agar aap baad mein \`x = "hello"\` likhein, toh \`42\` change nahi hota; \`x\` bas nayi string object ki taraf point karne lagta hai.

### Identity vs. Equality

- **Equality (\`==\`)**: Do objects ki values ya data ko compare karta hai.
- **Identity (\`is\`)**: Check karta hai ki kya do variables memory mein ek hi object ko point kar rahe hain (\`id(a) == id(b)\`).`,
      key_takeaways: [
        'Variables ke paas data type nahi hota; objects ke paas data type hota hai.',
        'Values compare karne ke liye `==` use karein; identity check ke liye `is` use karein.',
        '`type()` aur `id()` runtime inspection ke liye useful built-in functions hain.'
      ],
      revision_prompts: [
        'Jab variable ko doosre type ke object se rebind karte hain toh memory mein kya hota hai?',
        'Kaunsi situation mein `a == b` True hoga lekin `a is b` False hoga?'
      ]
    },
    hi: {
      title: 'वेरिएबल्स, संदर्भ और डायनामिक टाइपिंग',
      summary: 'समझें कि पायथन में वेरिएबल्स हीप मेमोरी में मौजूद ऑब्जेक्ट्स के संदर्भ (पॉइंटर्स) कैसे होते हैं।',
      learning_objectives: [
        'ऑब्जेक्ट बाइंडिंग और संदर्भ असाइनमेंट को समझना',
        'समानता (==) और पहचान (is) के बीच अंतर जानना',
        'type() और id() की सहायता से ऑब्जेक्ट्स की जाँच करना'
      ],
      content_markdown: `### वेरिएबल्स ऑब्जेक्ट्स से बंधे नाम हैं

C या Go जैसी भाषाओं में वेरिएबल एक निश्चित प्रकार का मेमोरी स्लॉट होता है। पायथन में, **वेरिएबल्स केवल संदर्भ टैग होते हैं जो हीप पर बने ऑब्जेक्ट्स की ओर इशारा करते हैं**।

जब आप \`x = 42\` लिखते हैं:
- पायथन हीप पर \`42\` मान वाला एक पूर्णांक ऑब्जेक्ट बनाता है।
- \`x\` नाम उस ऑब्जेक्ट से जुड़ जाता है।
- \`x = "hello"\` लिखने पर मूल संख्या नहीं बदलती, बल्कि \`x\` एक नए स्ट्रिंग ऑब्जेक्ट को संदर्भित करने लगता है।

### समानता (==) बनाम पहचान (is)

- **Equality (\`==\`)**: मानों या डेटा की तुलना करता है।
- **Identity (\`is\`)**: यह जाँचता है कि क्या दोनों संदर्भ मेमोरी में एक ही ऑब्जेक्ट की ओर इशारा कर रहे हैं।`,
      key_takeaways: [
        'वेरिएबल्स के प्रकार नहीं होते; वे जिन ऑब्जेक्ट्स को इंगित करते हैं उनके प्रकार होते हैं।',
        'मान की तुलना के लिए `==` और ऑब्जेक्ट पहचान के लिए `is` का उपयोग करें।',
        '`type()` और `id()` ऑब्जेक्ट क्लास और मेमोरी पते की जाँच करते हैं।'
      ],
      revision_prompts: [
        'पायथन में `a == b` सत्य होने पर भी `a is b` असत्य क्यों हो सकता है?',
        'डायनामिक टाइपिंग और स्टैटिक टाइपिंग में क्या अंतर है?'
      ]
    }
  },

  'les-if-elif-else': {
    'hi-Latn': {
      title: 'if, elif, and else Se Decision Making',
      summary: 'Conditionals, comparison chaining aur short-circuit boolean logic master karein.',
      learning_objectives: [
        'if, elif, aur else se clean decision tree banana',
        'Chained comparisons use karna (jaise 0 <= score <= 100)',
        'Short-circuit evaluation (and/or) ka faayda uthana'
      ],
      content_markdown: `### Conditional Execution

Python mein decision making \`if\`, \`elif\` (else if), aur \`else\` se hoti hai. Python conditions ko upar se neeche sequentially evaluate karta hai; jaise hi pehla matching condition milta hai, uska block chal jata hai aur baaki branches skip ho jaati hain.

### Comparison Chaining
Python mein aap natural mathematical style mein comparisons chain kar sakte hain:
\`\`\`python
if 18 <= age < 65:
    print("Working age adult")
\`\`\`
Ye \`18 <= age and age < 65\` ke barabar hai, lekin \`age\` ko sirf ek baar evaluate karta hai.

### Guard Clause Pattern
Nested if statements likhne ke bajaye, guard clauses use karein jo invalid condition aate hi turant return kar dein.`,
      key_takeaways: [
        'Conditions sequentially evaluate hoti hain; pehli true branch execute hoti hai.',
        'Comparison chaining (`0 <= x <= 100`) readable aur efficient hoti hai.',
        'Guard clauses deep nesting ko rokti hain.'
      ],
      revision_prompts: [
        'Short-circuit evaluation Null/None pointer bugs ko kaise rokti hai?',
        'Nested if statement ko guard clause mein kaise convert karte hain?'
      ]
    },
    hi: {
      title: 'if, elif और else द्वारा निर्णय लेना',
      summary: 'कंडीशनल स्टेटमेंट, तुलना चेनिंग और बूलियन लॉजिक को समझें।',
      learning_objectives: [
        'if, elif और else के साथ बहु-विकल्पीय निर्णय संरचना बनाना',
        'चेन्ड तुलना का उपयोग करना (जैसे 0 <= score <= 100)',
        'शॉर्ट-सर्किट मूल्यांकन (and/or) का लाभ उठाना'
      ],
      content_markdown: `### कंडीशनल निष्पादन

पायथन में निर्णय \`if\`, \`elif\` और \`else\` कीवर्ड्स पर आधारित होते हैं। स्थितियाँ ऊपर से नीचे क्रमिक रूप से जाँची जाती हैं; पहली सत्य स्थिति का ब्लॉक निष्पादित होता है और शेष छोड़ दिए जाते हैं।

### तुलना चेनिंग (Comparison Chaining)
\`\`\`python
if 18 <= age < 65:
    print("Working age adult")
\`\`\`
यह शैली सीधे गणितीय नियमों की तरह पढ़ी जाती है और अधिक साफ़ होती है।`,
      key_takeaways: [
        'पायथन स्थितियाँ क्रमबद्ध रूप से जाँची जाती हैं।',
        '`0 <= x <= 100` जैसी चेन्ड तुलना अधिक स्पष्ट होती है।',
        'गार्ड क्लॉज कोड को अधिक पठनीय बनाते हैं।'
      ],
      revision_prompts: [
        'शॉर्ट-सर्किट मूल्यांकन का क्या अर्थ है?',
        'गार्ड क्लॉज पैटर्न से कोड नेस्टिंग कैसे कम होती है?'
      ]
    }
  }
};

export const PYTHON_LESSON_TRANSLATIONS = {
  ...BASE_LESSON_TRANSLATIONS,
  ...LEVEL_3_TRANSLATIONS,
  ...LEVEL_4_TRANSLATIONS,
  ...LEVEL_5_TRANSLATIONS
};

/**
 * Resolve localized variant for a lesson with transparent English fallback.
 */
export function getLocalizedLesson(lesson, lang = 'en') {
  if (!lesson) return null;
  if (lang === 'en') {
    return { ...lesson, isFallback: false, resolvedLanguage: 'en' };
  }

  const translationsForLesson = PYTHON_LESSON_TRANSLATIONS[lesson.id] ||
                                (lesson.slug && PYTHON_LESSON_TRANSLATIONS[lesson.slug]) ||
                                (lesson.slug && PYTHON_LESSON_TRANSLATIONS[`les-${lesson.slug}`]);
  const variant = translationsForLesson ? translationsForLesson[lang] : null;


  if (variant) {
    return {
      ...lesson,
      title: variant.title || lesson.title,
      summary: variant.summary || lesson.summary || lesson.description,
      learning_objectives: variant.learning_objectives || lesson.learning_objectives,
      content_markdown: variant.content_markdown || lesson.content_markdown || lesson.content || '',
      content: variant.content_markdown || lesson.content || lesson.content_markdown || '',
      code_snippet: lesson.code_snippet || lesson.interactive_code || '',
      interactive_code: lesson.interactive_code || lesson.code_snippet || '',
      key_takeaways: variant.key_takeaways || lesson.key_takeaways,
      revision_prompts: variant.revision_prompts || lesson.revision_prompts,
      isFallback: false,
      resolvedLanguage: lang
    };
  }

  // Fallback to English
  return {
    ...lesson,
    content_markdown: lesson.content_markdown || lesson.content || '',
    content: lesson.content || lesson.content_markdown || '',
    code_snippet: lesson.code_snippet || lesson.interactive_code || '',
    interactive_code: lesson.interactive_code || lesson.code_snippet || '',
    isFallback: true,
    resolvedLanguage: 'en'
  };
}
