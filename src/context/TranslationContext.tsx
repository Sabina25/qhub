import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import ua from '../locales/ua.json'
import en from '../locales/en.json'

type Language = 'ua' | 'en'
type TranslationData = Record<string, any>
const translations: Record<Language, TranslationData> = { ua, en }

interface TranslationContextType {
  t: (key: string) => string
  lang: Language
  setLang: (lang: Language) => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
)

interface TranslationProviderProps {
  children: ReactNode
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [lang, setLangState] = useState<Language | null>(null)

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as Language | null
    if (storedLang && translations[storedLang]) {
      setLangState(storedLang)
    } else {
      const browserLang = navigator.languages?.[0]?.slice(0, 2) as Language
      const detectedLang: Language = ['ua', 'en'].includes(browserLang) ? browserLang : 'ua'
      setLangState(detectedLang)
      localStorage.setItem('lang', detectedLang)
    }
  }, [])

  useEffect(() => {
    if (lang) {
      localStorage.setItem('lang', lang)
    }
  }, [lang])

  // const setLang = (newLang: Language) => {
  //   setLangState(newLang)
  //   localStorage.setItem('lang', newLang)
  // }

  const setLang = (newLang: Language) => {
    console.log('Выбран язык:', newLang)
    setLangState(newLang)
    localStorage.setItem('lang', newLang)
  }

  const t = (key: string): string => {
    if (!lang) return key
    const parts = key.split('.')
    return (
      parts.reduce((acc: any, part: string) => acc?.[part], translations[lang]) || key
    )
  }

  if (!lang) return null 

  return (
    <TranslationContext.Provider value={{ t, lang, setLang }}>
      {children}
    </TranslationContext.Provider>
  )
}


export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}
