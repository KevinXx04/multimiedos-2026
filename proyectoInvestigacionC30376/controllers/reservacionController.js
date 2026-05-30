import apiFetch from './api.js';
const BASE = 'https://paginas-web-cr.com/Api/hotelApi/reservacion/reservacion.php';

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
            <td>${r.id_cliente ?? ''}</td>
            <td>${r.id_habitacion ?? ''}</td>
            <td>${r.fecha_entrada ?? ''}</td>
            <td>${r.fecha_salida ?? ''}</td>
            <td>${r.cantidad_personas ?? ''}</td>
            <td>${r.estado ?? ''}</td>
            <td>${r.total ?? ''}</td>
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
        id_cliente:        Number(document.getElementById('id_cliente').value),
        id_habitacion:     Number(document.getElementById('id_habitacion').value),
        fecha_entrada:     document.getElementById('fecha_entrada').value,
        fecha_salida:      document.getElementById('fecha_salida').value,
        cantidad_personas: Number(document.getElementById('cantidad_personas').value),
        estado:            document.getElementById('estado').value,
        total:             Number(document.getElementById('total').value),
        usuario:           document.getElementById('usuario').value,
    };
    apiFetch(BASE, { method: 'POST', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Reservación creada'); document.getElementById('formInsertar').reset(); listar(); })
        .catch(console.error);
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
function abrirEditar(id) {
    apiFetch(BASE + '?id=' + id)
        .then(r => r.json())
        .then(data => {
            const h = data.data ?? data;
            const r = Array.isArray(h) ? h[0] : h;
            document.getElementById('edit_id').value                = r.id;
            document.getElementById('edit_id_cliente').value        = r.id_cliente ?? '';
            document.getElementById('edit_id_habitacion').value     = r.id_habitacion ?? '';
            document.getElementById('edit_fecha_entrada').value     = r.fecha_entrada ?? '';
            document.getElementById('edit_fecha_salida').value      = r.fecha_salida ?? '';
            document.getElementById('edit_cantidad_personas').value = r.cantidad_personas ?? '';
            document.getElementById('edit_estado').value            = r.estado ?? 'Pendiente';
            document.getElementById('edit_total').value             = r.total ?? '';
            document.getElementById('edit_usuario').value           = r.usuario ?? '';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
        })
        .catch(console.error);
}

function actualizar() {
    const datos = {
        id:                Number(document.getElementById('edit_id').value),
        id_cliente:        Number(document.getElementById('edit_id_cliente').value),
        id_habitacion:     Number(document.getElementById('edit_id_habitacion').value),
        fecha_entrada:     document.getElementById('edit_fecha_entrada').value,
        fecha_salida:      document.getElementById('edit_fecha_salida').value,
        cantidad_personas: Number(document.getElementById('edit_cantidad_personas').value),
        estado:            document.getElementById('edit_estado').value,
        total:             Number(document.getElementById('edit_total').value),
        usuario:           document.getElementById('edit_usuario').value,
    };
    apiFetch(BASE, { method: 'PUT', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => {
            console.log(data);
            bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
            alert('Reservación actualizada');
            listar();
        })
        .catch(console.error);
}

// ── DEACTIVATE ────────────────────────────────────────────────────────────────
function desactivar(id) {
    if (!confirm(`¿Desactivar reservación ID ${id}?`)) return;
    apiFetch(BASE, { method: 'DELETE', body: JSON.stringify({ id: Number(id) }) })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Reservación desactivada'); listar(); })
        .catch(console.error);
}
