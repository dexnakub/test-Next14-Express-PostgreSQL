import { Router } from 'express';
import { getEmployeesAll, getEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployeesById } from '../../controllers/employee.controller';

const router = Router();

router.get('/getEmployeesAll', getEmployeesAll);
router.post('/getEmployees', getEmployees);
router.get('/getEmployeeById/:id', getEmployeesById);
router.post('/createEmployee', createEmployee);
router.patch('/updateEmployee/:id', updateEmployee);
router.delete('/deleteEmployee/:id', deleteEmployee);

export default router;
