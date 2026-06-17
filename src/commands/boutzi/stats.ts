import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Messages } from "../../locales/messages.js";
import type { Command } from "../../types/command.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription(Messages.STATS_DESCRIPTION)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client;
    const button = new ButtonBuilder()
      .setCustomId("stats:post")
      .setLabel(Messages.STATS_POST_BUTTON)
      .setStyle(ButtonStyle.Primary);

    if (interaction.user.id == process.env.BOUTZI_ID) {
      let serversNames: string[] = [];
      client.guilds.cache.forEach((server) => {
        serversNames.push(server.name);
      });
      await interaction.reply({
        content: `Servers using Arkaans Copilot: ${client.guilds.cache.size}\n- ${serversNames.join("\n- ")}`,
        components: [new ActionRowBuilder<ButtonBuilder>().addComponents(button)],
        flags: MessageFlags.Ephemeral | MessageFlags.SuppressNotifications,
      });
    } else {
      await interaction.reply({
        content: `Servers using Arkaans Copilot: ${client.guilds.cache.size}`,
        components: [new ActionRowBuilder<ButtonBuilder>().addComponents(button)],
        flags: MessageFlags.Ephemeral | MessageFlags.SuppressNotifications,
      });
    }
  },
};

export default command;
