const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'quitar-banco',
    async execute(message, args) {
        // 1. IDs permitidas (Owners)
        const allowedOwners = ['1506013227686039562', '1509746102415392808'];

        // 2. Verificar permisos de Owner
        if (!allowedOwners.includes(message.author.id)) {
            return message.reply('⛔️ No tenés permiso para ejecutar esta acción.');
        }

        // 3. Obtener usuario y monto
        const target = message.mentions.members.first();
        const monto = parseInt(args[0]);

        if (!target || !monto || isNaN(monto)) {
            return message.reply('⛔️ Uso correcto: `$quitar-banco [monto] @usuario`');
        }

        // 4. Obtener datos del usuario
        const d = db.ensure(target.id, { banco: 0 });

        // 5. Verificar saldo suficiente en el banco
        if (d.banco < monto) {
            return message.reply(`⛔️ <@${target.id}> no tiene suficiente dinero en el banco para quitarle (Tiene: ${d.banco.toLocaleString()}$).`);
        }

        // 6. Quitar el dinero del banco
        db.math(target.id, "sub", monto, "banco");

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setAuthor({ name: `📥 Remover Banco`, iconURL: target.user.displayAvatarURL() })
            .setDescription(`El administrador <@${message.author.id}> le quitó **${monto.toLocaleString()}$** del banco a <@${target.id}>.`);

        message.channel.send({ embeds: [embed] });
        
        // Limpieza
        message.delete().catch(() => {});
    }
};
