import { Router } from "express";
import * as noteController from "../controller/note.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const noteRouter = Router();

noteRouter.use(authMiddleware);

/**
 * @swagger
 * /api/note:
 *   post:
 *     summary: Create a new note
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Note
 *               content:
 *                 type: string
 *                 example: This is my note content.
 *     responses:
 *       201:
 *         description: Note created successfully
 *       500:
 *         description: Failed to create note
 */
noteRouter.post("/", noteController.createNote);

/**
 * @swagger
 * /api/note:
 *   get:
 *     summary: Get all notes owned by the current user
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notes fetched successfully
 *       500:
 *         description: Failed to fetch notes
 */
noteRouter.get("/", noteController.getMyNotes);

/**
 * @swagger
 * /api/note/{id}:
 *   get:
 *     summary: Get a specific note
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Note ID
 *         schema:
 *           type: string
 *         example: 66ab38fa7b60a2a706db4c1a2
 *     responses:
 *       200:
 *         description: Note fetched successfully
 *       400:
 *         description: Invalid note ID
 *       404:
 *         description: Note not found
 *       500:
 *         description: Failed to fetch note
 */
noteRouter.get("/:id", noteController.getNote);

/**
 * @swagger
 * /api/note/{id}:
 *   patch:
 *     summary: Update a note
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Note ID
 *         schema:
 *           type: string
 *         example: 66ab38fa7b60a2a706db4c1a2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Note Title
 *               content:
 *                 type: string
 *                 example: Updated note content.
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       400:
 *         description: Invalid note ID
 *       404:
 *         description: Note not found
 *       500:
 *         description: Failed to update note
 */
noteRouter.patch("/:id", noteController.updateNote);

/**
 * @swagger
 * /api/note/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Note ID
 *         schema:
 *           type: string
 *         example: 66ab38fa7b60a2a706db4c1a2
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       400:
 *         description: Invalid note ID
 *       404:
 *         description: Note not found
 *       500:
 *         description: Failed to delete note
 */
noteRouter.delete("/:id", noteController.deleteNote);

export default noteRouter;
