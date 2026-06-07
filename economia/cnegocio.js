const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'cnegocio',
    async execute(message) {
        // Borramos el comando original ni bien se ejecuta
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const PRECIO_NEGOCIO = 500000;

        // Nos aseguramos de tener la estructura en la DB central
        db.ensure(userId, { negocio: 0, dinero: 0 });
        const dineroActual = db.get(userId, "dinero");

        // 1. Validación de saldo
        if (dineroActual < PRECIO_NEGOCIO) {
            return message.reply('⛔️ No tenés suficiente dinero en efectivo para comprar un negocio (Cuesta 500.000$).')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Realizar compra en la DB central
        db.math(userId, "add", 1, "negocio");
        db.math(userId, "sub", PRECIO_NEGOCIO, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏬 Compra de Negocio`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🏬 <@${userId}> compraste un negocio por **${PRECIO_NEGOCIO.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
    }
};

