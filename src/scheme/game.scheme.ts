import { isWordValid } from 'utils/game.utils'
import { object, string, TypeOf } from 'zod'

export const guessSchema = object({
    body: object({
        guess: string()
            .refine(guess => guess.length === 5, {
                message: 'Not correct word length',
            })
            .refine(guess => isWordValid(guess), {
                message: 'Not in wordlist',
            }),
    }),
})

export type GuessInput = TypeOf<typeof guessSchema>
