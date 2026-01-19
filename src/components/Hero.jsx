import React from 'react'
import { useI18n } from "../i18n";

export default function Hero(){
  const { t } = useI18n();
  const heroImgPath = "/assets/01หน้าแรก.jpg";
  
  return (
    <section id="top" className="hero">
      {}
      <img src={heroImgPath} alt="" className="hero-img" loading="eager" />

      {}
      <div className="container inner">
       <div className="content">
         <h1>{t("hero.title")}</h1>
         <p>{t("hero.desc")}</p>
         <a className="btn" href="#contact">{t("cta.free")}</a>
       </div>
     </div>

      {}
      <div className="hero-goldbar" />
    </section>
  );
}