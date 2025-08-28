const fs = require('fs');
const { channelInfo} = require('../lib/messageConfig');

async function banCommand(sock, chatId, message) {
    let userToBan;

    // 🕵️ ᴅᴇᴛᴇᴄᴛ ᴛᴀʀɢᴇᴛ: ᴍᴇɴᴛɪᴏɴ ᴏʀ ʀᴇᴘʟʏ
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length> 0) {
        userToBan = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
} else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToBan = message.message.extendedTextMessage.contextInfo.participant;
}

    // 🚫 ɴᴏ ᴛᴀʀɢᴇᴛ ꜰᴏᴜɴᴅ
    if (!userToBan) {
        const menu =
`╭──〔 🚫 ʙᴀɴ ᴄᴏᴍᴍᴀɴᴅ ꜱʏɴᴛᴀx 🚫 〕──
│
├─ 📌 ᴜsᴇ: ᴍᴇɴᴛɪᴏɴ ᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴛʜᴇ ᴜsᴇʀ
├─ ❗ ᴇʀʀᴏʀ: ɴᴏ ᴜsᴇʀ ᴅᴇᴛᴇᴄᴛᴇᴅ
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;
        await sock.sendMessage(chatId, { text: menu,...channelInfo});
        return;
}

    try {
        const bannedUsers = JSON.parse(fs.readFileSync('./data/banned.json'));

        if (!bannedUsers.includes(userToBan)) {
            bannedUsers.push(userToBan);
            fs.writeFileSync('./data/banned.json', JSON.stringify(bannedUsers, null, 2));

            const menu =
`╭──〔 🔨 ʙᴀɴɴɪɴɢ ɪɴ ᴘʀᴏɢʀᴇss 🔨 〕──
│
├─ 👤 ᴛᴀʀɢᴇᴛ: @${userToBan.split('@')[0]}
├─ ✅ sᴛᴀᴛᴜs: sᴜᴄᴄᴇssғᴜʟʟʏ ʙᴀɴɴᴇᴅ
├─ ⚠️ ᴡᴀʀɴɪɴɢ: ᴛʜᴇʏ ᴡᴏɴ'ᴛ ʙᴏᴛʜᴇʀ ᴜs ᴀɢᴀɪɴ
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;
            await sock.sendMessage(chatId, {
                text: menu,
                mentions: [userToBan],
...channelInfo
});
} else {
            const menu =
`╭──〔 🚷 ᴜsᴇʀ ᴀʟʀᴇᴀᴅʏ ʙᴀɴɴᴇᴅ 🚷 〕──
│
├─ 👤 ᴛᴀʀɢᴇᴛ: @${userToBan.split('@')[0]}
├─ 🔁 sᴛᴀᴛᴜs: ᴀʟʀᴇᴀᴅʏ ᴏɴ ᴛʜᴇ ʙʟᴀᴄᴋʟɪsᴛ
├─ 🧊 ɴᴏᴛᴇ: ᴄᴏʟᴅ ᴀs ɪᴄᴇ, ʙᴀɴɴᴇᴅ ᴛᴡɪᴄᴇ
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;
            await sock.sendMessage(chatId, {
                text: menu,
                mentions: [userToBan],
...channelInfo
});
}

} catch (error) {
        console.error('Error in ban command:', error);
        const menu =
`╭──〔 ❌ ᴇʀʀᴏʀ ❌ 〕──
│
├─ 🧨 sᴛᴀᴛᴜs: ʙᴀɴ ꜰᴀɪʟᴇᴅ
├─ 🛠️ ʀᴇᴀsᴏɴ: ɪɴᴛᴇʀɴᴀʟ ɢʟɪᴛᴄʜ ɪɴ ᴛʜᴇ ᴍᴀᴛʀɪx
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;
        await sock.sendMessage(chatId, { text: menu,...channelInfo});
}
}

module.exports = banCommand;
