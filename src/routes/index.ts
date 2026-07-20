import { Router } from 'express';
import authRoutes from './authRoutes';
import articleRoutes from './articleRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);

export default router;
