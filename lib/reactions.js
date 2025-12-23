
const fs = require('fs');
const path = require('path');

// 🧩 ᴄᴏᴍᴍᴀɴᴅ ʀᴇᴀᴄᴛɪᴏɴ ᴇᴍᴏᴊɪꜱ
const commandEmojis = ['👑'];

// 📁 ꜱᴛᴏʀᴀɢᴇ ꘫᴀᴛʜ ꜰᴏʀ ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛɪᴏɴ ꜱᴛᴀᴛᴇ
const USER_GROUP_DATA = path.join(__dirname, '../data/userGroupData.json');

// 🔍 ʟᴏᴀᴅ ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛɪᴏɴ ꜱᴛᴀᴛᴇ ꜰʀᴏᴍ ꜰɪʟᴇ
function loadAutoReactionState() {
    try {
        if (fs.existsSync(USER_GROUP_DATA)) {
            const data = JSON.parse(fs.readFileSync(USER_GROUP_DATA));
            return data.autoReaction || false;
}
} catch (error) {
        console.error('❌ ᴇʀʀᴏʀ ʟᴏᴀᴅɪɴɢ ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛɪᴏɴ ꜱᴛᴀᴛᴇ:', error);
}
    return false;
}

// 💾 ꜱᴀᴠᴇ ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛɪᴏɴ ꜱᴛᴀᴛᴇ ᴛᴏ ꜰɪʟᴇ
function saveAutoReactionState(state) {
    try {
        const data = fs.existsSync(USER_GROUP_DATA)
? JSON.parse(fs.readFileSync(USER_GROUP_DATA))
: { groups: [], chatbot: {}};

        data.autoReaction = state;
        fs.writeFileSync(USER_GROUP_DATA, JSON.stringify(data, null, 2));
} catch (error) {
        console.error('❌ ᴇʀʀᴏʀ ꜱᴀᴠɪɴɢ ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛɪᴏɴ ꜱᴛᴀᴛᴇ:', error);
}
}

// 🔄 ɢʟᴏʙᴀʟ ꜱᴛᴀᴛᴇ ꜱᴛᴏʀᴀɢᴇ
let isAutoReactionEnabled = loadAutoReactionState();

// 🎯 ɢᴇᴛ ᴇᴍᴏᴊɪ ꜰᴏʀ ʀᴇᴀᴄᴛɪᴏɴ
function getRandomEmoji() {
    return commandEmojis[0];
}

// 💬 ᴀᴅᴅ ʀᴇᴀᴄᴛɪᴏɴ ᴛᴏ ᴄᴏᴍᴍᴀɴᴅ ᴍᴇssᴀɢᴇ
async function addCommandReaction(sock, message) {
    try {
        if (!isAutoReactionEnabled ||!message?.key?.id) return;

        const emoji = getRandomEmoji();
        await sock.sendMessage(message.key.remoteJid, {
            react: {
                text: emoji,
                key: message.key
}
});
} catch (error) {
        console.error('❌ ᴇʀʀᴏʀ ᴀᴅᴅɪɴɢ ʀᴇᴀᴄᴛɪᴏɴ:', error);
}
}

// ⚙️ ʜᴀɴᴅʟᴇ.areact ᴄᴏᴍᴍᴀɴᴅ
async function handleAreactCommand(sock, chatId, message, isOwner) {
    try {
        if (!isOwner) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ 〕──
│
├─ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ɪꜱ ʀᴇsᴛʀɪᴄᴛᴇᴅ ᴛᴏ ᴛʜᴇ ᴏᴡɴᴇʀ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴄᴏɴᴛʀᴏʟ ᴄᴇɴᴛᴇʀ 〕──`,
                quoted: message
});
            return;
}

        const args = message.message?.conversation?.split(' ') || [];
        const action = args[1]?.toLowerCase();

        if (action === 'on') {
            isAutoReactionEnabled = true;
            saveAutoReactionState(true);
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ✅ ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛɪᴏɴ ᴇɴᴀʙʟᴇᴅ 〕──
│
├─ ʀᴇᴀᴄᴛɪᴏɴꜱ ᴡɪʟʟ ʙᴇ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ ᴀᴘᴘʟɪᴇᴅ ᴛᴏ ᴄᴏᴍᴍᴀɴᴅꜱ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ʀᴇᴀᴄᴛɪᴏɴ ᴇɴɢɪɴᴇ 〕──`,
                quoted: message
});
} else if (action === 'off') {
            isAutoReactionEnabled = false;
            saveAutoReactionState(false);
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛɪᴏɴ ᴅɪsᴀʙʟᴇᴅ 〕──
│
├─ ʀᴇᴀᴄᴛɪᴏɴꜱ ᴡɪʟʟ ɴᴏ ʟᴏɴɢᴇʀ ʙᴇ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ ᴀᴘᴘʟɪᴇᴅ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ʀᴇᴀᴄᴛɪᴏɴ ᴇɴɢɪɴᴇ 〕──`,
                quoted: message
});
} else {
            const currentState = isAutoReactionEnabled? 'ᴇɴᴀʙʟᴇᴅ': 'ᴅɪsᴀʙʟᴇᴅ';
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🔧 ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛɪᴏɴ ꜱᴛᴀᴛᴜꜱ 〕──
│
├─ ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴇ: ${currentState}
│
├─ ᴜꜱᴇ:
│.areact on   → ᴇɴᴀʙʟᴇ
│.areact off  → ᴅɪsᴀʙʟᴇ
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴄᴏɴᴛʀᴏʟ ᴄᴇɴᴛᴇʀ 〕──`,
                quoted: message
});
}
} catch (error) {
        console.error('❌ ᴇʀʀᴏʀ ʜᴀɴᴅʟɪɴɢ.areact ᴄᴏᴍᴍᴀɴᴅ:',error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ᴇʀʀᴏʀ ᴇɴᴄᴏᴜɴᴛᴇʀᴇᴅ 〕──
│
├─ ᴜɴᴀʙʟᴇ ᴛᴏ ᴄᴏɴᴛʀᴏʟ ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛɪᴏɴꜱ ᴀᴛ ᴛʜɪꜱ ᴛɪᴍᴇ.
│   ᴘʟᴇᴀꜱᴇ ᴄʜᴇᴄᴋ ʏᴏᴜʀ ꜱʏꜱᴛᴇᴍ ʟᴏɢꜱ ꜰᴏʀ ᴅᴇᴛᴀɪʟꜱ.
│
╰──〔 🧩 ᴊɪɴᴜ-ɪɪ ᴇʀʀᴏʀ ᴄᴇɴᴛᴇʀ 〕──`,
            quoted: message
});
}
}

module.exports = {
    addCommandReaction,
    handleAreactCommand
};
