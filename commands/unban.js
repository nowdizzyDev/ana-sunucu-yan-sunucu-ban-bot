const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { buildSuccess, buildError, buildUnbanLog } = require('../utils/components');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Yan sunucudan bir kullanıcının banını kaldırır.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(o =>
      o.setName('kullanici_id')
        .setDescription('Unban yapılacak kullanıcının ID\'si')
        .setRequired(true)
    ),

  async execute(interaction, client, config) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const userId = interaction.options.getString('kullanici_id').trim();

    if (!/^\d{17,20}$/.test(userId)) {
      return interaction.editReply(buildError('Geçersiz kullanıcı ID\'si. Sadece sayısal Discord ID girin.'));
    }

    try {
      const yanGuild = await client.guilds.fetch(config.yanid);

      const ban = await yanGuild.bans.fetch(userId).catch(() => null);
      if (!ban) {
        return interaction.editReply(buildError(`<@${userId}> yan sunucuda banlı değil.`));
      }

      await yanGuild.members.unban(userId, `[${config.botAdi || 'BanSync'}] ${interaction.user.tag} tarafından unban yapıldı.`);
      console.log(`[${config.botAdi || 'BanSync'}] UNBAN → ${ban.user.tag} (${userId}) | Yetkili: ${interaction.user.tag}`);

      await interaction.editReply(
        buildSuccess('Unban Başarılı', `<@${userId}> \`${ban.user.tag}\` yan sunucudan unban edildi.`)
      );

      try {
        const logChannel = await client.channels.fetch(config.logChannelId);
        if (logChannel) {
          await logChannel.send(buildUnbanLog({
            user:      ban.user,
            moderator: interaction.user,
          }));
        }
      } catch (err) {
        console.error(`[${config.botAdi || 'BanSync'}] Unban log gönderilemedi:`, err.message);
      }
    } catch (err) {
      console.error(`[${config.botAdi || 'BanSync'}] /unban hatası:`, err);
      await interaction.editReply(buildError('Unban yapılamadı. Bot\'un yeterli yetkisi var mı?'));
    }
  },
};
