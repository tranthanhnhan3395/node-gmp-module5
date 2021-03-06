import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions";
import { API_MESSAGES } from "../shared/messages";
import { Logger } from "../logger";

const logger = Logger("error-handler");

const errorHandlingMiddleware = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack);

  if (err instanceof ApiError) {
    return res.status(err.code).json({ message: err.message });
  }

  res.status(500).json({ message: API_MESSAGES.SERVER_ERROR });
};

export default errorHandlingMiddleware;
