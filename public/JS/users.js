// users.js - Listagem e deleção de usuários (apenas para admin)

document.addEventListener('DOMContentLoaded', function () {
  const usersTableBody = document.querySelector('#users-table tbody');
  const messageDiv = document.getElementById('message');

  function showMessage(message, type = 'info') {
    messageDiv.innerHTML = `
      <div class="card-panel ${type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue'} lighten-4 ${type === 'error' ? 'red-text' : type === 'success' ? 'green-text' : 'blue-text'} text-darken-2">
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
      const response = await fetch('/users', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        showMessage('Erro ao buscar usuários.', 'error');
        return;
      }
      const users = await response.json();
      renderUsers(users);
    } catch (error) {
      showMessage('Erro ao conectar com a API.', 'error');
    }
  }

  function renderUsers(users) {
    usersTableBody.innerHTML = '';
    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.username}</td>
        <td>${user.role}</td>
        <td>${user.blocked ? 'Bloqueado' : 'Ativo'}</td>
        <td>
          <button class="btn-small red delete-btn" data-email="${user.username}">
            <i class="material-icons">delete</i>
          </button>
        </td>
      `;
      usersTableBody.appendChild(tr);
    });
    // Adiciona eventos de deleção
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async function () {
        const email = this.getAttribute('data-email');
        if (confirm(`Tem certeza que deseja deletar o usuário ${email}?`)) {
          await deleteUser(email);
        }
      });
    });
  }

  async function deleteUser(email) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        showMessage('Usuário não autenticado.', 'error');
        return;
      }
      const response = await fetch('/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: email })
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('Usuário deletado com sucesso!', 'success');
        fetchUsers();
      } else {
        showMessage(data.message || 'Erro ao deletar usuário.', 'error');
      }
    } catch (error) {
      showMessage('Erro ao conectar com a API.', 'error');
    }
  }

  fetchUsers();
});