import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {

    console.log(req.headers)

    return NextResponse.json({message: 'captured'})
}