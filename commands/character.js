const axios = require('axios');
const { channelInfo} = require('../lib/messageConfig');

async function characterCommand(sock, chatId, message) {
    let userToAnalyze;

    // 🧠 ᴅᴇᴛᴇᴄᴛ ᴛᴀʀɢᴇᴛ ᴜsᴇʀ
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length> 0) {
        userToAnalyze = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
} else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToAnalyze = message.message.extendedTextMessage.contextInfo.participant;
}

    // ⚠️ ɴᴏ ᴛᴀʀɢᴇᴛ ꜰᴏᴜɴᴅ
    if (!userToAnalyze) {
        const menu =
`╭──〔 ⚠️ ᴍɪssɪɴɢ ᴛᴀʀɢᴇᴛ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ᴍᴇɴᴛɪᴏɴ* sᴏᴍᴇᴏɴᴇ ᴏʀ *ʀᴇᴘʟʏ* ᴛᴏ ᴛʜᴇɪʀ ᴍᴇssᴀɢᴇ.
├─ ɪ ɴᴇᴇᴅ ᴀ ᴜsᴇʀ ᴛᴏ ᴀɴᴀʟʏᴢᴇ! 🔍
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;
        await sock.sendMessage(chatId, { text: menu,...channelInfo});
        return;
}

    try {
        // 🖼️ ɢᴇᴛ ᴘʀᴏғɪʟᴇ ᴘɪᴄᴛᴜʀᴇ
        let profilePic;
        try {
            profilePic = await sock.profilePictureUrl(userToAnalyze, 'image');
} catch {
            profilePic = 'https://i.imgur.com/2wzGhpF.jpeg';
}

        const traits = [
            "Intelligent", "Creative", "Determined", "Ambitious", "Caring",
            "Charismatic", "Confident", "Empathetic", "Energetic", "Friendly",
            "Generous", "Honest", "Humorous", "Imaginative", "Independent",
            "Intuitive", "Kind", "Logical", "Loyal", "Optimistic",
            "Passionate", "Patient", "Persistent", "Reliable", "Resourceful",
            "Sincere", "Thoughtful", "Understanding", "Versatile", "Wise"
        ];

        // 🎲 ʀᴀɴᴅᴏᴍ ᴛʀᴀɪᴛs
        const numTraits = Math.floor(Math.random() * 3) + 3;
        const selectedTraits = [];
        while (selectedTraits.length < numTraits) {
            const trait = traits[Math.floor(Math.random() * traits.length)];
            if (!selectedTraits.includes(trait)) selectedTraits.push(trait);
}

        const traitPercentages = selectedTraits.map(trait => {
            const percentage = Math.floor(Math.random() * 41) + 60;
            return `├─ ${trait}: ${percentage}%`;
});

        const overall = Math.floor(Math.random() * 21) + 80;

        // 📝 ᴄʀᴇᴀᴛᴇ ᴀɴᴀʟʏsɪs
        const analysis =
`╭──〔 🔮 ᴄʜᴀʀᴀᴄᴛᴇʀ ᴀɴᴀʟʏsɪs 🔮 〕──
│
├─ 👤 ᴜsᴇʀ: @${userToAnalyze.split('@')[0]}
│
├─ ✨ ᴋᴇʏ ᴛʀᴀɪᴛs:
${traitPercentages.join('\n')}
│
├─ 🎯 ᴏᴠᴇʀᴀʟʟ ʀᴀᴛɪɴɢ: ${overall}%
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──

*Note: This is a fun analysis and should not be taken seriously!*`;

        await sock.sendMessage(chatId, {
            image: { url: profilePic},
            caption: analysis,
            mentions: [userToAnalyze],
...channelInfo
});

} catch (error) {
        console.error('❌ Error in character command:', error);
        const menu =
`╭──〔 ⚠️ ᴇʀʀᴏʀ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴀɴᴀʟʏᴢᴇ ᴄʜᴀʀᴀᴄᴛᴇʀ.
├─ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ! 😔
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`;
        await sock.sendMessage(chatId, { text: menu,...channelInfo});
}
}

module.exports = characterCommand;
