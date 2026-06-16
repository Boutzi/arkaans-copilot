import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  ActionRowBuilder,
} from "discord.js";
import type { Command } from "../../types/command.js";
import { Messages } from "../../locales/messages.js";
import { prisma } from "../../utils/prisma.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription(Messages.SETCHANNEL_DESCRIPTION)
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

    const currentNames = existing?.nameList.join("\n") ?? "";

    const namesInput = new TextInputBuilder()
      .setCustomId("namesInput")
      .setLabel(Messages.SETCHANNEL_MODAL_NAMES_LABEL)
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder(Messages.SETCHANNEL_MODAL_NAMES_PLACEHOLDER)
      .setValue(currentNames)
      .setRequired(true);

    const modal = new ModalBuilder()
      .setTitle(`${channel.name}`)
      .setCustomId(`setchannel:${channel.id}:${channel.name}`)
      .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(namesInput));

    await interaction.showModal(modal);
  },
};

export default command;
