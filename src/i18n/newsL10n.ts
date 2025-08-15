export type Lang = 'ua' | 'en';
export type L10n<T> = Record<Lang, T>;

export function pickL10n<T>(val: any, lang: Lang, fallback: Lang = 'ua'): T | '' {
  if (typeof val === 'string') return val as any; // поддержка старых доков
  if (val && typeof val === 'object') {
    return (val[lang] ?? val[fallback] ?? val.en ?? val.ua ?? '') as any;
  }
  return '' as any;
}


export function transliterate(input: string): string {
  const map: Record<string, string> = {
    // укр
    'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ie','ж':'zh',
    'з':'z','и':'y','і':'i','ї':'i','й':'i','к':'k','л':'l','м':'m','н':'n',
    'о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts',
    'ч':'ch','ш':'sh','щ':'shch','ь':'','ю':'iu','я':'ia',
    // рус доп
    'ъ':'','ы':'y','э':'e','ё':'e',
    // разные апострофы/кавычки — просто убираем
    "'":'','`':'', '\u2019':'', '\u02BC':'' // ’ и ʼ
  };

  const s = input.toLowerCase();
  let out = '';
  for (const ch of s) out += map[ch] ?? ch;
  return out;
}

export function slugify(s: string): string {
  return transliterate(s)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // удалить диакритику
    .replace(/[^a-z0-9]+/g, '-')  // всё, что не латиница/цифры → дефис
    .replace(/^-+|-+$/g, '')      // обрезать края
    .replace(/-{2,}/g, '-');      // схлопнуть дефисы
}
