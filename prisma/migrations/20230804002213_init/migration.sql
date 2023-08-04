-- CreateTable
CREATE TABLE "Dinosaur" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genus" TEXT,
    "species" TEXT,
    "description" TEXT,
    "hasFeathers" BOOLEAN NOT NULL DEFAULT true,
    "weightInKilos" DOUBLE PRECISION NOT NULL,
    "heightInMeters" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "trivia" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dinosaur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dinosaur_name_key" ON "Dinosaur"("name");
