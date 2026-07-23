import mongoose from "mongoose";

const savedResponseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      default: null,
    },

    mode: {
      type: String,
      enum: [
        "explain",
        "simplify",
        "example",
        "mnemonic",
        "analogy",
        "beginner",
        "exam",
      ],
      required: true,
    },

    concept: {
      type: String,
      required: true,
      trim: true,
    },

    response: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

savedResponseSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("SavedResponse", savedResponseSchema);
