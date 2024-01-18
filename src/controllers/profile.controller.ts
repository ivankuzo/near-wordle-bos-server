import { Request, Response } from 'express'
import { tryCatchController } from 'utils/tryCatch'
import ProfileModel from 'models/profile.model'

export const info = tryCatchController(async (req: Request, res: Response) => {
    const accountId = res.locals.accountId
    const profile = await ProfileModel.findOne({ accountId })
    return res.send({ profile })
})
