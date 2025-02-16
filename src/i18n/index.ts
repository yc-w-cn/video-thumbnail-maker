import i18next from './i18next';

export const setLocale = (locale: string) => {
  i18next.changeLanguage(locale);
};

export const getLocale = () => {
  return i18next.language;
};

export default i18next;
