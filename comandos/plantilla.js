module.exports = {
    name: 'plantilla',
    execute(message, args) {
        // --- SEGURIDAD: Solo Staff o vos ---
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply('🚫 No tenés permiso para usar este comando.');
        }

        const textoPlantilla = `
╭━━━ 🌋 𝐂𝐀𝐎𝐒𝐌𝐂𝐂𝐑𝐀𝐅𝐓 🌋 ━━━╮

✨ ᴅᴏɴᴅᴇ ᴇʟ ᴄᴀᴏs sᴇ ᴄᴏɴᴠɪᴇʀᴛᴇ ᴇɴ ᴀᴠᴇɴᴛᴜʀᴀ ✨

⚔️ ᴘʀᴇᴘᴀ́ʀᴀᴛᴇ ᴘᴀʀᴀ ᴠɪᴠɪʀ ᴜɴᴀ ᴇxᴘᴇʀɪᴇɴᴄɪᴀ ᴜ́ɴɪᴄᴀ ᴇɴ ᴍɪɴᴇᴄʀᴀғᴛ ʙᴇᴅʀᴏᴄᴋ

🏰 ᴄʀᴇᴀ ᴛᴜ ʜɪsᴛᴏʀɪᴀ, ғᴏʀᴍᴀ ᴛᴜ ᴄʟᴀɴ, ᴅᴏᴍɪɴᴀ ᴇʟ ᴘᴠᴘ ʏ ᴄᴏɴǫᴜɪsᴛᴀ ᴇʟ ʀᴇɪɴᴏ

👑 𝐂𝐀𝐑𝐀𝐂𝐓𝐄𝐑𝐈́𝐒𝐓𝐈𝐂𝐀𝐒 👑

💰 ᴇᴄᴏɴᴏᴍɪ́ᴀ ᴀᴄᴛɪᴠᴀ
🎁 ᴇᴠᴇɴᴛᴏs ᴄᴏɴ ᴘʀᴇᴍɪᴏs
⚡ ᴘᴠᴘ ᴄᴏᴍᴘᴇᴛɪᴛɪᴠᴏ
⭐ sɪsᴛᴇᴍᴀ ᴅᴇ ɴɪᴠᴇʟᴇs
🐉 ʙᴏssᴇs ᴇsᴘᴇᴄɪᴀʟᴇs
👑 ʀᴀɴɢᴏs ᴇxᴄʟᴜsɪᴠᴏs
🌟 sɪsᴛᴇʙᴀʀ ᴘᴇʀsᴏɴᴀʟɪᴢᴀᴅᴏ

🎮 𝐃𝐀𝐓𝐎𝐒 𝐃𝐄𝐋 𝐒𝐄𝐑𝐕𝐄𝐑 🎮

📱 ᴍɪɴᴇᴄʀᴀғᴛ ʙᴇᴅʀᴏᴄᴋ
🎮 ᴠᴇʀsɪᴏ́ɴ 1.21.x
🌍 ɪᴘ: ᴘʀᴏ́xɪᴍᴀᴍᴇɴᴛᴇ

🌐 https://discord.gg/VxRyDGZ2k

🚀 𝐔́𝐍𝐄𝐓𝐄 𝐇𝐎𝐘 🚀

💙 ᴛᴜ ᴀᴠᴇɴᴛᴜʀᴀ ᴄᴏᴍɪᴇɴᴢᴀ ᴀǫᴜɪ́, ᴇɴ 𝐂𝐀𝐎𝐒𝐌𝐂𝐂𝐑𝐀𝐅𝐓 💙

@everyone @here

╰━━━  𝐂𝐀𝐎𝐒𝐌𝐂𝐂𝐑𝐀𝐅𝐓 ━━━╯`;

        // Borramos el comando $plantilla que escribiste
        message.delete().catch(() => {});
        
        // Enviamos la plantilla
        message.channel.send(textoPlantilla);
    }
};
