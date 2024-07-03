import userService from '../../services/userService/user.js'
import OTPGenerate from '../../utils/generateOTP.js'
import { asyncMiddleware } from '../../error/catchAsynError.js'
import { CustomError } from '../../error/customError.js'
import otpService from '../../services/otpService.js'
import JWT from 'jsonwebtoken'
const CURRENT_TIMESTAMP = Date.now()

const userRegister = asyncMiddleware(async (req, res, next) => {
    const { firstName, lastName, mobileVerficationId, gender, availability, medicalId, location, specialization, hourlyRate } = req.body
    const checkUserDataUserVerification = await otpService.checkMobileNumberVerifyORNotById(mobileVerficationId)
    if (!checkUserDataUserVerification && !mobileVerficationId.otp_verification) {
        return next(new CustomError("Please Verify Your Mobile Number", 400))
    }
    await userService.userDataInsert(firstName, lastName, checkUserDataUserVerification.id, gender, availability, medicalId, location, specialization, hourlyRate)
    return res.status(200).json({ status: 200, message: "Insert" })
})

const login = asyncMiddleware(async (req, res, next) => {
    const { mobileNumber, otp } = req.body
    const checkMobileVerification = await otpService.getOtpVerificationDataByMobileNumber(mobileNumber)
    if (!checkMobileVerification || !checkMobileVerification.otp_verification) {
        return next(new CustomError("User Not Found", 404));
    }
    const user = await userService.getUserDataByOtpVerificationId(checkMobileVerification.id)
    if (!user) {
        return next(new CustomError("User Not Found", 404));
    }

    if (parseInt(otp) !== checkMobileVerification.otp) {
        return next(new CustomError("Otp Not match", 404))
    }
    if (CURRENT_TIMESTAMP > parseInt(checkMobileVerification.otp_expired_time)) {
        return next(new CustomError("Otp Time Expried", 404))
    }
    await otpService.removeOtpDataFromVerification(checkMobileVerification.id)

    const token = JWT.sign({ user_id: user.id }, process.env.secretKey, { expiresIn: process.env.jwtExpirationTime });
    return res.status(200).json({ status: 200, message: "Login Succesfully", user: user, token: token })
})


const generateOTPFun = asyncMiddleware(async (req, res, next) => {
    const { mobileNumber, otpType } = req.body
    const otp = OTPGenerate()
    if (otpType === 1) {                                                                                     // For Login User Otp
        const checkMobileVerification = await otpService.getOtpVerificationDataByMobileNumber(mobileNumber)
        if (!checkMobileVerification || !checkMobileVerification.otp_verification) {
            return next(new CustomError("User Not Found", 404));
        }
        const user = await userService.getUserDataByOtpVerificationId(checkMobileVerification.id)
        if (!user) {
            return next(new CustomError("User Not Found", 404));
        }
        await otpService.updateOtp(checkMobileVerification.id, otp)
    } else if (otpType === 2) {                                                                             // For New User Register
        const userData = await otpService.checkUserMobileExistOrOtpVerificationOrNot(mobileNumber)
        if (userData.otp_verification) {
            return res.status(409).json({ status: 409, message: "User Mobile Number Already Verify", result: { otpVerficationId: userData.id } })
        }
        if (userData.id) {
            await otpService.updateOtp(userData.id, otp)
        } else {
            await userService.sendOtpForRegisterService(mobileNumber, otp)
        }
    } else {
        return next(new CustomError("Otp Type Not Found", 400))
    }
    return res.status(200).json({ status: 200, message: true, result: otp })
})

const verifyOtp = asyncMiddleware(async (req, res, next) => {
    const { mobileNumber, otp } = req.body
    const otpVerificaionData = await otpService.getOtpVerificationDataByMobileNumber(mobileNumber)
    if (!otpVerificaionData) {
        return next(new CustomError("User Not Found", 400))
    }

    if (CURRENT_TIMESTAMP > parseInt(otpVerificaionData.otp_expired_time)) {
        return next(new CustomError("Otp Time Expried", 404))
    }
    if (parseInt(otp) !== otpVerificaionData.otp) {
        return next(new CustomError("Otp Not match", 404))
    }
    await otpService.changeOtpVerificationStatus(otpVerificaionData.id)
    return res.status(200).json({ status: 200, message: "Otp Verify Succesfully", result: { otpVerficationId: otpVerificaionData.id } })
})

const getAllDoctors = asyncMiddleware(async (req, res, next) => {
    const data = await userService.getAllDoctors()
    return res.status(200).json({ status: 200, message: true, result: data })
})

const getSingleUserById = asyncMiddleware(async (req, res, next) => {
    const { id } = req.params
    const data = await userService.getSingleUserByUserId(id)
    return res.status(200).json({ status: 200, message: "Found", result: data })
})

export default {
    userRegister,
    login,
    generateOTPFun,
    getAllDoctors,
    verifyOtp,
    getSingleUserById
}