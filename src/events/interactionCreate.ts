import { Events, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { logger } from "../utils/logger.js";
import type { Event } from "../types/event.js";
import { handleSetChannelModal } from "../components/modals/setchannel.modal.js";
import { handleResetChannelButton } from "../components/buttons/resetchannel.button.js";
import { handleResetAllChannelsButton } from "../components/buttons/resetallchannel.button.js";

const event: Event<Events.InteractionCreate> = {
  name: Events.InteractionCreate,

  async execute(interaction) {
    try {
      // =========================
      // SLASH COMMANDS
      // =========================
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

          try {
            if (interaction.deferred || interaction.replied) {
              await interaction.followUp({
                content: "An error occurred while executing this command.",
                flags: MessageFlags.Ephemeral,
              });
            } else {
              await interaction.reply({
                content: "An error occurred while executing this command.",
                flags: MessageFlags.Ephemeral,
              });
            }
          } catch (err) {
            logger.error(err, "Failed to send interaction error response");
          }
        }

        return;
      }

      // =========================
      // MODALS
      // =========================
      if (interaction.isModalSubmit()) {
        try {
          const [modalName] = interaction.customId.split(":");

          if (modalName === "setchannel") {
            await handleSetChannelModal(interaction);
          }
        } catch (error) {
          logger.error(error, "Error executing modal");

          try {
            if (!interaction.replied && !interaction.deferred) {
              await interaction.reply({
                content: "An error occurred while processing this modal.",
                flags: MessageFlags.Ephemeral,
              });
            }
          } catch {}
        }

        return;
      }

      // =========================
      // BUTTONS
      // =========================
      if (interaction.isButton()) {
        try {
          const [buttonName, buttonAction] = interaction.customId.split(":");

          if (buttonName === "resetchannel") {
            await handleResetChannelButton(interaction);
          } else if (buttonName === "resetallchannel") {
            await handleResetAllChannelsButton(interaction);
          } else if (buttonName === "stats" && buttonAction === "post") {
            const client = interaction.client;
            let serversNames: string[] = [];
            client.guilds.cache.forEach((server) => serversNames.push(server.name));
            await interaction.reply({
              content: `Servers using Arkaans Copilot: **${client.guilds.cache.size}**\n- ${serversNames.join("\n- ")}`,
            });
          }
        } catch (error) {
          logger.error(error, "Error executing button");

          try {
            if (!interaction.replied && !interaction.deferred) {
              await interaction.reply({
                content: "An error occurred while processing this button.",
                flags: MessageFlags.Ephemeral,
              });
            }
          } catch {}
        }
      }
    } catch (error) {
      logger.error(error, "Unexpected error in interactionCreate handler");
    }
  },
};

export default event;
