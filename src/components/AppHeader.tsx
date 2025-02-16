import React from 'react';
import ThemeToggle from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useTranslation } from 'react-i18next';

const AppHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {t('app.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t('app.description')}
        </p>
      </div>
      <div className="absolute right-0 top-0 flex gap-0">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default AppHeader;
