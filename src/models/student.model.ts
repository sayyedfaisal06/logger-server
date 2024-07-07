import { model, models, Schema } from "mongoose";

const StudentSchema = new Schema(
  {
    name: String,
    division: String,
    rollNo: String,
  },
  { timestamps: true }
);

const StudentModel = models.Student || model("Student", StudentSchema);
export default StudentModel;
