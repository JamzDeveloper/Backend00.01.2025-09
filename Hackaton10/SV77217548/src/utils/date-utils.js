// Quiero tomar la fecha al momento de ingresar el item de la lista.
function parseDdMmYyToDate(fechaStr){
    if (!fechaStr) return new Date();
    // Admite dd/mm/aa o dd/mm/aaaa
    const parts = fechaStr.split('/');
    if (parts.length !== 3) return new Date(fechaStr);
    const [dd, mm, aa] = parts.map((p) => Number(p));
    if (Number.isNaN(dd) || Number.isNaN(mm) || Number.isNaN(aa)){
        return new Date(fechaStr);
    }
    const fullYear = aa < 100 ? 2000 + aa : aa;
    //const date = new Date(Date.UTC(fullYear, mm - 1, dd));
    // Cambio para usar fecha local para evitar desfase por zona horaria
    const date = new Date(fullYear, mm - 1, dd);
    return Number.isNaN(date.getTime()) ? new Date() : date;
}

module.exports = {parseDdMmYyToDate};
