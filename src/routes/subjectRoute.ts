import express from "express";
import * as subjectController from "../controllers/subjectController";

const router = express.Router();

router.post("/", subjectController.createSubject);
router.get("/", subjectController.getAllSubjects);

export default router;
