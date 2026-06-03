const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    execute(message) {
        const member = message.mentions.members.first() || message.member;
        const embed = new EmbedBuilder()
            .setTitle(`👤 Info de ${member.user.username}`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: '🆔 ID', value: `${member.id}`, inline: true },
                { name: '📥 Entró el', value: member.joinedAt.toDateString(), inline: true }
            )
            .setColor(0x00A8FF);
        
        message.channel.send({ embeds: [embed] });
    }
};
