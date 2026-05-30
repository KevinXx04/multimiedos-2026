import apiFetch from './api.js';
const BASE = 'https://paginas-web-cr.com/Api/hotelApi/hotel/hotel.php';

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
            <td>${h.nombre}</td>
            <td>${h.descripcion ?? ''}</td>
            <td>${h.telefono ?? ''}</td>
            <td>${h.correo ?? ''}</td>
            <td>${h.sitio_web ? `<a href="${h.sitio_web}" target="_blank">${h.sitio_web}</a>` : ''}</td>
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
        nombre:      document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        telefono:    document.getElementById('telefono').value,
        correo:      document.getElementById('correo').value,
        sitio_web:   document.getElementById('sitio_web').value,
        usuario:     document.getElementById('usuario').value,
    };
    apiFetch(BASE, { method: 'POST', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Hotel creado'); document.getElementById('formInsertar').reset(); listar(); })
        .catch(console.error);
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
function abrirEditar(id) {
    apiFetch(BASE + '?id=' + id)
        .then(r => r.json())
        .then(data => {
            const h = data.data ?? data;
            const item = Array.isArray(h) ? h[0] : h;
            document.getElementById('edit_id').value          = item.id;
            document.getElementById('edit_nombre').value      = item.nombre ?? '';
            document.getElementById('edit_descripcion').value = item.descripcion ?? '';
            document.getElementById('edit_telefono').value    = item.telefono ?? '';
            document.getElementById('edit_correo').value      = item.correo ?? '';
            document.getElementById('edit_sitio_web').value   = item.sitio_web ?? '';
            document.getElementById('edit_usuario').value     = item.usuario ?? '';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
        })
        .catch(console.error);
}

function actualizar() {
    const datos = {
        id:          Number(document.getElementById('edit_id').value),
        nombre:      document.getElementById('edit_nombre').value,
        descripcion: document.getElementById('edit_descripcion').value,
        telefono:    document.getElementById('edit_telefono').value,
        correo:      document.getElementById('edit_correo').value,
        sitio_web:   document.getElementById('edit_sitio_web').value,
        usuario:     document.getElementById('edit_usuario').value,
    };
    apiFetch(BASE, { method: 'PUT', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => {
            console.log(data);
            bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
            alert('Hotel actualizado');
            listar();
        })
        .catch(console.error);
}

// ── DEACTIVATE ────────────────────────────────────────────────────────────────
function desactivar(id) {
    if (!confirm(`¿Desactivar hotel ID ${id}?`)) return;
    apiFetch(BASE, { method: 'DELETE', body: JSON.stringify({ id: Number(id) }) })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Hotel desactivado'); listar(); })
        .catch(console.error);
}
