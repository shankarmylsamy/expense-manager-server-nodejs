import express from "express";
import { client } from "../index.js";
// import { auth } from "../middleware/auth.js";

const router = express.Router();

router.route("/").put(async (request, response) => {
    console.log('settings');
    const setting = request.body;
    const result = await client
        .db("expenseManager")
        .collection("settings")
        .updateOne({ userName: setting.userName }, { $set: setting });
    response.send({ message: "Details updated successfully !!!" });
});

router.route("/").get(async (request, response) => {
    const result = await client
        .db("expenseManager")
        .collection("settings")
        .find()
        .toArray();
    response.send(result);
});


export const settingsRouter = router;