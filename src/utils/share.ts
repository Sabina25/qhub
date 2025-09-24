export function buildShareUrl(path: string, opts: { version?: string; lang?: 'ua' | 'en' } = {}) {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://qirimhub.com';
    const url = new URL(path, base);
  
    const curr = typeof window !== 'undefined' ? new URL(window.location.href) : null;
    const lang = opts.lang ?? (curr?.searchParams.get('lang') === 'en' ? 'en' : 'ua');
    url.searchParams.set('lang', lang); 
  
    if (opts.version) url.searchParams.set('v', String(opts.version)); 
    return url.toString();
  }
  