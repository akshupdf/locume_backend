import express from 'express'
import indexRoute from './src/routes/index.js'
import errorHandler from './src/error/errorHandler.js'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api',indexRoute)

export default app
app.use(errorHandler)