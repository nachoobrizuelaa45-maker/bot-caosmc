const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'atracar',
    async execute(message) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const ahora = Date.now();
        const cooldownAmount = 120000; // 120 segundos

        // 1. Cooldown persistente en DB central
        db.ensure(userId, { armas: 0, dinero: 0, ultimoAtraco: 0 });
        const ultimoAtraco = db.get(userId, "ultimoAtraco");

        if (ahora - ultimoAtraco < cooldownAmount) {
            const timeLeft = Math.round((cooldownAmount - (ahora - ultimoAtraco)) / 1000);
            return message.reply(`⏰ Debes esperar **${timeLeft}s** para volver a atracar.`)
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Requisito de armas
        const armasActuales = db.get(userId, "armas");
        if (armasActuales < 3) {
            return message.reply('🔫🤑 Debes tener al menos **3** armas para poder atracar.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 3. Probabilidades y cálculos
        const exito = Math.random() < 0.6; 
        const botin = Math.floor(Math.random() * (40000 - 10000 + 1)) + 10000;
        const fianza = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
        const armasPerdidas = Math.floor(Math.random() * 5) + 1;

        const embed = new EmbedBuilder();

        if (exito) {
            // ÉXITO
            db.math(userId, "add", botin, "dinero");
            db.math(userId, "sub", armasPerdidas, "armas");
            
            embed.setColor(0x61FF00)
                 .setTitle('🏦 Atraco Exitoso')
                 .setDescription(`🤑 ¡Plan ejecutado! Lograste escapar y llevarte **${botin.toLocaleString()}$**.\nPero ojo, perdiste **${armasPerdidas}** armas en el proceso.`);
        } else {
            // DETENIDO
            db.math(userId, "sub", fianza, "dinero");
            db.math(userId, "sub", armasPerdidas, "armas");

            embed.setColor(0xFF0000)
                 .setTitle('👮‍♂️ Detenido')
                 .setDescription(`🚔 La policía te atrapó intentando atracar. Tuviste que pagar una fianza de **${fianza.toLocaleString()}$** y perdiste **${armasPerdidas}** armas.`);
        }

        // 4. Guardar tiempo de atraco y enviar mensaje
        db.set(userId, ahora, "ultimoAtraco");
        message.channel.send({ embeds: [embed] });
    }
};

