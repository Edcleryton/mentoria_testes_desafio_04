describe('udpate usuario comum', () => {
	const userCommon = {
		username: 'user@email.com',
		password: 'User12345678!',
	};

	const userAdmin = {
		username: 'admin@email.com',
		password: 'Admin123456!',
	};

	beforeEach(() => {
		// Arrange
		cy.log('before...');
		cy.visit('http://localhost:8080');

		cy.get('.card');
		cy.get('#email');
		cy.get('#password');

		cy.get('#btn-entrar');
		cy.get("a[href='/rememberPassword.html']");

		cy.get('#titlePageLogin').contains('Acessar Sistema').should('be.visible');
	});

	after(() => {
		cy.log('Resetando base de usuários...');

		cy.request({
			method: 'POST',
			url: '/login',
			body: {
				username: userAdmin.username,
				password: userAdmin.password,
			},
		}).then((loginResponse) => {
			expect(loginResponse.status).to.eq(200);
			const token = loginResponse.body.token;
			cy.log(`token obtido: ${token}`);
			cy.request({
				method: 'POST',
				url: '/admin/reset-users',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then((resetResponse) => {
				expect(resetResponse.status).to.eq(200);
				cy.log('Reset concluído com sucesso!');
			});
		});
	});

	it('Usuario comum consegue atualizar sua senha exitosamente', () => {
		const newPassword = 'newPassword1234!';
		// Arrange
		cy.get('#lbl-email').click();
		cy.get('#email').type(userCommon.username);
		cy.get('#lbl-password').click();
		cy.get('#password').type(userCommon.password);
		cy.get('#btn-entrar').click();

		// Assert
		cy.url().should('include', '/dashboard.html');
		cy.contains('Login bem-sucedido!');
		cy.contains('QA-App');
		cy.get('#nav-user-info').contains(userCommon.username);
		cy.get('#adminUsersBtn').should('not.visible');
		cy.get('#logout').contains('Sair').should('be.visible');

		cy.get('#updatePasswordBtn').click();

		// Page Atualizar Senha
		cy.get('#titlePageUpdatePassword').should('be.visible').contains('Atualizar Senha');
		cy.get('#update-form').should('be.visible');
		cy.get('#lbl-password').click();
		cy.get('#password').type(newPassword);
		cy.get('#updatePasswordBtn').click();

		cy.get('#messageCard', { timeout: 10000 }).should('be.visible').contains('Senha atualizada com sucesso!');
		cy.get('#titlePageLogin', { timeout: 10000 }).should('be.visible').contains('Acessar Sistema');

		//Validate if the newPassword was updated properly

		cy.log(`test ${userCommon.username}`);
		cy.get('#lbl-email').click();
		cy.get('#email').type(userCommon.username);
		cy.get('#lbl-password').click();
		cy.get('#password').type(newPassword);
		cy.get('#btn-entrar').click();

		// Assert
		cy.url().should('include', '/dashboard.html');
		cy.get('#titlePageDashboard').contains('Login bem-sucedido!');
		cy.contains('QA-App');
		cy.get('#nav-user-info').contains(userCommon.username);
		cy.get('#adminUsersBtn').should('not.visible');
		cy.get('#logout').contains('Sair').should('be.visible');
	});
});
