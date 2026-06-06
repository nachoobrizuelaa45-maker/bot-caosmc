const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // ID del canal de bienvenidas
        const canalId = '1503122932665417839';
        const canal = member.guild.channels.cache.get(canalId);
        
        if (!canal) return;

        const embed = new EmbedBuilder()
            .setColor(0xDB7093) // Rosado medio, elegante y con tono oscuro
            .setTitle("🎫 • Bienvenidos a CAOSMC 🚀")
            .setDescription(
                `🎉 • ¡Hola ${member}! Bienvenido a **CAOSMC** 🚀.\n\n` +
                "Este es un lugar donde puedes interactuar con otros miembros, participar en eventos y disfrutar de todas las funciones del servidor. 😊\n\n" +
                "Por favor, revisa las **reglas** y no dudes en presentarte en el canal correspondiente. ¡Disfruta tu estadía! 🌟\n\n" +
                "👤 • **Número total de miembros:**\n" +
                `${member.guild.memberCount} miembros\n\n` +
                "📅 • **Fecha de creación de tu cuenta:**\n" +
                `${member.user.createdAt.toLocaleDateString()}\n\n` +
                "🚀 • **Siguientes pasos:**\n" +
                "1. Revisa las **reglas** del servidor.\n" +
                "2. Presenta a ti mismo/a en el canal adecuado.\n" +
                "3. ¡Empieza a interactuar y a divertirte!"
            )
            .setImage('https://cdn.discordapp.com/attachments/1510357487235235850/1512670564676931714/Picsart_26-06-06_01-10-46-962.jpg?ex=6a24efbe&is=6a239e3e&hm=b9389af18f17326adb4265c0cc7c21c482f92a957b567f1a6c1c84e26b378516&') // Reemplazá esto por tu URL
            .setFooter({ text: 'CAOSMC | Sistema de Bienvenida Automático 💻' });

        canal.send({ 
            content: `🚪 • ${member} acaba de unirse al servidor. ¡Démosle una cálida bienvenida! 🎊`, 
            embeds: [embed] 
        });
    }
};
