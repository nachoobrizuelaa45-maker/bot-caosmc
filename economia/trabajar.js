const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { trabajos } = require('../data.js'); // Asegurate de la ruta '../'

module.exports = {
    name: 'trabajar', // ¡Esto es clave!
    async execute(message) {
        const userId = message.author.id;
        
        // 1. Verificamos si tiene trabajo firmado
        const datosUsuario = db.ensure(userId, { dinero: 0, trabajos: 0, trabajoActual: 'Desempleado' });

        if (datosUsuario.trabajoActual === 'Desempleado') {
            return message.reply('❌ No tenés un trabajo firmado. Usá `$trabajos firmar [nombre]` primero.');
        }

        // 2. Buscamos el trabajo en la lista
        const trabajoData = trabajos.find(t => t.nombre.toLowerCase() === datosUsuario.trabajoActual.toLowerCase());

        // 3. Cálculo de pago (Bien balanceado)
        const nivel = trabajos.indexOf(trabajoData) + 1; 
        const pagoBase = nivel * 150;
        const bonus = Math.floor(Math.random() * 200);
        const ganancia = pagoBase + bonus;

        // 4. Actualizamos base de datos
        db.math(userId, "add", 1, "trabajos");
        db.math(userId, "add", ganancia, "dinero");

        const totalTrabajos = db.get(userId, "trabajos");
        
        // 5. Mensaje
        message.reply(`👷 **${message.member.displayName}**, trabajaste como **${datosUsuario.trabajoActual}** y ganaste **${ganancia}$**.\nTotal de trabajos: **${totalTrabajos}**`);
    }
};

