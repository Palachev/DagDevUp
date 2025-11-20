const STORAGE_KEY = "dagdev-cms";
const AUTH_KEY = "dagdev-auth";
const AUTH_USERNAME = "DagDevelop";
const AUTH_PASSWORD = "KamilDagDev2006&^";

const defaultData = {
  services: [
    { title: "Инфраструктурный аудит", description: "Диагностика и дорожная карта DevOps.", slug: "audit" },
    { title: "Платформенная команда", description: "CI/CD, наблюдаемость, безопасность.", slug: "platform" },
    { title: "Экстренный DevOps", description: "Дежурства 24/7 и миграции без простоев.", slug: "support" }
  ],
  contacts: {
    phone: "+7 (999) 000-00-00",
    email: "hi@dagdev.ru",
    telegram: "@dagdev"
  },
  cards: [
    { name: "Палачев Камиль", title: "CEO | DagDev", phone: "+7 (999) 000-01-01", email: "kamil@dagdev.ru", site: "dagdev.ru", slug: "kamil" },
    { name: "Алиханов Алик", title: "CTO | DagDev", phone: "+7 (999) 000-02-02", email: "alik@dagdev.ru", site: "dagdev.ru/cto", slug: "alik" },
    { name: "Абдумеджидов Шамиль", title: "CFO | DagDev", phone: "+7 (999) 000-03-03", email: "shamil@dagdev.ru", site: "dagdev.ru/finance", slug: "shamil" }
  ]
};

const clone = (data) => (typeof structuredClone === "function" ? structuredClone(data) : JSON.parse(JSON.stringify(data)));

function checkAuth() {
  const auth = sessionStorage.getItem(AUTH_KEY);
  return auth === "authenticated";
}

function setAuth(authenticated) {
  if (authenticated) {
    sessionStorage.setItem(AUTH_KEY, "authenticated");
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("login-screen");
  const adminContent = document.getElementById("admin-content");
  const loginForm = document.getElementById("login-form");
  const logoutBtn = document.getElementById("logout-btn");

  if (checkAuth()) {
    loginScreen.style.display = "none";
    adminContent.style.display = "block";
    initAdmin();
  } else {
    loginScreen.style.display = "flex";
    adminContent.style.display = "none";
  }

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const username = formData.get("username");
    const password = formData.get("password");
    const status = loginForm.querySelector(".form-status");

    if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
      setAuth(true);
      loginScreen.style.display = "none";
      adminContent.style.display = "block";
      initAdmin();
    } else {
      if (status) {
        status.textContent = "Неверный логин или пароль";
        status.style.color = "#ff6b6b";
      }
    }
  });

  logoutBtn?.addEventListener("click", () => {
    setAuth(false);
    loginScreen.style.display = "flex";
    adminContent.style.display = "none";
    loginForm.reset();
    const status = loginForm.querySelector(".form-status");
    if (status) {
      status.textContent = "";
    }
  });
});

function initAdmin() {
  const state = loadState();
  renderServices(state);
  renderContacts(state);
  renderCards(state);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : clone(defaultData);
  } catch {
    return clone(defaultData);
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderServices(state) {
  const container = document.querySelector("[data-cms-list='services']");
  if (!container) return;
  container.innerHTML = "";
  state.services.forEach((service, index) => {
    const block = document.createElement("div");
    block.className = "cms-block";
    block.innerHTML = `
      <label>Название <input type="text" name="title" value="${service.title}" /></label>
      <label>Описание <textarea name="description" rows="3">${service.description}</textarea></label>
      <label>Слаг (id) <input type="text" name="slug" value="${service.slug}" /></label>
      <button class="btn ghost" data-action="remove" data-index="${index}">Удалить</button>
    `;
    container.append(block);

    block.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", () => {
        const { name, value } = input;
        state.services[index][name] = value;
        saveState(state);
      });
    });
  });

  const addBtn = document.querySelector("[data-action='add-service']");
  if (addBtn && !addBtn.dataset.bound) {
    addBtn.dataset.bound = "true";
    addBtn.addEventListener("click", () => {
      state.services.push({ title: "Новая услуга", description: "Описание", slug: `service-${Date.now()}` });
      saveState(state);
      renderServices(state);
    });
  }

  if (!container.dataset.bound) {
    container.dataset.bound = "true";
    container.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.dataset.action === "remove") {
        const index = Number(target.dataset.index);
        state.services.splice(index, 1);
        saveState(state);
        renderServices(state);
      }
    });
  }
}

function renderContacts(state) {
  const form = document.querySelector("[data-cms-form='contacts']");
  if (!form) return;
  form.phone.value = state.contacts.phone;
  form.email.value = state.contacts.email;
  form.telegram.value = state.contacts.telegram;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    state.contacts = {
      phone: form.phone.value,
      email: form.email.value,
      telegram: form.telegram.value
    };
    saveState(state);
    const status = form.querySelector(".form-status");
    if (status) {
      status.textContent = "Сохранено";
      setTimeout(() => (status.textContent = ""), 1500);
    }
  });
}

function renderCards(state) {
  const container = document.querySelector(".cms-cards");
  if (!container) return;
  container.innerHTML = "";

  state.cards.forEach((card, index) => {
    const block = document.createElement("div");
    block.className = "cms-block";
    block.innerHTML = `
      <label>Имя <input type="text" name="name" value="${card.name}" /></label>
      <label>Должность <input type="text" name="title" value="${card.title}" /></label>
      <label>Телефон <input type="text" name="phone" value="${card.phone}" /></label>
      <label>Email <input type="email" name="email" value="${card.email}" /></label>
      <label>URL <input type="text" name="site" value="${card.site}" /></label>
      <label>Слаг <input type="text" name="slug" value="${card.slug}" /></label>
      <div class="card-actions">
        <button class="btn secondary" data-action="generate" data-index="${index}">Сгенерировать PDF</button>
        <button class="btn ghost" data-action="delete-card" data-index="${index}">Удалить</button>
      </div>
    `;
    container.append(block);

    block.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        state.cards[index][input.name] = input.value;
        saveState(state);
      });
    });
  });

  const cardAddBtn = document.querySelector("[data-action='add-card']");
  if (cardAddBtn && !cardAddBtn.dataset.bound) {
    cardAddBtn.dataset.bound = "true";
    cardAddBtn.addEventListener("click", () => {
      state.cards.push({ name: "Новый руководитель", title: "Роль DagDev", phone: "", email: "", site: "", slug: `card-${Date.now()}` });
      saveState(state);
      renderCards(state);
    });
  }

  if (!container.dataset.bound) {
    container.dataset.bound = "true";
    container.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const index = Number(target.dataset.index);
      if (target.dataset.action === "delete-card") {
        state.cards.splice(index, 1);
        saveState(state);
        renderCards(state);
      }
      if (target.dataset.action === "generate") {
        const card = state.cards[index];
        await generatePdf(card);
      }
    });
  }
}

async function generatePdf(card) {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    alert("jsPDF не загружен");
    return;
  }
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [50, 90] });
  doc.setFillColor(5, 8, 18);
  doc.rect(0, 0, 90, 50, "F");
  doc.setTextColor(45, 212, 255);
  doc.setFontSize(18);
  doc.text("DagDev", 6, 12);
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(card.name, 6, 22);
  doc.setFontSize(10);
  doc.setTextColor(162, 169, 199);
  doc.text(card.title, 6, 28);
  doc.setTextColor(255, 255, 255);
  doc.text(card.phone || "-", 6, 36);
  doc.text(card.email || "-", 6, 42);
  doc.text(card.site || "-", 6, 48);
  doc.save(`dagdev-${card.slug || "card"}.pdf`);
}


