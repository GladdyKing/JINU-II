
const compliments = [
    "You're amazing just the way you are!",
    "You have a great sense of humor!",
    "You're incredibly thoughtful and kind.",
    "You are more powerful than you know.",
    "You light up the room!",
    "You're a true friend.",
    "You inspire me!",
    "Your creativity knows no bounds!",
    "You have a heart of gold.",
    "You make a difference in the world.",
    "Your positivity is contagious!",
    "You have an incredible work ethic.",
    "You bring out the best in people.",
    "Your smile brightens everyone's day.",
    "You're so talented in everything you do.",
    "Your kindness makes the world a better place.",
    "You have a unique and wonderful perspective.",
    "Your enthusiasm is truly inspiring!",
    "You are capable of achieving great things.",
    "You always know how to make someone feel special.",
    "Your confidence is admirable.",
    "You have a beautiful soul.",
    "Your generosity knows no limits.",
    "You have a great eye for detail.",
    "Your passion is truly motivating!",
    "You are an amazing listener.",
    "You're stronger than you think!",
    "Your laughter is infectious.",
    "You have a natural gift for making others feel valued.",
    "You make the world a better place just by being in it."
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

async function complimentCommand(sock, chatId, message) {
    try {
        if (!message ||!chatId) {
            console.log('Invalid message or chatId:', { message, chatId});
            return;
}

        let userToCompliment;

        // 🎯 ᴛᴀʀɢᴇᴛ ᴅᴇᴛᴇᴄᴛɪᴏɴ
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length> 0) {
            userToCompliment = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
} else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToCompliment = message.message.extendedTextMessage.contextInfo.participant;
}

        // ❌ ɴᴏ ᴛᴀʀɢᴇᴛ ꜰᴏᴜɴᴅ
        if (!userToCompliment) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 💬 ᴄᴏᴍᴘʟɪᴍᴇɴᴛ ᴍᴏᴅᴇ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ᴍᴇɴᴛɪᴏɴ* ᴏʀ *ʀᴇᴘʟʏ* ᴛᴏ ᴀ ᴜsᴇʀ ᴛᴏ sᴇɴᴅ ᴀ ᴄᴏᴍᴘʟɪᴍᴇɴᴛ.
│
╰──〔 ✨ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const compliment = compliments[Math.floor(Math.random() * compliments.length)];

        await new Promise(resolve => setTimeout(resolve, 1000));

        await sock.sendMessage(chatId, {
            text:
`╭──〔 🌟 ᴄᴏᴍᴘʟɪᴍᴇɴᴛ ᴅᴇʟɪᴠᴇʀᴇᴅ 🌟 〕──
│
├─ Hey @${userToCompliment.split('@')[0]},
│   ${compliment}
│
╰──〔 ✨ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            mentions: [userToCompliment],
...channelInfo
});

} catch (error) {
        console.error('❌ Error in compliment command:', error);
        const fallback =
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴡʜɪʟᴇ sᴇɴᴅɪɴɢ ᴛʜᴇ ᴄᴏᴍᴘʟɪᴍᴇɴᴛ.
├─ ʀᴇᴀsᴏɴ: ${error.message}
│
╰──〔 ✨ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        await sock.sendMessage(chatId, {
            text: fallback,
...channelInfo
});
}
}

module.exports = { complimentCommand};
