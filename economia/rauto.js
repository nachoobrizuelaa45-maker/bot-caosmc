const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión a economia.sqlite
const { esCanalValido } = require('./verificarCanal'); 

module.exports = {
    name: 'rauto',
    async execute(message) {
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const { author, member, guild } = message;
        const cooldownTime = 180000; // 3 minutos

        // 1. Aseguramos que el usuario exista en la DB
        if (!db.has(author.id)) {
            db.set(author.id, { autos: 0, dinero: 0, ultimoRentaAuto: 0 });
        }
        
        const userData = db.get(author.id);

        // 2. Manejo de Cooldown
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
        
        // Actualizamos los datos
        db.math(author.id, "add", ganancia, "dinero");
        db.set(author.id, Date.now(), "ultimoRentaAuto");
        
        // IMPORTANTE: Si usas Enmap, a veces es necesario asegurar el guardado
        // Si tu librería tiene una función .defer() o .save(), úsala. 
        // Si no, esto debería bastar con el método normal.

        const embed = new EmbedBuilder()
            .setAuthor({ name: `🚗 Renta Auto ${member.displayName}`, iconURL: author.displayAvatarURL() })
            .setDescription(`🪙🚗• <@${author.id}> has recibido **$${ganancia.toLocaleString()}** por rentar tus autos.\n\nTotal acumulado: **$${(userData.dinero + ganancia).toLocaleString()}**`)
            .setColor(0x00FF00)
            .setThumbnail(author.displayAvatarURL())
            .setFooter({ text: `${author.username}`, iconURL: guild.iconURL() });

        message.channel.send({ embeds: [embed] });
    },
};
                                                                                                                                                
