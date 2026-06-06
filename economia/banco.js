const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'banco', // Nombre del comando
    async execute(message) {
        const userId = message.author.id;
        const d = db.ensure(userId, { dinero: 0, banco: 0, trabajos: 0, armas: 0, autos: 0, casas: 0, negocios: 0, empresas: 0 });

        const embed = new EmbedBuilder()
            .setColor(0xE91E63)
            .setAuthor({ name: `🏦 Banco de ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setDescription(
                `💰 **•CAPITAL FINANCIERO**\n💵 Dinero: ${d.dinero}$\n🏦 Banco: ${d.banco}$\n🥚 Trabajos: ${d.trabajos}\n🔫 Armas: ${d.armas}\n\n` +
                `🏘️ **•PROPIEDADES**\n🚗 Autos: ${d.autos}\n🏠 Casas: ${d.casas}\n🏢 Negocios: ${d.negocios}\n🏭 Empresas: ${d.empresas}\n\n` +
                `📄 **•RESUMEN**\n👤 banco ${message.author.username}\nvalorada en ${d.dinero + d.banco + (d.trabajos*50)}$`
            );
        message.channel.send({ embeds: [embed] });
    }
};
