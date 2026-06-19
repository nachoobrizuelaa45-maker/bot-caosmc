const { EmbedBuilder } = require('discord.js');
const db = require('../db'); 
const { esCanalValido } = require('./verificarCanal'); 

module.exports = {
    name: 'cempresa',
    async execute(message) {
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const PRECIO_EMPRESA = 1000000;

        // Aseguramos la estructura usando 'empresas' (con S)
        db.ensure(userId, { empresas: 0, dinero: 0 });
        const dineroActual = db.get(userId, "dinero");

        // 1. Validación de saldo
        if (dineroActual < PRECIO_EMPRESA) {
            return message.reply('⛔️ No tenés suficiente dinero en efectivo para comprar una empresa (Cuesta 1.000.000$).')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Realizar compra usando 'empresas'
        db.math(userId, "add", 1, "empresas"); // <-- CORREGIDO: Ahora suma a 'empresas'
        db.math(userId, "sub", PRECIO_EMPRESA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏢 Compra de Empresa`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🏢 <@${userId}> compraste una empresa por **${PRECIO_EMPRESA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
    }
};
