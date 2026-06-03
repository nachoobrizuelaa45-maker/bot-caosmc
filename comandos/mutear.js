const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'mutear',
    async execute(message, args) {
        await message.delete().catch(() => {});

        const rolesAutorizados = [
            '1509746102415392808',
            '1506013227686039562',
            '1503125667792027658',
            '1506026283354685622',
            '1503127900717846608',
            '1503127496080490616'
        ];

        const tienePermiso = message.member.roles.cache.some(r => rolesAutorizados.includes(r.id));

        if (!tienePermiso) {
            return message.channel.send('❌ No tienes permisos suficientes para ejecutar este comando.')
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.channel.send('⚠️ ¡Mencione al usuario a mutear!')
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        // Definir tiempo (ejemplo: 60 minutos si no se especifica)
        const duration = 60 * 60 * 1000; 
        const reason = args.slice(1).join(' ') || 'Sin razón especificada';

        try {
            await target.timeout(duration, reason);

            const embed = new EmbedBuilder()
                .setTitle('**• Usuario Muteado**')
                .setColor('#FF0000')
                .setThumbnail(target.user.displayAvatarURL())
                .setDescription(`🔇 Usuario: <@${target.id}>\n📝 Razón: ${reason}`)
                .addFields({ name: '**• Muteado Por:**', value: `<@${message.author.id}>`, inline: false })
                .setFooter({ text: 'Moderación | CAOSMC' })
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.channel.send('❌ Ocurrió un error al intentar mutear al usuario.');
        }
    }
};
