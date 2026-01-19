import React from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'


// Map index in lawfirm/practice arrays to article IDs
const lawfirmArticleIds = [1, 2, 3, 4, 5, 6, 7, 8]; // คดีความถูกหลอกให้ลงทุน -> ซื้อรถผ่อนไม่ไหว
const practiceArticleIds = [9, 10, 11, 12, 13, 14, 15, 16]; // เป็นหนี้บัตรเครดิต -> อยากมีคอนโดในไทย

function Col({title, list}){
  const makeHref = (text) => {
    return `#contact?topic=${encodeURIComponent(text)}`;
  }

  return (
    <div className="card topics-card">
      <h3 className="topics-col">{title}</h3>

      <ul className="topic-list">
        {list.map((x,i)=>{
          const href = makeHref(x);
          const isArticleLink = href.startsWith('/articles/');
          
          return (
            <li key={i}>
              {isArticleLink ? (
                <Link className="list-link" to={href}>
                  <span className="icon scale" aria-hidden="true"></span>
                  <span className="txt">{x}</span>
                </Link>
              ) : (
                <a className="list-link" href={href}>
                  <span className="icon scale" aria-hidden="true"></span>
                  <span className="txt">{x}</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>

      <div style={{marginTop:12}}>
        <a className="btn white" href="#articles">More</a>
      </div>
    </div>
  )
}

export default function Topics(){
  const { t } = useI18n()
  const law = t('topics.lawfirm')
  const prac = t('topics.practice')

return (
    <section id="articles">
      <div className="container">
        <div className="title"><span className="pill">{t('topics.title')}</span></div>
        <div className="card">
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:20, maxWidth:'1000px', margin:'0 auto'}}>
            <div>
              <h3 className="topics-col">{t('topics.lawFirmTitle')}</h3>
              <ul className="topic-list">
                {law.map((x,i)=>{
                  const articleId = lawfirmArticleIds[i];
                  const href = articleId ? `/articles/${articleId}` : `#contact?topic=${encodeURIComponent(x)}`;
                  const isArticleLink = !!articleId;
                  
                  return (
                    <li key={i}>
                      {isArticleLink ? (
                        <Link className="list-link" to={href}>
                          <span className="icon scale" aria-hidden="true"></span>
                          <span className="txt">{x}</span>
                        </Link>
                      ) : (
                        <a className="list-link" href={href}>
                          <span className="icon scale" aria-hidden="true"></span>
                          <span className="txt">{x}</span>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h3 className="topics-col">{t('topics.practiceTitle')}</h3>
              <ul className="topic-list">
                {prac.map((x,i)=>{
                  const articleId = practiceArticleIds[i];
                  const href = articleId ? `/articles/${articleId}` : `#contact?topic=${encodeURIComponent(x)}`;
                  const isArticleLink = !!articleId;
                  
                  return (
                    <li key={i}>
                      {isArticleLink ? (
                        <Link className="list-link" to={href}>
                          <span className="icon scale" aria-hidden="true"></span>
                          <span className="txt">{x}</span>
                        </Link>
                      ) : (
                        <a className="list-link" href={href}>
                          <span className="icon scale" aria-hidden="true"></span>
                          <span className="txt">{x}</span>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div style={{marginTop:24, textAlign:'center'}}>
            <Link className="btn white" to="/articles">{t('cta.more')}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
