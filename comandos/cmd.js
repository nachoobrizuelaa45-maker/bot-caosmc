const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'cmd',
    execute(message, args) {
        const embed = new EmbedBuilder()
            .setTitle('🌋 COMANDOS DE CAOSMC 🌋')
            .setColor(0xFF4500) // Un naranja/rojo bien temático
            .setThumbnail(message.guild.iconURL())
            .setDescription('¡Hola, Crack! 👋 Acá tenés la lista de comandos disponibles para los miembros de nuestra comunidad:')
            .addFields(
                { name: '👤 COMANDOS DE USUARIO', value: 
                    '• `$apodo [nombre]` - Cambiá tu apodo (6 días cooldown).\n' +
                    '• `$avatar [@usuario]` - Foto de perfil en grande.\n' +
                    '• `$userinfo [@usuario]` - Información detallada.' 
                },
                { name: '🏰 INFORMACIÓN DEL SERVER', value: 
                    '• `$serverinfo` - Estadísticas del servidor.\n' +
                    '• `$servericon` - Logo del servidor en grande.\n' +
                    '• `$ip` - Dirección IP para entrar a jugar.' 
                }
            )
            .setFooter({ text: 'CAOSMC | ¡Tu aventura comienza aquí!', iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        // Enviamos al MD y borramos el original
        message.author.send({ embeds: [embed] })
            .then(() => {
                message.reply('📩 ¡Te envié la lista de comandos a tus mensajes privados, Crack!').then(msg => setTimeout(() => msg.delete(), 5000));
            })
            .catch(() => {
                message.reply('❌ ¡No pude enviarte el MD! Abrí tus mensajes privados así te puedo pasar la info.').then(msg => setTimeout(() => msg.delete(), 5000));
            });

        message.delete().catch(() => {});
    }
};
