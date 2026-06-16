import { Events, ChannelType } from "discord.js";
import type { Event } from "../types/event.js";
import { prisma } from "../utils/prisma.js";
// import { logger } from "../utils/logger.js";
import PQueue from "p-queue";

const guildQueues = new Map<string, PQueue>();

function getGuildQueue(guildId: string): PQueue {
  if (!guildQueues.has(guildId)) {
    guildQueues.set(guildId, new PQueue({ concurrency: 1 }));
  }
  return guildQueues.get(guildId)!;
}

const event: Event<Events.VoiceStateUpdate> = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    if (newChannel) {
      const queue = getGuildQueue(newState.guild.id);
      queue.add(async () => {
        const sourceChannel = await prisma.sourceChannel.findUnique({
          where: { discordId: newChannel.id },
        });

        if (!sourceChannel) return;

        const randomName = sourceChannel.nameList[Math.floor(Math.random() * sourceChannel.nameList.length)];

        const tempChannel = await newState.guild.channels.create({
          name: randomName ?? "Temp",
          type: ChannelType.GuildVoice,
          parent: newChannel.parentId,
        });

        await newState.setChannel(tempChannel);

        await prisma.tempChannel.create({
          data: {
            discordId: tempChannel.id,
            tempChannelName: tempChannel.name,
            sourceChannelId: sourceChannel.id,
          },
        });

        // logger.info(`Created temp channel ${tempChannel.name} in guild ${newState.guild.name}`);
      });
    }

    if (oldChannel) {
      const tempChannel = await prisma.tempChannel.findUnique({
        where: { discordId: oldChannel.id },
      });

      if (!tempChannel) return;

      const discordChannel = oldState.guild.channels.cache.get(oldChannel.id);
      if (!discordChannel) return;

      if (discordChannel.isVoiceBased() && discordChannel.members.size === 0) {
        await discordChannel.delete();
        await prisma.tempChannel.delete({
          where: { discordId: oldChannel.id },
        });
        // logger.info(`Deleted temp channel ${oldChannel.name} in guild ${oldState.guild.name}`);
      }
    }
  },
};

export default event;
