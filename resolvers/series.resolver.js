import Series from '../models/seriesModel.js';
const seriesResolvers = {
    Query: {
        getSerie: async(root, { idSerie }) => {
            return await Series.findById(idSerie);
        },
        getAllSeries: async(root, { idSerie }) => {
            return await Series.findById(idSerie);
        },
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
        // updateSerie va a ser modificado en base a la interfaz de usuario
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
            deleteSeries.delete()
            return deleteSeries;
        },
    }
};
export default seriesResolvers;