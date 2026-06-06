const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const rolesPermitidos = ['1506013227686039562', '1509746102415392808', '1503125667792027658'];
        if (!interaction.member.roles.cache.some(r => rolesPermitidos.includes(r.id))) {
            return interaction.reply({ content: '❌ No tenés permisos.', ephemeral: true });
        }

        const embedOriginal = interaction.message.embeds[0];
        const nuevoEmbed = EmbedBuilder.from(embedOriginal);

        if (interaction.customId === 'aceptar_sugerencia') {
            nuevoEmbed.setColor(0x00FF00).setDescription(`👔 ✅ La administración ha aceptado la sugerencia de ${interaction.message.embeds[0].author.name.replace('Nueva sugerencia de ', '')}.`);
        } else if (interaction.customId === 'rechazar_sugerencia') {
            nuevoEmbed.setColor(0xFF0000).setDescription(`👔 ❌ La administración ha rechazado la sugerencia de ${interaction.message.embeds[0].author.name.replace('Nueva sugerencia de ', '')}.`);
        }

        await interaction.update({ embeds: [nuevoEmbed], components: [] });
    }
};