const midtransClient = require('midtrans-client');
const { midtrans } = global;

// Fungsi untuk membuat transaksi Midtrans
async function createMidtransTransaction(product, usernameMinecraft, email) {
    const snap = new midtransClient.Snap({
        isProduction: midtrans.isProduction,
        serverKey: midtrans.serverKey,
        clientKey: midtrans.clientKey
    });

    const transactionDetails = {
        transaction_details: {
            order_id: `order-${Date.now()}`, // ID unik untuk setiap transaksi
            gross_amount: product.price // Total harga produk
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
        return transaction.redirect_url; // Link pembayaran
    } catch (error) {
        console.error('Error Midtrans:', error);
        throw new Error('Gagal membuat transaksi. Coba lagi nanti.');
    }
}

module.exports = {
    createMidtransTransaction
};