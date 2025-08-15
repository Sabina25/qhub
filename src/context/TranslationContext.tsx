import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  ReactNode,
} from 'react';
import ua from '../locales/ua.json';
import en from '../locales/en.json';

const STORAGE_KEY = 'lang';
const SUPPORTED = ['ua', 'en'] as const;
type Language = typeof SUPPORTED[number];

type Dict = Record<string, unknown>;
const dicts: Record<Language, Dict> = { ua, en };

type Vars = Record<string, string | number | boolean>;

interface Ctx {
  t: (key: string, vars?: Vars) => string;
  lang: Language;
  setLang: (lang: Language) => void;
}

const TranslationContext = createContext<Ctx | undefined>(undefined);

// ---- helpers ---------------------------------------------------------------

function getNested(dict: Dict, path: string): unknown {
  return path.split('.').reduce<unknown>(
    (acc, part) => (acc && typeof acc === 'object' ? (acc as any)[part] : undefined),
    dict
  );
}

function format(str: string, vars?: Vars): string {
  if (!vars) return str;
  return Object.keys(vars).reduce(
    (s, k) => s.replaceAll(new RegExp(`{${k}}`, 'g'), String(vars[k])),
    str
  );
}

function mapBrowserLang(l: string | undefined): Language {
  const two = (l || '').slice(0, 2).toLowerCase();
  if (two === 'uk') return 'ua'; // браузеры часто дают 'uk'
  return (SUPPORTED as readonly string[]).includes(two) ? (two as Language) : 'ua';
}

function safeGetItem(key: string): string | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}
function safeSetItem(key: string, val: string) {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, val);
  } catch {}
}

// ---- provider --------------------------------------------------------------

export function TranslationProvider({ children }: { children: ReactNode }) {
  
  const initialLang: Language = useMemo(() => {
    const fromStorage = safeGetItem(STORAGE_KEY) as Language | null;
    if (fromStorage && (SUPPORTED as readonly string[]).includes(fromStorage)) return fromStorage;

    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const fromQuery = (params?.get('lang') || '') as Language;
    if (fromQuery && (SUPPORTED as readonly string[]).includes(fromQuery)) return fromQuery;

    return mapBrowserLang(typeof navigator !== 'undefined' ? navigator.language : 'ua');
  }, []);

  const [lang, setLangState] = useState<Language>(initialLang);

  // сохраняем и проставляем <html lang="">
  useEffect(() => {
    safeSetItem(STORAGE_KEY, lang);
    if (typeof document !== 'undefined') document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const setLang = useCallback((l: Language) => {
    if (!(SUPPORTED as readonly string[]).includes(l)) return;
    setLangState(l);
  }, []);

  // t: ищем ключ в текущем языке → если нет — в fallback ('ua' → 'en' → ключ)
  const t = useCallback(
    (key: string, vars?: Vars): string => {
      const fallback: Language = lang === 'ua' ? 'en' : 'ua';

      const raw =
        (getNested(dicts[lang], key) as string | undefined) ??
        (getNested(dicts[fallback], key) as string | undefined);

      if (typeof raw !== 'string') return key; // не нашли — возвращаем ключ
      return format(raw, vars);
    },
    [lang]
  );

  const value = useMemo<Ctx>(() => ({ t, lang, setLang }), [t, lang, setLang]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslation(): Ctx {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used within a TranslationProvider');
  return ctx;
}
