const Auth = {
  api: 'https://automartt.herokuapp.com/api/v1',
  user: null,
  origin: window.location.pathname.startsWith('/automart') ? `${window.location.origin}/automart` : window.location.origin,
  path: window.location.pathname.replace(/\/|.html/gi, ''),
  async signup(user) {
    return await (await fetch(`${this.api}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })).json();
  },
  async login(user) {
    return await (await fetch(`${this.api}/auth/signin`, {
      method: 'POST', body: JSON.stringify(user),
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })).json();
  },
  async getUser() {
    const { success, data } = await (await fetch(`${Auth.api}/auth/user`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${this.getToken()}`,
      },
    })).json();
    return { success, data: transformData(data) };
  },
  redirect(path) {
    window.location.href = `${this.origin}${path}`;
  },
  clear() {
    localStorage.clear();
  },
  logout() {
    this.clear();
    this.redirect('/login');
  },
  saveToken: token => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setup(this.user));
    } else {
      setup(this.user);
    }
  },
};

function setup(user) {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const theme = localStorage.getItem('theme') || '';

  nav.innerHTML = buildNav(user, Auth.path, theme);

  document.getElementById('logout').addEventListener('click', () => Auth.logout());
  document.getElementById('theme').addEventListener('click', function () {
    const doc = document.documentElement;
    doc.classList.toggle('dark');
    localStorage.setItem('theme', doc.className);
    this.innerHTML = themeBtnText(doc.className);
  });
}

function buildNav(user, path, theme) {
  return `
    <a class="logo" href="${Auth.origin}/">
      <i class="fa fa-truck-pickup"></i>
    </a>
    <div class="flex">
      <ul class="menu mr-2">
          <li><a class="${path === 'dashboard' ? 'active' : ''}" href="${Auth.origin}/dashboard"><i class="fa fa-chart-bar mr-2"></i>Dashboard</a></li>
          ${user.isAdmin ? `<li><a class="${path === 'admin' ? 'active' : ''}" href="${Auth.origin}/admin"><i class="fa fa-user mr-2"></i>Admin</a></li>` : ''}
          
          <li><a target="_blank" href="https://documenter.getpostman.com/view/2332557/S1ZudBGA"><i class="fa fa-book mr-2"></i>API Documentation</a></li>
          
          <li class="dropdown"><a href="#"><i class="fa fa-user-circle mr-2"></i>${user.firstName}<i class="fa fa-caret-down ml-2"></i></a>
              <ul class="dropdown-menu">
                  <li><a href="#" id="theme">
                    ${themeBtnText(theme)}
                  </li>
                  <li><a href="#" id="logout"><i class="fa fa-sign-out-alt mr-2"></i>Logout</a></li>
              </ul>
          </li>
      </ul>
    </div>
  `;
}

(async () => {
  if (Auth.path.match(/login|signup/gi)) {
    if (!Auth.getToken()) return;
    return Auth.redirect('/');
  }
  if (!Auth.getToken()) return Auth.redirect('/login');
  try {
    const res = await Auth.getUser();
    if ((Auth.path.match(/login|signup/gi)) && !res.success) return Auth.clear();
    if (res.success) {
      if (Auth.path === 'admin' && !res.data.isAdmin) Auth.redirect('/');
      Auth.user = transformData(res.data);
      Auth.init();
    } else {
      Auth.logout();
    }
  } catch (err) {
    Auth.logout();
  }
})();
