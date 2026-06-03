const { statusBedrock } = require('mcstatus');

module.exports = {
    name: 'ip',
    async execute(message, args) {
        // Borra el mensaje del usuario
        try {
            await message.delete();
        } catch (err) {
            console.log("No pude borrar el mensaje, revisá los permisos del bot.");
        }

        const embed = {
            title: '⚔️ ¡CONÉCTATE A  ⚡**CAOSMC**⚡!',
            description: 'Acá tenés los datos actualizados para entrar a jugar:\n\n' +
                         '🌐 **IP del Servidor**\n' +
                         'Caosmc_craft.aternos.me\n\n' +
                         '🔌 **Puerto**\n' +
                         '21709\n\n' +
                         '📦 **Versión**\n' +
                         '1.26.21.x new\n\n' +
                         '🛡️ **Modalidad**\n' +
                         'Survival🏝️, pvp⚔️, minas pvp⛏️',
            color: 0x2B2D31,
            footer: {
                text: '🌋 CAOSMC 🌋• Servidor Oficial'
            }
        };

        message.channel.send({ embeds: [embed] });
    }
};
