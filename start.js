const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const MAIN = require('./main'); // load your command system

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed.', { connection, shouldReconnect });
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('✅ Bot connected successfully!');
    }
  });

  // Forward all incoming messages to your main.js handler
  sock.ev.on('messages.upsert', async (m) => {
    try {
      await MAIN.handleMessages(sock, m);
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  // Forward group participant updates if your main.js supports it
  sock.ev.on('group-participants.update', async (update) => {
    try {
      if (MAIN.handleGroupParticipantUpdate) {
        await MAIN.handleGroupParticipantUpdate(sock, update);
      }
    } catch (err) {
      console.error('Error in group participant update:', err);
    }
  });
}

startBot();
