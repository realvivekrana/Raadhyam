import express from 'express';
import verifyToken from '../middlewares/AuthmiddleWare.js';
import isAdmin from '../middlewares/isAdmin.js';
import { 
  getAllUsers, 
  createNewUser, 
  deleteUserById 
} from '../controllers/UserManagementController.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, getAllUsers);
router.post('/', verifyToken, isAdmin, createNewUser);
router.delete('/:id', verifyToken, isAdmin, deleteUserById);

export default router;