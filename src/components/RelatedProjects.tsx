import { useEffect, useState } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { fetchProjects, ProjectDoc } from '../data/projects';
import { RelatedProjectCard, ProjectCardVM } from './RelatedProjectCard';

const Q = { teal: '#4db8b8', teal2: '#2d7d9a', text: '#e8f4f4' };

type Props = { currentId: string; limit?: number; className?: string; };

export default function RelatedProjects({ currentId, limit = 3, className = '' }: Props) {
  const { t, lang } = useTranslation();
  const locale = lang === 'ua' ? 'uk-UA' : 'en-GB';
  const [items, setItems] = useState<ProjectDoc[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const all = await fetchProjects();
        const picked = [...all.filter(p => p.id !== currentId)].sort(() => Math.random() - 0.5).slice(0, limit);
        if (alive) setItems(picked);
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [currentId, limit]);

  if (loading) return (
    <section style={{ marginTop: 56 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 className="font-raleway" style={{ fontSize: 22, fontWeight: 600, color: Q.text, marginBottom: 8 }}>{t('projects.related') ?? 'Інші проєкти'}</h2>
        <div style={{ width: 32, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 16 }}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} style={{ height: 240, borderRadius: 16, background: 'rgba(77,184,184,0.06)', border: '0.5px solid rgba(77,184,184,0.1)' }} />
        ))}
      </div>
    </section>
  );

  if (!items || items.length === 0) return null;

  return (
    <section className={className} style={{ marginTop: 56 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 className="font-raleway" style={{ fontSize: 22, fontWeight: 600, color: Q.text, marginBottom: 8 }}>{t('projects.related') ?? 'Інші проєкти'}</h2>
        <div style={{ width: 32, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 16 }}>
        {items.map(p => (
          <RelatedProjectCard key={p.id}
            item={{ id: p.id, title: p.title, image: p.image, dateYMD: p.dateYMD, dateStartYMD: p.dateStartYMD, dateEndYMD: p.dateEndYMD, categoryKey: (p as any).categoryKey, featured: (p as any).featured } as ProjectCardVM}
            locale={locale}
            featuredLabel={t('news.featured') ?? 'Featured'}
            categoryLabel={p.categoryKey ? t(p.categoryKey) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
