const URLAPI      = 'https://paginas-web-cr.com/Api/apis/';

const consultar    = 'ListaEstudiantes.php';
const consultarId  = 'ListaEstudiantesId.php';
const insertar     = 'InsertarEstudiantes.php';
const actualizar   = 'ActualizarEstudiantes.php';
const eliminar     = 'BorrarEstudiantes.php';

// ── Inicio ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    consultarAPI();

    document.getElementById('formulario')
        .addEventListener('submit', (e) => {
            e.preventDefault();
            insertarEstudiante();
        });

    document.getElementById('btnGuardarEdicion')
        .addEventListener('click', actualizarEstudiante);

    document.getElementById('tablaEstudiante')
        .addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            const id = btn.dataset.id;
            if (btn.dataset.action === 'editar')   editarEstudiante(id);
            if (btn.dataset.action === 'eliminar') eliminarEstudiante(id);
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
    const cuerpo = document.getElementById('tablaEstudiante');
    cuerpo.innerHTML = '';

    datos.forEach(e => {
        cuerpo.innerHTML += `
        <tr>
            <td>${e.id}</td>
            <td>${e.cedula}</td>
            <td>${e.nombre}</td>
            <td>${e.apellidopaterno} ${e.apellidomaterno}</td>
            <td>${e.correoelectronico}</td>
            <td>${e.telefono}</td>
            <td>${e.sexo}</td>
            <td>${e.usuario}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-action="editar"   data-id="${e.id}">Editar</button>
                <button class="btn btn-danger  btn-sm" data-action="eliminar" data-id="${e.id}">Eliminar</button>
            </td>
        </tr>`;
    });
}

// ── CREATE ────────────────────────────────────────────────────────────────────
function insertarEstudiante() {
    const datos = {
        cedula:            document.getElementById('cedula').value,
        nombre:            document.getElementById('nombre').value,
        apellidopaterno:   document.getElementById('apellidopaterno').value,
        apellidomaterno:   document.getElementById('apellidomaterno').value,
        correoelectronico: document.getElementById('correoelectronico').value,
        telefono:          document.getElementById('telefono').value,
        telefonocelular:   document.getElementById('telefonocelular').value,
        fechanacimiento:   document.getElementById('fechanacimiento').value,
        sexo:              document.getElementById('sexo').value,
        direccion:         document.getElementById('direccion').value,
        nacionalidad:      document.getElementById('nacionalidad').value,
        idCarreras:        document.getElementById('idCarreras').value,
        usuario:           document.getElementById('usuario').value,
    };

    fetch(URLAPI + insertar, {
        method: 'POST',
        body: JSON.stringify(datos)
    })
    .then(r => r.json())
    .then(data => {
        console.log(data);
        alert('Estudiante insertado correctamente');
        document.getElementById('formulario').reset();
        consultarAPI();
    })
    .catch(error => console.error(error));
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
function editarEstudiante(id) {
    fetch(URLAPI + consultarId, {
        method: 'POST',
        body: JSON.stringify({ id: id })
    })
    .then(r => r.json())
    .then(data => {
        const e = data.data[0];
        document.getElementById('edit_id').value                = e.id;
        document.getElementById('edit_cedula').value            = e.cedula;
        document.getElementById('edit_nombre').value            = e.nombre;
        document.getElementById('edit_apellidopaterno').value   = e.apellidopaterno;
        document.getElementById('edit_apellidomaterno').value   = e.apellidomaterno;
        document.getElementById('edit_correoelectronico').value = e.correoelectronico;
        document.getElementById('edit_telefono').value          = e.telefono;
        document.getElementById('edit_telefonocelular').value   = e.telefonocelular;
        document.getElementById('edit_fechanacimiento').value   = e.fechanacimiento;
        document.getElementById('edit_sexo').value              = e.sexo;
        document.getElementById('edit_direccion').value         = e.direccion;
        document.getElementById('edit_nacionalidad').value      = e.nacionalidad;
        document.getElementById('edit_idCarreras').value        = e.idCarreras;
        document.getElementById('edit_usuario').value           = e.usuario;
        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
    })
    .catch(error => console.error(error));
}

function actualizarEstudiante() {
    const datos = {
        id:                document.getElementById('edit_id').value,
        cedula:            document.getElementById('edit_cedula').value,
        nombre:            document.getElementById('edit_nombre').value,
        apellidopaterno:   document.getElementById('edit_apellidopaterno').value,
        apellidomaterno:   document.getElementById('edit_apellidomaterno').value,
        correoelectronico: document.getElementById('edit_correoelectronico').value,
        telefono:          document.getElementById('edit_telefono').value,
        telefonocelular:   document.getElementById('edit_telefonocelular').value,
        fechanacimiento:   document.getElementById('edit_fechanacimiento').value,
        sexo:              document.getElementById('edit_sexo').value,
        direccion:         document.getElementById('edit_direccion').value,
        nacionalidad:      document.getElementById('edit_nacionalidad').value,
        idCarreras:        document.getElementById('edit_idCarreras').value,
        usuario:           document.getElementById('edit_usuario').value,
    };

    fetch(URLAPI + actualizar, {
        method: 'POST',
        body: JSON.stringify(datos)
    })
    .then(r => r.json())
    .then(data => {
        console.log(data);
        bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
        alert('Estudiante actualizado correctamente');
        consultarAPI();
    })
    .catch(error => console.error(error));
}

// ── DELETE ────────────────────────────────────────────────────────────────────
function eliminarEstudiante(id) {
    if (!confirm(`¿Eliminar estudiante con ID ${id}?`)) return;

    fetch(URLAPI + eliminar, {
        method: 'POST',
        body: JSON.stringify({ id: id })
    })
    .then(r => r.json())
    .then(data => {
        console.log(data);
        alert('Estudiante eliminado correctamente');
        consultarAPI();
    })
    .catch(error => console.error(error));
}
