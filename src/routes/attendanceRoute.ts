import express from "express";
import * as attendanceController from "../controllers/attendanceController";
const router = express.Router();

router.post("/", attendanceController.markAttendance);
router.get("/", attendanceController.exportAttendance);

export default router;
