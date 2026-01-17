const authScreen = document.getElementById('auth-screen');
const chatApp = document.getElementById('chat-app');
const authForm = document.getElementById('auth-form');
const authUsername = document.getElementById('auth-username');
const authPassword = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');
const authSubmit = document.getElementById('auth-submit');
const authTabs = document.querySelectorAll('.auth-tabs .tab');
const currentUser = document.getElementById('current-user');
const logoutButton = document.getElementById('logout-button');

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messages = document.getElementById('messages');
const clearButton = document.getElementById('clear-button');
const typingIndicator = document.getElementById('typing-indicator');

let socket = null;
let authMode = 'login';
let tokenExpiryTimeout = null;

function setAuthMode(mode){
    authMode = mode;
    authTabs.forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
    });
    authSubmit.textContent = mode === 'login' ? 'Ingresar' : 'Crear cuenta';
    showAuthError('');
}

function showAuthError(message){
    authError.textContent = message || '';
}

function showChat(user){
    authScreen.classList.add('hidden');
    chatApp.classList.remove('hidden');
    currentUser.textContent = user?.username || '-';
}

function showAuth(){
    authScreen.classList.remove('hidden');
    chatApp.classList.add('hidden');
}

function saveAuth(token, user){
    localStorage.setItem('chat_token', token);
    localStorage.setItem('chat_user', JSON.stringify(user));
}

function clearAuth(){
    localStorage.removeItem('chat_token');
    localStorage.removeItem('chat_user');
}

function clearTokenExpiry(){
    if (tokenExpiryTimeout){
        clearTimeout(tokenExpiryTimeout);
        tokenExpiryTimeout = null;
    }
}

function decodeTokenPayload(token){
    if (!token){
        return null;
    }
    const parts = token.split('.');
    if (parts.length < 2){
        return null;
    }
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    try{
        return JSON.parse(atob(padded));
    } catch (error){
        return null;
    }
}

function scheduleTokenExpiry(token){
    clearTokenExpiry();
    const payload = decodeTokenPayload(token);
    const exp = payload?.exp ? payload.exp * 1000 : null;
    if (!exp){
        return true;
    }
    const delay = exp - Date.now();
    if (delay <= 0){
        logout('Sesion expirada');
        return false;
    }
    tokenExpiryTimeout = setTimeout(() => {
        logout('Sesion expirada');
    }, delay);
    return true;
}

function setTypingIndicator(isTyping){
    if (!typingIndicator){
        return;
    }
    typingIndicator.classList.toggle('hidden', !isTyping);
}

function formatTime(isoString){
    if (!isoString){
        return '';
    }
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}

function createMessageElement(message){
    const wrapper = document.createElement('article');
    wrapper.className = `message message--${message.role}`;
    wrapper.dataset.id = message.id;
    wrapper.dataset.createdAt = message.createdAt || '';

    const meta = document.createElement('div');
    meta.className = 'message__meta';

    const roleLabel = document.createElement('span');
    roleLabel.textContent = message.role === 'assistant'
        ? message.author || 'ChatGPT'
        : message.author || 'Usuario';

    const timeLabel = document.createElement('span');
    timeLabel.textContent = formatTime(message.createdAt);

    meta.appendChild(roleLabel);
    meta.appendChild(timeLabel);

    const content = document.createElement('p');
    content.className = 'message__content';
    content.textContent = message.content;

    wrapper.appendChild(meta);
    wrapper.appendChild(content);

    if (message.role === 'user'){
        const actions = document.createElement('div');
        actions.className = 'message__actions';

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.dataset.action = 'edit';
        editButton.textContent = 'Editar';

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.dataset.action = 'delete';
        deleteButton.textContent = 'Eliminar';

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        wrapper.appendChild(actions);
    }

    if (message.edited){
        const editedLabel = document.createElement('div');
        editedLabel.className = 'message__edited';
        editedLabel.textContent = 'Editado';
        wrapper.appendChild(editedLabel);
    }

    return wrapper;
}

function appendMessage(message){
    const element = createMessageElement(message);
    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;
}

function updateMessage(message){
    const element = messages.querySelector(`[data-id="${message.id}"]`);
    if (!element){
        return;
    }
    const content = element.querySelector('.message__content');
    if (content){
        content.textContent = message.content;
    }
    if (message.edited && !element.querySelector('.message__edited')){
        const editedLabel = document.createElement('div');
        editedLabel.className = 'message__edited';
        editedLabel.textContent = 'Editado';
        element.appendChild(editedLabel);
    }
}

function removeMessages(ids){
    ids.forEach((id) => {
        const element = messages.querySelector(`[data-id="${id}"]`);
        if (element){
            element.remove();
        }
    });
}

function clearMessages(){
    messages.innerHTML = '';
    setTypingIndicator(false);
}

function disconnectSocket(){
    if (socket){
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
}

function handleSocketAuthError(error){
    let message = 'No se pudo conectar al chat';
    if (error?.message === 'AUTH_REQUIRED'){
        message = 'Debes iniciar sesion para continuar';
    } else if (error?.message === 'AUTH_INVALID'){
        message = 'Sesion invalida o expirada';
    } else if (error?.message === 'AUTH_CONFIG'){
        message = 'Configura JWT_SECRET en el servidor';
    }
    logout(message);
}

function connectSocket(token){
    disconnectSocket();
    socket = io({auth: {token}});

    socket.on('connect_error', handleSocketAuthError);
    socket.on('history', (history) => {
        clearMessages();
        history.forEach(appendMessage);
    });
    socket.on('messageCreated', (message) => {
        appendMessage(message);
        if (message.role === 'assistant'){
            setTypingIndicator(false);
        }
    });
    socket.on('messageUpdated', updateMessage);
    socket.on('messageDeleted', (payload) => {
        const ids = payload?.ids || [];
        if (ids.length){
            removeMessages(ids);
        }
    });
    socket.on('assistantTyping', (payload) => {
        setTypingIndicator(Boolean(payload?.isTyping));
    });
    socket.on('historyCleared', clearMessages);
}

async function requestAuth(mode, username, password){
    const endpoint = mode === 'register' ? 'register' : 'login';
    const response = await fetch(`/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok){
        throw new Error(data.error || 'No se pudo autenticar');
    }
    return data;
}

function logout(message){
    disconnectSocket();
    clearTokenExpiry();
    clearAuth();
    clearMessages();
    setTypingIndicator(false);
    currentUser.textContent = '-';
    showAuth();
    showAuthError(message || '');
}

authTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        setAuthMode(tab.dataset.mode);
    });
});

authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = authUsername.value.trim();
    const password = authPassword.value.trim();
    if (!username || !password){
        showAuthError('Usuario y contrasena son requeridos');
        return;
    }
    try{
        const data = await requestAuth(authMode, username, password);
        saveAuth(data.token, data.user);
        authPassword.value = '';
        if (!scheduleTokenExpiry(data.token)){
            return;
        }
        showChat(data.user);
        connectSocket(data.token);
    } catch (error){
        showAuthError(error.message);
    }
});

logoutButton.addEventListener('click', () => {
    logout('Sesion cerrada');
});

messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const content = messageInput.value.trim();
    if (!content){
        return;
    }
    if (!socket || !socket.connected){
        alert('Debes iniciar sesion para enviar mensajes');
        return;
    }

    socket.emit('sendMessage', {content}, (error) => {
        if (error?.error){
            alert(error.error);
            return;
        }
        messageInput.value = '';
        messageInput.focus();
    });
});

clearButton.addEventListener('click', () => {
    if (!socket || !socket.connected){
        alert('Debes iniciar sesion para borrar el historial');
        return;
    }
    const confirmed = window.confirm('Seguro que deseas borrar todo el historial?');
    if (!confirmed){
        return;
    }
    socket.emit('clearHistory', (error) => {
        if (error?.error){
            alert(error.error);
        }
    });
});

messages.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)){
        return;
    }
    if (!target.matches('[data-action]')){
        return;
    }
    if (!socket || !socket.connected){
        alert('Debes iniciar sesion para modificar mensajes');
        return;
    }

    const messageElement = target.closest('.message');
    if (!messageElement){
        return;
    }

    const messageId = messageElement.dataset.id;
    const action = target.dataset.action;

    if (action === 'edit'){
        const contentElement = messageElement.querySelector('.message__content');
        const currentText = contentElement ? contentElement.textContent : '';
        const nextText = window.prompt('Editar mensaje:', currentText || '');
        if (!nextText || !messageId){
            return;
        }

        socket.emit('editMessage', {id: messageId, content: nextText}, (error) => {
            if (error?.error){
                alert(error.error);
            }
        });
        return;
    }

    if (action === 'delete'){
        if (!messageId){
            return;
        }
        const confirmed = window.confirm('Seguro que deseas eliminar este mensaje?');
        if (!confirmed){
            return;
        }
        socket.emit('deleteMessage', {id: messageId}, (error) => {
            if (error?.error){
                alert(error.error);
            }
        });
    }
});

const storedToken = localStorage.getItem('chat_token');
const storedUser = localStorage.getItem('chat_user');
if (storedToken && storedUser){
    try{
        const user = JSON.parse(storedUser);
        if (scheduleTokenExpiry(storedToken)){
            showChat(user);
            connectSocket(storedToken);
        }
    } catch (error){
        logout('');
    }
} else{
    showAuth();
}

setAuthMode(authMode);
