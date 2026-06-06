const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'quitar-efectivo',
    async execute(message, args) {
        // 1. IDs autorizadas (Owners)
        const allowedOwners = ['1506013227686039562', '1509746102415392808'];

        // 2. Verificar si es Owner
        if (!allowedOwners.includes(message.author.id)) {
            return message.reply('⛔️ No tenés permiso para ejecutar esta acción.');
        }

        // 3. Obtener usuario y monto
        // El monto es args[0] y el usuario es la primera mención
        const monto = parseInt(args[0]);
        const target = message.mentions.members.first();

        if (!monto || isNaN(monto) || !target) {
            return message.reply('⛔️ Uso correcto: `$quitar-efectivo [monto] @usuario`');
        }

        // 4. Obtener datos y verificar saldo
        const d = db.ensure(target.id, { dinero: 0 });

        if (d.dinero < monto) {
            return message.reply(`⛔️ <@${target.id}> no tiene suficiente efectivo para quitarle.`);
        }

        // 5. Realizar la operación
        db.math(target.id, "sub", monto, "dinero");

        const embed = new EmbedBuilder()
            .setColor(0xE91E63)
            .setAuthor({ name: `🤑 Quitar Efectivo`, iconURL: target.user.displayAvatarURL() })
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(`El administrador <@${message.author.id}> le quitó **${monto.toLocaleString()}$** de los bolsillos a <@${target.id}>.`)
            .setFooter({ text: `${message.member.displayName} • ${new Date().toLocaleTimeString()}` });

        message.channel.send({ embeds: [embed] });
        
        // 6. Limpieza
        message.delete().catch(() => {});
    }
};
