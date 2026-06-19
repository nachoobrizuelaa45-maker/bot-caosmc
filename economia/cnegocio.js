const { EmbedBuilder } = require('discord.js');
const db = require('../db'); 
const { esCanalValido } = require('./verificarCanal'); 

module.exports = {
    name: 'cnegocio',
    async execute(message) {
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const PRECIO_NEGOCIO = 500000;

        // Aseguramos la estructura usando 'negocios' (con S)
        db.ensure(userId, { negocios: 0, dinero: 0 });
        const dineroActual = db.get(userId, "dinero");

        // 1. Validación de saldo
        if (dineroActual < PRECIO_NEGOCIO) {
            return message.reply('⛔️ No tenés suficiente dinero en efectivo para comprar un negocio (Cuesta 500.000$).')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Realizar compra usando 'negocios'
        db.math(userId, "add", 1, "negocios"); // <-- CORREGIDO: Ahora suma a 'negocios'
        db.math(userId, "sub", PRECIO_NEGOCIO, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏬 Compra de Negocio`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🏬 <@${userId}> compraste un negocio por **${PRECIO_NEGOCIO.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
    }
};
