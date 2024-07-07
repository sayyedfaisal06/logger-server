import { Request, Response } from "express";
import SubjectModel from "../models/subject.model";

const createSubject = async (req: Request, res: Response) => {
  try {
    const { subject, subjectType } = req.body;

    const isExistingSubject = await SubjectModel.findOne({
      subjectName: subject,
      subjectType,
    });
    if (isExistingSubject) {
      res.status(200).json({
        error: true,
        message: "Subject already exist.",
      });
      return;
    }

    const newSubject = new SubjectModel({ subjectName: subject, subjectType });

    await newSubject.save();
    res.status(200).json({
      data: newSubject,
      message: "Subject created successfully.",
      error: false,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: "Error while creating subject.",
    });
  }
};

const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const allSubjects = await SubjectModel.find();
    res.status(200).json({
      data: allSubjects,
      message: "Subject fetched successfully.",
      error: false,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: "Error while fetching subject.",
    });
  }
};

export { createSubject, getAllSubjects };
