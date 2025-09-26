
const axios = require('axios');

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

async function wastedCommand(sock, chatId, message) {
    let userToWaste;

    // 🎯 ᴛᴀʀɢᴇᴛ ᴅᴇᴛᴇᴄᴛɪᴏɴ
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length> 0) {
        userToWaste = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
} else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToWaste = message.message.extendedTextMessage.contextInfo.participant;
}

    // ❌ ɴᴏ ᴛᴀʀɢᴇᴛ ꜰᴏᴜɴᴅ
    if (!userToWaste) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴍɪssɪɴɢ ᴛᴀʀɢᴇᴛ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ᴍᴇɴᴛɪᴏɴ* sᴏᴍᴇᴏɴᴇ ᴏʀ *ʀᴇᴘʟʏ* ᴛᴏ ᴛʜᴇɪʀ ᴍᴇssᴀɢᴇ.
├─ ɪ ɴᴇᴇᴅ ᴀ sᴏᴜʟ ᴛᴏ ᴡᴀsᴛᴇ! 💀
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    try {
        // 🖼️ ɢᴇᴛ ᴘʀᴏꜰɪʟᴇ ᴘɪᴄᴛᴜʀᴇ
        let profilePic;
        try {
            profilePic = await sock.profilePictureUrl(userToWaste, 'image');
} catch {
            profilePic = 'https://i.imgur.com/2wzGhpF.jpeg';
}

        // 🧨 ᴀᴘᴘʟʏ ᴡᴀsᴛᴇᴅ ᴇꜰꜰᴇᴄᴛ
        const wastedResponse = await axios.get(
            `https://some-random-api.com/canvas/overlay/wasted?avatar=${encodeURIComponent(profilePic)}`,
            { responseType: 'arraybuffer'}
);

        // 📤 sᴇɴᴅ ꜰɪɴᴀʟ ɪᴍᴀɢᴇ
        await sock.sendMessage(chatId, {
            image: Buffer.from(wastedResponse.data),
            caption:
`╭──〔 ⚰️ ᴡᴀsᴛᴇᴅ ᴍᴏᴍᴇɴᴛ 〕──
│
├─ 👤 ᴛᴀʀɢᴇᴛ: @${userToWaste.split('@')[0]}
├─ 📍 sᴛᴀᴛᴜs: *WASTED* 💀
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            mentions: [userToWaste],
...channelInfo
});

} catch (error) {
        console.error('❌ Error in wasted command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ғᴀɪʟᴜʀᴇ 〕──
│
├─ ᴄᴏᴜʟᴅɴ'ᴛ ɢᴇɴᴇʀᴀᴛᴇ ᴡᴀsᴛᴇᴅ ɪᴍᴀɢᴇ.
├─ ʀᴇᴀsᴏɴ: ${error.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = wastedCommand;
