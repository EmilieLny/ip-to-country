import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const message = err.message || "An unexpected error occurred";

  res.status(500).json({ error: message });
};
