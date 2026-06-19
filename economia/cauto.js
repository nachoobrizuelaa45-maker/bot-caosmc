const { EmbedBuilder } = require('discord.js');
const db = require('../db'); 
const { esCanalValido } = require('./verificarCanal'); 

module.exports = {
    name: 'cauto',
    async execute(message) {
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const PRECIO_AUTO = 100000;

        // Aseguramos la estructura usando 'autos' (con S)
        db.ensure(userId, { autos: 0, dinero: 0 });
        const dineroActual = db.get(userId, "dinero");

        // 1. Validación de saldo
        if (dineroActual < PRECIO_AUTO) {
            return message.reply('⛔️ No tenés suficiente dinero en efectivo para comprar un auto (Cuesta 100.000$).')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Realizar compra usando la clave 'autos'
        db.math(userId, "add", 1, "autos"); // <-- CORREGIDO: Ahora suma a 'autos'
        db.math(userId, "sub", PRECIO_AUTO, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🚗 Comprar Vehículo`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🚗 <@${userId}> compraste un vehículo por **${PRECIO_AUTO.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
    }
};
