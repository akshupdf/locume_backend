import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: 'postgres',
  host: 'locumedb.csma0nyjaqdr.ap-south-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'ABDyzpLJE4yAa3QS28YU',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

export const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
    await createTables()
  } catch (error) {
    console.error('Failed to connect to the database', error.message);
    throw error;
  }
};
export const query = (text) => pool.query(text);

const createTables = async () => {
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          gender VARCHAR(100) NOT NULL,
          availability TEXT [],
          medical_id VARCHAR(100) NOT NULL,
          location VARCHAR(100) NOT NULL,
          specialization VARCHAR(100) NOT NULL,
          hourly_rate INT NOT NULL,
          otp_verification_id INT UNIQUE NOT NULL,
          total_exp INT,
          own_clinic BOOLEAN DEFAULT false,
          clinic_time_slot INT[] DEFAULT '{}',
          clinic_location VARCHAR(100),
          ideal_number VARCHAR(100),
          preferred_specialities INT[] DEFAULT '{}',
          visit_hospital BOOLEAN DEFAULT false,
          visit_hospital_slot INT[] DEFAULT '{}',
          hospital_location VARCHAR(100) DEFAULT null,
          profile_image VARCHAR(100) DEFAULT null,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);



      await query(`
        CREATE TABLE IF NOT EXISTS otp_verification(
        id SERIAL PRIMARY KEY,
        mobile_number BIGINT  UNIQUE NOT NULL,
        otp INT,
        otp_expired_time BIGINT,
        otp_verification Boolean default false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `)
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Error creating tables', error);
      throw error;
    }
  };
  