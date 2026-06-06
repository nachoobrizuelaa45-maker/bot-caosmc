const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

module.exports = {
    name: 'vnegocio', // Comando: $vnegocio
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const d = db.ensure(userId, { negocio: 0, dinero: 0 });
        const PRECIO_VENTA = 250000; // La mitad de 500.000$

        // 1. Verificar si tiene negocio para vender
        if (d.negocio < 1) {
            return message.reply('🏬🛑 No tenés ningún negocio para vender.');
        }

        // 2. Realizar la venta
        db.math(userId, "sub", 1, "negocio");
        db.math(userId, "add", PRECIO_VENTA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏬 Vender Negocio`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🏬 <@${userId}> vendiste tu negocio por **${PRECIO_VENTA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
        
        // Limpieza
        message.delete().catch(() => {});
    }
};
