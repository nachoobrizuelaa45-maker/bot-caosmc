// economia/verificarCanal.js
module.exports = {
    esCanalValido(message) {
        const CANAL_ID = '1512815434188062922'; // Tu canal de economía
        if (message.channel.id !== CANAL_ID) {
            message.delete().catch(() => {}); // Borra el comando si podés
            message.reply(`💰• <@${message.author.id}> Este no es el canal de <#1512815434188062922>`).then(msg => {
                setTimeout(() => msg.delete(), 5000); // Borra el aviso después de 5 segundos
            });
            return false;
        }
        return true;
    }
};
