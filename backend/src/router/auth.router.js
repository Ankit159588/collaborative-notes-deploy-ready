import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as controller from "../controller/auth.controller.js";

const authRouter = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: ankit
 *               email:
 *                 type: string
 *                 example: ankit@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 */
authRouter.post("/register", controller.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: ankit@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Email not verified
 */
authRouter.post("/login", controller.login);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify user email using OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: ankit@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid OTP
 *       410:
 *         description: OTP expired
 */
authRouter.post("/verify-email", controller.verifyEmail);

/**
 * @swagger
 * /api/auth/resend-otp:
 *   post:
 *     summary: Resend email verification OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: ankit@example.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
 */
authRouter.post("/resend-otp", controller.resendOtp);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout current session
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
authRouter.get("/logout", controller.logout);

/**
 * @swagger
 * /api/auth/logout-all:
 *   get:
 *     summary: Logout from all sessions
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out from all sessions
 */
authRouter.get("/logout-all", controller.logoutAll);

/**
 * @swagger
 * /api/auth/rotate-token:
 *   get:
 *     summary: Rotate access token
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Access token rotated successfully
 */
authRouter.get("/rotate-token", controller.rotateToken);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: ankit@example.com
 *     responses:
 *       200:
 *         description: Password reset OTP sent successfully
 */
authRouter.post("/forgot-password", controller.forgotPassword);

/**
 * @swagger
 * /api/auth/verify-reset-otp:
 *   post:
 *     summary: Verify password reset OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: ankit@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Reset OTP verified successfully
 *       410:
 *         description: OTP expired
 */
authRouter.post("/verify-reset-otp", controller.verifyResetOtp);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetPasswordToken
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               resetPasswordToken:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword@123
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid password or token
 */
authRouter.post("/reset-password", controller.resetPassword);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 *       401:
 *         description: Unauthorized
 */
authRouter.get("/me", authMiddleware, controller.getMe);

export default authRouter;
