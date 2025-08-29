[
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

async function demoteCommand(sock, chatId, mentionedJids, message) {
    try {
        if (!chatId.endsWith('@g.us')) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🚫 ɢʀᴏᴜᴘ ᴏɴʟʏ 〕──
│
├─ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs!
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const adminStatus = await isAdmin(sock, chatId, message.key.participant || message.key.remoteJid);

        if (!adminStatus.isBotAdmin) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ʙᴏᴛ ɴᴏᴛ ᴀᴅᴍɪɴ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴍᴀᴋᴇ ᴛʜᴇ ʙᴏᴛ ᴀɴ ᴀᴅᴍɪɴ ꜰɪʀsᴛ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        if (!adminStatus.isSenderAdmin) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🚫 ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ 〕──
│
├─ ᴏɴʟʏ *ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs* ᴄᴀɴ ᴜsᴇ *.demote*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        let userToDemote = [];

        if (mentionedJids && mentionedJids.length> 0) {
            userToDemote = mentionedJids;
} else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToDemote = [message.message.extendedTextMessage.contextInfo.participant];
}

        if (userToDemote.length === 0) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ᴍɪssɪɴɢ ᴛᴀʀɢᴇᴛ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ᴍᴇɴᴛɪᴏɴ* ᴏʀ *ʀᴇᴘʟʏ* ᴛᴏ ᴀ ᴜsᴇʀ ᴛᴏ ᴅᴇᴍᴏᴛᴇ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        await new Promise(resolve => setTimeout(resolve, 1000));
        await sock.groupParticipantsUpdate(chatId, userToDemote, "demote");

        const usernames = await Promise.all(userToDemote.map(jid => `@${jid.split('@')[0]}`));
        const demotedBy = message.key.participant? `@${message.key.participant.split('@')[0]}`: `@${message.key.remoteJid.split('@')[0]}`;

        const demotionMessage =
`╭──〔 🧨 ᴅᴇᴍᴏᴛɪᴏɴ ᴇxᴇᴄᴜᴛᴇᴅ 〕──
│
├─ 👤 ᴅᴇᴍᴏᴛᴇᴅ ᴜsᴇʀ${userToDemote.length> 1? 's': ''}:
${usernames.map(name => `│   • ${name}`).join('\n')}
│
├─ 👑 ᴅᴇᴍᴏᴛᴇᴅ ʙʏ: ${demotedBy}
├─ 📅 ᴅᴀᴛᴇ: ${new Date().toLocaleString()}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        await sock.sendMessage(chatId, {
            text: demotionMessage,
            mentions: [...userToDemote, message.key.participant || message.key.remoteJid],
...channelInfo
});

} catch (error) {
        console.error('❌ Error in demote command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴅᴇᴍᴏᴛᴇ ᴜsᴇʀ(s).
├─ ʀᴇᴀsᴏɴ: ${error.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

// 🔔 ᴀᴜᴛᴏᴍᴀᴛɪᴄ ᴅᴇᴍᴏᴛɪᴏɴ ᴇᴠᴇɴᴛ
async function handleDemotionEvent(sock, groupId, participants, author) {
    try {
        if (!groupId ||!participants) return;

        await new Promise(resolve => setTimeout(resolve, 1000));

        const demotedUsernames = await Promise.all(participants.map(jid => `@${jid.split('@')[0]}`));
        let demotedBy = 'System';
        let mentionList = [...participants];
        if (author && author.length> 0) {
            demotedBy = `@${author.split('@')[0]}`;
            mentionList.push(author);
}

        const demotionMessage =
`╭──〔 🧨 ᴅᴇᴍᴏᴛɪᴏɴ ᴇᴠᴇɴᴛ 〕──
│
├─ 👤 ᴅᴇᴍᴏᴛᴇᴅ ᴜsᴇʀ${participants.length> 1? 's': ''}:
${demotedUsernames.map(name => `│   • ${name}`).join('\n')}
│
├─ 👑 ᴅᴇᴍᴏᴛᴇᴅ ʙʏ: ${demotedBy}
├─ 📅 ᴅᴀᴛᴇ: ${new Date().toLocaleString()}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        await sock.sendMessage(groupId, {
            text: demotionMessage,
            mentions: mentionList,
...channelInfo
});

} catch (error) {
        console.error('❌ Error handling demotion event:', error);
        if (error.data === 429) {
        await new Promise(resolve => setTimeout(resolve, 1000));
}
}

module.exports = {
    demoteCommand,
    handleDemotionEvent
};
