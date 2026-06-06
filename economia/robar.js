const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

const cooldowns = new Map();

module.exports = {
    name: 'robar',
    async execute(message, args) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const target = message.mentions.members.first();
        
        // 1. Cooldown y Verificaciones
        if (cooldowns.has(userId)) return message.reply('⏰ Debes esperar para volver a robar.');
        if (!target) return message.reply('❌ Tenés que mencionar a alguien para robar.');
        if (target.id === userId) return message.reply('⛔️ No podés robarte a vos mismo.');

        const autorData = db.ensure(userId, { armas: 0, dinero: 0 });
        const targetData = db.ensure(target.id, { dinero: 0 });

        if (autorData.armas < 2) return message.reply('🔫🤑 Necesitás al menos **2 armas** para robar personas.');
        if (targetData.dinero < 1) return message.reply('🛑 ¡Esa persona no tiene ni un centavo!');

        // 2. Probabilidades
        const exito = Math.random() > 0.45; // 55% éxito
        const botin = Math.floor(Math.random() * 3000) + 10;
        const multa = Math.floor(Math.random() * 5000);
        const armasPerdidas = Math.floor(Math.random() * 2) + 1;

        const embed = new EmbedBuilder();

        if (exito) {
            // ÉXITO
            db.math(userId, "add", botin, "dinero");
            db.math(target.id, "sub", botin, "dinero");

            embed.setColor(0x00FF00)
                 .setTitle('🤑 Robo Exitoso')
                 .setDescription(`💰🔫 <@${userId}> le robó **${botin.toLocaleString()}$** a <@${target.id}>.`);
        } else {
            // FALLO (POLICÍA)
            db.math(userId, "sub", multa, "dinero");
            db.math(userId, "sub", armasPerdidas, "armas");

            embed.setColor(0xFF0000)
                 .setTitle('🔫🚓 Intento de Robo')
                 .setDescription(`🚓 La policía te atrapó intentando robar a <@${target.id}>. Te sacaron **${multa.toLocaleString()}$** y **${armasPerdidas}** armas.`);
        }

        message.channel.send({ embeds: [embed] });

        // Cooldown de 120s
        cooldowns.set(userId, true);
        setTimeout(() => cooldowns.delete(userId), 120000);
    }
};
