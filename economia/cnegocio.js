const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

module.exports = {
    name: 'cnegocio', // Comando: $cnegocio
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const d = db.ensure(userId, { negocio: 0, dinero: 0 });
        const PRECIO_NEGOCIO = 500000;

        // 1. Validación de saldo
        if (d.dinero < PRECIO_NEGOCIO) {
            return message.reply('⛔️ No tenés suficiente dinero en efectivo para comprar un negocio (Cuesta 500.000$).');
        }

        // 2. Realizar compra
        db.math(userId, "add", 1, "negocio");
        db.math(userId, "sub", PRECIO_NEGOCIO, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏬 Compra de Negocio`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🏬 <@${userId}> compraste un negocio por **${PRECIO_NEGOCIO.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
        
        // Limpieza
        message.delete().catch(() => {});
    }
};
