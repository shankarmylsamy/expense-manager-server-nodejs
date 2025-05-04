import { client } from "../index.js";
import express from "express";
import { ObjectID } from "mongodb";

const router = express.Router();


router.route("/").get(async (request, response) => {
    const data = await client
        .db("expenseManager")
        .collection("bills")
        .find({})
        .toArray();
    response.send(data);
});

router.route("/:id").get(async (request, response) => {
    const { id } = request.params;
    const bill = await client
        .db("expenseManager")
        .collection("bills")
        .findOne({ _id: new ObjectID(id) });
    bill ? response.send(bill) : response.send("No bills found!!!");
});

router.route("/").post(async (request, response) => {
    const bill = request.body;
    const result = await client
        .db("expenseManager")
        .collection("bills")
        .insertOne(bill);
    response.send(result);
});

router.route("/:id").delete(async (request, response) => {
    const { id } = request.params;
    const deleteBill = await client
        .db("expenseManager")
        .collection("bills")
        .deleteOne({ _id: new ObjectID(id) });
    response.send(deleteBill);
});

router.route("/:id").put(async (request, response) => {
    const { id } = request.params;
    const data = request.body;
    const updateBill = await client
        .db("expenseManager")
        .collection("bills")
        .updateOne({ _id: new ObjectID(id) }, { $set: data });
    const result = await client
        .db("expenseManager")
        .collection("bills")
        .findOne({ _id: new ObjectID(id) });
    response.send(result);
})

router.route("/smsOut").post(async (req, res) => {
    console.log('smsOut called');
    const value = req.body;
    try {
        return new Promise((resolve, reject) => {
            try {
                const data = JSON.stringify({
                    data: {
                        type: 'outbound_messages',
                        attributes: {
                            destination: value.destination,
                            source: value.source,
                            content: value.content
                        }
                    }
                });

                const config = {
                    data,
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://sms-out.didww.com/outbound_messages',
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        Authorization: `Basic ${process.env.SMS_OUT_CREDENTIALS}`
                    }
                };

                axios.request(config)
                    .then((response) => {
                        resolve(response.data);
                    })
                    .catch((error) => {
                        console.log('error', error);
                        resolve(error.response.data);
                    });
            } catch (err) {
                reject(err);
            }
        });
    } catch (err) {
        return res;
    }
})

export const billsRouter = router; 
