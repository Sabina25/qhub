# Q-hub — Кримська проєктна фундація

> Веб-сайт кримськотатарської молодіжної організації, що об'єднує молодь по всій Європі через освітні, медійні та культурні ініціативи.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=flat-square)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black&style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)

---

## Стек технологій

| Категорія | Технологія |
|-----------|-----------|
| UI Framework | React 18 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS + inline styles |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| Auth | Firebase Auth |
| Routing | React Router v6 |
| Rich Text | ReactQuill |
| Slider | Keen Slider |
| Icons | Lucide React |
| Email | Firebase Extension (mail) |

---

## Структура проєкту

```
src/
├── App.tsx                        # Головний роутер + scroll-snap Home
├── index.css                      # Глобальні стилі (тёмна тема)
├── main.tsx                       # Точка входу
│
├── auth/
│   ├── AuthContext.tsx            # Firebase Auth контекст
│   ├── RequireAuth.tsx            # Захист адмін-роутів
│   └── constants.ts               # Auth константи
│
├── components/
│   ├── mainPage/
│   │   ├── Hero.tsx               # Секція Hero (full-photo, статистика)
│   │   ├── Mission.tsx            # Місія — bento grid
│   │   ├── News.tsx               # Останні новини — featured + grid
│   │   ├── Projects.tsx           # Проєкти — featured + 2×2 grid
│   │   ├── Members.tsx            # Команда — auto-fill сітка
│   │   └── HomeSnap.css           # Scroll-snap стилі
│   │
│   ├── header/
│   │   ├── Header.tsx             # Обгортка хедера
│   │   ├── HeaderUI.tsx           # UI хедера + slide-in мобільне меню
│   │   └── useHeaderLogic.ts      # Логіка хедера (активний якір, скрол)
│   │
│   ├── admin/
│   │   ├── AdminLayout.tsx        # Layout адмін-панелі
│   │   ├── AdminMenu.tsx          # Навігація адмін-панелі
│   │   ├── CreateNewsForm.tsx     # Форма створення новини (autosave, preview)
│   │   ├── ProjectForm.tsx        # Форма проєкту
│   │   ├── NewsCard.tsx           # Картка новини
│   │   ├── NewsGrid.tsx           # Сітка новин
│   │   ├── NewsTable.tsx          # Таблиця новин з пагінацією
│   │   ├── ProjectsGrid.tsx       # Сітка проєктів
│   │   └── ProjectsTable.tsx      # Таблиця проєктів
│   │
│   ├── media/
│   │   ├── ShortsRail.tsx         # YouTube Shorts горизонтальна лента
│   │   ├── VideoGrid.tsx          # Сітка відео
│   │   └── VideoLightbox.tsx      # Модальний плеєр
│   │
│   ├── routing/
│   │   └── ScrollManager.tsx      # Скрол до верху при переході
│   │
│   ├── AnnouncementBanner.tsx     # Банер політв'язнів (fixed, з лічильником)
│   ├── Contact.tsx                # Форма контакту
│   ├── FancyCarousel.tsx          # Карусель з thumbnail strip
│   ├── Footer.tsx                 # Футер
│   ├── LogoMarquee.tsx            # Партнери
│   ├── NeuralNetwork.tsx          # Canvas анімація нейромережі
│   ├── ParallaxBannerProps.tsx    # Паралакс-банер для статей
│   ├── ProjectCard.tsx            # Картка проєкту
│   ├── ProjectsGrid.tsx           # Публічна сітка проєктів
│   ├── RelatedNews.tsx            # Схожі новини
│   ├── RelatedProjectCard.tsx     # Картка схожого проєкту
│   ├── RelatedProjects.tsx        # Блок схожих проєктів
│   └── VideoGallery.tsx           # Галерея YouTube відео
│
├── context/
│   └── TranslationContext.tsx     # i18n контекст (UA/EN)
│
├── data/
│   ├── news.ts                    # Firestore: отримання новин
│   ├── projects.ts                # Firestore: отримання проєктів
│   └── members.tsx                # Дані команди
│
├── hooks/
│   ├── useAllNews.ts              # Всі новини з пагінацією
│   ├── useAllProjects.ts          # Всі проєкти з пагінацією
│   ├── useCreateNews.ts           # Логіка створення новини
│   ├── useIdleLogout.ts           # Авто-вихід при бездіяльності
│   ├── useImageUpload.ts          # Завантаження зображень у Storage
│   ├── useNews.ts                 # CRUD новин для адмін-панелі
│   ├── useProjectForm.ts          # Логіка форми проєкту
│   ├── useProjects.ts             # CRUD проєктів
│   └── useYouTubeFeed.ts          # YouTube Data API v3
│
├── pages/
│   ├── AllEventsPage.tsx          # Всі новини
│   ├── AllProjectsPage.tsx        # Всі проєкти
│   ├── CreateNewsPage.tsx         # Адмін: створення/редагування новини
│   ├── CreateProjectPage.tsx      # Адмін: створення/редагування проєкту
│   ├── EventDetailPage.tsx        # Стаття новини
│   ├── Login.tsx                  # Сторінка входу
│   ├── OurMediaPage.tsx           # ЗМІ — YouTube Shorts + відео
│   └── ProjectDetailPage.tsx      # Деталі проєкту
│
├── locales/
│   ├── ua.json                    # Переклад українська
│   └── en.json                    # Переклад англійська
│
├── types/
│   ├── l10n.ts                    # Типи локалізації
│   └── youtube.ts                 # Типи YouTube API
│
└── utils/
    ├── dates.ts                   # Форматування дат
    ├── editor.ts                  # Налаштування Quill
    ├── html.ts                    # HTML утиліти
    ├── l10n.ts                    # Локалізація хелпери
    ├── share.ts                   # Web Share API
    ├── slugify.ts                 # Slug генератор
    ├── youtube.ts                 # YouTube embed хелпери
    └── youtubeApi.ts              # YouTube Data API клієнт
```

---

## Сторінки та роути

| Маршрут | Компонент | Опис |
|---------|-----------|------|
| `/` | `App.tsx` (Home) | Головна — scroll-snap секції |
| `/events` | `AllEventsPage` | Всі новини з фільтрацією |
| `/events/:id` | `EventDetailPage` | Деталі статті |
| `/projects` | `AllProjectsPage` | Всі проєкти |
| `/projects/:id` | `ProjectDetailPage` | Деталі проєкту |
| `/media` | `OurMediaPage` | YouTube ЗМІ |
| `/login` | `Login` | Вхід в адмін-панель |
| `/admin` | `AdminMenu` | Адмін-панель (захищено) |
| `/admin/create-news` | `CreateNewsPage` | Створення/редагування новин |
| `/admin/create-project` | `CreateProjectPage` | Створення/редагування проєктів |

---

## Запуск

### Вимоги

- Node.js 18+
- npm або yarn

### Встановлення

```bash
git clone <repo-url>
cd qhub
npm install
```

### Змінні середовища

Створи файл `.env` в корені проєкту:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_YT_API_KEY=...
VITE_YT_CHANNEL_ID=...
```

### Розробка

```bash
npm run dev
```

### Білд

```bash
npm run build
npm run preview
```

---

## Firebase структура

### Колекції Firestore

| Колекція | Опис |
|----------|------|
| `news` | Новини та події |
| `projects` | Проєкти організації |
| `contactMessages` | Повідомлення з форми контакту |
| `mail` | Черга email через Firebase Extension |

### Структура документу `news`

```ts
{
  id: string
  title: { ua: string; en: string }
  excerpt: { ua: string; en: string }  // HTML
  image: string                         // Storage URL
  dateYMD: string                       // "YYYY-MM-DD"
  categoryKey: string
  featured: boolean
  createdAt: Timestamp
}
```

### Структура документу `projects`

```ts
{
  id: string
  title: { ua: string; en: string }
  descriptionHtml: { ua: string; en: string }
  image: string
  gallery: string[]
  dateYMD?: string
  dateStartYMD?: string
  dateEndYMD?: string
  location: { ua: string; en: string }
  funding: { ua: string; en: string }
  participants: { ua: string; en: string }
  youtubeUrls: string[]
  featured: boolean
}
```

---

## Дизайн система

| Параметр | Значення |
|----------|---------|
| Background | `#080c14` |
| Teal (primary) | `#4db8b8` |
| Teal (dark) | `#2d7d9a` |
| Text | `#e8f4f4` |
| Text muted | `rgba(200,230,230,0.6)` |
| Orange accent | `#f97316` |
| Font heading | Raleway |
| Font body | System sans-serif |

---

## Локалізація

Сайт підтримує два мови: **UA** (українська) та **EN** (англійська).

Переклади знаходяться в `src/locales/ua.json` та `src/locales/en.json`.

Для додавання нового тексту:

```json
// ua.json
{
  "my.new.key": "Мій текст"
}

// en.json
{
  "my.new.key": "My text"
}
```

Використання в компоненті:

```tsx
const { t, lang } = useTranslation();
return <p>{t('my.new.key')}</p>;
```

---

## Адмін-панель

Доступна за `/admin` після входу через Firebase Auth.

**Функції:**
- Створення та редагування новин з autosave чернетки
- Завантаження зображень у Firebase Storage
- Підтримка двох мов (UA/EN) з індикаторами заповненості
- Preview статті перед публікацією
- Таблиця з фільтрацією та пагінацією (25 на сторінку)

---

## Розробники

Проєкт розроблено для [Q-hub](https://qirimhub.com) — Кримської проєктної фундації.
