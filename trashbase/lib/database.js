const fs = require('fs');
const path = require('path');
const groupSettingPath = path.join(__dirname, '../database', 'groupSetting.json');
const toxicWordsPath = path.join(__dirname, '../database', 'toxicWords.json');
const productsPath = path.join(__dirname, '../database', 'products.json');
const ordersPath = path.join(__dirname, '../database', 'orders.json');

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

// Membaca data dari orders.json
const readOrders = () => {
    if (!fs.existsSync(ordersPath)) {
        fs.writeFileSync(ordersPath, JSON.stringify([])); // Inisialisasi file jika belum ada
    }
    return JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
};

// Menulis data ke orders.json
const writeOrders = (orders) => {
    try {
        fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
        console.log('Data order berhasil disimpan ke orders.json');
    } catch (error) {
        console.error('Gagal menyimpan data ke orders.json:', error);
    }
};

module.exports = {
    readGroupSetting,
    readToxicWords,
    toxicWordsPath,
    writeGroupSetting,
    readProducts,
    writeProducts,
    productsPath,
    readOrders,
    writeOrders,
    ordersPath
};