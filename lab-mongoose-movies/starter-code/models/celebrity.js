const mongoose = require('mongoose'); // Permet usar Mongoose en aquest fitxer
const Schema = mongoose.Schema; // Importem l'objecte esquema de Mongoose (el que fa que tingui un format semblant a JSON)

const celebrityschema = new Schema({ // Creo el motlle de celebrity per tal de definir com organitzarem tots els documents d'un model (que tinguin la mateixa aparença)
    name: {type: String},
    occupation: {type: String},
    catchPhrase: {type: String}
});

const Celebrity = mongoose.model('Celebrity', celebrityschema); // Asigno l'esquema a una col·leció concreta. És a dir, tots els document que cree dins d'aquesta col·lecció seguiran l'esquem assignat

module.exports = Celebrity; // Exporto el model Celebrity (model=col·lecció)