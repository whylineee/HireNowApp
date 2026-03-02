# HireNow - Додаток для пошуку роботи

Сучасний мобільний додаток для пошуку вакансій з інтуїтивним інтерфейсом та потужними функціями фільтрації.

## 🚀 Функції

### Основні можливості
- **Пошук вакансій** - пошук за посадою, компанією, ключовими словами та локацією
- **Фільтри** - фільтрація за типом роботи (повна зайнятість, віддалено, гібрид тощо)
- **Сортування** - сортування за зарплатою, назвою, датою
- **Збережені вакансії** - зберігання улюблених вакансій
- **Швидкі фільтри** - популярні міста та технології одним кліком
- **Статистика пошуку** - відображення кількості знайдених вакансій
- **Поділитися** - можливість поділитися вакансією

### UI/UX
- Сучасний дизайн з тінями та плавними переходами
- Адаптивний інтерфейс
- Pull-to-refresh для оновлення результатів
- Empty states з корисними підказками

## 📁 Структура проекту

```
HireNowApp/
├── docs/                   # 📚 Документация
│   ├── API.md             # API сервісів та функцій
│   ├── Components.md      # Документація компонентів
│   ├── Hooks.md           # Custom React hooks
│   ├── Types.md           # TypeScript типи та інтерфейси
│   └── Development.md     # Гайдлайни розробки
├── backend/                # Django backend + admin panel
│   ├── backend/            # Django project settings/urls
│   ├── jobs/               # Job domain models + admin
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend setup instructions
├── app/                    # Екрани (Expo Router)
│   ├── _layout.tsx         # Головний layout
│   ├── index.tsx           # Головний екран пошуку
│   ├── favorites.tsx       # Екран збережених вакансій
│   └── job/
│       └── [id].tsx        # Детальна сторінка вакансії
│
├── components/             # React компоненти
│   ├── job/               # Компоненти для вакансій
│   │   ├── JobCard.tsx    # Картка вакансії
│   │   └── FavoriteButton.tsx
│   ├── layout/            # Layout компоненти
│   │   ├── Header.tsx
│   │   └── Screen.tsx
│   ├── ui/                # UI компоненти
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── EmptyState.tsx     # Компонент для порожніх станів
│   ├── FilterChips.tsx    # Фільтри за типом роботи
│   ├── QuickFilters.tsx   # Швидкі фільтри
│   ├── SearchBar.tsx      # Панель пошуку
│   ├── SearchStats.tsx   # Статистика пошуку
│   └── SortButton.tsx    # Кнопка сортування
│
├── constants/             # Константи
│   ├── job.ts            # Константи для вакансій
│   └── theme.ts          # Тема додатку (кольори, типографіка)
│
├── hooks/                 # Custom React hooks
│   ├── useDebounce.ts
│   ├── useFavorites.ts   # Хук для збережених вакансій
│   └── useJobs.ts        # Хук для роботи з вакансіями
│
├── services/             # Сервіси та API
│   └── jobs.ts           # Сервіс для роботи з вакансіями
│
├── types/                 # TypeScript типи
│   └── job.ts            # Типи для вакансій
│
└── utils/                 # Утиліти
    └── salary.ts         # Утиліти для роботи з зарплатою
```

## 🎨 Дизайн система

### Кольори
- **Primary**: Teal (#0F766E) - головний акцент
- **Background**: Світлий сірий (#F8FAFC)
- **Surface**: Білий (#FFFFFF)
- **Text**: Темний сірий (#0F172A)

### Типографіка
- Розміри: xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px), 3xl (28px)
- Вага: normal (400), medium (500), semibold (600), bold (700)

### Відступи
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, xxl: 48px

## 🛠 Технології

- **React Native** - фреймворк для мобільних додатків
- **Expo** - платформа для розробки
- **TypeScript** - типізація
- **Expo Router** - навігація
- **Django** - серверна частина та адмін-панель

## 🖥 Backend (Django Admin)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

- Admin panel: `http://127.0.0.1:8000/admin/`
- Healthcheck: `http://127.0.0.1:8000/health/`

## � Документація

Детальна технічна документація доступна в папці `/docs/`:

- **[API.md](./docs/API.md)** - Документація API сервісів
- **[Components.md](./docs/Components.md)** - Опис всіх React компонентів
- **[Hooks.md](./docs/Hooks.md)** - Custom React hooks
- **[Types.md](./docs/Types.md)** - TypeScript типи та інтерфейси
- **[Development.md](./docs/Development.md)** - Гайдлайни розробки

### Ключові особливості архітектури

#### 🏗️ Компонентна архітектура
- **Reusable UI Components** - Базові компоненти в `/components/ui/`
- **Business Components** - Спеціалізовані компоненти в `/components/job/`
- **Layout Components** - Компоненти для структури в `/components/layout/`

#### 🎣 Custom Hooks
- **useJobs** - Управління пошуком вакансій
- **useFavorites** - Робота зі збереженими вакансіями
- **useDebounce** - Оптимізація пошуку

#### 🎨 Дизайн система
- **Централізована тема** в `/constants/theme.ts`
- **TypeScript типи** для всіх компонентів
- **Responsive design** для різних розмірів екрану

#### 🔄 Управління станом
- **Local state** з React hooks
- **In-memory storage** для збережених вакансій
- **Async data fetching** з обробкою помилок

## � Встановлення

```bash
npm install
```

## 🚀 Запуск

```bash
# Запуск на iOS
npm run ios

# Запуск на Android
npm run android

# Запуск на Web
npm run web
```

## 🔧 Розробка

### Додавання нових компонентів
1. Створіть компонент у відповідній папці в `components/`
2. Використовуйте тему з `constants/theme.ts`
3. Додайте TypeScript типи

### Додавання нових екранів
1. Створіть файл в `app/` для Expo Router
2. Використовуйте компонент `Screen` для layout
3. Додайте навігацію в `app/_layout.tsx` якщо потрібно

## 📝 Примітки

- Зараз використовуються мок-дані для демонстрації
- Для production потрібно підключити реальний API
- Збережені вакансії зберігаються в пам'яті (для постійного збереження потрібен AsyncStorage)

## 🎯 Майбутні покращення

### Короткострокові (Q1 2026)
- [ ] **Підключення реального API** - Інтеграція з job APIs (GitHub Jobs, Adzuna)
- [ ] **Постійне збереження** - AsyncStorage для збережених вакансій
- [ ] **Темна тема** - Перемикання між світлою/темною темою
- [ ] **Пуш сповіщення** - Сповіщення про нові вакансії

### Середньострокові (Q2 2026)
- [ ] **Історія пошуку** - Збереження та відображення історії пошуку
- [ ] **Рекомендації** - Алгоритм рекомендацій на основі переглядів
- [ ] **Фільтр зарплати** - Фільтрація за діапазоном зарплати
- [ ] **Профіль користувача** - Персональний профіль з налаштуваннями

### Довгострокові (Q3-Q4 2026)
- [ ] **Авторизація** - Реєстрація та вхід через email/social
- [ ] **Відгуки на вакансії** - Система подачі заявок
- [ ] **Роботодавці** - Панель для створення вакансій
- [ ] **Аналітика** - Статистика пошуку та відгуків

## 🤝 Внесок

### Як розпочати розробку

1. **Клонування репозиторію**
   ```bash
   git clone https://github.com/your-username/HireNowApp.git
   cd HireNowApp
   ```

2. **Встановлення залежностей**
   ```bash
   npm install
   ```

3. **Запуск додатку**
   ```bash
   npm start
   ```

### Правила внеску

1. **Створення branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Зміни та коміти**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push та Pull Request**
   ```bash
   git push origin feature/your-feature-name
   # Створити PR через GitHub interface
   ```

### Code Review Process

- Всі зміни проходять через Pull Request
- Обов'язкове прохідження тестів
- Дотримання [гайдлайнів розробки](./docs/Development.md)
- Оновлення документації при необхідності

## 📄 Ліцензія

Цей проект ліцензовано під MIT License - дивіться [LICENSE](LICENSE) файл для деталей.

## 📞 Контакти

- **Maintainer**: [Your Name](mailto:your.email@example.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/HireNowApp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/HireNowApp/discussions)

---

**Made with ❤️ for Ukrainian job seekers**
