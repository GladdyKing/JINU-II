
const fs = require('fs');
const path = require('path');

const warningsFilePath = path.join(__dirname, '../data/warnings.json');

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

// 📂 ʟᴏᴀᴅ ᴡᴀʀɴɪɴɢs ꜰʀᴏᴍ ꜰɪʟᴇ
function loadWarnings() {
    if (!fs.existsSync(warningsFilePath)) {
        fs.writeFileSync(warningsFilePath, JSON.stringify({}), 'utf8');
}
    const data = fs.readFileSync(warningsFilePath, 'utf8');
    return JSON.parse(data);
}

// 📡 ᴡᴀʀɴɪɴɢs ᴄᴏᴍᴍᴀɴᴅ ʜᴀɴᴅʟᴇʀ
async function warningsCommand(sock, chatId, mentionedJidList) {
    const warnings = loadWarnings();

    // ❌ ɴᴏ ᴜsᴇʀ ᴍᴇɴᴛɪᴏɴᴇᴅ
    if (mentionedJidList.length === 0) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴍɪssɪɴɢ ᴛᴀʀɢᴇᴛ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ᴍᴇɴᴛɪᴏɴ* ᴀ ᴜsᴇʀ ᴛᴏ ᴄʜᴇᴄᴋ ᴛʜᴇɪʀ ᴡᴀʀɴɪɴɢs.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    const userToCheck = mentionedJidList[0];
    const warningCount = warnings[userToCheck] || 0;

    // 📊 sᴇɴᴅ ᴡᴀʀɴɪɴɢ ʀᴇᴘᴏʀᴛ
    await sock.sendMessage(chatId, {
        text:
`╭──〔 🚨 ᴡᴀʀɴɪɴɢ sᴛᴀᴛᴜs 〕──
│
├─ 👤 ᴜsᴇʀ: @${userToCheck.split('@')[0]}
├─ ⚠️ ᴡᴀʀɴɪɴɢs: *${warningCount}*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
        mentions: [userToCheck],
...channelInfo
});
}

module.exports = warningsCommand;
