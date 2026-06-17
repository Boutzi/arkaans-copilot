import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import type { Command } from "../../types/command.js";
import { t, buildLocalizations } from "../../utils/i18n.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("arkaans")
    .setDescription(t("ARKAANS_DESCRIPTION", "en"))
    .setDescriptionLocalizations(buildLocalizations("ARKAANS_DESCRIPTION")),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("https://discord.gg/UfTYMFT2Fu");
  },
};

export default command;
