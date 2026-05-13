class BibliotecaDAO {
    constructor() {
        this.arregloBibliotecas = [];
    }

    consultar() {
        return this.arregloBibliotecas;
    }

    consultarID(id) {
        return this.arregloBibliotecas.find(b => b.getNumero() === id);
    }

    insertar(biblioteca) {
        this.arregloBibliotecas.push(biblioteca);
    }

    actualizar(id, nuevaBiblioteca ) {
        this.arregloBibliotecas.push(nuevaBiblioteca);
        let elementosbiblioteca = this.consultarID(id);
        if (elementosbiblioteca) {
            elementosbiblioteca.setNombre(nuevaBiblioteca.getNombre());
            elementosbiblioteca.setSede(nuevaBiblioteca.getSede());
            elementosbiblioteca.setNumero(nuevaBiblioteca.getNumero());
        }
    }


    eliminar(id) {
      let elementosbiblioteca = this.consultarID(id);
        if (elementosbiblioteca) {
            this.arregloBibliotecas.filter(b => b.getNumero() !== id);

        }
    } 
    

}

module.exports = BibliotecaDAO;

