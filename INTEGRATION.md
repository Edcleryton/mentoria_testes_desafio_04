# Integração com API Backend (Desafio 3)

Este documento explica como o frontend do Desafio 4 se integra com a API backend do Desafio 3.

## 📋 Visão Geral

O frontend do Desafio 4 funciona como um **proxy inteligente** que:
- Serve páginas HTML estáticas
- Encaminha requisições de API para o backend do Desafio 3
- Fornece endpoints de monitoramento e configuração
- Implementa tratamento de erros robusto

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configuração da API Backend (Desafio 3)
API_TARGET=http://localhost:3000

# Porta do servidor frontend
PORT=8080

# Configurações de timeout
API_TIMEOUT=5000
HEALTH_CHECK_TIMEOUT=3000
```

### Estrutura de Arquivos

```
mentoria_testes_desafio_04/
├── config/
│   └── api.js              # Configurações da API
├── middleware/
│   └── errorHandler.js      # Middlewares de erro
├── scripts/
│   └── start-dev.js         # Script de inicialização
├── public/                  # Arquivos estáticos
├── server.js               # Servidor principal
└── .env                    # Variáveis de ambiente
```

## 🚀 Como Executar

### 1. Iniciar a API Backend (Desafio 3)

```bash
cd mentoria_testes_desafio_03
npm install
npm start
```

**Verificar se está funcionando:**
```bash
curl http://localhost:3000/login
```

### 2. Iniciar o Frontend (Desafio 4)

```bash
cd mentoria_testes_desafio_04
npm install
npm start
```

**Ou usar o script de desenvolvimento:**
```bash
npm run dev
```

### 3. Acessar a Aplicação

- **Frontend:** http://localhost:8080
- **API Docs:** http://localhost:3000/api-docs

## 📡 Endpoints Disponíveis

### Frontend (Porta 8080)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Página inicial (redireciona para login) |
| `/login.html` | GET | Página de login |
| `/dashboard.html` | GET | Página após login |
| `/rememberPassword.html` | GET | Página de recuperação de senha |
| `/health` | GET | Verificação de saúde da API |
| `/api-config` | GET | Configuração da API |
| `/api-status` | GET | Status da conexão com API |
| `/system-info` | GET | Informações do sistema |

### Proxy para API (Porta 8080 → 3000)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/login` | POST | Proxy para login |
| `/remember-password` | POST | Proxy para recuperação |
| `/register` | POST | Proxy para cadastro |

## 🔄 Fluxo de Integração

### 1. Verificação de Saúde

O frontend verifica periodicamente se a API está disponível:

```javascript
// Endpoint: GET /health
{
  "status": "ok",
  "message": "API está funcionando",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Configuração da API

O frontend obtém configurações da API:

```javascript
// Endpoint: GET /api-config
{
  "host": "localhost",
  "port": "3000",
  "target": "http://localhost:3000",
  "timeouts": {
    "api": 5000,
    "health": 3000
  },
  "endpoints": {
    "login": "/login",
    "rememberPassword": "/remember-password",
    "register": "/register"
  }
}
```

### 3. Proxy de Requisições

Quando o frontend faz uma requisição para `/login`:

1. **Frontend** → `POST /login` (porta 8080)
2. **Proxy** → `POST http://localhost:3000/login`
3. **API** → Processa e retorna resposta
4. **Proxy** → Encaminha resposta para frontend

## 🛡️ Tratamento de Erros

### Cenários de Erro

1. **API não disponível:**
   ```json
   {
     "status": "error",
     "message": "API não está disponível",
     "error": "connect ECONNREFUSED"
   }
   ```

2. **Timeout da requisição:**
   ```json
   {
     "status": "error",
     "message": "Timeout da requisição",
     "error": "AbortError"
   }
   ```

3. **Erro de proxy:**
   ```json
   {
     "error": "API backend não está disponível",
     "message": "Serviço temporariamente indisponível"
   }
   ```

### Retry Automático

O sistema implementa retry automático para requisições:
- **Tentativas:** 3
- **Delay entre tentativas:** 1 segundo
- **Timeout por tentativa:** 5 segundos

## 📊 Monitoramento

### Endpoints de Monitoramento

1. **GET /health** - Verificação de saúde
2. **GET /api-status** - Status da conexão
3. **GET /system-info** - Informações do sistema

### Logs

O sistema gera logs detalhados:

```
[2024-01-15T10:30:00.000Z] POST /login - Iniciando
[2024-01-15T10:30:01.234Z] POST /login - 200 OK (1234ms)
Proxy: POST /login -> http://localhost:3000/login
Proxy Response: 200 for /login
```

## 🔧 Configurações Avançadas

### Timeouts

```javascript
// config/api.js
timeouts: {
  api: 5000,        // Timeout para requisições da API
  health: 3000      // Timeout para health check
}
```

### Retry

```javascript
// config/api.js
retry: {
  attempts: 3,      // Número de tentativas
  delay: 1000       // Delay entre tentativas (ms)
}
```

### CORS

```javascript
// server.js
cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true
})
```

## 🧪 Testes

### Testes E2E com Cypress

```bash
# Abrir interface do Cypress
npm test

# Executar testes em modo headless
npm run test:headless
```

### Testes Manuais

1. **Verificar API:**
   ```bash
   curl http://localhost:8080/health
   ```

2. **Testar login:**
   ```bash
   curl -X POST http://localhost:8080/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin@email.com","password":"Admin123456!"}'
   ```

3. **Verificar configuração:**
   ```bash
   curl http://localhost:8080/api-config
   ```

## 🐛 Solução de Problemas

### Problema: "API não está disponível"

**Solução:**
1. Verifique se a API está rodando: `curl http://localhost:3000/login`
2. Confirme a porta no arquivo `.env`
3. Verifique os logs do terminal da API

### Problema: "Timeout ao verificar API"

**Solução:**
1. Aumente o timeout no `.env`: `HEALTH_CHECK_TIMEOUT=5000`
2. Verifique se a API responde rapidamente
3. Confirme se não há firewall bloqueando

### Problema: "Erro de proxy"

**Solução:**
1. Verifique se ambos os serviços estão rodando
2. Confirme as portas nos arquivos `.env`
3. Verifique se não há conflitos de porta

## 📝 Credenciais de Teste

```json
{
  "admin@email.com": "Admin123456!",
  "user@email.com": "User12345678!",
  "user2@email.com": "User12345678!"
}
```

## 🔄 Fluxo Completo

1. **Usuário acessa:** http://localhost:8080
2. **Frontend verifica:** API disponível via `/health`
3. **Usuário faz login:** Preenche formulário
4. **Frontend envia:** POST para `/login` (proxy)
5. **Proxy encaminha:** Para API em localhost:3000
6. **API processa:** Autenticação e retorna token
7. **Frontend recebe:** Resposta e redireciona para dashboard

## 📚 Recursos Adicionais

- [Documentação da API (Desafio 3)](../mentoria_testes_desafio_03/README.md)
- [Testes E2E](../cypress/e2e/login_spec.cy.js)
- [Configuração do Cypress](../cypress.config.js) 