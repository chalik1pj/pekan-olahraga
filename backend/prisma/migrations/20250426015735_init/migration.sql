-- CreateEnum
CREATE TYPE "PesertaStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECT');

-- CreateTable
CREATE TABLE "peserta" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "komting" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nowa" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "status" "PesertaStatus" NOT NULL DEFAULT 'PENDING',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),
    "cabang_id" INTEGER NOT NULL,

    CONSTRAINT "peserta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cabang" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL DEFAULT '',
    "participant" INTEGER NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "cabang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "peserta_email_key" ON "peserta"("email");

-- AddForeignKey
ALTER TABLE "peserta" ADD CONSTRAINT "peserta_cabang_id_fkey" FOREIGN KEY ("cabang_id") REFERENCES "cabang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
