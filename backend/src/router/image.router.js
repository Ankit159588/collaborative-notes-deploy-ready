import { Router } from "express";
import * as imageController from "../controller/image.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import multer, { memoryStorage } from "multer";

const upload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

const imageRouter = Router();

imageRouter.use(authMiddleware);

/**
 * @swagger
 * /api/image/notes/{note_id}:
 *   post:
 *     summary: Upload an image to a note
 *     tags:
 *       - Images
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         description: ID of the note
 *         schema:
 *           type: string
 *         example: 66ab38fa7b60a2a706db4c1a2
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (maximum 15 MB)
 *     responses:
 *       201:
 *         description: Image added to note successfully
 *       400:
 *         description: Invalid note ID or image not provided
 *       404:
 *         description: Note not found
 *       500:
 *         description: Failed to add image
 */
imageRouter.post(
  "/notes/:note_id",
  upload.single("image"),
  imageController.createImageUrl,
);

/**
 * @swagger
 * /api/image/{note_id}/images/{file_id}:
 *   delete:
 *     summary: Delete an image from a note
 *     tags:
 *       - Images
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         description: ID of the note
 *         schema:
 *           type: string
 *         example: 66ab38fa7b60a2a706db4c1a2
 *       - in: path
 *         name: file_id
 *         required: true
 *         description: ImageKit file ID
 *         schema:
 *           type: string
 *         example: 6ab39c7bead997d09ae4f244
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       400:
 *         description: Invalid note ID or missing file ID
 *       404:
 *         description: Note or image not found
 *       500:
 *         description: Failed to delete image
 */
imageRouter.delete("/:note_id/images/:file_id", imageController.deleteImage);

export default imageRouter;
