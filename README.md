# Middle Messenger Project

Этот проект представляет собой учебное приложение для обмена сообщениями. Оно было создано в рамках обучения на курсе Яндекс.Практикума

## Структура проекта

Проект включает в себя следующие страницы:

1. **Авторизация** - форма входа в систему.
2. **Регистрация** - форма регистрации нового пользователя.
3. **Список чатов и лента переписки** - отображает чаты и переписку пользователя. Будет реализован в следующих спринтах.
4. **Настройки пользователя** - позволяет изменять информацию профиля, аватар и пароль.
5. **Страница 404** - отображается в случае, если запрашиваемая страница не найдена.
6. **Страница 500** - отображается в случае ошибки на сервере.

## Описание скриптов:

"start": "vite" Запускает локальный сервер разработки с использованием Vite. Vite автоматизирует сборку и обновление ресурсов проекта с обеспечением быстрого times для запуска, благодаря предварительной сборке зависимостей.
"build": "tsc && vite build" Выполняется TypeScript-компилятор (tsc) для компиляции TypeScript файлов в JavaScript. Затем команда vite build используется для создания production-версии приложения, оптимизируя и минимизируя все ресурсы для развертывания.
"preview": "vite preview" Запускает локальный сервер для предварительного просмотра уже собранной production версии проекта. Это позволяет проверить, как приложение будет работать в production среде, перед тем как его развернуть.

## Ссылка на макеты:

Страница регистрации - https://www.figma.com/design/208njTuIH7rv9DUEfLIHjD/Untitled?node-id=4-89&node-type=frame&t=jrCtYdnN4QXJRbsd-0

Страница аторизации - https://www.figma.com/design/208njTuIH7rv9DUEfLIHjD/Untitled?node-id=2-16&node-type=symbol&t=jrCtYdnN4QXJRbsd-0

Чат - https://www.figma.com/design/208njTuIH7rv9DUEfLIHjD/Untitled?node-id=5-118&node-type=canvas&t=jrCtYdnN4QXJRbsd-0

Личные данные - https://www.figma.com/design/208njTuIH7rv9DUEfLIHjD/Untitled?node-id=5-687&node-type=canvas&t=jrCtYdnN4QXJRbsd-0

500 - https://www.figma.com/design/208njTuIH7rv9DUEfLIHjD/Untitled?node-id=6-852&node-type=frame&t=jrCtYdnN4QXJRbsd-0

404 - https://www.figma.com/design/208njTuIH7rv9DUEfLIHjD/Untitled?node-id=6-870&node-type=frame&t=jrCtYdnN4QXJRbsd-0

## Ссылка на задеплоенный проект:

https://messengerpraltikum.netlify.app/
