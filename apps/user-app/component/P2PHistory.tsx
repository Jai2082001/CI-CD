import { Card } from "@repo/ui/card"
import { getp2pTransactions } from "../app/lib/actions/p2ptransactions"

export default async function  ()  {
    type p2ptransfer = {
        id: Number,
        amount: Number, 
        timestamp: Date,
        fromUserId: Number,
        toUserId: Number,
        status?: String
    }

    const transactions = await getp2pTransactions();
    console.log(transactions);

    return <Card title="Recent Transactions">
    <div className="pt-2">
        {transactions.map((t: p2ptransfer) => <div className="flex justify-between">
            <div>
                <div className="text-sm">
                    {t.status}
                </div>
                <div className="text-slate-600 text-xs">
                    {t.timestamp.toDateString()}
                </div>
            </div>
            <div className="flex flex-col justify-center">
                + Rs {String(t.amount)}
            </div>
    

        </div>)}
    </div>
</Card>
}