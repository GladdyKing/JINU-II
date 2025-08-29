
const isAdmin = require('../lib/isAdmin');

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

async function deleteCommand(sock, chatId, message, senderId) {
    const { isSenderAdmin, isBotAdmin} = await isAdmin(sock, chatId, senderId);

    // ❌ ʙᴏᴛ ɴᴏᴛ ᴀᴅᴍɪɴ
    if (!isBotAdmin) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 🔐 ᴀᴅᴍɪɴ ʀᴇǫᴜɪʀᴇᴅ 〕──
│
├─ ɪ ɴᴇᴇᴅ ᴀᴅᴍɪɴ ᴘʀɪᴠɪʟᴇɢᴇs ᴛᴏ ᴅᴇʟᴇᴛᴇ ᴍᴇssᴀɢᴇs.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    // ❌ sᴇɴᴅᴇʀ ɴᴏᴛ ᴀᴅᴍɪɴ
    if (!isSenderAdmin) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 🚫 ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ 〕──
│
├─ ᴏɴʟʏ *ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs* ᴄᴀɴ ᴜsᴇ *.delete*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.stanzaId;
    const quotedParticipant = message.message?.extendedTextMessage?.contextInfo?.participant;

    // 🗑️ ᴅᴇʟᴇᴛᴇ ᴛᴀʀɢᴇᴛᴇᴅ ᴍᴇssᴀɢᴇ
    if (quotedMessage) {
        await sock.sendMessage(chatId, {
            delete: {
                remoteJid: chatId,
                fromMe: false,
                id: quotedMessage,
                participant: quotedParticipant
}
});
} else {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ɴᴏ ᴍᴇssᴀɢᴇ ᴛᴀʀɢᴇᴛᴇᴅ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ʀᴇᴘʟʏ* ᴛᴏ ᴀ ᴍᴇssᴀɢᴇ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴅᴇʟᴇᴛᴇ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = deleteCommand;
