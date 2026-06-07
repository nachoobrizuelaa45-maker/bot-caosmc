const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js
const { esCanalValido } = require('./verificarCanal'); // CORREGIDO: Ruta local

module.exports = {
    name: 'robar',
    async execute(message, args) {
        // Borramos el comando original
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const target = message.mentions.members.first();
        const ahora = Date.now();
        const cooldownAmount = 120000; // 120 segundos

        // 1. Verificaciones básicas
        if (!target) return message.reply('❌ Tenés que mencionar a alguien para robar.').then(msg => setTimeout(() => msg.delete(), 5000));
        if (target.id === userId) return message.reply('⛔️ No podés robarte a vos mismo.').then(msg => setTimeout(() => msg.delete(), 5000));

        // 2. Cooldown persistente en DB central
        db.ensure(userId, { dinero: 0, armas: 0, ultimoRobo: 0 });
        const ultimoRobo = db.get(userId, "ultimoRobo");
        if (ahora - ultimoRobo < cooldownAmount) {
            const timeLeft = Math.round((cooldownAmount - (ahora - ultimoRobo)) / 1000);
            return message.reply(`⏰ Debes esperar **${timeLeft}s** para volver a robar.`).then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 3. Verificaciones de recursos
        const autorData = db.get(userId);
        const targetData = db.ensure(target.id, { dinero: 0 });

        if ((autorData.armas || 0) < 2) return message.reply('🔫🤑 Necesitás al menos **2 armas** para robar personas.').then(msg => setTimeout(() => msg.delete(), 5000));
        if (targetData.dinero < 1) return message.reply('🛑 ¡Esa persona no tiene ni un centavo!').then(msg => setTimeout(() => msg.delete(), 5000));

        // 4. Lógica de éxito/fallo
        const exito = Math.random() > 0.45;
        const botin = Math.floor(Math.random() * 3000) + 10;
        const multa = Math.floor(Math.random() * 5000);
        const armasPerdidas = Math.floor(Math.random() * 2) + 1;

        const embed = new EmbedBuilder();

        if (exito) {
            db.math(userId, "add", botin, "dinero");
            db.math(target.id, "sub", botin, "dinero");
            embed.setColor(0x00FF00)
                 .setTitle('🤑 Robo Exitoso')
                 .setDescription(`💰🔫 <@${userId}> le robó **${botin.toLocaleString()}$** a <@${target.id}>.`);
        } else {
            db.math(userId, "sub", multa, "dinero");
            db.math(userId, "sub", armasPerdidas, "armas");
            embed.setColor(0xFF0000)
                 .setTitle('🔫🚓 Intento de Robo')
                 .setDescription(`🚓 La policía te atrapó. Te sacaron **${multa.toLocaleString()}$** y **${armasPerdidas}** armas.`);
        }

        // 5. Guardar cooldown y enviar
        db.set(userId, ahora, "ultimoRobo");
        message.channel.send({ embeds: [embed] });
    }
};

