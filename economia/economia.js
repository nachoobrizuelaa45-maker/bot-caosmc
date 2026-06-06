const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'economia', // Esto hace que el bot responda al comando $economia
    async execute(message, args) {
        
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ 
                name: '📈 • Economia CAOSMC RolePlay Android 🇦🇷 💻 PC', 
                iconURL: 'https://cdn.discordapp.com/icons/1500269922507296978/ef781bdaecb458097b77f8fa0cbe5e65.png?size=2048' 
            })
            .setDescription('\n\n')
            .addFields(
                { name: '💵 • Dinero:', value: '6.131.371.019$', inline: false },
                { name: '🏦 • Banco:', value: '12.095.960.866$', inline: false },
                { name: '🏘️ • Propiedades:', value: '1662/1776 🏡', inline: false },
                { name: '🏪 • Negocios:', value: '137/137 🛒', inline: false },
                { name: '🚗 • Vehículos:', value: '172794', inline: false },
                { name: '👤 • Ciudadanos:', value: '975803', inline: false }
            )
            .setImage('https://cdn.discordapp.com/attachments/1480431171069284352/1512810277903794329/Picsart_26-06-06_10-27-24-449.jpg?ex=6a2571dc&is=6a24205c&hm=35cf152e1bb2e9799e84b3c07365f5a9d2629f4bfd1c70cfe58ef4fdf3eb3f02&')
            .setFooter({ text: 'Estado economia de CAOSMC CRAFT' });

        message.channel.send({ embeds: [embed] });
    }
};

