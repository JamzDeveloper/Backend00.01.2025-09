import "express";

declare module "express-serve-static-core" {
    interface Request {
        auth?: {
            id: string;
            role: string;
        };
    }
}
