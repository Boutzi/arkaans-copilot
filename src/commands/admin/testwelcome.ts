import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, MessageFlags } from "discord.js";
import type { Command } from "../../types/command.js";
import { t, buildLocalizations } from "../../utils/i18n.js";
import { getGuildLang } from "../../utils/getLang.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("testwelcome")
    .setDescription(t("TESTWELCOME_DESCRIPTION", "en"))
    .setDescriptionLocalizations(buildLocalizations("TESTWELCOME_DESCRIPTION"))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    const lang = await getGuildLang(interaction.guildId!);
    const member = interaction.guild!.members.cache.get(interaction.user.id)!;
    interaction.client.emit("guildMemberAdd", member);
    await interaction.reply({ content: t("TESTWELCOME_SUCCESS", lang), flags: MessageFlags.Ephemeral });
  },
};

export default command;
