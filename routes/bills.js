import { client } from "../index.js";
import express from "express";
import { auth } from "../middleware/auth.js";
import { ObjectID } from "mongodb";

const router = express.Router();


router.route("/").get(async (request, response) => {
    const data = await client
        .db("b28wd")
        .collection("bills")
        .find({})
        .toArray();
    response.send(data);
});

router.route("/:id").get(async (request, response) => {
    const { id } = request.params;
    const movies = await client
        .db("b28wd")
        .collection("bills")
        .findOne({ _id: new ObjectID(id) });
    movies ? response.send(movies) : response.send("No bills found!!!");
});

router.route("/").post(async (request, response) => {
    const bill = request.body;
    const result = await client
        .db("b28wd")
        .collection("bills")
        .insertOne(bill);
    response.send(result);
});

router.route("/:id").delete(async (request, response) => {
    const { id } = request.params;
    const deleteBill = await client
        .db("b28wd")
        .collection("bills")
        .deleteOne({ _id: new ObjectID(id) });
    response.send(deleteBill);
});

router.route("/:id").put(async (request, response) => {
    const { id } = request.params;
    const data = request.body;
    const updateBill = await client
        .db("b28wd")
        .collection("bills")
        .updateOne({ _id: new ObjectID(id) }, { $set: data });
    const result = await client
        .db("b28wd")
        .collection("bills")
        .findOne({ _id: new ObjectID(id) });
    response.send(result);
})

export const billsRouter = router; 
