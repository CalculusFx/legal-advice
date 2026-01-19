import React from 'react'
import { useI18n } from "../i18n";


const locationLogo = "/assets/Location Logo.png";
const fbLogo = "/assets/FB Logo.png";
const ttLogo = "/assets/TT Logo.png";
const xLogo = "/assets/X Logo.png";
const inLogo = "/assets/in Logo.png";
const phoneLogo = "/assets/Footer_Phone.png";
const mobileLogo = "/assets/Footer_Mobile.png";
const mailLogo = "/assets/Footer_Mail.png";
const timeLogo = "/assets/Footer_Time.png";

export default function Footer(){
  const { t } = useI18n()
  return (
    <footer>
      <div className="container">
        <div className="footer-wrapper">
          <div className="footer-grid">
            <div className="footer-column">
              <img src={locationLogo} alt="Location" className="footer-icon-img" />
              <h3 className="footer-title">{t('footer.officeTitle')}</h3>
              <div className="footer-address">
                <p>{t('footer.address')}</p>
                <p>{t('footer.district')}</p>
                <p>{t('footer.subDistrict')}</p>
                <p>{t('footer.city')}</p>
              </div>
              <div className="footer-social">
                <a href="#" className="social-icon-link" aria-label="Facebook">
                  <img src={fbLogo} alt="Facebook" className="social-icon-img" />
                </a>
                <a href="#" className="social-icon-link" aria-label="TikTok">
                  <img src={ttLogo} alt="TikTok" className="social-icon-img" />
                </a>
                <a href="#" className="social-icon-link" aria-label="X (Twitter)">
                  <img src={xLogo} alt="X" className="social-icon-img" />
                </a>
                <a href="#" className="social-icon-link" aria-label="LinkedIn">
                  <img src={inLogo} alt="LinkedIn" className="social-icon-img" />
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">{t('footer.contactTitle')}</h3>
              <div className="footer-contact">
                <div className="contact-item">
                  <img src={phoneLogo} alt="Phone" className="contact-icon-img" />
                  <span>{t('footer.phone1')}</span>
                </div>
                <div className="contact-item">
                  <img src={phoneLogo} alt="Phone" className="contact-icon-img" />
                  <span>{t('footer.phone2')}</span>
                </div>
                <div className="contact-item">
                  <img src={mobileLogo} alt="Mobile" className="contact-icon-img" />
                  <span>{t('footer.mobile')}</span>
                </div>
                <div className="contact-item">
                  <img src={mailLogo} alt="Email" className="contact-icon-img" />
                  <span>{t('footer.email')}</span>
                </div>
                <div className="contact-item">
                  <img src={timeLogo} alt="Hours" className="contact-icon-img" />
                  <span>{t('footer.hours')}</span>
                </div>
              </div>
            </div>

            <div className="footer-column footer-map">
              <div className="map-placeholder">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.6407!2d100.5675!3d13.7745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ2JzI4LjIiTiAxMDDCsDM0JzAzLjAiRQ!5e0!3m2!1sen!2sth!4v1234567890"
                  width="100%"
                  height="200"
                  style={{border:0, borderRadius: '8px'}}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="view-larger">
                  {t('footer.viewLarger')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}