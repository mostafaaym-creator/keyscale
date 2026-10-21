import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Layers, Box, Compass, Database, FileCheck, Info, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface SubItem {
  label: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
}

interface MenuSection {
  title: string;
  icon: React.ReactNode;
  items: SubItem[];
}

export const DesktopNav: React.FC = () => {
  const { t, dir } = useLanguage();
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const sections: MenuSection[] = [
    {
      title: t('nav.compare'),
      icon: <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      items: [
        {
          label: t('nav.keyboardCompare'),
          href: '/compare',
          description: 'Compare multiple keyboards in true relative scale',
          icon: <Layers className="w-4 h-4" />
        },
        {
          label: t('nav.customKeyboard'),
          href: '/custom',
          description: 'Enter your own custom keyboard measurements',
          icon: <Box className="w-4 h-4" />
        },
        {
          label: t('nav.deskVisualizer'),
          href: '/desk',
          description: 'Interactive desk space and footprint planner',
          icon: <Compass className="w-4 h-4" />
        }
      ]
    },
    {
      title: t('nav.database'),
      icon: <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      items: [
        {
          label: t('nav.allKeyboards'),
          href: '/keyboards',
          description: 'Search & filter 600+ verified keyboards'
        },
        {
          label: t('nav.brands'),
          href: '/brands',
          description: 'Browse models by manufacturer'
        },
        {
          label: t('nav.families'),
          href: '/families',
          description: 'Explore product families & variants'
        },
        {
          label: t('nav.recentlyAdded'),
          href: '/keyboards?sort=recent',
          description: 'Latest verified keyboard models'
        }
      ]
    },
    {
      title: t('nav.discover'),
      icon: <Compass className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      items: [
        {
          label: t('nav.findSimilar'),
          href: '/find-similar',
          description: 'Find keyboards with comparable dimensions'
        },
        {
          label: t('nav.sizeFinder'),
          href: '/keyboards?filter=size',
          description: 'Find keyboards matching exact dimensions'
        },
        {
          label: t('nav.recommendations'),
          href: '/find-similar',
          description: 'Recommended alternatives by form-factor'
        }
      ]
    },
    {
      title: t('nav.sources'),
      icon: <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      items: [
        {
          label: t('nav.evidenceDatabase'),
          href: '/sources',
          description: 'Trace primary manufacturer spec sheets & claims'
        },
        {
          label: t('nav.methodology'),
          href: '/methodology',
          description: 'How Keyscale validates physical dimensions'
        },
        {
          label: t('nav.dataRequests'),
          href: '/request',
          description: 'Submit missing keyboard models or corrections'
        }
      ]
    },
    {
      title: t('nav.about'),
      icon: <Info className="w-4 h-4 text-gray-500" />,
      items: [
        {
          label: t('nav.aboutKeyscale'),
          href: '/about',
          description: 'Our mission and design principles'
        },
        {
          label: t('nav.contact'),
          href: '/contact',
          description: 'Get in touch with the development team'
        },
        {
          label: t('nav.faq'),
          href: '/faq',
          description: 'Frequently asked questions'
        },
        {
          label: t('nav.admin'),
          href: '/admin',
          description: 'Verification queue & research dashboard'
        }
      ]
    }
  ];

  // Mouse safe hover behavior
  const handleMouseEnter = (idx: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenIndex(idx);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenIndex(null);
    }, 180);
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <nav ref={navRef} className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
      <Link
        to="/"
        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          location.pathname === '/'
            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 font-semibold'
            : 'text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
        }`}
      >
        {t('nav.home')}
      </Link>

      {sections.map((section, idx) => {
        const isOpen = openIndex === idx;
        const hasActiveChild = section.items.some(it => location.pathname === it.href.split('?')[0]);

        return (
          <div
            key={section.title}
            className="relative"
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                isOpen || hasActiveChild
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <span>{section.title}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : 'text-zinc-400'}`}
              />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
              <div
                className={`absolute top-full mt-1.5 w-72 p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  dir === 'rtl' ? 'right-0' : 'left-0'
                }`}
              >
                <div className="space-y-1">
                  {section.items.map(item => {
                    const isItemActive = location.pathname === item.href.split('?')[0];
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setOpenIndex(null)}
                        className={`flex flex-col p-2.5 rounded-lg transition-all group ${
                          isItemActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/70 text-zinc-800 dark:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {item.label}
                          </span>
                        </div>
                        {item.description && (
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                            {item.description}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
