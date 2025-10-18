import React from 'react'
import { useI18n } from "../i18n";
import heroImg from "../assets/01หน้าแรก.jpg";

export default function Hero(){
  const { t } = useI18n();
  return (
    <section id="top" className="hero">
      {/* รูปเต็มพื้นที่ */}
      <img src={heroImg} alt="" className="hero-img" loading="eager" />

      {/* เนื้อหา */}
      <div className="container inner">
       <div className="content">
         <h1>{t("hero.title")}</h1>
         <p>{t("hero.desc")}</p>
         <a className="btn" href="#contact">{t("cta.free")}</a>
       </div>
     </div>

      {/* แถบทองล่าง */}
      <div className="hero-goldbar" />
    </section>
  );
}