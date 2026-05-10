export {};
const btn = document.getElementById('theme-toggle') as HTMLButtonElement;

function updateBtn() {
  const theme = document.documentElement.getAttribute('data-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === null && systemDark);
  btn.textContent = isDark ? '☀' : '☾';
}

btn.addEventListener('click', () => {
  const theme = document.documentElement.getAttribute('data-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === null && systemDark);
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateBtn();
});

updateBtn();
