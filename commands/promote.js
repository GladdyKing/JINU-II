
const { isAdmin} = require('../lib/isAdmin');

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

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good morning';
    if (hour < 18) return '🌞 Good afternoon';
    return '🌙 Good evening';
}

// 📡 ᴍᴀɴᴜᴀʟ ᴘʀᴏᴍᴏᴛɪᴏɴ ᴄᴏᴍᴍᴀɴᴅ
async function promoteCommand(sock, chatId, mentionedJids, message) {
    let userToPromote = [];

    if (mentionedJids && mentionedJids.length> 0) {
        userToPromote = mentionedJids;
} else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToPromote = [message.message.extendedTextMessage.contextInfo.participant];
}

    if (userToPromote.length === 0) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴍɪssɪɴɢ ᴛᴀʀɢᴇᴛ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ᴍᴇɴᴛɪᴏɴ* ᴏʀ *ʀᴇᴘʟʏ* ᴛᴏ ᴀ ᴜsᴇʀ ᴛᴏ ᴘʀᴏᴍᴏᴛᴇ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    try {
        await sock.groupParticipantsUpdate(chatId, userToPromote, 'promote');

        const metadata = await sock.groupMetadata(chatId);
        const groupName = metadata.subject;
        const memberCount = metadata.participants.length;
        const greeting = getGreeting();

        const usernames = await Promise.all(
            userToPromote.map(jid => `👤 @${jid.split('@')[0]}`)
);

        const promoterJid = sock.user.id;

        const promotionMessage =
`╭──〔 👑 ɢʀᴏᴜᴘ ᴘʀᴏᴍᴏᴛɪᴏɴ 〕──
│
├─ ${greeting}, ᴛᴇᴀᴍ!
├─ 🏷️ ɢʀᴏᴜᴘ: ${groupName}
├─ 👥 ᴍᴇᴍʙᴇʀs: ${memberCount}
│
├─ 🎉 ᴘʀᴏᴍᴏᴛᴇᴅ ᴜsᴇʀ${userToPromote.length> 1? 's': ''}:
${usernames.map(name => `│   • ${name}`).join('\n')}
│
├─ 🧑‍💼 ᴘʀᴏᴍᴏᴛᴇᴅ ʙʏ: @${promoterJid.split('@')[0]}
├─ 📅 ᴅᴀᴛᴇ: ${new Date().toLocaleString()}
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        await sock.sendMessage(chatId, {
            text: promotionMessage,
            mentions: [...userToPromote, promoterJid],
...channelInfo
});

} catch (error) {
        console.error('❌ Error in promote command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴘʀᴏᴍᴏᴛᴇ ᴜsᴇʀ(s).
├─ ʀᴇᴀsᴏɴ: ${error.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

// 🔔 ᴀᴜᴛᴏ ᴘʀᴏᴍᴏᴛɪᴏɴ ᴇᴠᴇɴᴛ ʜᴀɴᴅʟᴇʀ
async function handlePromotionEvent(sock, groupId, participants, author) {
    try {
        const metadata = await sock.groupMetadata(groupId);
        const groupName = metadata.subject;
        const memberCount = metadata.participants.length;
        const greeting = getGreeting();

        const promotedUsernames = await Promise.all(
            participants.map(jid => `👤 @${jid.split('@')[0]}`)
);

        let promotedBy = 'System';
        let mentionList = [...participants];

        if (author && author.length> 0) {
            const authorJid = author;
            promotedBy = `🧑‍💼 @${authorJid.split('@')[0]}`;
            mentionList.push(authorJid);
}

        const promotionMessage =
`╭──〔 👑 ɢʀᴏᴜᴘ ᴘʀᴏᴍᴏᴛɪᴏɴ 〕──
│
├─ ${greeting}, ᴛᴇᴀᴍ!
├─ 🏷️ ɢʀᴏᴜᴘ: ${groupName}
├─ 👥 ᴍᴇᴍʙᴇʀs: ${memberCount}
│
├─ 🎉 ᴘʀᴏᴍᴏᴛᴇᴅ ᴜsᴇʀ${participants.length> 1? 's': ''}:
${promotedUsernames.map(name => `│   • ${name}`).join('\n')}
│
├─ 🧑‍💼 ᴘʀᴏᴍᴏᴛᴇᴅ ʙʏ: ${promotedBy}
├─ 📅 ᴅᴀᴛᴇ: ${new Date().toLocaleString()}
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        await sock.sendMessage(groupId, {
            text: promotionMessage,
            mentions: mentionList,
...channelInfo
});

} catch (error) {
        console.error('❌ Error handling promotion event:', error);
}
}

module.exports = {
    promoteCommand,
    handlePromotionEvent
};
