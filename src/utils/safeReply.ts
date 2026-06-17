import { MessageFlags } from "discord.js";

export async function safeReply(interaction: any, payload: any) {
  if (interaction.deferred || interaction.replied) {
    return interaction.followUp(payload);
  }
  return interaction.reply(payload);
}

export async function safeEdit(interaction: any, payload: any) {
  if (interaction.deferred || interaction.replied) {
    return interaction.editReply(payload);
  }
  return interaction.reply(payload);
}

export const EPHEMERAL = MessageFlags.Ephemeral;
