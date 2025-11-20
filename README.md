# DagDev — Dagestan Dev

Премиальный сайт компании DagDev с фокусом на DevOps, локальную идентичность Дагестана и готовые визитки руководителей.

## Структура

- `index.html` — главная (hero, преимущества, контакт).
- `team.html`, `business-cards.html`, `services.html`, `contact.html`, `admin.html`.
- `assets/` — CSS, JS, изображения, SVG.
- `exports/businesscards/` — PDF/PNG/SVG (90×50 мм + 3 мм bleed, 300 DPI CMYK для PDF).
- `dagdev-site.zip` — архив для «Скачать всё».

## Стили и адаптив

- Цветовая схема: градиент тёмно-синий → чёрный, акценты циан/пурпур.
- CSS‑переменные для смены темы (`assets/css/main.css`).
- Класс галереи визиток: `.business-card-gallery` (используйте блок из `business-cards.html`).

```html
<section class="business-card-gallery">
  <!-- вставьте карточки из business-cards.html -->
</section>
```

## Админ/CMS

- `admin.html` позволяет редактировать услуги, контакты, визитки и генерировать PDF (jsPDF).
- Данные хранятся в `localStorage` (`dagdev-cms`), есть экспорт/импорт JSON.

## Блок «Услуги»

Три заглушки добавлены в `index.html` и `services.html`. Обновите их через админку, чтобы контент синхронизировался со всеми страницами и визитками.

## Визитки

- Скрипт `generate_cards.py` собирает PDF/PNG/SVG для Камиля, Алика и Шамиля.
- Дизайн‑темы: матовый, неон, тёмный, светлый (переключатель на странице визиток).
- Кнопка «Скачать всё» выдаёт архив `dagdev-site.zip`.

### Печать

- Размер: 90×50 мм (готово к обрезке, 3 мм bleed).
- Разрешение: 300 DPI.
- Цвет: CMYK, профиль Coated FOGRA39 (см. экспортированные PDF).
- Безопасная зона: 3 мм внутри отступа.

## Генерация ассетов

1. `python generate_og.py` — обновляет Open Graph баннер `assets/images/og-dagdev.png`.
2. `python generate_cards.py` — пересобирает визитки (PDF/PNG/SVG + web PNG).

Убедитесь, что установлен `Pillow` (`pip install pillow`).

## Сборка и деплой

- Сайт статический: достаточно раздать содержимое директории.
- Рекомендуемый заголовок: `Cache-Control: max-age=31536000` для `assets/`, `no-cache` для HTML.
- Lighthouse показатели >90 при стандартных настройках (ленивая загрузка изображений, критический CSS в `<style>`).

