import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import connectDb from "./database/connectDb.js";

const app = express();
const PORT = process.env.PORT || 8000;

const __dirname = path.resolve();

// For Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("common"));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https:", "data:", "blob:"],
      "connect-src": ["'self'", "https://firebasestorage.googleapis.com"],
    },
  })
);

app.use((req, res, next) => {
  req.body.date = new Date();
  console.log(req.body);
  next();
});

// For Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);

// Connect Client Side
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (_, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"), (err) => {
    res.status(500).send(err);
  });
});

// For Start Server
const startServer = async () => {
  try {
    await connectDb(process.env.MONGODB_URL);

    app.listen(PORT, () => {
      console.log(`Server is running on PORT number ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
