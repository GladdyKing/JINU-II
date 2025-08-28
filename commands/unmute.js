
const { channelInfo} = require('../lib/messageConfig');

async function unmuteCommand(sock, chatId, message) {
    try {
        await sock.groupSettingUpdate(chatId, 'not_announcement');

        await sock.sendMessage(chatId, {
            text:
`╭──〔 🔓 ɢʀᴏᴜᴘ ᴜɴᴍᴜᴛᴇᴅ 〕──
│
├─ ᴍᴇᴍʙᴇʀs ᴄᴀɴ ɴᴏᴡ sᴇɴᴅ ᴍᴇssᴀɢᴇs ɪɴ ᴛʜɪs ɢʀᴏᴜᴘ.
│
╰──〔 🛡️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            quoted: message,
...channelInfo
});

} catch (error) {
        console.error('Error in unmute command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ᴜɴᴍᴜᴛᴇ ꜰᴀɪʟᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴜɴᴍᴜᴛᴇ ᴛʜᴇ ɢʀᴏᴜᴘ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 🛡️ ᴊɪɴᴜ-ɪɪ ɢʀᴏᴜᴘ ᴄᴏɴᴛʀᴏʟ 〕──`,
            quoted: message,
...channelInfo
});
}
}

module.exports = unmuteCommand;
