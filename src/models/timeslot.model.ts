import { model, models, Schema } from "mongoose";

const TimeSlotSchema = new Schema(
  {
    timeSlot: String,
  },
  { timestamps: true }
);

const TimeSlotModel = models.TimeSlot || model("TimeSlot", TimeSlotSchema);
export default TimeSlotModel;
