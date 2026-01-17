const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const controller = require('../../controllers/uploads.controller');
const {asyncHandler} = require('../../middlewares');

const uploadsDir = path.join(__dirname, '..', '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, {recursive: true})
}

const imageOnly = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')){
        return cb(new Error('Solo se permiten imagenes'))
    }
    cb(null, true);
};

const upload = multer({
    dest: uploadsDir,
    limits: {fileSize: 2 * 1024 * 1024}, // Límite de 2MB
    fileFilter: imageOnly
});

// Subida de avatar con límite de 2MB y solo imágenes.
router.post('/avatar', upload.single('avatar'), asyncHandler(controller.uploadAvatar));
router.get('/files/:filename', asyncHandler(controller.downloadFile));

module.exports = router;