import { Request, Response } from "express";
import StudentModel from "../models/student.model";

const getStudents = async (req: Request, res: Response) => {
  try {
    const allStudents = await StudentModel.find();

    res.status(200).json({
      data: allStudents,
    });
  } catch (error) {
    res.status(404).json({
      data: [],
    });
  }
};

export { getStudents };
