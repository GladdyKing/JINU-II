const fs = require('fs');
const path = require('path');

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363422020175323@newsletter.whatsapp.net',
            newsletterName: 'ᴊɪɴᴜ-ɪɪ',
            serverMessageId: -1
}
}
};

const configPath = path.join(__dirname, '../data/autoStatus.json');

// 🧾 ɪɴɪᴛɪᴀʟɪᴢᴇ ᴄᴏɴғɪɢ
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ enabled: false}));
}

// 📡 ᴄᴏᴍᴍᴀɴᴅ ʜᴀɴᴅʟᴇʀ
async function autoStatusCommand(sock, chatId, msg, args) {
    try {
        if (!msg.key.fromMe) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴘᴇʀᴍɪssɪᴏɴ ᴅᴇɴɪᴇᴅ 〕──
│
├─ *ᴏɴʟʏ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const config = JSON.parse(fs.readFileSync(configPath));

        if (!args || args.length === 0) {
            const status = config.enabled? '✅ ᴇɴᴀʙʟᴇᴅ': '❌ ᴅɪsᴀʙʟᴇᴅ';
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🔄 ᴀᴜᴛᴏ sᴛᴀᴛᴜs ᴠɪᴇᴡ 〕──
│
├─ ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ: ${status}
│
├─ *.autostatus on* – ᴇɴᴀʙʟᴇ
├─ *.autostatus off* – ᴅɪsᴀʙʟᴇ
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const command = args[0].toLowerCase();

        if (command === 'on') {
            config.enabled = true;
            fs.writeFileSync(configPath, JSON.stringify(config));
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ✅ ᴀᴄᴛɪᴠᴀᴛᴇᴅ 〕──
│
├─ *ᴀᴜᴛᴏ sᴛᴀᴛᴜs ᴠɪᴇᴡ ᴇɴᴀʙʟᴇᴅ!*
├─ ʙᴏᴛ ᴡɪʟʟ ɴᴏᴡ ᴠɪᴇᴡ ᴀʟʟ ᴄᴏɴᴛᴀᴄᴛ sᴛᴀᴛᴜsᴇs.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
} else if (command === 'off') {
            config.enabled = false;
            fs.writeFileSync(configPath, JSON.stringify(config));
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴅɪsᴀʙʟᴇᴅ 〕──
│
├─ *ᴀᴜᴛᴏ sᴛᴀᴛᴜs ᴠɪᴇᴡ ᴅɪsᴀʙʟᴇᴅ!*
├─ ʙᴏᴛ ᴡɪʟʟ ɴᴏ ʟᴏɴɢᴇʀ ᴠɪᴇᴡ sᴛᴀᴛᴜsᴇs.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
} else {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ɪɴᴠᴀʟɪᴅ ᴄᴏᴍᴍᴀɴᴅ 〕──
│
├─ ᴜsᴇ:
├─ *.autostatus on* – ᴇɴᴀʙʟᴇ
├─ *.autostatus off* – ᴅɪsᴀʙʟᴇ
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}

} catch (error) {
        console.error('❌ Error in autostatus command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ${error.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

// 🔍 ᴄʜᴇᴄᴋ sᴛᴀᴛᴜs
function isAutoStatusEnabled() {
    try {
        const config = JSON.parse(fs.readFileSync(configPath));
        return config.enabled;
} catch (error) {
        console.error('❌ Error checking auto status config:', error);
        return false;
}
}

// 👁️ ʜᴀɴᴅʟᴇ sᴛᴀᴛᴜs ᴜᴘᴅᴀᴛᴇs
async function handleStatusUpdate(sock, status) {
    try {
        if (!isAutoStatusEnabled()) return;

        await new Promise(resolve => setTimeout(resolve, 1000));

        const keys = [
            status?.messages?.[0]?.key,
            status?.key,
            status?.reaction?.key
        ].filter(Boolean);

        for (const key of keys) {
            if (key.remoteJid === 'status@broadcast') {
                try {
                    await sock.readMessages([key]);
                    const sender = key.participant || key.remoteJid;
[8/22, 14:50] Microsoft Copilot: console.log(`✅ Viewed status from: ${sender.split('@')[0]}`);
} catch (err) {
                    if (err.message?.includes('rate-overlimit')) {
                        console.log('⚠️ Rate limit hit, retrying...');
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await sock.readMessages([key]);
} else {
                        throw err;
}
}
}
}

} catch (error) {
        console.error('❌ Error in auto status view:', error.message);
}
}

module.exports = {
    autoStatusCommand,
    handleStatusUpdate
};
