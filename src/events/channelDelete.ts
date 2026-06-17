import { Events } from "discord.js";
import type { Event } from "../types/event.js";
import { prisma } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";

const event: Event<Events.ChannelDelete> = {
  name: Events.ChannelDelete,
  async execute(channel) {
    if (!("guildId" in channel) || !channel.guildId) return;

    const deleted = await prisma.sourceChannel.deleteMany({
      where: { discordId: channel.id },
    });

    if (deleted.count > 0) {
      logger.info(`Cleaned up source channel ${channel.id} after manual deletion`);
    }
  },
};

export default event;
