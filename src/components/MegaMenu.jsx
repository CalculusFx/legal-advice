import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

export default function MegaMenu({ open, inline = false, onClose }) {
  const { t } = useI18n();
  if (!open) return null;

  
  const items = t("services.items");
  
  // Debug: Check if items is loaded
  console.log('MegaMenu items:', items);
  
  // Ensure items is always an array
  const itemsArray = Array.isArray(items) ? items : [];

  return (
    <>
      {}
      <div className="overlay show" onClick={onClose} aria-hidden="true" />

      {}
      <div className={`mega-panel ${inline ? "inline" : ""} animate-in`} role="menu">
        <div className="mega-grid">
          {itemsArray.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>
              กำลังโหลดข้อมูล...
            </div>
          ) : (
            itemsArray.map((item, index) => (
              <Link 
                key={index} 
                to={`/services/${item.id}`}
                className="mega-item"
                onClick={onClose}
              >
                <strong>{item.title}</strong>
                <div className="mega-mini">{item.desc}</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
