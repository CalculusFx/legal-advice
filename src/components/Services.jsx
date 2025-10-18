import React from 'react'
import { useI18n } from '../i18n'

// แบ่ง array เป็นหน้า ๆ หน้าละ 10 ใบ (5x2)
const chunk10 = (arr) => {
  const out = []
  for (let i = 0; i < arr.length; i += 10) out.push(arr.slice(i, i + 10))
  return out.length ? out : [[]]
}

export default function Services(){
  const { t } = useI18n()
  const items = t('services.items') || []

  const slides = items.length > 10 ? chunk10(items) : [items]
  const total = slides.length

  const [index, setIndex] = React.useState(0)
  const [hovering, setHovering] = React.useState(false)

  // === Drag/Swipe state ===
  const viewportRef = React.useRef(null)
  const draggingRef = React.useRef(false)
  const startXRef = React.useRef(0)
  const baseXRef = React.useRef(0)      // พิกัดแทร็กก่อนเริ่มลาก (px)
  const [dragX, setDragX] = React.useState(null) // พิกัดขณะลาก (px) -> null = ใช้โหมดเปอร์เซ็นต์ตาม index

  // ปุ่มนำทาง
  const go = (dir) => setIndex(i => (i + dir + total) % total)

  // Auto-play 10 วิ (หยุดเมื่อ hover/drag หรือมีหน้าเดียว)
  React.useEffect(() => {
    if (total <= 1 || hovering || draggingRef.current) return
    const id = setInterval(() => setIndex(i => (i + 1) % total), 10000)
    return () => clearInterval(id)
  }, [total, hovering])

  // จัดพิกัดฐานเมื่อ index/ขนาดหน้าต่างเปลี่ยน
  React.useEffect(() => {
    const updateBase = () => {
      const w = viewportRef.current?.offsetWidth || 0
      baseXRef.current = -index * w
      if (draggingRef.current) setDragX(baseXRef.current)
    }
    updateBase()
    window.addEventListener('resize', updateBase)
    return () => window.removeEventListener('resize', updateBase)
  }, [index])

  // ===== Pointer / Touch handlers =====
  const getDelta = (clientX) => {
    // ขอบยางที่ปลายสไลด์ (rubber band)
    const w = viewportRef.current?.offsetWidth || 0
    let delta = clientX - startXRef.current
    if ((index === 0 && delta > 0) || (index === total - 1 && delta < 0)) {
      delta *= 0.35
    }
    return baseXRef.current + delta
  }

  const onPointerDown = (e) => {
    if (total <= 1) return
    draggingRef.current = true
    setHovering(true)
    startXRef.current = e.clientX
    const w = viewportRef.current?.offsetWidth || 0
    baseXRef.current = -index * w
    setDragX(baseXRef.current)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    // ป้องกันเลือกข้อความระหว่างลาก
    document.body.style.userSelect = 'none'
    document.body.style.touchAction = 'none'
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    setDragX(getDelta(e.clientX))
  }

  const onPointerUp = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    const w = viewportRef.current?.offsetWidth || 0
    const moved = (dragX ?? baseXRef.current) - baseXRef.current
    const threshold = Math.min(160, w * 0.15)
    if (moved < -threshold) go(1)
    else if (moved > threshold) go(-1)
    else setIndex(i => i) // กลับที่เดิม
    setDragX(null)
    setHovering(false)
    document.body.style.userSelect = ''
    document.body.style.touchAction = ''
  }

  return (
    <section id="services" className="section services-section">
      <div className="container">
        <div className="title"><span className="pill">{t('services.title')}</span></div>

        <div className="services-slider-container">
          <div
            className={`services-viewport${draggingRef.current ? ' dragging' : ''}`}
            ref={viewportRef}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => { if(!draggingRef.current) setHovering(false) }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div
              className="services-track"
              style={ dragX === null
                ? { transform:`translateX(-${index * 100}%)` }
                : { transform:`translateX(${dragX}px)` }
              }
            >
              { (slides.length ? slides : [[]]).map((slide, si) => (
                <div key={si} className="services-slide">
                  {slide.map((it, idx) => (
                    <article key={idx} className="service-card">
                      <div className="accent" />
                      <h4>{it.title}</h4>
                      <p className="mini">{it.desc}</p>
                      <a className="btn white ghost" href="#contact">{t('cta.more')}</a>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* แยก Navigation ออกมาจาก slider container */}
        {total > 1 && (
          <div className="services-navigation">
            <button 
              className="svc-nav prev" 
              onClick={() => go(-1)} 
              aria-label="Previous"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="svc-dots">
              {slides.map((_, i) => (
                <span 
                  key={i} 
                  className={`dot ${i === index ? 'on' : ''}`} 
                  onClick={() => setIndex(i)} 
                />
              ))}
            </div>
            <button 
              className="svc-nav next" 
              onClick={() => go(1)} 
              aria-label="Next"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
    
  )
}
