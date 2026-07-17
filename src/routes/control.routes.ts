import { Router } from 'express';
import { postCleaningCommand } from '../controllers/control.controller';

const router = Router();

router.post('/cleaning', postCleaningCommand);

export default router;
