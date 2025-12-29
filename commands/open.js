
const channelInfo = {
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363422020175323@newsletter.whatsapp.net',
            newsletterName: 'ᴊɪɴᴜ-ɪɪ',
            serverMessageId: -2
}
}
};

async function openGroupCommand(sock, chatId, message) {
    try {
        const isGroup = chatId.endsWith('@g.us');
        if (!isGroup) {
            await sock.sendMessage(chatId, {
                text: '🚫 This command only works in groups.',
...channelInfo
});
            return;
}

        const metadata = await sock.groupMetadata(chatId);
        const senderId = message.key.participant || message.key.remoteJid;
        const isAdmin = metadata.participants.find(p => p.id === senderId)?.admin;

        if (!isAdmin) {
            await sock.sendMessage(chatId, {
                text: '❌ Only group admins can use this command.',
...channelInfo
});
            return;
}

        await sock.groupSettingUpdate(chatId, 'not_announcement');

        await sock.sendMessage(chatId, {
            text: '🔓 Group has been *opened*. All members can send messages now.',
...channelInfo
});
} catch (err) {
        console.error('Open command error:', err);
        await sock.sendMessage(chatId, {
            text: '⚠️ Failed to open the group. Make sure I am admin.',
...channelInfo
});
}
}

module.exports = openGroupCommand;
