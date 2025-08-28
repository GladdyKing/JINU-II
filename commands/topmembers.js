
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'messageCount.json');

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

function loadMessageCounts() {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
}
    return {};
}

function saveMessageCounts(messageCounts) {
    fs.writeFileSync(dataFilePath, JSON.stringify(messageCounts, null, 2));
}

function incrementMessageCount(groupId, userId) {
    const messageCounts = loadMessageCounts();

    if (!messageCounts[groupId]) {
        messageCounts[groupId] = {};
}

    if (!messageCounts[groupId][userId]) {
        messageCounts[groupId][userId] = 0;
}

    messageCounts[groupId][userId] += 1;

    saveMessageCounts(messageCounts);
}

async function topMembers(sock, chatId, isGroup, message) {
    if (!isGroup) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ɴᴏᴛ ᴀ ɢʀᴏᴜᴘ 〕──
│
├─ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ᴡᴏʀᴋs ɪɴ ɢʀᴏᴜᴘs.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴍᴇᴛʀɪᴄs 〕──`,
...channelInfo,
            quoted: message
});
        return;
}

    const messageCounts = loadMessageCounts();
    const groupCounts = messageCounts[chatId] || {};

    const sortedMembers = Object.entries(groupCounts)
.sort(([, a], [, b]) => b - a)
.slice(0, 5);

    if (sortedMembers.length === 0) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 📉 ɴᴏ ᴅᴀᴛᴀ ʏᴇᴛ 〕──
│
├─ ɴᴏ ᴍᴇssᴀɢᴇ ᴀᴄᴛɪᴠɪᴛʏ ʀᴇᴄᴏʀᴅᴇᴅ ɪɴ ᴛʜɪs ɢʀᴏᴜᴘ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴍᴇᴛʀɪᴄs 〕──`,
...channelInfo,
            quoted: message
});
        return;
}

    let leaderboard =
`╭──〔 🏆 ᴛᴏᴘ ᴍᴇᴍʙᴇʀs 〕──
│`;

    sortedMembers.forEach(([userId, count], index) => {
        leaderboard += `\n│ ${index + 1}. @${userId.split('@')[0]} — ${count} messages`;
});

    leaderboard += `\n╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴍᴇᴛʀɪᴄs 〕──`;

    await sock.sendMessage(chatId, {
        text: leaderboard,
        mentions: sortedMembers.map(([userId]) => userId),
...channelInfo,
        quoted: message
});
}

module.exports = {
    incrementMessageCount,
    topMembers
};
