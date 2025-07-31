# Sistema de Login - Desafio 4 (Frontend)

![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-green)
![Express](https://img.shields.io/badge/express-%5E4.18.2-blue)
![Cypress](https://img.shields.io/badge/tested%20with-Cypress-yellowgreen)

## 📋 Sumário
- [Sistema de Login - Desafio 4 (Frontend)](#sistema-de-login---desafio-4-frontend)
  - [📋 Sumário](#-sumário)
  - [🚀 Visão Geral](#-visão-geral)
  - [⚙️ Pré-requisitos](#️-pré-requisitos)
  - [📦 Instalação e Configuração](#-instalação-e-configuração)
  - [🔧 Configuração dos Serviços](#-configuração-dos-serviços)
  - [🧪 Testes](#-testes)
  - [📁 Estrutura do Projeto](#-estrutura-do-projeto)
  - [🔍 Endpoints Disponíveis](#-endpoints-disponíveis)
  - [🐛 Solução de Problemas](#-solução-de-problemas)

---

## 🚀 Visão Geral

Este é o **frontend** do sistema de login que se conecta à API backend (Desafio 3). O sistema inclui:

- ✅ **Interface de login** responsiva com MaterializeCSS
- ✅ **Validação de formulário** client-side
- ✅ **Verificação automática** de disponibilidade da API
- ✅ **Tratamento de erros** com feedback visual
- ✅ **Redirecionamento automático** após login bem-sucedido
- ✅ **Logs de debug** detalhados
- ✅ **Proxy inteligente** para API backend
- ✅ **Monitoramento** e health checks
- ✅ **Retry automático** para requisições falhadas

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) (geralmente já vem com o Node.js)
- **API Backend** (Desafio 3) - [Repositório da API](https://github.com/Edcleryton/mentoria_testes_desafio_03)

---

## 📦 Instalação e Configuração

### 1. Clone e Instale

```bash
# Clone o repositório
git clone https://github.com/Edcleryton/mentoria_testes_desafio_04.git
cd mentoria_testes_desafio_04

# Instale as dependências
npm install
```

### 2. Configure as Variáveis de Ambiente

O arquivo `.env` será criado automaticamente com as configurações padrão:

```env
# Configuração da API Backend (Desafio 3)
API_TARGET=http://localhost:3000

# Porta do servidor frontend
PORT=8080

# Configurações de timeout
API_TIMEOUT=5000
HEALTH_CHECK_TIMEOUT=3000
```

**💡 Nota:** O sistema detecta automaticamente a porta da API do arquivo `.env` e mostra a porta correta nas mensagens de erro.

---

## 🔧 Configuração dos Serviços

### Passo 1: Iniciar a API Backend (Desafio 3)

```bash
# Navegue para o diretório da API
cd ../mentoria_testes_desafio_03

# Instale as dependências (se necessário)
npm install

# Inicie a API
npm start
```

**✅ Verificar se a API está funcionando:**
```bash
curl -X GET http://localhost:3000/login
```

### Passo 2: Iniciar o Frontend (Desafio 4)

```bash
# Em outro terminal, navegue para o frontend
cd ../mentoria_testes_desafio_04

# Inicie o servidor frontend
npm start
```

**Ou use o script de desenvolvimento que verifica a API automaticamente:**
```bash
npm run dev
```

**✅ Verificar se o frontend está funcionando:**
```bash
curl -X GET http://localhost:8080/health
```

### Passo 3: Acessar a Aplicação

- **Frontend:** [http://localhost:8080](http://localhost:8080)
- **API Docs:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🧪 Testes

### Teste de Integração

```bash
# Testa se a integração com a API está funcionando
npm run test:integration
```

### Executar Testes E2E com Cypress

```bash
# Abrir interface do Cypress
npm test

# Executar testes em modo headless
npm run test:headless
```

---

## 📁 Estrutura do Projeto

```
mentoria_testes_desafio_04/
├── config/
│   └── api.js                    # Configurações da API
├── middleware/
│   └── errorHandler.js           # Middlewares de erro
├── scripts/
│   ├── start-dev.js              # Script de inicialização
│   └── test-integration.js       # Teste de integração
├── cypress/                      # Testes E2E
│   └── e2e/
│       └── login_spec.cy.js
├── public/                       # Arquivos estáticos
│   ├── js/
│   │   ├── login.js             # Lógica de autenticação
│   │   └── rememberPassword.js  # Recuperação de senha
│   ├── dashboard.html           # Página após login
│   ├── login.html              # Página de login
│   └── rememberPassword.html
├── .env                         # Variáveis de ambiente
├── .gitignore
├── cypress.config.js
├── package.json
├── README.md
├── INTEGRATION.md              # Documentação da integração
└── server.js                   # Servidor Express
```

---

## 🔍 Endpoints Disponíveis

### Frontend (Porta 8080)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Página inicial (redireciona para login) |
| `/login.html` | GET | Página de login |
| `/dashboard.html` | GET | Página após login bem-sucedido |
| `/rememberPassword.html` | GET | Página de recuperação de senha |
| `/health` | GET | Verificação de status do frontend |
| `/api-config` | GET | Configuração da API (host, porta) |
| `/api-status` | GET | Status da conexão com API |
| `/system-info` | GET | Informações do sistema |

## Health Check e Debug

- O endpoint `/health` está disponível no frontend para checagem rápida de disponibilidade do sistema e da API backend.
- O frontend consome `/health` para verificar se a API está online antes de permitir ações do usuário, evitando timeouts longos.
- Todos os acessos a endpoints são logados no terminal (debug), facilitando o rastreio de problemas.
- Para ativar logs detalhados, utilize o middleware de logging já incluso no projeto.

**Exemplo de uso:**
```bash
curl -X GET http://localhost:8080/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "API está funcionando",
  "timestamp": "2024-06-20T12:34:56.789Z"
}
```

### Proxy para API (Porta 8080 → 3000)

| Endpoint         | Método | Descrição                |
|------------------|--------|--------------------------|
| `/login`         | POST   | Proxy para login         |
| `/remember-password` | POST   | Proxy para recuperação   |
| `/register`      | POST   | Proxy para cadastro      |
| `/user`          | PATCH/DELETE | Proxy para update/delete user |
| `/users`         | GET    | Proxy para listagem de usuários |

### API Backend (Porta 3000)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/login` | POST | Autenticação de usuário |
| `/remember-password` | POST | Recuperação de senha |
| `/register` | POST | Cadastro de usuário |
| `/api-docs` | GET | Documentação Swagger |

---

## 🐛 Solução de Problemas

### Problema: "API backend não está disponível"

**Solução:**
1. Verifique se a API está rodando: `curl http://localhost:3000/login`
2. Confirme a porta no arquivo `.env`
3. Verifique os logs do terminal da API

### Problema: "Timeout ao verificar API"

**Solução:**
1. O sistema tem timeout de 3 segundos para health check
2. Verifique se a API responde rapidamente
3. Confirme se não há firewall bloqueando a porta

### Problema: "Erro de conexão"

**Solução:**
1. Verifique se ambos os serviços estão rodando
2. Confirme as portas nos arquivos `.env`
3. Verifique se não há conflitos de porta

### Verificação Rápida de Status

```bash
# Verificar API Backend
curl -X GET http://localhost:3000/login

# Verificar Frontend
curl -X GET http://localhost:8080/health

# Verificar configuração da API
curl -X GET http://localhost:8080/api-config

# Testar integração completa
npm run test:integration
```

---

## 📝 Credenciais de Teste

```json
{
  "admin@email.com": "Admin123456!",
  "user@email.com": "User12345678!",
  "user2@email.com": "User12345678!"
}
```

---

## 🔄 Fluxo de Login

1. **Acesso:** Usuário acessa `http://localhost:8080`
2. **Verificação:** Sistema verifica disponibilidade da API (`/health`)
3. **Login:** Usuário preenche credenciais e clica "Entrar"
4. **Autenticação:** Frontend faz POST para `/login` na API
5. **Resposta:** API retorna token JWT ou erro
6. **Redirecionamento:** Sucesso → Dashboard, Erro → Mensagem

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

---

## 👥 Autores

<table>
  <tr>
    <td align="center" valign="top">
      <a href="https://github.com/Edcleryton">
        <img src="https://avatars.githubusercontent.com/u/134793465?v=4" width="50px" alt="Edcleryton Silva"/><br />
        <sub><b>Edcleryton Silva</b></sub>
      </a>
    </td>
    <td align="center" valign="top">
      <a href="https://github.com/9809022">
        <img src="https://avatars.githubusercontent.com/u/9809022?v=4" width="50px" alt="JorgeX"/><br />
        <sub><b>JorgeX</b></sub>
      </a>
    </td>
    <td align="center" valign="top">
      <a href="https://github.com/43006576">
        <img src="https://avatars.githubusercontent.com/u/43006576?v=4" width="50px" alt="Kelvin Gustavo"/><br />
        <sub><b>Kelvin Gustavo</b></sub>
      </a>
    </td>
    <td align="center" valign="top">
      <a href="https://github.com/7840758">
        <img src="https://avatars.githubusercontent.com/u/7840758?v=4" width="50px" alt="Elaine Argolo"/><br />
        <sub><b>Elaine Argolo</b></sub>
      </a>
    </td>
  </tr>
</table>
