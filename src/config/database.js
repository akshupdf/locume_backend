import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password:'Shivam@991133',
  port: 5432,
});

export const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
    await createTables()
  } catch (error) {
    console.error('Failed to connect to the database', error);
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
          avilability TEXT [],
          medical_id VARCHAR(100) NOT NULL,
          location VARCHAR(100) NOT NULL,
          specialization VARCHAR(100) NOT NULL,
          hourly_rate INT NOT NULL,
          otp_verification_id INT UNIQUE NOT NULL,
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
  