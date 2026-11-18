import express from "express";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Root health-check endpoint
app.get("/", (req, res) => {
    res.status(200).send("Backend Server is Running");
});

// API Routes
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Handle undefined routes (404)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handling middleware (handles invalid JSON syntax, etc.)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ message: "Invalid JSON format in request body" });
    }
    console.error("Unhandled Server Error:", err.stack || err.message);
    res.status(500).json({ message: "Internal server error" });
});

export default app;
