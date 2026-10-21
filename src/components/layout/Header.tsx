import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Globe, Sun, Moon, Keyboard } from 'lucide-react';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { isDark, setTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <Keyboard className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white leading-none">
                Keyscale
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-700 dark:text-emerald-400">
                Scale & Spec
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            onClick={() => navigate('/keyboards')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 transition-colors cursor-pointer"
            aria-label="Quick search keyboards"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-zinc-700 rounded shadow-2xs border border-zinc-200 dark:border-zinc-600">
              /
            </kbd>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
            title={language === 'en' ? 'Switch to Arabic' : 'التحويل للإنجليزية'}
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs uppercase">{language === 'en' ? 'AR' : 'EN'}</span>
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </header>
  );
};
