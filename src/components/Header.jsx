import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useI18n } from "../i18n";
import MegaMenu from "./MegaMenu";
import { LANGUAGE_FLAGS, getEnabledLanguages } from "../config/languageFlags";


const logo = "/assets/Logo.png";
const bgHeader = "/assets/BG Header.png";

export default function Header() {
  const { t, lang, setLang, dictKeys } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const [megaOpen, setMegaOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const timer = React.useRef(null);
  const langTimer = React.useRef(null);

  
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  const languages = {
    th: { name: "ไทย", flag: "🇹🇭" },
    en: { name: "English", flag: "🇬🇧" },
    zh: { name: "中文", flag: "🇨🇳" },
    ja: { name: "日本語", flag: "🇯🇵" },
    ko: { name: "한국어", flag: "🇰🇷" }
  };

  // Get only enabled languages
  const enabledLanguages = getEnabledLanguages();
  const availableLanguages = enabledLanguages.reduce((acc, langKey) => {
    if (languages[langKey]) {
      acc[langKey] = languages[langKey];
    }
    return acc;
  }, {});

  // If current language is disabled, switch to default enabled language
  React.useEffect(() => {
    if (!LANGUAGE_FLAGS[lang] && enabledLanguages.length > 0) {
      setLang(enabledLanguages[0]);
    }
  }, [lang, setLang, enabledLanguages]);
  
  const open = () => { 
    
    if (window.innerWidth <= 720) return;
    clearTimeout(timer.current); 
    setMegaOpen(true); 
  };
  const close = () => { clearTimeout(timer.current); setMegaOpen(false); };
  const closeLater = () => { clearTimeout(timer.current); timer.current = setTimeout(close, 250); };

  const handleLangChange = (newLang) => {
    setLang(newLang);
    setLangOpen(false);
  };

  const handleLangMouseLeave = () => {
    clearTimeout(langTimer.current);
    langTimer.current = setTimeout(() => setLangOpen(false), 200);
  };

  const handleLangMouseEnter = () => {
    clearTimeout(langTimer.current);
    setLangOpen(true);
  };

  return (
    <header className={isScrolled ? "sticky" : ""} onKeyDown={(e)=> e.key === "Escape" && close()}>
      <div className="container nav">
        <a className="brand" href={isHomePage ? "#top" : "/"} onClick={(e) => {
          if (!isHomePage) {
            e.preventDefault();
            navigate('/');
          }
        }} aria-label="Legal Nest Thai - Home">
          <img src={logo} alt="Legal Nest Thai" className="logo" />
          <span className="brand-text">{t("brand")}</span>
        </a>

        <nav className={mobileMenuOpen ? 'mobile-open' : ''}>
          <ul>
            <li onMouseEnter={close}>
              <a href={isHomePage ? "#about" : "/about"} onClick={(e) => {
                setMobileMenuOpen(false);
                if (!isHomePage) {
                  e.preventDefault();
                  navigate('/about');
                }
              }}>{t("nav.about")}</a>
            </li>

            {}
            <div
              className="mega-anchor"
              onPointerEnter={open}
              onPointerLeave={closeLater}
              onFocusCapture={open}
              onBlurCapture={closeLater}
            >
              <li className="has-mega" onClick={(e) => {
                
                if (window.innerWidth <= 720) {
                  setMobileMenuOpen(false);
                } else {
                  
                  setMegaOpen(v=>!v);
                }
              }}>
                <a href="#services" aria-expanded={megaOpen}>{t("nav.services")}</a>
              </li>

              {}
              <MegaMenu open={megaOpen} inline onClose={close} />
            </div>

            <li onMouseEnter={close}>
              <a href="#articles" onClick={() => setMobileMenuOpen(false)}>{t("nav.articles")}</a>
            </li>
            <li onMouseEnter={close}>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>{t("nav.contact")}</a>
            </li>
          </ul>
        </nav>

        <div className="nav-controls">
          {}
          {}

          {}
          <div 
            className="lang-dropdown-wrapper"
            onMouseEnter={handleLangMouseEnter}
            onMouseLeave={handleLangMouseLeave}
          >
            <button 
              className="lang-select-btn"
              onClick={() => setLangOpen(!langOpen)}
            >
              {availableLanguages[lang]?.flag} {availableLanguages[lang]?.name}
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="lang-arrow">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {langOpen && (
              <div className="lang-dropdown">
                {enabledLanguages.map(k => (
                  <button
                    key={k}
                    className={`lang-option ${k === lang ? 'active' : ''}`}
                    onClick={() => handleLangChange(k)}
                  >
                    {availableLanguages[k]?.flag} {availableLanguages[k]?.name}
                    {k === lang && <span className="checkmark">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {}
          <button 
            className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
