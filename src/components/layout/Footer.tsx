import React from 'react';
import { Link } from 'react-router-dom';
import { Keyboard, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold">
                <Keyboard className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-zinc-900 dark:text-white">Keyscale</span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {t('footer.about')}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Verifiable primary sources</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
              {t('nav.compare')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/compare" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.keyboardCompare')}
                </Link>
              </li>
              <li>
                <Link to="/custom" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.customKeyboard')}
                </Link>
              </li>
              <li>
                <Link to="/desk" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.deskVisualizer')}
                </Link>
              </li>
              <li>
                <Link to="/find-similar" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.findSimilar')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Catalog & Sources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
              {t('nav.database')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/keyboards" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.allKeyboards')}
                </Link>
              </li>
              <li>
                <Link to="/brands" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.brands')}
                </Link>
              </li>
              <li>
                <Link to="/families" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.families')}
                </Link>
              </li>
              <li>
                <Link to="/sources" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.evidenceDatabase')}
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.methodology')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Project & Trust */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
              {t('nav.about')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.aboutKeyscale')}
                </Link>
              </li>
              <li>
                <Link to="/request" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.dataRequests')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.faq')}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t('nav.admin')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} {t('footer.copyright')}</p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {t('footer.noAffiliation')}
          </p>
        </div>
      </div>
    </footer>
  );
};
