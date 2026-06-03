const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'servericon',
    execute(message, args) {
        // Verificamos si el servidor tiene icono
        const iconURL = message.guild.iconURL({ dynamic: true, size: 4096 });
        
        if (!iconURL) {
            return message.reply('❌ Este servidor no tiene un icono configurado.');
        }

        // Creamos los botones de formato para el icono
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('PNG')
                    .setStyle(ButtonStyle.Link)
                    .setURL(message.guild.iconURL({ extension: 'png', size: 4096 })),
                new ButtonBuilder()
                    .setLabel('JPEG')
                    .setStyle(ButtonStyle.Link)
                    .setURL(message.guild.iconURL({ extension: 'jpeg', size: 4096 })),
                new ButtonBuilder()
                    .setLabel('WEBP')
                    .setStyle(ButtonStyle.Link)
                    .setURL(message.guild.iconURL({ extension: 'webp', size: 4096 }))
            );

        // Creamos el embed
        const embed = new EmbedBuilder()
            .setTitle(`🌋 • Icono de ${message.guild.name}`)
            .setColor(Math.floor(Math.random() * 16777215))
            .setImage(iconURL)
            .setFooter({ text: `Comando ejecutado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        // Enviamos el embed con los botones
        message.reply({ embeds: [embed], components: [row] }).catch(console.error);
    }
};
