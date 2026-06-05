const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // 1. Ignorar si es bot o administrador
        if (message.author.bot || message.member?.permissions.has('Administrator')) return;

        // 2. Si el sistema está apagado, no hacemos nada
        if (global.antiLinksActivado === false) return;

        // 3. Detectar links o invitaciones de Discord
        const links = ['http://', 'https://', 'discord.gg', 'discord.me', 'dsc.gg'];
        if (links.some(link => message.content.toLowerCase().includes(link))) {
            
            // Borrar el mensaje infractor
            await message.delete().catch(() => {});

            // ID del rol de mute
            const muteRoleId = '1511106642341789726';

            // Intentar dar el rol de mute
            try {
                if (!message.member.roles.cache.has(muteRoleId)) {
                    await message.member.roles.add(muteRoleId).catch(console.error);
                }
            } catch (err) {
                console.error("Error al dar el rol de mute:", err);
            }

            // Armar el Embed de aviso
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`⚠️ Alerta: Se ha detectado SPAM de ${message.member.displayName}`)
                .setDescription(`🛡️ • No se permiten links en este servidor.\n⛔ • Has sido **MUTEADO** automáticamente por enviar SPAM.`)
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter({ text: `⚠️•Anti-SPAM ${message.guild.name}` });

            // Enviar el aviso (se queda fijo en el canal)
            message.channel.send({ embeds: [embed] });
        }
    }
};
                                                    
