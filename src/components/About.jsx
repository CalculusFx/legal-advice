import React from 'react'
import { useI18n } from "../i18n";
import lawyerImage from '../assets/ทนายความ.jpg'

export default function About(){
  const { t } = useI18n()
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-content">
          <div className="about-border-accent"></div>
          <h2 className="about-heading">{t('about.title')}</h2>
          <p className="about-text">
            {t('about.desc')}
          </p>
          <a className="about-btn" href="#contact">{t('cta.more')} &gt;</a>
        </div>
        <div className="about-image-wrapper">
          <div className="about-image-border"></div>
          <img 
            src={lawyerImage} 
            alt="ทนายความ"
            className="about-lawyer-image"
          />
        </div>
      </div>
    </section>
  )
}