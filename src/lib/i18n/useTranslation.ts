import { usePlayerStore } from '@/store/usePlayerStore';
import { dictionaries, TranslationKey } from './dictionaries';

export function useTranslation() {
  const { settings } = usePlayerStore();
  const language = settings.language || 'en';
  const dict = dictionaries[language] || dictionaries['en'];

  const t = (key: TranslationKey, ...args: (string | number)[]): string => {
    let text = dict[key];
    
    // Fallback to English if translation is missing for the current language
    if (!text) {
      text = dictionaries['en'][key] || key;
    }

    if (args.length > 0) {
      args.forEach((arg, index) => {
        text = text.replace(`{${index}}`, String(arg));
      });
    }

    return text;
  };

  return { t, language };
}
