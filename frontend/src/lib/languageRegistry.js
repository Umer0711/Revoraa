/**
 * Revoraa Multilingual Learning Architecture - Language Registry
 * 
 * Defines supported learning languages, interface localization strings,
 * and extensible fallback resolvers for English, Hinglish, and Hindi.
 */

export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latn',
    flag: '🇬🇧',
    direction: 'ltr',
    description: 'Standard technical English'
  },
  {
    code: 'hi-Latn',
    name: 'Hinglish',
    nativeName: 'Hinglish (Roman)',
    script: 'Latn',
    flag: '🇮🇳',
    direction: 'ltr',
    description: 'Natural colloquial Hindi written in Roman script with English tech terms'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी (Devanagari)',
    script: 'Deva',
    flag: '🇮🇳',
    direction: 'ltr',
    description: 'Devanagari Hindi preserving standard Python technical terminology'
  }
];

export const DEFAULT_LANGUAGE = 'en';

export function getLanguageMetadata(code) {
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
}

export const getLanguageMeta = getLanguageMetadata;


export function isValidLanguage(code) {
  return SUPPORTED_LANGUAGES.some(l => l.code === code);
}

/**
 * Interface Language Dictionary (Buttons, status labels, tabs, controls)
 */
export const UI_STRINGS = {
  // Navigation & Breadcrumbs
  learn: {
    en: 'Learn',
    'hi-Latn': 'Learn',
    hi: 'सीखें'
  },
  allPaths: {
    en: 'All Learning Paths',
    'hi-Latn': 'Saare Learning Paths',
    hi: 'सभी लर्निंग पाथ्स'
  },
  developerAcademy: {
    en: 'Developer Academy',
    'hi-Latn': 'Developer Academy',
    hi: 'डेवलपर अकादमी'
  },

  // Tabs & Views
  curriculumTab: {
    en: 'Curriculum & Lessons',
    'hi-Latn': 'Syllabus & Lessons',
    hi: 'पाठ्यक्रम और पाठ'
  },
  challengesTab: {
    en: 'Coding Practice & Challenges',
    'hi-Latn': 'Coding Practice & Challenges',
    hi: 'कोडिंग अभ्यास और चुनौतियाँ'
  },
  projectsTab: {
    en: 'Guided Projects',
    'hi-Latn': 'Guided Projects',
    hi: 'गाइडेड प्रोजेक्ट्स'
  },

  // Actions
  runCode: {
    en: 'Run Code',
    'hi-Latn': 'Code Run Karein',
    hi: 'कोड चलाएं'
  },
  stopCode: {
    en: 'Stop',
    'hi-Latn': 'Rokein',
    hi: 'रोकें'
  },
  resetCode: {
    en: 'Reset',
    'hi-Latn': 'Reset Karein',
    hi: 'रीसेट करें'
  },
  copyCode: {
    en: 'Copy',
    'hi-Latn': 'Copy Karein',
    hi: 'कॉपी करें'
  },
  copied: {
    en: 'Copied',
    'hi-Latn': 'Copy Ho Gaya',
    hi: 'कॉपी हो गया'
  },
  markComplete: {
    en: 'Mark Lesson Complete',
    'hi-Latn': 'Lesson Complete Mark Karein',
    hi: 'पाठ पूरा चिह्नित करें'
  },
  lessonCompleted: {
    en: 'Lesson Completed',
    'hi-Latn': 'Lesson Complete Ho Gaya',
    hi: 'पाठ पूरा हो गया'
  },
  nextLesson: {
    en: 'Next Lesson',
    'hi-Latn': 'Agla Lesson',
    hi: 'अगला पाठ'
  },
  prevLesson: {
    en: 'Previous',
    'hi-Latn': 'Peechhe',
    hi: 'पिछला'
  },
  checkAnswers: {
    en: 'Check Answers',
    'hi-Latn': 'Answers Check Karein',
    hi: 'उत्तर जांचें'
  },
  retryAssessment: {
    en: 'Retry Assessment',
    'hi-Latn': 'Dobara Attempt Karein',
    hi: 'पुनः प्रयास करें'
  },
  testSolution: {
    en: 'Test Solution',
    'hi-Latn': 'Solution Test Karein',
    hi: 'समाधान का परीक्षण करें'
  },
  showHint: {
    en: 'Need a Hint?',
    'hi-Latn': 'Hint Chahiye?',
    hi: 'संकेत चाहिए?'
  },

  // Status & Badges
  learningObjectives: {
    en: 'Learning Objectives',
    'hi-Latn': 'Sikhne Ke Mukhya Points',
    hi: 'सीखने के मुख्य उद्देश्य'
  },
  keyTakeaways: {
    en: 'Key Takeaways',
    'hi-Latn': 'Zaroori Baatein (Key Takeaways)',
    hi: 'मुख्य निष्कर्ष'
  },
  activeRecall: {
    en: 'Active Recall & Revision Prompts',
    'hi-Latn': 'Revision Questions',
    hi: 'रिवीजन प्रश्न'
  },
  standardOutput: {
    en: 'Standard Output',
    'hi-Latn': 'Terminal Output',
    hi: 'टर्मिनल आउटपुट'
  },
  showingFallback: {
    en: 'English (Fallback)',
    'hi-Latn': 'English (Fallback Available)',
    hi: 'अंग्रेज़ी (उपलब्ध फ़ॉलबैक)'
  },
  active: {
    en: 'Active',
    'hi-Latn': 'Active',
    hi: 'सक्रिय'
  },
  completed: {
    en: 'Completed',
    'hi-Latn': 'Pura Hua',
    hi: 'पूर्ण'
  },
  locked: {
    en: 'Locked',
    'hi-Latn': 'Locked',
    hi: 'लॉक्ड'
  }
};

/**
 * Retrieve localized UI string with automatic English fallback.
 */
export function getUiString(key, lang = 'en') {
  const item = UI_STRINGS[key];
  if (!item) return key;
  return item[lang] || item['en'] || key;
}
