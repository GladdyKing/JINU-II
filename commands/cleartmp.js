
const fs = require('fs');
const path = require('path');

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

// 🧼 ᴄʟᴇᴀʀ ᴀ sɪɴɢʟᴇ ᴅɪʀᴇᴄᴛᴏʀʏ
function clearDirectory(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            return {
                success: false,
                message: `ᴅɪʀᴇᴄᴛᴏʀʏ ɴᴏᴛ ꜰᴏᴜɴᴅ: ${dirPath}`
};
}

        const files = fs.readdirSync(dirPath);
        let deletedCount = 0;

        for (const file of files) {
            try {
                fs.unlinkSync(path.join(dirPath, file));
                deletedCount++;
} catch (err) {
                console.error(`❌ ᴇʀʀᴏʀ ᴅᴇʟᴇᴛɪɴɢ ${file}:`, err);
}
}

        return {
            success: true,
            message: `🗑️ ᴄʟᴇᴀʀᴇᴅ ${deletedCount} ꜰɪʟᴇs ɪɴ *${path.basename(dirPath)}*`,
            count: deletedCount
};

} catch (error) {
        console.error('❌ ᴇʀʀᴏʀ ɪɴ clearDirectory:', error);
        return {
            success: false,
            message: `ꜰᴀɪʟᴇᴅ ᴛᴏ ᴄʟᴇᴀʀ *${path.basename(dirPath)}*`,
            error: error.message
};
}
}

// 🔁 ᴄʟᴇᴀʀ tmp ᴀɴᴅ temp ꜰᴏʟᴅᴇʀs
async function clearTmpDirectory() {
    const tmpDir = path.join(process.cwd(), 'tmp');
    const tempDir = path.join(process.cwd(), 'temp');

    const results = [clearDirectory(tmpDir), clearDirectory(tempDir)];
    const success = results.every(r => r.success);
    const totalDeleted = results.reduce((sum, r) => sum + (r.count || 0), 0);
    const message = results.map(r => r.message).join('\n│   ');

    return {
        success,
        message,
        count: totalDeleted
};
}

// 📡 ᴍᴀɴᴜᴀʟ ᴄᴏᴍᴍᴀɴᴅ ʜᴀɴᴅʟᴇʀ
async function clearTmpCommand(sock, chatId, msg) {
    try {
        if (!msg.key.fromMe) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ 〕──
│
├─ ᴏɴʟʏ ᴛʜᴇ *ᴏᴡɴᴇʀ* ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const result = await clearTmpDirectory();

        const response = result.success
? `╭──〔 ✅ ᴛᴇᴍᴘ ᴄʟᴇᴀʀᴇᴅ 〕──\n│\n├─ ${result.message}\n├─ ᴛᴏᴛᴀʟ ᴅᴇʟᴇᴛᴇᴅ: ${result.count} ꜰɪʟᴇs\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
: `╭──〔 ⚠️ ғᴀɪʟᴜʀᴇ 〕──\n│\n├─ ${result.message}\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        await sock.sendMessage(chatId, { text: response,...channelInfo});

} catch (error) {
        console.error('❌ ᴇʀʀᴏʀ ɪɴ cleartmp ᴄᴏᴍᴍᴀɴᴅ:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴄʟᴇᴀʀ ᴛᴇᴍᴘᴏʀᴀʀʏ ꜰɪʟᴇs.
├─ ʀᴇᴀsᴏɴ: ${error.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

// ⏱️ ᴀᴜᴛᴏ ᴄʟᴇᴀʀ ᴇᴠᴇʀʏ 6 ʜᴏᴜʀs
function startAutoClear() {
    clearTmpDirectory().then(result => {
        if (!result.success) {
            console.error(`[Auto Clear] ${result.message}`);
}
});

    setInterval(async () => {
        const result = await clearTmpDirectory();
        if (!result.success) {
            console.error(`[Auto Clear] ${result.message}`);
}
}, 6 * 60 * 60 * 1000); // 6 hours
}

startAutoClear();

module.exports = clearTmpCommand;
