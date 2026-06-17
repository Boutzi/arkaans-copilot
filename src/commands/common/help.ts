import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";
import type { Command } from "../../types/command.js";
import { t, buildLocalizations } from "../../utils/i18n.js";
import { getGuildLang } from "../../utils/getLang.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription(t("HELP_DESCRIPTION", "en"))
    .setDescriptionLocalizations(buildLocalizations("HELP_DESCRIPTION")),

  async execute(interaction: ChatInputCommandInteraction) {
    const lang = await getGuildLang(interaction.guildId!);

    const embed = new EmbedBuilder()
      .setTitle("Arkaans Copilot — Help")
      .addFields(
        {
          name: t("HELP_ADMIN", lang),
          value: [
            `\`/setchannel\` — ${t("HELP_CMD_SETCHANNEL", lang)}`,
            `\`/resetchannel\` — ${t("HELP_CMD_RESETCHANNEL", lang)}`,
            `\`/resetallchannels\` — ${t("HELP_CMD_RESETALLCHANNEL", lang)}`,
            `\`/setwelcome\` — ${t("HELP_CMD_SETWELCOME", lang)}`,
            `\`/testwelcome\` — ${t("HELP_CMD_TESTWELCOME", lang)}`,
          ].join("\n"),
        },
        {
          name: t("HELP_COMMON", lang),
          value: `\`/arkaans\` — ${t("HELP_CMD_ARKAANS", lang)}`,
        },
      )
      .setColor(0x5865f2);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
};

export default command;
