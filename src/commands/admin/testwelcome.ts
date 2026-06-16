// commands/admin/testwelcome.ts
import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import type { Command } from "../../types/command.js";
import { Messages } from "../../locales/messages.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("testwelcome")
    .setDescription(Messages.TESTWELCOME_DESCRIPTION)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.guild!.members.cache.get(interaction.user.id)!;
    interaction.client.emit("guildMemberAdd", member);
    await interaction.reply({ content: Messages.TESTWELCOME_SUCCESS, flags: ["Ephemeral"] });
  },
};

export default command;
