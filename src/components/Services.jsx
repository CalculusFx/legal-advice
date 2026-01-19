import React from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'


const chunk10 = (arr) => {
  const out = []
  for (let i = 0; i < arr.length; i += 10) out.push(arr.slice(i, i + 10))
  return out.length ? out : [[]]
}

export default function Services(){
  const { t } = useI18n()
  const items = t('services.items')
  
  // Debug: Check if items is loaded
  console.log('Services items:', items)
  
  // Ensure items is always an array
  const itemsArray = Array.isArray(items) ? items : []

  const slides = itemsArray.length > 10 ? chunk10(itemsArray) : [itemsArray]
  const total = slides.length

  const [index, setIndex] = React.useState(0)
  const [hovering, setHovering] = React.useState(false)

  
  const viewportRef = React.useRef(null)
  const draggingRef = React.useRef(false)
  const startXRef = React.useRef(0)
  const baseXRef = React.useRef(0)      
  const [dragX, setDragX] = React.useState(null)
  const hasDraggedRef = React.useRef(false)  // Track if user actually dragged 

  
  const go = (dir) => setIndex(i => (i + dir + total) % total)

  
  React.useEffect(() => {
    if (total <= 1 || hovering || draggingRef.current) return
    const id = setInterval(() => setIndex(i => (i + 1) % total), 10000)
    return () => clearInterval(id)
  }, [total, hovering])

  
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

  
  const getDelta = (clientX) => {
    
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
    hasDraggedRef.current = false  // Reset drag flag
    setHovering(true)
    startXRef.current = e.clientX
    const w = viewportRef.current?.offsetWidth || 0
    baseXRef.current = -index * w
    setDragX(baseXRef.current)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    
    document.body.style.userSelect = 'none'
    document.body.style.touchAction = 'none'
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    const moved = Math.abs(e.clientX - startXRef.current)
    if (moved > 5) {  // If moved more than 5px, consider it a drag
      hasDraggedRef.current = true
    }
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
    else setIndex(i => i) 
    setDragX(null)
    setHovering(false)
    document.body.style.userSelect = ''
    document.body.style.touchAction = ''
    
    // Reset drag flag after a short delay
    setTimeout(() => {
      hasDraggedRef.current = false
    }, 100)
  }

  return (
    <section id="services" className="section services-section">
      <div className="container">
        <div className="title"><span className="pill">{t('services.title')}</span></div>

        {itemsArray.length === 0 ? (
          <div style={{ 
            padding: '4rem 2rem', 
            textAlign: 'center',
            color: '#666',
            fontSize: '1.2rem'
          }}>
            กำลังโหลดบริการ...
          </div>
        ) : (
          <>
            <div className="services-slider-container">
              <div
                className={`services-viewport${draggingRef.current ? ' dragging' : ''}`}
                ref={viewportRef}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => { if(!draggingRef.current) setHovering(false) }}
              >
                <div
                  className="services-track"
                  style={ dragX === null
                    ? { transform:`translateX(-${index * 100}%)` }
                    : { transform:`translateX(${dragX}px)` }
                  }
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  { (slides.length ? slides : [[]]).map((slide, si) => (
                    <div key={si} className="services-slide">
                      {slide.map((it, idx) => (
                        <article key={idx} className="service-card">
                          <div className="accent" />
                          <h4>{it.title}</h4>
                          <p className="service-mini">{it.desc}</p>
                          {it.link ? (
                            <Link 
                              className="btn white ghost" 
                              to={it.link}
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Prevent navigation if user was dragging
                                if (hasDraggedRef.current) {
                                  e.preventDefault();
                                  console.log('Click prevented - user was dragging');
                                } else {
                                  console.log('Navigating to:', it.link);
                                }
                              }}
                            >
                              {t('cta.more')}
                            </Link>
                          ) : (
                            <a 
                              className="btn white ghost" 
                              href="#contact"
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              {t('cta.more')}
                            </a>
                          )}
                        </article>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {}
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
          </>
        )}
      </div>
    </section>
  )
}
