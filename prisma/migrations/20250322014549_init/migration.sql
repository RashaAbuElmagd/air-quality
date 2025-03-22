-- CreateTable
CREATE TABLE "air_quality" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "location" JSONB NOT NULL,
    "pollution" JSONB NOT NULL,
    "weather" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "air_quality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "air_quality_city_idx" ON "air_quality"("city");
