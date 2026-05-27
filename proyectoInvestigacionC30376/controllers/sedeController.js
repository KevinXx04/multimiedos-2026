import apiFetch from './api.js';
const BASE = 'https://paginas-web-cr.com/Api/hotelApi/sede/';

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
    datos.forEach(s => {
        tbody.innerHTML += `
        <tr>
            <td>${s.id}</td>
            <td>${s.idHotel ?? ''}</td>
            <td>${s.nombre}</td>
            <td>${s.direccion ?? ''}</td>
            <td>${s.telefono ?? ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-action="editar"     data-id="${s.id}">Editar</button>
                <button class="btn btn-danger  btn-sm" data-action="desactivar" data-id="${s.id}">Desactivar</button>
            </td>
        </tr>`;
    });
}

// ── CREATE ────────────────────────────────────────────────────────────────────
function insertar() {
    const datos = {
        idHotel:   document.getElementById('idHotel').value,
        nombre:    document.getElementById('nombre').value,
        direccion: document.getElementById('direccion').value,
        telefono:  document.getElementById('telefono').value,
    };
    apiFetch(BASE, { method: 'POST', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Sede creada'); document.getElementById('formInsertar').reset(); listar(); })
        .catch(console.error);
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
function abrirEditar(id) {
    apiFetch(BASE + id)
        .then(r => r.json())
        .then(data => {
            const s = Array.isArray(data.data ?? data) ? (data.data ?? data)[0] : (data.data ?? data);
            document.getElementById('edit_id').value        = s.id;
            document.getElementById('edit_idHotel').value   = s.idHotel ?? '';
            document.getElementById('edit_nombre').value    = s.nombre ?? '';
            document.getElementById('edit_direccion').value = s.direccion ?? '';
            document.getElementById('edit_telefono').value  = s.telefono ?? '';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
        })
        .catch(console.error);
}

function actualizar() {
    const id = document.getElementById('edit_id').value;
    const datos = {
        idHotel:   document.getElementById('edit_idHotel').value,
        nombre:    document.getElementById('edit_nombre').value,
        direccion: document.getElementById('edit_direccion').value,
        telefono:  document.getElementById('edit_telefono').value,
    };
    apiFetch(BASE + id, { method: 'PUT', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide(); alert('Sede actualizada'); listar(); })
        .catch(console.error);
}

// ── DEACTIVATE ────────────────────────────────────────────────────────────────
function desactivar(id) {
    if (!confirm(`¿Desactivar sede ID ${id}?`)) return;
    apiFetch(BASE + id, { method: 'DELETE' })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Sede desactivada'); listar(); })
        .catch(console.error);
}
