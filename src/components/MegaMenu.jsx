import React from "react";
import { useI18n } from "../i18n";

export default function MegaMenu({ open, inline = false, onClose }) {
  const { t } = useI18n();
  if (!open) return null;

    const raw = t("mega.groups");
    const groups = Array.isArray(raw) ? raw : [];

  return (
    <>
      {/* เงาคลุม คลิกเพื่อปิด */}
      <div className="overlay show" onClick={onClose} aria-hidden="true" />

      {/* กล่องเมนู — ไม่ใช้ .container เพื่อกันความกว้างเพี้ยน */}
      <div className={`mega-panel ${inline ? "inline" : ""} animate-in`} role="menu">
        <div className="mega-grid">
          {groups.map((g, gi) => (
            <div key={gi} className="mega-col">
              {g.items.map((it, ii) => (
                <div key={ii} className="mega-item">
                  <strong>{it.title}</strong>
                  <div className="mini">{it.detail}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
