const { EmbedBuilder } = require('discord.js');
const db = require('../db'); // Conexión centralizada al archivo db.js[span_1](start_span)[span_1](end_span)
const { trabajos } = require('../data.js'); 

module.exports = {
    name: 'trabajar',
    async execute(message) {
        // Borramos el comando original al instante
        message.delete().catch(() => {});

        const userId = message.author.id;
        
        // 1. Nos aseguramos que el usuario tenga un registro inicial en la DB central
        db.ensure(userId, { dinero: 0, trabajos: 0, trabajoActual: 'Desempleado' });

        // 2. Leemos el trabajo actual desde la base de datos
        const trabajoActual = db.get(userId, "trabajoActual");

        // 3. Verificamos si tiene un trabajo firmado
        if (trabajoActual === 'Desempleado') {
            return message.reply('❌ No tenés un trabajo firmado. Usá `$trabajos firmar [nombre]` primero.').then(msg => setTimeout(() => msg.delete(), 5000));
        }

        // 4. Buscamos la información del trabajo en la lista
        const trabajoData = trabajos.find(t => t.nombre.toLowerCase() === trabajoActual.toLowerCase());

        // 5. Cálculo de pago
        const nivel = trabajos.indexOf(trabajoData) + 1; 
        const pagoBase = nivel * 150;
        const bonus = Math.floor(Math.random() * 200);
        const ganancia = pagoBase + bonus;

        // 6. Actualizamos los valores en la base de datos centralizada
        db.math(userId, "add", 1, "trabajos");
        db.math(userId, "add", ganancia, "dinero");

        // 7. Obtenemos el total actualizado para el mensaje
        const totalTrabajos = db.get(userId, "trabajos");
        
        // 8. Enviamos el mensaje de éxito
        message.channel.send(`👷 **${message.member.displayName}**, trabajaste como **${trabajoActual}** y ganaste **${ganancia}$**.\nTotal de trabajos: **${totalTrabajos}**`);
    }
};

