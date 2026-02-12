import mysql from 'mysql2/promise'

// Parse DATABASE_URL or use individual variables
let connectionConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'jewelry_store',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}

// Parse DATABASE_URL if provided
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL)
    connectionConfig.host = url.hostname
    connectionConfig.user = url.username
    connectionConfig.password = url.password
    connectionConfig.database = url.pathname.slice(1) // Remove leading '/'
    if (url.port) {
      connectionConfig.port = parseInt(url.port)
    }
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error)
  }
}

// Create connection pool
const pool = mysql.createPool(connectionConfig)

export const db = pool

// Helper function to execute queries
export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Helper function to get connection (for transactions)
export async function getConnection() {
  return await pool.getConnection()
}

export default pool
