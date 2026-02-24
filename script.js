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
