
async function shipCommand(sock, chatId, msg) {
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

    try {
        const metadata = await sock.groupMetadata(chatId);
        const participants = metadata.participants.map(v => v.id);

        if (participants.length < 2) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ɴᴏᴛ ᴇɴᴏᴜɢʜ ᴍᴇᴍʙᴇʀs 〕──
│
├─ ʏᴏᴜ ɴᴇᴇᴅ ᴀᴛ ʟᴇᴀsᴛ 2 ᴘᴇᴏᴘʟᴇ ɪɴ ᴛʜᴇ ɢʀᴏᴜᴘ ᴛᴏ sʜɪᴘ.
│
╰──〔 💘 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: msg});
            return;
}

        let firstUser = participants[Math.floor(Math.random() * participants.length)];
        let secondUser;

        do {
            secondUser = participants[Math.floor(Math.random() * participants.length)];
} while (secondUser === firstUser);

        const formatMention = id => '@' + id.split('@')[0];

        await sock.sendMessage(chatId, {
            text:
`╭──〔 💞 ʀᴀɴᴅᴏᴍ sʜɪᴘ ɢᴇɴᴇʀᴀᴛᴇᴅ 〕──
│
├─ ${formatMention(firstUser)} ❤️ ${formatMention(secondUser)}
├─ ᴄᴏɴɢʀᴀᴛᴜʟᴀᴛɪᴏɴs ᴏɴ ʏᴏᴜʀ ɴᴇᴡ ʙᴏɴᴅ 💖🍻
│
╰──〔 💘 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            mentions: [firstUser, secondUser],
...channelInfo
}, { quoted: msg});

} catch (error) {
        console.error('❌ Error in ship command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ sʜɪᴘ. ᴍᴀᴋᴇ sᴜʀᴇ ᴛʜɪs ɪs ᴀ ɢʀᴏᴜᴘ.
│
╰──〔 💘 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: msg});
}
}

module.exports = shipCommand;
