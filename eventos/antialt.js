const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // Configuramos: ¿Cuántos días mínimos tiene que tener la cuenta?
        const DIAS_MINIMOS = 3; 
        
        // Calculamos la fecha de creación de la cuenta
        const fechaCreacion = member.user.createdAt;
        const ahora = new Date();
        const diferenciaTiempo = ahora - fechaCreacion;
        const diferenciaDias = diferenciaTiempo / (1000 * 60 * 60 * 24);

        // Si la cuenta es más nueva de lo permitido
        if (diferenciaDias < DIAS_MINIMOS) {
            
            // 1. Log en el canal de logs (usando tu ID)
            const canalLog = member.guild.channels.cache.get('1510257715430162552');
            if (canalLog) {
                const embed = new EmbedBuilder()
                    .setTitle('🚫 Cuenta Sospechosa Expulsada')
                    .setColor(0xFF8800)
                    .setDescription(`El usuario **${member.user.tag}** fue expulsado por ser una cuenta muy reciente.`)
                    .addFields(
                        { name: 'Fecha de creación:', value: `${fechaCreacion.toDateString()}`, inline: true },
                        { name: 'Antigüedad:', value: `${Math.floor(diferenciaDias)} días`, inline: true }
                    )
                    .setTimestamp();
                canalLog.send({ embeds: [embed] });
            }

            // 2. Expulsar al usuario
            try {
                await member.kick('Cuenta demasiado reciente (Anti-Alt)');
            } catch (err) {
                console.error("No pude expulsar a la cuenta alt:", err);
            }
        }
    }
};
