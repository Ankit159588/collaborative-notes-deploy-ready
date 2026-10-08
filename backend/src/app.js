import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import noteRouter from "./router/note.router.js";
import noteshareRouter from "./router/noteshare.router.js";
import authRouter from "./router/auth.router.js";
import imageRouter from "./router/image.router.js";
import dns from "dns";
import config from "./config/config.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

// Needed on Render/Vercel etc. (requests arrive through a reverse proxy)
app.set("trust proxy", 1);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }),
);
app.get("/test", (req, res) => {
  res.status(200).json({
    message: "App is working fine",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);
app.use("/api/image", imageRouter);
app.use("/api/share", noteshareRouter);

export default app;
