
const { downloadContentFromMessage} = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const { UploadFileUgu, TelegraPh} = require('../lib/uploader');

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

async function getMediaBufferAndExt(message) {
	const m = message.message || {};
	if (m.imageMessage) {
		const stream = await downloadContentFromMessage(m.imageMessage, 'image');
		const chunks = [];
		for await (const chunk of stream) chunks.push(chunk);
		return { buffer: Buffer.concat(chunks), ext: '.jpg'};
	}
	if (m.videoMessage) {
		const stream = await downloadContentFromMessage(m.videoMessage, 'video');
		const chunks = [];
		for await (const chunk of stream) chunks.push(chunk);
		return { buffer: Buffer.concat(chunks), ext: '.mp4'};
	}
	if (m.audioMessage) {
		const stream = await downloadContentFromMessage(m.audioMessage, 'audio');
		const chunks = [];
		for await (const chunk of stream) chunks.push(chunk);
		return { buffer: Buffer.concat(chunks), ext: '.mp3'};
	}
	if (m.documentMessage) {
		const stream = await downloadContentFromMessage(m.documentMessage, 'document');
		const chunks = [];
		for await (const chunk of stream) chunks.push(chunk);
		const fileName = m.documentMessage.fileName || 'file.bin';
		const ext = path.extname(fileName) || '.bin';
		return { buffer: Buffer.concat(chunks), ext};
	}
	if (m.stickerMessage) {
		const stream = await downloadContentFromMessage(m.stickerMessage, 'sticker');
		const chunks = [];
		for await (const chunk of stream) chunks.push(chunk);
		return { buffer: Buffer.concat(chunks), ext: '.webp'};
	}
	return null;
}

async function getQuotedMediaBufferAndExt(message) {
	const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
	if (!quoted) return null;
	return getMediaBufferAndExt({ message: quoted});
}

async function urlCommand(sock, chatId, message) {
	try {
		let media = await getMediaBufferAndExt(message);
		if (!media) media = await getQuotedMediaBufferAndExt(message);

		if (!media) {
			await sock.sendMessage(chatId, {
				text:
`╭──〔 📎 *ᴍᴇᴅɪᴀ ɴᴇᴇᴅᴇᴅ* 〕──
│
├─ ꜱᴇɴᴅ ᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇᴅɪᴀ ꜰɪʟᴇ.
├─ ꜱᴜᴘᴘᴏʀᴛᴇᴅ: ɪᴍᴀɢᴇ, ᴠɪᴅᴇᴏ, ᴀᴜᴅɪᴏ, ꜱᴛɪᴄᴋᴇʀ, ᴅᴏᴄᴜᴍᴇɴᴛ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
				...channelInfo
			}, { quoted: message});
			return;
		}

		const tempDir = path.join(__dirname, '../temp');
		if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true});
		const tempPath = path.join(tempDir, `${Date.now()}${media.ext}`);
		fs.writeFileSync(tempPath, media.buffer);

		let url = '';
		try {
			if (['.jpg', '.png', '.webp'].includes(media.ext)) {
				try {
					url = await TelegraPh(tempPath);
				} catch {
					const res = await UploadFileUgu(tempPath);
					url = typeof res === 'string'? res: (res.url || res.url_full || JSON.stringify(res));
				}
			} else {
				const res = await UploadFileUgu(tempPath);
				url = typeof res === 'string'? res: (res.url || res.url_full || JSON.stringify(res));
			}
		} finally {
			setTimeout(() => {
				try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);} catch {}
			}, 2000);
		}

		if (!url) {
			await sock.sendMessage(chatId, {
				text:
`╭──〔 ❌ *ᴜᴘʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ* 〕──
│
├─ ᴄᴏᴜʟᴅ ɴᴏᴛ ɢᴇɴᴇʀᴀᴛᴇ ᴀ ᴜʀʟ ꜰᴏʀ ᴛʜɪꜱ ᴍᴇᴅɪᴀ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
				...channelInfo
			}, { quoted: message});
			return;
		}

		await sock.sendMessage(chatId, {
			text:
`╭──〔 🌐 *ᴍᴇᴅɪᴀ ᴜᴘʟᴏᴀᴅᴇᴅ* 〕──
│
├─ ʜᴇʀᴇ'ꜱ ʏᴏᴜʀ ʟɪɴᴋ:
│   ${url}
│
╰──〔 🔗 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
			...channelInfo
		}, { quoted: message});

	} catch (error) {
		console.error('[URL] error:', error?.message || error);
		await sock.sendMessage(chatId, {
			text:
 `╭──〔 ⚠️ *ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ* 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴄᴏɴᴠᴇʀᴛ ᴍᴇᴅɪᴀ ᴛᴏ ᴜʀʟ.
├─ ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
			...channelInfo
		}, { quoted: message});
	}
}

module.exports = urlCommand;
