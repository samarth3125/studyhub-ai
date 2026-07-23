import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["pdf", "quiz", "flashcard", "chat", "summary", "note", "mindspace", "planner"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Activity", activitySchema);
