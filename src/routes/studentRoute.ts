import express from "express";
import * as studentController from "../controllers/studentController";
const router = express.Router();

router.get("/", studentController.getStudents);

export default router;
