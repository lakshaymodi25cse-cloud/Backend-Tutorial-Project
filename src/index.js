import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/database.js";
import { PORT } from "./config/constants.js";

// Connect to Database and Start Server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to start server:", error.message);
    });
