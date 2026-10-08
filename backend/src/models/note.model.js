import mongoose from "mongoose";

const noteImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Image URL is required"],
    },

    file_id: {
      type: String,
      required: [true, "Image file ID is required"],
    },
  },
  {
    _id: false,
  },
);

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: [200, "Note title cannot exceed 200 characters"],
    },

    content: {
      type: String,
      default: "",
    },

    images: {
      type: [noteImageSchema],
      default: [],
    },

    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Note owner is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const noteModel = mongoose.model("Note", noteSchema);

export default noteModel;
