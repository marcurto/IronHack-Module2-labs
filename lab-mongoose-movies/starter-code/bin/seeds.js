// // Amb el document seeds, creem els primers documents de la base de dades
// const mongoose = require('mongoose'); // PErmetem usar Mongoose
// const Celebrity = require('../models/celebrity'); // Importem el model Celebrities

// const dbName = 'movies-project'; // Fiquem el nom a la BD
// mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true }); // Conectem a Mongo

// const celebrities = [
//     {
//       name: "Tom Cruise",
//       occupation: "actor",
//       catchPhrase: "Lorem ipsum"

//     },
//     {
//         name: "Beyonce",
//         occupation: "singer",
//         catchPhrase: "Lorem ipsum amet"
//     },
//     {
//         name: "Daffy Duck",
//         occupation: "actor",
//         catchPhrase: "Lorem amet"
//     }
// ]

// Celebrity.create(celebrities, (err) => { // Recorrem l'array que hem creat, i per cada "objecte" creem un document a Mongo o una instància del model
//     if (err) { throw(err) }
//     console.log(`Created ${celebrities.length} celebrities`)
//     mongoose.connection.close();
// }); // Mirem si tot ha anat correcte. Si ha anat bé, ens fa un console indicant quantes n'ha creat. I després tanca la connexió a mongo

// Quan ja tenim el documet seeds.js creat, executem node seeds.js per començar a crear la BD






const mongoose = require('mongoose'); // PErmetem usar Mongoose
const Movie = require('../models/movies'); // Importem el model Celebrities

const dbName = 'movies-project'; // Fiquem el nom a la BD
mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true }); // Conectem a Mongo

const movies = [
    {
      title: "Hunger Games",
      genre: "Action",
      plot: "Lorem ipsum"

    },
    {
        title: "Tenet",
      genre: "Action",
      plot: "Lorem ipsum"
    },
    {
        title: "IronMan",
      genre: "fantasy",
      plot: "Lorem ipsum"
    }
]

Movie.create(movies, (err) => { // Recorrem l'array que hem creat, i per cada "objecte" creem un document a Mongo o una instància del model
    if (err) { throw(err) }
    console.log(`Created ${movies.length} movies`)
    mongoose.connection.close();
});