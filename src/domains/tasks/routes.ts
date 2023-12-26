import express from 'express';
import controllers from './controllers';
import authMiddleware from '../../middlewares/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/', controllers.createTask);
router.get('/', controllers.getTasks);

export default router;