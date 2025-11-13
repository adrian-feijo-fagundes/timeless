import { RequestHandler } from "express";

export interface IController {
    list: RequestHandler;
    create: RequestHandler;
    update: RequestHandler;
    delete: RequestHandler;
}