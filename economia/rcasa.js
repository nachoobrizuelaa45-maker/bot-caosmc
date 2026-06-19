const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'rcasa',
    async execute(message) {
        // Borramos el comando original
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const ahora = Date.now();
        const cooldownAmount = 300000; // 5 minutos en milisegundos

        // Nos aseguramos de tener la estructura en la DB central
        db.ensure(userId, { casa: 0, dinero: 0, ultimoRenta: 0 });

        // 1. Verificación de Cooldown usando la base de datos (más seguro)
        const ultimoRenta = db.get(userId, "ultimoRenta");
        if (ahora - ultimoRenta < cooldownAmount) {
            const timeLeft = Math.round((cooldownAmount - (ahora - ultimoRenta)) / 1000);
            return message.reply(`🕗 Debes esperar **${timeLeft}** segundos para volver a rentar tus casas.`).then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Verificar si tiene al menos una casa
        const cantidadCasas = db.get(userId, "casa");
        if (cantidadCasas < 1) {
            return message.reply('🏡🛑 No tenés ninguna casa para rentar.').then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 3. Calcular ganancia
        const ganancia = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;

        // 4. Aplicar ganancia y actualizar tiempo de renta
        db.math(userId, "add", ganancia, "dinero");
        db.set(userId, ahora, "ultimoRenta");

        // 5. Enviar embed
        const embed = new EmbedBuilder()
            .setColor(0xE67E22)
            .setAuthor({ name: `🏡 Renta de Casa`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🪙🏡 <@${userId}> has recibido **${ganancia.toLocaleString()}$** por rentar tus casas durante 5 minutos.`);
        
        message.channel.send({ embeds: [embed] });
    }
};

