// routers/index.ts
import { Router } from 'express';
import employeeRouter from './employees/employee.router';
import masterRouter from './master/master.router';

const router = Router();

router.use('/employees', employeeRouter);
router.use('/master', masterRouter);

export default router;