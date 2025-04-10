const fs = require('fs');
const path = require('path');
const groupSettingPath = path.join(__dirname, '../database', 'groupSetting.json');
const toxicWordsPath = path.join(__dirname, '../database', 'toxicWords.json');
const productsPath = path.join(__dirname, '../database', 'products.json');

// Membaca data dari groupSetting.json
const readGroupSetting = () => {
    if (!fs.existsSync(groupSettingPath)) {
        fs.writeFileSync(groupSettingPath, JSON.stringify({ chats: {} }, null, 2));
    }
    const data = JSON.parse(fs.readFileSync(groupSettingPath, 'utf-8'));

    // Validasi struktur data
    if (!data.chats) {
        data.chats = {};
    }

    return data;
};

const readToxicWords = () => {
    if (!fs.existsSync(toxicWordsPath)) {
        fs.writeFileSync(toxicWordsPath, JSON.stringify({ toxicWords: [] }, null, 2));
    }
    const data = JSON.parse(fs.readFileSync(toxicWordsPath, 'utf-8'));
    return data.toxicWords || [];
};

// Menulis data ke groupSetting.json
const writeGroupSetting = (data) => {
    try {
        // Validasi struktur data
        if (!data.chats) {
            data.chats = {};
        }

        fs.writeFileSync(groupSettingPath, JSON.stringify(data, null, 2));
        console.log('Data berhasil disimpan ke groupSetting.json');
    } catch (error) {
        console.error('Gagal menyimpan data ke groupSetting.json:', error);
    }
};

// Membaca data dari products.json
const readProducts = () => {
    if (!fs.existsSync(productsPath)) {
        fs.writeFileSync(productsPath, JSON.stringify([])); // Inisialisasi file jika belum ada
    }
    return JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
};

// Menulis data ke products.json
const writeProducts = (products) => {
    try {
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        console.log('Data produk berhasil disimpan ke products.json');
    } catch (error) {
        console.error('Gagal menyimpan data ke products.json:', error);
    }
};

module.exports = {
    readGroupSetting,
    readToxicWords,
    toxicWordsPath,
    writeGroupSetting,
    readProducts,
    writeProducts,
    productsPath
};