import { useEffect, useState } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { fetchProjects, ProjectDoc } from '../data/projects';
import { RelatedProjectCard, ProjectCardVM } from './RelatedProjectCard';

type Props = {
  currentId: string;
  limit?: number;
  className?: string;
};

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
        const others = all.filter(p => p.id !== currentId);
        const shuffled = [...others].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, limit);
        if (alive) setItems(picked);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [currentId, limit]);

  if (loading) {
    return (
      <section className={`mt-16 ${className}`}>
        <h2 className="text-2xl font-bold mb-8">{t('projects.related') ?? 'Інші проєкти'}</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <section className={`mt-16 mb-20 ${className}`}>
      <h2 className="text-2xl font-bold mb-8">{t('projects.related') ?? 'Інші проєкти'}</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const vm: ProjectCardVM = {
            id: p.id,
            title: p.title,
            image: p.image,
            dateYMD: p.dateYMD,
            dateStartYMD: p.dateStartYMD,
            dateEndYMD: p.dateEndYMD,
            categoryKey: (p as any).categoryKey,
            featured: (p as any).featured,
          };
          return (
            <RelatedProjectCard
              key={p.id}
              item={vm}
              locale={locale}
              featuredLabel={t('news.featured') ?? 'Featured'}       
              categoryLabel={p.categoryKey ? t(p.categoryKey) : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
