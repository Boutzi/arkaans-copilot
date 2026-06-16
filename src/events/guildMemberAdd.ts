import type { Event } from "../types/event.js";
import { Events, AttachmentBuilder } from "discord.js";
import { prisma } from "../utils/prisma.js";
import { generateWelcomeImage } from "../utils/welcomeImage.js";
import { logger } from "../utils/logger.js";

const event: Event<Events.GuildMemberAdd> = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const guildConfig = await prisma.welcomeConfig.findFirst({
      where: { guild: { discordId: member.guild.id } },
    });

    if (!guildConfig || !guildConfig.isActive) return;

    const welcomeChannel = member.guild.channels.cache.get(guildConfig.welcomeChannelId);
    if (!welcomeChannel?.isTextBased()) {
      logger.warn(`Welcome channel not found for guild ${member.guild.name}`);
      return;
    }

    try {
      const imageBuffer: Buffer = await generateWelcomeImage({
        username: member.user.username,
        avatarUrl: member.user.displayAvatarURL({ extension: "png", size: 256 }),
        backgroundUrl: guildConfig.backgroundImageUrl,
        hexColor: guildConfig.hexColor ?? "#FFFFFF",
        quote: guildConfig.welcomeMessage ?? null,
        guildName: member.guild.name,
        guildIconUrl: member.guild.iconURL({ extension: "png" }) ?? undefined,
      });

      const attachment = new AttachmentBuilder(imageBuffer, { name: "welcome.png" });
      await welcomeChannel.send({ files: [attachment] });
    } catch (error) {
      logger.error(error, `Failed to send welcome image for guild ${member.guild.name}`);
    }
  },
};

export default event;
