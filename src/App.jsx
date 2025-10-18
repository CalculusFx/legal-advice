import React from 'react'
import { I18nProvider } from "./i18n";
import Header from './components/Header'
import Hero from './components/Hero'
import Topics from './components/Topics'
import Services from './components/Services'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App(){
  return (
    <I18nProvider>
      <Header/>
      <Hero/>
      <Topics/>
      <Services/>
      <About/>
      <Contact/>
      <Footer/>
    </I18nProvider>
  )
}