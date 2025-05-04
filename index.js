import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import { billsRouter } from "./routes/bills.js";
import { settingsRouter } from "./routes/settings.js";
import { userRouter } from "./routes/user.js";
import { auth } from "./middleware/auth.js";

// setup expressJS

export const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Port Connected");
});

app.get("/", (request, response) => {
    response.send("Home Page");
})

//setup mongodb

// const MONGO_URL = "mongodb://localhost";
const MONGO_URL = process.env.MONGO_URL;


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
