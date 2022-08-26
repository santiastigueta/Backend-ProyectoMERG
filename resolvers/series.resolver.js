import conectarDB from '../config/db.js';
import Series from '../models/seriesModel.js';

const seriesResolvers = {
    Query: {
        getSerie: async(root, { idSerie }) => { //encuentra 1 serie segun el ID
            return await Series.findById(idSerie);
        },
        getAllSeries: async(root) => { // muestra todas las series
            let misSeries = await Series.find({ rating: { $gte: '0' } }); // todas las series tienen un rating greater than or equal a 0. Entonces logro que se muestren todas.
            console.log('series encontradas: ', misSeries);
            return misSeries;
        }
    },
    Mutation: {
        createSerie: async(root, { nombre, autor, estrellas, fechaLanzamiento }) => {
            let nuevaSerie = {}
            nuevaSerie.name = nombre;
            nuevaSerie.author = autor;
            nuevaSerie.rating = estrellas;
            nuevaSerie.releaseDate = fechaLanzamiento;
            console.log(`Nueva serie agregada: ${nuevaSerie.name}`);
            return await Series.create(nuevaSerie);
        },
        updateSerie: async(root, { idSerie, nombre, autor, estrellas, fechaLanzamiento }) => {
            let serieChange = await Series.findById(idSerie);
            serieChange.name = nombre;
            serieChange.author = autor;
            serieChange.rating = estrellas;
            serieChange.releaseDate = fechaLanzamiento;
            console.log(`Se a actualizado ${serieChange} con éxito`);
            return await serieChange.save();
        },
        deleteSerie: async(root, { idSerie }) => {
            let deleteSeries = await Series.findOne({ _id: idSerie });
            console.log(`La serie ${deleteSeries.name} ha sido eliminada`);
            deleteSeries.delete();
            return deleteSeries;
        },
    }
};
export default seriesResolvers;