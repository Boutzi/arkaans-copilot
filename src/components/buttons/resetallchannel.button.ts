import type { ButtonInteraction } from "discord.js";
import { EmbedBuilder, MessageFlags } from "discord.js";
import { prisma } from "../../utils/prisma.js";
import { logger } from "../../utils/logger.js";
import { Messages } from "../../locales/messages.js";

export const handleResetAllChannelsButton = async (interaction: ButtonInteraction): Promise<void> => {
  try {
    const [, action] = interaction.customId.split(":");

    if (action === "cancel") {
      await interaction.update({
        content: Messages.RESETCHANNEL_CANCELLED,
        embeds: [],
        components: [],
      });
      return;
    }

    if (action === "confirm") {
      if (!interaction.guildId) {
        throw new Error("Missing guild id.");
      }

      await interaction.deferUpdate();

      await prisma.sourceChannel.deleteMany({
        where: { guild: { discordId: interaction.guildId! } },
      });

      const embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setTitle(Messages.RESETALLCHANNEL_SUCCESS_TITLE)
        .setDescription(Messages.RESETALLCHANNEL_SUCCESS_DESCRIPTION);

      await interaction.editReply({ embeds: [embed], components: [] });
    }
  } catch (error) {
    logger.error(error, "Error handling resetallchannel button");
    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: "An error occurred while processing the reset all channels action.",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "An error occurred while processing the reset all channels action.",
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch {}
  }
};
