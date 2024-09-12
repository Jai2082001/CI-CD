"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

type p2ptransfer = {
    id: Number,
    amount: Number, 
    timestamp: Date,
    fromUserId: Number,
    toUserId: Number,
    status: String
}

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return {
            message: "Error while sending"
        }
    }
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });

    if (!toUser) {
        return {
            message: "User not found"
        }
    }
    await prisma.$transaction(async (tx) => {

        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;


        const fromBalance = await tx.balance.findUnique({
            where: { userId: Number(from) },
        });


        if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient funds');
        }

        await tx.balance.update({
            where: { userId: Number(from) },
            data: { amount: { decrement: amount } },
        });

        const response = await tx.balance.findFirst({
            where: {
                userId: toUser.id
            }
        })

        if (response) {
            await tx.balance.update({
                where: { userId: toUser.id },
                data: { amount: { increment: amount } },
            });

        } else {
            await tx.balance.create({
                data: {
                    userId: toUser.id,
                    amount: amount,
                    locked: 0
                }
            })

        }

        await tx.p2pTransfer.create({
            data: {
                amount: amount,
                timestamp: new Date(),
                fromUserId: Number(from),
                toUserId: toUser.id
            }
        });


    });
}

export async function getp2pTransactions() {
    const session = await getServerSession(authOptions);
    const id = Number(session?.user?.id);

    const p2pTransfers = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: id },
                { toUserId: id }
            ]
        },
        orderBy: {
            timestamp: 'asc'
        }
    })
    
    // @ts-ignore
    p2pTransfers.map((single: p2ptransfer )=>{
        if(single.fromUserId == id) {

            single.status = 'Sent'
        }else{
            single.status = 'Received'
        }
    })
    
    console.log(p2pTransfers)
    return p2pTransfers 


}