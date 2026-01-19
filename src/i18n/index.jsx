// Lightweight i18n (TH/EN/ZH/JA/KO)
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import thData from "./th.json";
import enData from "./en.json";
import zhData from "./zh.json";
import jaData from "./ja.json";
import koData from "./ko.json";

const I18nContext = createContext();

const dictionaries = {
  th: thData,
  en: enData,
  zh: zhData,
  ja: jaData,
  ko: koData
};

export function I18nProvider({ children }) {
  const [lang, setLang] = useState("th");
  const [loading, setLoading] = useState(false);

  const t = (key) => {
    const parts = key.split(".");
    let cur = dictionaries[lang] || {};
    for (const p of parts) cur = (cur || {})[p];
    return cur || key;
  };

  const value = useMemo(
    () => ({ lang, setLang, t, dictKeys: Object.keys(dictionaries), loading }),
    [lang, loading]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
