const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('../verificarCanal');

module.exports = {
    name: 'vauto',
    async execute(message) {
        // Borramos el comando original apenas se ejecuta
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const PRECIO_VENTA = 50000;

        // Nos aseguramos de obtener los datos de la DB central
        db.ensure(userId, { auto: 0, dinero: 0 });
        const cantidadAutos = db.get(userId, "auto");

        // 1. Verificar si tiene vehículo para vender
        if (cantidadAutos < 1) {
            return message.reply('🚗🛑 No tenés ningún vehículo para vender.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Realizar la venta en la DB central
        db.math(userId, "sub", 1, "auto");
        db.math(userId, "add", PRECIO_VENTA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🚗 Vender Vehículo`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🚗 <@${userId}> vendiste tu vehículo por **${PRECIO_VENTA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
    }
};

