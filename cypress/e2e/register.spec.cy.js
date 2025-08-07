describe('Register new user', () => {
	const currentDate = new Date()
		.toISOString()
		.replace(/[-:T.]/g, '')
		.slice(0, 14);

	const newUser = {
		username: `user-${currentDate}@email.com`,
		password: 'User12345678!',
	};

	const userAdmin = {
		username: 'admin@email.com',
		password: 'Admin123456!',
	};

	before(() => {
		// Arrange
		cy.visitLoginPage();
		cy.get('#email');
		cy.get('#password');

		cy.get('#btn-entrar');
		cy.get('#rememberPasswordLink');
		cy.get('#registerLink');
		cy.get('#titlePageLogin').contains('Acessar Sistema').should('be.visible');
	});

	after(() => {
		cy.resetUserBase(userAdmin);
	});

	it('Cadastrar novo usuario', () => {
		//Cadastrar novo usuário
		cy.get("a[href='/register.html']").click();
		cy.contains('Cadastro de Usuário').should('be.visible');
		cy.log(`Register a new user: ${newUser.username}`);
		cy.get('#email').click().type(newUser.username);
		cy.get('#password').click().type(newUser.password);
		cy.get('#cadastrarBtn').click();
		cy.get('#messageCard').contains('Cadastro realizado com sucesso!').should('be.visible');
		cy.get('#titlePageLogin').should('be.visible').contains('Acessar Sistema');

		cy.log(`Logging new user ${newUser.username}`);
		cy.get('#lbl-email').click();
		cy.get('#email').type(newUser.username);
		cy.get('#lbl-password').click();
		cy.get('#password').type(newUser.password);
		cy.get('#btn-entrar').click();

		//Assert
		cy.url().should('include', '/dashboard.html');
		cy.contains('Login bem-sucedido!');
		cy.get('#logoApp').contains('QA-App');
		cy.get('#nav-user-info').contains(newUser.username);
		cy.get('#adminUsersBtn').should('not.visible');
		cy.get('#logout').contains('Sair').should('be.visible');

		cy.logout();
	});
});
