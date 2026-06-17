import type { ButtonInteraction } from "discord.js";
import { EmbedBuilder, MessageFlags } from "discord.js";
import { prisma } from "../../utils/prisma.js";
import { logger } from "../../utils/logger.js";
import { t } from "../../utils/i18n.js";
import { getGuildLang } from "../../utils/getLang.js";

export const handleResetAllChannelsButton = async (interaction: ButtonInteraction): Promise<void> => {
  try {
    const [, action] = interaction.customId.split(":");
    const lang = await getGuildLang(interaction.guildId!);

    if (action === "cancel") {
      await interaction.update({ content: t("RESETALLCHANNEL_CANCELLED", lang), embeds: [], components: [] });
      return;
    }

    if (action === "confirm") {
      if (!interaction.guildId) throw new Error("Missing guild id.");

      await interaction.deferUpdate();

      await prisma.sourceChannel.deleteMany({
        where: { guild: { discordId: interaction.guildId } },
      });

      const embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setTitle(t("RESETALLCHANNEL_SUCCESS_TITLE", lang))
        .setDescription(t("RESETALLCHANNEL_SUCCESS_DESC", lang));

      await interaction.editReply({ embeds: [embed], components: [] });
    }
  } catch (error) {
    logger.error(error, "Error handling resetallchannel button");
    const lang = await getGuildLang(interaction.guildId ?? "en");
    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: t("ERROR_RESETALLCHANNEL", lang), flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ content: t("ERROR_RESETALLCHANNEL", lang), flags: MessageFlags.Ephemeral });
      }
    } catch {}
  }
};
