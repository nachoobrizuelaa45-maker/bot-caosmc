const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');
const { esCanalValido } = require('./verificarCanal');

module.exports = {
    name: 'vempresa', // Comando: $vempresa
    async execute(message) {
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const d = db.ensure(userId, { empresa: 0, dinero: 0 });
        const PRECIO_VENTA = 500000; // La mitad de 1.000.000$

        // 1. Verificar si tiene empresa para vender
        if (d.empresa < 1) {
            return message.reply('🏢🛑 No tenés ninguna empresa para vender.');
        }

        // 2. Realizar la venta
        db.math(userId, "sub", 1, "empresa");
        db.math(userId, "add", PRECIO_VENTA, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: `🏢 Vender Empresa`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🛒🏢 <@${userId}> vendiste tu empresa por **${PRECIO_VENTA.toLocaleString()}$**.`);
        
        message.channel.send({ embeds: [embed] });
        
        // Limpieza
        message.delete().catch(() => {});
    }
};
