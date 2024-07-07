import { Request, Response } from "express";
import TimeSlotModel from "../models/timeslot.model";
import { formatHoursMins } from "../lib/config";

const createSubject = async (req: Request, res: Response) => {
  try {
    const { fromTime, toTime } = req.body;

    const timeSlot = `${formatHoursMins(fromTime)} - ${formatHoursMins(
      toTime
    )}`;

    const isExistingTimeslot = await TimeSlotModel.findOne({ timeSlot });
    if (isExistingTimeslot) {
      res.status(200).json({
        error: true,
        message: "Time Slot already exist.",
      });
      return;
    }

    const newTimeSlot = new TimeSlotModel({ timeSlot });

    await newTimeSlot.save();
    res.status(200).json({
      data: newTimeSlot,
      message: "Time Slot created successfully.",
      error: false,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: "Error while creating Time Slot.",
    });
  }
};

const getAllTimeSlots = async (req: Request, res: Response) => {
  try {
    const allTimeSlots = await TimeSlotModel.find();
    res.status(200).json({
      data: allTimeSlots,
      message: "Time Slot fetched successfully.",
      error: false,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: "Error while fetching Time Slot.",
    });
  }
};

export { createSubject, getAllTimeSlots };
