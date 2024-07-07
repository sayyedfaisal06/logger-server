import express, { Express, Request, Response } from "express";
import compression from "compression";
import cors from "cors";

import studentRoutes from "./routes/studentRoute";
import subjectRoutes from "./routes/subjectRoute";
import timeslotRoutes from "./routes/timeslotRoute";
import attendanceRoutes from "./routes/attendanceRoute";

export const configureApp = (app: Express): void => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());
  app.use("/api/students", studentRoutes);
  app.use("/api/subjects", subjectRoutes);
  app.use("/api/timeslots", timeslotRoutes);
  app.use("/api/attendance", attendanceRoutes);

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });
};
