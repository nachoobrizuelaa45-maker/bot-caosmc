const { Events } = require('discord.js');

// Mapa para guardar los mensajes recientes
const mensajesUsuario = new Map();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignorar si es bot, admin, o si el sistema está apagado
        if (message.author.bot || message.member?.permissions.has('Administrator')) return;
        if (global.antiFloodActivado === false) return;

        const userId = message.author.id;
        const ahora = Date.now();
        const muteRoleId = '1511106642341789726';

        // Gestión de mensajes
        const listaMensajes = mensajesUsuario.get(userId) || [];
        listaMensajes.push(ahora);

        // Filtramos mensajes de los últimos 3 segundos
        const mensajesRecientes = listaMensajes.filter(timestamp => ahora - timestamp < 3000);
        mensajesUsuario.set(userId, mensajesRecientes);

        // Si mandó más de 3 mensajes en 3 segundos -> FLOOD
        if (mensajesRecientes.length > 3) {
            
            // Borrar el mensaje infractor
            await message.delete().catch(() => {});

            // Aplicar Mute
            try {
                if (!message.member.roles.cache.has(muteRoleId)) {
                    await message.member.roles.add(muteRoleId).catch(console.error);
                    
                    // Bloqueamos el canal
                    await message.channel.permissionOverwrites.create(message.member.id, { SendMessages: false });

                    // Mensaje de aviso
                    message.channel.send(`⛔ **${message.member.displayName}** ha sido MUTEADO por 5 minutos debido a FLOOD. ¡Bajale un cambio!`).then(msg => {
                        // Opcional: borrar este aviso después de un tiempo
                        setTimeout(() => msg.delete().catch(() => {}), 10000);
                    });

                    // Temporizador de 5 minutos (5 * 60 * 1000)
                    setTimeout(async () => {
                        await message.member.roles.remove(muteRoleId).catch(console.error);
                        await message.channel.permissionOverwrites.delete(message.member.id).catch(console.error);
                        
                        message.channel.send(`✅ **${message.member.displayName}** ya cumpliste tu tiempo de mute. ¡Portate bien ahora!`);
                    }, 5 * 60 * 1000);
                }
            } catch (err) {
                console.error("Error al gestionar el mute por flood:", err);
            }

            // Limpiamos el contador para que no siga saltando el mute
            mensajesUsuario.set(userId, []);
        }
    }
};
