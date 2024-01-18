import express from 'express'
import cors from 'cors'
import config from 'config'

import logger from 'utils/logger'
import connectDB from 'services/connectDB'
import routes from 'routes'
import errorHandler from 'middleware/errorHandler'
import { initContract } from 'services/contract'

const app = express()
const PORT = config.get<number>('PORT')

app.use(cors())
app.use(express.json({ type: 'application/json' }))
app.use('/api', routes)
app.use(errorHandler)

app.listen(PORT, async () => {
    logger.info(`Server started on port ${PORT}`)
    await initContract()
    await connectDB()
})
