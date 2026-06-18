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
        .setRequired(false),
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
    )
    .addStringOption((option) =>
      option
        .setName("quote_color")
        .setDescription(t("SETWELCOME_QUOTE_COLOR_OPTION", "en"))
        .setDescriptionLocalizations(buildLocalizations("SETWELCOME_QUOTE_COLOR_OPTION"))
        .setRequired(false),
    )
    .addBooleanOption((option) =>
      option
        .setName("show_guild_badge")
        .setDescription(t("SETWELCOME_GUILD_BADGE_OPTION", "en"))
        .setDescriptionLocalizations(buildLocalizations("SETWELCOME_GUILD_BADGE_OPTION"))
        .setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const lang = await getGuildLang(interaction.guildId!);

    const guild = await prisma.guild.upsert({
      where: { discordId: interaction.guildId! },
      update: { guildName: interaction.guild!.name },
      create: {
        discordId: interaction.guildId!,
        guildName: interaction.guild!.name,
      },
    });

    const existing = await prisma.welcomeConfig.findFirst({ where: { guildId: guild.id } });

    const channelOption = interaction.options.getChannel("channel");
    const resolvedChannel =
      channelOption ??
      (existing ? interaction.guild!.channels.cache.get(existing.welcomeChannelId) : null) ??
      interaction.guild!.channels.cache.get(interaction.guild!.systemChannelId!);

    if (!resolvedChannel) {
      await interaction.editReply({ content: t("SETWELCOME_NO_CHANNEL", lang) });
      return;
    }

    const image = interaction.options.getString("image") ?? existing?.backgroundImageUrl;
    if (!image) {
      await interaction.editReply({ content: t("SETWELCOME_NO_IMAGE", lang) });
      return;
    }

    const activated = interaction.options.getBoolean("activated") ?? existing?.isActive ?? true;
    const color = interaction.options.getString("color") ?? existing?.hexColor ?? "#FFFFFF";
    const quote = interaction.options.getString("quote") ?? existing?.welcomeMessage ?? null;
    const showGuildBadge = interaction.options.getBoolean("show_guild_badge") ?? existing?.showGuildBadge ?? true;
    const quoteColor = interaction.options.getString("quote_color") ?? existing?.quoteColor ?? color;

    const channel = resolvedChannel;

    await prisma.welcomeConfig.upsert({
      where: { guildId: guild.id },
      update: {
        welcomeChannelId: channel.id,
        welcomeChannelName: channel.name ?? "",
        backgroundImageUrl: image,
        isActive: activated,
        hexColor: color,
        welcomeMessage: quote,
        showGuildBadge,
        quoteColor,
      },
      create: {
        welcomeChannelId: channel.id,
        welcomeChannelName: channel.name ?? "",
        backgroundImageUrl: image,
        isActive: activated,
        hexColor: color,
        welcomeMessage: quote,
        showGuildBadge,
        quoteColor,
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
