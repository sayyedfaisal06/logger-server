import { model, models, Schema } from "mongoose";

const AttendanceSchema = new Schema(
  {
    timeslot: {
      type: Schema.Types.ObjectId,
      ref: "TimeSlot",
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
    date: String,
  },
  { timestamps: true }
);

const AttendanceModel =
  models.Attendance || model("Attendance", AttendanceSchema);
export default AttendanceModel;
