const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Esto asumo que db.js está en la carpeta de arriba
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ahora busca en la carpeta actual

const cooldowns = new Map();

module.exports = {
    name: 'apostar',
    async execute(message, args) {
        // Borramos el comando original ni bien se ejecuta
        message.delete().catch(() => {});

        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        
        // Nos aseguramos de que el usuario exista en la DB central
        db.ensure(userId, { dinero: 0 });

        if (cooldowns.has(userId)) {
            return message.reply(`⏰ Tenés que esperar un poco para volver a apostar.`).then(msg => setTimeout(() => msg.delete(), 5000));
        }

        const input = args[0];
        if (!input) return message.reply('❌ ¡Poné un monto, che!').then(msg => setTimeout(() => msg.delete(), 5000));

        // Obtenemos el dinero actual REAL de la base centralizada
        const dineroActual = db.get(userId, "dinero");
        let monto = (input.toLowerCase() === 'all') ? dineroActual : parseInt(input);

        if (isNaN(monto) || monto <= 0) return message.reply('❌ Ingresá un monto que tenga sentido.').then(msg => setTimeout(() => msg.delete(), 5000));
        if (monto < 2000) return message.reply('⛔️ Mínimo 2000$ para apostar.').then(msg => setTimeout(() => msg.delete(), 5000));
        if (monto > dineroActual) return message.reply('⛔️ No te da el cuero, no tenés tanto dinero.').then(msg => setTimeout(() => msg.delete(), 5000));

        // Lógica de juego
        const azar = Math.floor(Math.random() * 100) + 1;

        if (azar > 65) {
            db.math(userId, "add", monto, "dinero");
            const nuevoSaldo = db.get(userId, "dinero");
            const embed = new EmbedBuilder()
                .setColor(0x61FF00)
                .setTitle('🎰 Casino')
                .setDescription(`😁 ¡Ganaste! Apostaste **${monto.toLocaleString()}$**. Saldo total: **${nuevoSaldo.toLocaleString()}$**.`);
            message.channel.send({ embeds: [embed] });
        } else {
            db.math(userId, "sub", monto, "dinero");
            const nuevoSaldo = db.get(userId, "dinero");
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🎰 Casino')
                .setDescription(`😭 ¡Perdiste! Apostaste **${monto.toLocaleString()}$**. Te quedan: **${nuevoSaldo.toLocaleString()}$**.`);
            message.channel.send({ embeds: [embed] });
        }

        cooldowns.set(userId, true);
        setTimeout(() => cooldowns.delete(userId), 60000);
    }
};

