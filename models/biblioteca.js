class Biblioteca {
    constructor(nombre, sede, numero) {
        this.nombre = nombre;
        this.sede = sede;
        this.numero = numero;
    }

    setNombre(nombre) {
        this.nombre = nombre;
    }

    setSede(sede) {
        this.sede = sede;
    }

    setNumero(numero) {
        this.numero = numero;
    }

    getNombre() {
        return this.nombre;
    }

    getSede() {
        return this.sede;
    }

    getNumero() {
        return this.numero;
    }


}

module.exports = Biblioteca;