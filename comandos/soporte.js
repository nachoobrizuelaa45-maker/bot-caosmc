const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'panel',
    execute(message, args) {
        // Embed del panel
        const embed = new EmbedBuilder()
            .setTitle('🔎• Seleccióne una 🗒️ categoría:')
            .setColor(0x00FF00)
            .setDescription(
                'ℹ️• **Dudas**: Necesitas resolver tus dudas.\n' +
                '📁• **Reportar usuario**: Reportar a un usuario que ha incumplido las normas.\n' +
                '📋• **Reportar staff**: Reportar a un staff que no está haciendo lo correcto.\n' +
                '📺• **Creador de Contenido**: Reclama recompensa como creador.\n' +
                '📛• **Apelar ban**: ¿Baneado injustamente o segunda oportunidad?\n' +
                '🆘• **Soporte global**: Tienes un problema y necesitas ayuda.\n' +
                '🏆• **Compra Exclusiva**: Comprar kit o Rango VIP.'
            );

        // Fila 1 de botones
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('ticket_dudas').setLabel('ℹ️').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('ticket_usuario').setLabel('📁').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('ticket_staff').setLabel('📋').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('ticket_contenido').setLabel('📺').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('ticket_ban').setLabel('📛').setStyle(ButtonStyle.Primary)
        );

        // Fila 2 de botones
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('ticket_soporte').setLabel('🆘').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('ticket_compra').setLabel('🏆').setStyle(ButtonStyle.Primary)
        );

        message.channel.send({ embeds: [embed], components: [row1, row2] });
    }
};
            
