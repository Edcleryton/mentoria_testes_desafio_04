// login.js - Lógica de autenticação

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');
    let apiConfig = null; // Variável para armazenar a configuração da API

    // Função para mostrar mensagens
    function showMessage(message, type = 'info') {
        messageDiv.innerHTML = `
            <div class="card-panel ${type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue'} lighten-4 ${type === 'error' ? 'red-text' : type === 'success' ? 'green-text' : 'blue-text'} text-darken-2">
                ${message}
            </div>
        `;
    }

    // Função para obter configuração da API
    async function getApiConfig() {
        try {
            const response = await fetch('/api-config');
            const config = await response.json();
            apiConfig = config;
            return config;
        } catch (error) {
            console.error('Erro ao obter configuração da API:', error);
            // Fallback para configuração padrão
            apiConfig = { apiHost: 'localhost', apiPort: '3000', apiTarget: 'http://localhost:3000' };
            return apiConfig;
        }
    }

    // Função para verificar se a API está disponível
    async function checkApiHealth() {
        try {
            // Usando AbortController para timeout de 3 segundos
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch('/health', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            console.error('Erro ao verificar API:', error);
            if (error.name === 'AbortError') {
                console.log('Timeout: API não respondeu em 3 segundos');
            }
            return false;
        }
    }

    // Função para fazer login
    async function performLogin(email, password) {
        try {
            // Verifica novamente se a API está funcionando antes do login
            showMessage('Conectando com a API backend...', 'info');
            const apiHealth = await checkApiHealth();
            if (!apiHealth) {
                const port = apiConfig ? apiConfig.apiPort : '3000';
                showMessage(`⚠️ API backend não disponível (porta ${port})`, 'error');
                return;
            }

            // Timeout de 5 segundos para a requisição de login
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: email,
                    password: password
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            const data = await response.json();

            if (response.ok) {
                showMessage('Login realizado com sucesso! Redirecionando...', 'success');
                // Salva o token se existir
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                // Redireciona para o dashboard após 2 segundos
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 2000);
            } else {
                showMessage(data.message || 'Erro no login. Verifique suas credenciais.', 'error');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            if (error.name === 'AbortError') {
                showMessage('⏰ Timeout: API backend não respondeu', 'error');
            } else {
                const port = apiConfig ? apiConfig.apiPort : '3000';
                showMessage(`⚠️ API backend não disponível (porta ${port})`, 'error');
            }
        }
    }

    // Event listener para o formulário
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validação básica
        if (!email || !password) {
            showMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }

        if (!email.includes('@')) {
            showMessage('Por favor, insira um email válido.', 'error');
            return;
        }

        // Mostra mensagem de carregamento
        showMessage('Autenticando...', 'info');

        // Executa o login
        await performLogin(email, password);
    });

    // Verificação inicial da API com timeout mais rápido
    showMessage('Inicializando sistema e verificando API backend...', 'info');
    
    // Primeiro obtém a configuração da API
    getApiConfig().then(() => {
        checkApiHealth().then(isHealthy => {
            if (!isHealthy) {
                const port = apiConfig ? apiConfig.apiPort : '3000';
                showMessage(`⚠️ Servidor não disponível (porta ${port})`, 'error');
            } else {
                showMessage('✅ API backend conectada com sucesso!', 'success');
                // Remove a mensagem de sucesso após 3 segundos
                setTimeout(() => {
                    messageDiv.innerHTML = '';
                }, 3000);
            }
        });
    });
});
