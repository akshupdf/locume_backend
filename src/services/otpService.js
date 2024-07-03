import { query } from '../config/database.js';
const CURRENT_TIMESTAMP = Date.now();

const checkUserMobileExistOrOtpVerificationOrNot = async(mobile_number)=>{
    try {
        const checkMobileNumberQuery = `
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM otp_verification 
            WHERE mobile_number = '${mobile_number}'
        ) 
        THEN (
            SELECT id
            FROM otp_verification 
            WHERE mobile_number = '${mobile_number}'
            LIMIT 1
        )
        ELSE NULL
    END AS id,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM otp_verification 
            WHERE mobile_number = '${mobile_number}'
        ) 
        THEN (
            SELECT otp_verification
            FROM otp_verification 
            WHERE mobile_number = '${mobile_number}'
            LIMIT 1
        )
        ELSE NULL
    END AS otp_verification;

        ` 
      const data = await query(checkMobileNumberQuery)
      return data.rows[0];
        
    } catch (error) {
        console.log(error)
    }
}


const updateOtp = async(id,otp)=>{
    try {
        const expiryTime = CURRENT_TIMESTAMP + (5 * 60 * 1000)
        const updateOtpQuery = `
        UPDATE otp_verification
        SET otp = '${otp}' , otp_expired_time = '${expiryTime}'
        WHERE id = '${id}';
        `
        await query(updateOtpQuery)
        
    } catch (error) {
        console.log(error)
    }
}


const changeOtpVerificationStatus = async(id) =>{
    try {
        const updateOtpQuery = `
        UPDATE otp_verification
        SET otp = ${null} , otp_expired_time = ${null} , otp_verification = ${true}
        WHERE id = '${id}';
        `
        await query(updateOtpQuery)
        
    } catch (error) {
        console.log(error)
    }
}

const getOtpVerificationDataByMobileNumber = async(mobile_number) =>{
    try {
        const getDataQuery = `
        select ov.id,ov.otp, ov.otp_expired_time ,ov.otp_verification from otp_verification ov where ov.mobile_number = '${mobile_number}'
        `
        const data = await query(getDataQuery)
        return data.rows[0];
        
    } catch (error) {
        console.log(error)
    }
}


const checkMobileNumberVerifyORNotById = async(id) =>{
    try {
        const selectVerificationData = `
        select ov.otp_verification,ov.id from otp_verification ov where ov.id = '${id}'
        `
        const data = await query(selectVerificationData)
        return data.rows[0];
    } catch (error) {
        console.log(error)
    }
}

const removeOtpDataFromVerification = async(id)=>{
    try {
        const updateOtpQuery = `
        UPDATE otp_verification
        SET otp = ${null} , otp_expired_time = ${null} , otp_verification = ${true}
        WHERE id = '${id}';
        `
        await query(updateOtpQuery)
        
    } catch (error) {
        console.log(error)
    }
}

export default {
    checkUserMobileExistOrOtpVerificationOrNot,
    updateOtp,
    getOtpVerificationDataByMobileNumber,
    changeOtpVerificationStatus,
    checkMobileNumberVerifyORNotById,
    removeOtpDataFromVerification
}