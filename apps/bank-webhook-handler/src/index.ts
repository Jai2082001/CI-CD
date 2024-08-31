import express from "express";
import db from "@repo/db/client";
import bodyParser from "body-parser";
const app = express();


app.use(bodyParser())
app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?

    console.log(req.body)
    const paymentInformation = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };



    try {

        let user = await db.balance.findMany({
            where: {
                userId: Number(paymentInformation.userId)
            }
        })
        console.log(user);
        if (user.length > 0) {
            console.log('balance exist ')
            await db.$transaction([
                db.balance.updateMany({
                    where: {
                        userId: Number(paymentInformation.userId)
                    }, data: {
                        amount: {
                            // You can also get this from your DB
                            increment: Number(paymentInformation.amount)
                        }
                    }
                }),
                db.onRampTransaction.updateMany({
                    where: {
                        token: paymentInformation.token
                    },
                    data: {
                        status: "Success",
                    }
                })
            ]);

            res.json({
                message: 'Captured'
            })
        }else{
            console.log('balance not exist ')
            await db.$transaction([
                db.balance.create({
                  data: {
                    amount: Number(paymentInformation.amount),
                    userId: paymentInformation.userId,
                    locked: 0
                  }  
                }),
                
                db.onRampTransaction.updateMany({
                    where: {
                        token: paymentInformation.token
                    },
                    data: {
                        status: "Success",
                    }
                })
            ]);

            res.json({
                message: 'Captured'
            })
            
        }


    } catch (erro) {
        console.log(erro);
        res.status(411).json({
            message: "Error in the transactions "
        })
    }
    // Update balance in db, add txn
})


app.listen(3003, () => {
    console.log('Connected')
})