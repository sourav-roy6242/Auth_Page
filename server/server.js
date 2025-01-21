import express from "express";
import dotenv from "dotenv";  
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

//Api endpoints
app.get("/", (req, res) => res.send("API Working"));
app.use('/api/auth' ,authRouter)

app.listen(port, () => console.log(`Server listening on port ${port}`));
