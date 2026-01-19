import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from "../i18n"
import Header from '../components/Header_Other'
import Footer from '../components/Footer'
import Contact from '../components/Contact'
import '../styles/about-detail.css'

export default function AboutDetailPage() {
  const { t } = useI18n()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    
    const wrapper = document.querySelector('.about-team-grid-wrapper');
    if (wrapper) {
      let scrollInterval = setInterval(() => {
        const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
        if (wrapper.scrollLeft >= maxScroll) {
          wrapper.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          wrapper.scrollBy({ left: 360, behavior: 'smooth' });
        }
      }, 3000); 

      
      wrapper.addEventListener('mouseenter', () => clearInterval(scrollInterval));
      wrapper.addEventListener('mouseleave', () => {
        scrollInterval = setInterval(() => {
          const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
          if (wrapper.scrollLeft >= maxScroll) {
            wrapper.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            wrapper.scrollBy({ left: 360, behavior: 'smooth' });
          }
        }, 3000);
      });

      return () => clearInterval(scrollInterval);
    }
  }, [])

  const lawyers = [
    {
      name: "นายนรินทร์ เปรมหิรัญ",
      title: "ที่ปรึกษาอาวุโส",
      image: "/assets/About/ทีมทนาย/1.jpg"
    },
    {
      name: "นายพิศิษฐ์ ผลวิเศษชัยกุล",
      title: "ทนายความที่ปรึกษาอาวุโส",
      image: "/assets/About/ทีมทนาย/2.jpg"
    },
    {
      name: "นางสาวมัลลิกา เทพวงษ์",
      title: "ทนายความที่ปรึกษา",
      image: "/assets/About/ทีมทนาย/4.jpg"
    },
    {
      name: "นางสาวณัฎฐ์ฑิภา ศรีสิริรักษ์",
      title: "ทนายความ",
      image: "/assets/About/ทีมทนาย/3.jpg"
    },
    {
      name: "นายสุพรัตน์ เกตุแก้ว",
      title: "ทนายความ",
      image: "/assets/About/ทีมทนาย/6.jpg"
    },
    {
      name: "นางสาวธชนกกนก อริยนานา",
      title: "ทนายความ",
      image: "/assets/About/ทีมทนาย/5.jpg"
    },
    {
      name: "นางสาวศิรประภา มาตสารี",
      title: "ทนายความ",
      image: "/assets/About/ทีมทนาย/7.jpg"
    }
  ]

  return (
    <div className="about-detail-page">
      <Header />
      
      {}
      <section className="about-hero-section">
        <Link to="/" className="about-back-link">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          กลับหน้าหลัก
        </Link>
      </section>

      {}
      <section className="about-main-section">
        <div className="about-main-wrapper">
          {}
          <div className="about-content-box">
            <div className="about-badge">
              <span>เกี่ยวกับเรา</span>
            </div>
            
            <div className="about-main-container">
              <div className="about-main-text-box">
                <p>
                  การขับเคลื่อนงานกฎหมายที่ซับซ้อนและละเอียดอ่อน ต้องอาศัยการทำงานร่วมกันของบุคลากรที่มีความรู้ความสามารถเฉพาะทาง คณะทำงานของเราประกอบด้วยผู้ทรงคุณวุฒิ นักกฎหมาย และผู้เชี่ยวชาญเฉพาะด้าน ที่มุ่งมั่นในการวิเคราะห์ วางแผน และกำกับดูแลทุกขั้นตอนการดำเนินงาน 
                  เพื่อให้มั่นใจว่าการให้คำปรึกษาและการดำเนินการตามกฎหมาย เป็นไปอย่างถูกต้อง รวดเร็ว และเป็นประโยชน์สูงสุดต่อทุกฝ่าย
                </p>
              </div>
              <div className="about-main-image">
                <img src="/assets/About/ภาพตราชั่ง.jpg" alt="เกี่ยวกับเรา" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="about-team-section-wrapper">
        <div className="about-team-content-box">
          <h2 className="about-team-title">ผู้บริหารและคณะทำงาน</h2>
          <div className="about-team-carousel">
            <button 
              className="about-team-scroll-btn about-team-scroll-left"
              onClick={(e) => {
                const wrapper = e.target.closest('.about-team-carousel').querySelector('.about-team-grid-wrapper');
                wrapper.scrollBy({ left: -400, behavior: 'smooth' });
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="about-team-grid-wrapper">
              <div className="about-team-grid">
                {lawyers.map((lawyer, index) => (
                  <div key={index} className="about-team-card">
                    <div className="about-team-image-wrapper">
                      <img src={lawyer.image} alt={lawyer.name} />
                    </div>
                    <div className="about-team-info">
                      <h3>{lawyer.name}</h3>
                      <p>{lawyer.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="about-team-scroll-btn about-team-scroll-right"
              onClick={(e) => {
                const wrapper = e.target.closest('.about-team-carousel').querySelector('.about-team-grid-wrapper');
                wrapper.scrollBy({ left: 400, behavior: 'smooth' });
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>
      <section>
        <Contact />
      </section>
    </div>
  )
}
