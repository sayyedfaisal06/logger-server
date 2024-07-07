import { Request, Response } from "express";
import AttendanceModel from "../models/attendance.model";
import StudentModel from "../models/student.model";
import SubjectModel from "../models/subject.model";
import TimeSlotModel from "../models/timeslot.model";
import xlsx from "xlsx";
import { format, parse } from "date-fns";

const groupAttendanceBySomeIdentifier = (attendance: any) => {
  const grouped: any = {};
  let currentAttendanceNum = 1;

  attendance.forEach((record: any) => {
    // Check if current attendance number exists in grouped object
    if (!grouped[currentAttendanceNum]) {
      grouped[currentAttendanceNum] = [];
    }

    // Add record to current attendance number group
    grouped[currentAttendanceNum].push(record);

    // Increment attendance number for next group
    currentAttendanceNum++;
  });

  return grouped;
};

const markAttendance = async (req: Request, res: Response) => {
  try {
    const { date, timeslot, subject, students } = req.body;
    const isExisitngAttendance = await AttendanceModel.findOne({
      date,
      timeslot,
    });
    if (isExisitngAttendance) {
      res.status(200).json({
        error: true,
        message: "Attendance already exist for this date and time.",
      });
      return;
    }

    const studentsArr = await StudentModel.find({
      _id: { $in: students },
    });

    if (studentsArr.length !== students.length) {
      res.status(404).json({
        data: [],
        message: "error while marking attendance",
        error: true,
      });
    }

    // Validate that the subject ID exists
    const subjectData = await SubjectModel.findById(subject);
    if (!subjectData) {
      res.status(404).json({
        data: [],
        message: "error while marking attendance",
        error: true,
      });
    }
    const timeSlots = await TimeSlotModel.findById(timeslot);
    if (!timeSlots) {
      res.status(404).json({
        data: [],
        message: "error while marking attendance",
        error: true,
      });
    }

    const newAttendance = new AttendanceModel({
      timeslot,
      students,
      subject,
      date: date,
    });

    await newAttendance.save();
    res.status(200).json({
      data: newAttendance,
      message: "Attendance marked successfully.",
      error: false,
    });
  } catch (error) {
    console.log(error);

    res.status(404).json({
      data: [],
      message: "error while marking attendance",
      error: true,
    });
  }
};
const exportAttendance = async (req: Request, res: Response) => {
  try {
    const paramsDate: any = req.query.date;
    const targetDate = new Date(paramsDate);

    const attendance = await AttendanceModel.find({
      date: format(targetDate, "dd/MM/yyyy"),
    })
      .populate("students")
      .populate("subject")
      .populate("timeslot");

    if (attendance.length === 0) {
      return res.status(200).json({
        message: "Attendance not found",
        error: true,
      });
    }
    const workbook = xlsx.utils.book_new();

    const groupedAttendance = groupAttendanceBySomeIdentifier(attendance);
    for (const [attendanceNum, records] of Object.entries(
      groupedAttendance
    ) as any) {
      const parsedDate = parse(records[0].date, "dd/MM/yyyy", new Date());
      const worksheetData = [
        [`Subject Name: ${records[0].subject.subjectName.toString()}`],
        [`Date: ${format(parsedDate, "do MMMM yyyy")}`],
        [`Time: ${records[0].timeslot.timeSlot.toString()}`],
        [`Total Present Students: ${records[0].students.length}`],
        ["Sr. No", "Student Names"],
        ...records.flatMap((record: any) =>
          record.students.map((student: any, index: number) => [
            index + 1,
            student.name.toString(),
          ])
        ),
      ];
      const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
      const subjectName = records[0].subject.subjectName.toString().split(" ");
      xlsx.utils.book_append_sheet(
        workbook,
        worksheet,
        `${subjectName[0]}_${records[0].timeslot.timeSlot.toString()}`
      );
    }

    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=attendance_${format(targetDate, "dd/MM/yyyy")}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.status(200).send(buffer);
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(203).json({
      message: "Error exporting attendance",
      error: true,
      status: 203,
    });
  }
};
// const exportAttendance = async (req: Request, res: Response) => {
//   try {
//     const paramsDate: any = req.query.date;
//     const targetDate = new Date(paramsDate);
//     const year = targetDate.getUTCFullYear();
//     const month = targetDate.getUTCMonth();
//     const day = targetDate.getUTCDate();

//     const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0));
//     const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

//     const attendance = await AttendanceModel.find({
//       date: {
//         $gte: startOfDay.toISOString(),
//         $lt: endOfDay.toISOString(),
//       },
//     })
//       .populate("students")
//       .populate("subject")
//       .populate("timeslot");

//     if (!attendance.length) {
//       return res.status(200).json({
//         data: [],
//         message: "Attendance not found",
//         error: true,
//       });
//     }

//     const workbook = xlsx.utils.book_new();
//     const worksheetData = [
//       ["Timeslot", "Students", "Subject", "Date"],
//       ...attendance.map((record) => [
//         record.timeslot.toString(),
//         record.students.map((student: any) => student.toString()).join(", "),
//         record.subject.toString(),
//         record.date,
//       ]),
//     ];
//     const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
//     xlsx.utils.book_append_sheet(workbook, worksheet, "Attendance");

//     // Write the workbook to a file
//     const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

//     // Set headers and send the buffer
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=attendance.xlsx"
//     );
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.status(200).json({
//       data: buffer,
//     });
//   } catch (error) {
//     res.status(404).json({
//       data: [],
//       message: "error while marking attendance",
//       error: true,
//     });
//   }
// };

export { markAttendance, exportAttendance };
