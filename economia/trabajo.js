const { EmbedBuilder } = require('discord.js');
const Enmap = require('enmap');
const db = new Enmap({ name: "economia" });
const { trabajos } = require('../data.js'); // Asegurate que la ruta sea correcta

module.exports = {
    name: 'trabajos',
    async execute(message, args) {
        const userId = message.author.id;
        const accion = args[0];
        const nombreTrabajo = args.slice(1).join(" ");

        // --- LÓGICA SI EL USUARIO QUIERE FIRMAR ---
        if (accion === 'firmar') {
            const trabajoElegido = trabajos.find(t => t.nombre.toLowerCase() === nombreTrabajo.toLowerCase());
            
            if (!trabajoElegido) return message.reply('❌ Ese trabajo no existe.');

            db.ensure(userId, { trabajos: 0, dinero: 0, trabajoActual: 'Desempleado' });
            const totalTrabajos = db.get(userId, "trabajos") || 0;

            if (totalTrabajos < trabajoElegido.req) {
                return message.reply(`⛔️ ¡Necesitás ${trabajoElegido.req} trabajos realizados! Tenés ${totalTrabajos}.`);
            }

            // GUARDAMOS EL NOMBRE EXACTO DEL OBJETO (ej: "Agricultor")
            db.set(userId, trabajoElegido.nombre, "trabajoActual");
            
            const embedConfirm = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('✅ ¡Contrato Firmado!')
                .setDescription(`Ahora trabajás como **${trabajoElegido.nombre}**.\n¡Ponete a trabajar con \`$trabajar\`!`);

            return message.reply({ embeds: [embedConfirm] });
        }

        // --- LISTA POR DEFECTO ---
        const descripcion = trabajos.map(t => 
            `${t.emoji || '💼'} **${t.nombre}**: ${t.req} req.`
        ).join('\n');

        const embed = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setTitle('🏗️ Trabajos Disponibles')
            .setDescription(`**•• TRABAJOS FORTUNA ••**\n\n${descripcion}\n\nPara firmar, escribí: \`$trabajos firmar [nombre]\``);

        message.channel.send({ embeds: [embed] });
        message.delete().catch(() => {});
    }
};
