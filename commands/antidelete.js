const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage} = require('@whiskeysockets/baileys');
const { writeFile} = require('fs/promises');

const messageStore = new Map();
const CONFIG_PATH = path.join(__dirname, '../data/antidelete.json');
const TEMP_MEDIA_DIR = path.join(__dirname, '../tmp');

// 🛠️ Ensure temp dir exists
if (!fs.existsSync(TEMP_MEDIA_DIR)) {
    fs.mkdirSync(TEMP_MEDIA_DIR, { recursive: true});
}

// 📏 Get folder size in MB
const getFolderSizeInMB = (folderPath) => {
    try {
        const files = fs.readdirSync(folderPath);
        let totalSize = 0;
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            if (fs.statSync(filePath).isFile()) {
                totalSize += fs.statSync(filePath).size;
}
}
        return totalSize / (1024 * 1024);
} catch (err) {
        console.error('Error getting folder size:', err);
        return 0;
}
};

// 🧹 Clean temp folder if size exceeds 100MB
const cleanTempFolderIfLarge = () => {
    try {
        const sizeMB = getFolderSizeInMB(TEMP_MEDIA_DIR);
        if (sizeMB> 100) {
            const files = fs.readdirSync(TEMP_MEDIA_DIR);
            for (const file of files) {
                fs.unlinkSync(path.join(TEMP_MEDIA_DIR, file));
}
}
} catch (err) {
        console.error('Temp cleanup error:', err);
}
};

// 🕒 Periodic cleanup
setInterval(cleanTempFolderIfLarge, 60 * 1000);

// ⚙️ Config management
function loadAntideleteConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) return { enabled: false};
        return JSON.parse(fs.readFileSync(CONFIG_PATH));
} catch {
        return { enabled: false};
}
}

function saveAntideleteConfig(config) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
} catch (err) {
        console.error('Config save error:', err);
}
}

// 📲 Command handler
async function handleAntideleteCommand(sock, chatId, message, match) {
    if (!message.key.fromMe) {
        return sock.sendMessage(chatId, {
            text:
`╭──〔 🚫 ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ ᴀᴄᴄᴇss 〕──
│
├─ ᴏɴʟʏ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
}

    const config = loadAntideleteConfig();

    if (!match) {
        return sock.sendMessage(chatId, {
            text:
`╭──〔 🛡️ ᴊɪɴᴜ-ɪɪ ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ꜱᴇᴛᴜᴘ 〕──
│
├─ 📌 ꜱᴛᴀᴛᴜꜱ: ${config.enabled? '✅ ᴇɴᴀʙʟᴇᴅ': '❌ ᴅɪꜱᴀʙʟᴇᴅ'}
│
├─ 💡 ᴄᴏᴍᴍᴀɴᴅꜱ:
│   *.antidelete on* – ᴇɴᴀʙʟᴇ
│   *.antidelete off* – ᴅɪꜱᴀʙʟᴇ
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
}

    if (match!== 'on' && match!== 'off') {
        return sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ɪɴᴠᴀʟɪᴅ ᴄᴏᴍᴍᴀɴᴅ 〕──
│
├─ ᴜsᴇ *.antidelete* ᴛᴏ ᴄʜᴇᴄᴋ sᴛᴀᴛᴜs
├─ ᴏʀ *.antidelete on/off* ᴛᴏ ᴛᴏɢɢʟᴇ
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
}

    config.enabled = match === 'on';
    saveAntideleteConfig(config);

    return sock.sendMessage(chatId, {
        text:
`╭──〔 ✅ ᴄᴏɴꜰɪɢ ᴜᴘᴅᴀᴛᴇᴅ 〕──
│
├─ 🛡️ ᴀɴᴛɪᴅᴇʟᴇᴛᴇ: ${match === 'on'? 'ᴇɴᴀʙʟᴇᴅ ✅': 'ᴅɪꜱᴀʙʟᴇᴅ ❌'}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
}

// 📥 Store incoming messages
async function storeMessage(message) {
    try {
        const config = loadAntideleteConfig();
        if (!config.enabled ||!message.key?.id) return;

        const messageId = message.key.id;
        let content = '';
        let mediaType = '';
        let mediaPath = '';
        const sender = message.key.participant || message.key.remoteJid;

        if (message.message?.conversation) {
            content = message.message.conversation;
} else if (message.message?.extendedTextMessage?.text) {
content = message.message.extendedTextMessage.text;
} else if (message.message?.imageMessage) {
            mediaType = 'image';
            content = message.message.imageMessage.caption || '';
            const buffer = await downloadContentFromMessage(message.message.imageMessage, 'image');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.jpg`);
            await writeFile(mediaPath, buffer);
} else if (message.message?.stickerMessage) {
            mediaType = 'sticker';
            const buffer = await downloadContentFromMessage(message.message.stickerMessage, 'sticker');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.webp`);
            await writeFile(mediaPath, buffer);
} else if (message.message?.videoMessage) {
            mediaType = 'video';
            content = message.message.videoMessage.caption || '';
            const buffer = await downloadContentFromMessage(message.message.videoMessage, 'video');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.mp4`);
            await writeFile(mediaPath, buffer);
}

        messageStore.set(messageId, {
            content,
            mediaType,
            mediaPath,
            sender,
            group: message.key.remoteJid.endsWith('@g.us')? message.key.remoteJid: null,
            timestamp: new Date().toISOString()
});

} catch (err) {
        console.error('storeMessage error:', err);
}
}

// 🧾 Handle message deletion
async function handleMessageRevocation(sock, revocationMessage) {
    try {
        const config = loadAntideleteConfig();
        if (!config.enabled) return;

        const messageId = revocationMessage.message.protocolMessage.key.id;
        const deletedBy = revocationMessage.participant || revocationMessage.key.participant || revocationMessage.key.remoteJid;
        const ownerNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';

        if (deletedBy.includes(sock.user.id) || deletedBy === ownerNumber) return;

        const original = messageStore.get(messageId);
        if (!original) return;

        const sender = original.sender;
        const senderName = sender.split('@')[0];
        const groupName = original.group? (await sock.groupMetadata(original.group)).subject: '';

        const time = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
});

        let text =
`╭──〔 🔰 ᴊɪɴᴜ-ɪɪ ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ʀᴇᴘᴏʀᴛ 🔰 〕──
│
├─ 🗑️ ᴅᴇʟᴇᴛᴇᴅ ʙʏ: @${deletedBy.split('@')[0]}
├─ 👤 ꜱᴇɴᴅᴇʀ: @${senderName}
├─ 📱 ɴᴜᴍʙᴇʀ: ${sender}
├─ 🕒 ᴛɪᴍᴇ: ${time}`;

        if (groupName) text += `\n├─ 👥 ɢʀᴏᴜᴘ: ${groupName}`;
        if (original.content) text += `\n│\n├─ 💬 ᴍᴇssᴀɢᴇ:\n${original.content}`;

        text += `\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        await sock.sendMessage(ownerNumber, {
            text,
            mentions: [deletedBy, sender]
});

        // 🎞️ Send media if available
        if (original.mediaType && fs.existsSync(original.mediaPath)) {
            const mediaOptions = {
                caption:
`╭──〔 🎞️ ᴍᴇᴅɪᴀ ʀᴇᴄᴏᴠᴇʀᴇᴅ 〕──
│
├─ 🗂️ ᴛʏᴘᴇ: ${original.mediaType}
├─ 👤 ꜱᴇɴᴛ ʙʏ: @${senderName}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
                mentions: [sender]
};

            try {
                switch (original.mediaType) {
                    case 'image':
                        await sock.sendMessage(ownerNumber, {
                            image: { url: original.mediaPath},
...mediaOptions
});
                        break;
                    case 'sticker':
                        await sock.sendMessage(ownerNumber, {
                            sticker: { url: original.mediaPath},
...mediaOptions
});
                        break;
                    case 'video':
                        await sock.sendMessage(ownerNumber, {
                            video: { url: original.mediaPath},
...mediaOptions
});
                        break;
}
} catch (err) {
                await sock.sendMessage(ownerNumber, {
                    text:
`╭──〔 ⚠️ ᴍᴇᴅɪᴀ ᴇʀʀᴏʀ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ sᴇɴᴅ ᴍᴇᴅɪᴀ ꜰɪʟᴇ.
├─ ʀᴇᴀsᴏɴ: ${err.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
}

            // 🧹 Cleanup
            try {
                fs.unlinkSync(original.mediaPath);
} catch (err) {
                console.error('Media cleanup error:', err);
}
}

        messageStore.delete(messageId);

} catch (err) {
        console.error('handleMessageRevocation error:', err);
}
}

module.exports = {
    handleAntideleteCommand,
    handleMessageRevocation,
    storeMessage
};
