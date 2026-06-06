const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión a economia.sqlite
const { esCanalValido } = require('../verificarCanal');

module.exports = {
    name: 'rauto',
    async execute(message) {
        // Borramos el comando original
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const { author, member, guild } = message;
        const cooldownTime = 180000; // 3 minutos

        // 1. Verificación de datos en DB central
        db.ensure(author.id, { autos: 0, dinero: 0, ultimoRentaAuto: 0 });
        const userData = db.get(author.id);

        // 2. Manejo de Cooldown persistente
        if (Date.now() - userData.ultimoRentaAuto < cooldownTime) {
            const timeLeft = Math.ceil((cooldownTime - (Date.now() - userData.ultimoRentaAuto)) / 1000);
            return message.reply(`🕗• <@${author.id}> Debes esperar **${timeLeft}** segundos para volver a rentar.`)
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 3. Verificación de Auto
        if (userData.autos < 1) {
            return message.reply('🚗🛑• No tienes ningún vehículo para rentar.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 4. Lógica de Ganancia
        const ganancia = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
        
        db.math(author.id, "add", ganancia, "dinero");
        db.set(author.id, Date.now(), "ultimoRentaAuto");

        const embed = new EmbedBuilder()
            .setAuthor({ name: `🚗 Renta Auto ${member.displayName}`, iconURL: author.displayAvatarURL() })
            .setDescription(`🪙🚗• <@${author.id}> has recibido **$${ganancia.toLocaleString()}** por rentar tus autos.`)
            .setColor(0x00FF00)
            .setThumbnail(author.displayAvatarURL())
            .setFooter({ text: `${author.username}`, iconURL: guild.iconURL() });

        message.channel.send({ embeds: [embed] });
    },
};
