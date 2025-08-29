
const fetch = require('node-fetch');

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

async function handleTranslateCommand(sock, chatId, message, match) {
    try {
        await sock.presenceSubscribe(chatId);
        await sock.sendPresenceUpdate('composing', chatId);

        let textToTranslate = '';
        let lang = '';

        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quotedMessage) {
            textToTranslate =
                quotedMessage.conversation ||
                quotedMessage.extendedTextMessage?.text ||
                quotedMessage.imageMessage?.caption ||
                quotedMessage.videoMessage?.caption || '';

            lang = match.trim();
} else {
            const args = match.trim().split(' ');
            if (args.length < 2) {
                await sock.sendMessage(chatId, {
                    text:
`╭──〔 🌐 ᴛʀᴀɴsʟᴀᴛᴏʀ ᴜsᴀɢᴇ 〕──
│
├─ 1. *.translate <text> <lang>*
├─ 2. *Reply with.translate <lang>*
│
├─ ᴇxᴀᴍᴘʟᴇs:
│.translate hello fr
│.trt bonjour en
│
├─ ʟᴀɴɢᴜᴀɢᴇ ᴄᴏᴅᴇs:
│   fr - French | es - Spanish | de - German
│   it - Italian | pt - Portuguese | ru - Russian
│   ja - Japanese | ko - Korean | zh - Chinese
│   ar - Arabic | hi - Hindi
│
╰──〔 🌐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
                    quoted: message,
...channelInfo
});
                return;
}

            lang = args.pop();
            textToTranslate = args.join(' ');
}

        if (!textToTranslate) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɴᴏ ᴛᴇxᴛ ꜰᴏᴜɴᴅ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴛᴇxᴛ ᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇssᴀɢᴇ.
│
╰──〔 🌐 ᴊɪɴᴜ-ɪɪ ᴛʀᴀɴsʟᴀᴛᴏʀ 〕──`,
                quoted: message,
...channelInfo
});
            return;
}

        let translatedText = null;

        try {
            const res1 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(textToTranslate)}`);
            if (res1.ok) {
                const data = await res1.json();
                translatedText = data?.[0]?.[0]?.[0];
}
} catch {}

        if (!translatedText) {
            try {
                const res2 = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=auto|${lang}`);
                if (res2.ok) {
                    const data = await res2.json();
                    translatedText = data?.responseData?.translatedText;
}
} catch {}
}

        if (!translatedText) {
            try {
                const res3 = await fetch(`https://api.dreaded.site/api/translate?text=${encodeURIComponent(textToTranslate)}&lang=${lang}`);
                if (res3.ok) {
                    const data = await res3.json();
                    translatedText = data?.translated;
}
} catch {}
}

        if (!translatedText) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴛʀᴀɴsʟᴀᴛɪᴏɴ ꜰᴀɪʟᴇᴅ 〕──
│
├─ ᴀʟʟ ᴀᴘɪs ꜰᴀɪʟᴇᴅ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🌐 ᴊɪɴᴜ-ɪɪ ᴛʀᴀɴsʟᴀᴛᴏʀ 〕──`,
                quoted: message,
...channelInfo
});
            return;
}

        await sock.sendMessage(chatId, {
 text:
`╭──〔 🌐 ᴛʀᴀɴsʟᴀᴛᴇᴅ ᴛᴇxᴛ 〕──
│
├─ ${translatedText}
│
╰──〔 🌐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            quoted: message,
...channelInfo
});

} catch (error) {
        console.error('❌ Error in translate command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴛʀᴀɴsʟᴀᴛᴇ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 🌐 ᴊɪɴᴜ-ɪɪ ᴛʀᴀɴsʟᴀᴛᴏʀ 〕──`,
            quoted: message,
...channelInfo
});
}
}

module.exports = {
    handleTranslateCommand
};
