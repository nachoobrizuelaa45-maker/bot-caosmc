const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignorar si es bot o administrador
        if (message.author.bot || message.member?.permissions.has('Administrator')) return;

        // Detectar links o invitaciones de Discord
        const links = ['http://', 'https://', 'discord.gg', 'discord.me', 'dsc.gg'];
        if (links.some(link => message.content.toLowerCase().includes(link))) {
            
            // Borrar el mensaje
            await message.delete().catch(() => {});

            // Armar el Embed estilo BDFD que pediste
            const embed = new EmbedBuilder()
                .setColor(0xFF0000) // $color[ff0000]
                .setTitle(`⚠️ Alerta Se a detectado Un Spam ⚠️ de ${message.member.displayName}`) // $author
                .setDescription(`🛡️ • No se permiten links en este servidor.\n⛔ • Vuelves hacer SPAM serás Muteado.`) // $description
                .setThumbnail(message.author.displayAvatarURL()) // $thumbnail
                .setFooter({ text: `⚠️•Anti-SPAM ${message.guild.name}` }); // $footer

            // Enviar el aviso
            message.channel.send({ embeds: [embed] }).then(msg => {
                // Borrar el aviso después de unos segundos
                setTimeout(() => msg.delete().catch(() => {}), 10000);
            });
        }
    }
};
