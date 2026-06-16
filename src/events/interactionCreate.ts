import { Events, ChatInputCommandInteraction } from "discord.js";
import { logger } from "../utils/logger.js";
import type { Event } from "../types/event.js";
import { handleSetChannelModal } from "../components/modals/setchannel.modal.js";
import { handleResetChannelButton } from "../components/buttons/resetchannel.button.js";
import { handleResetAllChannelsButton } from "../components/buttons/resetallchannel.button.js";

const event: Event<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        logger.warn(`Command ${interaction.commandName} not found.`);
        return;
      }

      try {
        await command.execute(interaction as ChatInputCommandInteraction);
      } catch (error) {
        logger.error(error, `Error executing command ${interaction.commandName}`);
        await interaction.reply({
          content: "An error occurred while executing this command.",
          ephemeral: true,
        });
      }
    } else if (interaction.isModalSubmit()) {
      const [modalName] = interaction.customId.split(":");

      if (modalName === "setchannel") {
        await handleSetChannelModal(interaction);
      }
    } else if (interaction.isButton()) {
      const [buttonName] = interaction.customId.split(":");

      if (buttonName === "resetchannel") {
        await handleResetChannelButton(interaction);
      } else if (buttonName === "resetallchannel") {
        await handleResetAllChannelsButton(interaction);
      }
    }
  },
};

export default event;
