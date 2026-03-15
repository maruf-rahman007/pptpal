import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  const session = await getServerSession(authOptions)

  const room = await prisma.rooms.findUnique({
    where: { id: params.id },
    include: {
      allPPTs: true
    }
  })

  if (!room) {
    return NextResponse.json(
      { error: "Room not found" },
      { status: 404 }
    )
  }

  const role =
    session?.user?.id === room.userId
      ? "owner"
      : "guest"

  return NextResponse.json({
    room,
    files: room.allPPTs,
    role
  })
}

//post files add
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  const session = await getServerSession(authOptions)

  const body = await req.json()

  const { url, name, uploaderId } = body

  const room = await prisma.rooms.findUnique({
    where: { id: params.id }
  })

  if (!room) {
    return NextResponse.json(
      { error: "Room not found" },
      { status: 404 }
    )
  }

  const file = await prisma.pPT.create({
    data: {
      url,
      name,
      roomId: params.id,
      sId: uploaderId || session?.user?.id || "guest"
    }
  })

  return NextResponse.json(file)
}

//delete file only owner 

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  const session = await getServerSession(authOptions)

  const body = await req.json()
  const { pptId } = body

  const ppt = await prisma.pPT.findUnique({
    where: { id: pptId },
    include: { room: true }
  })

  if (!ppt) {
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    )
  }

  if (ppt.room.userId !== session?.user?.id) {
    return NextResponse.json(
      { error: "Not allowed" },
      { status: 403 }
    )
  }

  await prisma.pPT.delete({
    where: { id: pptId }
  })

  return NextResponse.json({ success: true })
}

//delete room only owner 

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  const session = await getServerSession(authOptions)

  const room = await prisma.rooms.findUnique({
    where: { id: params.id }
  })

  if (!room) {
    return NextResponse.json(
      { error: "Room not found" },
      { status: 404 }
    )
  }

  if (room.userId !== session?.user?.id) {
    return NextResponse.json(
      { error: "Not allowed" },
      { status: 403 }
    )
  }

  await prisma.rooms.delete({
    where: { id: params.id }
  })

  return NextResponse.json({ success: true })
}