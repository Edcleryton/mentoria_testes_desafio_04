// config/api.js - Configurações da API

const apiConfig = {
    // URL da API backend (Desafio 3)
    target: process.env.API_TARGET || 'http://localhost:3000',
    
    // Timeouts
    timeouts: {
        api: parseInt(process.env.API_TIMEOUT) || 5000,
        health: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 3000
    },
    
    // Endpoints disponíveis na API
    endpoints: {
        login: '/login',
        rememberPassword: '/remember-password',
        register: '/register',
        user: '/user',
        adminUser: '/admin/user',
        adminUsers: '/admin/users'
    },
    
    // Headers padrão
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Configurações de retry
    retry: {
        attempts: 3,
        delay: 1000
    }
};

// Função para fazer requisições para a API com retry
async function makeApiRequest(endpoint, options = {}) {
    const { attempts, delay } = apiConfig.retry;
    
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeouts.api);
            
            const response = await fetch(`${apiConfig.target}${endpoint}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    ...apiConfig.headers,
                    ...options.headers
                }
            });
            
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            console.error(`Tentativa ${attempt} falhou:`, error.message);
            
            if (attempt === attempts) {
                throw error;
            }
            
            // Aguarda antes da próxima tentativa
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Função para verificar saúde da API
async function checkApiHealth() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeouts.health);
        
        const response = await fetch(`${apiConfig.target}/login`, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify({
                username: 'health@check.com',
                password: 'health'
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return { status: 'ok', response };
    } catch (error) {
        return { status: 'error', error: error.message };
    }
}

// Função para obter informações da API
function getApiInfo() {
    const apiUrl = new URL(apiConfig.target);
    return {
        host: apiUrl.hostname,
        port: apiUrl.port || (apiUrl.protocol === 'https:' ? '443' : '80'),
        target: apiConfig.target,
        timeouts: apiConfig.timeouts,
        endpoints: apiConfig.endpoints
    };
}

module.exports = {
    apiConfig,
    makeApiRequest,
    checkApiHealth,
    getApiInfo
}; 