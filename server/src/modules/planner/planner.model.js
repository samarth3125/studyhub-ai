import mongoose from "mongoose";

const plannerTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["study", "exam", "task"],
      default: "study",
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      default: null,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

plannerTaskSchema.index({ user: 1, date: 1 });

export default mongoose.model("PlannerTask", plannerTaskSchema);
