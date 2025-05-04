import { client } from "../index.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

const genPassword = async (password) => {
    const rounds = 10;
    const salt = await bcrypt.genSalt(rounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

router.route("/signup").post(async (request, response) => {
    const { email, password } = request.body;
    console.log(email, password);
    const hashedPassword = await genPassword(password);
    const result = await client.db("b28wd").collection("user").insertOne({ email, "password": hashedPassword });
    response.send(result);
})

router.route("/login").post(async (request, response) => {
    const { email, password } = request.body;
    console.log(email, password);
    const userFromDb = await client.db("b28wd").collection("user").findOne({ email : email });
    const storedPassword = userFromDb.password;
    const isPasswordMatch = await bcrypt.compare(password, storedPassword);
    if (isPasswordMatch === true) {
        const token = jwt.sign({ id: userFromDb._id }, process.env.SECRET_KEY);
        response.send({ message: "Login Successful", token: token });
    }
    else {
        response.send({ message: "Invalid Credentials" })
    }
})

export const userRouter = router;
