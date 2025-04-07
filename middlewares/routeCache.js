const NodeCache = require('node-cache');

const cache = new NodeCache();

// Clear all cache keys for a specific user
const clearUserCache = (userId) => {
    const keys = cache.keys()
    const userKeys = keys.filter(key => key.startsWith(`${userId}:`));
    
    cache.del(userKeys);

    console.log(`Cleared cache for user ${userId}:`, userKeys);
};

module.exports = {
    cache: (duration) => (req, res, next)=>{
        // is req a get
        // if not call next
        if(req.method!== 'GET') return next();
        // generate cache key
        const userId = req.user?.sub || 'anonymous';
        const cacheKey = `${userId}:${req.originalUrl}`;
        // check cache
        const cachedData = cache.get(cacheKey);
        if(cachedData) {
            console.log(`Cache hit for ${cacheKey}`)
            res.send(cachedData);
            return;
        }else{
            console.log(`Cache miss for ${cacheKey}`)
            // if not cache, call next
            res.originalSend = res.send;
            res.send = body => {
                res.originalSend(body);
                cache.set(cacheKey, body, duration);
            }
        }
        next();
    },
    clearUserCache
} 
    