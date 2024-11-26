-- CreateEnum
CREATE TYPE "AgeRange" AS ENUM ('INFANT', 'JUVENILE', 'ADULT', 'SENIOR');

-- CreateEnum
CREATE TYPE "Size" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "EnergyLevel" AS ENUM ('VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "IndependencyLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH');

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "age_range" "AgeRange" NOT NULL,
    "size" "Size" NOT NULL,
    "environment_size" "Size" NOT NULL,
    "energy_level" "EnergyLevel" NOT NULL,
    "independency_level" "IndependencyLevel" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "org_id" TEXT NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
