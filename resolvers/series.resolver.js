import Series from '../models/seriesModel.js';

const seriesResolvers = {
    Query: {
        getSerie: async(root, { idSerie }) => { //encuentra 1 serie segun el ID
            return await Series.findById(idSerie);
        },
        getAllSeries: async(root, args, context, info) => { // muestra todas las series
            let misSeries = await Series.find({});
            return misSeries;
            //getAllSeries es el public Post
        },
        /* getSeriesFilter: async(root, { autor, estrellas, fechaLanzamiento, gender }) => {
            let seriesFilter = await Series.find({
                $or: [
                    { author: autor },
                    { rating: estrellas },
                    { releaseDate: fechaLanzamiento },
                    { gender: gender }
                ]

            })
            console.log("serieFilter: ", seriesFilter)
            return seriesFilter;
        } */
    },
    Mutation: {
        createSerie: async(root, { nombre, autor, estrellas, fechaLanzamiento, image, gender }) => {
            let nuevaSerie = {}
            nuevaSerie.name = nombre;
            nuevaSerie.name_lower = nombre.toLowerCase();
            nuevaSerie.author = autor;
            nuevaSerie.rating = estrellas;
            nuevaSerie.releaseDate = fechaLanzamiento;
            nuevaSerie.image = image;
            nuevaSerie.gender = gender;
            console.log(`Nueva serie agregada: ${nuevaSerie.name}`);
            return await Series.create(nuevaSerie);
        },
        updateSerie: async(root, { idSerie, nombre, autor, estrellas, fechaLanzamiento, image, gender }) => {
            let serieChange = await Series.findById(idSerie);
            serieChange.name = nombre;
            serieChange.name_lower = nombre.toLowerCase();
            serieChange.author = autor;
            serieChange.rating = estrellas;
            serieChange.releaseDate = fechaLanzamiento;
            serieChange.image = image;
            serieChange.gender = gender;
            console.log(`Se a actualizado ${serieChange.name} con éxito`);
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