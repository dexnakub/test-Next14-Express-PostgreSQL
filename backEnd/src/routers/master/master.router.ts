import { Router } from 'express';
import { createTambon, createAmphur, createProvince, getTambon, getAmphur, getProvince, getGender} from '../../controllers/master.controller';

const router = Router();

router.post('/createTambon', createTambon);
router.post('/createAmphur', createAmphur);
router.post('/createProvince', createProvince);

router.get('/getGender', getGender);
router.get('/getTambon', getTambon);
router.get('/getAmphur', getAmphur);
router.get('/getProvince', getProvince);

export default router;
