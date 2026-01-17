const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');

const ensureDataDir = () => {
    if (!fs.existsSync(dataDir)){
        fs.mkdirSync(dataDir, {recursive: true});
    }
};

// Persistencia en archivos JSON.
const readJson = (fileName, fallback) => {
    ensureDataDir();
    const filePath = path.join(dataDir, fileName);
    if (!fs.existsSync(filePath)){
        return fallback;
    }
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        if (!raw.trim()){
            return fallback;
        }
        return JSON.parse(raw);
    } catch (error){
        return fallback;
    }
};

const writeJson = (fileName, data) => {
    ensureDataDir();
    const filePath = path.join(dataDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const getNextId = (items) => {
    if (!Array.isArray(items) || items.length === 0){
        return 1;
    }
    const maxId = items.reduce((max, item) => {
        const current = Number(item.id);
        if (!Number.isFinite(current)){
            return max;
        }
        return Math.max(max, current);
    }, 0);
    return maxId + 1;
};

module.exports = {readJson, writeJson, getNextId};
