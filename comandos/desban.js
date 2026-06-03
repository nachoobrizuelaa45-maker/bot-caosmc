const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'desban',
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

        // Obtener el ID del usuario a desbanear
        const userId = args[0];
        if (!userId) {
            return message.channel.send('⚠️ ¡Debes proporcionar el ID del usuario a desbanear!')
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        const reason = args.slice(1).join(' ') || 'Sin razón especificada';

        try {
            // Ejecutar Desban
            await message.guild.members.unban(userId, reason);

            // Crear y enviar Embed
            const embed = new EmbedBuilder()
                .setAuthor({ name: `🔓 USUARIO DESBANEADO` })
                .setColor(0x00FF00)
                .setDescription(`🦅🦖•Información del DESBAN\n\n🔓 Usuario ID: ${userId}\n📝 Razón: ${reason}`)
                .addFields({ name: '👤 Staff ejecutor:', value: `<@${message.author.id}>`, inline: false })
                .setFooter({ text: `CAOSMC#5312` })
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            message.channel.send('❌ Ocurrió un error al intentar desbanear al usuario (verifica que el ID sea correcto y que esté baneado).');
        }
    }
};
