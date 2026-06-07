const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'carma',
    async execute(message) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const PRECIO = 15000;

        // Nos aseguramos de tener la estructura en la DB central
        db.ensure(userId, { armas: 0, dinero: 0 });
        const cantidadArmas = db.get(userId, "armas");
        const dineroActual = db.get(userId, "dinero");

        // 1. Límite de armas
        if (cantidadArmas >= 5) {
            return message.reply('🛒🔫 Ya tenés el límite de 5 armas, no podés comprar más.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Validación de saldo
        if (dineroActual < PRECIO) {
            return message.reply('⛔️ No tenés suficiente dinero en efectivo para comprar un arma (Cuesta 15.000$).')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 3. Compra en la DB central
        db.math(userId, "add", 1, "armas");
        db.math(userId, "sub", PRECIO, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🔫 Compra de Arma`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🔫 <@${userId}> compraste un arma por **${PRECIO.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
    }
};

