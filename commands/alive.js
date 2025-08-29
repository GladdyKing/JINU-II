const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {
  try {
    const message1 = `╭──〔 🤖 ᴊɪɴᴜ-ɪɪ ɪs ᴀᴄᴛɪᴠᴇ! 〕──\n` +
                     `│ ├─ ✨ ᴠᴇʀsɪᴏɴ: ${settings.version}\n` +
                     `│ ├─ 📊 sᴛᴀᴛᴜs: ᴏɴʟɪɴᴇ\n` +
                     `│ ├─ 🌐 ᴍᴏᴅᴇ: ᴘᴜʙʟɪᴄ\n` +
                     `│ ├─ 📜 ғᴇᴀᴛᴜʀᴇs:\n` +
                     `│ ├─ • ɢʀᴏᴜᴘ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\n` +
                     `│ ├─ • ᴀɴᴛɪʟɪɴᴋ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ\n` +
                     `│ ├─ • ꜰᴜɴ ᴄᴏᴍᴍᴀɴᴅs\n` +
                     `│ ├─ • ᴀɴᴅ ᴍᴏʀᴇ!\n` +
                     `│ ├─ 📌 ᴛʏᴘᴇ *.ᴍᴇɴᴜ* ғᴏʀ ꜰᴜʟʟ ᴄᴏᴍᴍᴀɴᴅ ʟɪsᴛ\n` +
                     `╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

    await sock.sendMessage(chatId, {
      text: message1,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363422020175323@newsletter',
          newsletterName: 'ᴊɪɴᴜ-ɪɪ',
          serverMessageId: -1
}
}
}, { quoted: message});

} catch (error) {
    console.error('❌ Error in alive command:', error);
    await sock.sendMessage(chatId, {
      text: `╭──〔 ⚠️ ᴇʀʀᴏʀ 〕──\n│\n├─ ʙᴏᴛ ɪs ᴀʟɪᴠᴇ ʙᴜᴛ ᴇɴᴄᴏᴜɴᴛᴇʀᴇᴅ ᴀ ɢʟɪᴛᴄʜ.\n├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ.\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
}, { quoted: message});
}
}

module.exports = aliveCommand;
