const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

module.exports = {
    name: 'varma', // Comando: $varma
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const d = db.ensure(userId, { armas: 0, dinero: 0 });
        const PRECIO_VENTA = 9000;

        // 1. Verificar si tiene armas para vender
        if (d.armas < 1) {
            return message.reply('🔫🛑 No tenés ninguna arma para vender.');
        }

        // 2. Realizar la venta
        db.math(userId, "sub", 1, "armas");
        db.math(userId, "add", PRECIO_VENTA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🔫 Vender Arma`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🔫 <@${userId}> vendiste un arma por **${PRECIO_VENTA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
    }
};
