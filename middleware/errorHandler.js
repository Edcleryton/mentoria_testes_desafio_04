// middleware/errorHandler.js - Middleware para tratamento de erros

// Middleware para logging de requisições
function requestLogger(req, res, next) {
    const start = Date.now();
    
    // Log da requisição
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Iniciando`);
    
    // Intercepta o final da resposta
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const statusText = res.statusMessage || '';
        
        // Log da resposta
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${status} ${statusText} (${duration}ms)`);
    });
    
    next();
}

// Middleware para tratamento de erros
function errorHandler(err, req, res, next) {
    console.error('Erro no servidor:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    
    // Se já foi enviada uma resposta, não faz nada
    if (res.headersSent) {
        return next(err);
    }
    
    // Determina o status code apropriado
    let statusCode = 500;
    let message = 'Erro interno do servidor';
    
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Dados inválidos';
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Não autorizado';
    } else if (err.name === 'ForbiddenError') {
        statusCode = 403;
        message = 'Acesso negado';
    } else if (err.name === 'NotFoundError') {
        statusCode = 404;
        message = 'Recurso não encontrado';
    } else if (err.name === 'TimeoutError') {
        statusCode = 408;
        message = 'Timeout da requisição';
    }
    
    res.status(statusCode).json({
        error: message,
        message: err.message,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method
    });
}

// Middleware para rotas não encontradas
function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Rota não encontrada',
        message: `O endpoint ${req.method} ${req.path} não existe`,
        timestamp: new Date().toISOString(),
        availableEndpoints: [
            'GET /',
            'GET /health',
            'GET /api-config',
            'GET /api-status',
            'GET /system-info',
            'POST /login',
            'POST /remember-password',
            'POST /register'
        ]
    });
}

// Middleware para validação de JSON
function jsonErrorHandler(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'JSON inválido',
            message: 'O corpo da requisição deve ser um JSON válido',
            timestamp: new Date().toISOString()
        });
    }
    next(err);
}

module.exports = {
    requestLogger,
    errorHandler,
    notFoundHandler,
    jsonErrorHandler
}; 