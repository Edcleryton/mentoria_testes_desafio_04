
describe('Fluxos de Autenticação', () => {
    
    // Antes de cada teste, visitamos a página de login
    beforeEach(() => {
        // NOTA: A API deve ser resetada ou estar em um estado conhecido antes dos testes.
        // Isso pode envolver chamadas de API para limpar o estado do usuário de teste.
        cy.visit('/login.html');
    });

    // Cenário 1: Login com Sucesso
    it('Deve redirecionar para o dashboard ao fazer login com sucesso', () => {
        // Intercepta a chamada para a API de login e simula uma resposta de sucesso
        cy.intercept('POST', '/login', {
            statusCode: 200,
            body: { message: 'Login bem-sucedido' },
        }).as('loginRequest');

        // Preenche o formulário
        cy.get('#email').type('usuario.valido@teste.com');
        cy.get('#password').type('senhaValida123');
        cy.get('form').submit();

        // Aguarda a requisição ser completada
        cy.wait('@loginRequest');

        // Verifica se a URL mudou para o dashboard
        cy.url().should('include', '/dashboard.html');
        cy.contains('h1', 'Login bem-sucedido!').should('be.visible');
    });

    // Cenário 2: Login com Credenciais Inválidas
    it('Deve exibir uma mensagem de erro para credenciais inválidas (401)', () => {
        // Simula uma resposta de erro 401 (Não Autorizado)
        cy.intercept('POST', '/login', {
            statusCode: 401,
            body: { message: 'Credenciais inválidas' },
        }).as('loginRequest');

        cy.get('#email').type('usuario.invalido@teste.com');
        cy.get('#password').type('senhaInvalida');
        cy.get('form').submit();

        cy.wait('@loginRequest');

        // Verifica se a mensagem de erro correta é exibida
        cy.get('#message').should('be.visible').and('contain.text', 'Email ou senha inválidos.');
        
        // Garante que não houve redirecionamento
        cy.url().should('not.include', '/dashboard.html');
    });

    // Cenário 3: Bloqueio por Tentativas
    it('Deve exibir mensagem de conta bloqueada após 3 tentativas falhas (403)', () => {
        // Simula 3 respostas 401 e depois uma 403
        cy.intercept('POST', '/login', (req) => {
            // Este contador simularia o estado do back-end
            // Para um teste de front-end puro, podemos controlar a resposta
            // Aqui, vamos interceptar e responder com 401 duas vezes e 403 na terceira.
            // NOTA: Um teste E2E real dependeria do comportamento real da API.
            // Para este exemplo, vamos simplificar a lógica de interceptação.
            
            // 1ª e 2ª Tentativas
            req.reply({ statusCode: 401, body: { message: 'Credenciais inválidas' } });
        }).as('failedLogin');

        // Primeira tentativa falha
        cy.get('#email').type('usuario.bloqueado@teste.com');
        cy.get('#password').type('senhaerrada');
        cy.get('form').submit();
        cy.wait('@failedLogin');
        cy.get('#message').should('contain.text', 'Email ou senha inválidos.');

        // Segunda tentativa falha
        cy.get('#password').clear().type('outrasenhaerrada');
        cy.get('form').submit();
        cy.wait('@failedLogin');
        cy.get('#message').should('contain.text', 'Email ou senha inválidos.');
        
        // Na terceira tentativa, a API deve retornar 403
        cy.intercept('POST', '/login', {
            statusCode: 403,
            body: { message: 'Conta bloqueada' },
        }).as('blockedLogin');

        // Terceira tentativa
        cy.get('#password').clear().type('terceiratentativa');
        cy.get('form').submit();
        cy.wait('@blockedLogin');

        // Verifica a mensagem de bloqueio
        cy.get('#message').should('be.visible').and('contain.text', 'Esta conta está bloqueada.');
    });

    // Cenário 4: Lembrar Senha
    it('Deve exibir uma mensagem de confirmação ao solicitar recuperação de senha', () => {
        cy.visit('/lembrar-senha.html');

        // Simula uma resposta de sucesso da API
        cy.intercept('POST', '/lembrar-senha', {
            statusCode: 200,
            body: { message: 'Instruções enviadas' },
        }).as('lembrarSenhaRequest');

        cy.get('#email').type('usuario.existente@teste.com');
        cy.get('form').submit();

        cy.wait('@lembrarSenhaRequest');

        // Verifica a mensagem de sucesso
        cy.get('#message').should('be.visible').and('contain.text', 'Instruções enviadas para seu email.');
    });
});
