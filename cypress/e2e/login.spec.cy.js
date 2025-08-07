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
		cy.log('before...');
		cy.visit('http://localhost:8080');

		cy.get('.card');
		cy.get('#email');
		cy.get('#password');

		cy.get('#btn-entrar');
		cy.get("a[href='/rememberPassword.html']");
		//cy.get("a[href='/register.html]");

		cy.contains('Acessar Sistema').should('be.visible');
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
		cy.contains('QA-App');
		cy.get('#nav-user-info').contains(userCommon.username);
		cy.get('#adminUsersBtn').should('not.visible');
		cy.get('#logout').contains('Sair').should('be.visible');
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
	});

	it('Tratamento de erro com credenciais inválidas - usuario ok/senha incorreta', () => {
		//ACT
		cy.log(`test ${userCommon.userNonExistent}`);
		cy.get('#lbl-email').click();
		cy.get('#email').type(userCommon.userNonExistent);
		cy.get('#lbl-password').click();
		cy.get('#password').type('senhaInvalida');
		cy.get('#btn-entrar').click();

		//Assert
		cy.contains('.card-panel', 'Usuário ou senha inválidos.').should('be.visible');
	});

	it('Bloquear usuário após 3 tentativas de login inválidas', ()=>{
		//Arrange 
		//Cadastrar novo usuário 
        cy.get("a[href='/register.html']").click(); //Acessar a tela de cadastro pelo link no login
		cy.contains('Cadastro de Usuário').should('be.visible');   //certificar que foi pra tela de cadastro
		cy.log(`Register a new user: ${userCommon.newUser}`); // cadastrar usuário novo
		cy.get('#email').click().type(userCommon.newUser);
		cy.get('#password').click().type(userCommon.password);
		cy.contains('Button', 'Cadastrar').click();
		cy.contains('.card-panel', 'Cadastrando').should('be.visible'); //Validar que o cadastro foi realizado
		//cy.contains('.card-panel', 'Cadastro Realizado com sucesso! Redirecionando para login...').should('be.visible');
        cy.contains('Acessar Sistema').should('be.visible'); 
      
		cy.log(`Logging new user ${userCommon.newUser}`);  // logar com o novo usuário cadastrado
		cy.get('#lbl-email').click();
		cy.get('#email').type(userCommon.newUser);
		cy.get('#lbl-password').click();
		cy.get('#password').type('senhainvalida');
		cy.get('#btn-entrar').click();   //Clicar 3 vezes no botão entrar com a senha errada
		cy.get('#btn-entrar').click();
		cy.get('#btn-entrar').click();
		
		//Assert
		cy.contains('.card-panel', 'Usuário bloqueado por excesso de tentativas.').should('be.visible'); //validar que bloqueou

	})
});
