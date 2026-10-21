import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CatalogProvider } from '@/context/CatalogContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Pages
import { HomePage } from '@/pages/HomePage';
import { ComparePage } from '@/pages/ComparePage';
import { DatabasePage } from '@/pages/DatabasePage';
import { KeyboardDetailPage } from '@/pages/KeyboardDetailPage';

const BrandsPage = lazy(() => import('@/pages/BrandsPage').then(m => ({ default: m.BrandsPage })));
const BrandDetailPage = lazy(() => import('@/pages/BrandDetailPage').then(m => ({ default: m.BrandDetailPage })));
const FamiliesPage = lazy(() => import('@/pages/FamiliesPage').then(m => ({ default: m.FamiliesPage })));
const FamilyDetailPage = lazy(() => import('@/pages/FamilyDetailPage').then(m => ({ default: m.FamilyDetailPage })));
const FindSimilarPage = lazy(() => import('@/pages/FindSimilarPage').then(m => ({ default: m.FindSimilarPage })));
const DeskVisualizerPage = lazy(() => import('@/pages/DeskVisualizerPage').then(m => ({ default: m.DeskVisualizerPage })));
const CustomKeyboardPage = lazy(() => import('@/pages/CustomKeyboardPage').then(m => ({ default: m.CustomKeyboardPage })));
const SourcesPage = lazy(() => import('@/pages/SourcesPage').then(m => ({ default: m.SourcesPage })));
const MethodologyPage = lazy(() => import('@/pages/MethodologyPage').then(m => ({ default: m.MethodologyPage })));
const RequestPage = lazy(() => import('@/pages/RequestPage').then(m => ({ default: m.RequestPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const FaqPage = lazy(() => import('@/pages/FaqPage').then(m => ({ default: m.FaqPage })));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));

const PageLoader: React.FC = () => (
  <div className="w-full min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-3 border-emerald-600/30 border-t-emerald-600 animate-spin" />
  </div>
);

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <CatalogProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
              <Header />
              <main className="flex-1 flex flex-col">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/keyboards" element={<DatabasePage />} />
                    <Route path="/keyboards/:id" element={<KeyboardDetailPage />} />
                    <Route path="/brands" element={<BrandsPage />} />
                    <Route path="/brands/:brand" element={<BrandDetailPage />} />
                    <Route path="/families" element={<FamiliesPage />} />
                    <Route path="/families/:familyId" element={<FamilyDetailPage />} />
                    <Route path="/find-similar" element={<FindSimilarPage />} />
                    <Route path="/desk" element={<DeskVisualizerPage />} />
                    <Route path="/custom" element={<CustomKeyboardPage />} />
                    <Route path="/sources" element={<SourcesPage />} />
                    <Route path="/methodology" element={<MethodologyPage />} />
                    <Route path="/request" element={<RequestPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </CatalogProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
