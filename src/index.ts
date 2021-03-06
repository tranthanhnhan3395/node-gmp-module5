import express, { NextFunction } from "express";
import "./configs/dotenv.config";
import { sequelize } from "./configs";
import { userRouter, groupRouter } from "./routes";
import { Logger } from "./logger";
import {
  errorHandlingMiddleware,
  routeNotExistsHandlingMiddleware,
  morganMiddleware,
} from "./middlewares";
import "./models/associations";

const app = express();
const port = process.env.APPLICATION_PORT ?? 3002;
const logger = Logger("index");

app.use(express.json());
app.use(morganMiddleware);

app.get("/", function (req, res) {
  res.json({ message: "module 5 application is running" });
});

app.get("/databaseconnection", async function (req, res, next: NextFunction) {
  try {
    await sequelize.authenticate();
    res.json({ message: "successfully connected to database" });
  } catch (err) {
    next(err);
  }
});

app.use("/users", userRouter);
app.use("/groups", groupRouter);

app.use(routeNotExistsHandlingMiddleware);

process
  .on("uncaughtException", (error) => {
    logger.error(error);
  })
  .on("unhandledRejection", (error) => {
    logger.error(error);
  });
app.use(errorHandlingMiddleware);

app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
