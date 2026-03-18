import prisma from './prisma'
import bcrypt from 'bcryptjs';

export async function checkRoomAccess(params: { roomId: string; studentId: string; password: string }) {
    const { roomId, studentId, password } = params;

    try {
        console.log({ roomId, studentId, password });
        // Find room by roomname
        const room = await prisma.rooms.findUnique({
            where: { roomname: roomId },
            select: { id: true, password: true, title: true, allowedaccess: true, roomname: true }
        });

        console.log("db reply:", room);

        if (!room) {
            return null
        }

        // Compare password
        console.log(room.password);
        console.log(password);
        const isValid = await bcrypt.compare(password, room.password);
        console.log("isValid:", isValid);
        if (!isValid) {
            return null;
        }

        return room;
    } catch (error) {
        return null;
    }

}
