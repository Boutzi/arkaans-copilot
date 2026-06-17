import type { ModalSubmitInteraction } from "discord.js";
import { EmbedBuilder, MessageFlags } from "discord.js";
import { prisma } from "../../utils/prisma.js";
import { Messages } from "../../locales/messages.js";
import { logger } from "../../utils/logger.js";

export const handleSetChannelModal = async (interaction: ModalSubmitInteraction): Promise<void> => {
  try {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

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
      .setTitle(isUpdate ? Messages.SETCHANNEL_UPDATED_TITLE : Messages.SETCHANNEL_CREATED_TITLE)
      .setDescription(`<#${channelId}>\n\n${nameList.map((n) => `• ${n}`).join("\n")}`);

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    logger.error(error, "Error handling setchannel modal");
    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: "An error occurred while saving the channel configuration." });
      } else {
        await interaction.reply({
          content: "An error occurred while saving the channel configuration.",
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch {}
  }
};
