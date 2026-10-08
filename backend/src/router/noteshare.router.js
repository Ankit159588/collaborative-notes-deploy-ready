import { Router } from "express";
import * as noteshareController from "../controller/noteshare.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const noteshareRouter = Router();

noteshareRouter.use(authMiddleware);

/**
 * @swagger
 * /api/share/note/{noteId}:
 *   get:
 *     summary: Get all shares for a note
 *     tags:
 *       - Note Sharing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         description: ID of the note
 *         schema:
 *           type: string
 *         example: 66ab38fa7b60a2a706db4c1a2
 *     responses:
 *       200:
 *         description: Note shares fetched successfully
 *       404:
 *         description: Note not found
 *       500:
 *         description: Failed to fetch note shares
 */
noteshareRouter.get("/note/:noteId", noteshareController.getNoteShares);

/**
 * @swagger
 * /api/share/{token}:
 *   get:
 *     summary: Access a shared note using a share token
 *     tags:
 *       - Note Sharing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Share token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shared note fetched successfully
 *       404:
 *         description: Share link not found or expired
 *       500:
 *         description: Failed to fetch shared note
 */
noteshareRouter.get("/:token", noteshareController.getShareNote);

/**
 * @swagger
 * /api/share/{noteId}:
 *   post:
 *     summary: Create a share link for a note
 *     tags:
 *       - Note Sharing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         description: ID of the note to share
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
 *               role:
 *                 type: string
 *                 enum:
 *                   - viewer
 *                   - editor
 *                 example: editor
 *     responses:
 *       201:
 *         description: Share link created successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Note not found
 *       500:
 *         description: Failed to create share link
 */
noteshareRouter.post("/:noteId", noteshareController.createShare);

/**
 * @swagger
 * /api/share/{shareId}:
 *   patch:
 *     summary: Update the role of a shared note
 *     tags:
 *       - Note Sharing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shareId
 *         required: true
 *         description: ID of the share record
 *         schema:
 *           type: string
 *         example: 66ab38fa7b60a2a706db4c1a2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - viewer
 *                   - editor
 *                 example: editor
 *     responses:
 *       200:
 *         description: Share role updated successfully
 *       400:
 *         description: Invalid role or share ID
 *       404:
 *         description: Share not found
 *       500:
 *         description: Failed to update share role
 */
noteshareRouter.patch("/:shareId", noteshareController.updateShareRole);

/**
 * @swagger
 * /api/share/{shareId}:
 *   delete:
 *     summary: Revoke a note share
 *     tags:
 *       - Note Sharing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shareId
 *         required: true
 *         description: ID of the share record
 *         schema:
 *           type: string
 *         example: 66ab38fa7b60a2a706db4c1a2
 *     responses:
 *       200:
 *         description: Share revoked successfully
 *       404:
 *         description: Share not found
 *       500:
 *         description: Failed to revoke share
 */
noteshareRouter.delete("/:shareId", noteshareController.revokeShare);

export default noteshareRouter;
