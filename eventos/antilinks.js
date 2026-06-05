const { EmbedBuilder, Events } = require('discord.js');

// Mapa para guardar advertencias (idUsuario: cantidad)
const advertencias = new Map();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // 1. Ignorar si el mensaje es de un bot o si el usuario es Administrador
        if (message.author.bot || message.member?.permissions.has('Administrator')) return;

        // 2. Si el sistema está apagado, no hacemos nada
        if (global.antiLinksActivado === false) return;

        // 3. Detectar links o invitaciones de Discord
        const links = ['http://', 'https://', 'discord.gg', 'discord.me', 'dsc.gg'];
        if (links.some(link => message.content.toLowerCase().includes(link))) {
            
            // Borrar el mensaje infractor
            await message.delete().catch(() => {});

            const userId = message.author.id;
            const cuenta = (advertencias.get(userId) || 0) + 1;
            advertencias.set(userId, cuenta);

            const muteRoleId = '1511106642341789726';

            if (cuenta >= 3) {
                // A la tercera advertencia: Muteamos y bloqueamos canal
                try {
                    // Agregar rol de mute
                    if (!message.member.roles.cache.has(muteRoleId)) {
                        await message.member.roles.add(muteRoleId).catch(console.error);
                    }
                    
                    // Bloqueamos el envío de mensajes en este canal específico
                    await message.channel.permissionOverwrites.create(message.member.id, { SendMessages: false });
                    
                    message.channel.send(`⛔ **${message.member.displayName}** ha sido MUTEADO por 10 minutos tras alcanzar 3/3 advertencias de SPAM.`);
                    
                    // Programamos la quita del rol y el permiso en 10 minutos
                    setTimeout(async () => {
                        await message.member.roles.remove(muteRoleId).catch(console.error);
                        // Quitamos el bloqueo del canal
                        await message.channel.permissionOverwrites.delete(message.member.id).catch(console.error);
                        message.channel.send(`✅ **${message.member.displayName}** ya cumplió su tiempo de mute y ha sido desmuteado.`);
                    }, 10 * 60 * 1000);

                } catch (err) { 
                    console.error("Error al gestionar el mute:", err); 
                }

                // Reiniciamos el contador tras el mute
                advertencias.delete(userId); 
            } else {
                // Si es 1/3 o 2/3, solo avisamos con un Embed
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`⚠️ Alerta: Se ha detectado SPAM de ${message.member.displayName}`)
                    .setDescription(`🛡️ • No se permiten links en este servidor.\n\n⚠️ **Advertencia: ${cuenta}/3**\n⛔ • A la 3ra advertencia serás MUTEADO por 10 minutos.`)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setFooter({ text: `⚠️•Anti-SPAM ${message.guild.name}` });

                message.channel.send({ embeds: [embed] });
            }
        }
    }
};
                                                                      
