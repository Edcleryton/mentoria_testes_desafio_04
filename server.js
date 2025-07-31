// server.js
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Importando configurações e middlewares
const { apiConfig, makeApiRequest, checkApiHealth, getApiInfo } = require('./config/api');
const { requestLogger, errorHandler, notFoundHandler, jsonErrorHandler } = require('./middleware/errorHandler');

const app = express();

const PORT = process.env.PORT || 8080;

// Middleware para logging de requisições
app.use(requestLogger);

// Middleware para parsing JSON
app.use(express.json());

// Middleware para tratamento de erros de JSON
app.use(jsonErrorHandler);

// Configuração CORS
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true
}));

// Endpoint para obter configuração da API
app.get('/api-config', (req, res) => {
    const apiInfo = getApiInfo();
    res.json({
        ...apiInfo,
        timestamp: new Date().toISOString()
    });
});

// Endpoint de health check melhorado
app.get('/health', async (req, res) => {
    try {
        console.log('Verificando saúde da API backend...');
        
        const healthResult = await checkApiHealth();
        
        if (healthResult.status === 'ok') {
            res.json({ 
                status: 'ok', 
                message: 'API está funcionando',
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(503).json({ 
                status: 'error', 
                message: 'API não está disponível',
                error: healthResult.error,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Erro ao verificar saúde da API:', error);
        res.status(503).json({ 
            status: 'error', 
            message: 'API não está disponível',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Proxy para endpoints da API com melhor tratamento de erros
app.use(
    ['/login', '/remember-password', '/register', '/user', '/users'],
    createProxyMiddleware({
        target: apiConfig.target,
        changeOrigin: true,
        selfHandleResponse: false,
        onProxyReq: (proxyReq, req, res) => {
            // Encaminhar o body manualmente, se necessário
            if (req.body && Object.keys(req.body).length) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        },
        onProxyRes: (proxyRes, req, res) => {
            // (Se já existe algum handler, mantenha aqui)
        },
        onError: (err, req, res) => {
            // (Se já existe algum handler, mantenha aqui)
        }
    })
);

// Endpoint para verificar status da API
app.get('/api-status', async (req, res) => {
    try {
        const response = await makeApiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({
                username: 'test@status.com',
                password: 'test'
            })
        });
        
        res.json({
            status: 'connected',
            apiUrl: apiConfig.target,
            responseTime: Date.now(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'disconnected',
            apiUrl: apiConfig.target,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Endpoint para informações do sistema
app.get('/system-info', (req, res) => {
    const apiInfo = getApiInfo();
    res.json({
        frontend: {
            port: PORT,
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString()
        },
        backend: {
            ...apiInfo
        },
        version: '1.0.0'
    });
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal - redireciona para login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Middleware para rotas não encontradas
app.use('*', notFoundHandler);

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicialização do servidor
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 Servidor Frontend iniciado');
    console.log('='.repeat(60));
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🔗 API Backend: ${apiConfig.target}`);
    console.log(`⏱️  Timeout API: ${apiConfig.timeouts.api}ms`);
    console.log(`⏱️  Timeout Health: ${apiConfig.timeouts.health}ms`);
    console.log('='.repeat(60));
    console.log('📋 Endpoints disponíveis:');
    console.log(`   GET  / - Página inicial`);
    console.log(`   GET  /health - Verificação de saúde`);
    console.log(`   GET  /api-config - Configuração da API`);
    console.log(`   GET  /api-status - Status da API`);
    console.log(`   GET  /system-info - Informações do sistema`);
    console.log(`   POST /login - Proxy para login`);
    console.log(`   POST /remember-password - Proxy para recuperação`);
    console.log(`   POST /register - Proxy para cadastro`);
    console.log('='.repeat(60));
});
