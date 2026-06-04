const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'panel',
    execute(message, args) {
        const embed = new EmbedBuilder()
            .setTitle('🔎 • Seleccióne una categoría • 🗒️')
            .setColor(0xFF0000) // Borde rojo
            .setDescription(
                'ℹ️ • **Dudas**\n' +
                'Necesitas resolver tus dudas.\n\n' +
                
                '📁 • **Reportar usuario**\n' +
                'Reportar a un usuario que ha incumplido las normas.\n\n' +
                
                '📋 • **Reportar staff**\n' +
                'Reportar a un staff que no está haciendo lo correcto.\n\n' +
                
                '📺 • **Creador de Contenido**\n' +
                'Reclama recompensa como creador.\n\n' +
                
                '📛 • **Apelar ban**\n' +
                '¿Baneado injustamente o segunda oportunidad?\n\n' +
                
                '🆘 • **Soporte global**\n' +
                'Tienes un problema y necesitas ayuda.\n\n' +
                
                '🏆 • **Compra Exclusiva**\n' +
                'Comprar kit o Rango VIP.'
            )
            .setImage('https://cdn.discordapp.com/attachments/1480431171069284352/1511937757537370202/Screenshot_20260604_003811_Google.jpg?ex=6a224543&is=6a20f3c3&hm=6cac616ee56e0705f337d2c925dcd22859010a747d29279efd040b43f7960c5b&')
            .setFooter({ text: '• Equipo de Soporte Administración CAOSMC' });

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
