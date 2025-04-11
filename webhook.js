require('./config.js');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const { readOrders, writeOrders } = require('./trashbase/lib/database.js');
const { devorsix } = require('./index.js');

const app = express();
app.use(bodyParser.json());

// Webhook Midtrans
app.post('/webhook/midtrans', async (req, res) => {
    const notification = req.body;

    try {
        const { order_id, transaction_status } = notification;

        if (transaction_status !== 'settlement') {
            console.log(`[Webhook] Status transaksi bukan settlement: ${transaction_status}`);
            return res.status(200).send('Not settled. Ignored.');
        }

        console.log(`[Webhook] Pembayaran sukses untuk Order ID: ${order_id}`);

        // Baca data orders
        const orders = readOrders();
        const orderIndex = orders.findIndex(o => o.order_id === order_id);

        if (orderIndex === -1) {
            console.warn(`[Webhook] Order ID ${order_id} tidak ditemukan. Tapi dibalas OK supaya Midtrans gak error.`);
            return res.status(200).send('OK (Order tidak ditemukan)');
        }

        const order = orders[orderIndex];

        // Periksa apakah order sudah diproses
        if (order.status === 'success') {
            console.log(`[Webhook] Order ID ${order_id} sudah diproses sebelumnya.`);
            return res.status(200).send('Order sudah diproses.');
        }

        // Periksa apakah ada perintah untuk dijalankan
        if (!order.command) {
            console.log(`[Webhook] Order ID ${order_id} tidak memiliki perintah untuk dijalankan.`);
            return res.status(200).send('Tidak ada perintah untuk dijalankan.');
        }

        // Kirim perintah ke Pterodactyl
        const pterodactylApiUrl = `${global.pterodactylApiUrl}/api/client/servers/${global.serverId}/command`;
        const pterodactylApiKey = global.pterodactylApiKey;

        const response = await axios.post(
            pterodactylApiUrl,
            { command: order.command },
            {
                headers: {
                    'Authorization': `Bearer ${pterodactylApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        order.status = 'success';
        writeOrders(orders);

        console.log(`[Webhook] Perintah berhasil dikirim ke Pterodactyl untuk Order ID ${order_id}`);
        res.status(200).send('OK');
    } catch (error) {
        console.error('[Webhook] Terjadi kesalahan:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Opsional: health check
app.get('/webhook/test', (req, res) => {
    res.send('Webhook OK');
});

// Menjalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Webhook server listening on port ${PORT}`);
});
