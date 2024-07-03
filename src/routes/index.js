import { Router } from "express";
import userRoutes from './userRoutes/users.js'
const router = Router()

router.use('/users',userRoutes)

export default router