
const insults = [
    "You're like a cloud. When you disappear, it's a beautiful day!",
    "You bring everyone so much joy when you leave the room!",
    "I'd agree with you, but then we'd both be wrong.",
    "You're not stupid; you just have bad luck thinking.",
    "Your secrets are always safe with me. I never even listen to them.",
    "You're proof that even evolution takes a break sometimes.",
    "You have something on your chin... no, the third one down.",
    "You're like a software update. Whenever I see you, I think, 'Do I really need this right now?'",
    "You bring everyone happiness... you know, when you leave.",
    "You're like a penny—two-faced and not worth much.",
    "You have something on your mind... oh wait, never mind.",
    "You're the reason they put directions on shampoo bottles.",
    "You're like a cloud. Always floating around with no real purpose.",
    "Your jokes are like expired milk—sour and hard to digest.",
    "You're like a candle in the wind... useless when things get tough.",
    "You have something unique—your ability to annoy everyone equally.",
    "You're like a Wi-Fi signal—always weak when needed most.",
    "You're proof that not everyone needs a filter to be unappealing.",
    "Your energy is like a black hole—it just sucks the life out of the room.",
    "You have the perfect face for radio.",
    "You're like a traffic jam—nobody wants you, but here you are.",
    "You're like a broken pencil—pointless.",
    "Your ideas are so original, I'm sure I've heard them all before.",
    "You're living proof that even mistakes can be productive.",
    "You're not lazy; you're just highly motivated to do nothing.",
    "Your brain's running Windows 95—slow and outdated.",
    "You're like a speed bump—nobody likes you, but everyone has to deal with you.",
    "You're like a cloud of mosquitoes—just irritating.",
    "You bring people together... to talk about how annoying you are."
];

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

async function insultCommand(sock, chatId, message) {
    try {
        if (!message ||!chatId) {
            console.log('Invalid message or chatId:', { message, chatId});
            return;
}

        let userToInsult;

        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length> 0) {
            userToInsult = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
} else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToInsult = message.message.extendedTextMessage.contextInfo.participant;
}

        if (!userToInsult) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⚠️ ᴍɪssɪɴɢ ᴛᴀʀɢᴇᴛ 〕──
│
├─ ᴘʟᴇᴀsᴇ *ᴍᴇɴᴛɪᴏɴ* ᴏʀ *ʀᴇᴘʟʏ* ᴛᴏ ᴀ ᴜsᴇʀ ᴛᴏ ɪɴsᴜʟᴛ.
│
╰──〔 💢 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            return;
}

        const insult = insults[Math.floor(Math.random() * insults.length)];

        await new Promise(resolve => setTimeout(resolve, 1000));

        await sock.sendMessage(chatId, {
            text:
`╭──〔 💬 ɪɴsᴜʟᴛ ᴅᴇʟɪᴠᴇʀᴇᴅ 〕──
│
├─ Hey @${userToInsult.split('@')[0]},
│   ${insult}
│
╰──〔 💢 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            mentions: [userToInsult],
...channelInfo
});

} catch (error) {
        console.error('❌ Error in insult command:', error);
[8/22, 16:24] Microsoft Copilot: await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ sᴇɴᴅ ɪɴsᴜʟᴛ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 💢 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}
}

module.exports = { insultCommand};
