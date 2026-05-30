import apiFetch from './api.js';
const BASE = 'https://paginas-web-cr.com/Api/hotelApi/sede/sede.php';

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
            <td>${s.id_hotel ?? ''}</td>
            <td>${s.nombre}</td>
            <td>${s.pais ?? ''}</td>
            <td>${s.ciudad ?? ''}</td>
            <td>${s.direccion ?? ''}</td>
            <td>${s.telefono ?? ''}</td>
            <td>${s.correo ?? ''}</td>
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
        id_hotel:             Number(document.getElementById('id_hotel').value),
        nombre:               document.getElementById('nombre').value,
        pais:                 document.getElementById('pais').value,
        provincia:            document.getElementById('provincia').value,
        ciudad:               document.getElementById('ciudad').value,
        direccion:            document.getElementById('direccion').value,
        telefono:             document.getElementById('telefono').value,
        correo:               document.getElementById('correo').value,
        cantidad_habitaciones: Number(document.getElementById('cantidad_habitaciones').value),
        usuario:              document.getElementById('usuario').value,
    };
    apiFetch(BASE, { method: 'POST', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Sede creada'); document.getElementById('formInsertar').reset(); listar(); })
        .catch(console.error);
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
function abrirEditar(id) {
    apiFetch(BASE + '?id=' + id)
        .then(r => r.json())
        .then(data => {
            const h = data.data ?? data;
            const s = Array.isArray(h) ? h[0] : h;
            document.getElementById('edit_id').value                    = s.id;
            document.getElementById('edit_id_hotel').value              = s.id_hotel ?? '';
            document.getElementById('edit_nombre').value                = s.nombre ?? '';
            document.getElementById('edit_pais').value                  = s.pais ?? '';
            document.getElementById('edit_provincia').value             = s.provincia ?? '';
            document.getElementById('edit_ciudad').value                = s.ciudad ?? '';
            document.getElementById('edit_direccion').value             = s.direccion ?? '';
            document.getElementById('edit_telefono').value              = s.telefono ?? '';
            document.getElementById('edit_correo').value                = s.correo ?? '';
            document.getElementById('edit_cantidad_habitaciones').value = s.cantidad_habitaciones ?? '';
            document.getElementById('edit_usuario').value               = s.usuario ?? '';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
        })
        .catch(console.error);
}

function actualizar() {
    const datos = {
        id:                   Number(document.getElementById('edit_id').value),
        id_hotel:             Number(document.getElementById('edit_id_hotel').value),
        nombre:               document.getElementById('edit_nombre').value,
        pais:                 document.getElementById('edit_pais').value,
        provincia:            document.getElementById('edit_provincia').value,
        ciudad:               document.getElementById('edit_ciudad').value,
        direccion:            document.getElementById('edit_direccion').value,
        telefono:             document.getElementById('edit_telefono').value,
        correo:               document.getElementById('edit_correo').value,
        cantidad_habitaciones: Number(document.getElementById('edit_cantidad_habitaciones').value),
        usuario:              document.getElementById('edit_usuario').value,
    };
    apiFetch(BASE, { method: 'PUT', body: JSON.stringify(datos) })
        .then(r => r.json())
        .then(data => {
            console.log(data);
            bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
            alert('Sede actualizada');
            listar();
        })
        .catch(console.error);
}

// ── DEACTIVATE ────────────────────────────────────────────────────────────────
function desactivar(id) {
    if (!confirm(`¿Desactivar sede ID ${id}?`)) return;
    apiFetch(BASE, { method: 'DELETE', body: JSON.stringify({ id: Number(id) }) })
        .then(r => r.json())
        .then(data => { console.log(data); alert('Sede desactivada'); listar(); })
        .catch(console.error);
}
