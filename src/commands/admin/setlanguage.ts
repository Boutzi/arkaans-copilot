import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  MessageFlags,
} from "discord.js";
import type { Command } from "../../types/command.js";
import { t, buildLocalizations } from "../../utils/i18n.js";
import { getGuildLang } from "../../utils/getLang.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("setlanguage")
    .setDescription(t("SETLANGUAGE_DESCRIPTION", "en"))
    .setDescriptionLocalizations(buildLocalizations("SETLANGUAGE_DESCRIPTION"))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const lang = await getGuildLang(interaction.guildId!);

    const select = new StringSelectMenuBuilder()
      .setCustomId("setlanguage")
      .setPlaceholder(t("SETLANGUAGE_PLACEHOLDER", lang))
      .addOptions([
        { label: "English", value: "en", emoji: "🇬🇧" },
        { label: "Français", value: "fr", emoji: "🇫🇷" },
        { label: "Italiano (Bêta)", value: "it", emoji: "🇮🇹" },
        { label: "Español (Bêta)", value: "es", emoji: "🇪🇸" },
        { label: "Deutsch (Bêta)", value: "de", emoji: "🇩🇪" },
        { label: "한국어 (Bêta)", value: "ko", emoji: "🇰🇷" },
        { label: "日本語 (Bêta)", value: "ja", emoji: "🇯🇵" },
        { label: "中文 (Bêta)", value: "zh", emoji: "🇨🇳" },
      ]);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
    await interaction.editReply({ components: [row] });
  },
};

export default command;
