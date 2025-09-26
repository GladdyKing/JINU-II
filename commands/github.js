
const moment = require('moment-timezone');
const fetch = require('node-fetch');
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

async function githubCommand(sock, chatId, message) {
    try {
        const res = await fetch('https://api.github.com/repos/GladdyKing/JINU-II');
        if (!res.ok) throw new Error('Error fetching repository data');
        const json = await res.json();

        const caption =
`╭──〔 🧠 ɢɪᴛʜᴜʙ ʀᴇᴘᴏ ɪɴꜰᴏ 〕──
│
├─ 📦 ɴᴀᴍᴇ: *${json.name}*
├─ 👁️ ᴡᴀᴛᴄʜᴇʀs: *${json.watchers_count}*
├─ 📐 ꜱɪᴢᴇ: *${(json.size / 1024).toFixed(2)} MB*
├─ 🕒 ᴜᴘᴅᴀᴛᴇᴅ: *${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}*
├─ 🔗 ᴜʀʟ: ${json.html_url}
├─ 🍴 ꜰᴏʀᴋs: *${json.forks_count}*
├─ ⭐ sᴛᴀʀs: *${json.stargazers_count}*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        const imgPath = path.join(__dirname, '../assets/bot_image.jpg');
        const imgBuffer = fs.readFileSync(imgPath);

        await sock.sendMessage(chatId, {
            image: imgBuffer,
            caption,
...channelInfo
}, { quoted: message});

} catch (error) {
        console.error('❌ Error fetching GitHub repo:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ʀᴇᴘᴏsɪᴛᴏʀʏ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ.
├─ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
}, { quoted: message});
}
}

module.exports = githubCommand;
