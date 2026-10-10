import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, isValidLanguage, getUiString 
} from '../lib/languageRegistry';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const LearningLanguageContext = createContext(null);
const STORAGE_KEY = 'revoraa_learning_lang';

export function LearningLanguageProvider({ children }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && isValidLanguage(stored)) return stored;
    } catch (e) {}
    return DEFAULT_LANGUAGE;
  });

  // Sync preference with Supabase user_settings when user logs in
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;
    async function syncPreference() {
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('learning_language')
          .eq('user_id', user.id)
          .single();

        if (!error && data?.learning_language && isValidLanguage(data.learning_language) && isMounted) {
          setLanguageState(data.learning_language);
          localStorage.setItem(STORAGE_KEY, data.learning_language);
        }
      } catch (err) {
        // Table or network fallback
      }
    }

    syncPreference();
    return () => { isMounted = false; };
  }, [user?.id]);

  const setLanguage = useCallback(async (newLang) => {
    if (!isValidLanguage(newLang)) return;

    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch (e) {}

    // Persist to user_settings if signed in
    if (user?.id) {
      try {
        await supabase
          .from('user_settings')
          .update({ learning_language: newLang, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);
      } catch (e) {}
    }

    window.dispatchEvent(new CustomEvent('LEARNING_LANGUAGE_CHANGED', { detail: { language: newLang } }));
  }, [user?.id]);

  const t = useCallback((key) => {
    return getUiString(key, language);
  }, [language]);

  return (
    <LearningLanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LearningLanguageContext.Provider>
  );
}

export function useLearningLanguage() {
  const context = useContext(LearningLanguageContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      t: (key) => getUiString(key, DEFAULT_LANGUAGE),
      supportedLanguages: SUPPORTED_LANGUAGES
    };
  }
  return context;
}
