
const isAdmin = require('../lib/isAdmin');  // Moved to helpers

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

async function tagAllCommand(sock, chatId, senderId) {
    try {
        const { isSenderAdmin, isBotAdmin} = await isAdmin(sock, chatId, senderId);

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ʙᴏᴛ ɴᴏᴛ ᴀᴅᴍɪɴ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴍᴀᴋᴇ ᴍᴇ ᴀɴ ᴀᴅᴍɪɴ ꜰɪʀsᴛ ᴛᴏ ᴛᴀɢ ᴀʟʟ ᴍᴇᴍʙᴇʀs.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ 〕──
│
├─ ᴏɴʟʏ *ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs* ᴄᴀɴ ᴜsᴇ *.tagall*
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;

        if (!participants || participants.length === 0) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ɴᴏ ᴍᴇᴍʙᴇʀs ꜰᴏᴜɴᴅ 〕──
│
├─ ᴛʜɪs ɢʀᴏᴜᴘ ʜᴀs ɴᴏ ᴘᴀʀᴛɪᴄɪᴘᴀɴᴛs ᴛᴏ ᴛᴀɢ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        let message =
`╭──〔 🔊 ᴛᴀɢɢɪɴɢ ᴀʟʟ ᴍᴇᴍʙᴇʀs 〕──
│
`;

        participants.forEach((participant, index) => {
            message += `│ ${index + 1}. @${participant.id.split('@')[0]}\n`;
});

        message += `╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        await sock.sendMessage(chatId, {
            text: message,
            mentions: participants.map(p => p.id),
...channelInfo
});

} catch (error) {
        console.error('❌ Error in tagall command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴛᴀɢ ᴀʟʟ ᴍᴇᴍʙᴇʀs. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
}
}

module.exports = tagAllCommand;
