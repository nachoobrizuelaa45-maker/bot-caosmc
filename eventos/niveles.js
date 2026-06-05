const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        let niveles = JSON.parse(fs.readFileSync('./niveles.json', 'utf8'));
        const userId = message.author.id;
        
        if (!niveles[userId]) niveles[userId] = { xp: 0, nivel: 1 };
        
        // ¡DIFICULTAD AUMENTADA! Ganan solo 1 o 2 de XP por mensaje
        niveles[userId].xp += Math.floor(Math.random() * 2) + 1;
        
        // Fórmula de XP necesaria: (nivel ^ 2) * 50. 
        // Ejemplo: Nivel 1 necesita 50, Nivel 10 necesita 5000.
        const xpNecesaria = Math.pow(niveles[userId].nivel, 2) * 50;
        
        if (niveles[userId].xp >= xpNecesaria) {
            niveles[userId].nivel += 1;
            niveles[userId].xp = 0;
            
            global.actualizarRoles(message.member, niveles[userId].nivel);
            
            const canalNiveles = message.client.channels.cache.get('1510295895625695352');
            if (canalNiveles) {
                const embed = new EmbedBuilder()
                    .setColor(0xFFFF00)
                    .setTitle('🔥 ¡Nivel Superado!')
                    .setDescription(`¡Increíble esfuerzo <@${userId}>!\nHas alcanzado el **Nivel ${niveles[userId].nivel}**.\n\n*El camino se vuelve más difícil...*`)
                    .setThumbnail(message.author.displayAvatarURL());
                canalNiveles.send({ embeds: [embed] });
            }
        }
        fs.writeFileSync('./niveles.json', JSON.stringify(niveles, null, 2));
    }
};
