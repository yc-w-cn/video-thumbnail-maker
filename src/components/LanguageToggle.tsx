import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export function LanguageToggle() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale) {
      i18n.changeLanguage(savedLocale);
    }
  }, [i18n]);

  const handleLanguageChange = (locale: string) => {
    i18n.changeLanguage(locale);
    localStorage.setItem('locale', locale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer rounded-full"
          title={t('language.toggle')}
        >
          {i18n.language === 'zh' ? '中' : 'En'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('zh')}>
          {t('language.zh')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          {t('language.en')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
