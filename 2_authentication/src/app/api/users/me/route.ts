import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { NextResponse, NextRequest } from "next/server"
import { getDataFromToken } from "@/helpers/getDataFromToken"
connect()

export async function POST(request: NextRequest){
    const usesrId =  await getDataFromToken(request)
    const user = await User.findOne({_id: usesrId}).select('-password')
    return NextResponse.json({
        user
    })
}