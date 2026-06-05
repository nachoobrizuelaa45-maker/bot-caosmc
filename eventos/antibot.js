const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // Configuramos el tiempo mínimo (en milisegundos)
        // 7 días = 7 * 24 * 60 * 60 * 1000
        const tiempoMinimo = 7 * 24 * 60 * 60 * 1000;
        const tiempoCreacion = member.user.createdTimestamp;
        const ahora = Date.now();

        // Si la cuenta tiene menos de 7 días
        if (ahora - tiempoCreacion < tiempoMinimo) {
            
            // Opciones:
            // 1. Mandarle un mensaje privado (si tiene los DMs abiertos)
            try {
                await member.send(`⚠️ **Alerta:** Tu cuenta es muy nueva para entrar a ${member.guild.name}. Se requiere que tenga al menos 7 días de antigüedad.`);
            } catch (e) {}

            // 2. Kickear al usuario automáticamente
            await member.kick("Cuenta demasiado nueva (Anti-Bot)").catch(console.error);

            // 3. Avisar en un canal de logs (opcional, cambiad el ID)
            // const canalLogs = member.guild.channels.cache.get('TU_ID_DE_CANAL_DE_LOGS');
            // if (canalLogs) canalLogs.send(`🚫 **${member.user.tag}** fue expulsado por tener una cuenta muy nueva.`);
        }
    }
};
