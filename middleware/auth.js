import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = ( request, response, next) => {
    try{
        const token = request.header("x-auth-token");
        jwt.verify(token, process.env.SECRET_KEY);
        next();
    }
    catch (err) {
        response.send( { error: err.message } )
    }
  }

export { auth };