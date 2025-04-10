const fs = require('fs'); 
const path = require('path');
const color = require('chalk'); 

module.exports = {
    defaultIp: "mc.monyxnetwork.xyz",
    defaultPort: "25565",
    queryPort: 25565,
    javaVersion: "1.16 - 1.21+",
    bedrockVersion: "1.21.40 - latest",
    messages: {
        statusOnline: "*🟢Status:* Online",
        statusOffline: "*🔴Status:* Offline",
        serverInfoTemplate: `
≡ *MINECRAFT SERVER STATUS*
┌──────────────
▢ {status}
▢ *IP Address:* {serverIP}
▢ *Java Version:* {javaVersion}
▢ *Bedrock Version:* {bedrockVersion}
▢ *Players:* {playersOnline}
▢ *MOTD:* {motd}
└──────────────
          
Kunjungi link dibawah untuk
menambahkan serer otomatis (Khusus Bedrock/MCPE):
https://add.monyxnetwork.xyz`,
        playerListTemplate: `
≡ *DAFTAR PEMAIN ONLINE ({playersOnline})*
┌──────────────
{listPlayer}
└──────────────`,
        errorFetchingStatus: "Maaf, terjadi kesalahan saat mencoba mengambil status server."
    }
};


let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})