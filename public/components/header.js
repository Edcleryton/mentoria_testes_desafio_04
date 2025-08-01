class AppHeader extends HTMLElement {
	connectedCallback() {
		if (!window.AuthUtils?.isLoggedIn?.()) {
			window.location.replace('/login.html');
			return;
		}

		const user = window.AuthUtils.getUserInfo();
		this.render(user);
	}

	render(user) {
		this.innerHTML = `
      <header>
        <div class="navbar-fixed">
          <nav class="teal lighten-2">
            <div class="nav-wrapper container">
              <a href="#" class="brand-logo">QA-App</a>
              <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li><span>Bem-vindo, ${user.username} </span></li>
                <li><a href="#" id="logout">Sair</a></li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    `;

		this.querySelector('#logout')?.addEventListener('click', () => {
			localStorage.removeItem('authToken');
			setTimeout(() => window.location.replace('/login.html'), 1000);
		});

		this.dispatchEvent(
			new CustomEvent('user-role', {
				detail: user.role,
				bubbles: true,
				composed: true,
			})
		);
	}
}

customElements.define('app-header', AppHeader);
