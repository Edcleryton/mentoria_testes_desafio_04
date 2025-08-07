describe('Login', () => {
	const userCommon = {
		username: 'user@email.com',
		password: 'User12345678!',
		userNonExistent: 'usuarioinexistente@gmail.com',
		newUser: 'novousuario@email.com',
	};

	const userAdmin = {
		username: 'admin@email.com',
		password: 'Admin123456!',
	};

	beforeEach(() => {
		// Arrange
		cy.visitLoginPage();
	});

	after(() => {
		cy.resetUserBase(userAdmin);
	});

	it('Login bem sucedido com usuario tipo "common user"', () => {
		// Act
		cy.log(`test ${userCommon.username}`);
		cy.get('#lbl-email').click();
		cy.get('#email').type(userCommon.username);
		cy.get('#lbl-password').click();
		cy.get('#password').type(userCommon.password);
		cy.get('#btn-entrar').click();

		// Assert
		cy.url().should('include', '/dashboard.html');
		cy.contains('Login bem-sucedido!');
		cy.get('#logoApp').contains('QA-App');
		cy.get('#nav-user-info').contains(userCommon.username);
		cy.get('#adminUsersBtn').should('not.visible');
		cy.get('#logout').contains('Sair').should('be.visible');
		cy.logout();
	});

	it('Login bem sucedido com usuario tipo "admin user"', () => {
		cy.get('#lbl-email').click();
		cy.get('#email').type(userAdmin.username);
		cy.get('#lbl-password').click();
		cy.get('#password').type(userAdmin.password);
		cy.get('#btn-entrar').click();

		// Assert
		cy.url().should('include', '/dashboard.html');
		cy.contains('Login bem-sucedido!');
		cy.contains('QA-App');
		cy.get('#nav-user-info').contains(userAdmin.username);
		cy.get('#adminUsersBtn').should('be.visible'); //admin can see the button
		cy.get('#logout').contains('Sair').should('be.visible');
		cy.logout();
	});

	it('Tratamento de erro com credenciais inválidas - usuario ok/senha incorreta', () => {
		//Act
		cy.log(`test ${userCommon.userNonExistent}`);
		cy.get('#lbl-email').click();
		cy.get('#email').type(userCommon.userNonExistent);
		cy.get('#lbl-password').click();
		cy.get('#password').type('senhaInvalida');
		cy.get('#btn-entrar').click();

		//Assert
		cy.contains('#messageCard', 'Usuário ou senha inválidos.').should('be.visible');
	});

	it('Bloquear usuário após 3 tentativas de login inválidas', () => {
		//Arrange
		//Cadastrar novo usuário
		cy.get('#registerLink').click();
		cy.contains('Cadastro de Usuário').should('be.visible');
		cy.log(`Register a new user: ${userCommon.newUser}`);
		cy.get('#email').click().type(userCommon.newUser);
		cy.get('#password').click().type(userCommon.password);
		cy.get('#cadastrarBtn').click();
		cy.get('#messageCard').contains('Cadastro realizado com sucesso!').should('be.visible');
		cy.get('#titlePageLogin').should('be.visible').contains('Acessar Sistema');

		//Act
		// logar com o novo usuário cadastrado
		cy.log(`Logging new user ${userCommon.newUser}`);
		cy.get('#lbl-email').click();
		cy.get('#email').type(userCommon.newUser);
		cy.get('#lbl-password').click();
		cy.get('#password').type('senhainvalida');

		//Clicar 3 vezes no botão entrar com a senha errada
		cy.get('#btn-entrar').click();
		cy.get('#btn-entrar').click();
		cy.get('#btn-entrar').click();

		//Assert
		cy.contains('#messageCard', 'Usuário bloqueado por excesso de tentativas.').should('be.visible');
	});
});
