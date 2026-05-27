const URLAPI     = 'https://paginas-web-cr.com/Api/apis/';

const consultar  = 'ListaCurso.php';
const insertar   = 'InsertarCursos.php';
const actualizar = 'ActualizarCursos.php';
const eliminar   = 'BorrarCursos.php';

// ── Inicio ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    consultarAPI();

    document.getElementById('formulario')
        .addEventListener('submit', (e) => {
            e.preventDefault();
            insertarCurso();
        });

    document.getElementById('btnGuardarEdicion')
        .addEventListener('click', actualizarCurso);

    document.getElementById('tablaCurso')
        .addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            const id = btn.dataset.id;
            if (btn.dataset.action === 'editar')   abrirEditar(id);
            if (btn.dataset.action === 'eliminar') eliminarCurso(id);
        });
});

// ── READ ──────────────────────────────────────────────────────────────────────
function consultarAPI() {
    fetch(URLAPI + consultar, { method: 'POST' })
        .then(r => r.json())
        .then(data => dibujarTabla(data.data))
        .catch(error => console.error(error));
}

function dibujarTabla(datos) {
    const cuerpo = document.getElementById('tablaCurso');
    cuerpo.innerHTML = '';

    datos.forEach(c => {
        cuerpo.innerHTML += `
        <tr>
            <td>${c.id}</td>
            <td>${c.nombre}</td>
            <td>${c.descripcion}</td>
            <td>${c.tiempo}</td>
            <td>${c.usuario}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-action="editar"   data-id="${c.id}">Editar</button>
                <button class="btn btn-danger  btn-sm" data-action="eliminar" data-id="${c.id}">Eliminar</button>
            </td>
        </tr>`;
    });
}

// ── CREATE ────────────────────────────────────────────────────────────────────
function insertarCurso() {
    const datos = {
        nombre:      document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        tiempo:      document.getElementById('tiempo').value,
        usuario:     document.getElementById('usuario').value,
    };

    fetch(URLAPI + insertar, {
        method: 'POST',
        body: JSON.stringify(datos)
    })
    .then(r => r.json())
    .then(data => {
        console.log(data);
        alert('Curso insertado correctamente');
        document.getElementById('formulario').reset();
        consultarAPI();
    })
    .catch(error => console.error(error));
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
function abrirEditar(id) {
    fetch(URLAPI + consultar, { method: 'POST' })
        .then(r => r.json())
        .then(data => {
            const c = data.data.find(x => x.id == id);
            if (!c) return;
            document.getElementById('edit_id').value          = c.id;
            document.getElementById('edit_nombre').value      = c.nombre;
            document.getElementById('edit_descripcion').value = c.descripcion;
            document.getElementById('edit_tiempo').value      = c.tiempo;
            document.getElementById('edit_usuario').value     = c.usuario;
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
        })
        .catch(error => console.error(error));
}

function actualizarCurso() {
    const datos = {
        id:          document.getElementById('edit_id').value,
        nombre:      document.getElementById('edit_nombre').value,
        descripcion: document.getElementById('edit_descripcion').value,
        tiempo:      document.getElementById('edit_tiempo').value,
        usuario:     document.getElementById('edit_usuario').value,
    };

    fetch(URLAPI + actualizar, {
        method: 'POST',
        body: JSON.stringify(datos)
    })
    .then(r => r.json())
    .then(data => {
        console.log(data);
        bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
        alert('Curso actualizado correctamente');
        consultarAPI();
    })
    .catch(error => console.error(error));
}

// ── DELETE ────────────────────────────────────────────────────────────────────
function eliminarCurso(id) {
    if (!confirm(`¿Eliminar curso con ID ${id}?`)) return;

    fetch(URLAPI + eliminar, {
        method: 'POST',
        body: JSON.stringify({ id: id })
    })
    .then(r => r.json())
    .then(data => {
        console.log(data);
        alert('Curso eliminado correctamente');
        consultarAPI();
    })
    .catch(error => console.error(error));
}
