const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada
const { esCanalValido } = require('../verificarCanal');

module.exports = {
    name: 'rempresa',
    async execute(message) {
        // Borramos el comando original
        message.delete().catch(() => {});
        
        if (!esCanalValido(message)) return;

        const userId = message.author.id;
        const ahora = Date.now();
        const cooldownAmount = 480000; // 8 minutos en milisegundos

        // Nos aseguramos de tener la estructura en la DB central
        db.ensure(userId, { empresa: 0, dinero: 0, ultimoRentaEmpresa: 0 });

        // 1. Verificación de Cooldown desde la base de datos
        const ultimoRenta = db.get(userId, "ultimoRentaEmpresa");
        if (ahora - ultimoRenta < cooldownAmount) {
            const timeLeft = Math.round((cooldownAmount - (ahora - ultimoRenta)) / 1000);
            return message.reply(`🕗 Debes esperar **${timeLeft}** segundos para volver a rentar tus empresas.`).then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 2. Verificar si tiene al menos una empresa
        const cantidadEmpresas = db.get(userId, "empresa");
        if (cantidadEmpresas < 1) {
            return message.reply('🏢🛑 No tenés ninguna empresa para rentar.').then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 3. Calcular ganancia aleatoria entre 10k y 20k
        const ganancia = Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;

        // 4. Aplicar ganancia y actualizar el tiempo de renta en la DB
        db.math(userId, "add", ganancia, "dinero");
        db.set(userId, ahora, "ultimoRentaEmpresa");

        // 5. Enviar embed
        const embed = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setAuthor({ name: `🏢 Renta de Empresa`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`🪙🏢 <@${userId}> has recibido **${ganancia.toLocaleString()}$** por rentar tus empresas.`);
        
        message.channel.send({ embeds: [embed] });
    }
};

