// components/routing/ScrollManager.tsx
import { useLayoutEffect, useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

type Props = {
  headerSelector?: string;          // например '#site-header'
  anchorOffset?: number;            // если нет селектора, ручной отступ
  scrollContainerSelector?: string; // если скроллит не window, а, скажем, '#app-scroll'
};

export default function ScrollManager({
  headerSelector,
  anchorOffset,
  scrollContainerSelector,
}: Props) {
  const location = useLocation();
  const navType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'
  const positionsRef = useRef<Map<string, number>>(new Map());
  const prevKeyRef = useRef<string | null>(null);

  const getContainer = () =>
    scrollContainerSelector
      ? (document.querySelector(scrollContainerSelector) as HTMLElement | null)
      : null;

  // отключаем нативное восстановление
  useEffect(() => {
    const prev = history.scrollRestoration;
    try { history.scrollRestoration = 'manual'; } catch {}
    return () => { try { history.scrollRestoration = prev; } catch {} };
  }, []);

  // запоминаем позицию предыдущего экрана
  useEffect(() => {
    const keyPrev = prevKeyRef.current;
    const cont = getContainer();
    const y = cont ? cont.scrollTop : window.scrollY;
    if (keyPrev != null) positionsRef.current.set(keyPrev, y);

    const keyNow =
      (location as any).key ?? `${location.pathname}${location.search}${location.hash}`;
    prevKeyRef.current = keyNow;
  }, [location, scrollContainerSelector]);

  // СКРОЛЛ БЕЗ МЕРЦАНИЯ (до пейнта)
  useLayoutEffect(() => {
    const cont = getContainer();
    const scrollToNow = (y: number) => {
      // временно отключаем CSS smooth (если прописан глобально)
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      if (cont) cont.scrollTo({ top: y, left: 0 });
      else window.scrollTo({ top: y, left: 0 });
      html.style.scrollBehavior = prev;
    };

    const key =
      (location as any).key ?? `${location.pathname}${location.search}${location.hash}`;

    // вычисляем offset хедера
    const headerEl = headerSelector
      ? (document.querySelector(headerSelector) as HTMLElement | null)
      : null;
    const offset = (headerEl?.getBoundingClientRect().height ?? anchorOffset ?? 0) + 4;

    // 1) HASH: скроллим к элементу синхронно
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const baseTop = (cont ? cont.scrollTop : window.scrollY) + rect.top;
        scrollToNow(baseTop - offset);
        return;
      }
      // если узел появится позже (ленивая загрузка) — один тик
      setTimeout(() => {
        const el2 = document.getElementById(id);
        if (el2) {
          const rect2 = el2.getBoundingClientRect();
          const baseTop2 = (cont ? cont.scrollTop : window.scrollY) + rect2.top;
          scrollToNow(baseTop2 - offset);
        }
      }, 0);
      return;
    }

    // 2) POP: восстанавливаем полож.
    if (navType === 'POP' && positionsRef.current.has(key)) {
      const y = positionsRef.current.get(key) ?? 0;
      scrollToNow(y);
      return;
    }

    // 3) Обычный переход: к верху
    scrollToNow(0);
  }, [location, navType, headerSelector, anchorOffset, scrollContainerSelector]);

  return null;
}
