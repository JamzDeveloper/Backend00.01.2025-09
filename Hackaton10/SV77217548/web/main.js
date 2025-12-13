const el = (id) => document.getElementById(id);

const ui = {
    baseUrl: el('baseUrl'),
    saveBaseUrl: el('saveBaseUrl'),
    sessionInfo: el('sessionInfo'),
    authSection: el('authSection'),
    listsSection: el('listsSection'),
    createSection: el('createSection'),
    detailSection: el('detailSection'),
    editSection: el('editSection'),
    registerForm: el('registerForm'),
    loginForm: el('loginForm'),
    authStatus: el('authStatus'),
    listsContainer: el('listsContainer'),
    listsStatus: el('listsStatus'),
    logout: el('logout'),
    showCreate: el('showCreate'),
    createForm: el('createForm'),
    addItem: el('addItem'),
    itemsContainer: el('itemsContainer'),
    createStatus: el('createStatus'),
    cancelCreate: el('cancelCreate'),
    detailTitle: el('detailTitle'),
    detailEstado: el('detailEstado'),
    itemsList: el('itemsList'),
    detailStatus: el('detailStatus'),
    backToLists: el('backToLists'),
    duplicateList: el('duplicateList'),
    toggleAllDetails: el('toggleAllDetails'),
    deleteList: el('deleteList'),
    showEdit: el('showEdit'),
    editForm: el('editForm'),
    editItemsContainer: el('editItemsContainer'),
    addEditItem: el('addEditItem'),
    editStatus: el('editStatus'),
    cancelEdit: el('cancelEdit'),
};

const state = {
    baseUrl: localStorage.getItem('baseUrl') || 'http://localhost:8080/api',
    token: localStorage.getItem('token') || '',
    email: localStorage.getItem('email') || '',
    listas: [],
    current: null,
    expandAll: false,
};

function setStatus(target, text, isError = false){
    if (!target) return;
    target.textContent = text || '';
    target.style.color = isError ? '#b91c1c' : '#475569';
}

function renderSession(){
    ui.sessionInfo.textContent = state.token ? `Conectado: ${state.email}` : 'Sin sesión';
}

function headers(withJson = true){
    const h = {};
    if (withJson) h['Content-Type'] = 'application/json';
    if (state.token) h.Authorization = `Bearer ${state.token}`;
    return h;
}

async function api(path, opts = {}){
    const res = await fetch(`${state.baseUrl}${path}`, {
        ...opts,
        headers: {...headers(opts.body !== undefined), ...(opts.headers || {})},
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok){
        throw new Error(data.message || `Error ${res.status}`);
    }
    return data;
}

function show(view){
    ['authSection', 'listsSection', 'createSection', 'detailSection', 'editSection'].forEach((id) => {
        ui[id].classList.add('hidden');
    });
    ui[view].classList.remove('hidden');
}

function saveSession(token, email){
    state.token = token;
    state.email = email;
    localStorage.setItem('token', token || '');
    localStorage.setItem('email', email || '');
    renderSession();
}

async function onRegister(e){
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    try{
        setStatus(ui.authStatus, 'Registrando...');
        const {token, data} = await api('/auth/register',{
            method: 'POST',
            body: JSON.stringify({email, password}),
        });
        saveSession(token, data.email);
        setStatus(ui.authStatus, 'Listo');
        await loadListas();
        show('listsSection');
    } catch (err){
        setStatus(ui.authStatus, err.message, true);
    }
}

async function onLogin(e){
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    try{
        setStatus(ui.authStatus, 'Ingresando...');
        const {token, data} = await api('/auth/login',{
            method: 'POST',
            body: JSON.stringify({email, password}),
        });
        saveSession(token, data.email);
        setStatus(ui.authStatus, 'Listo');
        await loadListas();
        show('listsSection');
    } catch (err){
        setStatus(ui.authStatus, err.message, true);
    }
}

function estadoBadge(estado){
    const map = {
        pendiente: {text: 'Pendiente', cls: 'pending'},
        en_proceso: {text: 'En proceso', cls: 'in-process'},
        terminado: {text: 'Terminado', cls: 'done'},
    };
    return map[estado] || {text: estado, cls: ''};
}

function asId(val){
    if (!val) return '';
    if (typeof val === 'object' && '$oid' in val) return val.$oid;
    return String(val);
}

async function loadListas(){
    try{
        setStatus(ui.listsStatus, 'Cargando...');
        const res = await api('/listas', {method: 'GET'});
        state.listas = res.data || [];
        renderListas();
        setStatus(ui.listsStatus, '');
    } catch (err){
        setStatus(ui.listsStatus, err.message, true);
        if (err.message.toLowerCase().includes('token')){
            handleLogout();
        }
    }
}

function renderListas(){
    ui.listsContainer.innerHTML = '';
    if (!state.listas.length){
        ui.listsContainer.innerHTML = '<div class="muted">Sin listas</div>';
        return;
    }
    state.listas.forEach((l) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `<div>${l.titulo}</div>`;
        const badgeInfo = estadoBadge(l.estado);
        const btn = document.createElement('button');
        btn.textContent = 'Abrir';
        btn.onclick = () => selectLista(asId(l._id));
        const badge = document.createElement('span');
        badge.className = `badge ${badgeInfo.cls}`;
        badge.textContent = badgeInfo.text;
        const right = document.createElement('div');
        right.style.display = 'flex';
        right.style.gap = '8px';
        right.append(badge, btn);
        div.appendChild(right);
        ui.listsContainer.appendChild(div);
    });
}

async function selectLista(id){
    try{
        setStatus(ui.detailStatus, 'Cargando...');
        const res = await api(`/listas/${id}`, {method: 'GET'});
        if (!res || !res.data) throw new Error('Respuesta sin datos');
        state.current = res.data;
        renderDetail();
        show('detailSection');
        setStatus(ui.detailStatus, '');
    } catch (err){
        setStatus(ui.detailStatus, err.message, true);
    }
}

function renderDetail(){
    const l = state.current;
    if (!l) return;
    ui.detailTitle.textContent = l.titulo;
    const badgeInfo = estadoBadge(l.estado);
    ui.detailEstado.textContent = badgeInfo.text;
    ui.detailEstado.className = `badge ${badgeInfo.cls}`;
    ui.itemsList.innerHTML = '';
    (l.items || []).forEach((it) => {
        const row = document.createElement('div');
        row.className = 'list-item item-block';

        const header = document.createElement('div');
        header.className = 'item-header';

        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '8px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !!it.esCompletado;
        cb.onchange = () => toggleItem(asId(l._id), asId(it._id), cb.checked);
        const name = document.createElement('div');
        name.textContent = it.nombre;
        left.append(cb, name);

        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.textContent = state.expandAll ? 'Ocultar' : 'Mostrar más';
        toggleBtn.className = 'link-btn';

        const details = document.createElement('div');
        details.className = 'item-details';
        const fechaText = new Date(it.fecha).toLocaleDateString('es-PE');
        details.innerHTML = `<div><strong>Descripción:</strong> ${it.descripcion || ''}</div><div class="muted"><strong>Fecha:</strong> ${fechaText}</div>`;
        details.style.display = state.expandAll ? 'block' : 'none';

        toggleBtn.onclick = () => {
            const visible = details.style.display === 'block';
            details.style.display = visible ? 'none' : 'block';
            toggleBtn.textContent = visible ? 'Mostrar más' : 'Ocultar';
        };

        header.append(left, toggleBtn);
        row.append(header, details);
        ui.itemsList.appendChild(row);
    });
}

async function toggleItem(listaId, itemId, checked){
    try{
        setStatus(ui.detailStatus, 'Actualizando...');
        await api(`/listas/${listaId}/items/${itemId}`,{
            method: 'PATCH',
            body: JSON.stringify({ esCompletado: checked }),
        });
        const detalle = await api(`/listas/${listaId}`, {method: 'GET'});
        if (detalle && detalle.data){
            state.current = detalle.data;
            state.listas = state.listas.map((l) => (asId(l._id) === asId(listaId) ? detalle.data : l));
        }
        renderDetail();
        await loadListas();
        setStatus(ui.detailStatus, 'Lista actualizada correctamente');
    } catch (err){
        setStatus(ui.detailStatus, err.message, true);
    }
}

function formatInputDate(date){
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
}

function addItemRow(){
    const row = document.createElement('div');
    row.className = 'item-row';
    const today = formatInputDate(new Date());
    row.innerHTML = `
        <input type="text" placeholder="Nombre del producto" required />
        <input type="text" placeholder="Descripción" required />
        <input type="text" placeholder="dd/mm/aa" required value="${today}" />
    `;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Quitar';
    remove.className = 'remove';
    remove.onclick = () => row.remove();
    row.appendChild(remove);
    ui.itemsContainer.appendChild(row);
}

function addEditItemRow(item = {}){
    const row = document.createElement('div');
    row.className = 'item-row';
    const today = formatInputDate(new Date());
    const fechaVal = item.fecha ? formatInputDate(new Date(item.fecha)) : today;

    const idInput = document.createElement('input');
    idInput.type = 'hidden';
    idInput.dataset.field = 'id';
    idInput.value = item._id ? asId(item._id) : '';

    const nombre = document.createElement('input');
    nombre.type = 'text';
    nombre.required = true;
    nombre.placeholder = 'Nombre del producto';
    nombre.dataset.field = 'nombre';
    nombre.value = item.nombre || '';

    const descripcion = document.createElement('input');
    descripcion.type = 'text';
    descripcion.required = true;
    descripcion.placeholder = 'Descripcion';
    descripcion.dataset.field = 'descripcion';
    descripcion.value = item.descripcion || '';

    const fecha = document.createElement('input');
    fecha.type = 'text';
    fecha.required = true;
    fecha.placeholder = 'dd/mm/aa';
    fecha.dataset.field = 'fecha';
    fecha.value = fechaVal;

    const statusWrap = document.createElement('div');
    statusWrap.className = 'inline';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.dataset.field = 'esCompletado';
    cb.checked = !!item.esCompletado;
    const lbl = document.createElement('span');
    lbl.className = 'muted';
    lbl.textContent = 'Completado';
    statusWrap.append(cb, lbl);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Quitar';
    remove.className = 'remove';
    remove.onclick = () => row.remove();

    row.append(idInput, nombre, descripcion, fecha, statusWrap, remove);
    ui.editItemsContainer.appendChild(row);
}

function getItemsFromForm(){
    const rows = Array.from(ui.itemsContainer.querySelectorAll('.item-row'));
    const items = [];
    rows.forEach((row) => {
        const [nombre, descripcion, fecha] = row.querySelectorAll('input');
        if (!nombre.value.trim() || !descripcion.value.trim() || !fecha.value.trim()){
            throw new Error('Todos los productos necesitan nombre, descripción y fecha');
        }
        items.push({
            nombre: nombre.value.trim(),
            descripcion: descripcion.value.trim(),
            fecha: fecha.value.trim(),
        });
    });
    if (!items.length) throw new Error('Agrega al menos un producto');
    return items;
}

function getItemsFromEdit(){
    const rows = Array.from(ui.editItemsContainer.querySelectorAll('.item-row'));
    const items = [];
    rows.forEach((row) => {
        const nombre = row.querySelector('input[data-field="nombre"]');
        const descripcion = row.querySelector('input[data-field="descripcion"]');
        const fecha = row.querySelector('input[data-field="fecha"]');
        const cb = row.querySelector('input[data-field="esCompletado"]');
        const idInput = row.querySelector('input[data-field="id"]');
        if (!nombre || !descripcion || !fecha || !cb) throw new Error('Formulario incompleto');
        if (!nombre.value.trim() || !descripcion.value.trim() || !fecha.value.trim()){
            throw new Error('Todos los productos necesitan nombre, descripcion y fecha');
        }
        items.push({
            _id: idInput?.value ? idInput.value : undefined,
            nombre: nombre.value.trim(),
            descripcion: descripcion.value.trim(),
            fecha: fecha.value.trim(),
            esCompletado: cb.checked,
        });
    });
    if (!items.length) throw new Error('Agrega al menos un producto');
    return items;
}

async function onCreate(e){
    e.preventDefault();
    const titulo = e.target.titulo.value.trim();
    try{
        const items = getItemsFromForm();
        setStatus(ui.createStatus, 'Creando...');
        const res = await api('/listas',{
            method: 'POST',
            body: JSON.stringify({ titulo, items }),
        });
        if (!res || !res.data) throw new Error('Respuesta sin datos');
        state.listas = [res.data, ...state.listas];
        renderListas();
        setStatus(ui.createStatus, 'Lista creada');
        e.target.reset();
        ui.itemsContainer.innerHTML = '';
        addItemRow();
        show('listsSection');
    } catch (err){
        setStatus(ui.createStatus, err.message, true);
    }
}

async function onDuplicate(){
    if (!state.current) return;
    try{
        setStatus(ui.detailStatus, 'Duplicando...');
        const res = await api(`/listas/${asId(state.current._id)}/duplicar`, {method: 'POST'});
        if (!res || !res.data) throw new Error('Respuesta sin datos');
        state.listas = [res.data, ...state.listas];
        renderListas();
        setStatus(ui.detailStatus, 'Lista duplicada');
    } catch (err){
        setStatus(ui.detailStatus, err.message, true);
    }
}

async function onEditSubmit(e){
    e.preventDefault();
    if (!state.current) return;
    const titulo = e.target.titulo.value.trim();
    try{
        const items = getItemsFromEdit();
        setStatus(ui.editStatus, 'Guardando cambios...');
        const res = await api(`/listas/${asId(state.current._id)}`,{
            method: 'PATCH',
            body: JSON.stringify({ titulo, items }),
        });
        if (!res || !res.data) throw new Error('Respuesta sin datos');
        state.current = res.data;
        state.listas = state.listas.map((l) => (asId(l._id) === asId(res.data._id) ? res.data : l));
        renderListas();
        renderDetail();
        show('detailSection');
        setStatus(ui.editStatus, 'Cambios guardados');
    } catch (err){
        setStatus(ui.editStatus, err.message, true);
    }
}

async function onDeleteList(){
    if (!state.current) return;
    const ok = window.confirm('¿Eliminar esta lista? Se marcará como eliminada.');
    if (!ok) return;
    try{
        setStatus(ui.detailStatus, 'Eliminando...');
        await api(`/listas/${asId(state.current._id)}`,{method: 'DELETE'});
        const deletedId = asId(state.current._id);
        state.listas = state.listas.filter((l) => asId(l._id) !== deletedId);
        state.current = null;
        renderListas();
        show('listsSection');
        setStatus(ui.detailStatus, '');
    } catch (err){
        if ((err.message || '').toLowerCase().includes('no encontrada')){
            const deletedId = asId(state.current?._id);
            state.listas = state.listas.filter((l) => asId(l._id) !== deletedId);
            state.current = null;
            renderListas();
            show('listsSection');
            setStatus(ui.detailStatus, '');
        } else{
            setStatus(ui.detailStatus, err.message, true);
        }
    }
}

function openEdit(){
    if (!state.current){
        setStatus(ui.detailStatus, 'No hay lista seleccionada', true);
        return;
    }
    ui.editForm.titulo.value = state.current.titulo;
    ui.editItemsContainer.innerHTML = '';
    (state.current.items || []).forEach((it) => addEditItemRow(it));
    if (!state.current.items || state.current.items.length === 0){
        addEditItemRow();
    }
    setStatus(ui.editStatus, '');
    show('editSection');
}

function handleLogout(){
    saveSession('', '');
    state.listas = [];
    state.current = null;
    ui.itemsList.innerHTML = '';
    show('authSection');
}

function initBaseUrl() {
    ui.baseUrl.value = state.baseUrl;
    ui.saveBaseUrl.onclick = () => {
        const val = ui.baseUrl.value.trim();
        if (val) {
            state.baseUrl = val;
            localStorage.setItem('baseUrl', val);
            setStatus(ui.authStatus, `API: ${val}`);
        }
    };
}

function init() {
    renderSession();
    initBaseUrl();
    ui.registerForm.addEventListener('submit', onRegister);
    ui.loginForm.addEventListener('submit', onLogin);
    ui.logout.addEventListener('click', handleLogout);
    ui.showCreate.addEventListener('click', () => show('createSection'));
    ui.cancelCreate.addEventListener('click', () => show('listsSection'));
    ui.addItem.addEventListener('click', addItemRow);
    ui.createForm.addEventListener('submit', onCreate);
    ui.backToLists.addEventListener('click', () => show('listsSection'));
    ui.duplicateList.addEventListener('click', onDuplicate);
    ui.toggleAllDetails.addEventListener('click', () => {
        state.expandAll = !state.expandAll;
        ui.toggleAllDetails.textContent = state.expandAll ? 'Ocultar todos' : 'Mostrar todos';
        renderDetail();
    });
    ui.deleteList.addEventListener('click', onDeleteList);
    ui.showEdit.addEventListener('click', openEdit);
    ui.addEditItem.addEventListener('click', () => addEditItemRow());
    ui.editForm.addEventListener('submit', onEditSubmit);
    ui.cancelEdit.addEventListener('click', () => show('detailSection'));

    addItemRow();

    if (state.token){
        loadListas().then(() => show('listsSection')).catch(() => show('authSection'));
    } else{
        show('authSection');
    }
}

init();
