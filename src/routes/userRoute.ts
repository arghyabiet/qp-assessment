import express from 'express';
import userController from '../controllers/userController';


const router = express.Router();

router.post('/add', userController.addUser);
router.patch('/update/:id', userController.updateUser);
router.get('/all', userController.getAllUser);
router.delete('/delete/:id', userController.deleteUser);
router.post('/login', userController.loginUser);

export default router;
