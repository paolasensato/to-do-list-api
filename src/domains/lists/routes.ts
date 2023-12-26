import express from 'express';
import controllers from './controllers';
import authMiddleware from '../../middlewares/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/', controllers.createList);
router.get('/', controllers.getLists);
router.get('/:list_id', controllers.getList);

export default router;