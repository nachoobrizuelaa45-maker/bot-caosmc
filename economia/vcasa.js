const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('../verificarCanal');

module.exports = {
    name: 'vcasa',
    async execute(message) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const PRECIO_VENTA = 100000;

        // Nos aseguramos de tener la estructura en la DB central
        db.ensure(userId, { casa: 0, dinero: 0 });
        const cantidadCasas = db.get(userId, "casa");

        // 1. Verificar si tiene casa para vender
        if (cantidadCasas < 1) {
            return message.reply('🏡🛑 No tenés ninguna casa para vender.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Realizar la venta en la DB central
        db.math(userId, "sub", 1, "casa");
        db.math(userId, "add", PRECIO_VENTA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏡 Vender Casa`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🏡 <@${userId}> vendiste tu casa por **${PRECIO_VENTA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
    }
};

