import { NextResponse } from "next/server";


export async function POST(req: Request) {

    const { roomname, roompassword } = await req.json();
    console.log("Post Request for New Room");
    console.log("Here is room name " + roomname + " Here is the password :"+roompassword);
    
    return NextResponse.json({
        message:"Done"
    },
    {
        status:200
    }
)
}