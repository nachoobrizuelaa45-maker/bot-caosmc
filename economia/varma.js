const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'varma',
    async execute(message) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const PRECIO_VENTA = 9000;

        // Nos aseguramos de obtener los datos de la DB central
        db.ensure(userId, { armas: 0, dinero: 0 });
        const cantidadArmas = db.get(userId, "armas");

        // 1. Verificar si tiene armas para vender
        if (cantidadArmas < 1) {
            return message.reply('🔫🛑 No tenés ninguna arma para vender.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Realizar la venta en la DB central
        db.math(userId, "sub", 1, "armas");
        db.math(userId, "add", PRECIO_VENTA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🔫 Vender Arma`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🔫 <@${userId}> vendiste un arma por **${PRECIO_VENTA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
    }
};

