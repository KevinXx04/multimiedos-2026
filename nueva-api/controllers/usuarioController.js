const URLAPI       = 'https://paginas-web-cr.com/Api/apis/';

const consultar    = 'ListaUsuarios.php';
const insertar     = 'InsertarUsuarios.php';
const actualizar   = 'ActualizarUsuarios.php';
const sendPassword = 'SendPassword.php';
const sendEmail    = 'sendEmail.php';

// ── Inicio ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    consultarAPI();

    document.getElementById('formulario')
        .addEventListener('submit', (e) => {
            e.preventDefault();
            insertarUsuario();
        });

    document.getElementById('btnGuardarEdicion')
        .addEventListener('click', actualizarUsuario);

    document.getElementById('btnEnviarEmail')
        .addEventListener('click', enviarEmail);

    // Delegación de eventos en la tabla
    document.getElementById('tablaUsuario')
        .addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            const id    = btn.dataset.id;
            const email = btn.dataset.email;
            if (btn.dataset.action === 'editar')          abrirEditar(id);
            if (btn.dataset.action === 'send-password')   enviarContrasena(email);
            if (btn.dataset.action === 'send-email')      abrirSendEmail(email);
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
    const cuerpo = document.getElementById('tablaUsuario');
    cuerpo.innerHTML = '';

    datos.forEach(u => {
        cuerpo.innerHTML += `
        <tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>••••••••</td>
            <td>
                <button class="btn btn-warning btn-sm"  data-action="editar"        data-id="${u.id}"    data-email="${u.email}">Editar</button>
                <button class="btn btn-info    btn-sm"  data-action="send-password" data-id="${u.id}"    data-email="${u.email}">Enviar contraseña</button>
                <button class="btn btn-secondary btn-sm" data-action="send-email"   data-id="${u.id}"    data-email="${u.email}">Enviar email</button>
            </td>
        </tr>`;
    });
}

// ── CREATE ────────────────────────────────────────────────────────────────────
function insertarUsuario() {
    const datos = {
        name:     document.getElementById('name').value,
        email:    document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    fetch(URLAPI + insertar, {
        method: 'POST',
        body: JSON.stringify(datos)
    })
    .then(r => r.json())
    .then(data => {
        console.log(data);
        alert('Usuario insertado correctamente');
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
            const u = data.data.find(x => x.id == id);
            if (!u) return;
            document.getElementById('edit_id').value       = u.id;
            document.getElementById('edit_name').value     = u.name;
            document.getElementById('edit_email').value    = u.email;
            document.getElementById('edit_password').value = '';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
        })
        .catch(error => console.error(error));
}

function actualizarUsuario() {
    const datos = {
        id:       document.getElementById('edit_id').value,
        name:     document.getElementById('edit_name').value,
        password: document.getElementById('edit_password').value,
    };

    fetch(URLAPI + actualizar, {
        method: 'POST',
        body: JSON.stringify(datos)
    })
    .then(r => r.json())
    .then(data => {
        console.log(data);
        bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
        alert('Usuario actualizado correctamente');
        consultarAPI();
    })
    .catch(error => console.error(error));
}

// ── SEND PASSWORD ─────────────────────────────────────────────────────────────
function enviarContrasena(email) {
    if (!confirm(`¿Enviar contraseña al correo ${email}?`)) return;

    fetch(URLAPI + sendPassword, {
        method: 'POST',
        body: JSON.stringify({ email })
    })
    .then(r => r.json())
    .then(data => {
        console.log(data);
        alert(`Contraseña enviada a ${email}`);
    })
    .catch(error => console.error(error));
}

// ── SEND EMAIL ────────────────────────────────────────────────────────────────
function abrirSendEmail(email) {
    document.getElementById('mail_email').value = email;
    document.getElementById('mail_title').value = '';
    document.getElementById('mail_text').value  = '';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEmail')).show();
}

function enviarEmail() {
    const datos = {
        email: document.getElementById('mail_email').value,
        title: document.getElementById('mail_title').value,
        text:  document.getElementById('mail_text').value,
    };

    fetch(URLAPI + sendEmail, {
        method: 'POST',
        body: JSON.stringify(datos)
    })
    .then(r => r.json())
    .then(data => {
        console.log(data);
        bootstrap.Modal.getInstance(document.getElementById('modalEmail')).hide();
        alert(`Email enviado a ${datos.email}`);
    })
    .catch(error => console.error(error));
}
