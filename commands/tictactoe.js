
const TicTacToe = require('../lib/tictactoe');

// Global game store
const games = {};

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

async function tictactoeCommand(sock, chatId, senderId, text) {
    try {
        const activeGame = Object.values(games).find(room =>
            room.id.startsWith('tictactoe') &&
            [room.game.playerX, room.game.playerO].includes(senderId)
);

        if (activeGame) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ᴀᴄᴛɪᴠᴇ ɢᴀᴍᴇ ᴅᴇᴛᴇᴄᴛᴇᴅ 〕──
│
├─ ʏᴏᴜ ᴀʀᴇ ᴀʟʀᴇᴀᴅʏ ɪɴ ᴀ ɢᴀᴍᴇ.
├─ ᴛʏᴘᴇ *surrender* ᴛᴏ ǫᴜɪᴛ.
│
╰──〔 🎮 ᴊɪɴᴜ-ɪɪ ɢᴀᴍᴇs 〕──`,
...channelInfo
});
            return;
}

        let room = Object.values(games).find(room =>
            room.state === 'WAITING' &&
            (text? room.name === text: true)
);

        if (room) {
            room.o = chatId;
            room.game.playerO = senderId;
            room.state = 'PLAYING';

            const arr = room.game.render().map(v => ({
                'X': '❎', 'O': '⭕',
                '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
                '4': '4️⃣', '5': '5️⃣', '6': '6️⃣',
                '7': '7️⃣', '8': '8️⃣', '9': '9️⃣'
}[v]));

            const board =
`${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}`;

            const str =
`╭──〔 🎮 ᴛɪᴄᴛᴀᴄᴛᴏᴇ sᴛᴀʀᴛᴇᴅ 〕──
│
├─ ᴛᴜʀɴ: @${room.game.currentTurn.split('@')[0]}
│
${board}
│
├─ *Room ID:* ${room.id}
├─ *Rules:*
│   • 3 ɪɴ ᴀ ʀᴏᴡ ᴛᴏ ᴡɪɴ
│   • ᴛʏᴘᴇ 1-9 ᴛᴏ ᴘʟᴀᴄᴇ
│   • *surrender* ᴛᴏ ǫᴜɪᴛ
│
╰──〔 🎮 ᴊɪɴᴜ-ɪɪ ɢᴀᴍᴇs 〕──`;

            await sock.sendMessage(chatId, {
                text: str,
                mentions: [room.game.currentTurn, room.game.playerX, room.game.playerO],
...channelInfo
});

} else {
            room = {
                id: 'tictactoe-' + (+new Date),
                x: chatId,
                o: '',
                game: new TicTacToe(senderId, 'o'),
                state: 'WAITING'
};

            if (text) room.name = text;

            await sock.sendMessage(chatId, {
                text:
`╭──〔 ⏳ ᴡᴀɪᴛɪɴɢ ꜰᴏʀ ᴏᴘᴘᴏɴᴇɴᴛ 〕──
│
├─ ᴛʏᴘᴇ *.ttt ${text || ''}* ᴛᴏ ᴊᴏɪɴ
│
╰──〔 🎮 ᴊɪɴᴜ-ɪɪ ɢᴀᴍᴇs 〕──`,
...channelInfo
});

            games[room.id] = room;
}

} catch (error) {
        console.error('Error in tictactoe command:', error);
        await sock.sendMessage(chatId, {
            text:
`╭──〔 ❌ ᴇʀʀᴏʀ 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ sᴛᴀʀᴛ ɢᴀᴍᴇ. ᴛʀʏ ᴀɢᴀɪɴ.
│
╰──〔 🎮 ᴊɪɴᴜ-ɪɪ ɢᴀᴍᴇs 〕──`,
...channelInfo
});
}
}

async function handleTicTacToeMove(sock, chatId, senderId, text) {
    try {
        const room = Object.values(games).find(room =>
            room.id.startsWith('tictactoe') &&
            [room.game.playerX, room.game.playerO].includes(senderId) &&
            room.state === 'PLAYING'
);

        if (!room) return;

        const isSurrender = /^(surrender|give up)$/i.test(text);
        if (!isSurrender &&!/^[1-9]$/.test(text)) return;

        if (senderId!== room.game.currentTurn &&!isSurrender) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɴᴏᴛ ʏᴏᴜʀ ᴛᴜʀɴ 〕──
│
├─ ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ ꜰᴏʀ ʏᴏᴜʀ ᴛᴜʀɴ ᴛᴏ ᴘʟᴀʏ.
│
╰──〔 🎮 ᴊɪɴᴜ-ɪɪ ɢᴀᴍᴇs 〕──`,
...channelInfo
});
 return;
}

        const ok = isSurrender? true: room.game.turn(
            senderId === room.game.playerO,
            parseInt(text) - 1
);

        if (!ok) {
            await sock.sendMessage(chatId, {
                text:
`╭──〔 ❌ ɪɴᴠᴀʟɪᴅ ᴍᴏᴠᴇ 〕──
│
├─ ᴛʜᴀᴛ sᴘᴏᴛ ɪs ᴀʟʀᴇᴀᴅʏ ᴛᴀᴋᴇɴ.
│
╰──〔 🎮 ᴊɪɴᴜ-ɪɪ ɢᴀᴍᴇs 〕──`,
...channelInfo
});
            return;
}

        let winner = room.game.winner;
        let isTie = room.game.turns === 9;

        const arr = room.game.render().map(v => ({
            'X': '❎', 'O': '⭕',
            '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
            '4': '4️⃣', '5': '5️⃣', '6': '6️⃣',
            '7': '7️⃣', '8': '8️⃣', '9': '9️⃣'
}[v]));

        if (isSurrender) {
            winner = senderId === room.game.playerX? room.game.playerO: room.game.playerX;
            await sock.sendMessage(chatId, {
                text:
`╭──〔 🏳️ sᴜʀʀᴇɴᴅᴇʀ ᴅᴇᴛᴇᴄᴛᴇᴅ 〕──
│
├─ @${senderId.split('@')[0]} ɢᴀᴠᴇ ᴜᴘ!
├─ @${winner⁽¹⁾.split('@')[0]} ᴡɪɴs ᴛʜᴇ ɢᴀᴍᴇ!
│
╰──〔 🎮 ᴊɪɴᴜ-ɪɪ ɢᴀᴍᴇs 〕──`,
                mentions: [senderId, winner],
...channelInfo
});

            delete games[room.id];
            return;
}

        const board =
`${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}`;

        const status = winner
? `🎉 @${winner.split('@')[0]} ᴡɪɴs ᴛʜᴇ ɢᴀᴍᴇ!`
: isTie
? `🤝 ɢᴀᴍᴇ ᴇɴᴅᴇᴅ ɪɴ ᴀ ᴅʀᴀᴡ!`
: `🎲 ᴛᴜʀɴ: @${room.game.currentTurn.split('@')[0]}`;

        const str =
`╭──〔 🎮 ᴛɪᴄᴛᴀᴄᴛᴏᴇ ᴜᴘᴅᴀᴛᴇ 〕──
│
├─ ${status}
│
${board}
│
├─ ❎: @${room.game.playerX.split('@')[0]}
├─ ⭕: @${room.game.playerO.split('@')[0]}
│
${!winner &&!isTie? '├─ ᴛʏᴘᴇ 1-9 ᴛᴏ ᴘʟᴀᴄᴇ\n├─ *surrender* ᴛᴏ ǫᴜɪᴛ': ''}
╰──〔 🎮 ᴊɪɴᴜ-ɪɪ ɢᴀᴍᴇs 〕──`;

        const mentions = [
            room.game.playerX,
            room.game.playerO,
...(winner? [winner]: [room.game.currentTurn])
        ];

        await sock.sendMessage(room.x, {
            text: str,
            mentions,
...channelInfo
});

        if (room.o && room.o!== room.x) {
            await sock.sendMessage(room.o, {
                text: str,
                mentions,
...channelInfo
});
}

        if (winner || isTie) {
            delete games[room.id];
}

} catch (error) {
        console.error('Error in tictactoe move:', error);
}
}

module.exports = {
    tictactoeCommand,
    handleTicTacToeMove
};
