const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'iniciar_postulacion',
    execute(message) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('abrir_ticket')
                .setLabel('👔 POSTULAR')
                .setStyle(ButtonStyle.Success)
        );

        message.channel.send({ 
            content: '¡Haz clic en el botón de abajo para iniciar tu postulación a CAOSMC!', 
            components: [row] 
        });
    },
};
