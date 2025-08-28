
const eightBallResponses = [
    "Yes, definitely!",
    "No way!",
    "Ask again later.",
    "It is certain.",
    "Very doubtful.",
    "Without a doubt.",
    "My reply is no.",
    "Signs point to yes."
];

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

async function eightBallCommand(sock, chatId, question) {
    if (!question) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 🎱 ᴇɪɢʜᴛ-ʙᴀʟʟ ʀᴇǫᴜɪʀᴇs ᴀ ǫᴜᴇsᴛɪᴏɴ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴀsᴋ ᴀ ǫᴜᴇsᴛɪᴏɴ ꜰᴏʀ ᴛʜᴇ ᴍᴀɢɪᴄ ʙᴀʟʟ ᴛᴏ ᴀɴsᴡᴇʀ.
│
╰──〔 🔮 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    const randomResponse = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)];

    await sock.sendMessage(chatId, {
        text:
`╭──〔 🎱 ᴇɪɢʜᴛ-ʙᴀʟʟ ʀᴇsᴘᴏɴᴅs 〕──
│
├─ ᴏᴜᴛᴄᴏᴍᴇ: *${randomResponse}*
│
╰──〔 🔮 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}

module.exports = { eightBallCommand};
