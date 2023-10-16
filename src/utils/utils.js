import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const  KEY ="coderUser"

export const createHash = password=>bcrypt.hashSync(password,bcrypt.genSaltSync(10));
export const isValidatePassword =(user,password)=> bcrypt.compareSync(password,user.password);

export const generateToken =(user)=>{
    const token= jwt.sign({user},KEY,{expiresIn:'12h'})
    return token
}

export const authToken=(req,res,next)=>{
    const headerAuth =req.headers.authorization;
    if(!headerAuth) return res.status(401).send({status:"error",error:"No esta autorizado"})
    console.log(headerAuth);
    const token= headerAuth.split(' ')[1];

    jwt.verify(token,KEY,(error,credentials)=>{
        console.log(error);
        if(error)  return res.status(401).send({status:"error",error:"No esta autorizado"})
        req.user = credentials.user;
        next();
    })
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;