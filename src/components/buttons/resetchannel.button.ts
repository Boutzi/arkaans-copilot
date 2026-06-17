import type { ButtonInteraction } from "discord.js";
import { EmbedBuilder, MessageFlags } from "discord.js";
import { prisma } from "../../utils/prisma.js";
import { logger } from "../../utils/logger.js";
import { t } from "../../utils/i18n.js";
import { getGuildLang } from "../../utils/getLang.js";

export const handleResetChannelButton = async (interaction: ButtonInteraction): Promise<void> => {
  try {
    const [, action, sourceChannelId] = interaction.customId.split(":");
    const lang = await getGuildLang(interaction.guildId!);

    if (action === "cancel") {
      await interaction.update({ content: t("RESETCHANNEL_CANCELLED", lang), embeds: [], components: [] });
      return;
    }

    if (action === "confirm") {
      if (!sourceChannelId) throw new Error("Missing source channel id.");

      await interaction.deferUpdate();

      await prisma.sourceChannel.delete({ where: { id: sourceChannelId } });

      const embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setTitle(t("RESETCHANNEL_SUCCESS_TITLE", lang))
        .setDescription(t("RESETCHANNEL_SUCCESS_DESC", lang));

      await interaction.editReply({ embeds: [embed], components: [] });
    }
  } catch (error) {
    logger.error(error, "Error handling resetchannel button");
    const lang = await getGuildLang(interaction.guildId ?? "en");
    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: t("ERROR_RESETCHANNEL", lang), flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ content: t("ERROR_RESETCHANNEL", lang), flags: MessageFlags.Ephemeral });
      }
    } catch {}
  }
};
