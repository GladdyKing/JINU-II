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

async function clearSessionCommand(sock, chatId, msg) {
    try {
        // 🔐 ᴘᴇʀᴍɪssɪᴏɴ ᴄʜᴇᴄᴋ
        if (!msg.key.fromMe) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ 〕──
│
├─ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ɪs ꜰᴏʀ *ᴏᴡɴᴇʀ ᴏɴʟʏ!*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const sessionDir = path.join(__dirname, '../session');

        // 📁 ᴄʜᴇᴄᴋ sᴇssɪᴏɴ ᴅɪʀᴇᴄᴛᴏʀʏ
        if (!fs.existsSync(sessionDir)) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ sᴇssɪᴏɴ ɴᴏᴛ ғᴏᴜɴᴅ 〕──
│
├─ sᴇssɪᴏɴ ᴅɪʀᴇᴄᴛᴏʀʏ ɪs ᴍɪssɪɴɢ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        let filesCleared = 0;
        let errors = 0;
        let errorDetails = [];

        // 🧹 sᴛᴀʀᴛ ᴄʟᴇᴀɴᴜᴘ
        await sock.sendMessage(chatId, {
            text:
`╭──〔 🔍 sᴇssɪᴏɴ ᴏᴘᴛɪᴍɪᴢᴀᴛɪᴏɴ 〕──
│
├─ ᴄʟᴇᴀɴɪɴɢ ᴜᴘ sᴇssɪᴏɴ ꜰɪʟᴇs...
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});

        const files = fs.readdirSync(sessionDir);
        let appStateSyncCount = 0;
        let preKeyCount = 0;

        for (const file of files) {
            if (file.startsWith('app-state-sync-')) appStateSyncCount++;
            if (file.startsWith('pre-key-')) preKeyCount++;
}

        for (const file of files) {
            if (file === 'creds.json') continue;
            try {
                fs.unlinkSync(path.join(sessionDir, file));
                filesCleared++;
} catch (error) {
                errors++;
                errorDetails.push(`• ${file}: ${error.message}`);
}
}

        // 📊 sᴜᴍᴍᴀʀʏ ʀᴇᴘᴏʀᴛ
        const summary =
`╭──〔 ✅ sᴇssɪᴏɴ ᴄʟᴇᴀʀᴇᴅ 〕──
│
├─ 📊 sᴛᴀᴛs:
│   • ꜰɪʟᴇs ᴄʟᴇᴀʀᴇᴅ: ${filesCleared}
│   • ᴀᴘᴘ-sᴛᴀᴛᴇ sʏɴᴄ: ${appStateSyncCount}
│   • ᴘʀᴇ-ᴋᴇʏ ꜰɪʟᴇs: ${preKeyCount}
${errors> 0? `│\n├─ ⚠️ ᴇʀʀᴏʀs: ${errors}\n${errorDetails.map(e => `│   ${e}`).join('\n')}`: ''}
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;

        await sock.sendMessage(chatId, {
            text: summary,
...channelInfo
});

} catch (error) {
        console.error('❌ Error in clearsession command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴄʟᴇᴀʀ sᴇssɪᴏɴ ꜰɪʟᴇs.
├─ ʀᴇᴀsᴏɴ: ${error.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = clearSessionCommand;
