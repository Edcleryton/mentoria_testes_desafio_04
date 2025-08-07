describe('udpate usuario comum', () => {
	const userCommon = {
		username: 'user@email.com',
		password: 'User12345678!',
	};

	const newUserData = {
		username: 'userUpdated@email.com',
		password: 'Admin123456!',
		blocked: true,
	};

	const adminToUpdate = {
		username: 'edcleryton.silva@email.com',
		password: 'Admin123456!',
	};
	const userAdmin = {
		username: 'admin@email.com',
		password: 'Admin123456!',
	};

	beforeEach(() => {
		// Arrange
		cy.visitLoginPage();
	});

	afterEach(() => {
		cy.resetUserBase(userAdmin);
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
		cy.get('#titlePageDashboard').contains('Login bem-sucedido!');
		cy.get('#logoApp').contains('QA-App');
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
		cy.get('#logoApp').contains('QA-App');
		cy.get('#nav-user-info').contains(userCommon.username);
		cy.get('#adminUsersBtn').should('not.visible');
		cy.get('#logout').contains('Sair').should('be.visible');
		cy.logout();
	});

	it('Usuario admin consegue atualizar sua senha exitosamente', () => {
		const newPassword = 'newPassword1234!';
		// Arrange
		cy.get('#lbl-email').click();
		cy.get('#email').type(adminToUpdate.username);
		cy.get('#lbl-password').click();
		cy.get('#password').type(adminToUpdate.password);
		cy.get('#btn-entrar').click();

		// Assert
		cy.url().should('include', '/dashboard.html');
		cy.get('#titlePageDashboard').contains('Login bem-sucedido!');
		cy.get('#logoApp').contains('QA-App');
		cy.get('#nav-user-info').contains(adminToUpdate.username);
		// now the user is an admin, need to see the admin Users button
		cy.get('#adminUsersBtn').should('be.visible');
		cy.get('#logout').contains('Sair').should('be.visible');

		//Act
		cy.get('#updatePasswordBtn').click();
		cy.get('#titlePageUpdatePassword').should('be.visible').contains('Atualizar Senha');
		cy.get('#update-form').should('be.visible');
		cy.get('#lbl-password').click();
		cy.get('#password').type(newPassword);
		cy.get('#updatePasswordBtn').click();

		cy.get('#messageCard', { timeout: 10000 }).should('be.visible').contains('Senha atualizada com sucesso!');
		cy.get('#titlePageLogin', { timeout: 10000 }).should('be.visible').contains('Acessar Sistema');

		//Validate if the newPassword was updated properly

		cy.log(`test ${adminToUpdate.username}`);
		cy.get('#lbl-email').click();
		cy.get('#email').type(adminToUpdate.username);
		cy.get('#lbl-password').click();
		cy.get('#password').type(newPassword);
		cy.get('#btn-entrar').click();

		// Assert
		cy.url().should('include', '/dashboard.html');
		cy.get('#titlePageDashboard').contains('Login bem-sucedido!');
		cy.get('#logoApp').contains('QA-App');
		cy.get('#nav-user-info').contains(adminToUpdate.username);
		cy.get('#adminUsersBtn').should('be.visible');
		cy.get('#logout').contains('Sair').should('be.visible');
		cy.logout();
	});

	it('Usuario admin consegue atualizar a senha de outro usuario', () => {
		cy.get('#lbl-email').click();
		cy.get('#email').type(userAdmin.username);
		cy.get('#lbl-password').click();
		cy.get('#password').type(userAdmin.password);
		cy.get('#btn-entrar').click();

		// Arrange
		cy.url().should('include', '/dashboard.html');
		cy.get('#titlePageDashboard').contains('Login bem-sucedido!');
		cy.get('#logoApp').contains('QA-App');
		cy.get('#nav-user-info').contains(userAdmin.username);
		cy.get('#adminUsersBtn').should('be.visible');
		cy.get('#logout').contains('Sair').should('be.visible');

		cy.get('#adminUsersBtn').click();
		cy.get('#titlePageUsers').should('be.visible').contains('Usuários do Sistema');

		//Act
		cy.url().should('include', '/users.html');
		// Clica no botão editar
		cy.clickEditButtonByUsername(userCommon.username);
		cy.get('#editUserModal').should('be.visible');
		cy.get('#actualUsername').should('have.value', userCommon.username);
		cy.get('#lbl-editPassword').click();
		cy.get('#editPassword').type(newUserData.password, { force: true });
		cy.get('#editUserForm').submit();

		cy.get('#messageCard').should('be.visible').contains('Usuário atualizado com sucesso!');
		cy.logout();

		//login with new user credentials.
		cy.request({
			method: 'POST',
			url: '/login',
			body: {
				username: userCommon.username,
				password: newUserData.password,
			},
		}).then((loginResponse) => {
			expect(loginResponse.status).to.eq(200);
			cy.log('Login concluído com sucesso!');
		});
	});

	it('Usuario admin consegue atualizar o username de outro usuario', () => {
		cy.get('#lbl-email').click();
		cy.get('#email').type(userAdmin.username);
		cy.get('#lbl-password').click();
		cy.get('#password').type(userAdmin.password);
		cy.get('#btn-entrar').click();

		// Arrange
		cy.url().should('include', '/dashboard.html');
		cy.get('#titlePageDashboard').contains('Login bem-sucedido!');
		cy.get('#logoApp').contains('QA-App');
		cy.get('#nav-user-info').contains(userAdmin.username);
		cy.get('#adminUsersBtn').should('be.visible');
		cy.get('#logout').contains('Sair').should('be.visible');

		cy.get('#adminUsersBtn').click();
		cy.get('#titlePageUsers').should('be.visible').contains('Usuários do Sistema');

		//Act
		cy.url().should('include', '/users.html');
		// Clica no botão editar
		cy.clickEditButtonByUsername(userCommon.username);
		cy.get('#editUserModal').should('be.visible');
		cy.get('#actualUsername').should('have.value', userCommon.username);
		cy.get('#lbl-editUsername').click();
		cy.get('#editUsername').type(newUserData.username, { force: true });
		cy.get('#editUserForm').submit();

		cy.get('#messageCard').should('be.visible').contains('Usuário atualizado com sucesso!');

		// Verifica se o botão Editar agora tem os dados atualizados
		cy.getUserDataFromRow(newUserData.username).then((user) => {
			expect(user.username).to.eq(newUserData.username);
		});

		cy.logout();

		//login with new user credentials.
		cy.request({
			method: 'POST',
			url: '/login',
			body: {
				username: newUserData.username,
				password: userCommon.password,
			},
		}).then((loginResponse) => {
			expect(loginResponse.status).to.eq(200);
			cy.log('Login concluído com sucesso!');
		});
	});

	it('Usuario admin consegue atualizar o estado "blocked" de outro usuario', () => {
		cy.get('#lbl-email').click();
		cy.get('#email').type(userAdmin.username);
		cy.get('#lbl-password').click();
		cy.get('#password').type(userAdmin.password);
		cy.get('#btn-entrar').click();

		// Arrange
		cy.url().should('include', '/dashboard.html');
		cy.get('#titlePageDashboard').contains('Login bem-sucedido!');
		cy.get('#logoApp').contains('QA-App');
		cy.get('#nav-user-info').contains(userAdmin.username);
		cy.get('#adminUsersBtn').should('be.visible');
		cy.get('#logout').contains('Sair').should('be.visible');

		cy.get('#adminUsersBtn').click();
		cy.get('#titlePageUsers').should('be.visible').contains('Usuários do Sistema');

		//Act
		cy.url().should('include', '/users.html');
		// Clica no botão editar
		cy.clickEditButtonByUsername(userCommon.username);
		cy.get('#editUserModal').should('be.visible');
		cy.get('#actualUsername').should('have.value', userCommon.username);
		cy.get('#editBlocked').parent().find('input.select-dropdown').click();
		cy.get('ul.dropdown-content li').contains('Bloqueado').click();
		cy.get('#editUserForm').submit();

		cy.get('#messageCard').should('be.visible').contains('Usuário atualizado com sucesso!');

		// Verifica se o botão Editar agora tem os dados atualizados
		cy.getUserDataFromRow(userCommon.username).then((user) => {
			expect(user.username).to.eq(userCommon.username);
			expect(user.blocked).to.eq(userCommon.blocked);
		});

		cy.logout();
	});

	it('Usuario admin consegue deletar outro usuario', () => {
		const userToDelete = 'user2@email.com';

		cy.get('#lbl-email').click();
		cy.get('#email').type(userAdmin.username);
		cy.get('#lbl-password').click();
		cy.get('#password').type(userAdmin.password);
		cy.get('#btn-entrar').click();

		// Arrange
		cy.url().should('include', '/dashboard.html');
		cy.get('#titlePageDashboard').contains('Login bem-sucedido!');
		cy.get('#logoApp').contains('QA-App');
		cy.get('#nav-user-info').contains(userAdmin.username);
		cy.get('#adminUsersBtn').should('be.visible');
		cy.get('#logout').contains('Sair').should('be.visible');

		cy.get('#adminUsersBtn').click();
		cy.get('#titlePageUsers').should('be.visible').contains('Usuários do Sistema');

		//Act
		cy.url().should('include', '/users.html');
		// Clica no botão delete
		cy.clickDeleteButtonByUsername(userToDelete);
		cy.get('#deleteUserModal').should('be.visible');
		cy.get('#user-data').should('be.visible').contains(userToDelete);

		cy.get('#confirmDeleteBtn').click();

		cy.get('#messageCard').should('be.visible').contains('Usuário deletado com sucesso');
		cy.shouldNotExistInTable(userToDelete);
		cy.logout();
	});
});
