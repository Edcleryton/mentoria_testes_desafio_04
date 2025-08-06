// users.js - Listagem e deleção de usuários (apenas para admin)

let userToDelete = null;
let originalUserData = '';
function parseJwt(token) {
	try {
		return JSON.parse(atob(token.split('.')[1]));
	} catch (e) {
		return null;
	}
}

function resetEditForm() {
	document.getElementById('editUserForm').reset();
}

function cancelDelete() {
	userToDelete = null; // Limpa o estado
	const modal = M.Modal.getInstance(document.getElementById('deleteUserModal'));
	modal.close();
}
document.addEventListener('DOMContentLoaded', function () {
	if (!window.AuthUtils.isLoggedIn()) {
		console.warn('Usuário não está logado. Redirecionando...');
		window.location.href = '/login.html';
	}

	if (!window.AuthUtils || !window.AuthUtils.requireRole) {
		alert('Erro: AuthUtils não carregado corretamente.');
		return;
	}

	if (!window.AuthUtils.requireRole('admin', '/dashboard.html')) {
		alert('Você não tem permissão para acessar esta página.');
		return;
	}

	if (!window.AuthUtils.requireRole('admin', '/dashboard.html')) {
		return;
	}
	const token = localStorage.getItem('authToken');

	// Se não há token, espera 5 segundos antes de redirecionar
	if (!token) {
		setTimeout(() => {
			window.location.replace('/dashboard.html');
		}, 5000);
		return;
	}

	const decoded = parseJwt(token);

	if (!decoded || decoded.role.toLowerCase() !== 'admin') {
		// Se não for admin, espera 5 segundos antes de redirecionar
		setTimeout(() => {
			window.location.replace('/dashboard.html');
		}, 5000);
		return;
	}

	const usersTableBody = document.querySelector('#users-table tbody');
	const messageDiv = document.getElementById('message');

	function showMessage(message, type = 'info') {
		messageDiv.innerHTML = `
      <div class="card-panel ${type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue'} lighten-4 ${
			type === 'error' ? 'red-text' : type === 'success' ? 'green-text' : 'blue-text'
		} text-darken-2">
        ${message}
      </div>
    `;
	}

	async function fetchUsers() {
		try {
			const token = localStorage.getItem('authToken');
			if (!token) {
				showMessage('Usuário não autenticado.', 'error');
				return;
			}
			const response = await fetch('/admin/users', {
				method: 'GET',
				headers: { 'Authorization': `Bearer ${token}` },
			});

			console.log('Resposta da API /admin/users:', response);

			if (!response.ok) {
				const errorText = await response.text(); // <== Adicione isso
				showMessage(`Erro ao buscar usuários: ${response.status} - ${errorText}`, 'error');
				return;
			}
			const users = await response.json();
			renderUsers(users);
		} catch (error) {
			showMessage('Erro ao conectar com a API.', 'error');
		}
	}

	// Alteração na renderização da tabela para incluir botão de editar
	function renderUsers(users) {
		usersTableBody.innerHTML = '';
		userToDelete = null;
		originalUserData = null;

		users.forEach((user) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
        <td>${user.username}</td>
        <td>${user.role}</td>
        <td>${user.blocked ? 'Bloqueado' : 'Ativo'}</td>
        <td>
          <button class="btn-small red delete-btn tooltipped" 
          data-username="${user.username}" data-tooltip="Deletar ${user.username}">
            <i class="material-icons">delete</i>
          </button>
          <button class="btn-small blue edit-btn tooltipped" 
          data-user='${JSON.stringify(user)}' data-tooltip="Editar ${user.username}">
            <i class="material-icons">edit</i>
          </button>
        </td>
      `;
			usersTableBody.appendChild(tr);
		});

		document.querySelectorAll('.edit-btn').forEach((btn) => {
			btn.addEventListener('click', function () {
				const user = JSON.parse(this.getAttribute('data-user'));
				openEditModal(user);
			});
		});

		//delete user
		function openDeleteModal(username) {
			userToDelete = username; // salva temporariamente

			document.getElementById('deleteUsernameDisplay').textContent = username;
			const modal = M.Modal.getInstance(document.getElementById('deleteUserModal'));
			modal.open();
		}

		document.querySelectorAll('.delete-btn').forEach((btn) => {
			btn.addEventListener('click', async function () {
				const user = this.getAttribute('data-username');
				openDeleteModal(user);
			});
		});
		document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
			if (!userToDelete) return;

			await deleteUser(userToDelete);

			const modal = M.Modal.getInstance(document.getElementById('deleteUserModal'));
			modal.close();
			userToDelete = null;
		});
	}

	async function deleteUser(email) {
		try {
			const token = localStorage.getItem('authToken');
			if (!token) {
				showMessage('Usuário não autenticado.', 'error');
				return;
			}
			const response = await fetch('/admin/user', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({ username: email }),
			});
			const data = await response.json();
			if (response.ok) {
				showMessage('Usuário deletado com sucesso!', 'success');
				setTimeout(() => location.reload(), 1000);
				fetchUsers();
			} else {
				showMessage(data.message || 'Erro ao deletar usuário.', 'error');
			}
		} catch (error) {
			showMessage('Erro ao conectar com a API.', 'error');
		}
	}

	async function updateUser(originalUserData, updatedUser) {
		const token = localStorage.getItem('authToken');

		try {
			const response = await fetch('/admin/user', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					username: originalUserData.username,
					newUsername: updatedUser.newUsername,
					...(updatedUser.password && { newPassword: updatedUser.password }),
					blocked: updatedUser.blocked,
				}),
			});

			const result = await response.json();
			if (response.ok) {
				showMessage('Usuário atualizado com sucesso!', 'success');
				M.Modal.getInstance(document.getElementById('editUserModal')).close();
				setTimeout(() => location.reload(), 1000);
				fetchUsers();
			} else {
				showMessage(result.message || 'Erro ao atualizar usuário.', 'error');
			}
		} catch (error) {
			showMessage('Erro ao conectar com a API.', 'error');
		}
	}

	// modals
	const modals = document.querySelectorAll('.modal');
	M.Modal.init(modals);

	const selects = document.querySelectorAll('select');
	M.FormSelect.init(selects);

	//tooltips
	const tooltippedElems = document.querySelectorAll('.tooltipped');
	M.Tooltip.init(tooltippedElems);

	// Função para abrir o modal de edição
	function openEditModal(user) {
		originalUserData = { ...user }; // Clona os dados originais
		const t = JSON.stringify(originalUserData);

		document.getElementById('actualUsername').value = user.username;
		document.getElementById('editUsername').value = '';
		document.getElementById('editPassword').value = '';
		document.getElementById('editBlocked').value = user.blocked.toString();

		M.updateTextFields(); // Atualiza os labels flutuantes
		M.FormSelect.init(document.querySelectorAll('select'));

		const modal = M.Modal.getInstance(document.getElementById('editUserModal'));
		modal.open();
	}

	// Adiciona evento para submissão do formulário
	document.getElementById('editUserForm').addEventListener('submit', async function (e) {
		e.preventDefault();
		const updatedUser = {};

		const newStatusStr = document.getElementById('editBlocked').value;
		let newStatusBool = null;

		if (newStatusStr === 'true') {
			newStatusBool = true;
		} else if (newStatusStr === 'false') {
			newStatusBool = false;
		}

		if (newStatusBool !== null && newStatusBool !== originalUserData.blocked) {
			updatedUser.blocked = newStatusBool;
		}

		const newUsernameInput = document.getElementById('editUsername');
		const newUsername = newUsernameInput ? newUsernameInput.value.trim() : '';

		if (newUsername !== '' && newUsername !== originalUserData.username) {
			updatedUser.newUsername = newUsername;
		}
		const newPassword = document.getElementById('editPassword');
		if (newPassword.value.trim() !== '') {
			updatedUser.password = newPassword.value.trim();
		}

		// Verifica se houve mudanças reais
		const noChanges = !updatedUser.newUsername && !updatedUser.blocked && !updatedUser.password;

		if (noChanges) {
			M.toast({ html: 'Nenhuma alteração detectada.' });
			const modal = M.Modal.getInstance(document.getElementById('editUserModal'));
			modal.close();
			return;
		}

		await updateUser(originalUserData, updatedUser);
	});
	// reset-users

	let resetInProgress = false; // opcional para evitar clique duplo

	document.getElementById('resetUsersBtn').addEventListener('click', function () {
		const modal = M.Modal.getInstance(document.getElementById('resetUsersModal'));
		modal.open();
	});

	document.getElementById('cancelResetBtn').addEventListener('click', function () {
		resetInProgress = false;
	});

	document.getElementById('confirmResetBtn').addEventListener('click', async function () {
		if (resetInProgress) return; // bloqueia clique duplo
		resetInProgress = true;

		const token = localStorage.getItem('authToken');
		await fetch('/admin/reset-users', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const modal = M.Modal.getInstance(document.getElementById('resetUsersModal'));
		modal.close();
		resetInProgress = false;
		location.reload();
	});

	fetchUsers();
});
