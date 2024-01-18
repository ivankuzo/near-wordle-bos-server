import { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from 'zod'

export default (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body)
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            })
            next()
        } catch (e) {
            next(e)
        }
    }
