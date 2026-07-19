const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { buildBanList, buildError, CV2 } = require('../utils/components');

const PAGE_SIZE = 10;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban-list')
    .setDescription('Yan sunucunun ban listesini gösterir.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addIntegerOption(o =>
      o.setName('sayfa')
        .setDescription('Sayfa numarası')
        .setMinValue(1)
        .setRequired(false)
    ),

  async execute(interaction, client, config) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const yanGuild = await client.guilds.fetch(config.yanid);
      const bans     = [...(await yanGuild.bans.fetch()).values()];

      if (bans.length === 0) {
        return interaction.editReply(buildError('Yan sunucuda hiç ban yok.'));
      }

      const totalPages = Math.ceil(bans.length / PAGE_SIZE);
      const page       = Math.min(interaction.options.getInteger('sayfa') || 1, totalPages);
      const slice      = bans.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

      await interaction.editReply(buildBanList(slice, page, totalPages));

      const collector = interaction.channel.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id && i.customId.startsWith('banlist_'),
        time: 60_000,
      });

      collector.on('collect', async i => {
        const parts   = i.customId.split('_');
        const dir     = parts[1];
        let newPage   = parseInt(parts[2]);
        if (dir === 'next') newPage++;
        if (dir === 'prev') newPage--;
        newPage = Math.max(1, Math.min(newPage, totalPages));

        const newSlice = bans.slice((newPage - 1) * PAGE_SIZE, newPage * PAGE_SIZE);
        await i.update(buildBanList(newSlice, newPage, totalPages));
      });

      collector.on('end', () => {});
    } catch (err) {
      console.error('[BanSync] /ban-list hatası:', err);
      await interaction.editReply(buildError('Ban listesi alınamadı.'));
    }
  },
};
