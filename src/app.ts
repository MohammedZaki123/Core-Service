import express from 'express';
import {routes} from './routes.js';
import {correlationId} from "./common/correlationID/correlationID";
import {errorHandler} from "./common/error/errorHandler";
export function createApp() {
    const app = express();
    app.use(correlationId);
    app.use(express.json());
    app.use('/api', routes);
    app.use(errorHandler)
    return app;
}