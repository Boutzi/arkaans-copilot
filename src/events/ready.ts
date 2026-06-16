import { logger } from "../utils/logger.js";
import type { Event } from "../types/event.js";
import { Events } from "discord.js";
import { prisma } from "../utils/prisma.js";

const event: Event<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,

  async execute(readyClient) {
    logger.info(`Logged in as ${readyClient.user.tag}!`);

    let deleted = 0;

    const tempChannels = await prisma.tempChannel.findMany({
      include: {
        sourceChannel: {
          include: {
            guild: true,
          },
        },
      },
    });

    for (const tempChannel of tempChannels) {
      const guild = readyClient.guilds.cache.get(tempChannel.sourceChannel.guild.discordId);

      if (!guild) {
        await prisma.tempChannel.delete({ where: { discordId: tempChannel.discordId } });
        continue;
      }

      const discordChannel = guild.channels.cache.get(tempChannel.discordId);

      if (!discordChannel) {
        await prisma.tempChannel.delete({ where: { discordId: tempChannel.discordId } });
        continue;
      }

      if (discordChannel.isVoiceBased() && discordChannel.members.size === 0) {
        await discordChannel.delete();
        await prisma.tempChannel.delete({ where: { discordId: tempChannel.discordId } });
        deleted++;
      }
    }

    logger.info(`Startup cleanup: ${tempChannels.length} temp channel(s) found, ${deleted} deleted.`);
  },
};

export default event;
