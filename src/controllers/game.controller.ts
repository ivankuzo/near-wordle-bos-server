import { Request, Response } from 'express'
import { tryCatchController } from 'utils/tryCatch'
import GameModel from 'models/game.model'
import ProfileModel from 'models/profile.model'
import { AppError } from 'utils/errors'
import { GuessInput } from 'scheme/game.scheme'
import {
    formatteGuess,
    gameNumber,
    checkIsWinner,
    isWordInGuesses,
} from 'utils/game.utils'
import secp256k1 from 'secp256k1'
import { keccak256 } from 'js-sha3'
import config from 'config'
import logger from 'utils/logger'

const SIGNER = config.get<{
    PUBLIC: string
    PRIVATE: string
}>('SIGNER')

export const info = tryCatchController(async (req: Request, res: Response) => {
    const accountId = res.locals.accountId
    const currentGameNumber = gameNumber()

    const game = await GameModel.findOne({
        accountId,
        gameNumber: currentGameNumber,
    })

    const isWinner = game ? checkIsWinner(game.guesses, game.word) : false
    const guesses = game ? game.guesses : []

    return res.send({ guesses, isWinner, gameNumber: currentGameNumber })
})

export const guess = tryCatchController(
    async (req: Request<{}, {}, GuessInput['body']>, res: Response) => {
        let guess = req.body.guess
        guess = guess.toLowerCase()

        const accountId = res.locals.accountId
        const currentGameNumber = gameNumber()

        logger.debug(`accountId: ${accountId}`)
        logger.debug(`currentGameNumber: ${currentGameNumber}`)

        let profile = await ProfileModel.findOne({ accountId })
        if (!profile) throw new AppError('Profile not found')

        let game = await GameModel.findOne({
            accountId,
            gameNumber: currentGameNumber,
        })

        if (!game) {
            game = await GameModel.create({ accountId })
        }
        if (checkIsWinner(game.guesses, game.word))
            throw new AppError('You already won today')
        if (game.guesses.length === 6)
            throw new AppError('The attempts are over')

        if (isWordInGuesses(guess, game.guesses))
            throw new AppError('This word has already been used')

        const formattedGuess = formatteGuess(game.word, guess)

        const isWinner = game.word === guess
        const newGuesses = game
            ? [...game.guesses, formattedGuess]
            : [formattedGuess]
        const lost = !isWinner && newGuesses.length === 6

        if (lost) profile.lost++, (profile.currentStreak = 0)

        if (isWinner) {
            profile.currentStreak++
            if (profile.currentStreak > profile.maxStreak) {
                profile.maxStreak = profile.currentStreak
            }
            profile.guessDistribution[newGuesses.length - 1]++
        }

        await profile.save()

        await GameModel.findOneAndUpdate(
            { accountId, gameNumber: currentGameNumber },
            { guesses: newGuesses },
            { upsert: true },
        )

        return res.send({ formattedGuess, isWinner })
    },
)

export const signature = tryCatchController(
    async (req: Request, res: Response) => {
        const accountId = res.locals.accountId
        const currentGameNumber = gameNumber()

        let game = await GameModel.findOne({
            accountId,
            gameNumber: currentGameNumber,
        })
        if (!game || !checkIsWinner(game.guesses, game.word))
            throw new AppError('You did not win today')

        const addedScore = 7 - game.guesses.length

        const privateKey = Uint8Array.from(Buffer.from(SIGNER.PRIVATE, 'hex'))

        const messageHash = new Uint8Array(
            keccak256
                .create()
                .update(addedScore + accountId + currentGameNumber)
                .digest(),
        )

        const signatureObj = secp256k1.ecdsaSign(messageHash, privateKey)

        const rs = Buffer.from(signatureObj.signature).toString('hex')
        const v = signatureObj.recid
        const day = currentGameNumber

        return res.send({ addedScore, day, rs, v })
    },
)
