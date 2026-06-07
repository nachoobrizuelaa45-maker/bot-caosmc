const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

module.exports = {
    name: 'dar-efectivo',
    async execute(message, args) {
        if (!esCanalValido(message)) return;

        const allowedRoles = ['1506013227686039562', '1509746102415392808'];
        const hasRole = allowedRoles.some(roleId => message.member.roles.cache.has(roleId));

        if (!hasRole) {
            message.delete().catch(() => {});
            // CORREGIDO: Usar channel.send en vez de reply
            return message.channel.send('⛔️ No tenés el rol necesario para usar este comando.').then(msg => setTimeout(() => msg.delete(), 5000));
        }

        const monto = parseInt(args[0]);
        const target = message.mentions.members.first();

        if (!monto || isNaN(monto) || !target) {
            message.delete().catch(() => {});
            // CORREGIDO: Usar channel.send en vez de reply
            return message.channel.send('⛔️ Uso correcto: `$dar-efectivo [monto] @usuario`').then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // Aseguramos que exista el usuario antes de sumar
        db.ensure(target.id, { banco: 0 });
        
        // Sumar al banco
        db.math(target.id, "add", monto, "banco");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setDescription(`🏦 Se depositaron **${monto.toLocaleString()}$** en el banco de <@${target.id}>.`);

        message.channel.send({ embeds: [embed] });
        
        message.delete().catch(() => {});
    }
};
