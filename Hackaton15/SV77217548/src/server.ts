import app from "./app";
import env from "./config/env";
import connectDB from "./db";

const start = async (): Promise<void> => {
    try {
        if (!env.DATABASE_URL){
            throw new Error("Falta DATABASE_URL en el archivo .env");
        }
        if (!env.SESSION_SECRET){
            throw new Error("Falta SESSION_SECRET en el archivo .env");
        }

        await connectDB(env.DATABASE_URL);

        app.listen(env.PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${env.PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();
