import en from '../public/locales/en.json';
import ar from '../public/locales/ar.json';

const translations: Record<string, any> = { en, ar };

export function getTranslation(lang: string, key: string): string {
    const keys = key.split('.');
    let value = translations[lang] || translations['en'];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
}

export type Locale = 'en' | 'ar';
export const locales: Locale[] = ['en', 'ar'];
export const defaultLocale: Locale = 'en';
