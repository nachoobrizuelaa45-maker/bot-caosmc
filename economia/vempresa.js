const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'vempresa',
    async execute(message) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const PRECIO_VENTA = 500000; 

        // Nos aseguramos de obtener los datos de la DB central
        db.ensure(userId, { empresa: 0, dinero: 0 });
        const cantidadEmpresas = db.get(userId, "empresa");

        // 1. Verificar si tiene empresa para vender
        if (cantidadEmpresas < 1) {
            return message.reply('🏢🛑 No tenés ninguna empresa para vender.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Realizar la venta en la DB central
        db.math(userId, "sub", 1, "empresa");
        db.math(userId, "add", PRECIO_VENTA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏢 Vender Empresa`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🏢 <@${userId}> vendiste tu empresa por **${PRECIO_VENTA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
    }
};

