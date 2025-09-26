
const { isJidGroup} = require('@whiskeysockets/baileys');
const {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} = require('../lib/index');
const config = require('../config');

const WARN_COUNT = config.WARN_COUNT || 3;

// 🔍 Check if message contains a URL
function containsURL(str) {
    const urlRegex = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return urlRegex.test(str);
}

// 🛡️ Antilink Handler
async function Antilink(msg, sock) {
    const jid = msg.key.remoteJid;
    if (!isJidGroup(jid)) return;

    const SenderMessage = msg.message?.conversation ||
                          msg.message?.extendedTextMessage?.text || '';
    if (!SenderMessage || typeof SenderMessage!== 'string') return;

    const sender = msg.key.participant;
    if (!sender) return;

    const isAdmin = await isSudo(sender);
    if (isAdmin) return;

    if (!containsURL(SenderMessage.trim())) return;

    const antilinkConfig = await getAntilink(jid, 'on');
    if (!antilinkConfig) return;

    const action = antilinkConfig.action;

    try {
        // 🧹 Delete the message
        await sock.sendMessage(jid, { delete: msg.key});

        switch (action) {
            case 'delete':
                await sock.sendMessage(jid, {
                    text:
`╭──〔 ⚠️ ʟɪɴᴋ ᴅᴇᴛᴇᴄᴛᴇᴅ 〕──
│
├─ @${sender.split('@')[0]} ʟɪɴᴋꜱ ᴀʀᴇ ɴᴏᴛ ᴀʟʟᴏᴡᴇᴅ ɪɴ ᴛʜɪꜱ ɢʀᴏᴜᴘ.
│   ᴍᴇꜱꜱᴀɢᴇ ʜᴀꜱ ʙᴇᴇɴ ʀᴇᴍᴏᴠᴇᴅ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴀɴᴛɪʟɪɴᴋ ᴇɴɢɪɴᴇ 〕──`,
                    mentions: [sender]
});
                break;

            case 'kick':
                await sock.groupParticipantsUpdate(jid, [sender], 'remove');
                await sock.sendMessage(jid, {
                    text:
`╭──〔 🚫 ᴜꜱᴇʀ ᴋɪᴄᴋᴇᴅ 〕──
│
├─ @${sender.split('@')[0]} ʜᴀꜱ ʙᴇᴇɴ ʀᴇᴍᴏᴠᴇᴅ ꜰᴏʀ ꜱᴇɴᴅɪɴɢ ʟɪɴᴋꜱ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴀɴᴛɪʟɪɴᴋ ᴇɴɢɪɴᴇ 〕──`,
                    mentions: [sender]
});
                break;

            case 'warn':
                const warningCount = await incrementWarningCount(jid, sender);
                if (warningCount>= WARN_COUNT) {
                    await sock.groupParticipantsUpdate(jid, [sender], 'remove');
                    await resetWarningCount(jid, sender);
                    await sock.sendMessage(jid, {
                        text:
`╭──〔 🚫 ᴜꜱᴇʀ ʀᴇᴍᴏᴠᴇᴅ 〕──
│
├─ @${sender.split('@')[0]} ʀᴇᴄᴇɪᴠᴇᴅ ${WARN_COUNT} ᴡᴀʀɴɪɴɢꜱ ꜰᴏʀ ꜱᴇɴᴅɪɴɢ ʟɪɴᴋꜱ.
│   ᴜꜱᴇʀ ʜᴀꜱ ʙᴇᴇɴ ʀᴇᴍᴏᴠᴇᴅ ꜰʀᴏᴍ ᴛʜᴇ ɢʀᴏᴜᴘ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴀɴᴛɪʟɪɴᴋ ᴇɴɢɪɴᴇ 〕──`,
                        mentions: [sender]
});
} else {
                    await sock.sendMessage(jid, {
                        text:
`╭──〔 ⚠️ ᴡᴀʀɴɪɴɢ ɪssᴜᴇᴅ 〕──
│
├─ @${sender.split('@')[0]} ᴡᴀʀɴɪɴɢ ${warningCount}/${WARN_COUNT} ꜰᴏʀ ꜱᴇɴᴅɪɴɢ ʟɪɴᴋꜱ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴀɴᴛɪʟɪɴᴋ ᴇɴɢɪɴᴇ 〕──`,
                        mentions: [sender]
});
}
                break;
}
} catch (error) {
        console.error('Error in Antilink:', error);
}
}

module.exports = { Antilink};
