import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../i18n';
import { Link } from 'react-router-dom';
import Header from '../components/Header_Other';
import '../styles/articles-page.css';
import Contact from '../components/Contact';
import articlesData from '../data/articles.json';


const getArticleImage = (topic) => {
  // Use topic (หัวข้อใหญ่) for image filename
  return `/assets/Article/${topic}.jpg`;
};

const defaultImagePath = '/assets/ปก-1.jpg';

export default function ArticlesPage() {
  const { t, lang, loading: i18nLoading } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  // Helper function to get localized content
  const getLocalizedContent = (article, field) => {
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

  
  const categories = useMemo(() => [
    { key: 'all', label: t('articlesPage.categories.all') },
    { key: 'lawsuits', label: t('articlesPage.categories.lawsuits') },
    { key: 'foreigners', label: t('articlesPage.categories.foreigners') },
    { key: 'business', label: t('articlesPage.categories.business') }
  ], [t]);

  
  useEffect(() => {
    setAllArticles(articlesData.articles || []);
    setLoading(false);
  }, []);

  
  const filteredArticles = allArticles.filter(article => {
    // Get localized content for search
    const localizedTopic = getLocalizedContent(article, 'topic').toLowerCase();
    const localizedTitle = getLocalizedContent(article, 'title').toLowerCase();
    const localizedContent = getLocalizedContent(article, 'content').toLowerCase();
    const search = searchQuery.toLowerCase();
    
    // Match search across topic, title, and content
    const matchesSearch = localizedTopic.includes(search) || 
                          localizedTitle.includes(search) || 
                          localizedContent.includes(search);
    
    
    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      // Define category keywords for all languages
      const categoryKeywords = {
        lawsuits: {
          th: ['คดี', 'โดน', 'ถูก', 'ฟ้อง', 'มรดก', 'พินัยกรรม', 'นายจ้าง', 'ลาออก', 'บัตรเครดิต', 'ผ่อน', 'หลอก', 'ยักยอก', 'นอกใจ'],
          en: ['fraud', 'embezzle', 'infidelity', 'lawsuit', 'estate', 'will', 'resign', 'credit card', 'debt', 'installment', 'cases'],
          ja: ['詐欺', '横領', '不貞', '訴訟', '遺産', '遺言', '退職', 'クレジットカード', '債務', 'ローン', '事件'],
          zh: ['诈骗', '挪用', '不忠', '诉讼', '遗产', '遗嘱', '辞职', '信用卡', '债务', '分期付款', '案件'],
          ko: ['사기', '횡령', '불륜', '소송', '유산', '유언', '사직', '신용카드', '부채', '할부', '사건']
        },
        foreigners: {
          th: ['ต่างชาติ', 'วีซ่า', 'คอนโด', 'จดทะเบียนสมรส', 'ใบอนุญาต', 'โนตารี', 'นักเรียน'],
          en: ['foreign', 'visa', 'condo', 'marriage', 'license', 'notarial', 'student', 'registration'],
          ja: ['外国人', 'ビザ', 'コンドミニアム', '婚姻', '許可', '公証', '学生', '登録'],
          zh: ['外国人', '签证', '公寓', '结婚', '许可证', '公证', '学生', '登记'],
          ko: ['외국인', '비자', '콘도', '결혼', '허가증', '공증', '학생', '등록']
        },
        business: {
          th: ['บริษัท', 'ธุรกิจ', 'หุ้นส่วน', 'เปิด', 'boi'],
          en: ['company', 'business', 'partner', 'establish', 'open', 'shop', 'boi', 'investment'],
          ja: ['会社', 'ビジネス', 'パートナー', '設立', '開業', '店舗', 'boi', '投資'],
          zh: ['公司', '业务', '合伙人', '成立', '开业', '商店', 'boi', '投资'],
          ko: ['회사', '사업', '파트너', '설립', '개업', '상점', 'boi', '투자']
        }
      };
      
      // Check if article matches category based on current language
      const keywords = categoryKeywords[selectedCategory];
      if (keywords) {
        const thMatch = keywords.th.some(keyword => article.topic.toLowerCase().includes(keyword) || article.title.toLowerCase().includes(keyword));
        const currentLangMatch = keywords[lang]?.some(keyword => 
          localizedTopic.includes(keyword) || localizedTitle.includes(keyword)
        );
        matchesCategory = thMatch || currentLangMatch;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  
  if (loading || i18nLoading) {
    return (
      <div className="articles-page">
        <Header />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <p>{t('articlesPage.loading')}</p>
        </div>
        <Contact />
      </div>
    );
  }

  return (
    <div className="articles-page">
      <Header />
      
      <section className="articles-hero">
        <div className="container">
          <Link to="/" className="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('articlesPage.backToHome')}
          </Link>
        </div>
      </section>

      <section className="articles-content">
        <div className="container">
          {}
          <div className="articles-title-box">
            <h2>{t('articlesPage.title')}</h2>
          </div>

          {}
          <div className="articles-wrapper">
            {}
            <div className="search-box">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="search-icon">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2"/>
                <path d="M13 13L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder={t('articlesPage.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {}
            <div className="articles-controls">
              <div className="category-tabs">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    className={`category-tab ${selectedCategory === category.key ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.key)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {}
            <div className="articles-grid">
              {currentArticles.map((article) => {
                // Get localized content
                const localizedTopic = getLocalizedContent(article, 'topic');
                const localizedTitle = getLocalizedContent(article, 'title');
                const localizedContent = getLocalizedContent(article, 'content');
                
                // Use Thai topic for image filename (original topic field)
                const articleImage = getArticleImage(article.topic);
                
                // Create excerpt from localized content
                const excerpt = localizedContent ? localizedContent.split('\n')[0] : '';
                
                return (
                  <div key={article.id} className="article-card">
                    <div className="article-image">
                      <img 
                        src={articleImage} 
                        alt={localizedTopic}
                        onError={(e) => { e.target.src = defaultImagePath; }}
                      />
                    </div>
                    <div className="article-content">
                      <h3 className="article-title">{localizedTitle}</h3>
                      <p className="article-excerpt">
                        {excerpt.length > 100 ? excerpt.substring(0, 100) + '...' : excerpt}
                      </p>
                      <Link 
                        to={`/articles/${article.id}`}
                        className="article-read-btn"
                      >
                        {t('articlesPage.readMore')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredArticles.length === 0 && (
              <div className="no-results">
                <p>{t('articlesPage.noResults')}</p>
              </div>
            )}
          </div>

          {}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                {t('articlesPage.pagination.previous')}
              </button>
              
              <div className="pagination-info">
                {t('articlesPage.pagination.pageOf')
                  .replace('{current}', currentPage)
                  .replace('{total}', totalPages)}
              </div>

              <button 
                className="pagination-btn next"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                {t('articlesPage.pagination.next')}
              </button>
            </div>
          )}
        </div>
      </section>

      <Contact />
    </div>
  );
}
