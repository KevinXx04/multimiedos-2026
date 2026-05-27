import apiFetch from './api.js';
const BASE = 'https://paginas-web-cr.com/Api/hotelApi/pago/';

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
    datos.forEach(p => {
        tbody.innerHTML += `
        <tr>
            <td>${p.id}</td>
            <td>${p.idReservacion ?? ''}</td>
            <td>${p.monto ?? ''}</td>
            <td>${p.metodoPago ?? ''}</td>
            <td>${p.fechaPago ?? ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-action="editar"     data-id="${p.id}">Editar</button>
                <button class="btn btn-danger  btn-sm" data-action="desactivar" data-id="${p.id}">Desactivar</button>
            </td>
        </tr>`;
    });
}

// ── CREATE ────────────────────────────────────────────────────────────────────
function insertar() {
    const datos = {
        idReservacion: document.getElementById('idReservacion').value,
        monto:         document.getElementById('monto').value,
        metodoPago:    document.getElementById('metodoPago').value,
        fechaPago:     document.getElementById('fechaPago').value,
        observaciones: document.getElementById('observaciones').value,
    };
    apiFetch(BASE, { method: 'POST', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Pago registrado'); document.getElementById('formInsertar').reset(); listar(); })
        .catch(console.error);
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
function abrirEditar(id) {
    apiFetch(BASE + id)
        .then(r => r.json())
        .then(data => {
            const p = Array.isArray(data.data ?? data) ? (data.data ?? data)[0] : (data.data ?? data);
            document.getElementById('edit_id').value            = p.id;
            document.getElementById('edit_idReservacion').value = p.idReservacion ?? '';
            document.getElementById('edit_monto').value         = p.monto ?? '';
            document.getElementById('edit_metodoPago').value    = p.metodoPago ?? '';
            document.getElementById('edit_fechaPago').value     = p.fechaPago ?? '';
            document.getElementById('edit_observaciones').value = p.observaciones ?? '';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
        })
        .catch(console.error);
}

function actualizar() {
    const id = document.getElementById('edit_id').value;
    const datos = {
        idReservacion: document.getElementById('edit_idReservacion').value,
        monto:         document.getElementById('edit_monto').value,
        metodoPago:    document.getElementById('edit_metodoPago').value,
        fechaPago:     document.getElementById('edit_fechaPago').value,
        observaciones: document.getElementById('edit_observaciones').value,
    };
    apiFetch(BASE + id, { method: 'PUT', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide(); alert('Pago actualizado'); listar(); })
        .catch(console.error);
}

// ── DEACTIVATE ────────────────────────────────────────────────────────────────
function desactivar(id) {
    if (!confirm(`¿Desactivar pago ID ${id}?`)) return;
    apiFetch(BASE + id, { method: 'DELETE' })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Pago desactivado'); listar(); })
        .catch(console.error);
}
