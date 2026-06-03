const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'soporte2',
    execute(message, args) {
        // Solo administradores pueden enviar este mensaje
        if (!message.member.permissions.has('Administrator')) return;

        const embed = new EmbedBuilder()
            .setTitle('🔎• SOPORTE CAOSMC')
            .setDescription('**Seleccioná una categoría:**\n\n' +
                'ℹ️ • **Dudas:** Necesitas resolver tus dudas.\n' +
                '📁 • **Reportar usuario:** Reporta a un usuario que ha incumplido las reglas.\n' +
                '📋 • **Reportar staff:** Reporta a un staff que no está haciendo lo correcto.\n' +
                '📺 • **Creador de Contenido:** Reclama recompensa como creador de contenido.\n' +
                '📛 • **Apelar ban:** ¿Baneado injustamente o segunda oportunidad?\n' +
                '🆘 • **Soporte global:** Tienes un problema y necesitas ayuda.\n' +
                '🏆 • **Compra Exclusiva:** Comprar kit o Rango VIP.')
            .setColor(0xFF4500)
            .setFooter({ text: 'Equipo de Soporte Administración CAOSMC' });

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_dudas').setLabel('ℹ️').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('btn_reporte_usuario').setLabel('📁').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('btn_reporte_staff').setLabel('📋').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('btn_creador').setLabel('📺').setStyle(ButtonStyle.Primary)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_apelar').setLabel('📛').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('btn_soporte').setLabel('🆘').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('btn_compra').setLabel('🏆').setStyle(ButtonStyle.Primary)
        );

        message.channel.send({ embeds: [embed], components: [row1, row2] });
        message.delete().catch(() => {});
    }
};
            
