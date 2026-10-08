import mongoose from "mongoose";

const noteShareSchema = new mongoose.Schema(
  {
    note_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },

    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["viewer", "editor"],
      default: "viewer",
      required: true,
    },

    expires_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const noteShareModel = mongoose.model("NoteShare", noteShareSchema);

export default noteShareModel;
