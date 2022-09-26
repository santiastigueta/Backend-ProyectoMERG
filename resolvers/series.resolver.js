import Series from '../models/seriesModel.js';

const seriesResolvers = {
    Query: {
        getSerie: async(root, { idSerie }) => { //encuentra 1 serie segun el ID
            return await Series.findById(idSerie);
        },
        getSerieBusqueda: async(root) => {
            const seriebusqueda = await Series.find({});
            return seriebusqueda;
        },
        getAllSeries: async(root) => { // muestra todas las series
            let misSeries = await Series.find({});
            /* let misSeries = await Series.find({
                $or: [
                    { rating: { $gte: '9.5' } },
                    { name: "Handmaid's tale" }
                ]
            }); */
            console.log('series encontradas: ', misSeries);
            return misSeries;
        },
        getSerieFilter: async(root, { filter }) => {
            // Filtro por nombre a traves del buscador. 


            const buscarSerieFilter = await Series.find({ name: filter });
            console.log('resultado: ', buscarSerieFilter);
            return buscarSerieFilter;

        }
    },
    Mutation: {
        createSerie: async(root, { nombre, autor, estrellas, fechaLanzamiento, image, gender }) => {
            let nuevaSerie = {}
            nuevaSerie.name = nombre;
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