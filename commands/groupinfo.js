
async function groupInfoCommand(sock, chatId, msg) {
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

        let pp;
        try {
            pp = await sock.profilePictureUrl(chatId, 'image');
} catch {
            pp = 'https://i.imgur.com/2wzGhpF.jpeg';
}

        const participants = groupMetadata.participants;
        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins.map((v, i) => `│   ${i + 1}. @${v.id.split('@')[0]}`).join('\n');

        const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || chatId.split('-')[0] + '@s.whatsapp.net';

        const caption =
`╭──〔 🧾 ɢʀᴏᴜᴘ ɪɴꜰᴏ 〕──
│
├─ ♻️ *ɪᴅ*: ${groupMetadata.id}
├─ 🔖 *ɴᴀᴍᴇ*: ${groupMetadata.subject}
├─ 👥 *ᴍᴇᴍʙᴇʀs*: ${participants.length}
├─ 🤿 *ᴏᴡɴᴇʀ*: @${owner.split('@')[0]}
├─ 🕵🏻‍♂️ *ᴀᴅᴍɪɴs*:
${listAdmin}
│
├─ 📌 *ᴅᴇsᴄʀɪᴘᴛɪᴏɴ*:
│   ${groupMetadata.desc?.toString() || 'No description'}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        await sock.sendMessage(chatId, {
            image: { url: pp},
            caption,
            mentions: [...groupAdmins.map(v => v.id), owner],
...channelInfo
});

} catch (error) {
        console.error('❌ Error in groupinfo command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ʀᴇᴛʀɪᴇᴠᴇ ɢʀᴏᴜᴘ ɪɴꜰᴏ.
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🛠️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = groupInfoCommand;
