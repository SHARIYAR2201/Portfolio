/* Motion (Framer Motion for vanilla JS) animations. Runs after script.js. */
(() => {
  const M = window.Motion;
  if (!M || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const { animate, inView, scroll, stagger } = M;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ease = [0.22, 1, 0.36, 1];
  const hoverOK = matchMedia('(hover: hover)').matches;
  document.documentElement.classList.add('m-on');

  // Scroll progress bar
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
  scroll(animate(bar, { scaleX: [0, 1] }, { ease: 'linear' }));

  // Header + hero entrance
  animate('.header-container', { opacity: [0, 1], y: [-20, 0] }, { duration: 0.7, ease });
  animate('.hero-content > *', { opacity: [0, 1], y: [30, 0] }, { delay: stagger(0.1, { startDelay: 0.15 }), duration: 0.8, ease });

  // Floating badges
  animate('.badge-projects', { y: [0, -12, 0] }, { duration: 4.2, repeat: Infinity, ease: 'easeInOut' });
  animate('.badge-experience', { y: [0, 12, 0] }, { duration: 4.8, repeat: Infinity, ease: 'easeInOut' });

  // Parallax glow behind the photo
  const backdrop = $('.frame-backdrop');
  if (backdrop) scroll(animate(backdrop, { y: [0, -70], scale: [1, 1.12] }, { ease: 'linear' }),
    { target: $('#hero'), offset: ['start start', 'end start'] });

  // 3D tilt on hero photo + springy hover on buttons/icons
  const vis = $('.hero-visual'), frame = $('.image-frame');
  if (hoverOK && vis && frame) {
    vis.addEventListener('pointermove', e => {
      const r = frame.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      animate(frame, { rotateY: x * 14, rotateX: -y * 14 }, { duration: 0.35, ease: 'easeOut' });
    });
    vis.addEventListener('pointerleave', () =>
      animate(frame, { rotateX: 0, rotateY: 0 }, { type: 'spring', stiffness: 140, damping: 14 }));
    $$('.btn, .social-icon-btn, .badge-card').forEach(el => {
      const s = { type: 'spring', stiffness: 400, damping: 18 };
      el.addEventListener('pointerenter', () => animate(el, { scale: 1.06 }, s));
      el.addEventListener('pointerleave', () => animate(el, { scale: 1 }, s));
    });
  }

  // Section underline draws in
  $$('.section-line').forEach(l => inView(l, () => { animate(l, { scaleX: [0, 1] }, { duration: 0.8, ease }); }));

  // Skills: count-up percentages + staggered cards
  const play = panel => {
    if (!panel) return;
    const cards = $$('.skill-card', panel);
    animate(cards, { opacity: [0, 1], y: [24, 0] }, { delay: stagger(0.07), duration: 0.5, ease });
    cards.forEach(c => {
      const el = $('.skill-percentage', c);
      const to = parseInt(el.dataset.to || el.textContent, 10);
      el.dataset.to = to;
      animate(0, to, { duration: 1.2, ease: 'easeOut', onUpdate: v => { el.textContent = Math.round(v) + '%'; } });
    });
  };
  const tabs = $('.skills-tabs-container');
  if (tabs) inView(tabs, () => play($('.tab-panel.active')));
  $$('.tab-btn').forEach(b => b.addEventListener('click', () => requestAnimationFrame(() => play($('.tab-panel.active')))));

  // Project modal: spring in
  const pm = $('#pm');
  if (pm) new MutationObserver(() => {
    if (pm.hidden) return;
    animate(pm, { opacity: [0, 1] }, { duration: 0.25 });
    animate($('.pm', pm), { opacity: [0, 1], y: [40, 0], scale: [0.92, 1] }, { type: 'spring', stiffness: 320, damping: 26 });
  }).observe(pm, { attributes: true, attributeFilter: ['hidden'] });
})();
