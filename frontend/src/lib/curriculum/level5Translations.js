/**
 * Revoraa Level 5: Expert / Production Python Multilingual Translations
 *
 * Provides natural Hinglish (Roman script `hi-Latn`) and Hindi (Devanagari `hi`)
 * translations for core Level 5 lessons across all 8 modules.
 * Preserves Python keywords, Docker instructions, CI pipelines, and code syntax verbatim.
 */

export const LEVEL_5_TRANSLATIONS = {
  // ─── Module 1: Professional Python Project Structure ─────────────────────────
  'from-scripts-to-maintainable-applications': {
    'hi-Latn': {
      title: 'Scripts Se Maintainable Applications Tak: Architecture Ka Safar',
      summary: 'Ad-hoc script files se structured, testable aur maintainable Python packages me transition samajhein.',
      learning_objectives: [
        'Single-file scripts production scale par kyu break hoti hain ye jaan-na',
        'Separation of concerns: domain, storage aur interface boundaries establish karna',
        'src-layout architecture ka importance aur sys.path resolution samajhna'
      ],
      content_markdown: `### Single-File Scripts Se Production Packages Tak

Jab hum Python sikhna shuru karte hain, toh ek single \`main.py\` file me code likhna simple aur convenient lagta hai. Lekin jaise jaise application grow karti hai:
- Database connections, business logic, CLI arguments aur HTTP routes sab ek file me mix ho jaate hain.
- Unit testing impossible ho jaati hai kyunki kisi ek function ko import karne par puri script run hone lagti hai!

### The src-Layout Advantage

\`\`\`
my-app/
├── pyproject.toml
├── src/
│   └── myapp/
│       ├── __init__.py
│       ├── core.py
│       └── cli.py
└── tests/
    └── test_core.py
\`\`\`

\`src/\` layout use karne se Python kabhi galti se local source folder ko uninstalled package ki tarah import nahi karta. Testing hamesha installed wheel distribution par hoti hai.`,
      key_takeaways: [
        'Scripts ko domain, storage aur API boundaries me separate karein.',
        'src-layout accidental imports ko rokta hai aur accurate packaging testing ensure karta hai.',
        '__init__.py me __all__ define karke public interface export karein.'
      ],
      revision_prompts: [
        'src-layout use karne ka primary advantage flat layout ke mukable kya hai?'
      ]
    },
    hi: {
      title: 'स्क्रिप्ट से अनुरक्षणीय अनुप्रयोगों तक: आर्किटेक्चरल विकास',
      summary: 'तदर्थ स्क्रिप्ट फ़ाइलों से संरचित, परीक्षण योग्य और उत्पादन-तैयार पायथन पैकेजों में संक्रमण को समझें।',
      learning_objectives: [
        'यह समझना कि एकल-फ़ाइल स्क्रिप्ट उत्पादन के स्तर पर क्यों विफल होती हैं',
        'डोमेन, भंडारण और इंटरफ़ेस सीमाओं का पृथक्करण स्थापित करना',
        'src-लेआउट संरचना और sys.path समाधान को समझना'
      ],
      content_markdown: `### एकल-फ़ाइल स्क्रिप्ट से उत्पादन पैकेजों तक

उत्पादन सॉफ्टवेयर इंजीनियरिंग में, कोड को एकल फ़ाइलों में रखने से गंभीर निर्भरता समस्याएं उत्पन्न होती हैं।

### src-लेआउट का महत्व
\`src/\` लेआउट सुनिश्चित करता है कि परीक्षण केवल तभी चलते हैं जब पैकेज pip के माध्यम से सही ढंग से स्थापित हो जाता है, जिससे स्थानीय फ़ाइलों के आकस्मिक आयात को रोका जा सके।`,
      key_takeaways: [
        'स्क्रिप्ट्स को डोमेन और स्टोरेज लेयर्स में विभाजित करें।',
        'src-लेआउट आकस्मिक स्थानीय आयातों को रोकता है।'
      ],
      revision_prompts: [
        'src-लेआउट का उपयोग करने का मुख्य लाभ क्या है?'
      ]
    }
  },

  // ─── Module 2: Packaging and Distribution ────────────────────────────────────
  'what-python-packaging-solves': {
    'hi-Latn': {
      title: 'Python Packaging Kya Solve Karta Hai: Standards & PyPA',
      summary: 'Python packaging ki historical evolution aur modern PEP 517/518 build standards ko master karein.',
      learning_objectives: [
        'Source distributions (sdist) aur pre-compiled wheels me farak samajhna',
        'PEP 517 build frontends aur build backends ka architecture jaan-na',
        'Reproducible packaging metadata aur PyPA standards ko apply karna'
      ],
      content_markdown: `### Modern Python Packaging Standards

Historical Python packaging \`setup.py\` par dependent thi jo build time par arbitrary code execute karti thi.

Modern packaging declarative \`pyproject.toml\` use karti hai:
- **Build Frontend**: \`pip\` ya \`build\` jo user commands handle karte hain.
- **Build Backend**: \`hatchling\`, \`flit\`, ya \`setuptools\` jo sdist aur wheel generate karte hain.`,
      key_takeaways: [
        'pyproject.toml modern declarative packaging ka standard hai.',
        'Wheels pre-built binaries hain jo installation ko 10x fast banati hain.'
      ],
      revision_prompts: [
        'sdist aur wheel archive me kya technical difference hai?'
      ]
    },
    hi: {
      title: 'पायथन पैकेजिंग क्या हल करती है: मानक और PyPA',
      summary: 'पायथन पैकेजिंग के ऐतिहासिक विकास और आधुनिक PEP 517/518 निर्माण मानकों को समझें।',
      learning_objectives: [
        'सोर्स डिस्ट्रीब्यूशन और व्हील्स के बीच अंतर समझना',
        'PEP 517 निर्माण फ्रंटएंड और बैकएंड की संरचना जानना'
      ],
      content_markdown: `### आधुनिक पायथन पैकेजिंग मानक

आधुनिक पायथन पैकेजिंग घोषणात्मक \`pyproject.toml\` विनिर्देशों पर निर्भर करती है।`,
      key_takeaways: [
        'pyproject.toml आधुनिक पैकेजिंग विनिर्देश है।',
        'व्हील्स पूर्व-निर्मित वितरण हैं जो तीव्र स्थापना सक्षम करते हैं।'
      ],
      revision_prompts: [
        'sdist और wheel में क्या अंतर है?'
      ]
    }
  },

  // ─── Module 3: Configuration, Security, and Secrets ──────────────────────────
  'application-configuration-principles': {
    'hi-Latn': {
      title: 'Application Configuration Principles: Secrets & 12-Factor',
      summary: 'Twelve-Factor configuration, fail-fast schema validation aur credentials masking seekhein.',
      learning_objectives: [
        'Codebase se hardcoded credentials ko eliminate karna',
        'Pydantic BaseModel se startup configuration validate karna',
        'SecretString classes se logs me token leak hone se bachna'
      ],
      content_markdown: `### Twelve-Factor Config aur Secrets Isolation

Production applications me kabhi bhi API keys, passwords ya tokens code repository me commit nahi hone chahiye.
Environment variables ko startup par fail-fast schema validation se verify karna zaroori hai.`,
      key_takeaways: [
        'Secrets ko environment variables ke roop me inject karein.',
        'Startup par schema validate karein taaki missing keys turant catch ho sakein.'
      ],
      revision_prompts: [
        'Code me hardcoded secrets rakhne ke kya security risks hain?'
      ]
    },
    hi: {
      title: 'अनुप्रयोग विन्यास सिद्धांत: गोपनीयता और 12-कारक',
      summary: 'Twelve-Factor कॉन्फ़िगरेशन, फ़ेल-फ़ास्ट स्कीमा सत्यापन और क्रेडेंशियल मास्किंग सीखें।',
      learning_objectives: [
        'हार्डकोडेड क्रेडेंशियल्स को समाप्त करना',
        'स्टार्टअप पर कॉन्फ़िगरेशन स्कीमा को मान्य करना'
      ],
      content_markdown: `### ट्वेल्व-फैक्टर कॉन्फ़िगरेशन और सीक्रेट्स

उत्पादन प्रणालियों में, क्रेडेंशियल्स को कभी भी Git रिपॉजिटरी में कमिट नहीं किया जाना चाहिए।`,
      key_takeaways: [
        'सीक्रेट्स को रनटाइम एनवायरनमेंट वेरिएबल्स के रूप में इंजेक्ट करें।',
        'स्टार्टअप पर विन्यास को मान्य करें।'
      ],
      revision_prompts: [
        'हार्डकोडेड सीक्रेट्स के क्या जोखिम हैं?'
      ]
    }
  },

  // ─── Module 6: Docker and Deployment Fundamentals ────────────────────────────
  'what-deployment-means': {
    'hi-Latn': {
      title: 'Production Me Deployment Ka Kya Matlab Hai: Cattle vs Pets',
      summary: 'Mutable pet servers se immutable container infrastructure aur ephemeral runtimes ka transition master karein.',
      learning_objectives: [
        'Cattle vs Pets DevOps philosophy samajhna',
        'Artifact immutability: Git SHA tagged containers ki importance',
        'Stateless container execution aur cloud storage boundaries'
      ],
      content_markdown: `### The Immutable Container Revolution

Pehle servers ko **Pets** ki tarah treat kiya jata tha: unhe manually SSH karke patch kiya jata tha.
Modern cloud me servers **Cattle** hain: unhe destroy karke immutable container images se instantly replace kiya ja sakta hai.`,
      key_takeaways: [
        'Container images immutable artifacts hain jo staging aur production me identical rehte hain.',
        'Ephemeral container storage par files persist nahi hoti; durable state external databases me store karein.'
      ],
      revision_prompts: [
        'Cattle vs Pets analogy cloud deployment me kya signify karti hai?'
      ]
    },
    hi: {
      title: 'उत्पादन में परिनियोजन (Deployment) का वास्तविक अर्थ',
      summary: 'म्यूटेबल सर्वर से अपरिवर्तनीय कंटेनर इन्फ्रास्ट्रक्चर में बदलाव को समझें।',
      learning_objectives: [
        'Cattle vs Pets प्रतिमान को समझना',
        'कंटेनर की अपरिवर्तनीयता और स्टेटलेस निष्पादन'
      ],
      content_markdown: `### अपरिवर्तनीय कंटेनर संरचना

क्लाउड इंजीनियरिंग में, सर्वर disposable (निपटान योग्य) होते हैं और उन्हें किसी भी समय बदला जा सकता है।`,
      key_takeaways: [
        'कंटेनर छवियां अपरिवर्तनीय होती हैं।',
        'स्थायी डेटा को हमेशा बाहरी डेटाबेस में रखें।'
      ],
      revision_prompts: [
        'Cattle vs Pets का क्या अर्थ है?'
      ]
    }
  },

  // ─── Module 7: CI/CD, Monitoring, and Operations ─────────────────────────────
  'continuous-integration-fundamentals': {
    'hi-Latn': {
      title: 'Continuous Integration Ke Fundamentals: Trunk-Based Development',
      summary: 'Automated PR validation, matrix testing aur merge hell se bachne ke principles master karein.',
      learning_objectives: [
        'Trunk-based development aur frequent small commits ki value samajhna',
        'Automated CI verification gates: lint, typecheck, pytest execution',
        'Sub-5 minute CI feedback loops maintain karna'
      ],
      content_markdown: `### Continuous Integration Ki Ahmiyat

CI ka matlab sirf GitHub Actions run karna nahi hai. Ye ek team discipline hai jisme code ko daily trunk (\`main\`) branch me merge karke automated tests se verify kiya jata hai.`,
      key_takeaways: [
        'Long-lived branches merge conflicts create karti hain; trunk-based CI small merges encourage karta hai.',
        'CI gates me linting, typechecking aur test coverage automated honi chahiye.'
      ],
      revision_prompts: [
        'Trunk-based development "Merge Hell" ko kaise prevent karta hai?'
      ]
    },
    hi: {
      title: 'सतत एकीकरण (CI) के मूलभूत सिद्धांत',
      summary: 'स्वचालित पीआर सत्यापन, मैट्रिक्स परीक्षण और ट्रंक-आधारित विकास के सिद्धांतों को समझें।',
      learning_objectives: [
        'ट्रंक-आधारित विकास और छोटे कमिट्स का महत्व',
        'स्वचालित सत्यापन गेट्स स्थापित करना'
      ],
      content_markdown: `### सतत एकीकरण (CI)

सतत एकीकरण सुनिश्चित करता है कि प्रत्येक कोड परिवर्तन को स्वचालित रूप से परीक्षण और सत्यापित किया जाए।`,
      key_takeaways: [
        'ट्रंक-आधारित विकास विवादों को कम करता है।',
        'सीआई गेट्स में लिंटिंग और यूनिट टेस्ट शामिल होने चाहिए।'
      ],
      revision_prompts: [
        'ट्रंक-आधारित विकास का क्या लाभ है?'
      ]
    }
  },

  // ─── Module 8: Production Readiness and Final Assessment ─────────────────────
  'production-readiness-review': {
    'hi-Latn': {
      title: 'Production Readiness Review (PRR) Gate',
      summary: 'Live launch se pehle 6 pillars of production readiness verify karein: security, reliability aur runbooks.',
      learning_objectives: [
        'Production Readiness Review (PRR) audit conduct karna',
        'Security, observability aur disaster recovery checklist evaluate karna',
        'Objective Go/No-Go launch decisions lena'
      ],
      content_markdown: `### PRR Audit: The Final Gate Before Production

Kisi bhi service ko live customer traffic dene se pehle team PRR audit karti hai:
- Kya container non-root user se chalta hai?
- Kya structured JSON logging aur Prometheus metrics active hain?
- Kya /healthz aur /readyz probes decoupled hain?
- Kya on-call engineers ke paas operational runbook available hai?`,
      key_takeaways: [
        'PRR audit non-functional production requirements verify karta hai.',
        'All checklist items pass hone par hi "GO" decision milta hai.'
      ],
      revision_prompts: [
        'PRR audit me liveness aur readiness probes ka alag hona kyu check kiya jata hai?'
      ]
    },
    hi: {
      title: 'उत्पादन तत्परता समीक्षा (PRR) गेट',
      summary: 'लाइव लॉन्च से पहले उत्पादन तत्परता के 6 स्तंभों का सत्यापन करें।',
      learning_objectives: [
        'उत्पादन तत्परता समीक्षा ऑडिट करना',
        'सुरक्षा और विश्वसनीयता चेकलिस्ट का मूल्यांकन'
      ],
      content_markdown: `### उत्पादन तत्परता समीक्षा (PRR)

लाइव उपयोगकर्ताओं को सेवा देने से पहले, एक व्यवस्थित पीआरआर ऑडिट सुरक्षा, विश्वसनीयता और निगरानी आवश्यकताओं की पुष्टि करता है।`,
      key_takeaways: [
        'पीआरआर सभी गैर-कार्यात्मक आवश्यकताओं को सत्यापित करता है।',
        'पूर्ण अनुपालन के बाद ही सेवा को लाइव किया जाता है।'
      ],
      revision_prompts: [
        'पीआरआर चेकलिस्ट में क्या शामिल होता है?'
      ]
    }
  }
};
