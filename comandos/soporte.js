const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'soporte2',
    execute(message, args) {
        if (!message.member.permissions.has('Administrator')) return;

        const embed = new EmbedBuilder()
            .setTitle('🌋 SOPORTE OFICIAL CAOSMC 🌋')
            .setDescription('¡Hola! Seleccioná una categoría abajo y nuestro equipo se pondrá en contacto con vos lo antes posible.')
            .setColor(0xFF4500) // Un naranja volcánico
            .setThumbnail(message.guild.iconURL());

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('menu_tickets')
                .setPlaceholder('👉 ¡Presioná acá para desplegar!')
                .addOptions([
                    { label: '🆘 Soporte General', value: 'soporte_general', emoji: '🆘' },
                    { label: '❓ Help Técnico', value: 'soporte_general', emoji: '❓' },
                    { label: '🤝 Alianzas', value: 'soporte_general', emoji: '🤝' },
                    { label: '📁 Reportar Usuario', value: 'soporte_general', emoji: '📁' },
                    { label: '🔨 Reportar Bug', value: 'soporte_general', emoji: '🔨' },
                    { label: '⛔ Reportar Staff', value: 'reportar_staff', emoji: '⛔' }
                ])
        );

        message.channel.send({ embeds: [embed], components: [row] });
        message.delete().catch(() => {});
    }
};
            
