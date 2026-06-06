const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

module.exports = {
    name: 'ccasa', // Comando: $ccasa
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const d = db.ensure(userId, { casa: 0, dinero: 0 });
        const PRECIO_CASA = 200000;

        // 1. Validación de saldo
        if (d.dinero < PRECIO_CASA) {
            return message.reply('⛔️ No tenés suficiente dinero en efectivo para comprar una casa (Cuesta 200.000$).');
        }

        // 2. Realizar compra
        db.math(userId, "add", 1, "casa");
        db.math(userId, "sub", PRECIO_CASA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏡 Compra de Casa`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🏠 <@${userId}> compraste una casa por **${PRECIO_CASA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
        
        // Limpieza
        message.delete().catch(() => {});
    }
};
