const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ban',
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
            return message.channel.send('⚠️ ¡Mencione el nombre de la persona a banear!')
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        const reason = args.slice(1).join(' ') || 'Sin razón especificada';

        try {
            // Enviar mensaje privado
            try {
                await target.send(`⛔️ Has sido baneado de **${message.guild.name}**. Razón: ${reason}`);
            } catch (e) {
                console.log('No se pudo enviar el DM al usuario.');
            }

            // Ejecutar Ban
            await target.ban({ reason: reason });

            // Crear y enviar Embed
            const embed = new EmbedBuilder()
                .setAuthor({ name: `⛔️ BANEADO DE DISCORD ${target.user.username}` })
                .setColor(0xFF0000)
                .setImage('https://cdn.discordapp.com/attachments/1232366418482429962/1237555030559821914/Screenshot_20240507_205915_CapCut.jpg')
                .setDescription(`🦅🦖•Información del BAN\n\n⛔️ Baneado: <@${target.id}>\n📝 Razón: ${reason}`)
                .addFields({ name: '👤 Staff:', value: `<@${message.author.id}>`, inline: false })
                .setFooter({ text: `CAOSMC#5312` })
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            message.channel.send('❌ Ocurrió un error al intentar banear al usuario.');
        }
    }
};
