const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'cempresa',
    async execute(message) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const PRECIO_EMPRESA = 1000000;

        // Nos aseguramos de tener la estructura en la DB central
        db.ensure(userId, { empresa: 0, dinero: 0 });
        const dineroActual = db.get(userId, "dinero");

        // 1. Validación de saldo
        if (dineroActual < PRECIO_EMPRESA) {
            return message.reply('⛔️ No tenés suficiente dinero en efectivo para comprar una empresa (Cuesta 1.000.000$).')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Realizar compra en la DB central
        db.math(userId, "add", 1, "empresa");
        db.math(userId, "sub", PRECIO_EMPRESA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏢 Compra de Empresa`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🏢 <@${userId}> compraste una empresa por **${PRECIO_EMPRESA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
    }
};

