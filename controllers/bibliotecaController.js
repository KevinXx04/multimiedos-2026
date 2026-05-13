const Biblioteca = require('../models/biblioteca.js');
const BibliotecaDAO = require('../dao/bibliotecaDAO.js');

const dao = new BibliotecaDAO();

console.log("funca");

dao.insertar(new Biblioteca("Central", "Norte", 1));
console.log(dao.consultarID(1));