import { model, models, Schema } from "mongoose";

const SubjectSchema = new Schema(
  {
    subjectName: String,
    subjectType: String,
  },
  { timestamps: true }
);

const SubjectModel = models.Subject || model("Subject", SubjectSchema);
export default SubjectModel;
