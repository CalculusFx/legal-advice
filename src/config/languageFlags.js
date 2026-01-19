// Language Feature Flags Configuration
// Set to true to enable the language, false to disable

export const LANGUAGE_FLAGS = {
  th: true,   // Thai - Always enabled (default language) ✅ 100% Complete
  en: true,   // English - Enabled ✅ 100% Complete
  ja: true,   // Japanese - Enabled ✅ 100% Complete
  zh: false,   // Chinese - Disabled (not ready yet)
  ko: false   // Korean - Disabled (not ready yet)
};

// Helper function to get enabled languages
export const getEnabledLanguages = () => {
  return Object.entries(LANGUAGE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([lang]) => lang);
};

// Helper function to check if a language is enabled
export const isLanguageEnabled = (lang) => {
  return LANGUAGE_FLAGS[lang] === true;
};

// Get the first enabled language (fallback)
export const getDefaultLanguage = () => {
  const enabled = getEnabledLanguages();
  return enabled.length > 0 ? enabled[0] : 'th';
};
