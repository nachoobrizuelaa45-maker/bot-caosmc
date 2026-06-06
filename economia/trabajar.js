const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { trabajos } = require('../data.js'); 

module.exports = {
    name: 'trabajar',
    async execute(message) {
        const userId = message.author.id;
        
        // 1. Nos aseguramos que el usuario tenga un registro inicial en la DB
        db.ensure(userId, { dinero: 0, trabajos: 0, trabajoActual: 'Desempleado' });

        // 2. Leemos el trabajo actual desde la base de datos
        const trabajoActual = db.get(userId, "trabajoActual");

        // 3. Verificamos si tiene un trabajo firmado
        if (trabajoActual === 'Desempleado') {
            return message.reply('❌ No tenés un trabajo firmado. Usá `$trabajos firmar [nombre]` primero.');
        }

        // 4. Buscamos la información del trabajo en la lista
        const trabajoData = trabajos.find(t => t.nombre.toLowerCase() === trabajoActual.toLowerCase());

        // 5. Cálculo de pago
        const nivel = trabajos.indexOf(trabajoData) + 1; 
        const pagoBase = nivel * 150;
        const bonus = Math.floor(Math.random() * 200);
        const ganancia = pagoBase + bonus;

        // 6. Actualizamos los valores en la base de datos
        db.math(userId, "add", 1, "trabajos");
        db.math(userId, "add", ganancia, "dinero");

        // 7. Obtenemos el total actualizado para el mensaje
        const totalTrabajos = db.get(userId, "trabajos");
        
        // 8. Enviamos el mensaje de éxito
        message.reply(`👷 **${message.member.displayName}**, trabajaste como **${trabajoActual}** y ganaste **${ganancia}$**.\nTotal de trabajos: **${totalTrabajos}**`);
    }
};
