const express = require("express");
const cors = require("cors");
const budgetsRouter = require("./routes/budgetsRouter.js");
const usersRouter = require("./routes/usersRouter.js");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const port = 3000;
const app = express();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not found in environment");
  process.exit(1);
}

app.use(cookieParser());
app.use(express.json());

// CORS Configurations
const corsOptions = {
  origin: 'http://127.0.0.1:1234',
  credentials: true, 
};

app.use(cors(corsOptions));

// End points for Budgets
app.use("/budgets", budgetsRouter);
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});