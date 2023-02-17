import mongoose from 'mongoose';
import authToken from '../middlewares/auth.js';
import Series from '../models/seriesModel.js';
import Usuario from '../models/userModel.js';

const seriesResolvers = {
    Query: {
        getSerie: async(root, { idSerie }) => {
            return await Series.findById(idSerie);
        },
        getAllSeries: async(root, { userId }, { req, res, next }, info) => {
            //authToken(req, res, next);

            const series = await Series.find({})
            return series;
        },
        getAllseriesUser: async(root, { userId }, { req, res, next }) => {
            //authToken(req, res, next);
            const user = await Usuario.findById(userId).populate('series');
            console.log(`series del user ${user.username}: `, user.series)
            return user.series;
        }
    },
    Mutation: {
        createSerie: async(root, { nombre, autor, estrellas, fechaLanzamiento, image, gender, userId }) => {
            let nuevaSerie = {}
            nuevaSerie.name = nombre;
            const user = await Usuario.findById(userId).populate('series');
            console.log("usuario: ", user)
            const seriesUser = [...user.series, nuevaSerie.name]
            user.series = seriesUser;
            nuevaSerie.name_lower = nombre.toLowerCase();
            nuevaSerie.author = autor;
            nuevaSerie.rating = estrellas;
            nuevaSerie.releaseDate = fechaLanzamiento;
            nuevaSerie.image = image;
            nuevaSerie.gender = gender;
            console.log(`Nueva serie agregada: ${nuevaSerie.name}`);
            await user.save();
            return await Series.create(nuevaSerie);
        },
        // EL CREATE SERIE QUE SEA PARA TODOS LOS USUARIOS Y PARA QUE UN USUARIO AGREGUE UNA SERIE, QUE SE LE DE ELEGIR UN CATALOGO DE SERIES CREADOS POR LOS USUARIOS. 



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
        deleteSerie: async(root, { idSerie }) => { // en un futuro, solo un admin va a poder usarla xd
            let deleteSeries = await Series.findOne({ _id: idSerie });
            console.log(`La serie ${deleteSeries.name} ha sido eliminada`);
            deleteSeries.delete();
            return deleteSeries;
        },
    }
};
export default seriesResolvers;