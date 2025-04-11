const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost', // Ganti dengan host database Anda
    port: 3307, // Ganti dengan port database Anda
    user: 'rexu',      // Ganti dengan username database Anda
    password: 'Monyxdb#21', // Ganti dengan password database Anda
    database: 'luckperm' // Nama database LuckPerms
};

async function isPlayerInServer(username) {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM luckperms_players WHERE username = ?',
            [username]
        );
        return rows.length > 0; // Jika ada hasil, berarti pemain sudah pernah masuk
    } catch (error) {
        console.error('Error saat memeriksa database:', error);
        throw new Error('Gagal memeriksa database.');
    } finally {
        await connection.end();
    }
}

module.exports = {
    isPlayerInServer
};