const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'data', 'autotyping.json');

// 🧾 ɪɴɪᴛɪᴀʟɪᴢᴇ ᴄᴏɴғɪɢ
function initConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({ enabled: false}, null, 2));
}
    return JSON.parse(fs.readFileSync(configPath));
}

// 📡 ᴀᴜᴛᴏᴛʏᴘɪɴɢ ᴄᴏᴍᴍᴀɴᴅ
async function autotypingCommand(sock, chatId, message) {
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
├─ ᴜsᴇ: *.autotyping on* / *.autotyping off*
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
`╭──〔 ✅ ᴀᴜᴛᴏᴛʏᴘɪɴɢ ᴜᴘᴅᴀᴛᴇ 〕──
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
        console.error('❌ Error in autotyping command:', error);
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

// 🔍 ᴄʜᴇᴄᴋ ᴀᴜᴛᴏᴛʏᴘɪɴɢ sᴛᴀᴛᴜs
function isAutotypingEnabled() {
    try {
        const config = initConfig();
return config.enabled;
} catch (error) {
        console.error('❌ Error checking autotyping status:', error);
        return false;
}
}

// 👁️ ʜᴀɴᴅʟᴇ ᴛʏᴘɪɴɢ ғᴏʀ ᴍᴇssᴀɢᴇs
async function handleAutotypingForMessage(sock, chatId, userMessage) {
    if (isAutotypingEnabled()) {
        try {
            await sock.presenceSubscribe(chatId);
            await sock.sendPresenceUpdate('available', chatId);
            await new Promise(resolve => setTimeout(resolve, 500));
            await sock.sendPresenceUpdate('composing', chatId);

            const typingDelay = Math.max(3000, Math.min(8000, userMessage.length * 150));
            await new Promise(resolve => setTimeout(resolve, typingDelay));

            await sock.sendPresenceUpdate('composing', chatId);
            await new Promise(resolve => setTimeout(resolve, 1500));
            await sock.sendPresenceUpdate('paused', chatId);

            return true;
} catch (error) {
            console.error('❌ Error sending typing indicator:', error);
            return false;
}
}
    return false;
}

// ⏳ ʙᴇғᴏʀᴇ ᴄᴏᴍᴍᴀɴᴅ ᴇxᴇᴄᴜᴛɪᴏɴ
async function handleAutotypingForCommand(sock, chatId) {
    if (isAutotypingEnabled()) {
        try {
            await sock.presenceSubscribe(chatId);
            await sock.sendPresenceUpdate('available', chatId);
            await new Promise(resolve => setTimeout(resolve, 500));
            await sock.sendPresenceUpdate('composing', chatId);
            await new Promise(resolve => setTimeout(resolve, 3000));
            await sock.sendPresenceUpdate('composing', chatId);
            await new Promise(resolve => setTimeout(resolve, 1500));
            await sock.sendPresenceUpdate('paused', chatId);

            return true;
} catch (error) {
            console.error('❌ Error sending command typing indicator:', error);
            return false;
}
}
    return false;
}

// 🕒 ᴀғᴛᴇʀ ᴄᴏᴍᴍᴀɴᴅ ᴇxᴇᴄᴜᴛɪᴏɴ
async function showTypingAfterCommand(sock, chatId) {
    if (isAutotypingEnabled()) {
        try {
            await sock.presenceSubscribe(chatId);
            await sock.sendPresenceUpdate('composing', chatId);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await sock.sendPresenceUpdate('paused', chatId);

            return true;
} catch (error) {
            console.error('❌ Error sending post-command typing indicator:', error);
            return false;
}
}
    return false;
}

module.exports = {
    autotypingCommand,
    isAutotypingEnabled,
    handleAutotypingForMessage,
    handleAutotypingForCommand,
    showTypingAfterCommand
};
