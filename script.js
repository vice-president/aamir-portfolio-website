document.getElementById('year').textContent = new Date().getFullYear();

for (const a of document.querySelectorAll('a[href^="#"]')) {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') document.body.classList.add('light');
if (themeBtn) {
  const sync = () => themeBtn.textContent = document.body.classList.contains('light') ? '🌙 Dark' : '☀️ Light';
  sync();
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('portfolio-theme', document.body.classList.contains('light') ? 'light' : 'dark');
    sync();
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('revealed');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.card, article').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

const counters = document.querySelectorAll('[data-count]');
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 80));
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else el.textContent = cur;
    }, 16);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countObs.observe(c));


// Scroll progress bar
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  if (progressBar) progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
});

// Back to top button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (!backToTop) return;
  backToTop.classList.toggle('show', window.scrollY > 500);
});
if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Add tilt/glow classes
for (const el of document.querySelectorAll('.card, article')) el.classList.add('tilt');
const heroCard = document.querySelector('.hero-content');
if (heroCard) heroCard.classList.add('glow-ring');

// Lightweight particle background
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h, pts;
  const N = 40;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    pts = Array.from({length: N}, () => ({x: Math.random()*w, y: Math.random()*h, vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4}));
  }
  function tick() {
    ctx.clearRect(0,0,w,h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x<0||p.x>w) p.vx*=-1;
      if (p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,1.6,0,Math.PI*2); ctx.fillStyle='rgba(148,163,255,.8)'; ctx.fill();
    }
    for (let i=0;i<pts.length;i++) for (let k=i+1;k<pts.length;k++) {
      const a=pts[i], b=pts[k];
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if (d<110) { ctx.strokeStyle=`rgba(125,150,255,${(1-d/110)*0.2})`; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
    }
    requestAnimationFrame(tick);
  }
  resize();
  window.addEventListener('resize', resize);
  tick();
}

// Google gravity-style effect (resets on refresh)
const gravityBtn = document.getElementById('gravityBtn');
if (gravityBtn) {
  gravityBtn.addEventListener('click', () => {
    if (document.body.classList.contains('gravity-active')) return;

    document.body.classList.add('gravity-active');
    gravityBtn.disabled = true;
    gravityBtn.textContent = 'Gravity On';

    const targets = document.querySelectorAll('header .hero-content > *:not(.cta-row), main > section, footer');
    targets.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const travelY = Math.max(40, window.innerHeight - rect.top + 120);
      el.style.setProperty('--fall-y', `${travelY}px`);
      el.style.setProperty('--fall-x', `${(Math.random() * 80 - 40).toFixed(0)}px`);
      el.style.setProperty('--fall-r', `${(Math.random() * 26 - 13).toFixed(1)}deg`);
      el.style.setProperty('--fall-delay', `${(i * 0.03).toFixed(2)}s`);
      el.classList.add('gravity-item');
    });
  });
}
