const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'req',
    execute(message, args) {
        // Creamos el embed con los requisitos que pasaste
        const embed = new EmbedBuilder()
            .setAuthor({ 
                name: '💥•Requisitos Para Alianza 📊', 
                iconURL: message.author.displayAvatarURL() 
            })
            .setThumbnail(message.author.displayAvatarURL())
            .setColor(Math.floor(Math.random() * 16777216)) // Color aleatorio
            .setDescription(
                '***📜 •Buenas, estos son algunos de los requisitos para hacer alianza con CAOSMC**\n\n' +
                '🚨• Tener una Plantilla bien Elaborada\n\n' +
                '🌴•No ser una comunidad de spam o +18.\n\n' +
                '💥 • Mínimo de usuarios para hacer una alianza es de (50)***'
            )
            .setFooter({ 
                text: message.guild.name, 
                iconURL: message.guild.iconURL() 
            })
            .setTimestamp();

        // Enviamos el mensaje
        message.channel.send({ embeds: [embed] });

        // Borramos el comando $req que escribiste
        message.delete().catch(() => {});
    }
};
