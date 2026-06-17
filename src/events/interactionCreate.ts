import { Events, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { logger } from "../utils/logger.js";
import type { Event } from "../types/event.js";
import { t } from "../utils/i18n.js";
import { getGuildLang } from "../utils/getLang.js";
import { handleSetChannelModal } from "../components/modals/setchannel.modal.js";
import { handleResetChannelButton } from "../components/buttons/resetchannel.button.js";
import { handleResetAllChannelsButton } from "../components/buttons/resetallchannel.button.js";
import { handleSetLanguageSelect } from "../components/selects/setlanguage.select.js";

const event: Event<Events.InteractionCreate> = {
  name: Events.InteractionCreate,

  async execute(interaction) {
    const guildId = interaction.guildId ?? "en";

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
          const lang = await getGuildLang(guildId);
          try {
            if (interaction.deferred || interaction.replied) {
              await interaction.followUp({ content: t("ERROR_CMD", lang), flags: MessageFlags.Ephemeral });
            } else {
              await interaction.reply({ content: t("ERROR_CMD", lang), flags: MessageFlags.Ephemeral });
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
          const lang = await getGuildLang(guildId);
          try {
            if (!interaction.replied && !interaction.deferred) {
              await interaction.reply({ content: t("ERROR_MODAL", lang), flags: MessageFlags.Ephemeral });
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
            const serversNames: string[] = [];
            client.guilds.cache.forEach((server) => serversNames.push(server.name));
            await interaction.reply({
              content: `Servers using Arkaans Copilot: **${client.guilds.cache.size}**\n- ${serversNames.join("\n- ")}`,
            });
          }
        } catch (error) {
          logger.error(error, "Error executing button");
          const lang = await getGuildLang(guildId);
          try {
            if (!interaction.replied && !interaction.deferred) {
              await interaction.reply({ content: t("ERROR_BUTTON", lang), flags: MessageFlags.Ephemeral });
            }
          } catch {}
        }

        return;
      }

      // =========================
      // SELECT MENUS
      // =========================
      if (interaction.isStringSelectMenu()) {
        try {
          if (interaction.customId === "setlanguage") {
            await handleSetLanguageSelect(interaction);
          }
        } catch (error) {
          logger.error(error, "Error executing select menu");
        }
      }
    } catch (error) {
      logger.error(error, "Unexpected error in interactionCreate handler");
    }
  },
};

export default event;
