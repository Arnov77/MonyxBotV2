const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { readProducts } = require('./trashbase/lib/database.js'); // Pastikan fungsi ini tersedia

const app = express();
app.use(bodyParser.json());

// Endpoint webhook Midtrans
app.post('/webhook/midtrans', async (req, res) => {
    const notification = req.body;

    try {
        // Validasi notifikasi dari Midtrans
        const { order_id, transaction_status } = notification;

        if (transaction_status === 'settlement') {
            console.log(`Pembayaran berhasil untuk Order ID: ${order_id}`);

            // Cari produk berdasarkan order_id
            const products = readProducts();
            const product = products.find(p => `order-${p.name.toLowerCase().replace(/\s+/g, '-')}` === order_id);

            if (!product) {
                console.error(`Produk untuk Order ID ${order_id} tidak ditemukan.`);
                return res.status(404).send('Produk tidak ditemukan.');
            }

            // Periksa apakah produk memiliki perintah Pterodactyl
            if (!product.pterodactylCommand) {
                console.log(`Produk "${product.name}" tidak memiliki perintah Pterodactyl.`);
                return res.status(200).send('Produk tidak memiliki perintah Pterodactyl.');
            }

            // Kirim perintah ke Pterodactyl
            const command = product.pterodactylCommand; // Ambil perintah dari database
            const pterodactylApiUrl = 'https://your-pterodactyl-panel.com/api/client/servers/<server-id>/command';
            const pterodactylApiKey = 'YOUR_PTERODACTYL_API_KEY'; // Ganti dengan API Key Pterodactyl Anda

            const response = await axios.post(
                pterodactylApiUrl,
                { command },
                {
                    headers: {
                        'Authorization': `Bearer ${pterodactylApiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(`Perintah berhasil dikirim ke Pterodactyl: ${response.data}`);
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Error pada webhook Midtrans:', error);
        res.status(500).send('Internal Server Error');
    }
});