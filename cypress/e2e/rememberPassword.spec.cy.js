describe('Remember Password', () => {
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

			// encadeia aqui:
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

	it('Lembrar senha de usuário cadastrado - Link "Esqueceu a senha?"', () => {
		//Arrange
		cy.get("a[href='/rememberPassword.html']").click();
		cy.get('.card-title').contains('Recuperar Senha').should('be.visible');

		//act
		cy.get('label').click().type(userCommon.username);
		cy.get('.btn').click();

		//Assert
		cy.contains('#messageCard', 'Instruções enviadas com sucesso! retornando a página de login...').should(
			'be.visible'
		);

		cy.get('#titlePageLogin', { timeout: 10000 }).contains('Acessar Sistema').should('be.visible');
	});
});
