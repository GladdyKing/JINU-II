
const {
    setAntiBadword,
    getAntiBadword,
    removeAntiBadword,
    incrementWarningCount,
    resetWarningCount
} = require('../lib/index');
const fs = require('fs');
const path = require('path');

// 🧠 Load antibadword config
function loadAntibadwordConfig(groupId) {
    try {
        const configPath = path.join(__dirname, '../data/userGroupData.json');
        if (!fs.existsSync(configPath)) return {};
        const data = JSON.parse(fs.readFileSync(configPath));
        return data.antibadword?.[groupId] || {};
} catch (error) {
        console.error('❌ Error loading antibadword config:', error.message);
        return {};
}
}

// 🛡️ Handle antibadword setup commands
async function handleAntiBadwordCommand(sock, chatId, message, match) {
    if (!match) {
        return sock.sendMessage(chatId, {
            text:
`╭──〔 🛡️ ᴀɴᴛɪʙᴀᴅᴡᴏʀᴅ ꜱᴇᴛᴜᴘ 〕──
│
├─ *.antibadword on*
│   ᴇɴᴀʙʟᴇꜱ ᴀɴᴛɪʙᴀᴅᴡᴏʀᴅ ꜰɪʟᴛᴇʀ
│
├─ *.antibadword set <action>*
│   ᴀᴄᴛɪᴏɴ: delete / kick / warn
│
├─ *.antibadword off*
│   ᴅɪꜱᴀʙʟᴇꜱ ꜰɪʟᴛᴇʀ ꜰᴏʀ ᴛʜɪꜱ ɢʀᴏᴜᴘ
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴍᴏᴅᴇʀᴀᴛɪᴏɴ 〕──`,
            quoted: message
});
}

    if (match === 'on') {
        const existingConfig = await getAntiBadword(chatId, 'on');
        if (existingConfig?.enabled) {
            return sock.sendMessage(chatId, {
                text: `╭──〔 ⚠️ ɴᴏᴛɪᴄᴇ 〕──\n│\n├─ ᴀɴᴛɪʙᴀᴅᴡᴏʀᴅ ɪꜱ ᴀʟʀᴇᴀᴅʏ ᴇɴᴀʙʟᴇᴅ.\n╰──〔 🧩 ᴊɪɴᴜ-ɪɪ 〕──`,
                quoted: message
});
}
        await setAntiBadword(chatId, 'on', 'delete');
        return sock.sendMessage(chatId, {
            text: `╭──〔 ✅ ᴀᴄᴛɪᴠᴀᴛᴇᴅ 〕──\n│\n├─ ᴀɴᴛɪʙᴀᴅᴡᴏʀᴅ ɪꜱ ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.\n├─ ᴜꜱᴇ *.antibadword set <action>* ᴛᴏ ᴄᴜꜱᴛᴏᴍɪᴢᴇ.\n╰──〔 🧩 ᴊɪɴᴜ-ɪɪ 〕──`,
            quoted: message
});
}

    if (match === 'off') {
        const config = await getAntiBadword(chatId, 'on');
        if (!config?.enabled) {
            return sock.sendMessage(chatId, {
                text: `╭──〔 ⚠️ ɴᴏᴛɪᴄᴇ 〕──\n│\n├─ ᴀɴᴛɪʙᴀᴅᴡᴏʀᴅ ɪꜱ ᴀʟʀᴇᴀᴅʏ ᴅɪꜱᴀʙʟᴇᴅ.\n╰──〔 🧩 ᴊɪɴᴜ-ɪɪ 〕──`,
                quoted: message
});
}
        await removeAntiBadword(chatId);
        return sock.sendMessage(chatId, {
            text: `╭──〔 ❌ ᴅɪꜱᴀʙʟᴇᴅ 〕──\n│\n├─ ᴀɴᴛɪʙᴀᴅᴡᴏʀᴅ ʜᴀꜱ ʙᴇᴇɴ ᴛᴜʀɴᴇᴅ ᴏꜰꜰ ꜰᴏʀ ᴛʜɪꜱ ɢʀᴏᴜᴘ.\n╰──〔 🧩 ᴊɪɴᴜ-ɪɪ 〕──`,
            quoted: message
});
}

    if (match.startsWith('set')) {
        const action = match.split(' ')[1];
        if (!action ||!['delete', 'kick', 'warn'].includes(action)) {
            return sock.sendMessage(chatId, {
                text: `╭──〔 ⚠️ ɪɴᴠᴀʟɪᴅ ᴀᴄᴛɪᴏɴ 〕──\n│\n├─ ᴄʜᴏᴏꜱᴇ: delete / kick / warn\n╰──〔 🧩 ᴊɪɴᴜ-ɪɪ 〕──`,
                quoted: message
});
}
        await setAntiBadword(chatId, 'on', action);
        return sock.sendMessage(chatId, {
            text: `╭──〔 ✅ ᴀᴄᴛɪᴏɴ ꜱᴇᴛ 〕──\n│\n├─ ᴀɴᴛɪʙᴀᴅᴡᴏʀᴅ ᴀᴄᴛɪᴏɴ: *${action}*\n╰──〔 🧩 ᴊɪɴᴜ-ɪɪ 〕──`,
            quoted: message
});
}

    return sock.sendMessage(chatId, {
        text: `╭──〔 ❌ ᴜɴᴋɴᴏᴡɴ ᴄᴏᴍᴍᴀɴᴅ 〕──\n│\n├─ ᴜꜱᴇ *.antibadword* ᴛᴏ ꜱᴇᴇ ᴏᴘᴛɪᴏɴꜱ.\n╰──〔 🧩 ᴊɪɴᴜ-ɪɪ 〕──`,
        quoted: message
});
}

// 🧩 Handle bad word detection
async function handleBadwordDetection(sock, chatId, message, userMessage, senderId) {
    const config = loadAntibadwordConfig(chatId);
    if (!config.enabled ||!chatId.endsWith('@g.us') || message.key.fromMe) return;

    const antiBadwordConfig = await getAntiBadword(chatId, 'on');
    if (!antiBadwordConfig?.enabled) return;

    const cleanMessage = userMessage.toLowerCase()
.replace(/[^\w\s]/g, ' ')
.replace(/\s+/g, ' ')
.trim();

    const badWords = [ /* your full bad word list here */ ];
const messageWords = cleanMessage.split(' ');
    let containsBadWord = false;

    for (const word of messageWords) {
        if (word.length < 2) continue;
        if (badWords.includes(word)) {
            containsBadWord = true;
            break;
}
        for (const badWord of badWords) {
            if (badWord.includes(' ') && cleanMessage.includes(badWord)) {
                containsBadWord = true;
                break;
}
}
        if (containsBadWord) break;
}

    if (!containsBadWord) return;

    const groupMetadata = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const bot = groupMetadata.participants.find(p => p.id === botId);
    if (!bot?.admin) return;
    
    const participant = groupMetadata.participants.find(p => p.id === senderId);
    if (participant?.admin) return;

    // 🚫 Delete the offending message
    try {
        await sock.sendMessage(chatId, {
            delete: message.key
});
} catch (err) {
        console.error('Error deleting message:', err);
        return;
}

    // 🧩 Take action based on config
    switch (antiBadwordConfig.action) {
        case 'delete':
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ᴡᴀʀɴɪɴɢ 〕──
│
├─ @${senderId.split('@')[0]} ʙᴀᴅ ᴡᴏʀᴅꜱ ᴀʀᴇ ɴᴏᴛ ᴀʟʟᴏᴡᴇᴅ ʜᴇʀᴇ.
│   ᴍᴇꜱꜱᴀɢᴇ ʜᴀꜱ ʙᴇᴇɴ ʀᴇᴍᴏᴠᴇᴅ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴍᴏᴅᴇʀᴀᴛɪᴏɴ 〕──`,
                mentions: [senderId]
});
            break;

        case 'kick':
            try {
                await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
                await sock.sendMessage(chatId, {
                    text:
`╭──〔 🚫 ᴜꜱᴇʀ ʀᴇᴍᴏᴠᴇᴅ 〕──
│
├─ @${senderId.split('@')[0]} ʜᴀꜱ ʙᴇᴇɴ ᴋɪᴄᴋᴇᴅ ꜰᴏʀ ᴜꜱɪɴɢ ʙᴀᴅ ᴡᴏʀᴅꜱ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴍᴏᴅᴇʀᴀᴛɪᴏɴ 〕──`,
                    mentions: [senderId]
});
} catch (error) {
                console.error('Error kicking user:', error);
}
            break;

        case 'warn':
            const warningCount = await incrementWarningCount(chatId, senderId);
            if (warningCount>= 3) {
                try {
                    await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
                    await resetWarningCount(chatId, senderId);
                    await sock.sendMessage(chatId, {
                        text:
`╭──〔 🚫 ᴜꜱᴇʀ ʀᴇᴍᴏᴠᴇᴅ 〕──
│
├─ @${senderId.split('@')[0]} ʀᴇᴄᴇɪᴠᴇᴅ 3 ᴡᴀʀɴɪɴɢꜱ.
├─ ᴜꜱᴇʀ ʜᴀꜱ ʙᴇᴇɴ ʀᴇᴍᴏᴠᴇᴅ ꜰʀᴏᴍ ᴛʜᴇ ɢʀᴏᴜᴘ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴍᴏᴅᴇʀᴀᴛɪᴏɴ 〕──`,
                        mentions: [senderId]
});
} catch (error) {
                    console.error('Error kicking user after warnings:', error);
}
} else {
                await sock.sendMessage(chatId, {
                    text:
`╭──〔 ⚠️ ᴡᴀʀɴɪɴɢ ɪssᴜᴇᴅ 〕──
│
├─ @${senderId.split('@')[0]} ᴡᴀʀɴɪɴɢ ${warningCount}/3 ꜰᴏʀ ᴜꜱɪɴɢ ʙᴀᴅ ᴡᴏʀᴅꜱ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴍᴏᴅᴇʀᴀᴛɪᴏɴ 〕──`,
                    mentions: [senderId]
});
}
            break;
}
}

module.exports = {
    handleAntiBadwordCommand,
    handleBadwordDetection
};
