const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

// Objeto para manejar el cooldown simple
const cooldowns = new Map();

module.exports = {
    name: 'apostar',
    async execute(message, args) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const d = db.ensure(userId, { dinero: 0 });

        // Cooldown de 60 segundos
        if (cooldowns.has(userId)) {
            return message.reply(`⏰ Debes esperar para volver a apostar.`);
        }

        const input = args[0];
        if (!input) return message.reply('❌ Debes ingresar una cantidad.');

        // Lógica de "all" o número
        let monto = (input.toLowerCase() === 'all') ? d.dinero : parseInt(input);

        if (isNaN(monto) || monto <= 0) return message.reply('❌ Ingresá un monto válido.');
        if (monto < 2000) return message.reply('⛔️ No puedes apostar menos de 2000$.');
        if (monto > d.dinero) return message.reply('⛔️ No tienes tanto dinero.');

        // Probabilidad: Ganás solo si el número es mayor a 65 (65% perder / 35% ganar)
        const azar = Math.floor(Math.random() * 100) + 1;

        if (azar > 65) {
            // ¡GANASTE!
            db.math(userId, "add", monto, "dinero");
            const embed = new EmbedBuilder()
                .setColor(0x61FF00)
                .setTitle('🎰 Casino')
                .setDescription(`😁 ¡Ganaste! Has apostado **${monto.toLocaleString()}$** y ganaste el doble.`);
            message.channel.send({ embeds: [embed] });
        } else {
            // PERDISTE
            db.math(userId, "sub", monto, "dinero");
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🎰 Casino')
                .setDescription(`😭 ¡Perdiste! Apostaste **${monto.toLocaleString()}$** y te quedaste sin nada.`);
            message.channel.send({ embeds: [embed] });
        }

        // Activar cooldown
        cooldowns.set(userId, true);
        setTimeout(() => cooldowns.delete(userId), 60000);
    }
};
