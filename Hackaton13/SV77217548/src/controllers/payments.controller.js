const storage = require('../services/storage');

const PAYMENTS_FILE = 'payments.json';

const cryptoRandom = () => {
    return Math.random().toString(36).slice(2)
};

// Respuesta idempotente basada en el header Idempotency-Key.
exports.createPayment = async (req, res) => {
    const key = req.headers['idempotency-key'];
    if (!key){
        return res.status(400).json({error: 'Idempotency-Key requerido'})
    }
    const cachedPayments = storage.readJson(PAYMENTS_FILE, {});
    if (cachedPayments[key]){
        const cached = cachedPayments[key];
        return res.status(cached.status).json(cached.body);
    }
    const result = {paymentId: cryptoRandom(), status: 'ok'};
    const payload = {status: 201, body: result};
    cachedPayments[key] = payload;
    storage.writeJson(PAYMENTS_FILE, cachedPayments);
    res.status(payload.status).json(payload.body);
};
