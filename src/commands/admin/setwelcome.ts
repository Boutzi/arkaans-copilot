import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import type { Command } from "../../types/command.js";
import { Messages } from "../../locales/messages.js";
import { prisma } from "../../utils/prisma.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("setwelcome")
    .setDescription(Messages.SETWELCOME_DESCRIPTION)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option.setName("image").setDescription(Messages.SETWELCOME_IMAGE_DESCRIPTION).setRequired(true),
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(Messages.SETWELCOME_CHANNEL_DESCRIPTION)
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false),
    )
    .addBooleanOption((option) =>
      option.setName("activated").setDescription(Messages.SETWELCOME_ACTIVATED_DESCRIPTION).setRequired(false),
    )
    .addStringOption((option) =>
      option.setName("color").setDescription(Messages.SETWELCOME_COLOR_DESCRIPTION).setRequired(false),
    )
    .addStringOption((option) =>
      option.setName("quote").setDescription(Messages.SETWELCOME_QUOTE_DESCRIPTION).setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const channel =
      interaction.options.getChannel("channel") ??
      interaction.guild!.channels.cache.get(interaction.guild!.systemChannelId!);

    if (!channel) {
      await interaction.editReply({ content: "No welcome channel found. Please specify a channel." });
      return;
    }

    const image = interaction.options.getString("image", true);
    const activated = interaction.options.getBoolean("activated") ?? true;
    const color = interaction.options.getString("color") ?? "#FFFFFF";
    const quote = interaction.options.getString("quote") ?? null;

    const guild = await prisma.guild.upsert({
      where: { discordId: interaction.guildId! },
      update: { guildName: interaction.guild!.name },
      create: {
        discordId: interaction.guildId!,
        guildName: interaction.guild!.name,
      },
    });

    await prisma.welcomeConfig.upsert({
      where: { guildId: guild.id },
      update: {
        welcomeChannelId: channel.id,
        welcomeChannelName: channel.name ?? "",
        backgroundImageUrl: image,
        isActive: activated,
        hexColor: color,
        welcomeMessage: quote,
      },
      create: {
        welcomeChannelId: channel.id,
        welcomeChannelName: channel.name ?? "",
        backgroundImageUrl: image,
        isActive: activated,
        hexColor: color,
        welcomeMessage: quote,
        guild: { connect: { id: guild.id } },
      },
    });

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(Messages.SETWELCOME_SUCCESS_TITLE)
      .addFields(
        { name: "Channel", value: `<#${channel.id}>`, inline: true },
        { name: "Activated", value: activated ? "✅" : "❌", inline: true },
        { name: "Color", value: color, inline: true },
        { name: "Quote", value: quote ?? "Discord default", inline: false },
      )
      .setThumbnail(image);

    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
