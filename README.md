# Aplicação de Login (Frontend)

![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-green)
![Express](https://img.shields.io/badge/express-%5E4.18.2-blue)
![Cypress](https://img.shields.io/badge/tested%20with-Cypress-yellowgreen)

## Sumário
- [Aplicação de Login (Frontend)](#aplicação-de-login-frontend)
  - [Sumário](#sumário)
  - [Pré-requisitos](#pré-requisitos)
  - [Como baixar e instalar o projeto](#como-baixar-e-instalar-o-projeto)
  - [Como rodar os testes](#como-rodar-os-testes)
    - [Explicação dos Componentes](#explicação-dos-componentes)
    - [Dependências principais](#dependências-principais)
    - [Observações](#observações)

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) (geralmente já vem com o Node.js)
- A **API de back-end** (do Desafio 3) deve estar em execução para que o login funcione.

---

## Como baixar e instalar o projeto

1.  **Clone o repositório (ou baixe o ZIP):**

    ```bash
    git clone [https://github.com/seu-usuario/desafio4-frontend.git](https://github.com/seu-usuario/desafio4-frontend.git)
    cd desafio4-frontend
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Crie o arquivo de ambiente:**
    - Crie um arquivo chamado `.env` na raiz do projeto.
    - Adicione a seguinte linha, ajustando a porta se a sua API de back-end rodar em uma diferente:
      ```
      API_TARGET=http://localhost:8080
      ```

4.  **Inicie a aplicação:**

    ```bash
    npm start
    ```

5.  **Acesse a aplicação no navegador:**
    - [http://localhost:3000](http://localhost:3000)

---

## Como rodar os testes

Os testes de ponta a ponta (E2E) são feitos com Cypress e validam os principais fluxos da aplicação.

Para executar, use o comando:

```bash
npm test
Isso abrirá a interface do Cypress, onde você poderá selecionar e rodar os testes.

Estrutura de Pastas e Explicação
/
├── cypress/                # Contém os testes E2E
│   └── e2e/
│       └── login_spec.cy.js
├── public/                 # Arquivos estáticos servidos ao navegador
│   ├── js/
│   │   ├── login.js
│   │   └── lembrar-senha.js
│   ├── dashboard.html
│   ├── lembrar-senha.html
│   └── login.html
├── .env                    # Arquivo para variáveis de ambiente (NÃO versionar)
├── .gitignore              # Arquivos e pastas ignorados pelo Git
├── cypress.config.js       # Configurações do Cypress
├── package.json            # Definições e dependências do projeto
├── README.md               # Esta documentação
└── server.js               # Servidor Express que serve a aplicação  

### Explicação dos Componentes

- **server.js**: Ponto de entrada da aplicação. Inicia o servidor e o proxy para a API.  
- **public/**: Contém todo o código do lado do cliente (HTML e JS).  
- **cypress/**: Contém os arquivos de teste automatizado.

---

### Dependências principais

- **express**: Framework para criar o servidor web  
- **http-proxy-middleware**: Redireciona chamadas do frontend para a API  
- **dotenv**: Carrega variáveis de ambiente do arquivo `.env`  
- **cypress**: Framework para testes E2E

---

### Observações

- Este projeto é o *frontend* e precisa da API de *backend* (Desafio 3) para funcionar completamente.  
- O repositório da API pode ser acessado em: [https://github.com/seu-usuario/desafio3-backend](https://github.com/seu-usuario/desafio3-backend)  
- O servidor Express (`server.js`) atua como intermediário, servindo arquivos estáticos e redirecionando chamadas de API, evitando problemas de CORS.

---

O servidor Express (server.js) atua como um intermediário, servindo os arquivos estáticos e redirecionando as chamadas de API para o backend, evitando problemas de CORS.

Licença
Este projeto está licenciado sob a licença MIT.

👤 Autores
<table>
  <tr>
    <td align="center" valign="top">
      <a href="https://github.com/Edcleryton">
        <img src="https://avatars.githubusercontent.com/u/134793465?v=4" width="50px" alt="Edcleryton Silva"/><br />
        <sub><b> Edcleryton Silva </b></sub>
      </a>
    </td>
    <td align="center" valign="top">
      <a href="https://github.com/9809022">
        <img src="https://avatars.githubusercontent.com/u/9809022?v=4" width="50px" alt="Autor 1"/><br />
        <sub><b> JorgeX </b></sub>
      </a>
    </td>
    <td align="center" valign="top">
      <a href="https://github.com/43006576">
        <img src="https://avatars.githubusercontent.com/u/43006576?v=4" width="50px" alt="Autor 2"/><br />
        <sub><b> Kelvin Gustavo </b></sub>
      </a>
    </td>
    <td align="center" valign="top">
      <a href="https://github.com/7840758">
        <img src="https://avatars.githubusercontent.com/u/7840758?v=4" width="50px" alt="Autor 3"/><br />
        <sub><b> Elaine Argolo </b></sub>
      </a>
    </td>
  </tr>
</table>

---