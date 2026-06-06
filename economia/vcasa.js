const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

module.exports = {
    name: 'vcasa', // Comando: $vcasa
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const d = db.ensure(userId, { casa: 0, dinero: 0 });
        const PRECIO_VENTA = 100000; // La mitad de 200.000$

        // 1. Verificar si tiene casa para vender
        if (d.casa < 1) {
            return message.reply('🏡🛑 No tenés ninguna casa para vender.');
        }

        // 2. Realizar la venta
        db.math(userId, "sub", 1, "casa");
        db.math(userId, "add", PRECIO_VENTA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏡 Vender Casa`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🏡 <@${userId}> vendiste tu casa por **${PRECIO_VENTA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
        
        // Limpieza
        message.delete().catch(() => {});
    }
};
