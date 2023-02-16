-- CreateEnum
CREATE TYPE "MathInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'PLAYING', 'FINISHED');

-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('RANKED', 'FUN');

-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('NEW_SUBJECT', 'WHEATLEY', 'P_BODY', 'GLADOS', 'APPRENTICE', 'LEARNER', 'EXPERT', 'STREAKER', 'MASTER_STREAKER', 'BOUNCER', 'PROFFESIONAL_BOUNCER', 'CHAMPION', 'MASTER', 'LEGEND', 'PORTALS_USER', 'PORTALS_ADDICT', 'ENDURANT', 'SEMI_MARATHON', 'MARATHON');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ONLINE', 'OFFLINE', 'PLAYING');

-- CreateEnum
CREATE TYPE "UserOnChannelRole" AS ENUM ('OPERATOR', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "UserOnChannelStatus" AS ENUM ('CLEAN', 'MUTED', 'BANNED');

-- CreateEnum
CREATE TYPE "UserChannelVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'PWD_PROTECTED', 'PRIVATE_MESSAGE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "otpSecret" TEXT,
    "profileId" INTEGER NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ONLINE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnChannel" (
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,
    "role" "UserOnChannelRole" NOT NULL DEFAULT 'USER',
    "status" "UserOnChannelStatus" NOT NULL DEFAULT 'CLEAN',
    "statusEnd" TIMESTAMP(3),
    "lastReadedMessage" INTEGER NOT NULL DEFAULT -1,

    CONSTRAINT "UserOnChannel_pkey" PRIMARY KEY ("userId","channelId")
);

-- CreateTable
CREATE TABLE "UserChannelInvitation" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channelId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserChannelInvitation_pkey" PRIMARY KEY ("channelId","userId")
);

-- CreateTable
CREATE TABLE "MessageOnChannel" (
    "id" SERIAL NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "channelId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "userOnChannelUserId" INTEGER,
    "userOnChannelChannelId" INTEGER,

    CONSTRAINT "MessageOnChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChannel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" "UserChannelVisibility" NOT NULL DEFAULT 'PUBLIC',
    "password" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "UserChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "elo" INTEGER NOT NULL DEFAULT 1000,
    "wonMatches" INTEGER NOT NULL DEFAULT 0,
    "lostMatches" INTEGER NOT NULL DEFAULT 0,
    "picture" TEXT NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" SERIAL NOT NULL,
    "type" "AchievementType" NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "bestProgress" INTEGER NOT NULL DEFAULT 0,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" TIMESTAMP(3),
    "userProfileId" INTEGER NOT NULL,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnMatch" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "xpAtBeg" INTEGER NOT NULL,
    "xpEarned" INTEGER NOT NULL,
    "eloAtBeg" INTEGER NOT NULL,
    "eloEarned" INTEGER NOT NULL,
    "winner" BOOLEAN,
    "bounces" INTEGER NOT NULL DEFAULT 0,
    "portalsUsed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserOnMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchInvitation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "status" "MathInvitationStatus" NOT NULL DEFAULT 'PENDING',
    "messageId" INTEGER,

    CONSTRAINT "MatchInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "userOneOnMatchId" INTEGER NOT NULL,
    "userTwoOnMatchId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "type" "MatchType" NOT NULL,

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

-- CreateTable
CREATE TABLE "_UserBlocked" (
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
CREATE UNIQUE INDEX "UserChannel_name_key" ON "UserChannel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_id_key" ON "UserProfile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MatchInvitation_createdById_key" ON "MatchInvitation"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "MatchInvitation_messageId_key" ON "MatchInvitation"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_userOneOnMatchId_key" ON "Match"("userOneOnMatchId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_userTwoOnMatchId_key" ON "Match"("userTwoOnMatchId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_id_key" ON "Match"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AuthIdentifier_identifier_key" ON "AuthIdentifier"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFriends_AB_unique" ON "_UserFriends"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFriends_B_index" ON "_UserFriends"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserBlocked_AB_unique" ON "_UserBlocked"("A", "B");

-- CreateIndex
CREATE INDEX "_UserBlocked_B_index" ON "_UserBlocked"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnChannel" ADD CONSTRAINT "UserOnChannel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnChannel" ADD CONSTRAINT "UserOnChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "UserChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChannelInvitation" ADD CONSTRAINT "UserChannelInvitation_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "UserChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChannelInvitation" ADD CONSTRAINT "UserChannelInvitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageOnChannel" ADD CONSTRAINT "MessageOnChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "UserChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageOnChannel" ADD CONSTRAINT "MessageOnChannel_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageOnChannel" ADD CONSTRAINT "MessageOnChannel_userOnChannelUserId_userOnChannelChannelI_fkey" FOREIGN KEY ("userOnChannelUserId", "userOnChannelChannelId") REFERENCES "UserOnChannel"("userId", "channelId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnMatch" ADD CONSTRAINT "UserOnMatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchInvitation" ADD CONSTRAINT "MatchInvitation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchInvitation" ADD CONSTRAINT "MatchInvitation_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "MessageOnChannel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userOneOnMatchId_fkey" FOREIGN KEY ("userOneOnMatchId") REFERENCES "UserOnMatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userTwoOnMatchId_fkey" FOREIGN KEY ("userTwoOnMatchId") REFERENCES "UserOnMatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthIdentifier" ADD CONSTRAINT "AuthIdentifier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFriends" ADD CONSTRAINT "_UserFriends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFriends" ADD CONSTRAINT "_UserFriends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserBlocked" ADD CONSTRAINT "_UserBlocked_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserBlocked" ADD CONSTRAINT "_UserBlocked_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
