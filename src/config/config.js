import dotenv from "dotenv"

dotenv.config();

const CONFIG ={
	MONGO_URI: process.env.MONGO_URI || '',
	PORT : process.env.PORT || 8080,
    SECRET_SESSION : process.env.SECRET_SESSION || 's3cr3tKey',
    CLIENT_ID: process.env.CLIENT_ID || '',
    CLIENT_SECRET: process.env.CLIENT_SECRET || '',
    CALLBACK_URL: process.env.CALLBACK_URL || '',
    EMAIL_ADMIN: process.env.EMAIL_ADMIN || '',
    PASSWORD_ADMIN: process.env.PASSWORD_ADMIN || ''
}

export default  CONFIG;
