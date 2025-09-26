const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'data', 'autoread.json');

// 🧾 ɪɴɪᴛɪᴀʟɪᴢᴇ ᴄᴏɴғɪɢ
function initConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({ enabled: false}, null, 2));
}
    return JSON.parse(fs.readFileSync(configPath));
}

// 📡 ᴀᴜᴛᴏʀᴇᴀᴅ ᴄᴏᴍᴍᴀɴᴅ
async function autoreadCommand(sock, chatId, message) {
    try {
        if (!message.key.fromMe) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴘᴇʀᴍɪssɪᴏɴ ᴅᴇɴɪᴇᴅ 〕──
│
├─ *ᴏɴʟʏ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363422020175323@newsletter.whatsapp.net',
                        newsletterName: 'ᴊɪɴᴜ-ɪɪ',
                        serverMessageId: -1
}
}
});
            return;
}

        const args = message.message?.conversation?.trim().split(' ').slice(1) ||
                     message.message?.extendedTextMessage?.text?.trim().split(' ').slice(1) || [];

        const config = initConfig();

        if (args.length> 0) {
            const action = args[0].toLowerCase();
            if (action === 'on' || action === 'enable') {
                config.enabled = true;
} else if (action === 'off' || action === 'disable') {
                config.enabled = false;
} else {
                await sock.sendMessage(chatId, {
                    text:
`╭──〔 ⚠️ ɪɴᴠᴀʟɪᴅ ᴏᴘᴛɪᴏɴ 〕──
│
├─ ᴜsᴇ: *.autoread on* / *.autoread off*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363422020175323@newsletter.whatsapp.net',
                            newsletterName: 'ᴊɪɴᴜ-ɪɪ',
                            serverMessageId: -1
}
}
});
                return;
}
} else {
            config.enabled =!config.enabled;
}

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        await sock.sendMessage(chatId, {
            text:
`╭──〔 ✅ ᴀᴜᴛᴏʀᴇᴀᴅ ᴜᴘᴅᴀᴛᴇ 〕──
│
├─ ꜱᴛᴀᴛᴜꜱ: ${config.enabled? 'ᴇɴᴀʙʟᴇᴅ ✅': 'ᴅɪsᴀʙʟᴇᴅ ❌'}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363422020175323@newsletter.whatsapp.net',
                    newsletterName: 'ᴊɪɴᴜ-ɪɪ',
                    serverMessageId: -1
}
}
});

} catch (error) {
        console.error('❌ Error in autoread command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ${error.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363422020175323@newsletter.whatsapp.net',
                    newsletterName: 'ᴊɪɴᴜ-ɪɪ',
                    serverMessageId: -1
}
}
});
}
}

// 🔍 ᴄʜᴇᴄᴋ ᴀᴜᴛᴏʀᴇᴀᴅ sᴛᴀᴛᴜs
function isAutoreadEnabled() {
    try {
        const config = initConfig();
return config.enabled;
} catch (error) {
        console.error('❌ Error checking autoread status:', error);
        return false;
}
}

// 🧠 ᴄʜᴇᴄᴋ ɪғ ʙᴏᴛ ɪs ᴍᴇɴᴛɪᴏɴᴇᴅ
function isBotMentionedInMessage(message, botNumber) {
    if (!message.message) return false;

    const messageTypes = [
        'extendedTextMessage', 'imageMessage', 'videoMessage', 'stickerMessage',
        'documentMessage', 'audioMessage', 'contactMessage', 'locationMessage'
    ];

    for (const type of messageTypes) {
        if (message.message[type]?.contextInfo?.mentionedJid) {
            const mentionedJid = message.message[type].contextInfo.mentionedJid;
            if (mentionedJid.some(jid => jid === botNumber)) return true;
}
}

    const textContent =
        message.message.conversation ||
        message.message.extendedTextMessage?.text ||
        message.message.imageMessage?.caption ||
        message.message.videoMessage?.caption || '';

    if (textContent) {
        const botUsername = botNumber.split('@')[0];
        if (textContent.includes(`@${botUsername}`)) return true;

        const botNames = [global.botname?.toLowerCase(), 'bot', 'jinu', 'jinu-ii'];
        const words = textContent.toLowerCase().split(/\s+/);
        if (botNames.some(name => words.includes(name))) return true;
}

    return false;
}

// 👁️ ʜᴀɴᴅʟᴇ ᴀᴜᴛᴏʀᴇᴀᴅ
async function handleAutoread(sock, message) {
    if (isAutoreadEnabled()) {
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotMentioned = isBotMentionedInMessage(message, botNumber);

        if (isBotMentioned) {
            return false;
} else {
            const key = {
                remoteJid: message.key.remoteJid,
                id: message.key.id,
                participant: message.key.participant
};
            await sock.readMessages([key]);
            return true;
}
}
    return false;
}

module.exports = {
    autoreadCommand,
    isAutoreadEnabled,
    isBotMentionedInMessage,
    handleAutoread
};
