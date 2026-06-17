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
import type { Command } from "../../types/command.js";
import { t, buildLocalizations } from "../../utils/i18n.js";
import { getGuildLang } from "../../utils/getLang.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("resetallchannel")
    .setDescription(t("RESETALLCHANNEL_DESCRIPTION", "en"))
    .setDescriptionLocalizations(buildLocalizations("RESETALLCHANNEL_DESCRIPTION"))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const lang = await getGuildLang(interaction.guildId!);

    const confirmButton = new ButtonBuilder()
      .setCustomId("resetallchannel:confirm")
      .setLabel(t("CONFIRM", lang))
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId("resetallchannel:cancel")
      .setLabel(t("CANCEL", lang))
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton, cancelButton);

    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle(t("RESETALLCHANNEL_CONFIRM_TITLE", lang))
      .setDescription(t("RESETALLCHANNEL_CONFIRM_DESC", lang));

    await interaction.editReply({ embeds: [embed], components: [row] });
  },
};

export default command;
