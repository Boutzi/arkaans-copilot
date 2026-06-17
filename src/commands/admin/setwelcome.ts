import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import type { Command } from "../../types/command.js";
import { t, buildLocalizations } from "../../utils/i18n.js";
import { getGuildLang } from "../../utils/getLang.js";
import { prisma } from "../../utils/prisma.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("setwelcome")
    .setDescription(t("SETWELCOME_DESCRIPTION", "en"))
    .setDescriptionLocalizations(buildLocalizations("SETWELCOME_DESCRIPTION"))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription(t("SETWELCOME_IMAGE_OPTION", "en"))
        .setDescriptionLocalizations(buildLocalizations("SETWELCOME_IMAGE_OPTION"))
        .setRequired(true),
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(t("SETWELCOME_CHANNEL_OPTION", "en"))
        .setDescriptionLocalizations(buildLocalizations("SETWELCOME_CHANNEL_OPTION"))
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false),
    )
    .addBooleanOption((option) =>
      option
        .setName("activated")
        .setDescription(t("SETWELCOME_ACTIVATED_OPTION", "en"))
        .setDescriptionLocalizations(buildLocalizations("SETWELCOME_ACTIVATED_OPTION"))
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription(t("SETWELCOME_COLOR_OPTION", "en"))
        .setDescriptionLocalizations(buildLocalizations("SETWELCOME_COLOR_OPTION"))
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("quote")
        .setDescription(t("SETWELCOME_QUOTE_OPTION", "en"))
        .setDescriptionLocalizations(buildLocalizations("SETWELCOME_QUOTE_OPTION"))
        .setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const lang = await getGuildLang(interaction.guildId!);

    const channel =
      interaction.options.getChannel("channel") ??
      interaction.guild!.channels.cache.get(interaction.guild!.systemChannelId!);

    if (!channel) {
      await interaction.editReply({ content: t("SETWELCOME_NO_CHANNEL", lang) });
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
      .setTitle(t("SETWELCOME_SUCCESS_TITLE", lang))
      .addFields(
        { name: t("SETWELCOME_FIELD_CHANNEL", lang), value: `<#${channel.id}>`, inline: true },
        { name: t("SETWELCOME_FIELD_ACTIVE", lang), value: activated ? "✅" : "❌", inline: true },
        { name: t("SETWELCOME_FIELD_COLOR", lang), value: color, inline: true },
        { name: t("SETWELCOME_FIELD_QUOTE", lang), value: quote ?? t("SETWELCOME_FIELD_QUOTE_DEFAULT", lang), inline: false },
      )
      .setThumbnail(image);

    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
