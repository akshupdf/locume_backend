import { query } from '../../config/database.js';
const CURRENT_TIMESTAMP = Date.now();

const userDataInsert = async (firstName, lastName, mobileVerficationId, gender, availability, medicalId, location, specialization, hourlyRate) => {
    const formattedArray = availability.map(item => `'${item}'`).join(',');
    const userQuery = `
        INSERT INTO users (first_name, last_name, otp_verification_id, gender, avilability, medical_id, location, specialization, hourly_rate)
        VALUES ('${firstName}', '${lastName}', '${mobileVerficationId}', '${gender}', ARRAY[${formattedArray}], '${medicalId}', '${location}', '${specialization}', '${hourlyRate}');
    `;
    try {
        await query(userQuery)
    } catch (error) {
        console.error('Error inserting user data', error);
        throw error;
    }
};

const getUserDataById = async (id) => {
    try {
        const userQuery = `
        select
	        *
        from
	        users
        where
	    id = '${id}'
        `
        const data = await query(userQuery)
        return data.rows[0]

    } catch (error) {
        console.log(error)
    }
}

const getAllDoctors = async () => {
    try {
        const getAllQuery = `
        select * from users
        `
        const data = await query(getAllQuery)
        return data.rows[0]

    } catch (error) {
        console.log(error)
    }
}

const getUserDataByOtpVerificationId = async(otpVerficationId) =>{
    try {
        const userGetQuery = `
        select * from users u where u.otp_verification_id = '${otpVerficationId}'
        `
        const data = await query(userGetQuery)
        return data.rows[0]
        
    } catch (error) {
        
    }
}


const sendOtpForRegisterService = async (mobile_number, otp) => {
    try {
        const expiryTime = CURRENT_TIMESTAMP + (5 * 60 * 1000)
        const otpQuery = `
        INSERT INTO otp_verification(mobile_number,otp,otp_expired_time)
        VALUES ('${mobile_number}','${otp}' ,'${expiryTime}')
        `
        await query(otpQuery)

    } catch (error) {
        console.log(error)
    }
}


const getSingleUserByUserId = async(id)=>{
    try {
        const getUserQuery = `
        select 
            u.first_name, ov.mobile_number 
        from users u
            left join otp_verficiation on ov
            u.otp_verificaion_id = ov.id
            where u.id = '${id}
        `
        await query(getUserQuery)
        
    } catch (error) {
        console.log(error)
    }
}




export default {
    userDataInsert,
    getUserDataById,
    getAllDoctors,
    sendOtpForRegisterService,
    getUserDataByOtpVerificationId,
    getSingleUserByUserId
}