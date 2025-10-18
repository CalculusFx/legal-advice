import React from 'react'
import { useI18n } from '../i18n'

function Col({title, list}){
  const makeHref = (text) => `#contact?topic=${encodeURIComponent(text)}`

  return (
    <div className="card topics-card">
      <h3 className="topics-col">{title}</h3>

      <ul className="topic-list">
        {list.map((x,i)=>(
          <li key={i}>
            <a className="list-link" href={makeHref(x)}>
              <span className="icon scale" aria-hidden="true"></span>
              <span className="txt">{x}</span>
            </a>
          </li>
        ))}
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
                {law.map((x,i)=>(
                  <li key={i}>
                    <a className="list-link" href={`#contact?topic=${encodeURIComponent(x)}`}>
                      <span className="icon scale" aria-hidden="true"></span>
                      <span className="txt">{x}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="topics-col">{t('topics.practiceTitle')}</h3>
              <ul className="topic-list">
                {prac.map((x,i)=>(
                  <li key={i}>
                    <a className="list-link" href={`#contact?topic=${encodeURIComponent(x)}`}>
                      <span className="icon scale" aria-hidden="true"></span>
                      <span className="txt">{x}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{marginTop:24, textAlign:'center'}}>
            <a className="btn white" href="#articles">{t('cta.more')}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
