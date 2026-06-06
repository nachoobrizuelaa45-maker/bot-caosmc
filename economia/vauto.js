const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

module.exports = {
    name: 'vauto', // Comando: $vauto
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const d = db.ensure(userId, { auto: 0, dinero: 0 });
        const PRECIO_VENTA = 50000; // La mitad de 100.000$

        // 1. Verificar si tiene vehículo para vender
        if (d.auto < 1) {
            return message.reply('🚗🛑 No tenés ningún vehículo para vender.');
        }

        // 2. Realizar la venta
        db.math(userId, "sub", 1, "auto");
        db.math(userId, "add", PRECIO_VENTA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🚗 Vender Vehículo`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🚗 <@${userId}> vendiste tu vehículo por **${PRECIO_VENTA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
        
        // Limpieza
        message.delete().catch(() => {});
    }
};
