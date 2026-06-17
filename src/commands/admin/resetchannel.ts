import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} from "discord.js";
import type { Command } from "../../types/command.js";
import { t, buildLocalizations } from "../../utils/i18n.js";
import { getGuildLang } from "../../utils/getLang.js";
import { prisma } from "../../utils/prisma.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("resetchannel")
    .setDescription(t("RESETCHANNEL_DESCRIPTION", "en"))
    .setDescriptionLocalizations(buildLocalizations("RESETCHANNEL_DESCRIPTION"))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(t("RESETCHANNEL_CHANNEL_OPTION", "en"))
        .setDescriptionLocalizations(buildLocalizations("RESETCHANNEL_CHANNEL_OPTION"))
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const lang = await getGuildLang(interaction.guildId!);
    const channel = interaction.options.getChannel("channel", true);

    const existing = await prisma.sourceChannel.findFirst({
      where: {
        discordId: channel.id,
        guild: { discordId: interaction.guildId! },
      },
    });

    if (!existing) {
      await interaction.editReply({ content: t("RESETCHANNEL_NOT_FOUND", lang) });
      return;
    }

    const confirmButton = new ButtonBuilder()
      .setCustomId(`resetchannel:confirm:${existing.id}`)
      .setLabel(t("CONFIRM", lang))
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId("resetchannel:cancel")
      .setLabel(t("CANCEL", lang))
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton, cancelButton);

    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle(t("RESETCHANNEL_CONFIRM_TITLE", lang))
      .setDescription(`<#${channel.id}>\n${t("RESETCHANNEL_CONFIRM_DESC", lang)}`);

    await interaction.editReply({ embeds: [embed], components: [row] });
  },
};

export default command;
