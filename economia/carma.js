const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

module.exports = {
    name: 'carma', // El comando que vas a usar: $carma
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const d = db.ensure(userId, { armas: 0, dinero: 0 });
        const PRECIO = 15000;

        // 1. Límite de armas
        if (d.armas >= 5) {
            return message.reply('🛒🔫 Ya tenés el límite de 5 armas, no podés comprar más.');
        }

        // 2. Validación de saldo
        if (d.dinero < PRECIO) {
            return message.reply('⛔️ No tenés suficiente dinero en efectivo para comprar un arma (Cuesta 15.000$).');
        }

        // 3. Compra
        db.math(userId, "add", 1, "armas");
        db.math(userId, "sub", PRECIO, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🔫 Compra de Arma`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🔫 <@${userId}> compraste un arma por **${PRECIO.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
    }
};
