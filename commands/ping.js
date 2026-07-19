const { SlashCommandBuilder } = require('discord.js');
const { buildPing } = require('../utils/components');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botun ping değerini gösterir.'),

  async execute(interaction, client) {
    await interaction.deferReply();
    const apiLatency = Date.now() - interaction.createdTimestamp;
    const wsLatency  = client.ws.ping;
    await interaction.editReply(buildPing(wsLatency, apiLatency));
  },
};
