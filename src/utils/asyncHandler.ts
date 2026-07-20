import { NextFunction, Request, Response } from 'express';

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Envolve um controller assíncrono para que qualquer rejeição de
 * Promise seja encaminhada ao middleware de erros, evitando
 * try/catch repetido em cada rota.
 */
export function asyncHandler(handler: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}
