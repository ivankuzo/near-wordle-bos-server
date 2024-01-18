import { Request, Response, NextFunction } from 'express'

export const tryCatchController =
    <T, U>(
        controller: (
            req: Request<T>,
            res: Response<U>,
            next?: NextFunction,
        ) => Promise<Response<U> | void> | Response<U> | void,
    ) =>
    async (req: Request<T>, res: Response<U>, next: NextFunction) => {
        try {
            await controller(req, res)
        } catch (e) {
            next(e)
        }
    }

export const tryCatchMiddleware =
    <T, U>(
        middleware: (
            req: Request<T>,
            res: Response<U>,
            next: NextFunction,
        ) => Promise<void> | void,
    ) =>
    async (req: Request<T>, res: Response<U>, next: NextFunction) => {
        try {
            await middleware(req, res, next)
        } catch (e) {
            next(e)
        }
    }
