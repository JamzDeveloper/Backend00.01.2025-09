const {Sequelize} = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'postgres';

const common = {
    dialect,
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
};

// Casos para cuando utilice sqlite o postgresql
const sequelize =
    dialect === 'sqlite'
        ? new Sequelize({
            dialect: 'sqlite',
            storage: process.env.DB_STORAGE || ':memory:',
            logging: common.logging,
        })
        : new Sequelize(
            process.env.DB_DATABASE,
            process.env.DB_USERNAME,
            process.env.DB_PASSWORD,
            {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            ...common,
            }
        );

module.exports = sequelize;
