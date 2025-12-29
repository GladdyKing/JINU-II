
const { delay} = require('@whiskeysockets/baileys');

const channelInfo = {
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363422020175323@newsletter.whatsapp.net',
            newsletterName: 'ᴊɪɴᴜ-ɪɪ',
            serverMessageId: 5
}
}
};

async function addMemberCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ɴᴏ ɴᴜᴍʙᴇʀ ᴘʀᴏᴠɪᴅᴇᴅ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ɴᴜᴍʙᴇʀ.
├─ ᴇx: *.add 263771234567*
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
            return;
}

        const raw = args[0].replace(/[^0-9]/g, '');
        if (raw.length < 8 || raw.length> 15) throw new Error('Invalid number length');

        const jid = `${raw}@s.whatsapp.net`;

        await sock.groupParticipantsUpdate(chatId, [jid], 'add');
        await delay(1000);

        await sock.sendMessage(chatId, {
            text:
`╭──〔 ✅ ᴍᴇᴍʙᴇʀ ᴀᴅᴅᴇᴅ 〕──
│
├─ ᴜsᴇʀ: @${raw}
├─ ɢʀᴏᴜᴘ: *${chatId.split('@')[0]}*
│
╰──〔 🎉 ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴛʜᴇ ᴛᴇᴀᴍ! 〕──`,
            mentions: [jid],
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('❌ Error adding member:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ᴇʀʀᴏʀ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴀᴅᴅ ᴍᴇᴍʙᴇʀ.
├─ ᴄʜᴇᴄᴋ ɪꜰ:
│   ├─ ʙᴏᴛ ɪꜱ ᴀɴ ᴀᴅᴍɪɴ
│   ├─ ɴᴜᴍʙᴇʀ ɪꜱ ᴏɴ ᴡʜᴀᴛꜱᴀᴘᴘ
│   └─ ᴜsᴇʀ ᴀʟʟᴏᴡs ɢʀᴏᴜᴘ ɪɴᴠɪᴛᴇs
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = addMemberCommand;
