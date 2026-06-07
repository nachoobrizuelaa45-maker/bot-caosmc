const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'rnegocio',
    async execute(message) {
        // Borramos el comando original ni bien se ejecuta
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const ahora = Date.now();
        const cooldownAmount = 360000; // 6 minutos en milisegundos

        // Nos aseguramos de tener la estructura en la DB central
        db.ensure(userId, { negocio: 0, dinero: 0, ultimoRentaNegocio: 0 });

        // 1. Verificación de Cooldown desde la base de datos
        const ultimoRenta = db.get(userId, "ultimoRentaNegocio");
        if (ahora - ultimoRenta < cooldownAmount) {
            const timeLeft = Math.round((cooldownAmount - (ahora - ultimoRenta)) / 1000);
            return message.reply(`🕗 Debes esperar **${timeLeft}** segundos para volver a rentar.`).then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Verificar si tiene al menos un negocio
        const cantidadNegocios = db.get(userId, "negocio");
        if (cantidadNegocios < 1) {
            return message.reply('🏬🛑 No tenés ningún negocio para rentar.').then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 3. Calcular ganancia (entre 3000 y 6000)
        const ganancia = Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000;

        // 4. Aplicar ganancia y actualizar tiempo de renta en la base central
        db.math(userId, "add", ganancia, "dinero");
        db.set(userId, ahora, "ultimoRentaNegocio");

        // 5. Enviar embed
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏬 Renta de Negocio`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🪙🏬 <@${userId}> has recibido **${ganancia.toLocaleString()}$** por rentar tus negocios.`);
        
        message.channel.send({ embeds: [embed] });
    }
};

