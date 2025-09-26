async function clearCommand(sock, chatId) {
    try {
        // 🧹 sᴇɴᴅ ᴄʟᴇᴀʀɪɴɢ ɴᴏᴛɪᴄᴇ
        const message = await sock.sendMessage(chatId, {
            text:
`╭──〔 🧹 ᴄʟᴇᴀʀɪɴɢ ᴍᴇssᴀɢᴇs 〕──
│
├─ ʀᴇᴍᴏᴠɪɴɢ ʙᴏᴛ ᴍᴇssᴀɢᴇs ꜰʀᴏᴍ ᴄʜᴀᴛ...
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});

        // 🗑️ ᴅᴇʟᴇᴛᴇ ᴛʜᴇ ᴍᴇssᴀɢᴇ
        const messageKey = message.key;
        await sock.sendMessage(chatId, { delete: messageKey});

} catch (error) {
        console.error('❌ Error clearing messages:', error);

        // ⚠️ ᴇʀʀᴏʀ ʀᴇsᴘᴏɴsᴇ
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴄʟᴇᴀʀ ᴍᴇssᴀɢᴇs.
├─ ʀᴇᴀsᴏɴ: ${error.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
}
}

module.exports = { clearCommand};
