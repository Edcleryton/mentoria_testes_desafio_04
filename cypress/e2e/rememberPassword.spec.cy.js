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
		cy.visitLoginPage();
		cy.get('#email');
		cy.get('#password');

		cy.get('#btn-entrar');
		cy.get('#rememberPasswordLink').should('be.visible');
		cy.get('#registerLink').should('be.visible');

		cy.get('#titlePageLogin').contains('Acessar Sistema').should('be.visible');
	});

	it('Lembrar senha de usuário cadastrado - Link "Esqueceu a senha?"', () => {
		//Arrange
		cy.get('#rememberPasswordLink').click();
		cy.get('#titlePageRememberPassword').contains('Recuperar Senha').should('be.visible');

		//act
		cy.get('#lbl-email').click();
		cy.get('#email').type(userCommon.username);
		cy.get('#enviarBtn').click();

		//Assert
		cy.contains('#messageCard', 'Instruções enviadas com sucesso! retornando a página de login...').should(
			'be.visible'
		);

		cy.get('#titlePageLogin', { timeout: 10000 }).contains('Acessar Sistema').should('be.visible');
	});
});
