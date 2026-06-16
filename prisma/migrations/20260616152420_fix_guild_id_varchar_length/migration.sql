-- DropForeignKey
ALTER TABLE "source_channel" DROP CONSTRAINT "source_channel_guild_id_fkey";

-- DropForeignKey
ALTER TABLE "temp_channel" DROP CONSTRAINT "temp_channel_source_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "welcome_config" DROP CONSTRAINT "welcome_config_guild_id_fkey";

-- AlterTable
ALTER TABLE "source_channel" ALTER COLUMN "guild_id" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "temp_channel" ALTER COLUMN "source_channel_id" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "welcome_config" ALTER COLUMN "welcome_channel_id" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "guild_id" SET DATA TYPE VARCHAR(30);

-- AddForeignKey
ALTER TABLE "source_channel" ADD CONSTRAINT "source_channel_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temp_channel" ADD CONSTRAINT "temp_channel_source_channel_id_fkey" FOREIGN KEY ("source_channel_id") REFERENCES "source_channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "welcome_config" ADD CONSTRAINT "welcome_config_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
