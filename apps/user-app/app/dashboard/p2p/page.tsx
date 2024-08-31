import TrasnferForm from "../../../component/TrasnferForm";
import { BalanceCard } from "../../../component/BalanceCard";
import { OnRampTransactions } from "../../../component/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import P2PHistory from "../../../component/P2PHistory";


export default async function () {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)

        }
    });



    return (
        <>
            <div>P2P page</div>
            <TrasnferForm />
            <div>
                <BalanceCard amount={balance?.amount || 0} locked={balance?.locked || 0} />
                <div className="pt-4">
                <P2PHistory></P2PHistory>
                </div>
            </div>
        </>
    )
}