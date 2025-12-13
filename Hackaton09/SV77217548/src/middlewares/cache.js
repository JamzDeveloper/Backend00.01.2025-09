const cache = new Map();
const ttlMs = Number(process.env.COURSES_CACHE_TTL || 30) * 1000;

function cacheCourses(req, res, next){
    const key = req.originalUrl;
    const cached = cache.get(key);
    if (cached && cached.expire > Date.now()){
        return res.json(cached.data);
    }
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        cache.set(key, {data: body, expire: Date.now() + ttlMs});
        return originalJson(body);
    };
    next();
}

function invalidateCoursesCache() {
  cache.clear();
}

module.exports = {cacheCourses, invalidateCoursesCache};
