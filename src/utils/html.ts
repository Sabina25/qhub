export type LinkRef = { text: string; href: string };

export function extractLinks(html: string): LinkRef[] {
  const out: LinkRef[] = [];
  if (!html) return out;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const text = (a.textContent || '').trim();
    if (href) out.push({ text, href });
  });
  return out;
}

export function sanitizeAndEnhance(html: string): string {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href && !/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
      a.setAttribute('href', 'https://' + href);
    }
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
  return doc.body.innerHTML;
}