import mongoose, { InferSchemaType } from 'mongoose'
import { gameNumber, randomWord } from 'utils/game.utils'

const gameSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
    },
    guesses: {
        type: [
            [
                {
                    hit: {
                        type: Number,
                        required: true,
                    },
                    key: {
                        type: String,
                        required: true,
                    },
                },
            ],
        ],
        required: true,
        default: [],
    },
    word: {
        type: String,
        required: true,
        default: () => randomWord(),
    },
    gameNumber: {
        type: Number,
        required: true,
        default: () => gameNumber(),
    },
    createdAt: { type: Date, expires: '45d', default: Date.now },
})

export type GameModelType = InferSchemaType<typeof gameSchema>
const GameModel = mongoose.model<GameModelType>('game', gameSchema)

export default GameModel
