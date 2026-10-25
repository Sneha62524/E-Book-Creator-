require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const aiRoutes = require("./routes/aiRoutes");
const exportRoutes = require("./routes/exportRoutes");

const app = express();

//middleware to handle CORS
app.use(
    cors({
        origin: "*",
        methods: ["GET","PUT", "POST", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

//connect Databases
connectDB();

//Middleware
app.use(express.json());

//Static folder for uploads
app.use("/upload", express.static(path.join(__dirname, "upload")));

//Route here
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/export", exportRoutes);

//start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));