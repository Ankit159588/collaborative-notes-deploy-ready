import noteModel from "../models/note.model.js";
import mongoose from "mongoose";

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    const note = await noteModel.create({
      title: title || "",
      content: content || "",
      owner_id: req.user.user_id,
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      code: "NOTE_CREATED",
      data: {
        note,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create note",
      code: "NOTE_CREATE_FAILED",
    });
  }
}

export async function getMyNotes(req, res) {
  try {
    const notes = await noteModel
      .find({
        owner_id: req.user.user_id,
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      code: "NOTES_FETCHED",
      data: {
        notes,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      code: "NOTES_FETCH_FAILED",
    });
  }
}

export async function getNote(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note id",
        code: "INVALID_NOTE_ID",
      });
    }

    const note = await noteModel.findOne({
      _id: id,
      owner_id: req.user.user_id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        code: "NOTE_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      code: "NOTE_FETCHED",
      data: {
        note,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch note",
      code: "NOTE_FETCH_FAILED",
    });
  }
}

export async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note id",
        code: "INVALID_NOTE_ID",
      });
    }

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (content !== undefined) {
      updateData.content = content;
    }

    const note = await noteModel.findOneAndUpdate(
      {
        _id: id,
        owner_id: req.user.user_id,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        code: "NOTE_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      code: "NOTE_UPDATED",
      data: {
        note,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update note",
      code: "NOTE_UPDATE_FAILED",
    });
  }
}

export async function deleteNote(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note id",
        code: "INVALID_NOTE_ID",
      });
    }

    const note = await noteModel.findOneAndDelete({
      _id: id,
      owner_id: req.user.user_id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        code: "NOTE_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      code: "NOTE_DELETED",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete note",
      code: "NOTE_DELETE_FAILED",
    });
  }
}
