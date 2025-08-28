
const settings = require('../settings');

const channelInfo = {
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363422020175323@newsletter.whatsapp.net',
            newsletterName: 'ᴊɪɴᴜ-ɪɪ',
            serverMessageId: -1
}
}
};

async function ownerCommand(sock, chatId, message) {
    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${settings.botOwner}
TEL;waid=${settings.ownerNumber}:${settings.ownerNumber}
END:VCARD
`;

    await sock.sendMessage(chatId, {
        contacts: {
            displayName: settings.botOwner,
            contacts: [{ vcard}]
},
...channelInfo
}, { quoted: message});

    await sock.sendMessage(chatId, {
        text:
`╭──〔 👑 ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴏɴᴛᴀᴄᴛ 〕──
│
├─ ɴᴀᴍᴇ: *${settings.botOwner}*
├─ ɴᴜᴍʙᴇʀ: *${settings.ownerNumber}*
│
╰──〔 📞 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}

module.exports = ownerCommand;
