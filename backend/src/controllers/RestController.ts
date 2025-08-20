import { RequestHandler } from "express";

export interface RestController {
    list: RequestHandler;
    create: RequestHandler;
    // getById: RequestHandler;
    update: RequestHandler;
    delete: RequestHandler;
}