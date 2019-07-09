(function setTheme() {
  document.documentElement.className = localStorage.getItem('theme') || '';
})();

function themeBtnText(theme) {
  return theme === 'dark' ? `<i class="fa fa-sun mr-2"></i>Light theme</a>` : `<i class="fa fa-moon mr-2"></i>Dark theme</a>`;
}
