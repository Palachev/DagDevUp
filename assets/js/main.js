(() => {
  const CMS_KEY = "dagdev-cms";

  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("ready");
    const cmsState = readCMSState();
    applyCMSContent(cmsState);
    setupCTA();
    setupForms();
    setupScrollAnimations();
    setupCards();
  });

  function setupCTA() {
    const contactBtn = document.querySelector('[data-action="open-contact"]');
    contactBtn?.addEventListener("click", () => {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    });

    document.querySelectorAll("[data-action='contact-member']").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function setupForms() {
    document.querySelectorAll(".contact-form").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const status = form.querySelector(".form-status");
        status && (status.textContent = "Отправляем...");
        setTimeout(() => {
          status && (status.textContent = "Готово! Мы ответим в ближайшее время.");
          form.reset();
        }, 900);
      });
    });
  }

  function setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".info-card, .services-placeholder article, .team-card, .business-card").forEach((el) => {
      el.classList.add("will-animate");
      observer.observe(el);
    });
  }

  function setupCards() {
    if (!("PaintWorklet" in CSS)) return;
    // Example of registering custom paint for background accents (progressive enhancement).
    try {
      CSS.paintWorklet.addModule("data:application/javascript;charset=utf-8," + encodeURIComponent(`
        class DagDevAccent {
          static get inputProperties() { return ["--accent"]; }
          paint(ctx, geom, properties) {
            const color = properties.get("--accent").toString().trim() || "#2dd4ff";
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.05;
            ctx.beginPath();
            ctx.ellipse(geom.width * 0.6, geom.height * 0.4, geom.width * 0.5, geom.height * 0.3, 0, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
        registerPaint("dagdev-accent", DagDevAccent);
      `));
    } catch (error) {
      console.info("PaintWorklet not available", error);
    }
  }

  function readCMSState() {
    try {
      const raw = localStorage.getItem(CMS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function applyCMSContent(state) {
    if (!state) return;

    if (state.contacts) {
      document.querySelectorAll("[data-cms-contact]").forEach((node) => {
        const type = node.dataset.cmsContact;
        if (!type || !state.contacts[type]) return;
        if (type === "phone") {
          node.textContent = state.contacts.phone;
          const normalized = state.contacts.phone.replace(/[^\d+]/g, "");
          node.setAttribute("href", `tel:${normalized}`);
        } else if (type === "email") {
          node.textContent = state.contacts.email;
          node.setAttribute("href", `mailto:${state.contacts.email}`);
        } else {
          node.textContent = state.contacts.telegram;
          node.setAttribute("href", `https://t.me/${state.contacts.telegram.replace("@", "")}`);
        }
      });
    }

    const servicesContainers = document.querySelectorAll("[data-cms-target='services'], [data-cms-target='services-full']");
    state.services?.length &&
      servicesContainers.forEach((container) => {
        const headingTag = container.dataset.cmsTarget === "services-full" ? "h2" : "h3";
        container.innerHTML = state.services
          .map(
            (service) => `
          <article id="${service.slug}">
            <${headingTag}>${service.title}</${headingTag}>
            <p>${service.description}</p>
          </article>`
          )
          .join("");
      });

    state.cards?.forEach((card) => {
      document.querySelectorAll(`.business-card[data-person='${card.slug}'] .front`).forEach((front) => {
        const h2 = front.querySelector("h2");
        const role = front.querySelector("p");
        const listItems = front.querySelectorAll("li");
        if (h2) h2.textContent = card.name;
        if (role) role.textContent = card.title;
        listItems[0] && (listItems[0].textContent = card.phone);
        listItems[1] && (listItems[1].textContent = card.email);
        listItems[2] && (listItems[2].textContent = card.site);
      });
    });
  }

})();

