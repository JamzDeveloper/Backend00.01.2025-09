export const logger = (req, res, next) => {
  const inicio = Date.now();

  res.on("finish", () => {
    const duracion = Date.now() - inicio;
    console.log(
      `[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${duracion}ms`
    );
  });

  next();
};