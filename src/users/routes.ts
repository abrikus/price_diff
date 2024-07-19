import { Router } from 'express';
import controller from './controller';

const router = Router();

router.get('/getUsers', controller.getUsers);
router.post('/addUser', controller.addUser);
router.delete('/:email', controller.removeUser);

export default router;
