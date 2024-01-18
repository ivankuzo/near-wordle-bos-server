import validWords from 'constants/validWords'
import wordList from 'constants/wordList'
import { GameModelType } from 'models/game.model'

export const isWordValid = (guess: string) => validWords.includes(guess)

export const randomWord = () =>
    wordList[Math.floor(Math.random() * wordList.length)]

export const formatteGuess = (word: string, guess: string) => {
    let wordLetters = [...word]
    let formattedGuess = [...guess].map(l => {
        return { key: l, hit: 1 }
    })

    formattedGuess.forEach((l, i) => {
        if (word[i] === l.key) {
            formattedGuess[i].hit = 3
            wordLetters[i] = ''
        }
    })

    formattedGuess.forEach((l, i) => {
        if (wordLetters.includes(l.key) && l.hit !== 3) {
            formattedGuess[i].hit = 2
            wordLetters[wordLetters.indexOf(l.key)] = ''
        }
    })

    return formattedGuess
}

export const gameNumber = () => {
    const gameStartDate = new Date('2024-01-17T14:00:00.000Z')
    const currentDate = new Date()
    const timeDifference = currentDate.getTime() - gameStartDate.getTime()
    const daysPassed = Math.floor(timeDifference / (24 * 60 * 60 * 1000))
    return daysPassed
}

export const checkIsWinner = (
    guesses: GameModelType['guesses'],
    word: GameModelType['word'],
) => guesses.some(guess => guess.map(item => item.key).join('') === word)

export const isWordInGuesses = (
    word: string,
    guesses: GameModelType['guesses'],
): boolean =>
    guesses.some(
        guess => guess.map(letterGuess => letterGuess.key).join('') === word,
    )
