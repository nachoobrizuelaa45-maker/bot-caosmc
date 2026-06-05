const { EmbedBuilder, Events } = require('discord.js');

// Creamos un mapa para guardar el contador de advertencias (idUsuario: cantidad)
const advertencias = new Map();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // 1. Ignorar si es bot o administrador
        if (message.author.bot || message.member?.permissions.has('Administrator')) return;

        // 2. Si el sistema está apagado, no hacemos nada
        if (global.antiLinksActivado === false) return;

        // 3. Detectar links
        const links = ['http://', 'https://', 'discord.gg', 'discord.me', 'dsc.gg'];
        if (links.some(link => message.content.toLowerCase().includes(link))) {
            
            // Borrar el mensaje infractor
            await message.delete().catch(() => {});

            // Sumar advertencia
            const userId = message.author.id;
            const cuenta = (advertencias.get(userId) || 0) + 1;
            advertencias.set(userId, cuenta);

            const muteRoleId = '1511106642341789726';

            if (cuenta >= 3) {
                // A la tercera, muteamos
                try {
                    if (!message.member.roles.cache.has(muteRoleId)) {
                        await message.member.roles.add(muteRoleId).catch(console.error);
                    }
                } catch (err) { console.error("Error al dar el rol de mute:", err); }

                message.channel.send(`⛔ **${message.member.displayName}** ha sido MUTEADO por alcanzar 3/3 advertencias de SPAM.`);
                advertencias.delete(userId); // Reiniciamos el contador tras el mute
            } else {
                // Si es 1/3 o 2/3, solo avisamos
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`⚠️ Alerta: Se ha detectado SPAM de ${message.member.displayName}`)
                    .setDescription(`🛡️ • No se permiten links en este servidor.\n\n⚠️ **Advertencia: ${cuenta}/3**\n⛔ • A la 3ra advertencia serás MUTEADO.`)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setFooter({ text: `⚠️•Anti-SPAM ${message.guild.name}` });

                message.channel.send({ embeds: [embed] });
            }
        }
    }
};
                    
