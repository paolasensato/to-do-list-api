import express from 'express';
import controllers from './controllers';
import authMiddleware from '../../middlewares/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/', controllers.createCategory);
router.get('/', controllers.getCategories);
router.get('/:category_id', controllers.getCategory);

export default router;