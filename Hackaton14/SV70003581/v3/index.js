import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./src/config/db.js";
import { createApp } from "./src/app.js";

async function bootstrap() {
  await connectDB();

  const { server } = createApp();

  server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}

bootstrap();
