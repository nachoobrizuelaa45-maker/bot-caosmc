const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'panelticket',
    execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('📡·Soporte Discord Oficial CAOSMC')
            .setColor(0xFF0000)
            .setDescription(`**Bienvenido al sistema de tickets de CAOSMC CRAFT OFICIAL ⭐ te daremos las opciones que quieras:

> 🆘・SOPORTE
  Tienes Problemas y necesitas qué te ayudemos o dudas?.

> 📎・ALIANZA
  realizar una alianza con CAOSMC CRAFT.

> 🔩・REPORTAR BUG
  Si quieres reportar un bug del bot o algo de nuestro Discord?.

> 🕴・HABLAR CON UN SUPERIOR
  Abre Ticket Si Deseas Hablar Con El Dueño O Algun Superior.

> 📋 •Reportar Usuario 
Podes Reportar A Un Usuario Que Incumple Las Normas

❗❗Recuerda Que Abrir Ticket Sin Razon Es Motivo De Sancion ❗❗**`)
            .setFooter({ text: '👨‍💻·Equipo de Soporte Administración CAOSMC' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('ticket_soporte').setLabel('🆘').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('ticket_alianza').setLabel('📎').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('ticket_bugs').setLabel('🔩').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('ticket_hablar').setLabel('🕴').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('ticket_reporte').setLabel('📋').setStyle(ButtonStyle.Danger)
        );

        message.channel.send({ embeds: [embed], components: [row] });
    }
};

