import { useEffect, useMemo, useState } from 'react';

type Props = {
  imageSrc?: string;
  startISO?: string;           
  persist?: boolean;            
  storageKey?: string;          
  containerClass?: string;      
  stickyTopClass?: string;      
};

export default function AnnouncementBar({
  imageSrc = '/images/aziz-axtemov.jpeg',
  startISO = '2021-09-04',
  persist = false,
  storageKey = 'announcement:aziz-2021-09-04',
  containerClass = 'max-w-7xl',
  stickyTopClass = 'top-14 lg:top-16',
}: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!persist) return;
    try {
      const v = localStorage.getItem(storageKey);
      if (v === 'closed') setVisible(false);
    } catch {}
  }, [persist, storageKey]);

  useEffect(() => {
    if (!persist) return;
    try {
      localStorage.setItem(storageKey, visible ? 'open' : 'closed');
    } catch {}
  }, [visible, persist, storageKey]);

  const days = useMemo(() => {
    const [y, m, d] = startISO.split('-').map(Number);
    const startUTC = Date.UTC(y, (m ?? 1) - 1, d);
    const now = new Date();
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return Math.max(0, Math.floor((todayUTC - startUTC) / 86400000));
  }, [startISO]);

  return (
    <div className={visible ? '' : 'hidden'}>
      {/* sticky ниже фикс-шапки */}
      <div className={`sticky ${stickyTopClass} z-40`}>
        <div className="relative w-full">
          {/* Фон-фото на всю ширину */}
          <div className="absolute inset-0">
            <img
              src={imageSrc}
              alt=""
              className="w-full h-full object-cover opacity-70 pointer-events-none select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
          </div>

          {/* Контент в центрированном контейнере */}
          <div className="relative">
            <div className={`${containerClass} mx-auto px-4 sm:px-6 lg:px-8`}>
              <div className="py-4 sm:py-5 md:py-6">
                <div className="grid grid-cols-12 items-center gap-4">
                  {/* Days — узкая колонка, крупный шрифт */}
                  <div className="col-span-4 sm:col-span-3 md:col-span-2">
                    <div className="leading-none">
                      <div className="text-red-500 font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight">
                        {days.toLocaleString('en-US')}
                      </div>
                      <div className="text-red-100 text-xs sm:text-sm md:text-base -mt-1">
                        days in detention
                      </div>
                    </div>
                  </div>

                  {/* Name + brief text — широкая колонка, белый текст */}
                  <div className="col-span-7 sm:col-span-8 md:col-span-9">
                    <div className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                        Aziz Akhtemov
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg">
                        Crimean Tatar activist and political prisoner. Convicted by the occupying authority in a fabricated “sabotage” case.
                      </p>
                    </div>
                  </div>

                  {/* Close */}
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      aria-label="Close announcement"
                      onClick={() => setVisible(false)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                      title="Close"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Подкладываем min-height через паддинги выше, фон покрывает absolute-слоем */}
          <div className="invisible h-0" />
        </div>
      </div>
    </div>
  );
}
