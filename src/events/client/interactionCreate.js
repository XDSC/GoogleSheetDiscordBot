module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction, client, props) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client, props);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: `Something went wrong while executing this command...`,
          ephemeral: true,
        });
      }
    }
  },
};
