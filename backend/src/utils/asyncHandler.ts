import type { Request, Response , NextFunction } from "express";

interface AsyncHandler {
    (req: Request, res: Response): Promise<void>;
}

export const asyncHandler = (fn: AsyncHandler) => async (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res))
    .catch(error => next(error));
}