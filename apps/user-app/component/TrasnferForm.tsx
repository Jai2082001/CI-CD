'use client'

import { p2pTransfer } from "../app/lib/actions/p2ptransactions";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/Textinput";
import {useState} from 'react'
import { Button } from "@repo/ui/button";

export default  function() {
    
    const [phoneNumber, setPhoneNumer] = useState('');
    const [amount, setAmount] = useState('');

    return <Card title='P2P transfer'>
        <div className="w-full">
        <TextInput label='Phone Number' onChange={(e)=>{setPhoneNumer(e)}} placeholder="Number"></TextInput>
        <TextInput label='Amount' onChange={(e)=>{setAmount(e)}} placeholder="Number"></TextInput>
        <Button onClick={async ()=>{
           await p2pTransfer(phoneNumber, Number(amount));
        }}>Click me</Button>
        </div>
    </Card>
}