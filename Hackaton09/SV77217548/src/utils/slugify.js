const slugify = (str) =>        // Normaliza convirtiendo un texto en un slug
    str
        .normalize('NFD')                 // Descompone los caracteres Unicode en (forma_base + tildes)
        .replace(/[\u0300-\u036f]/g, '')  // Elimina las tildes
        .toLowerCase()                    // Pasa todo a minúsculas
        .replace(/[^a-z0-9]+/g, '-')      // Reemplaza caracteres no alfanuméricos por un guión
        .replace(/^-+|-+$/g, '')          // Quita guiones al inicio y final del string
        .replace(/-{2,}/g, '-');          // Comprime guiones repetidos en uno solo

module.exports = {slugify};
