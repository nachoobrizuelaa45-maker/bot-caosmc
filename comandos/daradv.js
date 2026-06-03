const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'daradv',
    async execute(message, args) {
        // 1. Borrar el comando original inmediatamente
        await message.delete().catch(() => {});

        // IDs de roles permitidos
        const rolesAutorizados = [
            '1509746102415392808',
            '1506013227686039562',
            '1503125667792027658',
            '1506026283354685622',
            '1503127900717846608',
            '1503127496080490616'
        ];

        // Verificación de roles
        const tienePermiso = message.member.roles.cache.some(r => rolesAutorizados.includes(r.id));

        if (!tienePermiso) {
            return message.channel.send('❌ No tienes permisos suficientes para ejecutar este comando.')
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        // Verificación de mención
        const target = message.mentions.members.first();
        if (!target) {
            return message.channel.send('⚠️ ¡Mencione al usuario al que quieres darle la advertencia!')
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        const reason = args.slice(1).join(' ') || 'Sin razón especificada';

        try {
            // Crear y enviar Embed
            const embed = new EmbedBuilder()
                .setAuthor({ name: message.guild.name, iconURL: message.author.displayAvatarURL() })
                .setColor(Math.floor(Math.random() * 16777215)) // Color aleatorio
                .setThumbnail(target.user.displayAvatarURL())
                .setDescription(`⚠️ <@${target.id}> ha sido advertido por <@${message.author.id}>\n\n🗒️ Razón\n${reason}`)
                .setFooter({ text: `${message.author.username}`, iconURL: message.guild.iconURL() })
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            message.channel.send('❌ Ocurrió un error al intentar enviar la advertencia.');
        }
    }
};
