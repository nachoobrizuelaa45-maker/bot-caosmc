const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'soporte',
    description: 'Envía el menú de tickets',
    async execute(message, args) {
        if (!message.member.permissions.has('Administrator')) return;

        const embed = new EmbedBuilder()
            .setTitle('🎫 SOPORTE BLOCKRAFTT')
            .setDescription('Selecciona una categoría para abrir un ticket.')
            .setColor(0x2B2D31);

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ticket_menu')
                .setPlaceholder('Selecciona una categoría')
                .addOptions([
                    { label: 'Soporte', value: 'Soporte', description: '¿Necesitas ayuda o alguna duda?', emoji: '🆘' },
                    { label: 'Help', value: 'Help', description: '¿Soporte técnico o dudas?', emoji: '❓' },
                    { label: 'Alianza', value: 'Alianza', description: 'Temas de partner o alianzas mutuas.', emoji: '🤝' },
                    { label: 'Reporte', value: 'Reporte', description: '¿Reportar a un usuario?', emoji: '📁' },
                    { label: 'Reportar Bug', value: 'Reportar-Bug', description: '¿Encontraste algún bug?', emoji: '🔨' },
                    { label: 'Reportar Staff', value: 'Reportar-Staff', description: '¿Quieres reportar a un miembro del staff?', emoji: '👮' }
                ])
        );

        message.delete().catch(() => {});
        message.channel.send({ embeds: [embed], components: [row] });
    }
};
