const fs = require('fs');
const path = require('path');
const storage = require('../services/storage');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
const UPLOADS_FILE = 'uploads.json';

exports.uploadAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({error: 'Archivo requerido'});
    }
    const uploads = storage.readJson(UPLOADS_FILE, []);
    // Guarda metadata para descargar con el nombre original y no tener que poner el nombre y extensión.
    uploads.push({
        storedName: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedAt: Date.now()
    });
    storage.writeJson(UPLOADS_FILE, uploads);
    res.status(201).json({
        originalName: req.file.originalname,
        storedName: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
    });
};

// Descarga.
exports.downloadFile = async (req, res) => {
    const safeName = path.basename(req.params.filename);
    const filePath = path.join(uploadsDir, safeName);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({error: 'Archivo no encontrado'});
    }
    const uploads = storage.readJson(UPLOADS_FILE, []);
    const match = uploads.find((item) => item.storedName === safeName);
    const downloadName = match ? match.originalName : safeName;
    res.download(filePath, downloadName);
};
