import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import type { Command } from "../../types/command.js";
import { Messages } from "../../locales/messages.js";

const command: Command = {
  data: new SlashCommandBuilder().setName("arkaans").setDescription(Messages.ARKAANS_INVITE_DESCRIPTION),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("https://discord.gg/UfTYMFT2Fu");
  },
};

export default command;
