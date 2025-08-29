
const { handleGoodbye} = require('../lib/welcome');

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

async function goodbyeCommand(sock, chatId, message, match) {
    // 🏷️ ᴄʜᴇᴄᴋ ɪꜰ ɪᴛ's ᴀ ɢʀᴏᴜᴘ
    if (!chatId.endsWith('@g.us')) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 🚫 ɢʀᴏᴜᴘ ᴏɴʟʏ 〕──
│
├─ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs.
│
╰──〔 🛡️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    // 📝 ᴇxᴛʀᴀᴄᴛ ᴛʀɪɢɢᴇʀ ᴛᴇxᴛ
    const text = message.message?.conversation ||
                 message.message?.extendedTextMessage?.text || '';
    const matchText = text.split(' ').slice(1).join(' ');

    // 🎬 ᴛʀɪɢɢᴇʀ ɢᴏᴏᴅʙʏᴇ ʜᴀɴᴅʟᴇʀ
    await handleGoodbye(sock, chatId, message, matchText);
}

module.exports = goodbyeCommand;
