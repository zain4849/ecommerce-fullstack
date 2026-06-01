import type { NextFunction, Request, Response } from "express";
import type { ObjectSchema } from "joi";

type Source = "body" | "params" | "query";

export const validateRequest = (schema: ObjectSchema, source: Source = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[source], { // could be req.body, req.params, req.query
      /*
      req[body] = {email: "test@test.com", password: "123456"}
      req[params] = {id: "123"}
      req[query] = {page: 1, limit: 10}
      req[headers] = {authorization: "Bearer 123456"}
      req[cookies] = {token: "123456"}
      req[user] = {id: "123", email: "test@test.com", password: "123456"}
      req[isAuthenticated] = true
      req[isUnauthenticated] = false
      req[isAuthenticated] = true
      */
      abortEarly: false, // continue validation even if there are errors
      stripUnknown: true, // removes any unknown properties from the object
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
