"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOnRampTransaction(provider: string, amount: number) {
    // Ideally the token should come from the banking provider (hdfc/axis)
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request"
        }
    }
    const token = (Math.random() * 1000).toString();
    await prisma.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            startTime: new Date(),
            token: token,
            userId: Number(session?.user?.id),
            amount: amount * 100
        }
    });

    setTimeout(() => {
        const reqBody = JSON.stringify({
            token: token,
            user_identifier: Number(session.user.id),
            amount: amount * 100
        })
        console.log(reqBody);
        fetch('http://localhost:3003/hdfcWebhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: reqBody
            
        }).then((response) => {
            return response.json();
        }).then((response) => {
            console.log(response);
        })


    }, 10000)

    return {
        message: "Done"
    }
}
