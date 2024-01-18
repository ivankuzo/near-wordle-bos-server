import { Request, Response, NextFunction } from 'express'
import { tryCatchMiddleware } from 'utils/tryCatch'
import { keccak256 } from 'js-sha3'
import { AppError } from 'utils/errors'
import { getKeyHash } from 'services/contract'
import ProfileModel from 'models/profile.model'

export default tryCatchMiddleware(
    async (req: Request, res: Response, next: NextFunction) => {
        const accountId = req.headers['x-account-id']
        const key = req.headers['x-auth-key']

        if (typeof accountId !== 'string' || typeof key !== 'string')
            throw new AppError('Invalid headers')

        const keyHash = keccak256(key)
        const keyHashInContract = await getKeyHash(accountId)

        if ('0x' + keyHash !== keyHashInContract)
            throw new AppError('Invalid key')
        else {
            const doesProfileExist = await ProfileModel.exists({ accountId })
            if (!doesProfileExist) await ProfileModel.create({ accountId })
            res.locals.accountId = accountId
            next()
        }
    },
)
