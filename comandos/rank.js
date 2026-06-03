const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'rank',
    execute(message, args) {
        let niveles = JSON.parse(fs.readFileSync('./niveles.json', 'utf8'));
        const target = message.mentions.members.first() || message.member;
        const data = niveles[target.id];

        if (!data) return message.reply('❌ Este usuario todavía no tiene experiencia.');

        const xpNecesaria = data.nivel * 100;
        const embedRank = new EmbedBuilder()
            .setTitle(`📊 Nivel de ${target.displayName}`)
            .setColor(0x00A8FF)
            .setThumbnail(target.user.displayAvatarURL())
            .addFields(
                { name: '⭐ Nivel', value: `${data.nivel}`, inline: true },
                { name: '✨ XP', value: `${data.xp} / ${xpNecesaria}`, inline: true }
            )
            .setFooter({ text: '¡Seguí subiendo de rango en CAOSMC!' });

        message.channel.send({ embeds: [embedRank] });
        message.delete().catch(() => {});
    }
};
