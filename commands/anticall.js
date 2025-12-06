
const fs = require('fs');

const ANTICALL_PATH = './data/anticall.json';

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

function readState() {
    try {
        if (!fs.existsSync(ANTICALL_PATH)) return { enabled: false};
        const raw = fs.readFileSync(ANTICALL_PATH, 'utf8');
        const data = JSON.parse(raw || '{}');
        return { enabled:!!data.enabled};
} catch {
        return { enabled: false};
}
}

function writeState(enabled) {
    try {
        if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true});
        fs.writeFileSync(ANTICALL_PATH, JSON.stringify({ enabled:!!enabled}, null, 2));
} catch {}
}

async function anticallCommand(sock, chatId, message, args) {
    const state = readState();
    const sub = (args || '').trim().toLowerCase();

    if (!sub || (sub!== 'on' && sub!== 'off' && sub!== 'status')) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 📵 *ᴀɴᴛɪᴄᴀʟʟ ᴄᴏɴᴛʀᴏʟ* 〕──
│
├─ ᴜꜱᴀɢᴇ:
│   • *.anticall on* — ᴇɴᴀʙʟᴇ ᴀᴜᴛᴏ-ʙʟᴏᴄᴋ ᴏɴ ɪɴᴄᴏᴍɪɴɢ ᴄᴀʟʟꜱ
│   • *.anticall off* — ᴅɪꜱᴀʙʟᴇ ᴀɴᴛɪᴄᴀʟʟ ꜰᴇᴀᴛᴜʀᴇ
│   • *.anticall status* — ᴄʜᴇᴄᴋ ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
        return;
}

    if (sub === 'status') {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 📶 *ᴀɴᴛɪᴄᴀʟʟ ꜱᴛᴀᴛᴜꜱ* 〕──
│
├─ ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴇ: *${state.enabled? 'ᴏɴ ✅': 'ᴏꜰꜰ ❌'}*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
        return;
}

    const enable = sub === 'on';
    writeState(enable);
    await sock.sendMessage(chatId, {
        text:
`╭──〔 🔒 *ᴀɴᴛɪᴄᴀʟʟ ᴜᴘᴅᴀᴛᴇᴅ* 〕──
│
├─ ꜱᴛᴀᴛᴜꜱ: *${enable? 'ᴇɴᴀʙʟᴇᴅ ✅': 'ᴅɪꜱᴀʙʟᴇᴅ ❌'}*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}

module.exports = { anticallCommand, readState};
