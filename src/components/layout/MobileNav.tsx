import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronDown, Layers, Box, Compass, Database, FileCheck, Info, Globe, Moon, Sun } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { t, language, setLanguage, dir } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const location = useLocation();

  const [expandedSection, setExpandedSection] = useState<string | null>('compare');

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sections = [
    {
      id: 'compare',
      title: t('nav.compare'),
      icon: <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      items: [
        { label: t('nav.keyboardCompare'), href: '/compare' },
        { label: t('nav.customKeyboard'), href: '/custom' },
        { label: t('nav.deskVisualizer'), href: '/desk' }
      ]
    },
    {
      id: 'database',
      title: t('nav.database'),
      icon: <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      items: [
        { label: t('nav.allKeyboards'), href: '/keyboards' },
        { label: t('nav.brands'), href: '/brands' },
        { label: t('nav.families'), href: '/families' },
        { label: t('nav.recentlyAdded'), href: '/keyboards?sort=recent' }
      ]
    },
    {
      id: 'discover',
      title: t('nav.discover'),
      icon: <Compass className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      items: [
        { label: t('nav.findSimilar'), href: '/find-similar' },
        { label: t('nav.sizeFinder'), href: '/keyboards?filter=size' }
      ]
    },
    {
      id: 'sources',
      title: t('nav.sources'),
      icon: <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      items: [
        { label: t('nav.evidenceDatabase'), href: '/sources' },
        { label: t('nav.methodology'), href: '/methodology' },
        { label: t('nav.dataRequests'), href: '/request' }
      ]
    },
    {
      id: 'about',
      title: t('nav.about'),
      icon: <Info className="w-5 h-5 text-zinc-500" />,
      items: [
        { label: t('nav.aboutKeyscale'), href: '/about' },
        { label: t('nav.contact'), href: '/contact' },
        { label: t('nav.faq'), href: '/faq' },
        { label: t('nav.admin'), href: '/admin' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer */}
      <div
        className={`fixed inset-y-0 ${
          dir === 'rtl' ? 'right-0' : 'left-0'
        } w-80 max-w-[85vw] bg-white dark:bg-zinc-900 shadow-2xl flex flex-col z-50 transition-transform duration-300 ease-out`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              K
            </div>
            <span className="font-bold text-lg text-zinc-900 dark:text-white">Keyscale</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close navigation"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <Link
            to="/"
            onClick={onClose}
            className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              location.pathname === '/'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {t('nav.home')}
          </Link>

          {sections.map(section => {
            const isExpanded = expandedSection === section.id;
            return (
              <div key={section.id} className="border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
                <button
                  type="button"
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70"
                >
                  <div className="flex items-center gap-2.5">
                    {section.icon}
                    <span>{section.title}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="mt-1 space-y-1 ps-8 pe-2">
                    {section.items.map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={onClose}
                        className={`block py-2 px-3 text-sm rounded-md transition-colors ${
                          location.pathname === item.href.split('?')[0]
                            ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50/60 dark:bg-emerald-950/20'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer controls: Language and Theme */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50 dark:bg-zinc-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
              <Globe className="w-4 h-4" /> Language
            </span>
            <div className="flex items-center bg-zinc-200 dark:bg-zinc-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  language === 'ar'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} Theme
            </span>
            <div className="flex items-center bg-zinc-200 dark:bg-zinc-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setTheme('light')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-zinc-700 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
