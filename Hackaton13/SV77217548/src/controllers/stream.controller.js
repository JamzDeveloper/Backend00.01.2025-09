exports.streamTicks = async (req, res) => {
    // SSE: envia 5 ticks, uno por segundo.
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    if (typeof res.flushHeaders === 'function') {
        res.flushHeaders()
    }

    let count = 0;
    const interval = setInterval(() => {
        count += 1;
        res.write(`data: tick ${count}\n\n`);
        if (count >= 5){
            clearInterval(interval);
            res.end();
        }
    }, 1000);

    req.on('close', () => {
        clearInterval(interval)
    });
};