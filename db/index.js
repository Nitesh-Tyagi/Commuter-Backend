const sql = require('mssql');
const config = {
    user: 'nitesh',
    password: '1@m1r0nm@n',
    server: 'commuter.database.windows.net',
    database: 'Commuter DB',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

let pool;

const connectWithRetry = async (retryCount = 0) => {
    try {
        pool = await new sql.ConnectionPool(config).connect();
        console.log('Connected to Azure SQL DB');
        return pool;
    } catch (err) {
        console.log('Connection attempt failed:', err.code, '@ ', new Date().toISOString());
        if (retryCount < 5) { // retry 5 times
            console.log('Retrying connection...');
            await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3 seconds
            return connectWithRetry(retryCount + 1);
        } else {
            console.log('Failed to connect after retrying');
            throw err;
        }
    }
};

connectWithRetry();

module.exports = {
    sql, 
    getPool: () => pool
};
