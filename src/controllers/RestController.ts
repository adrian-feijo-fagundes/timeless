import { RequestHandler } from "express";

export interface RestController {
    list: RequestHandler;
    create: RequestHandler;
    update: RequestHandler;
    delete: RequestHandler;
}