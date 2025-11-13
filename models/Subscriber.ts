import mongoose, { Schema, models } from "mongoose";

const SubscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const Subscriber = models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);
export default Subscriber;