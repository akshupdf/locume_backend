import { query } from '../../config/database.js';
const CURRENT_TIMESTAMP = Date.now();

const userDataInsert = async (firstName, lastName, mobileVerficationId, gender, availability, medicalId, location, specialization, hourlyRate) => {
    const formattedArray = availability.map(item => `'${item}'`).join(',');
    const userQuery = `
        INSERT INTO users (first_name, last_name, otp_verification_id, gender, availability, medical_id, location, specialization, hourly_rate)
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
        return data

    } catch (error) {
        console.log(error)
    }
}

const getAllDoctors = async () => {
    try {
        const getAllQuery = `
select
	u.id ,
	u.first_name,
	ov.mobile_number,
	u.last_name ,
	u.gender ,
	u.availability ,
	u.medical_id ,
	u."location" ,
	u.specialization ,
	u.hourly_rate ,
	u.otp_verification_id ,
	u.created_at ,
	u.updated_at
from
	users u
left join otp_verification ov on
	ov.id = u.otp_verification_id
        `
        const data = await query(getAllQuery)
        return data.rows

    } catch (error) {
        console.log(error)
    }
}

const getUserDataByOtpVerificationId = async(otpVerficationId) =>{
    try {
        const userGetQuery = `
SELECT
	u.id,
	u.first_name,
	u.last_name,
	u.gender,
	u.availability,
	u.medical_id,
	ov.mobile_number,
	u."location",
	u.specialization,
	u.hourly_rate,
	u.otp_verification_id,
	u.created_at,
	u.updated_at
FROM
	users u
LEFT JOIN otp_verification ov ON
	ov.id = '${otpVerficationId}'
WHERE
	u.otp_verification_id = '${otpVerficationId}'
ORDER BY
	u.last_name ASC;
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
	u.first_name,
	ov.mobile_number,
	u.id ,
	u.last_name ,
	u.gender ,
	u.availability ,
	u.medical_id ,
	u."location" ,
	u.specialization ,
	u.hourly_rate ,
	u.otp_verification_id ,
	u.created_at ,
	u.updated_at 
from
	users u
left join otp_verification ov on
        u.otp_verification_id = ov.id
where
	u.id = '${id}'
        `
       return await query(getUserQuery)
        
    } catch (error) {
        console.log(error)
    }
}

const userEditProfileService = async (firstName, lastName, gender, availability, medicalId, location,specialization, hourlyRate, totalExp, ownClinic, clinicTimeSlot,clinicLocation, idealNumber, preferredSpecialities, visitHospital,visitHospitalSlot, hospitalLocation, userId) => {
    try {
        const aval = availability && availability.length > 0 ? `'${availability.join("','")}'` : null;
        const clinicTimeSlotArray = clinicTimeSlot && clinicTimeSlot.length > 0 ? `'${clinicTimeSlot.join("','")}'` : null;
        const specializationArray = preferredSpecialities && preferredSpecialities.length > 0 ? `'${preferredSpecialities.join("','")}'` : null;
        const visitHospitalTime = visitHospitalSlot && visitHospitalSlot.length > 0 ? `'${visitHospitalSlot.join("','")}'` : null;

        const editProfileQuery = `
            UPDATE users
            SET
                first_name = '${firstName}',
                last_name = '${lastName}',
                gender = '${gender}',
                availability = ARRAY[${aval}],
                medical_id = '${medicalId}',
                location = '${location}',
                specialization = '${specialization}',
                hourly_rate = '${hourlyRate}',
                total_exp = '${totalExp}',
                own_clinic = '${ownClinic}',
                clinic_time_slot = ARRAY[${clinicTimeSlotArray}],
                clinic_location = '${clinicLocation}',
                ideal_number = '${idealNumber}',
                preferred_specialities = ARRAY[${specializationArray}],
                visit_hospital = '${visitHospital}',
                visit_hospital_slot = ARRAY[${visitHospitalTime}],
                hospital_location = '${hospitalLocation}'
            WHERE
                id = '${userId}';
        `
        await query(editProfileQuery);

    } catch (error) {
        console.error(error);
        throw new Error('Failed to update user profile.');
    }
};


export default {
    userDataInsert,
    getUserDataById,
    getAllDoctors,
    sendOtpForRegisterService,
    getUserDataByOtpVerificationId,
    userEditProfileService,
    getSingleUserByUserId
}