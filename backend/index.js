import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import CustomError from "./utils/CustomError.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello, World!"
  });
});
app.use('/api/auth', authRouter);
app.use('*', (req, res, next) => {
  throw new CustomError(404, "Route does not exist");
});
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message
  });
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
})
.catch(error => {
  console.log("Error:", error);
  process.exit(1);
});