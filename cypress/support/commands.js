// visitar login page.
Cypress.Commands.add('visitLoginPage', () => {
	cy.log('visitando tela de login...');
	cy.visit('http://localhost:8080');

	cy.get('#titlePageLogin').should('be.visible').contains('Acessar Sistema');
	cy.get('#email');
	cy.get('#password');
	cy.get('#btn-entrar');
	cy.get('#rememberPasswordLink');
	cy.get('#registerLink');
});

// logout do sistema.
Cypress.Commands.add('logout', () => {
	cy.log('logout...');
	cy.get('#logout', { timeout: 10000 }).should('be.visible').click();
	cy.get('#titlePageLogin', { timeout: 10000 }).should('contain', 'Acessar Sistema');
});

// Resetar o estado dos usuarios do sistema ao estado inicial
Cypress.Commands.add('resetUserBase', (adminUser) => {
	cy.log('Resetando base de usuários...');

	cy.request({
		method: 'POST',
		url: '/login',
		body: {
			username: adminUser.username,
			password: adminUser.password,
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

// Encontra a linha da tabela pelo username (e-mail)
Cypress.Commands.add('getUserRowByEmail', (username) => {
	return cy.contains('td', username).parents('tr');
});

// Pega os dados do botão Editar (data-user)
Cypress.Commands.add('getUserDataFromRow', (username) => {
	return cy
		.getUserRowByEmail(username)
		.find('.edit-btn')
		.invoke('attr', 'data-user')
		.then((raw) => {
			const decoded = raw.replace(/&quot;/g, '"');
			return JSON.parse(decoded);
		});
});

// Clica no botão Editar de uma linha
Cypress.Commands.add('clickEditButtonByUsername', (username) => {
	return cy.getUserRowByEmail(username).find('.edit-btn').click();
});

// Clica no botão Deletar de uma linha
Cypress.Commands.add('clickDeleteButtonByUsername', (username) => {
	return cy.getUserRowByEmail(username).find('.delete-btn').click();
});

// usuario esta na tabela
Cypress.Commands.add('shouldExistInTable', (username) => {
	cy.contains('td', username).should('exist');
});

// usuario nNao esta na tabela
Cypress.Commands.add('shouldNotExistInTable', (username) => {
	cy.log(`user to search for ${username}`);
	cy.contains('td', username).should('not.exist');
});
