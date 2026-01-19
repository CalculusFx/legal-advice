import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import Header from '../components/Header_Other';
import Contact from '../components/Contact';
import '../styles/article-detail.css';


const getArticleImage = (topic) => {
  // Use topic (หัวข้อใหญ่) for image filename
  return `/assets/Article/${topic}.jpg`;
};

const defaultImagePath = '/assets/ปก-1.jpg';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const { t, lang, loading: i18nLoading } = useI18n();
  const [article, setArticle] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get localized content
  const getLocalizedContent = (article, field) => {
    if (!article) return '';
    if (lang === 'th') return article[field];
    
    // Handle different translation fields
    if (field === 'topic' && article.topicTranslations && article.topicTranslations[lang]) {
      return article.topicTranslations[lang] || article[field];
    }
    if (field === 'title' && article.titleTranslations && article.titleTranslations[lang]) {
      return article.titleTranslations[lang] || article[field];
    }
    if (field === 'content' && article.contentTranslations && article.contentTranslations[lang]) {
      return article.contentTranslations[lang] || article[field];
    }
    
    return article[field];
  };

  useEffect(() => {
    fetch('/src/data/articles.json')
      .then(res => res.json())
      .then(data => {
        setAllArticles(data.articles || []);
        const articleId = parseInt(id);
        const found = data.articles.find(a => a.id === articleId);
        setArticle(found);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading articles:', err);
        setLoading(false);
      });
  }, [id]);

  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [id]);

  if (loading || i18nLoading || !article) {
    return (
      <div className="article-detail-page">
        <Header />
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <p>กำลังโหลด...</p>
        </div>
        <Contact />
      </div>
    );
  }

  
  // Use topic for image (always Thai)
  const articleImage = getArticleImage(article.topic);
  
  // Get localized topic, title, and content
  const localizedTopic = getLocalizedContent(article, 'topic');
  const localizedTitle = getLocalizedContent(article, 'title');
  const localizedContent = getLocalizedContent(article, 'content');

  
  const calculateReadTime = (content) => {
    if (!content) return "5-8";
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
    
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return paragraphs.map((para, index) => {
      const trimmed = para.trim();
      
      
      if (trimmed.match(/^#{2,3}\s/)) {
        const level = trimmed.match(/^(#{2,3})/)[1].length;
        const text = trimmed.replace(/^#{2,3}\s*/, '');
        return { type: level === 2 ? 'h2' : 'h3', content: text, key: index };
      }
      
      
      if (trimmed.includes('\n•') || trimmed.includes('\n-') || trimmed.startsWith('•') || trimmed.startsWith('-')) {
        const items = trimmed.split('\n')
          .filter(line => line.trim().match(/^[•-]/))
          .map(line => line.replace(/^[•-]\s*/, ''));
        return { type: 'ul', items, key: index };
      }
      
      
      return { type: 'p', content: trimmed, key: index };
    });
  };

  const contentSections = formatContent(localizedContent);

  
  const relatedArticles = allArticles
    .filter(a => a.id !== article.id)
    .sort((a, b) => b.id - a.id)  
    .slice(0, 3);

  return (
    <div className="article-detail-page">
      <Header />
      
      <section 
        className="article-detail-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(36, 30, 21, 0.7), rgba(36, 30, 21, 0.7)), url(${articleImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container">
          <Link to="/articles" className="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('articlesPage.backToArticles')}
          </Link>
        </div>
      </section>

      <section className="article-detail-content">
        <div className="container">
          <article className="article-detail-wrapper">
            {}
            <div className="article-detail-header">
              <h1 className="article-detail-title">{localizedTopic}</h1>
              <h2 className="article-detail-subtitle">{localizedTitle}</h2>
              <div className="article-meta">
                <span className="article-date">{t('articlesPage.lastUpdated')} 26 {lang === 'th' ? 'ตุลาคม' : lang === 'ja' ? '10月' : lang === 'ko' ? '10월' : lang === 'zh' ? '10月' : 'October'} 2025</span>
                <span className="article-read-time">{t('articlesPage.readTime').replace('{time}', calculateReadTime(localizedContent))}</span>
              </div>
            </div>

            {}
            <div className="article-body">
              {contentSections.map((section) => {
                if (section.type === 'h2') {
                  return <h2 key={section.key}>{section.content}</h2>;
                } else if (section.type === 'h3') {
                  return <h3 key={section.key}>{section.content}</h3>;
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

            {}
            <div className="related-articles">
              <h2>{t('articlesPage.relatedArticles')}</h2>
              <div className="related-articles-grid">
                {relatedArticles.map((relatedArticle) => {
                  const relatedImage = getArticleImage(relatedArticle.topic);
                  const relatedLocalizedTitle = getLocalizedContent(relatedArticle, 'title');
                  
                  return (
                    <Link 
                      key={relatedArticle.id}
                      to={`/articles/${relatedArticle.id}`}
                      className="related-article-card"
                    >
                      <div className="related-article-image">
                        <img 
                          src={relatedImage} 
                          alt={relatedLocalizedTitle}
                          onError={(e) => { e.target.src = defaultImagePath; }}
                        />
                      </div>
                      <div className="related-article-content">
                        <h4>{relatedLocalizedTitle}</h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </article>
        </div>
      </section>

      <Contact />
    </div>
  );
}
