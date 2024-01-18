import express from 'express'
import { info } from 'controllers/profile.controller'
import requireAuth from 'middleware/requireAuth'

const router = express.Router()

router.get('/info', requireAuth, info)

export default router
