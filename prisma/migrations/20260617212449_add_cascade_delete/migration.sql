-- DropForeignKey
ALTER TABLE "temp_channel" DROP CONSTRAINT "temp_channel_source_channel_id_fkey";

-- AddForeignKey
ALTER TABLE "temp_channel" ADD CONSTRAINT "temp_channel_source_channel_id_fkey" FOREIGN KEY ("source_channel_id") REFERENCES "source_channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
