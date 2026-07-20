import { Router } from 'express';
import { articleController } from '../controllers/articleController';
import { requireAuth } from '../middlewares/authMiddleware';
import { uploadBannerImage } from '../middlewares/uploadMiddleware';

const router = Router();

// Rotas públicas - qualquer visitante pode ler os artigos
router.get('/', articleController.list);
router.get('/:id', articleController.getById);

// Rotas protegidas - exigem usuário autenticado
router.post('/', requireAuth, uploadBannerImage.single('bannerImage'), articleController.create);
router.put('/:id', requireAuth, uploadBannerImage.single('bannerImage'), articleController.update);
router.delete('/:id', requireAuth, articleController.delete);

export default router;
