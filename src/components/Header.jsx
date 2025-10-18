import React from "react";
import { useI18n } from "../i18n";
import MegaMenu from "./MegaMenu";
import logo from "../assets/logo.png";

export default function Header() {
  const { t, lang, setLang, dictKeys } = useI18n();

  const [megaOpen, setMegaOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const timer = React.useRef(null);
  const langTimer = React.useRef(null);

  // ข้อมูลภาษาพร้อมธงชาติ
  const languages = {
    th: { name: "ไทย", flag: "🇹🇭" },
    en: { name: "English", flag: "🇬🇧" },
    zh: { name: "中文", flag: "🇨🇳" },
    ja: { name: "日本語", flag: "🇯🇵" },
    ko: { name: "한국어", flag: "🇰🇷" }
  };

  // คุมการเปิด/ปิดแบบเนียน ๆ
  const open = () => { 
    // Don't open mega menu on mobile
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
    <header className="sticky" onKeyDown={(e)=> e.key === "Escape" && close()}>
      <div className="container nav">
        <a className="brand" href="#top" aria-label="Legal Nest Thai - Home">
          <img src={logo} alt="Legal Nest Thai" className="logo" />
          <span className="brand-text">{t("brand")}</span>
        </a>

        <nav className={mobileMenuOpen ? 'mobile-open' : ''}>
          <ul>
            <li onMouseEnter={close}>
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>{t("nav.about")}</a>
            </li>

            {/* ครอบปุ่มกับเมนูไว้ในกล่องเดียว -> ไม่กระพริบ */}
            <div
              className="mega-anchor"
              onPointerEnter={open}
              onPointerLeave={closeLater}
              onFocusCapture={open}
              onBlurCapture={closeLater}
            >
              <li className="has-mega" onClick={(e) => {
                // On mobile, just close menu and navigate
                if (window.innerWidth <= 720) {
                  setMobileMenuOpen(false);
                } else {
                  // On desktop, toggle mega menu
                  setMegaOpen(v=>!v);
                }
              }}>
                <a href="#services" aria-expanded={megaOpen}>{t("nav.services")}</a>
              </li>

              {/* แสดงเมก้าเมนูแบบ inline (absolute) */}
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
          {/* ปุ่มปรึกษาทนายฟรี
          <a href="#contact" className="btn consult-btn">
            {t("cta.free")}
          </a> */}

          {/* Custom Language Dropdown */}
          <div 
            className="lang-dropdown-wrapper"
            onMouseEnter={handleLangMouseEnter}
            onMouseLeave={handleLangMouseLeave}
          >
            <button 
              className="lang-select-btn"
              onClick={() => setLangOpen(!langOpen)}
            >
              {languages[lang]?.flag} {languages[lang]?.name}
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="lang-arrow">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {langOpen && (
              <div className="lang-dropdown">
                {dictKeys.map(k => (
                  <button
                    key={k}
                    className={`lang-option ${k === lang ? 'active' : ''}`}
                    onClick={() => handleLangChange(k)}
                  >
                    {languages[k]?.flag} {languages[k]?.name}
                    {k === lang && <span className="checkmark">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hamburger Menu Button */}
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
