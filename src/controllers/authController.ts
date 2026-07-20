import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';
import { UnauthorizedError } from '../utils/AppError';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ user, token });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({ user, token });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const user = await authService.getProfile(req.user.userId);
    res.status(200).json({ user });
  }),
};
