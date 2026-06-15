-- CreateTable
CREATE TABLE "guild" (
    "id" TEXT NOT NULL,
    "discord_id" VARCHAR(20) NOT NULL,
    "guild_name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_channel" (
    "id" TEXT NOT NULL,
    "discord_id" VARCHAR(20) NOT NULL,
    "channel_name" VARCHAR(100) NOT NULL,
    "name_list" TEXT[],
    "guild_id" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "source_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temp_channel" (
    "id" TEXT NOT NULL,
    "discord_id" VARCHAR(20) NOT NULL,
    "channel_name" VARCHAR(100) NOT NULL,
    "source_channel_id" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "temp_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "welcome_config" (
    "id" TEXT NOT NULL,
    "welcome_channel_id" VARCHAR(20) NOT NULL,
    "welcome_channel_name" VARCHAR(100) NOT NULL,
    "background_image_url" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "hex_color" VARCHAR(7),
    "welcome_message" VARCHAR(500),
    "guild_id" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "welcome_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guild_discord_id_key" ON "guild"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "source_channel_discord_id_key" ON "source_channel"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "temp_channel_discord_id_key" ON "temp_channel"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "welcome_config_guild_id_key" ON "welcome_config"("guild_id");

-- AddForeignKey
ALTER TABLE "source_channel" ADD CONSTRAINT "source_channel_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temp_channel" ADD CONSTRAINT "temp_channel_source_channel_id_fkey" FOREIGN KEY ("source_channel_id") REFERENCES "source_channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "welcome_config" ADD CONSTRAINT "welcome_config_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
