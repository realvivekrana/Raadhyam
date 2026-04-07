import express from "express";
import {
  getAllMusic,
  getMusicById,
  createMusic,
  deleteMusic
} from "../controllers/MusicController.js";
import verifyToken from "../middlewares/AuthmiddleWare.js";
import isAdmin from "../middlewares/isAdmin.js";
import { validateMusic, validateMusicById } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.get('/', getAllMusic);
router.get('/:id', validateMusicById, getMusicById);
router.post('/', verifyToken, isAdmin, validateMusic, createMusic);
router.delete('/:id', verifyToken, isAdmin, validateMusicById, deleteMusic);

export default router;