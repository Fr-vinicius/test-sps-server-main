import dotenv from "dotenv";

dotenv.config();

const keys = {
  Port: process.env.PORT,
  Jwt_Key: process.env.JWT_KEY,
};

console.log(keys.Port);
export default keys;
