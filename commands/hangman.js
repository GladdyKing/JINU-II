
const fs = require('fs');

const words = ['javascript', 'bot', 'hangman', 'whatsapp', 'nodejs'];
let hangmanGames = {};

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

// 🎮 sᴛᴀʀᴛ ɴᴇᴡ ʜᴀɴɢᴍᴀɴ ɢᴀᴍᴇ
function startHangman(sock, chatId) {
    const word = words[Math.floor(Math.random() * words.length)];
    const maskedWord = '_ '.repeat(word.length).trim();

    hangmanGames[chatId] = {
        word,
        maskedWord: maskedWord.split(' '),
        guessedLetters: [],
        wrongGuesses: 0,
        maxWrongGuesses: 6,
};

    sock.sendMessage(chatId, {
        text:
`╭──〔 🎯 ʜᴀɴɢᴍᴀɴ ɢᴀᴍᴇ sᴛᴀʀᴛᴇᴅ 〕──
│
├─ ᴛʜᴇ ᴡᴏʀᴅ ɪs: ${maskedWord}
├─ ᴛʏᴘᴇ *.guess a* ᴛᴏ ᴛʀʏ ᴀ ʟᴇᴛᴛᴇʀ
│
╰──〔 🕹️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
}

// 🔡 ɢᴜᴇss ᴀ ʟᴇᴛᴛᴇʀ
function guessLetter(sock, chatId, letter) {
    if (!hangmanGames[chatId]) {
        sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ɴᴏ ɢᴀᴍᴇ ɪɴ ᴘʀᴏɢʀᴇss 〕──
│
├─ sᴛᴀʀᴛ ᴀ ɴᴇᴡ ɢᴀᴍᴇ ᴡɪᴛʜ *.hangman*
│
╰──〔 🕹️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    const game = hangmanGames[chatId];
    const { word, guessedLetters, maskedWord, maxWrongGuesses} = game;

    if (guessedLetters.includes(letter)) {
        sock.sendMessage(chatId, {
            text:
`╭──〔 ⚠️ ᴀʟʀᴇᴀᴅʏ ɢᴜᴇssᴇᴅ 〕──
│
├─ ʏᴏᴜ ᴀʟʀᴇᴀᴅʏ ᴛʀɪᴇᴅ "${letter}". ᴛʀʏ ᴀɴᴏᴛʜᴇʀ.
│
╰──〔 🕹️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
        return;
}

    guessedLetters.push(letter);

    if (word.includes(letter)) {
        for (let i = 0; i < word.length; i++) {
            if (word[i] === letter) {
                maskedWord[i] = letter;
}
}

        sock.sendMessage(chatId, {
            text:
`╭──〔 ✅ ɢᴏᴏᴅ ɢᴜᴇss! 〕──
│
├─ ${maskedWord.join(' ')}
│
╰──〔 🕹️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});

        if (!maskedWord.includes('_')) {
            sock.sendMessage(chatId, {
                text:
`╭──〔 🎉 ᴄᴏɴɢʀᴀᴛs! 〕──
│
├─ ʏᴏᴜ ɢᴜᴇssᴇᴅ ᴛʜᴇ ᴡᴏʀᴅ: *${word}*
│
╰──〔 🕹️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            delete hangmanGames[chatId];
}

} else {
        game.wrongGuesses += 1;
        const triesLeft = maxWrongGuesses - game.wrongGuesses;

        sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ᴡʀᴏɴɢ ɢᴜᴇss 〕──
│
├─ ʏᴏᴜ ʜᴀᴠᴇ *${triesLeft}* ᴛʀɪᴇs ʟᴇꜰᴛ.
│
╰──〔 🕹️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});

        if (game.wrongGuesses>= maxWrongGuesses) {
            sock.sendMessage(chatId, {
                text:
`╭──〔 💀 ɢᴀᴍᴇ ᴏᴠᴇʀ 〕──
│
├─ ᴛʜᴇ ᴄᴏʀʀᴇᴄᴛ ᴡᴏʀᴅ ᴡᴀs: *${word}*
│
╰──〔 🕹️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
...channelInfo
});
            delete hangmanGames[chatId];
}
}
}

module.exports = { startHangman, guessLetter};
