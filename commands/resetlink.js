
async function resetlinkCommand(sock, chatId, senderId, message) {
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
        const groupMetadata = await sock.groupMetadata(chatId);

        const isAdmin = groupMetadata.participants
.filter(p => p.admin)
.map(p => p.id)
.includes(senderId);

        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = groupMetadata.participants
.filter(p => p.admin)
.map(p => p.id)
.includes(botId);

        if (!isAdmin) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🚫 ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ 〕──
│
├─ ᴏɴʟʏ *ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs* ᴄᴀɴ ᴜsᴇ *.resetlink*
│
╰──〔 🔗 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
            return;
}

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🔐 ʙᴏᴛ ɴᴏᴛ ᴀᴅᴍɪɴ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴍᴀᴋᴇ ᴍᴇ ᴀɴ ᴀᴅᴍɪɴ ꜰɪʀsᴛ ᴛᴏ ʀᴇsᴇᴛ ᴛʜᴇ ɢʀᴏᴜᴘ ʟɪɴᴋ.
│
╰──〔 🔗 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
            return;
}

        const newCode = await sock.groupRevokeInvite(chatId);

        await sock.sendMessage(chatId, {
            text:
`╭──〔 ✅ ɢʀᴏᴜᴘ ʟɪɴᴋ ʀᴇsᴇᴛ 〕──
│
├─ ɴᴇᴡ ɪɴᴠɪᴛᴇ ʟɪɴᴋ:
│   https://chat.whatsapp.com/${newCode}
│
╰──〔 🔗 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});

} catch (error) {
        console.error('❌ Error in resetlink command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ʀᴇsᴇᴛ ɢʀᴏᴜᴘ ʟɪɴᴋ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 🔗 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = resetlinkCommand;
