import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import session from "express-session";

import { publicRoutes } from "./routes/public-users.js";
import { authRouter } from "./routes/auth-users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization["accessToken"];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).send({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).send({ message: "User not Logged in" });
  }
});

app.use(publicRoutes);
app.use("/customer", authRouter);

app.listen(PORT, () =>
  console.log(`📖 Book Review listening on port: ${PORT} 🚀`)
);
