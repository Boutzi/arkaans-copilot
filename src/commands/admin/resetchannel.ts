import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { Messages } from "../../locales/messages.js";
import type { Command } from "../../types/command.js";
import { prisma } from "../../utils/prisma.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("resetchannel")
    .setDescription(Messages.RESETCHANNEL_DESCRIPTION)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(Messages.SETCHANNEL_SELECT_CHANNEL_DESCRIPTION)
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel("channel", true);

    const existing = await prisma.sourceChannel.findFirst({
      where: {
        discordId: channel.id,
        guild: { discordId: interaction.guildId! },
      },
    });
    if (!existing) {
      await interaction.reply({
        content: Messages.RESETCHANNEL_NOT_FOUND,
        flags: ["Ephemeral"],
      });
      return;
    }
    const confirmButton = new ButtonBuilder()
      .setCustomId(`resetchannel:confirm:${existing.id}`)
      .setLabel(Messages.CONFIRM)
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId("resetchannel:cancel")
      .setLabel(Messages.CANCEL)
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton, cancelButton);

    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle(Messages.RESETCHANNEL_CONFIRM_TITLE)
      .setDescription(`<#${channel.id}>\n${Messages.RESETCHANNEL_CONFIRM_DESCRIPTION}`);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      flags: ["Ephemeral"],
    });
  },
};

export default command;
