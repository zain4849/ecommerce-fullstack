import type { NextFunction, Request, Response } from "express";
import type { ObjectSchema } from "joi";

type Source = "body" | "params" | "query";

export const validateRequest = (schema: ObjectSchema, source: Source = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map((item) => item.message),
      });
    }

    (req as unknown as Record<string, unknown>)[source] = value;
    return next();
  };
};
