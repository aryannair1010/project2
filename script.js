/* ══════════════════════════════════════
   script.js — Neon Tokyo Portfolio
   ══════════════════════════════════════ */

// ── Katakana Rain Canvas ──────────────────────
const canvas = document.getElementById('rain');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const chars    = katakana.split('');
const fontSize = 14;
const cols     = Math.floor(canvas.width / fontSize);
const drops    = Array(cols).fill(1);

function drawRain() {
  ctx.fillStyle = 'rgba(6,4,15,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontSize + 'px monospace';

  drops.forEach((y, i) => {
    const char  = chars[Math.floor(Math.random() * chars.length)];
    const alpha = Math.random() > 0.95 ? 1 : 0.4;
    ctx.fillStyle = `rgba(255,45,120,${alpha})`;
    ctx.fillText(char, i * fontSize, y * fontSize);

    if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawRain, 55);


// ── Typing Animation ────────────────────────────
const phrases = [
  'BCA Student 📚',
  'Full-Stack Developer 💻',
  'CI/CD Enthusiast ⚙️',
  'Open Source Contributor 🐙',
  'Cloud Deployer ☁️',
];

let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const phrase = phrases[phraseIdx];
  if (deleting) {
    typedEl.textContent = phrase.substring(0, --charIdx);
  } else {
    typedEl.textContent = phrase.substring(0, ++charIdx);
  }

  let delay = deleting ? 50 : 90;

  if (!deleting && charIdx === phrase.length) {
    delay = 1800;
    deleting = true;
  } else if (deleting && charIdx === 0) {
    deleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 400;
  }
  setTimeout(type, delay);
}
type();


// ── Navbar scroll effect ────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(6,4,15,.97)';
  } else {
    navbar.style.background = 'rgba(6,4,15,.85)';
  }
});

// ── Active nav link highlight ───────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// ── Skill bar animation on scroll ──────────────
const fills = document.querySelectorAll('.bf');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.2 });

fills.forEach(f => {
  f.style.animationPlayState = 'paused';
  barObserver.observe(f);
});


// ── Contact Form ────────────────────────────────
// ⚠️ While testing locally use http://localhost:5000
// ⚠️ After deploying to Render, replace with your Render URL
const BACKEND_URL = 'http://localhost:5000';

const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('submit-btn');
const btnText    = document.getElementById('btn-text');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();

  if (!name || !email || !message) {
    showStatus('Please fill in all required fields.', 'error');
    return;
  }

  // Loading state
  submitBtn.disabled = true;
  btnText.textContent = '送信中... Sending...';

  try {
    const res = await fetch(`${BACKEND_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await res.json();

    if (data.success) {
      showStatus('✅ メッセージ送信完了！ Message sent! I will reply soon.', 'success');
      form.reset();
    } else {
      showStatus('❌ Something went wrong. Please try again.', 'error');
    }
  } catch (err) {
    showStatus('⚠️ Backend not connected yet — start your server first!', 'error');
    console.error('Contact form error:', err);
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = '送信する → Send Message';
  }
});

function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className   = 'form-status ' + type;
  setTimeout(() => {
    formStatus.className = 'form-status';
    formStatus.textContent = '';
  }, 6000);
}

// ── Staggered section reveal ────────────────────
const revealEls = document.querySelectorAll('.proj-card, .skill-block, .wf-step, .stat-card');
revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));