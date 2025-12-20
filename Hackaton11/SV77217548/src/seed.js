require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Material = require('./models/material.model');
const Supply = require('./models/supply.model');
const Employee = require('./models/employee.model');

async function run(){
    await connectDB();

    // Limpia colecciones para una seed repetible
    await Promise.all([Material.deleteMany({}), Supply.deleteMany({}), Employee.deleteMany({})]);

    const materials = await Material.insertMany([
        {name: 'Tablon de pino', description: 'Tablon 2m x 30cm', stock: 12, unit: 'tablon'},
        {name: 'Tablon de cedro', description: 'Tablon premium 2m', stock: 6, unit: 'tablon'},
    ]);

    const supplies = await Supply.insertMany([
        {name: 'Goma industrial', description: 'Goma blanca', stockKg: 8, unit: 'kg'},
        {name: 'Goma premium', description: 'Goma premium', stockKg: 4, unit: 'kg'},
    ]);

    const employees = await Employee.insertMany([
        {name: 'Operario 1', role: 'carpintero', availableHours: 40, hourlyRate: 15},
        {name: 'Operario 2', role: 'ensamblador', availableHours: 32, hourlyRate: 13},
    ]);

    console.log('Seed ready:');
    console.log({
        materials: materials.map((m) => ({id: m._id, name: m.name})),
        supplies: supplies.map((s) => ({id: s._id, name: s.name})),
        employees: employees.map((e) => ({id: e._id, name: e.name})),
    });

    await mongoose.connection.close();
    process.exit(0);
}

run().catch((err) => {
    console.error('Seed failed', err);
    process.exit(1);
});
