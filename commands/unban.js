
const fs = require('fs');
const path = require('path');
const { channelInfo} = require('../lib/messageConfig');

async function unbanCommand(sock, chatId, message) {
    let userToUnban;

    // Check for mentioned user
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length> 0) {
        userToUnban = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
}
    // Check for replied message
    else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToUnban = message.message.extendedTextMessage.contextInfo.participant;
}

    if (!userToUnban) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ᴍɪssɪɴɢ ᴛᴀʀɢᴇᴛ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ᴍᴇɴᴛɪᴏɴ* ᴀ ᴜsᴇʀ ᴏʀ *ʀᴇᴘʟʏ* ᴛᴏ ᴛʜᴇɪʀ ᴍᴇssᴀɢᴇ.
│
╰──〔 🔓 ᴊɪɴᴜ-ɪɪ ᴜɴʙᴀɴ ᴄᴏɴᴛʀᴏʟ 〕──`,
            quoted: message,
...channelInfo
});
        return;
}

    try {
        const bannedPath = path.join(__dirname, '..', 'data', 'banned.json');
        const bannedUsers = JSON.parse(fs.readFileSync(bannedPath));
        const index = bannedUsers.indexOf(userToUnban);

        if (index> -1) {
            bannedUsers.splice(index, 1);
            fs.writeFileSync(bannedPath, JSON.stringify(bannedUsers, null, 2));

            await sock.sendMessage(chatId, {
                text:
`╭──〔 ✅ ᴜɴʙᴀɴɴᴇᴅ 〕──
│
├─ @${userToUnban.split('@')[0]} ʜᴀs ʙᴇᴇɴ ᴜɴʙᴀɴɴᴇᴅ.
│
╰──〔 🔓 ᴊɪɴᴜ-ɪɪ ᴜɴʙᴀɴ ᴄᴏɴᴛʀᴏʟ 〕──`,
                mentions: [userToUnban],
                quoted: message,
...channelInfo
});
} else {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ɴᴏᴛ ʙᴀɴɴᴇᴅ 〕──
│
├─ @${userToUnban.split('@')[0]} ɪs ɴᴏᴛ ᴏɴ ᴛʜᴇ ʙᴀɴ ʟɪsᴛ.
│
╰──〔 🔓 ᴊɪɴᴜ-ɪɪ ᴜɴʙᴀɴ ᴄᴏɴᴛʀᴏʟ 〕──`,
                mentions: [userToUnban],
                quoted: message,
...channelInfo
});
}

} catch (error) {
        console.error('Error in unban command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ᴇʀʀᴏʀ ᴜɴʙᴀɴɴɪɴɢ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴜɴʙᴀɴ ᴛʜᴇ ᴜsᴇʀ. ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 🔓 ᴊɪɴᴜ-ɪɪ ᴜɴʙᴀɴ ᴄᴏɴᴛʀᴏʟ 〕──`,
            quoted: message,
...channelInfo
});
}
}

module.exports = unbanCommand;
