import express from "express"
import {getAllMusicNotes } from "../controllers/AdminController.js"

const router = express.Router()

router.get("/music-notes", getAllMusicNotes)
//...


export default router