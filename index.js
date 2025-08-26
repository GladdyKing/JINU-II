const fs = require('fs');
const path = require('path');

// Function to load user and group data from JSON file
function loadUserGroupData() {
    try {
        const dataPath = path.join(__dirname, '../data/userGroupData.json');
        if (!fs.existsSync(dataPath)) {
            const defaultData = {
                antibadword: {},
                antilink: {},
                welcome: {},
                goodbye: {},
                chatbot: {},
                warnings: {},
                sudo: []
            };
            fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2));
            return defaultData;
        }
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        return data;
    } catch (error) {
        console.error('Error loading user group data:', error);
        return {
            antibadword: {},
            antilink: {},
            welcome: {},
            goodbye: {},
            chatbot: {},
            warnings: {},
            sudo: []
        };
    }
}

// Function to save user and group data to JSON file
function saveUserGroupData(data) {
    try {
        const dataPath = path.join(__dirname, '../data/userGroupData.json');
        const dir = path.dirname(dataPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving user group data:', error);
        return false;
    }
}

// Anti-link functions
async function setAntilink(groupId, type, action) {
    try {
        const data = loadUserGroupData();
        if (!data.antilink) data.antilink = {};
        data.antilink[groupId] = { enabled: type === 'on', action: action || 'delete' };
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Error setting antilink:', error);
        return false;
    }
}

async function getAntilink(groupId, type) {
    try {
        const data = loadUserGroupData();
        if (!data.antilink || !data.antilink[groupId]) return null;
        return type === 'on' ? data.antilink[groupId] : null;
    } catch (error) {
        console.error('Error getting antilink:', error);
        return null;
    }
}

async function removeAntilink(groupId) {
    try {
        const data = loadUserGroupData();
        if (data.antilink && data.antilink[groupId]) delete data.antilink[groupId];
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Error removing antilink:', error);
        return false;
    }
}

// Warning system
async function incrementWarningCount(groupId, userId) {
    try {
        const data = loadUserGroupData();
        if (!data.warnings) data.warnings = {};
        if (!data.warnings[groupId]) data.warnings[groupId] = {};
        if (!data.warnings[groupId][userId]) data.warnings[groupId][userId] = 0;
        data.warnings[groupId][userId]++;
        saveUserGroupData(data);
        return data.warnings[groupId][userId];
    } catch (error) {
        console.error('Error incrementing warning count:', error);
        return 0;
    }
}

async function resetWarningCount(groupId, userId) {
    try {
        const data = loadUserGroupData();
        if (data.warnings?.[groupId]?.[userId] !== undefined) {
            data.warnings[groupId][userId] = 0;
            saveUserGroupData(data);
        }
        return true;
    } catch (error) {
        console.error('Error resetting warning count:', error);
        return false;
    }
}

// Sudo management
async function isSudo(userId) {
    try {
        const data = loadUserGroupData();
        return data.sudo?.includes(userId) || false;
    } catch (error) {
        console.error('Error checking sudo:', error);
        return false;
    }
}

async function addSudo(userJid) {
    try {
        const data = loadUserGroupData();
        if (!data.sudo) data.sudo = [];
        if (!data.sudo.includes(userJid)) data.sudo.push(userJid);
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Error adding sudo:', error);
        return false;
    }
}

async function removeSudo(userJid) {
    try {
        const data = loadUserGroupData();
        const index = data.sudo?.indexOf(userJid);
        if (index !== -1) data.sudo.splice(index, 1);
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Error removing sudo:', error);
        return false;
    }
}

async function getSudoList() {
    try {
        const data = loadUserGroupData();
        return Array.isArray(data.sudo) ? data.sudo : [];
    } catch (error) {
        console.error('Error getting sudo list:', error);
        return [];
    }
}

// Welcome system
async function addWelcome(jid, enabled, message) {
    try {
        const data = loadUserGroupData();
        data.welcome = data.welcome || {};
        data.welcome[jid] = {
            enabled,
            message: message || `╭──〔 ⚔️ ᴡᴇʟᴄᴏᴍᴇ 〕──
│
├─ 🛡️ ᴜꜱᴇʀ: {user}
├─ 🏰 ᴋɪɴɢᴅᴏᴍ: {group}
│
╞════════════════════╡
│ 📜 ᴍᴇssᴀɢᴇ ꜰʀᴏᴍ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅᴇʀ:
│ {description}
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            channelId: '120363422020175323@newsletter'
        };
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Error in addWelcome:', error);
        return false;
    }
}

async function delWelcome(jid) {
    try {
        const data = loadUserGroupData();
        if (data.welcome?.[jid]) delete data.welcome[jid];
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Error in delWelcome:', error);
        return false;
    }
}

async function isWelcomeOn(jid) {
    try {
        const data = loadUserGroupData();
        return data.welcome?.[jid]?.enabled || false;
    } catch (error) {
        console.error('Error in isWelcomeOn:', error);
        return false;
    }
}

// Goodbye system
async function addGoodbye(jid, enabled, message) {
    try {
        const data = loadUserGroupData();
        data.goodbye = data.goodbye || {};
        data.goodbye[jid] = {
            enabled,
            message: message || `╭──〔 ⚰️ ɢᴏᴏᴅʙʏᴇ 〕──
│
├─ 🛡️ ᴜꜱᴇʀ: {user}
├─ 🏰 ᴋɪɴɢᴅᴏᴍ: {group}
│
╞════════════════════╡
│ ⚰️ ʏᴏᴜ ʜᴀᴠᴇ ʙᴇᴇɴ ᴇxɪʟᴇᴅ ꜰʀᴏᴍ ᴛʜᴇ ʀᴇᴀʟᴍ.
│ ᴡᴇ ᴡɪʟʟ ɴᴏᴛ ᴍɪss ʏᴏᴜ.
│
╰──〔 🧩 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊɪɴᴜ-ɪɪ 〕──`,
            channelId: '120363422020175323@newsletter'
        };
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Error in addGoodbye:', error);
        return false;
    }
}

async function delGoodBye(jid) {
    try {
        const data = loadUserGroupData();
        if (data.goodbye?.[jid]) delete data.goodbye[jid];
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Error in delGoodBye:', error);
        return false;
    }
}

async function isGoodByeOn(jid) {
    try {
        const data = loadUserGroupData();
        return data.goodbye?.[jid]?.enabled || false;
    } catch (error) {
        console.error('Error in isGoodByeOn:', error);
        return false;
    }
}

// Anti-badword system
async function setAntiBadword(groupId, type, action) {
    try {
        const data = loadUserGroupData();
        data.antibadword = data.antibadword || {};
        data.antibadword[groupId] = { enabled: type === 'on', action: action || 'delete' };
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Error setting antibadword:', error);
        return false;
    }
}

async function getAntiBadword(groupId, type) {
    try {
        const data = loadUserGroupData();
        return type === 'on' ? data.antibadword?.[groupId] || null : null;
    } catch (error) {
        console.error('Error getting antibadword:', error);
        return null;
    }
}

async function removeAntiBadword(groupId) {
    try {
        const data = loadUserGroupData();
        if (data.antibadword?.[groupId]) delete data.antibadword[groupId];
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Error removing antibadword:', error);
        return false;
    }
}

// Chatbot system
async function setChatbot(groupId, enabled) {
    try {
        const data = loadUserGroupData();
        data.chatbot = data.chatbot || {};
        data.chatbot[groupId] = { enabled };
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Error setting chatbot:', error);
        return false;
    }
}

async function getChatbot(groupId) {
    try {
        const data = loadUserGroupData();
        return data.chatbot?.[groupId] || null;
    } catch (error) {
        console.error('Error getting chatbot:', error);
        return null;
    }
}

async function removeChatbot(groupId) {
    try {
        const data = loadUserGroupData();
        if (data.chatbot?.[groupId]) delete data.chatbot[groupId];
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Error removing chatbot:', error);
        return false;
    }
}

module.exports = {
    setAntilink, getAntilink, removeAntilink,
    incrementWarningCount, resetWarningCount,
    isSudo, addSudo, removeSudo, getSudoList,
    addWelcome, delWelcome, isWelcomeOn,
    addGoodbye, delGoodBye, isGoodByeOn,
    setAntiBadword, getAntiBadword, removeAntiBadword,
    setChatbot, getChatbot, removeChatbot
};
