const midtransClient = require('midtrans-client');
const { readOrders, writeOrders } = require('./database');
const { midtrans } = global;

const snap = new midtransClient.Snap({
    isProduction: global.midtrans.isProduction,
    serverKey: global.midtrans.serverKey,
    clientKey: global.midtrans.clientKey
});

// Fungsi untuk membuat transaksi Midtrans
async function createMidtransTransaction(product, usernameMinecraft, email, whatsappNumber) {

    const orderId = `order-${Date.now()}`;

    const transactionDetails = {
        transaction_details: {
            order_id: orderId,
            gross_amount: product.price
        },
        customer_details: {
            first_name: usernameMinecraft,
            email: email
        },
        item_details: [
            {
                id: product.name.toLowerCase().replace(/\s+/g, '-'),
                price: product.price,
                quantity: 1,
                name: product.name
            }
        ]
    };

    try {
        const transaction = await snap.createTransaction(transactionDetails);

        // Ganti placeholder {username} dengan usernameMinecraft
        const commandToExecute = product.pterodactylCommand
            ? product.pterodactylCommand.replace('{username}', usernameMinecraft)
            : null;

        // Simpan order ke orders.json
        const orders = readOrders();
        orders.push({
            order_id: orderId,
            product: product.name,
            usernameMinecraft,
            email,
            price: product.price,
            status: 'pending',
            whatsappNumber, // Simpan nomor WhatsApp pengguna
            command: commandToExecute // Perintah sudah diproses
        });
        writeOrders(orders);

        console.log('Order berhasil disimpan:', {
            order_id: orderId,
            product: product.name,
            usernameMinecraft,
            email,
            price: product.price,
            status: 'pending',
            whatsappNumber,
            command: commandToExecute
        });

        return transaction.redirect_url;
    } catch (error) {
        console.error('Error Midtrans:', error);
        throw new Error('Gagal membuat transaksi. Coba lagi nanti.');
    }
}

async function cancelMidtransTransaction(orderId) {

    try {
        const response = await snap.transaction.cancel(orderId);
        console.log('Transaksi berhasil dibatalkan di Midtrans:', response);
        return response;
    } catch (error) {
        console.error('Error saat membatalkan transaksi di Midtrans:', error);
        throw new Error('Gagal membatalkan transaksi di Midtrans.');
    }
}

async function checkMidtransTransaction(orderId) {
    try {
        const response = await snap.transaction.status(orderId);
        return response.transaction_status; // Mengembalikan status transaksi
    } catch (error) {
        if (error.ApiResponse && error.ApiResponse.status_code === '404') {
            return null; // Transaksi tidak ditemukan
        }
        console.error('Error saat memeriksa status transaksi di Midtrans:', error);
        throw new Error('Gagal memeriksa status transaksi di Midtrans.');
    }
}

module.exports = {
    createMidtransTransaction,
    cancelMidtransTransaction,
    checkMidtransTransaction
};