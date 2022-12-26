const createSerieResolver = async(
    userId,
    nombre,
    autor,
    estrellas,
    fechaLanzamiento,
    image,
    gender
) => {
    const nuevaSerie = {};
    const user = await Usuario.find({ _id: userId });
    console.log("miuser: ", user);
    nuevaSerie.name = nombre;
    nuevaSerie.name_lower = nombre.toLowerCase();
    nuevaSerie.author = autor;
    nuevaSerie.rating = estrellas;
    nuevaSerie.releaseDate = fechaLanzamiento;
    nuevaSerie.image = image;
    nuevaSerie.gender = gender;
    console.log(`Nueva serie agregada: ${nuevaSerie.name}`);
    return await nuevaSerie.create();
};

export default createSerieResolver;