import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import Header from '../components/Header_Other';
import Contact from '../components/Contact';
import servicesData from '../data/services.json';
import '../styles/service-detail.css';


const getServiceImage = (tag) => {
  
  const tagImages = {
    'คดีความ': 'คดีความ.jpg',
    'ธุรกิจ': 'ธุรกิจ.jpg',
    'วีซ่า': 'วีซ่า.jpg',
    'สืบ': 'สืบ.jpg',
    'เอกสาร': 'เอกสาร.jpg',
    'อสังหา': 'ธุรกิจ.jpg'  
  };
  
  const imageFile = tagImages[tag] || 'ธุรกิจ.jpg';
  return `/assets/Service/${imageFile}`;
};

const defaultImagePath = '/assets/ปก-1.jpg';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { t, lang, loading: i18nLoading } = useI18n();
  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const services = servicesData.services || [];
    setAllServices(services);
    
    console.log('ID param:', id);
    console.log('Available services:', services.length);
    
    const serviceId = parseInt(id);

    console.log('Looking for service ID:', serviceId);

    const found = services.find(s => s.id === serviceId);

    console.log('Found service:', found);
    
    if (!found) {
      console.error('Service not found!', { serviceId });
      console.log('Available IDs:', services.map(s => s.id));
    }
    
    setService(found);
    setLoading(false);
  }, [id]);

  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [id]);

  if (loading || i18nLoading || !service) {
    return (
      <div className="service-detail-page">
        <Header />
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <p>กำลังโหลด...</p>
        </div>
        <Contact />
      </div>
    );
  }

  
  const serviceImage = getServiceImage(service.tag);

  
  const getContent = () => {
    if (lang === 'th') {
      return service.content;
    }
    return service.translations?.[lang] || service.content;
  };

  const getServiceName = () => {
    // First check if translation from i18n services.items exists
    if (serviceInfo?.title) {
      return serviceInfo.title;
    }
    
    // If no i18n translation, return Thai name (default)
    return service.service;
  };

  // Function to translate category tag
  const getCategoryName = (tag = service.tag) => {
    const categoryMap = {
      'case': {
        th: 'คดีความ',
        en: 'Lawsuits',
        ja: '訴訟',
        ko: '소송',
        zh: '诉讼'
      },
      'business': {
        th: 'ธุรกิจ',
        en: 'Business',
        ja: 'ビジネス',
        ko: '비즈니스',
        zh: '商业'
      },
      'visa': {
        th: 'วีซ่า',
        en: 'Visa',
        ja: 'ビザ',
        ko: '비자',
        zh: '签证'
      },
      'investigation': {
        th: 'สืบ',
        en: 'Investigation',
        ja: '調査',
        ko: '조사',
        zh: '调查'
      },
      'document': {
        th: 'เอกสาร',
        en: 'Documents',
        ja: '書類',
        ko: '서류',
        zh: '文件'
      },
      'property': {
        th: 'อสังหา',
        en: 'Property',
        ja: '不動産',
        ko: '부동산',
        zh: '房地产'
      }
    };

    return categoryMap[tag]?.[lang] || tag;
  };

  // Map tag to Thai category name for i18n link matching
  const tagToThaiCategory = {
    'case': 'คดีความ',
    'business': 'ธุรกิจ',
    'visa': 'วีซ่า',
    'investigation': 'สืบ',
    'document': 'เอกสาร',
    'property': 'อสังหา'
  };


  
  const calculateReadTime = (content) => {
    if (!content) return 5;
    
    
    
    
    const cleanText = content.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    
    
    const thaiCharsPerMinute = 220;
    const charCount = cleanText.length;
    
    
    const minutes = Math.ceil(charCount / thaiCharsPerMinute);
    
    
    if (minutes <= 3) return "3-5";
    if (minutes <= 5) return "5-8";
    if (minutes <= 8) return "8-10";
    if (minutes <= 10) return "10-15";
    if (minutes <= 15) return "15-20";
    return "20-30";
  };

  
  const formatContent = (content) => {
    if (!content) return [];
    
    const sections = [];
    const lines = content.split('\n');
    let currentSection = null;
    let currentSubheading = null;
    let pendingBullets = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      
      if (!line) {
        continue;
      }
      
      
      if (line.match(/^\d+\.\s/)) {
        
        if (currentSection) {
          
          if (currentSubheading && pendingBullets.length > 0) {
            currentSubheading.items.push({
              type: 'ul',
              items: pendingBullets
            });
            pendingBullets = [];
          }
          if (currentSubheading) {
            currentSection.items.push(currentSubheading);
            currentSubheading = null;
          }
          sections.push(currentSection);
        }
        
        
        if (pendingBullets.length > 0) {
          sections.push({
            type: 'ul',
            items: pendingBullets,
            key: sections.length
          });
          pendingBullets = [];
        }
        
        
        currentSection = {
          type: 'numbered-section',
          title: line,
          items: [],
          key: sections.length
        };
      }
      
      else if (line.endsWith(':')) {
        
        if (currentSubheading) {
          if (pendingBullets.length > 0) {
            currentSubheading.items.push({
              type: 'ul',
              items: pendingBullets
            });
            pendingBullets = [];
          }
          if (currentSection) {
            currentSection.items.push(currentSubheading);
          }
        }
        
        
        currentSubheading = {
          type: 'subheading',
          title: line,
          items: []
        };
      }
      
      else if (line.match(/^\s*[•-]/)) {
        const bulletText = line.replace(/^\s*[•-]\s*/, '');
        pendingBullets.push(bulletText);
      }
      
      else {
        
        if (pendingBullets.length > 0) {
          if (currentSubheading) {
            currentSubheading.items.push({
              type: 'ul',
              items: pendingBullets
            });
          } else if (currentSection) {
            currentSection.items.push({
              type: 'ul',
              items: pendingBullets
            });
          } else {
            sections.push({
              type: 'ul',
              items: pendingBullets,
              key: sections.length
            });
          }
          pendingBullets = [];
        }
        
        
        if (currentSubheading) {
          currentSubheading.items.push({ type: 'text', text: line });
        } else if (currentSection) {
          currentSection.items.push({ type: 'text', text: line });
        } else {
          sections.push({
            type: 'p',
            content: line,
            key: sections.length
          });
        }
      }
    }
    
    
    if (pendingBullets.length > 0) {
      if (currentSubheading) {
        currentSubheading.items.push({
          type: 'ul',
          items: pendingBullets
        });
      } else if (currentSection) {
        currentSection.items.push({
          type: 'ul',
          items: pendingBullets
        });
      } else {
        sections.push({
          type: 'ul',
          items: pendingBullets,
          key: sections.length
        });
      }
    }
    
    if (currentSubheading && currentSection) {
      currentSection.items.push(currentSubheading);
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  const contentSections = formatContent(getContent());

  
  let relatedServices = allServices.filter(s => 
    s.id !== service.id && s.tag === service.tag
  );

  
  if (relatedServices.length < 3) {
    const otherServices = allServices
      .filter(s => s.id !== service.id && s.tag !== service.tag)
      .sort((a, b) => b.id - a.id)  
      .slice(0, 3 - relatedServices.length);
    
    relatedServices = [...relatedServices, ...otherServices];
  } else {
    
    relatedServices = relatedServices.slice(0, 3);
  }

  // Find service info from i18n translations
  const servicesItems = t('services.items') || [];
  
  // Match by ID
  const serviceInfo = servicesItems.find(item => item.id === service.id);
  
  console.log('Service Info:', serviceInfo);
  console.log('Service Tag:', service.tag);
  console.log('Service ID:', service.id);

  return (
    <div className="service-detail-page">
      <Header />
      
      <section 
        className="service-detail-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(36, 30, 21, 0.7), rgba(36, 30, 21, 0.7)), url(${serviceImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container">
          <Link to="/" className="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('articlesPage.backToHome')}
          </Link>
        </div>
      </section>

      <section className="service-detail-content">
        <div className="container">
          <article className="service-detail-wrapper">
            {}
            <div className="service-detail-header">
              <div className="service-meta">
                <span className="service-category">{getCategoryName()}</span>
              </div>
              <h1 className="service-detail-title">{serviceInfo?.title || getServiceName()}</h1>
              <p className="service-detail-description">
                {serviceInfo?.desc || t('articlesPage.ctaDesc')}
              </p>
              <div className="article-meta">
                <span className="article-date">{t('articlesPage.lastUpdated')} 26 {lang === 'th' ? 'ตุลาคม' : lang === 'ja' ? '10月' : lang === 'ko' ? '10월' : lang === 'zh' ? '10月' : 'October'} 2025</span>
                <span className="article-read-time">{t('articlesPage.readTime').replace('{time}', calculateReadTime(getContent()))}</span>
              </div>
            </div>
            

            {}
            <div className="service-body">
              {contentSections.map((section) => {
                if (section.type === 'numbered-section') {
                  return (
                    <div key={section.key} className="service-section">
                      <h3>{section.title}</h3>
                      {section.items.length > 0 && (
                        <div>
                          {section.items.map((item, i) => {
                            
                            if (item.type === 'subheading') {
                              return (
                                <div key={i} className="service-subsection">
                                  <h4>{item.title}</h4>
                                  {item.items.map((subItem, j) => {
                                    if (subItem.type === 'ul') {
                                      return (
                                        <ul key={j}>
                                          {subItem.items.map((bullet, k) => (
                                            <li key={k}>{bullet}</li>
                                          ))}
                                        </ul>
                                      );
                                    } else if (subItem.type === 'text') {
                                      return <p key={j}>{subItem.text}</p>;
                                    }
                                    return null;
                                  })}
                                </div>
                              );
                            }
                            
                            else if (item.type === 'ul') {
                              return (
                                <ul key={i}>
                                  {item.items.map((bullet, j) => (
                                    <li key={j}>{bullet}</li>
                                  ))}
                                </ul>
                              );
                            }
                            
                            else if (item.type === 'text') {
                              return <p key={i} style={{ margin: '10px 0 10px 20px' }}>{item.text}</p>;
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                  );
                } else if (section.type === 'ul') {
                  return (
                    <ul key={section.key}>
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  );
                } else {
                  return <p key={section.key}>{section.content}</p>;
                }
              })}

             <div className="article-cta-box">
                <h3>{t('articlesPage.ctaTitle')}</h3>
                <p>{t('articlesPage.ctaDesc')}</p>
                <a href="#contact" className="cta-button">{t('articlesPage.ctaButton')}</a>
              </div>
            </div>

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <div className="related-services">
                <h2>{t('articlesPage.relatedArticles')}</h2>
                <div className="related-services-grid">
                  {relatedServices.map((relatedService) => {
                    const relatedImage = getServiceImage(relatedService.tag);
                    
                    // Find translated service name from i18n by matching ID
                    const relatedServiceInfo = servicesItems.find(item => item.id === relatedService.id);
                    
                    const relatedServiceName = relatedServiceInfo?.title || relatedService.service;
                    
                    return (
                      <Link 
                        key={relatedService.id}
                        to={`/services/${relatedService.id}`}
                        className="related-service-card"
                      >
                        <div className="related-service-image">
                          <img 
                            src={relatedImage} 
                            alt={relatedServiceName}
                            onError={(e) => { e.target.src = defaultImagePath; }}
                          />
                        </div>
                        <div className="related-service-content">
                          <span className="related-service-category">{getCategoryName(relatedService.tag)}</span>
                          <h4>{relatedServiceName}</h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </article>
        </div>
      </section>

      <Contact />
    </div>
  );
}
