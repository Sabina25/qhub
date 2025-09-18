export type Lang = 'ua' | 'en';

export function pickL10nWithLang(
  val: any,
  lang: Lang
): { text: string; used?: Lang } {
  if (!val) return { text: '' };

  if (typeof val === 'string') {
    return { text: val, used: lang };
  }

  if (val.hasOwnProperty(lang)) {
    return { text: val[lang] ?? '', used: lang };
  }

  if (val.hasOwnProperty('ua')) {
    return { text: val.ua ?? '', used: 'ua' };
  }
  if (val.hasOwnProperty('en')) {
    return { text: val.en ?? '', used: 'en' };
  }

  return { text: '' };
}


export function pickL10nKeepEmpty(val: any, lang: 'ua'|'en') {
  if (!val) return { text: '' };
  if (typeof val === 'string') return { text: val, used: lang };
  if (Object.prototype.hasOwnProperty.call(val, lang)) {
    return { text: typeof val[lang] === 'string' ? val[lang] : '', used: lang };
  }
  if (Object.prototype.hasOwnProperty.call(val, 'ua')) return { text: typeof val.ua === 'string' ? val.ua : '', used: 'ua' };
  if (Object.prototype.hasOwnProperty.call(val, 'en')) return { text: typeof val.en === 'string' ? val.en : '', used: 'en' };
  return { text: '' };
}

