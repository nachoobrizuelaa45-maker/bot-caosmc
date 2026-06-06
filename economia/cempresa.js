const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

module.exports = {
    name: 'cempresa', // Comando: $cempresa
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const d = db.ensure(userId, { empresa: 0, dinero: 0 });
        const PRECIO_EMPRESA = 1000000;

        // 1. Validación de saldo
        if (d.dinero < PRECIO_EMPRESA) {
            return message.reply('⛔️ No tenés suficiente dinero en efectivo para comprar una empresa (Cuesta 1.000.000$).');
        }

        // 2. Realizar compra
        db.math(userId, "add", 1, "empresa");
        db.math(userId, "sub", PRECIO_EMPRESA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏢 Compra de Empresa`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🏢 <@${userId}> compraste una empresa por **${PRECIO_EMPRESA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
        
        // Limpieza
        message.delete().catch(() => {});
    }
};
