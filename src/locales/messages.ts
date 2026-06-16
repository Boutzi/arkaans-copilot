export const Messages = {
  ARKAANS_INVITE_DESCRIPTION: "Invitation link to the official Arkaans server",
  STATS_DESCRIPTION: "Display stats about Arkaans Copilot",
  HELP_DESCRIPTION: "Learn about Arkaans Copilot with the complete commands documentation.",
  HELP_ADMIN: "Admin commands",
  HELP_COMMON: "Common commands",
  HELP_ADMIN_SETCHANNEL_DESCRIPTION:
    "Defines a voice channel as the target to create temporary channels when the user accesses it.",
  HELP_ADMIN_RESETCHANNEL_DESCRIPTION: "Clears the existing list for a selected channel.",
  HELP_ADMIN_RESETALLCHANNEL_DESCRIPTION:
    "Clears all existing lists on the server; caution, this command resets everything.",
  HELP_COMMON_ARKAANS_DESCRIPTION: "Returns an invitation link to the official Arkaans Discord server.",
  SETCHANNEL_DESCRIPTION: "Set the channel for temporary voice channels.",
  SETCHANNEL_SELECT_CHANNEL_DESCRIPTION: "Select the channel to configure.",
  SETCHANNEL_MODAL_NAMES_LABEL: "Enter names (one per line)",
  SETCHANNEL_MODAL_NAMES_PLACEHOLDER: "Enter the names for the temporary channels (one per line).",
  SETCHANNEL_UPDATED_TITLE: "Channel updated successfully",
  SETCHANNEL_CREATED_TITLE: "Channel created successfully",
} as const;
