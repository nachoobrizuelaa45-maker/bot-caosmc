const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'iniciar_postulacion',
    execute(message) {
        // Embed con el diseño que querías
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('📋 ¿Cómo postular?')
            .setDescription('Si cumples con todos los requisitos pulsa en Postular.')
            .setImage('URL_DE_TU_IMAGEN_AQUI'); // Poné acá el link de tu banner

        // Fila con el botón que activa el evento 'abrir_ticket'
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('abrir_ticket')
                .setLabel('👔 POSTULAR')
                .setStyle(ButtonStyle.Primary)
        );

        // Envía el mensaje con el botón al canal donde ejecutes el comando
        message.channel.send({ embeds: [embed], components: [row] });
    },
};
