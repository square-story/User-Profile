import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

interface IValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validateRequest = (schemas: IValidationSchemas) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const validatedBody = await schemas.body.parseAsync(req.body);
        req.body = validatedBody; // req.body is usually safe to reassign, but if it fails we might need Object.assign(req.body, validatedBody) after clearing. Standard Express body parsers allow reassignment.
      }
      if (schemas.query) {
        const validatedQuery = await schemas.query.parseAsync(req.query);
        // req.query is a getter in some environments, so we mutate it.
        // We clear existing keys and assign new ones to handle stripped fields.
        for (const key in req.query) {
          delete (req.query as Record<string, unknown>)[key];
        }
        Object.assign(req.query, validatedQuery);
      }
      if (schemas.params) {
        const validatedParams = await schemas.params.parseAsync(req.params);
        // req.params can also be read-only/getter.
        for (const key in req.params) {
          delete (req.params as Record<string, unknown>)[key];
        }
        Object.assign(req.params, validatedParams);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
