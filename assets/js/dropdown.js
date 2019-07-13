const handleWindowClick = e => {
  if (e.target.classList.contains('dropdown')) return;
  const dropdown = [...e.path].find((el) => el.classList && el.classList.contains('dropdown'));
  const active = document.querySelector('.dropdown.active');
  active && active.classList.remove('active');
  if (dropdown) {
    dropdown.classList.toggle("active");
  }
};

window.addEventListener("click", handleWindowClick);