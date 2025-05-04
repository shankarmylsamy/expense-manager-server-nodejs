import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import { billsRouter } from "./pages/billsRouter.js";
import { auth } from "./auth.js";
import { userRouter } from "./pages/userRouter.js";

import { settingsRouter } from "./pages/settingsRouter.js";
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config()

export const app = express();
app.use(cors({ origin: "*" }));
// const port = 5000;
const port = process.env.PORT || 5000;
// const MONGO_URL = "mongodb://localhost";
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());


app.listen(port, () => console.log(`Server is listening on Port no : ${port}`));

app.get("/", (request, response) => {
    response.send("Home Page");
})

async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Client Connected");
    return client;
}

export const client = await createConnection();
// setup routes
app.use("/bills", auth, billsRouter);
app.use("/settings", auth, settingsRouter);
app.use("/user", userRouter);
app.use("/contact", auth, (req, res) => res.send({ result: "Token Validated" }));
