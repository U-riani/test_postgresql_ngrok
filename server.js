require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function run() {
  try {
    console.log("Connected to DB...");

    // 1️⃣ Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(150)
      );
    `);
    console.log("Table ensured.");

    // 2️⃣ Insert data
    const insertResult = await pool.query(
      `INSERT INTO users (name, email)
       VALUES ($1, $2)
       RETURNING *`,
      ["Sandro", "gela@test.com"]
    );
    console.log("Inserted:", insertResult.rows);

    const userId = insertResult.rows[0].id;

    // 3️⃣ Read data
    const readResult = await pool.query(`SELECT * FROM users`);
    console.log("All users:", readResult.rows);

    // // 4️⃣ Update data
    // const updateResult = await pool.query(
    //   `UPDATE users
    //    SET name = $1
    //    WHERE id = $2
    //    RETURNING *`,
    //   ["Updated Lasha", userId]
    // );
    // console.log("Updated:", updateResult.rows);

    // // 5️⃣ Delete data
    // const deleteResult = await pool.query(
    //   `DELETE FROM users WHERE id = $1 RETURNING *`,
    //   [userId]
    // );
    // console.log("Deleted:", deleteResult.rows);

  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await pool.end();
    process.exit();
  }
}

run();