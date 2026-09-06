document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const themeToggle = document.querySelector('#theme-toggle');
  const themeLabel = document.querySelector('.theme-label');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('#nav-menu');
  const navLinks = [...document.querySelectorAll('.nav-link')];

  const setTheme = (theme) => {
    body.classList.toggle('light-mode', theme === 'light-mode');
    body.classList.toggle('dark-mode', theme !== 'light-mode');
    const isLight = theme === 'light-mode';
    themeToggle?.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    if (themeLabel) themeLabel.textContent = isLight ? 'Dark mode' : 'Light mode';
  };

  // Start every visit in dark mode. The toggle can still switch themes for the current visit.
  // We intentionally do not restore a previously selected light theme.
  setTheme('dark-mode');

  themeToggle?.addEventListener('click', () => {
    setTheme(body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode');
  });

  const closeMenu = () => {
    menuToggle?.classList.remove('open');
    navMenu?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else revealItems.forEach((item) => item.classList.add('is-visible'));

  const sections = [...document.querySelectorAll('main section[id]')];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.id === 'top') return;
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-38% 0px -52% 0px' });
  sections.forEach((section) => sectionObserver.observe(section));
});
