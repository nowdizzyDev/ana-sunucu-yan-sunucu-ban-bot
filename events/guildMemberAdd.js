const { buildBanLog } = require('../utils/components');

module.exports = {
  name: 'guildMemberAdd',
  once: false,

  async execute(member, client, config) {
    if (member.guild.id !== config.yanid) return;

    const TAG = config.botAdi || 'BanSync';

    try {
      const anaGuild = await client.guilds.fetch(config.anaid);

      let anaMember = null;
      try {
        anaMember = await anaGuild.members.fetch(member.id);
      } catch {
        anaMember = null;
      }

      if (!anaMember) {
        await member.ban({ reason: `[${TAG}] Ana sunucuda kayıtlı değil.` });
        console.log(`[${TAG}] BAN (katılım) → ${member.user.tag} (${member.id})`);

        await sendLog(client, config, {
          user:    member.user,
          reason:  'Ana sunucuda kayıtlı değil.',
          trigger: 'Yan sunucuya katıldı',
        });
      }
    } catch (err) {
      console.error(`[${TAG}] guildMemberAdd hatası (${member.id}):`, err.message);
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
