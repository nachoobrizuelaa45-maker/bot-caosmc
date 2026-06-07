const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'ccasa',
    async execute(message) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const PRECIO_CASA = 200000;

        // Nos aseguramos de tener la estructura en la DB central
        db.ensure(userId, { casa: 0, dinero: 0 });
        const dineroActual = db.get(userId, "dinero");

        // 1. Validación de saldo
        if (dineroActual < PRECIO_CASA) {
            return message.reply('⛔️ No tenés suficiente dinero en efectivo para comprar una casa (Cuesta 200.000$).')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Realizar compra en la DB central
        db.math(userId, "add", 1, "casa");
        db.math(userId, "sub", PRECIO_CASA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏡 Compra de Casa`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🏠 <@${userId}> compraste una casa por **${PRECIO_CASA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
    }
};

