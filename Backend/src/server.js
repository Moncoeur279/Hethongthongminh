const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");
const corsConfig = require("./config/corsConfig");
const { sequelize } = require("./config/dbConfig");
const { connectDB } = require("./config/dbConfig");

const dictRoutes = require("./routes/dictionaryRoutes");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/auth.routes");
const grammarRoutes = require("./routes/grammarRoutes");
const conversationRoutes = require("./routes/conversation.routes");
//const messageRoutes = require("./routes/message.routes");
const userRoutes = require("./routes/user.routes");

require("./models");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3030;

// MIDDLEWARE
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));
app.use(helmet());
app.use(cookieParser());
``

sequelize.sync({ force: false }).then(() => {
    console.log("Database & tables created!");
});

// ROUTE
app.use("/api", dictRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", grammarRoutes);
app.use("/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }), authRoutes);
app.use("/conversations", conversationRoutes);
//app.use("/messages", messageRoutes);
app.use("/api/user", userRoutes);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Backend server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();