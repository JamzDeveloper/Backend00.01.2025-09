const store = new Map();

export const idempotency = (req, res, next) => {
  const key = req.headers["idempotency-key"];

  if (!key) {
    return res.status(400).json({
      error: "Falta el header Idempotency-Key"
    });
  }

  if (store.has(key)) {
    return res.json(store.get(key));
  }

  res.saveResponse = (data) => {
    store.set(key, data);
  };

  next();
};