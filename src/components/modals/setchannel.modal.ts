import type { ModalSubmitInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { prisma } from "../../utils/prisma.js";
import { logger } from "../../utils/logger.js";
import { t } from "../../utils/i18n.js";
import { getGuildLang } from "../../utils/getLang.js";

export const handleSetChannelModal = async (interaction: ModalSubmitInteraction): Promise<void> => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const lang = await getGuildLang(interaction.guildId!);

    const [, channelId, channelName] = interaction.customId.split(":");

    const rawNames = interaction.fields.getTextInputValue("namesInput");
    const nameList = rawNames
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    await prisma.guild.upsert({
      where: { discordId: interaction.guildId! },
      update: { guildName: interaction.guild!.name },
      create: {
        discordId: interaction.guildId!,
        guildName: interaction.guild!.name,
      },
    });

    const isUpdate = await prisma.sourceChannel.findFirst({
      where: { discordId: channelId! },
    });

    await prisma.sourceChannel.upsert({
      where: { discordId: channelId! },
      update: { nameList, sourceChannelName: channelName! },
      create: {
        discordId: channelId!,
        sourceChannelName: channelName!,
        nameList,
        guild: { connect: { discordId: interaction.guildId! } },
      },
    });

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(isUpdate ? t("SETCHANNEL_UPDATED", lang) : t("SETCHANNEL_CREATED", lang))
      .setDescription(`<#${channelId}>\n\n${nameList.map((n) => `• ${n}`).join("\n")}`);

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    logger.error(error, "Error handling setchannel modal");
    const lang = await getGuildLang(interaction.guildId ?? "en");
    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: t("ERROR_SETCHANNEL", lang) });
      } else {
        await interaction.reply({ content: t("ERROR_SETCHANNEL", lang), ephemeral: true });
      }
    } catch {}
  }
};
