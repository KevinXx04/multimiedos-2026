//class o en un modelo, atributos, metodos
class Curso{
    //Constructor
    constructor(id, nombre, descripcion, tiempo, usuario){
        this._id = id;
        this._nombre = nombre;
        this._descripcion = descripcion;
        this._tiempo = tiempo;
        this._usuario = usuario;
    }

//Get
    get id(){
        return this._id;
    }

    get nombre(){
        return this._nombre;
    }

    get descripcion(){
        return this._descripcion;
    }
    get tiempo(){
        return this._tiempo;
    }
    get usuario(){
        return this._usuario;
    }
//set
    set id(id){
        this._id = id;
    }
    set nombre(nombre){
        this._nombre = nombre;
    }
    set descripcion(descripcion){
        this._descripcion = descripcion;
    }

    set tiempo(tiempo){
        this._tiempo = tiempo;
    }

   
}
export default Curso;