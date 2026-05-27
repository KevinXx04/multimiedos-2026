import apiFetch from './api.js';
const BASE = 'https://paginas-web-cr.com/Api/hotelApi/reservacion/';

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
    datos.forEach(r => {
        tbody.innerHTML += `
        <tr>
            <td>${r.id}</td>
            <td>${r.idCliente ?? ''}</td>
            <td>${r.idHabitacion ?? ''}</td>
            <td>${r.fechaEntrada ?? ''}</td>
            <td>${r.fechaSalida ?? ''}</td>
            <td>${r.observaciones ?? ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-action="editar"     data-id="${r.id}">Editar</button>
                <button class="btn btn-danger  btn-sm" data-action="desactivar" data-id="${r.id}">Desactivar</button>
            </td>
        </tr>`;
    });
}

// ── CREATE ────────────────────────────────────────────────────────────────────
function insertar() {
    const datos = {
        idCliente:     document.getElementById('idCliente').value,
        idHabitacion:  document.getElementById('idHabitacion').value,
        fechaEntrada:  document.getElementById('fechaEntrada').value,
        fechaSalida:   document.getElementById('fechaSalida').value,
        observaciones: document.getElementById('observaciones').value,
    };
    apiFetch(BASE, { method: 'POST', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Reservación creada'); document.getElementById('formInsertar').reset(); listar(); })
        .catch(console.error);
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
function abrirEditar(id) {
    apiFetch(BASE + id)
        .then(r => r.json())
        .then(data => {
            const r = Array.isArray(data.data ?? data) ? (data.data ?? data)[0] : (data.data ?? data);
            document.getElementById('edit_id').value            = r.id;
            document.getElementById('edit_idCliente').value     = r.idCliente ?? '';
            document.getElementById('edit_idHabitacion').value  = r.idHabitacion ?? '';
            document.getElementById('edit_fechaEntrada').value  = r.fechaEntrada ?? '';
            document.getElementById('edit_fechaSalida').value   = r.fechaSalida ?? '';
            document.getElementById('edit_observaciones').value = r.observaciones ?? '';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
        })
        .catch(console.error);
}

function actualizar() {
    const id = document.getElementById('edit_id').value;
    const datos = {
        idCliente:     document.getElementById('edit_idCliente').value,
        idHabitacion:  document.getElementById('edit_idHabitacion').value,
        fechaEntrada:  document.getElementById('edit_fechaEntrada').value,
        fechaSalida:   document.getElementById('edit_fechaSalida').value,
        observaciones: document.getElementById('edit_observaciones').value,
    };
    apiFetch(BASE + id, { method: 'PUT', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide(); alert('Reservación actualizada'); listar(); })
        .catch(console.error);
}

// ── DEACTIVATE ────────────────────────────────────────────────────────────────
function desactivar(id) {
    if (!confirm(`¿Desactivar reservación ID ${id}?`)) return;
    apiFetch(BASE + id, { method: 'DELETE' })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Reservación desactivada'); listar(); })
        .catch(console.error);
}
