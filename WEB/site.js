// Theme controls
// Follow the system theme until the visitor chooses a theme.
const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const storageKey = 'starship-theme';

function setTheme(theme) {
  root.dataset.theme = theme;
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const label = `Switch to ${nextTheme} mode`;
  toggle.textContent = nextTheme === 'light' ? '☀︎' : '☾';
  toggle.setAttribute('aria-label', label);
  toggle.title = label;
}

// Restore the visitor’s saved choice when storage is available.
let savedTheme;
try {
  savedTheme = localStorage.getItem(storageKey);
} catch {
  // The theme can still be changed for this page.
}

const preferredTheme = () => systemTheme.matches ? 'dark' : 'light';
setTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : preferredTheme());
toggle.hidden = false;

// Apply and save a manual theme change.
toggle.addEventListener('click', () => {
  savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(savedTheme);
  try {
    localStorage.setItem(storageKey, savedTheme);
  } catch {
    // Storage can be unavailable in some browsing contexts.
  }
});

// Keep following system changes while there is no manual choice.
systemTheme.addEventListener('change', () => {
  if (savedTheme !== 'light' && savedTheme !== 'dark') setTheme(preferredTheme());
});
// Page navigation
// CSS shows the current page's section row. Mark its main link for assistive technology.
const page = document.body.dataset.page;
const activeLink = document.querySelector(`[data-nav-page="${page}"]`);
activeLink?.setAttribute('aria-current', 'page');


// Slide the visible sections toward their page label before switching pages.
const sectionLinks = document.querySelector(`[data-section-page="${page}"]`);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let leaving = false;

document.querySelector('.page-nav').addEventListener('click', async (event) => {
  const link = event.target.closest('[data-nav-page]');
  if (!link || link === activeLink || !sectionLinks || reduceMotion.matches ||
      event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
      event.shiftKey || event.altKey) return;

  event.preventDefault();
  if (leaving) return;
  leaving = true;
  const direction = page === 'home' ? '-.9rem' : '.9rem';
  const exit = sectionLinks.animate([
    { opacity: 1, transform: 'translateX(0)' },
    { opacity: 0, transform: `translateX(${direction})` },
  ], { duration: 120, easing: 'ease-in', fill: 'forwards' });
  await exit.finished;
  location.assign(link.href);
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted && leaving) {
    for (const animation of sectionLinks.getAnimations()) animation.cancel();
    leaving = false;
  }
});
