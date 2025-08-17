export type Lang = 'ua' | 'en';
export type L10n<T> = { ua: T; en: T };
export type LinkRef = { text: string; href: string };

export function pickL10n(v: any, lang: Lang): string {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object') return v[lang] ?? v.ua ?? v.en ?? '';
  return '';
}
