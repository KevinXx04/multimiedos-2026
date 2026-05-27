import Curso from '../models/curso.js'

const URLAPI = 'https://paginas-web-cr.com/Api/apis/'; 

const actualizar = 'ActualizarCursos.php';
const insertar = 'InsertarCursos.php';
const eliminar = 'BorrarCursos.php';
const consultar = 'ListaCurso.php'; // tiene el id tener cuidado



document.addEventListener('DOMContentLoaded', () => {

consultarAPI();

document
    .getElementById('formulario')
    .addEventListener("submit",(evento) => {
        evento.preventDefault();
        insertarCurso();
    });

});



//guardarlo en un json
//hacer la conexion con la api
function consultarAPI(){
    const urlconsulta = URLAPI + consultar;
    
    fetch(urlconsulta, {
        method: 'POST' 
    })
    .then( response => response.json())
    .then(
        data => dibujarTabla(data.data)
    )
    .catch(
        error => console.error()
    )
}//fin del metodo


function dibujarTabla(datos){
    
    const tablaCuerpo = document.getElementById('tablaCurso');
    tablaCuerpo.innerHTML = '';

    datos.forEach(element => {
        let filas = `<tr class="">
                                <td scope="row">${element.id}</td>
                                <td>${element.nombre}</td>
                                <td>${element.descripcion}</td>
                                <td>${element.tiempo}</td>
                                <td>${element.usuario}</td>
                    </tr>`;
        tablaCuerpo.innerHTML += filas;
    });

}//fin del metodo

function insertarCurso(){

    const urlInsertar = URLAPI + insertar;
    const id = 10
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const tiempo = document.getElementById('tiempo').value;
    const usuario = document.getElementById('usuario').value;

    const curso = new Curso(id,nombre, descripcion, tiempo, usuario); 

    alert(curso._nombre +" "+ curso._id);

    console.log(curso.nombre + curso.descripcion + curso.tiempo);
    
    fetch(urlInsertar, {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            data: curso
        }) 
    })
    .then( response => response.json())
    .then(data => {
        console.log(data);
        alert("Insertado correctamente");
    })
    .catch(
        error => console.error()
    )

}//fin del consultar 