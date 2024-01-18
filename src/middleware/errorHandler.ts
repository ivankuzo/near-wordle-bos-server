import { Request, Response, NextFunction } from 'express'
import { AppError } from 'utils/errors'
import isDevMode from 'utils/isDevMode'
import logger from 'utils/logger'
import { ZodError } from 'zod'

export default (
    e: Error | ZodError | AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (e instanceof ZodError) {
        if (isDevMode) logger.info(e)
        return res
            .status(200)
            .send({ message: e.errors[0].message, error: true })
    }

    if (e instanceof AppError) {
        if (isDevMode) logger.info(e)

        // const responsePayload: { message: string; errorCode?: number } = {
        //     message: e.message,
        // }

        // if (e.errorCode) {
        //     responsePayload.errorCode = e.errorCode
        // }

        // const statusCode = e.statusCode || 200

        return res.status(200).send({ message: e.message, error: true })
    } else {
        logger.error(e)
        return res.status(200).send({ message: e.message, error: true })
    }
}
