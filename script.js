

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const navbar = $('#navbar');
  const onScroll = () => {
    if (window.scrollY > 10) navbar.classList.add('nav-scrolled');
    else navbar.classList.remove('nav-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const typingEl = $('#typing');
  const phrases = [
    'Frontend Developer',
    'web Developer',
  ];
  if (typingEl) {
    let p = 0, i = 0, deleting = false;
    const typeSpeed = 80;
    const eraseSpeed = 50;
    const holdDelay = 1200;

    const tick = () => {
      const full = phrases[p];
      if (!deleting) {
        i++;
        typingEl.textContent = `${full.slice(0, i)}`;
        if (i === full.length) {
          deleting = true;
          setTimeout(tick, holdDelay);
          return;
        }
      } else {
        i--;
        typingEl.textContent = `${full.slice(0, i)}`;
        if (i === 0) {
          deleting = false;
          p = (p + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? eraseSpeed : typeSpeed);
    };
    tick();
  }

  const skillFills = $$('.skill-fill');
  if (skillFills.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const percent = parseInt(el.getAttribute('data-percent') || '0', 10);
          requestAnimationFrame(() => { el.style.width = percent + '%'; });
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    skillFills.forEach((el) => io.observe(el));
  }

  const canvas = $('#aiCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, particles, animId;

    const rand = (min, max) => Math.random() * (max - min) + min;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth | 0;
      h = canvas.clientHeight | 0;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function initParticles() {
      const count = Math.max(30, Math.min(80, Math.floor((w * h) / 25000)));
      particles = new Array(count).fill(0).map(() => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.4, 0.4),
        vy: rand(-0.4, 0.4),
        r: rand(1.2, 2.4),
        alpha: rand(0.4, 0.9)
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          const maxDist = 140; // px
          if (dist2 < maxDist * maxDist) {
            const t = 1 - Math.sqrt(dist2) / maxDist;
            ctx.strokeStyle = `rgba(34,211,238,${0.15 * t})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
  
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = `rgba(168,85,247,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        // glow dot
        ctx.fillStyle = `rgba(34,211,238,${p.alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x + 1.5, p.y + 1.5, Math.max(0.8, p.r - 0.6), 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(step);
    }

    const onResize = () => { cancelAnimationFrame(animId); resize(); step(); };
    window.addEventListener('resize', onResize);
    resize();
    step();
  }

  const form = $('#contactForm');
  const alertBox = $('#formAlert');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#name').value.trim();
      const email = $('#email').value.trim();
      const message = $('#message').value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || !message) {
        if (!name) $('#name').classList.add('is-invalid'); else $('#name').classList.remove('is-invalid');
        if (!emailOk) $('#email').classList.add('is-invalid'); else $('#email').classList.remove('is-invalid');
        if (!message) $('#message').classList.add('is-invalid'); else $('#message').classList.remove('is-invalid');
        return;
      }

      ['name','email','message'].forEach(id => $('#'+id).classList.remove('is-invalid'));
      if (alertBox) {
        alertBox.classList.remove('d-none');
        alertBox.classList.add('show');
        setTimeout(() => alertBox.classList.add('d-none'), 3000);
      }
      form.reset();
    });
  }
})();
