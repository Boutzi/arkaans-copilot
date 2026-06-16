import type { ButtonInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { prisma } from "../../utils/prisma.js";
import { logger } from "../../utils/logger.js";
import { Messages } from "../../locales/messages.js";

export const handleResetChannelButton = async (interaction: ButtonInteraction): Promise<void> => {
  try {
    const [, action, sourceChannelId] = interaction.customId.split(":");

    if (action === "cancel") {
      await interaction.update({
        content: Messages.RESETCHANNEL_CANCELLED,
        embeds: [],
        components: [],
      });
      return;
    }

    if (action === "confirm") {
      if (!sourceChannelId) {
        throw new Error("Missing source channel id.");
      }

      await prisma.sourceChannel.delete({
        where: { id: sourceChannelId },
      });

      const embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setTitle(Messages.RESETCHANNEL_SUCCESS_TITLE)
        .setDescription(Messages.RESETCHANNEL_SUCCESS_DESCRIPTION);

      await interaction.update({
        embeds: [embed],
        components: [],
      });
    }
  } catch (error) {
    logger.error(error, "Error handling resetchannel button");
    await interaction.reply({
      content: "An error occurred while processing the reset channel action.",
      flags: ["Ephemeral"],
    });
  }
};
