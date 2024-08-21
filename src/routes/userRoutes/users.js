import { Router } from "express";
import userController from '../../controller/userController/users.js'
const router = Router()

router.post('/addUsers', userController.userRegister)
router.post('/userLogin',userController.login)
router.put('/editProfile',userController.editProfile)
router.post('/generateOtp',userController.generateOTPFun)
router.post('/verifyOtp',userController.verifyOtp)
router.get('/getAllDoctors',userController.getAllDoctors)
router.get('/getSingleUserById/:id',userController.getSingleUserById)

export default router
