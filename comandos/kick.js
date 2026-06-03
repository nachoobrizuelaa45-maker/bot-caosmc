const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'kick',
    async execute(message, args) {
        // 1. Borrar el comando original inmediatamente
        await message.delete().catch(() => {});

        // IDs de roles permitidos (puedes ajustar esta lista si es necesario)
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
            return message.channel.send('⚠️ ¡Mencione el nombre de la persona a kickear!')
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        const reason = args.slice(1).join(' ') || 'Sin razón especificada';

        try {
            // Enviar mensaje privado
            try {
                await target.send(`🚪 Has sido expulsado de **${message.guild.name}**. Razón: ${reason}`);
            } catch (e) {
                console.log('No se pudo enviar el DM al usuario.');
            }

            // Ejecutar Kick
            await target.kick(reason);

            // Crear y enviar Embed
            const embed = new EmbedBuilder()
                .setAuthor({ name: `🚪 EXPULSADO DE DISCORD ${target.user.username}` })
                .setColor('#FF0000')
                .setImage('https://cdn.discordapp.com/attachments/1232366418482429962/1237557770115354725/Screenshot_20240507_211029_CapCut.jpg')
                .setDescription(`🐊🦅•Información del KICK\n\n🚪 Kickeado: <@${target.id}>\n📝 Razón: ${reason}`)
                .addFields({ name: '👤 Staff ejecutor:', value: `<@${message.author.id}>`, inline: false })
                .setFooter({ text: `Coca ColaMods` })
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            message.channel.send('❌ Ocurrió un error al intentar kickear al usuario.');
        }
    }
};
