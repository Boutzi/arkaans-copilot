import { getLobbyChannel, setNewMemberWelcome } from "../../database/dynamo";
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setwelcome")
    .setDescription("Setup configuration for the welcome message for new members")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption((option) =>
      option.setName("activated").setDescription("Activate welcome message").setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription("Background image link for the welcome message (format: PNG/JPG/WEBP)")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription(
          "Color for the new member username (optional, default: white, format: Hexadecimal [e.g. #FFFFFF])",
        )
        .setRequired(false),
    )
    .addStringOption((option) =>
      option.setName("quote").setDescription("Quote to display with the welcome message (optional)").setRequired(false),
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const activated = interaction.options.getBoolean("activated");
    const backgroundImage = interaction.options.getString("image");
    const color = interaction.options.getString("color");
    const quote = interaction.options.getString("quote");

    try {
      await setNewMemberWelcome(guildId, activated, backgroundImage, color, quote);
      await interaction.reply({
        content: "Welcome message configuration saved successfully!",
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error saving welcome message configuration:", error);
      await interaction.reply({
        content: "An error occurred while saving the welcome message configuration.",
        ephemeral: true,
      });
    }
  },
};
