
const { bots} = require('../lib/antilink');
const { setAntilink, getAntilink, removeAntilink} = require('../lib/index');
const isAdmin = require('../lib/isAdmin');

// 📡 ᴀɴᴛɪʟɪɴᴋ ᴄᴏᴍᴍᴀɴᴅ
async function handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin) {
    try {
        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ 〕──
│
├─ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ɪs ғᴏʀ *ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏɴʟʏ!*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
            return;
}

        const prefix = '.';
        const args = userMessage.slice(9).toLowerCase().trim().split(' ');
        const action = args[0];

        if (!action) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🔐 ᴀɴᴛɪʟɪɴᴋ sᴇᴛᴜᴘ 〕──
│
├─ ${prefix}antilink on
├─ ${prefix}antilink set delete | kick | warn
├─ ${prefix}antilink off
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
            return;
}

        switch (action) {
            case 'on':
                const existingConfig = await getAntilink(chatId, 'on');
                if (existingConfig?.enabled) {
                    await sock.sendMessage(chatId, {
                        text:
`╭──〔 ⚠️ ɴᴏᴛɪᴄᴇ 〕──
│
├─ ᴀɴᴛɪʟɪɴᴋ ɪs *ᴀʟʀᴇᴀᴅʏ ᴏɴ*.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
                    return;
}

                const result = await setAntilink(chatId, 'on', 'delete');
                await sock.sendMessage(chatId, {
                    text: result
? `╭──〔 ✅ sᴜᴄᴄᴇss 〕──\n│\n├─ ᴀɴᴛɪʟɪɴᴋ ʜᴀs ʙᴇᴇɴ *ᴛᴜʀɴᴇᴅ ᴏɴ*.\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
: `╭──〔 ❌ ғᴀɪʟᴜʀᴇ 〕──\n│\n├─ ғᴀɪʟᴇᴅ ᴛᴏ ᴇɴᴀʙʟᴇ ᴀɴᴛɪʟɪɴᴋ.\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
                break;

            case 'off':
                await removeAntilink(chatId, 'on');
                await sock.sendMessage(chatId, {
                    text:
`╭──〔 ✅ sᴜᴄᴄᴇss 〕──
│
├─ ᴀɴᴛɪʟɪɴᴋ ʜᴀs ʙᴇᴇɴ *ᴛᴜʀɴᴇᴅ ᴏғғ*.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
                break;

            case 'set':
                if (args.length < 2) {
                    await sock.sendMessage(chatId, {
                        text:
`╭──〔 ⚠️ ᴍɪssɪɴɢ ᴀʀɢᴜᴍᴇɴᴛ 〕──
│
├─ sᴘᴇᴄɪғʏ ᴀɴ ᴀᴄᴛɪᴏɴ:
├─ ${prefix}antilink set delete | kick | warn
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
                    return;
}

                const setAction = args[1];
                if (!['delete', 'kick', 'warn'].includes(setAction)) {
                    await sock.sendMessage(chatId, {
                        text:
`╭──〔 ❌ ɪɴᴠᴀʟɪᴅ ᴀᴄᴛɪᴏɴ 〕──
│
├─ ᴄʜᴏᴏsᴇ ᴏɴᴇ: delete, kick, or warn.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
                    return;
}

                const setResult = await setAntilink(chatId, 'on', setAction);
                await sock.sendMessage(chatId, {
                    text: setResult
? `╭──〔 ✅ ᴜᴘᴅᴀᴛᴇᴅ 〕──\n│\n├─ ᴀɴᴛɪʟɪɴᴋ ᴀᴄᴛɪᴏɴ sᴇᴛ ᴛᴏ: *${setAction}*\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
: `╭──〔 ❌ ғᴀɪʟᴜʀᴇ 〕──\n│\n├─ ғᴀɪʟᴇᴅ ᴛᴏ sᴇᴛ ᴀɴᴛɪʟɪɴᴋ ᴀᴄᴛɪᴏɴ.\n╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
                break;

            case 'get':
                const status = await getAntilink(chatId, 'on');
                const actionConfig = await getAntilink(chatId, 'on');
                await sock.sendMessage(chatId, {
                    text:
`╭──〔 📊 ᴀɴᴛɪʟɪɴᴋ ᴄᴏɴғɪɢ 〕──
│
├─ ꜱᴛᴀᴛᴜꜱ: ${status? '✅ ᴏɴ': '❌ ᴏғғ'}
├─ ᴀᴄᴛɪᴏɴ: ${actionConfig?.action || 'ɴᴏᴛ sᴇᴛ'}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
                break;

            default:
                await sock.sendMessage(chatId, {
                    text:
`╭──〔 ℹ️ ᴜsᴀɢᴇ 〕──
│
├─ ᴜsᴇ ${prefix}antilink ᴛᴏ ᴄᴏɴғɪɢᴜʀᴇ ᴀɴᴛɪʟɪɴᴋ.
│   ᴇxᴀᴍᴘʟᴇ: ${prefix}antilink on / off / set / get
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
}
} catch (error) {
        console.error('❌ Error in antilink command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ 〕──
│
├─ ғᴀɪʟᴇᴅ ᴛᴏ ᴘʀᴏᴄᴇss ᴀɴᴛɪʟɪɴᴋ ᴄᴏᴍᴍᴀɴᴅ.
├─ ʀᴇᴀsᴏɴ: ${error.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
}
}

// 🕵️‍♂️ ʟɪɴᴋ ᴅᴇᴛᴇᴄᴛɪᴏɴ
async function handleLinkDetection(sock, chatId, message, userMessage, senderId) {
    const antilinkSetting = getAntilinkSetting(chatId);
    if (antilinkSetting === 'off') return;

    const linkPatterns = {
        whatsappGroup: /chat\.whatsapp\.com\/[A-Za-z0-9]{20,}/,
        whatsappChannel: /wa\.me\/channel\/[A-Za-z0-9]{20,}/,
        telegram: /t\.me\/[A-Za-z0-9_]+/,
        allLinks: /https?:\/\/[^\s]+/,
};

    let shouldDelete = false;

    if (antilinkSetting === 'whatsappGroup' && linkPatterns.whatsappGroup.test(userMessage)) {
        shouldDelete = true;
} else if (antilinkSetting === 'whatsappChannel' && linkPatterns.whatsappChannel.test(userMessage)) {
        shouldDelete = true;
} else if (antilinkSetting === 'telegram' && linkPatterns.telegram.test(userMessage)) {
        shouldDelete = true;
} else if (antilinkSetting === 'allLinks' && linkPatterns.allLinks.test(userMessage)) {
        shouldDelete = true;
}

    if (shouldDelete) {
        const quotedMessageId = message.key.id;
        const quotedParticipant = message.key.participant || senderId;

        try {
            await sock.sendMessage(chatId, {
                delete: {
                    remoteJid: chatId,
                    fromMe: false,
                    id: quotedMessageId,
                    participant: quotedParticipant
}
});

            const mentionedJidList = [senderId];
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🚫 ʟɪɴᴋ ᴅᴇᴛᴇᴄᴛᴇᴅ 〕──
│
├─ @${senderId.split('@')[0]}, ᴘᴏsᴛɪɴɢ ʟɪɴᴋs ɪs ɴᴏᴛ ᴀʟʟᴏᴡᴇᴅ!
├─ ᴀᴄᴛɪᴏɴ: *${antilinkSetting.toUpperCase()}*
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
                mentions: mentionedJidList
});

} catch (error) {
            console.error('❌ Failed to delete message:', error);
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴅᴇʟᴇᴛɪɴɢ ᴍᴇssᴀɢᴇ 〕──
│
├─ ᴄᴏᴜʟᴅ ɴᴏᴛ ʀᴇᴍᴏᴠᴇ ʟɪɴᴋ ᴍᴇssᴀɢᴇ.
├─ ʀᴇᴀsᴏɴ: ${error.message}
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`
});
}

} else {
        console.log('✅ No link detected or protection not enabled for this type.');
}
}

// 🔧 Get Antilink Setting
function getAntilinkSetting(chatId) {
    const config = bots[chatId];
    return config?.enabled? config.action: 'off';
}

module.exports = {
    handleAntilinkCommand,
    handleLinkDetection
};
