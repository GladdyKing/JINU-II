
const {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} = require('../lib/index');
const { delay} = require('@whiskeysockets/baileys');

// ⚔️ ᴊɪɴᴜ-ɪɪ ᴡᴇʟᴄᴏᴍᴇ ᴍᴇssᴀɢᴇ ʜᴀɴᴅʟᴇʀ
async function handleWelcome(sock, chatId, message, match) {
    if (!match) {
        return sock.sendMessage(chatId, {
            text:
`╭──〔 📥 ᴡᴇʟᴄᴏᴍᴇ ꜱᴇᴛᴜᴘ 〕──
│
├─ ✅ *.welcome on* — ᴇɴᴀʙʟᴇ ᴡᴇʟᴄᴏᴍᴇ ᴍᴇssᴀɢᴇꜱ
├─ 🛠️ *.welcome set [your message]* — ᴄᴜsᴛᴏᴍɪᴢᴇ ᴛʜᴇ ᴍᴇssᴀɢᴇ
├─ 🚫 *.welcome off* — ᴅɪsᴀʙʟᴇ ᴡᴇʟᴄᴏᴍᴇꜱ
│
├─ *ᴀᴠᴀɪʟᴀʙʟᴇ ᴠᴀʀɪᴀʙʟᴇs:*
│   • {user} — ᴍᴇɴᴛɪᴏɴs ᴛʜᴇ ɴᴇᴡ ᴍᴇᴍʙᴇʀ
│   • {group} — ɢʀᴏᴜᴘ ɴᴀᴍᴇ
│   • {description} — ɢʀᴏᴜᴘ ᴅᴇsᴄʀɪᴘᴛɪᴏɴ
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴄᴏɴᴛʀᴏʟ ᴄᴇɴᴛᴇʀ 〕──`,
            quoted: message
});
}

    const [command,...args] = match.split(' ');
    const lowerCommand = command.toLowerCase();
    const customMessage = args.join(' ');

    if (lowerCommand === 'on') {
        if (await isWelcomeOn(chatId)) {
            return sock.sendMessage(chatId, {
                text: `⚠️ ᴡᴇʟᴄᴏᴍᴇ ᴍᴇssᴀɢᴇs ᴀʀᴇ *ᴀʟʀᴇᴀᴅʏ ᴇɴᴀʙʟᴇᴅ*.`,
                quoted: message
});
}
        await addWelcome(chatId, true, null);
        return sock.sendMessage(chatId, {
            text: `✅ ᴡᴇʟᴄᴏᴍᴇ ᴍᴇssᴀɢᴇs *ᴇɴᴀʙʟᴇᴅ*. ᴜsᴇ *.welcome set [your message]* ᴛᴏ ᴄᴜsᴛᴏᴍɪᴢᴇ.`,
            quoted: message
});
}

    if (lowerCommand === 'off') {
        if (!(await isWelcomeOn(chatId))) {
            return sock.sendMessage(chatId, {
                text: `⚠️ ᴡᴇʟᴄᴏᴍᴇ ᴍᴇssᴀɢᴇs ᴀʀᴇ *ᴀʟʀᴇᴀᴅʏ ᴅɪsᴀʙʟᴇᴅ*.`,
                quoted: message
});
}
        await delWelcome(chatId);
        return sock.sendMessage(chatId, {
            text: `✅ ᴡᴇʟᴄᴏᴍᴇ ᴍᴇssᴀɢᴇs *ᴅɪsᴀʙʟᴇᴅ* ꜰᴏʀ ᴛʜɪs ɢʀᴏᴜᴘ.`,
            quoted: message
});
}

    if (lowerCommand === 'set') {
        if (!customMessage) {
            return sock.sendMessage(chatId, {
                text: `⚠️ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴄᴜsᴛᴏᴍ ᴍᴇssᴀɢᴇ. ᴇxᴀᴍᴘʟᴇ:\n*.welcome set Welcome to the realm!*`,
                quoted: message
});
}
        await addWelcome(chatId, true, customMessage);
        return sock.sendMessage(chatId, {
            text: `✅ ᴄᴜsᴛᴏᴍ ᴡᴇʟᴄᴏᴍᴇ ᴍᴇssᴀɢᴇ *sᴇᴛ sᴜᴄᴄᴇssꜰᴜʟʟʏ*.`,
            quoted: message
});
}

    return sock.sendMessage(chatId, {
        text:
`❌ ɪɴᴠᴀʟɪᴅ ᴄᴏᴍᴍᴀɴᴅ.
ᴜsᴇ:
• *.welcome on* — ᴇɴᴀʙʟᴇ
• *.welcome set [message]* — ᴄᴜsᴛᴏᴍɪᴢᴇ
• *.welcome off* — ᴅɪsᴀʙʟᴇ`,
        quoted: message
});
}

// ⚰️ ᴊɪɴᴜ-ɪɪ ɢᴏᴏᴅʙʏᴇ ᴍᴇssᴀɢᴇ ʜᴀɴᴅʟᴇʀ
async function handleGoodbye(sock, chatId, message, match) {
    const lower = match?.toLowerCase();

    if (!match) {
        return sock.sendMessage(chatId, {
            text:
`╭──〔 📤 ɢᴏᴏᴅʙʏᴇ ꜱᴇᴛᴜᴘ 〕──
│
├─ ✅ *.goodbye on* — ᴇɴᴀʙʟᴇ ɢᴏᴏᴅʙʏᴇ ᴍᴇssᴀɢᴇꜱ
├─ 🛠️ *.goodbye [your message]* — ᴄᴜsᴛᴏᴍɪᴢᴇ ᴛʜᴇ ᴍᴇssᴀɢᴇ
├─ 🚫 *.goodbye off* — ᴅɪsᴀʙʟᴇ ɢᴏᴏᴅʙʏᴇꜱ
│
├─ *ᴀᴠᴀɪʟᴀʙʟᴇ ᴠᴀʀɪᴀʙʟᴇs:*
│   • {user} — ᴍᴇɴᴛɪᴏɴs ᴛʜᴇ ʟᴇᴀᴠɪɴɢ ᴍᴇᴍʙᴇʀ
│   • {group} — ɢʀᴏᴜᴘ ɴᴀᴍᴇ
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴄᴏɴᴛʀᴏʟ ᴄᴇɴᴛᴇʀ 〕──`,
            quoted: message
});
}

    if (lower === 'on') {
        if (await isGoodByeOn(chatId)) {
            return sock.sendMessage(chatId, {
                text: `⚠️ ɢᴏᴏᴅʙʏᴇ ᴍᴇssᴀɢᴇs ᴀʀᴇ *ᴀʟʀᴇᴀᴅʏ ᴇɴᴀʙʟᴇᴅ*.`,
                quoted: message
});

}
        await addGoodbye(chatId, true, null);
        return sock.sendMessage(chatId, {
            text: `✅ ɢᴏᴏᴅʙʏᴇ ᴍᴇssᴀɢᴇs *ᴇɴᴀʙʟᴇᴅ*. ᴜsᴇ *.goodbye [your message]* ᴛᴏ ᴄᴜsᴛᴏᴍɪᴢᴇ.`,
            quoted: message
});
}

    if (lower === 'off') {
        if (!(await isGoodByeOn(chatId))) {
            return sock.sendMessage(chatId, {
                text: `⚠️ ɢᴏᴏᴅʙʏᴇ ᴍᴇssᴀɢᴇs ᴀʀᴇ *ᴀʟʀᴇᴀᴅʏ ᴅɪsᴀʙʟᴇᴅ*.`,
                quoted: message
});
}
        await delGoodBye(chatId);
        return sock.sendMessage(chatId, {
            text: `✅ ɢᴏᴏᴅʙʏᴇ ᴍᴇssᴀɢᴇs *ᴅɪsᴀʙʟᴇᴅ* ꜰᴏʀ ᴛʜɪs ɢʀᴏᴜᴘ.`,
            quoted: message
});
}

    await delay(2000);
    await addGoodbye(chatId, true, match);
    return sock.sendMessage(chatId, {
        text: `✅ ᴄᴜsᴛᴏᴍ ɢᴏᴏᴅʙʏᴇ ᴍᴇssᴀɢᴇ *sᴇᴛ sᴜᴄᴄᴇssꜰᴜʟʟʏ*.`,
        quoted: message
});
}

// 🧩 ᴇxᴘᴏʀᴛ ᴍᴏᴅᴜʟᴇ
module.exports = {
    handleWelcome,
    handleGoodbye
};
