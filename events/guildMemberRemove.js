const { buildBanLog } = require('../utils/components');

module.exports = {
  name: 'guildMemberRemove',
  once: false,

  async execute(member, client, config) {
    if (member.guild.id !== config.anaid) return;

    const TAG = config.botAdi || 'BanSync';

    try {
      const yanGuild = await client.guilds.fetch(config.yanid);

      let yanMember = null;
      try {
        yanMember = await yanGuild.members.fetch(member.id);
      } catch {
        yanMember = null;
      }

      if (yanMember) {
        await yanMember.ban({ reason: `[${TAG}] Ana sunucudan ayrıldı.` });
        console.log(`[${TAG}] BAN (ayrılma) → ${member.user.tag} (${member.id})`);

        await sendLog(client, config, {
          user:    member.user,
          reason:  'Ana sunucudan ayrıldı.',
          trigger: 'Ana sunucudan çıkış',
        });
      }
    } catch (err) {
      console.error(`[${TAG}] guildMemberRemove hatası (${member.id}):`, err.message);
    }
  },
};

async function sendLog(client, config, data) {
  const TAG = config.botAdi || 'BanSync';
  try {
    const logChannel = await client.channels.fetch(config.logChannelId);
    if (!logChannel) return;
    await logChannel.send(buildBanLog(data));
  } catch (err) {
    console.error(`[${TAG}] Log gönderilemedi:`, err.message);
  }
}
