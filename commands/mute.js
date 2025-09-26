
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

async function muteCommand(sock, chatId, senderId, durationInMinutes, message) {
    console.log(`Attempting to mute the group for ${durationInMinutes} minutes.`);

    const { isSenderAdmin, isBotAdmin} = await isAdmin(sock, chatId, senderId);

    if (!isBotAdmin) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 🔐 ʙᴏᴛ ɴᴏᴛ ᴀᴅᴍɪɴ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴍᴀᴋᴇ ᴍᴇ ᴀɴ ᴀᴅᴍɪɴ ꜰɪʀsᴛ ᴛᴏ ᴍᴜᴛᴇ ᴛʜᴇ ɢʀᴏᴜᴘ.
│
╰──〔 🔇 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
        return;
}

    if (!isSenderAdmin) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 🚫 ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ 〕──
│
├─ ᴏɴʟʏ *ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs* ᴄᴀɴ ᴜsᴇ *.mute*
│
╰──〔 🔇 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
        return;
}

    const durationInMilliseconds = durationInMinutes * 60 * 1000;

    try {
        await sock.groupSettingUpdate(chatId, 'announcement');

        await sock.sendMessage(chatId, {
            text:
`╭──〔 🔇 ɢʀᴏᴜᴘ ᴍᴜᴛᴇᴅ 〕──
│
├─ ᴛʜᴇ ɢʀᴏᴜᴘ ʜᴀs ʙᴇᴇɴ ᴍᴜᴛᴇᴅ ꜰᴏʀ *${durationInMinutes} ᴍɪɴᴜᴛᴇs*.
│
╰──〔 🛡️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});

        setTimeout(async () => {
            try {
                await sock.groupSettingUpdate(chatId, 'not_announcement');
                await sock.sendMessage(chatId, {
                    text:
`╭──〔 🔊 ɢʀᴏᴜᴘ ᴜɴᴍᴜᴛᴇᴅ 〕──
│
├─ ᴛʜᴇ ɢʀᴏᴜᴘ ɪs ɴᴏᴡ ᴜɴᴍᴜᴛᴇᴅ. ꜰʀᴇᴇ ᴛᴏ ᴄʜᴀᴛ!
│
╰──〔 🛡️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
} catch (unmuteError) {
                console.error('Error unmuting group:', unmuteError);
}
}, durationInMilliseconds);

} catch (error) {
        console.error('Error muting/unmuting the group:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴍᴜᴛᴇ/ᴜɴᴍᴜᴛᴇ ᴛʜᴇ ɢʀᴏᴜᴘ.
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🔇 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = muteCommand;
