// register.js - Lógica de cadastro de usuário

document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('register-form');
  const messageDiv = document.getElementById('message');

  function showMessage(message, type = 'info') {
    messageDiv.innerHTML = `
      <div class="card-panel ${type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue'} lighten-4 ${type === 'error' ? 'red-text' : type === 'success' ? 'green-text' : 'blue-text'} text-darken-2">
        ${message}
      </div>
    `;
  }

  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showMessage('Por favor, preencha todos os campos.', 'error');
      return;
    }
    if (!email.includes('@')) {
      showMessage('Por favor, insira um email válido.', 'error');
      return;
    }
    if (password.length < 12 || password.length > 16) {
      showMessage('A senha deve ter entre 12 e 16 caracteres.', 'error');
      return;
    }
    showMessage('Cadastrando...', 'info');
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      const data = await response.json();
      if (response.status === 201) {
        showMessage('Cadastro realizado com sucesso! Redirecionando para login...', 'success');
        setTimeout(() => { window.location.href = '/login.html'; }, 2000);
      } else {
        showMessage(data.message || 'Erro ao cadastrar.', 'error');
      }
    } catch (error) {
      showMessage('Erro ao conectar com a API.', 'error');
    }
  });
});