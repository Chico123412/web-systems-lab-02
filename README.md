# Library Management System

Лабораторна робота №2 з дисципліни «Вебсистеми».

## Тема

Розробка клієнтського застосунку управління бібліотекою.

## Мета

Розробити клієнтський вебзастосунок для обліку книг і користувачів, позичання та повернення книг із використанням TypeScript, класів, інтерфейсів, generics, модулів і просторів імен.

## Опублікований застосунок

https://chico123412.github.io/web-systems-lab-02/

Дані зберігаються в LocalStorage браузера, тому для кожного браузера та пристрою списки книг і користувачів окремі.

## Реалізована функціональність

- додавання книг;
- додавання користувачів;
- видалення книг і користувачів;
- перевірка обов’язкових полів;
- перевірка числового ID користувача;
- перевірка року видання;
- перевірка електронної адреси;
- пошук книг за назвою або автором;
- позичання книг;
- повернення книг;
- обмеження до трьох позичених книг на користувача;
- модальні повідомлення без використання alert;
- збереження даних у LocalStorage;
- відновлення даних після перезавантаження;
- пагінація списків по 5 елементів;
- адаптивний інтерфейс Bootstrap.

## Технології

- TypeScript;
- webpack;
- Vite;
- Bootstrap;
- SCSS;
- LocalStorage;
- Mocha;
- Chai;
- ESLint;
- Prettier;
- Husky;
- Git і GitHub;
- GitHub Pages.

## Структура проєкту

```text
src/
├── models/
│   ├── interfaces/
│   │   ├── IBook.ts
│   │   └── IUser.ts
│   ├── Book.ts
│   └── User.ts
├── services/
│   ├── Library.ts
│   ├── LibraryManager.ts
│   ├── NotificationService.ts
│   └── Storage.ts
├── styles/
│   └── main.scss
├── types/
│   ├── assets.d.ts
│   └── index.ts
├── ui/
│   ├── components/
│   │   ├── BookForm.ts
│   │   ├── BookList.ts
│   │   ├── Modal.ts
│   │   ├── UserForm.ts
│   │   └── UserList.ts
│   └── render.ts
├── utils/
│   ├── idGenerator.ts
│   └── validators.ts
└── index.ts

tests/
├── library.test.ts
└── validation.test.ts
```
