/* import conectarDB from '../config/db.js';
import Series from '../models/seriesModel.js';


const main = (req, res) => { // Mostrar
    res.json({ msg: "Catálogo de series" });
}

const postSeries = async(req, res) => { // Crear 

    try {
        console.log('este es mi post: ', req.body)
        const nuevaSerie = new Series(req.body);
        const guardarSerie = await nuevaSerie.save();
        res.json(guardarSerie)
    } catch (error) {
        console.log(error)
    }
}

const updateSeries = async(req, res) => {
    try {
        const idSerie = req.params.id;
        console.log();
        console.log('este es el id de la serie: ', idSerie);
        res.json({ message: 'este es el perfil de su serie: ', data: idSerie });
    } catch (error) {
        console.log(error);
    }
}

const deleteSerie = async(req, res, next) => {
    next();
}
export { main, postSeries, updateSeries };
// realizar controllers para generar una creacion, una eliminacion, una actualizacion y mostrar. */