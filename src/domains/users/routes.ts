import express from 'express';
import controllers from './controllers';

const router = express.Router();

router.post('/', controllers.createUser);
router.post('/login', controllers.login);

export default router;