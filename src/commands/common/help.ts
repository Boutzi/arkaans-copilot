import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";
import { Messages } from "../../locales/messages.js";
import type { Command } from "../../types/command.js";

const command: Command = {
  data: new SlashCommandBuilder().setName("help").setDescription(Messages.HELP_DESCRIPTION),
  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle("Arkaans Copilot — Help")
      .addFields(
        {
          name: Messages.HELP_ADMIN,
          value: [
            `\`/setchannel\` — ${Messages.HELP_ADMIN_SETCHANNEL_DESCRIPTION}`,
            `\`/resetchannel\` — ${Messages.HELP_ADMIN_RESETCHANNEL_DESCRIPTION}`,
            `\`/resetallchannels\` — ${Messages.HELP_ADMIN_RESETALLCHANNEL_DESCRIPTION}`,
            `\`/setwelcome\` — ${Messages.HELP_ADMIN_SETWELCOME_DESCRIPTION}`,
            `\`/testwelcome\` — ${Messages.HELP_ADMIN_TESTWELCOME_DESCRIPTION}`,
          ].join("\n"),
        },
        {
          name: Messages.HELP_COMMON,
          value: `\`/arkaans\` — ${Messages.HELP_COMMON_ARKAANS_DESCRIPTION}`,
        },
      )
      .setColor(0x5865f2);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
};

export default command;
