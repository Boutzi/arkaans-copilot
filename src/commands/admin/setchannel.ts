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
import { t, buildLocalizations } from "../../utils/i18n.js";
import { getGuildLang } from "../../utils/getLang.js";
import { prisma } from "../../utils/prisma.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription(t("SETCHANNEL_DESCRIPTION", "en"))
    .setDescriptionLocalizations(buildLocalizations("SETCHANNEL_DESCRIPTION"))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(t("SETCHANNEL_CHANNEL_OPTION", "en"))
        .setDescriptionLocalizations(buildLocalizations("SETCHANNEL_CHANNEL_OPTION"))
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const lang = await getGuildLang(interaction.guildId!);
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
      .setLabel(t("SETCHANNEL_MODAL_LABEL", lang))
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder(t("SETCHANNEL_MODAL_PLACEHOLDER", lang))
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
