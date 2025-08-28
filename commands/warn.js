
const fs = require('fs');
const path = require('path');
const isAdmin = require('../lib/isAdmin');

const databaseDir = path.join(process.cwd(), 'data');
const warningsPath = path.join(databaseDir, 'warnings.json');

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

function initializeWarningsFile() {
    if (!fs.existsSync(databaseDir)) fs.mkdirSync(databaseDir, { recursive: true});
    if (!fs.existsSync(warningsPath)) fs.writeFileSync(warningsPath, JSON.stringify({}), 'utf8');
}

async function warnCommand(sock, chatId, senderId, mentionedJids, message) {
    try {
        initializeWarningsFile();

        if (!chatId.endsWith('@g.us')) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɴᴏᴛ ᴀ ɢʀᴏᴜᴘ 〕──
│
├─ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs.
│
╰──〔 ⚠️ ᴊɪɴᴜ-ɪɪ ᴡᴀʀɴ ᴄᴏɴᴛʀᴏʟ 〕──`,
                quoted: message,
...channelInfo
});
            return;
}

        const { isSenderAdmin, isBotAdmin} = await isAdmin(sock, chatId, senderId);

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ʙᴏᴛ ɴᴏᴛ ᴀᴅᴍɪɴ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴍᴀᴋᴇ ᴍᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴜsᴇ *.warn*
│
╰──〔 ⚠️ ᴊɪɴᴜ-ɪɪ ᴡᴀʀɴ ᴄᴏɴᴛʀᴏʟ 〕──`,
                quoted: message,
...channelInfo
});
            return;
}

        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ 〕──
│
├─ ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴄᴀɴ ᴡᴀʀɴ ᴍᴇᴍʙᴇʀs.
│
╰──〔 ⚠️ ᴊɪɴᴜ-ɪɪ ᴡᴀʀɴ ᴄᴏɴᴛʀᴏʟ 〕──`,
                quoted: message,
...channelInfo
});
            return;
}

        let userToWarn = mentionedJids?.[0] || message.message?.extendedTextMessage?.contextInfo?.participant;

        if (!userToWarn) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ᴍɪssɪɴɢ ᴛᴀʀɢᴇᴛ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ᴍᴇɴᴛɪᴏɴ* ᴀ ᴜsᴇʀ ᴏʀ *ʀᴇᴘʟʏ* ᴛᴏ ᴛʜᴇɪʀ ᴍᴇssᴀɢᴇ.
│
╰──〔 ⚠️ ᴊɪɴᴜ-ɪɪ ᴡᴀʀɴ ᴄᴏɴᴛʀᴏʟ 〕──`,
                quoted: message,
...channelInfo
});
            return;
}

        await new Promise(res => setTimeout(res, 1000));

        let warnings = {};
        try {
            warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
} catch {
            warnings = {};
}

        if (!warnings[chatId]) warnings[chatId] = {};
        if (!warnings[chatId][userToWarn]) warnings[chatId][userToWarn] = 0;

        warnings[chatId][userToWarn]++;
        fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));

        const count = warnings[chatId][userToWarn];
        const warningMessage =
`╭──〔 ⚠️ ᴡᴀʀɴɪɴɢ ᴀʟᴇʀᴛ 〕──
│
├─ 👤 *User:* @${userToWarn.split('@')[0]}
├─ ⚠️ *Warnings:* ${count}/3
├─ 👑 *By:* @${senderId.split('@')[0]}
├─ 📅 *Date:* ${new Date().toLocaleString()}
│
╰──〔 ⚠️ ᴊɪɴᴜ-ɪɪ ᴡᴀʀɴ ᴄᴏɴᴛʀᴏʟ 〕──`;

        await sock.sendMessage(chatId, {
            text: warningMessage,
            mentions: [userToWarn, senderId],
            quoted: message,
...channelInfo
});

        if (count>= 3) {
            await new Promise(res => setTimeout(res, 1000));
            await sock.groupParticipantsUpdate(chatId, [userToWarn], "remove");
            delete warnings[chatId][userToWarn];
            fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));

            const kickMessage =
           `╭──〔 🚫 ᴀᴜᴛᴏ-ᴋɪᴄᴋ 〕──
│
├─ @${userToWarn.split('@')[0]} ʀᴇᴄᴇɪᴠᴇᴅ 3 ᴡᴀʀɴɪɴɢs.
├─ ᴜsᴇʀ ʜᴀs ʙᴇᴇɴ ʀᴇᴍᴏᴠᴇᴅ ꜰʀᴏᴍ ᴛʜᴇ ɢʀᴏᴜᴘ.
│
╰──〔 ⚠️ ᴊɪɴᴜ-ɪɪ ᴡᴀʀɴ ᴄᴏɴᴛʀᴏʟ 〕──`;

            await sock.sendMessage(chatId, {
                text: kickMessage,
                mentions: [userToWarn],
                quoted: message,
...channelInfo
});
}

} catch (error) {
        console.error('Error in warn command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴘʀᴏᴄᴇss ᴡᴀʀɴɪɴɢ. ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 ⚠️ ᴊɪɴᴜ-ɪɪ ᴡᴀʀɴ ᴄᴏɴᴛʀᴏʟ 〕──`,
            quoted: message,
...channelInfo
});
}
}

module.exports = warnCommand;
