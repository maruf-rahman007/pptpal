import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../lib/auth"
import prisma from "../../lib/prisma"
import bcrypt from "bcryptjs";


// checks if similar room names exists or not

function shortRandom6() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

async function generateUniqueRoomname(base: string) {
  const clean = base.toString().trim().slice(0, 100) || "room"
  let candidate = clean
  let attempt = 0
  while (await prisma.rooms.findUnique({ where: { roomname: candidate } })) {
    attempt += 1
    candidate = shortRandom6();
    if (attempt >= 10) break
  }
  return candidate
}


// When the user is authenticated and goes to dashboard this api fetches all the rooms he created 

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  console.log("GET Session ID:", session?.user?.id)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  try {
    const rooms = await prisma.rooms.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        title:true,
        id: true,
        roomname: true,
        password: true,
        allowedaccess: true,
        userId: true,
      },
    })
    console.log("GET Rooms:", rooms);
    return NextResponse.json({ rooms }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}


// When the user is authenticated and goes to dashboard this api is hitted by user when he wants to create a new room

export async function POST(req: NextRequest) {
  console.log("POST /api/room")
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    console.log("POST body:", body)

    const roomname = await generateUniqueRoomname(body.roomname || "Untitled")
    const plainPassword = body.roompassword
    const password = await bcrypt.hash(plainPassword, 10)
    const title = body.roomtitle

    const allowedaccess = Array.isArray(body.allowedaccess) 
      ? body.allowedaccess 
      : [session.user.email!]

    const room = await prisma.rooms.create({
      data: {
        title,
        roomname,
        password,
        allowedaccess,
        userId: session.user.id,
      },
      select: {
        title: true,
        id: true,
        roomname: true,
        password: true,
        allowedaccess: true,
      },
    })

    console.log("Room created:", room.id)
    return NextResponse.json({ room }, { status: 201 })
  } catch (error: any) {
    console.error("POST ERROR:", error.code, error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


// TODO api this 2
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { id, roomname, roompassword } = body

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  try {
    const room = await prisma.rooms.findUnique({ where: { id } })
    if (!room || room.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or forbidden" }, { status: 403 })
    }

    const data: any = {}
    if (roomname !== undefined) data.roomname = await generateUniqueRoomname(roomname)
    if (roompassword !== undefined) data.password = roompassword

    const updated = await prisma.rooms.update({
      where: { id },
      data,
    })

    return NextResponse.json({ room: updated }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}




export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { id } = body

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  try {
    const room = await prisma.rooms.findUnique({ where: { id } })
    if (!room || room.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or forbidden" }, { status: 403 })
    }

    await prisma.rooms.delete({ where: { id } })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
