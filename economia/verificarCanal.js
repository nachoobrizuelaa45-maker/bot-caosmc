// economia/verificarCanal.js
module.exports = {
    esCanalValido(message) {
        const CANAL_ID = '1512815434188062922'; // Tu canal de economía

        // Si el mensaje está en el canal correcto, devolvemos true
        if (message.channel.id === CANAL_ID) {
            return true;
        }

        // Si no está en el canal correcto:
        // 1. Intentamos borrar el mensaje del usuario
        message.delete().catch(() => {});

        // 2. Enviamos el aviso y lo borramos a los 5 segundos
        message.channel.send(`💰• <@${message.author.id}>, este no es el canal de economía. Por favor, usá <#1512815434188062922>.`)
            .then(msg => {
                setTimeout(() => msg.delete().catch(() => {}), 5000);
            })
            .catch(() => {});

        return false;
    }
};
