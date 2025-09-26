const { handleWelcome} = require('../lib/welcome');

async function welcomeCommand(sock, chatId, message, match) {
    try {
        // 🛡️ Ensure command is used in a group
        if (!chatId.endsWith('@g.us')) {
            await sock.sendMessage(chatId, {
                text: `╭──〔 🚫 ɴᴏᴛ ᴀ ɢʀᴏᴜᴘ 〕──\n│\n├─ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ *ɢʀᴏᴜᴘ ᴄʜᴀᴛs*.\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
            return;
}

        // 🧠 Extract command argument
        const text = message.message?.conversation ||
                     message.message?.extendedTextMessage?.text || '';
        const matchText = text.split(' ').slice(1).join(' ').trim();

        // 🔔 Trigger welcome handler
        await handleWelcome(sock, chatId, message, matchText);

} catch (error) {
        console.error('❌ Error in welcomeCommand:', error);
        await sock.sendMessage(chatId, {
            text: `╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──\n│\n├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴘʀᴏᴄᴇss ᴡᴇʟᴄᴏᴍᴇ ᴄᴏᴍᴍᴀɴᴅ.\n├─ ʀᴇᴀsᴏɴ: ${error.message}\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
}
}

module.exports = welcomeCommand;
