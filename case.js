/*

# Base By Devorsixcore
# Owner base? : t.me/devor6core
# Remake by Arnov : t.me/arnov
!- do not delete this credit

*/

require('./config.js')
const {
	devorsixConnect,
	downloadContentFromMessage,
	emitGroupParticipantsUpdate,
	emitGroupUpdate,
	generateWAMessageContent,
	generateWAMessage,
	makeInMemoryStore,
	prepareWAMessageMedia,
	generateWAMessageFromContent,
	MediaType,
	areJidsSameUser,
	WAMessageStatus,
	downloadAndSaveMediaMessage,
	AuthenticationState,
	GroupMetadata,
	initInMemoryKeyStore,
	getContentType,
	MiscMessageGenerationOptions,
	useSingleFileAuthState,
	BufferJSON,
	WAMessageProto,
	MessageOptions,
	WAFlag,
	WANode,
	WAMetric,
	ChatModification,
	MessageTypeProto,
	WALocationMessage,
	ReconnectMode,
	WAContextInfo,
	proto,
	WAGroupMetadata,
	ProxyAgent,
	waChatKey,
	MimetypeMap,
	MediaPathMap,
	WAContactMessage,
	WAContactsArrayMessage,
	WAGroupInviteMessage,
	WATextMessage,
	WAMessageContent,
	WAMessage,
	BaileysError,
	WA_MESSAGE_STATUS_TYPE,
	MediaConnInfo,
	URL_REGEX,
	WAUrlInfo,
	WA_DEFAULT_EPHEMERAL,
	WAMediaUpload,
	mentionedJid,
	processTime,
	Browser,
	MessageType,
	Presence,
	WA_MESSAGE_STUB_TYPES,
	Mimetype,
	relayWAMessage,
	Browsers,
	GroupSettingChange,
	DisconnectReason,
	WASocket,
	getStream,
	WAProto,
	isBaileys,
	AnyMessageContent,
	fetchLatestBaileysVersion,
	templateMessage,
	InteractiveMessage,
	Header
} = require("@whiskeysockets/baileys")
const fs = require('fs')
const axios = require('axios')
const fetch = require('node-fetch')
const chalk = require('chalk')
const speed = require('performance-now')
const moment = require('moment-timezone')
const os = require('os')
const util = require('util')
const { spawn: spawn, exec } = require("child_process")
const utils = require("minecraft-server-util")
const mc = require('./mcconfig.js')
const { readGroupSetting, readToxicWords, toxicWordsPath, writeGroupSetting, readProducts, writeProducts, readOrders, writeOrders } = require('./trashbase/lib/database.js');
const { createMidtransTransaction, cancelMidtransTransaction, checkMidtransTransaction } = require('./trashbase/lib/midtrans');
const { isPlayerInServer } = require('./trashbase/lib/validation');

const onlyAdmin = global.onlyAdmin
const onlyOwner = global.onlyOwner
const onlyGroup = global.onlyGroup
const onlyPrivate = global.onlyPrivate
const onlyBot = global.onlyBot

const tiktokSession = {};
//=================================================//
if (!fs.existsSync('./tmp')) {
    fs.mkdirSync('./tmp');
}

module.exports = devorsix = handler = async (devorsix, m, chatUpdate, store) => {
	try {
	
		const { smsg, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins } = require('./trashbase/lib/myfunc.js');
		const { toAudio, toPTT, toVideo, ffmpeg, addExifAvatar } = require('./trashbase/lib/converter.js');
		const { TelegraPh, UploadFileUgu, webp2mp4File, floNime } = require('./trashbase/lib/uploader.js');
    //=================================================//
		var body = (
			m.mtype === 'conversation' ? m.message.conversation :
			m.mtype === 'imageMessage' ? m.message.imageMessage.caption :
			m.mtype === 'videoMessage' ? m.message.videoMessage.caption :
			m.mtype === 'extendedTextMessage' ? m.message.extendedTextMessage.text :
			m.mtype === 'buttonsResponseMessage' ? m.message.buttonsResponseMessage.selectedButtonId :
			m.mtype === 'listResponseMessage' ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
			m.mtype === 'interactiveResponseMessage' ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :
			m.mtype === 'templateButtonReplyMessage' ? m.message.templateButtonReplyMessage.selectedId :
			m.mtype === 'messageContextInfo' ?
			m.message.buttonsResponseMessage?.selectedButtonId ||
			m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
			m.message.InteractiveResponseMessage.NativeFlowResponseMessage ||
			m.text :
			''
			);
		if (body == undefined) { body = '' };
		var budy = (typeof m.text == "string" ? m.text : "");
    //=================================================//
		//command
		const prefixRegex = /[.!#÷×/]/;
		const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : null;
		const isCmd = prefix ? body.startsWith(prefix) : false;
		// const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';		
		// const args = budy.trim().split(/ +/).slice(1);
		// const q = text = args.join(' ')
		const isButton = m.message?.buttonsResponseMessage;
		const selectedCmd = isButton ? m.message.buttonsResponseMessage.selectedButtonId : body;
		
		const command = isCmd ? selectedCmd.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
		const args = selectedCmd.trim().split(/ +/).slice(1);
		const q = args.join(" ");		

		// Individual
		const botNumber = devorsix.user.id.split(':')[0];
		const pushname = m.pushName || "No Name";
		const senderp = m.isGroup ? (m.participant || m.key.participant) : m.sender;
		const senderNumber = m.sender.split('@')[0];	
		const itsMe = m.sender == botNumber;
		const isOwner = [botNumber, ...global.owner]
			.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
			.includes(senderp);
			
		if (!devorsix.public) {
			if (!m.fromMe && !isOwner) return;
		};

		// Group
		const isGroup = m.chat.endsWith('@g.us');
		const groupMetadata = isGroup ? await devorsix.groupMetadata(m.chat).catch(e => {}) : '';
		const groupName = isGroup ? groupMetadata.subject : '';
		const groupMembers = isGroup ? groupMetadata.participants : '';
		const groupAdmins = isGroup ? await getGroupAdmins(groupMembers) : '';
		const sender = m.isGroup ? (m.participant || m.key.participant) : m.sender;
		const isBotAdmin = isGroup ? groupAdmins.includes(botNumber + '@s.whatsapp.net') : false;
		const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
		const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
		const groupOwner = isGroup ? groupMetadata.owner : '';
		const isGroupOwner = isGroup ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender) : false;

		//msg
		const isMedia = (m.type === 'imageMessage' || m.type === 'videoMessage')
		const fatkuns = (m.quoted || m)
		const quoted = (fatkuns.mtype == "buttonsMessage") ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.mtype == "templateMessage") ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.mtype == "product") ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m
		const qmsg = (quoted.msg || quoted)
		const mime = qmsg.mimetype || "";
		const moon = fs.readFileSync('./trashbase/media/moon.jpeg')
		const wangy = fs.readFileSync('./trashbase/media/devor6core.jpeg')
		const warn = fs.readFileSync('./trashbase/media/warning.png')

		//time
		const time = moment().tz("Asia/Jakarta").format("HH:mm:ss");
		let ucapanWaktu;
		if (time >= "19:00:00" && time < "23:59:00") {
			ucapanWaktu = "夜 🌌";
		} else if (time >= "15:00:00" && time < "19:00:00") {
			ucapanWaktu = "午後 🌇";
		} else if (time >= "11:00:00" && time < "15:00:00") {
			ucapanWaktu = "正午 🏞️";
		} else if (time >= "06:00:00" && time < "11:00:00") {
			ucapanWaktu = "朝 🌁";
		} else {
			ucapanWaktu = "夜明け 🌆";
		}
		const wib = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("HH:mm:ss z");
		const wita = moment(Date.now()).tz("Asia/Makassar").locale("id").format("HH:mm:ss z");
		const wit = moment(Date.now()).tz("Asia/Jayapura").locale("id").format("HH:mm:ss z");
		const salam = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("a");
		let d = new Date();
		let gmt = new Date(0).getTime() - new Date("1 Januari 2024").getTime();
		let weton = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"][Math.floor(((d * 1) + gmt) / 84600000) % 5];
		let week = d.toLocaleDateString("id", { weekday: "long" });
		let calendar = d.toLocaleDateString("id", {
			day: "numeric",
			month: "long",
			year: "numeric"
		});		

        //quoted
		const ctt = {
			key: {
				remoteJid: '0@s.whatsapp.net', // 'status@broadcast', menggunakan remote jid bernilai 'statusbroadcast' akan menyebabkan pesan crash pada wa desktop. sebagai alternatif, saya menggunakan nilai '0@s.whatsapp.net'
				participant: '0@s.whatsapp.net',
				fromMe: false,
			},
			message: {
				contactMessage: {
					displayName: (pushname),
					vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${pushname},;;;\nFN:${pushname}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
				}
			}
		};

		const callg = {
			key: {
				remoteJid: 'status@broadcast', //'0@s.whatsapp.net', menggunakan remote jid bernilai 'statusbroadcast' akan menyebabkan pesan crash pada wa desktop. sebagai alternatif, sebaiknya menggunakan nilai '0@s.whatsapp.net'
				participant: '0@s.whatsapp.net',
				fromMe: false,
			},
			message: {
				callLogMesssage: {
                    isVideo: true,
                    callOutcome: "1",
                    durationSecs: "0",
                    callType: "REGULAR",
                    participants: [{ jid: "0@s.whatsapp.net", callOutcome: "1" }]
                }
			}
		};

        //reply
		const xreply = async (teks) => {
			await sleep(500)
			return devorsix.sendMessage(m.chat, {
				contextInfo: {
					mentionedJid: [
						m.sender
					],
					externalAdReply: {
						showAdAttribution: false, //bebas
						renderLargerThumbnail: false, //bebas
						title: `MonyxBot - V2`,
						body: `By Arnov`,
						previewType: "VIDEO",
						thumbnail: moon,
						sourceUrl: global.url,
						mediaUrl: global.url
					}
				},
				text: teks
			}, {
				quoted: ctt
			})
		}

		const wreply = async (teks) => {
			await sleep(500)
			return devorsix.sendMessage(m.chat, {
				contextInfo: {
					mentionedJid: [
						m.sender
					],
					externalAdReply: {
						showAdAttribution: false, //bebas
						renderLargerThumbnail: false, //bebas
						title: `Error`,
						body: `By Arnov`,
						previewType: "VIDEO",
						thumbnail: warn,
						sourceUrl: global.url,
						mediaUrl: global.url
					}
				},
				text: teks
			}, {
				quoted: ctt
			})
		}
		
		// Prepare Media
        async function prM(params) {
            return await prepareWAMessageMedia(params, {
                upload: devorsix.waUploadToServer
            })
        }
//=================================================//
    // Mencetak catatan diconsole saat ada yang mengirim perintah

//  	if (m.message)  {		
		if (isCmd)  {
            console.log(chalk.black(chalk.bgWhite('[ PESAN ]')), chalk.black(chalk.bgGreen(new Date)), chalk.black(chalk.bgBlue(budy || m.mtype)) + '\n' + chalk.magenta('=> Dari'), chalk.green(pushname), chalk.yellow(sender) + '\n' + chalk.blueBright('=> Di'), chalk.green(m.isGroup ? pushname : 'Private Chat', m.chat))
        }
//=================================================//

     //Fungsi Anti Link

	 const db = readGroupSetting();
	 db.chats = db.chats || {};
	 
	 if (isGroup && db.chats[m.chat]?.antilink) {
		 const messageText = body.toLowerCase();
		 const isSenderAdmin = groupAdmins.includes(sender);
		 const isGroupInvite = await isBotGroupInvite(messageText, m.chat);
	 
		 if (containsAnyLink(messageText) && !isAllowedLink(messageText) && !isGroupInvite) {
	 
			 if (!isSenderAdmin && isBotAdmin) {
				 try {
					 await devorsix.sendMessage(m.chat, {
						 text: `⚠️ *Antilink Terdeteksi!* ⚠️\n\n@${sender.split('@')[0]} Anda mengirim link yang tidak diizinkan!`,
						 mentions: [sender]
					 }, { quoted: m });
	 
					 await devorsix.sendMessage(m.chat, { delete: m.key });
				 } catch (error) {
					 console.error("Gagal menghapus pesan:", error);
				 }
			 }
		 }
	 }
	 
	 // ======== Fungsi Modular ========= //
	 
	 function containsAnyLink(text) {
		 const allUrlRegex = /https?:\/\/[^\s]+/i;
		 return allUrlRegex.test(text);
	 }
	 
	 function isAllowedLink(text) {
		 const whitelistRegex = [
			 /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/i,
			 /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)/i,
			 /(?:https?:\/\/)?(?:www\.|vm\.|vt\.)?tiktok\.com/i,
			 /(?:https?:\/\/)?(?:[\w.-]+\.)?monyxnetwork\.xyz/i
		 ];
	 
		 return whitelistRegex.some(regex => regex.test(text));
	 }
	 
	 async function isBotGroupInvite(text, chatId) {
		 const groupLink = `https://chat.whatsapp.com/${await devorsix.groupInviteCode(chatId)}`;
		 return text.includes(groupLink.toLowerCase());
	 }

	 		// Fungsi Anti Toxic

	 function containsToxicWords(text) {
		const toxicWords = readToxicWords();
		const regex = new RegExp(`\\b(${toxicWords.join('|')})\\b`, 'i');
		return regex.test(text);
	}
	
	if (isGroup && db.chats[m.chat]?.antitoxic) {
		if (containsToxicWords(budy)) {
			if (!isAdmins && isBotAdmin) {
				try {
					await devorsix.sendMessage(m.chat, {
						text: `⚠️ *Anti Toxic Terdeteksi!* ⚠️\n\n@${sender.split('@')[0]} Jangan toxic, nanti admin murka!`,
						mentions: [sender]
					}, { quoted: m });
	
					await devorsix.sendMessage(m.chat, { delete: m.key });
				} catch (error) {
					console.error("Gagal menghapus pesan:", error);
				}
			}
		}
	}
	 
//=================================================//

    // Lingkup Command "Perintah"

		switch (command) {
//=====================[ Main Menu ]====================//
			case 'help':
            case 'menu': {
                let timestampp = speed()
                let latensii = speed() - timestampp
                let run = process.uptime()
                let teks = `${runtime(run)}`
                let bajindul = `┌──────────┐
│  ▢  Simple - Base
│  ‣  Version  : *${require('./package.json').version}*
│  ‣  Author   : Arnov
│  ‣  User     : ${m.pushName}
│  ‣  Prefix   : ${prefix}
│  ‣  Tanggal  : *${calendar}*
│  ‣  Jam      : *${time} (Asia/Jakarta)*
│  ‣  Status   : ${devorsix.public ? 'Public' : 'Self'}
│  ‣  Speed    : *${latensii.toFixed(4)} Sec*
│  ‣  Run Time : *${teks}*
│  ‣  Library  : FzR-Baileys
└──────────┘

╭───「 Main 」
│ ▢ .menu
│ ▢ .public
│ ▢ .self
╰──────────

╭───「 Group 」
│ ▢ .open
│ ▢ .close
│ ▢ .antilink
│ ▢ .antitoxic
╰──────────

╭───「 Sticker 」
│ ▢ .s
│ ▢ .sticker
│ ▢ .brat
│ ▢ .bratvid
╰──────────

╭───「 Downloader 」
│ ▢ .fb 
│ ▢ .ig 
│ ▢ .tt
│ ▢ .ttmp3
│ ▢ .ytmp4
│ ▢ .ytmp3 
│ ▢ .play
╰──────────

╭───「 Tools 」
│ ▢ .mcstatus
│ ▢ .plist
│ ▢ .cekjid
│ ▢ .toimg
│ ▢ .shorturl
│ ▢ .tourl
│ ▢ .hitam
╰──────────

╭───「 Owner 」
│ ▢ .addtoxic
│ ▢ .deltoxic
│ ▢ > (eval)
│ ▢ < (eval-async)
│ ▢ $ (cmd-exec)
╰──────────`
                
                devorsix.sendMessage(m.chat, {
                    image: wangy,
                    caption: bajindul,
                    footer: "# Monyx Bot - V2",
                    buttons: [
                        {
                            buttonId: '.x',
                            buttonText: { displayText: 'X' },
                            type: 1,
                        }
                    ],
                    headerType: 1,
                    viewOnce: true
                }, { quoted: m });
            }
            break

            case 'x': {
               m.reply('No brother, tidak boleh berkata kasar')
            }
            break
			
			case "public": {
				if (!isOwner) return
				m.reply("succes change status to public")
				devorsix.public = true
			}
			break

			case "self": {
				if (!isOwner) return
				m.reply("succes change status to self")
				devorsix.public = false
			}
			break

//=====================[ Sticker Menu ]====================//
            case 's': 
            case 'sticker': 
            case 'stiker': {            
                if (/image/.test(mime)) {
                    let media = await quoted.download();
                    let encmedia = await devorsix.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.author });
                } else if (/video/.test(mime)) {
                    if ((quoted.msg || quoted).seconds > 11) {
                        return xreply(`Reply gambar dengan keterangan/caption ${prefix+command}\nJika media yang ingin dijadikan sticker adalah video, batas maksimal durasi Video 1-9 Detik`);
                    }
                    let media = await quoted.download();
                    let encmedia = await devorsix.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author });
                } else {
                    xreply(`Reply gambar dengan keterangan/caption ${prefix+command}\nDurasi Video 1-9 Detik`);
                }
            }
            break

			case 'brat': {
				if (!q) {
					return xreply(`Kirim pesan dengan format: \`${prefix}brat teks\``);
				}
			
				await devorsix.sendMessage(m.chat, {
					text: "⏳ Sedang memproses sticker brat...",
				}, {
					quoted: m
				});
			
				try {
					// URL API
					const apiUrl = `https://api.arnov-web.eu.org/api/brat?text=${encodeURIComponent(q)}`;
					const apiResponse = await axios.get(apiUrl);
			
					// Cek apakah data imageUrl tersedia
					if (!apiResponse.data.data || !apiResponse.data.data.imageUrl) {
						return m.reply('Terjadi kesalahan: URL gambar tidak ditemukan.');
					}
			
					const downloadUrl = apiResponse.data.data.imageUrl.replace('https://tmpfiles.org', 'https://tmpfiles.org/dl');
			
					// Gunakan fungsi sendImageAsSticker yang sudah ada
					await devorsix.sendImageAsSticker(m.chat, downloadUrl, m, {
						packname: 'Yukii Bot',
						author: 'Arnov'
					});
			
				} catch (error) {
					console.error('Error saat memproses permintaan:', error.message);
					m.reply('Terjadi kesalahan saat memproses permintaan Anda.');
				}
				break;
			}
			
			case 'bratvid': {
				if (!q) {
					return xreply(`Kirim pesan dengan format: \`${prefix}bratvid teks\``);
				}
				
				await devorsix.sendMessage(m.chat, {
					text: "⏳ Sedang memproses stiker brat video...",
				}, {
					quoted: m
				});
				
				try {
					// URL API
					const apiUrl = `https://api.arnov-web.eu.org/api/bratvid?text=${encodeURIComponent(q)}`;
					const apiResponse = await axios.get(apiUrl);
					
					// Cek apakah data gifUrl tersedia
					if (!apiResponse.data.data || !apiResponse.data.data.gifUrl) {
						return m.reply('Terjadi kesalahan: URL GIF tidak ditemukan.');
					}
					
					const downloadUrl = apiResponse.data.data.gifUrl.replace('https://tmpfiles.org', 'https://tmpfiles.org/dl');
					
					// Gunakan fungsi sendVideoAsSticker yang sudah ada
					await devorsix.sendVideoAsSticker(m.chat, downloadUrl, m, {
						packname: global.packname,
						author: global.author
					});
					
				} catch (error) {
					console.error('Error saat memproses permintaan:', error.message);
					m.reply('Terjadi kesalahan saat memproses permintaan Anda.');
				}
				break;
			}
//=====================[ Tools Menu ]====================//
            case 'toimage': 
            case 'toimg': {
                if (!/webp/.test(mime)) {
                    return xreply(`Reply/Balas stiker dengan teks: *${prefix + command}*`);
                }
                
                let media = await devorsix.downloadAndSaveMediaMessage(qmsg);
                let ran = await getRandom('.png');
                
                exec(`ffmpeg -i ${media} ${ran}`, (err) => {
                    fs.unlinkSync(media);
                    if (err) return err;
            
                    let buffer = fs.readFileSync(ran);
                    devorsix.sendMessage(m.chat, { image: buffer }, { quoted: m });
                    fs.unlinkSync(ran);
                });
            }
            break

            case "shortlink": 
            case "shorturl": {
                if (!q) return xreply(`Contoh: ${prefix + command} https://monyxnetwork.xyz`);
                if (!isUrl(q)) return xreply(`Contoh: ${prefix + command} https://monyxnetwork.xyz`);
            
                var res = await axios.get('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(q));
                var link = `\n*Shortlink by TinyURL*\n${res.data.toString()}`;
            
                await xreply(link);
            }
            break

            case 'tourl': {
                if (!/video/.test(mime) && !/image/.test(mime)) return xreply(`Reply gambar dengan keterangan/caption ${prefix+command}`);
                let pnis = await m.quoted ? m.quoted : m;
                let media = await pnis.download();
                let link = await TelegraPh(media);
                await sleep(1000);
                await xreply(`${link}`);
            }
            break

			case 'hitam':
			case 'blacken': {
				if (!/image/.test(mime)) return xreply(`Balas gambar dengan caption *${prefix + command}* atau kirim gambar dengan caption *${prefix + command}*`);

				// Ambil opsi tambahan dari argumen
				const option = args[0]?.toLowerCase(); // Ambil argumen pertama setelah command

				// Validasi opsi
				if (option && !['nerd', 'hitam'].includes(option)) {
					return xreply(`Opsi tidak valid. Gunakan *${prefix + command} nerd* atau *${prefix + command} hitam*`);
				}

				// Beri tahu pengguna bahwa proses sedang berjalan
				await devorsix.sendMessage(m.chat, {
					text: "⏳ Sedang memproses gambar...",
				}, { quoted: m });

				try {
					// Download gambar
					const media = await quoted.download();

					// Upload gambar ke temp server untuk mendapatkan URL
					const telegrapUrl = await TelegraPh(media);
					if (!telegrapUrl) throw new Error('Gagal mengupload gambar');

					// Kirim request ke API lokal Anda dengan opsi
					const apiUrl = `https://api.arnov-web.eu.org/api/hitam?image=${encodeURIComponent(telegrapUrl)}&option=${option || 'hitam'}`;
					const response = await axios.get(apiUrl);

					if (!response.data.status || !response.data.result) {
						throw new Error(response.data.message || 'Gagal memproses gambar');
					}

					// Gunakan URL download langsung seperti di contoh brat
					let downloadUrl = response.data.result;
					// Jika menggunakan tmpfiles.org, ubah ke URL download
					if (downloadUrl.includes('tmpfiles.org')) {
						downloadUrl = downloadUrl.replace('https://tmpfiles.org', 'https://tmpfiles.org/dl');
					}

					// Gunakan metode pengiriman yang sama seperti di brat
					await devorsix.sendMessage(m.chat, {
						image: { url: downloadUrl },
						caption: response.data.message || 'Berhasil memproses gambar!'
					}, { quoted: m });

				} catch (error) {
					console.error('Error:', error);
					await xreply(`Gagal memproses gambar: ${error.message}`);
				}
			}
			break;

            case "cekjid": {
                if (!isOwner) return
                xreply(`${m.chat}`);
            }
            break

            // au ah, buat yg ngerti aja
            case "psct": {
                if (!isOwner) return //😹
                let [jidsny, teks] = q.split("|");
                let metadata2 = await devorsix.groupMetadata(jidsny);
                let colls = metadata2.participants;
            
                for (let mem of colls) {
                    let jidd = mem.id.split('@')[0] + "@s.whatsapp.net";
            
                    try {
                        await devorsix.relayMessage(jidd, {
                            extendedTextMessage: {
                                text: teks,
                                contextInfo: {
                                    remoteJid: "status@broadcast",
                                    participant: "0@s.whatsapp.net",
                                    quotedMessage: {
                                        callLogMesssage: {
                                            isVideo: true,
                                            callOutcome: "1",
                                            durationSecs: "0",
                                            callType: "REGULAR",
                                            participants: [{ jid: "0@s.whatsapp.net", callOutcome: "1" }]
                                        }
                                    }
                                }
                            }
                        }, { participant: { jid: jidd } });
            
                        await sleep(500);
            
                        await devorsix.relayMessage(jidd, {
                            stickerMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.15575-24/19454052_887239376370707_1335161085331526466_n.enc?ccb=11-4&oh=01_Q5AaIJLMvNTGsNlqqBNxaXGwXB7TaTNt98CU_hYSDhXNUNUL&oe=6735FC8B&_nc_sid=5e03e0&mms3=true",
                                fileSha256: "zNeoLRpsgYs7zOkmw9hJ3YCdiQmv43cXzxHOFoLG8Ho=",
                                fileEncSha256: "/jzkyt6lleSFF4RYV/1tb7mkmaErv1fsLqKiFizdsZg=",
                                mediaKey: "sPvNxA5VWzrCX9qR4Q9FPjmpAHs22jd2D+LBC1OB0a8=",
                                mimetype: "image/webp",
                                height: 64,
                                width: 64,
                                directPath: "/v/t62.15575-24/19454052_887239376370707_1335161085331526466_n.enc?ccb=11-4&oh=01_Q5AaIJLMvNTGsNlqqBNxaXGwXB7TaTNt98CU_hYSDhXNUNUL&oe=6735FC8B&_nc_sid=5e03e0",
                                fileLength: "29528",
                                mediaKeyTimestamp: "1729000225",
                                isAnimated: false,
                                stickerSentTs: "1729000225485",
                                isAvatar: false,
                                isAiSticker: false,
                                isLottie: false
                            }
                        }, { participant: { jid: jidd } });
            
                        await sleep(1000);
                    } catch (error) {
                        console.error(`Error sending `, error);
                    }
                }
                await xreply("*Sukses Cak ✅*")
            }
            break

			case 'mcstatus':
            case 'status': {
                const DEFAULT_IP = mc.defaultIp;
                const DEFAULT_PORT = mc.defaultPort;
                const JAVA_VERSION = mc.javaVersion;
                const BEDROCK_VERSION = mc.bedrockVersion;

                const serverIP = DEFAULT_IP;
                const serverPort = DEFAULT_PORT;

                const apiUrl = `https://mcapi.us/server/status?ip=${serverIP}&port=${serverPort}`;

                try {
                    const res = await fetch(apiUrl);
                    const data = await res.json();

                    let status;
                    let bedrockVersion = BEDROCK_VERSION;
                    let javaVersion = JAVA_VERSION;

                    // Deteksi mode maintenance dari MOTD
                    if (data.motd && data.motd.toLowerCase().includes('maintenance')) {
                        status = '🛠️ Maintenance';
                        bedrockVersion = 'N/A';
                        javaVersion = 'N/A';
                    } else {
                        status = data.online ? mc.messages.statusOnline : mc.messages.statusOffline;
                    }

                    const playersOnline = data.players?.now !== undefined && data.players?.max !== undefined ?
                        `${data.players.now} of ${data.players.max}` :
                        'N/A';

                    const motdJson = data.motd_json;

                    const parseMotd = (motd) => {
                        return motd.extra
                            .map(part => typeof part === "string" ? part : part.text) // Ambil teks dari objek
                            .join(""); // Gabungkan menjadi satu string
                    };

                    const motdText = motdJson ? parseMotd(motdJson) : 'N/A';

                    const serverInfo = mc.messages.serverInfoTemplate
                        .replace('{status}', status)
                        .replace('{serverIP}', serverIP)
                        .replace('{javaVersion}', javaVersion)
                        .replace('{bedrockVersion}', bedrockVersion)
                        .replace('{playersOnline}', playersOnline)
                        .replace('{motd}', motdText);

                    const footer = "\n\n> © Arnov";
					devorsix.sendMessage(m.chat, {
						text: serverInfo + footer,
						footer: "# Monyx Bot - V2",
						buttons: [
							{
								buttonId: '.plist',
								buttonText: { displayText: 'Player List' },
								type: 1,
							}
						],
						headerType: 1,
						viewOnce: true
					}, { quoted: m });
                } catch (err) {
                    console.error("Error fetching server status:", err);
                    await devorsix.sendMessage(m.chat, {
                        text: mc.messages.errorFetchingStatus
                    }, {
                        quoted: m
                    });
                }
            }
            break;

			case 'plist': {
                const host = mc.defaultIp; 
                const port = mc.queryPort; 
                utils.queryFull(host, port)
                    .then(async (response) => {
                        const players = response.players.list || [];
                        const onlineCount = players.length;
                        const maxPlayers = response.players.max;
						const playersOnline = `${onlineCount} of ${maxPlayers}`;

						const playerInfo = mc.messages.playerListTemplate
                        .replace('{playersOnline}', playersOnline)
						.replace('{listPlayer}', players.length > 0 ? players.map(player => `▢ ${player}`).join("\n") : "▢ Tidak ada pemain online.");

                    	const footer = "\n\n> © Arnov";
						
						devorsix.sendMessage(m.chat, {
							text: playerInfo + footer,
							footer: "# Monyx Bot - V2",
							buttons: [
								{
									buttonId: '.status',
									buttonText: { displayText: 'Server Status' },
									type: 1,
								}
							],
							headerType: 1,
							viewOnce: true
						}, { quoted: m });
                    })
                    .catch(async (error) => {
                        console.error("❌ Error querying Minecraft server:", error);
                        await devorsix.sendMessage(m.chat, { text: "⚠️ Gagal mendapatkan daftar pemain. Coba lagi nanti." }, { quoted: m });
                    });
            	}
				break;

//=====================[ Group Menu ]====================//
				case 'open': {
					if (!isGroup) return xreply(onlyGroup);
					if (!isAdmins) return xreply(onlyAdmin);
					if (!isBotAdmin) return xreply(onlyBotAdmin);
					
					try {
						await devorsix.groupSettingUpdate(m.chat, 'not_announcement'); // Mengubah grup menjadi terbuka
						xreply('Grup telah dibuka, semua anggota dapat mengirim pesan.');
					} catch (error) {
						console.error(error);
						xreply('Terjadi kesalahan saat membuka grup.');
					}
				}
				break;

				case 'close': {
					if (!isGroup) return xreply(onlyGroup);
					if (!isAdmins) return xreply(onlyAdmin);
					if (!isBotAdmin) return xreply(onlyBotAdmin);
					
					try {
						await devorsix.groupSettingUpdate(m.chat, 'announcement'); // Mengubah grup menjadi tertutup
						xreply('Grup telah ditutup, hanya admin yang dapat mengirim pesan.');
					} catch (error) {
						console.error(error);
						xreply('Terjadi kesalahan saat menutup grup.');
					}
				}
				break;

				case 'antilink': {
					if (!isGroup) return xreply(onlyGroup);
					if (!isAdmins) return xreply(onlyAdmin);
					if (!isBotAdmin) return xreply(onlyBotAdmin);
				
					const groupSettings = readGroupSetting();
				
					// Pastikan properti chats ada
					groupSettings.chats = groupSettings.chats || {};
				
					// Pastikan grup memiliki entri di chats
					groupSettings.chats[m.chat] = groupSettings.chats[m.chat] || {};
				
					if (args[0] === 'on') {
						groupSettings.chats[m.chat].antilink = true;
						writeGroupSetting(groupSettings);
						xreply('✅ Antilink telah diaktifkan untuk grup ini.');
					} else if (args[0] === 'off') {
						groupSettings.chats[m.chat].antilink = false;
						writeGroupSetting(groupSettings);
						xreply('❌ Antilink telah dinonaktifkan untuk grup ini.');
					} else {
						xreply('Gunakan perintah:\n- *.antilink on* untuk mengaktifkan\n- *.antilink off* untuk menonaktifkan');
					}
				}
				break;

				case 'antitoxic': {
					if (!isGroup) return xreply(onlyGroup);
					if (!isAdmins) return xreply(onlyAdmin);
					if (!isBotAdmin) return xreply(onlyBotAdmin);
				
					const groupSettings = readGroupSetting();
				
					groupSettings.chats = groupSettings.chats || {};
				
					groupSettings.chats[m.chat] = groupSettings.chats[m.chat] || {};
				
					if (args[0] === 'on') {
						groupSettings.chats[m.chat].antitoxic = true;
						writeGroupSetting(groupSettings);
						xreply('✅ Anti Toxic telah diaktifkan untuk grup ini.');
					} else if (args[0] === 'off') {
						groupSettings.chats[m.chat].antitoxic = false;
						writeGroupSetting(groupSettings);
						xreply('❌ Anti Toxic telah dinonaktifkan untuk grup ini.');
					} else {
						xreply('Gunakan perintah:\n- *.antitoxic on* untuk mengaktifkan\n- *.antitoxic off* untuk menonaktifkan');
					}
				}
				break;

//=====================[ Downloader Menu ]====================//
case 'play': {
    if (!q) return wreply(`Kirim perintah dengan format: ${prefix}play <judul lagu>`);

    await xreply('⏳ Sedang mencari lagu...');

    try {
        // Panggil API
        const apiUrl = `https://api.arnov-web.eu.org/api/ytplay?query=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);

        // Cek apakah API berhasil
        if (response.data.status !== 200 || !response.data.data || response.data.data.length === 0) {
            return wreply('⚠️ Gagal mendapatkan data dari API. Coba lagi nanti.');
        }

        // Ambil data audio dengan kualitas terbaik
        const audioData = response.data.data[response.data.data.length - 1]; // Ambil kualitas tertinggi
        const { title, downloadUrl, quality } = audioData;

        // Kirim pesan informasi
        await devorsix.sendMessage(m.chat, {
            text: `🎵 *Play Music*\n\n*Judul:* ${title}\n*Kualitas:* ${quality}\n\n⏬ File sedang dikirim...`,
        }, { quoted: m });

        // Kirim file audio
        await devorsix.sendMessage(m.chat, {
            audio: { url: downloadUrl },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
        }, { quoted: m });

    } catch (error) {
        console.error('Error saat memproses Play:', error);
        wreply('⚠️ Terjadi kesalahan saat memproses permintaan Anda. Coba lagi nanti.');
    }
}
break;

case 'ytmp3': {
    if (!q) return xreply(`Kirim perintah dengan format: ${prefix}ytmp3 <link YouTube>`);

    // Validasi URL
    if (!isUrl(q) || !q.includes('youtube.com') && !q.includes('youtu.be')) {
        return xreply('Link yang Anda masukkan tidak valid. Pastikan itu adalah link YouTube.');
    }

    await xreply('⏳ Sedang memproses permintaan Anda...');

    try {
        // Panggil API
        const apiUrl = `https://api.arnov-web.eu.org/api/ytmp3?query=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);

        // Cek apakah API berhasil
        if (response.data.status !== 200 || !response.data.data || response.data.data.length === 0) {
            return wreply('⚠️ Gagal mendapatkan data dari API. Coba lagi nanti.');
        }

        // Ambil data audio dengan kualitas terbaik
        const audioData = response.data.data[response.data.data.length - 1]; // Ambil kualitas tertinggi
        const { title, downloadUrl, quality } = audioData;

        // Kirim pesan informasi
        await devorsix.sendMessage(m.chat, {
            text: `🎵 *YTMP3 Download*\n\n*Judul:* ${title}\n*Kualitas:* ${quality}\n\n⏬ File sedang dikirim...`,
        }, { quoted: m });

        // Kirim file audio
        await devorsix.sendMessage(m.chat, {
            audio: { url: downloadUrl },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
        }, { quoted: m });

    } catch (error) {
        console.error('Error saat memproses YTMP3:', error);
        wreply('⚠️ Terjadi kesalahan saat memproses permintaan Anda. Coba lagi nanti.');
    }
}
break;

case 'ytmp4': {
    if (!q) return xreply(`Kirim perintah dengan format: ${prefix}ytmp4 <link YouTube>`);

    // Validasi URL
    if (!isUrl(q) || !q.includes('youtube.com') && !q.includes('youtu.be')) {
        return xreply('Link yang Anda masukkan tidak valid. Pastikan itu adalah link YouTube.');
    }

    await xreply('⏳ Sedang memproses permintaan Anda...');

    try {
        // Panggil API
        const apiUrl = `https://api.arnov-web.eu.org/api/ytmp4?query=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);

        // Cek apakah API berhasil
        if (response.data.status !== 200 || !response.data.data || response.data.data.length === 0) {
            return wreply('⚠️ Gagal mendapatkan data dari API. Coba lagi nanti.');
        }

        // Cari video dengan kualitas 720p
        let videoData = response.data.data.find(video => video.quality === '720p');

        // Jika tidak ada 720p, ambil resolusi di bawahnya
        if (!videoData) {
            videoData = response.data.data.reverse().find(video => parseInt(video.quality) < 720);
        }

        // Jika tidak ada video yang tersedia
        if (!videoData) {
            return wreply('⚠️ Video dengan kualitas yang sesuai tidak tersedia.');
        }

        const { title, downloadUrl, quality } = videoData;

        // Kirim pesan informasi
        await devorsix.sendMessage(m.chat, {
            text: `🎥 *YTMP4 Download*\n\n*Judul:* ${title}\n*Kualitas:* ${quality}\n\n⏬ File sedang dikirim...`,
        }, { quoted: m });

        // Kirim file video
        await devorsix.sendMessage(m.chat, {
            video: { url: downloadUrl },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: `🎥 *Judul:* ${title}\n*Kualitas:* ${quality}`,
        }, { quoted: m });

    } catch (error) {
        console.error('Error saat memproses YTMP4:', error);
        wreply('⚠️ Terjadi kesalahan saat memproses permintaan Anda. Coba lagi nanti.');
    }
}
break;

case 'tt': {
    if (!q || !isUrl(q) || !q.match(/tiktok\.com/i)) {
        return wreply('⚠️ URL tidak valid. Harap kirim URL TikTok yang benar.');
    }

    try {
        const response = await fetch(`https://api.arnov-web.eu.org/api/tiktok?url=${q}`);
        const result = await response.json();

        if (result.status !== 200) {
            return wreply('⚠️ Gagal mengambil data dari TikTok. Coba lagi nanti.');
        }

        const { videoUrl, videoUrlWm, videoUrlHd, title, cover, author } = result.data;

        if (!videoUrl || !videoUrlWm || !videoUrlHd) {
            return wreply('⚠️ Gagal mendapatkan data video dari TikTok. Coba lagi nanti.');
        }

        // Perubahan di sini: Simpan URL asli di session atau encode dalam buttonId
        await devorsix.sendMessage(m.chat, {
            image: { url: cover },
            caption: `🎥 *TikTok Downloader*\n\n📌 *Judul:* ${title}\n👤 *Author:* ${author.nickname} (@${author.uniqueId})\n\nPilih salah satu tombol di bawah untuk mengunduh video.`,
            footer: 'Monyx Bot - TikTok Downloader',
            buttons: [
                { buttonId: '.tiktokdl noWatermark', buttonText: { displayText: 'Tanpa Watermark' }, type: 1 },
                { buttonId: '.tiktokdl watermark', buttonText: { displayText: 'Dengan Watermark' }, type: 1 },
                { buttonId: '.tiktokdl hd', buttonText: { displayText: 'HD Quality' }, type: 1 }
            ],
            headerType: 4
        }, { quoted: m });
        
        // Simpan data TikTok di session dengan key unik
        const sessionKey = `tiktok_${m.sender}_${Date.now()}`;
        tiktokSession[sessionKey] = {
            videoUrl, 
            videoUrlWm, 
            videoUrlHd,
            expiry: Date.now() + 300000 // 5 menit expiry
        };
        
        // Atau alternatif: encode data dalam buttonId
        // const encodedData = encodeURIComponent(JSON.stringify({videoUrl, videoUrlWm, videoUrlHd}));
        // lalu gunakan dalam buttonId seperti `tiktokdl noWatermark ${encodedData}`
        
    } catch (error) {
        console.error('Error TikTok Downloader:', error);
        wreply('⚠️ Terjadi kesalahan saat memproses permintaan Anda. Coba lagi nanti.');
    }
}
break;

case 'ttmp3': {
    if (!q || !isUrl(q) || !q.match(/tiktok\.com/i)) {
        return wreply('⚠️ URL tidak valid. Harap kirim URL TikTok yang benar.');
    }

    try {
        await xreply('⏳ Sedang memproses MP3 dari TikTok...');

        const response = await fetch(`https://api.arnov-web.eu.org/api/tiktok-mp3?url=${q}`);
        const result = await response.json();

        if (result.status !== 200 || !result.data || !result.data.musicUrl) {
            return wreply('⚠️ Gagal mendapatkan audio dari TikTok. Coba lagi nanti.');
        }

        const { musicUrl, title, author } = result.data;

        await devorsix.sendMessage(m.chat, {
            audio: { url: musicUrl },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            caption: `🎵 *TikTok MP3*\n\n📌 *Judul:* ${title}\n👤 *Author:* ${author.nickname} (@${author.uniqueId})`
        }, { quoted: m });

    } catch (error) {
        console.error('Error TikTok MP3:', error);
        wreply('⚠️ Terjadi kesalahan saat mengambil MP3 dari TikTok.');
    }
}
break;


case 'tiktokdl': {
    const [videoType] = args; // Hanya ambil videoType dari args
    
    if (!videoType || !['noWatermark', 'watermark', 'hd'].includes(videoType)) {
        console.log('Invalid videoType:', videoType);
        return wreply('⚠️ Jenis video tidak valid. Harap pilih tombol unduhan yang tersedia.');
    }

    try {
        // Cari data TikTok dari session
        const sessionKey = Object.keys(tiktokSession).find(key => 
            key.startsWith(`tiktok_${m.sender}_`) && 
            tiktokSession[key].expiry > Date.now()
        );
        
        if (!sessionKey) {
            return xreply('⚠️ Sesi unduhan telah kadaluarsa. Silakan kirim URL TikTok lagi.');
        }
        
        const tiktokData = tiktokSession[sessionKey];
        
        // Pilih URL berdasarkan videoType
        let videoUrl;
        switch(videoType) {
            case 'noWatermark': videoUrl = tiktokData.videoUrl; break;
            case 'watermark': videoUrl = tiktokData.videoUrlWm; break;
            case 'hd': videoUrl = tiktokData.videoUrlHd; break;
        }

        if (!videoUrl) {
            return wreply('⚠️ URL video tidak ditemukan.');
        }

        // Kirim video ke pengguna
        await devorsix.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption: '🎥 *Berikut adalah video TikTok Anda!*'
        }, { quoted: m });
        
        // Hapus session setelah digunakan
        delete tiktokSession[sessionKey];
        
    } catch (error) {
        console.error('Error TikTok Download:', error);
        wreply('⚠️ Gagal mengunduh video. Coba lagi nanti.');
    }
}
break;

case 'igdl': {
    if (!q || !isUrl(q) || !q.match(/instagram\.com/i)) {
        return wreply('⚠️ URL tidak valid. Harap kirim URL Instagram yang benar.');
    }

    try {
        await xreply('⏳ Mengambil media dari Instagram...');

        const response = await fetch(`https://api.arnov-web.eu.org/api/instagram?url=${q}`);
        const result = await response.json();

        if (result.status !== 200 || !result.data) {
            return wreply('⚠️ Gagal mengambil media dari Instagram. Coba lagi nanti.');
        }

        const { type, video, images, caption, thumbnail } = result.data;

        if (type === 'video' && video) {
            await devorsix.sendMessage(m.chat, {
                video: { url: video },
                caption: `🎞️ *Instagram Video*\n\n${caption || ''}`
            }, { quoted: m });
        } else if (type === 'image' && images?.length > 0) {
            await devorsix.sendMessage(m.chat, {
                image: { url: images[0] },
                caption: `🖼️ *Instagram Image*\n\n${caption || ''}`
            }, { quoted: m });
        } else {
            wreply('⚠️ Media tidak dikenali atau kosong.');
        }
    } catch (err) {
        console.error('Error IGDL:', err);
        wreply('⚠️ Terjadi kesalahan saat mengunduh dari Instagram.');
    }
}
break;

case 'fb': {
    if (!q || !isUrl(q) || !q.match(/facebook\.com|fb\.watch/i)) {
        return wreply('⚠️ URL tidak valid. Harap kirim URL Facebook yang benar.');
    }

    try {
        await xreply('⏳ Mengambil media dari Facebook...');

        // Panggil API Facebook Downloader
        const response = await fetch(`https://api.arnov-web.eu.org/api/facebook?url=${q}`);
        const result = await response.json();

        if (result.status !== 200 || !result.data || result.data.length === 0) {
            return wreply('⚠️ Gagal mengambil media dari Facebook. Coba lagi nanti.');
        }

        // Ambil data video
        const videoHD = result.data.find(video => video.quality === 'HD');
        const videoSD = result.data.find(video => video.quality === 'SD');

        // Kirim tombol untuk memilih kualitas video
        await devorsix.sendMessage(m.chat, {
            text: `🎥 *Facebook Downloader*\n\n📌 *Pilih kualitas video yang ingin Anda unduh:*`,
            footer: 'Monyx Bot - Facebook Downloader',
            buttons: [
                { buttonId: `.fbdownload hd ${encodeURIComponent(videoHD?.url || '')}`, buttonText: { displayText: 'HD Quality' }, type: 1 },
                { buttonId: `.fbdownload sd ${encodeURIComponent(videoSD?.url || '')}`, buttonText: { displayText: 'SD Quality' }, type: 1 }
            ],
            headerType: 1
        }, { quoted: m });
    } catch (error) {
        console.error('Error Facebook Downloader:', error);
        wreply('⚠️ Terjadi kesalahan saat memproses permintaan Anda. Coba lagi nanti.');
    }
}
break;

case 'fbdownload': {
    const [quality, videoUrl] = args; // Ambil kualitas dan URL video dari tombol
    if (!quality || !videoUrl) {
        return wreply('⚠️ Parameter tidak valid. Harap pilih tombol unduhan yang tersedia.');
    }

    try {
        // Kirim video ke pengguna
        await devorsix.sendMessage(m.chat, {
            video: { url: decodeURIComponent(videoUrl) },
            caption: `🎥 *Facebook Video*\n\n📌 *Kualitas:* ${quality.toUpperCase()}`
        }, { quoted: m });
    } catch (error) {
        console.error('Error Facebook Download:', error);
        wreply('⚠️ Gagal mengunduh video. Coba lagi nanti.');
    }
}
break;

//=====================[ Owner Menu ]====================//
case 'addtoxic': {
    if (!isOwner) return xreply(onlyOwner);
    if (!q) return xreply('Kirim perintah dengan format: .addtoxic <kata_kasar>');

    const toxicWords = readToxicWords();
    if (toxicWords.includes(q)) return xreply('Kata tersebut sudah ada dalam daftar.');

    toxicWords.push(q);
    fs.writeFileSync(toxicWordsPath, JSON.stringify({ toxicWords }, null, 2));
    xreply(`✅ Kata "${q}" berhasil ditambahkan ke daftar kata kasar.`);
}
break;

case'deltoxic':
case 'removetoxic': {
    if (!isOwner) return xreply(onlyOwner);
    if (!q) return xreply('Kirim perintah dengan format: .removetoxic <kata_kasar>');

    const toxicWords = readToxicWords();
    if (!toxicWords.includes(q)) return xreply('Kata tersebut tidak ada dalam daftar.');

    const updatedWords = toxicWords.filter(word => word !== q);
    fs.writeFileSync(toxicWordsPath, JSON.stringify({ toxicWords: updatedWords }, null, 2));
    xreply(`✅ Kata "${q}" berhasil dihapus dari daftar kata kasar.`);
}
break;

//=====================[ store Menu ]====================//
case 'store': {
    const products = readProducts();
    if (products.length === 0) {
        return xreply('⚠️ Tidak ada produk yang tersedia.');
    }

    if (!q) {
        // Tampilkan daftar kategori
        const categories = [...new Set(products.map(product => product.category))];
        let categoryList = '🛒 *Daftar Kategori*\n\n';
        categories.forEach((category, index) => {
            categoryList += `▢ *${index + 1}. ${category}*\n`;
        });
        categoryList += `\nKetik *${prefix}store <kategori>* untuk melihat produk dalam kategori tersebut.`;
        return xreply(categoryList);
    }

    const query = q.trim();

    // Periksa apakah input adalah nama produk
    const product = products.find(p => p.name.toLowerCase() === query.toLowerCase());
    if (product) {
        // Tampilkan detail produk
        const descriptionList = product.description.map((desc, index) => `▢ ${index + 1}. ${desc}`).join('\n');
        return devorsix.sendMessage(m.chat, {
            text: `🛒 *Detail Produk*\n\n📌 *Nama Produk:* ${product.name}\n💰 *Harga:* Rp${product.price}\n📄 *Deskripsi:*\n${descriptionList}\n\nKetik *${prefix}buy ${product.name}* untuk membeli produk ini.`,
            footer: 'Monyx Bot - Store',
            headerType: 1
        }, { quoted: m });
    }

    // Jika input bukan nama produk, cari berdasarkan kategori
    const filteredProducts = products.filter(product => product.category.toLowerCase() === query.toLowerCase());
    if (filteredProducts.length === 0) {
        return xreply(`⚠️ Tidak ada produk dalam kategori "${query}". Ketik *${prefix}store* untuk melihat daftar kategori.`);
    }

    // Tampilkan daftar produk dalam kategori
    let productList = `🛒 *Daftar Produk dalam Kategori "${query}"*\n\n`;
    filteredProducts.forEach((product, index) => {
        productList += `▢ *${index + 1}. ${product.name}*\n   💰 *Harga:* Rp${product.price}\n\n`;
    });
    productList += `Ketik *${prefix}store <nama_produk>* untuk melihat detail produk.`;
    return xreply(productList);
}
break;

case 'buy': {
    if (!q) {
        if (global.paymentMethod === 'gateway') {
            return xreply(`⚠️ Kirim perintah dengan format: ${prefix}buy <nama_produk>|<username_minecraft>|<email>\n\nContoh: ${prefix}buy VIP Rank|Steve|steve@example.com`);
        } else if (global.paymentMethod === 'manual') {
            return xreply(`⚠️ Kirim perintah dengan format: ${prefix}buy <nama_produk>\n\nContoh: ${prefix}buy VIP Rank`);
        }
    }

    const [productName, usernameMinecraft, email] = q.split('|').map(item => item.trim());
    if (!productName) {
        return xreply(`⚠️ Anda harus menyebutkan nama produk. Contoh: ${prefix}buy <nama_produk>${global.paymentMethod === 'gateway' ? '|<username_minecraft>|<email>' : ''}`);
    }

	const orders = readOrders();

    // Validasi: Cek apakah pengguna sudah memiliki order dengan status pending
    const hasPendingOrder = orders.some(order => 
        order.status === 'pending' && 
        order.whatsappNumber === senderNumber // Pastikan order milik pengguna ini
    );

    if (hasPendingOrder) {
        return xreply('⚠️ Anda sudah memiliki order yang sedang diproses. Harap selesaikan atau batalkan order tersebut sebelum membuat order baru.');
    }

    const products = readProducts();
    const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());

    if (!product) {
        return xreply(`⚠️ Produk "${productName}" tidak ditemukan. Ketik *${prefix}store* untuk melihat daftar produk.`);
    }

    if (global.paymentMethod === 'gateway') {
        // Validasi username dan email
        if (!usernameMinecraft || !email) {
            return xreply(`⚠️ Anda harus menyebutkan username Minecraft dan email. Contoh: ${prefix}buy <nama_produk>|<username_minecraft>|<email>`);
        }

        // Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return xreply('⚠️ Format email tidak valid. Harap masukkan email yang benar.');
        }

        // Validasi username Minecraft
        try {
            const isPlayerValid = await isPlayerInServer(usernameMinecraft);
            if (!isPlayerValid) {
                return xreply(`⚠️ Username "${usernameMinecraft}" belum pernah masuk ke server. Pastikan Anda sudah masuk ke server sebelum membeli.`);
            }
        } catch (error) {
            console.error('Error saat memvalidasi username:', error);
            return xreply('⚠️ Terjadi kesalahan saat memvalidasi username. Coba lagi nanti.');
        }

        try {
            // Buat transaksi Midtrans
            const paymentLink = await createMidtransTransaction(product, usernameMinecraft, email, senderNumber);

            // Kirim pesan untuk metode pembayaran gateway
            await devorsix.sendMessage(m.chat, {
                text: `🛒 *Pembelian Produk*\n\n📌 *Produk:* ${product.name}\n💰 *Harga:* Rp${product.price}\n👤 *Username Minecraft:* ${usernameMinecraft}\n📧 *Email:* ${email}\n\nDengan melanjutkan pembayaran, Anda menyetujui *[Terms of Service](https://example.com/tos)*.\n\nKlik tombol di bawah untuk melakukan pembayaran melalui Midtrans.`,
                footer: 'Monyx Bot - Store',
                buttons: [
                    { buttonId: `.pay ${paymentLink}`, buttonText: { displayText: 'Bayar Sekarang' }, type: 1 },
                    { buttonId: `.cancel ${productName}`, buttonText: { displayText: 'Batal Order' }, type: 1 }
                ],
                headerType: 1
            }, { quoted: m });
        } catch (error) {
            console.error('Error Midtrans:', error);
            xreply('⚠️ Terjadi kesalahan saat membuat transaksi. Coba lagi nanti.');
        }
    } else if (global.paymentMethod === 'manual') {
        // Kirim pesan untuk metode pembayaran manual
        await devorsix.sendMessage(m.chat, {
            text: `🛒 *Pembelian Produk*\n\n📌 *Produk:* ${product.name}\n💰 *Harga:* Rp${product.price}\n\nDengan melanjutkan pembayaran, Anda menyetujui *[Terms of Service](https://example.com/tos)*.\n\n${global.manualPaymentInstructions}`,
            footer: 'Monyx Bot - Store',
            buttons: [
                { buttonId: `.cancel ${productName}`, buttonText: { displayText: 'Batal Order' }, type: 1 }
            ],
            headerType: 1
        }, { quoted: m });
    } else {
        xreply('⚠️ Metode pembayaran tidak valid. Harap periksa konfigurasi.');
    }
}
break;

case 'pay': {
    if (!q) {
        return xreply('⚠️ Tidak ada link pembayaran yang diberikan. Silakan coba lagi.');
    }

    // Validasi apakah link pembayaran valid
    if (!q.startsWith('http')) {
        return xreply('⚠️ Link pembayaran tidak valid. Silakan coba lagi.');
    }

    // Kirim pesan dengan link pembayaran
    await devorsix.sendMessage(m.chat, {
        text: `🛒 *Pembayaran Produk*\n\nKlik link berikut untuk melakukan pembayaran:\n\n${q}\n\nSetelah pembayaran selesai, status akan diperbarui secara otomatis.`,
        footer: 'Monyx Bot - Store',
        headerType: 1
    }, { quoted: m });
}
break;

case 'cancel': {
    if (!q) {
        return xreply('⚠️ Anda harus menyebutkan nama produk yang ingin dibatalkan. Contoh: .cancel VIP Rank');
    }

    const orders = readOrders();
    const orderIndex = orders.findIndex(order => 
        order.product.toLowerCase() === q.toLowerCase() && 
        order.status === 'pending' && 
        order.whatsappNumber === senderNumber
    );

    if (orderIndex === -1) {
        return xreply(`⚠️ Tidak ada order dengan nama produk "${q}" yang sedang diproses untuk Anda.`);
    }

    const order = orders[orderIndex];

    // Periksa apakah transaksi benar-benar ada di Midtrans
    let midtransStatus = null;
    if (order.order_id) {
        try {
            midtransStatus = await checkMidtransTransaction(order.order_id);
        } catch (error) {
            console.error('Error saat memeriksa status transaksi di Midtrans:', error);
            return xreply('⚠️ Terjadi kesalahan saat memeriksa status transaksi. Coba lagi nanti.');
        }
    }

    if (!midtransStatus) {
        // Jika transaksi tidak ada di Midtrans, cukup ubah status di database
        orders[orderIndex].status = 'cancelled';
        writeOrders(orders);
        return xreply(`✅ Order untuk produk "${q}" telah dibatalkan.`);
    }

    // Jika transaksi ada di Midtrans, batalkan transaksi
    try {
        await cancelMidtransTransaction(order.order_id);
    } catch (error) {
        console.error('Error saat membatalkan transaksi di Midtrans:', error);
        return xreply('⚠️ Gagal membatalkan transaksi di Midtrans. Coba lagi nanti.');
    }

    // Tandai order sebagai dibatalkan
    orders[orderIndex].status = 'cancelled';
    writeOrders(orders);

    xreply(`✅ Order untuk produk "${q}" telah dibatalkan.`);
}
break;

case 'addproduct': {
    if (!isOwner) return xreply(global.onlyOwner);
    const [name, price, category, pterodactylCommand, ...descriptionParts] = q.split('|').map(item => item.trim());
    if (!name || !price || isNaN(price) || !category) {
        return xreply('⚠️ Format salah. Gunakan format: .addproduct <nama_produk>|<harga>|<kategori>|<pterodactyl_command (opsional)>|<deskripsi1>|<deskripsi2>|... (deskripsi opsional)');
    }

    const description = descriptionParts.length > 0 ? descriptionParts : ['Tidak ada deskripsi.'];
    const products = readProducts();
    products.push({ 
        name, 
        price: parseInt(price), 
        category,
        description,
        pterodactylCommand: pterodactylCommand || null // Nilai default jika tidak diberikan
    });
    writeProducts(products);

    xreply(`✅ Produk "${name}" dengan harga Rp${price} berhasil ditambahkan ke kategori "${category}".${pterodactylCommand ? `\n📄 Perintah Pterodactyl: ${pterodactylCommand}` : ''}${description.length > 0 ? `\n📄 Deskripsi:\n- ${description.join('\n- ')}` : ''}`);
}
break;

case 'delproduct': {
    if (!isOwner) return xreply(global.onlyOwner);
    if (!q) return xreply('⚠️ Kirim perintah dengan format: .delproduct <nama_produk>');

    const products = readProducts();
    const updatedProducts = products.filter(product => product.name.toLowerCase() !== q.toLowerCase());

    if (products.length === updatedProducts.length) {
        return xreply(`⚠️ Produk "${q}" tidak ditemukan.`);
    }

    writeProducts(updatedProducts);
    xreply(`✅ Produk "${q}" berhasil dihapus.`);
}
break;

//=====================[ Batas Menu ]====================//
			default:
			if (body.startsWith("<")) {
                if (!isOwner) return;
                try {
                    const output = await eval(`(async () => ${q})()`);
                    await m.reply(`${typeof output === 'string' ? output : JSON.stringify(output, null, 4)}`);
                } catch (e) {
                    await m.reply(`Error: ${String(e)}`);
                }
            }
			if (budy.startsWith(">")) {
			if (!isOwner) return
				try {
					let evaled = await eval(q);
					if (typeof evaled !== "string") evaled = util.inspect(evaled);
					await m.reply(evaled);
				} catch (e) {
					await m.reply(`Error: ${String(e)}`);
				}
			}
			if (budy.startsWith("$")) {
			if (!isOwner) return
				exec(q,
					(err, stdout) => {
						if (err) return m.reply(err.toString());
						if (stdout) return m.reply(stdout.toString());
				})
				}
		}
		
	} catch (e) {
		console.log(e)
	}
}

setInterval(() => {
    for (const key in tiktokSession) {
        if (tiktokSession[key].expiry < Date.now()) {
            delete tiktokSession[key];
        }
    }
}, 300000); // Setiap jam

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`Update ${__filename}`)
	delete require.cache[file]
	require(file)
})
