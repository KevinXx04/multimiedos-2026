import apiFetch from './api.js';
const BASE = 'https://paginas-web-cr.com/Api/hotelApi/pago/pago.php';

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
            <td>${p.id_reservacion ?? ''}</td>
            <td>${p.monto ?? ''}</td>
            <td>${p.metodo ?? ''}</td>
            <td>${p.estado ?? ''}</td>
            <td>${p.fecha_pago ?? ''}</td>
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
        id_reservacion: Number(document.getElementById('id_reservacion').value),
        monto:          Number(document.getElementById('monto').value),
        metodo:         document.getElementById('metodo').value,
        detalle:        document.getElementById('detalle').value,
        estado:         document.getElementById('estado').value,
        fecha_pago:     document.getElementById('fecha_pago').value,
        usuario:        document.getElementById('usuario').value,
    };
    apiFetch(BASE, { method: 'POST', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Pago registrado'); document.getElementById('formInsertar').reset(); listar(); })
        .catch(console.error);
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
function abrirEditar(id) {
    apiFetch(BASE + '?id=' + id)
        .then(r => r.json())
        .then(data => {
            const h = data.data ?? data;
            const p = Array.isArray(h) ? h[0] : h;
            document.getElementById('edit_id').value         = p.id;
            document.getElementById('edit_monto').value      = p.monto ?? '';
            document.getElementById('edit_metodo').value     = p.metodo ?? 'Tarjeta';
            document.getElementById('edit_detalle').value    = p.detalle ?? '';
            document.getElementById('edit_estado').value     = p.estado ?? 'Pendiente';
            document.getElementById('edit_fecha_pago').value = p.fecha_pago ?? '';
            document.getElementById('edit_usuario').value    = p.usuario ?? '';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
        })
        .catch(console.error);
}

function actualizar() {
    const datos = {
        id:         Number(document.getElementById('edit_id').value),
        monto:      Number(document.getElementById('edit_monto').value),
        metodo:     document.getElementById('edit_metodo').value,
        detalle:    document.getElementById('edit_detalle').value,
        estado:     document.getElementById('edit_estado').value,
        fecha_pago: document.getElementById('edit_fecha_pago').value,
        usuario:    document.getElementById('edit_usuario').value,
    };
    apiFetch(BASE, { method: 'PUT', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => {
            console.log(data);
            bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
            alert('Pago actualizado');
            listar();
        })
        .catch(console.error);
}

// ── DEACTIVATE ────────────────────────────────────────────────────────────────
function desactivar(id) {
    if (!confirm(`¿Desactivar pago ID ${id}?`)) return;
    apiFetch(BASE, { method: 'DELETE', body: JSON.stringify({ id: Number(id) }) })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Pago desactivado'); listar(); })
        .catch(console.error);
}
