import express from 'express'
import validate from 'middleware/validate'
import { info, guess, signature } from 'controllers/game.controller'
import { guessSchema } from 'scheme/game.scheme'
import requireAuth from 'middleware/requireAuth'

const router = express.Router()

router.get('/info', requireAuth, info)
router.post('/guess', [requireAuth, validate(guessSchema)], guess)
router.get('/signature', requireAuth, signature)

export default router
