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
    setupParticles();
    setupMagneticEffects();
    setupRippleEffect();
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

  function setupParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 40;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.color = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(45, 212, 255, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      connectParticles();
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  function setupMagneticEffects() {
    const cards = document.querySelectorAll('.info-card, .team-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / 15;
        const moveY = (y - centerY) / 15;
        
        card.style.transform = `translateY(-10px) scale(1.02) translate(${moveX}px, ${moveY}px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  function setupRippleEffect() {
    const buttons = document.querySelectorAll('.btn.primary');
    buttons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
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

