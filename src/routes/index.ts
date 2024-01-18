import express from 'express'
import game from './game.route'
import profile from './profile.route'

const router = express.Router()

router.use('/game', game)
router.use('/profile', profile)

export default router
