import mongoose from "mongoose";

const conectarDB = async() => {
    const MONGO_URI = process.env.MONGO_URI
    try {
        const db = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        const url = `${db.connection.host}, ${db.connection.port}`;
        console.log(`Mongoose conectado en: ${url} con la base de datos de ${db.connection.name}`);


    } catch (error) {
        console.log(`error: ${error}`);
        process.exit(1);
    }
}

export default conectarDB;