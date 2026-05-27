import apiFetch from './api.js';
const BASE = 'https://paginas-web-cr.com/Api/hotelApi/habitacion/';

document.addEventListener('DOMContentLoaded', () => {
    listar();

    document.getElementById('formInsertar')
        .addEventListener('submit', (e) => { e.preventDefault(); insertar(); });

    document.getElementById('btnGuardar')
        .addEventListener('click', actualizar);

    document.getElementById('tablaBody')
        .addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            if (btn.dataset.action === 'editar')     abrirEditar(btn.dataset.id);
            if (btn.dataset.action === 'desactivar') desactivar(btn.dataset.id);
        });
});

// ── READ ──────────────────────────────────────────────────────────────────────
function listar() {
    apiFetch(BASE)
        .then(r => r.json())
        .then(data => dibujarTabla(data.data ?? data))
        .catch(console.error);
}

function dibujarTabla(datos) {
    const tbody = document.getElementById('tablaBody');
    tbody.innerHTML = '';
    datos.forEach(h => {
        tbody.innerHTML += `
        <tr>
            <td>${h.id}</td>
            <td>${h.idSede ?? ''}</td>
            <td>${h.numero ?? ''}</td>
            <td>${h.tipo ?? ''}</td>
            <td>${h.precio ?? ''}</td>
            <td>${h.capacidad ?? ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-action="editar"     data-id="${h.id}">Editar</button>
                <button class="btn btn-danger  btn-sm" data-action="desactivar" data-id="${h.id}">Desactivar</button>
            </td>
        </tr>`;
    });
}

// ── CREATE ────────────────────────────────────────────────────────────────────
function insertar() {
    const datos = {
        idSede:      document.getElementById('idSede').value,
        numero:      document.getElementById('numero').value,
        tipo:        document.getElementById('tipo').value,
        precio:      document.getElementById('precio').value,
        capacidad:   document.getElementById('capacidad').value,
        descripcion: document.getElementById('descripcion').value,
    };
    apiFetch(BASE, { method: 'POST', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Habitación creada'); document.getElementById('formInsertar').reset(); listar(); })
        .catch(console.error);
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
function abrirEditar(id) {
    apiFetch(BASE + id)
        .then(r => r.json())
        .then(data => {
            const h = Array.isArray(data.data ?? data) ? (data.data ?? data)[0] : (data.data ?? data);
            document.getElementById('edit_id').value          = h.id;
            document.getElementById('edit_idSede').value      = h.idSede ?? '';
            document.getElementById('edit_numero').value      = h.numero ?? '';
            document.getElementById('edit_tipo').value        = h.tipo ?? '';
            document.getElementById('edit_precio').value      = h.precio ?? '';
            document.getElementById('edit_capacidad').value   = h.capacidad ?? '';
            document.getElementById('edit_descripcion').value = h.descripcion ?? '';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
        })
        .catch(console.error);
}

function actualizar() {
    const id = document.getElementById('edit_id').value;
    const datos = {
        idSede:      document.getElementById('edit_idSede').value,
        numero:      document.getElementById('edit_numero').value,
        tipo:        document.getElementById('edit_tipo').value,
        precio:      document.getElementById('edit_precio').value,
        capacidad:   document.getElementById('edit_capacidad').value,
        descripcion: document.getElementById('edit_descripcion').value,
    };
    apiFetch(BASE + id, { method: 'PUT', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide(); alert('Habitación actualizada'); listar(); })
        .catch(console.error);
}

// ── DEACTIVATE ────────────────────────────────────────────────────────────────
function desactivar(id) {
    if (!confirm(`¿Desactivar habitación ID ${id}?`)) return;
    apiFetch(BASE + id, { method: 'DELETE' })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Habitación desactivada'); listar(); })
        .catch(console.error);
}
