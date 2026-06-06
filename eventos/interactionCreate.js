const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        // 1. LÓGICA DE VERIFICACIÓN
        if (interaction.customId === 'verificar_caosmc') {
            const rolId = '1505990704739123372'; 
            const member = interaction.member;

            if (member.roles.cache.has(rolId)) {
                return interaction.reply({ content: '✅ Ya tenés el rol.', ephemeral: true });
            }

            try {
                await member.roles.add(rolId);
                await interaction.reply({ content: '🎉 ¡Te has verificado correctamente!', ephemeral: true });
            } catch (error) {
                await interaction.reply({ content: '❌ Hubo un error al darte el rol.', ephemeral: true });
            }
            return; // Importante: salimos acá si fue verificación
        }

        // 2. LÓGICA DE SUGERENCIAS
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
        } else {
            return; // Si no es ninguno de los botones de sugerencia, salimos
        }

        await interaction.update({ embeds: [nuevoEmbed], components: [] });
    }
};
