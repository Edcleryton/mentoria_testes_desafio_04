// server.js
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = process.env.PORT || 8080;

const apiTarget = process.env.API_TARGET || 'http://localhost:3000';

// Proxy para endpoints da API
app.use(
	['/login', '/remember-password'],
	createProxyMiddleware({
		target: apiTarget,
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
	})
);

//Adicionando cors
app.use(cors());

// Middleware para parsing JSON
app.use(express.json());

// Endpoint para obter configuração da API
app.get('/api-config', (req, res) => {
	const apiUrl = new URL(apiTarget);
	res.json({
		apiHost: apiUrl.hostname,
		apiPort: apiUrl.port || (apiUrl.protocol === 'https:' ? '443' : '80'),
		apiTarget: apiTarget,
	});
});

// Endpoint de health check
app.get('/health', async (req, res) => {
	try {
		// Tenta fazer uma requisição para a API para verificar se está funcionando
		const response = await fetch(`${apiTarget}/health`);
		if (response.ok) {
			res.json({ status: 'ok', message: 'API está funcionando' });
		} else {
			res.status(503).json({ status: 'error', message: 'API backend não está respondendo corretamente' });
		}
	} catch (error) {
		res.status(503).json({ status: 'error', message: 'API não está disponível' });
	}
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
	console.log(`Servidor de front-end rodando na porta ${PORT}`);
	console.log(`Acesse em http://localhost:${PORT}`);
	console.log(`As requisições de API serão encaminhadas para ${apiTarget}`);
});
