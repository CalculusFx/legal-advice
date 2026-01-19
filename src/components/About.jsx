import React from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from "../i18n";

export default function About(){
  const { t } = useI18n()
  const lawyerImagePath = '/assets/ทนายความ.jpg';
  
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-content">
          <div className="about-border-accent"></div>
          <h2 className="about-heading">{t('about.title')}</h2>
          <p className="about-text">
            {t('about.desc')}
          </p>
          <Link className="about-btn" to="/about">{t('cta.more')} &gt;</Link>
        </div>
        <div className="about-image-wrapper">
          <div className="about-image-border"></div>
          <img 
            src={lawyerImagePath} 
            alt="ทนายความ"
            className="about-lawyer-image"
          />
        </div>
      </div>
    </section>
  )
}