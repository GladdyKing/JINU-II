
const fs = require('fs');
const isOwnerOrSudo = require('../lib/isOwner');

function readJsonSafe(path, fallback) {
	try {
		const txt = fs.readFileSync(path, 'utf8');
		return JSON.parse(txt);
	} catch (_) {
		return fallback;
	}
}

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

async function settingsCommand(sock, chatId, message) {
	try {
		const senderId = message.key.participant || message.key.remoteJid;
		const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

		if (!message.key.fromMe &&!isOwner) {
			await sock.sendMessage(chatId, {
				text:
`╭──〔 🔒 *ᴀᴄᴄᴇꜱꜱ ᴅᴇɴɪᴇᴅ* 〕──
│
├─ ᴏɴʟʏ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ.
│
╰──〔 ⚙️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
				...channelInfo
			}, { quoted: message});
			return;
		}

		const isGroup = chatId.endsWith('@g.us');
		const dataDir = './data';

		const mode = readJsonSafe(`${dataDir}/messageCount.json`, { isPublic: true});
		const autoStatus = readJsonSafe(`${dataDir}/autoStatus.json`, { enabled: false});
		const autoread = readJsonSafe(`${dataDir}/autoread.json`, { enabled: false});
		const autotyping = readJsonSafe(`${dataDir}/autotyping.json`, { enabled: false});
		const pmblocker = readJsonSafe(`${dataDir}/pmblocker.json`, { enabled: false});
		const anticall = readJsonSafe(`${dataDir}/anticall.json`, { enabled: false});
		const userGroupData = readJsonSafe(`${dataDir}/userGroupData.json`, {
			antilink: {}, antibadword: {}, welcome: {}, goodbye: {}, chatbot: {}, antitag: {}
		});
		const autoReaction = Boolean(userGroupData.autoReaction);

		const groupId = isGroup? chatId: null;
		const antilinkOn = groupId? Boolean(userGroupData.antilink?.[groupId]): false;
		const antibadwordOn = groupId? Boolean(userGroupData.antibadword?.[groupId]): false;
		const welcomeOn = groupId? Boolean(userGroupData.welcome?.[groupId]): false;
		const goodbyeOn = groupId? Boolean(userGroupData.goodbye?.[groupId]): false;
		const chatbotOn = groupId? Boolean(userGroupData.chatbot?.[groupId]): false;
		const antitagCfg = groupId? userGroupData.antitag?.[groupId]: null;

		const lines = [];
		lines.push('╭──〔 ⚙️ *ʙᴏᴛ ꜱᴇᴛᴛɪɴɢꜱ ᴘᴀɴᴇʟ* 〕──');
		lines.push('│');
		lines.push(`├─ 🌐 ᴍᴏᴅᴇ: *${mode.isPublic? 'ᴘᴜʙʟɪᴄ': 'ᴘʀɪᴠᴀᴛᴇ'}*`);
		lines.push(`├─ 📝 ᴀᴜᴛᴏ ꜱᴛᴀᴛᴜꜱ: *${autoStatus.enabled? 'ON': 'OFF'}*`);
		lines.push(`├─ 📖 ᴀᴜᴛᴏʀᴇᴀᴅ: *${autoread.enabled? 'ON': 'OFF'}*`);
		lines.push(`├─ ⌨️ ᴀᴜᴛᴏᴛʏᴘɪɴɢ: *${autotyping.enabled? 'ON': 'OFF'}*`);
		lines.push(`├─ 🚫 ᴘᴍ ʙʟᴏᴄᴋᴇʀ: *${pmblocker.enabled? 'ON': 'OFF'}*`);
		lines.push(`├─ 📵 ᴀɴᴛɪᴄᴀʟʟ: *${anticall.enabled? 'ON': 'OFF'}*`);
		lines.push(`├─ 💬 ᴀᴜᴛᴏ ʀᴇᴀᴄᴛɪᴏɴ: *${autoReaction? 'ON': 'OFF'}*`);

		if (groupId) {
			lines.push('│');
			lines.push(`├─ 👥 ɢʀᴏᴜᴘ: *${groupId}*`);
			lines.push(`├─ 🔗 ᴀɴᴛɪʟɪɴᴋ: *${antilinkOn? `ON (action: ${userGroupData.antilink[groupId].action || 'delete'})`: 'OFF'}*`);
			lines.push(`├─ 🧼 ᴀɴᴛɪʙᴀᴅᴡᴏʀᴅ: *${antibadwordOn? `ON (action: ${userGroupData.antibadword[groupId].action || 'delete'})`: 'OFF'}*`);
			lines.push(`├─ 👋 ᴡᴇʟᴄᴏᴍᴇ: *${welcomeOn? 'ON': 'OFF'}*`);
			lines.push(`├─ 📴 ɢᴏᴏᴅʙʏᴇ: *${goodbyeOn? 'ON': 'OFF'}*`);
			lines.push(`├─ 🤖 ᴄʜᴀᴛʙᴏᴛ: *${chatbotOn? 'ON': 'OFF'}*`);
			lines.push(`├─ 🚫 ᴀɴᴛɪᴛᴀɢ: *${antitagCfg?.enabled? `ON (action: ${antitagCfg.action || 'delete'})`: 'OFF'}*`);
		} else {
			lines.push('│');
			lines.push('├─ ℹ️ ᴘᴇʀ-ɢʀᴏᴜᴘ ꜱᴇᴛᴛɪɴɢꜱ ᴀᴘᴘʟʏ ᴏɴʟʏ ɪɴꜱɪᴅᴇ ɢʀᴏᴜᴘꜱ.');
		}

		lines.push('│');
		lines.push('╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──');

		await sock.sendMessage(chatId, { text: lines.join('\n'),...channelInfo}, { quoted: message});
	} catch (error) {
		console.error('Error in settings command:', error);
		await sock.sendMessage(chatId, {
			text:
 `╭──〔 ⚠️ *ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ* 〕──
│
├─ ꜰᴀɪʟᴇᴅ ᴛᴏ ʀᴇᴀᴅ ꜱᴇᴛᴛɪɴɢꜱ ꜰɪʟᴇꜱ.
├─ ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
			...channelInfo
		}, { quoted: message});
	}
}

module.exports = settingsCommand;
