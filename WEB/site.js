// Theme controls
const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const storageKey = 'starship-theme';

function setTheme(theme) {
  root.dataset.theme = theme;
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const label = `Switch to ${nextTheme} mode`;
  toggle.setAttribute('aria-label', label);
  toggle.title = label;
}

function restoreTheme(fallback = 'dark') {
  let theme = fallback;
  try {
    theme = localStorage.getItem(storageKey) === 'light' ? 'light' : 'dark';
  } catch {
    // The theme can still be changed for this page.
  }
  setTheme(theme);
}

restoreTheme();
toggle.hidden = false;

// Apply and save a manual theme change.
toggle.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(theme);
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // Storage can be unavailable in some browsing contexts.
  }
});

// Page navigation
// CSS shows the current page's section row. Mark its main link for assistive technology.
const page = document.body.dataset.page;
const activeLink = document.querySelector(`[data-nav-page="${page}"]`);
activeLink?.setAttribute('aria-current', 'page');

window.addEventListener('pageshow', (event) => {
  if (event.persisted) restoreTheme(root.dataset.theme);
});
