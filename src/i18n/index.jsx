// Lightweight i18n (TH/EN/ZH/JA/KO)
import React, { createContext, useContext, useMemo, useState } from "react";
import th from "./th.json";
import en from "./en.json";
import zh from "./zh.json";
import ja from "./ja.json";
import ko from "./ko.json";

const dict = { th, en, zh, ja, ko };
const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState("th");
  const t = (key) => {
    const parts = key.split(".");
    let cur = dict[lang] || {};
    for (const p of parts) cur = (cur || {})[p];
    return cur || key;
  };
  const value = useMemo(() => ({ lang, setLang, t, dictKeys: Object.keys(dict) }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
