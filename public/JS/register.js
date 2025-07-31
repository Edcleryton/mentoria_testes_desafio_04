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
    // Regex simples para email válido
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Por favor, insira um email válido no formato exemplo@dominio.com.', 'error');
      return;
    }
    // Regex para senha forte: 12-16 caracteres, maiúscula, minúscula, número, especial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{12,16}$/;
    if (!passwordRegex.test(password)) {
      showMessage(`
        <ul style='text-align:left; display:inline-block;'>
          <li> * A senha deve ter entre 12 e 16 caracteres</li>
          <li> * Deve conter pelo menos uma letra maiúscula</li>
          <li> * Deve conter pelo menos uma letra minúscula</li>
          <li> * Deve conter pelo menos um número</li>
          <li> * Deve conter pelo menos um caractere especial (!@#$%^&*)</li>
        </ul>
      `, 'error');
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

  // Olho mágico para mostrar/ocultar senha
  const passwordInput = document.getElementById('password');
  const togglePassword = document.querySelector('.toggle-password');
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePassword.textContent = isPassword ? 'visibility' : 'visibility_off';
    });
  }
});