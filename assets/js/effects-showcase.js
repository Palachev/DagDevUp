// Interactive Effects Showcase JavaScript

// Custom Cursor
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.display = 'block';
});

// Smooth cursor follow
function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor Trail
const trail = document.querySelector('.cursor-trail');
const trailParticles = [];

document.addEventListener('mousemove', (e) => {
    createTrailParticle(e.clientX, e.clientY);
});

function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-trail';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.opacity = '0.8';
    document.body.appendChild(particle);
    
    trailParticles.push(particle);
    
    setTimeout(() => {
        particle.style.opacity = '0';
        particle.style.transform = 'scale(0)';
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
            trailParticles.splice(trailParticles.indexOf(particle), 1);
        }, 300);
    }, 100);
}

// Particle Canvas
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 50;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
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

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Connect particles
function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(45, 212, 255, ${0.2 * (1 - distance / 150)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animate particles
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Magnetic Effect for Cards
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / 10;
        const moveY = (y - centerY) / 10;
        
        card.style.transform = `translateY(-10px) scale(1.02) translate(${moveX}px, ${moveY}px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Particle Burst on Card Click
const card4 = document.querySelector('.card-4');
card4.addEventListener('click', (e) => {
    const rect = card4.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
        createBurstParticle(centerX, centerY);
    }
});

function createBurstParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.borderRadius = '50%';
    particle.style.background = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.boxShadow = '0 0 10px currentColor';
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 5 + 2;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    let px = x;
    let py = y;
    let opacity = 1;
    
    function animate() {
        px += vx;
        py += vy;
        opacity -= 0.02;
        
        particle.style.left = px + 'px';
        particle.style.top = py + 'px';
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    }
    animate();
}

// Ripple Effect for Buttons
const btn2 = document.querySelector('.btn-2');
btn2.addEventListener('click', function(e) {
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
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Magnetic Effect for Buttons
const btn4 = document.querySelector('.btn-4');
btn4.addEventListener('mousemove', (e) => {
    const rect = btn4.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const moveX = (x - centerX) * 0.3;
    const moveY = (y - centerY) * 0.3;
    
    btn4.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

btn4.addEventListener('mouseleave', () => {
    btn4.style.transform = '';
});

// Particle Zone Interaction
const particleZone = document.querySelector('.particle-zone');
let zoneParticles = [];

particleZone.addEventListener('mousemove', (e) => {
    const rect = particleZone.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createZoneParticle(x, y);
});

function createZoneParticle(x, y) {
    if (zoneParticles.length > 30) {
        const oldParticle = zoneParticles.shift();
        if (oldParticle.parentNode) {
            oldParticle.remove();
        }
    }
    
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.borderRadius = '50%';
    particle.style.background = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`;
    particle.style.boxShadow = '0 0 10px currentColor';
    particle.style.pointerEvents = 'none';
    particle.style.transition = 'all 1s ease-out';
    particleZone.appendChild(particle);
    
    zoneParticles.push(particle);
    
    setTimeout(() => {
        particle.style.opacity = '0';
        particle.style.transform = 'scale(0)';
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
            zoneParticles = zoneParticles.filter(p => p !== particle);
        }, 1000);
    }, 100);
}

// Smooth Scroll for Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out';
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

