const { Events, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton() || !interaction.customId.startsWith('ticket_')) return;

        const { customId, user, guild } = interaction;
        const tipo = customId.split('_')[1];
        const categoriaID = '1511815644717256765';
        const rolStaff = '1512390208145068164';
        const rolSuperior = '1511522706493935757';

        // Configuración por tipo
        const configuracion = {
            soporte: { nombre: '🆘', msg: `🆘·Bienvenido al 👨‍💻·equipo de soporte,\n\n<@${user.id}> **escribe tu⚙️·problema y la razón del ticket y a continuación luego ⏰·espera pacientemente a que un miembro del STAFF atienda tu 🆘·ticket.**\n\n·⚠️ Se paciente y no menciones a ningún miembro de la administración.\n\n•Para cerrar este ticket menciona a un STAFF 🔒`, roles: [rolStaff] },
            alianza: { nombre: '📎', msg: `📎·Bienvenido al 👨‍💻·equipo de soporte,\n\n<@${user.id}> 1️⃣·Debes Cumplir los requisitos.\n2️⃣·Ser Dueño o/a Administrador\n3️⃣·Subir Nuestra Plantilla en tu canal de alianza!\n4️⃣• Tener mas de 50 miembros sin contar bot\n5️⃣• Si elimina nuestra plantilla nosotros hacemos lo mismo.\n\n·⚠️ Se paciente y no menciones a ningún miembro de la administración.\n•Para cerrar este ticket menciona a un STAFF🔒`, roles: [rolStaff] },
            reporte: { nombre: '📋', msg: `📋·Bienvenido al 👨‍💻·equipo de soporte,\n\n<@${user.id}> Rellene el 📋formulario:\n\n👤 • Nombre del reportado.\n📝 • Razón:\n📃 • Descripción del reporte:\n💾 • Pruebas:\n\n•Continuación luego ⏰·espera pacientemente a que un **STAFF** atienda tu 📋·ticket.\n\n·⚠️ Se paciente y no menciones a ningun miembro de la administración.\n•Para cerrar este ticket menciona a un STAFF🔒`, roles: [rolStaff] },
            bugs: { nombre: '🔩', msg: `🔩·Bienvenido al 👨‍💻·equipo de soporte,\n\n<@${user.id}> 🧾·informanos de tu problema luego espera pacientemente a que un 👨‍💻·miembro del staff se encargue de darte 👨‍🔧·soporte.\n\n**#Formato Reportes Bug Del Bot O Discord**\n📤 • Bug?:\n📝 • Descripción:\n💾 • Pruebas:\n\n·⚠️ Se paciente y no menciones a ningún miembro de la administración.\n•Para cerrar este ticket menciona a un STAFF 🔒`, roles: [rolStaff] },
            hablar: { nombre: '🕴', msg: `🕴·Bienvenido al 👨‍💻·equipo de soporte,\n\n<@${user.id}> Para Hablar Con El Dueño O Superior Escribe Su Ayuda Y Se Paciente.\n\n•Continuación luego ⏰·espera pacientemente a que un <@&${rolSuperior}> atienda tu 📋·ticket.\n\n·⚠️ Se paciente y no menciones a ningun Administrador.\n•Para cerrar este ticket menciona a un Administrador🔒`, roles: [rolSuperior] }
        };

        const config = configuracion[tipo];
        await interaction.deferReply({ ephemeral: true });

        const channel = await guild.channels.create({
            name: `ticket-${tipo}-${user.username}`,
            type: ChannelType.GuildText,
            parent: categoriaID,
            permissionOverwrites: [
                { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                ...config.roles.map(r => ({ id: r, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }))
            ]
        });

        const embed = new EmbedBuilder().setColor(0xFF0000).setDescription(config.msg);
        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('close_ticket').setLabel('Cerrar Ticket').setStyle(ButtonStyle.Danger));

        await channel.send({ content: `<@${user.id}>`, embeds: [embed], components: [row] });
        await interaction.editReply({ content: `✅ Ticket creado: ${channel}` });
    }
};

