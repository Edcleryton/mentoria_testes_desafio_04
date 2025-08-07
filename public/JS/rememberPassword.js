// rememberPassword.js - Lógica de recuperação de senha

document.addEventListener('DOMContentLoaded', function () {
	const rememberForm = document.getElementById('remember-form');
	const messageDiv = document.getElementById('message');

	// Função para mostrar mensagens
	function showMessage(message, type = 'info') {
		messageDiv.innerHTML = `
			<div id="messageCard" class="card-panel ${type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue'} lighten-4 ${
			type === 'error' ? 'red-text' : type === 'success' ? 'green-text' : 'blue-text'
		} text-darken-2">
				${message}
			</div>
		`;
	}

	// Função para enviar solicitação de recuperação de senha
	async function sendRememberPassword(email) {
		try {
			showMessage('Enviando solicitação...', 'info');

			const controller = new AbortController();
			const timeout = 10000;
			const timeoutId = setTimeout(() => controller.abort(), timeout);

			const response = await fetch('/remember-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username: email }),
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			const data = await response.json();

			if (response.ok) {
				showMessage('✅ Instruções enviadas com sucesso! <br> retornando a página de login...', 'success');

				// Espera 5 segundos e redireciona para login
				setTimeout(() => {
					window.location.href = '/login.html';
				}, 5000);
			} else {
				showMessage(data.message || '❌ Erro ao enviar instruções', 'error');
			}
		} catch (error) {
			console.error('Erro na requisição:', error);
			if (error.name === 'AbortError') {
				showMessage('⏰ Timeout: API backend não respondeu', 'error');
			} else {
				showMessage('⚠️ Erro ao conectar com a API', 'error');
			}
		}
	}

	// Event listener para o formulário
	rememberForm.addEventListener('submit', async function (e) {
		e.preventDefault();

		const email = document.getElementById('email').value.trim();

		if (!email) {
			showMessage('Por favor, preencha o campo de email.', 'error');
			return;
		}

		if (!email.includes('@')) {
			showMessage('Por favor, insira um email válido.', 'error');
			return;
		}

		await sendRememberPassword(email);
	});
});
