import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import config from "./src/config/config.js";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
async function startServer() {
  try {
    await connectDB();
    app.listen(config.PORT, () => {
      console.log(`Server is Started on Port ${config.PORT}`);
    });
  } catch (error) {
    console.log("Failed to start the server: ", error.message);
    process.exit(1);
  }
}

startServer();
