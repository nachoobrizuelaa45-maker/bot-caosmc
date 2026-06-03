const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'avatar',
    execute(message, args) {
        // Busca al usuario mencionado o al autor si no se menciona a nadie
        const user = message.mentions.users.first() || message.author;
        
        // Obtenemos la URL del avatar en alta resolución (2048)
        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 4096 });

        // Creamos los botones de formato
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('PNG')
                    .setStyle(ButtonStyle.Link)
                    .setURL(user.displayAvatarURL({ extension: 'png', size: 4096 })),
                new ButtonBuilder()
                    .setLabel('JPEG')
                    .setStyle(ButtonStyle.Link)
                    .setURL(user.displayAvatarURL({ extension: 'jpeg', size: 4096 })),
                new ButtonBuilder()
                    .setLabel('WEBP')
                    .setStyle(ButtonStyle.Link)
                    .setURL(user.displayAvatarURL({ extension: 'webp', size: 4096 }))
            );

        // Creamos el embed
        const embed = new EmbedBuilder()
            .setTitle(`👤 • Avatar de ${user.username}`)
            .setColor(Math.floor(Math.random() * 16777215)) // Color aleatorio igual que en tu otro comando
            .setImage(avatarURL)
            .setFooter({ text: `Comando ejecutado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        // Enviamos el embed con los botones
        message.reply({ embeds: [embed], components: [row] }).catch(console.error);
    }
};
