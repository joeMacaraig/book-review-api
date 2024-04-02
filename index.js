import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import session from "express-session";
import { publicRoutes } from "./routes/public-users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);
app.use("/customer/auth/*", function auth(req, res, next) {});
app.use(publicRoutes);

app.listen(PORT, () =>
  console.log(`📖 Book Review listening on port: ${PORT} 🚀`)
);
