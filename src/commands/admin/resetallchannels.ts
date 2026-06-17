import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} from "discord.js";
import { Messages } from "../../locales/messages.js";
import type { Command } from "../../types/command.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("resetallchannel")
    .setDescription(Messages.RESETALLCHANNEL_DESCRIPTION)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction) {
    const confirmButton = new ButtonBuilder()
      .setCustomId(`resetallchannel:confirm`)
      .setLabel(Messages.CONFIRM)
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId("resetallchannel:cancel")
      .setLabel(Messages.CANCEL)
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton, cancelButton);

    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle(Messages.RESETALLCHANNEL_CONFIRM_TITLE)
      .setDescription(Messages.RESETALLCHANNEL_CONFIRM_DESCRIPTION);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
  },
};

export default command;
