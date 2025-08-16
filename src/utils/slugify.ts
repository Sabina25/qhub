export function slugify(s: string): string {
    const t = (s || '').toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return t
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }