export const Messages = {
  // Shared
  CONFIRM: "Confirm",
  CANCEL: "Cancel",

  // /arkaans
  ARKAANS_INVITE_DESCRIPTION: "Get the invite link to the official Arkaans server",

  // /stats
  STATS_DESCRIPTION: "Show Arkaans Copilot usage stats",
  STATS_POST_BUTTON: "Post stats",

  // /help
  HELP_DESCRIPTION: "Browse all available commands",
  HELP_ADMIN: "Admin",
  HELP_COMMON: "General",
  HELP_ADMIN_SETCHANNEL_DESCRIPTION: "Configure a voice channel to spawn temporary channels on join",
  HELP_ADMIN_RESETCHANNEL_DESCRIPTION: "Remove the configuration for a specific voice channel",
  HELP_ADMIN_RESETALLCHANNEL_DESCRIPTION: "Remove all channel configurations on this server",
  HELP_ADMIN_SETWELCOME_DESCRIPTION: "Set up the welcome message sent when a member joins",
  HELP_ADMIN_TESTWELCOME_DESCRIPTION: "Trigger the welcome message to preview it",
  HELP_COMMON_ARKAANS_DESCRIPTION: "Get the invite link to the official Arkaans Discord server",

  // /setchannel
  SETCHANNEL_DESCRIPTION: "Configure a voice channel for temporary channel creation",
  SETCHANNEL_SELECT_CHANNEL_DESCRIPTION: "Voice channel to configure",
  SETCHANNEL_MODAL_NAMES_LABEL: "Channel names (one per line)",
  SETCHANNEL_MODAL_NAMES_PLACEHOLDER: "General\nGaming\nMusic",
  SETCHANNEL_UPDATED_TITLE: "Channel updated",
  SETCHANNEL_CREATED_TITLE: "Channel configured",

  // /resetchannel
  RESETCHANNEL_DESCRIPTION: "Remove the configuration for a voice channel",
  RESETCHANNEL_SELECT_CHANNEL_DESCRIPTION: "Voice channel to reset",
  RESETCHANNEL_NOT_FOUND: "This channel has no configuration to remove.",
  RESETCHANNEL_CONFIRM_TITLE: "Reset channel?",
  RESETCHANNEL_CONFIRM_DESCRIPTION: "This will permanently remove the configuration for this channel.",
  RESETCHANNEL_CANCELLED: "Reset cancelled.",
  RESETCHANNEL_SUCCESS_TITLE: "Channel reset",
  RESETCHANNEL_SUCCESS_DESCRIPTION: "The channel configuration has been removed.",

  // /resetallchannels
  RESETALLCHANNEL_DESCRIPTION: "Remove all channel configurations on this server",
  RESETALLCHANNEL_CONFIRM_TITLE: "Reset all channels?",
  RESETALLCHANNEL_CONFIRM_DESCRIPTION: "This will permanently remove every channel configuration on this server.",
  RESETALLCHANNEL_CANCELLED: "Reset cancelled.",
  RESETALLCHANNEL_SUCCESS_TITLE: "All channels reset",
  RESETALLCHANNEL_SUCCESS_DESCRIPTION: "All channel configurations have been removed.",

  // /setwelcome
  SETWELCOME_DESCRIPTION: "Configure the welcome message for new members",
  SETWELCOME_CHANNEL_DESCRIPTION: "Channel where the welcome message will be posted",
  SETWELCOME_IMAGE_DESCRIPTION: "Background image URL for the welcome card",
  SETWELCOME_ACTIVATED_DESCRIPTION: "Enable or disable the welcome message",
  SETWELCOME_COLOR_DESCRIPTION: "Hex color for the welcome card text",
  SETWELCOME_QUOTE_DESCRIPTION: "Custom message shown on the welcome card",
  SETWELCOME_SUCCESS_TITLE: "Welcome message updated",

  // /testwelcome
  TESTWELCOME_DESCRIPTION: "Preview the welcome message as if you just joined",
  TESTWELCOME_SUCCESS: "Welcome preview sent!",
} as const;
