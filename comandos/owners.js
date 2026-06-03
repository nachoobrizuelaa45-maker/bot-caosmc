const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'owners',
    execute(message, args) {
        // --- SEGURIDAD: Los mismos roles que usás en $anuncio ---
        const allowedRoles = ['1509746102415392808', '1506013227686039562'];
        
        // Verificamos si tiene el rol
        const hasPermission = message.member.roles.cache.some(r => allowedRoles.includes(r.id));
        
        if (!hasPermission) return; // Si no tiene el rol, no hace nada

        // Borramos el comando $owners del chat
        message.delete().catch(() => {});

        const embed = new EmbedBuilder()
            .setTitle('👑 Panel de Control: CAOSMC')
            .setColor(0x00FF00)
            .setDescription('Comandos de acceso restringido para Owners:')
            .addFields(
                { name: '🔄 $restart', value: 'Reinicia el proceso del bot (CAOSMC).' },
                { name: '📢 $anuncio [mensaje]', value: 'Envía un anuncio oficial con @everyone.' },
                { name: '📢 $dmall [mensaje]', value: 'Envía MD a todos los miembros.' },
                { name: '📜 $banlist', value: 'Lista de usuarios baneados.' },
                { name: '📩 $dm @usuario [msg]', value: 'Envía un MD secreto al usuario.' },
                { name: '📊 $serverinfo', value: 'Muestra estadísticas del servidor.' }
            )
            .setFooter({ text: 'CAOSMC - Panel de Gestión Pro' });

        // Te lo envía al privado para que sea secreto
        message.author.send({ embeds: [embed] }).catch(() => {
            message.channel.send('❌ No pude enviarte el MD. ¡Abrí tus mensajes privados!').then(msg => setTimeout(() => msg.delete(), 5000));
        });
    }
};
