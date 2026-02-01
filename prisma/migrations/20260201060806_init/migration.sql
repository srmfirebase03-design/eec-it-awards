-- CreateTable
CREATE TABLE "Nominee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uniqueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regNo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Award" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "criteria" TEXT
);

-- CreateTable
CREATE TABLE "Nomination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomineeId" TEXT NOT NULL,
    "awardId" TEXT NOT NULL,
    CONSTRAINT "Nomination_nomineeId_fkey" FOREIGN KEY ("nomineeId") REFERENCES "Nominee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Nomination_awardId_fkey" FOREIGN KEY ("awardId") REFERENCES "Award" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Nominee_uniqueId_key" ON "Nominee"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "Nominee_regNo_key" ON "Nominee"("regNo");

-- CreateIndex
CREATE UNIQUE INDEX "Nominee_email_key" ON "Nominee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Nomination_nomineeId_awardId_key" ON "Nomination"("nomineeId", "awardId");
