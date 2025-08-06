describe('template spec', () => {
    const userCommon = {
        username: 'user@email.com',
        password: 'User12345678!',
        userUnexists: 'usuarioinexistente@gmail.com',
        newUser:'novousuario@email.com'
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
        

        cy.contains('Acessar Sistema').should('be.visible');
    });

   /* after(() => {
        cy.log('after...');
    });*/
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
        //hhp;
        cy.contains('Login bem-sucedido!');
        cy.contains('QA-App');
        cy.get('#nav-user-info').contains(userCommon.username);
        cy.get('#adminUsersBtn').should('not.visible');
        cy.get('#logout').contains('Sair').should('be.visible');
    });
    
    it('Tratamento de erro com credenciais inválidas - usuario ok/senha incorreta', () => {
        
        //ACT
        cy.log(`test ${userCommon.userUnexists}`);
        cy.get('#lbl-email').click();
        cy.get('#email').type(userCommon.userUnexists);
        cy.get('#lbl-password').click();
        cy.get('#password').type('senhaInvalida');
        cy.get('#btn-entrar').click();

        //Assert 
        cy.contains('.card-panel', 'Usuário ou senha inválidos.').should('be.visible')//cy.get('.card-panel').should('have.text', 'Usuário ou senha inválidos')
    });

    it ('Lembrar senha de usuário cadastrado - Link "Esqueceu a senha?"', ()=>{
        //Arrange
        cy.get("a[href='/rememberPassword.html']").click();
        cy.get('.card-title').contains('Recuperar Senha').should('be.visible');

        //act
        cy.get('label').click().type(userCommon.username);
        cy.get('.btn').click()

        //Assert
        cy.contains('.card-panel', 'Instruções enviadas com sucesso! retornando a página de login...').should('be.visible')
        
    })


});