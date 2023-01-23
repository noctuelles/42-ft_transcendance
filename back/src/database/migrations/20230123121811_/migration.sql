-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ONLINE', 'OFFLINE', 'PLAYING');

-- CreateEnum
CREATE TYPE "UserOnChannelRole" AS ENUM ('OPERATOR', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "UserOnChannelStatus" AS ENUM ('REGULAR', 'MUTED', 'BANNED');

-- CreateEnum
CREATE TYPE "UserChannelVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'PWD_PROTECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ONLINE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnChannel" (
    "userId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "UserOnChannelRole" NOT NULL DEFAULT 'USER',
    "status" "UserOnChannelStatus" NOT NULL DEFAULT 'REGULAR',
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "UserOnChannel_pkey" PRIMARY KEY ("userId","channelId")
);

-- CreateTable
CREATE TABLE "UserChannel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" "UserChannelVisibility" NOT NULL DEFAULT 'PUBLIC',
    "password" TEXT,
    "name" TEXT,

    CONSTRAINT "UserChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "playedMatches" INTEGER NOT NULL DEFAULT 0,
    "wonMatches" INTEGER NOT NULL DEFAULT 0,
    "picture" TEXT NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "bounces" INTEGER NOT NULL,
    "userOneId" INTEGER NOT NULL,
    "userTwoId" INTEGER NOT NULL,
    "winnerId" INTEGER NOT NULL,
    "looserId" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthIdentifier" (
    "identifier" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AuthIdentifier_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "_UserFriends" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_profileId_key" ON "User"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "UserChannel_id_key" ON "UserChannel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_id_key" ON "UserProfile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Match_id_key" ON "Match"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AuthIdentifier_identifier_key" ON "AuthIdentifier"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFriends_AB_unique" ON "_UserFriends"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFriends_B_index" ON "_UserFriends"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnChannel" ADD CONSTRAINT "UserOnChannel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnChannel" ADD CONSTRAINT "UserOnChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "UserChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userOneId_fkey" FOREIGN KEY ("userOneId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userTwoId_fkey" FOREIGN KEY ("userTwoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_looserId_fkey" FOREIGN KEY ("looserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthIdentifier" ADD CONSTRAINT "AuthIdentifier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFriends" ADD CONSTRAINT "_UserFriends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFriends" ADD CONSTRAINT "_UserFriends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
