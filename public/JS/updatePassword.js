// updatePassword.js - Atualização de senha do usuário autenticado

document.addEventListener('DOMContentLoaded', function () {
	const updateForm = document.getElementById('update-form');
	const messageDiv = document.getElementById('message');

	function showMessage(message, type = 'info') {
		messageDiv.innerHTML = `
      <div id="messageCard" class="card-panel ${
			type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue'
		} lighten-4 ${type === 'error' ? 'red-text' : type === 'success' ? 'green-text' : 'blue-text'} text-darken-2">
        ${message}
      </div>
    `;
	}

	updateForm.addEventListener('submit', async function (e) {
		e.preventDefault();
		const password = document.getElementById('password').value;
		if (password.length < 12 || password.length > 16) {
			showMessage('A senha deve ter entre 12 e 16 caracteres.', 'error');
			return;
		}
		showMessage('Atualizando senha...', 'info');
		try {
			const token = localStorage.getItem('authToken');
			if (!token) {
				showMessage('Usuário não autenticado.', 'error');
				return;
			}
			const response = await fetch('/user', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({ password }),
			});
			const data = await response.json();
			if (response.ok) {
				showMessage('✅ Senha atualizada com sucesso!', 'success');
				// Espera 5 segundos e redireciona para login
				setTimeout(() => {
					window.location.href = '/login.html';
				}, 5000);
			} else {
				showMessage(data.message || 'Erro ao atualizar senha.', 'error');
			}
		} catch (error) {
			showMessage('Erro ao conectar com a API.', 'error');
		}
	});
});
