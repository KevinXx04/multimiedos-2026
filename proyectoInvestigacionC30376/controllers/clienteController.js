import apiFetch from './api.js';
const BASE = 'https://paginas-web-cr.com/Api/hotelApi/cliente/cliente.php';

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
        .then(data => {
                        dibujarTabla(data.data ?? data);
        })
        .catch(console.error);
}

function dibujarTabla(datos) {
    const tbody = document.getElementById('tablaBody');
    tbody.innerHTML = '';
    datos.filter(c => String(c.activo) === '1').forEach(c => {
        tbody.innerHTML += `
        <tr>
            <td>${c.id}</td>
            <td>${c.nombre ?? ''}</td>
            <td>${c.apellidos ?? ''}</td>
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
        nombre:    document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        usuario:   document.getElementById('usuario').value,
        activo:    1,
    };
    apiFetch(BASE, { method: 'POST', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { alert('Cliente creado'); document.getElementById('formInsertar').reset(); listar(); })
        .catch(console.error);
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
function abrirEditar(id) {
    apiFetch(BASE + '?id=' + id)
        .then(r => r.json())
        .then(data => {
            const h = data.data ?? data;
            const c = Array.isArray(h) ? h[0] : h;
            document.getElementById('edit_id').value        = c.id;
            document.getElementById('edit_nombre').value    = c.nombre ?? '';
            document.getElementById('edit_apellidos').value = c.apellidos ?? '';
            document.getElementById('edit_usuario').value   = c.usuario ?? '';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
        })
        .catch(console.error);
}

function actualizar() {
    const datos = {
        id:        Number(document.getElementById('edit_id').value),
        nombre:    document.getElementById('edit_nombre').value,
        apellidos: document.getElementById('edit_apellidos').value,
        usuario:   document.getElementById('edit_usuario').value,
    };
    apiFetch(BASE, { method: 'PUT', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => {
            bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
            alert('Cliente actualizado');
            listar();
        })
        .catch(console.error);
}

// ── DEACTIVATE ────────────────────────────────────────────────────────────────
function desactivar(id) {
    if (!confirm(`¿Desactivar cliente ID ${id}?`)) return;
    apiFetch(BASE, { method: 'DELETE', body: JSON.stringify({ id: Number(id) }) })
        .then(r => r.json())
        .then(data => {
                        if (data.code === 200) {
                alert('Cliente desactivado');
                listar();
            } else {
                alert('Error del servidor: ' + (data.message ?? JSON.stringify(data)));
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error de conexión. Verifica que el proxy esté corriendo (node proxy.js).');
        });
}
