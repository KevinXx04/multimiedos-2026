import apiFetch from './api.js';
const BASE = 'https://paginas-web-cr.com/Api/hotelApi/cliente/';

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
    datos.forEach(c => {
        tbody.innerHTML += `
        <tr>
            <td>${c.id}</td>
            <td>${c.nombre ?? ''}</td>
            <td>${c.apellido ?? ''}</td>
            <td>${c.cedula ?? ''}</td>
            <td>${c.correo ?? ''}</td>
            <td>${c.telefono ?? ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-action="editar"     data-id="${c.id}">Editar</button>
                <button class="btn btn-danger  btn-sm" data-action="desactivar" data-id="${c.id}">Desactivar</button>
            </td>
        </tr>`;
    });
}

// ── CREATE ────────────────────────────────────────────────────────────────────
function insertar() {
    const datos = {
        nombre:   document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        cedula:   document.getElementById('cedula').value,
        correo:   document.getElementById('correo').value,
        telefono: document.getElementById('telefono').value,
    };
    apiFetch(BASE, { method: 'POST', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Cliente creado'); document.getElementById('formInsertar').reset(); listar(); })
        .catch(console.error);
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
function abrirEditar(id) {
    apiFetch(BASE + id)
        .then(r => r.json())
        .then(data => {
            const c = Array.isArray(data.data ?? data) ? (data.data ?? data)[0] : (data.data ?? data);
            document.getElementById('edit_id').value        = c.id;
            document.getElementById('edit_nombre').value    = c.nombre ?? '';
            document.getElementById('edit_apellido').value  = c.apellido ?? '';
            document.getElementById('edit_cedula').value    = c.cedula ?? '';
            document.getElementById('edit_correo').value    = c.correo ?? '';
            document.getElementById('edit_telefono').value  = c.telefono ?? '';
            document.getElementById('edit_direccion').value = c.direccion ?? '';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
        })
        .catch(console.error);
}

function actualizar() {
    const id = document.getElementById('edit_id').value;
    const datos = {
        nombre:    document.getElementById('edit_nombre').value,
        apellido:  document.getElementById('edit_apellido').value,
        cedula:    document.getElementById('edit_cedula').value,
        correo:    document.getElementById('edit_correo').value,
        telefono:  document.getElementById('edit_telefono').value,
        direccion: document.getElementById('edit_direccion').value,
    };
    apiFetch(BASE + id, { method: 'PUT', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide(); alert('Cliente actualizado'); listar(); })
        .catch(console.error);
}

// ── DEACTIVATE ────────────────────────────────────────────────────────────────
function desactivar(id) {
    if (!confirm(`¿Desactivar cliente ID ${id}?`)) return;
    apiFetch(BASE + id, { method: 'DELETE' })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Cliente desactivado'); listar(); })
        .catch(console.error);
}
