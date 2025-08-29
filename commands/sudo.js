
const settings = require('../settings');
const { addSudo, removeSudo, getSudoList} = require('../lib/index');

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

function extractMentionedJid(message) {
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentioned.length> 0) return mentioned[0];
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const match = text.match(/\b(\d{7,15})\b/);
    if (match) return match[1] + '@s.whatsapp.net';
    return null;
}

async function sudoCommand(sock, chatId, message) {
    const senderJid = message.key.participant || message.key.remoteJid;
    const ownerJid = settings.ownerNumber + '@s.whatsapp.net';
    const isOwner = message.key.fromMe || senderJid === ownerJid;

    const rawText = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = rawText.trim().split(' ').slice(1);
    const sub = (args[0] || '').toLowerCase();

    if (!sub ||!['add', 'del', 'remove', 'list'].includes(sub)) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚙️ sᴜᴅᴏ ᴄᴏɴᴛʀᴏʟ 〕──
│
├─ *.sudo add <@user|number>*
├─ *.sudo del <@user|number>*
├─ *.sudo list*
│
╰──〔 🔐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    if (sub === 'list') {
        const list = await getSudoList();
        if (list.length === 0) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 📋 sᴜᴅᴏ ʟɪsᴛ 〕──
│
├─ ɴᴏ sᴜᴅᴏ ᴜsᴇʀs sᴇᴛ.
│
╰──〔 🔐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const text = list.map((j, i) => `│ ${i + 1}. ${j}`).join('\n');
        await sock.sendMessage(chatId, {
            text:
`╭──〔 📋 sᴜᴅᴏ ᴜsᴇʀs 〕──
${text}
╰──〔 🔐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    if (!isOwner) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ 〕──
│
├─ ᴏɴʟʏ *ᴏᴡɴᴇʀ* ᴄᴀɴ ᴀᴅᴅ/ʀᴇᴍᴏᴠᴇ sᴜᴅᴏ ᴜsᴇʀs.
│   ᴜsᴇ *.sudo list* ᴛᴏ ᴠɪᴇᴡ ᴄᴜʀʀᴇɴᴛ sᴛᴀᴛᴜs.
│
╰──〔 🔐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    const targetJid = extractMentionedJid(message);
    if (!targetJid) {
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴍɪssɪɴɢ ᴛᴀʀɢᴇᴛ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ᴍᴇɴᴛɪᴏɴ* ᴀ ᴜsᴇʀ ᴏʀ ᴘʀᴏᴠɪᴅᴇ ᴀ ɴᴜᴍʙᴇʀ.
│
╰──〔 🔐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    if (sub === 'add') {
        const ok = await addSudo(targetJid);
        await sock.sendMessage(chatId, {
            text: ok
? `✅ *Added sudo:* @${targetJid.split('@')[0]}`
: `❌ Failed to add sudo: @${targetJid.split('@')[0]}`,
            mentions: [targetJid],
...channelInfo
});
        return;
}

    if (sub === 'del' || sub === 'remove') {
        if (targetJid === ownerJid) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ᴘʀᴏᴛᴇᴄᴛᴇᴅ ᴜsᴇʀ 〕──
│
├─ ᴛʜᴇ *ᴏᴡɴᴇʀ* ᴄᴀɴɴᴏᴛ ʙᴇ ʀᴇᴍᴏᴠᴇᴅ ꜰʀᴏᴍ sᴜᴅᴏ.
│
╰──〔 🔐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const ok = await removeSudo(targetJid);
        await sock.sendMessage(chatId, {
            text: ok
? `╭──〔 ✅ sᴜᴅᴏ ʀᴇᴍᴏᴠᴇᴅ 〕──\n│\n├─ @${targetJid.split('@')[0]} ʜᴀs ʙᴇᴇɴ ʀᴇᴍᴏᴠᴇᴅ ꜰʀᴏᴍ sᴜᴅᴏ.\n╰──〔 🔐 ᴊɪɴᴜ-ɪɪ 〕──`
: `╭──〔 ❌ ʀᴇᴍᴏᴠᴇ ꜰᴀɪʟᴇᴅ 〕──\n│\n├─ ᴄᴏᴜʟᴅ ɴᴏᴛ ʀᴇᴍᴏᴠᴇ @${targetJid.split('@')[0]} ꜰʀᴏᴍ sᴜᴅᴏ.\n╰──〔 🔐 ᴊɪɴᴜ-ɪɪ 〕──`,
            mentions: [targetJid],
...channelInfo
});
        return;
}
}

module.exports = sudoCommand;
