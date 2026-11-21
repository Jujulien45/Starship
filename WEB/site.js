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

const telemetryDiagrams = document.querySelectorAll('.telemetry-flow');
const flowMotionToggle = document.querySelector('.flow-motion-toggle');
if (telemetryDiagrams.length) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    }
  }, { threshold: 0.3 });
  telemetryDiagrams.forEach((diagram) => observer.observe(diagram));
}

if (flowMotionToggle) {
  const flowSection = flowMotionToggle.closest('section');
  flowMotionToggle.hidden = false;
  flowMotionToggle.addEventListener('click', () => {
    const paused = flowSection.classList.toggle('is-paused');
    flowMotionToggle.textContent = paused ? 'Resume animation' : 'Pause animation';
  });
}

const emailAddress = document.querySelector('.footer-email-address');
const emailStatus = document.querySelector('.footer-email-status');

emailAddress?.addEventListener('click', async () => {
  emailStatus.textContent = '';
  try {
    await navigator.clipboard.writeText(emailAddress.textContent.trim());
    emailStatus.textContent = 'Email address copied.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(emailAddress);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    emailStatus.textContent = 'Email address selected. Copy it manually.';
  }
});
