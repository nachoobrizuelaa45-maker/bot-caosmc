const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'anuncio',
    execute(message, args) {
        // --- SEGURIDAD: Solo usuarios con estos ROLES pueden usarlo ---
        const allowedRoles = ['1509746102415392808', '1506013227686039562'];
        
        // Verificamos si el autor tiene al menos uno de los roles permitidos
        const hasPermission = message.member.roles.cache.some(r => allowedRoles.includes(r.id));
        
        if (!hasPermission) {
            return message.reply('🚫 Comando exclusivo para Owners.');
        }

        // 1. Borramos el mensaje del comando inmediatamente
        message.delete().catch(err => console.error('No pude borrar el mensaje:', err));

        const anuncioTexto = args.join(' ');
        if (!anuncioTexto) {
            return message.channel.send('⚠️ Escribí el contenido del anuncio.').then(msg => setTimeout(() => msg.delete(), 5000));
        }

        const colores = [0x00FF00, 0xFF0000, 0xC8C864, 0x47EABC, 0xDF2E90, 0x543683, 0x264BEC];
        const colorRandom = colores[Math.floor(Math.random() * colores.length)];

        const embed = new EmbedBuilder()
            .setAuthor({ 
                name: `📰• Anuncio de ${message.author.username}`, 
                iconURL: message.author.displayAvatarURL() 
            })
            .setTitle('Anuncio Oficial')
            .setDescription(`**${anuncioTexto}**`)
            .setColor(colorRandom)
            .setThumbnail(message.guild.iconURL())
            .setTimestamp()
            .setFooter({ 
                text: 'Anuncio Oficial De CAOSMC', 
                iconURL: message.guild.iconURL() 
            });

        // Enviamos el mensaje
        message.channel.send({ content: '@everyone', embeds: [embed] });
    }
};
