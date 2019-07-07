const api = 'http://localhost:2999/api/v1';
// const api = 'https://automartt.herokuapp.com/api/v1';

const Auth = {
  user: null,
  async signup(data) {
    return await (await fetch(`${api}/auth/signup`, {
      method: 'POST', body: JSON.stringify(data),
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })).json();
  },
  async login(data) {
    return await (await fetch(`${api}/auth/signin`, {
      method: 'POST', body: JSON.stringify(data),
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })).json();
  },
  async verify(admin) {
    if (this.getToken()) return this.redirect('/login');
    try {
      const res = await (await fetch(`${api}/auth/user`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer: ${this.getToken()}`
        },
      })).json();
      if (res.success) {
        if (admin) !res.user.isAdmin && this.redirect('/');
        this.user = res.user;
        this.setup();
      } else this.redirect('/login');
    } catch (err) {
      this.redirect('/login');
    }
  },
  redirect(path) {
    window.location.pathname = path;
  },
  logout() {
    localStorage.clear();
    this.redirect('/login')
  },
  saveToken: token => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  setup() {
    document.documentElement.classList.add('dark');
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => populateMenu(this.user));
    } else {
      populateMenu(this.user);
    }
  }
};

function populateMenu(user) {
  const doc = document.documentElement;
  const nav = document.getElementById('nav');
  const path = location.pathname.replace(/\/|.html/gi, '');
  const theme = localStorage.getItem('theme') || '';
  doc.className = theme;
  nav.innerHTML = `
      <a class="logo" href="/">
        <i class="fa fa-truck-pickup"></i>
      </a>
      <div class="flex">
        <ul class="menu mr-2">
            <li><a class="${path === 'dashboard' ? 'active' : ''}" href="../../dashboard"><i class="fa fa-chart-bar mr-2"></i>Dashboard</a></li>
            ${user.isAdmin ? `<li><a class="${path === 'admin' ? 'active' : ''}" href="../../admin"><i class="fa fa-user mr-2"></i>Admin</a></li>` : ''}
            <li class="dropdown" id="dropdown"><a href="#"><i class="fa fa-book mr-2"></i>API Docs</a>
                <ul class="dropdown-menu">
                    <li><a href="/docs">Swagger</a></li>
                    <li><a href="https://documenter.getpostman.com/view/2332557/S1ZudBGA">Postman</a></li>
                </ul>
            </li>
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
  document.getElementById('logout').addEventListener('click', () => Auth.logout());
  document.getElementById('theme').addEventListener('click', function () {
    doc.classList.toggle('dark');
    localStorage.setItem('theme', doc.className);
    this.innerHTML = themeBtnText(doc.className);
  });
}