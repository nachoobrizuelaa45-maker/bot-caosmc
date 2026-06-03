const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clear',
    async execute(message, args) {
        // 1. Borrar el comando original
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

        // Obtener cantidad
        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0 || amount > 100) {
            return message.channel.send('❌ Mencioná el número de mensajes a eliminar (entre 1 y 100).')
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        try {
            // Eliminar mensajes
            const deleted = await message.channel.bulkDelete(amount, true);

            // Crear y enviar Embed
            const embed = new EmbedBuilder()
                .setAuthor({ name: `🫧 Comando CLEAR ${message.author.username}`, iconURL: message.guild.iconURL() })
                .setColor(0xFF0000)
                .setDescription(`\n**🧹• Comando de limpieza ejecutado por el administrador** <@${message.author.id}>\n\n\n\n\n\n\n\n`)
                .setFooter({ text: `⚠️ Se han eliminado ${deleted.size} mensajes por el administrador ${message.author.username} ⚠️` })
                .setTimestamp();

            const msg = await message.channel.send({ embeds: [embed] });
            
            // Borrar el embed después de 10 segundos
            setTimeout(() => msg.delete().catch(() => {}), 10000);

        } catch (error) {
            console.error(error);
            message.channel.send('❌ Ocurrió un error al intentar eliminar los mensajes.');
        }
    }
};
