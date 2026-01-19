import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { I18nProvider } from "./i18n"
import HomePage from './pages/HomePage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import AboutDetailPage from './pages/AboutDetailPage'

export default function App(){
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          <Route path="/services/:category/:id" element={<ServiceDetailPage />} />
          <Route path="/about" element={<AboutDetailPage />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  )
}