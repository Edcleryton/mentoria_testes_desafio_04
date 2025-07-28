// server.js
require('dotenv').config();

const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = process.env.PORT || 8080;

const apiTarget = process.env.API_TARGET || 'http://localhost:3000';

app.use(['/login', '/lembrar-senha'], createProxyMiddleware({
    target: apiTarget,
    changeOrigin: true, 
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor de front-end rodando na porta ${PORT}`);
    console.log(`Acesse em http://localhost:${PORT}`);
    console.log(`As requisições de API serão encaminhadas para ${apiTarget}`);
});
