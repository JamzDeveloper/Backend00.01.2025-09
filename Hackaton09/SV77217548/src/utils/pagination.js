// Calcula page, pageSize, offset y limit a partir de los query params para paginar listados
function buildPagination(query){
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(query.pageSize, 10) || 10, 1), 100);
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return {page, pageSize, offset, limit};
}

module.exports = {buildPagination};
