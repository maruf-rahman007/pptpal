import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../lib/auth"
import prisma from "../../lib/prisma"
import crypto from "crypto"

async function generateUniqueRoomname(base: string) {
  const clean = base.toString().trim().slice(0, 100) || "room"
  let candidate = clean
  let attempt = 0
  while (await prisma.rooms.findUnique({ where: { roomname: candidate } })) {
    attempt += 1
    candidate = `${clean}-${attempt}-${crypto.randomBytes(3).toString("hex")}`
    if (attempt >= 10) break
  }
  return candidate
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  console.log("GET Session ID:", session?.user?.id)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const rooms = await prisma.rooms.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        roomname: true,
        password: true,
        allowedaccess: true,
        userId: true,
      },
    })
    return NextResponse.json({ rooms }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

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
    const password = body.roompassword || crypto.randomUUID().slice(0, 8)
    const allowedaccess = Array.isArray(body.allowedaccess) 
      ? body.allowedaccess 
      : [session.user.email!]

    const room = await prisma.rooms.create({
      data: {
        roomname,
        password,
        allowedaccess,
        userId: session.user.id,  // ✅ Now exists in DB
      },
      select: {
        id: true,
        roomname: true,
        password: true,
        allowedaccess: true,
      },
    })

    console.log("✅ Room created:", room.id)
    return NextResponse.json({ room }, { status: 201 })
  } catch (error: any) {
    console.error("🚨 POST ERROR:", error.code, error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

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
