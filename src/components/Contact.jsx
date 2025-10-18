import React from 'react'
import { useI18n } from "../i18n";
import phoneLogo from "../assets/Phone.png";
import mobileLogo from "../assets/Mobile.png";
import mailLogo from "../assets/Mail.png";
import timeLogo from "../assets/Time.png";
import SuccessModal from "./SuccessModal";


const getTopicFromHash = () => {
  try {
    const m = (window.location.hash || '').match(/topic=([^&]+)/)
    return m ? decodeURIComponent(m[1]) : ''
  } catch { return '' }
}

export default function Contact(){
  const { t } = useI18n()
  const [topicOpen, setTopicOpen] = React.useState(false)
  const [selectedTopic, setSelectedTopic] = React.useState('')
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitStatus, setSubmitStatus] = React.useState(null)
  const [fieldErrors, setFieldErrors] = React.useState({})
  const [modalConfig, setModalConfig] = React.useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })
  const [countryCode, setCountryCode] = React.useState('+66')
  const [countryDropdownOpen, setCountryDropdownOpen] = React.useState(false)
  const topicTimer = React.useRef(null)
  const countryTimer = React.useRef(null)

  const countries = [
    { code: '+66', flag: '🇹🇭', name: 'Thailand', nameLocal: 'ไทย' },
    { code: '+86', flag: '🇨🇳', name: 'China', nameLocal: '中国' },
    { code: '+81', flag: '🇯🇵', name: 'Japan', nameLocal: '日本' },
    { code: '+82', flag: '🇰🇷', name: 'South Korea', nameLocal: '한국' },
    { code: '+1', flag: '🇺🇸', name: 'USA/Canada', nameLocal: 'USA/Canada' },
    { code: '+44', flag: '🇬🇧', name: 'UK', nameLocal: 'UK' },
    { code: '+65', flag: '🇸🇬', name: 'Singapore', nameLocal: 'Singapore' },
    { code: '+60', flag: '🇲🇾', name: 'Malaysia', nameLocal: 'Malaysia' },
    { code: '+84', flag: '🇻🇳', name: 'Vietnam', nameLocal: 'Việt Nam' },
  ]

  const topics = t('contact.topicOptions')
  
  const showModal = (type, title, message) => {
    setModalConfig({ isOpen: true, type, title, message })
  }
  
  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false })
  }

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic)
    setTopicOpen(false)
  }

  const handleTopicMouseLeave = () => {
    clearTimeout(topicTimer.current)
    topicTimer.current = setTimeout(() => setTopicOpen(false), 200)
  }

  const handleTopicMouseEnter = () => {
    clearTimeout(topicTimer.current)
    setTopicOpen(true)
  }

  const handleCountryMouseLeave = () => {
    clearTimeout(countryTimer.current)
    countryTimer.current = setTimeout(() => setCountryDropdownOpen(false), 200)
  }

  const handleCountryMouseEnter = () => {
    clearTimeout(countryTimer.current)
    setCountryDropdownOpen(true)
  }

  const handleCountrySelect = (code) => {
    setCountryCode(code)
    setCountryDropdownOpen(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // ล้าง error ของฟิลด์นั้นๆ เมื่อผู้ใช้เริ่มพิมพ์
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // ตรวจสอบข้อมูลที่จำเป็น
    const errors = {}
    const errorMessages = []
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'กรุณากรอกชื่อ'
      errorMessages.push('กรุณากรอกชื่อ')
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'กรุณากรอกนามสกุล'
      errorMessages.push('กรุณากรอกนามสกุล')
    }
    
    if (!formData.email.trim()) {
      errors.email = 'กรุณากรอกอีเมล'
      errorMessages.push('กรุณากรอกอีเมล')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
      errorMessages.push('รูปแบบอีเมลไม่ถูกต้อง')
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'กรุณากรอกเบอร์โทรศัพท์'
      errorMessages.push('กรุณากรอกเบอร์โทรศัพท์')
    } else {
      // อนุญาตเบอร์โทรศัพท์ทั้งไทยและต่างชาติ (8-15 หลัก, รวมเครื่องหมาย + - ช่องว่าง วงเล็บ)
      const cleanPhone = formData.phone.replace(/[\s\-()]/g, '')
      const phonePattern = /^[+]?[0-9]{8,15}$/
      if (!phonePattern.test(cleanPhone)) {
        errors.phone = 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (8-15 หลัก)'
        errorMessages.push('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (8-15 หลัก)')
      }
    }
    
    if (!formData.message.trim()) {
      errors.message = 'กรุณากรอกข้อความ'
      errorMessages.push('กรุณากรอกข้อความ')
    }
    
    // ถ้ามี error ให้แสดง Modal และเซ็ต fieldErrors
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      showModal(
        'error',
        'ข้อมูลไม่ครบถ้วน',
        errorMessages.join('\n')
      )
      return
    }
    
    // ถ้าผ่านการตรวจสอบ ให้ล้าง errors
    setFieldErrors({})
    
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: `${countryCode}${formData.phone}`,
          topic: selectedTopic,
          message: formData.message
        })
      })

      // ถ้าเป็น development mode (localhost) และไม่มี Netlify function
      if (!response.ok && response.status === 404) {
        setSubmitStatus('dev-mode')
        console.log('%c===========================================', 'color: #E5C061; font-weight: bold; font-size: 16px;');
        console.log('%c📋 Development Mode - Form Data Submitted', 'color: #9D764D; font-weight: bold; font-size: 14px;');
        console.log('%c===========================================', 'color: #E5C061; font-weight: bold; font-size: 16px;');
        console.log('');
        console.log('%cข้อมูลที่กรอก:', 'color: #8B6F47; font-weight: bold;');
        console.table({
          'ชื่อ': formData.firstName,
          'นามสกุล': formData.lastName,
          'อีเมล': formData.email,
          'เบอร์โทร': `${countryCode}${formData.phone}`,
          'หัวข้อ': selectedTopic || '(ไม่ได้เลือก)',
          'ข้อความ': formData.message
        });
        console.log('');
        console.log('%c💡 หมายเหตุ:', 'color: #C9A961; font-weight: bold;');
        console.log('- ข้อมูลนี้จะถูกส่งผ่านอีเมลจริงเมื่อ deploy บน Netlify');
        console.log('- หรือใช้คำสั่ง "netlify dev" เพื่อทดสอบ functions ใน localhost');
        console.log('%c===========================================', 'color: #E5C061; font-weight: bold; font-size: 16px;');
        
        showModal(
          'dev',
          '🔧 โหมดทดสอบ',
          'ข้อมูลถูกบันทึกแล้ว!\n\n👉 เปิด Console (Cmd+Option+J) เพื่อดูรายละเอียด\n\nในการใช้งานจริง ข้อมูลจะถูกส่งผ่านอีเมลหลังจาก deploy ขึ้น Netlify'
        )
        // รีเซ็ตฟอร์ม
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        })
        setSelectedTopic('')
        setCountryCode('+66')
        setIsSubmitting(false)
        return
      }

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus('success')
        // รีเซ็ตฟอร์ม
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        })
        setSelectedTopic('')
        setCountryCode('+66')
        showModal(
          'success',
          'ส่งข้อความสำเร็จ!',
          t('contact.successMessage') || 'ข้อความของคุณถูกส่งเรียบร้อยแล้ว\nเราจะติดต่อกลับโดยเร็วที่สุด'
        )
      } else {
        setSubmitStatus('error')
        showModal(
          'error',
          'เกิดข้อผิดพลาด',
          t('contact.errorMessage') || 'ไม่สามารถส่งข้อความได้\nกรุณาลองใหม่อีกครั้ง'
        )
      }
    } catch (error) {
      console.error('Error:', error)
      setSubmitStatus('error')
      
      // ถ้าเป็น localhost ให้แสดงข้อความแบบ dev mode
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('%c===========================================', 'color: #E5C061; font-weight: bold; font-size: 16px;');
        console.log('%c📋 Development Mode - Form Data Submitted', 'color: #9D764D; font-weight: bold; font-size: 14px;');
        console.log('%c===========================================', 'color: #E5C061; font-weight: bold; font-size: 16px;');
        console.log('');
        console.log('%cข้อมูลที่กรอก:', 'color: #8B6F47; font-weight: bold;');
        console.table({
          'ชื่อ': formData.firstName,
          'นามสกุล': formData.lastName,
          'อีเมล': formData.email,
          'เบอร์โทร': `${countryCode}${formData.phone}`,
          'หัวข้อ': selectedTopic || '(ไม่ได้เลือก)',
          'ข้อความ': formData.message
        });
        console.log('');
        console.log('%c💡 หมายเหตุ:', 'color: #C9A961; font-weight: bold;');
        console.log('- ข้อมูลนี้จะถูกส่งผ่านอีเมลจริงเมื่อ deploy บน Netlify');
        console.log('- หรือใช้คำสั่ง "netlify dev" เพื่อทดสอบ functions ใน localhost');
        console.log('%c===========================================', 'color: #E5C061; font-weight: bold; font-size: 16px;');
        
        showModal(
          'dev',
          '🔧 โหมดทดสอบ',
          'ข้อมูลถูกบันทึกแล้ว!\n\n👉 เปิด Console (Cmd+Option+J) เพื่อดูรายละเอียด\n\nในการใช้งานจริง ข้อมูลจะถูกส่งผ่านอีเมลหลังจาก deploy ขึ้น Netlify'
        )
        // รีเซ็ตฟอร์ม
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        })
        setSelectedTopic('')
      } else {
        showModal(
          'error',
          'เกิดข้อผิดพลาด',
          t('contact.errorMessage') || 'ไม่สามารถส่งข้อความได้\nกรุณาลองใหม่อีกครั้ง'
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SuccessModal 
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
      />
      
      <section id="contact" className="section contact-section">
        <div className="container">
          <div className="contact-section-header">
            <h2 className="contact-section-title">{t('nav.contact')}</h2>
          </div>
        </div>
      
      <div className="container contact-container">
        {/* ฟอร์มด้านซ้าย */}
        <div className="contact-left">
          <h2 className="contact-title">{t('contact.title')}</h2>
          <p className="contact-subtitle">{t('contact.subtitle')}</p>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <input 
                  className={`form-input ${fieldErrors.firstName ? 'error' : ''}`}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder={t('contact.name')} 
                  required
                />
                {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
              </div>
              <div className="form-field">
                <input 
                  className={`form-input ${fieldErrors.lastName ? 'error' : ''}`}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder={t('contact.lastname')} 
                  required
                />
                {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <input 
                  className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('contact.email')} 
                  required
                />
                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
              </div>
              <div className="form-field">
                <div className="phone-input-wrapper">
                  <div 
                    className="country-code-selector"
                    onMouseEnter={handleCountryMouseEnter}
                    onMouseLeave={handleCountryMouseLeave}
                  >
                    <button
                      type="button"
                      className="country-code-btn"
                      onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                    >
                      <span className="country-flag">{countries.find(c => c.code === countryCode)?.flag}</span>
                      <span className="country-code">{countryCode}</span>
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="country-arrow">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {countryDropdownOpen && (
                      <div className="country-dropdown">
                        {countries.map((country) => (
                          <button
                            type="button"
                            key={country.code}
                            className={`country-option ${countryCode === country.code ? 'active' : ''}`}
                            onClick={() => handleCountrySelect(country.code)}
                          >
                            <span className="country-flag">{country.flag}</span>
                            <span className="country-code">{country.code}</span>
                            <span className="country-name">{country.nameLocal}</span>
                            {countryCode === country.code && <span className="checkmark">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input 
                    className={`form-input phone-input ${fieldErrors.phone ? 'error' : ''}`}
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="812345678" 
                    required
                  />
                </div>
                {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
              </div>
            </div>
            <div className="form-full">
              <div 
                className="topic-dropdown-wrapper"
                onMouseEnter={handleTopicMouseEnter}
                onMouseLeave={handleTopicMouseLeave}
              >
                <button
                  type="button"
                  className="topic-select-btn"
                  onClick={() => setTopicOpen(!topicOpen)}
                >
                  {selectedTopic || t('contact.topic')}
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="topic-arrow">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {topicOpen && (
                  <div className="topic-dropdown">
                    {topics.map((topic, i) => (
                      <button
                        type="button"
                        key={i}
                        className={`topic-option ${selectedTopic === topic ? 'active' : ''}`}
                        onClick={() => handleTopicSelect(topic)}
                      >
                        {topic}
                        {selectedTopic === topic && <span className="checkmark">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-full">
              <textarea 
                className={`form-textarea ${fieldErrors.message ? 'error' : ''}`}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={t('contact.message')} 
                rows="6"
                required
              ></textarea>
              {fieldErrors.message && <span className="field-error">{fieldErrors.message}</span>}
            </div>
            <div className="form-full">
              <button 
                className="btn contact-btn" 
                type="submit"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting ? (t('contact.sending') || 'กำลังส่ง...') : `${t('cta.send')} ›`}
              </button>
            </div>
          </form>
        </div>

        {/* ข้อมูลติดต่อด้านขวา */}
        <div className="contact-right">
          <div className="contact-info-card">
            <h3 className="contact-info-title">{t('contact.addressTitle')}</h3>
            <div className="contact-info-content">
              <div className="contact-info-item">
                {t('contact.addr1')}
              </div>
              <div className="contact-info-item">
                {t('contact.addr2')}
              </div>
              
              <div className="contact-info-item contact-phone">
                <img src={phoneLogo} alt="Phone" className="contact-icon-img" /> {t('footer.phone1')}
              </div>
              <div className="contact-info-item contact-phone">
                <img src={phoneLogo} alt="Phone" className="contact-icon-img" /> {t('footer.phone2')}
              </div>
              <div className="contact-info-item contact-phone">
                <img src={mobileLogo} alt="Mobile" className="contact-icon-img" /> {t('footer.mobile')}
              </div>
              
              <div className="contact-info-item">
                <img src={mailLogo} alt="Email" className="contact-icon-img" /> {t('footer.email')}
              </div>
              
              <div className="contact-info-item">
                <img src={timeLogo} alt="Hours" className="contact-icon-img" /> {t('contact.hours')}
              </div>
              
              <div className="contact-info-item">
                <img src={mailLogo} alt="Line" className="contact-icon-img" /> {t('footer.email')}
              </div>
              
              <div className="contact-info-item">
                <img src={mobileLogo} alt="Phone" className="contact-icon-img" /> {t('footer.email')}
              </div>
              
              <div className="contact-info-item">
                <img src={mailLogo} alt="Social" className="contact-icon-img" /> @lineofficial
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
    </>
  )
}