require('dotenv').config();

const common = {
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
};

module.exports = {
    development:
        common.dialect === 'sqlite'
            ? {
            ...common,
            storage: process.env.DB_STORAGE || ':memory:',
            }
            : {
                ...common,
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT) || 5432,
                database: process.env.DB_DATABASE || 'hackaton09',
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
            },
    test: {},
    production: {},
};
