import { Sequelize } from "sequelize";

import { db } from "./config";

const { database, username, password, dialect } = db();

const sequelize = new Sequelize(database, username, password, {
    dialect,
    define: {
        underscored: true
    }
});

const models = {
    Post: sequelize.import('../../models/userModel')
}

models.sequelize = sequelize;

export default models;