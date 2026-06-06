const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

const cooldowns = new Map();

module.exports = {
    name: 'atracar',
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const d = db.ensure(userId, { armas: 0, dinero: 0 });

        // 1. Cooldown de 120s
        if (cooldowns.has(userId)) {
            return message.reply('⏰ Debes esperar para volver a atracar.');
        }

        // 2. Requisito de armas
        if (d.armas < 3) {
            return message.reply('🔫🤑 Debes tener al menos **3** armas para poder atracar.');
        }

        // 3. Probabilidades
        const exito = Math.random() < 0.6; // 60% probabilidad de éxito
        const botin = Math.floor(Math.random() * (40000 - 10000 + 1)) + 10000;
        const fianza = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
        const armasPerdidas = Math.floor(Math.random() * 5) + 1;

        const embed = new EmbedBuilder();

        if (exito) {
            // ÉXITO
            db.math(userId, "add", botin, "dinero");
            db.math(userId, "sub", armasPerdidas, "armas");
            
            embed.setColor(0x61FF00)
                 .setTitle('🏦 Atraco Exitoso')
                 .setDescription(`🤑 ¡Plan ejecutado! Lograste escapar y llevarte **${botin.toLocaleString()}$**.\nPero ojo, perdiste **${armasPerdidas}** armas en el proceso.`);
        } else {
            // DETENIDO
            db.math(userId, "sub", fianza, "dinero");
            db.math(userId, "sub", armasPerdidas, "armas");

            embed.setColor(0xFF0000)
                 .setTitle('👮‍♂️ Detenido')
                 .setDescription(`🚔 La policía te atrapó intentando atracar. Tuviste que pagar una fianza de **${fianza.toLocaleString()}$** y perdiste **${armasPerdidas}** armas.`);
        }

        message.channel.send({ embeds: [embed] });

        // Activar cooldown
        cooldowns.set(userId, true);
        setTimeout(() => cooldowns.delete(userId), 120000);
    }
};
