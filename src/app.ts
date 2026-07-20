import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

export function createApp(): Application {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve as imagens de banner de forma estática
  app.use(`/${env.uploads.dir}`, express.static(path.resolve(process.cwd(), env.uploads.dir)));

  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
