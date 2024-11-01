-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rooms" (
    "id" TEXT NOT NULL,
    "roomname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "allowedaccess" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PPT" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "PPT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_roomname_key" ON "Rooms"("roomname");

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PPT" ADD CONSTRAINT "PPT_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
