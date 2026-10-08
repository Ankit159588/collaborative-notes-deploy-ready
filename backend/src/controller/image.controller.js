import {
  uploadToImagekit,
  deleteFromImagekit,
} from "../service/imagekit.service.js";
import noteModel from "../models/note.model.js";
import mongoose from "mongoose";

export async function createImageUrl(req, res) {
  try {
    const { note_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(note_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note id",
        code: "INVALID_NOTE_ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
        code: "IMAGE_REQUIRED",
      });
    }

    const note = await noteModel.findOne({
      _id: note_id,
      owner_id: req.user.user_id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        code: "NOTE_NOT_FOUND",
      });
    }

    const image = await uploadToImagekit(
      req.file.buffer,
      req.file.originalname,
    );

    note.images.push(image);
    await note.save();

    return res.status(201).json({
      success: true,
      message: "Image added to note successfully",
      code: "IMAGE_ADDED_TO_NOTE",
      data: {
        image,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to add image",
      code: "IMAGE_ADD_FAILED",
    });
  }
}

export async function deleteImage(req, res) {
  try {
    const { file_id, note_id } = req.params;

    if (!file_id) {
      return res.status(400).json({
        success: false,
        message: "Image file ID is required",
        code: "IMAGE_FILE_ID_REQUIRED",
        data: null,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(note_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note id",
        code: "INVALID_NOTE_ID",
        data: null,
      });
    }

    const note = await noteModel.findOne({
      _id: note_id,
      owner_id: req.user.user_id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        code: "NOTE_NOT_FOUND",
        data: null,
      });
    }
    console.log("NOTE ID:", note_id);
    console.log("FILE ID FROM URL:", file_id);
    console.log("NOTE FROM DB:", JSON.stringify(note.toObject(), null, 2));

    const imageExists = note.images.some((image) => image.file_id === file_id);

    if (!imageExists) {
      return res.status(404).json({
        success: false,
        message: "Image not found in this note",
        code: "IMAGE_NOT_FOUND",
        data: null,
      });
    }

    // Delete from ImageKit
    await deleteFromImagekit(file_id);

    // Remove image from MongoDB
    note.images = note.images.filter((image) => image.file_id !== file_id);

    await note.save();

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      code: "IMAGE_DELETED",
      data: null,
    });
  } catch (error) {
    console.error("DELETE IMAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete image",
      code: "IMAGE_DELETE_FAILED",
      data: null,
    });
  }
}
