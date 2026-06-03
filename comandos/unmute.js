const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'unmute',
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
            return message.channel.send('⚠️ ¡Mencione al usuario que desea desmutear!')
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        // Verificar si está muteado
        if (!target.isCommunicationDisabled()) {
            return message.channel.send('❌ El usuario no está muteado actualmente.')
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        try {
            // Remover el timeout
            await target.timeout(null);

            // Crear y enviar Embed
            const embed = new EmbedBuilder()
                .setTitle('**• Usuario Desmuteado**')
                .setColor('#FAFAFA')
                .setThumbnail(message.guild.iconURL())
                .setDescription(`<@${target.id}>`)
                .addFields({ name: '**• Desmuteado Por:**', value: `<@${message.author.id}>`, inline: false })
                .setFooter({ text: 'Moderación | KierBot' })
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            message.channel.send('❌ Ocurrió un error al intentar desmutear al usuario.');
        }
    }
};