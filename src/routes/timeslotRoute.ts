import express from "express";
import * as timeslotController from "../controllers/timeslotController";
const router = express.Router();

router.get("/", timeslotController.getAllTimeSlots);
router.post("/", timeslotController.createSubject);

export default router;
