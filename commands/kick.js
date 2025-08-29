
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

async function kickCommand(sock, chatId, senderId, mentionedJids, message) {
    const isOwner = message.key.fromMe;

    if (!isOwner) {
        const { isSenderAdmin, isBotAdmin} = await isAdmin(sock, chatId, senderId);

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🔐 ʙᴏᴛ ɴᴏᴛ ᴀᴅᴍɪɴ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴍᴀᴋᴇ ᴍᴇ ᴀɴ ᴀᴅᴍɪɴ ꜰɪʀsᴛ.
│
╰──〔 🛡️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
            return;
}

        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🚫 ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ 〕──
│
├─ ᴏɴʟʏ *ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs* ᴄᴀɴ ᴜsᴇ *.kick*
│
╰──〔 🛡️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
            return;
}
}

    let usersToKick = [];

    if (mentionedJids && mentionedJids.length> 0) {
        usersToKick = mentionedJids;
} else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        usersToKick = [message.message.extendedTextMessage.contextInfo.participant];
}

    if (usersToKick.length === 0) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ɴᴏ ᴛᴀʀɢᴇᴛ ꜰᴏᴜɴᴅ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ᴍᴇɴᴛɪᴏɴ* ᴏʀ *ʀᴇᴘʟʏ* ᴛᴏ ᴀ ᴜsᴇʀ ᴛᴏ ᴋɪᴄᴋ.
│
╰──〔 🛡️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
        return;
}

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    if (usersToKick.includes(botId)) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 🤖 sᴇʟғ-ᴘʀᴏᴛᴇᴄᴛɪᴏɴ 〕──
│
├─ ɪ ᴄᴀɴ'ᴛ ᴋɪᴄᴋ ᴍʏsᴇʟꜰ. ɴɪᴄᴇ ᴛʀʏ 😅
│
╰──〔 🛡️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
        return;
}

    try {
        await sock.groupParticipantsUpdate(chatId, usersToKick, "remove");

        const usernames = await Promise.all(usersToKick.map(jid => `@${jid.split('@')[0]}`));

        await sock.sendMessage(chatId, {
            text:
`╭──〔 🚪 ᴋɪᴄᴋ ᴇxᴇᴄᴜᴛᴇᴅ 〕──
│
├─ 👢 ᴜsᴇʀ(s) ʀᴇᴍᴏᴠᴇᴅ:
│   ${usernames.join('\n│   ')}
│
╰──〔 🛡️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            mentions: usersToKick,
...channelInfo
});

} catch (error) {
        console.error('❌ Error in kick command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴋɪᴄᴋ ᴜsᴇʀ(s). ᴄʜᴇᴄᴋ ʙᴏᴛ ᴘᴇʀᴍɪssɪᴏɴs.
│
╰──〔 🛡️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = kickCommand;
